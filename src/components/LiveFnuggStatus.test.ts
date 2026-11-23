import { describe, expect, it } from 'vitest';
import { todayLabel } from './LiveFnuggStatus';
import { normalizeFnuggStatus, EMPTY_FNUGG_STATUS } from '@/lib/integrations/fnugg';
import no from '@/i18n/locales/no';
import en from '@/i18n/locales/en';
import de from '@/i18n/locales/de';
import nl from '@/i18n/locales/nl';
import da from '@/i18n/locales/da';
import sv from '@/i18n/locales/sv';

const doc = normalizeFnuggStatus({
  _source: {
    resort_open: true,
    resort_opening_date: '2026-11-21T00:00:00Z',
    resort_closing_date: '2027-04-18T00:00:00Z',
    lifts: { open: 0, count: 6 },
    slopes: { open: 0, count: 11 },
    last_updated: '2026-11-23T13:14:04Z',
  },
} as never);
const now = new Date('2026-11-23T13:34:00Z');

describe('todayLabel on all six languages', () => {
  for (const [code, dict] of Object.entries({ no, en, de, nl, da, sv })) {
    it(`${code}: 23.11.2026 shows closed, never open`, () => {
      expect(todayLabel(doc, 'fresh', now, dict.live)).toBe(dict.live.closed);
    });
    it(`${code}: API failure without data shows unavailable`, () => {
      expect(todayLabel({ ...EMPTY_FNUGG_STATUS }, 'stale', now, dict.live)).toBe(dict.live.unavailable);
    });
    it(`${code}: stale open data is not confirmed`, () => {
      expect(todayLabel({ ...doc, liftsOpen: 3 }, 'stale', now, dict.live)).toBe(dict.live.unconfirmed);
    });
    it(`${code}: before season shows season closed`, () => {
      expect(todayLabel(doc, 'fresh', new Date('2026-11-01T12:00:00Z'), dict.live)).toBe(dict.live.seasonClosed);
    });
  }
});
