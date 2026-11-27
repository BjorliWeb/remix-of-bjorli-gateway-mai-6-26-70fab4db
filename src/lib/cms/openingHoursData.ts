/**
 * Node-safe page data for /apningstider.
 *
 * Shared between the React page and the prerender script so the static
 * HTML contains the same title, sections and hour strings as the live page.
 * Season dates and times come from src/lib/openingHours/season.ts (single
 * source); wording from src/lib/openingHours/seasonView.ts.
 */
import type { Locale } from '@/i18n/locales/types';
import { translations } from '@/i18n/legacyTranslations';
import {
  buildSections, fjellkafeNovemberActive, fjellkafeNovemberRows, openingHoursCopy, type Row, type Section,
} from '@/lib/openingHours/seasonView';
import { osloToday } from '@/lib/openingHours/season';

export interface OpeningHoursPageData {
  language: Locale;
  title: string;
  subtitle: string;
  statusNow: string;
  /** Planned ski-centre hours for the season, in display order. */
  sections: Section[];
  /** Other existing opening-hour lines (shop), unchanged. */
  hours: string[];
  /** Bjorli Fjellkafe: November 2026 hours while they apply, then the lift-hours text. */
  fjellkafe: { title: string; subtitle?: string; rows: Row[]; text?: string };
  note: string;
}

export const getOpeningHoursData = (language: Locale, today: string = osloToday()): OpeningHoursPageData => {
  const locale = language ?? 'no';
  const page = translations[locale]?.openingHoursPage ?? translations.no.openingHoursPage;
  return {
    language: locale,
    title: page.title,
    subtitle: page.subtitle,
    statusNow: page.statusNow,
    sections: buildSections(locale, today),
    // The old generic ski-centre line ("10:00–16:00 in season") is replaced by
    // the season plan; the Heiskroa line by Bjorli Fjellkafe (owner, 27.11.2026).
    hours: [page.shop],
    fjellkafe: fjellkafeNovemberActive(today)
      ? { title: 'Bjorli Fjellkafe', subtitle: openingHoursCopy(locale).fjellkafeNovemberTitle, rows: fjellkafeNovemberRows(locale) }
      : { title: 'Bjorli Fjellkafe', rows: [], text: openingHoursCopy(locale).fjellkafe },
    note: page.note,
  };
};
