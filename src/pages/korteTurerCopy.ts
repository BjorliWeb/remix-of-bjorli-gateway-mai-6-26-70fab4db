/**
 * Locale-keyed copy for the "Korte turer rundt Bjorli" page.
 *
 * Proper names that are NEVER translated:
 *   Bjorli, Bjorli Skisenter, Raumabanen, Trollstigen, Trollveggen,
 *   Romsdalshorn(et), Vengetindene, Reinheimen, Dovrefjell-Sunndalsfjella,
 *   Romsdalsalpene, Romsdalen, Lesja, Lesjaverk, Lesjaskog, Lesjaskogsvatnet,
 *   Lora, Rauma, Rånå, Verma, Åndalsnes, Venjesdalen, Norsk Tindesenter,
 *   Nordveggen, Tussheim(bue), Sveavarden, Rånåkollen, Kyllingbrua,
 *   EvenTURskogen, Trollstigfoten, Litlefjellet, E136, Istra.
 *
 * Walk ids and tag ids are stable identifiers used by the page logic
 * (icon mapping, "mix" lists, anchor links). Labels are localized.
 */
import type { Locale } from '@/i18n/locales/types';

export type WalkId =
  | 'tussheimbue' | 'sveavarden' | 'lesjaverk'
  | 'kulturminner-lesjaskog' | 'ranakollen' | 'kyllingbrua'
  | 'eventurskogen' | 'trollstigfoten' | 'trollstigen-utkikkspunkt'
  | 'litlefjellet';

export type TagId =
  | 'view' | 'dayCabin' | 'trainFriendly' | 'train' | 'photoSpot'
  | 'culture' | 'familyFriendly' | 'kids' | 'easyWalk' | 'shortWalk'
  | 'swimming' | 'activity' | 'steep' | 'mountainHike' | 'loop'
  | 'forest' | 'river' | 'partlyAccessible';

export interface WalkCopy {
  id: WalkId;
  name: string;
  area: string;
  distance: string;
  elevation?: string;
  teaser: string;
  description: string;
  parking: string;
  tags: TagId[];
  mapAlt: string;
  photoAlt?: string;
}

export interface MixCard {
  title: string;
  iconKey: 'family' | 'view' | 'roadside' | 'train';
  walks: WalkId[];
}

export interface KorteTurerCopy {
  // SEO
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  // Hero
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroAlt: string;
  ctaSeeWalks: string;
  ctaPlanTrip: string;
  // Breadcrumbs
  crumbSommer: string;
  crumbHere: string;
  // Intro
  introP1: string;
  introP2: string;
  introP3: string;
  brochureOriginal: string;
  brochureDownload: string;
  // Overview
  overviewEyebrow: string;
  overviewTitle: string;
  readMore: string;
  // Detail labels
  roundTripPrefix: string;
  elevationPrefix: string;
  startParking: string;
  mapCaption: string;
  // Mix section
  mixEyebrow: string;
  mixTitle: string;
  mixCards: MixCard[];
  // Base section
  baseEyebrow: string;
  baseTitle: string;
  baseP1: string;
  baseP2: string;
  baseLinkAccommodation: string;
  baseLinkFood: string;
  baseLinkSummer: string;
  baseLinkTravel: string;
  // Tips
  tipsTitle: string;
  tips: string[];
  // FAQ
  faqTitle: string;
  faq: { q: string; a: string }[];
  // Final CTA
  finalTitle: string;
  finalBody: string;
  finalAccommodation: string;
  finalSummer: string;
  finalTravel: string;
  // Credit
  creditEyebrow: string;
  creditP1: string;
  creditPublisher: string;
  // Tag labels
  tagLabels: Record<TagId, string>;
  // Walks
  walks: WalkCopy[];
}

const tagsNo: Record<TagId, string> = {
  view: 'utsikt', dayCabin: 'dagsturhytte', trainFriendly: 'togvennlig', train: 'tog',
  photoSpot: 'fotopunkt', culture: 'kultur', familyFriendly: 'familievennlig', kids: 'barn',
  easyWalk: 'lett tur', shortWalk: 'kort tur', swimming: 'badeplass', activity: 'aktivitet',
  steep: 'bratt', mountainHike: 'fjelltur', loop: 'rundtur', forest: 'skogstur',
  river: 'elv', partlyAccessible: 'delvis tilrettelagt',
};
const tagsEn: Record<TagId, string> = {
  view: 'view', dayCabin: 'day cabin', trainFriendly: 'train friendly', train: 'train',
  photoSpot: 'photo spot', culture: 'culture', familyFriendly: 'family friendly', kids: 'kids',
  easyWalk: 'easy walk', shortWalk: 'short walk', swimming: 'swimming spot', activity: 'activity',
  steep: 'steep', mountainHike: 'mountain hike', loop: 'loop', forest: 'forest walk',
  river: 'river', partlyAccessible: 'partly accessible',
};
const tagsDe: Record<TagId, string> = {
  view: 'Aussicht', dayCabin: 'Tageshütte', trainFriendly: 'mit Zug erreichbar', train: 'Zug',
  photoSpot: 'Fotopunkt', culture: 'Kultur', familyFriendly: 'familienfreundlich', kids: 'Kinder',
  easyWalk: 'leichte Tour', shortWalk: 'kurze Tour', swimming: 'Badeplatz', activity: 'Aktivität',
  steep: 'steil', mountainHike: 'Bergtour', loop: 'Rundtour', forest: 'Waldspaziergang',
  river: 'Fluss', partlyAccessible: 'teilweise barrierearm',
};
const tagsNl: Record<TagId, string> = {
  view: 'uitzicht', dayCabin: 'daghut', trainFriendly: 'goed per trein', train: 'trein',
  photoSpot: 'fotopunt', culture: 'cultuur', familyFriendly: 'gezinsvriendelijk', kids: 'kinderen',
  easyWalk: 'makkelijke wandeling', shortWalk: 'korte wandeling', swimming: 'zwemplek', activity: 'activiteit',
  steep: 'steil', mountainHike: 'bergwandeling', loop: 'rondwandeling', forest: 'boswandeling',
  river: 'rivier', partlyAccessible: 'deels toegankelijk',
};
const tagsDa: Record<TagId, string> = {
  view: 'udsigt', dayCabin: 'daghytte', trainFriendly: 'togvenlig', train: 'tog',
  photoSpot: 'fotopunkt', culture: 'kultur', familyFriendly: 'familievenlig', kids: 'børn',
  easyWalk: 'let tur', shortWalk: 'kort tur', swimming: 'badeplads', activity: 'aktivitet',
  steep: 'stejl', mountainHike: 'fjeldtur', loop: 'rundtur', forest: 'skovtur',
  river: 'flod', partlyAccessible: 'delvist tilgængelig',
};
const tagsSv: Record<TagId, string> = {
  view: 'utsikt', dayCabin: 'dagsstuga', trainFriendly: 'tågvänligt', train: 'tåg',
  photoSpot: 'fotopunkt', culture: 'kultur', familyFriendly: 'familjevänligt', kids: 'barn',
  easyWalk: 'lätt tur', shortWalk: 'kort tur', swimming: 'badplats', activity: 'aktivitet',
  steep: 'brant', mountainHike: 'fjälltur', loop: 'rundtur', forest: 'skogstur',
  river: 'älv', partlyAccessible: 'delvis tillgänglig',
};

