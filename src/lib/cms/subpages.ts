/**
 * Sub-page content for footer secondary routes
 * (/heiskort, /langrenn, /fotturer, /sykling, /familie, /vinter, /live, /loypekart).
 *
 * Lives in the CMS layer so swapping to Sanity/Strapi/DatoCMS/Storyblok later
 * only changes this file's source, never the page components.
 *
 * "Bjorli Skisenter" is a proper name and must NOT be translated in any locale.
 */
import type { CmsImage, Language } from './types';
import { images } from '@/lib/images';

const heroWinter   = images.heroWinter.src;
const crossCountry = images.crossCountry.src;
const hikingImg    = images.hiking.src;
const bikingImg    = images.biking.src;
const tipFamily    = images.familySummer.src;

const meta = (url: string): Pick<CmsImage, 'wpField' | 'placeholder' | 'caption' | 'credit'> => {
  const hit = Object.values(images).find((i) => i.src === url) as
    | { wpField: string; placeholder: boolean; caption?: string; credit?: string }
    | undefined;
  return hit
    ? { wpField: hit.wpField, placeholder: hit.placeholder, caption: hit.caption, credit: hit.credit }
    : {};
};

export type SubPageSlug =
  | 'heiskort'
  | 'langrenn'
  | 'fotturer'
  | 'sykling'
  | 'familie'
  | 'vinter'
  | 'live'
  | 'loypekart';

export type SubPageIcon =
  | 'mountain' | 'ticket' | 'snowflake' | 'map' | 'users'
  | 'bike' | 'compass' | 'baby' | 'sun' | 'sparkles'
  | 'camera' | 'clock' | 'activity';

export interface SubPageHighlight {
  title: string;
  desc: string;
  icon?: SubPageIcon;
}

export interface SubPageCta {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
  external?: boolean;
}

export interface SubPageFaq {
  q: string;
  a: string;
}

export interface CmsSubPage {
  slug: SubPageSlug;
  language: Language;
  title: string;
  intro: string;
  body: string;
  heroImage: CmsImage;
  highlights: SubPageHighlight[];
  ctas: SubPageCta[];
  faq?: SubPageFaq[];
  seoTitle: string;
  seoDescription: string;
  ogTitle?: string;
  ogDescription?: string;
}

const NO: Record<SubPageSlug, CmsSubPage> = {
  heiskort: {
    slug: 'heiskort', language: 'no',
    title: 'Heiskort på Bjorli',
    intro: 'Kjøp heiskort til Bjorli Skisenter – dagskort, flerdagskort og sesongkort for hele familien.',
    body: 'Heiskort på Bjorli gir deg tilgang til snøsikre nedfarter midt mellom Dombås og Åndalsnes. Vi anbefaler å kjøpe heiskort online før du kommer – da slipper du kø i billettluka og kan gå rett i heisen. Barn under en viss alder kjører gratis sammen med betalende voksen, og det finnes egne familiepriser i høysesongen.',
    heroImage: { url: heroWinter, alt: 'Heiser og nedfarter på Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Dagskort', desc: 'Fleksibelt for korte besøk og dagsturer.', icon: 'ticket' },
      { title: 'Flerdagskort', desc: 'Beste pris per dag for helg og ferie.', icon: 'sparkles' },
      { title: 'Sesongkort', desc: 'Ubegrenset kjøring hele vintersesongen.', icon: 'snowflake' },
      { title: 'Familievennlig', desc: 'Egne priser for barn og familier.', icon: 'users' },
    ],
    ctas: [
      { label: 'Kjøp heiskort', href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862', variant: 'primary', external: true },
      { label: 'Se Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Hvor kjøper jeg heiskort?', a: 'Heiskort kjøpes enkelt online før ankomst eller i billettluka i skisenteret.' },
      { q: 'Er det familiepriser?', a: 'Ja, det finnes både familiepriser og egne barnepriser i vintersesongen.' },
      { q: 'Trenger alle eget heiskort?', a: 'Ja, alle som skal bruke heisene må ha eget gyldig heiskort.' },
    ],
    seoTitle: 'Heiskort Bjorli – kjøp dagskort, flerdagskort og sesongkort',
    seoDescription: 'Kjøp heiskort til Bjorli Skisenter online – snøsikre nedfarter, familievennlige priser og enkel adgang til heisene. Dagskort, flerdagskort og sesongkort.',
  },
  langrenn: {
    slug: 'langrenn', language: 'no',
    title: 'Langrenn på Bjorli',
    intro: 'Snøsikre langrennsløyper i variert fjellterreng – ideelt for både trim og lange turer.',
    body: 'Bjorli er kjent for stabilt snøforhold og varierte langrennsløyper i åpent fjellandskap. Løypenettet binder sammen dalen og fjellet, og du kan gå korte runder rett fra hytta eller lengre dagsturer på fjellet. Løypene prepareres jevnlig gjennom hele sesongen, og passer både for klassisk og skøyting.',
    heroImage: { url: crossCountry, alt: 'Langrennsløyper på Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Snøsikkert', desc: 'Stabile forhold fra november til mai.', icon: 'snowflake' },
      { title: 'Variert terreng', desc: 'Fra rolige rundløyper til lange fjellturer.', icon: 'mountain' },
      { title: 'Godt preparert', desc: 'Løyper for både klassisk og skøyting.', icon: 'sparkles' },
      { title: 'Fra hyttedøra', desc: 'Mange løyper starter rett ved hytteområdene.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Se aktiviteter', href: '/aktiviteter', variant: 'primary' },
      { label: 'Finn overnatting', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Langrenn på Bjorli – snøsikre løyper i Romsdalen',
    seoDescription: 'Snøsikre langrennsløyper på Bjorli – varierte runder i fjellterreng for klassisk og skøyting. Løyper rett fra hytta og lange dagsturer på fjellet.',
  },
  fotturer: {
    slug: 'fotturer', language: 'no',
    title: 'Fotturer på Bjorli',
    intro: 'Korte familieturer og lange toppturer i flott fjellandskap mellom Dombås og Åndalsnes.',
    body: 'Sommer og høst er Bjorli en perfekt base for fotturer i Romsdalen. Tre nasjonalparker – Reinheimen, Dovrefjell-Sunndalsfjella og Romsdalsalpene – ligger like ved, og du finner stier for alle nivåer. Velg mellom enkle rundturer på fjellet, fugletitting i myrlandskap eller mer krevende toppturer med utsikt over Romsdalen.',
    heroImage: { url: hikingImg, alt: 'Fotturer i fjellet rundt Bjorli', ...meta(hikingImg) },
    highlights: [
      { title: 'Tre nasjonalparker', desc: 'Reinheimen, Dovrefjell og Romsdalsalpene.', icon: 'mountain' },
      { title: 'Familievennlig', desc: 'Korte turer som passer for barna.', icon: 'users' },
      { title: 'Toppturer', desc: 'Lengre turer med utsikt over Romsdalen.', icon: 'compass' },
      { title: 'Sommer og høst', desc: 'Lange dager og fargerikt høstfjell.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Se sommer på Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Finn overnatting', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Fotturer på Bjorli – fjelltopper og familieturer i Romsdalen',
    seoDescription: 'Fotturer på Bjorli – korte familieturer og lange toppturer mellom Dombås og Åndalsnes, midt mellom tre nasjonalparker.',
  },
  sykling: {
    slug: 'sykling', language: 'no',
    title: 'Sykling på Bjorli',
    intro: 'Stier og grusveier for terrengsykling, gravel og rolige familieturer i fjellet.',
    body: 'Bjorli er et flott utgangspunkt for sykling i fjellet. Et nettverk av grusveier og stier dekker både rolige familieturer og mer krevende terrengsykling. Du kan kombinere sykkel og tog via Raumabanen, og overnatte i hytter med god plass til både utstyr og våte klær.',
    heroImage: { url: bikingImg, alt: 'Sykling på Bjorli', ...meta(bikingImg) },
    highlights: [
      { title: 'Grusveier', desc: 'Lange runder for gravel og hybrid.', icon: 'bike' },
      { title: 'Stier', desc: 'Stisykling for de som vil utfordre seg.', icon: 'mountain' },
      { title: 'Familieturer', desc: 'Rolige strekninger som passer for barn.', icon: 'users' },
      { title: 'Tog og sykkel', desc: 'Kombiner med Raumabanen.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Se sommer på Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Reisen hit', href: '/reisen-hit', variant: 'secondary' },
    ],
    seoTitle: 'Sykling på Bjorli – terrengsykling, gravel og familieruter',
    seoDescription: 'Sykling på Bjorli – grusveier, stier og rolige familieturer i fjellet. Perfekt utgangspunkt for terrengsykling og gravel i Romsdalen.',
  },
  familie: {
    slug: 'familie', language: 'no',
    title: 'Familieferie på Bjorli',
    intro: 'Snøsikre vinterdager og rolige sommerturer – Bjorli er laget for barnefamilier.',
    body: 'Korte avstander, trygge nedfarter og familievennlige hytter gjør Bjorli til et naturlig valg for familieferie. Om vinteren er det rolige nedfarter, skiskole, aking og snøhule-bygging. Om sommeren venter korte turer, lekeplasser og naturopplevelser i tre nasjonalparker like ved.',
    heroImage: { url: tipFamily, alt: 'Familie på Bjorli', ...meta(tipFamily) },
    highlights: [
      { title: 'Snøsikkert', desc: 'Stabile forhold gjennom hele sesongen.', icon: 'snowflake' },
      { title: 'Korte avstander', desc: 'Fra hytta til heisen på minutter.', icon: 'compass' },
      { title: 'Skiskole', desc: 'Trygg innlæring for de minste.', icon: 'baby' },
      { title: 'Sommer for barna', desc: 'Korte turer og naturopplevelser.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Se overnatting', href: '/overnatting', variant: 'primary' },
      { label: 'Se aktiviteter', href: '/aktiviteter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Er Bjorli egnet for små barn?', a: 'Ja, korte avstander, rolige nedfarter og familievennlige hytter gjør Bjorli ideelt for barnefamilier.' },
      { q: 'Finnes det skiskole?', a: 'Ja, Bjorli Skisenter har skiskole for både nybegynnere og barn.' },
    ],
    seoTitle: 'Familieferie på Bjorli – snøsikker vinter og rolig sommer',
    seoDescription: 'Familieferie på Bjorli – snøsikre vinterdager med skiskole og rolige nedfarter, og familievennlige sommeropplevelser i Romsdalen.',
  },
  vinter: {
    slug: 'vinter', language: 'no',
    title: 'Vinter på Bjorli',
    intro: 'Snøsikker vinterdestinasjon mellom Dombås og Åndalsnes – alpint, langrenn, hytteliv og familieferie.',
    body: 'Bjorli er en av Norges mest snøsikre vinterdestinasjoner. Sesongen strekker seg typisk fra november til mai, med stabile forhold for både alpint og langrenn. Her finner du Bjorli Skisenter med varierte nedfarter, et stort nettverk av langrennsløyper, koselige hytter og familievennlige aktiviteter rett ved fjellet.',
    heroImage: { url: heroWinter, alt: 'Vinter på Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Alpint', desc: 'Nedfarter for alle nivåer i Bjorli Skisenter.', icon: 'mountain' },
      { title: 'Langrenn', desc: 'Snøsikre løyper i åpent fjellandskap.', icon: 'snowflake' },
      { title: 'Familievennlig', desc: 'Korte avstander og trygg skiskole.', icon: 'users' },
      { title: 'Hytteliv', desc: 'Hytter og leiligheter ved heisene.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Heiskort', href: '/heiskort', variant: 'secondary' },
    ],
    seoTitle: 'Vinter på Bjorli – snøsikker vinterferie i Romsdalen',
    seoDescription: 'Vinter på Bjorli – snøsikre nedfarter, langrenn og hytteliv mellom Dombås og Åndalsnes. Alt for vinterferien i Romsdalen.',
  },
  live: {
    slug: 'live', language: 'no',
    title: 'Live fra Bjorli',
    intro: 'Sjekk webkamera, åpningstider, snødybde og driftsstatus i sanntid før du drar opp.',
    body: 'Bli kjent med dagens forhold på Bjorli før du drar. Live-siden samler webkameraer, åpne heiser og løyper, snødybde, temperatur og driftsmeldinger på ett sted. Et godt utgangspunkt for å planlegge skidagen eller turen i fjellet.',
    heroImage: { url: heroWinter, alt: 'Live status fra Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Webkameraer', desc: 'Se live bilder fra fjellet.', icon: 'camera' },
      { title: 'Åpningstider', desc: 'Når heisene og senteret er åpne.', icon: 'clock' },
      { title: 'Snø og vær', desc: 'Snødybde og temperatur i sanntid.', icon: 'snowflake' },
      { title: 'Driftsstatus', desc: 'Åpne heiser, løyper og driftsmeldinger.', icon: 'activity' },
    ],
    ctas: [
      { label: 'Se webkameraer', href: '/vaer-og-webkamera', variant: 'primary' },
      { label: 'Åpningstider', href: '/apningstider', variant: 'secondary' },
    ],
    seoTitle: 'Live fra Bjorli – webkameraer, snødybde og driftsstatus',
    seoDescription: 'Live status fra Bjorli – webkameraer, åpningstider, snødybde, temperatur og driftsmeldinger samlet ett sted. Planlegg skidagen i sanntid.',
  },
  loypekart: {
    slug: 'loypekart', language: 'no',
    title: 'Løypekart for Bjorli',
    intro: 'Oversikt over alpine nedfarter og langrennsløyper i og rundt Bjorli Skisenter.',
    body: 'Løypekartet viser alpine nedfarter i Bjorli Skisenter og det omfattende langrennsløypenettet som binder sammen dalen og fjellet. Kartet er nyttig både for planlegging av skidagen og for å finne nye runder gjennom sesongen. Last ned PDF eller åpne digitalt kart for detaljer om vanskelighetsgrad og lengde.',
    heroImage: { url: crossCountry, alt: 'Løypekart for Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Alpine nedfarter', desc: 'Vanskelighetsgrad og heiskoblinger.', icon: 'mountain' },
      { title: 'Langrennsløyper', desc: 'Klassisk og skøyting i fjellet.', icon: 'snowflake' },
      { title: 'Lengder', desc: 'Korte runder og lange dagsturer.', icon: 'map' },
      { title: 'Sammenkoblet', desc: 'Bjorli, Bøstølen og fjellet over.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Langrenn', href: '/langrenn', variant: 'secondary' },
    ],
    seoTitle: 'Løypekart Bjorli – alpine nedfarter og langrennsløyper',
    seoDescription: 'Løypekart for Bjorli Skisenter og langrennsløyper i fjellet – vanskelighetsgrad, lengder og oversikt over hele løypenettet.',
  },
};

