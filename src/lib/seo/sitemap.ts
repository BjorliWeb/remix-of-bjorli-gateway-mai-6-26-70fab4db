/**
 * Localized sitemap builder (placeholder).
 *
 * This is a documented function — NOT wired into a runtime endpoint yet.
 * The current `public/sitemap.xml` remains the static deployment sitemap.
 *
 * Once WordPress is connected, this builder is what should be invoked from:
 *   - a Next.js `app/sitemap.ts` route, OR
 *   - a build-time script (e.g. `scripts/build-sitemap.ts`) that writes
 *     `public/sitemap.xml` during `next build` / `vite build`.
 *
 * Source-of-truth inputs:
 *   - `ROUTE_SLUGS` from `src/i18n/routes.ts` for static destination pages.
 *   - CMS adapter (news / events / tips / activities / accommodation /
 *     food-drink) for dynamic entries — each entry must declare its
 *     `availableTranslations` so we never emit URLs for missing locales.
 *
 * Critical rules:
 *   1. NEVER emit a `<url>` for a locale not in `availableTranslations`.
 *   2. Emit `<xhtml:link rel="alternate" hreflang="…">` for every available
 *      sibling translation, plus an `x-default` (EN preferred, then NO).
 *   3. Skip entries marked `noindex`.
 *   4. Use `lastmod` from `updatedAt ?? publishedAt` when available.
 */
import { LOCALE_PREFIX, LOCALES, type Locale } from '@/i18n/translations';
import { ROUTE_SLUGS, slugForCanonical, type CanonicalRoute } from '@/i18n/routes';

/** A canonical entry that can be turned into one or more localized URLs. */
export interface SitemapEntry {
  /** Canonical route key (e.g. 'heiskort'). For dynamic entries, use the
   *  parent listing key and append a slug via `dynamicSlug`. */
  canonical: CanonicalRoute;
  /** Optional dynamic slug appended to the route (news/event/tip slug). */
  dynamicSlug?: string;
  /** Locales for which a real translation exists. URLs will be emitted
   *  ONLY for these locales. */
  availableTranslations: Locale[];
  /** ISO 8601 last-modified timestamp. */
  lastmod?: string;
  /** Search-engine priority hint (0.0 – 1.0). */
  priority?: number;
  /** Change frequency hint. */
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  /** When true, the entry is skipped entirely. */
  noindex?: boolean;
}

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: SitemapEntry['changefreq'];
  priority?: number;
  alternates: { hreflang: string; href: string }[];
}

const buildLocalizedHref = (
  origin: string,
  locale: Locale,
  canonical: CanonicalRoute,
  dynamicSlug?: string,
): string => {
  const prefix = LOCALE_PREFIX[locale];
  if (canonical === 'home') return origin + (prefix || '/');
  const slug = slugForCanonical(canonical, locale);
  const tail = dynamicSlug ? '/' + dynamicSlug : '';
  return origin + (prefix || '') + '/' + slug + tail;
};

/**
 * Build the URL list for a localized sitemap. Returns one `SitemapUrl` per
 * available locale per entry, each with hreflang alternates and x-default.
 */
export const buildLocalizedSitemap = (
  origin: string,
  entries: SitemapEntry[],
): SitemapUrl[] => {
  const urls: SitemapUrl[] = [];
  for (const entry of entries) {
    if (entry.noindex) continue;
    if (!entry.availableTranslations.length) continue;

    // Compute alternates once per entry.
    const alternates: { hreflang: string; href: string }[] = entry.availableTranslations.map(
      (loc) => ({
        hreflang: loc,
        href: buildLocalizedHref(origin, loc, entry.canonical, entry.dynamicSlug),
      }),
    );
    // x-default: prefer EN, then NO, else first available.
    const xDefaultLocale: Locale = entry.availableTranslations.includes('en')
      ? 'en'
      : entry.availableTranslations.includes('no')
      ? 'no'
      : entry.availableTranslations[0];
    alternates.push({
      hreflang: 'x-default',
      href: buildLocalizedHref(origin, xDefaultLocale, entry.canonical, entry.dynamicSlug),
    });

    for (const loc of entry.availableTranslations) {
      urls.push({
        loc: buildLocalizedHref(origin, loc, entry.canonical, entry.dynamicSlug),
        lastmod: entry.lastmod,
        changefreq: entry.changefreq,
        priority: entry.priority,
        alternates,
      });
    }
  }
  return urls;
};

/** Serialize SitemapUrl[] into a valid sitemap.xml string with xhtml alternates. */
export const serializeSitemapXml = (urls: SitemapUrl[]): string => {
  const xmlEscape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
        u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : null,
        u.priority != null ? `    <priority>${u.priority.toFixed(1)}</priority>` : null,
        alts,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
};

/**
 * Default static-page sitemap entries derived from the route registry.
 * Used as a starting point until the WordPress adapter provides per-entry
 * `availableTranslations` for dynamic content (news / events / tips / etc).
 */
export const defaultStaticSitemapEntries = (): SitemapEntry[] => {
  const allLocales: Locale[] = [...LOCALES];
  const keys = Object.keys(ROUTE_SLUGS) as CanonicalRoute[];
  return keys.map((canonical) => ({
    canonical,
    availableTranslations: allLocales,
    changefreq: canonical === 'home' ? 'daily' : 'weekly',
    priority: canonical === 'home' ? 1.0 : 0.7,
  }));
};