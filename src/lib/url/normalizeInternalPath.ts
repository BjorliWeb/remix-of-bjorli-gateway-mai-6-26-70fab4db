/**
 * Internal URL normalization — single source of truth.
 *
 * Production (Cloudflare Pages) serves prerendered routes as directory
 * indexes and canonicalizes them to the trailing-slash form. Every internal
 * link, canonical, hreflang, og:url, JSON-LD url and sitemap <loc> must
 * therefore already use the trailing-slash form so it resolves with a direct
 * 200 instead of a 308.
 *
 * This module is intentionally PURE and dependency-free: no React, no
 * browser globals, no application imports. It is consumed both by the app
 * (useLocalizedPath, SEOHead, PageMeta, lib/seo/sitemap) and by the Node
 * build scripts (scripts/prerender.ts, scripts/build-sitemap.ts).
 */

/** Canonical production host — verified to answer 200 directly. */
export const CANONICAL_ORIGIN = 'https://bjorli.no';

/** Hosts that belong to this site and should be rewritten to the canonical origin. */
const SITE_HOSTS = ['bjorli.no', 'www.bjorli.no'] as const;

/** Any file extension, of any length (.pdf, .xml, .webmanifest, ...). */
const FILE_EXT = /\.[a-z0-9]+$/i;

/** Path prefixes that must never be reformatted (bare form and subtree). */
const EXCLUDED_PREFIXES = ['/api', '/assets', '/admin'] as const;

const isExcludedPrefix = (base: string): boolean =>
  EXCLUDED_PREFIXES.some((p) => base === p || base.startsWith(p + '/'));

/**
 * Add a trailing slash to an internal path when it is safe to do so.
 * Query strings and fragments are preserved; the slash goes before them.
 *
 * Left untouched: root `/`, already-slashed paths, file paths (any
 * extension), `/api`, `/assets`, `/admin` (and their subtrees), external /
 * protocol-relative / mailto: / tel: / bare `#hash` values.
 */
export const normalizeInternalPath = (path: string): string => {
  if (!path || !path.startsWith('/')) return path;
  if (path.startsWith('//')) return path;

  const m = /^([^?#]*)([?#].*)?$/.exec(path);
  const base = m?.[1] ?? path;
  const rest = m?.[2] ?? '';

  if (base === '' || base === '/' || base.endsWith('/')) return path;
  if (FILE_EXT.test(base)) return path;
  if (isExcludedPrefix(base)) return path;

  return base + '/' + rest;
};

/**
 * Build an absolute URL on the canonical origin.
 *
 * Accepts either a relative internal path or an already-absolute URL:
 *   /sommer                       -> https://bjorli.no/sommer/
 *   https://bjorli.no/sommer      -> https://bjorli.no/sommer/
 *   https://www.bjorli.no/sommer  -> https://bjorli.no/sommer/
 *   https://example.com/page      -> unchanged (external)
 *
 * Query strings and fragments are always preserved. `origin` may be
 * overridden (build scripts pass a preview origin via SITE_URL); the
 * host-rewrite rule only ever maps this site's own hosts.
 */
export const absoluteUrl = (input: string, origin: string = CANONICAL_ORIGIN): string => {
  if (!input) return origin + '/';
  const base = origin.replace(/\/$/, '');

  // Relative internal path.
  if (input.startsWith('/') && !input.startsWith('//')) {
    return base + normalizeInternalPath(input);
  }

  // Absolute (or protocol-relative) URL.
  const withScheme = input.startsWith('//') ? 'https:' + input : input;
  const match = /^([a-z][a-z0-9+.-]*:)\/\/([^/?#]+)([^]*)$/i.exec(withScheme);
  if (!match) return input; // mailto:, tel:, relative — leave alone

  const host = match[2].toLowerCase();
  const rest = match[3] || '/';
  const isSiteHost = (SITE_HOSTS as readonly string[]).includes(host.replace(/:\d+$/, ''));
  if (!isSiteHost) return input; // external URL — unchanged

  const path = rest.startsWith('/') ? rest : '/' + rest;
  return base + normalizeInternalPath(path);
};