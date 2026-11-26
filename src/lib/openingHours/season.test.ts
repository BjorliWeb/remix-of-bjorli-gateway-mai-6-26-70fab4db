import { describe, expect, it } from 'vitest';
import {
  CHRISTMAS, EASTER, EVENING, EXCEPTIONS, FJELLKAFE, LIFT1_EARLY, MINI_OPENING, REGULAR, WINTER_BREAK,
  closesAfterMidnight, dayPlan, eveningOn, isoWeek, isoWeekday, osloToday, uncoveredDates,
} from './season';

/** Owner-confirmed weekday statements (ISO: 1 = Monday … 7 = Sunday). */
describe('owner dates fall on the stated weekdays', () => {
  it.each([
    ['2026-11-21', 6, 'lørdag 21. november'],
    ['2026-11-22', 7, 'søndag 22. november'],
    ['2026-11-26', 4, 'torsdag 26. november (Heis 1 åpner)'],
    ['2026-12-06', 7, 'søndag 6. desember (Jibben Lever Tour)'],
    ['2026-12-13', 7, 'søndag 13. desember'],
    ['2026-12-25', 5, 'fredag 25. desember (kveldskjøring)'],
    ['2027-01-01', 5, 'fredag 1. januar (kveldskjøring)'],
    ['2027-03-19', 5, 'fredag 19. mars (siste kveldskjøring)'],
    ['2027-02-13', 6, 'helgen før uke 7 starter lørdag 13. februar'],
  ])('%s is weekday %i (%s)', (date, wd) => expect(isoWeekday(date)).toBe(wd));

  it('ISO weeks match the owner week numbers', () => {
    expect(isoWeek('2027-01-11')).toEqual({ year: 2027, week: 2 });
    expect(isoWeek('2027-02-14')).toEqual({ year: 2027, week: 6 });
    expect(isoWeek('2027-02-15')).toEqual({ year: 2027, week: 7 });
    expect(isoWeek('2027-02-28')).toEqual({ year: 2027, week: 8 });
    expect(isoWeek('2027-04-18')).toEqual({ year: 2027, week: 15 });
    // 1 Jan 2027 belongs to ISO week 53 of 2026 – week 1 of 2027 is 4–10 Jan.
    expect(isoWeek('2027-01-01')).toEqual({ year: 2026, week: 53 });
    expect(isoWeek('2027-01-04')).toEqual({ year: 2027, week: 1 });
  });
});

describe('owner facts are stored exactly', () => {
  it('periods and times', () => {
    expect(MINI_OPENING).toMatchObject({ start: '2026-11-21', end: '2026-11-22', hours: { open: '10:00', close: '16:00' } });
    expect(LIFT1_EARLY).toMatchObject({ start: '2026-11-26', end: '2026-12-13', hours: { open: '10:00', close: '16:00' } });
    expect(CHRISTMAS).toMatchObject({ start: '2026-12-16', end: '2027-01-03', hours: { open: '10:00', close: '16:00' } });
    expect(WINTER_BREAK).toMatchObject({ start: '2027-02-13', end: '2027-02-28', hours: { open: '10:00', close: '16:00' } });
    expect(EASTER).toMatchObject({ start: '2027-03-17', end: '2027-03-29', hours: { open: '10:00', close: '17:00' } });
    expect(REGULAR).toMatchObject({ weeks: [2, 3, 4, 5, 6, 9, 10, 11, 13, 14, 15], openDays: [3, 4, 5, 6, 7], groupsOnRequestDays: [1, 2] });
    expect(EVENING).toMatchObject({ weekday: 5, start: '2026-12-25', end: '2027-03-19', hours: { open: '17:00', close: '20:00' }, groomingWindow: { open: '16:00', close: '17:00' } });
    expect(EXCEPTIONS).toEqual([
      { date: '2026-12-24', hours: { open: '10:00', close: '14:00' } },
      { date: '2026-12-25', hours: { open: '12:00', close: '16:00' } },
      { date: '2027-01-01', hours: { open: '12:00', close: '16:00' } },
    ]);
  });
});

