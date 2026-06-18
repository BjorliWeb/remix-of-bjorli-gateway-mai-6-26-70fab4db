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
  SeoLandingEntry,
} from './types';

import { dictionaries } from '@/i18n/translations';
import type { Dictionary } from '@/i18n/locales/types';
import { slugify } from '@/lib/slug';
import { supabase } from '@/integrations/supabase/client';
import { SUMMER_HOMEPAGE_COPY } from './summerHomepageCopy';
import klatringHeroImg from '@/assets/klatring/klatring-hero-romsdalen-granitt.jpg';

/**
 * Image strategy: never import AI/stock JPGs directly anymore.
 * Pull from `@/lib/images`, which keeps real photos when available and
 * labeled "Real Bjorli ... image" placeholders otherwise. Each entry also
 * carries the WordPress media-field key, so swapping to the WP adapter
 * later requires zero changes here.
 */
import { images, type BjorliImage } from '@/lib/images';
import farmVisitsImg from '@/assets/farms/gardsbesok-lesja-kulturlandskap.avif';
import type { CmsImage } from './types';

/**
 * Editorial rename for the homepage "news" section. The official
 * scope is updates from Bjorli Skisenter / Nye Bjorli Skisenter AS
 * (season opening, snow, lift-pass, campaigns, slope/park, ski school
 * & rental, operational and relevant company news), so the section
 * title is overridden here rather than touching translation files.
 */
const SKISENTER_NEWS_TITLE: Record<Language, string> = {
  no: 'Siste nytt fra Bjorli Skisenter',
  en: 'Latest from Bjorli Skisenter',
  de: 'Aktuelles aus dem Bjorli Skisenter',
  nl: 'Laatste nieuws van Bjorli Skisenter',
  da: 'Sidste nyt fra Bjorli Skisenter',
  sv: 'Senaste nytt från Bjorli Skisenter',
};

/**
 * Editorial winter intro copy (split layout, Stayli-inspired pacing).
 * Falls back to the dictionary `intro.title/body` for any locale we
 * have not yet hand-translated.
 */
