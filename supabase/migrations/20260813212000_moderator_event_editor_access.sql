-- Give the existing `moderator` role the event-submission editorial
-- capabilities that were previously reserved for `admin`.
--
-- SCOPE IS DELIBERATELY NARROW. moderator becomes the Bjorli editorial role
-- for the event-submission workflow ONLY. It does NOT gain, and must not be
-- given by inheritance:
--   * public.user_roles INSERT/DELETE (role assignment stays admin-only)
--   * public.contact_messages
--   * public.seo_meta
--   * public.services
--   * public.alerts
--   * public.operational_status
--   * any Storage bucket other than event-submissions
-- Future editorial capabilities must be granted explicitly, one at a time.
--
-- public.has_role() is NOT modified and its EXECUTE grants are NOT changed.
-- No policy is dropped without being recreated in the same transaction.

-- ---------------------------------------------------------------------------
-- public.event_submissions
-- ---------------------------------------------------------------------------
-- INSERT is intentionally absent here. Public/anonymous submission does not go
-- through an RLS INSERT policy (the "Anyone can submit an event" policy was
-- dropped in 20260627155321); submissions arrive via the submit-event edge
-- function. That behaviour is left exactly as-is.
--
-- SELECT / UPDATE / DELETE:
--   BEFORE: has_role(auth.uid(), 'admin')
--   AFTER : has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator')

DROP POLICY IF EXISTS "Admins can read submissions" ON public.event_submissions;
DROP POLICY IF EXISTS "Editors can read submissions" ON public.event_submissions;
CREATE POLICY "Editors can read submissions"
  ON public.event_submissions FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'moderator'::public.app_role)
  );

DROP POLICY IF EXISTS "Admins can update submissions" ON public.event_submissions;
DROP POLICY IF EXISTS "Editors can update submissions" ON public.event_submissions;
CREATE POLICY "Editors can update submissions"
  ON public.event_submissions FOR UPDATE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'moderator'::public.app_role)
  );

DROP POLICY IF EXISTS "Admins can delete submissions" ON public.event_submissions;
DROP POLICY IF EXISTS "Editors can delete submissions" ON public.event_submissions;
CREATE POLICY "Editors can delete submissions"
  ON public.event_submissions FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR public.has_role(auth.uid(), 'moderator'::public.app_role)
  );

-- ---------------------------------------------------------------------------
-- storage.objects — event-submissions bucket only
-- ---------------------------------------------------------------------------
-- The public INSERT policy ("Public can upload to declared event submission
-- paths", 20260707181852) is NOT touched. Upload access is unchanged.
--
-- SELECT / DELETE on this bucket:
--   BEFORE: bucket_id = 'event-submissions' AND has_role(auth.uid(), 'admin')
--   AFTER : bucket_id = 'event-submissions' AND (admin OR moderator)
-- The bucket_id predicate is preserved, so no other bucket is affected.

DROP POLICY IF EXISTS "Admins can read event submission images" ON storage.objects;
DROP POLICY IF EXISTS "Editors can read event submission images" ON storage.objects;
CREATE POLICY "Editors can read event submission images"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'event-submissions'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'moderator'::public.app_role)
    )
  );

DROP POLICY IF EXISTS "Admins can delete event submission images" ON storage.objects;
DROP POLICY IF EXISTS "Editors can delete event submission images" ON storage.objects;
CREATE POLICY "Editors can delete event submission images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'event-submissions'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'moderator'::public.app_role)
    )
  );
