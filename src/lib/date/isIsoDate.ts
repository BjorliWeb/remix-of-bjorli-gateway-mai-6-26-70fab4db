/**
 * Single source of truth for "is this a machine-readable date?".
 *
 * Used by BOTH build-time code (sitemap / prerender, via
 * `scripts/lib/cmsSnapshot.ts`) and runtime SEO code (`src/lib/cms/seo.ts`)
 * so structured data emitted before and after hydration always agrees.
 *
 * Editorial CMS content may carry human display dates such as
 * "31. juli – 7. august 2026". Those must never reach schema.org date fields.
 */
export const isIsoDate = (value?: string | null): boolean =>
  !!value && /^\d{4}-\d{2}-\d{2}(T[\d:.+Z-]+)?$/.test(value);
