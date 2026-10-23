import { TIP_ARTICLES_NO } from './tipArticles';
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
import { SKI_HOLIDAY_LOCALES, SKI_HOLIDAY_PAGES } from '@/lib/seo/skiHolidayNorwaySeo';
import type { Dictionary } from '@/i18n/locales/types';
import { slugify } from '@/lib/slug';
import { loadSupabase } from '@/integrations/supabase/lazy';
import { compareArchivedEvents, isEventArchived } from '@/lib/events/archive';
import { SUMMER_HOMEPAGE_COPY } from './summerHomepageCopy';
import { getHomepageData } from './homepageData';
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
  en: 'Latest from Bjorli Ski Resort',
  de: 'Aktuelles aus dem Bjorli Skisenter',
  nl: 'Laatste nieuws van Bjorli Skisenter',
  da: 'Sidste nyt fra Bjorli Skisenter',
  sv: 'Senaste nytt från Bjorli Skisenter',
};

/**
 * Editorial winter intro copy. Uses the shared homepage data module so
 * the prerender script and the React runtime read the same source.
 */
function buildWinterIntro(lang: Language, _d: Dictionary) {
  const base = getHomepageData(lang).intro;
  return {
    eyebrow: base.eyebrow ?? 'Destination Bjorli',
    statement: base.statement ?? '',
    supportingText: base.supportingText ?? '',
    proofPoints: base.proofPoints ? [...base.proofPoints] : [],
    title: base.title,
    body: base.body,
  };
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

/**
 * Current timestamp — OPERATIONAL data only (live alerts, runtime filtering).
 * Never use it for editorial publishedAt/updatedAt: static content would then
 * look freshly published on every build. Static editorial entries omit those
 * fields until real CMS dates exist.
 */
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
    title: 'Ski holiday in Norway',
    intro:
      'A mountain village at the head of Romsdalen, with slopes, cross-country ski trails and cabins. A ski holiday in Norway that’s easy to plan with children.',
    heroImage: img('heroGroupWide', 'A group of skiers stopping to take in the mountain view in Bjorli'),
    pageSummary:
      'Bjorli is a mountain village in Lesja, between Dombås and Åndalsnes on the E136, where Gudbrandsdalen meets Romsdalen. In winter you’ll find alpine and cross-country skiing and slopes for beginners. You can get here by car, by train on the Rauma Line, or by flying into Ålesund, Molde or Oslo.',
    pageSummaryFacts: [
      { label: 'Region', value: 'Lesja, Innlandet, Norway (at the head of Romsdalen)' },
      { label: 'Main access airports', value: 'Ålesund, Molde and Oslo' },
      { label: 'Train', value: 'Rauma Line via Dombås' },
      { label: 'Best for', value: 'Family ski holidays, beginners, cross-country skiing' },
    ],
    bodySections: [
      {
        id: 'why-bjorli',
        type: 'rich_text',
        heading: 'Why choose Bjorli for a ski holiday in Norway',
        body:
          'Bjorli sits where Gudbrandsdalen meets Romsdalen, on the E136 road and the Rauma Line railway between Dombås and Åndalsnes. It’s a small mountain village rather than a big resort town. Romsdalen, Trollveggen, Åndalsnes and Dovrefjell are all within reach for a day out.',
        image: img('eventEaster', 'Skiers and a snowboarder by the Nordløypa sign above Bjorli'),
      },
      {
        id: 'ski-center',
        type: 'rich_text',
        heading: 'Bjorli Ski Resort',
        body:
          'Bjorli Ski Resort is the village’s ski area, with lifts and slopes for different levels. Lift and piste status, snow depth and temperature are updated through the season, so you can check conditions before you head up.',
        image: img('kidsView', 'Two children on skis with the mountains behind them in Bjorli'),
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
          'Beginner slopes, a ski school and ski hire make Bjorli straightforward with children, so you don’t need to bring all your own kit. Children aged 0 to 6 ski for free and don’t need their own Keycard (lift pass).',
        image: img('skiSchool', 'Children at ski school on the beginner slope in Bjorli'),
      },
      {
        id: 'travel',
        type: 'rich_text',
        heading: 'Getting here from the UK',
        body:
          'From the UK, fly to Ålesund Airport (Vigra), Molde or Oslo. From Ålesund Airport it’s around 2½ hours to Bjorli by car (about 170 km). Allow extra time for collecting a hire car and for winter roads. From Oslo it’s around 5 hours by car: the E6 north to Dombås, then the E136 west. By train, take the Dovre Line to Dombås and change to the Rauma Line for Bjorli station. Flight routes change by season, so check current schedules before you book. For train and bus times, see www.entur.no.',
      },
      {
        id: 'beyond-alpine',
        type: 'rich_text',
        heading: 'More than alpine skiing',
        body:
          'Bjorli is also a cross-country skiing destination, with groomed trails (langrennsløyper in Norwegian) linking the village with the surrounding fells. You can try ski touring and snowshoeing too, and in summer the same mountains are used for hiking and cycling.',
        image: img('news', 'Skiers and snowboarders taking a break in the sun above Bjorli'),
      },
    ],
    faq: [
      {
        q: 'Where is Bjorli located in Norway?',
        a: 'Bjorli is a mountain village in Lesja, Innlandet county, between Dombås and Åndalsnes on the E136 road and the Rauma Line railway. It sits at the head of Romsdalen, in the mountains between eastern Norway and the west coast.',
      },
      {
        q: 'When is the ski season in Bjorli?',
        a: 'Season dates vary from year to year. Check the opening hours page and the live lift and snow status before you travel.',
      },
      {
        q: 'Is Bjorli good for a family ski holiday?',
        a: 'Yes. Bjorli has beginner slopes, a ski school and ski hire, and you can stay in cabins, apartments or a hotel. Children aged 0 to 6 ski for free and don’t need their own Keycard (lift pass).',
      },
      {
        q: 'How do I get to Bjorli from the UK?',
        a: 'Fly to Ålesund Airport (Vigra), Molde or Oslo, then continue by hire car or train. Ålesund Airport is around 2½ hours from Bjorli by car. Flight routes from the UK change by season, so check current schedules before you book.',
      },
      {
        q: 'How do you get to Bjorli from Oslo?',
        a: 'By car, take the E6 north to Dombås and then the E136 west. It’s around 5 hours from Oslo, depending on your route and the conditions. By train, take the Dovre Line to Dombås and change to the Rauma Line for Bjorli station. Check www.entur.no for train and bus times and tickets.',
      },
      {
        q: 'What is there to do in Bjorli besides alpine skiing?',
        a: 'Cross-country skiing on groomed trails, ski touring and snowshoeing. In summer, Bjorli is a base for hiking, cycling and trips to Åndalsnes and Romsdalen.',
      },
    ],
    relatedLinks: [
      { label: 'Bjorli Ski Resort', href: '/en/bjorli-ski-resort', description: 'Lifts, slopes and the latest status from the ski resort.' },
      { label: 'Ski passes', href: '/en/ski-passes', description: 'Day passes and season passes.' },
      { label: 'Opening times', href: '/en/opening-hours', description: 'Current and seasonal opening times.' },
      { label: 'Accommodation', href: '/en/accommodation', description: 'Cabins, apartments and hotels in Bjorli.' },
      { label: 'Weather & webcams', href: '/en/weather-and-webcams', description: 'Live cameras, weather and snow conditions.' },
      { label: 'Getting here', href: '/en/getting-here', description: 'By car, train and air to Bjorli.' },
    ],
    // Single source of truth — src/lib/seo/skiHolidayNorwaySeo.ts
    seoTitle: SKI_HOLIDAY_PAGES.en.title,
    seoDescription: SKI_HOLIDAY_PAGES.en.description,
    availableTranslations: [...SKI_HOLIDAY_LOCALES],
    translatedBody: true,
    lastReviewedAt: '2026-10-15',
  },

  /* DE/SV/DA/NL: translated from the EN entry above — same facts, same
     photos, no market-specific claims added (see CLAUDE.md fact rule). */

  'de/skiurlaub-norwegen': {
    id: 'seo-landing-de-skiurlaub-norwegen',
    locale: 'de',
    slug: SKI_HOLIDAY_PAGES.de.slug,
    title: 'Skiurlaub in Norwegen',
    intro:
      'Ein Bergdorf am oberen Ende des Romsdals mit Pisten, Langlaufloipen und Hütten – ein Skiurlaub in Norwegen, der sich mit Kindern leicht planen lässt.',
    heroImage: img('heroGroupWide', 'Eine Gruppe Skifahrer genießt die Bergaussicht in Bjorli'),
    pageSummary:
      'Bjorli ist ein Bergdorf in Lesja, zwischen Dombås und Åndalsnes an der E136, dort wo das Gudbrandsdal auf das Romsdal trifft. Im Winter gibt es Alpinski, Langlauf und Pisten für Anfänger. Anreisen können Sie mit dem Auto, mit dem Zug auf der Rauma-Bahn oder per Flug nach Ålesund, Molde oder Oslo.',
    pageSummaryFacts: [
      { label: 'Region', value: 'Lesja, Innlandet, Norwegen (am oberen Ende des Romsdals)' },
      { label: 'Flughäfen', value: 'Ålesund, Molde und Oslo' },
      { label: 'Zug', value: 'Rauma-Bahn über Dombås' },
      { label: 'Ideal für', value: 'Familien-Skiurlaub, Anfänger, Langlauf' },
    ],
    bodySections: [
      {
        id: 'why-bjorli',
        type: 'rich_text',
        heading: 'Warum Bjorli für einen Skiurlaub in Norwegen',
        body:
          'Bjorli liegt dort, wo das Gudbrandsdal auf das Romsdal trifft – an der E136 und an der Rauma-Bahn zwischen Dombås und Åndalsnes. Es ist ein kleines Bergdorf und kein großer Skiort. Das Romsdal, die Trollwand (Trollveggen), Åndalsnes und das Dovrefjell erreichen Sie gut bei einem Tagesausflug.',
        image: img('eventEaster', 'Skifahrer und ein Snowboarder am Nordløypa-Schild oberhalb von Bjorli'),
      },
      {
        id: 'ski-center',
        type: 'rich_text',
        heading: 'Bjorli Skisenter',
        body:
          'Bjorli Skisenter ist das Skigebiet vor Ort, mit Liften und Pisten für verschiedene Könnerstufen. Lift- und Pistenstatus, Schneehöhe und Temperatur werden während der Saison live aktualisiert – so können Sie die Bedingungen prüfen, bevor Sie losfahren.',
        image: img('kidsView', 'Zwei Kinder auf Skiern vor der Bergkulisse in Bjorli'),
      },
      {
        id: 'cta-ski-resort',
        type: 'cta_block',
        label: 'Zum Skigebiet',
        href: '/de/bjorli-skigebiet',
        variant: 'primary',
      },
      {
        id: 'family',
        type: 'rich_text',
        heading: 'Skifahren mit Kindern',
        body:
          'Anfängerpisten, eine Skischule und ein Skiverleih machen Bjorli mit Kindern unkompliziert – Sie müssen nicht die ganze Ausrüstung selbst mitbringen. Kinder von 0 bis einschließlich 6 Jahren fahren kostenlos und brauchen keine eigene Keycard (Liftkarte).',
        image: img('skiSchool', 'Kinder in der Skischule am Anfängerhang in Bjorli'),
      },
      {
        id: 'travel',
        type: 'rich_text',
        heading: 'Anreise aus dem Ausland',
        body:
          'Fliegen Sie nach Ålesund (Flughafen Vigra), Molde oder Oslo. Vom Flughafen Ålesund sind es rund 2½ Stunden mit dem Auto nach Bjorli (etwa 170 km) – planen Sie zusätzlich Zeit für die Mietwagenübernahme und für winterliche Straßen ein. Von Oslo sind es rund 5 Stunden mit dem Auto: auf der E6 nach Norden bis Dombås, dann auf der E136 nach Westen. Mit dem Zug fahren Sie auf der Dovrebahn bis Dombås und steigen dort in die Rauma-Bahn zum Bahnhof Bjorli um. Flugverbindungen ändern sich je nach Saison – prüfen Sie vor der Buchung die aktuellen Flugpläne. Zug- und Busverbindungen finden Sie auf www.entur.no.',
      },
      {
        id: 'beyond-alpine',
        type: 'rich_text',
        heading: 'Mehr als Alpinski',
        body:
          'Bjorli ist auch ein Langlaufziel: Gespurte Loipen (auf Norwegisch langrennsløyper) verbinden das Dorf mit dem umliegenden Fjell. Skitouren und Schneeschuhwandern sind ebenfalls möglich, und im Sommer werden dieselben Berge zum Wandern und Radfahren genutzt.',
        image: img('news', 'Skifahrer und Snowboarder machen Pause in der Sonne oberhalb von Bjorli'),
      },
    ],
    faq: [
      {
        q: 'Wo liegt Bjorli in Norwegen?',
        a: 'Bjorli ist ein Bergdorf in Lesja in der Provinz Innlandet, zwischen Dombås und Åndalsnes an der E136 und an der Rauma-Bahn. Es liegt am oberen Ende des Romsdals, im Gebirge zwischen Ostnorwegen und der Westküste.',
      },
      {
        q: 'Wann ist in Bjorli Skisaison?',
        a: 'Die Saisondaten ändern sich von Jahr zu Jahr. Prüfen Sie vor der Reise die Öffnungszeiten und den Live-Status von Liften und Schnee.',
      },
      {
        q: 'Eignet sich Bjorli für einen Skiurlaub mit der Familie?',
        a: 'Ja. Bjorli hat Anfängerpisten, eine Skischule und einen Skiverleih, und Sie können in Hütten, Ferienwohnungen oder einem Hotel übernachten. Kinder von 0 bis einschließlich 6 Jahren fahren kostenlos und brauchen keine eigene Keycard (Liftkarte).',
      },
      {
        q: 'Wie komme ich aus dem Ausland nach Bjorli?',
        a: 'Fliegen Sie nach Ålesund (Flughafen Vigra), Molde oder Oslo und fahren Sie dann mit dem Mietwagen oder dem Zug weiter. Vom Flughafen Ålesund sind es rund 2½ Stunden mit dem Auto nach Bjorli. Flugverbindungen ändern sich je nach Saison – prüfen Sie vor der Buchung die aktuellen Flugpläne.',
      },
      {
        q: 'Wie komme ich von Oslo nach Bjorli?',
        a: 'Mit dem Auto auf der E6 nach Norden bis Dombås und dann auf der E136 nach Westen – je nach Strecke und Bedingungen rund 5 Stunden ab Oslo. Mit dem Zug auf der Dovrebahn bis Dombås und dort in die Rauma-Bahn zum Bahnhof Bjorli umsteigen. Zug- und Busverbindungen sowie Tickets finden Sie auf www.entur.no.',
      },
      {
        q: 'Was kann man in Bjorli außer Alpinski machen?',
        a: 'Langlauf auf gespurten Loipen, Skitouren und Schneeschuhwandern. Im Sommer ist Bjorli ein Ausgangspunkt zum Wandern, Radfahren und für Ausflüge nach Åndalsnes und ins Romsdal.',
      },
    ],
    relatedLinks: [
      { label: 'Bjorli Skisenter', href: '/de/bjorli-skigebiet', description: 'Lifte, Pisten und Live-Status aus dem Skigebiet.' },
      { label: 'Skipass', href: '/de/skipass', description: 'Tageskarten und Saisonkarten.' },
      { label: 'Öffnungszeiten', href: '/de/oeffnungszeiten', description: 'Aktuelle und saisonale Öffnungszeiten.' },
      { label: 'Unterkunft', href: '/de/unterkunft', description: 'Hütten, Ferienwohnungen und Hotels in Bjorli.' },
      { label: 'Wetter & Webcams', href: '/de/wetter-und-webcams', description: 'Live-Kameras, Wetter und Schneebedingungen.' },
      { label: 'Anreise', href: '/de/anreise', description: 'Mit Auto, Zug und Flugzeug nach Bjorli.' },
    ],
    seoTitle: SKI_HOLIDAY_PAGES.de.title,
    seoDescription: SKI_HOLIDAY_PAGES.de.description,
    availableTranslations: [...SKI_HOLIDAY_LOCALES],
    translatedBody: true,
    lastReviewedAt: '2026-10-15',
  },

  'sv/skidsemester-norge': {
    id: 'seo-landing-sv-skidsemester-norge',
    locale: 'sv',
    slug: SKI_HOLIDAY_PAGES.sv.slug,
    title: 'Skidsemester i Norge',
    intro:
      'En fjällby längst upp i Romsdalen med nedfarter, längdspår och stugor – en skidsemester i Norge som är lätt att planera med barn.',
    heroImage: img('heroGroupWide', 'En grupp skidåkare stannar och njuter av fjällutsikten i Bjorli'),
    pageSummary:
      'Bjorli är en fjällby i Lesja, mellan Dombås och Åndalsnes längs E136, där Gudbrandsdalen möter Romsdalen. På vintern finns utförsåkning, längdåkning och backar för nybörjare. Du tar dig hit med bil, med tåg på Raumabanan eller med flyg till Ålesund, Molde eller Oslo.',
    pageSummaryFacts: [
      { label: 'Region', value: 'Lesja, Innlandet, Norge (längst upp i Romsdalen)' },
      { label: 'Flygplatser', value: 'Ålesund, Molde och Oslo' },
      { label: 'Tåg', value: 'Raumabanan via Dombås' },
      { label: 'Passar för', value: 'Familjeskidåkning, nybörjare, längdåkning' },
    ],
    bodySections: [
      {
        id: 'why-bjorli',
        type: 'rich_text',
        heading: 'Varför välja Bjorli för en skidsemester i Norge',
        body:
          'Bjorli ligger där Gudbrandsdalen möter Romsdalen, längs väg E136 och Raumabanan mellan Dombås och Åndalsnes. Det är en liten fjällby snarare än en stor skidort. Romsdalen, Trollveggen, Åndalsnes och Dovrefjell ligger inom räckhåll för en dagsutflykt.',
        image: img('eventEaster', 'Skidåkare och en snowboardåkare vid Nordløypa-skylten ovanför Bjorli'),
      },
      {
        id: 'ski-center',
        type: 'rich_text',
        heading: 'Bjorli Skisenter',
        body:
          'Bjorli Skisenter är den lokala skidanläggningen, med liftar och backar för olika nivåer. Status för liftar och backar, snödjup och temperatur uppdateras live under säsongen, så att du kan kolla förhållandena innan du åker upp.',
        image: img('kidsView', 'Två barn på skidor med fjällen bakom sig i Bjorli'),
      },
      {
        id: 'cta-ski-resort',
        type: 'cta_block',
        label: 'Till skidanläggningen',
        href: '/sv/bjorli-skidcenter',
        variant: 'primary',
      },
      {
        id: 'family',
        type: 'rich_text',
        heading: 'Skidåkning för hela familjen',
        body:
          'Nybörjarbackar, skidskola och skiduthyrning gör Bjorli enkelt med barn – du behöver inte ta med all utrustning själv. Barn från 0 till och med 6 år åker gratis och behöver inget eget Keycard (liftkort).',
        image: img('skiSchool', 'Barn i skidskolan i nybörjarbacken i Bjorli'),
      },
      {
        id: 'travel',
        type: 'rich_text',
        heading: 'Resa hit från utlandet',
        body:
          'Flyg till Ålesund (Vigra flygplats), Molde eller Oslo. Från Ålesunds flygplats tar det cirka 2,5 timmar med bil till Bjorli (ungefär 170 km) – räkna med extra tid för att hämta hyrbil och för vinterväglag. Från Oslo tar det cirka 5 timmar med bil: E6 norrut till Dombås och sedan E136 västerut. Med tåg tar du Dovrebanan till Dombås och byter till Raumabanan till Bjorli station. Flyglinjerna varierar med säsongen, så kolla aktuella tidtabeller innan du bokar. Tåg- och busstider hittar du på www.entur.no.',
      },
      {
        id: 'beyond-alpine',
        type: 'rich_text',
        heading: 'Mer än utförsåkning',
        body:
          'Bjorli är också ett resmål för längdåkning, med preparerade spår (langrennsløyper på norska) som förbinder byn med fjällen runt omkring. Du kan även prova turskidåkning och snöskovandring, och på sommaren används samma fjäll för vandring och cykling.',
        image: img('news', 'Skidåkare och snowboardåkare tar en paus i solen ovanför Bjorli'),
      },
    ],
    faq: [
      {
        q: 'Var ligger Bjorli i Norge?',
        a: 'Bjorli är en fjällby i Lesja i Innlandet fylke, mellan Dombås och Åndalsnes längs väg E136 och Raumabanan. Byn ligger längst upp i Romsdalen, i fjällen mellan Östnorge och västkusten.',
      },
      {
        q: 'När är skidsäsongen i Bjorli?',
        a: 'Säsongens datum varierar från år till år. Kolla öppettiderna och liftarnas och snöns livestatus innan du reser.',
      },
      {
        q: 'Passar Bjorli för en skidsemester med familjen?',
        a: 'Ja. Bjorli har nybörjarbackar, skidskola och skiduthyrning, och du kan bo i stuga, lägenhet eller på hotell. Barn från 0 till och med 6 år åker gratis och behöver inget eget Keycard (liftkort).',
      },
      {
        q: 'Hur tar jag mig till Bjorli från utlandet?',
        a: 'Flyg till Ålesund (Vigra flygplats), Molde eller Oslo och fortsätt sedan med hyrbil eller tåg. Från Ålesunds flygplats tar det cirka 2,5 timmar med bil till Bjorli. Flyglinjerna varierar med säsongen, så kolla aktuella tidtabeller innan du bokar.',
      },
      {
        q: 'Hur tar jag mig till Bjorli från Oslo?',
        a: 'Med bil tar du E6 norrut till Dombås och sedan E136 västerut – cirka 5 timmar från Oslo, beroende på väg och väglag. Med tåg tar du Dovrebanan till Dombås och byter till Raumabanan till Bjorli station. Tåg- och busstider och biljetter hittar du på www.entur.no.',
      },
      {
        q: 'Vad finns det att göra i Bjorli förutom utförsåkning?',
        a: 'Längdåkning i preparerade spår, turskidåkning och snöskovandring. På sommaren är Bjorli en bas för vandring, cykling och utflykter till Åndalsnes och Romsdalen.',
      },
    ],
    relatedLinks: [
      { label: 'Bjorli Skisenter', href: '/sv/bjorli-skidcenter', description: 'Liftar, backar och livestatus från skidanläggningen.' },
      { label: 'Liftkort', href: '/sv/liftkort', description: 'Dagkort och säsongskort.' },
      { label: 'Öppettider', href: '/sv/oppettider', description: 'Aktuella och säsongsbundna öppettider.' },
      { label: 'Boende', href: '/sv/boende', description: 'Stugor, lägenheter och hotell i Bjorli.' },
      { label: 'Väder & webbkameror', href: '/sv/vader-och-webbkameror', description: 'Livekameror, väder och snöförhållanden.' },
      { label: 'Resa hit', href: '/sv/resa-hit', description: 'Med bil, tåg och flyg till Bjorli.' },
    ],
    seoTitle: SKI_HOLIDAY_PAGES.sv.title,
    seoDescription: SKI_HOLIDAY_PAGES.sv.description,
    availableTranslations: [...SKI_HOLIDAY_LOCALES],
    translatedBody: true,
    lastReviewedAt: '2026-10-15',
  },

  'da/skiferie-norge': {
    id: 'seo-landing-da-skiferie-norge',
    locale: 'da',
    slug: SKI_HOLIDAY_PAGES.da.slug,
    title: 'Skiferie i Norge',
    intro:
      'En fjeldby øverst i Romsdalen med pister, langrendsspor og hytter – en skiferie i Norge, der er nem at planlægge med børn.',
    heroImage: img('heroGroupWide', 'En gruppe skiløbere nyder udsigten over fjeldene i Bjorli'),
    pageSummary:
      'Bjorli er en fjeldby i Lesja, mellem Dombås og Åndalsnes ved E136, hvor Gudbrandsdalen møder Romsdalen. Om vinteren er der alpint, langrend og pister for begyndere. Du kommer hertil i bil, med tog på Raumabanen eller ved at flyve til Ålesund, Molde eller Oslo.',
    pageSummaryFacts: [
      { label: 'Region', value: 'Lesja, Innlandet, Norge (øverst i Romsdalen)' },
      { label: 'Lufthavne', value: 'Ålesund, Molde og Oslo' },
      { label: 'Tog', value: 'Raumabanen via Dombås' },
      { label: 'Bedst til', value: 'Familieskiferie, begyndere, langrend' },
    ],
    bodySections: [
      {
        id: 'why-bjorli',
        type: 'rich_text',
        heading: 'Hvorfor vælge Bjorli til en skiferie i Norge',
        body:
          'Bjorli ligger, hvor Gudbrandsdalen møder Romsdalen, ved vej E136 og Raumabanen mellem Dombås og Åndalsnes. Det er en lille fjeldby og ikke en stor skiby. Romsdalen, Trollveggen, Åndalsnes og Dovrefjell ligger inden for rækkevidde til en dagstur.',
        image: img('eventEaster', 'Skiløbere og en snowboarder ved Nordløypa-skiltet over Bjorli'),
      },
      {
        id: 'ski-center',
        type: 'rich_text',
        heading: 'Bjorli Skisenter',
        body:
          'Bjorli Skisenter er det lokale skisportssted med lifte og pister til forskellige niveauer. Status for lifte og pister, snedybde og temperatur opdateres live gennem sæsonen, så du kan tjekke forholdene, før du tager op.',
        image: img('kidsView', 'To børn på ski med fjeldene i baggrunden i Bjorli'),
      },
      {
        id: 'cta-ski-resort',
        type: 'cta_block',
        label: 'Se skisportsstedet',
        href: '/da/bjorli-skisenter',
        variant: 'primary',
      },
      {
        id: 'family',
        type: 'rich_text',
        heading: 'Skiløb for hele familien',
        body:
          'Begynderpister, skiskole og skiudlejning gør Bjorli nemt med børn – du behøver ikke at tage alt udstyret med selv. Børn fra 0 til og med 6 år står gratis på ski og behøver ikke deres eget Keycard (liftkort).',
        image: img('skiSchool', 'Børn på skiskole i begynderbakken i Bjorli'),
      },
      {
        id: 'travel',
        type: 'rich_text',
        heading: 'Rejsen hertil fra udlandet',
        body:
          'Flyv til Ålesund (Vigra lufthavn), Molde eller Oslo. Fra Ålesund Lufthavn tager det omkring 2½ time i bil til Bjorli (ca. 170 km) – beregn ekstra tid til at hente lejebil og til vinterveje. Fra Oslo tager det omkring 5 timer i bil: E6 mod nord til Dombås og derefter E136 mod vest. Med tog tager du Dovrebanen til Dombås og skifter til Raumabanen til Bjorli station. Flyruterne skifter med sæsonen, så tjek de aktuelle køreplaner, før du bestiller. Tog- og bustider finder du på www.entur.no.',
      },
      {
        id: 'beyond-alpine',
        type: 'rich_text',
        heading: 'Mere end alpint',
        body:
          'Bjorli er også et sted for langrend med præparerede spor (langrennsløyper på norsk), der forbinder byen med fjeldet omkring. Du kan også prøve topture på ski og vandring på snesko, og om sommeren bruges de samme fjelde til vandring og cykling.',
        image: img('news', 'Skiløbere og snowboardere holder pause i solen over Bjorli'),
      },
    ],
    faq: [
      {
        q: 'Hvor ligger Bjorli i Norge?',
        a: 'Bjorli er en fjeldby i Lesja i Innlandet fylke, mellem Dombås og Åndalsnes ved vej E136 og Raumabanen. Byen ligger øverst i Romsdalen, i fjeldene mellem Østnorge og vestkysten.',
      },
      {
        q: 'Hvornår er der skisæson i Bjorli?',
        a: 'Sæsonens datoer varierer fra år til år. Tjek åbningstiderne og live-status for lifte og sne, før du rejser.',
      },
      {
        q: 'Er Bjorli godt til en skiferie med familien?',
        a: 'Ja. Bjorli har begynderpister, skiskole og skiudlejning, og du kan bo i hytte, lejlighed eller på hotel. Børn fra 0 til og med 6 år står gratis på ski og behøver ikke deres eget Keycard (liftkort).',
      },
      {
        q: 'Hvordan kommer jeg til Bjorli fra udlandet?',
        a: 'Flyv til Ålesund (Vigra lufthavn), Molde eller Oslo, og fortsæt derefter i lejebil eller med tog. Fra Ålesund Lufthavn tager det omkring 2½ time i bil til Bjorli. Flyruterne skifter med sæsonen, så tjek de aktuelle køreplaner, før du bestiller.',
      },
      {
        q: 'Hvordan kommer jeg til Bjorli fra Oslo?',
        a: 'I bil tager du E6 mod nord til Dombås og E136 mod vest – omkring 5 timer fra Oslo afhængigt af rute og føre. Med tog tager du Dovrebanen til Dombås og skifter til Raumabanen til Bjorli station. Tog- og bustider og billetter finder du på www.entur.no.',
      },
      {
        q: 'Hvad kan man lave i Bjorli ud over alpint?',
        a: 'Langrend i præparerede spor, topture på ski og vandring på snesko. Om sommeren er Bjorli et udgangspunkt for vandring, cykling og ture til Åndalsnes og Romsdalen.',
      },
    ],
    relatedLinks: [
      { label: 'Bjorli Skisenter', href: '/da/bjorli-skisenter', description: 'Lifte, pister og live-status fra skisportsstedet.' },
      { label: 'Liftkort', href: '/da/liftkort', description: 'Dagskort og sæsonkort.' },
      { label: 'Åbningstider', href: '/da/aabningstider', description: 'Aktuelle åbningstider og sæsonens åbningstider.' },
      { label: 'Overnatning', href: '/da/overnatning', description: 'Hytter, lejligheder og hoteller i Bjorli.' },
      { label: 'Vejr & webcams', href: '/da/vejr-og-webcams', description: 'Livekameraer, vejr og sneforhold.' },
      { label: 'Rejsen hertil', href: '/da/rejsen-hertil', description: 'I bil, med tog og fly til Bjorli.' },
    ],
    seoTitle: SKI_HOLIDAY_PAGES.da.title,
    seoDescription: SKI_HOLIDAY_PAGES.da.description,
    availableTranslations: [...SKI_HOLIDAY_LOCALES],
    translatedBody: true,
    lastReviewedAt: '2026-10-15',
  },

  'nl/wintersport-noorwegen': {
    id: 'seo-landing-nl-wintersport-noorwegen',
    locale: 'nl',
    slug: SKI_HOLIDAY_PAGES.nl.slug,
    title: 'Wintersport in Noorwegen',
    intro:
      'Een bergdorp bovenaan Romsdalen met pistes, langlaufloipes en vakantiehuisjes – wintersport in Noorwegen die je makkelijk plant met kinderen.',
    heroImage: img('heroGroupWide', 'Een groep skiërs geniet van het uitzicht over de bergen in Bjorli'),
    pageSummary:
      'Bjorli is een bergdorp in Lesja, tussen Dombås en Åndalsnes aan de E136, waar Gudbrandsdalen overgaat in Romsdalen. In de winter kun je hier alpineskiën en langlaufen, en er zijn pistes voor beginners. Je komt hier met de auto, met de trein over de Raumabanen of door te vliegen naar Ålesund, Molde of Oslo.',
    pageSummaryFacts: [
      { label: 'Regio', value: 'Lesja, Innlandet, Noorwegen (bovenaan Romsdalen)' },
      { label: 'Luchthavens', value: 'Ålesund, Molde en Oslo' },
      { label: 'Trein', value: 'Raumabanen via Dombås' },
      { label: 'Ideaal voor', value: 'Wintersport met het gezin, beginners, langlaufen' },
    ],
    bodySections: [
      {
        id: 'why-bjorli',
        type: 'rich_text',
        heading: 'Waarom Bjorli voor je wintersport in Noorwegen',
        body:
          'Bjorli ligt waar Gudbrandsdalen overgaat in Romsdalen, aan de E136 en aan de spoorlijn Raumabanen tussen Dombås en Åndalsnes. Het is een klein bergdorp, geen groot skioord. Romsdalen, Trollveggen, Åndalsnes en Dovrefjell liggen binnen bereik voor een dagtrip.',
        image: img('eventEaster', 'Skiërs en een snowboarder bij het Nordløypa-bord boven Bjorli'),
      },
      {
        id: 'ski-center',
        type: 'rich_text',
        heading: 'Bjorli Skisenter',
        body:
          'Bjorli Skisenter is het skigebied van het dorp, met liften en pistes voor verschillende niveaus. De status van liften en pistes, de sneeuwhoogte en de temperatuur worden het hele seizoen live bijgewerkt, zodat je de omstandigheden kunt checken voordat je de berg op gaat.',
        image: img('kidsView', 'Twee kinderen op ski’s met de bergen op de achtergrond in Bjorli'),
      },
      {
        id: 'cta-ski-resort',
        type: 'cta_block',
        label: 'Naar het skigebied',
        href: '/nl/bjorli-skigebied',
        variant: 'primary',
      },
      {
        id: 'family',
        type: 'rich_text',
        heading: 'Skiën met kinderen',
        body:
          'Beginnerspistes, een skischool en skiverhuur maken Bjorli makkelijk met kinderen – je hoeft niet al je eigen spullen mee te nemen. Kinderen van 0 tot en met 6 jaar skiën gratis en hebben geen eigen Keycard (skipas) nodig.',
        image: img('skiSchool', 'Kinderen op skischool op de beginnerspiste in Bjorli'),
      },
      {
        id: 'travel',
        type: 'rich_text',
        heading: 'Hierheen reizen vanuit het buitenland',
        body:
          'Vlieg naar Ålesund (luchthaven Vigra), Molde of Oslo. Vanaf de luchthaven van Ålesund is het zo’n 2,5 uur rijden naar Bjorli (ongeveer 170 km) – reken op extra tijd voor het ophalen van een huurauto en voor winterse wegen. Vanaf Oslo is het zo’n 5 uur rijden: de E6 naar het noorden tot Dombås en dan de E136 naar het westen. Met de trein neem je de Dovrebanen naar Dombås en stap je over op de Raumabanen naar station Bjorli. Vliegroutes wisselen per seizoen, dus check de actuele dienstregelingen voordat je boekt. Trein- en bustijden vind je op www.entur.no.',
      },
      {
        id: 'beyond-alpine',
        type: 'rich_text',
        heading: 'Meer dan alpineskiën',
        body:
          'Bjorli is ook een langlaufbestemming, met geprepareerde loipes (langrennsløyper in het Noors) die het dorp verbinden met het fjell eromheen. Je kunt ook toerskiën en sneeuwschoenwandelen, en in de zomer worden dezelfde bergen gebruikt om te wandelen en te fietsen.',
        image: img('news', 'Skiërs en snowboarders pauzeren in de zon boven Bjorli'),
      },
    ],
    faq: [
      {
        q: 'Waar ligt Bjorli in Noorwegen?',
        a: 'Bjorli is een bergdorp in Lesja, in de provincie Innlandet, tussen Dombås en Åndalsnes aan de E136 en de Raumabanen. Het ligt bovenaan Romsdalen, in de bergen tussen Oost-Noorwegen en de westkust.',
      },
      {
        q: 'Wanneer is het skiseizoen in Bjorli?',
        a: 'De seizoensdata verschillen per jaar. Check de openingstijden en de live status van liften en sneeuw voordat je vertrekt.',
      },
      {
        q: 'Is Bjorli geschikt voor wintersport met het gezin?',
        a: 'Ja. Bjorli heeft beginnerspistes, een skischool en skiverhuur, en je kunt overnachten in een vakantiehuis, appartement of hotel. Kinderen van 0 tot en met 6 jaar skiën gratis en hebben geen eigen Keycard (skipas) nodig.',
      },
      {
        q: 'Hoe kom ik vanuit het buitenland in Bjorli?',
        a: 'Vlieg naar Ålesund (luchthaven Vigra), Molde of Oslo en reis verder met een huurauto of de trein. Vanaf de luchthaven van Ålesund is het zo’n 2,5 uur rijden naar Bjorli. Vliegroutes wisselen per seizoen, dus check de actuele dienstregelingen voordat je boekt.',
      },
      {
        q: 'Hoe kom ik vanuit Oslo in Bjorli?',
        a: 'Met de auto neem je de E6 naar het noorden tot Dombås en dan de E136 naar het westen – zo’n 5 uur vanaf Oslo, afhankelijk van de route en de omstandigheden. Met de trein neem je de Dovrebanen naar Dombås en stap je over op de Raumabanen naar station Bjorli. Trein- en bustijden en kaartjes vind je op www.entur.no.',
      },
      {
        q: 'Wat kun je in Bjorli doen naast alpineskiën?',
        a: 'Langlaufen op geprepareerde loipes, toerskiën en sneeuwschoenwandelen. In de zomer is Bjorli een uitvalsbasis voor wandelen, fietsen en uitstapjes naar Åndalsnes en Romsdalen.',
      },
    ],
    relatedLinks: [
      { label: 'Bjorli Skisenter', href: '/nl/bjorli-skigebied', description: 'Liften, pistes en live status van het skigebied.' },
      { label: 'Skipassen', href: '/nl/skipassen', description: 'Dagpassen en seizoenspassen.' },
      { label: 'Openingstijden', href: '/nl/openingstijden', description: 'Actuele en seizoensgebonden openingstijden.' },
      { label: 'Accommodatie', href: '/nl/accommodatie', description: 'Vakantiehuizen, appartementen en hotels in Bjorli.' },
      { label: 'Weer & webcams', href: '/nl/weer-en-webcams', description: 'Livecamera’s, weer en sneeuwcondities.' },
      { label: 'Reizen naar Bjorli', href: '/nl/reizen-naar-bjorli', description: 'Met de auto, de trein en het vliegtuig naar Bjorli.' },
    ],
    seoTitle: SKI_HOLIDAY_PAGES.nl.title,
    seoDescription: SKI_HOLIDAY_PAGES.nl.description,
    availableTranslations: [...SKI_HOLIDAY_LOCALES],
    translatedBody: true,
    lastReviewedAt: '2026-10-15',
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
  return d.tips.items.map((t, i) => {
    // Full editorial copy currently exists in Norwegian only; other locales
    // keep their existing short entries.
    const art = lang === 'no' ? TIP_ARTICLES_NO[i] : undefined;
    return {
      id: `tip-${lang}-${i}`,
      slug: slugify(t.title),
      language: lang,
      title: t.title,
      intro: art?.intro ?? t.intro,
      body: art?.body ?? t.intro,
      heroImage: { url: TIP_IMAGES[i % TIP_IMAGES.length], alt: t.title },
      category: t.category,
      season: 'all',
      seoTitle: art?.seoTitle ?? t.title,
      seoDescription: art?.seoDescription ?? t.intro,
    };
  });
};

