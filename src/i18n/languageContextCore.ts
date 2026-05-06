import { createContext, useContext } from 'react';
import type { Dictionary, Locale } from './locales/types';
import type { translations } from './translations';

type LegacyTranslationType = typeof translations['no'];

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Legacy translation surface used by existing sub-pages. */
  t: LegacyTranslationType;
  /** New destination-website dictionary (NO/EN/DE/NL/DA/SV). */
  d: Dictionary;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};