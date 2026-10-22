-- Editors may edit submitted event content in /admin/innsendinger.
-- Guard: ordinary edits can never change identity, submitter data or consent,
-- image paths must stay inside this submission's own folders, and an
-- approved English draft is invalidated when the source text changes.
-- Existing flows (status, notes, AI fields, English approval, show_email_public)
-- touch none of the guarded columns and are unaffected.
CREATE OR REPLACE FUNCTION public.trg_event_submissions_guard_edit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  p text;
BEGIN
  IF coalesce(auth.role(), '') = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
     OR NEW.upload_token IS DISTINCT FROM OLD.upload_token
     OR NEW.consent_rights IS DISTINCT FROM OLD.consent_rights
     OR NEW.consent_editing IS DISTINCT FROM OLD.consent_editing
     OR NEW.email IS DISTINCT FROM OLD.email
     OR NEW.contact_name IS DISTINCT FROM OLD.contact_name
     OR NEW.phone IS DISTINCT FROM OLD.phone
     OR NEW.language IS DISTINCT FROM OLD.language THEN
    RAISE EXCEPTION 'protected_field' USING ERRCODE = '42501';
  END IF;

  IF NEW.image_urls IS DISTINCT FROM OLD.image_urls THEN
    IF coalesce(array_length(NEW.image_urls, 1), 0) > 5 THEN
      RAISE EXCEPTION 'too_many_images' USING ERRCODE = '22023';
    END IF;
    FOREACH p IN ARRAY NEW.image_urls LOOP
      IF NOT (p = ANY (OLD.image_urls))
         AND p NOT LIKE ('editor/' || NEW.id::text || '/%') THEN
        RAISE EXCEPTION 'invalid_image_path' USING ERRCODE = '22023';
      END IF;
    END LOOP;
  END IF;

  IF (NEW.title IS DISTINCT FROM OLD.title
      OR NEW.summary IS DISTINCT FROM OLD.summary
      OR NEW.description IS DISTINCT FROM OLD.description)
     AND OLD.english_approved THEN
    NEW.english_approved := false;
    NEW.english_approved_at := NULL;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER event_submissions_guard_edit
BEFORE UPDATE ON public.event_submissions
FOR EACH ROW EXECUTE FUNCTION public.trg_event_submissions_guard_edit();

-- Editors may upload only to editor/<existing submission id>/ in this bucket.
-- Size (8 MB) and type (jpeg/png/webp) are enforced by the bucket itself.
CREATE POLICY "Editors can upload event submission images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'event-submissions'
    AND (storage.foldername(name))[1] = 'editor'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'moderator'::public.app_role)
    )
    AND EXISTS (
      SELECT 1 FROM public.event_submissions s
      WHERE s.id::text = (storage.foldername(name))[2]
    )
  );