CREATE TABLE public.weather_snapshot (
  kind text PRIMARY KEY CHECK (kind IN ('hourly','daily')),
  payload jsonb,
  fetched_at timestamptz,
  expires_at timestamptz,
  error_count integer NOT NULL DEFAULT 0,
  last_error text,
  locked_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.weather_snapshot (kind) VALUES ('hourly'), ('daily');

GRANT SELECT ON public.weather_snapshot TO anon;
GRANT SELECT ON public.weather_snapshot TO authenticated;
GRANT ALL ON public.weather_snapshot TO service_role;

ALTER TABLE public.weather_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read the stored forecast"
ON public.weather_snapshot
FOR SELECT
USING (true);