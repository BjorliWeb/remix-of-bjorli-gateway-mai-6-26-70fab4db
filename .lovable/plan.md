# Deploy ai-event-assist Edge Function

## What
Deploy (redeploy) only the existing `ai-event-assist` Supabase Edge Function to the current production Lovable Cloud backend.

## Why
The corresponding database/RLS migration has already been applied and verified. The latest synced code already resolves the caller's role server-side from `public.user_roles` and allows both `admin` and `moderator`. Deployment is the remaining step to make the approved authorization change live.

## Verification of current code
File: `supabase/functions/ai-event-assist/index.ts`

- Auth gate requires a `Bearer` token.
- Token is validated via `supabase.auth.getClaims(token)`.
- Role check uses the service client against `public.user_roles`:
  - `const EDITOR_ROLES = ['admin', 'moderator'];`
  - `.eq('user_id', claims.claims.sub)`
  - `.in('role', EDITOR_ROLES)`
- No role is read from the client request body.

This confirms the function allows both `admin` and `moderator` while resolving the role server-side.

## Deployment action
- Deploy only: `supabase/functions/ai-event-assist`
- Do not deploy any other Edge Function.
- Do not run or recreate any migration.
- Do not change database policies, secrets, or environment variables.
- Do not modify any source code.

## Expected result
- Function `ai-event-assist` is deployed/redeployed successfully.
- No other functions are changed.
- No database changes are made.
- No secrets are changed.