const NO: KorteTurerCopy = {
  seoTitle: 'Korte turer rundt Bjorli | Enkle fotturer i Lesja og Rauma',
  seoDescription: 'Finn korte turer rundt Bjorli, Lesja og Romsdalen. Utsiktspunkt, kulturminner, familievennlige turer og kart for enkle naturopplevelser nær E136 og Raumabanen.',
  ogTitle: 'Korte turer rundt Bjorli',
  heroEyebrow: 'Sommer på Bjorli · Snartur',
  heroTitle: 'Korte turer rundt Bjorli',
  heroSubtitle: 'Fra Bjorli har du kort vei til utsiktspunkt, kulturminner, skogsstier, elver og små fjellturer i Lesja og Rauma.',
  heroAlt: 'Dagsturhytta på Tussheim med utsikt over Lesja en sommerdag — typisk snartur i fjellbygdene rundt Bjorli.',
  ctaSeeWalks: 'Se turene',
  ctaPlanTrip: 'Planlegg reisen hit',
  crumbSommer: 'Sommer',
  crumbHere: 'Korte turer rundt Bjorli',
  introP1: 'Bjorli ligger midt mellom Lesja, Romsdalen og fjellområdene i Reinheimen. Herfra kan du velge korte turer med stor variasjon — utsiktspunkt, kulturminner, dagsturhytter, elver, skog og familievennlige stopp langs veien.',
  introP2: 'Turene under er hentet fra brosjyren «Snarturer i Rauma og Lesja», og er alle lett tilgjengelige fra E136. Flere kan kombineres med en togreise på Raumabanen, og noen ligger så nær veien at de fungerer som en kort pause på vei mot fjorden.',
  introP3: 'Lengden er oppgitt tur-retur. Noen turer er svært enkle og passer for hele familien. Andre er korte, men bratte, og krever litt mer av beina. Sjekk gjerne vær og lokale anbefalinger før du går.',
  brochureOriginal: 'Original brosjyre',
  brochureDownload: 'Last ned originalbrosjyren',
  overviewEyebrow: '10 snartur',
  overviewTitle: 'Velg en tur',
  readMore: 'Les mer',
  roundTripPrefix: 'Tur-retur',
  elevationPrefix: 'Stigning',
  startParking: 'Start og parkering',
  mapCaption: 'Kartutsnitt fra brosjyren «Snarturer i Rauma og Lesja» (Nordveggen)',
  mixEyebrow: 'Plukk og miks',
  mixTitle: 'Velg tur etter dagsform',
  mixCards: [
    { title: 'For familier',                iconKey: 'family',   walks: ['lesjaverk', 'kulturminner-lesjaskog', 'eventurskogen'] },
    { title: 'For utsikt',                  iconKey: 'view',     walks: ['tussheimbue', 'sveavarden', 'ranakollen', 'litlefjellet'] },
    { title: 'For korte stopp langs veien', iconKey: 'roadside', walks: ['kyllingbrua', 'trollstigen-utkikkspunkt'] },
    { title: 'For tog og kultur',           iconKey: 'train',    walks: ['lesjaverk', 'kyllingbrua', 'tussheimbue', 'sveavarden'] },
  ],
  baseEyebrow: 'Basecamp',
  baseTitle: 'Bjorli som base',
  baseP1: 'Bo på Bjorli og bruk dagene på små turer i nærområdet. Du kan ta en enkel kveldstur, stoppe ved et fotopunkt langs E136, kombinere turen med Raumabanen, eller bruke Bjorli som rolig base mellom fjell, dal og fjord.',
  baseP2: 'I nærområdet har du Lesjaskogsvatnet, Reinheimen og Dovrefjell-Sunndalsfjella nasjonalparker, og turer ned mot Romsdalen og Trollstigen. Et naturlig utgangspunkt for korte snartur og lengre dagsturer.',
  baseLinkAccommodation: 'Overnatting på Bjorli',
  baseLinkFood: 'Mat og drikke',
  baseLinkSummer: 'Sommeraktiviteter',
  baseLinkTravel: 'Reisen hit',
  tipsTitle: 'Husk på tur',
  tips: [
    'Ta med søppel hjem — også dopapir og våtservietter.',
    'Vis hensyn til ville dyr og beitedyr.',
    'Hold hunden i bånd der det er båndtvang.',
    'Bruk toalett der det finnes. Ellers: grav et hull på ca. 15 cm og dekk til etterpå.',
    'Sjekk vær, føre og lokale anbefalinger før turen.',
  ],
  faqTitle: 'Spørsmål og svar',
  faq: [
    { q: 'Hvilke korte turer rundt Bjorli passer for barn?', a: 'Lesjaverk er en lett tur ned til Lesjaskogsvatnet med badeplass. Kulturminner ved Lesjaskog er en kort kulturvandring som passer hele familien. EvenTURskogen i Åndalsnes er bygget rundt en skattejakt for barn, med kart, nøkkel og oppgaver underveis.' },
    { q: 'Hvilke turer har best utsikt?', a: 'Tussheimbue gir vidt utsyn over kulturlandskapet i Lesja og Reinheimen. Sveavarden ligger like over skoggrensa med utsikt vestover mot Lesjaskogsvatnet. Rånåkollen er kort og bratt, men gir godt utsyn over dalen. Litlefjellet i Venjesdalen åpner seg mot Trollveggen, Vengetindene og Romsdalshornet.' },
    { q: 'Kan noen av turene kombineres med Raumabanen?', a: 'Ja. Tussheimbue, Sveavarden og Lesjaverk starter i nærheten av togstopp i Lesja, og Kyllingbrua tar deg ned til et fotopunkt under selve jernbanebrua på Verma — et av de mest kjente landemerkene langs Raumabanen.' },
    { q: 'Hvilke turer passer som korte stopp langs E136?', a: 'Kyllingbrua (0,6 km) og Trollstigen utkikkspunkt (1,2 km) er de korteste og enkleste å stoppe ved. Kulturminner ved Lesjaskog (1 km) og Lesjaverk (1,5 km) ligger også rett ved hovedveien og passer godt som en pause underveis.' },
  ],
  finalTitle: 'Bo på Bjorli og oppdag korte turer i fjellbygdene rundt',
  finalBody: 'Velg Bjorli som base, og fyll dagene med enkle turer, utsiktspunkt, kulturminner og små eventyr mellom fjell og fjord.',
  finalAccommodation: 'Se overnatting',
  finalSummer: 'Se sommeraktiviteter',
  finalTravel: 'Reisen hit',
  creditEyebrow: 'Kilde og kreditering',
  creditP1: 'Turinspirasjon, kartutsnitt og bildemateriale er hentet fra brosjyren «Snarturer i Rauma og Lesja».',
  creditPublisher: 'Utgiver',
  tagLabels: tagsNo,
  walks: [
    { id: 'tussheimbue', name: 'Tussheimbue', area: 'Lesja', distance: '6,6 km', elevation: '450 hm',
      teaser: 'Dagsturhytte med vidstrakt utsikt over kulturlandskapet i Lesja og Reinheimen nasjonalpark.',
      description: 'En stilfull dagsturhytte venter på toppen, med utsyn over dalen og fjellene i Reinheimen. Stien er godt tilrettelagt og merket hele veien opp. Underveis finner du infotavler om landskap og kulturhistorie, og ved hytta står benker og kikkert klare for en lang pause.',
      parking: 'Start i Lesja sentrum. Følg tilrettelagt sti gjennom jernbaneundergangen.',
      tags: ['view', 'dayCabin', 'trainFriendly'],
      mapAlt: 'Brosjyrekart for Tussheimbue: rute fra Lesja sentrum opp til dagsturhytta, med parkering og merket sti markert.',
      photoAlt: 'Dagsturhytta på Tussheim med utsikt over kulturlandskapet i Lesja og fjellene i Reinheimen nasjonalpark.' },
    { id: 'sveavarden', name: 'Sveavarden', area: 'Lora', distance: '7,5 km', elevation: '455 hm',
      teaser: 'Tur gjennom furuskog til en varde over skoggrensen, med utsikt mot Lora og Lesjaskogsvatnet.',
      description: 'Stien tar deg jevnt oppover i fin furuskog før den åpner seg over skoggrensa. Varden står på en åpen rygg med vidt utsyn vestover mot Lesjaskogsvatnet. Godt merket hele veien.',
      parking: 'Parker på Lora stasjon. Følg merket sti gjennom jernbaneundergangen.',
      tags: ['view', 'forest', 'trainFriendly'],
      mapAlt: 'Brosjyrekart for Sveavarden: rute fra Lora stasjon opp gjennom furuskogen til varden, med parkering og merket sti.' },
    { id: 'lesjaverk', name: 'Lesjaverk', area: 'Lesjaverk', distance: '1,5 km',
      teaser: 'Lett tur fra Lesjaverk stasjon mot Lesjaskogsvatnet og kulturstien ved det gamle jernverket.',
      description: 'En enkel tur som passer for alle. Veien tar deg over jernbanen og ned mot Lesjaskogsvatnet, der det er tilrettelagt badeplass. Rundt vannet ligger kulturminner etter det gamle jernverket på Lesjaverk, med mulighet for rundtur på merket sti.',
      parking: 'Start ved Lesjaverk stasjon. Parkering på stasjonen.',
      tags: ['easyWalk', 'culture', 'swimming', 'trainFriendly'],
      mapAlt: 'Brosjyrekart for Lesjaverk: rute fra Lesjaverk stasjon ned til Lesjaskogsvatnet, med parkering og merket sti markert.',
      photoAlt: 'Lesjaskogsvatnet en sommerdag — rolig fjellvann ved det gamle jernverket på Lesjaverk.' },
    { id: 'kulturminner-lesjaskog', name: 'Kulturminner ved Lesjaskog', area: 'Lesjaskog', distance: '1 km',
      teaser: 'Kort kulturvandring ved Lesjaskog kyrkje, med historiske bygg, krigsminner og spor etter tidligere jernverk.',
      description: 'En liten rundtur i bygda, der QR-koder underveis lar deg lese mer om hver post. Et fint stopp for familier som vil ha en kort, rolig pause med litt historie.',
      parking: 'Parker ved Bunnpris Lesjaskog og følg veien bort til kulturminneområdet.',
      tags: ['culture', 'familyFriendly', 'shortWalk'],
      mapAlt: 'Brosjyrekart for kulturminner ved Lesjaskog: rute rundt Lesjaskog kyrkje, med parkering og informasjonspunkter.' },
    { id: 'ranakollen', name: 'Rånåkollen', area: 'Rånå', distance: '4,5 km', elevation: '450 hm',
      teaser: 'Kort, men bratt tur til dagsturhytta på Rånåkollen, med utsyn over dalen og inn i høyfjellet.',
      description: 'En rask tur opp som gir mye igjen for innsatsen. Stien er godt merket og fører til en åpen dagsturhytte på toppen, med fritt utsyn over dalen og videre inn mot fjellene. Stien går tett ved gårder — vis hensyn til folk og dyr.',
      parking: 'Merket parkering ved Rånåvegen.',
      tags: ['view', 'dayCabin', 'steep'],
      mapAlt: 'Brosjyrekart for Rånåkollen: rute fra parkering ved Rånåvegen opp til dagsturhytta, med merket sti og utkikkspunkt.' },
    { id: 'kyllingbrua', name: 'Kyllingbrua', area: 'Verma', distance: '0,6 km',
      teaser: 'Kort tur til fotopunkt under Kyllingbrua, et av de mest kjente landemerkene langs Raumabanen.',
      description: 'En av de korteste turene i heftet, men også en av de mest fotograferte. Stien tar deg ned til Rauma elv, med to flotte fotopunkt og informasjonstavler om brua og Raumabanen.',
      parking: 'Parker ved nærbutikken på Verma. Kryss bilveien og følg grussti ned mot elva.',
      tags: ['shortWalk', 'photoSpot', 'train', 'culture'],
      mapAlt: 'Brosjyrekart for Kyllingbrua: rute fra Verma ned til fotopunkt under brua, med parkering og merket sti.',
      photoAlt: 'Tog krysser Kyllingbrua — den kjente steinbuen langs Raumabanen, sett fra fotopunktet under brua.' },
    { id: 'eventurskogen', name: 'EvenTURskogen', area: 'Åndalsnes', distance: '3,6 km', elevation: '450 hm',
      teaser: 'Familievennlig skattejakt fra Norsk Tindesenter, med kart, nøkkel og oppgaver for barna.',
      description: 'En tur lagd for de yngste. Du starter med billett og film på Norsk Tindesenter og får kart og nøkkel til å låse opp kister i skogen. Alle som løser oppgavene får medalje på slutten.',
      parking: 'Start ved Norsk Tindesenter i Åndalsnes. Billett må løses ved start.',
      tags: ['familyFriendly', 'kids', 'activity'],
      mapAlt: 'Brosjyrekart for EvenTURskogen: rute fra Åndalsnes mot Isfjorden, med parkering, fotopunkt og merket sti.',
      photoAlt: 'Barn studerer en infotavle i EvenTURskogen — skattejakt for familier ved Norsk Tindesenter i Åndalsnes.' },
    { id: 'trollstigfoten', name: 'Trollstigfoten', area: 'Trollstigen', distance: '2,1 km',
      teaser: 'Rundtur langs elva Istra gjennom frodig landskap under de mektige fjellene ved foten av Trollstigen.',
      description: 'En behagelig rundtur som følger Istra på begge sider. Stien krysser elva på bru ved bunnen av Trollstigveien og tar deg tilbake langs den historiske Kløvstien. Frodig vegetasjon, brusende elv og fjellene som reiser seg på alle kanter.',
      parking: 'Start på parkeringen ved Trollstigfoten. Følg skilt ned mot elva Istra.',
      tags: ['river', 'photoSpot', 'loop'],
      mapAlt: 'Brosjyrekart for Trollstigfoten: rundtur langs elva Istra under Trollstigen, med parkering og merket sti.',
      photoAlt: 'Foss som faller ned fjellsiden ved Trollstigfoten — frodig sommernatur ved foten av Trollstigen.' },
    { id: 'trollstigen-utkikkspunkt', name: 'Trollstigen utkikkspunkt', area: 'Trollstigen', distance: '1,2 km',
      teaser: 'Enkel tur fra Trollstigen kafé til arkitektoniske utsiktspunkt over den berømte Trollstigen-veien.',
      description: 'En kort gangvei som tar deg ut til flere arkitektoniske utsiktspunkt. Den største plattformen stikker ut over fjellkanten og svever over svingene i Trollstigen. Delvis tilrettelagt for rullestol.',
      parking: 'Start ved Trollstigen kafé på toppen av Trollstigen.',
      tags: ['view', 'shortWalk', 'partlyAccessible'],
      mapAlt: 'Brosjyrekart for Trollstigen utkikkspunkt: gangvei fra Trollstigen kafé ut til utsiktsplattformene, med parkering og utkikkspunkt.',
      photoAlt: 'Person fotograferer fra Trollstigen utkikkspunkt — utsyn ned over svingene i Trollstigveien.' },
    { id: 'litlefjellet', name: 'Litlefjellet', area: 'Venjesdalen', distance: '1,6 km', elevation: '145 hm',
      teaser: 'Kort fjelltur med utsikt mot Trollveggen, Vengetindene, Romsdalshorn og Romsdalen.',
      description: 'En liten favoritt for både små og store. Stien er lett å følge oppover fjellsiden, og på toppen åpner landskapet seg mot Trollveggen, Vengetindene og Romsdalshornet. Litt kupert terreng, men kort.',
      parking: 'Parker ved foten av Litlefjellet i Venjesdalen.',
      tags: ['view', 'familyFriendly', 'mountainHike'],
      mapAlt: 'Brosjyrekart for Litlefjellet: rute fra parkering i Venjesdalen opp til utkikkspunktet, med merket sti.',
      photoAlt: 'Familie på topptur på Litlefjellet med Romsdalshorn og Vengetindene i bakgrunnen.' },
  ],
};

// Helper: clone NO.walks but override teaser/description/parking/photoAlt/mapAlt + area when needed.
// We keep proper names as-is. Only translate the prose around them.

