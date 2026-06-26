import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink, Fish, MapPin, Info } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { images } from '@/lib/images';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import type { Locale } from '@/i18n/locales/types';

const INATUR_VANNSKILLET = 'https://www.inatur.no/fiske/50f405d8e4b0e07d03ec36f9';
const INATUR_SONE7 = 'https://www.inatur.no/fiske/5ec50b50dbe4590003613e7e';
const LESJA_FJELLSTYRE = 'https://www.lesja-fjellstyre.no/';

const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

type Zone = { title: string; text: string; cta: string };
type Faq = { q: string; a: string };
type LinkItem = { to: string; label: string };

type Copy = {
  metaTitle: string;
  metaDesc: string;
  schemaName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroAlt: string;
  breadcrumbAria: string;
  crumbHome: string;
  crumbSummer: string;
  crumbFishing: string;
  introTitle: string;
  introP1: string;
  introP2: string;
  ctaInatur: string;
  zonesTitle: string;
  zones: [Zone, Zone, Zone];
  lakeTitle: string;
  lakeP1: string;
  lakeP2: string;
  lakeCta: string;
  lakeAlt: string;
  flyTitle: string;
  flyP1: string;
  flyCta: string;
  flyAlt: string;
  mountainTitle: string;
  mountainBullets: string[];
  mountainCta: string;
  mountainAlt: string;
  practicalTitle: string;
  practicalBullets: string[];
  faqTitle: string;
  faqs: Faq[];
  moreTitle: string;
  moreLinks: LinkItem[];
};

