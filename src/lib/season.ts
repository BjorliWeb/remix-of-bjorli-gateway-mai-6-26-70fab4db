/**
 * Seasonal routing helpers.
 *
 * The Bjorli site has two visual themes (winter + summer) that share
 * the same brand. Season is decided by route, not by date — this keeps
 * SEO predictable and matches the planned Next.js App Router structure
 * (where each route segment will own its season explicitly).
 */
import { LOCALE_PREFIX, type Locale } from '@/i18n/translations';

export type Season = 'winter' | 'summer';

/** Routes that should render with the summer theme. */
const SUMMER_PREFIXES = ['/sommer', '/fotturer', '/sykling', '/familie', '/sommer/korte-turer'] as const;

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
  return SUMMER_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
};

export const seasonForRoute = (pathname: string): Season =>
  isSummerRoute(pathname) ? 'summer' : 'winter';