const EN: KorteTurerCopy = {
  ...NO,
  seoTitle: 'Short walks around Bjorli | Easy hikes in Lesja and Rauma',
  seoDescription: 'Find short walks around Bjorli, Lesja and Romsdalen. Viewpoints, cultural heritage, family-friendly trails and maps for easy nature experiences near E136 and Raumabanen.',
  ogTitle: 'Short walks around Bjorli',
  heroEyebrow: 'Summer at Bjorli · Short walk',
  heroTitle: 'Short walks around Bjorli',
  heroSubtitle: 'From Bjorli you have a short drive to viewpoints, cultural heritage, forest trails, rivers and small mountain hikes in Lesja and Rauma.',
  heroAlt: 'The day-trip cabin at Tussheim with a summer view over Lesja — a typical short walk in the mountain villages around Bjorli.',
  ctaSeeWalks: 'See the walks',
  ctaPlanTrip: 'Plan your trip here',
  crumbSommer: 'Summer',
  crumbHere: 'Short walks around Bjorli',
  introP1: 'Bjorli sits between Lesja, Romsdalen and the mountains of Reinheimen. From here you can choose short walks with a lot of variety — viewpoints, cultural heritage, day-trip cabins, rivers, forest and family-friendly stops along the way.',
  introP2: 'The walks below are taken from the brochure “Snarturer i Rauma og Lesja” and are all easy to reach from E136. Several can be combined with a train ride on Raumabanen, and some are so close to the road that they work as a quick break on your way to the fjord.',
  introP3: 'Distances are round-trip. Some walks are very easy and suit the whole family. Others are short but steep and ask a bit more of your legs. Check the weather and local advice before you set out.',
  brochureOriginal: 'Original brochure',
  brochureDownload: 'Download the original brochure',
  overviewEyebrow: '10 short walks',
  overviewTitle: 'Pick a walk',
  readMore: 'Read more',
  roundTripPrefix: 'Round trip',
  elevationPrefix: 'Ascent',
  startParking: 'Start and parking',
  mapCaption: 'Map detail from the brochure “Snarturer i Rauma og Lesja” (Nordveggen)',
  mixEyebrow: 'Mix and match',
  mixTitle: 'Choose a walk to match your day',
  mixCards: [
    { title: 'For families',         iconKey: 'family',   walks: ['lesjaverk', 'kulturminner-lesjaskog', 'eventurskogen'] },
    { title: 'For the view',         iconKey: 'view',     walks: ['tussheimbue', 'sveavarden', 'ranakollen', 'litlefjellet'] },
    { title: 'For quick roadside stops', iconKey: 'roadside', walks: ['kyllingbrua', 'trollstigen-utkikkspunkt'] },
    { title: 'For train and culture',iconKey: 'train',    walks: ['lesjaverk', 'kyllingbrua', 'tussheimbue', 'sveavarden'] },
  ],
  baseEyebrow: 'Base camp',
  baseTitle: 'Bjorli as a base',
  baseP1: 'Stay at Bjorli and spend your days on small walks nearby. Take an easy evening stroll, stop at a photo spot along E136, combine your walk with Raumabanen, or use Bjorli as a calm base between mountain, valley and fjord.',
  baseP2: 'Nearby you have Lesjaskogsvatnet, the Reinheimen and Dovrefjell-Sunndalsfjella national parks, and trails down towards Romsdalen and Trollstigen. A natural starting point for short walks and longer day hikes.',
  baseLinkAccommodation: 'Accommodation at Bjorli',
  baseLinkFood: 'Food and drink',
  baseLinkSummer: 'Summer activities',
  baseLinkTravel: 'Getting here',
  tipsTitle: 'Remember on the trail',
  tips: [
    'Take your rubbish home — including toilet paper and wet wipes.',
    'Show consideration for wildlife and grazing animals.',
    'Keep your dog on a leash where leash laws apply.',
    'Use toilets where available. Otherwise: dig a hole about 15 cm deep and cover it afterwards.',
    'Check weather, conditions and local advice before you head out.',
  ],
  faqTitle: 'Questions and answers',
  faq: [
    { q: 'Which short walks around Bjorli suit children?', a: 'Lesjaverk is an easy walk down to Lesjaskogsvatnet with a swimming spot. Kulturminner ved Lesjaskog is a short cultural loop suited for the whole family. EvenTURskogen in Åndalsnes is built around a treasure hunt for children, with a map, key and tasks along the way.' },
    { q: 'Which walks have the best views?', a: 'Tussheimbue offers a wide view over the cultural landscape in Lesja and Reinheimen. Sveavarden sits just above the tree line with views west towards Lesjaskogsvatnet. Rånåkollen is short and steep but gives a good view of the valley. Litlefjellet in Venjesdalen opens up towards Trollveggen, Vengetindene and Romsdalshornet.' },
    { q: 'Can any of the walks be combined with Raumabanen?', a: 'Yes. Tussheimbue, Sveavarden and Lesjaverk start close to train stops in Lesja, and Kyllingbrua leads you to a photo spot beneath the famous railway bridge at Verma — one of the best-known landmarks along Raumabanen.' },
    { q: 'Which walks work as quick stops along E136?', a: 'Kyllingbrua (0.6 km) and Trollstigen viewpoint (1.2 km) are the shortest and easiest to stop at. Kulturminner ved Lesjaskog (1 km) and Lesjaverk (1.5 km) are also right by the main road and make a good break en route.' },
  ],
  finalTitle: 'Stay at Bjorli and discover short walks in the mountain villages around',
  finalBody: 'Choose Bjorli as your base and fill your days with easy walks, viewpoints, cultural heritage and small adventures between mountain and fjord.',
  finalAccommodation: 'See accommodation',
  finalSummer: 'See summer activities',
  finalTravel: 'Getting here',
  creditEyebrow: 'Source and credit',
  creditP1: 'Walk inspiration, map details and photography are taken from the brochure “Snarturer i Rauma og Lesja”.',
  creditPublisher: 'Publisher',
  tagLabels: tagsEn,
  walks: NO.walks.map((w) => ({ ...w })), // overridden below
};
// Override EN walks prose
const enWalkOverrides: Partial<Record<WalkId, Partial<WalkCopy>>> = {
  'tussheimbue': {
    teaser: 'A day-trip cabin with sweeping views over the cultural landscape of Lesja and Reinheimen national park.',
    description: 'A stylish day-trip cabin awaits at the top, with views over the valley and the mountains of Reinheimen. The path is well prepared and marked the whole way up. Along the way you’ll find info boards on landscape and cultural history, and at the cabin benches and binoculars are ready for a long break.',
    parking: 'Start in the centre of Lesja. Follow the prepared path through the railway underpass.',
    mapAlt: 'Brochure map for Tussheimbue: route from the centre of Lesja up to the day-trip cabin, with parking and the marked path indicated.',
    photoAlt: 'The day-trip cabin at Tussheim with a view over the cultural landscape of Lesja and the mountains of Reinheimen national park.',
  },
  'sveavarden': {
    teaser: 'A walk through pine forest to a cairn above the tree line, with views over Lora and Lesjaskogsvatnet.',
    description: 'The path leads you steadily upwards through fine pine forest before opening up above the tree line. The cairn stands on an open ridge with a wide view west towards Lesjaskogsvatnet. Well marked the whole way.',
    parking: 'Park at Lora station. Follow the marked path through the railway underpass.',
    mapAlt: 'Brochure map for Sveavarden: route from Lora station up through the pine forest to the cairn, with parking and marked path.',
  },
  'lesjaverk': {
    teaser: 'An easy walk from Lesjaverk station towards Lesjaskogsvatnet and the heritage trail by the old ironworks.',
    description: 'A simple walk suitable for everyone. The route takes you over the railway and down to Lesjaskogsvatnet, where there is a prepared swimming spot. Around the lake lie cultural remains of the old ironworks at Lesjaverk, with the option of a loop on a marked trail.',
    parking: 'Start at Lesjaverk station. Parking at the station.',
    mapAlt: 'Brochure map for Lesjaverk: route from Lesjaverk station down to Lesjaskogsvatnet, with parking and marked path indicated.',
    photoAlt: 'Lesjaskogsvatnet on a summer day — a calm mountain lake beside the old ironworks at Lesjaverk.',
  },
  'kulturminner-lesjaskog': {
    teaser: 'A short cultural walk at Lesjaskog kyrkje, with historic buildings, war memorials and traces of the former ironworks.',
    description: 'A small loop in the village, where QR codes along the way let you read more about each stop. A nice break for families who want a short, calm pause with a touch of history.',
    parking: 'Park at Bunnpris Lesjaskog and follow the road to the heritage area.',
    mapAlt: 'Brochure map for the Lesjaskog heritage walk: loop around Lesjaskog kyrkje, with parking and information stops.',
  },
  'ranakollen': {
    teaser: 'A short but steep walk to the day-trip cabin on Rånåkollen, with views over the valley and into the high mountains.',
    description: 'A quick climb that pays off well. The trail is clearly marked and leads to an open day-trip cabin at the top, with an unobstructed view over the valley and further into the mountains. The path passes close to farms — please respect people and animals.',
    parking: 'Marked parking by Rånåvegen.',
    mapAlt: 'Brochure map for Rånåkollen: route from parking at Rånåvegen up to the day-trip cabin, with marked path and viewpoint.',
  },
  'kyllingbrua': {
    teaser: 'A short walk to a photo spot beneath Kyllingbrua, one of the best-known landmarks along Raumabanen.',
    description: 'One of the shortest walks in the brochure, but also one of the most photographed. The path leads down to the Rauma river, with two great photo spots and info boards about the bridge and Raumabanen.',
    parking: 'Park by the local shop in Verma. Cross the road and follow the gravel path down to the river.',
    mapAlt: 'Brochure map for Kyllingbrua: route from Verma down to the photo spot under the bridge, with parking and marked path.',
    photoAlt: 'A train crosses Kyllingbrua — the famous stone arch along Raumabanen, seen from the photo spot beneath the bridge.',
  },
  'eventurskogen': {
    teaser: 'A family-friendly treasure hunt from Norsk Tindesenter, with map, key and tasks for the children.',
    description: 'A walk designed for the youngest. You start with a ticket and a film at Norsk Tindesenter and receive a map and a key to unlock chests in the forest. Everyone who solves the tasks gets a medal at the end.',
    parking: 'Start at Norsk Tindesenter in Åndalsnes. A ticket must be bought at the start.',
    mapAlt: 'Brochure map for EvenTURskogen: route from Åndalsnes towards Isfjorden, with parking, photo spots and marked path.',
    photoAlt: 'Children study an info board in EvenTURskogen — a family treasure hunt at Norsk Tindesenter in Åndalsnes.',
  },
  'trollstigfoten': {
    teaser: 'A loop along the river Istra through lush landscape beneath the mighty mountains at the foot of Trollstigen.',
    description: 'A pleasant loop following Istra on both sides. The path crosses the river on a bridge at the bottom of the Trollstigen road and brings you back along the historic packhorse trail. Lush vegetation, a rushing river and mountains rising on every side.',
    parking: 'Start at the parking area at Trollstigfoten. Follow signs down towards the river Istra.',
    mapAlt: 'Brochure map for Trollstigfoten: loop along the river Istra beneath Trollstigen, with parking and marked path.',
    photoAlt: 'A waterfall tumbling down the cliffside at Trollstigfoten — lush summer nature at the foot of Trollstigen.',
  },
  'trollstigen-utkikkspunkt': {
    teaser: 'An easy walk from the Trollstigen café to architectural viewpoints over the famous Trollstigen road.',
    description: 'A short walkway leading to several architectural viewpoints. The largest platform juts out over the cliff edge and hovers above the bends of Trollstigen. Partly wheelchair accessible.',
    parking: 'Start at the Trollstigen café on top of Trollstigen.',
    mapAlt: 'Brochure map for the Trollstigen viewpoint: walkway from the Trollstigen café out to the viewing platforms, with parking and viewpoints.',
    photoAlt: 'A person photographs from the Trollstigen viewpoint — looking down over the bends of the Trollstigen road.',
  },
  'litlefjellet': {
    teaser: 'A short mountain hike with views towards Trollveggen, Vengetindene, Romsdalshorn and Romsdalen.',
    description: 'A little favourite for both small and grown-up walkers. The path is easy to follow up the mountainside, and at the top the landscape opens up towards Trollveggen, Vengetindene and Romsdalshornet. A little hilly but short.',
    parking: 'Park at the foot of Litlefjellet in Venjesdalen.',
    mapAlt: 'Brochure map for Litlefjellet: route from parking in Venjesdalen up to the viewpoint, with marked path.',
    photoAlt: 'A family on a summit hike on Litlefjellet with Romsdalshorn and Vengetindene in the background.',
  },
};
EN.walks = NO.walks.map((w) => ({ ...w, ...(enWalkOverrides[w.id] ?? {}) }));

