"""Fase 4: server-side editor MFA, role admin and last-admin guard.

Disposable local PostgreSQL only, never the Cloud DB.
Run: python3 scripts/security/test_editor_mfa.py
"""
import json
import subprocess
import threading
import time
import unittest

import test_has_role as base

PENDING = base.PENDING
UP = PENDING / '20261124_editor_mfa_up.sql'
DOWN = PENDING / '20261124_editor_mfa_down.sql'
FIXTURE = base.Path(__file__).with_name('editor_mfa_fixture.sql')
USER, MOD, ADMIN = base.USER, base.MOD, base.ADMIN
ADMIN2 = '00000000-0000-0000-0000-000000000005'
SID = '11111111-1111-1111-1111-111111111111'
OTHER_SID = '22222222-2222-2222-2222-222222222222'
NOW = int(time.time())


def claims(sub, amr=None, sid=SID):
    c = {'sub': sub, 'role': 'authenticated', 'session_id': sid}
    if amr is not None:
        c['amr'] = amr
    return c


def totp(age_s):
    return [{'method': 'password', 'timestamp': NOW - age_s}, {'method': 'totp', 'timestamp': NOW - age_s}]


# (state label) -> claims builder per subject
STATES = {
    'no_mfa': lambda s: claims(s, [{'method': 'password', 'timestamp': NOW}]),
    'mfa': lambda s: claims(s, totp(60)),
    'mfa_expired': lambda s: claims(s, totp(31 * 86400)),
    'amr_string_form': lambda s: claims(s, ['password', 'totp']),
    'amr_forged_type': lambda s: claims(s, {'method': 'totp', 'timestamp': NOW}),
    'no_session_claims': lambda s: {'sub': s, 'role': 'authenticated'},
}
WRITE_CHECKS = base.CHECKS
ADMIN_ONLY = base.ADMIN_ONLY


