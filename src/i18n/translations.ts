import no from './locales/no';
import en from './locales/en';
import de from './locales/de';
import nl from './locales/nl';
import da from './locales/da';
import sv from './locales/sv';
import type { Dictionary, Locale } from './locales/types';

export type { Locale, Dictionary };
export { LOCALES, LOCALE_LABELS, LOCALE_PREFIX } from './locales/types';

/** New destination-website dictionaries (NO/EN/DE/NL/DA/SV). Use via useLanguage(). */
export const dictionaries: Record<Locale, Dictionary> = { no, en, de, nl, da, sv };


export { translations } from './legacyTranslations';