const DE: KorteTurerCopy = {
  ...NO,
  seoTitle: 'Kurze Wanderungen rund um Bjorli | Leichte Touren in Lesja und Rauma',
  seoDescription: 'Kurze Wanderungen rund um Bjorli, Lesja und Romsdalen. Aussichtspunkte, Kulturerbe, familienfreundliche Touren und Karten für einfache Naturerlebnisse an E136 und Raumabanen.',
  ogTitle: 'Kurze Wanderungen rund um Bjorli',
  heroEyebrow: 'Sommer in Bjorli · Kurztour',
  heroTitle: 'Kurze Wanderungen rund um Bjorli',
  heroSubtitle: 'Von Bjorli aus sind Aussichtspunkte, Kulturerbe, Waldwege, Flüsse und kleine Bergtouren in Lesja und Rauma schnell erreichbar.',
  heroAlt: 'Die Tageshütte auf Tussheim mit Sommerblick über Lesja — eine typische Kurztour in den Bergdörfern rund um Bjorli.',
  ctaSeeWalks: 'Die Touren ansehen',
  ctaPlanTrip: 'Anreise planen',
  crumbSommer: 'Sommer',
  crumbHere: 'Kurze Wanderungen rund um Bjorli',
  introP1: 'Bjorli liegt mitten zwischen Lesja, Romsdalen und den Bergen von Reinheimen. Von hier aus können Sie aus vielen kurzen Touren wählen — Aussichtspunkte, Kulturerbe, Tageshütten, Flüsse, Wald und familienfreundliche Stopps unterwegs.',
  introP2: 'Die Touren unten stammen aus der Broschüre „Snarturer i Rauma og Lesja“ und sind alle leicht von der E136 aus erreichbar. Mehrere lassen sich mit einer Zugfahrt auf der Raumabanen verbinden, und einige liegen so nah an der Straße, dass sie eine kurze Pause auf dem Weg zum Fjord ergeben.',
  introP3: 'Die Längen sind Hin und Zurück angegeben. Manche Touren sind sehr einfach und passen für die ganze Familie. Andere sind kurz, aber steil und fordern etwas mehr. Prüfen Sie Wetter und örtliche Hinweise vor dem Aufbruch.',
  brochureOriginal: 'Originalbroschüre',
  brochureDownload: 'Originalbroschüre herunterladen',
  overviewEyebrow: '10 Kurztouren',
  overviewTitle: 'Eine Tour wählen',
  readMore: 'Mehr erfahren',
  roundTripPrefix: 'Hin und Zurück',
  elevationPrefix: 'Aufstieg',
  startParking: 'Start und Parkplatz',
  mapCaption: 'Kartenausschnitt aus der Broschüre „Snarturer i Rauma og Lesja“ (Nordveggen)',
  mixEyebrow: 'Mix und Auswahl',
  mixTitle: 'Tour nach Tagesform wählen',
  mixCards: [
    { title: 'Für Familien',                  iconKey: 'family',   walks: ['lesjaverk', 'kulturminner-lesjaskog', 'eventurskogen'] },
    { title: 'Für die Aussicht',              iconKey: 'view',     walks: ['tussheimbue', 'sveavarden', 'ranakollen', 'litlefjellet'] },
    { title: 'Für kurze Stopps an der Straße',iconKey: 'roadside', walks: ['kyllingbrua', 'trollstigen-utkikkspunkt'] },
    { title: 'Für Zug und Kultur',            iconKey: 'train',    walks: ['lesjaverk', 'kyllingbrua', 'tussheimbue', 'sveavarden'] },
  ],
  baseEyebrow: 'Basecamp',
  baseTitle: 'Bjorli als Basis',
  baseP1: 'Übernachten Sie in Bjorli und verbringen Sie die Tage mit kleinen Touren in der Umgebung. Ein einfacher Abendspaziergang, ein Fotostopp an der E136, eine Kombination mit der Raumabanen oder Bjorli als ruhige Basis zwischen Berg, Tal und Fjord.',
  baseP2: 'In der Nähe liegen Lesjaskogsvatnet, die Nationalparks Reinheimen und Dovrefjell-Sunndalsfjella sowie Touren hinunter nach Romsdalen und Trollstigen. Ein natürlicher Ausgangspunkt für kurze Touren und längere Tagestouren.',
  baseLinkAccommodation: 'Unterkunft in Bjorli',
  baseLinkFood: 'Essen und Trinken',
  baseLinkSummer: 'Sommeraktivitäten',
  baseLinkTravel: 'Anreise',
  tipsTitle: 'Auf Tour denken Sie an',
  tips: [
    'Müll wieder mitnehmen — auch Toilettenpapier und Feuchttücher.',
    'Rücksicht auf Wild- und Weidetiere nehmen.',
    'Den Hund anleinen, wo Leinenpflicht gilt.',
    'Vorhandene Toiletten benutzen. Sonst: ein Loch von ca. 15 cm graben und danach zudecken.',
    'Wetter, Verhältnisse und örtliche Hinweise vor der Tour prüfen.',
  ],
  faqTitle: 'Fragen und Antworten',
  faq: [
    { q: 'Welche kurzen Wanderungen rund um Bjorli eignen sich für Kinder?', a: 'Lesjaverk ist eine leichte Tour hinunter zum Lesjaskogsvatnet mit Badestelle. Kulturminner ved Lesjaskog ist eine kurze Kulturrunde für die ganze Familie. EvenTURskogen in Åndalsnes ist eine Schatzsuche für Kinder mit Karte, Schlüssel und Aufgaben unterwegs.' },
    { q: 'Welche Touren haben die beste Aussicht?', a: 'Tussheimbue bietet weite Sicht über die Kulturlandschaft von Lesja und Reinheimen. Sveavarden liegt direkt über der Baumgrenze mit Blick nach Westen auf den Lesjaskogsvatnet. Rånåkollen ist kurz und steil, aber mit gutem Blick ins Tal. Litlefjellet in Venjesdalen öffnet sich zu Trollveggen, Vengetindene und Romsdalshornet.' },
    { q: 'Lassen sich Touren mit der Raumabanen verbinden?', a: 'Ja. Tussheimbue, Sveavarden und Lesjaverk beginnen nahe bei Bahnhöfen in Lesja, und Kyllingbrua führt zu einem Fotopunkt unterhalb der berühmten Eisenbahnbrücke bei Verma — einem der bekanntesten Wahrzeichen entlang der Raumabanen.' },
    { q: 'Welche Touren sind kurze Stopps an der E136?', a: 'Kyllingbrua (0,6 km) und der Trollstigen-Aussichtspunkt (1,2 km) sind am kürzesten. Kulturminner ved Lesjaskog (1 km) und Lesjaverk (1,5 km) liegen ebenfalls direkt an der Hauptstraße und eignen sich gut als Pause unterwegs.' },
  ],
  finalTitle: 'In Bjorli übernachten und kurze Touren in den Bergdörfern entdecken',
  finalBody: 'Wählen Sie Bjorli als Basis und füllen Sie die Tage mit einfachen Touren, Aussichtspunkten, Kulturerbe und kleinen Abenteuern zwischen Berg und Fjord.',
  finalAccommodation: 'Unterkunft ansehen',
  finalSummer: 'Sommeraktivitäten',
  finalTravel: 'Anreise',
  creditEyebrow: 'Quelle und Credits',
  creditP1: 'Tour-Inspiration, Kartenausschnitte und Bildmaterial stammen aus der Broschüre „Snarturer i Rauma og Lesja“.',
  creditPublisher: 'Herausgeber',
  tagLabels: tagsDe,
  walks: NO.walks.map((w) => ({ ...w })),
};
const deWalkOverrides: Partial<Record<WalkId, Partial<WalkCopy>>> = {
  'tussheimbue': { teaser: 'Tageshütte mit weitem Blick über die Kulturlandschaft von Lesja und den Nationalpark Reinheimen.', description: 'Oben wartet eine stilvolle Tageshütte mit Blick über das Tal und die Berge von Reinheimen. Der Weg ist gut präpariert und durchgehend markiert. Unterwegs gibt es Infotafeln zu Landschaft und Kulturgeschichte, an der Hütte stehen Bänke und Fernglas für eine längere Pause bereit.', parking: 'Start im Zentrum von Lesja. Folgen Sie dem präparierten Weg durch die Bahnunterführung.', mapAlt: 'Broschürenkarte Tussheimbue: Route vom Zentrum Lesja hinauf zur Tageshütte, mit Parkplatz und markiertem Weg.', photoAlt: 'Die Tageshütte auf Tussheim mit Blick über die Kulturlandschaft von Lesja und die Berge des Nationalparks Reinheimen.' },
  'sveavarden': { teaser: 'Tour durch Kiefernwald zu einer Steinmarkierung über der Baumgrenze, mit Blick auf Lora und Lesjaskogsvatnet.', description: 'Der Weg führt gleichmäßig durch schönen Kiefernwald, bevor er sich über der Baumgrenze öffnet. Die Steinmarkierung steht auf einem offenen Rücken mit weiter Sicht nach Westen über den Lesjaskogsvatnet. Gut markiert.', parking: 'Parken am Bahnhof Lora. Folgen Sie dem markierten Weg durch die Bahnunterführung.', mapAlt: 'Broschürenkarte Sveavarden: Route vom Bahnhof Lora durch den Kiefernwald hinauf zur Steinmarkierung, mit Parkplatz und Weg.' },
  'lesjaverk': { teaser: 'Leichte Tour vom Bahnhof Lesjaverk zum Lesjaskogsvatnet und zum Kulturpfad am alten Eisenwerk.', description: 'Eine einfache Tour für alle. Der Weg führt über die Bahn hinunter zum Lesjaskogsvatnet, wo eine Badestelle eingerichtet ist. Rund um den See liegen Kulturdenkmäler des alten Eisenwerks in Lesjaverk, eine Rundtour ist möglich.', parking: 'Start am Bahnhof Lesjaverk. Parken am Bahnhof.', mapAlt: 'Broschürenkarte Lesjaverk: Route vom Bahnhof Lesjaverk hinunter zum Lesjaskogsvatnet, mit Parkplatz und Weg.', photoAlt: 'Lesjaskogsvatnet an einem Sommertag — ruhiger Bergsee am alten Eisenwerk in Lesjaverk.' },
  'kulturminner-lesjaskog': { teaser: 'Kurze Kulturwanderung bei Lesjaskog kyrkje, mit historischen Gebäuden, Kriegsdenkmälern und Spuren des ehemaligen Eisenwerks.', description: 'Eine kleine Runde durchs Dorf, bei der QR-Codes unterwegs mehr Informationen zu jeder Station bieten. Ein schöner Stopp für Familien, die eine kurze, ruhige Pause mit Geschichte suchen.', parking: 'Parken bei Bunnpris Lesjaskog und der Straße zum Kulturdenkmal folgen.', mapAlt: 'Broschürenkarte zum Kulturpfad Lesjaskog: Runde um Lesjaskog kyrkje, mit Parkplatz und Infopunkten.' },
  'ranakollen': { teaser: 'Kurze, aber steile Tour zur Tageshütte auf Rånåkollen, mit Blick ins Tal und ins Hochgebirge.', description: 'Ein schneller Anstieg, der sich lohnt. Der gut markierte Weg führt zu einer offenen Tageshütte am Gipfel mit freiem Blick ins Tal und weiter in die Berge. Der Weg verläuft dicht an Höfen — bitte Rücksicht auf Menschen und Tiere.', parking: 'Markierter Parkplatz an der Rånåvegen.', mapAlt: 'Broschürenkarte Rånåkollen: Route vom Parkplatz Rånåvegen hinauf zur Tageshütte, mit markiertem Weg und Aussichtspunkt.' },
  'kyllingbrua': { teaser: 'Kurze Tour zu einem Fotopunkt unter der Kyllingbrua, einem der bekanntesten Wahrzeichen der Raumabanen.', description: 'Eine der kürzesten Touren im Heft, aber auch eine der meistfotografierten. Der Weg führt hinunter zur Rauma mit zwei schönen Fotopunkten und Infotafeln zur Brücke und zur Raumabanen.', parking: 'Parken am Nahkauf in Verma. Über die Straße und auf dem Schotterweg hinunter zum Fluss.', mapAlt: 'Broschürenkarte Kyllingbrua: Route von Verma hinunter zum Fotopunkt unter der Brücke, mit Parkplatz und Weg.', photoAlt: 'Ein Zug überquert die Kyllingbrua — der berühmte Steinbogen an der Raumabanen, vom Fotopunkt unter der Brücke gesehen.' },
  'eventurskogen': { teaser: 'Familienfreundliche Schatzsuche vom Norsk Tindesenter, mit Karte, Schlüssel und Aufgaben für die Kinder.', description: 'Eine Tour für die Jüngsten. Sie beginnen mit Ticket und Film im Norsk Tindesenter und erhalten Karte und Schlüssel, um Truhen im Wald zu öffnen. Wer alle Aufgaben löst, erhält am Ende eine Medaille.', parking: 'Start am Norsk Tindesenter in Åndalsnes. Ticket beim Start lösen.', mapAlt: 'Broschürenkarte EvenTURskogen: Route von Åndalsnes Richtung Isfjorden, mit Parkplatz, Fotopunkten und markiertem Weg.', photoAlt: 'Kinder betrachten eine Infotafel im EvenTURskogen — Schatzsuche für Familien am Norsk Tindesenter in Åndalsnes.' },
  'trollstigfoten': { teaser: 'Runde am Fluss Istra durch üppige Landschaft unter den mächtigen Bergen am Fuß des Trollstigen.', description: 'Eine angenehme Runde entlang der Istra auf beiden Seiten. Der Weg quert den Fluss am Fuß der Trollstigen-Straße und führt entlang des historischen Saumpfads zurück. Üppige Vegetation, ein rauschender Fluss und Berge ringsum.', parking: 'Start am Parkplatz Trollstigfoten. Den Schildern hinunter zur Istra folgen.', mapAlt: 'Broschürenkarte Trollstigfoten: Runde entlang der Istra unter Trollstigen, mit Parkplatz und Weg.', photoAlt: 'Ein Wasserfall stürzt die Felswand am Trollstigfoten hinab — üppige Sommernatur am Fuß des Trollstigen.' },
  'trollstigen-utkikkspunkt': { teaser: 'Einfache Tour vom Trollstigen-Café zu architektonischen Aussichtsplattformen über die berühmte Trollstigen-Straße.', description: 'Ein kurzer Weg führt zu mehreren architektonischen Aussichtsplattformen. Die größte ragt über die Felskante und schwebt über den Kehren der Trollstigen. Teilweise rollstuhlgerecht.', parking: 'Start am Trollstigen-Café oben am Trollstigen.', mapAlt: 'Broschürenkarte Aussichtspunkt Trollstigen: Weg vom Trollstigen-Café zu den Aussichtsplattformen, mit Parkplatz und Aussichtspunkten.', photoAlt: 'Eine Person fotografiert vom Aussichtspunkt Trollstigen — Blick auf die Kehren der Trollstigen-Straße.' },
  'litlefjellet': { teaser: 'Kurze Bergtour mit Blick auf Trollveggen, Vengetindene, Romsdalshorn und Romsdalen.', description: 'Ein kleiner Favorit für Jung und Alt. Der Weg ist gut zu gehen, und am Gipfel öffnet sich die Landschaft zu Trollveggen, Vengetindene und Romsdalshornet. Etwas hügelig, aber kurz.', parking: 'Parken am Fuß von Litlefjellet in Venjesdalen.', mapAlt: 'Broschürenkarte Litlefjellet: Route vom Parkplatz in Venjesdalen hinauf zum Aussichtspunkt, mit markiertem Weg.', photoAlt: 'Familie auf einer Gipfeltour auf Litlefjellet mit Romsdalshorn und Vengetindene im Hintergrund.' },
};
DE.walks = NO.walks.map((w) => ({ ...w, ...(deWalkOverrides[w.id] ?? {}) }));