const EN: Record<SubPageSlug, CmsSubPage> = {
  heiskort: {
    slug: 'heiskort', language: 'en',
    title: 'Lift passes at Bjorli',
    intro: 'Lift passes for Bjorli Skisenter – day, multi-day and season passes for the whole family.',
    body: 'A lift pass at Bjorli gives you access to snow-sure slopes between Dombås and Åndalsnes. Buying online before you arrive saves time at the ticket office and lets you head straight for the lifts. Children below a certain age ski free with a paying adult, and family rates apply in high season.',
    heroImage: { url: heroWinter, alt: 'Lifts and slopes at Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Day pass', desc: 'Flexible for short visits and day trips.', icon: 'ticket' },
      { title: 'Multi-day pass', desc: 'Best value per day for weekends and holidays.', icon: 'sparkles' },
      { title: 'Season pass', desc: 'Unlimited skiing through the winter.', icon: 'snowflake' },
      { title: 'Family friendly', desc: 'Dedicated rates for children and families.', icon: 'users' },
    ],
    ctas: [
      { label: 'Buy lift pass', href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862', variant: 'primary', external: true },
      { label: 'About Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Where do I buy a lift pass?', a: 'Buy online before you arrive or at the ticket office at the resort.' },
      { q: 'Are there family rates?', a: 'Yes, family rates and dedicated child rates apply during the winter season.' },
      { q: 'Does everyone need their own pass?', a: 'Yes, every person using the lifts needs a valid personal pass.' },
    ],
    seoTitle: 'Bjorli lift passes – day, multi-day and season passes',
    seoDescription: 'Buy lift passes for Bjorli Skisenter online – snow-sure slopes, family rates and easy lift access. Day, multi-day and season passes.',
  },
  langrenn: {
    slug: 'langrenn', language: 'en',
    title: 'Cross-country skiing at Bjorli',
    intro: 'Snow-sure cross-country trails in varied mountain terrain – good for short laps and long tours.',
    body: 'Bjorli is known for stable snow and varied cross-country trails in open mountain landscape. The trail network links the valley with the mountain, so you can do short loops from the cabin or longer day tours up high. Trails are groomed regularly through the season for both classic and skating.',
    heroImage: { url: crossCountry, alt: 'Cross-country trails at Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Snow-sure', desc: 'Reliable conditions from November to May.', icon: 'snowflake' },
      { title: 'Varied terrain', desc: 'From easy loops to long mountain tours.', icon: 'mountain' },
      { title: 'Well groomed', desc: 'Tracks for both classic and skating.', icon: 'sparkles' },
      { title: 'From the cabin door', desc: 'Many trails start at the cabin clusters.', icon: 'compass' },
    ],
    ctas: [
      { label: 'See activities', href: '/aktiviteter', variant: 'primary' },
      { label: 'Find accommodation', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Cross-country skiing at Bjorli – snow-sure trails in Romsdalen',
    seoDescription: 'Snow-sure cross-country trails at Bjorli – varied loops in mountain terrain for classic and skating, short laps from the cabin and long day tours.',
  },
  fotturer: {
    slug: 'fotturer', language: 'en',
    title: 'Hiking at Bjorli',
    intro: 'Short family walks and longer summit hikes in the mountains between Dombås and Åndalsnes.',
    body: 'In summer and autumn, Bjorli is a good base for hiking in Romsdalen. Three national parks – Reinheimen, Dovrefjell-Sunndalsfjella and Romsdalsalpene – are close by, with trails for every level. Choose easy mountain loops, birdwatching in wetlands, or longer summit hikes with views across Romsdalen.',
    heroImage: { url: hikingImg, alt: 'Hiking in the mountains around Bjorli', ...meta(hikingImg) },
    highlights: [
      { title: 'Three national parks', desc: 'Reinheimen, Dovrefjell and Romsdalsalpene.', icon: 'mountain' },
      { title: 'Family friendly', desc: 'Short walks that suit children.', icon: 'users' },
      { title: 'Summit hikes', desc: 'Longer routes with views over Romsdalen.', icon: 'compass' },
      { title: 'Summer and autumn', desc: 'Long days and colour on the fells.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Summer at Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Find accommodation', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Hiking at Bjorli – summits and family walks in Romsdalen',
    seoDescription: 'Hiking at Bjorli – short family walks and longer summit hikes between Dombås and Åndalsnes, close to three national parks.',
  },
  sykling: {
    slug: 'sykling', language: 'en',
    title: 'Cycling at Bjorli',
    intro: 'Trails and gravel roads for mountain biking, gravel and easy family rides in the mountains.',
    body: 'Bjorli is a good base for cycling in the mountains. A network of gravel roads and trails covers everything from easy family rides to more demanding mountain biking. You can combine bike and train via the Raumabanen line and stay in cabins with room for gear and wet kit.',
    heroImage: { url: bikingImg, alt: 'Cycling at Bjorli', ...meta(bikingImg) },
    highlights: [
      { title: 'Gravel roads', desc: 'Long loops for gravel and hybrid bikes.', icon: 'bike' },
      { title: 'Trails', desc: 'Singletrack for riders who want a challenge.', icon: 'mountain' },
      { title: 'Family routes', desc: 'Easy stretches that suit children.', icon: 'users' },
      { title: 'Train and bike', desc: 'Combine with the Raumabanen line.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Summer at Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Getting here', href: '/reisen-hit', variant: 'secondary' },
    ],
    seoTitle: 'Cycling at Bjorli – mountain biking, gravel and family routes',
    seoDescription: 'Cycling at Bjorli – gravel roads, trails and easy family rides in the mountains. A good base for mountain biking and gravel in Romsdalen.',
  },
  familie: {
    slug: 'familie', language: 'en',
    title: 'Family holidays at Bjorli',
    intro: 'Snow-sure winter days and easy summer trips – Bjorli works well for families with children.',
    body: 'Short distances, gentle slopes and family-friendly cabins make Bjorli a natural choice for a family holiday. In winter there are easy slopes, ski school, sledging and snow-cave building. In summer there are short walks, playgrounds and nature experiences in three national parks nearby.',
    heroImage: { url: tipFamily, alt: 'A family at Bjorli', ...meta(tipFamily) },
    highlights: [
      { title: 'Snow-sure', desc: 'Stable conditions through the season.', icon: 'snowflake' },
      { title: 'Short distances', desc: 'From cabin to lift in minutes.', icon: 'compass' },
      { title: 'Ski school', desc: 'Calm learning for the youngest skiers.', icon: 'baby' },
      { title: 'Summer for children', desc: 'Short walks and nature experiences.', icon: 'sun' },
    ],
    ctas: [
      { label: 'See accommodation', href: '/overnatting', variant: 'primary' },
      { label: 'See activities', href: '/aktiviteter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Is Bjorli suitable for small children?', a: 'Yes, short distances, gentle slopes and family-friendly cabins make Bjorli well suited to families.' },
      { q: 'Is there a ski school?', a: 'Yes, Bjorli Skisenter runs ski school for beginners and children.' },
    ],
    seoTitle: 'Family holidays at Bjorli – snow-sure winter and easy summer',
    seoDescription: 'Family holidays at Bjorli – snow-sure winter days with ski school and gentle slopes, plus family-friendly summer experiences in Romsdalen.',
  },
  vinter: {
    slug: 'vinter', language: 'en',
    title: 'Winter at Bjorli',
    intro: 'Snow-sure winter destination between Dombås and Åndalsnes – alpine, cross-country, cabin life and family holidays.',
    body: 'Bjorli is one of Norway’s most snow-sure winter destinations. The season usually runs from November to May, with stable conditions for both alpine and cross-country skiing. You will find Bjorli Skisenter with varied slopes, an extensive cross-country trail network, cabins and family-friendly activities right by the mountain.',
    heroImage: { url: heroWinter, alt: 'Winter at Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Alpine', desc: 'Slopes for every level at Bjorli Skisenter.', icon: 'mountain' },
      { title: 'Cross-country', desc: 'Snow-sure trails in open mountain terrain.', icon: 'snowflake' },
      { title: 'Family friendly', desc: 'Short distances and a calm ski school.', icon: 'users' },
      { title: 'Cabin life', desc: 'Cabins and apartments near the lifts.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Lift passes', href: '/heiskort', variant: 'secondary' },
    ],
    seoTitle: 'Winter at Bjorli – snow-sure winter holidays in Romsdalen',
    seoDescription: 'Winter at Bjorli – snow-sure slopes, cross-country and cabin life between Dombås and Åndalsnes. Everything for a winter holiday in Romsdalen.',
  },
  live: {
    slug: 'live', language: 'en',
    title: 'Live from Bjorli',
    intro: 'Check webcams, opening hours, snow depth and lift status in real time before heading up.',
    body: 'Get a sense of current conditions at Bjorli before you go. The live page collects webcams, open lifts and trails, snow depth, temperature and operational notices in one place. A useful starting point for planning the ski day or a mountain trip.',
    heroImage: { url: heroWinter, alt: 'Live status from Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Webcams', desc: 'Live views from the mountain.', icon: 'camera' },
      { title: 'Opening hours', desc: 'When the lifts and resort are open.', icon: 'clock' },
      { title: 'Snow and weather', desc: 'Snow depth and temperature in real time.', icon: 'snowflake' },
      { title: 'Lift status', desc: 'Open lifts, trails and operational notices.', icon: 'activity' },
    ],
    ctas: [
      { label: 'See webcams', href: '/vaer-og-webkamera', variant: 'primary' },
      { label: 'Opening hours', href: '/apningstider', variant: 'secondary' },
    ],
    seoTitle: 'Live from Bjorli – webcams, snow depth and lift status',
    seoDescription: 'Live status from Bjorli – webcams, opening hours, snow depth, temperature and operational notices in one place. Plan your ski day in real time.',
  },
  loypekart: {
    slug: 'loypekart', language: 'en',
    title: 'Trail map for Bjorli',
    intro: 'Overview of alpine slopes and cross-country trails in and around Bjorli Skisenter.',
    body: 'The trail map shows the alpine slopes at Bjorli Skisenter and the wider cross-country trail network linking the valley with the mountain. Useful for planning the ski day and for finding new loops through the season. Download the PDF or open the digital map for difficulty grades and distances.',
    heroImage: { url: crossCountry, alt: 'Trail map for Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Alpine slopes', desc: 'Difficulty grades and lift connections.', icon: 'mountain' },
      { title: 'Cross-country trails', desc: 'Classic and skating on the mountain.', icon: 'snowflake' },
      { title: 'Distances', desc: 'Short loops and long day tours.', icon: 'map' },
      { title: 'Connected', desc: 'Bjorli, Bøstølen and the high mountain.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Cross-country', href: '/langrenn', variant: 'secondary' },
    ],
    seoTitle: 'Trail map Bjorli – alpine slopes and cross-country trails',
    seoDescription: 'Trail map for Bjorli Skisenter and the cross-country trails in the mountain – difficulty grades, distances and the full trail network.',
  },
};

