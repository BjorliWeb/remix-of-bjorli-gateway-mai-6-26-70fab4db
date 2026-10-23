import { isIsoDate } from '@/lib/date/isIsoDate';
import { CATEGORY_LABELS, EVENT_CATEGORY_KEYS, type EventCategoryKey } from '@/lib/eventCategories';

const BCP47: Record<string, string> = {
  no: 'nb-NO', en: 'en-GB', de: 'de-DE', nl: 'nl-NL', da: 'da-DK', sv: 'sv-SE',
};

/** ISO dates become natural text ("14. november 2026"); editorial display dates pass through. */
export function formatEventDate(date: string | undefined | null, locale: string): string {
  if (!date) return '';
  if (!isIsoDate(date)) return date;
  const d = new Date(date.length === 10 ? `${date}T12:00:00Z` : date);
  if (Number.isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat(BCP47[locale] ?? 'nb-NO', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo',
  }).format(d);
}

/** Internal category keys ("mat-drikke") become readable names; free text passes through. */
export function formatEventCategory(category: string | undefined | null, locale: string): string {
  if (!category) return '';
  if (!(EVENT_CATEGORY_KEYS as string[]).includes(category)) return category;
  const labels = locale === 'no' ? CATEGORY_LABELS.no : CATEGORY_LABELS.en;
  return labels[category as EventCategoryKey];
}