const NL: KorteTurerCopy = {
  ...NO,
  seoTitle: 'Korte wandelingen rond Bjorli | Eenvoudige wandelingen in Lesja en Rauma',
  seoDescription: 'Vind korte wandelingen rond Bjorli, Lesja en Romsdalen. Uitzichtpunten, cultureel erfgoed, gezinsvriendelijke routes en kaarten voor eenvoudige natuurbelevenissen bij E136 en Raumabanen.',
  ogTitle: 'Korte wandelingen rond Bjorli',
  heroEyebrow: 'Zomer in Bjorli · Korte wandeling',
  heroTitle: 'Korte wandelingen rond Bjorli',
  heroSubtitle: 'Vanuit Bjorli zijn uitzichtpunten, cultureel erfgoed, bospaden, rivieren en kleine bergwandelingen in Lesja en Rauma snel bereikbaar.',
  heroAlt: 'De daghut op Tussheim met zomeruitzicht over Lesja — een typische korte wandeling in de bergdorpen rond Bjorli.',
  ctaSeeWalks: 'Bekijk de wandelingen',
  ctaPlanTrip: 'Plan je reis hierheen',
  crumbSommer: 'Zomer',
  crumbHere: 'Korte wandelingen rond Bjorli',
  introP1: 'Bjorli ligt midden tussen Lesja, Romsdalen en de bergen van Reinheimen. Vanaf hier kun je kiezen uit korte wandelingen met veel variatie — uitzichtpunten, cultureel erfgoed, daghutten, rivieren, bos en gezinsvriendelijke stops onderweg.',
  introP2: 'De wandelingen hieronder komen uit de brochure “Snarturer i Rauma og Lesja” en zijn allemaal goed bereikbaar vanaf de E136. Verschillende zijn te combineren met een treinrit op de Raumabanen, en sommige liggen zo dicht bij de weg dat ze prima als korte pauze richting de fjord werken.',
  introP3: 'De afstanden zijn heen en terug. Sommige wandelingen zijn heel eenvoudig en geschikt voor het hele gezin. Andere zijn kort maar steil en vragen wat meer van de benen. Controleer weer en lokale aanbevelingen voor je vertrekt.',
  brochureOriginal: 'Originele brochure',
  brochureDownload: 'Originele brochure downloaden',
  overviewEyebrow: '10 korte wandelingen',
  overviewTitle: 'Kies een wandeling',
  readMore: 'Meer lezen',
  roundTripPrefix: 'Heen en terug',
  elevationPrefix: 'Stijging',
  startParking: 'Start en parkeren',
  mapCaption: 'Kaartuitsnede uit de brochure “Snarturer i Rauma og Lesja” (Nordveggen)',
  mixEyebrow: 'Kies en mix',
  mixTitle: 'Kies een wandeling die past bij je dag',
  mixCards: [
    { title: 'Voor gezinnen',                  iconKey: 'family',   walks: ['lesjaverk', 'kulturminner-lesjaskog', 'eventurskogen'] },
    { title: 'Voor het uitzicht',              iconKey: 'view',     walks: ['tussheimbue', 'sveavarden', 'ranakollen', 'litlefjellet'] },
    { title: 'Voor korte stops langs de weg',  iconKey: 'roadside', walks: ['kyllingbrua', 'trollstigen-utkikkspunkt'] },
    { title: 'Voor trein en cultuur',          iconKey: 'train',    walks: ['lesjaverk', 'kyllingbrua', 'tussheimbue', 'sveavarden'] },
  ],
  baseEyebrow: 'Basecamp',
  baseTitle: 'Bjorli als uitvalsbasis',
  baseP1: 'Verblijf in Bjorli en vul je dagen met kleine wandelingen in de omgeving. Maak een rustige avondwandeling, stop bij een fotopunt langs de E136, combineer met de Raumabanen of gebruik Bjorli als rustige uitvalsbasis tussen berg, dal en fjord.',
  baseP2: 'In de buurt liggen Lesjaskogsvatnet, de nationale parken Reinheimen en Dovrefjell-Sunndalsfjella, en routes naar Romsdalen en Trollstigen. Een logisch startpunt voor korte wandelingen en langere dagtochten.',
  baseLinkAccommodation: 'Accommodatie in Bjorli',
  baseLinkFood: 'Eten en drinken',
  baseLinkSummer: 'Zomeractiviteiten',
  baseLinkTravel: 'Reizen naar Bjorli',
  tipsTitle: 'Denk op pad aan',
  tips: [
    'Neem je afval mee terug — ook wc-papier en vochtige doekjes.',
    'Wees rekening houdend met wilde en grazende dieren.',
    'Houd je hond aangelijnd waar dat verplicht is.',
    'Gebruik bestaande toiletten. Anders: graaf een gat van ca. 15 cm en dek het daarna af.',
    'Controleer weer, omstandigheden en lokale aanbevelingen vooraf.',
  ],
  faqTitle: 'Vragen en antwoorden',
  faq: [
    { q: 'Welke korte wandelingen rond Bjorli passen bij kinderen?', a: 'Lesjaverk is een makkelijke wandeling naar Lesjaskogsvatnet met een zwemplek. Kulturminner ved Lesjaskog is een korte cultuurronde voor het hele gezin. EvenTURskogen in Åndalsnes is een schattenjacht voor kinderen, met kaart, sleutel en opdrachten onderweg.' },
    { q: 'Welke wandelingen hebben het beste uitzicht?', a: 'Tussheimbue biedt een wijd uitzicht over het cultuurlandschap van Lesja en Reinheimen. Sveavarden ligt net boven de boomgrens met zicht westwaarts op Lesjaskogsvatnet. Rånåkollen is kort en steil maar met goed uitzicht op het dal. Litlefjellet in Venjesdalen opent zich richting Trollveggen, Vengetindene en Romsdalshornet.' },
    { q: 'Zijn er wandelingen te combineren met de Raumabanen?', a: 'Ja. Tussheimbue, Sveavarden en Lesjaverk starten dicht bij treinhaltes in Lesja, en Kyllingbrua leidt naar een fotopunt onder de bekende spoorbrug bij Verma — een van de bekendste herkenningspunten langs de Raumabanen.' },
    { q: 'Welke wandelingen werken als korte stops langs de E136?', a: 'Kyllingbrua (0,6 km) en het uitzichtpunt Trollstigen (1,2 km) zijn het kortst en het makkelijkst. Kulturminner ved Lesjaskog (1 km) en Lesjaverk (1,5 km) liggen ook direct aan de hoofdweg en zijn prima als pauze.' },
  ],
  finalTitle: 'Verblijf in Bjorli en ontdek korte wandelingen in de omliggende bergdorpen',
  finalBody: 'Kies Bjorli als uitvalsbasis en vul je dagen met eenvoudige wandelingen, uitzichtpunten, cultureel erfgoed en kleine avonturen tussen berg en fjord.',
  finalAccommodation: 'Bekijk accommodaties',
  finalSummer: 'Bekijk zomeractiviteiten',
  finalTravel: 'Reizen naar Bjorli',
  creditEyebrow: 'Bron en credits',
  creditP1: 'Wandelinspiratie, kaartuitsneden en beeldmateriaal komen uit de brochure “Snarturer i Rauma og Lesja”.',
  creditPublisher: 'Uitgever',
  tagLabels: tagsNl,
  walks: NO.walks.map((w) => ({ ...w })),
};
const nlWalkOverrides: Partial<Record<WalkId, Partial<WalkCopy>>> = {
  'tussheimbue': { teaser: 'Daghut met een weids uitzicht over het cultuurlandschap van Lesja en nationaal park Reinheimen.', description: 'Boven wacht een stijlvolle daghut met uitzicht over het dal en de bergen van Reinheimen. Het pad is goed aangelegd en gemarkeerd. Onderweg vind je informatieborden over landschap en cultuurgeschiedenis, en bij de hut staan bankjes en een verrekijker klaar.', parking: 'Start in het centrum van Lesja. Volg het aangelegde pad door de spoortunnel.', mapAlt: 'Brochurekaart Tussheimbue: route vanuit het centrum van Lesja naar de daghut, met parkeren en gemarkeerd pad.', photoAlt: 'De daghut op Tussheim met uitzicht over het cultuurlandschap van Lesja en de bergen van nationaal park Reinheimen.' },
  'sveavarden': { teaser: 'Wandeling door dennenbos naar een steenhoop boven de boomgrens, met zicht op Lora en Lesjaskogsvatnet.', description: 'Het pad gaat geleidelijk omhoog door mooi dennenbos en opent zich boven de boomgrens. De steenhoop ligt op een open rug met wijd uitzicht westwaarts op Lesjaskogsvatnet. Goed gemarkeerd.', parking: 'Parkeer bij station Lora. Volg het gemarkeerde pad door de spoortunnel.', mapAlt: 'Brochurekaart Sveavarden: route van station Lora door het dennenbos naar de steenhoop, met parkeren en pad.' },
  'lesjaverk': { teaser: 'Eenvoudige wandeling vanaf station Lesjaverk richting Lesjaskogsvatnet en het cultuurpad bij de oude ijzergieterij.', description: 'Een simpele wandeling voor iedereen. De route gaat over het spoor naar Lesjaskogsvatnet, waar een ingerichte zwemplek ligt. Rond het meer liggen sporen van de oude ijzergieterij Lesjaverk, met een mogelijke rondwandeling op een gemarkeerd pad.', parking: 'Start bij station Lesjaverk. Parkeren op het station.', mapAlt: 'Brochurekaart Lesjaverk: route vanaf station Lesjaverk naar Lesjaskogsvatnet, met parkeren en gemarkeerd pad.', photoAlt: 'Lesjaskogsvatnet op een zomerdag — een rustig bergmeer bij de oude ijzergieterij in Lesjaverk.' },
  'kulturminner-lesjaskog': { teaser: 'Korte cultuurwandeling bij Lesjaskog kyrkje, met historische gebouwen, oorlogsmonumenten en sporen van de vroegere ijzergieterij.', description: 'Een kleine rondwandeling door het dorp met QR-codes onderweg voor extra informatie. Een fijne stop voor families die korte pauze met geschiedenis zoeken.', parking: 'Parkeer bij Bunnpris Lesjaskog en volg de weg naar het cultureel erfgoedgebied.', mapAlt: 'Brochurekaart cultuurwandeling Lesjaskog: ronde rond Lesjaskog kyrkje, met parkeren en infopunten.' },
  'ranakollen': { teaser: 'Korte maar steile wandeling naar de daghut op Rånåkollen, met uitzicht over het dal en de hoge bergen.', description: 'Een snelle klim die zich loont. Het gemarkeerde pad leidt naar een open daghut op de top met vrij uitzicht over het dal en de bergen. Het pad loopt dicht bij boerderijen — houd rekening met mensen en dieren.', parking: 'Gemarkeerde parking bij Rånåvegen.', mapAlt: 'Brochurekaart Rånåkollen: route vanaf parking Rånåvegen naar de daghut, met gemarkeerd pad en uitzichtpunt.' },
  'kyllingbrua': { teaser: 'Korte wandeling naar een fotopunt onder Kyllingbrua, een van de bekendste herkenningspunten langs de Raumabanen.', description: 'Een van de kortste wandelingen uit de brochure, maar ook een van de meest gefotografeerde. Het pad gaat naar de Rauma met twee mooie fotopunten en infoborden over de brug en Raumabanen.', parking: 'Parkeer bij de buurtwinkel in Verma. Steek de weg over en volg het grindpad naar de rivier.', mapAlt: 'Brochurekaart Kyllingbrua: route vanuit Verma naar het fotopunt onder de brug, met parkeren en pad.', photoAlt: 'Een trein rijdt over Kyllingbrua — de bekende stenen boogbrug langs de Raumabanen, gezien vanaf het fotopunt eronder.' },
  'eventurskogen': { teaser: 'Gezinsvriendelijke schattenjacht vanuit Norsk Tindesenter, met kaart, sleutel en opdrachten voor de kinderen.', description: 'Een wandeling voor de jongsten. Je start met ticket en film in Norsk Tindesenter en krijgt een kaart en sleutel om kisten in het bos te openen. Wie alles oplost krijgt aan het eind een medaille.', parking: 'Start bij Norsk Tindesenter in Åndalsnes. Ticket bij de start kopen.', mapAlt: 'Brochurekaart EvenTURskogen: route van Åndalsnes richting Isfjorden, met parkeren, fotopunten en pad.', photoAlt: 'Kinderen bekijken een infobord in EvenTURskogen — schattenjacht voor families bij Norsk Tindesenter in Åndalsnes.' },
  'trollstigfoten': { teaser: 'Rondwandeling langs de rivier Istra door weelderig landschap onder de machtige bergen aan de voet van Trollstigen.', description: 'Een aangename rondwandeling langs beide oevers van de Istra. Het pad kruist de rivier bij de voet van de Trollstigen-weg en komt terug langs het historische pakdierenpad. Weelderige begroeiing, een ruisende rivier en bergen rondom.', parking: 'Start bij de parking Trollstigfoten. Volg de borden naar de Istra.', mapAlt: 'Brochurekaart Trollstigfoten: rondwandeling langs de Istra onder Trollstigen, met parkeren en pad.', photoAlt: 'Een waterval tuimelt langs de bergwand bij Trollstigfoten — weelderige zomernatuur aan de voet van Trollstigen.' },
  'trollstigen-utkikkspunkt': { teaser: 'Eenvoudige wandeling vanaf het Trollstigen-café naar architectonische uitzichtpunten over de beroemde Trollstigen-weg.', description: 'Een korte loopbrug leidt naar meerdere architectonische uitzichtplatforms. Het grootste platform steekt over de bergrand en zweeft boven de haarspeldbochten van Trollstigen. Deels rolstoeltoegankelijk.', parking: 'Start bij het Trollstigen-café boven aan Trollstigen.', mapAlt: 'Brochurekaart uitzichtpunt Trollstigen: pad vanaf het Trollstigen-café naar de uitzichtplatforms, met parkeren en uitzichtpunten.', photoAlt: 'Iemand fotografeert vanaf het uitzichtpunt Trollstigen — zicht op de bochten van de Trollstigen-weg.' },
  'litlefjellet': { teaser: 'Korte bergtocht met uitzicht op Trollveggen, Vengetindene, Romsdalshorn en Romsdalen.', description: 'Een favoriet voor jong en oud. Het pad is goed te volgen omhoog, en boven opent het landschap zich richting Trollveggen, Vengetindene en Romsdalshornet. Wat heuvelig maar kort.', parking: 'Parkeer aan de voet van Litlefjellet in Venjesdalen.', mapAlt: 'Brochurekaart Litlefjellet: route vanaf parkeren in Venjesdalen naar het uitzichtpunt, met gemarkeerd pad.', photoAlt: 'Familie op een toptocht op Litlefjellet met Romsdalshorn en Vengetindene op de achtergrond.' },
};
NL.walks = NO.walks.map((w) => ({ ...w, ...(nlWalkOverrides[w.id] ?? {}) }));

