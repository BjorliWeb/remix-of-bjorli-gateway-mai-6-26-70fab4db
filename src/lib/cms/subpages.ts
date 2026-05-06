/**
 * Sub-page content for footer secondary routes
 * (/heiskort, /langrenn, /fotturer, /sykling, /familie).
 *
 * Lives in the CMS layer so swapping to Sanity/Strapi/DatoCMS/Storyblok later
 * only changes this file's source, never the page components.
 */
import type { CmsImage, Language } from './types';

/**
 * Image strategy: keep the real winter hero, route every other asset through
 * the central image registry so we can later swap placeholders for real
 * Bjorli photography (or WordPress media URLs) in one place.
 */
import { images } from '@/lib/images';
const heroWinter   = images.heroWinter.src;
const crossCountry = images.crossCountry.src;
const hikingImg    = images.hiking.src;
const bikingImg    = images.biking.src;
const tipFamily    = images.familySummer.src;

/** Resolve the registry entry that owns a given source URL so subpages
 *  inherit alt/caption/credit/wpField metadata without duplication. */
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
    slug: 'heiskort',
    language: 'no',
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
    slug: 'langrenn',
    language: 'no',
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
    slug: 'fotturer',
    language: 'no',
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
    slug: 'sykling',
    language: 'no',
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
    slug: 'familie',
    language: 'no',
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
    slug: 'vinter',
    language: 'no',
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
    slug: 'live',
    language: 'no',
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
    slug: 'loypekart',
    language: 'no',
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
    slug: 'heiskort',
    language: 'en',
    title: 'Lift passes at Bjorli',
    intro: 'Buy lift passes for Bjorli Ski Resort – day passes, multi-day passes and season passes for the whole family.',
    body: 'A lift pass at Bjorli gives you access to snow-sure slopes between Dombas and Andalsnes in Norway. We recommend buying your pass online before you arrive – skip the ticket queue and head straight for the lifts. Children below a certain age ski for free with a paying adult, and dedicated family rates apply in high season.',
    heroImage: { url: heroWinter, alt: 'Lifts and slopes at Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Day pass', desc: 'Flexible for short visits and day trips.', icon: 'ticket' },
      { title: 'Multi-day pass', desc: 'Best value for weekends and holidays.', icon: 'sparkles' },
      { title: 'Season pass', desc: 'Unlimited skiing throughout the winter.', icon: 'snowflake' },
      { title: 'Family friendly', desc: 'Dedicated rates for kids and families.', icon: 'users' },
    ],
    ctas: [
      { label: 'Buy lift pass', href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862', variant: 'primary', external: true },
      { label: 'See Bjorli Ski Resort', href: '/bjorli-skisenter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Where do I buy lift passes?', a: 'Buy your pass online before arrival or at the ticket office at the resort.' },
      { q: 'Are there family rates?', a: 'Yes, dedicated family and child rates apply during winter season.' },
      { q: 'Does each person need their own pass?', a: 'Yes, every skier needs a valid personal lift pass.' },
    ],
    seoTitle: 'Bjorli Lift Pass – Day, Multi-Day & Season Passes',
    seoDescription: 'Buy lift passes for Bjorli Ski Resort online – snow-sure slopes, family rates and easy access to the lifts. Day, multi-day and season passes.',
  },
  langrenn: {
    slug: 'langrenn',
    language: 'en',
    title: 'Cross-country skiing at Bjorli',
    intro: 'Snow-sure cross-country trails in varied mountain terrain – ideal for both fitness laps and long tours.',
    body: 'Bjorli is known for stable snow conditions and varied cross-country trails in open mountain landscape. The trail network connects the valley with the high mountain, and you can do short laps right from your cabin or longer day tours up on the plateau. Trails are groomed regularly all season for both classic and skating.',
    heroImage: { url: crossCountry, alt: 'Cross-country trails at Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Snow-sure', desc: 'Reliable conditions from November to May.', icon: 'snowflake' },
      { title: 'Varied terrain', desc: 'From easy loops to long mountain tours.', icon: 'mountain' },
      { title: 'Well groomed', desc: 'Tracks for both classic and skating.', icon: 'sparkles' },
      { title: 'From the cabin door', desc: 'Many trails start right at the cabins.', icon: 'compass' },
    ],
    ctas: [
      { label: 'See activities', href: '/aktiviteter', variant: 'primary' },
      { label: 'Find a place to stay', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Cross-country skiing at Bjorli – snow-sure trails in Norway',
    seoDescription: 'Snow-sure cross-country trails at Bjorli, Norway – varied loops in mountain terrain for classic and skating, from short laps to long day tours.',
  },
  fotturer: {
    slug: 'fotturer',
    language: 'en',
    title: 'Hiking at Bjorli',
    intro: 'Short family walks and long summit hikes in stunning mountain landscape between Dombas and Andalsnes.',
    body: 'In summer and autumn, Bjorli is a perfect base for hiking in Romsdalen, Norway. Three national parks – Reinheimen, Dovrefjell-Sunndalsfjella and Romsdalsalpene – are right next door, with trails for every level. Choose easy mountain loops, birdwatching across wetlands, or more challenging summits with views over Romsdalen.',
    heroImage: { url: hikingImg, alt: 'Hiking around Bjorli', ...meta(hikingImg) },
    highlights: [
      { title: 'Three national parks', desc: 'Reinheimen, Dovrefjell and Romsdalsalpene.', icon: 'mountain' },
      { title: 'Family friendly', desc: 'Short walks suitable for kids.', icon: 'users' },
      { title: 'Summit hikes', desc: 'Longer routes with views over Romsdalen.', icon: 'compass' },
      { title: 'Summer and autumn', desc: 'Long days and colourful autumn fells.', icon: 'sun' },
    ],
    ctas: [
      { label: 'See summer at Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Find a place to stay', href: '/overnatting', variant: 'secondary' },
    ],
    seoTitle: 'Hiking at Bjorli – Mountain Trails & Family Walks in Norway',
    seoDescription: 'Hiking at Bjorli – short family walks and long summit trails between Dombas and Andalsnes, surrounded by three Norwegian national parks.',
  },
  sykling: {
    slug: 'sykling',
    language: 'en',
    title: 'Cycling at Bjorli',
    intro: 'Trails and gravel roads for mountain biking, gravel and easy family rides in the mountains.',
    body: 'Bjorli is a great base for cycling in the mountains. A network of gravel roads and trails covers everything from easy family rides to demanding mountain biking. Combine bike and train via the Rauma Line, and stay in cabins with plenty of room for gear and wet kit.',
    heroImage: { url: bikingImg, alt: 'Cycling at Bjorli', ...meta(bikingImg) },
    highlights: [
      { title: 'Gravel roads', desc: 'Long loops for gravel and hybrid bikes.', icon: 'bike' },
      { title: 'Trails', desc: 'Singletrack for those who want a challenge.', icon: 'mountain' },
      { title: 'Family routes', desc: 'Easy stretches suited for kids.', icon: 'users' },
      { title: 'Train and bike', desc: 'Combine with the Rauma Line.', icon: 'compass' },
    ],
    ctas: [
      { label: 'See summer at Bjorli', href: '/sommer', variant: 'primary' },
      { label: 'Getting here', href: '/reisen-hit', variant: 'secondary' },
    ],
    seoTitle: 'Cycling at Bjorli – Mountain Biking, Gravel & Family Routes',
    seoDescription: 'Cycling at Bjorli – gravel roads, mountain trails and easy family routes in the mountains. A perfect base for MTB and gravel in Romsdalen, Norway.',
  },
  familie: {
    slug: 'familie',
    language: 'en',
    title: 'Family holiday at Bjorli',
    intro: 'Snow-sure winter days and easy summer trips – Bjorli is made for families with children.',
    body: 'Short distances, gentle slopes and family-friendly cabins make Bjorli a natural choice for a family holiday. In winter you will find easy slopes, ski school, sledding and snow-cave building. In summer there are short walks, playgrounds and nature experiences in three national parks nearby.',
    heroImage: { url: tipFamily, alt: 'A family at Bjorli', ...meta(tipFamily) },
    highlights: [
      { title: 'Snow-sure', desc: 'Stable conditions throughout the season.', icon: 'snowflake' },
      { title: 'Short distances', desc: 'From cabin to lift in minutes.', icon: 'compass' },
      { title: 'Ski school', desc: 'Safe learning for the youngest skiers.', icon: 'baby' },
      { title: 'Summer for kids', desc: 'Short walks and nature experiences.', icon: 'sun' },
    ],
    ctas: [
      { label: 'See accommodation', href: '/overnatting', variant: 'primary' },
      { label: 'See activities', href: '/aktiviteter', variant: 'secondary' },
    ],
    faq: [
      { q: 'Is Bjorli suitable for small children?', a: 'Yes, short distances, gentle slopes and family-friendly cabins make Bjorli ideal for families.' },
      { q: 'Is there a ski school?', a: 'Yes, Bjorli Ski Resort offers ski school for both beginners and children.' },
    ],
    seoTitle: 'Family Holiday at Bjorli – Snow-Sure Winter & Easy Summer',
    seoDescription: 'Family holiday at Bjorli – snow-sure winter days with ski school and gentle slopes, and family-friendly summer experiences in Romsdalen, Norway.',
  },
  vinter: {
    slug: 'vinter',
    language: 'en',
    title: 'Winter at Bjorli',
    intro: 'Snow-sure winter destination between Dombas and Andalsnes – alpine, cross-country, cabins and family holidays.',
    body: 'Bjorli is one of Norway’s most snow-sure winter destinations. The season typically runs from November to May, with stable conditions for both alpine and cross-country skiing. You will find Bjorli Ski Resort with varied slopes, an extensive cross-country trail network, cosy cabins and family-friendly activities right by the mountain.',
    heroImage: { url: heroWinter, alt: 'Winter at Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Alpine skiing', desc: 'Slopes for every level at Bjorli Ski Resort.', icon: 'mountain' },
      { title: 'Cross-country', desc: 'Snow-sure trails in open mountain terrain.', icon: 'snowflake' },
      { title: 'Family friendly', desc: 'Short distances and a safe ski school.', icon: 'users' },
      { title: 'Cabin life', desc: 'Cabins and apartments by the lifts.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Ski Resort', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Lift passes', href: '/heiskort', variant: 'secondary' },
    ],
    seoTitle: 'Winter at Bjorli – Snow-Sure Ski Holiday in Norway',
    seoDescription: 'Winter at Bjorli – snow-sure slopes, cross-country trails and cabin life between Dombas and Andalsnes. Everything for a winter holiday in Romsdalen.',
  },
  live: {
    slug: 'live',
    language: 'en',
    title: 'Live from Bjorli',
    intro: 'Check webcams, opening hours, snow depth and operational status in real time before you head up.',
    body: 'Get a feel for current conditions at Bjorli before you go. The live page brings together webcams, open lifts and slopes, snow depth, temperature and operational alerts in one place. A great starting point for planning your ski day or a tour in the mountains.',
    heroImage: { url: heroWinter, alt: 'Live status from Bjorli', ...meta(heroWinter) },
    highlights: [
      { title: 'Webcams', desc: 'Live views from the mountain.', icon: 'camera' },
      { title: 'Opening hours', desc: 'When the lifts and resort are open.', icon: 'clock' },
      { title: 'Snow & weather', desc: 'Snow depth and temperature in real time.', icon: 'snowflake' },
      { title: 'Operational status', desc: 'Open lifts, slopes and alerts.', icon: 'activity' },
    ],
    ctas: [
      { label: 'See webcams', href: '/vaer-og-webkamera', variant: 'primary' },
      { label: 'Opening hours', href: '/apningstider', variant: 'secondary' },
    ],
    seoTitle: 'Live at Bjorli – Webcams, Snow Depth & Operational Status',
    seoDescription: 'Live status from Bjorli – webcams, opening hours, snow depth, temperature and operational alerts in one place. Plan your ski day in real time.',
  },
  loypekart: {
    slug: 'loypekart',
    language: 'en',
    title: 'Trail map for Bjorli',
    intro: 'Overview of alpine slopes and cross-country trails in and around Bjorli Ski Resort.',
    body: 'The trail map shows the alpine slopes at Bjorli Ski Resort and the extensive cross-country trail network connecting the valley with the mountain plateau. Useful both for planning your ski day and for discovering new loops throughout the season. Download a PDF or open the digital map for details on difficulty and distance.',
    heroImage: { url: crossCountry, alt: 'Trail map for Bjorli', ...meta(crossCountry) },
    highlights: [
      { title: 'Alpine slopes', desc: 'Difficulty levels and lift connections.', icon: 'mountain' },
      { title: 'Cross-country trails', desc: 'Classic and skating across the mountain.', icon: 'snowflake' },
      { title: 'Distances', desc: 'Short loops and long day tours.', icon: 'map' },
      { title: 'Connected', desc: 'Bjorli, Bostolen and the high mountain.', icon: 'compass' },
    ],
    ctas: [
      { label: 'Bjorli Ski Resort', href: '/bjorli-skisenter', variant: 'primary' },
      { label: 'Cross-country', href: '/langrenn', variant: 'secondary' },
    ],
    seoTitle: 'Bjorli Trail Map – Alpine Slopes & Cross-Country Trails',
    seoDescription: 'Trail map for Bjorli Ski Resort and the cross-country trails in the mountains – difficulty levels, distances and the full trail network.',
  },
};

const SUBPAGES: Record<Language, Record<SubPageSlug, CmsSubPage>> = {
  no: NO,
  en: EN,
  de: EN,
  nl: EN,
  da: EN,
  sv: EN,
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
