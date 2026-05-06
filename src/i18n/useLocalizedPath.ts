import { useLanguage } from './LanguageContext';
import { LOCALE_PREFIX, LOCALES, type Locale } from './translations';
import { canonicalForSlug, slugForCanonical } from './routes';

/**
 * Returns a function that prefixes an internal path with the active locale.
 * Norwegian is at the root (no prefix). Other locales: /en/..., /de/..., etc.
 *
 * Additionally translates the first path segment from its canonical
 * (Norwegian) slug to the active locale's slug. So `lp('/heiskort')` for
 * locale `en` returns `/en/ski-passes`.
 * Deeper segments (detail slugs etc.) are passed through unchanged.
 */
export const useLocalizedPath = () => {
  const { locale } = useLanguage();
  return (path: string): string => {
    if (!path.startsWith('/')) path = '/' + path;
    const prefix = LOCALE_PREFIX[locale];
    if (path === '/') return prefix || '/';
    // Translate first segment if we recognize it as a canonical NO slug.
    const segs = path.split('/').filter(Boolean);
    const [first, ...rest] = segs;
    const canonical = canonicalForSlug('no', first);
    let translatedFirst = first;
    if (canonical && canonical !== 'home') {
      translatedFirst = slugForCanonical(canonical, locale) || first;
    }
    const tail = rest.length ? '/' + rest.join('/') : '';
    const newPath = '/' + translatedFirst + tail;
    if (!prefix) return newPath;
    return prefix + newPath;
  };
};

/**
 * Strip any locale prefix AND translate the first segment back to its
 * canonical (Norwegian) slug, so callers always work with one stable key
 * regardless of which language URL the user is on.
 */
export const stripLocalePrefix = (pathname: string): { locale: Locale; path: string } => {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  let locale: Locale = 'no';
  let rest = segments;
  if (first && (LOCALES as string[]).includes(first) && first !== 'no') {
    locale = first as Locale;
    rest = segments.slice(1);
  }
  if (rest.length === 0) return { locale, path: '/' };
  const [head, ...tail] = rest;
  const canonical = canonicalForSlug(locale, head);
  if (!canonical || canonical === 'home') {
    // Unknown slug — return as-is so callers can still match (NotFound etc.)
    const passthrough = '/' + rest.join('/');
    return { locale, path: passthrough.replace(/\/$/, '') || '/' };
  }
  // Re-write head to canonical Norwegian slug so SEO/CMS lookups stay stable.
  const noHead = slugForCanonical(canonical, 'no');
  const tailPart = tail.length ? '/' + tail.join('/') : '';
  return { locale, path: '/' + noHead + tailPart };
};