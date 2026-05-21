-- Status enum
CREATE TYPE public.event_submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Main table
CREATE TABLE public.event_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic
  title text NOT NULL,
  summary text,
  description text NOT NULL,
  organizer text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  -- Date / location
  start_date date NOT NULL,
  end_date date,
  time_text text,
  location text NOT NULL,
  maps_url text,
  -- Category
  category text NOT NULL,
  -- Images
  image_urls text[] NOT NULL DEFAULT '{}',
  -- Meta
  language text NOT NULL DEFAULT 'no',
  consent_rights boolean NOT NULL DEFAULT false,
  consent_editing boolean NOT NULL DEFAULT false,
  status public.event_submission_status NOT NULL DEFAULT 'pending',
  editor_notes text,
  ai_polished_summary text,
  ai_polished_description text,
  ai_seo_title text,
  ai_seo_meta text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_submissions_status ON public.event_submissions (status, created_at DESC);

-- updated_at trigger
CREATE TRIGGER event_submissions_set_updated_at
  BEFORE UPDATE ON public.event_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.event_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an event"
  ON public.event_submissions FOR INSERT TO public
  WITH CHECK (status = 'pending');

CREATE POLICY "Admins can read submissions"
  ON public.event_submissions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update submissions"
  ON public.event_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete submissions"
  ON public.event_submissions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-submissions', 'event-submissions', true);

CREATE POLICY "Public can upload event submission images"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'event-submissions');

CREATE POLICY "Public can read event submission images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'event-submissions');

CREATE POLICY "Admins can delete event submission images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'event-submissions' AND public.has_role(auth.uid(), 'admin'));