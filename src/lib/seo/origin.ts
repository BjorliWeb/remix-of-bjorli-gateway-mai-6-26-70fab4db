/**
 * Production origin detection.
 *
 * Used by SEOHead to decide whether to allow indexing. Lovable preview
 * deployments, staging, and localhost should NEVER be indexed — only the
 * canonical production origins below.
 *
 * NOTE: hosting (Vercel/Netlify) should ALSO send `X-Robots-Tag: noindex`
 * for non-production deployments as a defence-in-depth measure. Meta tags
 * alone are not enough if a crawler ignores them.
 * TODO(prod): configure platform-level X-Robots-Tag for preview/staging.
 */
export const PRODUCTION_ORIGINS: ReadonlyArray<string> = [
  'https://www.bjorli.no',
  'https://bjorli.no',
];

export const isProductionOrigin = (origin?: string): boolean => {
  const o = origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  return PRODUCTION_ORIGINS.includes(o);
};