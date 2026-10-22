/**
 * Is this JWT a fresh session that proved control of the account's mailbox?
 *
 * Supabase Auth issues the session from a reset link (verifyOtp with
 * token_hash, or the legacy /verify redirect) with amr method "otp"; the PKCE
 * flow uses "recovery". Auth itself treats otp, magiclink and recovery as the
 * recovery methods (models.AuthenticationMethod.IsRecovery in supabase/auth).
 * A password sign-in has amr "password" and is never accepted, so knowing the
 * password alone is not enough to change it without the authenticator code.
 *
 * Pure and dependency-free so it can be unit-tested outside Deno.
 */

export const RECOVERY_MAX_AGE_SECONDS = 15 * 60;

const RECOVERY_METHODS = new Set(['otp', 'magiclink', 'recovery']);

type AmrEntry = { method?: unknown; timestamp?: unknown };

export function isFreshRecoverySession(
  amr: unknown,
  nowSeconds: number,
  maxAgeSeconds = RECOVERY_MAX_AGE_SECONDS,
): boolean {
  if (!Array.isArray(amr)) return false;
  return amr.some((entry: AmrEntry | string) => {
    // Some tokens carry amr as plain strings; they have no timestamp to prove
    // freshness, so they never qualify.
    if (typeof entry !== 'object' || entry === null) return false;
    if (typeof entry.method !== 'string' || !RECOVERY_METHODS.has(entry.method)) return false;
    if (typeof entry.timestamp !== 'number') return false;
    const age = nowSeconds - entry.timestamp;
    return age >= -60 && age <= maxAgeSeconds;
  });
}