function buildWinterIntro(lang: Language, d: Dictionary) {
  type Intro = { eyebrow: string; statement: string; supportingText: string; proofPoints: string[]; title: string; body: string };
  const fallback = { title: d.intro.title, body: d.intro.body };
  const map: Partial<Record<Language, Intro>> = {
    no: {
      eyebrow: 'Destinasjon Bjorli',
      statement: 'Ekte vinter, korte avstander og rolige fjelldager mellom Østlandet og fjordene på Nordvestlandet.',
      supportingText: 'Bjorli samler alpint, langrenn, hytter, servering og natur tett på hverandre. Her er det enkelt å planlegge en vinterhelg, en familieferie eller noen rolige dager på fjellet.',
      proofPoints: ['Snøsikkert og familievennlig', 'Tog til fjellet med Raumabanen', 'Ski, hytter og natur tett på hverandre'],
      ...fallback,
    },
    en: {
      eyebrow: 'Destination Bjorli',
      statement: 'Real winter, short distances and calm mountain days between eastern Norway and the western fjords.',
      supportingText: 'Bjorli brings alpine skiing, cross-country, cabins, dining and nature close together. It is an easy place to plan a winter weekend, a family holiday or a few calm days on the mountain.',
      proofPoints: ['Snow-sure and family-friendly', 'Train to the mountain via the Rauma Line', 'Ski, cabins and nature close together'],
      ...fallback,
    },
    de: {
      eyebrow: 'Destination Bjorli',
      statement: 'Echter Winter, kurze Wege und ruhige Bergtage zwischen Ostnorwegen und den Westfjorden.',
      supportingText: 'Bjorli vereint Alpinski, Langlauf, Hütten, Gastronomie und Natur dicht beieinander – ideal für ein Winterwochenende, einen Familienurlaub oder ein paar ruhige Bergtage.',
      proofPoints: ['Schneesicher und familienfreundlich', 'Mit der Rauma-Bahn ins Gebirge', 'Ski, Hütten und Natur eng beisammen'],
      ...fallback,
    },
    nl: {
      eyebrow: 'Bestemming Bjorli',
      statement: 'Echte winter, korte afstanden en rustige bergdagen tussen Oost-Noorwegen en de westelijke fjorden.',
      supportingText: 'Op Bjorli liggen alpineskiën, langlauf, hutten, restaurants en natuur dicht bij elkaar. Ideaal voor een winterweekend, een gezinsvakantie of een paar rustige bergdagen.',
      proofPoints: ['Sneeuwzeker en gezinsvriendelijk', 'Met de trein de bergen in via de Raumabanen', 'Ski, hutten en natuur dicht bij elkaar'],
      ...fallback,
    },
    da: {
      eyebrow: 'Destination Bjorli',
      statement: 'Ægte vinter, korte afstande og rolige bjergdage mellem Østnorge og fjordene mod vest.',
      supportingText: 'På Bjorli ligger alpinski, langrend, hytter, servering og natur tæt sammen. Det er nemt at planlægge en vinterweekend, en familieferie eller nogle rolige dage i fjeldet.',
      proofPoints: ['Snesikkert og familievenligt', 'Tog til fjeldet med Raumabanen', 'Ski, hytter og natur tæt på'],
      ...fallback,
    },
    sv: {
      eyebrow: 'Destination Bjorli',
      statement: 'Äkta vinter, korta avstånd och lugna fjälldagar mellan östra Norge och fjordarna i väst.',
      supportingText: 'På Bjorli ligger alpint, längdåkning, stugor, servering och natur tätt ihop. Här är det enkelt att planera en vinterhelg, en familjesemester eller några lugna dagar i fjället.',
      proofPoints: ['Snösäkert och familjevänligt', 'Tåg till fjället med Raumabanen', 'Skidor, stugor och natur tätt ihop'],
      ...fallback,
    },
  };
  return map[lang] ?? fallback;
}

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
const flyFishingImg   = images.flyFishing.src;
const familySummerImg = images.familySummer.src;
const summerValleyImg = images.summerValley.src;
import pumpTrackImg   from '@/assets/photos/bjorli-aktivitetspark-skilt.jpg';
import hostmarkedImg  from '@/assets/photos/bjorli-hostmarked-plakat.jpg';
import bjorliheimenBuffetImg from '@/assets/photos/bjorliheimen-sondagsbuffet.jpg';
import ls2026Img from '@/assets/photos/ls2026-landsskytterstevnet-lesja.jpg';

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
// Index map mirrors event order in dictionaries (no.ts/en.ts/...):
//   0 Pump track  → pumpTrackImg (Bjorli Aktivitetspark sign)
//   1 Søndagsbuffet Bjorliheimen → bjorliheimenBuffetImg
//   2 Landsskytterstevnet 2026 → ls2026Img
//   3 Høstmarked  → hostmarkedImg (Marked på Bjorli poster)
//   4 Åpningshelg → concertImg (golden village)
//   5 Vinterferie → tipFamily (kid on the snow)
//   6 Påske       → crossCountry (sunny snow-covered mountains)
//   7 Sommer      → summerImg
const EVENT_IMAGES = [pumpTrackImg, bjorliheimenBuffetImg, ls2026Img, hostmarkedImg, concertImg, tipFamily, crossCountry, summerImg];
// Split per season so summer activities never get assigned a winter photo.
const WINTER_ACTIVITY_IMAGES = [skiSchoolImg, crossCountry, cabinEvening, heroWinter];
const SUMMER_ACTIVITY_IMAGES = [hikingImg, bikingImg, familySummerImg, summerValleyImg];

const nowIso = () => new Date().toISOString();

/* ------------------------------------------------------------------ */
/* SEO landing fixtures (Build 1 — single test entry)                 */
/* ------------------------------------------------------------------ */

/**
 * Key format: `<locale>/<slug>` — the bare slug, never URL-prefixed.
 * The frontend composes `/<locale>/<slug>` from these two fields.
 */
