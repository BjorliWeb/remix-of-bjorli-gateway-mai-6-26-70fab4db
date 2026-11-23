import { describe, expect, it, vi } from 'vitest';
import {
  normalizeFnuggStatus,
  resolveFreshness,
  resolveOperationalState,
  osloParts,
  EMPTY_FNUGG_STATUS,
  type FnuggResortResponse,
} from './fnugg';

const hours = (closedWeekdays: boolean) => ({
  monday: { from: '10:00', to: '16:00', closed: closedWeekdays },
  tuesday: { from: '10:00', to: '16:00', closed: closedWeekdays },
  wednesday: { from: '10:00', to: '16:00', closed: closedWeekdays },
  thursday: { from: '10:00', to: '16:00', closed: closedWeekdays },
  friday: { from: '10:00', to: '16:00', closed: closedWeekdays },
  saturday: { from: '10:00', to: '16:00', closed: false },
  sunday: { from: '10:00', to: '16:00', closed: false },
  exception_days: [],
});

/** Documented Fnugg response for resort 177 on 23.11.2026. */
const fixture = (over: Record<string, unknown> = {}): FnuggResortResponse => ({
  _source: {
    resort_open: true,
    resort_open_override: true,
    resort_opening_date: '2026-11-21T00:00:00Z',
    resort_closing_date: '2027-04-18T00:00:00Z',
    opening_hours: hours(true),
    lifts: { open: 0, count: 6 },
    slopes: { open: 0, count: 11 },
    last_updated: '2026-11-23T13:14:04Z',
    ...over,
  } as never,
});

const at = (iso: string) => new Date(iso);
const state = (over: Record<string, unknown>, now: string) =>
  resolveOperationalState(normalizeFnuggStatus(fixture(over)), at(now));

