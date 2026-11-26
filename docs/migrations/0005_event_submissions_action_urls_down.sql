-- Rollback for drizzle/migrations/0005_event_submissions_action_urls.sql.
-- Removes the two optional link columns. Any ticket/registration links saved
-- after the migration are lost (website is untouched). Deploy the previous
-- versions of submit-event and list-approved-events BEFORE running this,
-- otherwise list-approved-events selects columns that no longer exist.
ALTER TABLE public.event_submissions
  DROP CONSTRAINT IF EXISTS event_submissions_ticket_url_http,
  DROP CONSTRAINT IF EXISTS event_submissions_registration_url_http;
ALTER TABLE public.event_submissions
  DROP COLUMN IF EXISTS ticket_url,
  DROP COLUMN IF EXISTS registration_url;
