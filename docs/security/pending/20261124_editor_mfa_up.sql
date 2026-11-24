-- PENDING (Fase 4): apply through the migration tool only after owner approval.
-- Server-side MFA for every editor/admin RLS and Storage policy, admin read of
-- roles, and a last-admin guard. No data changes. Rollback: *_editor_mfa_down.sql
-- Requires migration 1 (has_role self-only) to be live.
SET LOCAL lock_timeout = '5s';

-- Stop on policy drift instead of rewriting an unexpected policy set.
DO $$
BEGIN
  IF (SELECT count(*) FROM pg_policies
      WHERE (schemaname = 'public' OR (schemaname = 'storage' AND tablename = 'objects'))
        AND (coalesce(qual, '') || coalesce(with_check, '')) LIKE '%has_role(auth.uid()%') <> 19
  THEN
    RAISE EXCEPTION 'Editor policy baseline changed (expected 19 has_role policies); review before applying';
  END IF;
END $$;

-- 1. Role + current-session MFA in one check.
CREATE OR REPLACE FUNCTION public.is_editor(_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT auth.uid() IS NOT NULL
     AND coalesce(public.has_role(auth.uid(), _role), false)
     AND coalesce(public.has_current_editor_mfa(), false)
$$;
REVOKE ALL ON FUNCTION public.is_editor(public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_editor(public.app_role) TO authenticated, service_role;

-- 2. Same policies, has_role -> is_editor, wrapped in SELECT (one initplan per query).
ALTER POLICY "Only admins can delete alerts" ON public.alerts USING ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can insert alerts" ON public.alerts WITH CHECK ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can update alerts" ON public.alerts USING ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can view messages" ON public.contact_messages USING ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Editors can delete submissions" ON public.event_submissions
  USING (((SELECT public.is_editor('admin'::public.app_role)) OR (SELECT public.is_editor('moderator'::public.app_role))));
ALTER POLICY "Editors can read submissions" ON public.event_submissions
  USING (((SELECT public.is_editor('admin'::public.app_role)) OR (SELECT public.is_editor('moderator'::public.app_role))));
ALTER POLICY "Editors can update submissions" ON public.event_submissions
  USING (((SELECT public.is_editor('admin'::public.app_role)) OR (SELECT public.is_editor('moderator'::public.app_role))));
ALTER POLICY "Only admins can delete operational status" ON public.operational_status USING ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can insert operational status" ON public.operational_status WITH CHECK ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can update operational status" ON public.operational_status USING ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can insert SEO meta" ON public.seo_meta WITH CHECK ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can update SEO meta" ON public.seo_meta USING ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can insert services" ON public.services WITH CHECK ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can update services" ON public.services USING ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can delete roles" ON public.user_roles USING ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Only admins can manage roles" ON public.user_roles WITH CHECK ((SELECT public.is_editor('admin'::public.app_role)));
ALTER POLICY "Editors can delete event submission images" ON storage.objects
  USING (((bucket_id = 'event-submissions'::text) AND ((SELECT public.is_editor('admin'::public.app_role)) OR (SELECT public.is_editor('moderator'::public.app_role)))));
ALTER POLICY "Editors can read event submission images" ON storage.objects
  USING (((bucket_id = 'event-submissions'::text) AND ((SELECT public.is_editor('admin'::public.app_role)) OR (SELECT public.is_editor('moderator'::public.app_role)))));
ALTER POLICY "Editors can upload event submission images" ON storage.objects
  WITH CHECK (((bucket_id = 'event-submissions'::text) AND ((storage.foldername(name))[1] = 'editor'::text)
    AND ((SELECT public.is_editor('admin'::public.app_role)) OR (SELECT public.is_editor('moderator'::public.app_role)))
    AND (EXISTS (SELECT 1 FROM public.event_submissions s WHERE ((s.id)::text = (storage.foldername(objects.name))[2])))));
-- "Users can read own roles" is deliberately unchanged: login reads it before MFA.

-- 3. Admins with current MFA can see all role rows (needed for the existing DELETE policy).
CREATE POLICY "MFA admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING ((SELECT public.is_editor('admin'::public.app_role)));

-- 4. Never remove the last admin (DELETE, UPDATE, auth.users cascades; serialised).
CREATE OR REPLACE FUNCTION public.trg_user_roles_keep_last_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF OLD.role = 'admin'::public.app_role
     AND (TG_OP = 'DELETE' OR NEW.role IS DISTINCT FROM OLD.role OR NEW.user_id IS DISTINCT FROM OLD.user_id) THEN
    PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('bjorli_user_roles_last_admin'));
    IF NOT EXISTS (SELECT 1 FROM public.user_roles r
                   WHERE r.role = 'admin'::public.app_role AND r.id <> OLD.id
                     AND r.user_id <> OLD.user_id) THEN
      RAISE EXCEPTION 'last_admin' USING ERRCODE = '42501',
        HINT = 'Grant admin to another account before removing this one.';
    END IF;
  END IF;
  RETURN coalesce(NEW, OLD);
END;
$$;
REVOKE ALL ON FUNCTION public.trg_user_roles_keep_last_admin() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER user_roles_keep_last_admin
  BEFORE DELETE OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.trg_user_roles_keep_last_admin();
