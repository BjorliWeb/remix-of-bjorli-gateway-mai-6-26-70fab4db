import { describe, expect, it } from 'vitest';
import {
  PROGRAM_ALL, WINTER_PROGRAM_PUBLISHED, buildWinterProgramEvents, buildWinterProgramNews,
  programEventSlug, SPISESTEDENE_INSTAGRAM_URL, formatNo,
} from './winterProgram2026';
import { EVENT_CATEGORY_KEYS } from '@/lib/eventCategories';
import { filterByCategory, uniqueCategories } from '@/components/listing/listingHelpers';

describe('Bjorli Spisestedene winter programme 2026/27', () => {
  it('has all 15 programme items with the poster dates', () => {
    expect(PROGRAM_ALL.map((p) => p.date)).toEqual([
      '2026-11-07', '2026-11-14', '2026-11-20', '2026-11-28', '2026-12-11', '2026-12-12', '2026-12-31',
      '2027-01-23', '2027-01-29', '2027-02-13', '2027-02-27', '2027-03-13', '2027-03-27', '2027-04-03', '2027-04-18',
    ]);
  });

  it('creates 11 new calendar entries and links the 4 that already exist', () => {
    expect(buildWinterProgramEvents()).toHaveLength(11);
    expect(PROGRAM_ALL.filter((p) => p.existingSlug)).toHaveLength(4);
  });

  it('gives every entry its own URL', () => {
    const slugs = PROGRAM_ALL.map(programEventSlug);
    expect(new Set(slugs).size).toBe(15);
  });

  it('stays hidden until the combined release', () => {
    expect(WINTER_PROGRAM_PUBLISHED).toBe(false);
    expect(buildWinterProgramNews().status).toBe('unpublished');
    expect(buildWinterProgramEvents().every((e) => e.status === 'unpublished')).toBe(true);
  });

  it('never invents a time and never claims "Hele dagen"', () => {
    for (const e of buildWinterProgramEvents()) {
      expect(e.timeText).toBe('Tidspunkt kommer');
      expect(`${e.body} ${e.intro}`).not.toMatch(/hele dagen|kl\.\s?\d/i);
      expect(e.startsAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('uses only known categories and lets New Year carry two', () => {
    for (const p of PROGRAM_ALL) for (const c of p.categories) expect(EVENT_CATEGORY_KEYS).toContain(c);
    expect(PROGRAM_ALL.find((p) => p.date === '2026-12-31')?.categories).toEqual(['after-ski', 'mat-drikke']);
  });

  it('marks only 7 November as earlier in the season', () => {
    const body = buildWinterProgramNews().body ?? '';
    expect(body.match(/Tidligere i sesongen/g)).toHaveLength(1);
    expect(body).toMatch(/Novemberfest \(åpningsfest\)\]\([^)]+\) – Tidligere i sesongen/);
  });

  it('links every programme item and the Instagram account from the news story', () => {
    const body = buildWinterProgramNews().body ?? '';
    for (const p of PROGRAM_ALL) expect(body).toContain(`(/arrangementer/${programEventSlug(p)}/)`);
    expect(body).toContain(`(${SPISESTEDENE_INSTAGRAM_URL})`);
    expect(body).toContain('(/mat-og-drikke/)');
  });

  it('formats calendar dates without shifting them', () => {
    expect(formatNo('2026-12-31')).toBe('torsdag 31. desember');
    expect(formatNo('2027-04-18')).toBe('søndag 18. april');
  });
});

describe('event category filter with several categories', () => {
  const items = [
    { slug: 'a', category: 'konsert', categories: ['konsert', 'after-ski'] },
    { slug: 'b', category: 'quiz' },
  ];
  it('finds an event under each of its categories, once', () => {
    expect(filterByCategory(items, 'after-ski').map((i) => i.slug)).toEqual(['a']);
    expect(filterByCategory(items, 'konsert').map((i) => i.slug)).toEqual(['a']);
    expect(filterByCategory(items, 'quiz').map((i) => i.slug)).toEqual(['b']);
  });
  it('lists every category in the filter', () => {
    expect(uniqueCategories(items).sort()).toEqual(['after-ski', 'konsert', 'quiz']);
  });
});
