ALTER TABLE public.event_submissions
  ADD COLUMN IF NOT EXISTS english_draft_title text,
  ADD COLUMN IF NOT EXISTS english_draft_summary text,
  ADD COLUMN IF NOT EXISTS english_draft_description text,
  ADD COLUMN IF NOT EXISTS english_approved boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS english_approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS ai_quality_notes text;