-- Optional action links for submitted events: "Kjøp billett" (ticket_url) and
-- "Påmelding" (registration_url), in addition to the existing `website`.
--
-- * Nullable, no default, no backfill: existing rows are unchanged.
-- * Only http(s) URLs are accepted (blocks javascript:, data:, etc.). The
--   submit-event function and the editor form validate the same rule; this
--   constraint is the final guard for every write path.
-- * No new grants and no policy changes: the columns inherit the table's
--   existing privileges and RLS (editor-only access with MFA). The public
--   only sees them through list-approved-events, for approved events.
ALTER TABLE public.event_submissions
  ADD COLUMN IF NOT EXISTS ticket_url text,
  ADD COLUMN IF NOT EXISTS registration_url text;

ALTER TABLE public.event_submissions
  ADD CONSTRAINT event_submissions_ticket_url_http
    CHECK (ticket_url IS NULL
           OR (char_length(ticket_url) <= 500 AND ticket_url ~* '^https?://[^[:space:]/?#]+\.[^[:space:]]*$')),
  ADD CONSTRAINT event_submissions_registration_url_http
    CHECK (registration_url IS NULL
           OR (char_length(registration_url) <= 500 AND registration_url ~* '^https?://[^[:space:]/?#]+\.[^[:space:]]*$'));

COMMENT ON COLUMN public.event_submissions.ticket_url IS
  'Optional http(s) link shown as the "Kjøp billett" button on the public event page.';
COMMENT ON COLUMN public.event_submissions.registration_url IS
  'Optional http(s) link shown as the "Påmelding" button on the public event page.';
