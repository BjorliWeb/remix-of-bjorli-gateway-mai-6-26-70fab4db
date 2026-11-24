-- ROLLBACK for 20261124_editor_mfa_up.sql: restores the exact pre-Fase-4 expressions.
SET LOCAL lock_timeout = '5s';
DROP TRIGGER IF EXISTS user_roles_keep_last_admin ON public.user_roles;
DROP FUNCTION IF EXISTS public.trg_user_roles_keep_last_admin();
DROP POLICY IF EXISTS "MFA admins can read all roles" ON public.user_roles;
ALTER POLICY "Only admins can delete alerts" ON public.alerts USING (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can insert alerts" ON public.alerts WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can update alerts" ON public.alerts USING (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can view messages" ON public.contact_messages USING (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Editors can delete submissions" ON public.event_submissions
  USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'moderator'::public.app_role)));
ALTER POLICY "Editors can read submissions" ON public.event_submissions
  USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'moderator'::public.app_role)));
ALTER POLICY "Editors can update submissions" ON public.event_submissions
  USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'moderator'::public.app_role)));
ALTER POLICY "Only admins can delete operational status" ON public.operational_status USING (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can insert operational status" ON public.operational_status WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can update operational status" ON public.operational_status USING (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can insert SEO meta" ON public.seo_meta WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can update SEO meta" ON public.seo_meta USING (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can insert services" ON public.services WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can update services" ON public.services USING (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can delete roles" ON public.user_roles USING (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Only admins can manage roles" ON public.user_roles WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
ALTER POLICY "Editors can delete event submission images" ON storage.objects
  USING (((bucket_id = 'event-submissions'::text) AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'moderator'::public.app_role))));
ALTER POLICY "Editors can read event submission images" ON storage.objects
  USING (((bucket_id = 'event-submissions'::text) AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'moderator'::public.app_role))));
ALTER POLICY "Editors can upload event submission images" ON storage.objects
  WITH CHECK (((bucket_id = 'event-submissions'::text) AND ((storage.foldername(name))[1] = 'editor'::text)
    AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR public.has_role(auth.uid(), 'moderator'::public.app_role))
    AND (EXISTS (SELECT 1 FROM public.event_submissions s WHERE ((s.id)::text = (storage.foldername(objects.name))[2])))));
DROP FUNCTION IF EXISTS public.is_editor(public.app_role);