/**
 * News entries.
 *
 * `status: 'unpublished'` keeps the source copy in the dictionaries but
 * removes the story everywhere it is consumed — listing, homepage, related
 * content, sitemap and prerender — and its URL falls back to a normal 404.
 *
 * A CTA is only rendered once `ctaFromDate` has passed; before that the
 * `preCtaNote` line is appended to the body instead.
 */
const buildNews = (lang: Language): CmsNews[] => {
  const d = dict(lang);
  const now = Date.now();
  return d.news.items
    .map((n, i) => {
      const ctaOpen = !n.ctaFromDate || now >= Date.parse(`${n.ctaFromDate}T00:00:00Z`);
      const body = [n.body ?? n.intro, !ctaOpen && n.preCtaNote ? n.preCtaNote : null]
        .filter(Boolean)
        .join('\n\n');
      return {
        id: `news-${lang}-${i}`,
        slug: n.slug ?? slugify(n.title),
        language: lang,
        title: n.title,
        intro: n.intro,
        body,
        heroImage: { url: n.image ?? NEWS_IMAGES[i % NEWS_IMAGES.length], alt: n.title },
        category: n.category,
        season: 'all' as const,
        publishedAt: n.date,
        updatedAt: n.date,
        seoTitle: n.seoTitle ?? n.title,
        seoDescription: n.seoDescription ?? n.intro,
        ...(ctaOpen && n.ctaLabel && n.ctaHref
          ? { ctaLabel: n.ctaLabel, ctaHref: n.ctaHref }
          : {}),
        status: n.status ?? 'published',
      };
    })
    .filter((n) => n.status === 'published');
};

