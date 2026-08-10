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
