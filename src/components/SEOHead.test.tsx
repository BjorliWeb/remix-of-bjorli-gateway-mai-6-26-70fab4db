import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null }) }) }) }) },
}));
vi.mock('@/lib/analytics', () => ({ trackPageView: () => {} }));
vi.mock('@/i18n/LanguageContext', () => ({ useLanguage: () => ({ locale: 'no' }) }));
vi.mock('@/lib/seo/origin', () => ({ isProductionOrigin: () => true }));
vi.mock('@/lib/cms', () => ({
  resolveSeoForRoute: async () => ({
    title: 'Norsk tittel',
    description: 'Intro',
    canonicalPath: '/nyheter/norsk-slug',
    alternatePaths: { no: '/nyheter/norsk-slug/', en: '/en/news/english-slug/' },
    availableTranslations: ['no', 'en'],
  }),
}));

const SEOHead = (await import('./SEOHead')).default;

const alternates = () => Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]'));

beforeEach(() => {
  document.head.innerHTML =
    // Simulated prerendered hreflang set (no data-hreflang marker).
    '<link rel="alternate" hreflang="nb" href="https://bjorli.no/nyheter/norsk-slug/" />' +
    '<link rel="alternate" hreflang="en" href="https://bjorli.no/en/news/english-slug/" />' +
    '<link rel="alternate" hreflang="x-default" href="https://bjorli.no/en/news/english-slug/" />';
});

describe('SEOHead detail hreflang', () => {
  it('emits exact localized detail URLs and no duplicates, even after a re-render', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let root: Root;
    const tree = (
      <MemoryRouter initialEntries={['/nyheter/norsk-slug/']}>
        <SEOHead />
      </MemoryRouter>
    );
    await act(async () => {
      root = createRoot(container);
      root.render(tree);
    });
    await vi.waitFor(() => expect(alternates().length).toBe(3));
    // Re-render: the runtime set must replace itself, not accumulate.
    await act(async () => {
      root!.render(tree);
    });
    await vi.waitFor(() => expect(alternates().length).toBe(3));

    const byLang = Object.fromEntries(
      alternates().map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')]),
    );
    expect(byLang['nb']).toBe('https://bjorli.no/nyheter/norsk-slug/');
    expect(byLang['en']).toBe('https://bjorli.no/en/news/english-slug/');
    expect(byLang['x-default']).toBe('https://bjorli.no/en/news/english-slug/');
    // translatePath must not leak the Norwegian slug into the English URL.
    expect(byLang['en']).not.toContain('norsk-slug');
    // Exactly one tag per locale + one x-default.
    expect(alternates().filter((l) => l.getAttribute('hreflang') === 'en')).toHaveLength(1);
    expect(alternates().filter((l) => l.getAttribute('hreflang') === 'x-default')).toHaveLength(1);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe('https://bjorli.no/nyheter/norsk-slug/');
  });
});
