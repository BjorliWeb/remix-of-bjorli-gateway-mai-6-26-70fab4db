/**
 * Internal / non-public routes that must never be indexed in production.
 *
 * These routes are deliberately excluded from sitemap.xml and from the
 * prerender registry, but that alone does not stop a crawler that finds
 * the URL some other way: SEOHead otherwise resolves every production
 * route to `index,follow`. This module is the single source of truth so
 * one central robots decision applies, instead of competing per-page
 * effects.
 *
 * Matching is prefix-based on the raw pathname (these routes are not
 * localized, so no locale prefix stripping is applied).
 */
export const INTERNAL_NOINDEX_PREFIXES: ReadonlyArray<string> = [
  '/admin',
  '/hero-compare',
  '/image-inventory',
];

export const isInternalNoindexPath = (pathname: string): boolean => {
  const clean = ('/' + pathname.replace(/^\/+/, '')).replace(/\/+$/, '') || '/';
  return INTERNAL_NOINDEX_PREFIXES.some(
    (p) => clean === p || clean.startsWith(p + '/'),
  );
};
