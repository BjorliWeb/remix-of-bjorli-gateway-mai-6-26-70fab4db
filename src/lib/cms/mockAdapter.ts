import type { CmsAdapter } from './adapter';
import type {
  CmsActivity,
  CmsAlert,
  CmsEvent,
  CmsFooter,
  CmsHomepage,
  CmsItemQuery,
  CmsListQuery,
  CmsNavigation,
  CmsNews,
  CmsOpeningHours,
  CmsPage,
  CmsTip,
  Language,
} from './types';

import { dictionaries } from '@/i18n/translations';
import type { Dictionary } from '@/i18n/locales/types';
import { slugify } from '@/lib/slug';
import { supabase } from '@/integrations/supabase/client';

/**
 * Image strategy: never import AI/stock JPGs directly anymore.
 * Pull from `@/lib/images`, which keeps real photos when available and
 * labeled "Real Bjorli ... image" placeholders otherwise. Each entry also
 * carries the WordPress media-field key, so swapping to the WP adapter
 * later requires zero changes here.
 */
import { images, type BjorliImage } from '@/lib/images';
import type { CmsImage } from './types';

/** Build a CmsImage from a registry entry, preserving alt/wpField/etc. */
const img = (key: keyof typeof images, altOverride?: string): CmsImage => {
  const i: BjorliImage = images[key];
  return {
    url: i.src,
    alt: altOverride ?? i.alt,
    caption: i.caption,
    credit: i.credit,
    wpField: i.wpField,
    placeholder: i.placeholder,
  };
};

const heroWinter      = images.heroWinter.src;
const accommodationImg = images.accommodation.src;
const skiSchoolImg    = images.skiSchool.src;
const foodDrinkImg    = images.foodDrink.src;
const tipPlanning     = images.tipPlanning.src;
const tipTrain        = images.tipTrain.src;
const tipFamily       = images.tipFamily.src;
const summerImg       = images.summer.src;
const crossCountry    = images.crossCountry.src;
const cabinEvening    = images.cabinEvening.src;
const concertImg      = images.event.src;
const hikingImg       = images.hiking.src;
const bikingImg       = images.biking.src;
const summerHero      = images.heroSummer.src;

/**
 * Mock CMS adapter.
 *
 * Until an editorial CMS (Sanity / Strapi / DatoCMS / Storyblok) is selected,
 * this adapter serves content from local i18n dictionaries + bundled images.
 * Components MUST go through `src/lib/cms/index.ts`, never read this file
 * directly — the adapter is an implementation detail.
 */

const dict = (lang: Language): Dictionary => dictionaries[lang] ?? dictionaries.no;

const TIP_IMAGES = [tipPlanning, tipTrain, tipFamily, summerImg];
const NEWS_IMAGES = [skiSchoolImg, accommodationImg, foodDrinkImg, summerImg];
const EVENT_IMAGES = [concertImg, tipFamily, foodDrinkImg, summerImg];
const ACTIVITY_IMAGES = [skiSchoolImg, crossCountry, cabinEvening, hikingImg, bikingImg, heroWinter];

const nowIso = () => new Date().toISOString();

const apply = <T>(items: T[], q: CmsListQuery): T[] => {
  let out = items;
  if (q.category) out = out.filter((i: any) => i.category === q.category);
  if (q.season) out = out.filter((i: any) => !i.season || i.season === q.season || i.season === 'all');
  if (q.limit) out = out.slice(0, q.limit);
  return out;
};

const buildTips = (lang: Language): CmsTip[] => {
  const d = dict(lang);
  return d.tips.items.map((t, i) => ({
    id: `tip-${lang}-${i}`,
    slug: slugify(t.title),
    language: lang,
    title: t.title,
    intro: t.intro,
    body: t.intro,
    heroImage: { url: TIP_IMAGES[i % TIP_IMAGES.length], alt: t.title },
    category: t.category,
    season: 'all',
    publishedAt: nowIso(),
    updatedAt: nowIso(),
    seoTitle: t.title,
    seoDescription: t.intro,
  }));
};

