"""Migration 0005: optional ticket_url / registration_url on event_submissions.

Disposable local PostgreSQL only, never the Cloud DB. Builds on the existing
harness (has_role + editor MFA policies as they are live in production), then
applies the migration and checks: no backfill, http(s)-only constraint,
unchanged privileges and policies, MFA-gated editor writes, rollback.
Run: python3 scripts/security/test_action_urls.py
"""
import unittest

import test_editor_mfa as mfa

ROOT = mfa.base.Path(__file__).resolve().parents[2]
MIG = ROOT / 'drizzle/migrations/0005_event_submissions_action_urls.sql'
DOWN = ROOT / 'docs/migrations/0005_event_submissions_action_urls_down.sql'
SEED = '00000000-0000-0000-0000-0000000000aa'
ADMIN, MOD, USER = mfa.ADMIN, mfa.MOD, mfa.USER
STATES = mfa.STATES


class ActionUrlTests(mfa.EditorMfaTests):
    port = 55443
    test_full_lifecycle = None  # covered by test_editor_mfa.py

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Editor MFA (migration 0003) is live in production.
        cls.sql(mfa.UP.read_text().replace('<> 19', '<> 19 AND false'))

    def q(self, query):
        return self.sql(query).stdout.strip()

    def state(self):
        """Privileges and policies on event_submissions (must not change)."""
        return (
            self.q("SELECT string_agg(grantee||':'||privilege_type, ',' ORDER BY grantee, privilege_type) "
                   "FROM information_schema.role_table_grants WHERE table_name='event_submissions'"),
            self.q("SELECT count(*) FROM pg_attribute WHERE attrelid='public.event_submissions'::regclass "
                   "AND attacl IS NOT NULL"),
            self.q("SELECT string_agg(polname||':'||polcmd::text||':'||coalesce(pg_get_expr(polqual, polrelid),'')"
                   "||':'||coalesce(pg_get_expr(polwithcheck, polrelid),''), '|' ORDER BY polname) "
                   "FROM pg_policy WHERE polrelid='public.event_submissions'::regclass"),
            self.q("SELECT relrowsecurity FROM pg_class WHERE oid='public.event_submissions'::regclass"),
        )

    def set_link(self, col, value):
        return self.sql(f"UPDATE public.event_submissions SET {col} = {value} WHERE id = '{SEED}'",
                        allow_error=True)

    def test_migration(self):
        before = self.state()
        self.sql(MIG.read_text())

        # Columns exist, nullable, no default, existing rows untouched (no backfill).
        cols = self.q("SELECT string_agg(column_name||':'||is_nullable||':'||coalesce(column_default,'-'), ',' "
                      "ORDER BY column_name) FROM information_schema.columns "
                      "WHERE table_name='event_submissions' AND column_name IN ('ticket_url','registration_url')")
        self.assertEqual(cols, 'registration_url:YES:-,ticket_url:YES:-')
        self.assertEqual(self.q(f"SELECT coalesce(ticket_url,'NULL')||','||coalesce(registration_url,'NULL') "
                                f"FROM event_submissions WHERE id='{SEED}'"), 'NULL,NULL')

        # Same grants, no column ACLs, same policies, RLS still on.
        self.assertEqual(self.state(), before, 'privileges or policies changed')

        # Constraint: only http(s) URLs; applies to every write path, even the server.
        for col in ('ticket_url', 'registration_url'):
            for bad in ("'javascript:alert(1)'", "'data:text/html,<script>x</script>'", "'vbscript:x'",
                        "'/relative/path'", "'www.example.no'", "'https://localhost/x'", "'https://exa mple.no'",
                        "'ftp://example.no/f'", "'mailto:a@b.no'", "'https://' || repeat('a', 500) || '.no'"):
                with self.subTest(col=col, value=bad):
                    r = self.set_link(col, bad)
                    self.assertNotEqual(r.returncode, 0)
                    self.assertIn('check constraint', r.stderr)
            for good in ("'https://www.example.no/billett?id=1'", "'http://example.no'", "NULL",
                         "'HTTPS://Example.no/A#b'", "'https://xn--bjrli-mua.no/'"):
                with self.subTest(col=col, value=good):
                    self.assertEqual(self.set_link(col, good).returncode, 0)

        upd = (f"UPDATE public.event_submissions SET ticket_url='https://billett.example.no/', "
               f"registration_url='https://meld.example.no/' WHERE id='{SEED}' RETURNING 1")
        # Editors with current MFA can set the links; the same editors without
        # MFA, ordinary users and anonymous visitors cannot.
        self.assertTrue(self.ok(upd, STATES['mfa'](ADMIN)), 'admin with MFA')
        self.assertTrue(self.ok(upd, STATES['mfa'](MOD)), 'moderator with MFA')
        self.assertFalse(self.ok(upd, STATES['no_mfa'](ADMIN)), 'admin without MFA')
        self.assertFalse(self.ok(upd, STATES['no_mfa'](MOD)), 'moderator without MFA')
        self.assertFalse(self.ok(upd, STATES['mfa'](USER)), 'ordinary user')
        self.assertFalse(self.ok(upd.replace('RETURNING 1', 'RETURNING 1'), {'role': 'anon'}, 'anon'), 'anon')
        # Unpublished rows are not readable by the public (RLS unchanged).
        self.assertFalse(self.ok('SELECT ticket_url FROM public.event_submissions', {'role': 'anon'}, 'anon'))
        self.assertFalse(self.ok('SELECT ticket_url FROM public.event_submissions', STATES['mfa'](USER)))
        self.assertTrue(self.ok('SELECT ticket_url FROM public.event_submissions', STATES['mfa'](ADMIN)))

        # Rollback removes exactly what was added.
        self.sql(DOWN.read_text())
        self.assertEqual(self.q("SELECT count(*) FROM information_schema.columns WHERE table_name='event_submissions' "
                                "AND column_name IN ('ticket_url','registration_url')"), '0')
        self.assertEqual(self.state(), before, 'rollback did not restore privileges/policies')


if __name__ == '__main__':
    unittest.main()
