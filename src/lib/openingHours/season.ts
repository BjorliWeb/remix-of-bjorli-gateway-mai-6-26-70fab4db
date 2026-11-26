/**
 * Bjorli Skisenter – planned opening hours, winter season 2026/2027.
 *
 * SINGLE SOURCE for dates and times. Owner-confirmed (see
 * docs/content/opening-hours-maintenance.md). Node-safe: no React, no assets,
 * so the page, the prerenderer and the tests read exactly the same facts.
 *
 * This is the PLANNED schedule. Live operational status (lifts running now)
 * comes from Fnugg (src/lib/integrations/fnugg.ts) and is never derived here.
 *
 * Dates are calendar dates in Europe/Oslo (YYYY-MM-DD). Times are local
 * Oslo wall-clock times (HH:MM). A close time at or before the open time
 * means "after midnight" (e.g. 16:00–00:00, 10:00–02:00).
 */

export const SEASON_LABEL = '2026/2027';
export const TIME_ZONE = 'Europe/Oslo';

export interface TimeRange {
  open: string;
  close: string;
}

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PeriodKind = 'early' | 'holiday' | 'regular' | 'closing';

export interface DatedPeriod {
  id: 'miniOpening' | 'lift1' | 'christmas' | 'winterBreak' | 'easter' | 'closing';
  kind: Exclude<PeriodKind, 'regular'>;
  start: string;
  end: string;
  /** Every day in the period; null = dates confirmed, times NOT confirmed. */
  hours: TimeRange | null;
}

export interface RegularWeeks {
  id: 'regular';
  kind: 'regular';
  year: number;
  /** ISO week numbers in `year`. */
  weeks: number[];
  openDays: IsoWeekday[];
  hours: TimeRange;
  /** Days that may open for groups on request – NOT ordinary opening days. */
  groupsOnRequestDays: IsoWeekday[];
}

export interface DateException {
  date: string;
  hours: TimeRange;
}

export interface EveningSkiing {
  weekday: IsoWeekday;
  start: string;
  end: string;
  hours: TimeRange;
  /** Slopes are groomed when needed in this window before evening skiing. */
  groomingWindow: TimeRange;
  separateTicket: true;
}

export const MINI_OPENING: DatedPeriod = {
  id: 'miniOpening', kind: 'early', start: '2026-11-21', end: '2026-11-22', hours: { open: '10:00', close: '16:00' },
};

/** Heis 1 (T-kroken), every day. */
export const LIFT1_EARLY: DatedPeriod = {
  id: 'lift1', kind: 'early', start: '2026-11-26', end: '2026-12-13', hours: { open: '10:00', close: '16:00' },
};

export const CHRISTMAS: DatedPeriod = {
  id: 'christmas', kind: 'holiday', start: '2026-12-16', end: '2027-01-03', hours: { open: '10:00', close: '16:00' },
};

export const WINTER_BREAK: DatedPeriod = {
  id: 'winterBreak', kind: 'holiday', start: '2027-02-13', end: '2027-02-28', hours: { open: '10:00', close: '16:00' },
};

export const EASTER: DatedPeriod = {
  id: 'easter', kind: 'holiday', start: '2027-03-17', end: '2027-03-29', hours: { open: '10:00', close: '17:00' },
};

/** Closing weekend: dates confirmed, times deliberately not stated. */
export const CLOSING_WEEKEND: DatedPeriod = {
  id: 'closing', kind: 'closing', start: '2027-04-16', end: '2027-04-18', hours: null,
};

export const REGULAR: RegularWeeks = {
  id: 'regular',
  kind: 'regular',
  year: 2027,
  weeks: [2, 3, 4, 5, 6, 9, 10, 11, 13, 14, 15],
  openDays: [3, 4, 5, 6, 7],
  hours: { open: '10:00', close: '16:00' },
  groupsOnRequestDays: [1, 2],
};

/** Specific dates that override every period (priority 1). */
export const EXCEPTIONS: DateException[] = [
  { date: '2026-12-24', hours: { open: '10:00', close: '14:00' } },
  { date: '2026-12-25', hours: { open: '12:00', close: '16:00' } },
  { date: '2027-01-01', hours: { open: '12:00', close: '16:00' } },
];

/**
 * Friday evening skiing. 25 Dec 2026 and 1 Jan 2027 are Fridays inside this
 * range, so they are covered here – not duplicated as separate entries.
 */
export const EVENING: EveningSkiing = {
  weekday: 5,
  start: '2026-12-25',
  end: '2027-03-19',
  hours: { open: '17:00', close: '20:00' },
  groomingWindow: { open: '16:00', close: '17:00' },
  separateTicket: true,
};

export const SEASON_EVENTS = [{ date: '2026-12-06', name: 'Jibben Lever Tour' }] as const;

export const DATED_PERIODS: DatedPeriod[] = [MINI_OPENING, LIFT1_EARLY, CHRISTMAS, WINTER_BREAK, EASTER, CLOSING_WEEKEND];

export const SEASON_FIRST_DATE = MINI_OPENING.start;
export const SEASON_LAST_DATE = CLOSING_WEEKEND.end;

/* ------------------------------------------------------------------ */
/* Calendar helpers (pure, timezone-free: dates are plain calendar days) */

