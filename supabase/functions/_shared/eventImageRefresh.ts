// On-demand renewal of public event image links.
// Shared by the list-approved-events function and its tests (pure, no Deno APIs).
//
// Security model: the client never names a storage object. It names an event
// id and the position of an image in that event, and the server looks the
// path up in the database itself. A link is only issued when the row exists,
// is still approved (= published) at the moment of the request, and actually
// lists that image. Anything else is silently dropped, so the response does
// not reveal whether an id exists, was unpublished or was rejected.

/** Lifetime of public signed image links (seconds). Editors keep 3 600 s. */
export const PUBLIC_IMAGE_TTL_S = 600;

/** Max images renewed per request; the client batches up to this many. */
export const MAX_REFRESH_ITEMS = 12;

/** Submissions carry at most a handful of images; reject absurd indexes. */
export const MAX_IMAGE_INDEX = 19;

export type RefreshItem = { id: string; index: number };
export type RefreshRow = { id: string; status: string | null; image_urls: unknown };
export type RefreshTarget = RefreshItem & { path: string };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/**
 * Validate `refresh_images` from the request body. Returns null when the
 * payload is malformed (caller answers 400), otherwise a de-duplicated list.
 */
export function parseRefreshRequest(raw: unknown): RefreshItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_REFRESH_ITEMS) return null;
  const seen = new Set<string>();
  const out: RefreshItem[] = [];
  for (const it of raw) {
    if (!it || typeof it !== 'object') return null;
    const { id, index } = it as { id?: unknown; index?: unknown };
    if (typeof id !== 'string' || !UUID_RE.test(id)) return null;
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index > MAX_IMAGE_INDEX) {
      return null;
    }
    const key = `${id}:${index}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ id, index });
  }
  return out;
}

/**
 * Defence in depth for paths read from the database: must look like an
 * object key inside the bucket, never a traversal or an absolute/odd path.
 */
export function isSafeStoragePath(p: unknown): p is string {
  if (typeof p !== 'string' || p.length === 0 || p.length > 512) return false;
  // Paths are sent to Storage in a JSON body, so only traversal-shaped input
  // matters here; odd file-name characters from old uploads stay allowed.
  if (p.startsWith('/') || p.includes('\\')) return false;
  for (let i = 0; i < p.length; i++) {
    const c = p.charCodeAt(i);
    if (c < 0x20 || c === 0x7f) return false; // control characters
  }
  return p.split('/').every((seg) => seg !== '' && seg !== '.' && seg !== '..');
}

/**
 * Map requested items to storage paths using ONLY rows read from the database
 * in this request. A row that is not approved, an index outside the row's
 * image list or an unsafe path yields nothing.
 */
export function resolveRefreshTargets(
  items: readonly RefreshItem[],
  rows: readonly RefreshRow[],
): RefreshTarget[] {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const out: RefreshTarget[] = [];
  for (const it of items) {
    const row = byId.get(it.id);
    if (!row || row.status !== 'approved') continue;
    const paths = Array.isArray(row.image_urls) ? row.image_urls : [];
    const path = paths[it.index];
    if (!isSafeStoragePath(path)) continue;
    out.push({ ...it, path });
  }
  return out;
}

/**
 * Pair signed URLs with their original image positions. Failed signings are
 * dropped, but positions are kept so the client can name the right image.
 */
export function alignSignedUrls(
  signed: ReadonlyArray<{ signedUrl?: string | null } | null | undefined>,
): { urls: string[]; indexes: number[] } {
  const urls: string[] = [];
  const indexes: number[] = [];
  signed.forEach((s, i) => {
    if (s?.signedUrl) {
      urls.push(s.signedUrl);
      indexes.push(i);
    }
  });
  return { urls, indexes };
}
