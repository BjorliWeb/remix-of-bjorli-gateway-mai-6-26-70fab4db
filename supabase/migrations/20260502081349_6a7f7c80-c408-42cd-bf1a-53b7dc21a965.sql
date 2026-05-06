-- Create operational_status table for live ski resort status (lifts, slopes, snow, temperature, etc.)
CREATE TABLE public.operational_status (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_key text NOT NULL,
  language text NOT NULL DEFAULT 'no',
  value text NOT NULL,
  label text NOT NULL,
  icon text NOT NULL DEFAULT 'mountain',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(metric_key, language)
);

ALTER TABLE public.operational_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active operational status"
  ON public.operational_status FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can insert operational status"
  ON public.operational_status FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update operational status"
  ON public.operational_status FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete operational status"
  ON public.operational_status FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_operational_status_updated_at
  BEFORE UPDATE ON public.operational_status
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.operational_status;
ALTER TABLE public.operational_status REPLICA IDENTITY FULL;

-- Seed with default values for Norwegian (other languages fall back to NO)
INSERT INTO public.operational_status (metric_key, language, value, label, icon, sort_order) VALUES
  ('lifts', 'no', '8/8', 'Heiser åpne', 'lifts', 1),
  ('slopes', 'no', '24/24', 'Løyper åpne', 'slopes', 2),
  ('snow', 'no', '120 cm', 'Snødybde', 'snow', 3),
  ('temperature', 'no', '-4°C', 'Temperatur', 'temperature', 4),
  ('lifts', 'en', '8/8', 'Lifts open', 'lifts', 1),
  ('slopes', 'en', '24/24', 'Slopes open', 'slopes', 2),
  ('snow', 'en', '120 cm', 'Snow depth', 'snow', 3),
  ('temperature', 'en', '-4°C', 'Temperature', 'temperature', 4);