/**
 * Node-safe page data for /skiskole.
 *
 * Shared between the React page and the prerender script so the static
 * HTML contains the same title, description, offerings and external link
 * as the live page.
 */
import type { Locale } from '@/i18n/locales/types';
import { translations } from '@/i18n/legacyTranslations';

export interface SkiSchoolPageData {
  language: Locale;
  title: string;
  subtitle: string;
  description: string;
  offerings: readonly string[];
  externalUrl: string;
}

const SKI_SCHOOL_URL = 'https://intersportbjorli.no/skiskole';

export const getSkiSchoolData = (language: Locale): SkiSchoolPageData => {
  const locale = language ?? 'no';
  const page = translations[locale]?.skiSchoolPage ?? translations.no.skiSchoolPage;
  return {
    language: locale,
    title: page.title,
    subtitle: page.subtitle,
    description: page.desc,
    offerings: page.offerings,
    externalUrl: SKI_SCHOOL_URL,
  };
};
