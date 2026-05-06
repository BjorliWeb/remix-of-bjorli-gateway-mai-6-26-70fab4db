/**
 * Fnugg integration for Bjorli Skisenter (resort id 177).
 *
 * Fnugg is the public Norwegian ski resort data API used by NSF/SkiInfo.
 * Endpoint: https://api.fnugg.no/get/resort/177
 *
 * IMPORTANT — production note:
 * In the future Next.js implementation this MUST be moved behind a server
 * route / Route Handler / Edge Function (e.g. `app/api/status/route.ts`)
 * with `revalidate` set to ~5–15 minutes during winter season. That gives:
 *   - controlled caching (avoids hammering Fnugg)
 *   - resilient error handling on the server
 *   - no CORS surprises in the browser
 *   - a single canonical shape consumed by all clients
 *
 * For the Lovable prototype we fetch directly from the browser. The Fnugg
 * endpoint is public and CORS-enabled, and no secrets are required.
 */

export const FNUGG_RESORT_ID = 177;
export const FNUGG_ENDPOINT = `https://api.fnugg.no/get/resort/${FNUGG_RESORT_ID}`;

/**
 * Fnugg blog/post search endpoint.
 *
 * Fnugg's blog index serves daily operational updates ("driftsmeldinger") that
 * resorts publish during the winter season.
 *
 * VERIFIED 2026-05-02 against the live API (resort 177 = Bjorli Skisenter):
 *   - `include=177`  ❌ returns posts from OTHER resorts (e.g. site_id 78, 162).
 *                       DO NOT USE — it is not a per-site filter.
 *   - `facet=site:177` ✅ returns 129+ Bjorli posts (site_id === 177).
 *                       This is the correct per-resort filter.
 *   - `q=Bjorli`     ⚠️ free-text fallback only — may include posts that merely
 *                       mention "Bjorli". Always re-filter by site_id afterwards.
 *
 * Result envelope: `{ hits: { total, hits: [{ _id, _source }] } }`.
 * Each `_source` has flat fields: title, description, images, date, modified,
 * type, site_id, id, author. `title` is a plain string (NOT `{ rendered }`),
 * `description` is the body HTML, and `images` is a nested object map (which
 * we intentionally ignore for the homepage Driftsmelding box).
 *
 * Single article (future use):
 *   /get/blog_post/{site_id}_{wordpress_post_id}     e.g. /get/blog_post/177_2244
 */
export const FNUGG_BLOG_BASE = 'https://api.fnugg.no/search';

function buildBlogUrl(strategy: 'facet' | 'q', size = 3): string {
  const common = `index=blog&type=blog_post&size=${size}&sort=created_at:desc`;
  switch (strategy) {
    case 'facet':
      return `${FNUGG_BLOG_BASE}?${common}&facet=site:${FNUGG_RESORT_ID}`;
    case 'q':
      // Free-text fallback. Always re-filter by site_id === FNUGG_RESORT_ID.
      return `${FNUGG_BLOG_BASE}?${common}&q=Bjorli`;
  }
}

export function fnuggBlogPostUrl(siteId: number | string, postId: number | string): string {
  return `https://api.fnugg.no/get/blog_post/${siteId}_${postId}`;
}

// ---------- Raw response types (partial — only fields we consume) ----------

export interface FnuggLifts {
  open?: number;
  count?: number;
}

export interface FnuggSlopes {
  open?: number;
  count?: number;
}

export interface FnuggConditionsTopSnow {
  depth?: number | string | null;
  /** Newer Fnugg payloads use `depth_slope` for the primary slope snow depth. */
  depth_slope?: number | string | null;
  depth_terrain?: number | string | null;
}

export interface FnuggTemperatureObject {
  value?: number | string | null;
  unit?: string;
}

export interface FnuggConditionsTop {
  snow?: FnuggConditionsTopSnow;
  /** Fnugg returns either a scalar or an object `{ value, unit }`. */
  temperature?: number | string | FnuggTemperatureObject | null;
}

export interface FnuggConditionsCombined {
  top?: FnuggConditionsTop;
}

export interface FnuggConditions {
  combined?: FnuggConditionsCombined;
}

export interface FnuggOpeningHours {
  // Free-form on Fnugg's side — kept loose intentionally.
  [key: string]: unknown;
}

export interface FnuggSource {
  lifts?: FnuggLifts;
  slopes?: FnuggSlopes;
  conditions?: FnuggConditions;
  last_updated?: string;
  resort_open?: boolean | number | string;
  opening_hours?: FnuggOpeningHours;
}

