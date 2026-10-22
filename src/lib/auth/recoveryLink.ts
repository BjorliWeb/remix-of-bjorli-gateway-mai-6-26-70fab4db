/**
 * Scanner-safe password recovery link.
 *
 * The reset email links straight to
 *   https://bjorli.no/admin/reset-password/#token_hash=…&type=recovery
 * instead of Supabase's /auth/v1/verify URL. Opening that page does NOT spend
 * the one-time token — only the "Fortsett" button does (verifyOtp). Mail link
 * scanners (Outlook Safe Links, Defender, Proofpoint …) open links but don't
 * click buttons, so they can no longer burn the token before the user does.
 *
 * The token is captured and removed from the address bar in main.tsx, before
 * React renders: GA4 page_view sends the full `location.href` as
 * page_location, and the token must never reach analytics or browser history.
 * The fragment form also keeps it out of server logs and Referer headers.
 */

const RESET_PATH = /^\/admin\/reset-password\/?$/;

let capturedTokenHash: string | null = null;

/** Read the recovery token_hash from the URL, keep it in memory, strip it from the URL. */
export const captureRecoveryTokenHash = (): void => {
  if (typeof window === 'undefined') return;
  const { pathname, search, hash } = window.location;
  if (!RESET_PATH.test(pathname)) return;

  const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
  const queryParams = new URLSearchParams(search);
  const source = hashParams.has('token_hash') ? hashParams : queryParams.has('token_hash') ? queryParams : null;
  if (!source) return;

  const tokenHash = source.get('token_hash');
  if (source.get('type') === 'recovery' && tokenHash) capturedTokenHash = tokenHash;

  // Strip the token whatever its type, so it never lingers in the URL.
  source.delete('token_hash');
  source.delete('type');
  const rest = (p: URLSearchParams, prefix: string) => (p.toString() ? `${prefix}${p}` : '');
  window.history.replaceState(
    window.history.state,
    '',
    `${pathname}${rest(queryParams, '?')}${rest(hashParams, '#')}`,
  );
};

export const getRecoveryTokenHash = (): string | null => capturedTokenHash;

/** One-time token: forget it once it has been sent to Auth. */
export const clearRecoveryTokenHash = (): void => {
  capturedTokenHash = null;
};
