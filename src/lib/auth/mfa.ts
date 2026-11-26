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

/** Error code the editor backend functions return (HTTP 403) when MFA is stale. */
export const MFA_REQUIRED = 'mfa_required';

/**
 * True when a `functions.invoke` error is the backend's MFA refusal. Reads the
 * JSON body of the HTTP error; anything unreadable is treated as "not MFA" so
 * the caller falls back to its normal error message.
 */
export async function isMfaRequiredError(error: unknown): Promise<boolean> {
  const ctx = (error as { context?: unknown } | null)?.context;
  if (!(ctx instanceof Response) || ctx.status !== 403) return false;
  try {
    const body = await ctx.clone().json();
    return body?.error === MFA_REQUIRED;
  } catch {
    return false;
  }
}

/** Shown when the server refuses because two-step login must be renewed. */
export const MFA_EXPIRED_MESSAGE =
  'To-trinns innloggingen må fornyes. Ingenting er lagret eller sendt. Det du har skrevet, står fortsatt her. Logg inn på nytt i en ny fane og prøv igjen.';

/** Result of an editor write that reads back the rows it touched. */
export type EditorWriteOutcome = 'ok' | 'denied' | 'failed';

/**
 * Classify `update(...).select('id')` on a single row. Access rules (RLS,
 * including the server-side MFA check) refuse an update by matching zero rows
 * rather than by raising an error, so "no error, no rows" is a refusal and
 * must never be reported as a successful save. 42501 and the protected-field
 * trigger are refusals too; anything else is an ordinary failure.
 */
export function classifyEditorWrite(
  error: { code?: string; message?: string } | null | undefined,
  rows: readonly unknown[] | null | undefined,
): EditorWriteOutcome {
  if (error) {
    return error.code === '42501' || error.message === 'protected_field' ? 'denied' : 'failed';
  }
  return rows && rows.length === 1 ? 'ok' : 'denied';
}