/**
 * Editorial events.
 *
 * `status: 'unpublished'` hides an entry everywhere. Everything else is
 * returned here — including finished events — and the public split between
 * "current" and "archive" happens in `mergeEvents` / `mergeArchivedEvents`
 * via the Europe/Oslo archiving rule.
 */
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
    season: 'all' as const,
    publishedAt: e.date,
    updatedAt: e.date,
    startsAt: e.date,
    endsAt: e.endDate,
    bookingUrl: e.ctaUrl,
    ctaLabel: e.ctaLabel,
    ctaHref: e.ctaUrl,
    seoTitle: e.title,
    seoDescription: e.intro,
    status: e.status ?? 'published',
  })).filter((ev) => ev.status !== 'unpublished');
};

/**
 * Fetch approved user-submitted events from the public edge function
 * `list-approved-events`. The function enforces a column allowlist and
 * mints signed URLs for images against the private storage bucket, so
 * this adapter never sees private fields or raw storage paths.
 */
/** Build scripts read this to fail the build instead of silently dropping events. */
export const submissionFetchStatus = { errors: 0 };

const SUBMISSION_TTL_MS = 60_000;
const submissionCache = new Map<Language, { at: number; p: Promise<CmsEvent[]> }>();

/**
 * One request per language per minute: getEvents and getArchivedEvents share
 * the same approved feed (scope=all) and split it with isEventArchived, so
 * the listing, archive, detail page, prerender and sitemap all apply the
 * exact same publication rule (status = approved).
 */
