/**
 * TOTP multi-factor helpers for the editor login.
 *
 * Pure decision logic lives here so it can be tested without a Supabase
 * client. Anything that talks to Auth stays in the page component.
 *
 * Scope note: this phase covers native TOTP only. Email step-up and the
 * 30-day trusted-device flow are deliberately not implemented yet.
 */
import { supabase } from '@/integrations/supabase/client';

/** Minimal shape of a factor as returned by `auth.mfa.listFactors()`. */
export type MfaFactorLike = {
  id: string;
  factor_type?: string;
  status?: string;
};

export type TotpState =
  /** A usable factor already exists — ask for a 6-digit code. */
  | { mode: 'challenge'; factorId: string }
  /**
   * Nothing usable yet — enrol. `staleFactorIds` are unverified leftovers from
   * an abandoned attempt; they must be removed first or enrolment can collide
   * with them.
   */
  | { mode: 'enroll'; staleFactorIds: string[] };

/**
 * Decide whether a user should be challenged or enrolled.
 *
 * A factor only counts once Auth has marked it `verified` — an unverified row
 * means someone opened the setup screen and never finished, so it proves
 * nothing and must not be treated as a second factor.
 */
export function resolveTotpState(
  factors: readonly MfaFactorLike[] | null | undefined,
): TotpState {
  const totp = (factors ?? []).filter((f) => f.factor_type === 'totp');
  const verified = totp.find((f) => f.status === 'verified');

  if (verified) return { mode: 'challenge', factorId: verified.id };

  return {
    mode: 'enroll',
    staleFactorIds: totp.filter((f) => f.status !== 'verified').map((f) => f.id),
  };
}

/**
 * Authoritative answer to "is this session's MFA still valid?".
 *
 * Deliberately NOT `aal2`. A session keeps `aal2` for its whole life, so it
 * would still look verified after the 30-day window has passed or after the
 * account's roles changed. The database function applies both floors — TOTP
 * freshness from the JWT `amr` timestamp, measured against the later of
 * (30 days ago) and the account's last role change — so it is the only check
 * the editor gate may rely on.
 *
 * Fails closed: any error means we cannot prove verification, so we treat the
 * session as unverified rather than letting a failed lookup open the editor.
 */
export async function hasCurrentEditorMfa(): Promise<boolean> {
  const { data, error } = await supabase.rpc('has_current_editor_mfa');
  if (error) return false;
  return data === true;
}

export type SendEmailCodeFailure = 'cooldown' | 'rate_limited' | 'forbidden' | 'unavailable';

/**
 * Flat rather than a discriminated union on purpose: this project compiles
 * with `strict: false`, where narrowing on a literal boolean discriminant is
 * unreliable. `ok` tells you which fields are meaningful.
 */
export type SendEmailCodeResult = {
  ok: boolean;
  maskedEmail?: string;
  cooldownSeconds?: number;
  reason?: SendEmailCodeFailure;
  retryAfter?: number;
};

/**
 * Ask the server to email a code to the signed-in editor's own address.
 *
 * The code is generated in the database and delivered by email only — nothing
 * in the response reveals it, which is what makes reading the inbox a genuine
 * second factor rather than a formality.
 */
export async function sendEditorEmailCode(): Promise<SendEmailCodeResult> {
  const { data, error } = await supabase.functions.invoke('mfa-email-send', { body: {} });

  if (error) {
    // Non-2xx replies arrive as an error with the original Response attached.
    let reason: SendEmailCodeFailure = 'unavailable';
    let retryAfter = 60;
    const context = (error as { context?: Response }).context;
    if (context && typeof context.json === 'function') {
      try {
        const body = await context.json();
        if (body?.error) reason = body.error;
        if (typeof body?.retry_after === 'number') retryAfter = body.retry_after;
      } catch {
        // Keep the generic reason.
      }
    }
    return { ok: false, reason, retryAfter };
  }

  const body = data as { masked_email?: string; cooldown_seconds?: number } | null;
  return {
    ok: true,
    maskedEmail: body?.masked_email ?? '',
    cooldownSeconds: body?.cooldown_seconds ?? 60,
  };
}

/**
 * Check an emailed code. The database consumes it on success and records the
 * step-up for the current session; a wrong, expired or replayed code is simply
 * `false`, with no detail about which.
 */
export async function verifyEditorEmailCode(code: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('verify_editor_email_code', { _code: code });
  if (error) return false;
  return data === true;
}