const buildNews = (lang: Language): CmsNews[] => {
  const d = dict(lang);
  return d.news.items.map((n, i) => ({
    id: `news-${lang}-${i}`,
    slug: slugify(n.title),
    language: lang,
    title: n.title,
    intro: n.intro,
    body: n.intro,
    heroImage: { url: NEWS_IMAGES[i % NEWS_IMAGES.length], alt: n.title },
    category: n.category,
    season: 'all',
    publishedAt: n.date,
    updatedAt: n.date,
    seoTitle: n.title,
    seoDescription: n.intro,
  }));
};

const buildEvents = (lang: Language): CmsEvent[] => {
  const d = dict(lang);
  return d.events.items.map((e, i) => ({
    id: `event-${lang}-${i}`,
    slug: slugify(e.title),
    language: lang,
    title: e.title,
    intro: e.intro,
    body: e.intro,
    heroImage: { url: EVENT_IMAGES[i % EVENT_IMAGES.length], alt: e.title },
    category: e.category,
    season: 'all',
    publishedAt: e.date,
    updatedAt: e.date,
    startsAt: e.date,
    seoTitle: e.title,
    seoDescription: e.intro,
  }));
};

const buildActivities = (lang: Language): CmsActivity[] => {
  const d = dict(lang);
  const winter = d.beyondAlpine.items.map((it, i) => ({
    id: `activity-${lang}-w-${i}`,
    slug: slugify(it.title),
    language: lang,
    title: it.title,
    intro: it.desc,
    body: it.desc,
    heroImage: { url: ACTIVITY_IMAGES[i % ACTIVITY_IMAGES.length], alt: it.title },
    category: d.nav.winter,
    season: 'winter' as const,
    publishedAt: nowIso(),
    updatedAt: nowIso(),
    seoTitle: it.title,
    seoDescription: it.desc,
  }));
  const summer = d.summer.activities.map((it, i) => ({
    id: `activity-${lang}-s-${i}`,
    slug: slugify(it.title),
    language: lang,
    title: it.title,
    intro: it.desc,
    body: it.desc,
    heroImage: { url: ACTIVITY_IMAGES[(i + 3) % ACTIVITY_IMAGES.length], alt: it.title },
    category: d.nav.summer,
    season: 'summer' as const,
    publishedAt: nowIso(),
    updatedAt: nowIso(),
    seoTitle: it.title,
    seoDescription: it.desc,
  }));
  return [...winter, ...summer];
};

