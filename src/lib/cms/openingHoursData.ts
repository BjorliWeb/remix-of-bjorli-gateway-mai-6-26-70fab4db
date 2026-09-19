/**
 * Node-safe page data for /apningstider.
 *
 * Shared between the React page and the prerender script so the static
 * HTML contains the same title, hour strings and note as the live page.
 */
import type { Locale } from '@/i18n/locales/types';
import { translations } from '@/i18n/legacyTranslations';

export interface OpeningHoursPageData {
  language: Locale;
  title: string;
  subtitle: string;
  statusNow: string;
  hours: string[];
  note: string;
}

export const getOpeningHoursData = (language: Locale): OpeningHoursPageData => {
  const locale = language ?? 'no';
  const page = translations[locale]?.openingHoursPage ?? translations.no.openingHoursPage;
  return {
    language: locale,
    title: page.title,
    subtitle: page.subtitle,
    statusNow: page.statusNow,
    hours: [page.skiCenter, page.shop, page.restaurant],
    note: page.note,
  };
};
