import { safeHttpUrl } from '@/lib/events/httpUrl';

export type EventActionKind = 'ticket' | 'registration' | 'website';

export interface EventAction {
  kind: EventActionKind;
  href: string;
  label: string;
  primary: boolean;
}

export interface EventActionLinks {
  ticketUrl?: string | null;
  registrationUrl?: string | null;
  website?: string | null;
}

export interface EventActionLabels {
  ticket: string;
  registration: string;
  website: string;
}

/**
 * Buttons for a submitted event, in fixed priority order: Kjøp billett,
 * Påmelding, Nettside. Only filled, safe http(s) links produce a button; the
 * first one gets the primary style, the rest are secondary. Empty input gives
 * an empty list (no button, no placeholder).
 */
export function buildEventActions(links: EventActionLinks, labels: EventActionLabels): EventAction[] {
  const candidates: Array<[EventActionKind, string | undefined]> = [
    ['ticket', safeHttpUrl(links.ticketUrl)],
    ['registration', safeHttpUrl(links.registrationUrl)],
    ['website', safeHttpUrl(links.website)],
  ];
  return candidates
    .filter((c): c is [EventActionKind, string] => Boolean(c[1]))
    .map(([kind, href], i) => ({ kind, href, label: labels[kind], primary: i === 0 }));
}

/** True when at least one of the new action links (ticket/registration) is usable. */
export const hasNewActionLinks = (links: EventActionLinks): boolean =>
  Boolean(safeHttpUrl(links.ticketUrl) || safeHttpUrl(links.registrationUrl));