describe('resolveOperationalState', () => {
  it('23.11.2026 documented data → closed (not open)', () => {
    const s = normalizeFnuggStatus(fixture());
    expect(s.liftsOpen).toBe(0);
    expect(s.liftsTotal).toBe(6);
    expect(s.slopesTotal).toBe(11);
    expect(resolveOperationalState(s, at('2026-11-23T13:34:00Z'))).toBe('closed');
  });
  it('in season with ≥1 open lift → open', () => {
    expect(state({ lifts: { open: 2, count: 6 }, last_updated: '2026-11-28T11:00:00Z' }, '2026-11-28T11:10:00Z')).toBe('open');
  });
  it('in season with 0 open lifts (temporarily closed) → closed', () => {
    expect(state({ last_updated: '2026-11-28T11:00:00Z' }, '2026-11-28T11:10:00Z')).toBe('closed');
  });
  it('before season start → seasonClosed', () => {
    expect(state({}, '2026-11-20T12:00:00Z')).toBe('seasonClosed');
  });
  it('after season end → seasonClosed', () => {
    expect(state({}, '2027-04-19T12:00:00Z')).toBe('seasonClosed');
  });
  it('season dates are inclusive Oslo calendar days', () => {
    // 21.11 00:30 Oslo = 20.11 23:30 UTC → first day, in season
    expect(state({}, '2026-11-20T23:30:00Z')).toBe('closed');
    // 20.11 23:30 Oslo = 22:30 UTC → still before
    expect(state({}, '2026-11-20T22:30:00Z')).toBe('seasonClosed');
    // 18.04.2027 23:30 Oslo (CEST) = 21:30 UTC → last day, in season
    expect(state({}, '2027-04-18T21:30:00Z')).toBe('closed');
    // 19.04 00:30 Oslo = 18.04 22:30 UTC → after
    expect(state({}, '2027-04-18T22:30:00Z')).toBe('seasonClosed');
  });
  it('resort_open false → seasonClosed', () => {
    expect(state({ resort_open: false, lifts: { open: 3, count: 6 } }, '2026-12-05T11:00:00Z')).toBe('seasonClosed');
  });
  it('missing API data → unavailable', () => {
    expect(resolveOperationalState(normalizeFnuggStatus(null), at('2026-12-05T11:00:00Z'))).toBe('unavailable');
    expect(resolveOperationalState({ ...EMPTY_FNUGG_STATUS }, at('2026-12-05T11:00:00Z'))).toBe('unavailable');
  });
  it('missing lift counts → unavailable', () => {
    expect(state({ lifts: {} }, '2026-11-23T13:34:00Z')).toBe('unavailable');
  });
  it('invalid lift counts → unavailable', () => {
    expect(state({ lifts: { open: 7, count: 6 } }, '2026-11-23T13:34:00Z')).toBe('unavailable');
    expect(state({ lifts: { open: -1, count: 6 } }, '2026-11-23T13:34:00Z')).toBe('unavailable');
    expect(state({ lifts: { open: 'x', count: 6 } }, '2026-11-23T13:34:00Z')).toBe('unavailable');
    expect(state({ lifts: { open: 0, count: 0 } }, '2026-11-23T13:34:00Z')).toBe('unavailable');
  });
  it('season flag + override alone never yield open', () => {
    expect(state({ lifts: { open: 0, count: 6 }, opening_hours: hours(false) }, '2026-11-23T11:00:00Z')).toBe('closed');
  });
  it('conflict: lifts open on scheduled closed day → open from lift counts, logged', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(state({ lifts: { open: 1, count: 6 } }, '2026-11-23T11:00:00Z')).toBe('open');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
  it('conflict: scheduled open day but 0 lifts → closed', () => {
    expect(state({ opening_hours: hours(false) }, '2026-11-23T11:00:00Z')).toBe('closed');
  });
  it('missing season dates → unavailable (season not confirmed)', () => {
    expect(state({ resort_opening_date: undefined }, '2026-11-23T13:34:00Z')).toBe('unavailable');
  });
});

describe('osloParts', () => {
  it('handles midnight and DST transitions', () => {
    expect(osloParts(at('2026-11-22T23:30:00Z'))).toMatchObject({ date: '2026-11-23', weekday: 'monday' });
    // 25.10.2026 01:30 UTC = 02:30 CET (after fall-back)
    expect(osloParts(at('2026-10-25T01:30:00Z')).minutes).toBe(150);
    // 28.03.2027 01:30 UTC = 03:30 CEST (after spring-forward)
    expect(osloParts(at('2027-03-28T01:30:00Z')).minutes).toBe(210);
  });
});

describe('resolveFreshness', () => {
  const s = (lu: string, h = hours(false)) =>
    normalizeFnuggStatus(fixture({ last_updated: lu, opening_hours: h }));
  it('≤30 min fresh, 30–120 reported, >120 during hours stale', () => {
    expect(resolveFreshness(s('2026-11-28T11:00:00Z'), at('2026-11-28T11:25:00Z'))).toBe('fresh');
    expect(resolveFreshness(s('2026-11-28T11:00:00Z'), at('2026-11-28T12:30:00Z'))).toBe('reported');
    expect(resolveFreshness(s('2026-11-28T09:00:00Z'), at('2026-11-28T12:30:00Z'))).toBe('stale');
  });
  it('off-hours: data from after last scheduled period stays reported, older is stale', () => {
    // Sat 28.11 closes 16:00 Oslo (15:00Z). Update 15:10Z, checked Sun 06:00 Oslo.
    expect(resolveFreshness(s('2026-11-28T15:10:00Z'), at('2026-11-29T05:00:00Z'))).toBe('reported');
    expect(resolveFreshness(s('2026-11-27T10:00:00Z'), at('2026-11-29T05:00:00Z'))).toBe('stale');
  });
  it('missing timestamp → stale', () => {
    expect(resolveFreshness({ ...EMPTY_FNUGG_STATUS }, at('2026-11-28T11:00:00Z'))).toBe('stale');
  });
});
