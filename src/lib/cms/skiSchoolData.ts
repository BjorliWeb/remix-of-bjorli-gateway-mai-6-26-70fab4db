/**
 * Node-safe page data for /skiskole.
 *
 * Shared between the React page and the prerender script so the static
 * HTML contains the same title, description, offerings and contact CTA
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
  /** No confirmed online booking address exists, so the CTA is a contact
   *  request by email (the old intersportbjorli.no/skiskole link is 404). */
  contactLabel: string;
  contactEmail: string;
}

const SKI_SCHOOL_EMAIL = 'skisenter@bjorli.no';

export const getSkiSchoolData = (language: Locale): SkiSchoolPageData => {
  const locale = language ?? 'no';
  const page = translations[locale]?.skiSchoolPage ?? translations.no.skiSchoolPage;
  return {
    language: locale,
    title: page.title,
    subtitle: page.subtitle,
    description: page.desc,
    offerings: page.offerings,
    contactLabel: page.contactCta,
    contactEmail: SKI_SCHOOL_EMAIL,
  };
};
