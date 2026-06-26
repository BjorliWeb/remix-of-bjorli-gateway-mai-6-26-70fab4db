import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChevronRight, ExternalLink, Mountain, Users,
  Shield, MapPin, BookOpen, Compass, Train, Bed, Activity, Fish, Bike,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';

import heroImg from '@/assets/klatring/klatring-hero-romsdalen-granitt.jpg';
import sportImg from '@/assets/klatring/klatring-sportsklatring-tau-kalk.jpg';
import ferrataImg from '@/assets/klatring/klatring-via-ferrata-aandalsnes.jpg';

const LINKS = {
  klatredepot:
    'https://www.klatredepot.no/products/romsdal-sportsklatring-sportsklatreforer-for-romsdalsregionen',
  molde:
    'https://moldeklatresenter.no/blogg/romsdal-sportsklatring-klatref%C3%B8rer-for-romsdal',
  forer: 'https://moldeklatresenter.no/forer',
  tindesenter: 'https://www.tindesenteret.no/',
  viaFerrata: 'https://www.tindesenteret.no/via-ferrata',
  facebook: 'https://share.google/SvfyAuX7K0N02jMxP',
};

type Faq = { q: string; a: string };
type BasecampItem = { title: string; desc: string };
type ResourceItem = { title: string; desc: string };
type VillePoint = string;
type RelatedChip = { labelKey: 'fotturer' | 'korte' | 'sykling' | 'fiske' | 'mardalsfossen' | 'moskus' | 'overnatting' | 'reisen'; label: string; to: string };

type Copy = {
  metaTitle: string;
  metaDesc: string;
  schemaName: string;
  schemaSportDesc: string;
  heroAlt: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaGuide: string;
  ctaTindesenter: string;
  ctaSummer: string;
  bcAria: string;
  bcHome: string;
  bcSummer: string;
  bcSelf: string;
  introEyebrow: string;
  introTitle: string;
  /** intro paragraph rendered with three inline links */
  introBody: { lead: string; mid1: string; mid2: string; end: string };
  introLinkHikes: string;
  introLinkFishing: string;
  introLinkCycling: string;
  beginnerEyebrow: string;
  beginnerTitle: string;
  beginnerBody: string;
  beginnerCta: string;
  beginnerImgAlt: string;
  ferrataEyebrow: string;
  ferrataTitle: string;
  ferrataBody: string;
  ferrataCta: string;
  ferrataImgAlt: string;
  sportEyebrow: string;
  sportTitle: string;
  sportBody: string;
  sportCtaGuide: string;
  sportCtaUpdates: string;
  sportFootnote: string;
  basecampEyebrow: string;
  basecampTitle: string;
  basecampBody: { lead: string; mid1: string; mid2: string; end: string };
  basecampLinkHikes: string;
  basecampLinkFishing: string;
  basecampLinkShort: string;
  basecampItems: BasecampItem[];
  resourcesEyebrow: string;
  resourcesTitle: string;
  resources: ResourceItem[];
  safetyTitle: string;
  safetyBody: string;
  relatedEyebrow: string;
  relatedTitle: string;
  relatedChips: RelatedChip[];
  villeEyebrow: string;
  villeTitle: string;
  villeP1: string;
  villeP2: string;
  villeP3: string;
  villeCta: string;
  villePracticalTitle: string;
  villePoints: VillePoint[];
  faqTitle: string;
  faqs: Faq[];
};