export interface FnuggResortResponse {
  _source?: FnuggSource;
}

// ---------- Normalized shape consumed by the UI ----------

export interface BjorliFnuggStatus {
  liftsOpen: number | null;
  liftsTotal: number | null;
  slopesOpen: number | null;
  slopesTotal: number | null;
  snowDepthCm: number | null;
  temperatureC: number | null;
  resortOpen: boolean | null;
  lastUpdated: string | null;
}

export const EMPTY_FNUGG_STATUS: BjorliFnuggStatus = {
  liftsOpen: null,
  liftsTotal: null,
  slopesOpen: null,
  slopesTotal: null,
  snowDepthCm: null,
  temperatureC: null,
  resortOpen: null,
  lastUpdated: null,
};

const toNumber = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const toBool = (v: unknown): boolean | null => {
  if (v === true || v === 1 || v === '1' || v === 'true') return true;
  if (v === false || v === 0 || v === '0' || v === 'false') return false;
  return null;
};

/**
 * Pure normalizer — accepts a raw Fnugg payload and returns the safe,
 * UI-friendly shape. All missing values become `null` so the UI can render
 * em-dash placeholders instead of fabricated zeros.
 */
export function normalizeFnuggStatus(raw: FnuggResortResponse | null | undefined): BjorliFnuggStatus {
  const src = raw?._source;
  if (!src) return { ...EMPTY_FNUGG_STATUS };

  const top = src.conditions?.combined?.top;
  // Prefer the explicit `depth`, fall back to `depth_slope` (current Fnugg
  // schema) and finally `depth_terrain` (off-piste / terrain depth).
  const snowDepth = toNumber(top?.snow?.depth) ?? toNumber(top?.snow?.depth_slope);
  const snowDepthTerrain = toNumber(top?.snow?.depth_terrain);

  // Temperature can be a number, a numeric string, or an object `{ value }`.
  const rawTemp = top?.temperature;
  const tempC =
    rawTemp && typeof rawTemp === 'object' && !Array.isArray(rawTemp)
      ? toNumber((rawTemp as FnuggTemperatureObject).value)
      : toNumber(rawTemp as number | string | null | undefined);

  return {
    liftsOpen: toNumber(src.lifts?.open),
    liftsTotal: toNumber(src.lifts?.count),
    slopesOpen: toNumber(src.slopes?.open),
    slopesTotal: toNumber(src.slopes?.count),
    snowDepthCm: snowDepth ?? snowDepthTerrain,
    temperatureC: tempC,
    resortOpen: toBool(src.resort_open),
    lastUpdated: typeof src.last_updated === 'string' ? src.last_updated : null,
  };
}

/**
 * Fetch + normalize the live Bjorli status from Fnugg.
 * Throws on network/HTTP errors so the caller can decide on a fallback.
 */