const COPY: Record<Locale, Copy> = {
  no: {
    metaTitle: 'Fiske på Bjorli | Ørret, fjellfiske og fluefiske',
    metaDesc: 'Opplev fiske på Bjorli og i Lesja med fjellvann, elver, fluefiskesoner og Lesjaskogsvatnet. Finn fiskekort, soner og nyttige lenker.',
    schemaName: 'Fiske på Bjorli',
    heroTitle: 'Fiske på Bjorli',
    heroSubtitle: 'Med fjellvann, klare elver og korte avstander til ørretfiske og fluefiske er Bjorli et godt utgangspunkt for familievennlige fiskedager i Lesja.',
    heroAlt: 'Fiske ved Bjorli',
    breadcrumbAria: 'Brødsmuler',
    crumbHome: 'Bjorli', crumbSummer: 'Sommer', crumbFishing: 'Fiske',
    introTitle: 'Fiske på Bjorli og i Lesja',
    introP1: 'Lesja er delt opp i tre fiskesoner. Fiskerettene forvaltes av Lesjaskogsvatnet fiskeforening, Lesja fjellstyre og A/L Lågen fiskeelv.',
    introP2: 'Fiskekort kan kjøpes i dagligvareforretningene i Lesja, Hydro Texaco Bjorli, Sjong Seter på Dalsida eller på iNatur.no.',
    ctaInatur: 'Kjøp fiskekort på iNatur',
    zonesTitle: 'Fiskesoner i Lesja',
    zones: [
      { title: 'Lesjaskogsvatnet fiskeforening', text: 'Gjelder Lesjaskogsvatnet, Lågen ned til den gamle sognegrensen, Rauma ned til fylkesgrensen og vann og elver innenfor Lesjaskog Heimrast.', cta: 'Fiske på vannskillet' },
      { title: 'Lesja fjellstyre', text: 'Lordalen statsallmenning og Dalsida statsallmenning har store fjellområder med mange fiskevann, elver og bekker.', cta: 'Les mer hos Lesja fjellstyre' },
      { title: 'A/L Lågen fiskeelv', text: 'Gjelder Lågen i Lesja kommune, sone 7, til utløp av Skråkka, samt nedre del av Lora elv.', cta: 'Se fiskekort sone 7' },
    ],
    lakeTitle: 'Fiske på Lesjaskogsvatnet og Bjorli',
    lakeP1: 'På Lesjaskogsvatnet, Fremre Bøvervatn og Bøvertjønnene kan utenbygdsboende fiske med stang. Oterfiske er mulig med fiskekort som inkluderer dette. I resten av området er det stangfiske som gjelder.',
    lakeP2: 'Fisket administreres av Lesjaskogsvatnet Fiskeforening.',
    lakeCta: 'Fiske på vannskillet',
    lakeAlt: 'Lesjaskogsvatnet ved Bjorli',
    flyTitle: 'Fluefiskesonene i Lesja',
    flyP1: 'Gudbrandsdalslågen i Lesja byr på spennende fiske. Fluefiskesonen åpnet i 2020. Det er enkel adkomst til elva. Det er etablert to fluesoner på totalt ca. 6 km, og elva er lett tilgjengelig med bil og har krystallklart vann.',
    flyCta: 'Fiskekort sone 7',
    flyAlt: 'Fluefiske i klar elv i Lesja',
    mountainTitle: 'Fiske i Lesjafjella',
    mountainBullets: [
      'Dalsida statsallmenning og Lordalen statsallmenning har ca. 230 fiskevann og rundt 180 km elver og bekker med fisk.',
      'Det finnes ørret i alle vann, elver og bekker med fisk.',
      'Det finnes røye på vann nede i dalen på Dalsida.',
      'Det finnes harr i Aursjøbassenget, Vangsvatnet og Vangstjønn.',
      'Jora er en spesielt god fiskeelv med årlige fangster av ørret over kiloen.',
      'Flere av fjellstyrets utleiehytter og buer ligger nær gode fiskemuligheter.',
      'Det er ikke tillatt å ha med eller bruke levende fisk som agn.',
      'Det finnes både elvestrekninger for fluefiske, høyfjellsfiske og fiskevann nær vei for barnefamilier.',
    ],
    mountainCta: 'Les mer hos Lesja fjellstyre',
    mountainAlt: 'Fjellfiske i Lesjafjella',
    practicalTitle: 'Praktisk informasjon',
    practicalBullets: [
      'Sjekk alltid gjeldende regler før du fisker.',
      'Kjøp riktig fiskekort for området du skal fiske i.',
      'Noen områder har egne regler for redskap, stangfiske og oter.',
      'Levende fisk som agn er ikke tillatt i områdene beskrevet av Lesja fjellstyre.',
      'Bruk lenkene på siden for oppdatert informasjon fra forvalterne.',
    ],
    faqTitle: 'Ofte stilte spørsmål',
    faqs: [
      { q: 'Hvor kjøper jeg fiskekort på Bjorli?', a: 'Fiskekort kan kjøpes lokalt i Lesja og Bjorli på følgende steder: Coop Marked Lesjaverk, Aaheim Camping, Lesjaskogvatnet Camping, Bunnpris Lesjaskog, og Bjorli Bensin/YX. Barn opp til og med fylte 16 år fisker gratis med stang. Samt via iNatur-lenkene på denne siden.' },
      { q: 'Kan jeg fiske i Lesjaskogsvatnet?', a: 'Ja, utenbygdsboende kan fiske med stang på Lesjaskogsvatnet, Fremre Bøvervatn og Bøvertjønnene. Oter krever fiskekort som inkluderer dette.' },
      { q: 'Finnes det fluefiske på Bjorli?', a: 'Ja, i Gudbrandsdalslågen i Lesja finnes to fluefiskesoner med totalt ca. 6 km.' },
    ],
    moreTitle: 'Utforsk mer på Bjorli',
    moreLinks: [
      { to: '/sommer', label: 'Sommer på Bjorli' },
      { to: '/aktiviteter', label: 'Aktiviteter' },
      { to: '/overnatting', label: 'Overnatting' },
      { to: '/reisen-hit', label: 'Reisen hit' },
      { to: '/mat-og-drikke', label: 'Mat og drikke' },
    ],
  },
  en: {
    metaTitle: 'Fishing at Bjorli | Trout, mountain fishing and fly fishing',
    metaDesc: 'Fishing at Bjorli and in Lesja — mountain lakes, rivers, fly-fishing zones and Lesjaskogsvatnet. Find fishing licences, zones and useful links.',
    schemaName: 'Fishing at Bjorli',
    heroTitle: 'Fishing at Bjorli',
    heroSubtitle: 'With mountain lakes, clear rivers and short distances to trout and fly fishing, Bjorli is a good base for family-friendly fishing days in Lesja.',
    heroAlt: 'Fishing near Bjorli',
    breadcrumbAria: 'Breadcrumb',
    crumbHome: 'Bjorli', crumbSummer: 'Summer', crumbFishing: 'Fishing',
    introTitle: 'Fishing at Bjorli and in Lesja',
    introP1: 'Lesja is divided into three fishing zones. The fishing rights are managed by Lesjaskogsvatnet fiskeforening, Lesja fjellstyre and A/L Lågen fiskeelv.',
    introP2: 'Fishing licences can be bought at the local grocery shops in Lesja, at Hydro Texaco Bjorli, at Sjong Seter on Dalsida or at iNatur.no.',
    ctaInatur: 'Buy fishing licence at iNatur',
    zonesTitle: 'Fishing zones in Lesja',
    zones: [
      { title: 'Lesjaskogsvatnet fiskeforening', text: 'Covers Lesjaskogsvatnet, the Lågen down to the old parish border, the Rauma down to the county border, and lakes and rivers within Lesjaskog Heimrast.', cta: 'Fishing at the watershed' },
      { title: 'Lesja fjellstyre', text: 'The state commons of Lordalen and Dalsida have large mountain areas with many fishing lakes, rivers and streams.', cta: 'Read more at Lesja fjellstyre' },
      { title: 'A/L Lågen fiskeelv', text: 'Covers the Lågen in Lesja municipality, zone 7, down to the outlet of the Skråkka, and the lower part of the Lora river.', cta: 'See zone 7 fishing licence' },
    ],
    lakeTitle: 'Fishing at Lesjaskogsvatnet and Bjorli',
    lakeP1: 'At Lesjaskogsvatnet, Fremre Bøvervatn and Bøvertjønnene, non-residents may fish with rod. Otter fishing is allowed with a licence that includes it. In the rest of the area, rod fishing applies.',
    lakeP2: 'The fishing is administered by Lesjaskogsvatnet Fiskeforening.',
    lakeCta: 'Fishing at the watershed',
    lakeAlt: 'Lesjaskogsvatnet near Bjorli',
    flyTitle: 'Fly-fishing zones in Lesja',
    flyP1: 'The Gudbrandsdalslågen river in Lesja offers interesting fishing. The fly-fishing zone opened in 2020. Access to the river is easy. Two fly zones totalling about 6 km have been set up, the river is easy to reach by car and has crystal-clear water.',
    flyCta: 'Zone 7 fishing licence',
    flyAlt: 'Fly fishing in a clear river in Lesja',
    mountainTitle: 'Fishing in the Lesja mountains',
    mountainBullets: [
      'The state commons of Dalsida and Lordalen have around 230 fishing lakes and about 180 km of rivers and streams with fish.',
      'Trout is found in all lakes, rivers and streams with fish.',
      'Char is found in lakes down in the valley on Dalsida.',
      'Grayling is found in the Aursjø basin, Vangsvatnet and Vangstjønn.',
      'The Jora is a particularly good fishing river with annual catches of trout over one kilo.',
      'Several of the fjellstyre rental cabins and huts are located near good fishing.',
      'Bringing or using live fish as bait is not permitted.',
      'There are river stretches for fly fishing, high-mountain fishing and fishing lakes close to the road for families with children.',
    ],
    mountainCta: 'Read more at Lesja fjellstyre',
    mountainAlt: 'Mountain fishing in the Lesja mountains',
    practicalTitle: 'Practical information',
    practicalBullets: [
      'Always check the current rules before you fish.',
      'Buy the correct fishing licence for the area you will fish in.',
      'Some areas have their own rules for gear, rod fishing and otter.',
      'Live fish as bait is not allowed in the areas described by Lesja fjellstyre.',
      'Use the links on this page for up-to-date information from the managers.',
    ],
    faqTitle: 'Frequently asked questions',
    faqs: [
      { q: 'Where do I buy a fishing licence at Bjorli?', a: 'Fishing licences can be bought locally in Lesja and Bjorli at: Coop Marked Lesjaverk, Aaheim Camping, Lesjaskogvatnet Camping, Bunnpris Lesjaskog and Bjorli Bensin/YX. Children up to and including the year they turn 16 fish for free with a rod. They are also available via the iNatur links on this page.' },
      { q: 'Can I fish in Lesjaskogsvatnet?', a: 'Yes, non-residents may fish with a rod in Lesjaskogsvatnet, Fremre Bøvervatn and Bøvertjønnene. Otter fishing requires a licence that includes it.' },
      { q: 'Is there fly fishing at Bjorli?', a: 'Yes, in the Gudbrandsdalslågen in Lesja there are two fly-fishing zones totalling about 6 km.' },
    ],
    moreTitle: 'Explore more at Bjorli',
    moreLinks: [
      { to: '/sommer', label: 'Summer at Bjorli' },
      { to: '/aktiviteter', label: 'Activities' },
      { to: '/overnatting', label: 'Accommodation' },
      { to: '/reisen-hit', label: 'Getting here' },
      { to: '/mat-og-drikke', label: 'Food and drink' },
    ],
  },
  de: {
    metaTitle: 'Angeln in Bjorli | Forelle, Bergfischen und Fliegenfischen',
    metaDesc: 'Angeln in Bjorli und Lesja — Bergseen, Flüsse, Fliegenfischzonen und Lesjaskogsvatnet. Angelkarten, Zonen und nützliche Links.',
    schemaName: 'Angeln in Bjorli',
    heroTitle: 'Angeln in Bjorli',
    heroSubtitle: 'Mit Bergseen, klaren Flüssen und kurzen Wegen zum Forellen- und Fliegenfischen ist Bjorli ein guter Ausgangspunkt für familienfreundliche Angeltage in Lesja.',
    heroAlt: 'Angeln bei Bjorli',
    breadcrumbAria: 'Brotkrumen',
    crumbHome: 'Bjorli', crumbSummer: 'Sommer', crumbFishing: 'Angeln',
    introTitle: 'Angeln in Bjorli und Lesja',
    introP1: 'Lesja ist in drei Fischereizonen unterteilt. Die Fischrechte werden von Lesjaskogsvatnet fiskeforening, Lesja fjellstyre und A/L Lågen fiskeelv verwaltet.',
    introP2: 'Angelkarten sind in den Lebensmittelgeschäften in Lesja, bei Hydro Texaco Bjorli, am Sjong Seter auf Dalsida oder auf iNatur.no erhältlich.',
    ctaInatur: 'Angelkarte auf iNatur kaufen',
    zonesTitle: 'Fischereizonen in Lesja',
    zones: [
      { title: 'Lesjaskogsvatnet fiskeforening', text: 'Umfasst Lesjaskogsvatnet, die Lågen bis zur alten Pfarrgrenze, die Rauma bis zur Provinzgrenze sowie Seen und Flüsse innerhalb von Lesjaskog Heimrast.', cta: 'Angeln an der Wasserscheide' },
      { title: 'Lesja fjellstyre', text: 'Die Staatsallmende Lordalen und Dalsida umfasst große Berggebiete mit vielen Fischseen, Flüssen und Bächen.', cta: 'Mehr bei Lesja fjellstyre' },
      { title: 'A/L Lågen fiskeelv', text: 'Umfasst die Lågen in der Kommune Lesja, Zone 7, bis zur Mündung der Skråkka, sowie den unteren Teil der Lora.', cta: 'Angelkarte Zone 7' },
    ],
    lakeTitle: 'Angeln am Lesjaskogsvatnet und in Bjorli',
    lakeP1: 'Am Lesjaskogsvatnet, am Fremre Bøvervatn und an den Bøvertjønnene dürfen auch Auswärtige mit der Rute fischen. Otterfischen ist mit einer entsprechenden Angelkarte möglich. Im übrigen Gebiet gilt Rutenfischerei.',
    lakeP2: 'Das Fischen wird von der Lesjaskogsvatnet Fiskeforening verwaltet.',
    lakeCta: 'Angeln an der Wasserscheide',
    lakeAlt: 'Lesjaskogsvatnet bei Bjorli',
    flyTitle: 'Fliegenfischzonen in Lesja',
    flyP1: 'Die Gudbrandsdalslågen in Lesja bietet spannendes Fischen. Die Fliegenfischzone wurde 2020 eröffnet. Der Zugang zum Fluss ist einfach. Es gibt zwei Fliegenzonen mit insgesamt ca. 6 km, der Fluss ist gut mit dem Auto erreichbar und führt glasklares Wasser.',
    flyCta: 'Angelkarte Zone 7',
    flyAlt: 'Fliegenfischen in einem klaren Fluss in Lesja',
    mountainTitle: 'Angeln in den Lesja-Bergen',
    mountainBullets: [
      'Die Staatsallmende Dalsida und Lordalen umfasst rund 230 Fischseen und etwa 180 km Flüsse und Bäche mit Fisch.',
      'Forelle gibt es in allen Seen, Flüssen und Bächen mit Fisch.',
      'Saibling kommt in Seen unten im Tal auf Dalsida vor.',
      'Äsche gibt es im Aursjø-Becken, im Vangsvatnet und im Vangstjønn.',
      'Die Jora ist ein besonders guter Fischfluss mit jährlichen Forellenfängen über einem Kilo.',
      'Mehrere Mietshütten und -buden des fjellstyre liegen nahe guten Angelmöglichkeiten.',
      'Lebende Fische als Köder mitzuführen oder zu verwenden ist nicht erlaubt.',
      'Es gibt Flussabschnitte für Fliegenfischen, Hochgebirgsangeln und Fischseen nahe der Straße für Familien mit Kindern.',
    ],
    mountainCta: 'Mehr bei Lesja fjellstyre',
    mountainAlt: 'Bergfischen in den Lesja-Bergen',
    practicalTitle: 'Praktische Hinweise',
    practicalBullets: [
      'Prüfen Sie immer die aktuellen Regeln, bevor Sie fischen.',
      'Kaufen Sie die richtige Angelkarte für das Gebiet, in dem Sie fischen möchten.',
      'Einige Gebiete haben eigene Regeln für Gerät, Rutenfischen und Otter.',
      'In den von Lesja fjellstyre beschriebenen Gebieten sind lebende Fische als Köder nicht erlaubt.',
      'Nutzen Sie die Links auf dieser Seite für aktuelle Informationen der Verwalter.',
    ],
    faqTitle: 'Häufig gestellte Fragen',
    faqs: [
      { q: 'Wo kaufe ich in Bjorli eine Angelkarte?', a: 'Angelkarten gibt es vor Ort in Lesja und Bjorli bei: Coop Marked Lesjaverk, Aaheim Camping, Lesjaskogvatnet Camping, Bunnpris Lesjaskog und Bjorli Bensin/YX. Kinder bis einschließlich dem Jahr, in dem sie 16 werden, fischen kostenlos mit der Rute. Sie sind auch über die iNatur-Links auf dieser Seite erhältlich.' },
      { q: 'Darf ich im Lesjaskogsvatnet fischen?', a: 'Ja, Auswärtige dürfen mit der Rute im Lesjaskogsvatnet, Fremre Bøvervatn und in den Bøvertjønnene fischen. Otterfischen erfordert eine entsprechende Angelkarte.' },
      { q: 'Gibt es Fliegenfischen in Bjorli?', a: 'Ja, in der Gudbrandsdalslågen in Lesja gibt es zwei Fliegenfischzonen mit insgesamt ca. 6 km.' },
    ],
    moreTitle: 'Mehr in Bjorli entdecken',
    moreLinks: [
      { to: '/sommer', label: 'Sommer in Bjorli' },
      { to: '/aktiviteter', label: 'Aktivitäten' },
      { to: '/overnatting', label: 'Unterkünfte' },
      { to: '/reisen-hit', label: 'Anreise' },
      { to: '/mat-og-drikke', label: 'Essen und Trinken' },
    ],
  },
  nl: {
    metaTitle: 'Vissen op Bjorli | Forel, bergvissen en vliegvissen',
    metaDesc: 'Vissen op Bjorli en in Lesja — bergmeren, rivieren, vliegviszones en Lesjaskogsvatnet. Vergunningen, zones en handige links.',
    schemaName: 'Vissen op Bjorli',
    heroTitle: 'Vissen op Bjorli',
    heroSubtitle: 'Met bergmeren, heldere rivieren en korte afstanden tot forel- en vliegvissen is Bjorli een goed uitvalsbasis voor gezinsvriendelijke visdagen in Lesja.',
    heroAlt: 'Vissen bij Bjorli',
    breadcrumbAria: 'Kruimelpad',
    crumbHome: 'Bjorli', crumbSummer: 'Zomer', crumbFishing: 'Vissen',
    introTitle: 'Vissen op Bjorli en in Lesja',
    introP1: 'Lesja is verdeeld in drie viszones. De visrechten worden beheerd door Lesjaskogsvatnet fiskeforening, Lesja fjellstyre en A/L Lågen fiskeelv.',
    introP2: 'Visvergunningen zijn te koop bij de supermarkten in Lesja, bij Hydro Texaco Bjorli, bij Sjong Seter op Dalsida of via iNatur.no.',
    ctaInatur: 'Koop visvergunning op iNatur',
    zonesTitle: 'Viszones in Lesja',
    zones: [
      { title: 'Lesjaskogsvatnet fiskeforening', text: 'Geldt voor Lesjaskogsvatnet, de Lågen tot de oude parochiegrens, de Rauma tot de provinciegrens en meren en rivieren binnen Lesjaskog Heimrast.', cta: 'Vissen op de waterscheiding' },
      { title: 'Lesja fjellstyre', text: 'De staatscommons Lordalen en Dalsida omvatten grote berggebieden met veel vismeren, rivieren en beken.', cta: 'Meer bij Lesja fjellstyre' },
      { title: 'A/L Lågen fiskeelv', text: 'Geldt voor de Lågen in de gemeente Lesja, zone 7, tot de monding van de Skråkka, en het onderste deel van de Lora.', cta: 'Visvergunning zone 7' },
    ],
    lakeTitle: 'Vissen op Lesjaskogsvatnet en Bjorli',
    lakeP1: 'Op Lesjaskogsvatnet, Fremre Bøvervatn en de Bøvertjønnene mogen niet-inwoners met de hengel vissen. Otterssvissen is mogelijk met een vergunning die dit omvat. In de rest van het gebied geldt hengelvissen.',
    lakeP2: 'Het vissen wordt beheerd door Lesjaskogsvatnet Fiskeforening.',
    lakeCta: 'Vissen op de waterscheiding',
    lakeAlt: 'Lesjaskogsvatnet bij Bjorli',
    flyTitle: 'Vliegviszones in Lesja',
    flyP1: 'De Gudbrandsdalslågen in Lesja biedt boeiend vissen. De vliegviszone opende in 2020. De toegang tot de rivier is eenvoudig. Er zijn twee vliegzones van samen ongeveer 6 km, de rivier is goed bereikbaar met de auto en heeft kristalhelder water.',
    flyCta: 'Visvergunning zone 7',
    flyAlt: 'Vliegvissen in een heldere rivier in Lesja',
    mountainTitle: 'Vissen in de Lesja-bergen',
    mountainBullets: [
      'De staatscommons Dalsida en Lordalen tellen ongeveer 230 vismeren en zo’n 180 km rivieren en beken met vis.',
      'In alle meren, rivieren en beken met vis komt forel voor.',
      'Riddervis (røye) komt voor in meren beneden in het dal op Dalsida.',
      'Vlagzalm komt voor in het Aursjø-bekken, in Vangsvatnet en Vangstjønn.',
      'De Jora is een bijzonder goede visrivier met jaarlijks vangsten van forel boven de kilo.',
      'Meerdere huurhutten en buen van het fjellstyre liggen bij goede visplekken.',
      'Levende vis als aas meenemen of gebruiken is niet toegestaan.',
      'Er zijn rivierdelen voor vliegvissen, hooggebergtevissen en vismeren dicht bij de weg voor gezinnen met kinderen.',
    ],
    mountainCta: 'Meer bij Lesja fjellstyre',
    mountainAlt: 'Bergvissen in de Lesja-bergen',
    practicalTitle: 'Praktische informatie',
    practicalBullets: [
      'Controleer altijd de actuele regels voordat je gaat vissen.',
      'Koop de juiste visvergunning voor het gebied waar je gaat vissen.',
      'Sommige gebieden hebben eigen regels voor materiaal, hengelvissen en ottersvissen.',
      'Levende vis als aas is niet toegestaan in de gebieden van Lesja fjellstyre.',
      'Gebruik de links op deze pagina voor actuele informatie van de beheerders.',
    ],
    faqTitle: 'Veelgestelde vragen',
    faqs: [
      { q: 'Waar koop ik een visvergunning op Bjorli?', a: 'Visvergunningen zijn lokaal verkrijgbaar in Lesja en Bjorli bij: Coop Marked Lesjaverk, Aaheim Camping, Lesjaskogvatnet Camping, Bunnpris Lesjaskog en Bjorli Bensin/YX. Kinderen tot en met het jaar waarin ze 16 worden, vissen gratis met de hengel. Ook via de iNatur-links op deze pagina.' },
      { q: 'Mag ik in Lesjaskogsvatnet vissen?', a: 'Ja, niet-inwoners mogen met de hengel vissen in Lesjaskogsvatnet, Fremre Bøvervatn en de Bøvertjønnene. Ottersvissen vereist een vergunning die dit omvat.' },
      { q: 'Is er vliegvissen op Bjorli?', a: 'Ja, in de Gudbrandsdalslågen in Lesja zijn twee vliegviszones van samen ongeveer 6 km.' },
    ],
    moreTitle: 'Ontdek meer op Bjorli',
    moreLinks: [
      { to: '/sommer', label: 'Zomer op Bjorli' },
      { to: '/aktiviteter', label: 'Activiteiten' },
      { to: '/overnatting', label: 'Accommodatie' },
      { to: '/reisen-hit', label: 'Reisinformatie' },
      { to: '/mat-og-drikke', label: 'Eten en drinken' },
    ],
  },
  da: {
    metaTitle: 'Fiskeri på Bjorli | Ørred, fjeldfiskeri og fluefiskeri',
    metaDesc: 'Fiskeri på Bjorli og i Lesja — fjeldsøer, elve, fluefiskezoner og Lesjaskogsvatnet. Find fiskekort, zoner og nyttige links.',
    schemaName: 'Fiskeri på Bjorli',
    heroTitle: 'Fiskeri på Bjorli',
    heroSubtitle: 'Med fjeldsøer, klare elve og korte afstande til ørred- og fluefiskeri er Bjorli et godt udgangspunkt for familievenlige fiskedage i Lesja.',
    heroAlt: 'Fiskeri ved Bjorli',
    breadcrumbAria: 'Brødkrummer',
    crumbHome: 'Bjorli', crumbSummer: 'Sommer', crumbFishing: 'Fiskeri',
    introTitle: 'Fiskeri på Bjorli og i Lesja',
    introP1: 'Lesja er opdelt i tre fiskezoner. Fiskerettighederne forvaltes af Lesjaskogsvatnet fiskeforening, Lesja fjellstyre og A/L Lågen fiskeelv.',
    introP2: 'Fiskekort kan købes i dagligvarebutikkerne i Lesja, hos Hydro Texaco Bjorli, på Sjong Seter på Dalsida eller på iNatur.no.',
    ctaInatur: 'Køb fiskekort på iNatur',
    zonesTitle: 'Fiskezoner i Lesja',
    zones: [
      { title: 'Lesjaskogsvatnet fiskeforening', text: 'Gælder Lesjaskogsvatnet, Lågen ned til den gamle sognegrænse, Rauma ned til amtsgrænsen og søer og elve inden for Lesjaskog Heimrast.', cta: 'Fiskeri på vandskillet' },
      { title: 'Lesja fjellstyre', text: 'Lordalen statsallmenning og Dalsida statsallmenning rummer store fjeldområder med mange fiskesøer, elve og bække.', cta: 'Læs mere hos Lesja fjellstyre' },
      { title: 'A/L Lågen fiskeelv', text: 'Gælder Lågen i Lesja kommune, zone 7, til udløbet af Skråkka, samt den nedre del af Lora elv.', cta: 'Se fiskekort zone 7' },
    ],
    lakeTitle: 'Fiskeri på Lesjaskogsvatnet og Bjorli',
    lakeP1: 'På Lesjaskogsvatnet, Fremre Bøvervatn og Bøvertjønnene må udenbysboende fiske med stang. Oterfiskeri er muligt med fiskekort, der omfatter det. I resten af området gælder stangfiskeri.',
    lakeP2: 'Fiskeriet administreres af Lesjaskogsvatnet Fiskeforening.',
    lakeCta: 'Fiskeri på vandskillet',
    lakeAlt: 'Lesjaskogsvatnet ved Bjorli',
    flyTitle: 'Fluefiskezonerne i Lesja',
    flyP1: 'Gudbrandsdalslågen i Lesja byder på spændende fiskeri. Fluefiskezonen åbnede i 2020. Der er let adgang til elven. Der er etableret to fluezoner på i alt ca. 6 km, og elven er let tilgængelig med bil og har krystalklart vand.',
    flyCta: 'Fiskekort zone 7',
    flyAlt: 'Fluefiskeri i en klar elv i Lesja',
    mountainTitle: 'Fiskeri i Lesjafjeldene',
    mountainBullets: [
      'Dalsida statsallmenning og Lordalen statsallmenning rummer ca. 230 fiskesøer og omkring 180 km elve og bække med fisk.',
      'Ørred findes i alle søer, elve og bække med fisk.',
      'Røding findes i søer nede i dalen på Dalsida.',
      'Stalling findes i Aursjø-bassinet, Vangsvatnet og Vangstjønn.',
      'Jora er en særligt god fiskeelv med årlige fangster af ørred over et kilo.',
      'Flere af fjellstyrets udlejningshytter og boder ligger nær gode fiskemuligheder.',
      'Det er ikke tilladt at medbringe eller bruge levende fisk som agn.',
      'Der findes både elvstrækninger til fluefiskeri, højfjeldsfiskeri og fiskesøer nær vej for børnefamilier.',
    ],
    mountainCta: 'Læs mere hos Lesja fjellstyre',
    mountainAlt: 'Fjeldfiskeri i Lesjafjeldene',
    practicalTitle: 'Praktisk information',
    practicalBullets: [
      'Tjek altid de gældende regler, før du fisker.',
      'Køb det rette fiskekort til området, hvor du vil fiske.',
      'Nogle områder har egne regler for grej, stangfiskeri og oter.',
      'Levende fisk som agn er ikke tilladt i de områder, Lesja fjellstyre beskriver.',
      'Brug linkene på siden for opdateret information fra forvalterne.',
    ],
    faqTitle: 'Ofte stillede spørgsmål',
    faqs: [
      { q: 'Hvor køber jeg fiskekort på Bjorli?', a: 'Fiskekort kan købes lokalt i Lesja og Bjorli hos: Coop Marked Lesjaverk, Aaheim Camping, Lesjaskogvatnet Camping, Bunnpris Lesjaskog og Bjorli Bensin/YX. Børn til og med det år, de fylder 16, fisker gratis med stang. Også via iNatur-linkene på denne side.' },
      { q: 'Må jeg fiske i Lesjaskogsvatnet?', a: 'Ja, udenbysboende må fiske med stang i Lesjaskogsvatnet, Fremre Bøvervatn og Bøvertjønnene. Oter kræver fiskekort, der omfatter det.' },
      { q: 'Findes der fluefiskeri på Bjorli?', a: 'Ja, i Gudbrandsdalslågen i Lesja findes to fluefiskezoner på i alt ca. 6 km.' },
    ],
    moreTitle: 'Udforsk mere på Bjorli',
    moreLinks: [
      { to: '/sommer', label: 'Sommer på Bjorli' },
      { to: '/aktiviteter', label: 'Aktiviteter' },
      { to: '/overnatting', label: 'Overnatning' },
      { to: '/reisen-hit', label: 'Sådan kommer du hertil' },
      { to: '/mat-og-drikke', label: 'Mad og drikke' },
    ],
  },
  sv: {
    metaTitle: 'Fiske på Bjorli | Öring, fjällfiske och flugfiske',
    metaDesc: 'Fiske på Bjorli och i Lesja — fjällsjöar, älvar, flugfiskezoner och Lesjaskogsvatnet. Hitta fiskekort, zoner och användbara länkar.',
    schemaName: 'Fiske på Bjorli',
    heroTitle: 'Fiske på Bjorli',
    heroSubtitle: 'Med fjällsjöar, klara älvar och korta avstånd till öring- och flugfiske är Bjorli en bra utgångspunkt för familjevänliga fiskedagar i Lesja.',
    heroAlt: 'Fiske vid Bjorli',
    breadcrumbAria: 'Brödsmulor',
    crumbHome: 'Bjorli', crumbSummer: 'Sommar', crumbFishing: 'Fiske',
    introTitle: 'Fiske på Bjorli och i Lesja',
    introP1: 'Lesja är indelat i tre fiskezoner. Fiskerätterna förvaltas av Lesjaskogsvatnet fiskeforening, Lesja fjellstyre och A/L Lågen fiskeelv.',
    introP2: 'Fiskekort kan köpas i livsmedelsbutikerna i Lesja, hos Hydro Texaco Bjorli, på Sjong Seter på Dalsida eller på iNatur.no.',
    ctaInatur: 'Köp fiskekort på iNatur',
    zonesTitle: 'Fiskezoner i Lesja',
    zones: [
      { title: 'Lesjaskogsvatnet fiskeforening', text: 'Gäller Lesjaskogsvatnet, Lågen ner till den gamla sockengränsen, Rauma ner till länsgränsen och sjöar och älvar inom Lesjaskog Heimrast.', cta: 'Fiske vid vattendelaren' },
      { title: 'Lesja fjellstyre', text: 'Lordalens statsallmänning och Dalsidas statsallmänning omfattar stora fjällområden med många fiskesjöar, älvar och bäckar.', cta: 'Läs mer hos Lesja fjellstyre' },
      { title: 'A/L Lågen fiskeelv', text: 'Gäller Lågen i Lesja kommun, zon 7, till utloppet av Skråkka, samt nedre delen av Lora älv.', cta: 'Se fiskekort zon 7' },
    ],
    lakeTitle: 'Fiske på Lesjaskogsvatnet och Bjorli',
    lakeP1: 'På Lesjaskogsvatnet, Fremre Bøvervatn och Bøvertjønnene får utombys fiska med spö. Otterfiske är möjligt med fiskekort som omfattar det. I resten av området gäller spöfiske.',
    lakeP2: 'Fisket administreras av Lesjaskogsvatnet Fiskeforening.',
    lakeCta: 'Fiske vid vattendelaren',
    lakeAlt: 'Lesjaskogsvatnet vid Bjorli',
    flyTitle: 'Flugfiskezonerna i Lesja',
    flyP1: 'Gudbrandsdalslågen i Lesja erbjuder spännande fiske. Flugfiskezonen öppnade 2020. Det är enkelt att komma åt älven. Två flugzoner på sammanlagt ca 6 km är etablerade, älven är lätt att nå med bil och har kristallklart vatten.',
    flyCta: 'Fiskekort zon 7',
    flyAlt: 'Flugfiske i en klar älv i Lesja',
    mountainTitle: 'Fiske i Lesjafjällen',
    mountainBullets: [
      'Dalsidas statsallmänning och Lordalens statsallmänning rymmer ca 230 fiskesjöar och omkring 180 km älvar och bäckar med fisk.',
      'Öring finns i alla sjöar, älvar och bäckar med fisk.',
      'Röding finns i sjöar nere i dalen på Dalsida.',
      'Harr finns i Aursjö-bassängen, Vangsvatnet och Vangstjønn.',
      'Jora är en särskilt bra fiskeälv med årliga fångster av öring över ett kilo.',
      'Flera av fjellstyrets uthyrningsstugor och bodar ligger nära goda fiskemöjligheter.',
      'Det är inte tillåtet att ha med eller använda levande fisk som bete.',
      'Det finns både älvsträckor för flugfiske, högfjällsfiske och fiskesjöar nära vägen för barnfamiljer.',
    ],
    mountainCta: 'Läs mer hos Lesja fjellstyre',
    mountainAlt: 'Fjällfiske i Lesjafjällen',
    practicalTitle: 'Praktisk information',
    practicalBullets: [
      'Kontrollera alltid gällande regler innan du fiskar.',
      'Köp rätt fiskekort för området du ska fiska i.',
      'Vissa områden har egna regler för redskap, spöfiske och otter.',
      'Levande fisk som bete är inte tillåtet i de områden som Lesja fjellstyre beskriver.',
      'Använd länkarna på sidan för aktuell information från förvaltarna.',
    ],
    faqTitle: 'Vanliga frågor',
    faqs: [
      { q: 'Var köper jag fiskekort på Bjorli?', a: 'Fiskekort kan köpas lokalt i Lesja och Bjorli hos: Coop Marked Lesjaverk, Aaheim Camping, Lesjaskogvatnet Camping, Bunnpris Lesjaskog och Bjorli Bensin/YX. Barn till och med det år de fyller 16 fiskar gratis med spö. Även via iNatur-länkarna på den här sidan.' },
      { q: 'Får jag fiska i Lesjaskogsvatnet?', a: 'Ja, utombys får fiska med spö i Lesjaskogsvatnet, Fremre Bøvervatn och Bøvertjønnene. Otter kräver fiskekort som omfattar det.' },
      { q: 'Finns det flugfiske på Bjorli?', a: 'Ja, i Gudbrandsdalslågen i Lesja finns två flugfiskezoner på sammanlagt ca 6 km.' },
    ],
    moreTitle: 'Utforska mer på Bjorli',
    moreLinks: [
      { to: '/sommer', label: 'Sommar på Bjorli' },
      { to: '/aktiviteter', label: 'Aktiviteter' },
      { to: '/overnatting', label: 'Boende' },
      { to: '/reisen-hit', label: 'Resa hit' },
      { to: '/mat-og-drikke', label: 'Mat och dryck' },
    ],
  },
};