const toUtc = (d: string) => {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day));
};
const fromUtc = (dt: Date) => dt.toISOString().slice(0, 10);

export const isoWeekday = (date: string): IsoWeekday => (((toUtc(date).getUTCDay() + 6) % 7) + 1) as IsoWeekday;

export const isoWeek = (date: string): { year: number; week: number } => {
  const dt = toUtc(date);
  const day = isoWeekday(date);
  dt.setUTCDate(dt.getUTCDate() + 4 - day); // Thursday of this week
  const year = dt.getUTCFullYear();
  const jan1 = Date.UTC(year, 0, 1);
  return { year, week: Math.floor((dt.getTime() - jan1) / 86_400_000 / 7) + 1 };
};

export const addDays = (date: string, n: number): string => {
  const dt = toUtc(date);
  dt.setUTCDate(dt.getUTCDate() + n);
  return fromUtc(dt);
};

export const eachDate = (start: string, end: string): string[] => {
  const out: string[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) out.push(d);
  return out;
};

const inRange = (date: string, start: string, end: string) => date >= start && date <= end;

/** True when a range ends after midnight (close at or before open). */
export const closesAfterMidnight = (r: TimeRange): boolean => r.close <= r.open;

/** Today's calendar date in Europe/Oslo. */
export const osloToday = (now: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);

/* ------------------------------------------------------------------ */
/* Resolver: what the PLAN says for a given date (not live status).    */

export type DayStatus =
  /** Open for day skiing with these hours. */
  | 'open'
  /** Not an ordinary opening day; may open for groups on request. */
  | 'groupsOnRequest'
  /** Closing weekend: dates confirmed, times not confirmed. */
  | 'datesOnlyNoHours'
  /** The plan says nothing about this date – never assume open or closed. */
  | 'notCovered';

export interface DayPlan {
  date: string;
  status: DayStatus;
  hours?: TimeRange;
  /** Which rule decided: 'exception' > 'holiday' > 'early'/'closing' > 'regular'. */
  source?: 'exception' | DatedPeriod['id'] | 'regular';
  /** Evening skiing is separate and never replaces day skiing. */
  evening?: TimeRange;
}

export const eveningOn = (date: string): TimeRange | undefined =>
  inRange(date, EVENING.start, EVENING.end) && isoWeekday(date) === EVENING.weekday ? EVENING.hours : undefined;

/**
 * Priority (owner rule):
 *   1. specific dates  2. holiday periods  3. early season / special periods
 *   4. ordinary weekly hours.
 */
export const dayPlan = (date: string): DayPlan => {
  const evening = eveningOn(date);
  const base = (p: Omit<DayPlan, 'date' | 'evening'>): DayPlan => ({ date, ...p, ...(evening ? { evening } : {}) });

  const ex = EXCEPTIONS.find((e) => e.date === date);
  if (ex) return base({ status: 'open', hours: ex.hours, source: 'exception' });

  for (const kind of ['holiday', 'early', 'closing'] as const) {
    const p = DATED_PERIODS.find((x) => x.kind === kind && inRange(date, x.start, x.end));
    if (p) {
      return p.hours
        ? base({ status: 'open', hours: p.hours, source: p.id })
        : base({ status: 'datesOnlyNoHours', source: p.id });
    }
  }

  const { year, week } = isoWeek(date);
  if (year === REGULAR.year && REGULAR.weeks.includes(week)) {
    const wd = isoWeekday(date);
    if (REGULAR.openDays.includes(wd)) return base({ status: 'open', hours: REGULAR.hours, source: 'regular' });
    if (REGULAR.groupsOnRequestDays.includes(wd)) return base({ status: 'groupsOnRequest', source: 'regular' });
  }
  return base({ status: 'notCovered' });
};

/**
 * Dates inside the season that the plan does not cover (day skiing). Used by
 * tests and the maintenance report – these must be clarified by the owner,
 * never filled in by code.
 */
export const uncoveredDates = (): string[] =>
  eachDate(SEASON_FIRST_DATE, SEASON_LAST_DATE).filter((d) => dayPlan(d).status === 'notCovered');

/* ------------------------------------------------------------------ */
/* Serving: owner-confirmed facts for the ski centre's venues.         */

export interface VenueDayHours {
  weekday: IsoWeekday;
  hours: TimeRange;
}

/** Bjorli Fjellkafe (whole venue): staffed café + warming room on the 2nd floor. */
export const FJELLKAFE = {
  /** Café and warming room are open during all lift opening hours. */
  openDuringLiftHours: true,
  warmingRoomFloor: 2,
  /** Owner-confirmed hours for November 2026 (applies to Bjorli Fjellkafe as a whole). */
  november2026: {
    start: '2026-11-01',
    end: '2026-11-30',
    days: [
      { weekday: 5, hours: { open: '16:00', close: '00:00' } },
      { weekday: 6, hours: { open: '10:00', close: '02:00' } },
      { weekday: 7, hours: { open: '10:00', close: '17:00' } },
    ] as VenueDayHours[],
  },
} as const;

/** Loungen opens in December 2026 – no exact date or hours confirmed. */
export const LOUNGEN = { opensMonth: '2026-12' } as const;