const DE: Record<SubPageSlug, CmsSubPage> = {
  heiskort: {
    slug: 'heiskort', language: 'de',
    title: 'Skipässe in Bjorli',
    intro: 'Skipässe für Bjorli Skisenter – Tages-, Mehrtages- und Saisonpässe für die ganze Familie.',
    body: 'Ein Skipass in Bjorli gibt Ihnen Zugang zu schneesicheren Pisten zwischen Dombås und Åndalsnes. Wir empfehlen, den Skipass online vor der Anreise zu kaufen – so sparen Sie sich die Warteschlange am Schalter und können direkt zum Lift gehen. Kinder unter einer bestimmten Altersgrenze fahren in Begleitung eines zahlenden Erwachsenen kostenlos, und in der Hochsaison gelten eigene Familientarife.',
    heroImage: { url: heroWinter, alt: 'Lifte und Pisten in Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Tagespass', desc: 'Flexibel für kurze Besuche und Tagesausflüge.', icon: 'ticket' },
      { title: 'Mehrtagespass', desc: 'Bester Tagespreis für Wochenende und Ferien.', icon: 'sparkles' },
      { title: 'Saisonpass', desc: 'Unbegrenztes Skifahren die ganze Wintersaison.', icon: 'snowflake' },
      { title: 'Familienfreundlich', desc: 'Eigene Tarife für Kinder und Familien.', icon: 'users' },
    ],
    ctas: [
      { label: 'Skipass kaufen', href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862', variant: 'primary', external: true },
      { label: 'Bjorli Skisenter ansehen', href: '/bjorli-skisenter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Wo kaufe ich einen Skipass?', a: 'Den Skipass kaufen Sie bequem online vor der Anreise oder am Schalter im Skigebiet.' },
      { q: 'Gibt es Familientarife?', a: 'Ja, in der Wintersaison gelten sowohl Familien- als auch eigene Kindertarife.' },
      { q: 'Braucht jede Person einen eigenen Skipass?', a: 'Ja, alle, die die Lifte benutzen, benötigen einen eigenen gültigen Skipass.' },
    ],
    seoTitle: 'Skipass Bjorli – Tages-, Mehrtages- und Saisonpässe',
    seoDescription: 'Skipässe für Bjorli Skisenter online kaufen – schneesichere Pisten, familienfreundliche Preise und einfacher Liftzugang. Tages-, Mehrtages- und Saisonpässe.',
  },
  langrenn: {
    slug: 'langrenn', language: 'de',
    title: 'Langlauf in Bjorli',
    intro: 'Schneesichere Langlaufloipen im abwechslungsreichen Berggelände – ideal für kurze Runden und lange Touren.',
    body: 'Bjorli ist bekannt für stabile Schneeverhältnisse und abwechslungsreiche Langlaufloipen in offener Berglandschaft. Das Loipennetz verbindet Tal und Berg, sodass Sie kurze Runden direkt von der Hütte oder längere Tagestouren auf dem Hochplateau gehen können. Die Loipen werden die ganze Saison über regelmäßig präpariert und eignen sich für Klassisch und Skating.',
    heroImage: { url: crossCountry, alt: 'Langlaufloipen in Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Schneesicher', desc: 'Stabile Verhältnisse von November bis Mai.', icon: 'snowflake' },
      { title: 'Abwechslungsreich', desc: 'Von ruhigen Runden bis zu langen Bergtouren.', icon: 'mountain' },
      { title: 'Gut präpariert', desc: 'Spuren für Klassisch und Skating.', icon: 'sparkles' },
      { title: 'Direkt vor der Tür', desc: 'Viele Loipen beginnen an den Hüttengebieten.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Aktivitäten ansehen', href: '/aktiviteter', variant: 'primary' },
      { label: 'Unterkunft finden', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Langlauf in Bjorli – schneesichere Loipen in Romsdalen',
    seoDescription: 'Schneesichere Langlaufloipen in Bjorli – abwechslungsreiche Runden im Berggelände für Klassisch und Skating. Loipen direkt von der Hütte und lange Tagestouren am Berg.',
  },
  fotturer: {
    slug: 'fotturer', language: 'de',
    title: 'Wandern in Bjorli',
    intro: 'Kurze Familienwanderungen und längere Gipfeltouren in der Berglandschaft zwischen Dombås und Åndalsnes.',
    body: 'Im Sommer und Herbst ist Bjorli ein guter Ausgangspunkt für Wanderungen in Romsdalen. Drei Nationalparks – Reinheimen, Dovrefjell-Sunndalsfjella und Romsdalsalpene – liegen direkt nebenan, mit Wegen für jedes Niveau. Wählen Sie zwischen leichten Bergrunden, Vogelbeobachtung im Moorland oder anspruchsvolleren Gipfeltouren mit Blick über Romsdalen.',
    heroImage: { url: hikingImg, alt: 'Wandern im Berggebiet um Bjorli', ...meta(hikingImg) },
    highlights: [
      { title: 'Drei Nationalparks', desc: 'Reinheimen, Dovrefjell und Romsdalsalpene.', icon: 'mountain' },
      { title: 'Familienfreundlich', desc: 'Kurze Touren, die für Kinder geeignet sind.', icon: 'users' },
      { title: 'Gipfeltouren', desc: 'Längere Touren mit Blick über Romsdalen.', icon: 'compass' },
      { title: 'Sommer und Herbst', desc: 'Lange Tage und farbiger Bergherbst.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Sommer in Bjorli ansehen', href: '/sommer', variant: 'primary' },
      { label: 'Unterkunft finden', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Wandern in Bjorli – Gipfel und Familientouren in Romsdalen',
    seoDescription: 'Wandern in Bjorli – kurze Familientouren und lange Gipfeltouren zwischen Dombås und Åndalsnes, inmitten von drei Nationalparks.',
  },
  sykling: {
    slug: 'sykling', language: 'de',
    title: 'Radfahren in Bjorli',
    intro: 'Trails und Schotterwege für Mountainbike, Gravel und ruhige Familientouren im Berggebiet.',
    body: 'Bjorli ist ein guter Ausgangspunkt zum Radfahren in den Bergen. Ein Netz aus Schotterwegen und Trails deckt sowohl ruhige Familientouren als auch anspruchsvolleres Mountainbiken ab. Sie können Rad und Bahn über die Raumabanen kombinieren und in Hütten mit Platz für Ausrüstung und nasse Kleidung übernachten.',
    heroImage: { url: bikingImg, alt: 'Radfahren in Bjorli', ...meta(bikingImg) },
    highlights: [
      { title: 'Schotterwege', desc: 'Lange Runden für Gravel und Trekkingräder.', icon: 'bike' },
      { title: 'Trails', desc: 'Singletrails für alle, die sich fordern wollen.', icon: 'mountain' },
      { title: 'Familientouren', desc: 'Ruhige Abschnitte, die für Kinder geeignet sind.', icon: 'users' },
      { title: 'Bahn und Rad', desc: 'Mit der Raumabanen kombinieren.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Sommer in Bjorli ansehen', href: '/sommer', variant: 'primary' },
      { label: 'Anreise', href: '/reisen-hit', variant: 'secondary' },
    ],
    seoTitle: 'Radfahren in Bjorli – Mountainbike, Gravel und Familienrouten',
    seoDescription: 'Radfahren in Bjorli – Schotterwege, Trails und ruhige Familientouren im Berggebiet. Guter Ausgangspunkt für Mountainbike und Gravel in Romsdalen.',
  },
  familie: {
    slug: 'familie', language: 'de',
    title: 'Familienurlaub in Bjorli',
    intro: 'Schneesichere Wintertage und ruhige Sommerausflüge – Bjorli ist auf Familien mit Kindern eingestellt.',
    body: 'Kurze Wege, sichere Pisten und familienfreundliche Hütten machen Bjorli zur natürlichen Wahl für den Familienurlaub. Im Winter erwarten Sie ruhige Pisten, Skischule, Schlittenfahren und Schneehöhlenbau. Im Sommer gibt es kurze Wanderungen, Spielplätze und Naturerlebnisse in drei nahegelegenen Nationalparks.',
    heroImage: { url: tipFamily, alt: 'Familie in Bjorli', ...meta(tipFamily) },
    highlights: [
      { title: 'Schneesicher', desc: 'Stabile Verhältnisse die ganze Saison.', icon: 'snowflake' },
      { title: 'Kurze Wege', desc: 'Von der Hütte zum Lift in wenigen Minuten.', icon: 'compass' },
      { title: 'Skischule', desc: 'Ruhiges Erlernen für die Kleinsten.', icon: 'baby' },
      { title: 'Sommer für Kinder', desc: 'Kurze Touren und Naturerlebnisse.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Unterkunft ansehen', href: '/overnatting', variant: 'primary' },
      { label: 'Aktivitäten ansehen', href: '/aktiviteter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Eignet sich Bjorli für kleine Kinder?', a: 'Ja, kurze Wege, ruhige Pisten und familienfreundliche Hütten machen Bjorli ideal für Familien.' },
      { q: 'Gibt es eine Skischule?', a: 'Ja, Bjorli Skisenter bietet eine Skischule für Anfänger und Kinder.' },
    ],
    seoTitle: 'Familienurlaub in Bjorli – schneesicherer Winter und ruhiger Sommer',
    seoDescription: 'Familienurlaub in Bjorli – schneesichere Wintertage mit Skischule und ruhigen Pisten, plus familienfreundliche Sommererlebnisse in Romsdalen.',
  },
  vinter: {
    slug: 'vinter', language: 'de',
    title: 'Winter in Bjorli',
    intro: 'Schneesicheres Winterziel zwischen Dombås und Åndalsnes – Alpin, Langlauf, Hüttenleben und Familienurlaub.',
    body: 'Bjorli gehört zu den schneesichersten Winterzielen Norwegens. Die Saison dauert in der Regel von November bis Mai, mit stabilen Verhältnissen für Alpin und Langlauf. Hier finden Sie Bjorli Skisenter mit abwechslungsreichen Pisten, ein großes Langlaufloipennetz, gemütliche Hütten und familienfreundliche Aktivitäten direkt am Berg.',
    heroImage: { url: heroWinter, alt: 'Winter in Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Alpin', desc: 'Pisten für jedes Niveau im Bjorli Skisenter.', icon: 'mountain' },
      { title: 'Langlauf', desc: 'Schneesichere Loipen in offener Berglandschaft.', icon: 'snowflake' },
      { title: 'Familienfreundlich', desc: 'Kurze Wege und sichere Skischule.', icon: 'users' },
      { title: 'Hüttenleben', desc: 'Hütten und Wohnungen an den Liften.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Skipässe', href: '/heiskort', variant: 'secondary' },
    ],
    seoTitle: 'Winter in Bjorli – schneesicherer Winterurlaub in Romsdalen',
    seoDescription: 'Winter in Bjorli – schneesichere Pisten, Langlauf und Hüttenleben zwischen Dombås und Åndalsnes. Alles für den Winterurlaub in Romsdalen.',
  },
  live: {
    slug: 'live', language: 'de',
    title: 'Live aus Bjorli',
    intro: 'Webcams, Öffnungszeiten, Schneehöhe und Liftstatus in Echtzeit vor der Auffahrt prüfen.',
    body: 'Verschaffen Sie sich vor der Fahrt einen Eindruck der aktuellen Verhältnisse in Bjorli. Die Live-Seite bündelt Webcams, geöffnete Lifte und Loipen, Schneehöhe, Temperatur und Betriebsmeldungen an einem Ort. Ein guter Ausgangspunkt, um den Skitag oder die Bergtour zu planen.',
    heroImage: { url: heroWinter, alt: 'Live-Status aus Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Webcams', desc: 'Live-Bilder vom Berg.', icon: 'camera' },
      { title: 'Öffnungszeiten', desc: 'Wann Lifte und Zentrum geöffnet sind.', icon: 'clock' },
      { title: 'Schnee und Wetter', desc: 'Schneehöhe und Temperatur in Echtzeit.', icon: 'snowflake' },
      { title: 'Liftstatus', desc: 'Offene Lifte, Loipen und Betriebsmeldungen.', icon: 'activity' },
    ],
    ctas: [
      { label: 'Webcams ansehen', href: '/vaer-og-webkamera', variant: 'primary' },
      { label: 'Öffnungszeiten', href: '/apningstider', variant: 'secondary' },
    ],
    seoTitle: 'Live aus Bjorli – Webcams, Schneehöhe und Liftstatus',
    seoDescription: 'Live-Status aus Bjorli – Webcams, Öffnungszeiten, Schneehöhe, Temperatur und Betriebsmeldungen an einem Ort. Skitag in Echtzeit planen.',
  },
  loypekart: {
    slug: 'loypekart', language: 'de',
    title: 'Loipenplan für Bjorli',
    intro: 'Übersicht über alpine Pisten und Langlaufloipen in und um Bjorli Skisenter.',
    body: 'Der Loipenplan zeigt die alpinen Pisten im Bjorli Skisenter und das umfangreiche Langlaufloipennetz, das Tal und Berg verbindet. Nützlich für die Planung des Skitages und um über die Saison neue Runden zu finden. PDF herunterladen oder die digitale Karte für Schwierigkeitsgrad und Länge öffnen.',
    heroImage: { url: crossCountry, alt: 'Loipenplan für Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Alpine Pisten', desc: 'Schwierigkeitsgrade und Liftanbindungen.', icon: 'mountain' },
      { title: 'Langlaufloipen', desc: 'Klassisch und Skating am Berg.', icon: 'snowflake' },
      { title: 'Längen', desc: 'Kurze Runden und lange Tagestouren.', icon: 'map' },
      { title: 'Verbunden', desc: 'Bjorli, Bøstølen und der Hochberg.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Langlauf', href: '/langrenn', variant: 'secondary' },
    ],
    seoTitle: 'Loipenplan Bjorli – alpine Pisten und Langlaufloipen',
    seoDescription: 'Loipenplan für Bjorli Skisenter und die Langlaufloipen am Berg – Schwierigkeitsgrade, Längen und das gesamte Loipennetz.',
  },
};

