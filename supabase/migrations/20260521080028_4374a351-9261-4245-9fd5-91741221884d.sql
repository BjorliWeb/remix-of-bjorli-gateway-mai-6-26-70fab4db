-- Make bucket private
UPDATE storage.buckets SET public = false WHERE id = 'event-submissions';

-- Replace permissive policies with scoped ones
DROP POLICY IF EXISTS "Public can upload event submission images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read event submission images" ON storage.objects;

CREATE POLICY "Public can upload to event-submissions uploads folder"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (
    bucket_id = 'event-submissions'
    AND (storage.foldername(name))[1] = 'uploads'
  );

CREATE POLICY "Admins can read event submission images"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'event-submissions'
    AND public.has_role(auth.uid(), 'admin')
  );