export async function fetchBjorliFnuggStatus(signal?: AbortSignal): Promise<BjorliFnuggStatus> {
  const res = await fetch(FNUGG_ENDPOINT, {
    signal,
    // Browser/CDN cache hint — actual server caching belongs in the future
    // Next.js Route Handler with `revalidate`.
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Fnugg request failed: HTTP ${res.status}`);
  }
  const json = (await res.json()) as FnuggResortResponse;
  return normalizeFnuggStatus(json);
}

// ============================================================
// Blog / "driftsmelding" posts
// ============================================================

/** Raw Fnugg search hit (loose typing — only fields we read). */
export interface FnuggBlogPostSource {
  id?: number | string;
  post_id?: number | string;
  ID?: number | string;
  site_id?: number | string;
  /** Plain string in the live API. Object form kept defensively. */
  title?: string | { rendered?: string };
  /** Post body HTML. */
  description?: string;
  content?: string | { rendered?: string };
  excerpt?: string | { rendered?: string };
  date?: string;
  created_at?: string;
  modified?: string;
  modified_at?: string;
  image?: string;
  featured_image?: string | { url?: string; source_url?: string };
  thumbnail?: string;
  /** Nested map of image URLs by device + scale + crop — unused on homepage. */
  images?: Record<string, unknown>;
}

export interface FnuggSearchHit {
  _id?: string;
  _source?: FnuggBlogPostSource;
}

export interface FnuggSearchResponse {
  hits?: { hits?: FnuggSearchHit[] } | FnuggSearchHit[];
}

export interface BjorliFnuggPost {
  id: string;
  title: string | null;
  descriptionHtml: string | null;
  descriptionText: string | null;
  date: string | null;
  modified: string | null;
  imageUrl: string | null;
}

const pickString = (
  v: string | { rendered?: string; url?: string; source_url?: string } | undefined | null,
): string | null => {
  if (!v) return null;
  if (typeof v === 'string') return v;
  return v.rendered || v.source_url || v.url || null;
};

/**
 * Strip HTML to plain text safely without rendering it.
 * Drops <script>, <style>, images, and converts common block tags to newlines.
 * Pure string operation — no DOM required, so it works in SSR / Node too.
 */
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>(\s*)/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Truncate at a word/sentence boundary, preserving meaningful line breaks. */
export function truncateExcerpt(text: string, max = 420): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastBreak = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('\n'), slice.lastIndexOf(' '));
  return (lastBreak > max * 0.6 ? slice.slice(0, lastBreak) : slice).trimEnd() + '…';
}

export function normalizeFnuggPost(hit: FnuggSearchHit | null | undefined): BjorliFnuggPost | null {
  const src = hit?._source;
  if (!src) return null;
  // Live Fnugg `_id` is `{site_id}_{post_id}` (e.g. "177_2244").
  const composedId =
    src.site_id !== undefined && (src.id ?? src.post_id ?? src.ID) !== undefined
      ? `${src.site_id}_${src.id ?? src.post_id ?? src.ID}`
      : '';
  const id = String(hit?._id ?? composedId ?? '');
  const title = pickString(src.title);
  const html =
    (src.description ? src.description : null) ||
    pickString(src.content) ||
    pickString(src.excerpt);
  const text = html ? htmlToText(html) : null;
  const date = src.date || src.created_at || null;
  const modified = src.modified || src.modified_at || null;
  // Image intentionally not surfaced in homepage Driftsmelding box; keep field
  // populated so a future article page can reuse the same normalized shape.
  const imageUrl = pickString(src.featured_image) || src.image || src.thumbnail || null;
  if (!id && !title && !text) return null;
  return {
    id: id || `${date ?? 'post'}-${(title ?? '').slice(0, 16)}`,
    title,
    descriptionHtml: html,
    descriptionText: text,
    date,
    modified,
    imageUrl,
  };
}

export function normalizeFnuggPosts(json: FnuggSearchResponse | null | undefined): BjorliFnuggPost[] {
  if (!json) return [];
  const raw = Array.isArray(json.hits) ? json.hits : json.hits?.hits ?? [];
  return raw.map(normalizeFnuggPost).filter((p): p is BjorliFnuggPost => Boolean(p));
}

/**
 * Fetch the latest Bjorli driftsmeldinger from Fnugg blog index.
 * Tries the documented `include=<resortId>` first; if that returns nothing
 * (Fnugg occasionally requires a different filter), falls back to facet and
 * then a free-text "Bjorli" query so we still surface a reasonable post.
 */
/**
 * Fetch the latest Bjorli driftsmeldinger from Fnugg blog index.
 *
 * Uses `facet=site:177` (verified to scope correctly to Bjorli) and falls
 * back to a free-text `q=Bjorli` query only if the facet endpoint fails.
 * Every returned hit is **defensively re-filtered by `site_id === 177`** so
 * a stray cross-resort hit can never reach the UI.
 */
export async function fetchBjorliFnuggPosts(
  size = 3,
  signal?: AbortSignal,
): Promise<BjorliFnuggPost[]> {
  const strategies: Array<'facet' | 'q'> = ['facet', 'q'];
  for (const strategy of strategies) {
    try {
      const res = await fetch(buildBlogUrl(strategy, size), {
        signal,
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) continue;
      const json = (await res.json()) as FnuggSearchResponse;
      const raw = Array.isArray(json.hits) ? json.hits : json.hits?.hits ?? [];
      // Hard guard: Fnugg's `include=` is misleading and even `q=` may bring
      // in posts from other resorts. Only accept Bjorli (site_id 177).
      const bjorliOnly = raw.filter((h) => Number(h?._source?.site_id) === FNUGG_RESORT_ID);
      const posts = bjorliOnly.map(normalizeFnuggPost).filter((p): p is BjorliFnuggPost => Boolean(p));
      if (posts.length > 0) return posts;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') throw e;
      // try next strategy
    }
  }
  return [];
}