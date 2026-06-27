/**
 * Generate `public/sitemap.xml` from the canonical route registry.
 *
 * Why this exists:
 *   The previous static `public/sitemap.xml` was hand-edited and emitted
 *   the Norwegian slug under every locale prefix (e.g. `/en/sommer` instead
 *   of `/en/summer`). That produced invalid URLs and broken hreflang for
 *   every localized destination page. This generator reads
 *   `src/i18n/routes.ts` (the same registry the router uses) so the
 *   sitemap can never drift from the actual routes again.
 *
 * Output:
 *   - One `<url>` per supported locale per canonical route.
 *   - `<xhtml:link rel="alternate" hreflang="…">` for every sibling
 *     translation plus `x-default` (EN first, then NO).
 *   - Excludes legacy aliases, admin/internal pages, and the v1
 *     submit-event surfaces.
 *
 * Run via:
 *   bun run scripts/build-sitemap.ts
 *   (wired into `predev` / `prebuild` in package.json)
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LOCALES, LOCALE_PREFIX, type Locale } from '../src/i18n/locales/types';
import { ROUTE_SLUGS, slugForCanonical, type CanonicalRoute } from '../src/i18n/routes';

/**
 * Base origin for absolute URLs in the sitemap.
 *
 * Reads `SITE_URL` from the build environment so Cloudflare Pages
 * Preview deployments can point the sitemap at the preview origin
 * (or skip indexing entirely via `_headers`). Falls back to the
 * production hostname so local dev and the canonical production
 * build keep emitting the same URLs as before.
 */
const ORIGIN = (process.env.SITE_URL ?? 'https://bjorli.no').replace(/\/$/, '');
const LASTMOD = new Date().toISOString().slice(0, 10);

/**
 * Canonical routes that should NOT appear in the sitemap.
 *  - `livecams` is a legacy alias for `vaer-og-webkamera`.
 *  - `live` is an internal live-status surface — keep out of search index.
 */
const EXCLUDE_CANONICAL: ReadonlySet<CanonicalRoute> = new Set<CanonicalRoute>([
  'livecams',
  'live',
]);

/** Per-route priority + changefreq hints. */
const ROUTE_PRIORITY: Partial<Record<CanonicalRoute, number>> = {
  home: 1.0,
  vinter: 0.9,
  sommer: 0.9,
  skisenter: 0.9,
  overnatting: 0.8,
  heiskort: 0.8,
  'reisen-hit': 0.8,
  'vaer-og-webkamera': 0.8,
  aktiviteter: 0.7,
  arrangementer: 0.7,
  nyheter: 0.6,
  tips: 0.6,
};
const DEFAULT_PRIORITY = 0.6;

const ROUTE_CHANGEFREQ: Partial<Record<CanonicalRoute, string>> = {
  home: 'daily',
  nyheter: 'daily',
  arrangementer: 'daily',
  'vaer-og-webkamera': 'daily',
  apningstider: 'daily',
  skisenter: 'weekly',
};
const DEFAULT_CHANGEFREQ = 'weekly';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  alternates: { hreflang: string; href: string }[];
}

const allLocales: Locale[] = [...LOCALES];

const buildHref = (locale: Locale, canonical: CanonicalRoute): string => {
  const prefix = LOCALE_PREFIX[locale];
  if (canonical === 'home') return ORIGIN + (prefix || '/');
  const slug = slugForCanonical(canonical, locale);
  return ORIGIN + (prefix || '') + '/' + slug;
};

const canonicalKeys = (Object.keys(ROUTE_SLUGS) as CanonicalRoute[]).filter(
  (k) => !EXCLUDE_CANONICAL.has(k),
);

const urls: SitemapUrl[] = [];

for (const canonical of canonicalKeys) {
  const priority = ROUTE_PRIORITY[canonical] ?? DEFAULT_PRIORITY;
  const changefreq = ROUTE_CHANGEFREQ[canonical] ?? DEFAULT_CHANGEFREQ;

  // Alternates: every locale that has a slug for this canonical route.
  const alternates: { hreflang: string; href: string }[] = allLocales.map((loc) => ({
    hreflang: loc,
    href: buildHref(loc, canonical),
  }));
  // x-default: EN preferred, else NO.
  const xDefaultLocale: Locale = allLocales.includes('en') ? 'en' : 'no';
  alternates.push({ hreflang: 'x-default', href: buildHref(xDefaultLocale, canonical) });

  for (const loc of allLocales) {
    urls.push({
      loc: buildHref(loc, canonical),
      lastmod: LASTMOD,
      changefreq,
      priority,
      alternates,
    });
  }
}

/**
 * EN-only landing pages that are not part of the canonical route registry
 * (currently the international SEO landing for /en/ski-holiday-norway).
 * Listed explicitly so they are discoverable without inventing localized
 * aliases that do not actually exist in the router.
 */
const EN_ONLY_EXTRAS = [
  { path: '/en/ski-holiday-norway', priority: 0.6, changefreq: 'monthly' },
];
for (const extra of EN_ONLY_EXTRAS) {
  const href = ORIGIN + extra.path;
  urls.push({
    loc: href,
    lastmod: LASTMOD,
    changefreq: extra.changefreq,
    priority: extra.priority,
    alternates: [
      { hreflang: 'en', href },
      { hreflang: 'x-default', href },
    ],
  });
}

const xmlEscape = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const body = urls
  .map((u) => {
    const alts = u.alternates
      .map(
        (a) =>
          `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${xmlEscape(a.href)}"/>`,
      )
      .join('\n');
    return [
      '  <url>',
      `    <loc>${xmlEscape(u.loc)}</loc>`,
      `    <lastmod>${u.lastmod}</lastmod>`,
      `    <changefreq>${u.changefreq}</changefreq>`,
      `    <priority>${u.priority.toFixed(1)}</priority>`,
      alts,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

writeFileSync(resolve('public/sitemap.xml'), xml);
console.log(
  `sitemap.xml written — ${urls.length} URLs across ${canonicalKeys.length} canonical routes` +
    ` (+ ${EN_ONLY_EXTRAS.length} EN-only extras).`,
);