const ZONE_HREFS = [INATUR_VANNSKILLET, LESJA_FJELLSTYRE, INATUR_SONE7];

const Fiske = () => {
  const t = usePageCopy(COPY);
  const lp = useLocalizedPath();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = t.metaTitle;
    setMeta('description', t.metaDesc);
    setMeta('og:title', t.metaTitle, 'property');
    setMeta('og:description', t.metaDesc, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', '/fiske', 'property');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: t.schemaName,
        description: t.metaDesc,
        url: '/fiske',
        touristType: ['Fishing', 'Fly fishing', 'Mountain fishing'],
        areaServed: { '@type': 'Place', name: 'Bjorli, Lesja' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.crumbHome, item: '/' },
          { '@type': 'ListItem', position: 2, name: t.crumbSummer, item: '/sommer' },
          { '@type': 'ListItem', position: 3, name: t.crumbFishing, item: '/fiske' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: t.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ]);
    document.head.appendChild(ld);
    return () => {
      document.title = prevTitle;
      document.head.removeChild(ld);
    };
  }, [t]);

  return (
    <div>
      <PageHero title={t.heroTitle} subtitle={t.heroSubtitle} image={images.fishingHero.src} />

      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label={t.breadcrumbAria}>
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">{t.crumbHome}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp('/sommer')} className="hover:text-secondary">{t.crumbSummer}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">{t.crumbFishing}</li>
        </ol>
      </nav>

      {/* Intro + primary CTAs */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.introTitle}</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
            <p>{t.introP1}</p>
            <p>{t.introP2}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={INATUR_VANNSKILLET} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              {t.ctaInatur}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Zone cards */}
      <section className="pb-16 md:pb-24 px-4">
        <div className="container mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">{t.zonesTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {t.zones.map((z, i) => (
              <motion.div
                key={z.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full bg-card/60 backdrop-blur border-border/60 hover:border-secondary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-4">
                      <Fish className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{z.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{z.text}</p>
                    <a href={ZONE_HREFS[i]} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline">
                      {z.cta}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lesjaskogsvatnet section */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center max-w-6xl">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.lakeTitle}</h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-4">{t.lakeP1}</p>
            <p className="text-muted-foreground leading-relaxed mb-6">{t.lakeP2}</p>
            <a href={INATUR_VANNSKILLET} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              {t.lakeCta}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
            <img src={images.fishingLake.src} alt={t.lakeAlt} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Fluefiske */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center max-w-6xl">
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] order-2 md:order-1">
            <img src={images.flyFishing.src} alt={t.flyAlt} loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.flyTitle}</h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-6">{t.flyP1}</p>
            <a href={INATUR_SONE7} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              {t.flyCta}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Lesjafjella */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center max-w-6xl">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.mountainTitle}</h2>
            <ul className="space-y-3 text-foreground/80 leading-relaxed mb-6">
              {t.mountainBullets.map((b, idx) => (
                <li key={idx} className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>{b}</span></li>
              ))}
            </ul>
            <a href={LESJA_FJELLSTYRE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              {t.mountainCta}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
            <img src={images.fishingMountain.src} alt={t.mountainAlt} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
              <Info className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t.practicalTitle}</h2>
          </div>
          <ul className="space-y-3 text-foreground/80 leading-relaxed">
            {t.practicalBullets.map((b, idx) => (
              <li key={idx}>• {b}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{t.faqTitle}</h2>
          <div className="space-y-3">
            {t.faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card/60 backdrop-blur p-5 open:bg-card transition-colors">
                <summary className="cursor-pointer font-semibold list-none flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 text-secondary" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="pb-20 md:pb-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-xl font-semibold mb-4">{t.moreTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {t.moreLinks.map((l) => (
              <Link
                key={l.to}
                to={lp(l.to)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
              >
                {l.label}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fiske;
