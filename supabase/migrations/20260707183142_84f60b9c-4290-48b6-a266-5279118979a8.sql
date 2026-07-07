-- Additive fix: allow signed-in users to execute the has_role helper.
-- Without this grant, every RLS policy that calls has_role(auth.uid(), ...)
-- returns "permission denied for function has_role" instead of a clean
-- policy filter, which would break the admin UI on the first real admin
-- sign-in.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;