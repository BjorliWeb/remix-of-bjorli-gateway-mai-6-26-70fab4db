-- R-06: Restrict bucket SELECT (and DELETE) on event-submissions to admins.
-- The current policies already enforce this; this migration is an explicit,
-- independently reversible re-affirmation so R-06 exists as its own audit
-- trail entry alongside R-05.

DROP POLICY IF EXISTS "Admins can read event submission images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete event submission images" ON storage.objects;

CREATE POLICY "Admins can read event submission images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'event-submissions'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete event submission images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'event-submissions'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);