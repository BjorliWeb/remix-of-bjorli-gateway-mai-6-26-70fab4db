-- ROLLBACK: restores the observed 24 November 2026 baseline, including its risks.
-- Run only for this change and after checking for subsequent policy changes.
BEGIN;
SET LOCAL lock_timeout = '5s';

DROP POLICY "Admins can read all services" ON public.services;
ALTER POLICY "Anyone can read active services" ON public.services USING (true);
CREATE POLICY "Anyone can read the stored forecast" ON public.weather_snapshot
  FOR SELECT TO public USING (true);

REVOKE ALL PRIVILEGES ON TABLE public.weather_snapshot, public.seo_meta, public.services
  FROM anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.weather_snapshot, public.seo_meta, public.services
  TO anon, authenticated;
COMMENT ON TABLE public.seo_meta IS NULL;

COMMIT;