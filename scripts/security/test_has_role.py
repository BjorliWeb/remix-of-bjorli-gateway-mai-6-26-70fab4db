"""has_role self-only tests on disposable PostgreSQL, never the Cloud DB.

Run: python3 scripts/security/test_has_role.py
Every policy check runs before the change, after it, and after rollback;
results must be identical, while cross-user probing must stop after it.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
PENDING = ROOT / 'docs/security/pending'
UP = PENDING / '20261124_has_role_self_only_up.sql'
DOWN = PENDING / '20261124_has_role_self_only_down.sql'
PUBLIC_UP = PENDING / '20261124_public_access_up.sql'
FIXTURE = Path(__file__).with_name('has_role_fixture.sql')
USER, MOD, ADMIN = ('00000000-0000-0000-0000-000000000002',
                    '00000000-0000-0000-0000-000000000003',
                    '00000000-0000-0000-0000-000000000004')
ACTORS = {'user': ('authenticated', {'sub': USER, 'role': 'authenticated'}),
          'moderator': ('authenticated', {'sub': MOD, 'role': 'authenticated'}),
          'admin': ('authenticated', {'sub': ADMIN, 'role': 'authenticated'}),
          'server': ('service_role', {'role': 'service_role'}),
          'anon': ('anon', {'role': 'anon'}),
          # authenticated DB role with no request claims at all
          'no_jwt': ('authenticated', None)}
SEED = "'00000000-0000-0000-0000-0000000000aa'"
# 19 policies / 25 has_role calls, as (label, sql returning rows on success).
CHECKS = [
    ('alerts delete', f'DELETE FROM alerts WHERE id={SEED} RETURNING 1'),
    ('alerts insert', "INSERT INTO alerts(note) VALUES ('x') RETURNING 1"),
    ('alerts update', f"UPDATE alerts SET note='y' WHERE id={SEED} RETURNING 1"),
    ('contact select', 'SELECT 1 FROM contact_messages'),
    ('events delete', f'DELETE FROM event_submissions WHERE id={SEED} RETURNING 1'),
    ('events select', 'SELECT 1 FROM event_submissions'),
    ('events update', f"UPDATE event_submissions SET note='y' WHERE id={SEED} RETURNING 1"),
    ('opstatus delete', f'DELETE FROM operational_status WHERE id={SEED} RETURNING 1'),
    ('opstatus insert', "INSERT INTO operational_status(note) VALUES ('x') RETURNING 1"),
    ('opstatus update', f"UPDATE operational_status SET note='y' WHERE id={SEED} RETURNING 1"),
    ('seo insert', "INSERT INTO seo_meta(note) VALUES ('x') RETURNING 1"),
    ('seo update', f"UPDATE seo_meta SET note='y' WHERE id={SEED} RETURNING 1"),
    ('services insert', "INSERT INTO services(note) VALUES ('x') RETURNING 1"),
    ('services update', f"UPDATE services SET note='y' WHERE id={SEED} RETURNING 1"),
    # Own row only: user_roles SELECT is own-rows, so admins see no others (unchanged live behaviour).
    ('roles delete', "DELETE FROM user_roles WHERE user_id = auth.uid() RETURNING 1"),
    ('roles insert', f"INSERT INTO user_roles(user_id, role) VALUES ('{USER}','user') RETURNING 1"),
    ('storage delete', "DELETE FROM storage.objects RETURNING 1"),
    ('storage select', "SELECT 1 FROM storage.objects"),
    ('storage upload', "INSERT INTO storage.objects(bucket_id,name) VALUES "
                       "('event-submissions','editor/00000000-0000-0000-0000-0000000000aa/b.jpg') RETURNING 1"),
]
ADMIN_ONLY = {c[0] for c in CHECKS if not c[0].startswith(('events', 'storage'))}


class HasRoleTests(unittest.TestCase):
    port = 55441

    @classmethod
    def setUpClass(cls):
        for tool in ('initdb', 'pg_ctl', 'psql'):
            if not shutil.which(tool):
                raise RuntimeError(f'{tool} missing: isolated tests cannot run')
        cls.tmp = Path(tempfile.mkdtemp(prefix='bjorli-hasrole-'))
        cls.socket = cls.tmp / 'socket'
        cls.socket.mkdir()
        root = os.getuid() == 0
        cls.uid, cls.gid = (1000, 1000) if root else (os.getuid(), os.getgid())
        if root:
            os.chown(cls.tmp, cls.uid, cls.gid)
            os.chown(cls.socket, cls.uid, cls.gid)
        cls.env = {'PATH': os.defpath + ':' + os.environ.get('PATH', ''),
                   'HOME': str(cls.tmp), 'LC_ALL': 'C'}
        data = str(cls.tmp / 'data')
        cls.run_server(['initdb', '-D', data, '-U', 'postgres', '--auth=trust', '--no-locale'])
        cls.run_server(['pg_ctl', '-D', data, '-l', str(cls.tmp / 'log'), '-o',
                        f"-k {cls.socket} -p {cls.port} -c listen_addresses=''", '-w', 'start'])
        cls.addClassCleanup(lambda: (cls.run_server(['pg_ctl', '-D', data, '-m', 'fast', '-w', 'stop']),
                                     shutil.rmtree(cls.tmp)))
        cls.sql('CREATE DATABASE t', db='postgres')
        cls.sql(FIXTURE.read_text())

    @classmethod
    def run_server(cls, args):
        def drop():
            if os.getuid() == 0:
                os.setgroups([]); os.setgid(cls.gid); os.setuid(cls.uid)
        subprocess.run(args, env=cls.env, preexec_fn=drop, check=True, capture_output=True, timeout=40)

    @classmethod
    def sql(cls, query, actor=None, db='t', allow_error=False):
        if actor:
            role, claims = ACTORS[actor]
            setc = f"SET LOCAL request.jwt.claims = '{json.dumps(claims)}'; " if claims else ''
            query = f'BEGIN; SET LOCAL ROLE {role}; {setc}{query}; ROLLBACK;'
        r = subprocess.run(['psql', '-X', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-h', str(cls.socket),
                            '-p', str(cls.port), '-U', 'postgres', '-d', db],
                           input=query, env=cls.env, text=True, capture_output=True, timeout=20)
        if r.returncode and not allow_error:
            raise AssertionError(r.stderr)
        return r

    def matrix(self):
        out = {}
        for label, q in CHECKS:
            for actor in ('user', 'moderator', 'admin', 'no_jwt'):
                r = self.sql(q, actor, allow_error=True)
                out[(label, actor)] = r.returncode == 0 and r.stdout.strip() != ''
        return out

    def probe(self, actor, target, role):
        r = self.sql(f"SELECT public.has_role('{target}', '{role}')", actor, allow_error=True)
        return r.stdout.strip() if r.returncode == 0 else 'denied'

    def test_full_lifecycle(self):
        before = self.matrix()
        # Expected authorised behaviour, independent of implementation.
        for label, _ in CHECKS:
            for actor in ('user', 'moderator', 'admin', 'no_jwt'):
                allowed = actor == 'admin' or (actor == 'moderator' and label not in ADMIN_ONLY)
                with self.subTest(phase='before', label=label, actor=actor):
                    self.assertEqual(before[(label, actor)], allowed)
        self.assertEqual(self.probe('user', ADMIN, 'admin'), 't')  # the vulnerability

        self.sql(UP.read_text())
        self.assertEqual(self.matrix(), before, 'authorised policy behaviour changed')
        cases = [('user', ADMIN, 'admin', 'f'), ('user', MOD, 'moderator', 'f'),
                 ('moderator', ADMIN, 'admin', 'f'), ('admin', MOD, 'moderator', 'f'),
                 ('admin', ADMIN, 'admin', 't'), ('moderator', MOD, 'moderator', 't'),
                 ('user', USER, 'admin', 'f'), ('no_jwt', ADMIN, 'admin', 'f'),
                 ('server', ADMIN, 'admin', 't'), ('server', MOD, 'moderator', 't'),
                 ('anon', ADMIN, 'admin', 'denied')]
        for actor, target, role, want in cases:
            with self.subTest(phase='after', actor=actor, target=target):
                self.assertEqual(self.probe(actor, target, role), want)
        # Forged role claim inside an authenticated session: PostgREST signs
        # claims, so this only proves the check reads the claim, not trust.
        acl = self.sql("SELECT proacl::text, prosecdef, proconfig::text FROM pg_proc WHERE proname='has_role'").stdout
        self.assertIn('authenticated=X', acl); self.assertNotIn('=X/postgres,=X', acl)
        self.assertNotIn('anon=X', acl); self.assertIn('search_path=public', acl)
        self.assertEqual(self.sql("SELECT has_function_privilege('anon','public.has_role(uuid,public.app_role)','EXECUTE')").stdout.strip(), 'f')
        self.assertEqual(self.sql("SELECT count(*) FROM user_roles").stdout.strip(), '2', 'roles changed')

        # Coordination with the pending public-access migration (services admin read).
        with self.subTest('combined with public access migration'):
            self.sql("CREATE TABLE public.weather_snapshot(kind text PRIMARY KEY);"
                     "ALTER TABLE public.weather_snapshot ENABLE ROW LEVEL SECURITY;"
                     "CREATE POLICY \"Anyone can read the stored forecast\" ON public.weather_snapshot FOR SELECT TO public USING (true);"
                     "ALTER TABLE public.services ADD COLUMN is_active boolean NOT NULL DEFAULT true;"
                     "INSERT INTO public.services(note, is_active) VALUES ('inactive', false);"
                     "DROP POLICY t_read ON public.services;"
                     "CREATE POLICY \"Anyone can read active services\" ON public.services FOR SELECT TO public USING (true);"
                     "CREATE POLICY \"Anyone can read SEO meta\" ON public.seo_meta FOR SELECT TO public USING (true);"
                     "DROP POLICY t_read ON public.seo_meta;")
            self.sql(PUBLIC_UP.read_text())
            self.assertEqual(self.sql('SELECT count(*) FROM services WHERE NOT is_active', 'admin').stdout.strip(), '1')
            self.assertEqual(self.sql('SELECT count(*) FROM services WHERE NOT is_active', 'user').stdout.strip(), '0')
            self.assertEqual(self.sql('SELECT count(*) FROM services WHERE NOT is_active', 'moderator').stdout.strip(), '0')

        self.sql(DOWN.read_text())
        self.assertEqual(self.probe('user', ADMIN, 'admin'), 't', 'rollback did not restore old body')


if __name__ == '__main__':
    unittest.main(verbosity=2)
