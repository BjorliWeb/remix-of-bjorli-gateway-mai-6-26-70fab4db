CREATE TABLE public.webcam6_state (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  refresh_token uuid NOT NULL DEFAULT gen_random_uuid(),
  last_source_url text,
  last_source_hash text,
  published_path text,
  previous_path text,
  published_hash text,
  captured_at timestamptz,
  time_source text,
  published_at timestamptz,
  last_checked_at timestamptz,
  last_result text,
  last_error text,
  last_scores jsonb,
  checks_total integer NOT NULL DEFAULT 0,
  approvals_total integer NOT NULL DEFAULT 0,
  rejections_total integer NOT NULL DEFAULT 0,
  errors_total integer NOT NULL DEFAULT 0,
  locked_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.webcam6_state (id) VALUES (true);
GRANT ALL ON public.webcam6_state TO service_role;
ALTER TABLE public.webcam6_state ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_webcam6_state_updated_at BEFORE UPDATE ON public.webcam6_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();