const DA: KorteTurerCopy = {
  ...NO,
  seoTitle: 'Korte ture rundt Bjorli | Lette vandreture i Lesja og Rauma',
  seoDescription: 'Find korte vandreture rundt Bjorli, Lesja og Romsdalen. Udsigtspunkter, kulturarv, familievenlige ture og kort til lette naturoplevelser nær E136 og Raumabanen.',
  ogTitle: 'Korte ture rundt Bjorli',
  heroEyebrow: 'Sommer på Bjorli · Kort tur',
  heroTitle: 'Korte vandreture rundt Bjorli',
  heroSubtitle: 'Fra Bjorli har du kort vej til udsigtspunkter, kulturarv, skovstier, floder og små fjeldture i Lesja og Rauma.',
  heroAlt: 'Daghytten på Tussheim med sommerudsigt over Lesja — en typisk kort tur i fjeldbygderne omkring Bjorli.',
  ctaSeeWalks: 'Se turene',
  ctaPlanTrip: 'Planlæg rejsen hertil',
  crumbSommer: 'Sommer',
  crumbHere: 'Korte ture rundt Bjorli',
  introP1: 'Bjorli ligger midt mellem Lesja, Romsdalen og fjeldene i Reinheimen. Herfra kan du vælge korte ture med stor variation — udsigtspunkter, kulturarv, daghytter, floder, skov og familievenlige stop undervejs.',
  introP2: 'Turene nedenfor er hentet fra brochuren “Snarturer i Rauma og Lesja” og er alle lette at nå fra E136. Flere kan kombineres med en togtur på Raumabanen, og nogle ligger så tæt på vejen, at de fungerer som en kort pause på vej mod fjorden.',
  introP3: 'Længderne er angivet tur-retur. Nogle ture er meget lette og passer til hele familien. Andre er korte, men stejle og kræver lidt mere af benene. Tjek vejret og lokale anbefalinger inden du går.',
  brochureOriginal: 'Original brochure',
  brochureDownload: 'Download den originale brochure',
  overviewEyebrow: '10 korte ture',
  overviewTitle: 'Vælg en tur',
  readMore: 'Læs mere',
  roundTripPrefix: 'Tur-retur',
  elevationPrefix: 'Stigning',
  startParking: 'Start og parkering',
  mapCaption: 'Kortudsnit fra brochuren “Snarturer i Rauma og Lesja” (Nordveggen)',
  mixEyebrow: 'Vælg og bland',
  mixTitle: 'Vælg tur efter dagsform',
  mixCards: [
    { title: 'Til familier',                 iconKey: 'family',   walks: ['lesjaverk', 'kulturminner-lesjaskog', 'eventurskogen'] },
    { title: 'Til udsigten',                 iconKey: 'view',     walks: ['tussheimbue', 'sveavarden', 'ranakollen', 'litlefjellet'] },
    { title: 'Til korte stop langs vejen',   iconKey: 'roadside', walks: ['kyllingbrua', 'trollstigen-utkikkspunkt'] },
    { title: 'Til tog og kultur',            iconKey: 'train',    walks: ['lesjaverk', 'kyllingbrua', 'tussheimbue', 'sveavarden'] },
  ],
  baseEyebrow: 'Basecamp',
  baseTitle: 'Bjorli som base',
  baseP1: 'Bo på Bjorli og brug dagene på små ture i nærområdet. Tag en let aftentur, stop ved et fotopunkt langs E136, kombinér med Raumabanen, eller brug Bjorli som rolig base mellem fjeld, dal og fjord.',
  baseP2: 'I nærheden ligger Lesjaskogsvatnet, nationalparkerne Reinheimen og Dovrefjell-Sunndalsfjella samt ture mod Romsdalen og Trollstigen. Et naturligt udgangspunkt for korte og længere ture.',
  baseLinkAccommodation: 'Overnatning på Bjorli',
  baseLinkFood: 'Mad og drikke',
  baseLinkSummer: 'Sommeraktiviteter',
  baseLinkTravel: 'Rejsen hertil',
  tipsTitle: 'Husk på tur',
  tips: [
    'Tag affald med hjem — også toiletpapir og vådservietter.',
    'Vis hensyn til vilde og græssende dyr.',
    'Hold hunden i snor hvor der er snorpligt.',
    'Brug toilet hvor der er. Ellers: grav et hul på ca. 15 cm og dæk til bagefter.',
    'Tjek vejr, føre og lokale anbefalinger inden turen.',
  ],
  faqTitle: 'Spørgsmål og svar',
  faq: [
    { q: 'Hvilke korte ture rundt Bjorli passer til børn?', a: 'Lesjaverk er en let tur ned til Lesjaskogsvatnet med badeplads. Kulturminner ved Lesjaskog er en kort kulturrunde for hele familien. EvenTURskogen i Åndalsnes er en skattejagt for børn med kort, nøgle og opgaver undervejs.' },
    { q: 'Hvilke ture har den bedste udsigt?', a: 'Tussheimbue giver bred udsigt over kulturlandskabet i Lesja og Reinheimen. Sveavarden ligger lige over trægrænsen med udsigt vestpå mod Lesjaskogsvatnet. Rånåkollen er kort og stejl med god udsigt over dalen. Litlefjellet i Venjesdalen åbner sig mod Trollveggen, Vengetindene og Romsdalshornet.' },
    { q: 'Kan turene kombineres med Raumabanen?', a: 'Ja. Tussheimbue, Sveavarden og Lesjaverk starter tæt på togstop i Lesja, og Kyllingbrua fører til et fotopunkt under den berømte jernbanebro ved Verma — et af de mest kendte vartegn langs Raumabanen.' },
    { q: 'Hvilke ture egner sig som korte stop langs E136?', a: 'Kyllingbrua (0,6 km) og Trollstigen udsigtspunkt (1,2 km) er de korteste. Kulturminner ved Lesjaskog (1 km) og Lesjaverk (1,5 km) ligger også lige ved hovedvejen og passer godt som pause.' },
  ],
  finalTitle: 'Bo på Bjorli og opdag korte ture i fjeldbygderne omkring',
  finalBody: 'Vælg Bjorli som base og fyld dagene med lette ture, udsigtspunkter, kulturarv og små eventyr mellem fjeld og fjord.',
  finalAccommodation: 'Se overnatning',
  finalSummer: 'Se sommeraktiviteter',
  finalTravel: 'Rejsen hertil',
  creditEyebrow: 'Kilde og kreditering',
  creditP1: 'Turinspiration, kortudsnit og billedmateriale er hentet fra brochuren “Snarturer i Rauma og Lesja”.',
  creditPublisher: 'Udgiver',
  tagLabels: tagsDa,
  walks: NO.walks.map((w) => ({ ...w })),
};
const daWalkOverrides: Partial<Record<WalkId, Partial<WalkCopy>>> = {
  'tussheimbue': { teaser: 'Daghytte med vid udsigt over kulturlandskabet i Lesja og Reinheimen nationalpark.', description: 'En stilfuld daghytte venter på toppen med udsigt over dalen og fjeldene i Reinheimen. Stien er godt tilrettelagt og afmærket hele vejen op. Undervejs er der infotavler om landskab og kulturhistorie, og ved hytten står bænke og kikkert klar.', parking: 'Start i Lesja centrum. Følg den tilrettelagte sti gennem jernbaneunderføringen.', mapAlt: 'Brochurekort for Tussheimbue: rute fra Lesja centrum op til daghytten, med parkering og afmærket sti.', photoAlt: 'Daghytten på Tussheim med udsigt over kulturlandskabet i Lesja og fjeldene i Reinheimen nationalpark.' },
  'sveavarden': { teaser: 'Tur gennem fyrreskov til en varde over trægrænsen, med udsigt mod Lora og Lesjaskogsvatnet.', description: 'Stien går jævnt opad gennem flot fyrreskov og åbner sig over trægrænsen. Varden står på en åben ryg med vid udsigt vestpå mod Lesjaskogsvatnet. Godt afmærket.', parking: 'Parkér ved Lora station. Følg den afmærkede sti gennem jernbaneunderføringen.', mapAlt: 'Brochurekort for Sveavarden: rute fra Lora station op gennem fyrreskoven til varden, med parkering og sti.' },
  'lesjaverk': { teaser: 'Let tur fra Lesjaverk station mod Lesjaskogsvatnet og kulturstien ved det gamle jernværk.', description: 'En enkel tur, der passer alle. Ruten går over jernbanen og ned mod Lesjaskogsvatnet med en indrettet badeplads. Rundt om søen ligger kulturminder fra det gamle jernværk Lesjaverk, og en rundtur ad afmærket sti er mulig.', parking: 'Start ved Lesjaverk station. Parkering på stationen.', mapAlt: 'Brochurekort for Lesjaverk: rute fra Lesjaverk station ned til Lesjaskogsvatnet, med parkering og afmærket sti.', photoAlt: 'Lesjaskogsvatnet på en sommerdag — en stille fjeldsø ved det gamle jernværk i Lesjaverk.' },
  'kulturminner-lesjaskog': { teaser: 'Kort kulturvandring ved Lesjaskog kyrkje, med historiske bygninger, krigsminder og spor efter det tidligere jernværk.', description: 'En lille runde i bygden, hvor QR-koder undervejs giver mere info om hvert stop. Et fint stop for familier, der vil have en kort, rolig pause med lidt historie.', parking: 'Parkér ved Bunnpris Lesjaskog og følg vejen til kulturminneområdet.', mapAlt: 'Brochurekort for kulturvandring Lesjaskog: runde om Lesjaskog kyrkje, med parkering og infopunkter.' },
  'ranakollen': { teaser: 'Kort, men stejl tur til daghytten på Rånåkollen, med udsigt over dalen og ind mod højfjeldet.', description: 'En hurtig opstigning, der giver meget igen. Den afmærkede sti fører til en åben daghytte på toppen med fri udsigt over dalen og videre mod fjeldene. Stien går tæt ved gårde — vis hensyn til mennesker og dyr.', parking: 'Afmærket parkering ved Rånåvegen.', mapAlt: 'Brochurekort for Rånåkollen: rute fra parkering ved Rånåvegen op til daghytten, med afmærket sti og udsigtspunkt.' },
  'kyllingbrua': { teaser: 'Kort tur til fotopunkt under Kyllingbrua, et af de mest kendte vartegn langs Raumabanen.', description: 'En af de korteste ture i hæftet og en af de mest fotograferede. Stien går ned til Rauma med to flotte fotopunkter og infotavler om broen og Raumabanen.', parking: 'Parkér ved nærbutikken i Verma. Kryds vejen og følg grusstien ned til floden.', mapAlt: 'Brochurekort for Kyllingbrua: rute fra Verma ned til fotopunktet under broen, med parkering og sti.', photoAlt: 'Et tog krydser Kyllingbrua — den kendte stenbuebro langs Raumabanen, set fra fotopunktet under broen.' },
  'eventurskogen': { teaser: 'Familievenlig skattejagt fra Norsk Tindesenter med kort, nøgle og opgaver til børnene.', description: 'En tur lavet for de yngste. Du starter med billet og film på Norsk Tindesenter og får kort og nøgle til at låse kister op i skoven. Alle, der løser opgaverne, får medalje til sidst.', parking: 'Start ved Norsk Tindesenter i Åndalsnes. Billet købes ved start.', mapAlt: 'Brochurekort for EvenTURskogen: rute fra Åndalsnes mod Isfjorden, med parkering, fotopunkter og sti.', photoAlt: 'Børn studerer en infotavle i EvenTURskogen — familieskattejagt ved Norsk Tindesenter i Åndalsnes.' },
  'trollstigfoten': { teaser: 'Rundtur langs floden Istra gennem frodigt landskab under de mægtige fjelde ved foden af Trollstigen.', description: 'En behagelig rundtur langs Istra på begge sider. Stien krydser floden ved foden af Trollstigvejen og fører tilbage ad den historiske kløvsti. Frodig vegetation, brusende flod og fjelde omkring.', parking: 'Start på parkeringen ved Trollstigfoten. Følg skilte ned mod Istra.', mapAlt: 'Brochurekort for Trollstigfoten: rundtur langs Istra under Trollstigen, med parkering og sti.', photoAlt: 'Et vandfald falder ned ad fjeldsiden ved Trollstigfoten — frodig sommernatur ved foden af Trollstigen.' },
  'trollstigen-utkikkspunkt': { teaser: 'Enkel tur fra Trollstigen café til arkitektoniske udsigtspunkter over den berømte Trollstigen-vej.', description: 'En kort gangbro fører til flere arkitektoniske udsigtsplatforme. Den største platform stikker ud over fjeldkanten og svæver over svingene i Trollstigen. Delvist kørestolsvenlig.', parking: 'Start ved Trollstigen café øverst på Trollstigen.', mapAlt: 'Brochurekort for Trollstigen udsigtspunkt: gangbro fra Trollstigen café til udsigtsplatformene, med parkering og udsigtspunkter.', photoAlt: 'En person fotograferer fra Trollstigen udsigtspunkt — udsyn over svingene i Trollstigvejen.' },
  'litlefjellet': { teaser: 'Kort fjeldtur med udsigt mod Trollveggen, Vengetindene, Romsdalshorn og Romsdalen.', description: 'En favorit for både små og store. Stien er let at følge opad, og på toppen åbner landskabet sig mod Trollveggen, Vengetindene og Romsdalshornet. Lidt kuperet, men kort.', parking: 'Parkér ved foden af Litlefjellet i Venjesdalen.', mapAlt: 'Brochurekort for Litlefjellet: rute fra parkering i Venjesdalen op til udsigtspunktet, med afmærket sti.', photoAlt: 'Familie på toptur på Litlefjellet med Romsdalshorn og Vengetindene i baggrunden.' },
};
DA.walks = NO.walks.map((w) => ({ ...w, ...(daWalkOverrides[w.id] ?? {}) }));

