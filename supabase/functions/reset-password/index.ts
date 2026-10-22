import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { isFreshRecoverySession } from './recoverySession.ts';

/**
 * Password reset for accounts with MFA.
 *
 * Supabase Auth refuses a password change from the user's own session when
 * the account has a verified TOTP factor and the session is not aal2
 * (insufficient_aal). The reset email already proves control of the mailbox,
 * and MFA is still required at the next sign-in, so the reset itself should
 * not ask for the authenticator code. This function performs the change with
 * the admin API, but ONLY for a session that came from a reset/email link in
 * the last 15 minutes (see recoverySession.ts) and still exists.
 *
 * It never reads or changes roles or MFA factors. The password policy is still
 * enforced by Auth (admin updates run the same strength check).
 * Never log the request body: it contains the new password.
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401);
  const jwt = authHeader.replace('Bearer ', '');

  const userClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: claims, error: claimsErr } = await userClient.auth.getClaims(jwt);
  const sub = claims?.claims?.sub;
  if (claimsErr || !sub) return json({ error: 'unauthorized' }, 401);

  if (!isFreshRecoverySession(claims.claims.amr, Math.floor(Date.now() / 1000))) {
    return json({ error: 'not_recovery_session' }, 403);
  }

  // getClaims can verify the signature locally; also make sure the session has
  // not been signed out since the token was issued.
  const { data: userData, error: userErr } = await userClient.auth.getUser(jwt);
  if (userErr || userData?.user?.id !== sub) return json({ error: 'unauthorized' }, 401);

  let password: unknown;
  try {
    password = (await req.json())?.password;
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  if (typeof password !== 'string' || password.length === 0 || password.length > 256) {
    return json({ error: 'bad_request' }, 400);
  }

  const service = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const { error: updateErr } = await service.auth.admin.updateUserById(sub, { password });
  if (updateErr) {
    const code = (updateErr as { code?: string }).code;
    if (code === 'weak_password') return json({ error: 'weak_password' }, 422);
    console.log('[reset-password] update failed', { code: code ?? 'unknown' });
    return json({ error: 'update_failed' }, 400);
  }

  return json({ ok: true });
});
