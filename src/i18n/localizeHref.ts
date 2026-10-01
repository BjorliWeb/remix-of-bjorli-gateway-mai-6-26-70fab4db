/**
 * Pure (Node-safe) internal-link localizer — single source of truth for
 * turning a canonical Norwegian path into the locale's canonical URL.
 * Used by React (useLocalizedPath) and the build scripts (prerender).
 *
 *   localizeHref('/overnatting', 'en') -> '/en/accommodation/'
 *   localizeHref('/nyheter/abc', 'de') -> '/de/<news-slug>/abc/'
 *
 * External URLs, mailto:, tel: and #hash values are returned unchanged.
 */
import { LOCALE_PREFIX, type Locale } from './locales/types';
import { canonicalForSlug, slugForCanonical } from './routes';
import { normalizeInternalPath } from '../lib/url/normalizeInternalPath';

export const localizeHref = (path: string, locale: Locale): string => {
  if (!path) return path;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//') || path.startsWith('#')) return path;
  if (!path.startsWith('/')) path = '/' + path;
  const prefix = LOCALE_PREFIX[locale] || '';
  const qh = /^([^?#]*)([?#].*)?$/.exec(path);
  const pathname = qh?.[1] ?? path;
  const suffix = qh?.[2] ?? '';
  const [first, ...rest] = pathname.split('/').filter(Boolean);
  if (!first) return normalizeInternalPath((prefix || '/') + suffix);
  const canonical = canonicalForSlug('no', first);
  const head = canonical && canonical !== 'home' ? slugForCanonical(canonical, locale) || first : first;
  const tail = rest.length ? '/' + rest.join('/') : '';
  return normalizeInternalPath(prefix + '/' + head + tail + suffix);
};
