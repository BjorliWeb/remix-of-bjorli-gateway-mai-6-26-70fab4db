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
import { LOCALE_LABELS, LOCALES, LOCALE_PREFIX, type Locale } from '@/i18n/locales/types';
import { slugForCanonical, type CanonicalRoute } from '@/i18n/routes';
import { normalizeInternalPath } from '@/lib/url/normalizeInternalPath';
import { translationKeyOf } from './translationKey';
import { isIsoDate } from '@/lib/date/isIsoDate';

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
  /**
   * Exact, provider-supplied canonical paths per locale for THIS entry.
   *
   * Detail slugs are localized, so translated URLs can never be derived with
   * `translatePath()` (which only localizes the hub segment). A CMS adapter
   * populates this from its own translation relationships; SEOHead only
   * renders what it is given.
   */
  alternatePaths?: Partial<Record<Language, string>>;
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
  hub: CanonicalRoute;
}[] = [
  { match: /^\/nyheter\/([^/]+)$/,        load: (l) => getNews({ language: l }),       schemaType: 'NewsArticle', hub: 'nyheter' },
  { match: /^\/tips\/([^/]+)$/,           load: (l) => getTips({ language: l }),       schemaType: 'Article',     hub: 'tips' },
  { match: /^\/arrangementer\/([^/]+)$/,  load: (l) => getEvents({ language: l }),     schemaType: 'Event',       hub: 'arrangementer' },
  { match: /^\/aktiviteter\/([^/]+)$/,    load: (l) => getActivities({ language: l }), schemaType: 'Article',     hub: 'aktiviteter' },
];

/** `/nyheter/<slug>` → localized, trailing-slash internal path. */
export const detailPathFor = (hub: CanonicalRoute, locale: Language, slug: string): string =>
  normalizeInternalPath(
    `${LOCALE_PREFIX[locale as Locale] || ''}/${slugForCanonical(hub, locale as Locale)}/${slug}`,
  );

/**
 * Exact localized detail paths for every locale that really has this entry.
 * Uses the same stable translation identity as build-time grouping, so
 * prerendered and runtime hreflang sets are identical.
 */
export const resolveAlternatePaths = async (
  route: { load: (lang: Language) => Promise<CmsEntryBase[]>; hub: CanonicalRoute },
  entry: CmsEntryBase,
): Promise<Partial<Record<Language, string>>> => {
  const key = translationKeyOf(entry);
  const out: Partial<Record<Language, string>> = {};
  const perLocale = await Promise.all(
    LOCALES.map(async (loc) => {
      try {
        return [loc, await route.load(loc)] as const;
      } catch {
        return [loc, [] as CmsEntryBase[]] as const;
      }
    }),
  );
  for (const [loc, items] of perLocale) {
    const match = items.find((e) => translationKeyOf(e) === key);
    if (match) out[loc] = detailPathFor(route.hub, loc, match.slug);
  }
  return out;
};

const buildJsonLd = (
  entry: CmsEntryBase,
  schemaType: 'Article' | 'NewsArticle' | 'Event',
  url: string,
): Record<string, unknown> => {
  // Event schema requires a machine-readable start date. Editorial content may
  // only carry a display date ("31. juli – 7. august 2026") — in that case we
  // fall back to Article, exactly like the prerenderer does.
  const ev = entry as CmsEvent;
  const isEvent = schemaType === 'Event' && isIsoDate(ev.startsAt);
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': isEvent ? 'Event' : schemaType === 'Event' ? 'Article' : schemaType,
    headline: entry.title,
    name: entry.title,
    description: entry.seoDescription ?? entry.intro ?? '',
    inLanguage: toBcp47(entry.language),
    url,
    image: entry.heroImage?.url ? [entry.heroImage.url] : undefined,
  };
  if (isIsoDate(entry.publishedAt)) base.datePublished = entry.publishedAt;
  const modified = entry.updatedAt ?? entry.publishedAt;
  if (isIsoDate(modified)) base.dateModified = modified;
  if (isEvent) {
    base.startDate = ev.startsAt;
    if (isIsoDate(ev.endsAt)) base.endDate = ev.endsAt;
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
    const alternatePaths = await resolveAlternatePaths(route, entry);
    const available = Object.keys(alternatePaths) as Language[];
    return {
      title: entry.seoTitle ?? entry.title,
      description: entry.seoDescription ?? entry.intro,
      image: entry.ogImage?.url ?? entry.heroImage?.url,
      canonicalPath,
      // Only locales that really have this entry — never a fixed six.
      availableTranslations:
        entry.availableTranslations ?? (available.length ? available : [language]),
      alternatePaths,
      translatedBody: entry.translatedBody ?? language === 'no',
      // Runtime Supabase submissions (`submission-*`) are deliberately not
      // prerendered or sitemapped — keep their detail URL out of the index.
      noindex: String(entry.id).startsWith('submission-'),
      jsonLd: buildJsonLd(entry, route.schemaType, absoluteUrl),
    };
  }
  return null;
}