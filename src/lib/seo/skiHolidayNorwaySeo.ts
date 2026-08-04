/**
 * Single source of truth for the EN-only "Ski Holiday in Norway" landing.
 *
 * The route, title and description live here so the React page, the CMS
 * fixture, `routeSeo.ts` (and therefore SEOHead / PageMeta) and the
 * build-time prerender all read exactly the same values. The wording was
 * moved verbatim out of `SEO_LANDING_FIXTURES['en/ski-holiday-norway']`
 * in `src/lib/cms/mockAdapter.ts` — change it here and every consumer
 * follows.
 *
 * Dependency-free on purpose: `scripts/prerender.ts` imports this at build
 * time under Node, so it must not pull in React, images or CMS code.
 */

/** Bare slug, no locale prefix. */
export const SKI_HOLIDAY_NORWAY_SLUG = 'ski-holiday-norway';

/** The one real route for this page — EN-only, NOT under /en. */
export const SKI_HOLIDAY_NORWAY_PATH = '/ski-holiday-norway';

/** The only locale this landing page ships in. */
export const SKI_HOLIDAY_NORWAY_LOCALE = 'en' as const;

export const SKI_HOLIDAY_NORWAY_SEO = {
  title: 'Ski Holiday in Norway | Discover Bjorli Skisenter',
  description:
    'Plan a ski holiday in Norway at Bjorli, a family-friendly mountain destination with alpine skiing, cross-country trails, reliable winter conditions, accommodation, webcams and easy access by road and train.',
} as const;