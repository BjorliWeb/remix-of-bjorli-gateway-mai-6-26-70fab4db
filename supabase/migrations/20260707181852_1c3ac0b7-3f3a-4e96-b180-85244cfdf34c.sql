-- Security-definer helper: answers only "is this exact object path declared
-- in an event_submissions row created within the last hour?" It never
-- returns any row data, so it does not leak submission contents.
CREATE OR REPLACE FUNCTION public.event_submission_path_declared(_path text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.event_submissions s
    WHERE (s.upload_token)::text = (storage.foldername(_path))[2]
      AND s.created_at > (now() - interval '1 hour')
      AND _path = ANY (s.image_urls)
  );
$$;

REVOKE ALL ON FUNCTION public.event_submission_path_declared(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.event_submission_path_declared(text) TO anon, authenticated, service_role;

-- Recreate the INSERT policy to use the helper.
DROP POLICY IF EXISTS "Public can upload to declared event submission paths" ON storage.objects;

CREATE POLICY "Public can upload to declared event submission paths"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'event-submissions'
  AND (storage.foldername(name))[1] = 'uploads'
  AND public.event_submission_path_declared(name)
);