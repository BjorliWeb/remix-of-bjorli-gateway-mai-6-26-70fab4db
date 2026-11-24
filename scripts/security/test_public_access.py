"""Real RLS tests on disposable PostgreSQL 17, never the configured Cloud DB.

Run: python3 scripts/security/test_public_access.py
Requires installed initdb/pg_ctl/psql; no new dependency, network or Cloud secrets.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
UP = ROOT / 'docs/security/pending/20261124_public_access_up.sql'
DOWN = ROOT / 'docs/security/pending/20261124_public_access_down.sql'
FIXTURE = Path(__file__).with_name('public_access_fixture.sql')
TABLES = ('weather_snapshot', 'seo_meta', 'services')
ACTORS = {
    'anon': ('anon', ''),
    'user': ('authenticated', '00000000-0000-0000-0000-000000000002'),
    'moderator': ('authenticated', '00000000-0000-0000-0000-000000000003'),
    'admin': ('authenticated', '00000000-0000-0000-0000-000000000004'),
    'server': ('service_role', ''),
}


class PublicAccessTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        for tool in ('initdb', 'pg_ctl', 'psql'):
            if not shutil.which(tool):
                raise RuntimeError(f'{tool} missing: isolated tests cannot run')
        cls.tmp = Path(tempfile.mkdtemp(prefix='bjorli-security-'))
        cls.data = cls.tmp / 'data'
        cls.socket = cls.tmp / 'socket'
        cls.socket.mkdir()
        # initdb refuses root. Use the sandbox's existing unprivileged uid.
        cls.uid = 1000 if os.getuid() == 0 else os.getuid()
        cls.gid = 1000 if os.getuid() == 0 else os.getgid()
        if os.getuid() == 0:
            os.chown(cls.tmp, cls.uid, cls.gid)
            os.chown(cls.socket, cls.uid, cls.gid)
        cls.env = {'PATH': os.defpath + ':' + os.environ.get('PATH', ''),
                   'HOME': str(cls.tmp), 'LC_ALL': 'C'}
        def drop_privileges():
            if os.getuid() == 0:
                os.setgroups([])
                os.setgid(cls.gid)
                os.setuid(cls.uid)
        cls.drop_privileges = staticmethod(drop_privileges)
        cls.server_command(['initdb', '-D', str(cls.data), '-U', 'postgres',
                            '--auth=trust', '--no-locale'])
        cls.server_command(['pg_ctl', '-D', str(cls.data), '-l', str(cls.tmp / 'server.log'),
                            '-o', f"-k {cls.socket} -p 55439 -c listen_addresses=''", '-w', 'start'])
        cls.addClassCleanup(cls.stop_server)
        cls.sql('CREATE DATABASE security_test', database='postgres')
        cls.sql(FIXTURE.read_text())
        cls.before = cls.snapshot()
        cls.sql(UP.read_text())

    @classmethod
    def server_command(cls, args):
        return subprocess.run(args, env=cls.env, preexec_fn=cls.drop_privileges,
                              check=True, capture_output=True, text=True, timeout=40)

    @classmethod
    def stop_server(cls):
        cls.server_command(['pg_ctl', '-D', str(cls.data), '-m', 'fast', '-w', 'stop'])
        shutil.rmtree(cls.tmp)

    @classmethod
    def sql(cls, query, actor=None, database='security_test', allow_error=False):
        if actor:
            role, uid = ACTORS[actor]
            query = (f"BEGIN; SET LOCAL ROLE {role}; "
                     f"SET LOCAL request.jwt.claim.sub = '{uid}'; " + query + '; ROLLBACK;')
        args = ['psql', '-X', '-q', '-A', '-t', '-v', 'ON_ERROR_STOP=1',
                '-h', str(cls.socket), '-p', '55439', '-U', 'postgres', '-d', database]
        result = subprocess.run(args, input=query, env=cls.env, text=True,
                                capture_output=True, timeout=20)
        if result.returncode and not allow_error:
            raise AssertionError(result.stderr)
        return result

    @classmethod
    def scalar(cls, query, actor=None):
        return cls.sql(query, actor).stdout.strip()

    @classmethod
    def snapshot(cls):
        return cls.scalar("""
          SELECT jsonb_build_object(
            'tables', (SELECT jsonb_agg(jsonb_build_object('name', c.relname,
              'acl', (SELECT jsonb_agg(a::text ORDER BY a::text) FROM unnest(c.relacl) a), 'rls', c.relrowsecurity,
              'comment', obj_description(c.oid, 'pg_class')) ORDER BY c.relname)
              FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
              WHERE n.nspname='public' AND c.relname IN ('weather_snapshot','seo_meta','services','user_roles')),
            'policies', (SELECT jsonb_agg(to_jsonb(p) ORDER BY tablename, policyname)
              FROM pg_policies p WHERE schemaname='public'),
            'defaults', (SELECT jsonb_agg(to_jsonb(d)) FROM pg_default_acl d),
            'counts', jsonb_build_array((SELECT count(*) FROM weather_snapshot),
              (SELECT count(*) FROM seo_meta),(SELECT count(*) FROM services)))::text
        """)

    def test_01_read_matrix(self):
        expected = {
            'weather_snapshot': {'anon': None, 'user': None, 'moderator': None, 'admin': None, 'server': 1},
            'seo_meta': dict.fromkeys(ACTORS, 1),
            'services': {'anon': 1, 'user': 1, 'moderator': 1, 'admin': 2, 'server': 2},
        }
        for table in TABLES:
            for actor in ACTORS:
                with self.subTest(table=table, actor=actor):
                    result = self.sql(f'SELECT count(*) FROM public.{table}', actor, allow_error=True)
                    count = expected[table][actor]
                    if count is None:
                        self.assertNotEqual(result.returncode, 0)
                        self.assertIn('permission denied', result.stderr)
                    else:
                        self.assertEqual(result.returncode, 0, result.stderr)
                        self.assertEqual(result.stdout.strip(), str(count))

    def test_02_insert_matrix(self):
        values = {'weather_snapshot': "(kind) VALUES ('write-test')",
                  'seo_meta': "(page_slug,title) VALUES ('write-test','test')",
                  'services': "(name,slug) VALUES ('test','write-test')"}
        for table in TABLES:
            for actor in ACTORS:
                with self.subTest(table=table, actor=actor):
                    allowed = actor == 'server' or (actor == 'admin' and table != 'weather_snapshot')
                    result = self.sql(f'INSERT INTO public.{table} {values[table]} RETURNING 1', actor, allow_error=True)
                    self.assertEqual(result.returncode == 0, allowed, result.stderr)
                    if allowed:
                        self.assertEqual(result.stdout.strip(), '1')

    def test_03_update_matrix(self):
        changes = {'weather_snapshot': "last_error='CHANGED_TEST_ONLY'",
                   'seo_meta': "title='CHANGED_TEST_ONLY'",
                   'services': "description='CHANGED_TEST_ONLY'"}
        for table in TABLES:
            for actor in ACTORS:
                with self.subTest(table=table, actor=actor):
                    result = self.sql(f'UPDATE public.{table} SET {changes[table]} RETURNING 1', actor, allow_error=True)
                    allowed = actor == 'server' or (actor == 'admin' and table != 'weather_snapshot')
                    if allowed:
                        self.assertEqual(result.returncode, 0, result.stderr)
                        self.assertGreater(len(result.stdout.strip()), 0)
                    else:
                        # RLS UPDATE may return zero rows, not an HTTP/error denial.
                        self.assertTrue(result.returncode != 0 or result.stdout.strip() == '')

    def test_04_delete_matrix(self):
        for table in TABLES:
            for actor in ACTORS:
                with self.subTest(table=table, actor=actor):
                    result = self.sql(f'DELETE FROM public.{table} RETURNING 1', actor, allow_error=True)
                    self.assertEqual(result.returncode == 0, actor == 'server', result.stderr)
                    if actor == 'server':
                        self.assertGreater(len(result.stdout.strip()), 0)

    def test_05_public_internal_fields_unreadable(self):
        for actor in ('anon', 'user', 'moderator', 'admin'):
            for field in ('last_error', 'error_count', 'locked_at', 'payload'):
                with self.subTest(actor=actor, field=field):
                    result = self.sql(f'SELECT {field} FROM weather_snapshot', actor, allow_error=True)
                    self.assertNotEqual(result.returncode, 0)

    def test_06_service_active_boundary_and_admin_edit(self):
        for actor in ('anon', 'user', 'moderator'):
            self.assertEqual(self.scalar("SELECT count(*) FROM services WHERE NOT is_active", actor), '0')
        self.assertEqual(self.scalar("SELECT count(*) FROM services WHERE NOT is_active", 'admin'), '1')
        self.assertEqual(self.scalar("UPDATE services SET name='edited' WHERE NOT is_active RETURNING slug", 'admin'), 'test-inactive')
        self.assertEqual(self.scalar("UPDATE services SET is_active=false WHERE is_active RETURNING slug", 'admin'), 'test-active')

    def test_07_grants_least_privilege(self):
        for table in TABLES:
            for role in ('anon', 'authenticated'):
                for privilege in ('DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN'):
                    with self.subTest(table=table, role=role, privilege=privilege):
                        self.assertEqual(self.scalar(f"SELECT has_table_privilege('{role}','public.{table}','{privilege}')"), 'f')
                for privilege in ('SELECT', 'INSERT', 'UPDATE'):
                    expected = table != 'weather_snapshot' and (role == 'authenticated' or privilege == 'SELECT')
                    self.assertEqual(self.scalar(f"SELECT has_table_privilege('{role}','public.{table}','{privilege}')"), 't' if expected else 'f')
            self.assertEqual(self.scalar(f"SELECT has_table_privilege('service_role','public.{table}','TRUNCATE')"), 't')

    def test_08_truncate_denied_in_disposable_db(self):
        for table in TABLES:
            for actor in ('anon', 'user', 'moderator', 'admin'):
                with self.subTest(table=table, actor=actor):
                    result = self.sql(f'TRUNCATE public.{table}', actor, allow_error=True)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn('permission denied', result.stderr)

    def test_09_seo_publication_comment(self):
        self.assertIn('only public, published', self.scalar("SELECT obj_description('public.seo_meta'::regclass,'pg_class')"))
        for actor in ACTORS:
            self.assertEqual(self.scalar('SELECT title FROM seo_meta', actor), 'Published metadata')

    def test_10_unrelated_tables_defaults_and_server_unchanged(self):
        before, after = json.loads(self.before), json.loads(self.snapshot())
        self.assertEqual(before['defaults'], after['defaults'])
        self.assertEqual(before['counts'], after['counts'])
        self.assertEqual(next(t for t in before['tables'] if t['name'] == 'user_roles'),
                         next(t for t in after['tables'] if t['name'] == 'user_roles'))
        for old, new in zip(before['tables'], after['tables']):
            self.assertEqual(old['rls'], new['rls'])
            self.assertEqual([x for x in old['acl'] if 'service_role=' in x],
                             [x for x in new['acl'] if 'service_role=' in x])

    def test_11_duplicate_apply_fails_without_side_effects(self):
        before = self.snapshot()
        result = self.sql(UP.read_text(), allow_error=True)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('baseline changed', result.stderr)
        self.assertEqual(before, self.snapshot())

    def test_12_rollback_exact_and_reapply(self):
        self.sql(DOWN.read_text())
        self.assertEqual(json.loads(self.before), json.loads(self.snapshot()))
        self.sql(UP.read_text())
        self.assertEqual(self.scalar('SELECT count(*) FROM services', 'anon'), '1')


if __name__ == '__main__':
    unittest.main(verbosity=2)