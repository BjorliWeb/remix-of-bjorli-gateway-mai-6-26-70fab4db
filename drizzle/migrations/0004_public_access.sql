SET LOCAL lock_timeout = '5s';

DO $$
BEGIN
  IF (SELECT count(*) FROM pg_policies WHERE schemaname = 'public'
      AND tablename IN ('weather_snapshot', 'seo_meta', 'services')) <> 7
    OR NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public'
      AND tablename = 'weather_snapshot' AND policyname = 'Anyone can read the stored forecast'
      AND cmd = 'SELECT' AND qual = 'true' AND roles = ARRAY['public']::name[])
    OR NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public'
      AND tablename = 'services' AND policyname = 'Anyone can read active services'
      AND cmd = 'SELECT' AND qual = 'true' AND roles = ARRAY['public']::name[])
  THEN
    RAISE EXCEPTION 'Access baseline changed; review policies before applying';
  END IF;
END $$;

REVOKE ALL PRIVILEGES ON TABLE public.weather_snapshot FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.seo_meta FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.services FROM anon, authenticated;

GRANT SELECT ON TABLE public.seo_meta, public.services TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.seo_meta, public.services TO authenticated;

DROP POLICY "Anyone can read the stored forecast" ON public.weather_snapshot;
ALTER POLICY "Anyone can read active services" ON public.services USING (is_active = true);
CREATE POLICY "Admins can read all services" ON public.services
  FOR SELECT TO authenticated
  USING ((SELECT public.is_editor('admin'::public.app_role)));

COMMENT ON TABLE public.seo_meta IS
  'Intended Public Access: this table contains only public, published SEO metadata. Never store drafts, secrets, internal notes or private image URLs. Administrator INSERT/UPDATE remains role-validated.';