const SV: KorteTurerCopy = {
  ...NO,
  seoTitle: 'Korta vandringar runt Bjorli | Lätta turer i Lesja och Rauma',
  seoDescription: 'Hitta korta vandringar runt Bjorli, Lesja och Romsdalen. Utsiktspunkter, kulturmiljöer, familjevänliga turer och kartor för enkla naturupplevelser nära E136 och Raumabanen.',
  ogTitle: 'Korta vandringar runt Bjorli',
  heroEyebrow: 'Sommar på Bjorli · Kort tur',
  heroTitle: 'Korta vandringar runt Bjorli',
  heroSubtitle: 'Från Bjorli har du nära till utsiktspunkter, kulturmiljöer, skogsstigar, älvar och små fjällturer i Lesja och Rauma.',
  heroAlt: 'Dagstugan på Tussheim med sommarvy över Lesja — en typisk kort tur i fjällbygderna runt Bjorli.',
  ctaSeeWalks: 'Se turerna',
  ctaPlanTrip: 'Planera resan hit',
  crumbSommer: 'Sommar',
  crumbHere: 'Korta vandringar runt Bjorli',
  introP1: 'Bjorli ligger mitt emellan Lesja, Romsdalen och fjällen i Reinheimen. Härifrån kan du välja korta turer med stor variation — utsiktspunkter, kulturmiljöer, dagsstugor, älvar, skog och familjevänliga stopp längs vägen.',
  introP2: 'Turerna nedan kommer från broschyren ”Snarturer i Rauma og Lesja” och nås lätt från E136. Flera kan kombineras med en tågtur på Raumabanen, och några ligger så nära vägen att de fungerar som en kort paus mot fjorden.',
  introP3: 'Längderna är tur och retur. Vissa turer är mycket lätta och passar hela familjen. Andra är korta men branta och kräver lite mer av benen. Kolla väder och lokala råd innan du startar.',
  brochureOriginal: 'Originalbroschyr',
  brochureDownload: 'Ladda ner originalbroschyren',
  overviewEyebrow: '10 korta turer',
  overviewTitle: 'Välj en tur',
  readMore: 'Läs mer',
  roundTripPrefix: 'Tur och retur',
  elevationPrefix: 'Stigning',
  startParking: 'Start och parkering',
  mapCaption: 'Kartutsnitt från broschyren ”Snarturer i Rauma og Lesja” (Nordveggen)',
  mixEyebrow: 'Plocka och mixa',
  mixTitle: 'Välj tur efter dagsform',
  mixCards: [
    { title: 'För familjer',                  iconKey: 'family',   walks: ['lesjaverk', 'kulturminner-lesjaskog', 'eventurskogen'] },
    { title: 'För utsikten',                  iconKey: 'view',     walks: ['tussheimbue', 'sveavarden', 'ranakollen', 'litlefjellet'] },
    { title: 'För korta stopp längs vägen',   iconKey: 'roadside', walks: ['kyllingbrua', 'trollstigen-utkikkspunkt'] },
    { title: 'För tåg och kultur',            iconKey: 'train',    walks: ['lesjaverk', 'kyllingbrua', 'tussheimbue', 'sveavarden'] },
  ],
  baseEyebrow: 'Basläger',
  baseTitle: 'Bjorli som bas',
  baseP1: 'Bo på Bjorli och fyll dagarna med små turer i närheten. Ta en lugn kvällstur, stanna vid en fotopunkt längs E136, kombinera med Raumabanen eller använd Bjorli som lugn bas mellan fjäll, dal och fjord.',
  baseP2: 'Nära dig finns Lesjaskogsvatnet, nationalparkerna Reinheimen och Dovrefjell-Sunndalsfjella samt turer mot Romsdalen och Trollstigen. En naturlig utgångspunkt för korta turer och längre dagsturer.',
  baseLinkAccommodation: 'Boende på Bjorli',
  baseLinkFood: 'Mat och dryck',
  baseLinkSummer: 'Sommaraktiviteter',
  baseLinkTravel: 'Resa hit',
  tipsTitle: 'Tänk på under turen',
  tips: [
    'Ta med skräpet hem — även toapapper och våtservetter.',
    'Visa hänsyn till vilda djur och betesdjur.',
    'Håll hunden kopplad där koppeltvång gäller.',
    'Använd toalett där det finns. Annars: gräv en grop på cirka 15 cm och täck igen efteråt.',
    'Kolla väder, förhållanden och lokala råd före turen.',
  ],
  faqTitle: 'Frågor och svar',
  faq: [
    { q: 'Vilka korta turer runt Bjorli passar barn?', a: 'Lesjaverk är en lätt tur ner till Lesjaskogsvatnet med badplats. Kulturminner ved Lesjaskog är en kort kulturrunda för hela familjen. EvenTURskogen i Åndalsnes är en skattjakt för barn med karta, nyckel och uppdrag längs vägen.' },
    { q: 'Vilka turer har bäst utsikt?', a: 'Tussheimbue ger vid utsikt över kulturlandskapet i Lesja och Reinheimen. Sveavarden ligger precis ovanför trädgränsen med utsikt västerut mot Lesjaskogsvatnet. Rånåkollen är kort och brant men ger fin vy över dalen. Litlefjellet i Venjesdalen öppnar sig mot Trollveggen, Vengetindene och Romsdalshornet.' },
    { q: 'Kan turerna kombineras med Raumabanen?', a: 'Ja. Tussheimbue, Sveavarden och Lesjaverk startar nära tågstopp i Lesja, och Kyllingbrua leder till en fotopunkt under den berömda järnvägsbron vid Verma — ett av de mest kända landmärkena längs Raumabanen.' },
    { q: 'Vilka turer passar som korta stopp längs E136?', a: 'Kyllingbrua (0,6 km) och utsiktspunkten Trollstigen (1,2 km) är kortast. Kulturminner ved Lesjaskog (1 km) och Lesjaverk (1,5 km) ligger också vid huvudvägen och passar bra som paus.' },
  ],
  finalTitle: 'Bo på Bjorli och upptäck korta turer i fjällbygderna runt',
  finalBody: 'Välj Bjorli som bas och fyll dagarna med enkla turer, utsiktspunkter, kulturmiljöer och små äventyr mellan fjäll och fjord.',
  finalAccommodation: 'Se boende',
  finalSummer: 'Se sommaraktiviteter',
  finalTravel: 'Resa hit',
  creditEyebrow: 'Källa och kredit',
  creditP1: 'Turtips, kartutsnitt och bildmaterial kommer från broschyren ”Snarturer i Rauma og Lesja”.',
  creditPublisher: 'Utgivare',
  tagLabels: tagsSv,
  walks: NO.walks.map((w) => ({ ...w })),
};
const svWalkOverrides: Partial<Record<WalkId, Partial<WalkCopy>>> = {
  'tussheimbue': { teaser: 'Dagsstuga med vid utsikt över kulturlandskapet i Lesja och Reinheimen nationalpark.', description: 'Uppe väntar en stilfull dagsstuga med utsikt över dalen och fjällen i Reinheimen. Stigen är välpreparerad och markerad hela vägen. Längs vägen finns infotavlor om landskap och kulturhistoria, vid stugan står bänkar och kikare redo.', parking: 'Start i centrala Lesja. Följ den iordningställda stigen genom järnvägsundergången.', mapAlt: 'Broschyrkarta Tussheimbue: rutt från centrala Lesja upp till dagsstugan, med parkering och markerad stig.', photoAlt: 'Dagsstugan på Tussheim med utsikt över kulturlandskapet i Lesja och fjällen i Reinheimen nationalpark.' },
  'sveavarden': { teaser: 'Vandring genom tallskog till ett kummel över trädgränsen, med utsikt mot Lora och Lesjaskogsvatnet.', description: 'Stigen går jämnt uppåt genom fin tallskog och öppnar sig över trädgränsen. Kumlet ligger på en öppen rygg med vid utsikt västerut mot Lesjaskogsvatnet. Väl markerad.', parking: 'Parkera vid Lora station. Följ markerad stig genom järnvägsundergången.', mapAlt: 'Broschyrkarta Sveavarden: rutt från Lora station genom tallskogen upp till kumlet, med parkering och stig.' },
  'lesjaverk': { teaser: 'Lätt tur från Lesjaverk station mot Lesjaskogsvatnet och kulturstigen vid det gamla järnverket.', description: 'En enkel tur som passar alla. Vägen går över järnvägen och ner mot Lesjaskogsvatnet, där det finns en iordningställd badplats. Runt sjön ligger spår efter det gamla järnverket Lesjaverk, och en rundtur på markerad stig är möjlig.', parking: 'Start vid Lesjaverk station. Parkering vid stationen.', mapAlt: 'Broschyrkarta Lesjaverk: rutt från Lesjaverk station ner till Lesjaskogsvatnet, med parkering och markerad stig.', photoAlt: 'Lesjaskogsvatnet en sommardag — en lugn fjällsjö vid det gamla järnverket i Lesjaverk.' },
  'kulturminner-lesjaskog': { teaser: 'Kort kulturvandring vid Lesjaskog kyrkje, med historiska byggnader, krigsminnen och spår efter det tidigare järnverket.', description: 'En liten runda i bygden där QR-koder ger mer information vid varje stopp. Ett fint stopp för familjer som vill ha en kort, lugn paus med historia.', parking: 'Parkera vid Bunnpris Lesjaskog och följ vägen till kulturminnesområdet.', mapAlt: 'Broschyrkarta kulturvandring Lesjaskog: runda kring Lesjaskog kyrkje, med parkering och infopunkter.' },
  'ranakollen': { teaser: 'Kort men brant tur till dagsstugan på Rånåkollen, med utsikt över dalen och in mot högfjället.', description: 'En snabb stigning som ger mycket tillbaka. Den markerade stigen leder till en öppen dagsstuga på toppen med fri utsikt över dalen och vidare mot fjällen. Stigen går nära gårdar — visa hänsyn till människor och djur.', parking: 'Markerad parkering vid Rånåvegen.', mapAlt: 'Broschyrkarta Rånåkollen: rutt från parkering vid Rånåvegen upp till dagsstugan, med markerad stig och utsiktspunkt.' },
  'kyllingbrua': { teaser: 'Kort tur till en fotopunkt under Kyllingbrua, ett av de mest kända landmärkena längs Raumabanen.', description: 'En av de kortaste turerna i häftet och en av de mest fotograferade. Stigen går ner till Rauma med två fina fotopunkter och infotavlor om bron och Raumabanen.', parking: 'Parkera vid närbutiken i Verma. Korsa vägen och följ grusstigen ner till älven.', mapAlt: 'Broschyrkarta Kyllingbrua: rutt från Verma ner till fotopunkten under bron, med parkering och stig.', photoAlt: 'Ett tåg passerar Kyllingbrua — den välkända stenbågen längs Raumabanen, sedd från fotopunkten under bron.' },
  'eventurskogen': { teaser: 'Familjevänlig skattjakt från Norsk Tindesenter med karta, nyckel och uppdrag till barnen.', description: 'En tur för de yngsta. Du börjar med biljett och film på Norsk Tindesenter och får karta och nyckel för att låsa upp kistor i skogen. Alla som löser uppdragen får medalj i slutet.', parking: 'Start vid Norsk Tindesenter i Åndalsnes. Biljett köps vid start.', mapAlt: 'Broschyrkarta EvenTURskogen: rutt från Åndalsnes mot Isfjorden, med parkering, fotopunkter och stig.', photoAlt: 'Barn studerar en infotavla i EvenTURskogen — familjeskattjakt vid Norsk Tindesenter i Åndalsnes.' },
  'trollstigfoten': { teaser: 'Rundtur längs älven Istra genom frodigt landskap under de mäktiga fjällen vid foten av Trollstigen.', description: 'En behaglig rundtur längs Istra på båda sidor. Stigen korsar älven vid foten av Trollstigvägen och leder tillbaka längs den historiska klövstigen. Frodig växtlighet, brusande älv och fjäll runtom.', parking: 'Start på parkeringen vid Trollstigfoten. Följ skyltar ned mot Istra.', mapAlt: 'Broschyrkarta Trollstigfoten: rundtur längs Istra under Trollstigen, med parkering och stig.', photoAlt: 'Ett vattenfall faller längs bergssidan vid Trollstigfoten — frodig sommarnatur vid foten av Trollstigen.' },
  'trollstigen-utkikkspunkt': { teaser: 'Enkel tur från Trollstigen café till arkitektoniska utsiktspunkter över den berömda Trollstigen-vägen.', description: 'En kort gångväg leder till flera arkitektoniska utsiktsplattformar. Den största plattformen sticker ut över bergskanten och svävar över Trollstigens slingor. Delvis rullstolsvänlig.', parking: 'Start vid Trollstigen café överst på Trollstigen.', mapAlt: 'Broschyrkarta Trollstigen utsiktspunkt: gångväg från Trollstigen café till utsiktsplattformerna, med parkering och utsiktspunkter.', photoAlt: 'En person fotograferar från Trollstigen utsiktspunkt — vy över slingorna i Trollstigvägen.' },
  'litlefjellet': { teaser: 'Kort fjälltur med utsikt mot Trollveggen, Vengetindene, Romsdalshorn och Romsdalen.', description: 'En favorit för både små och stora. Stigen är lätt att följa uppåt, och på toppen öppnar sig landskapet mot Trollveggen, Vengetindene och Romsdalshornet. Lite kuperat men kort.', parking: 'Parkera vid foten av Litlefjellet i Venjesdalen.', mapAlt: 'Broschyrkarta Litlefjellet: rutt från parkering i Venjesdalen upp till utsiktspunkten, med markerad stig.', photoAlt: 'Familj på topptur på Litlefjellet med Romsdalshorn och Vengetindene i bakgrunden.' },
};
SV.walks = NO.walks.map((w) => ({ ...w, ...(svWalkOverrides[w.id] ?? {}) }));

export const KORTE_TURER_COPY: Record<Locale, KorteTurerCopy> = { no: NO, en: EN, de: DE, nl: NL, da: DA, sv: SV };
