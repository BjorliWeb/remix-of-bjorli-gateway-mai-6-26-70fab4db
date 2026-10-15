import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { CmsEntryBase, CmsEvent, Language } from './types';

const news: Record<string, CmsEntryBase[]> = {
  no: [{ id: 'news-no-0', slug: 'norsk-slug', language: 'no', title: 'Norsk tittel', intro: 'Intro' }],
  en: [{ id: 'news-en-0', slug: 'english-slug', language: 'en', title: 'English title', intro: 'Intro' }],
};

const events: Record<string, CmsEvent[]> = {
  no: [
    { id: 'event-no-0', slug: 'iso-event', language: 'no', title: 'ISO event', startsAt: '2026-07-31T10:00:00.000Z', endsAt: '2026-08-07T18:00:00.000Z', publishedAt: '2026-01-05' },
    { id: 'event-no-1', slug: 'display-event', language: 'no', title: 'Display event', startsAt: '31. juli – 7. august 2026', publishedAt: '31. juli 2026', updatedAt: '31. juli 2026' },
  ],
};

vi.mock('./index', () => ({
  getNews: async ({ language }: { language: Language }) => news[language] ?? [],
  getTips: async () => [],
  getEvents: async ({ language }: { language: Language }) => events[language] ?? [],
  getArchivedEvents: async () => [],
  getActivities: async () => [],
}));

const { resolveSeoForRoute } = await import('./seo');

beforeEach(() => vi.clearAllMocks());

describe('detail alternate paths', () => {
  it('uses each locale’s own slug, never the source slug', async () => {
    const seo = await resolveSeoForRoute('no', '/nyheter/norsk-slug', 'https://bjorli.no/nyheter/norsk-slug/');
    expect(seo?.alternatePaths).toEqual({
      no: '/nyheter/norsk-slug/',
      en: '/en/news/english-slug/',
    });
    expect(seo?.availableTranslations?.sort()).toEqual(['en', 'no']);
    // The English URL must not carry the Norwegian slug.
    expect(seo?.alternatePaths?.en).not.toContain('norsk-slug');
  });

  it('resolves the same group from the English side', async () => {
    const seo = await resolveSeoForRoute('en', '/nyheter/english-slug', 'https://bjorli.no/en/news/english-slug/');
    expect(seo?.alternatePaths?.no).toBe('/nyheter/norsk-slug/');
    expect(seo?.alternatePaths?.en).toBe('/en/news/english-slug/');
  });
});

describe('event JSON-LD', () => {
  it('emits Event for an ISO start date', async () => {
    const seo = await resolveSeoForRoute('no', '/arrangementer/iso-event', 'https://bjorli.no/arrangementer/iso-event/');
    const ld = seo!.jsonLd as Record<string, unknown>;
    expect(ld['@type']).toBe('Event');
    expect(ld.startDate).toBe('2026-07-31T10:00:00.000Z');
    expect(ld.endDate).toBe('2026-08-07T18:00:00.000Z');
    expect(ld.datePublished).toBe('2026-01-05');
  });

  it('falls back to Article for a display date and emits no invalid dates', async () => {
    const seo = await resolveSeoForRoute('no', '/arrangementer/display-event', 'https://bjorli.no/arrangementer/display-event/');
    const ld = seo!.jsonLd as Record<string, unknown>;
    expect(ld['@type']).toBe('Article');
    expect(ld.startDate).toBeUndefined();
    expect(ld.endDate).toBeUndefined();
    expect(ld.datePublished).toBeUndefined();
    expect(ld.dateModified).toBeUndefined();
  });
});

describe('ski-holiday landing (EN/DE/SV/DA/NL)', () => {
  const ALL = {
    en: '/en/ski-holiday-norway/',
    de: '/de/skiurlaub-norwegen/',
    sv: '/sv/skidsemester-norge/',
    da: '/da/skiferie-norge/',
    nl: '/nl/wintersport-noorwegen/',
  };

  it.each([
    ['en', '/ski-holiday-norway', 'Ski Holiday in Norway'],
    ['de', '/skiurlaub-norwegen', 'Skiurlaub in Norwegen'],
    ['sv', '/skidsemester-norge', 'Skidsemester i Norge'],
    ['da', '/skiferie-norge', 'Skiferie i Norge'],
    ['nl', '/wintersport-noorwegen', 'Wintersport in Noorwegen'],
  ] as const)('%s links every real version and nothing else', async (lang, path, title) => {
    const seo = await resolveSeoForRoute(lang, path, `https://bjorli.no${ALL[lang]}`);
    expect(seo?.alternatePaths).toEqual(ALL);
    expect(seo?.availableTranslations?.slice().sort()).toEqual(['da', 'de', 'en', 'nl', 'sv']);
    expect(seo?.title).toContain(title);
  });

  it('resolves to the active language’s version from any of the five slugs', async () => {
    // After an in-app switch DE → EN the router can still hold the DE slug.
    const seo = await resolveSeoForRoute('en', '/skiurlaub-norwegen', 'https://bjorli.no/en/ski-holiday-norway/');
    expect(seo?.title).toContain('Ski Holiday in Norway');
    expect(seo?.alternatePaths).toEqual(ALL);
  });

  it('is never resolved for Norwegian or unrelated paths', async () => {
    expect(await resolveSeoForRoute('no', '/ski-holiday-norway', 'https://bjorli.no/ski-holiday-norway/')).toBeNull();
    expect(await resolveSeoForRoute('no', '/skiurlaub-norwegen', 'https://bjorli.no/skiurlaub-norwegen/')).toBeNull();
    expect(await resolveSeoForRoute('de', '/ski-holiday', 'https://bjorli.no/de/ski-holiday/')).toBeNull();
  });
});