const NL: Record<SubPageSlug, CmsSubPage> = {
  heiskort: {
    slug: 'heiskort', language: 'nl',
    title: 'Skipassen op Bjorli',
    intro: 'Skipassen voor Bjorli Skisenter – dagpassen, meerdaagse passen en seizoenpassen voor het hele gezin.',
    body: 'Een skipas op Bjorli geeft je toegang tot sneeuwzekere pistes tussen Dombås en Åndalsnes. We raden aan om je skipas online te kopen voordat je komt – zo sta je niet in de rij en kun je direct naar de lift. Kinderen onder een bepaalde leeftijd skiën gratis met een betalende volwassene, en in het hoogseizoen gelden aparte gezinstarieven.',
    heroImage: { url: heroWinter, alt: 'Liften en pistes op Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Dagpas', desc: 'Flexibel voor korte bezoeken en dagtrips.', icon: 'ticket' },
      { title: 'Meerdaagse pas', desc: 'Beste prijs per dag voor weekend en vakantie.', icon: 'sparkles' },
      { title: 'Seizoenpas', desc: 'Onbeperkt skiën het hele winterseizoen.', icon: 'snowflake' },
      { title: 'Gezinsvriendelijk', desc: 'Aparte tarieven voor kinderen en gezinnen.', icon: 'users' },
    ],
    ctas: [
      { label: 'Koop skipas', href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862', variant: 'primary', external: true },
      { label: 'Bekijk Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Waar koop ik een skipas?', a: 'Je koopt je skipas eenvoudig online voor aankomst of bij de kassa in het skigebied.' },
      { q: 'Zijn er gezinstarieven?', a: 'Ja, in het winterseizoen gelden zowel gezinstarieven als aparte kindertarieven.' },
      { q: 'Heeft iedereen een eigen skipas nodig?', a: 'Ja, iedereen die de liften gebruikt heeft een eigen geldige skipas nodig.' },
    ],
    seoTitle: 'Skipassen Bjorli – koop dag-, meerdaagse en seizoenpassen',
    seoDescription: 'Koop skipassen voor Bjorli Skisenter online – sneeuwzekere pistes, gezinstarieven en eenvoudige toegang tot de liften. Dag-, meerdaagse en seizoenpassen.',
  },
  langrenn: {
    slug: 'langrenn', language: 'nl',
    title: 'Langlaufen op Bjorli',
    intro: 'Sneeuwzekere langlaufloipes in afwisselend bergterrein – ideaal voor korte rondes en lange tochten.',
    body: 'Bjorli staat bekend om stabiele sneeuw en afwisselende langlaufloipes in open berglandschap. Het loipenetwerk verbindt het dal met de berg, zodat je korte rondjes direct vanaf de hut kunt doen of langere dagtochten op het hoogplateau. De loipes worden het hele seizoen regelmatig geprepareerd, voor zowel klassiek als schaatsen.',
    heroImage: { url: crossCountry, alt: 'Langlaufloipes op Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Sneeuwzeker', desc: 'Stabiele omstandigheden van november tot mei.', icon: 'snowflake' },
      { title: 'Afwisselend', desc: 'Van rustige rondjes tot lange bergtochten.', icon: 'mountain' },
      { title: 'Goed geprepareerd', desc: 'Sporen voor zowel klassiek als schaatsen.', icon: 'sparkles' },
      { title: 'Vanaf de hutdeur', desc: 'Veel loipes starten bij de hutcomplexen.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bekijk activiteiten', href: '/aktiviteter', variant: 'primary' },
      { label: 'Vind accommodatie', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Langlaufen op Bjorli – sneeuwzekere loipes in Romsdalen',
    seoDescription: 'Sneeuwzekere langlaufloipes op Bjorli – afwisselende rondjes in bergterrein voor klassiek en schaatsen. Loipes vanaf de hut en lange dagtochten op de berg.',
  },
  fotturer: {
    slug: 'fotturer', language: 'nl',
    title: 'Wandelen op Bjorli',
    intro: 'Korte gezinswandelingen en langere toppentochten in het berglandschap tussen Dombås en Åndalsnes.',
    body: 'In zomer en herfst is Bjorli een goede uitvalsbasis voor wandelen in Romsdalen. Drie nationale parken – Reinheimen, Dovrefjell-Sunndalsfjella en Romsdalsalpene – liggen vlakbij, met paden voor elk niveau. Kies tussen makkelijke bergrondes, vogels kijken in moerasgebieden of zwaardere toppentochten met uitzicht over Romsdalen.',
    heroImage: { url: hikingImg, alt: 'Wandelen in de bergen rond Bjorli', ...meta(hikingImg) },
    highlights: [
      { title: 'Drie nationale parken', desc: 'Reinheimen, Dovrefjell en Romsdalsalpene.', icon: 'mountain' },
      { title: 'Gezinsvriendelijk', desc: 'Korte wandelingen die geschikt zijn voor kinderen.', icon: 'users' },
      { title: 'Toppentochten', desc: 'Langere routes met uitzicht over Romsdalen.', icon: 'compass' },
      { title: 'Zomer en herfst', desc: 'Lange dagen en kleurrijke herfstbergen.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Zomer op Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Vind accommodatie', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Wandelen op Bjorli – toppen en gezinswandelingen in Romsdalen',
    seoDescription: 'Wandelen op Bjorli – korte gezinswandelingen en lange toppentochten tussen Dombås en Åndalsnes, tussen drie nationale parken.',
  },
  sykling: {
    slug: 'sykling', language: 'nl',
    title: 'Fietsen op Bjorli',
    intro: 'Paden en grindwegen voor mountainbike, gravel en rustige gezinstochten in de bergen.',
    body: 'Bjorli is een goede uitvalsbasis voor fietsen in de bergen. Een netwerk van grindwegen en paden dekt zowel rustige gezinstochten als zwaardere mountainbike-routes. Je kunt fiets en trein combineren via de Raumabanen en overnachten in hutten met ruimte voor uitrusting en natte kleding.',
    heroImage: { url: bikingImg, alt: 'Fietsen op Bjorli', ...meta(bikingImg) },
    highlights: [
      { title: 'Grindwegen', desc: 'Lange rondes voor gravel en hybride fietsen.', icon: 'bike' },
      { title: 'Paden', desc: 'Singletrack voor wie zichzelf wil uitdagen.', icon: 'mountain' },
      { title: 'Gezinsroutes', desc: 'Rustige stukken die geschikt zijn voor kinderen.', icon: 'users' },
      { title: 'Trein en fiets', desc: 'Combineer met de Raumabanen.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Zomer op Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Reisinformatie', href: '/reisen-hit', variant: 'secondary' },
    ],
    seoTitle: 'Fietsen op Bjorli – mountainbike, gravel en gezinsroutes',
    seoDescription: 'Fietsen op Bjorli – grindwegen, paden en rustige gezinstochten in de bergen. Goede uitvalsbasis voor mountainbike en gravel in Romsdalen.',
  },
  familie: {
    slug: 'familie', language: 'nl',
    title: 'Gezinsvakantie op Bjorli',
    intro: 'Sneeuwzekere winterdagen en rustige zomertochten – Bjorli werkt goed voor gezinnen met kinderen.',
    body: 'Korte afstanden, rustige pistes en gezinsvriendelijke hutten maken Bjorli een logische keuze voor een gezinsvakantie. In de winter zijn er rustige pistes, skischool, sleeën en sneeuwhutten bouwen. In de zomer zijn er korte wandelingen, speeltuinen en natuurbelevingen in drie nationale parken vlakbij.',
    heroImage: { url: tipFamily, alt: 'Gezin op Bjorli', ...meta(tipFamily) },
    highlights: [
      { title: 'Sneeuwzeker', desc: 'Stabiele omstandigheden het hele seizoen.', icon: 'snowflake' },
      { title: 'Korte afstanden', desc: 'Van hut naar lift in minuten.', icon: 'compass' },
      { title: 'Skischool', desc: 'Rustig leren voor de jongsten.', icon: 'baby' },
      { title: 'Zomer voor kinderen', desc: 'Korte wandelingen en natuurbelevingen.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Bekijk accommodatie', href: '/overnatting', variant: 'primary' },
      { label: 'Bekijk activiteiten', href: '/aktiviteter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Is Bjorli geschikt voor kleine kinderen?', a: 'Ja, korte afstanden, rustige pistes en gezinsvriendelijke hutten maken Bjorli geschikt voor gezinnen.' },
      { q: 'Is er een skischool?', a: 'Ja, Bjorli Skisenter heeft een skischool voor beginners en kinderen.' },
    ],
    seoTitle: 'Gezinsvakantie op Bjorli – sneeuwzekere winter en rustige zomer',
    seoDescription: 'Gezinsvakantie op Bjorli – sneeuwzekere winterdagen met skischool en rustige pistes, plus gezinsvriendelijke zomerbelevingen in Romsdalen.',
  },
  vinter: {
    slug: 'vinter', language: 'nl',
    title: 'Winter op Bjorli',
    intro: 'Sneeuwzekere winterbestemming tussen Dombås en Åndalsnes – alpine, langlaufen, hutleven en gezinsvakantie.',
    body: 'Bjorli is een van de meest sneeuwzekere winterbestemmingen van Noorwegen. Het seizoen loopt meestal van november tot mei, met stabiele omstandigheden voor zowel alpine als langlaufen. Je vindt er Bjorli Skisenter met afwisselende pistes, een groot langlaufloipenetwerk, gezellige hutten en gezinsvriendelijke activiteiten direct aan de berg.',
    heroImage: { url: heroWinter, alt: 'Winter op Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Alpine', desc: 'Pistes voor elk niveau in Bjorli Skisenter.', icon: 'mountain' },
      { title: 'Langlaufen', desc: 'Sneeuwzekere loipes in open berglandschap.', icon: 'snowflake' },
      { title: 'Gezinsvriendelijk', desc: 'Korte afstanden en een rustige skischool.', icon: 'users' },
      { title: 'Hutleven', desc: 'Hutten en appartementen bij de liften.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Skipassen', href: '/heiskort', variant: 'secondary' },
    ],
    seoTitle: 'Winter op Bjorli – sneeuwzekere wintervakantie in Romsdalen',
    seoDescription: 'Winter op Bjorli – sneeuwzekere pistes, langlaufen en hutleven tussen Dombås en Åndalsnes. Alles voor een wintervakantie in Romsdalen.',
  },
  live: {
    slug: 'live', language: 'nl',
    title: 'Live vanaf Bjorli',
    intro: 'Bekijk webcams, openingstijden, sneeuwdiepte en liftstatus in realtime voordat je naar boven gaat.',
    body: 'Krijg een beeld van de actuele omstandigheden op Bjorli voordat je gaat. De live-pagina bundelt webcams, open liften en loipes, sneeuwdiepte, temperatuur en bedrijfsmeldingen op één plek. Een goed startpunt om je skidag of bergtocht te plannen.',
    heroImage: { url: heroWinter, alt: 'Live status vanaf Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Webcams', desc: 'Live beelden vanaf de berg.', icon: 'camera' },
      { title: 'Openingstijden', desc: 'Wanneer liften en centrum open zijn.', icon: 'clock' },
      { title: 'Sneeuw en weer', desc: 'Sneeuwdiepte en temperatuur in realtime.', icon: 'snowflake' },
      { title: 'Liftstatus', desc: 'Open liften, loipes en meldingen.', icon: 'activity' },
    ],
    ctas: [
      { label: 'Bekijk webcams', href: '/vaer-og-webkamera', variant: 'primary' },
      { label: 'Openingstijden', href: '/apningstider', variant: 'secondary' },
    ],
    seoTitle: 'Live vanaf Bjorli – webcams, sneeuwdiepte en liftstatus',
    seoDescription: 'Live status vanaf Bjorli – webcams, openingstijden, sneeuwdiepte, temperatuur en meldingen op één plek. Plan je skidag in realtime.',
  },
  loypekart: {
    slug: 'loypekart', language: 'nl',
    title: 'Pistekaart voor Bjorli',
    intro: 'Overzicht van alpine pistes en langlaufloipes in en rond Bjorli Skisenter.',
    body: 'De pistekaart toont de alpine pistes in Bjorli Skisenter en het uitgebreide langlaufloipenetwerk dat dal en berg verbindt. Handig voor het plannen van je skidag en om nieuwe rondjes te ontdekken in het seizoen. Download de PDF of open de digitale kaart voor moeilijkheidsgraad en afstand.',
    heroImage: { url: crossCountry, alt: 'Pistekaart voor Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Alpine pistes', desc: 'Moeilijkheidsgraden en liftverbindingen.', icon: 'mountain' },
      { title: 'Langlaufloipes', desc: 'Klassiek en schaatsen op de berg.', icon: 'snowflake' },
      { title: 'Afstanden', desc: 'Korte rondes en lange dagtochten.', icon: 'map' },
      { title: 'Verbonden', desc: 'Bjorli, Bøstølen en de hoge berg.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Langlaufen', href: '/langrenn', variant: 'secondary' },
    ],
    seoTitle: 'Pistekaart Bjorli – alpine pistes en langlaufloipes',
    seoDescription: 'Pistekaart voor Bjorli Skisenter en de langlaufloipes op de berg – moeilijkheidsgraden, afstanden en het volledige loipenetwerk.',
  },
};