const SEO_LANDING_FIXTURES: Record<string, SeoLandingEntry> = {
  'en/ski-holiday-norway': {
    id: 'seo-landing-en-ski-holiday-norway',
    locale: 'en',
    slug: 'ski-holiday-norway',
    title: 'Ski Holiday in Norway',
    intro:
      'Reliable winter conditions, real Norwegian mountains and a family-friendly base in Romsdalen — discover Bjorli.',
    heroImage: img('heroWinter', 'Bjorli mountain panorama in winter'),
    pageSummary:
      'Bjorli is a mountain destination in Lesja, between Dombås and Åndalsnes in Romsdalen. The high-altitude, inland location gives a long winter season with alpine and cross-country skiing, family-friendly slopes and easy access by road, train and air.',
    pageSummaryFacts: [
      { label: 'Region', value: 'Romsdalen, Innlandet, Norway' },
      { label: 'Main access airports', value: 'Ålesund, Molde and Oslo' },
      { label: 'Train', value: 'Rauma Line via Dombås' },
      { label: 'Best for', value: 'Family ski holidays, reliable winter conditions' },
    ],
    bodySections: [
      {
        id: 'why-bjorli',
        type: 'rich_text',
        heading: 'Why choose Bjorli for a ski holiday in Norway',
        body:
          'Bjorli sits high in the Romsdalen valley and is the gateway between eastern and north-western Norway. The altitude and inland climate give a long winter season, real mountain terrain and a relaxed, family-friendly atmosphere — a short drive or train ride from Oslo and Trondheim, and close to the Rauma River, Trollveggen, Trollstigen, the Geirangerfjord, Ålesund and Dovrefjell.',
      },
      {
        id: 'ski-center',
        type: 'rich_text',
        heading: 'Bjorli Skisenter',
        body:
          'Bjorli Skisenter is the heart of winter at Bjorli — alpine slopes for every level, modern lifts, snow cannons for early-season cover and wide-open views over the Romsdalen mountains. Live lift and slope status, snow depth and temperature are published from the resort throughout the season.',
      },
      {
        id: 'cta-ski-resort',
        type: 'cta_block',
        label: 'Explore the ski resort',
        href: '/en/bjorli-ski-resort',
        variant: 'primary',
      },
      {
        id: 'family',
        type: 'rich_text',
        heading: 'Family-friendly skiing',
        body:
          'Bjorli is built around families. The ski resort has gentle beginner slopes close to the base area, a ski school for first-timers and improvers, and ski rental on site so you can travel light. Most accommodation is within a short drive or shuttle of the lifts, making the day easy to manage with children.',
      },
      {
        id: 'travel',
        type: 'rich_text',
        heading: 'Travel to Bjorli',
        body:
          'By car: take E6 north from Oslo to Dombås, then E136 west to Bjorli — around 5 hours by car from Oslo, depending on route and conditions. By train: the Rauma Line connects Dombås with Bjorli station, just a short walk from the village. Main access airports are Ålesund, Molde and Oslo. For train and bus schedules and ticket booking, visit www.entur.no.',
      },
      {
        id: 'beyond-alpine',
        type: 'rich_text',
        heading: 'More than alpine skiing',
        body:
          'Bjorli is also a cross-country destination, with groomed trails (langrennsløyper) connecting the village with the surrounding fells. Beyond skiing, you can sled, snowshoe, ski tour and enjoy local food and drink — and in summer, the same mountains offer strong access to hiking and cycling in the surrounding mountains.',
      },
    ],
    faq: [
      {
        q: 'Where is Bjorli located in Norway?',
        a: 'Bjorli is a mountain village in Lesja, Innlandet county, between Dombås and Åndalsnes along the E136 highway and the Rauma Line. It sits on a high plateau, which is the main reason it has such a long, reliable winter season.',
      },
      {
        q: 'When is the ski season at Bjorli?',
        a: 'Bjorli typically opens earlier and closes later than lower-altitude resorts thanks to its high inland plateau. For the latest live status, lift count and snow depth, check the live status on the homepage and the opening hours page.',
      },
      {
        q: 'Is Bjorli good for a family ski holiday?',
        a: 'Yes. Bjorli has dedicated beginner areas, a ski school, ski rental on site and a wide range of family-friendly accommodation, from cabins to apartments. The compact ski resort layout makes it easy to keep children close.',
      },
      {
        q: 'How do you get to Bjorli from Oslo?',
        a: 'By car, follow E6 north to Dombås and continue west on E136 — around 5 hours by car from Oslo, depending on route and conditions. By train, take the Dovre Line to Dombås and change to the Rauma Line to Bjorli station, which is a short walk from the village. Check www.entur.no for train and bus schedules and ticket booking.',
      },
      {
        q: 'What is there to do at Bjorli besides alpine skiing?',
        a: 'Cross-country trails (langrenn), ski touring, snowshoeing, sledding, family activities and great food and drink. In summer, Bjorli is a base for hiking, cycling and trips to Trollstigen, Åndalsnes and the Romsdalsfjord.',
      },
    ],
    relatedLinks: [
      { label: 'Bjorli Skisenter', href: '/en/bjorli-ski-resort', description: 'Lifts, slopes and live status from the resort.' },
      { label: 'Ski passes', href: '/en/ski-passes', description: 'Day passes, season passes and family deals.' },
      { label: 'Opening hours', href: '/en/opening-hours', description: 'Current and seasonal opening times.' },
      { label: 'Accommodation', href: '/en/accommodation', description: 'Cabins, apartments and hotels at Bjorli.' },
      { label: 'Weather & webcams', href: '/en/weather-and-webcams', description: 'Live cameras, weather and snow conditions.' },
      { label: 'Getting here', href: '/en/getting-here', description: 'By car, train and air to Bjorli.' },
    ],
    seoTitle: 'Ski Holiday in Norway | Discover Bjorli Skisenter',
    seoDescription:
      'Plan a ski holiday in Norway at Bjorli, a family-friendly mountain destination with alpine skiing, cross-country trails, reliable winter conditions, accommodation, webcams and easy access by road and train.',
    availableTranslations: ['en'],
    translatedBody: true,
    lastReviewedAt: '2026-05-25',
  },
};

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
    heroImage: { url: e.image ?? EVENT_IMAGES[i % EVENT_IMAGES.length], alt: e.imageAlt ?? e.title },
    category: e.category,
    season: 'all',
    publishedAt: e.date,
    updatedAt: e.date,
    startsAt: e.date,
    bookingUrl: e.ctaUrl,
    ctaLabel: e.ctaLabel,
    ctaHref: e.ctaUrl,
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
    heroImage: { url: WINTER_ACTIVITY_IMAGES[i % WINTER_ACTIVITY_IMAGES.length], alt: it.title },
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
    heroImage: { url: SUMMER_ACTIVITY_IMAGES[i % SUMMER_ACTIVITY_IMAGES.length], alt: it.title },
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
      { id: 'intro', type: 'intro', ...buildWinterIntro(language, d) },
      {
        id: 'planning',
        type: 'cardGrid',
        title: d.planning.title,
        subtitle: d.planning.subtitle,
        items: d.planning.items.map((it, i) => ({
          title: it.title,
          desc: it.desc,
          icon: ['mountain', 'ticket', 'clock', 'camera', 'map', 'home', 'activity', 'coffee'][i],
          href: ['/bjorli-skisenter', 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862', '/apningstider', '/livecams', '/loypekart', '/overnatting', '/skiutleie', '/mat-og-drikke'][i],
          external: i === 1,
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
      // Editorial role split (per spec):
      //   "Siste nytt fra Bjorli Skisenter" — official Skisenter
      //   updates (season opening, snow, lift pass, campaigns, slope &
      //   park, ski school, rental, operational + relevant company
      //   news). Sourced from the existing `news` collection.
      {
        id: 'news',
        type: 'news',
        eyebrow: d.news.eyebrow,
        title: SKISENTER_NEWS_TITLE[language] ?? SKISENTER_NEWS_TITLE.no,
        subtitle: d.news.subtitle,
        ctaLabel: d.news.cta,
        ctaHref: '/nyheter',
        items: news.map((n, i) => ({ ...n, date: d.news.items[i]?.date ?? '' })),
      },
      // "Hva skjer på Bjorli" — destination-wide events and local
      // happenings (concerts, festivals, food & drink, family,
      // guided trips, farms, cycling, hiking, partner activities).
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
        id: 'beyond',
        type: 'beyond',
        eyebrow: d.beyondAlpine.eyebrow,
        title: d.beyondAlpine.title,
        body: d.beyondAlpine.body,
        images: [
          { url: cabinEvening, alt: 'Hytte i vinterkveld på Bjorli' },
          { url: crossCountry, alt: 'Vinterlandskap rundt Bjorli' },
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
        id: 'faq',
        type: 'faq',
        eyebrow: d.faq.eyebrow,
        title: d.faq.title,
        items: d.faq.items,
      },
    ];

    // ─── SUMMER HOMEPAGE ─────────────────────────────────────────────
    // Section order follows the editorial spec for the summer page:
    //   1 Hero (rendered in Sommer.tsx)
    //   2 Intro value (Fjellro · Aktive dager · Basecamp)
    //   3 Main activities (hiking, biking, fishing, family, nature, day trips)
    //   4 Biking & pumptrack
    //   5 Hiking & nature
    //   6 Fishing & quiet outdoor days
    //   7 Family summer
    //   8 Basecamp for day trips
    //   9 Travel to Bjorli
    //  10 Accommodation
    //  11 Food & meeting places
    //  12 Final CTA (rendered in Sommer.tsx, no image needed)
    //
    // Copy stays in NO for the placeholder iteration — it will move to
    // WordPress + i18n dictionaries when the CMS lands.
    // ── Summer-safe image pool ───────────────────────────────────────
    // Each visual on /sommer must be DISTINCT. The hero (summerHero) is
    // reserved for the page hero and may NOT be reused in cards or
    // feature sections on the same page.
    const goldenTrainImg = images.tipTrain.src;     // Raumabanen river valley — regional travel
    const fishingLakeImg = images.fishingLake.src;  // Calm fjellvann — nature stand-in
    const riverFishImg   = images.riverFishing.src; // Fjellelv — river/water

    // Localized summer copy — every locale supplies its own strings so
    // non-NO routes never fall back to Norwegian.
    const s = SUMMER_HOMEPAGE_COPY[language] ?? SUMMER_HOMEPAGE_COPY.no;
    const activityCardMeta = [
      { href: '/fotturer',     image: { url: hikingImg } },
      { href: '/sykling',      image: { url: bikingImg } },
      { href: '/fiske',        image: { url: images.flyFishing.src } },
      { href: '/familie',      image: { url: familySummerImg } },
      { href: '/gardsbesok',   image: { url: farmVisitsImg } },
      { href: '/sagelva',      image: { url: images.sagelva.src } },
      { href: '/aktiviteter',  image: { url: images.summerAerialNature.src } },
      { href: '/reisen-hit',   image: { url: goldenTrainImg } },
      { href: '/sommer/klatring-og-buldring-romsdalen', image: { url: klatringHeroImg } },
    ];

    // Slim activities grid to 6 cards, dropping entries already covered
    // by the new "Velg din sommerdag" picker (Sykkel #1, Familie #3,
    // Klatring #8).
    const ACTIVITY_KEEP = [0, 2, 4, 5, 6, 7];

    // Picker — "Velg din sommerdag på Bjorli". Reuses imageCards renderer.
    // Images chosen to avoid duplicating any image used in the slimmed
    // activities grid above.
    const pickerCardMeta = [
      { href: '/familie',      image: { url: familySummerImg } },
      { href: '/sykling',      image: { url: bikingImg } },
      { href: '/fotturer',     image: { url: summerValleyImg } },
      { href: '/fiske',        image: { url: images.fishingLake.src } },
      { href: '/sommer/klatring-og-buldring-romsdalen', image: { url: klatringHeroImg } },
    ];

    const summerSections: any[] = [
      // 2 — Intro value
      {
        id: 'summerIntroValue',
        type: 'cardGrid' as const,
        eyebrow: s.intro.eyebrow,
        title: s.intro.title,
        subtitle: s.intro.subtitle,
        items: [
          { title: s.intro.items[0].title, desc: s.intro.items[0].desc, icon: 'treePine' },
          { title: s.intro.items[1].title, desc: s.intro.items[1].desc, icon: 'activity' },
          { title: s.intro.items[2].title, desc: s.intro.items[2].desc, icon: 'home' },
        ],
      },
      // 3 — "Velg din sommerdag på Bjorli" — visitor-path picker
      {
        id: 'summerDayPicker',
        type: 'imageCards' as const,
        eyebrow: s.picker.eyebrow,
        title: s.picker.title,
        cards: s.picker.cards.map((c, i) => ({
          title: c.title,
          desc: c.desc,
          image: { url: pickerCardMeta[i].image.url, alt: c.alt },
          href: pickerCardMeta[i].href,
          ctaLabel: s.picker.readMore,
        })),
      },
      // 4 — Main activities (image cards with short copy + "Les mer")
      {
        id: 'summerActivitiesGrid',
        type: 'imageCards' as const,
        eyebrow: s.activitiesGrid.eyebrow,
        title: s.activitiesGrid.title,
        cards: ACTIVITY_KEEP.map((i) => {
          const c = s.activitiesGrid.cards[i];
          return {
            title: c.title,
            desc: c.desc,
            image: { url: activityCardMeta[i].image.url, alt: c.alt },
            href: activityCardMeta[i].href,
            ctaLabel: s.activitiesGrid.readMore,
          };
        }),
      },
      // Destination-wide "Hva skjer på Bjorli".
      // Note: the Skisenter "news" section is intentionally NOT
      // rendered on /sommer — it stays on the winter homepage only.
      {
        id: 'events',
        type: 'events' as const,
        eyebrow: d.events.eyebrow,
        title: d.events.title,
        subtitle: d.events.subtitle,
        ctaLabel: d.events.cta,
        ctaHref: '/arrangementer',
        items: events.map((e, i) => ({ ...e, date: d.events.items[i]?.date ?? '' })),
      },
      // 6 — Fishing & quiet outdoor days
      // Card above uses flyFishingImg → use river-fishing photo here so
      // the two fishing visuals stay distinct on the same page.
      {
        id: 'summerFishing',
        type: 'feature' as const,
        eyebrow: s.fishing.eyebrow,
        title: s.fishing.title,
        body: s.fishing.body,
        image: { url: riverFishImg, alt: s.fishing.alt },
        imageSide: 'right' as const,
        ctas: [
          { label: s.fishing.cta, href: '/fiske', variant: 'primary' as const },
        ],
      },
      // 9 — Travel
      {
        id: 'gettingHere',
        type: 'gettingHere' as const,
        eyebrow: d.gettingHere.eyebrow,
        title: d.gettingHere.title,
        body: d.gettingHere.body,
        cities: d.gettingHere.cities,
        ctas: [
          { label: d.gettingHere.cta, href: '/reisen-hit', icon: 'car' },
          { label: 'Raumabanen', href: 'https://www.vy.no/', icon: 'train', external: true },
        ],
      },
      // 11 — Food & meeting places
      {
        id: 'foodDrinkSummer',
        type: 'feature' as const,
        eyebrow: s.foodDrink.eyebrow,
        title: s.foodDrink.title,
        body: s.foodDrink.body,
        // TODO(image): upload a true outdoor summer café/terrace photo.
        // Until then, use neutral restaurant interior instead of winter
        // terrace/ski-base imagery or unrelated water/family photos.
        image: { url: images.restaurantInterior.src, alt: s.foodDrink.alt },
        imageSide: 'right' as const,
        ctas: [
          { label: s.foodDrink.cta, href: '/mat-og-drikke', variant: 'primary' as const },
        ],
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

  /* ------------------------------------------------------------------ */
  /* SEO landing pages                                                  */
  /*                                                                    */
  /* Build 1 ships exactly ONE test entry: /en/ski-holiday-norway.      */
  /* Additional locales/slugs return null until WordPress is connected  */
  /* or new mock fallbacks are added.                                   */
  /* ------------------------------------------------------------------ */
  async getSeoLanding({ locale, slug }) {
    return SEO_LANDING_FIXTURES[`${locale}/${slug}`] ?? null;
  },
};
