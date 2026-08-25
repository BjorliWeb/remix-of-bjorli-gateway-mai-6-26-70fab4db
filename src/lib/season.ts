/**
 * Seasonal routing helpers.
 *
 * The Bjorli site has two visual themes (winter + summer) that share
 * the same brand. Season is decided by route, not by date — this keeps
 * SEO predictable and matches the planned Next.js App Router structure
 * (where each route segment will own its season explicitly).
 */
import { LOCALE_PREFIX, type Locale } from '@/i18n/translations';
import { ROUTE_SLUGS, type CanonicalRoute } from '@/i18n/routes';

export type Season = 'winter' | 'summer';

/**
 * Default season for the root URL ("/") and any other route that has no
 * explicit season. Controls both:
 *   - which homepage component is rendered at "/" (see src/App.tsx)
 *   - which theme/tokens are applied at "/" (see isSummerRoute below)
 *
 * Winter-first from mid-September. Switch to "summer" again when Bjorli
 * moves back to summer-first positioning in spring.
 */
export const DEFAULT_SEASON: Season = 'winter';

/**
 * Canonical routes that should render with the summer theme.
 * We expand these to every locale's slug below so localized URLs
 * like /nl/zomer/korte-turer, /en/summer, /sv/cykling, etc. all
 * trigger the summer header CTA + theme.
 */
const SUMMER_CANONICALS: CanonicalRoute[] = [
  'sommer', 'fotturer', 'sykling', 'familie', 'fiske',
  'gardsbesok', 'sagelva', 'golden-train', 'romsdalsgondolen',
];

/** Set of localized first-segment slugs (no leading slash) that are summer routes. */
const SUMMER_SLUGS: Set<string> = (() => {
  const out = new Set<string>();
  SUMMER_CANONICALS.forEach((c) => {
    Object.values(ROUTE_SLUGS[c]).forEach((s) => { if (s) out.add(s); });
  });
  return out;
})();

/** Strip a locale prefix (/en, /de, …) so we can match on the canonical path. */
const stripLocale = (pathname: string): string => {
  const segs = pathname.split('/').filter(Boolean);
  if (!segs.length) return '/';
  const first = segs[0] as Locale;
  if (first in LOCALE_PREFIX && first !== 'no') {
    return '/' + segs.slice(1).join('/');
  }
  return pathname;
};

export const isSummerRoute = (pathname: string): boolean => {
  const path = stripLocale(pathname);
  const first = path.split('/').filter(Boolean)[0];
  // Root / locale-root URL: defer to DEFAULT_SEASON so the homepage theme
  // matches whichever homepage component is rendered at "/".
  if (!first) return DEFAULT_SEASON === 'summer';
  return SUMMER_SLUGS.has(first);
};

export const seasonForRoute = (pathname: string): Season =>
  isSummerRoute(pathname) ? 'summer' : 'winter';