const fetchApprovedSubmissions = (lang: Language): Promise<CmsEvent[]> => {
  const hit = submissionCache.get(lang);
  if (hit && Date.now() - hit.at < SUBMISSION_TTL_MS) return hit.p;
  const p = fetchApprovedSubmissionsUncached(lang);
  submissionCache.set(lang, { at: Date.now(), p });
  return p;
};

const fetchApprovedSubmissionsUncached = async (lang: Language): Promise<CmsEvent[]> => {
  try {
    const supabase = await loadSupabase();
    const { data, error } = await supabase.functions.invoke('list-approved-events', {
      body: { language: lang, scope: 'all' },
    });
    if (error) {
      submissionFetchStatus.errors += 1;
      submissionCache.delete(lang);
      console.warn('[cms] list-approved-events failed', error);
      return [];
    }
    const rows: Array<{
      id: string;
      slug: string;
      title: string;
      summary: string | null;
      description: string | null;
      organizer: string | null;
      category: string | null;
      language: string;
      start_date: string;
      end_date: string | null;
      time_text: string | null;
      location: string | null;
      maps_url: string | null;
      website: string | null;
      image_signed_urls: string[];
      /** Present only when submitter opted in via show_email_public. */
      email?: string;
    }> = (data as { events?: unknown[] })?.events as never ?? [];

    const fallback: CmsImage = {
      url: EVENT_IMAGES[0],
      alt: 'Arrangement på Bjorli',
    };
    return rows.map((r) => {
      const heroUrl = r.image_signed_urls?.[0];
      return {
        id: `submission-${r.id}`,
        slug: r.slug,
        language: r.language as Language,
        title: r.title,
        intro: r.summary ?? '',
        body: r.description ?? r.summary ?? '',
        heroImage: heroUrl ? { url: heroUrl, alt: r.title } : fallback,
        category: r.category ?? undefined,
        season: 'all' as const,
        publishedAt: r.start_date,
        updatedAt: r.start_date,
        startsAt: r.start_date,
        endsAt: r.end_date ?? undefined,
        // For submissions, external website lives on the DETAIL page's
        // organizer block — not as the card CTA (cards route internally).
        bookingUrl: undefined,
        ctaLabel: undefined,
        ctaHref: undefined,
        organizer: r.organizer ?? undefined,
        location: r.location ?? undefined,
        timeText: r.time_text ?? undefined,
        mapsUrl: r.maps_url ?? undefined,
        website: r.website ?? undefined,
        contactEmail: r.email,
        isSubmission: true,
        seoTitle: r.title,
        seoDescription: r.summary ?? '',
        status: 'published' as const,
      } as CmsEvent;
    });
  } catch (e) {
    submissionFetchStatus.errors += 1;
    submissionCache.delete(lang);
    console.warn('[cms] list-approved-events threw', e);
    return [];
  }
};

