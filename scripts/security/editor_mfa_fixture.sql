-- Synthetic, disposable local database only. Applied after has_role_fixture.sql
-- and migration 1. Mirrors the live MFA objects (exact function bodies).
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE public.editor_privilege_state (user_id uuid PRIMARY KEY, roles_changed_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.editor_mfa_verifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL,
  session_id uuid NOT NULL, method text NOT NULL, verified_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL, revoked_at timestamptz);
ALTER TABLE public.editor_privilege_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editor_mfa_verifications ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_current_editor_mfa()
 RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $function$
  with f as (
    select greatest(now() - interval '30 days',
             coalesce((select s.roles_changed_at from public.editor_privilege_state s where s.user_id = auth.uid()),
                      '-infinity'::timestamptz)) as min_verified_at)
  select
    coalesce((select max(to_timestamp((e ->> 'timestamp')::double precision))
              from jsonb_array_elements(case when jsonb_typeof(auth.jwt() -> 'amr') = 'array'
                                             then auth.jwt() -> 'amr' else '[]'::jsonb end) as e
              where e ->> 'method' = 'totp') > (select min_verified_at from f), false)
    or exists (select 1 from public.editor_mfa_verifications v
               where v.user_id = auth.uid() and v.session_id::text = auth.jwt() ->> 'session_id'
                 and v.revoked_at is null and v.expires_at > now()
                 and v.verified_at > (select min_verified_at from f));
$function$;
REVOKE ALL ON FUNCTION public.has_current_editor_mfa() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_current_editor_mfa() TO authenticated, service_role;
CREATE OR REPLACE FUNCTION public.trg_user_roles_touch_privilege_state()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
begin
  insert into public.editor_privilege_state (user_id, roles_changed_at)
  values (coalesce(new.user_id, old.user_id), now())
  on conflict (user_id) do update set roles_changed_at = now();
  return null;
end;
$function$;
CREATE TRIGGER user_roles_privilege_change AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.trg_user_roles_touch_privilege_state();
GRANT UPDATE ON public.user_roles TO authenticated;
-- Roles were granted "long ago" so a fresh TOTP post-dates them.
INSERT INTO public.editor_privilege_state VALUES
  ('00000000-0000-0000-0000-000000000003', now() - interval '60 days'),
  ('00000000-0000-0000-0000-000000000004', now() - interval '60 days');
-- Public declared-path upload policy must keep working unchanged.
CREATE POLICY "Public can upload declared images" ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'event-submissions' AND (storage.foldername(name))[1] = 'uploads');
GRANT INSERT ON storage.objects TO anon;
