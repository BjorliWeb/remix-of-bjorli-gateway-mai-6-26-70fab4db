import { useLanguage } from './LanguageContext';
import type { Locale } from './locales/types';

/**
 * Pick a per-page copy object for the active locale.
 * Falls back to the Norwegian source when a locale is missing.
 */
export function usePageCopy<T>(copy: Record<Locale, T>): T {
  const { locale } = useLanguage();
  return copy[locale] ?? copy.no;
}
