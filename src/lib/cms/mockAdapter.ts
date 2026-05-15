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
import farmVisitsImg from '@/assets/farms/gardsbesok-lesja-kulturlandskap.avif';
import type { CmsImage } from './types';

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
//   0 Åpningshelg → concertImg (golden village)
//   1 Vinterferie → tipFamily (kid on the snow)
//   2 Påske       → crossCountry (sunny snow-covered mountains)
//   3 Sommer      → summerImg
const EVENT_IMAGES = [concertImg, tipFamily, crossCountry, summerImg];
// Split per season so summer activities never get assigned a winter photo.
const WINTER_ACTIVITY_IMAGES = [skiSchoolImg, crossCountry, cabinEvening, heroWinter];
const SUMMER_ACTIVITY_IMAGES = [hikingImg, bikingImg, familySummerImg, summerValleyImg];

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

    const summerSections: any[] = [
      // 2 — Intro value
      {
        id: 'summerIntroValue',
        type: 'cardGrid' as const,
        eyebrow: 'Sommer på Bjorli',
        title: 'Et rolig basecamp mellom fjell og fjord',
        subtitle: 'Bjorli ligger midt mellom fjordene, nasjonalparkene og noen av Norges mest kjente naturopplevelser — med god plass og rolig tempo.',
        items: [
          { title: 'Fjellro',      desc: 'God plass, ren luft og en roligere fjellopplevelse.',                       icon: 'treePine' },
          { title: 'Aktive dager', desc: 'Stier, sykkel, fiske, turer og familievennlige opplevelser.',                icon: 'activity' },
          { title: 'Basecamp',     desc: 'Bo på Bjorli og bruk dagene mellom fjell, daler og fjordlandskap.',          icon: 'home' },
        ],
      },
      // 3 — Main activities (image cards with short copy + "Les mer")
      {
        id: 'summerActivitiesGrid',
        type: 'imageCards' as const,
        eyebrow: 'Sommer på Bjorli',
        title: 'Dette kan du gjøre på Bjorli om sommeren',
        cards: [
          {
            title: 'Fotturer',
            desc: 'Korte rusleturer og lengre dagsturer i åpent høyfjell — rett utenfor døra.',
            image: { url: hikingImg, alt: 'Sommersti og utsikt over dalen — fottur i fjellet ved Bjorli' },
            href: '/fotturer',
            ctaLabel: 'Les mer',
          },
          {
            title: 'Sykkel og pumptrack',
            desc: 'Stier, grusveier og en pumptrack i sentrum — for nybegynnere og hele familien.',
            image: { url: bikingImg, alt: 'Sykling i fjellet ved Bjorli en sommerdag' },
            href: '/sykling',
            ctaLabel: 'Les mer',
          },
          {
            title: 'Fiske',
            desc: 'Fluefiske i Rauma, elvefiske og rolige dager ved fjellvannene rundt Bjorli.',
            // Use the fly-fishing photo here so it stays distinct from the
            // river-fishing photo used in the Fluefiske feature section
            // below (no image may appear twice on the same page).
            image: { url: images.flyFishing.src, alt: 'Fluefiske i en fjellelv nær Bjorli en stille sommerdag' },
            href: '/fiske',
            ctaLabel: 'Les mer',
          },
          {
            title: 'Familieaktiviteter',
            desc: 'Trygge, romslige opplevelser i lavt tempo — passer for både små og store.',
            image: { url: familySummerImg, alt: 'Familie møter dyr i grønt sommerlandskap ved Bjorli' },
            href: '/familie',
            ctaLabel: 'Les mer',
          },
          {
            title: 'Gardsbesøk',
            desc: 'Besøk lokale gårder i Lesja — gårdsliv, dyr, lokal mat og kulturlandskap nær Bjorli.',
            image: { url: farmVisitsImg, alt: 'Kulturlandskap i Lesja nær Bjorli' },
            href: '/gardsbesok',
            ctaLabel: 'Les mer',
          },
          {
            title: 'Natur og utsikt',
            desc: 'Åpne vidder, fjellplatåer og stille seterdaler i tre nasjonalparker like ved.',
            image: { url: summerValleyImg, alt: 'Grønn dal og fjell rundt Bjorli en sommerdag' },
            href: '/aktiviteter',
            ctaLabel: 'Les mer',
          },
          {
            title: 'Dagsturer fra Bjorli',
            desc: 'Romsdalen, Trollstigen, Geirangerområdet og Åndalsnes innen kort kjøretur eller togtur.',
            image: { url: goldenTrainImg, alt: 'Raumabanen langs elvedalen — regional dagstur fra Bjorli' },
            href: '/reisen-hit',
            ctaLabel: 'Les mer',
          },
        ],
      },
      // 4 — Biking, play & active family days
      // TODO(image): no second biking/family-active photo available;
      // bikingImg already used in the activity card above. Leaving image
      // empty per editorial rule (no winter / no repeats on same page).
      {
        id: 'summerBiking',
        type: 'feature' as const,
        eyebrow: 'Sykkel og familie',
        title: 'Sykkel, lek og aktive familiedager',
        body: 'Bjorli er et enkelt sted å være aktiv sammen som familie. Rolige stier, grusveier og en pumptrack i sentrum gir korte, oversiktlige dager på sykkel — fint for nybegynnere og barn som vil prøve seg. Pakk sykkelen, ta en runde på pumptracken og kombiner med en kort tur i fjellet eller en pause ved vannet.',
        image: undefined,
        imageSide: 'right' as const,
        ctas: [
          { label: 'Se sykkel og aktiviteter', href: '/sykling', variant: 'primary' as const },
        ],
      },
      // 5 — Hiking & nature
      // TODO(image): no dedicated hiker photo. Hero (summerHero) is the
      // closest match but reserved as page hero — no repeats on same page.
      {
        id: 'summerHiking',
        type: 'feature' as const,
        eyebrow: 'Fottur og natur',
        title: 'Turer rett fra fjellbygda',
        body: 'Bjorli ligger høyt og åpent, og du er raskt ute i fjellet uten lang innmarsj. Velg en kort rusletur ved sentrum, en familievennlig dagstur, eller gå lenger inn i Reinheimen og Romsdalsalpene. Et rolig utgangspunkt for sommerdager i norsk høyfjell.',
        image: undefined,
        imageSide: 'left' as const,
        subcards: [
          { title: 'Korte turer',         desc: 'Lette rusleturer fra sentrum og hyttene — fine for en pause eller en rolig kveldstur.' },
          { title: 'Familieturer',        desc: 'Oversiktlige stier og åpent terreng som passer for barn og bestemødre.' },
          { title: 'Lengre fjellturer',   desc: 'Dagsturer inn i Reinheimen, Dovrefjell og Romsdalsalpene for de som vil gå lenger.' },
          { title: 'Utsikt og natur',     desc: 'Åpne vidder, fjellplatåer og stille seterdaler — typisk norsk høyfjell.' },
        ],
        ctas: [
          { label: 'Se fotturer', href: '/fotturer', variant: 'primary' as const },
          { label: 'Snarturer i Rauma og Lesja', href: '/sommer/korte-turer', variant: 'secondary' as const },
        ],
      },
      // 6 — Fishing & quiet outdoor days
      // Card above uses flyFishingImg → use river-fishing photo here so
      // the two fishing visuals stay distinct on the same page.
      {
        id: 'summerFishing',
        type: 'feature' as const,
        eyebrow: 'Fiske og rolige dager',
        title: 'Fluefiske, elvefiske og fjellvann',
        body: 'Rauma, Lågen og fjellvannene rundt Bjorli gir gode forhold for fiske gjennom hele sommeren. Et rolig tempo, ren natur og lange lyse kvelder ved vannet.',
        image: { url: riverFishImg, alt: 'Fiske i en fjellelv nær Bjorli en stille sommerkveld' },
        imageSide: 'right' as const,
        ctas: [
          { label: 'Se fiskemuligheter', href: '/fiske', variant: 'primary' as const },
        ],
      },
      // 7 — Family summer
      // TODO(image): summerWaterImg already used in the family card.
      // No additional kid/outdoor-summer photo available — leave blank.
      {
        id: 'summerFamily',
        type: 'feature' as const,
        eyebrow: 'Familie',
        title: 'Enkel sommer med barn',
        body: 'Bjorli er en enkel plass å reise med barn. Korte avstander mellom hytte, sentrum og natur, åpent landskap rundt deg og lite kø — du slipper det tette by- og turistpresset, og får mer tid til å være ute sammen.',
        image: undefined,
        imageSide: 'left' as const,
        subcards: [
          { title: 'Korte turer',         desc: 'Lette stier rett fra hytta og sentrum — passer for små bein og barnevogn-tempo.' },
          { title: 'Sykkel og lek',       desc: 'Pumptrack, grusveier og åpne uteområder for sykling og fri lek.' },
          { title: 'Fiske',               desc: 'Rolige fjellvann og elvepartier der barna kan prøve seg på fiske.' },
          { title: 'Uteområder',          desc: 'Plener, badeplasser og samlingspunkter der dagene faller naturlig på plass.' },
          { title: 'Rolige dager',        desc: 'God plass og lite folk — en ferie uten tett by- eller turistpress.' },
        ],
        ctas: [
          { label: 'Se familieaktiviteter', href: '/familie', variant: 'primary' as const },
        ],
      },
      // 8 — Basecamp for day trips
      // TODO(image): page hero (summerHero) is the only wide green
      // landscape; reserved for hero. goldenTrainImg already used in
      // the Dagsturer card. Leave blank rather than repeat.
      {
        id: 'summerBasecamp',
        type: 'feature' as const,
        eyebrow: 'Basecamp mellom fjell og fjord',
        title: 'Bo på Bjorli. Opplev mer av regionen.',
        body: 'Bjorli er en rolig fjellbase med god plass — bo høyt og åpent, og bruk dagene på turer ut i daler, fjell og fjordlandskap. Reinheimen, Tafjordfjella, Dovrefjell og Romsdalen ligger rundt deg, og Romsdalsalpene, Raumabanen, Trollstigen-området, Geiranger-området og Åndalsnes er innen rekkevidde for dagsturer.',
        image: undefined,
        imageSide: 'right' as const,
        subcards: [
          { title: 'Daler og fjellvann',  desc: 'Lesjaskogsvannet, Aursjøen og Dalsida — rolige landskap rett ved Bjorli.' },
          { title: 'Nasjonalparker',      desc: 'Reinheimen, Tafjordfjella og Dovrefjell ligger rundt destinasjonen.' },
          { title: 'Romsdalen og Raumabanen', desc: 'Dramatiske fjell og togtur ned mot Åndalsnes — innen rekkevidde for dagsturer.' },
          { title: 'Fjord og kyst',       desc: 'Trollstigen- og Geiranger-området innen rekkevidde for dagsturer mot fjordene.' },
        ],
        ctas: [
          { label: 'Se reise og dagsturer', href: '/reisen-hit', variant: 'primary' as const },
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
      // 10 — Accommodation
      // TODO(image): no green-season cabin/exterior photo. Snowy
      // Vetlegrenda (winter) is forbidden on summer pages and the only
      // wide summer landscape is the hero. Leaving blank.
      {
        id: 'accommodationSummer',
        type: 'feature' as const,
        eyebrow: d.accommodation.eyebrow,
        title: d.accommodation.title,
        body: d.accommodation.body,
        image: undefined,
        imageSide: 'left' as const,
        ctas: [
          { label: d.accommodation.cta, href: '/overnatting', variant: 'primary' as const },
        ],
      },
      // 11 — Food & meeting places
      {
        id: 'foodDrinkSummer',
        type: 'feature' as const,
        eyebrow: 'Mat og møteplasser',
        title: 'Steder å pause i sommerlandskapet',
        body: 'Servering og rolige møteplasser i sentrum og rundt Bjorli — perfekt for en pause mellom turene eller en lang sommerkveld etter en dag ute.',
        // TODO(image): upload a true outdoor summer café/terrace photo.
        // Until then, use neutral restaurant interior instead of winter
        // terrace/ski-base imagery or unrelated water/family photos.
        image: { url: images.restaurantInterior.src, alt: 'Interiør med bord og lykter — servering og møteplass på Bjorli' },
        imageSide: 'right' as const,
        ctas: [
          { label: 'Se mat og drikke', href: '/mat-og-drikke', variant: 'primary' as const },
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
};
