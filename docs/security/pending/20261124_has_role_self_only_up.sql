-- PENDING: apply through the migration tool only after the owner's explicit approval.
-- Same signature, owner, grants and lookup. Adds only a caller check:
-- a signed-in caller may ask about their own user ID; trusted server calls
-- (JWT role service_role) keep full lookup. No "missing JWT" exception: a
-- session without request claims is NOT treated as trusted.
BEGIN;
SET LOCAL lock_timeout = '5s';

DO $$
BEGIN
  IF (SELECT count(*) FROM pg_policies
      WHERE (coalesce(qual,'') || coalesce(with_check,'')) ILIKE '%has_role%'
        AND (coalesce(qual,'') || coalesce(with_check,'')) !~ 'has_role\(auth\.uid\(\)') <> 0
  THEN
    RAISE EXCEPTION 'A policy calls has_role with a non-self user id; review before applying';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
  AND (
    coalesce(_user_id = auth.uid(), false)
    OR coalesce(auth.jwt() ->> 'role', '') = 'service_role'
  )
$function$;

COMMIT;