const COPY: Record<Locale, Copy> = {
  no: {
    metaTitle: 'Klatring i Romsdalen | Bjorli som basecamp',
    metaDesc: 'Sportsklatring, buldring og via ferrata i Romsdalen. Bjorli ligger på fjellet sør for regionen og er en praktisk base for klatredager vestover.',
    schemaName: 'Klatring og buldring i Romsdalen',
    schemaSportDesc: 'Romsdal Sportsklatring dekker området fra Harøya til Eresfjord og Bjorli, med nesten 750 ruter på 36 felt.',
    heroAlt: 'Bratte fjellvegger i Romsdalen i kveldslys med tåke mellom toppene',
    heroEyebrow: 'Sommer i Romsdalen',
    heroTitle: 'Klatring og buldring i Romsdalen',
    heroSubtitle: 'Romsdalen er kjent for høye fjellvegger, lange ruter og et sterkt klatremiljø. Bjorli ligger på fjellet i sør, en togtur eller kjøretur unna veggene.',
    ctaGuide: 'Se klatrefører',
    ctaTindesenter: 'Norsk Tindesenter',
    ctaSummer: 'Se sommeraktiviteter',
    bcAria: 'Brødsmuler',
    bcHome: 'Bjorli', bcSummer: 'Sommer', bcSelf: 'Klatring og buldring i Romsdalen',
    introEyebrow: 'Romsdalen',
    introTitle: 'Et klatredistrikt fra fjord til fjell',
    introBody: {
      lead: 'Fjellveggene står tett her, fra dalbunnen og opp til alpine ruter i Romsdalshorn og Trolltindene. Klatremiljøet er etablert, med alt fra innendørs vegg til lange ruter i fjellet. Bjorli ligger sør for regionen og er en praktisk base når du vil kombinere klatring med ',
      mid1: ', ', mid2: ' eller ', end: '.',
    },
    introLinkHikes: 'fjellturer',
    introLinkFishing: 'fiske i Lesjaskogsvatnet',
    introLinkCycling: 'sykling',
    beginnerEyebrow: 'For nybegynnere og familier',
    beginnerTitle: 'For deg som vil prøve klatring',
    beginnerBody: 'Norsk Tindesenter i Åndalsnes er et godt sted å begynne. Innendørs vegg, buldring og barnevennlige tilbud gir trygghet før du går ut i fjellet. Her finner du led, topptau og autobelay.',
    beginnerCta: 'Les mer hos Norsk Tindesenter',
    beginnerImgAlt: 'Klatreutstyr — tau, kalkpose og karabiner på fjellet',
    ferrataEyebrow: 'Via ferrata',
    ferrataTitle: 'Bratt fjell, gjort tilgjengelig',
    ferrataBody: 'Via ferrata gir deg luften under føttene uten at du må kunne klatre. Norsk Tindesenter beskriver Introveggen, Randersveggen og Vestveggen med ulik vanskelighetsgrad og utsikt mot Romsdalsfjella.',
    ferrataCta: 'Se Via Ferrata Åndalsnes',
    ferrataImgAlt: 'Via ferrata-kabel boltet i bratt fjellvegg over Romsdalen',
    sportEyebrow: 'Sportsklatring og buldring',
    sportTitle: 'Fjellvegger, kalk på fingrene og 750 ruter',
    sportBody: 'Romsdal Sportsklatring samler nesten 750 ruter på 36 felt fra Harøya i vest til Eresfjord i øst og Bjorli i sør. Bruk føreren og det lokale klatremiljøet for presis informasjon om felt, adgang og sikkerhet.',
    sportCtaGuide: 'Kjøp / se Romsdal Sportsklatring',
    sportCtaUpdates: 'Se oppdateringer og rettelser',
    sportFootnote: 'Felt i regionen inkluderer Mjelvahammaren, Norafjell og Hornaksla. Sjekk klatreføreren for grader og oppdaterte beskrivelser.',
    basecampEyebrow: 'Basen din',
    basecampTitle: 'Bjorli som basecamp',
    basecampBody: {
      lead: 'Bo roligere. Reis lettere. Utforsk mer. Fra Bjorli rekker du veggene i Romsdalen på en kort kjøretur, og Raumabanen knytter dalen sammen uten bil. Når klatredagen er ferdig venter ',
      mid1: ', ', mid2: ' eller ', end: '.',
    },
    basecampLinkHikes: 'fjellturer',
    basecampLinkFishing: 'fiske i Lesjaskogsvatnet',
    basecampLinkShort: 'korte turer rundt Bjorli',
    basecampItems: [
      { title: 'Raumabanen', desc: 'Toget kjører gjennom dalen og stopper nær flere klatrefelt.' },
      { title: 'Overnatting på Bjorli', desc: 'Overnatting med enkel tilgang til fjell og dal.' },
      { title: 'Fjellvann og fjellene', desc: 'Fiske i Lesjaskogsvatnet og fjellturer i Reinheimen.' },
      { title: 'Fjord og fossefall', desc: 'Dagsturer vestover til Mardalsfossen og Romsdalsfjorden.' },
      { title: 'Hviledager mellom øktene', desc: 'Sykling, fiske eller en stille kveld ved hytta.' },
    ],
    resourcesEyebrow: 'Lokale ressurser',
    resourcesTitle: 'Lokale ressurser',
    resources: [
      { title: 'Romsdal Sportsklatring', desc: 'Klatreføreren for hele regionen.' },
      { title: 'Romsdal Tindegruppe / Molde Klatresenter', desc: 'Bakgrunn om føreren og lokalmiljøet.' },
      { title: 'Ruteoppdateringer og rettelser', desc: 'Sjekk siste oppdateringer før du drar.' },
      { title: 'Norsk Tindesenter', desc: 'Innendørs klatring og tindesenter i Åndalsnes.' },
      { title: 'Via Ferrata Åndalsnes', desc: 'Introveggen, Randersveggen og Vestveggen.' },
      { title: 'Facebook: Klatring i Romsdalen', desc: 'Lokal gruppe for oppdateringer og prat.' },
    ],
    safetyTitle: 'Sikkerhet først',
    safetyBody: 'Denne siden er ikke en klatrefører. Bruk oppdatert fører, sjekk lokale forhold og respekter adgang og naturhensyn. Klatre med riktig kompetanse og utstyr, og vær oppmerksom på vær, vannføring og løse steiner.',
    relatedEyebrow: 'Sommer på Bjorli',
    relatedTitle: 'Kombiner klatring med resten av sommeren',
    relatedChips: [
      { labelKey: 'fotturer', label: 'Fotturer', to: '/fotturer' },
      { labelKey: 'korte', label: 'Korte turer rundt Bjorli', to: '/sommer/korte-turer' },
      { labelKey: 'sykling', label: 'Sykling', to: '/sykling' },
      { labelKey: 'fiske', label: 'Fiske', to: '/fiske' },
      { labelKey: 'mardalsfossen', label: 'Mardalsfossen', to: '/sommer' },
      { labelKey: 'moskus', label: 'Moskus på Dovrefjell', to: '/sommer' },
      { labelKey: 'overnatting', label: 'Overnatting', to: '/overnatting' },
      { labelKey: 'reisen', label: 'Reisen hit', to: '/reisen-hit' },
    ],
    villeEyebrow: 'Flere høydeopplevelser i Romsdalen',
    villeTitle: 'Høydeparken Ville Verma',
    villeP1: 'Høydeparken Ville Verma ligger på Verma øverst i Romsdalen, en kort kjøretur fra Bjorli. Her får vennegjenger, firmagrupper og familier en luftig juvopplevelse i det trange fossejuvet nedenfor den kjente Kyllingbrua.',
    villeP2: 'I området rundt Neagarafossen er det montert flere lange ziplines som lar deg krysse den ville Rauma elv og oppleve juvet fra høyden. Den lengste ziplinen er rundt 200 meter lang og starter fra en plattform omtrent 30 meter over elven.',
    villeP3: 'Dette er et spennende alternativ for deg som liker høyde, fart og aktive opplevelser i Romsdalen.',
    villeCta: 'Se Ville Verma',
    villePracticalTitle: 'Praktisk info',
    villePoints: [
      'Høydepark og juvopplevelse på Verma',
      'Ziplines over Rauma elv og ved Neagarafossen',
      'Passer for vennegjenger, firmagrupper og familier',
      'Kort kjøretur fra Bjorli',
    ],
    faqTitle: 'Vanlige spørsmål',
    faqs: [
      { q: 'Kan nybegynnere prøve klatring i Romsdalen?', a: 'Ja. Start gjerne innendørs eller på via ferrata hos Norsk Tindesenter i Åndalsnes.' },
      { q: 'Finnes det klatrefører for området?', a: 'Ja. Romsdal Sportsklatring beskriver nesten 750 ruter på 36 felt fra Harøya til Eresfjord og Bjorli.' },
      { q: 'Er Bjorli et godt utgangspunkt for klatring?', a: 'Ja. Bjorli ligger på fjellet sør for Romsdalen og er en praktisk base når du vil kombinere klatring med fjelldager, sykling, fiske og familiedager.' },
      { q: 'Viser bjorli.no konkrete ruter og grader?', a: 'Nei. Bjorli.no er ikke en klatrefører. Bruk Romsdal Sportsklatring og lokale ressurser for ruter, grader og topodata.' },
    ],
  },
  en: {
    metaTitle: 'Climbing in Romsdalen | Bjorli as basecamp',
    metaDesc: 'Sport climbing, bouldering and via ferrata in Romsdalen. Bjorli sits on the plateau south of the region and makes a practical base for climbing days west of the mountains.',
    schemaName: 'Climbing and bouldering in Romsdalen',
    schemaSportDesc: 'Romsdal Sportsklatring covers the area from Harøya to Eresfjord and Bjorli, with around 750 routes spread across 36 crags.',
    heroAlt: 'Steep granite walls in Romsdalen in evening light with mist between the peaks',
    heroEyebrow: 'Summer in Romsdalen',
    heroTitle: 'Climbing and bouldering in Romsdalen',
    heroSubtitle: 'Romsdalen is known for tall walls, long routes and a strong local climbing scene. Bjorli sits on the plateau to the south — a short train ride or drive from the cliffs.',
    ctaGuide: 'See the climbing guide',
    ctaTindesenter: 'Norsk Tindesenter',
    ctaSummer: 'See summer activities',
    bcAria: 'Breadcrumb',
    bcHome: 'Bjorli', bcSummer: 'Summer', bcSelf: 'Climbing and bouldering in Romsdalen',
    introEyebrow: 'Romsdalen',
    introTitle: 'A climbing region from fjord to mountain',
    introBody: {
      lead: 'The walls line up close here, from valley level up to alpine routes on Romsdalshornet and the Trolltindene. The scene is well established — indoor walls, sport crags and long lines in the mountains. Bjorli sits south of the region and makes a handy base when you want to mix climbing with ',
      mid1: ', ', mid2: ' or ', end: '.',
    },
    introLinkHikes: 'mountain hikes',
    introLinkFishing: 'fishing at Lesjaskogsvatnet',
    introLinkCycling: 'cycling',
    beginnerEyebrow: 'For first-timers and families',
    beginnerTitle: 'New to climbing? Start here',
    beginnerBody: 'Norsk Tindesenter in Åndalsnes is a solid place to begin. Indoor walls, bouldering and kid-friendly setups let you get comfortable before heading out into the mountains. You\u2019ll find lead, top-rope and auto-belay.',
    beginnerCta: 'Read more at Norsk Tindesenter',
    beginnerImgAlt: 'Climbing gear — rope, chalk bag and carabiners on rock',
    ferrataEyebrow: 'Via ferrata',
    ferrataTitle: 'Big walls, made approachable',
    ferrataBody: 'Via ferrata gives you the exposure without needing to climb. Norsk Tindesenter describes Introveggen, Randersveggen and Vestveggen at different grades, all with views out over the Romsdal peaks.',
    ferrataCta: 'See Via Ferrata Åndalsnes',
    ferrataImgAlt: 'Via ferrata cable bolted into a steep wall above Romsdalen',
    sportEyebrow: 'Sport climbing and bouldering',
    sportTitle: 'Steep walls, chalked fingers and 750 routes',
    sportBody: 'Romsdal Sportsklatring brings together around 750 routes across 36 crags, from Harøya in the west to Eresfjord in the east and Bjorli in the south. Lean on the guidebook and the local community for accurate beta on crags, access and safety.',
    sportCtaGuide: 'Buy / see Romsdal Sportsklatring',
    sportCtaUpdates: 'See updates and corrections',
    sportFootnote: 'Crags in the region include Mjelvahammaren, Norafjell and Hornaksla. Check the guidebook for grades and current descriptions.',
    basecampEyebrow: 'Your base',
    basecampTitle: 'Bjorli as basecamp',
    basecampBody: {
      lead: 'Stay calmer. Travel lighter. Explore more. From Bjorli the Romsdalen walls are a short drive away, and the Rauma railway threads the valley if you skip the car. When the climbing day is done, ',
      mid1: ', ', mid2: ' or ', end: ' are waiting.',
    },
    basecampLinkHikes: 'mountain hikes',
    basecampLinkFishing: 'fishing at Lesjaskogsvatnet',
    basecampLinkShort: 'short walks around Bjorli',
    basecampItems: [
      { title: 'Raumabanen railway', desc: 'The train runs through the valley and stops near several crags.' },
      { title: 'Stay on Bjorli', desc: 'Accommodation with easy access to the mountain and the valley.' },
      { title: 'Mountain lakes and peaks', desc: 'Fishing at Lesjaskogsvatnet and hiking in Reinheimen.' },
      { title: 'Fjord and waterfalls', desc: 'Day trips west to Mardalsfossen and Romsdalsfjorden.' },
      { title: 'Rest days between sessions', desc: 'Cycling, fishing or a quiet evening back at the cabin.' },
    ],
    resourcesEyebrow: 'Local resources',
    resourcesTitle: 'Local resources',
    resources: [
      { title: 'Romsdal Sportsklatring', desc: 'The climbing guidebook for the whole region.' },
      { title: 'Romsdal Tindegruppe / Molde Klatresenter', desc: 'Background on the guidebook and the local scene.' },
      { title: 'Route updates and corrections', desc: 'Check the latest beta before you head out.' },
      { title: 'Norsk Tindesenter', desc: 'Indoor climbing and mountaineering centre in Åndalsnes.' },
      { title: 'Via Ferrata Åndalsnes', desc: 'Introveggen, Randersveggen and Vestveggen.' },
      { title: 'Facebook: Klatring i Romsdalen', desc: 'Local group for updates and chatter.' },
    ],
    safetyTitle: 'Safety first',
    safetyBody: 'This page is not a climbing guide. Use an up-to-date guidebook, check local conditions and respect access and nature. Climb with the right skills and gear, and stay aware of weather, water levels and loose rock.',
    relatedEyebrow: 'Summer on Bjorli',
    relatedTitle: 'Combine climbing with the rest of summer',
    relatedChips: [
      { labelKey: 'fotturer', label: 'Hiking', to: '/fotturer' },
      { labelKey: 'korte', label: 'Short walks around Bjorli', to: '/sommer/korte-turer' },
      { labelKey: 'sykling', label: 'Cycling', to: '/sykling' },
      { labelKey: 'fiske', label: 'Fishing', to: '/fiske' },
      { labelKey: 'mardalsfossen', label: 'Mardalsfossen', to: '/sommer' },
      { labelKey: 'moskus', label: 'Musk ox on Dovrefjell', to: '/sommer' },
      { labelKey: 'overnatting', label: 'Accommodation', to: '/overnatting' },
      { labelKey: 'reisen', label: 'Getting here', to: '/reisen-hit' },
    ],
    villeEyebrow: 'More high-altitude experiences in Romsdalen',
    villeTitle: 'Ville Verma adventure park',
    villeP1: 'Ville Verma sits at Verma at the top of Romsdalen, a short drive from Bjorli. Groups of friends, company outings and families get an airy gorge experience in the narrow falls gorge below the well-known Kyllingbrua bridge.',
    villeP2: 'Around Neagarafossen, several long ziplines let you cross the wild Rauma river and take in the gorge from above. The longest zipline is around 200 metres and starts from a platform about 30 metres above the water.',
    villeP3: 'A good option if you like height, speed and active days in Romsdalen.',
    villeCta: 'See Ville Verma',
    villePracticalTitle: 'Practical info',
    villePoints: [
      'Adventure park and gorge experience at Verma',
      'Ziplines across the Rauma river and around Neagarafossen',
      'Works for friend groups, company outings and families',
      'Short drive from Bjorli',
    ],
    faqTitle: 'Common questions',
    faqs: [
      { q: 'Can beginners try climbing in Romsdalen?', a: 'Yes. Start indoors or on the via ferrata at Norsk Tindesenter in Åndalsnes.' },
      { q: 'Is there a guidebook for the area?', a: 'Yes. Romsdal Sportsklatring describes around 750 routes across 36 crags from Harøya to Eresfjord and Bjorli.' },
      { q: 'Is Bjorli a good base for climbing?', a: 'Yes. Bjorli sits on the plateau south of Romsdalen and makes a practical base when you want to combine climbing with mountain days, cycling, fishing and family time.' },
      { q: 'Does bjorli.no list specific routes and grades?', a: 'No. Bjorli.no is not a climbing guide. Use Romsdal Sportsklatring and local resources for routes, grades and topo data.' },
    ],
  },
  de: {
    metaTitle: 'Klettern in Romsdalen | Bjorli als Basecamp',
    metaDesc: 'Sportklettern, Bouldern und Klettersteige in Romsdalen. Bjorli liegt auf dem Plateau südlich der Region und ist eine praktische Basis für Klettertage westlich der Berge.',
    schemaName: 'Klettern und Bouldern in Romsdalen',
    schemaSportDesc: 'Romsdal Sportsklatring deckt das Gebiet von Harøya bis Eresfjord und Bjorli ab – rund 750 Routen an 36 Felsen.',
    heroAlt: 'Steile Granitwände in Romsdalen im Abendlicht mit Nebel zwischen den Gipfeln',
    heroEyebrow: 'Sommer in Romsdalen',
    heroTitle: 'Klettern und Bouldern in Romsdalen',
    heroSubtitle: 'Romsdalen steht für hohe Wände, lange Routen und eine eingespielte Kletterszene. Bjorli liegt auf dem Plateau im Süden – nur eine Zugfahrt oder kurze Autostrecke von den Wänden entfernt.',
    ctaGuide: 'Kletterführer ansehen',
    ctaTindesenter: 'Norsk Tindesenter',
    ctaSummer: 'Sommeraktivitäten ansehen',
    bcAria: 'Brotkrumen',
    bcHome: 'Bjorli', bcSummer: 'Sommer', bcSelf: 'Klettern und Bouldern in Romsdalen',
    introEyebrow: 'Romsdalen',
    introTitle: 'Ein Klettergebiet vom Fjord bis ins Hochgebirge',
    introBody: {
      lead: 'Die Wände stehen hier dicht beieinander – vom Talboden bis zu alpinen Routen am Romsdalshornet und an den Trolltindene. Die Szene ist etabliert: Indoor-Wand, Sportklettern, lange Touren im Gebirge. Bjorli liegt südlich der Region und ist eine handliche Basis, wenn Sie Klettern mit ',
      mid1: ', ', mid2: ' oder ', end: ' kombinieren wollen.',
    },
    introLinkHikes: 'Bergwanderungen',
    introLinkFishing: 'Angeln am Lesjaskogsvatnet',
    introLinkCycling: 'Radfahren',
    beginnerEyebrow: 'Für Einsteiger und Familien',
    beginnerTitle: 'Zum ersten Mal klettern? Hier starten',
    beginnerBody: 'Norsk Tindesenter in Åndalsnes ist ein guter Einstieg. Indoor-Wand, Boulderbereich und kinderfreundliche Angebote sorgen für Sicherheit, bevor es ins Gebirge geht. Es gibt Vorstieg, Toprope und Autobelay.',
    beginnerCta: 'Mehr beim Norsk Tindesenter',
    beginnerImgAlt: 'Kletterausrüstung – Seil, Chalkbag und Karabiner am Fels',
    ferrataEyebrow: 'Klettersteig',
    ferrataTitle: 'Steiles Gelände, zugänglich gemacht',
    ferrataBody: 'Klettersteige bringen Sie ins exponierte Gelände, ohne dass Sie klettern können müssen. Norsk Tindesenter beschreibt Introveggen, Randersveggen und Vestveggen in unterschiedlichen Schwierigkeiten und mit Ausblick über die Romsdalsfjella.',
    ferrataCta: 'Via Ferrata Åndalsnes ansehen',
    ferrataImgAlt: 'Klettersteig-Drahtseil in einer steilen Wand über Romsdalen',
    sportEyebrow: 'Sportklettern und Bouldern',
    sportTitle: 'Wände, Chalk an den Fingern und 750 Routen',
    sportBody: 'Romsdal Sportsklatring bündelt rund 750 Routen an 36 Felsen – von Harøya im Westen bis Eresfjord im Osten und Bjorli im Süden. Verlassen Sie sich für Felsen, Zugang und Sicherheit auf den Führer und auf die lokale Szene.',
    sportCtaGuide: 'Romsdal Sportsklatring kaufen / ansehen',
    sportCtaUpdates: 'Updates und Korrekturen ansehen',
    sportFootnote: 'Zu den Felsen der Region gehören Mjelvahammaren, Norafjell und Hornaksla. Schwierigkeiten und aktuelle Beschreibungen siehe Kletterführer.',
    basecampEyebrow: 'Ihre Basis',
    basecampTitle: 'Bjorli als Basecamp',
    basecampBody: {
      lead: 'Ruhiger wohnen. Leichter reisen. Mehr entdecken. Von Bjorli aus erreichen Sie die Wände in Romsdalen in kurzer Fahrt, und die Rauma-Bahn verbindet das Tal auch ohne Auto. Nach dem Klettertag warten ',
      mid1: ', ', mid2: ' oder ', end: '.',
    },
    basecampLinkHikes: 'Bergwanderungen',
    basecampLinkFishing: 'Angeln am Lesjaskogsvatnet',
    basecampLinkShort: 'kurze Touren rund um Bjorli',
    basecampItems: [
      { title: 'Rauma-Bahn', desc: 'Der Zug fährt durchs Tal und hält in der Nähe mehrerer Klettergebiete.' },
      { title: 'Unterkunft in Bjorli', desc: 'Übernachtung mit direktem Zugang zu Berg und Tal.' },
      { title: 'Bergseen und Gipfel', desc: 'Angeln am Lesjaskogsvatnet und Bergtouren im Reinheimen.' },
      { title: 'Fjord und Wasserfälle', desc: 'Tagesausflüge nach Westen zum Mardalsfossen und Romsdalsfjord.' },
      { title: 'Ruhetage zwischen den Einheiten', desc: 'Radeln, Angeln oder einen ruhigen Abend an der Hütte.' },
    ],
    resourcesEyebrow: 'Lokale Quellen',
    resourcesTitle: 'Lokale Quellen',
    resources: [
      { title: 'Romsdal Sportsklatring', desc: 'Der Kletterführer für die gesamte Region.' },
      { title: 'Romsdal Tindegruppe / Molde Klatresenter', desc: 'Hintergrund zu Führer und lokaler Szene.' },
      { title: 'Routen-Updates und Korrekturen', desc: 'Vor der Tour aktuelle Hinweise prüfen.' },
      { title: 'Norsk Tindesenter', desc: 'Indoor-Klettern und Bergsportzentrum in Åndalsnes.' },
      { title: 'Via Ferrata Åndalsnes', desc: 'Introveggen, Randersveggen und Vestveggen.' },
      { title: 'Facebook: Klatring i Romsdalen', desc: 'Lokale Gruppe für Updates und Austausch.' },
    ],
    safetyTitle: 'Sicherheit zuerst',
    safetyBody: 'Diese Seite ist kein Kletterführer. Verwenden Sie einen aktuellen Führer, prüfen Sie die örtlichen Bedingungen und respektieren Sie Zugang und Natur. Klettern Sie mit passender Erfahrung und Ausrüstung und achten Sie auf Wetter, Wasserführung und losen Fels.',
    relatedEyebrow: 'Sommer auf Bjorli',
    relatedTitle: 'Klettern mit dem Rest des Sommers kombinieren',
    relatedChips: [
      { labelKey: 'fotturer', label: 'Wandern', to: '/fotturer' },
      { labelKey: 'korte', label: 'Kurze Touren rund um Bjorli', to: '/sommer/korte-turer' },
      { labelKey: 'sykling', label: 'Radfahren', to: '/sykling' },
      { labelKey: 'fiske', label: 'Angeln', to: '/fiske' },
      { labelKey: 'mardalsfossen', label: 'Mardalsfossen', to: '/sommer' },
      { labelKey: 'moskus', label: 'Moschusochsen auf dem Dovrefjell', to: '/sommer' },
      { labelKey: 'overnatting', label: 'Unterkunft', to: '/overnatting' },
      { labelKey: 'reisen', label: 'Anreise', to: '/reisen-hit' },
    ],
    villeEyebrow: 'Mehr Höhenerlebnisse in Romsdalen',
    villeTitle: 'Hochseilpark Ville Verma',
    villeP1: 'Ville Verma liegt in Verma am oberen Ende von Romsdalen, eine kurze Fahrt von Bjorli entfernt. Freundesgruppen, Firmenausflüge und Familien erleben hier ein luftiges Schluchterlebnis in der engen Wasserfallschlucht unterhalb der bekannten Brücke Kyllingbrua.',
    villeP2: 'Rund um den Neagarafossen sind mehrere lange Ziplines installiert, mit denen Sie den wilden Rauma-Fluss überqueren und die Schlucht aus der Höhe erleben. Die längste Zipline ist rund 200 Meter lang und startet auf einer Plattform etwa 30 Meter über dem Fluss.',
    villeP3: 'Eine spannende Option für alle, die Höhe, Tempo und aktive Tage in Romsdalen mögen.',
    villeCta: 'Ville Verma ansehen',
    villePracticalTitle: 'Praktische Infos',
    villePoints: [
      'Hochseilpark und Schluchterlebnis in Verma',
      'Ziplines über die Rauma und am Neagarafossen',
      'Geeignet für Freundesgruppen, Firmen und Familien',
      'Kurze Fahrt von Bjorli',
    ],
    faqTitle: 'Häufige Fragen',
    faqs: [
      { q: 'Können Einsteiger in Romsdalen klettern?', a: 'Ja. Beginnen Sie indoor oder auf dem Klettersteig beim Norsk Tindesenter in Åndalsnes.' },
      { q: 'Gibt es einen Kletterführer für das Gebiet?', a: 'Ja. Romsdal Sportsklatring beschreibt rund 750 Routen an 36 Felsen von Harøya bis Eresfjord und Bjorli.' },
      { q: 'Ist Bjorli eine gute Basis zum Klettern?', a: 'Ja. Bjorli liegt auf dem Plateau südlich von Romsdalen und ist eine praktische Basis, um Klettern mit Bergtagen, Radfahren, Angeln und Familienzeit zu verbinden.' },
      { q: 'Listet bjorli.no Routen und Schwierigkeiten?', a: 'Nein. Bjorli.no ist kein Kletterführer. Routen, Schwierigkeiten und Topos finden Sie in Romsdal Sportsklatring und bei lokalen Quellen.' },
    ],
  },
  nl: {
    metaTitle: 'Klimmen in Romsdalen | Bjorli als basecamp',
    metaDesc: 'Sportklimmen, boulderen en via ferrata in Romsdalen. Bjorli ligt op het plateau ten zuiden van de regio en is een praktische uitvalsbasis voor klimdagen ten westen van de bergen.',
    schemaName: 'Klimmen en boulderen in Romsdalen',
    schemaSportDesc: 'Romsdal Sportsklatring bestrijkt het gebied van Harøya tot Eresfjord en Bjorli, met zo\u2019n 750 routes verdeeld over 36 klimgebieden.',
    heroAlt: 'Steile granieten wanden in Romsdalen in avondlicht met mist tussen de toppen',
    heroEyebrow: 'Zomer in Romsdalen',
    heroTitle: 'Klimmen en boulderen in Romsdalen',
    heroSubtitle: 'Romsdalen staat bekend om hoge wanden, lange routes en een sterke klimscene. Bjorli ligt op het plateau in het zuiden — een korte treinrit of autorit van de wanden.',
    ctaGuide: 'Bekijk de klimgids',
    ctaTindesenter: 'Norsk Tindesenter',
    ctaSummer: 'Bekijk zomeractiviteiten',
    bcAria: 'Kruimelpad',
    bcHome: 'Bjorli', bcSummer: 'Zomer', bcSelf: 'Klimmen en boulderen in Romsdalen',
    introEyebrow: 'Romsdalen',
    introTitle: 'Een klimregio van fjord tot hooggebergte',
    introBody: {
      lead: 'De wanden staan hier dicht op elkaar, van de dalbodem tot alpiene routes op Romsdalshornet en de Trolltindene. De scene is goed ingespeeld: indoorwand, sportgebieden en lange routes in de bergen. Bjorli ligt ten zuiden van de regio en is een handige uitvalsbasis om klimmen te combineren met ',
      mid1: ', ', mid2: ' of ', end: '.',
    },
    introLinkHikes: 'bergwandelingen',
    introLinkFishing: 'vissen in Lesjaskogsvatnet',
    introLinkCycling: 'fietsen',
    beginnerEyebrow: 'Voor beginners en gezinnen',
    beginnerTitle: 'Voor wie klimmen wil proberen',
    beginnerBody: 'Norsk Tindesenter in Åndalsnes is een goede plek om te beginnen. Indoorwand, boulderen en kindvriendelijk aanbod geven vertrouwen voordat je het gebergte in gaat. Hier vind je voorklimmen, toprope en autobelay.',
    beginnerCta: 'Meer bij Norsk Tindesenter',
    beginnerImgAlt: 'Klimuitrusting — touw, magnesiumzakje en karabiners op het rotsmassief',
    ferrataEyebrow: 'Via ferrata',
    ferrataTitle: 'Steile rotsen, toegankelijk gemaakt',
    ferrataBody: 'Via ferrata brengt je in blootgesteld terrein zonder dat je hoeft te klimmen. Norsk Tindesenter beschrijft Introveggen, Randersveggen en Vestveggen in verschillende moeilijkheidsgraden, met uitzicht op de Romsdalsfjella.',
    ferrataCta: 'Bekijk Via Ferrata Åndalsnes',
    ferrataImgAlt: 'Via ferrata-kabel in een steile wand boven Romsdalen',
    sportEyebrow: 'Sportklimmen en boulderen',
    sportTitle: 'Wanden, magnesium aan de vingers en 750 routes',
    sportBody: 'Romsdal Sportsklatring brengt zo\u2019n 750 routes samen op 36 klimgebieden, van Harøya in het westen tot Eresfjord in het oosten en Bjorli in het zuiden. Gebruik de gids en de lokale community voor actuele beta over gebieden, toegang en veiligheid.',
    sportCtaGuide: 'Koop / bekijk Romsdal Sportsklatring',
    sportCtaUpdates: 'Bekijk updates en correcties',
    sportFootnote: 'Gebieden in de regio zijn onder andere Mjelvahammaren, Norafjell en Hornaksla. Raadpleeg de klimgids voor graden en actuele beschrijvingen.',
    basecampEyebrow: 'Jouw basis',
    basecampTitle: 'Bjorli als basecamp',
    basecampBody: {
      lead: 'Rustiger logeren. Lichter reizen. Meer ontdekken. Vanaf Bjorli zijn de wanden in Romsdalen een korte rit, en de Rauma-spoorlijn rijgt het dal aan elkaar zonder auto. Na de klimdag wachten ',
      mid1: ', ', mid2: ' of ', end: '.',
    },
    basecampLinkHikes: 'bergwandelingen',
    basecampLinkFishing: 'vissen in Lesjaskogsvatnet',
    basecampLinkShort: 'korte wandelingen rondom Bjorli',
    basecampItems: [
      { title: 'Rauma-spoorlijn', desc: 'De trein rijdt door het dal en stopt bij meerdere klimgebieden.' },
      { title: 'Overnachten op Bjorli', desc: 'Accommodatie met directe toegang tot berg en dal.' },
      { title: 'Bergmeren en toppen', desc: 'Vissen in Lesjaskogsvatnet en wandelen in Reinheimen.' },
      { title: 'Fjord en watervallen', desc: 'Dagtochten westwaarts naar Mardalsfossen en de Romsdalsfjord.' },
      { title: 'Rustdagen tussen de sessies', desc: 'Fietsen, vissen of een rustige avond bij de hut.' },
    ],
    resourcesEyebrow: 'Lokale bronnen',
    resourcesTitle: 'Lokale bronnen',
    resources: [
      { title: 'Romsdal Sportsklatring', desc: 'De klimgids voor de hele regio.' },
      { title: 'Romsdal Tindegruppe / Molde Klatresenter', desc: 'Achtergrond over de gids en de lokale community.' },
      { title: 'Route-updates en correcties', desc: 'Check de laatste informatie voor je vertrekt.' },
      { title: 'Norsk Tindesenter', desc: 'Indoorklimmen en bergsportcentrum in Åndalsnes.' },
      { title: 'Via Ferrata Åndalsnes', desc: 'Introveggen, Randersveggen en Vestveggen.' },
      { title: 'Facebook: Klatring i Romsdalen', desc: 'Lokale groep voor updates en tips.' },
    ],
    safetyTitle: 'Veiligheid eerst',
    safetyBody: 'Deze pagina is geen klimgids. Gebruik een actuele gids, controleer lokale omstandigheden en respecteer toegang en natuur. Klim met passende ervaring en uitrusting, en let op weer, waterstand en losse stenen.',
    relatedEyebrow: 'Zomer op Bjorli',
    relatedTitle: 'Combineer klimmen met de rest van de zomer',
    relatedChips: [
      { labelKey: 'fotturer', label: 'Wandelen', to: '/fotturer' },
      { labelKey: 'korte', label: 'Korte wandelingen rondom Bjorli', to: '/sommer/korte-turer' },
      { labelKey: 'sykling', label: 'Fietsen', to: '/sykling' },
      { labelKey: 'fiske', label: 'Vissen', to: '/fiske' },
      { labelKey: 'mardalsfossen', label: 'Mardalsfossen', to: '/sommer' },
      { labelKey: 'moskus', label: 'Muskusossen op Dovrefjell', to: '/sommer' },
      { labelKey: 'overnatting', label: 'Accommodatie', to: '/overnatting' },
      { labelKey: 'reisen', label: 'Reis ernaartoe', to: '/reisen-hit' },
    ],
    villeEyebrow: 'Meer hoogteavontuur in Romsdalen',
    villeTitle: 'Hoogtepark Ville Verma',
    villeP1: 'Ville Verma ligt op Verma bovenaan Romsdalen, een korte rit van Bjorli. Vriendengroepen, bedrijfsuitjes en gezinnen beleven hier een luchtige kloofervaring in de smalle waterval-kloof onder de bekende Kyllingbrua.',
    villeP2: 'Rond Neagarafossen zijn meerdere lange ziplines gemonteerd waarmee je de wilde Rauma-rivier oversteekt en de kloof van bovenaf beleeft. De langste zipline is ongeveer 200 meter en start vanaf een platform op zo\u2019n 30 meter boven het water.',
    villeP3: 'Een goede optie als je houdt van hoogte, snelheid en actieve dagen in Romsdalen.',
    villeCta: 'Bekijk Ville Verma',
    villePracticalTitle: 'Praktische info',
    villePoints: [
      'Hoogtepark en kloofervaring op Verma',
      'Ziplines over de Rauma en bij Neagarafossen',
      'Geschikt voor vriendengroepen, bedrijven en gezinnen',
      'Korte rit vanaf Bjorli',
    ],
    faqTitle: 'Veelgestelde vragen',
    faqs: [
      { q: 'Kunnen beginners klimmen in Romsdalen?', a: 'Ja. Begin binnen of op de via ferrata bij Norsk Tindesenter in Åndalsnes.' },
      { q: 'Is er een klimgids voor het gebied?', a: 'Ja. Romsdal Sportsklatring beschrijft zo\u2019n 750 routes in 36 gebieden van Harøya tot Eresfjord en Bjorli.' },
      { q: 'Is Bjorli een goede basis voor klimmen?', a: 'Ja. Bjorli ligt op het plateau ten zuiden van Romsdalen en is een praktische basis om klimmen te combineren met bergdagen, fietsen, vissen en gezinsdagen.' },
      { q: 'Geeft bjorli.no concrete routes en graden?', a: 'Nee. Bjorli.no is geen klimgids. Gebruik Romsdal Sportsklatring en lokale bronnen voor routes, graden en topo\u2019s.' },
    ],
  },
  da: {
    metaTitle: 'Klatring i Romsdalen | Bjorli som basecamp',
    metaDesc: 'Sportsklatring, bouldering og via ferrata i Romsdalen. Bjorli ligger på fjeldet syd for regionen og er en praktisk base for klatredage vest for bjergene.',
    schemaName: 'Klatring og bouldering i Romsdalen',
    schemaSportDesc: 'Romsdal Sportsklatring dækker området fra Harøya til Eresfjord og Bjorli med omkring 750 ruter på 36 klippeområder.',
    heroAlt: 'Stejle granitvægge i Romsdalen i aftenlys med tåge mellem toppene',
    heroEyebrow: 'Sommer i Romsdalen',
    heroTitle: 'Klatring og bouldering i Romsdalen',
    heroSubtitle: 'Romsdalen er kendt for høje vægge, lange ruter og et stærkt klatremiljø. Bjorli ligger på fjeldet syd for området — en kort togtur eller køretur fra væggene.',
    ctaGuide: 'Se klatreføreren',
    ctaTindesenter: 'Norsk Tindesenter',
    ctaSummer: 'Se sommeraktiviteter',
    bcAria: 'Brødkrummer',
    bcHome: 'Bjorli', bcSummer: 'Sommer', bcSelf: 'Klatring og bouldering i Romsdalen',
    introEyebrow: 'Romsdalen',
    introTitle: 'Et klatreområde fra fjord til fjeld',
    introBody: {
      lead: 'Væggene står tæt her, fra dalbunden og op til alpine ruter på Romsdalshornet og Trolltindene. Miljøet er etableret med indendørs vægge, sportsklipper og lange ruter i fjeldet. Bjorli ligger syd for regionen og er en praktisk base, når du vil kombinere klatring med ',
      mid1: ', ', mid2: ' eller ', end: '.',
    },
    introLinkHikes: 'fjeldvandringer',
    introLinkFishing: 'fiskeri i Lesjaskogsvatnet',
    introLinkCycling: 'cykling',
    beginnerEyebrow: 'For begyndere og familier',
    beginnerTitle: 'Dig der vil prøve at klatre',
    beginnerBody: 'Norsk Tindesenter i Åndalsnes er et godt sted at starte. Indendørs væg, bouldering og børnevenlige tilbud giver tryghed, før du går i fjeldet. Her er forklatring, toprope og autobelay.',
    beginnerCta: 'Læs mere hos Norsk Tindesenter',
    beginnerImgAlt: 'Klatreudstyr — reb, kalkpose og karabiner på klippen',
    ferrataEyebrow: 'Via ferrata',
    ferrataTitle: 'Stejlt fjeld, gjort tilgængeligt',
    ferrataBody: 'Via ferrata giver dig luften under fødderne uden at du behøver at klatre. Norsk Tindesenter beskriver Introveggen, Randersveggen og Vestveggen i forskellige sværhedsgrader med udsigt over Romsdalsfjellene.',
    ferrataCta: 'Se Via Ferrata Åndalsnes',
    ferrataImgAlt: 'Via ferrata-kabel boltet i en stejl væg over Romsdalen',
    sportEyebrow: 'Sportsklatring og bouldering',
    sportTitle: 'Vægge, kalk på fingrene og 750 ruter',
    sportBody: 'Romsdal Sportsklatring samler omkring 750 ruter på 36 klippeområder fra Harøya i vest til Eresfjord i øst og Bjorli i syd. Brug føreren og det lokale miljø for præcise oplysninger om områder, adgang og sikkerhed.',
    sportCtaGuide: 'Køb / se Romsdal Sportsklatring',
    sportCtaUpdates: 'Se opdateringer og rettelser',
    sportFootnote: 'Områder i regionen inkluderer Mjelvahammaren, Norafjell og Hornaksla. Se klatreføreren for grader og opdaterede beskrivelser.',
    basecampEyebrow: 'Din base',
    basecampTitle: 'Bjorli som basecamp',
    basecampBody: {
      lead: 'Bo roligere. Rejs lettere. Udforsk mere. Fra Bjorli når du væggene i Romsdalen på en kort køretur, og Raumabanen binder dalen sammen uden bil. Når klatredagen er slut, venter ',
      mid1: ', ', mid2: ' eller ', end: '.',
    },
    basecampLinkHikes: 'fjeldvandringer',
    basecampLinkFishing: 'fiskeri i Lesjaskogsvatnet',
    basecampLinkShort: 'korte ture omkring Bjorli',
    basecampItems: [
      { title: 'Raumabanen', desc: 'Toget kører gennem dalen og stopper nær flere klippeområder.' },
      { title: 'Overnatning på Bjorli', desc: 'Overnatning med let adgang til fjeld og dal.' },
      { title: 'Fjeldsøer og toppe', desc: 'Fiskeri i Lesjaskogsvatnet og fjeldvandringer i Reinheimen.' },
      { title: 'Fjord og vandfald', desc: 'Dagsture vestpå til Mardalsfossen og Romsdalsfjorden.' },
      { title: 'Hviledage mellem sessionerne', desc: 'Cykling, fiskeri eller en stille aften ved hytten.' },
    ],
    resourcesEyebrow: 'Lokale ressourcer',
    resourcesTitle: 'Lokale ressourcer',
    resources: [
      { title: 'Romsdal Sportsklatring', desc: 'Klatreføreren for hele regionen.' },
      { title: 'Romsdal Tindegruppe / Molde Klatresenter', desc: 'Baggrund om føreren og det lokale miljø.' },
      { title: 'Rute-opdateringer og rettelser', desc: 'Tjek seneste oplysninger inden du tager af sted.' },
      { title: 'Norsk Tindesenter', desc: 'Indendørs klatring og bjergsportcenter i Åndalsnes.' },
      { title: 'Via Ferrata Åndalsnes', desc: 'Introveggen, Randersveggen og Vestveggen.' },
      { title: 'Facebook: Klatring i Romsdalen', desc: 'Lokal gruppe for opdateringer og snak.' },
    ],
    safetyTitle: 'Sikkerhed først',
    safetyBody: 'Denne side er ikke en klatrefører. Brug en opdateret fører, tjek lokale forhold og respekter adgang og natur. Klatr med rette kompetence og udstyr, og hold øje med vejr, vandføring og løse sten.',
    relatedEyebrow: 'Sommer på Bjorli',
    relatedTitle: 'Kombiner klatring med resten af sommeren',
    relatedChips: [
      { labelKey: 'fotturer', label: 'Vandring', to: '/fotturer' },
      { labelKey: 'korte', label: 'Korte ture omkring Bjorli', to: '/sommer/korte-turer' },
      { labelKey: 'sykling', label: 'Cykling', to: '/sykling' },
      { labelKey: 'fiske', label: 'Fiskeri', to: '/fiske' },
      { labelKey: 'mardalsfossen', label: 'Mardalsfossen', to: '/sommer' },
      { labelKey: 'moskus', label: 'Moskusokser på Dovrefjell', to: '/sommer' },
      { labelKey: 'overnatting', label: 'Overnatning', to: '/overnatting' },
      { labelKey: 'reisen', label: 'Sådan kommer du hertil', to: '/reisen-hit' },
    ],
    villeEyebrow: 'Flere højdeoplevelser i Romsdalen',
    villeTitle: 'Højdeparken Ville Verma',
    villeP1: 'Ville Verma ligger på Verma øverst i Romsdalen, en kort køretur fra Bjorli. Vennegrupper, firmagrupper og familier får her en luftig kløftoplevelse i den smalle vandfaldskløft under den kendte Kyllingbrua.',
    villeP2: 'Omkring Neagarafossen er der monteret flere lange ziplines, som lader dig krydse den vilde Rauma-å og opleve kløften fra højden. Den længste zipline er omkring 200 meter og starter fra en platform cirka 30 meter over åen.',
    villeP3: 'En god mulighed for dig der kan lide højde, fart og aktive oplevelser i Romsdalen.',
    villeCta: 'Se Ville Verma',
    villePracticalTitle: 'Praktisk info',
    villePoints: [
      'Højdepark og kløftoplevelse på Verma',
      'Ziplines over Rauma-å og ved Neagarafossen',
      'Passer til vennegrupper, firmagrupper og familier',
      'Kort køretur fra Bjorli',
    ],
    faqTitle: 'Ofte stillede spørgsmål',
    faqs: [
      { q: 'Kan begyndere prøve at klatre i Romsdalen?', a: 'Ja. Start gerne indendørs eller på via ferrata hos Norsk Tindesenter i Åndalsnes.' },
      { q: 'Findes der en klatrefører for området?', a: 'Ja. Romsdal Sportsklatring beskriver omkring 750 ruter på 36 områder fra Harøya til Eresfjord og Bjorli.' },
      { q: 'Er Bjorli et godt udgangspunkt for klatring?', a: 'Ja. Bjorli ligger på fjeldet syd for Romsdalen og er en praktisk base, når du vil kombinere klatring med fjelddage, cykling, fiskeri og familietid.' },
      { q: 'Viser bjorli.no konkrete ruter og grader?', a: 'Nej. Bjorli.no er ikke en klatrefører. Brug Romsdal Sportsklatring og lokale ressourcer for ruter, grader og topodata.' },
    ],
  },
  sv: {
    metaTitle: 'Klättring i Romsdalen | Bjorli som basecamp',
    metaDesc: 'Sportklättring, bouldering och via ferrata i Romsdalen. Bjorli ligger på fjället söder om regionen och är en praktisk bas för klätterdagar väster om bergen.',
    schemaName: 'Klättring och bouldering i Romsdalen',
    schemaSportDesc: 'Romsdal Sportsklatring täcker området från Harøya till Eresfjord och Bjorli, med omkring 750 leder fördelade på 36 klätterområden.',
    heroAlt: 'Branta granitväggar i Romsdalen i kvällsljus med dimma mellan topparna',
    heroEyebrow: 'Sommar i Romsdalen',
    heroTitle: 'Klättring och bouldering i Romsdalen',
    heroSubtitle: 'Romsdalen är känt för höga väggar, långa leder och en stark klätterscen. Bjorli ligger på fjället i söder — en kort tågresa eller bilresa från väggarna.',
    ctaGuide: 'Se klätterföraren',
    ctaTindesenter: 'Norsk Tindesenter',
    ctaSummer: 'Se sommaraktiviteter',
    bcAria: 'Brödsmulor',
    bcHome: 'Bjorli', bcSummer: 'Sommar', bcSelf: 'Klättring och bouldering i Romsdalen',
    introEyebrow: 'Romsdalen',
    introTitle: 'Ett klätterområde från fjord till fjäll',
    introBody: {
      lead: 'Väggarna står tätt här, från dalbotten upp till alpina leder på Romsdalshornet och Trolltindene. Scenen är etablerad — inomhusvägg, sportklippor och långa leder i fjället. Bjorli ligger söder om regionen och är en praktisk bas när du vill kombinera klättring med ',
      mid1: ', ', mid2: ' eller ', end: '.',
    },
    introLinkHikes: 'fjällvandringar',
    introLinkFishing: 'fiske i Lesjaskogsvatnet',
    introLinkCycling: 'cykling',
    beginnerEyebrow: 'För nybörjare och familjer',
    beginnerTitle: 'För dig som vill testa klättring',
    beginnerBody: 'Norsk Tindesenter i Åndalsnes är ett bra ställe att börja på. Inomhusvägg, bouldering och barnvänliga upplägg ger trygghet innan du ger dig ut i fjället. Här finns ledklättring, toprope och autobelay.',
    beginnerCta: 'Läs mer hos Norsk Tindesenter',
    beginnerImgAlt: 'Klätterutrustning — rep, kritpåse och karbiner på klippan',
    ferrataEyebrow: 'Via ferrata',
    ferrataTitle: 'Branta väggar, gjort tillgängliga',
    ferrataBody: 'Via ferrata ger dig luften under fötterna utan att du behöver kunna klättra. Norsk Tindesenter beskriver Introveggen, Randersveggen och Vestveggen i olika svårighetsgrader med utsikt över Romsdalsfjällen.',
    ferrataCta: 'Se Via Ferrata Åndalsnes',
    ferrataImgAlt: 'Via ferrata-kabel fastsatt i en brant vägg över Romsdalen',
    sportEyebrow: 'Sportklättring och bouldering',
    sportTitle: 'Väggar, krita på fingrarna och 750 leder',
    sportBody: 'Romsdal Sportsklatring samlar omkring 750 leder på 36 områden från Harøya i väster till Eresfjord i öster och Bjorli i söder. Använd guideboken och den lokala scenen för aktuell information om områden, tillträde och säkerhet.',
    sportCtaGuide: 'Köp / se Romsdal Sportsklatring',
    sportCtaUpdates: 'Se uppdateringar och rättelser',
    sportFootnote: 'Områden i regionen inkluderar Mjelvahammaren, Norafjell och Hornaksla. Se klätterföraren för grader och uppdaterade beskrivningar.',
    basecampEyebrow: 'Din bas',
    basecampTitle: 'Bjorli som basecamp',
    basecampBody: {
      lead: 'Bo lugnare. Res lättare. Upptäck mer. Från Bjorli når du väggarna i Romsdalen på en kort bilresa, och Rauma-banan knyter ihop dalen utan bil. När klätterdagen är slut väntar ',
      mid1: ', ', mid2: ' eller ', end: '.',
    },
    basecampLinkHikes: 'fjällvandringar',
    basecampLinkFishing: 'fiske i Lesjaskogsvatnet',
    basecampLinkShort: 'korta turer runt Bjorli',
    basecampItems: [
      { title: 'Rauma-banan', desc: 'Tåget går genom dalen och stannar nära flera klätterområden.' },
      { title: 'Boende på Bjorli', desc: 'Boende med enkel tillgång till fjäll och dal.' },
      { title: 'Fjällsjöar och toppar', desc: 'Fiske i Lesjaskogsvatnet och fjällturer i Reinheimen.' },
      { title: 'Fjord och vattenfall', desc: 'Dagsturer västerut till Mardalsfossen och Romsdalsfjorden.' },
      { title: 'Vilodagar mellan passen', desc: 'Cykling, fiske eller en lugn kväll vid stugan.' },
    ],
    resourcesEyebrow: 'Lokala resurser',
    resourcesTitle: 'Lokala resurser',
    resources: [
      { title: 'Romsdal Sportsklatring', desc: 'Klätterföraren för hela regionen.' },
      { title: 'Romsdal Tindegruppe / Molde Klatresenter', desc: 'Bakgrund om föraren och den lokala scenen.' },
      { title: 'Leduppdateringar och rättelser', desc: 'Kolla senaste informationen innan du ger dig av.' },
      { title: 'Norsk Tindesenter', desc: 'Inomhusklättring och bergsportcenter i Åndalsnes.' },
      { title: 'Via Ferrata Åndalsnes', desc: 'Introveggen, Randersveggen och Vestveggen.' },
      { title: 'Facebook: Klatring i Romsdalen', desc: 'Lokal grupp för uppdateringar och samtal.' },
    ],
    safetyTitle: 'Säkerhet först',
    safetyBody: 'Den här sidan är inte en klätterförare. Använd en aktuell förare, kontrollera lokala förhållanden och respektera tillträde och natur. Klättra med rätt kompetens och utrustning, och var uppmärksam på väder, vattenstånd och löst sten.',
    relatedEyebrow: 'Sommar på Bjorli',
    relatedTitle: 'Kombinera klättring med resten av sommaren',
    relatedChips: [
      { labelKey: 'fotturer', label: 'Vandring', to: '/fotturer' },
      { labelKey: 'korte', label: 'Korta turer runt Bjorli', to: '/sommer/korte-turer' },
      { labelKey: 'sykling', label: 'Cykling', to: '/sykling' },
      { labelKey: 'fiske', label: 'Fiske', to: '/fiske' },
      { labelKey: 'mardalsfossen', label: 'Mardalsfossen', to: '/sommer' },
      { labelKey: 'moskus', label: 'Myskoxar på Dovrefjell', to: '/sommer' },
      { labelKey: 'overnatting', label: 'Boende', to: '/overnatting' },
      { labelKey: 'reisen', label: 'Hitta hit', to: '/reisen-hit' },
    ],
    villeEyebrow: 'Fler höjdupplevelser i Romsdalen',
    villeTitle: 'Höjdparken Ville Verma',
    villeP1: 'Ville Verma ligger på Verma längst upp i Romsdalen, en kort bilresa från Bjorli. Vänner, företagsgrupper och familjer får en luftig ravinupplevelse i den smala vattenfallsravinen nedanför den välkända Kyllingbrua.',
    villeP2: 'Runt Neagarafossen är flera långa ziplines monterade som låter dig korsa den vilda Rauma-älven och uppleva ravinen från höjden. Den längsta ziplinen är omkring 200 meter och startar från en plattform ungefär 30 meter över älven.',
    villeP3: 'Ett bra alternativ för dig som gillar höjd, fart och aktiva dagar i Romsdalen.',
    villeCta: 'Se Ville Verma',
    villePracticalTitle: 'Praktisk info',
    villePoints: [
      'Höjdpark och ravinupplevelse på Verma',
      'Ziplines över Rauma-älven och vid Neagarafossen',
      'Passar för kompisgäng, företag och familjer',
      'Kort bilresa från Bjorli',
    ],
    faqTitle: 'Vanliga frågor',
    faqs: [
      { q: 'Kan nybörjare testa klättring i Romsdalen?', a: 'Ja. Börja gärna inomhus eller på via ferrata hos Norsk Tindesenter i Åndalsnes.' },
      { q: 'Finns det en klätterförare för området?', a: 'Ja. Romsdal Sportsklatring beskriver omkring 750 leder på 36 områden från Harøya till Eresfjord och Bjorli.' },
      { q: 'Är Bjorli en bra bas för klättring?', a: 'Ja. Bjorli ligger på fjället söder om Romsdalen och är en praktisk bas när du vill kombinera klättring med fjälldagar, cykling, fiske och familjetid.' },
      { q: 'Visar bjorli.no specifika leder och grader?', a: 'Nej. Bjorli.no är inte en klätterförare. Använd Romsdal Sportsklatring och lokala resurser för leder, grader och topo.' },
    ],
  },
};

