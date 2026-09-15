import { describe, it, expect } from 'vitest';
import {
  compareArchivedEvents,
  eventsArchivePath,
  isEventArchived,
  isEventsArchivePath,
  osloToday,
} from './archive';

describe('event archiving (Europe/Oslo)', () => {
  it('archives at 00:00 Oslo the day after the end date (summer time, UTC+2)', () => {
    const ev = { endsAt: '2026-09-06' };
    // 2026-09-06 23:30 Oslo = 21:30 UTC — still live.
    expect(isEventArchived(ev, new Date('2026-09-06T21:30:00Z'))).toBe(false);
    // 2026-09-07 00:01 Oslo = 2026-09-06 22:01 UTC — archived.
    expect(isEventArchived(ev, new Date('2026-09-06T22:01:00Z'))).toBe(true);
  });

  it('archives correctly in winter time (UTC+1)', () => {
    const ev = { endsAt: '2026-12-20' };
    // 2026-12-20 23:30 Oslo = 22:30 UTC — still live.
    expect(isEventArchived(ev, new Date('2026-12-20T22:30:00Z'))).toBe(false);
    // 2026-12-21 00:10 Oslo = 2026-12-20 23:10 UTC — archived.
    expect(isEventArchived(ev, new Date('2026-12-20T23:10:00Z'))).toBe(true);
  });

  it('never auto-archives an event without an end date', () => {
    expect(isEventArchived({}, new Date('2030-01-01T12:00:00Z'))).toBe(false);
    expect(isEventArchived({ endsAt: 'Juni 2026' }, new Date('2030-01-01T12:00:00Z'))).toBe(false);
  });

  it('honours an explicit archived status', () => {
    expect(isEventArchived({ status: 'archived' }, new Date('2020-01-01T00:00:00Z'))).toBe(true);
  });

  it('sorts the archive newest first and exposes localized paths', () => {
    const sorted = [{ endsAt: '2026-08-07' }, { endsAt: '2026-09-06' }].sort(compareArchivedEvents);
    expect(sorted[0].endsAt).toBe('2026-09-06');
    expect(eventsArchivePath('no')).toBe('/arrangementer/arkiv/');
    expect(eventsArchivePath('en')).toBe('/en/events/archive/');
    expect(isEventsArchivePath('/de/veranstaltungen/archiv/')).toBe(true);
    expect(isEventsArchivePath('/arrangementer/hostmarked')).toBe(false);
    expect(osloToday(new Date('2026-06-01T10:00:00Z'))).toBe('2026-06-01');
  });
});