export const mockAdapter: CmsAdapter = {
  name: 'mock',

  async getPage({ language, slug }) {
    const d = dict(language);
    const page: CmsPage = {
      id: `page-${language}-${slug}`,
      slug,
      language,
      title: d.meta.siteName,
      intro: d.meta.tagline,
      heroImage: { url: heroWinter, alt: d.meta.siteName },
      season: 'all',
      publishedAt: nowIso(),
      updatedAt: nowIso(),
      seoTitle: d.meta.siteName,
      seoDescription: d.meta.tagline,
    };
    return page;
  },

  async getHomepage({ language, season = 'winter' }) {
    const d = dict(language);
    const isSummer = season === 'summer';

    const tips = buildTips(language).slice(0, 4);
    const news = buildNews(language).slice(0, 4);
    const events = buildEvents(language).slice(0, 4);

    // ─── WINTER HOMEPAGE ─────────────────────────────────────────────
    // Section order matches the official Bjorli winter homepage spec:
    //   1 Header (Layout) · 2 Hero (Index.tsx)
    //   3 Status · 4 Alert · 5 Intro · 6 Planning cards · 7 Skisenter
    //   8 Bo godt · 9 Tips · 10 Hva skjer · 11 Mer enn alpint
    //   12 Reisen hit · 13 Sommer-teaser · 14 Siste nytt · 15 FAQ
    //   16 Footer (Layout)
    // Status / Alert / Tips / Events / News are placeholders here and
    // will later be served by WordPress + a small ops backend.
    const winterSections: any[] = [
      {
        id: 'status',
        type: 'status',
        heading: d.status.heading,
        caption: d.status.caption,
        cards: [
          { icon: 'lifts', value: '4/6', label: d.status.liftsOpen },
          { icon: 'slopes', value: '7/11', label: d.status.slopes },
          { icon: 'snow', value: '80 cm', label: d.status.snowDepth },
          { icon: 'temperature', value: '−12°C', label: d.status.temperature },
        ],
        links: [
          { icon: 'clock', label: d.status.openToday, href: '/apningstider' },
          // Homepage label stays short ("Livecams") for visual fit; the link
          // resolves to the new combined "Vær og webkamera" page.
          { icon: 'camera', label: d.status.livecams, href: '/vaer-og-webkamera' },
        ],
      },
      {
        id: 'alert',
        type: 'alert',
        label: d.alert.label,
        message: d.alert.sample,
        ctaLabel: d.alert.sampleCta,
        ctaHref: '/apningstider',
      },
      { id: 'intro', type: 'intro', title: d.intro.title, body: d.intro.body },
      {
        id: 'planning',
        type: 'cardGrid',
        title: d.planning.title,
        subtitle: d.planning.subtitle,
        items: d.planning.items.map((it, i) => ({
          title: it.title,
          desc: it.desc,
          icon: ['mountain', 'ticket', 'clock', 'camera', 'map', 'home', 'activity', 'coffee'][i],
        })),
      },
      {
        id: 'skiCenter',
        type: 'feature',
        eyebrow: d.skiCenter.eyebrow,
        title: d.skiCenter.title,
        body: d.skiCenter.body,
        image: { url: heroWinter, alt: d.skiCenter.title },
        imageSide: 'left',
        ctas: [
          { label: d.skiCenter.ctaPrimary, href: '/bjorli-skisenter', variant: 'primary' },
          {
            label: d.skiCenter.ctaSecondary,
            href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862',
            variant: 'secondary',
            external: true,
            icon: 'ticket',
          },
        ],
      },
      {
        id: 'accommodation',
        type: 'feature',
        eyebrow: d.accommodation.eyebrow,
        title: d.accommodation.title,
        body: d.accommodation.body,
        image: { url: accommodationImg, alt: d.accommodation.title },
        imageSide: 'right',
        ctas: [
          { label: d.accommodation.cta, href: '/overnatting', variant: 'primary' },
          ...(d.accommodation.ctaSecondary
            ? [{ label: d.accommodation.ctaSecondary, href: '/overnatting', variant: 'outline' as const }]
            : []),
        ],
        subcards: d.accommodation.subcards,
      },
      {
        id: 'tips',
        type: 'tips',
        eyebrow: d.tips.eyebrow,
        title: d.tips.title,
        subtitle: d.tips.subtitle,
        ctaLabel: d.tips.cta,
        ctaHref: '/tips',
        items: tips,
      },
      {
        id: 'events',
        type: 'events',
        eyebrow: d.events.eyebrow,
        title: d.events.title,
        subtitle: d.events.subtitle,
        ctaLabel: d.events.cta,
        ctaHref: '/arrangementer',
        items: events.map((e, i) => ({ ...e, date: d.events.items[i]?.date ?? '' })),
      },
      {
        id: 'beyond',
        type: 'beyond',
        eyebrow: d.beyondAlpine.eyebrow,
        title: d.beyondAlpine.title,
        body: d.beyondAlpine.body,
        images: [
          { url: crossCountry, alt: 'Langrenn' },
          { url: cabinEvening, alt: 'Hytteliv' },
        ],
        items: d.beyondAlpine.items.map((it, i) => ({
          title: it.title,
          desc: it.desc,
          icon: ['activity', 'snowflake', 'home', 'mountain', 'train', 'users'][i],
        })),
      },
      ...(d.whyBjorli
        ? [{
            id: 'whyBjorli',
            type: 'cardGrid' as const,
            eyebrow: d.whyBjorli.eyebrow,
            title: d.whyBjorli.title,
            items: d.whyBjorli.items,
          }]
        : []),
      {
        id: 'gettingHere',
        type: 'gettingHere',
        eyebrow: d.gettingHere.eyebrow,
        title: d.gettingHere.title,
        body: d.gettingHere.body,
        cities: d.gettingHere.cities,
        ctas: [
          { label: d.gettingHere.cta, href: '/reisen-hit', icon: 'car' },
          { label: d.gettingHere.seeMap, href: 'https://maps.app.goo.gl/ahakM1xvEkJ5oPiU7', icon: 'map', external: true },
          { label: 'Raumabanen', href: 'https://www.vy.no/', icon: 'train', external: true },
        ],
      },
      {
        id: 'summerTeaser',
        type: 'teaser',
        eyebrow: d.summerTeaser.eyebrow,
        title: d.summerTeaser.title,
        body: d.summerTeaser.body,
        ctaLabel: d.summerTeaser.cta,
        ctaHref: '/sommer',
        image: { url: summerImg, alt: d.summerTeaser.title },
      },
      {
        id: 'news',
        type: 'news',
        eyebrow: d.news.eyebrow,
        title: d.news.title,
        subtitle: d.news.subtitle,
        ctaLabel: d.news.cta,
        ctaHref: '/nyheter',
        items: news.map((n, i) => ({ ...n, date: d.news.items[i]?.date ?? '' })),
      },
      {
        id: 'faq',
        type: 'faq',
        eyebrow: d.faq.eyebrow,
        title: d.faq.title,
        items: d.faq.items,
      },
    ];

    // ─── SUMMER HOMEPAGE ─────────────────────────────────────────────
    // Section order matches the official Bjorli summer homepage spec:
    //   1 Header · 2 Summer hero · 3 Intro (Opplev sommeren)
    //   4 Activity cards · 5 Bo på Bjorli · 6 Basecamp fjell/fjord
    //   7 Tips · 8 Hva skjer · 9 Mat og drikke · 10 Reisen hit
    //   11 Vinter-teaser · 12 Siste nytt · 13 FAQ · 14 Footer
    // Detail copy below is placeholder until WordPress is connected;
    // strings stay in NO for the placeholder iteration.
    const summerSections: any[] = [
      {
        id: 'intro',
        type: 'intro',
        title: 'Opplev sommeren på Bjorli',
        body: d.summer.intro,
      },
      {
        id: 'summerActivities',
        type: 'activities',
        title: d.summer.activitiesTitle,
        subtitle: d.summer.activitiesSubtitle,
        items: d.summer.activities.map((a, i) => ({
          title: a.title,
          desc: a.desc,
          icon: ['mountain', 'bike', 'users', 'treePine'][i],
        })),
        imageCards: [
          { title: d.summer.activities[0]?.title ?? '', desc: d.summer.activities[0]?.desc, image: { url: hikingImg, alt: 'Fotturer' } },
          { title: d.summer.activities[1]?.title ?? '', desc: d.summer.activities[1]?.desc, image: { url: bikingImg, alt: 'Sykling' } },
        ],
      },
      {
        id: 'accommodationSummer',
        type: 'feature',
        eyebrow: 'Overnatting',
        title: 'Bo på Bjorli',
        body: 'Velg mellom hytter, leiligheter og hoteller midt i fjellet. Korte avstander til turstier, sykkelruter og naturopplevelser i Romsdalen — perfekt som base for hele familien.',
        image: { url: accommodationImg, alt: 'Overnatting på Bjorli' },
        imageSide: 'left',
        ctas: [{ label: 'Se overnatting', href: '/overnatting', variant: 'primary' }],
      },
      {
        id: 'basecamp',
        type: 'feature',
        eyebrow: 'Mellom fjell og fjord',
        title: 'Bjorli som basecamp mellom fjell og fjord',
        body: 'Bjorli ligger mellom Dombås og Åndalsnes, like ved Reinheimen, Dovrefjell og Romsdalsalpene. Bruk Bjorli som rolig fjellbase for dagsturer til nasjonalparker, Trollstigen, Romsdalen og Atlanterhavsveien.',
        image: { url: summerImg, alt: 'Bjorli som basecamp mellom fjell og fjord' },
        imageSide: 'right',
        ctas: [
          { label: 'Se aktiviteter', href: '/aktiviteter', variant: 'primary' },
          { label: 'Reisen hit', href: '/reisen-hit', variant: 'outline' },
        ],
      },
      {
        id: 'tips',
        type: 'tips',
        eyebrow: d.tips.eyebrow,
        title: d.tips.title,
        subtitle: d.tips.subtitle,
        ctaLabel: d.tips.cta,
        ctaHref: '/tips',
        items: tips,
      },
      {
        id: 'events',
        type: 'events',
        eyebrow: d.events.eyebrow,
        title: d.events.title,
        subtitle: d.events.subtitle,
        ctaLabel: d.events.cta,
        ctaHref: '/arrangementer',
        items: events.map((e, i) => ({ ...e, date: d.events.items[i]?.date ?? '' })),
      },
      {
        id: 'foodDrinkSummer',
        type: 'feature',
        eyebrow: 'Mat og drikke',
        title: 'Smaker fra fjellet',
        body: 'Etter en dag i naturen smaker maten ekstra godt. På Bjorli finner du serveringssteder, lokal mat og hyggelige stunder rundt bordet — fra enkel kaffe på turen til et ordentlig måltid etter en lang dag ute.',
        image: { url: foodDrinkImg, alt: 'Mat og drikke på Bjorli' },
        imageSide: 'left',
        ctas: [{ label: 'Se mat og drikke', href: '/mat-og-drikke', variant: 'primary' }],
      },
      {
        id: 'gettingHere',
        type: 'gettingHere',
        eyebrow: d.gettingHere.eyebrow,
        title: d.gettingHere.title,
        body: d.gettingHere.body,
        cities: d.gettingHere.cities,
        ctas: [
          { label: d.gettingHere.cta, href: '/reisen-hit', icon: 'car' },
          { label: d.gettingHere.seeMap, href: 'https://maps.app.goo.gl/ahakM1xvEkJ5oPiU7', icon: 'map', external: true },
          { label: 'Raumabanen', href: 'https://www.vy.no/', icon: 'train', external: true },
        ],
      },
      {
        id: 'winterTeaser',
        type: 'teaser',
        eyebrow: 'Året rundt',
        title: d.summer.winterTeaserTitle,
        body: d.summer.winterTeaserBody,
        ctaLabel: d.summer.winterTeaserCta,
        ctaHref: '/',
        image: { url: heroWinter, alt: d.summer.winterTeaserTitle },
      },
      {
        id: 'news',
        type: 'news',
        eyebrow: d.news.eyebrow,
        title: d.news.title,
        subtitle: d.news.subtitle,
        ctaLabel: d.news.cta,
        ctaHref: '/nyheter',
        items: news.map((n, i) => ({ ...n, date: d.news.items[i]?.date ?? '' })),
      },
      {
        id: 'faq',
        type: 'faq',
        eyebrow: d.faq.eyebrow,
        title: d.faq.title,
        items: d.faq.items,
      },
    ];

    const home: CmsHomepage = {
      id: `home-${language}-${season}`,
      slug: isSummer ? 'sommer' : '',
      language,
      title: d.meta.siteName,
      intro: d.meta.tagline,
      season,
      heroTitle: isSummer ? d.summer.title : d.hero.title,
      heroSubtitle: isSummer ? d.summer.subtitle : d.hero.subtitle,
      heroIntro: isSummer ? d.summer.intro : d.hero.intro,
      heroImage: { url: isSummer ? summerHero : heroWinter, alt: d.meta.siteName },
      publishedAt: nowIso(),
      updatedAt: nowIso(),
      seoTitle: isSummer ? d.summer.title : d.hero.title,
      seoDescription: isSummer ? d.summer.intro : d.hero.intro,
      sections: isSummer ? summerSections : winterSections,
    };
    return home;
  },

  async getNews(q) { return apply(buildNews(q.language), q); },
  async getEvents(q) { return apply(buildEvents(q.language), q); },
  async getTips(q) { return apply(buildTips(q.language), q); },
  async getActivities(q) { return apply(buildActivities(q.language), q); },

  async getNewsItem({ language, slug }) {
    return buildNews(language).find((i) => i.slug === slug) ?? null;
  },
  async getEventItem({ language, slug }) {
    return buildEvents(language).find((i) => i.slug === slug) ?? null;
  },
  async getTipItem({ language, slug }) {
    return buildTips(language).find((i) => i.slug === slug) ?? null;
  },
  async getActivityItem({ language, slug }) {
    return buildActivities(language).find((i) => i.slug === slug) ?? null;
  },

  async getNavigation({ language }) {
    const d = dict(language);
    const nav: CmsNavigation = {
      language,
      primary: [
        { label: d.nav.winter, href: '/' },
        { label: d.nav.summer, href: '/sommer' },
        { label: d.nav.skiCenter, href: '/bjorli-skisenter' },
        // "Vær og webkamera" — combined live status + webcams (replaces Livecams).
        { label: d.nav.weatherWebcams, href: '/vaer-og-webkamera' },
        { label: d.nav.accommodation, href: '/overnatting' },
        { label: d.nav.activities, href: '/aktiviteter' },
        { label: d.nav.whatsOn, href: '/arrangementer' },
        { label: d.nav.tips, href: '/tips' },
        { label: d.nav.gettingHere, href: '/reisen-hit' },
      ],
    };
    return nav;
  },

  async getFooter({ language }) {
    const d = dict(language);
    return {
      language,
      about: d.footer.aboutBody,
      address: d.footer.address,
      columns: [
        { title: d.footer.winterTitle, links: d.footer.winterLinks },
        { title: d.footer.summerTitle, links: d.footer.summerLinks },
        { title: d.footer.planTitle, links: d.footer.planLinks },
      ],
    };
  },

  async getAlerts(q) {
    const d = dict(q.language);
    // Try live alerts from the operational backend first (CMS-agnostic
    // — a future Sanity/Strapi/etc. adapter would do the same fetch
    // against its own provider). Falls back to mock data if unavailable.
    try {
      const nowIsoStr = new Date().toISOString();
      const { data, error } = await supabase
        .from('alerts')
        .select('id, language, level, label, message, cta_label, cta_href, published_at, starts_at, ends_at')
        .eq('is_active', true)
        .or(`language.eq.${q.language},language.eq.no`)
        .or(`starts_at.is.null,starts_at.lte.${nowIsoStr}`)
        .or(`ends_at.is.null,ends_at.gte.${nowIsoStr}`)
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Prefer rows in the requested language, then fall back to 'no'.
        const byLang = data.filter((r) => r.language === q.language);
        const rows = byLang.length > 0 ? byLang : data;
        const live: CmsAlert[] = rows.map((r) => ({
          id: r.id,
          language: (r.language as Language) ?? q.language,
          level: ((r.level as CmsAlert['level']) ?? 'info'),
          label: r.label ?? d.alert.label,
          message: r.message,
          ctaLabel: r.cta_label ?? undefined,
          ctaHref: r.cta_href ?? undefined,
          publishedAt: r.published_at ?? undefined,
          startsAt: r.starts_at ?? undefined,
          endsAt: r.ends_at ?? undefined,
        }));
        return q.limit ? live.slice(0, q.limit) : live;
      }
    } catch {
      // ignore — fall through to mock data
    }

    const alerts: CmsAlert[] = [
      {
        id: `alert-${q.language}-driftsmelding`,
        language: q.language,
        level: 'info',
        label: d.alert.label,
        message: d.alert.sample,
        ctaLabel: d.alert.sampleCta,
        ctaHref: '/bjorli-skisenter',
        publishedAt: nowIso(),
      },
    ];
    return q.limit ? alerts.slice(0, q.limit) : alerts;
  },

  async getOpeningHours({ language }) {
    const d = dict(language);
    return {
      language,
      todayLabel: d.status.openToday,
      weekly: [],
      rows: [],
    };
  },

  /* ------------------------------------------------------------------ */
  /* Accommodation / Food & Drink / SEO Settings                        */
  /*                                                                    */
  /* These are intentionally empty in the mock adapter — they exist so  */
  /* the contract is complete and a future WordPress adapter can plug   */
  /* in without touching component code. Real entries will be loaded    */
  /* from WordPress CPTs (`bjorli_accommodation`, `bjorli_food_drink`)  */
  /* and an ACF Options page (`bjorli_seo_settings`).                   */
  /* ------------------------------------------------------------------ */
  async getAccommodations() { return []; },
  async getFoodDrink() { return []; },
  async getAccommodationItem() { return null; },
  async getFoodDrinkItem() { return null; },
  async getSeoSettings({ language }) {
    const d = dict(language);
    return {
      language,
      siteName: d.meta.siteName,
      defaultTitle: d.meta.siteName,
      defaultDescription: d.meta.tagline,
      canonicalBaseUrl: 'https://bjorli.no',
      robots: 'index,follow',
      sitemapUrl: '/sitemap.xml',
      llmsTxtBlocks: [],
    };
  },
};
