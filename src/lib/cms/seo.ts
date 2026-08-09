/**
 * Per-route SEO resolution.
 *
 * Maps the canonical (locale-stripped) pathname to a CMS entry, and
 * returns a normalized SEO payload + structured data (JSON-LD).
 *
 * This stays in the CMS layer so that swapping providers (Sanity / Strapi /
 * DatoCMS / Storyblok) only requires updating the adapter — not SEOHead.
 */
import {
  getActivities,
  getEvents,
  getNews,
  getTips,
} from './index';
import type { CmsEntryBase, CmsEvent, Language } from './types';
import { getSubPage, isSubPageSlug } from './subpages';
import { LOCALE_LABELS, type Locale } from '@/i18n/locales/types';

/** Map an internal language code to a BCP-47 tag for JSON-LD `inLanguage`. */
const toBcp47 = (language: Language): string =>
  LOCALE_LABELS[language as Locale]?.bcp47 ?? language;

export interface ResolvedSeo {
  title?: string;
  description?: string;
  image?: string;
  canonicalPath: string;
  jsonLd?: Record<string, unknown>;
  /** Locales that actually have content for this route. SEOHead uses this to
   *  emit hreflang only for valid translations. */
  availableTranslations?: Language[];
  /** Whether the body for the requested language is a real translation. */
  translatedBody?: boolean;
  /**
   * True for runtime-only entries (approved user submissions). These have no
   * prerendered HTML and are not listed in sitemap.xml, so their detail URL
   * must not be indexed.
   */
  noindex?: boolean;
}

/** Map listing base paths to a fetcher + JSON-LD type. */
const DETAIL_ROUTES: {
  match: RegExp;
  load: (lang: Language) => Promise<CmsEntryBase[]>;
  schemaType: 'Article' | 'NewsArticle' | 'Event';
}[] = [
  { match: /^\/nyheter\/([^/]+)$/,        load: (l) => getNews({ language: l }),       schemaType: 'NewsArticle' },
  { match: /^\/tips\/([^/]+)$/,           load: (l) => getTips({ language: l }),       schemaType: 'Article' },
  { match: /^\/arrangementer\/([^/]+)$/,  load: (l) => getEvents({ language: l }),     schemaType: 'Event' },
  { match: /^\/aktiviteter\/([^/]+)$/,    load: (l) => getActivities({ language: l }), schemaType: 'Article' },
];

const buildJsonLd = (
  entry: CmsEntryBase,
  schemaType: 'Article' | 'NewsArticle' | 'Event',
  url: string,
): Record<string, unknown> => {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: entry.title,
    name: entry.title,
    description: entry.seoDescription ?? entry.intro ?? '',
    inLanguage: toBcp47(entry.language),
    url,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt ?? entry.publishedAt,
    image: entry.heroImage?.url ? [entry.heroImage.url] : undefined,
  };
  if (schemaType === 'Event') {
    const ev = entry as CmsEvent;
    base.startDate = ev.startsAt ?? entry.publishedAt;
    if (ev.endsAt) base.endDate = ev.endsAt;
    base.location = {
      '@type': 'Place',
      name: ev.location ?? 'Bjorli',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bjorli',
        addressCountry: 'NO',
      },
    };
    base.eventStatus = 'https://schema.org/EventScheduled';
    base.eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode';
  }
  // Strip undefined keys for cleaner output
  Object.keys(base).forEach((k) => base[k] === undefined && delete base[k]);
  return base;
};

/**
 * Resolve SEO for a canonical (locale-stripped) path.
 * Returns `null` when no CMS entry matches — caller should fall back to defaults.
 */
export async function resolveSeoForRoute(
  language: Language,
  canonicalPath: string,
  absoluteUrl: string,
): Promise<ResolvedSeo | null> {
  // Top-level subpages: /heiskort, /langrenn, /fotturer, /sykling, /familie
  const topMatch = canonicalPath.match(/^\/([^/]+)$/);
  if (topMatch && isSubPageSlug(topMatch[1])) {
    const sp = await getSubPage(language, topMatch[1]);
    if (sp) {
      return {
        title: sp.seoTitle,
        description: sp.seoDescription,
        image: sp.heroImage.url,
        canonicalPath,
        // Sub-pages are visually served in all six locales today (mock content).
        availableTranslations: ['no', 'en', 'de', 'nl', 'da', 'sv'],
        translatedBody: language === 'no',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: sp.title,
          headline: sp.title,
          description: sp.seoDescription,
          inLanguage: toBcp47(language),
          url: absoluteUrl,
          image: [sp.heroImage.url],
        },
      };
    }
  }

  for (const route of DETAIL_ROUTES) {
    const m = canonicalPath.match(route.match);
    if (!m) continue;
    const slug = m[1];
    const items = await route.load(language);
    const entry = items.find((e) => e.slug === slug);
    if (!entry) return null;
    return {
      title: entry.seoTitle ?? entry.title,
      description: entry.seoDescription ?? entry.intro,
      image: entry.ogImage?.url ?? entry.heroImage?.url,
      canonicalPath,
      // Default mock entries to all six locales; real adapter must override.
      availableTranslations:
        entry.availableTranslations ?? ['no', 'en', 'de', 'nl', 'da', 'sv'],
      translatedBody: entry.translatedBody ?? language === 'no',
      // Runtime Supabase submissions (`submission-*`) are deliberately not
      // prerendered or sitemapped — keep their detail URL out of the index.
      noindex: String(entry.id).startsWith('submission-'),
      jsonLd: buildJsonLd(entry, route.schemaType, absoluteUrl),
    };
  }
  return null;
}