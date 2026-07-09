ALTER TABLE public.event_submissions
  ADD COLUMN IF NOT EXISTS show_email_public boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.event_submissions.show_email_public IS
  'When true, the submitter opted in to having their email address published on the public event detail page. Enforced in code by the list-approved-events edge function.';