/** Approved submissions + editorial events, deduped by slug. */
const allEvents = (live: CmsEvent[], mock: CmsEvent[]): CmsEvent[] => {
  const seen = new Set<string>();
  const merged: CmsEvent[] = [];
  for (const list of [live, mock]) {
    for (const e of list) {
      if (seen.has(e.slug)) continue;
      seen.add(e.slug);
      merged.push(e);
    }
  }
  return merged;
};

/**
 * Public event feed: everything that is NOT archived, sorted by start date.
 * Archiving happens at 00:00 Europe/Oslo the day after the end date.
 */
const mergeEvents = (live: CmsEvent[], mock: CmsEvent[]): CmsEvent[] =>
  allEvents(live, mock)
    .filter((e) => !isEventArchived(e))
    .sort((a, b) => (a.startsAt ?? '').localeCompare(b.startsAt ?? ''));

/** Archive feed: finished events, most recently finished first. */
const mergeArchivedEvents = (live: CmsEvent[], mock: CmsEvent[]): CmsEvent[] =>
  allEvents(live, mock)
    .filter((e) => isEventArchived(e))
    .sort(compareArchivedEvents);

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
    // Homepage "Hva skjer på Bjorli" uses the same event source as
    // /arrangementer (approved submissions + editorial mock events,
    // merged and filtered to current/upcoming). We surface up to 6 so
    // the 1 + 2 + 3 layout can fill naturally, and fall back to fewer
    // cards when there are fewer real events.
    const events = mergeEvents(
      await fetchApprovedSubmissions(language),
      buildEvents(language),
    ).slice(0, 6);

    // ─── WINTER HOMEPAGE ─────────────────────────────────────────────
    // Section order matches the official Bjorli winter homepage spec:
    //   1 Header (Layout) · 2 Hero (Index.tsx)
    //   3 Status · 4 Siste nytt (alert) · 5 Hva skjer · 6 Intro
    //   7 Planning cards · 8 Skisenter · 9 Bo godt · 10 Tips
    //   11 Mer enn alpint · 12 Hvorfor Bjorli · 13 Reisen hit
    //   14 Siste nytt (Skisenter) · 15 FAQ
    //   16 Footer (Layout)
    // Status / Alert / Tips / Events / News are placeholders here and
    // will later be served by WordPress + a small ops backend.
  const homepageData = getHomepageData(language);
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
    // "Hva skjer på Bjorli" — destination-wide events and local
    // happenings (concerts, festivals, food & drink, family,
    // guided trips, farms, cycling, hiking, partner activities).
    // Placed directly under "Siste nytt" (alert) so upcoming events
    // surface before the intro copy.
    {
      id: 'events',
      type: 'events',
      eyebrow: d.events.eyebrow,
      title: d.events.title,
      subtitle: d.events.subtitle,
      ctaLabel: d.events.cta,
      ctaHref: '/arrangementer',
      items: events.map((e) => ({ ...e, date: e.startsAt ?? '' })),
    },
    { id: 'intro', type: 'intro', ...buildWinterIntro(language, d) },
    {
      // People on the slopes right under the intro, so the page doesn't
      // open with text only. Alt text: Norwegian on NO, English elsewhere.
      id: 'photoStrip',
      type: 'photoStrip',
      images: [
        { url: images.happyKid.src, alt: language === 'no' ? images.happyKid.alt : 'A happy girl on skis with her arms in the air in Bjorli.' },
        { url: images.kidSlalom.src, alt: language === 'no' ? images.kidSlalom.alt : 'A skier riding through an arch on the slope in Bjorli.' },
        { url: images.powderSkier.src, alt: language === 'no' ? images.powderSkier.alt : 'A skier in deep powder between snowy trees in Bjorli.' },
        { url: images.eveningLift.src, alt: language === 'no' ? 'Skiløpere i stolheisen med utsikt over dalen på Bjorli.' : 'Skiers on the chairlift above the valley in Bjorli.' },
      ],
    },
    {
      id: 'planning',
      type: 'cardGrid',
      title: homepageData.planning.title,
      subtitle: homepageData.planning.subtitle,
      items: homepageData.planning.cards.map((it, i) => ({
        title: it.title,
        desc: it.desc,
        icon: ['mountain', 'ticket', 'clock', 'camera', 'map', 'home', 'activity', 'coffee'][i],
        href: it.href,
        external: it.external,
      })),
    },
    {
      id: 'skiCenter',
      type: 'feature',
      eyebrow: homepageData.skiCenter.eyebrow,
      title: homepageData.skiCenter.title,
      body: homepageData.skiCenter.body,
      image: { url: images.skiRental.src, alt: homepageData.skiCenter.title },
      imageSide: 'left',
      ctas: [
        { label: homepageData.skiCenter.cta, href: '/bjorli-skisenter', variant: 'primary' },
        {
          label: d.hero.ctaLiftPass,
          href: homepageData.hero.liftPassUrl,
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
      {
        id: 'beyond',
        type: 'beyond',
        eyebrow: d.beyondAlpine.eyebrow,
        title: d.beyondAlpine.title,
        body: d.beyondAlpine.body,
        images: [
          // Only images[0] is rendered — keep the people photo first.
          { url: images.kidsFrame.src, alt: language === 'no' ? images.kidsFrame.alt : 'Children on skis in the #Bjorli frame with a mountain view.' },
          { url: cabinEvening, alt: 'Hytte i vinterkveld på Bjorli' },
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
      // Destination-wide "Hva skjer på Bjorli".
      // Note: the Skisenter "news" section is intentionally NOT
      // rendered on /sommer — it stays on the winter homepage only.
      // Placed directly after the "Velg din sommerdag" picker so
      // current events surface before the broader activity grid.
      {
        id: 'events',
        type: 'events' as const,
        eyebrow: d.events.eyebrow,
        title: d.events.title,
        subtitle: d.events.subtitle,
        ctaLabel: d.events.cta,
        ctaHref: '/arrangementer',
        items: events.map((e) => ({ ...e, date: e.startsAt ?? '' })),
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
      heroTitle: isSummer ? d.summer.title : homepageData.hero.title,
      heroSubtitle: isSummer ? d.summer.subtitle : homepageData.hero.subtitle,
      heroIntro: isSummer ? d.summer.intro : homepageData.hero.eyebrow,
      heroImage: { url: isSummer ? summerHero : heroWinter, alt: d.meta.siteName },
      seoTitle: isSummer ? d.summer.title : homepageData.hero.title,
      seoDescription: isSummer ? d.summer.intro : homepageData.hero.subtitle,
      sections: isSummer ? summerSections : winterSections,
    };
    return home;
  },

  async getNews(q) { return apply(buildNews(q.language), q); },
  async getEvents(q) {
    const [live, mock] = await Promise.all([
      fetchApprovedSubmissions(q.language),
      Promise.resolve(buildEvents(q.language)),
    ]);
    return apply(mergeEvents(live, mock), q);
  },
  async getArchivedEvents(q) {
    const [live, mock] = await Promise.all([
      fetchApprovedSubmissions(q.language),
      Promise.resolve(buildEvents(q.language)),
    ]);
    return apply(mergeArchivedEvents(live, mock), q);
  },
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
        { label: d.nav.winter, href: '/vinter' },
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
      const supabase = await loadSupabase();
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
