/**
 * Event archiving rules.
 *
 * An event is archived at 00:00 Europe/Oslo on the first calendar day AFTER
 * its end date. The Oslo "today" is derived with Intl, so Norwegian summer
 * time (CEST) and winter time (CET) are both handled without any date math.
 *
 * Events without an end date are never archived automatically — that is a
 * data gap, reported by the editorial team, not something to guess at.
 */
import { LOCALE_PREFIX, type Locale } from '@/i18n/locales/types';
import { slugForCanonical } from '@/i18n/routes';
import { normalizeInternalPath } from '@/lib/url/normalizeInternalPath';

export const OSLO_TIME_ZONE = 'Europe/Oslo';

const osloFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: OSLO_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Current calendar date in Europe/Oslo as `YYYY-MM-DD`. */
export const osloToday = (now: Date = new Date()): string => osloFormatter.format(now);

export interface ArchivableEvent {
  /** ISO `YYYY-MM-DD` last day of the event. */
  endsAt?: string;
  status?: string;
}

/**
 * True when the event belongs in the archive:
 *  - explicitly marked `archived`, or
 *  - its end date is before today in Europe/Oslo.
 */
export const isEventArchived = (event: ArchivableEvent, now: Date = new Date()): boolean => {
  if (event.status === 'archived') return true;
  const end = event.endsAt?.slice(0, 10);
  if (!end || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return false;
  return osloToday(now) > end;
};

/** Sort key for the archive: most recently finished first. */
export const compareArchivedEvents = (a: ArchivableEvent, b: ArchivableEvent): number =>
  (b.endsAt ?? '').localeCompare(a.endsAt ?? '');

/** Localized child slug for the event archive page. */
export const EVENTS_ARCHIVE_SLUG: Record<Locale, string> = {
  no: 'arkiv',
  en: 'archive',
  de: 'archiv',
  nl: 'archief',
  da: 'arkiv',
  sv: 'arkiv',
};

/**
 * Route path WITHOUT the locale prefix — App.tsx nests locale prefixes
 * (`/en/*`) around the same route table, so routes are registered unprefixed.
 */
export const eventsArchiveRoutePath = (locale: Locale): string =>
  `/${slugForCanonical('arrangementer', locale)}/${EVENTS_ARCHIVE_SLUG[locale]}`;

/** `/arrangementer/arkiv`, `/en/events/archive`, … (trailing slash normalized). */
export const eventsArchivePath = (locale: Locale): string =>
  normalizeInternalPath(
    `${LOCALE_PREFIX[locale] || ''}/${slugForCanonical('arrangementer', locale)}/${EVENTS_ARCHIVE_SLUG[locale]}`,
  );

/** True for any locale's archive path (locale prefix included or not). */
export const isEventsArchivePath = (pathname: string): boolean => {
  const clean = '/' + pathname.replace(/^\/+/, '').replace(/\/+$/, '');
  return (Object.keys(EVENTS_ARCHIVE_SLUG) as Locale[]).some(
    (loc) => eventsArchivePath(loc).replace(/\/+$/, '') === clean.replace(/\/+$/, ''),
  );
};

/**
 * SEO strings for the archive hub. Defined here (plain data, no imports)
 * so the React app and the Node prerenderer read the exact same copy.
 */
export const EVENTS_ARCHIVE_SEO: Record<Locale, { title: string; description: string }> = {
  no: {
    title: 'Tidligere arrangementer på Bjorli | Arkiv',
    description:
      'Arkiv over arrangementer på Bjorli, Lesja og i Romsdalen som er avsluttet. Sidene ligger åpne, så gamle lenker fortsatt virker.',
  },
  en: {
    title: 'Past events at Bjorli | Archive',
    description:
      'Archive of finished events at Bjorli, Lesja and in Romsdalen. The pages stay online so older links keep working.',
  },
  de: {
    title: 'Vergangene Veranstaltungen in Bjorli | Archiv',
    description:
      'Archiv beendeter Veranstaltungen in Bjorli, Lesja und im Romsdalen. Die Seiten bleiben online, damit alte Links weiter funktionieren.',
  },
  nl: {
    title: 'Afgelopen evenementen in Bjorli | Archief',
    description:
      'Archief van afgelopen evenementen in Bjorli, Lesja en Romsdalen. De pagina’s blijven online, zodat oude links blijven werken.',
  },
  da: {
    title: 'Tidligere arrangementer på Bjorli | Arkiv',
    description:
      'Arkiv over afsluttede arrangementer på Bjorli, Lesja og i Romsdalen. Siderne bliver liggende, så gamle links stadig virker.',
  },
  sv: {
    title: 'Tidigare evenemang på Bjorli | Arkiv',
    description:
      'Arkiv över avslutade evenemang på Bjorli, Lesja och i Romsdalen. Sidorna ligger kvar så att gamla länkar fortsätter fungera.',
  },
};
