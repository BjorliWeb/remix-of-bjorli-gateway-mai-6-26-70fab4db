
-- Operational alerts (Driftsmelding) table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL DEFAULT 'no',
  level TEXT NOT NULL DEFAULT 'info',
  label TEXT,
  message TEXT NOT NULL,
  cta_label TEXT,
  cta_href TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active alerts"
ON public.alerts FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins can insert alerts"
ON public.alerts FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update alerts"
ON public.alerts FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete alerts"
ON public.alerts FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_alerts_updated_at
BEFORE UPDATE ON public.alerts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_alerts_active_lang ON public.alerts (is_active, language, published_at DESC);
