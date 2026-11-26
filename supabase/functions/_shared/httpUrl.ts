// http(s)-only link validation for submitted event links (website, ticket,
// registration). Shared by the submit-event and list-approved-events
// functions, the public submission form, the editor form and the public
// event page. Pure: no Deno or browser APIs beyond the standard URL class.

export const MAX_LINK_LENGTH = 500;

/**
 * True only for an absolute http:// or https:// URL with a dotted host, no
 * whitespace or control characters and no embedded credentials. Rejects
 * javascript:, data:, vbscript:, file:, mailto: and relative paths.
 */
export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_LINK_LENGTH) return false;
  for (let i = 0; i < value.length; i++) {
    const c = value.charCodeAt(i);
    if (c <= 0x20 || c === 0x7f) return false; // whitespace / control characters
  }
  // Any Unicode whitespace (U+00A0, U+2003, U+3000, U+2028 …): the database
  // constraint rejects these too, so they must never pass here.
  if (/\s/u.test(value)) return false;
  if (!/^https?:\/\//i.test(value)) return false;
  let u: URL;
  try {
    u = new URL(value);
  } catch {
    return false;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
  if (u.username || u.password) return false; // https://bjorli.no@evil.example
  return u.hostname.includes('.') && !u.hostname.startsWith('.') && !u.hostname.endsWith('.');
}

/**
 * Normalise what a person typed: trims, adds https:// when no scheme is given
 * ("www.example.no"), and validates. Returns '' for empty input, null when
 * the value is not an acceptable link. Any other scheme (javascript:, data:)
 * is rejected, never rewritten.
 */
export function normalizeHttpUrl(raw: string | null | undefined): string | null {
  const v = (raw ?? '').trim();
  if (!v) return '';
  // Any explicit scheme other than http(s) is refused (a port such as
  // "example.no:8080" is not a scheme).
  if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(v) && !/^https?:\/\//i.test(v)) return null;
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  let href: string;
  try {
    href = new URL(withProto).toString();
  } catch {
    return null;
  }
  return isHttpUrl(href) ? href : null;
}

/** For rendering: the URL when it is a safe http(s) link, otherwise undefined. */
export function safeHttpUrl(value: unknown): string | undefined {
  return isHttpUrl(value) ? value : undefined;
}