/** Stable icon order for the basecamp items (matches the order in COPY.*.basecampItems). */
const BASECAMP_ICONS = [Train, Bed, Fish, Mountain, Bike];
/** Stable icon order for the resource cards (matches the order in COPY.*.resources). */
const RESOURCE_ICONS = [BookOpen, Users, Compass, Mountain, Activity, Users];
/** Stable URL order for the resource cards (matches the order in COPY.*.resources). */
const RESOURCE_HREFS = [LINKS.klatredepot, LINKS.molde, LINKS.forer, LINKS.tindesenter, LINKS.viaFerrata, LINKS.facebook];

const KlatringRomsdalen = () => {
  const lp = useLocalizedPath();
  const c = usePageCopy(COPY);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = c.metaTitle;
    const setMeta = (attr: 'name' | 'property', key: string, val: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
      return el;
    };
    const m1 = setMeta('name', 'description', c.metaDesc);
    const m2 = setMeta('property', 'og:title', c.metaTitle);
    const m3 = setMeta('property', 'og:description', c.metaDesc);

    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    const attractionLd = {
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: c.schemaName,
      description: c.metaDesc,
      touristType: ['Climbers', 'Outdoor enthusiasts', 'Families'],
      isAccessibleForFree: true,
      areaServed: {
        '@type': 'Place',
        name: 'Romsdalen, Norway',
      },
    };
    const sportLd = {
      '@context': 'https://schema.org',
      '@type': 'SportsActivityLocation',
      name: 'Romsdalen climbing region',
      sport: ['Sport climbing', 'Bouldering', 'Via ferrata'],
      description: c.schemaSportDesc,
    };
    const s1 = document.createElement('script');
    s1.type = 'application/ld+json';
    s1.text = JSON.stringify(faqLd);
    document.head.appendChild(s1);
    const s2 = document.createElement('script');
    s2.type = 'application/ld+json';
    s2.text = JSON.stringify(attractionLd);
    document.head.appendChild(s2);
    const s3 = document.createElement('script');
    s3.type = 'application/ld+json';
    s3.text = JSON.stringify(sportLd);
    document.head.appendChild(s3);

    return () => {
      document.title = prevTitle;
      s1.remove();
      s2.remove();
      s3.remove();
      void m1;
      void m2;
      void m3;
    };
  }, [c]);

  const ext = { target: '_blank', rel: 'noopener noreferrer' as const };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[600px] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt={c.heroAlt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-24 max-w-5xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-white/75 text-xs md:text-sm font-medium tracking-[0.24em] uppercase mb-6"
          >
            {c.heroEyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl md:text-7xl font-bold text-white mb-6 leading-[0.95] tracking-tight max-w-3xl"
          >
            {c.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/85 text-lg md:text-2xl mb-10 font-light max-w-2xl leading-relaxed"
          >
            {c.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 flex-wrap"
          >
            <a href={LINKS.klatredepot} {...ext}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                {c.ctaGuide} <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href={LINKS.tindesenter} {...ext}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto"
              >
                {c.ctaTindesenter} <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link to={lp('/sommer')}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto"
              >
                {c.ctaSummer} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label={c.bcAria}>
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">{c.bcHome}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp('/sommer')} className="hover:text-secondary">{c.bcSummer}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">{c.bcSelf}</li>
        </ol>
      </nav>

      {/* Intro */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
            {c.introEyebrow}
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-8 leading-[1.05] tracking-tight">
            {c.introTitle}
          </h2>
          <p className="text-lg md:text-xl text-foreground/85 leading-relaxed">
            {c.introBody.lead}
            <Link to={lp('/fotturer')} className="text-secondary underline-offset-4 hover:underline">{c.introLinkHikes}</Link>
            {c.introBody.mid1}
            <Link to={lp('/fiske')} className="text-secondary underline-offset-4 hover:underline">{c.introLinkFishing}</Link>
            {c.introBody.mid2}
            <Link to={lp('/sykling')} className="text-secondary underline-offset-4 hover:underline">{c.introLinkCycling}</Link>
            {c.introBody.end}
          </p>
        </div>
      </section>

      {/* Beginner / Tindesenter */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              {c.beginnerEyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              {c.beginnerTitle}
            </h2>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-8">
              {c.beginnerBody}
            </p>
            <a href={LINKS.tindesenter} {...ext}>
              <Button size="lg" className="font-semibold">
                {c.beginnerCta} <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <figure className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
            <img
              src={sportImg}
              alt={c.beginnerImgAlt}
              loading="lazy"
              className="w-full h-full object-cover"
              width={1600}
              height={1100}
            />
          </figure>
        </div>
      </section>

      {/* Via ferrata */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <figure className="rounded-2xl overflow-hidden bg-muted aspect-[4/3] order-2 lg:order-1">
            <img
              src={ferrataImg}
              alt={c.ferrataImgAlt}
              loading="lazy"
              className="w-full h-full object-cover"
              width={1600}
              height={1100}
            />
          </figure>
          <div className="order-1 lg:order-2">
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              {c.ferrataEyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              {c.ferrataTitle}
            </h2>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-8">
              {c.ferrataBody}
            </p>
            <a href={LINKS.viaFerrata} {...ext}>
              <Button size="lg" className="font-semibold">
                {c.ferrataCta} <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Sport climbing / bouldering — dark cinematic band */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
        <div className="relative z-10 container mx-auto max-w-3xl text-center">
          <div className="text-white/70 text-xs font-medium tracking-[0.24em] uppercase mb-5">
            {c.sportEyebrow}
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-8 leading-[1.05] tracking-tight">
            {c.sportTitle}
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed mb-10">
            {c.sportBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <a href={LINKS.klatredepot} {...ext}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                {c.sportCtaGuide} <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href={LINKS.forer} {...ext}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto"
              >
                {c.sportCtaUpdates} <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <p className="mt-8 text-white/55 text-xs leading-relaxed max-w-xl mx-auto">
            {c.sportFootnote}
          </p>
        </div>
      </section>

      {/* Basecamp */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              {c.basecampEyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              {c.basecampTitle}
            </h2>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed">
              {c.basecampBody.lead}
              <Link to={lp('/fotturer')} className="text-secondary underline-offset-4 hover:underline">{c.basecampLinkHikes}</Link>
              {c.basecampBody.mid1}
              <Link to={lp('/fiske')} className="text-secondary underline-offset-4 hover:underline">{c.basecampLinkFishing}</Link>
              {c.basecampBody.mid2}
              <Link to={lp('/sommer/korte-turer')} className="text-secondary underline-offset-4 hover:underline">{c.basecampLinkShort}</Link>
              {c.basecampBody.end}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {c.basecampItems.map((item, i) => {
              const Icon = BASECAMP_ICONS[i] ?? Mountain;
              return (
                <Card key={item.title} className="bg-card/60 backdrop-blur border-border/60 h-full">
                  <CardContent className="p-5">
                    <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold mb-1.5 leading-tight">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local resources */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              {c.resourcesEyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              {c.resourcesTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.resources.map((res, i) => {
              const Icon = RESOURCE_ICONS[i] ?? BookOpen;
              const href = RESOURCE_HREFS[i] ?? LINKS.klatredepot;
              return (
                <a
                  key={res.title}
                  href={href}
                  {...ext}
                  className="group block rounded-2xl border border-border/60 bg-card p-6 hover:border-secondary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold mb-1.5 leading-tight flex items-center gap-2">
                        {res.title}
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-secondary transition-colors" />
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{res.desc}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {c.safetyTitle}
              </h2>
            </div>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed">
              {c.safetyBody}
            </p>
          </div>
        </div>
      </section>

      {/* Related activities */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-10">
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              {c.relatedEyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              {c.relatedTitle}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {c.relatedChips.map(({ labelKey, label, to }) => (
              <Link
                key={labelKey}
                to={lp(to)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-secondary hover:text-secondary transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ville Verma */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              {c.villeEyebrow}
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              {c.villeTitle}
            </h2>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-6">{c.villeP1}</p>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-6">{c.villeP2}</p>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-10">{c.villeP3}</p>
            <a href="https://www.villeverma.no/" {...ext}>
              <Button size="lg" className="font-semibold">
                {c.villeCta} <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <Card className="bg-card/60 backdrop-blur border-border/60">
            <CardContent className="p-6">
              <h3 className="font-display text-lg font-semibold mb-4 text-foreground">
                {c.villePracticalTitle}
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {c.villePoints.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="text-secondary mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
            {c.faqTitle}
          </h2>
          <div className="space-y-3">
            {c.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border bg-card p-5 open:bg-card transition-colors"
              >
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
    </div>
  );
};

export default KlatringRomsdalen;