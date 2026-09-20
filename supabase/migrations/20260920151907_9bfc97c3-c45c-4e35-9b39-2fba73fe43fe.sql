CREATE TABLE public.weather_refresh_ticket (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.weather_refresh_ticket (id) VALUES (true);

GRANT ALL ON public.weather_refresh_ticket TO service_role;

ALTER TABLE public.weather_refresh_ticket ENABLE ROW LEVEL SECURITY;