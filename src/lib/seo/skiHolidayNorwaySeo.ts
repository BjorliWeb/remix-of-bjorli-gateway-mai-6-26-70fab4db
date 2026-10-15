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

/**
 * The one real URL for this page — EN-only, under /en like every other
 * English page so the language context, navigation and html lang are
 * English. The old un-prefixed /ski-holiday-norway 301s here
 * (public/_redirects).
 */
export const SKI_HOLIDAY_NORWAY_PATH = '/en/ski-holiday-norway';

/** The only locale this landing page ships in. */
export const SKI_HOLIDAY_NORWAY_LOCALE = 'en' as const;

export const SKI_HOLIDAY_NORWAY_SEO = {
  title: 'Ski Holiday in Norway at Bjorli | Family Skiing & Cabins',
  description:
    'Plan a family ski holiday in Norway at Bjorli: alpine and cross-country skiing, ski school, ski hire and cabins. Ålesund Airport is around 2½ hours away by car.',
} as const;