describe('dayPlan priority: date > holiday > early/special > regular', () => {
  it.each([
    ['2026-11-21', 'open', '10:00-16:00', 'miniOpening'],
    ['2026-11-26', 'open', '10:00-16:00', 'lift1'],
    ['2026-12-13', 'open', '10:00-16:00', 'lift1'],
    ['2026-12-16', 'open', '10:00-16:00', 'christmas'],
    ['2026-12-24', 'open', '10:00-14:00', 'exception'],
    ['2026-12-25', 'open', '12:00-16:00', 'exception'],
    ['2027-01-01', 'open', '12:00-16:00', 'exception'],
    ['2027-01-03', 'open', '10:00-16:00', 'christmas'],
    ['2027-01-12', 'groupsOnRequest', '', 'regular'], // Tuesday, week 2
    ['2027-01-13', 'open', '10:00-16:00', 'regular'], // Wednesday, week 2
    ['2027-02-13', 'open', '10:00-16:00', 'winterBreak'], // Saturday of week 6 – holiday wins
    ['2027-02-16', 'open', '10:00-16:00', 'winterBreak'], // Tuesday in winter break: open, not "groups"
    ['2027-03-16', 'groupsOnRequest', '', 'regular'], // Tuesday week 11, day before Easter
    ['2027-03-17', 'open', '10:00-17:00', 'easter'], // Easter overrides regular 10–16
    ['2027-03-22', 'open', '10:00-17:00', 'easter'], // Monday in Easter: open
    ['2027-03-29', 'open', '10:00-17:00', 'easter'], // Easter Monday (2. påskedag)
    ['2027-03-30', 'groupsOnRequest', '', 'regular'], // Tuesday week 13, after Easter
    ['2027-03-31', 'open', '10:00-16:00', 'regular'],
    ['2027-04-14', 'open', '10:00-16:00', 'regular'],
    ['2027-04-16', 'datesOnlyNoHours', '', 'closing'], // closing weekend: no invented times
    ['2027-04-18', 'datesOnlyNoHours', '', 'closing'],
  ])('%s → %s %s (%s)', (date, status, hours, source) => {
    const p = dayPlan(date);
    expect(p.status).toBe(status);
    expect(p.hours ? `${p.hours.open}-${p.hours.close}` : '').toBe(hours);
    expect(p.source).toBe(source);
  });

  it('dates not in the plan are reported as notCovered – never assumed open or closed', () => {
    for (const d of ['2026-11-20', '2026-12-14', '2027-01-07', '2027-04-19']) {
      expect(dayPlan(d)).toMatchObject({ status: 'notCovered' });
      expect(dayPlan(d).hours).toBeUndefined();
    }
  });
});

describe('evening skiing is separate and never replaces day skiing', () => {
  it('only Fridays from 25 Dec 2026 to 19 Mar 2027', () => {
    expect(eveningOn('2026-12-18')).toBeUndefined(); // Friday before the period
    expect(eveningOn('2026-12-25')).toEqual({ open: '17:00', close: '20:00' });
    expect(eveningOn('2027-01-01')).toEqual({ open: '17:00', close: '20:00' });
    expect(eveningOn('2027-01-02')).toBeUndefined(); // Saturday
    expect(eveningOn('2027-03-19')).toEqual({ open: '17:00', close: '20:00' });
    expect(eveningOn('2027-03-26')).toBeUndefined(); // Friday after the period
  });

  it('25 Dec and 1 Jan keep their special day hours AND get evening skiing', () => {
    expect(dayPlan('2026-12-25')).toMatchObject({ hours: { open: '12:00', close: '16:00' }, evening: { open: '17:00', close: '20:00' } });
    expect(dayPlan('2027-01-01')).toMatchObject({ hours: { open: '12:00', close: '16:00' }, evening: { open: '17:00', close: '20:00' } });
  });

  it('every Friday in the evening period is counted once (no duplicate entries)', () => {
    const fridays = [] as string[];
    for (let d = new Date('2026-12-25T00:00:00Z'); d <= new Date('2027-03-19T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 7)) {
      fridays.push(d.toISOString().slice(0, 10));
    }
    expect(fridays).toHaveLength(13);
    for (const f of fridays) expect(eveningOn(f)).toBeDefined();
  });
});

describe('gaps and conflicts for the owner (must not be filled in by code)', () => {
  it('uncovered dates are exactly 23–25 Nov, 14–15 Dec and week 1 (4–10 Jan)', () => {
    expect(uncoveredDates()).toEqual([
      '2026-11-23', '2026-11-24', '2026-11-25',
      '2026-12-14', '2026-12-15',
      '2027-01-04', '2027-01-05', '2027-01-06', '2027-01-07', '2027-01-08', '2027-01-09', '2027-01-10',
    ]);
  });

  it('Friday 8 Jan has evening skiing in the plan but no confirmed day skiing', () => {
    expect(dayPlan('2027-01-08')).toEqual({ date: '2027-01-08', status: 'notCovered', evening: { open: '17:00', close: '20:00' } });
  });

  it('Friday 19 Mar: Easter day hours end at 17:00, when the grooming window also ends', () => {
    const p = dayPlan('2027-03-19');
    expect(p.hours).toEqual({ open: '10:00', close: '17:00' });
    expect(EVENING.groomingWindow).toEqual({ open: '16:00', close: '17:00' });
    expect(p.evening).toEqual({ open: '17:00', close: '20:00' });
  });
});

describe('times after midnight', () => {
  it('Fjellkafe November hours: Friday to 00:00 and Saturday to 02:00 run past midnight', () => {
    const [fri, sat, sun] = FJELLKAFE.november2026.days;
    expect([fri.weekday, sat.weekday, sun.weekday]).toEqual([5, 6, 7]);
    expect(closesAfterMidnight(fri.hours)).toBe(true);
    expect(closesAfterMidnight(sat.hours)).toBe(true);
    expect(closesAfterMidnight(sun.hours)).toBe(false);
  });
});

describe('Europe/Oslo date', () => {
  it('uses Oslo, not UTC, for "today"', () => {
    expect(osloToday(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01');
    expect(osloToday(new Date('2027-03-28T22:30:00Z'))).toBe('2027-03-29'); // after the DST switch
  });
});
