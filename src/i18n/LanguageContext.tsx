import { useEffect, useMemo, useState, ReactNode } from 'react';
import { translations, dictionaries, Locale, LOCALES, LOCALE_PREFIX } from './translations';
import { LanguageContext } from './languageContextCore';
import { translatePath } from './routes';
export { useLanguage } from './languageContextCore';

/** Detects locale from the current URL pathname (works outside Router too). */
const detectLocaleFromPath = (pathname: string): Locale => {
  const seg = pathname.split('/').filter(Boolean)[0];
  if (seg && (LOCALES as string[]).includes(seg) && seg !== 'no') return seg as Locale;
  return 'no';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const initial = typeof window !== 'undefined' ? detectLocaleFromPath(window.location.pathname) : 'no';
  const [locale, setLocaleState] = useState<Locale>(initial);

  /**
   * setLocale updates the URL to reflect the new locale prefix and updates state.
   * Norwegian is at the root (no prefix). Other locales are prefixed with /<locale>.
   */
  const setLocale = (next: Locale) => {
    if (typeof window === 'undefined') {
      setLocaleState(next);
      return;
    }
    const { pathname, search, hash } = window.location;
    // Detect current locale from URL to drive the slug translation.
    const segments = pathname.split('/').filter(Boolean);
    const first = segments[0];
    const currentLocale: Locale =
      first && (LOCALES as string[]).includes(first) && first !== 'no'
        ? (first as Locale)
        : 'no';
    // Translate the first path segment from current → next locale,
    // preserving any deeper segments (e.g. /nyheter/abc → /news/abc).
    const translated = translatePath(pathname, currentLocale, next);
    const cleaned = translated === '/' ? '' : translated.replace(/\/$/, '');
    const newPath = (LOCALE_PREFIX[next] || '') + (cleaned || '/');
    window.history.pushState({}, '', newPath + search + hash);
    setLocaleState(next);
  };

  // Listen for browser back/forward to keep state in sync with URL.
  useEffect(() => {
    const onPop = () => setLocaleState(detectLocaleFromPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const value = useMemo(() => {
    const legacyLocale = (['no', 'en', 'da', 'nl'] as Locale[]).includes(locale) ? locale : 'no';
    const t = (translations as unknown as Record<string, typeof translations['no']>)[legacyLocale];
    const d = dictionaries[locale];
    return { locale, setLocale, t, d };
  }, [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