const DA: Record<SubPageSlug, CmsSubPage> = {
  heiskort: {
    slug: 'heiskort', language: 'da',
    title: 'Liftkort på Bjorli',
    intro: 'Liftkort til Bjorli Skisenter – dagskort, flerdagskort og sæsonkort til hele familien.',
    body: 'Et liftkort på Bjorli giver dig adgang til snesikre pister mellem Dombås og Åndalsnes. Vi anbefaler at købe liftkortet online inden ankomst – så slipper du for kø i billetlugen og kan gå direkte til liften. Børn under en bestemt alder kører gratis sammen med en betalende voksen, og der findes egne familiepriser i højsæsonen.',
    heroImage: { url: heroWinter, alt: 'Lifte og pister på Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Dagskort', desc: 'Fleksibelt til korte besøg og dagsture.', icon: 'ticket' },
      { title: 'Flerdagskort', desc: 'Bedste pris per dag til weekend og ferie.', icon: 'sparkles' },
      { title: 'Sæsonkort', desc: 'Ubegrænset skiløb hele vintersæsonen.', icon: 'snowflake' },
      { title: 'Familievenligt', desc: 'Egne priser til børn og familier.', icon: 'users' },
    ],
    ctas: [
      { label: 'Køb liftkort', href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862', variant: 'primary', external: true },
      { label: 'Se Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Hvor køber jeg liftkort?', a: 'Liftkort købes nemt online inden ankomst eller i billetlugen i skisportsstedet.' },
      { q: 'Findes der familiepriser?', a: 'Ja, der findes både familiepriser og egne børnepriser i vintersæsonen.' },
      { q: 'Skal alle have eget liftkort?', a: 'Ja, alle der skal bruge lifterne, skal have eget gyldigt liftkort.' },
    ],
    seoTitle: 'Liftkort Bjorli – køb dagskort, flerdagskort og sæsonkort',
    seoDescription: 'Køb liftkort til Bjorli Skisenter online – snesikre pister, familievenlige priser og nem adgang til lifterne. Dagskort, flerdagskort og sæsonkort.',
  },
  langrenn: {
    slug: 'langrenn', language: 'da',
    title: 'Langrend på Bjorli',
    intro: 'Snesikre langrendsspor i varieret fjeldterræn – ideelt til både korte runder og lange ture.',
    body: 'Bjorli er kendt for stabile sneforhold og varierede langrendsspor i åbent fjeldlandskab. Sporene binder dalen og fjeldet sammen, og du kan gå korte runder direkte fra hytten eller længere dagsture på fjeldet. Sporene præpareres regelmæssigt hele sæsonen og passer både til klassisk og skøjte.',
    heroImage: { url: crossCountry, alt: 'Langrendsspor på Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Snesikkert', desc: 'Stabile forhold fra november til maj.', icon: 'snowflake' },
      { title: 'Varieret terræn', desc: 'Fra rolige runder til lange fjeldture.', icon: 'mountain' },
      { title: 'Godt præpareret', desc: 'Spor til både klassisk og skøjte.', icon: 'sparkles' },
      { title: 'Fra hyttedøren', desc: 'Mange spor starter ved hytteområderne.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Se aktiviteter', href: '/aktiviteter', variant: 'primary' },
      { label: 'Find overnatning', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Langrend på Bjorli – snesikre spor i Romsdalen',
    seoDescription: 'Snesikre langrendsspor på Bjorli – varierede runder i fjeldterræn til klassisk og skøjte. Spor direkte fra hytten og lange dagsture på fjeldet.',
  },
  fotturer: {
    slug: 'fotturer', language: 'da',
    title: 'Vandring på Bjorli',
    intro: 'Korte familieture og længere toptore i flot fjeldlandskab mellem Dombås og Åndalsnes.',
    body: 'I sommer og efterår er Bjorli en god base for vandring i Romsdalen. Tre nationalparker – Reinheimen, Dovrefjell-Sunndalsfjella og Romsdalsalpene – ligger lige ved siden af, med stier til alle niveauer. Vælg mellem nemme fjeldrunder, fuglekiggeri i moseområder eller mere krævende toptore med udsigt over Romsdalen.',
    heroImage: { url: hikingImg, alt: 'Vandring i fjeldet omkring Bjorli', ...meta(hikingImg) },
    highlights: [
      { title: 'Tre nationalparker', desc: 'Reinheimen, Dovrefjell og Romsdalsalpene.', icon: 'mountain' },
      { title: 'Familievenligt', desc: 'Korte ture, der passer til børn.', icon: 'users' },
      { title: 'Toptore', desc: 'Længere ture med udsigt over Romsdalen.', icon: 'compass' },
      { title: 'Sommer og efterår', desc: 'Lange dage og farverigt efterårsfjeld.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Se sommer på Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Find overnatning', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Vandring på Bjorli – fjeldtoppe og familieture i Romsdalen',
    seoDescription: 'Vandring på Bjorli – korte familieture og lange toptore mellem Dombås og Åndalsnes, midt mellem tre nationalparker.',
  },
  sykling: {
    slug: 'sykling', language: 'da',
    title: 'Cykling på Bjorli',
    intro: 'Stier og grusveje til mountainbike, gravel og rolige familieture i fjeldet.',
    body: 'Bjorli er en god base for cykling i fjeldet. Et netværk af grusveje og stier dækker både rolige familieture og mere krævende mountainbike-ture. Du kan kombinere cykel og tog via Raumabanen og overnatte i hytter med god plads til både udstyr og våde klæder.',
    heroImage: { url: bikingImg, alt: 'Cykling på Bjorli', ...meta(bikingImg) },
    highlights: [
      { title: 'Grusveje', desc: 'Lange runder til gravel og hybrid.', icon: 'bike' },
      { title: 'Stier', desc: 'Stisykling for dem, der vil udfordre sig selv.', icon: 'mountain' },
      { title: 'Familieture', desc: 'Rolige strækninger, der passer til børn.', icon: 'users' },
      { title: 'Tog og cykel', desc: 'Kombinér med Raumabanen.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Se sommer på Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Rejsen hertil', href: '/reisen-hit', variant: 'secondary' },
    ],
    seoTitle: 'Cykling på Bjorli – mountainbike, gravel og familieruter',
    seoDescription: 'Cykling på Bjorli – grusveje, stier og rolige familieture i fjeldet. God base for mountainbike og gravel i Romsdalen.',
  },
  familie: {
    slug: 'familie', language: 'da',
    title: 'Familieferie på Bjorli',
    intro: 'Snesikre vinterdage og rolige sommerture – Bjorli er lavet til familier med børn.',
    body: 'Korte afstande, rolige pister og familievenlige hytter gør Bjorli til et naturligt valg for familieferie. Om vinteren er der rolige pister, skiskole, kælkning og snehule-bygning. Om sommeren venter korte ture, legepladser og naturoplevelser i tre nationalparker lige ved siden af.',
    heroImage: { url: tipFamily, alt: 'Familie på Bjorli', ...meta(tipFamily) },
    highlights: [
      { title: 'Snesikkert', desc: 'Stabile forhold hele sæsonen.', icon: 'snowflake' },
      { title: 'Korte afstande', desc: 'Fra hytten til liften på minutter.', icon: 'compass' },
      { title: 'Skiskole', desc: 'Tryg indlæring for de mindste.', icon: 'baby' },
      { title: 'Sommer for børn', desc: 'Korte ture og naturoplevelser.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Se overnatning', href: '/overnatting', variant: 'primary' },
      { label: 'Se aktiviteter', href: '/aktiviteter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Er Bjorli egnet til små børn?', a: 'Ja, korte afstande, rolige pister og familievenlige hytter gør Bjorli ideelt for familier med børn.' },
      { q: 'Findes der skiskole?', a: 'Ja, Bjorli Skisenter har skiskole til både begyndere og børn.' },
    ],
    seoTitle: 'Familieferie på Bjorli – snesikker vinter og rolig sommer',
    seoDescription: 'Familieferie på Bjorli – snesikre vinterdage med skiskole og rolige pister, og familievenlige sommeroplevelser i Romsdalen.',
  },
  vinter: {
    slug: 'vinter', language: 'da',
    title: 'Vinter på Bjorli',
    intro: 'Snesikker vinterdestination mellem Dombås og Åndalsnes – alpint, langrend, hytteliv og familieferie.',
    body: 'Bjorli er en af Norges mest snesikre vinterdestinationer. Sæsonen strækker sig typisk fra november til maj, med stabile forhold til både alpint og langrend. Her finder du Bjorli Skisenter med varierede pister, et stort net af langrendsspor, hyggelige hytter og familievenlige aktiviteter lige ved fjeldet.',
    heroImage: { url: heroWinter, alt: 'Vinter på Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Alpint', desc: 'Pister til alle niveauer i Bjorli Skisenter.', icon: 'mountain' },
      { title: 'Langrend', desc: 'Snesikre spor i åbent fjeldlandskab.', icon: 'snowflake' },
      { title: 'Familievenligt', desc: 'Korte afstande og tryg skiskole.', icon: 'users' },
      { title: 'Hytteliv', desc: 'Hytter og lejligheder ved lifterne.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Liftkort', href: '/heiskort', variant: 'secondary' },
    ],
    seoTitle: 'Vinter på Bjorli – snesikker vinterferie i Romsdalen',
    seoDescription: 'Vinter på Bjorli – snesikre pister, langrend og hytteliv mellem Dombås og Åndalsnes. Alt til vinterferien i Romsdalen.',
  },
  live: {
    slug: 'live', language: 'da',
    title: 'Live fra Bjorli',
    intro: 'Tjek webkameraer, åbningstider, snedybde og liftstatus i realtid, før du kører op.',
    body: 'Få en fornemmelse af dagens forhold på Bjorli, før du tager af sted. Live-siden samler webkameraer, åbne lifte og spor, snedybde, temperatur og driftsmeddelelser ét sted. Et godt udgangspunkt for at planlægge skidagen eller turen i fjeldet.',
    heroImage: { url: heroWinter, alt: 'Live status fra Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Webkameraer', desc: 'Live billeder fra fjeldet.', icon: 'camera' },
      { title: 'Åbningstider', desc: 'Når lifte og center er åbne.', icon: 'clock' },
      { title: 'Sne og vejr', desc: 'Snedybde og temperatur i realtid.', icon: 'snowflake' },
      { title: 'Liftstatus', desc: 'Åbne lifte, spor og driftsmeddelelser.', icon: 'activity' },
    ],
    ctas: [
      { label: 'Se webkameraer', href: '/vaer-og-webkamera', variant: 'primary' },
      { label: 'Åbningstider', href: '/apningstider', variant: 'secondary' },
    ],
    seoTitle: 'Live fra Bjorli – webkameraer, snedybde og liftstatus',
    seoDescription: 'Live status fra Bjorli – webkameraer, åbningstider, snedybde, temperatur og driftsmeddelelser samlet ét sted. Planlæg skidagen i realtid.',
  },
  loypekart: {
    slug: 'loypekart', language: 'da',
    title: 'Løjpekort for Bjorli',
    intro: 'Oversigt over alpine pister og langrendsspor i og omkring Bjorli Skisenter.',
    body: 'Løjpekortet viser de alpine pister i Bjorli Skisenter og det omfattende langrendsspornet, der binder dalen og fjeldet sammen. Nyttigt både til planlægning af skidagen og til at finde nye runder gennem sæsonen. Hent PDF eller åbn det digitale kort for detaljer om sværhedsgrad og længde.',
    heroImage: { url: crossCountry, alt: 'Løjpekort for Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Alpine pister', desc: 'Sværhedsgrad og liftforbindelser.', icon: 'mountain' },
      { title: 'Langrendsspor', desc: 'Klassisk og skøjte på fjeldet.', icon: 'snowflake' },
      { title: 'Længder', desc: 'Korte runder og lange dagsture.', icon: 'map' },
      { title: 'Forbundet', desc: 'Bjorli, Bøstølen og fjeldet ovenover.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Langrend', href: '/langrenn', variant: 'secondary' },
    ],
    seoTitle: 'Løjpekort Bjorli – alpine pister og langrendsspor',
    seoDescription: 'Løjpekort for Bjorli Skisenter og langrendssporene i fjeldet – sværhedsgrad, længder og oversigt over hele spornettet.',
  },
};