class EditorMfaTests(base.HasRoleTests):
    port = 55442

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.sql(base.UP.read_text())          # migration 1 is live in production
        cls.sql(FIXTURE.read_text())

    @classmethod
    def as_claims(cls, query, c, role='authenticated', allow_error=True):
        setc = f"SET LOCAL request.jwt.claims = '{json.dumps(c)}'; " if c is not None else ''
        return cls.sql(f'BEGIN; SET LOCAL ROLE {role}; {setc}{query}; ROLLBACK;', allow_error=allow_error)

    def ok(self, query, c, role='authenticated'):
        r = self.as_claims(query, c, role)
        return r.returncode == 0 and r.stdout.strip() != ''

    def matrix(self, state):
        out = {}
        for label, q in WRITE_CHECKS:
            for who, sub in (('user', USER), ('moderator', MOD), ('admin', ADMIN)):
                out[(label, who)] = self.ok(q, STATES[state](sub))
        return out

    def expected(self, state, enforced):
        exp = {}
        for label, _ in WRITE_CHECKS:
            for who in ('user', 'moderator', 'admin'):
                role_ok = who == 'admin' or (who == 'moderator' and label not in ADMIN_ONLY)
                exp[(label, who)] = role_ok and (not enforced or state == 'mfa')
        if enforced and state == 'mfa':
            # Removing your own role while you are the only admin is now refused.
            exp[('roles delete', 'admin')] = False
        return exp

    def test_full_lifecycle(self):
        # ---- before: role alone grants access (the confirmed gap)
        for state in STATES:
            with self.subTest(phase='before', state=state):
                self.assertEqual(self.matrix(state), self.expected(state, enforced=False))

        self.sql(UP.read_text().replace('<> 19', '<> 19 AND false'))  # fixture is not the live catalog
        # ---- after: role AND current-session MFA
        for state in STATES:
            with self.subTest(phase='after', state=state):
                self.assertEqual(self.matrix(state), self.expected(state, enforced=True))

        # own roles stay readable before MFA (login has no circular dependency)
        r = self.as_claims('SELECT role FROM user_roles', STATES['no_mfa'](ADMIN))
        self.assertEqual(r.stdout.split(), ['admin'])
        self.assertEqual(self.as_claims('SELECT public.has_current_editor_mfa()', STATES['no_mfa'](ADMIN)).stdout.strip(), 'f')
        # admin with MFA sees all roles; without MFA, and moderators, see only their own
        self.assertEqual(self.as_claims('SELECT count(*) FROM user_roles', STATES['mfa'](ADMIN)).stdout.strip(), '2')
        self.assertEqual(self.as_claims('SELECT count(*) FROM user_roles', STATES['mfa'](MOD)).stdout.strip(), '1')
        self.assertEqual(self.as_claims('SELECT count(*) FROM user_roles', STATES['no_mfa'](ADMIN)).stdout.strip(), '1')
        # admin without MFA cannot grant admin; moderator with MFA cannot either
        grant = f"INSERT INTO user_roles(user_id, role) VALUES ('{USER}','admin') RETURNING 1"
        self.assertFalse(self.ok(grant, STATES['no_mfa'](ADMIN)))
        self.assertFalse(self.ok(grant, STATES['mfa'](MOD)))
        self.assertTrue(self.ok(grant, STATES['mfa'](ADMIN)))
        # admin with MFA can revoke a moderator (existing DELETE policy now reachable)
        self.assertTrue(self.ok(f"DELETE FROM user_roles WHERE user_id='{MOD}' RETURNING 1", STATES['mfa'](ADMIN)))
        self.assertFalse(self.ok(f"DELETE FROM user_roles WHERE user_id='{ADMIN}' RETURNING 1", STATES['mfa'](MOD)))

        # session-bound email verification: valid only for its own session
        self.sql(f"INSERT INTO editor_mfa_verifications(user_id, session_id, method, expires_at) "
                 f"VALUES ('{ADMIN}', '{SID}', 'email', now() + interval '12 hours')")
        sel = 'SELECT 1 FROM contact_messages'
        self.assertTrue(self.ok(sel, claims(ADMIN, [], SID)), 'own session verification')
        self.assertFalse(self.ok(sel, claims(ADMIN, [], OTHER_SID)), 'MFA from another session')
        self.assertFalse(self.ok(sel, claims(ADMIN, [], 'not-a-uuid')), 'malformed session id')
        self.sql(f"UPDATE editor_mfa_verifications SET revoked_at = now() WHERE user_id='{ADMIN}'")
        self.assertFalse(self.ok(sel, claims(ADMIN, [], SID)), 'revoked verification')

        # MFA performed before a role change no longer counts
        self.sql(f"UPDATE editor_privilege_state SET roles_changed_at = now() WHERE user_id='{ADMIN}'")
        self.assertFalse(self.ok(sel, STATES['mfa'](ADMIN)), 'MFA older than role change')
        self.assertTrue(self.ok(sel, claims(ADMIN, totp(-600))), 'fresh MFA after role change')
        self.sql(f"UPDATE editor_privilege_state SET roles_changed_at = now() - interval '60 days' WHERE user_id='{ADMIN}'")
        # newly granted privileged role requires new MFA for that user
        self.sql(f"INSERT INTO user_roles(user_id, role) VALUES ('{MOD}','moderator')")
        self.assertFalse(self.ok('SELECT 1 FROM event_submissions', STATES['mfa'](MOD)), 'regrant needs new MFA')
        # removed role: MFA alone grants nothing
        self.sql(f"DELETE FROM user_roles WHERE user_id='{MOD}'")
        self.assertFalse(self.ok('SELECT 1 FROM event_submissions', claims(MOD, totp(-600))), 'role removed')
        self.sql(f"INSERT INTO user_roles(user_id, role) VALUES ('{MOD}','moderator');"
                 f"UPDATE editor_privilege_state SET roles_changed_at = now() - interval '60 days' WHERE user_id='{MOD}'")

        # anon and no-claims sessions
        self.assertNotEqual(self.as_claims("SELECT public.is_editor('admin')", {'role': 'anon'}, 'anon').returncode, 0)
        self.assertEqual(self.as_claims("SELECT public.is_editor('admin')", None).stdout.strip(), 'f')
        # trusted server bypasses RLS unchanged
        self.assertTrue(self.ok('SELECT 1 FROM contact_messages', {'role': 'service_role'}, 'service_role'))
        # public declared-path upload unchanged
        self.assertTrue(self.ok("INSERT INTO storage.objects(bucket_id,name) VALUES ('event-submissions','uploads/x/a.jpg') RETURNING 1",
                                {'role': 'anon'}, 'anon'))

        # function hardening
        acl = self.sql("SELECT proacl::text, prosecdef, proconfig::text FROM pg_proc WHERE proname='is_editor'").stdout
        self.assertNotIn('anon=X', acl); self.assertIn('authenticated=X', acl); self.assertIn('search_path=', acl); self.assertIn('|t|', acl)
        self.assertEqual(self.sql("SELECT has_function_privilege('anon','public.is_editor(public.app_role)','EXECUTE')").stdout.strip(), 'f')
        self.assertEqual(self.sql("SELECT has_function_privilege('authenticated','public.trg_user_roles_keep_last_admin()','EXECUTE')").stdout.strip(), 'f')
        # one evaluation per query, not per row (InitPlan)
        plan = self.as_claims('EXPLAIN SELECT 1 FROM event_submissions', STATES['mfa'](MOD)).stdout
        self.assertIn('InitPlan', plan)

        self.last_admin_cases()

        # ---- rollback restores the pre-change behaviour exactly
        self.sql(DOWN.read_text())
        for state in STATES:
            with self.subTest(phase='rollback', state=state):
                self.assertEqual(self.matrix(state), self.expected(state, enforced=False))
        self.assertEqual(self.sql("SELECT count(*) FROM pg_proc WHERE proname IN ('is_editor','trg_user_roles_keep_last_admin')").stdout.strip(), '0')

    def last_admin_cases(self):
        # Clean slate: the earlier grant gave USER admin; remove it via server.
        self.sql(f"DELETE FROM user_roles WHERE user_id='{USER}'")
        only = self.sql(f"DELETE FROM user_roles WHERE user_id='{ADMIN}' AND role='admin'", allow_error=True)
        self.assertNotEqual(only.returncode, 0); self.assertIn('last_admin', only.stderr)
        upd = self.sql(f"UPDATE user_roles SET role='user' WHERE user_id='{ADMIN}'", allow_error=True)
        self.assertIn('last_admin', upd.stderr)
        mv = self.sql(f"UPDATE user_roles SET user_id='{ADMIN2}' WHERE user_id='{ADMIN}'", allow_error=True)
        self.assertIn('last_admin', mv.stderr)
        # concurrent removal of two admins: exactly one must survive
        self.sql(f"INSERT INTO user_roles(user_id, role) VALUES ('{ADMIN2}','admin')")
        results = {}

        def remove(uid):
            results[uid] = self.sql(f"BEGIN; DELETE FROM user_roles WHERE user_id='{uid}' AND role='admin'; "
                                    f"SELECT pg_sleep(1); COMMIT;", allow_error=True).returncode
        ts = [threading.Thread(target=remove, args=(u,)) for u in (ADMIN, ADMIN2)]
        [t.start() for t in ts]; [t.join() for t in ts]
        self.assertEqual(sorted(bool(v) for v in results.values()), [False, True], results)
        self.assertEqual(self.sql("SELECT count(*) FROM user_roles WHERE role='admin'").stdout.strip(), '1')
        survivor = self.sql("SELECT user_id FROM user_roles WHERE role='admin'").stdout.strip()
        if survivor != ADMIN:
            self.sql(f"INSERT INTO user_roles(user_id, role) VALUES ('{ADMIN}','admin');"
                     f"DELETE FROM user_roles WHERE user_id='{ADMIN2}'")
        self.sql(f"UPDATE editor_privilege_state SET roles_changed_at = now() - interval '60 days'")


if __name__ == '__main__':
    unittest.main(verbosity=1)
