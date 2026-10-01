import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { localizeHref } from '@/i18n/localizeHref';
import { ROUTE_SLUGS } from '@/i18n/routes';
import { LOCALES, type Locale } from '@/i18n/locales/types';
import { getHomepageData } from '@/lib/cms/homepageData';
import {
  classifyHref,
  findLinkProblems,
  parseRedirectSources,
  APP_SHELL_ROUTES,
} from '../../scripts/lib/linkCheck';

const REDIRECTS = readFileSync(resolve(__dirname, '../../public/_redirects'), 'utf8');

/** The 19 wrong-language addresses from the 1 Oct 2026 audit. */
const AUDIT: [string, string][] = [
  ['/en/overnatting/', '/en/accommodation/'],
  ['/en/apningstider/', '/en/opening-hours/'],
  ['/en/bjorli-skisenter/', '/en/bjorli-ski-resort/'],
  ['/en/loypekart/', '/en/trail-map/'],
  ['/de/overnatting/', '/de/unterkunft/'],
  ['/de/apningstider/', '/de/oeffnungszeiten/'],
  ['/de/bjorli-skisenter/', '/de/bjorli-skigebiet/'],
  ['/de/loypekart/', '/de/loipenplan/'],
  ['/nl/overnatting/', '/nl/accommodatie/'],
  ['/nl/apningstider/', '/nl/openingstijden/'],
  ['/nl/bjorli-skisenter/', '/nl/bjorli-skigebied/'],
  ['/nl/loypekart/', '/nl/pistekaart/'],
  ['/da/overnatting/', '/da/overnatning/'],
  ['/da/apningstider/', '/da/aabningstider/'],
  ['/da/loypekart/', '/da/loipekort/'],
  ['/sv/overnatting/', '/sv/boende/'],
  ['/sv/apningstider/', '/sv/oppettider/'],
  ['/sv/bjorli-skisenter/', '/sv/bjorli-skidcenter/'],
  ['/sv/loypekart/', '/sv/spårkarta/'],
];

const redirectMap = (() => {
  const m = new Map<string, string>();
  for (const raw of REDIRECTS.split('\n')) {
    const l = raw.trim();
    if (!l || l.startsWith('#')) continue;
    const [src, dst, code] = l.split(/\s+/);
    m.set(decodeURIComponent(src), `${code} ${decodeURIComponent(dst)}`);
  }
  return m;
})();

describe('language route map', () => {
  it('localizes Norwegian paths to each locale slug', () => {
    for (const [wrong, right] of AUDIT) {
      const [, loc, noSlug] = wrong.split('/');
      expect(localizeHref('/' + noSlug, loc as Locale)).toBe(right);
    }
  });
  it('keeps query, hash and externals intact', () => {
    expect(localizeHref('/overnatting?x=1#a', 'en')).toBe('/en/accommodation/?x=1#a');
    expect(localizeHref('https://example.com/a', 'en')).toBe('https://example.com/a');
    expect(localizeHref('mailto:a@b.no', 'en')).toBe('mailto:a@b.no');
  });
  it('homepage service cards resolve to a registered slug in every locale', () => {
    const all = new Set(Object.values(ROUTE_SLUGS).flatMap((r) => Object.values(r)));
    for (const loc of LOCALES) {
      for (const c of getHomepageData(loc).planning.cards) {
        if (c.external) continue;
        const href = localizeHref(c.href, loc);
        const first = href.split('/').filter(Boolean)[loc === 'no' ? 0 : 1];
        expect(all.has(first!), `${loc} ${href}`).toBe(true);
      }
    }
  });
});

describe('redirect definitions', () => {
  it('has a 301 for all 19 audit addresses, with and without trailing slash', () => {
    for (const [wrong, right] of AUDIT) {
      expect(redirectMap.get(wrong)).toBe(`301 ${right}`);
      expect(redirectMap.get(wrong.slice(0, -1))).toBe(`301 ${right}`);
    }
  });
  it('maps /nb/mountain-information/ to the weather & webcam page only', () => {
    expect(redirectMap.get('/nb/mountain-information/')).toBe('301 /vaer-og-webkamera/');
    expect(REDIRECTS).not.toMatch(/^\/nb\/\*/m);
  });
  it('has no global SPA fallback rule', () => {
    expect(REDIRECTS).not.toMatch(/^\/\*\s+\/index\.html\s+200/m);
  });
  it('never redirects an app-shell route', () => {
    const { exact } = parseRedirectSources(REDIRECTS);
    for (const r of APP_SHELL_ROUTES) expect(exact.has(r)).toBe(false);
  });
});

describe('link checker', () => {
  const redirects = parseRedirectSources('/old /new/ 301\n/tag/* /nyheter/ 301');
  const exists = (p: string) => ['/new/', '/sv/spårkarta/', '/file.pdf'].includes(p);
  it('classifies hrefs', () => {
    expect(classifyHref('mailto:x@y.no').kind).toBe('other');
    expect(classifyHref('tel:123').kind).toBe('other');
    expect(classifyHref('https://example.com/').kind).toBe('external');
    expect(classifyHref('https://bjorli.no/new/?a=1#b')).toMatchObject({ kind: 'internal', path: '/new/' });
  });
  it('accepts encoded, query and fragment links; rejects redirects and missing pages', () => {
    const html = [
      '<a href="/new/?a=1#x">', '<a href="/sv/sp%C3%A5rkarta/">', '<a href="/file.pdf">',
      '<a href="/old">', '<a href="/tag/foo/">', '<a href="/missing/">', '<a href="/new">',
    ].join('');
    const p = findLinkProblems([{ page: '/x', html }], exists, redirects).map((x) => x.href);
    expect(p).toEqual(['/old', '/tag/foo/', '/missing/', '/new']);
  });
});

/** Generated-output checks — run after `bun run build`. Skipped otherwise. */
const DIST = resolve(__dirname, '../../dist');
describe.skipIf(!existsSync(resolve(DIST, '404.html')))('generated HTML', () => {
  const read = (p: string) => readFileSync(resolve(DIST, p), 'utf8');
  it('ships a noindex 404 page and app shells for editor routes', () => {
    expect(read('404.html')).toMatch(/noindex/);
    for (const r of APP_SHELL_ROUTES) expect(read(r.slice(1) + 'index.html')).toMatch(/noindex, nofollow/);
  });
  it('language homepages contain no Norwegian-slug links', () => {
    for (const loc of ['en', 'de', 'nl', 'da', 'sv']) {
      const html = read(`${loc}/index.html`);
      for (const [wrong] of AUDIT.filter(([w]) => w.startsWith(`/${loc}/`))) expect(html).not.toContain(`href="${wrong}"`);
      expect(html).toMatch(new RegExp(`<html lang="[a-z-]+"`));
      expect(html.match(/rel="canonical"/g)?.length).toBe(1);
    }
  });
  it('unpublished Early Bird article is absent from files, sitemap and links', () => {
    expect(existsSync(resolve(DIST, 'nyheter/sesongkortsalget-er-apnet/index.html'))).toBe(false);
    expect(read('sitemap.xml')).not.toContain('sesongkortsalget-er-apnet');
    expect(read('index.html')).not.toContain('sesongkortsalget-er-apnet');
  });
});
