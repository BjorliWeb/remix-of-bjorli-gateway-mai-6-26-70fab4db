-- R-05c (Option A): tighten INSERT policy on storage.objects for the
-- event-submissions bucket. The uploaded object's full path must appear
-- in the linked event_submissions row's image_urls array. This binds
-- uploads to the exact paths the server-side submit-event function
-- already recorded, preventing arbitrary extra files under a valid
-- token (closes F-12 and F-15).

DROP POLICY IF EXISTS "Public can upload to linked event submission folder" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload to declared event submission paths" ON storage.objects;

CREATE POLICY "Public can upload to declared event submission paths"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'event-submissions'
  AND (storage.foldername(name))[1] = 'uploads'
  AND EXISTS (
    SELECT 1
    FROM public.event_submissions s
    WHERE (s.upload_token)::text = (storage.foldername(objects.name))[2]
      AND s.created_at > (now() - interval '1 hour')
      AND objects.name = ANY (s.image_urls)
  )
);