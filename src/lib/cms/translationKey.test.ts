import { describe, expect, it } from 'vitest';
import { translationKeyOf } from './translationKey';
import { buildTranslationGroups, type CmsSnapshot, type SnapshotEntry } from '../../../scripts/lib/cmsSnapshot';
import { LOCALES, type Locale } from '@/i18n/locales/types';

const entry = (id: string, slug: string): SnapshotEntry => ({ id, slug, title: slug });

const emptyByLocale = () =>
  Object.fromEntries(LOCALES.map((l) => [l, [] as SnapshotEntry[]])) as Record<Locale, SnapshotEntry[]>;

const snapshotWith = (
  kind: 'activities' | 'news',
  perLocale: Partial<Record<Locale, SnapshotEntry[]>>,
): CmsSnapshot => {
  const base = {
    news: emptyByLocale(),
    tips: emptyByLocale(),
    events: emptyByLocale(),
    activities: emptyByLocale(),
  } as CmsSnapshot;
  for (const [loc, items] of Object.entries(perLocale)) base[kind][loc as Locale] = items!;
  return base;
};

describe('translationKeyOf', () => {
  it('preserves the season marker for activities', () => {
    expect(translationKeyOf(entry('activity-no-w-0', 'x'))).toBe('w-0');
    expect(translationKeyOf(entry('activity-no-s-0', 'y'))).toBe('s-0');
    expect(translationKeyOf(entry('activity-en-w-0', 'z'))).toBe('w-0');
    expect(translationKeyOf(entry('activity-no-w-0', 'x'))).not.toBe(
      translationKeyOf(entry('activity-no-s-0', 'y')),
    );
  });

  it('keeps the plain numeric key for news, tips and events', () => {
    expect(translationKeyOf(entry('news-no-2', 'a'))).toBe('2');
    expect(translationKeyOf(entry('tip-de-11', 'a'))).toBe('11');
    expect(translationKeyOf(entry('event-sv-0', 'a'))).toBe('0');
  });

  it('falls back to the slug when the id has no index suffix', () => {
    expect(translationKeyOf(entry('submission-abc', 'my-slug'))).toBe('my-slug');
  });
});

describe('buildTranslationGroups — activities', () => {
  it('never mixes winter and summer entries', () => {
    const perLocale: Partial<Record<Locale, SnapshotEntry[]>> = {};
    for (const loc of LOCALES) {
      perLocale[loc] = [
        entry(`activity-${loc}-w-0`, `winter-0-${loc}`),
        entry(`activity-${loc}-w-1`, `winter-1-${loc}`),
        entry(`activity-${loc}-s-0`, `summer-0-${loc}`),
      ];
    }
    const groups = buildTranslationGroups(snapshotWith('activities', perLocale), 'activities');
    expect(groups.map((g) => g.key).sort()).toEqual(['s-0', 'w-0', 'w-1']);
    for (const g of groups) {
      expect(Object.keys(g.byLocale).sort()).toEqual([...LOCALES].sort());
      const seasons = new Set(Object.values(g.byLocale).map((e) => e!.slug.split('-')[0]));
      expect(seasons.size).toBe(1);
    }
  });

  it('allows partial translations (a group need not have all six locales)', () => {
    const groups = buildTranslationGroups(
      snapshotWith('activities', {
        no: [entry('activity-no-s-0', 'sommer-0')],
        en: [entry('activity-en-s-0', 'summer-0')],
      }),
      'activities',
    );
    expect(groups).toHaveLength(1);
    expect(Object.keys(groups[0].byLocale).sort()).toEqual(['en', 'no']);
  });
});

describe('buildTranslationGroups — news is unchanged', () => {
  it('groups news by numeric index across locales', () => {
    const groups = buildTranslationGroups(
      snapshotWith('news', {
        no: [entry('news-no-0', 'nyhet-0'), entry('news-no-1', 'nyhet-1')],
        en: [entry('news-en-0', 'news-0'), entry('news-en-1', 'news-1')],
      }),
      'news',
    );
    expect(groups.map((g) => g.key).sort()).toEqual(['0', '1']);
    expect(groups.every((g) => Object.keys(g.byLocale).length === 2)).toBe(true);
  });
});
