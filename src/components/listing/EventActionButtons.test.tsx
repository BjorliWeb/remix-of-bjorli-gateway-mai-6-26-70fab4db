import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { LanguageContext } from '@/i18n/languageContextCore';
import { dictionaries, translations, type Locale } from '@/i18n/translations';
import EventOrganizerBlock from './EventOrganizerBlock';
import { buildEventActions } from '@/lib/events/eventActions';

const T = 'https://billett.example.no/kjop';
const R = 'https://pamelding.example.no/skjema';
const W = 'https://arrangor.example.no/';
const LABELS = { ticket: 'Kjøp billett', registration: 'Påmelding', website: 'Besøk nettsted' };

const withLocale = (locale: Locale, ui: ReactNode) => (
  <LanguageContext.Provider
    value={{ locale, setLocale: () => {}, d: dictionaries[locale], t: translations[locale === 'no' ? 'no' : 'en'] as never }}
  >
    {ui}
  </LanguageContext.Provider>
);

/** All 8 combinations of the three optional links. */
const COMBOS = [0, 1, 2, 3, 4, 5, 6, 7].map((n) => ({
  ticketUrl: n & 1 ? T : undefined,
  registrationUrl: n & 2 ? R : undefined,
  website: n & 4 ? W : undefined,
}));

describe('buildEventActions (all 8 combinations)', () => {
  it.each(COMBOS)('%o', (links) => {
    const actions = buildEventActions(links, LABELS);
    const expected = [
      links.ticketUrl && ['ticket', T],
      links.registrationUrl && ['registration', R],
      links.website && ['website', W],
    ].filter(Boolean) as Array<[string, string]>;
    expect(actions.map((a) => [a.kind, a.href])).toEqual(expected);
    // First available action is primary, the rest secondary.
    expect(actions.map((a) => a.primary)).toEqual(expected.map((_, i) => i === 0));
  });

  it('drops unsafe or empty links instead of rendering them', () => {
    const actions = buildEventActions(
      { ticketUrl: 'javascript:alert(1)', registrationUrl: '', website: 'data:text/html,x' },
      LABELS,
    );
    expect(actions).toEqual([]);
  });

  it('an unsafe ticket link does not take the primary slot', () => {
    const actions = buildEventActions({ ticketUrl: 'javascript:x', registrationUrl: R }, LABELS);
    expect(actions).toEqual([{ kind: 'registration', href: R, label: 'Påmelding', primary: true }]);
  });
});

const block = (links: { ticketUrl?: string; registrationUrl?: string; website?: string }, locale: Locale = 'no') =>
  render(withLocale(locale, (
    <EventOrganizerBlock event={{ organizer: 'Bjorli IL', location: 'Bjorli', language: 'no', ...links }} />
  )));

describe('EventOrganizerBlock buttons on the public page', () => {
  it.each(COMBOS)('renders the right buttons for %o', (links) => {
    const { container } = block(links);
    const buttons = [...container.querySelectorAll('a[target="_blank"]')]
      .filter((a) => /billett|pamelding|arrangor/.test(a.getAttribute('href') ?? ''));
    const hrefs = buttons.map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([links.ticketUrl, links.registrationUrl, links.website].filter(Boolean));
    for (const a of buttons) {
      expect(a.getAttribute('rel')).toContain('noopener');
      expect(a.getAttribute('rel')).toContain('noreferrer');
    }
    // No placeholder for missing links.
    if (!links.ticketUrl) expect(screen.queryByText('Kjøp billett')).toBeNull();
    if (!links.registrationUrl) expect(screen.queryByText('Påmelding')).toBeNull();
  });

  it('existing events (website only) render exactly as before: outline style, no new buttons', () => {
    const { container } = block({ website: W });
    const a = container.querySelector(`a[href="${W}"]`)!;
    expect(a).toHaveTextContent('Besøk nettsted');
    expect(a.className).toContain('border-foreground/20');
    expect(a.getAttribute('rel')).toBe('noopener noreferrer nofollow');
    expect(container.querySelector('[data-event-action]')).toBeNull();
  });

  it('first available action gets the primary button style, the others outline', () => {
    const { container } = block({ ticketUrl: T, registrationUrl: R, website: W });
    const [t, r, w] = [...container.querySelectorAll('[data-event-action]')];
    expect(t).toHaveAttribute('data-event-action', 'ticket');
    expect(t.className).toContain('bg-primary');
    expect(r.className).toContain('border');
    expect(r.className).not.toContain('bg-primary');
    expect(w).toHaveTextContent('Besøk nettsted');
    expect(w.className).not.toContain('bg-primary');
  });

  it('registration becomes primary when there is no ticket link', () => {
    const { container } = block({ registrationUrl: R, website: W });
    const [r] = [...container.querySelectorAll('[data-event-action]')];
    expect(r).toHaveAttribute('data-event-action', 'registration');
    expect(r.className).toContain('bg-primary');
  });

  it('no links at all: no buttons and no empty button area content', () => {
    const { container } = block({});
    expect(container.querySelectorAll('a[target="_blank"]')).toHaveLength(0);
  });

  it('never renders an unsafe stored link', () => {
    const { container } = block({ website: 'javascript:alert(1)' });
    expect(container.querySelector('a[href^="javascript"]')).toBeNull();
  });

  it.each([
    ['no', 'Kjøp billett', 'Påmelding', 'Besøk nettsted'],
    ['en', 'Buy tickets', 'Register', 'Visit website'],
    ['de', 'Tickets kaufen', 'Anmeldung', 'Website besuchen'],
    ['nl', 'Tickets kopen', 'Aanmelden', 'Website bezoeken'],
    ['da', 'Køb billet', 'Tilmelding', 'Besøg hjemmeside'],
    ['sv', 'Köp biljett', 'Anmälan', 'Besök webbplats'],
  ] as const)('labels follow the page language (%s)', (locale, ticket, register, website) => {
    const { container } = block({ ticketUrl: T, registrationUrl: R, website: W }, locale);
    const actions = container.querySelectorAll('[data-event-action]');
    expect(within(actions[0] as HTMLElement).getByText(ticket)).toBeTruthy();
    expect(within(actions[1] as HTMLElement).getByText(register)).toBeTruthy();
    expect(within(actions[2] as HTMLElement).getByText(website)).toBeTruthy();
    // URLs are shared across languages.
    expect(actions[0].getAttribute('href')).toBe(T);
  });
});