const SV: Record<SubPageSlug, CmsSubPage> = {
  heiskort: {
    slug: 'heiskort', language: 'sv',
    title: 'Liftkort på Bjorli',
    intro: 'Liftkort till Bjorli Skisenter – dagskort, flerdagarskort och säsongskort för hela familjen.',
    body: 'Ett liftkort på Bjorli ger dig tillgång till snösäkra backar mellan Dombås och Åndalsnes. Vi rekommenderar att köpa liftkortet online innan du kommer – då slipper du köa i biljettluckan och kan gå direkt till liften. Barn under en viss ålder åker gratis tillsammans med en betalande vuxen, och i högsäsong gäller egna familjepriser.',
    heroImage: { url: heroWinter, alt: 'Liftar och backar på Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Dagskort', desc: 'Flexibelt för korta besök och dagsturer.', icon: 'ticket' },
      { title: 'Flerdagarskort', desc: 'Bästa pris per dag för helg och semester.', icon: 'sparkles' },
      { title: 'Säsongskort', desc: 'Obegränsad åkning hela vintersäsongen.', icon: 'snowflake' },
      { title: 'Familjevänligt', desc: 'Egna priser för barn och familjer.', icon: 'users' },
    ],
    ctas: [
      { label: 'Köp liftkort', href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862', variant: 'primary', external: true },
      { label: 'Se Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Var köper jag liftkort?', a: 'Liftkortet köps enkelt online före ankomst eller i biljettluckan på skidanläggningen.' },
      { q: 'Finns det familjepriser?', a: 'Ja, under vintersäsongen finns både familjepriser och egna barnpriser.' },
      { q: 'Behöver alla ett eget liftkort?', a: 'Ja, alla som ska använda liftarna behöver ett eget giltigt liftkort.' },
    ],
    seoTitle: 'Liftkort Bjorli – köp dagskort, flerdagarskort och säsongskort',
    seoDescription: 'Köp liftkort till Bjorli Skisenter online – snösäkra backar, familjepriser och enkel åtkomst till liftarna. Dagskort, flerdagarskort och säsongskort.',
  },
  langrenn: {
    slug: 'langrenn', language: 'sv',
    title: 'Längdskidor på Bjorli',
    intro: 'Snösäkra längdspår i varierad fjällterräng – passar både korta rundor och långa turer.',
    body: 'Bjorli är känt för stabilt snöläge och varierade längdspår i öppet fjällandskap. Spårnätet binder ihop dalen och fjället, och du kan åka korta rundor direkt från stugan eller längre dagsturer uppe på fjället. Spåren prepareras regelbundet hela säsongen och passar både klassisk och skate.',
    heroImage: { url: crossCountry, alt: 'Längdspår på Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Snösäkert', desc: 'Stabila förhållanden från november till maj.', icon: 'snowflake' },
      { title: 'Varierat', desc: 'Från lugna rundor till långa fjällturer.', icon: 'mountain' },
      { title: 'Välpreparerat', desc: 'Spår för både klassisk och skate.', icon: 'sparkles' },
      { title: 'Från stugdörren', desc: 'Många spår startar vid stugområdena.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Se aktiviteter', href: '/aktiviteter', variant: 'primary' },
      { label: 'Hitta boende', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Längdskidor på Bjorli – snösäkra spår i Romsdalen',
    seoDescription: 'Snösäkra längdspår på Bjorli – varierade rundor i fjällterräng för klassisk och skate. Spår direkt från stugan och långa dagsturer på fjället.',
  },
  fotturer: {
    slug: 'fotturer', language: 'sv',
    title: 'Vandring på Bjorli',
    intro: 'Korta familjeturer och längre toppturer i fjällandskapet mellan Dombås och Åndalsnes.',
    body: 'På sommaren och hösten är Bjorli en bra bas för vandring i Romsdalen. Tre nationalparker – Reinheimen, Dovrefjell-Sunndalsfjella och Romsdalsalpene – ligger precis intill, med leder för alla nivåer. Välj mellan enkla fjällrundor, fågelskådning i myrmarker eller tuffare toppturer med utsikt över Romsdalen.',
    heroImage: { url: hikingImg, alt: 'Vandring i fjället runt Bjorli', ...meta(hikingImg) },
    highlights: [
      { title: 'Tre nationalparker', desc: 'Reinheimen, Dovrefjell och Romsdalsalpene.', icon: 'mountain' },
      { title: 'Familjevänligt', desc: 'Korta turer som passar barn.', icon: 'users' },
      { title: 'Toppturer', desc: 'Längre rutter med utsikt över Romsdalen.', icon: 'compass' },
      { title: 'Sommar och höst', desc: 'Långa dagar och färgsprakande höstfjäll.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Sommar på Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Hitta boende', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Vandring på Bjorli – fjälltoppar och familjeturer i Romsdalen',
    seoDescription: 'Vandring på Bjorli – korta familjeturer och långa toppturer mellan Dombås och Åndalsnes, mitt bland tre nationalparker.',
  },
  sykling: {
    slug: 'sykling', language: 'sv',
    title: 'Cykling på Bjorli',
    intro: 'Leder och grusvägar för mountainbike, gravel och lugna familjeturer i fjället.',
    body: 'Bjorli är en bra bas för cykling i fjället. Ett nätverk av grusvägar och leder täcker både lugna familjeturer och tuffare mountainbike. Du kan kombinera cykel och tåg via Raumabanen och bo i stugor med gott om plats för utrustning och blöta kläder.',
    heroImage: { url: bikingImg, alt: 'Cykling på Bjorli', ...meta(bikingImg) },
    highlights: [
      { title: 'Grusvägar', desc: 'Långa rundor för gravel och hybrid.', icon: 'bike' },
      { title: 'Leder', desc: 'Singletrack för den som vill utmana sig.', icon: 'mountain' },
      { title: 'Familjerutter', desc: 'Lugna sträckor som passar barn.', icon: 'users' },
      { title: 'Tåg och cykel', desc: 'Kombinera med Raumabanen.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Sommar på Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Resa hit', href: '/reisen-hit', variant: 'secondary' },
    ],
    seoTitle: 'Cykling på Bjorli – mountainbike, gravel och familjerutter',
    seoDescription: 'Cykling på Bjorli – grusvägar, leder och lugna familjeturer i fjället. Bra bas för mountainbike och gravel i Romsdalen.',
  },
  familie: {
    slug: 'familie', language: 'sv',
    title: 'Familjesemester på Bjorli',
    intro: 'Snösäkra vinterdagar och lugna sommarturer – Bjorli passar familjer med barn.',
    body: 'Korta avstånd, lugna backar och familjevänliga stugor gör Bjorli till ett naturligt val för familjesemester. På vintern finns lugna backar, skidskola, pulkåkning och snögrott-byggande. På sommaren väntar korta turer, lekplatser och naturupplevelser i tre nationalparker alldeles intill.',
    heroImage: { url: tipFamily, alt: 'Familj på Bjorli', ...meta(tipFamily) },
    highlights: [
      { title: 'Snösäkert', desc: 'Stabila förhållanden hela säsongen.', icon: 'snowflake' },
      { title: 'Korta avstånd', desc: 'Från stuga till lift på några minuter.', icon: 'compass' },
      { title: 'Skidskola', desc: 'Lugn inlärning för de minsta.', icon: 'baby' },
      { title: 'Sommar för barn', desc: 'Korta turer och naturupplevelser.', icon: 'sun' },
    ],
    ctas: [
      { label: 'Se boende', href: '/overnatting', variant: 'primary' },
      { label: 'Se aktiviteter', href: '/aktiviteter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Passar Bjorli små barn?', a: 'Ja, korta avstånd, lugna backar och familjevänliga stugor gör Bjorli idealiskt för barnfamiljer.' },
      { q: 'Finns det skidskola?', a: 'Ja, Bjorli Skisenter har skidskola för både nybörjare och barn.' },
    ],
    seoTitle: 'Familjesemester på Bjorli – snösäker vinter och lugn sommar',
    seoDescription: 'Familjesemester på Bjorli – snösäkra vinterdagar med skidskola och lugna backar, och familjevänliga sommarupplevelser i Romsdalen.',
  },
  vinter: {
    slug: 'vinter', language: 'sv',
    title: 'Vinter på Bjorli',
    intro: 'Snösäker vinterdestination mellan Dombås och Åndalsnes – alpint, längdskidor, stugliv och familjesemester.',
    body: 'Bjorli är en av Norges mest snösäkra vinterdestinationer. Säsongen sträcker sig vanligen från november till maj, med stabila förhållanden för både alpint och längd. Här finns Bjorli Skisenter med varierade backar, ett stort nät av längdspår, mysiga stugor och familjevänliga aktiviteter precis vid fjället.',
    heroImage: { url: heroWinter, alt: 'Vinter på Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Alpint', desc: 'Backar för alla nivåer på Bjorli Skisenter.', icon: 'mountain' },
      { title: 'Längdskidor', desc: 'Snösäkra spår i öppet fjällandskap.', icon: 'snowflake' },
      { title: 'Familjevänligt', desc: 'Korta avstånd och trygg skidskola.', icon: 'users' },
      { title: 'Stugliv', desc: 'Stugor och lägenheter vid liftarna.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Liftkort', href: '/heiskort', variant: 'secondary' },
    ],
    seoTitle: 'Vinter på Bjorli – snösäker vintersemester i Romsdalen',
    seoDescription: 'Vinter på Bjorli – snösäkra backar, längdskidor och stugliv mellan Dombås och Åndalsnes. Allt för vintersemestern i Romsdalen.',
  },
  live: {
    slug: 'live', language: 'sv',
    title: 'Live från Bjorli',
    intro: 'Kolla webbkameror, öppettider, snödjup och liftstatus i realtid innan du åker upp.',
    body: 'Få en känsla för dagens förhållanden på Bjorli innan du åker. Live-sidan samlar webbkameror, öppna liftar och spår, snödjup, temperatur och driftmeddelanden på ett ställe. En bra utgångspunkt för att planera skiddagen eller turen i fjället.',
    heroImage: { url: heroWinter, alt: 'Live-status från Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Webbkameror', desc: 'Live-bilder från fjället.', icon: 'camera' },
      { title: 'Öppettider', desc: 'När liftar och centret är öppna.', icon: 'clock' },
      { title: 'Snö och väder', desc: 'Snödjup och temperatur i realtid.', icon: 'snowflake' },
      { title: 'Liftstatus', desc: 'Öppna liftar, spår och driftmeddelanden.', icon: 'activity' },
    ],
    ctas: [
      { label: 'Se webbkameror', href: '/vaer-og-webkamera', variant: 'primary' },
      { label: 'Öppettider', href: '/apningstider', variant: 'secondary' },
    ],
    seoTitle: 'Live från Bjorli – webbkameror, snödjup och liftstatus',
    seoDescription: 'Live-status från Bjorli – webbkameror, öppettider, snödjup, temperatur och driftmeddelanden samlade på ett ställe. Planera skiddagen i realtid.',
  },
  loypekart: {
    slug: 'loypekart', language: 'sv',
    title: 'Spårkarta för Bjorli',
    intro: 'Översikt över alpina backar och längdspår i och kring Bjorli Skisenter.',
    body: 'Spårkartan visar de alpina backarna i Bjorli Skisenter och det omfattande längdspårsnätet som binder ihop dalen och fjället. Användbar både för att planera skiddagen och för att hitta nya rundor under säsongen. Ladda ner PDF eller öppna den digitala kartan för svårighetsgrad och längd.',
    heroImage: { url: crossCountry, alt: 'Spårkarta för Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Alpina backar', desc: 'Svårighetsgrader och liftkopplingar.', icon: 'mountain' },
      { title: 'Längdspår', desc: 'Klassisk och skate på fjället.', icon: 'snowflake' },
      { title: 'Längder', desc: 'Korta rundor och långa dagsturer.', icon: 'map' },
      { title: 'Sammankopplat', desc: 'Bjorli, Bøstølen och fjället ovanför.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Längdskidor', href: '/langrenn', variant: 'secondary' },
    ],
    seoTitle: 'Spårkarta Bjorli – alpina backar och längdspår',
    seoDescription: 'Spårkarta för Bjorli Skisenter och längdspåren på fjället – svårighetsgrader, längder och hela spårnätet.',
  },
};

const SUBPAGES: Record<Language, Record<SubPageSlug, CmsSubPage>> = {
  no: NO,
  en: EN,
  de: DE,
  nl: NL,
  da: DA,
  sv: SV,
};

export const SUBPAGE_SLUGS: SubPageSlug[] = [
  'heiskort', 'langrenn', 'fotturer', 'sykling', 'familie',
  'vinter', 'live', 'loypekart',
];

export const isSubPageSlug = (s: string): s is SubPageSlug =>
  (SUBPAGE_SLUGS as string[]).includes(s);

export const getSubPage = async (
  language: Language,
  slug: SubPageSlug,
): Promise<CmsSubPage | null> => {
  const localeMap = SUBPAGES[language] ?? NO;
  return localeMap[slug] ?? null;
};
