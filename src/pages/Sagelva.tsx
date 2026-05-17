import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Clock, Users, Accessibility, Info, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import heroImg from '@/assets/sagelva/sagelva-hero-vasskraftsenter.jpg';
import mekanismeImg from '@/assets/sagelva/sagelva-vannmekanisme.jpg';
import anleggImg from '@/assets/sagelva/sagelva-anlegg-furuskog.jpg';
import guideImg from '@/assets/sagelva/sagelva-guide-formidling.jpg';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

const SAGELVA_URL = 'https://www.sagelva.net/';

const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

type Copy = {
  metaTitle: string;
  metaDesc: string;
  heroTitle: string;
  heroSubtitle: string;
  visitBtn: string;
  moreSummerBtn: string;
  introTitle: string;
  introP1: string;
  introP2: string;
  introP3Pre: string;
  introHikingLabel: string;
  introFarmLabel: string;
  introActivitiesLabel: string;
  introP3Post: string;
  cards: { title: string; desc: string; alt: string }[];
  practicalTitle: string;
  locationLabel: string; locationBody: string;
  timeLabel: string; timeBody: string;
  forLabel: string; forBody: string;
  accessLabel: string; accessBody: string;
  cafeNote: string;
  infoBeforePre: string;
  infoLink: string;
  infoBeforePost: string;
  goSagelva: string;
  combineTitle: string;
  combineBody: string;
  seeAll: string;
};

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', Copy> = {
  no: {
    metaTitle: 'Sagelva vasskraftsenter | Sommeraktivitet nær Bjorli',
    metaDesc: 'Opplev Sagelva vasskraftsenter i Lesja, med vasskraft, lokalhistorie, guider og familievennlige sommeropplevelser nær Bjorli.',
    heroTitle: 'Sagelva vasskraftsenter',
    heroSubtitle: 'Vasskraft, lokalhistorie og levende formidling i Lesja',
    visitBtn: 'Besøk Sagelva',
    moreSummerBtn: 'Se flere sommeraktiviteter',
    introTitle: 'Vasskraft som har drevet bygda i 300 år',
    introP1: 'Sagelva vasskraftsenter ligger på Stueflotten øverst i Romsdalen, like ved Bjorli i Lesja kommune. Her kan du oppleve hvordan vatnet frå Asbjørnsåa har gitt kraft til sag, kvern og vadmelstampe i tre hundre år — og hvordan det fortsatt gjør det i dag.',
    introP2: 'Anlegget er bygd opp av lokale ildsjeler og viser fram et fullskala vasskraftanlegg med oppgangssag, sirkelsag, kvern og vadmelstampe. I 2020 mottok Sagelva Olavsrosa frå Norsk kulturarv som ein anerkjenning av det levande kulturminnearbeidet.',
    introP3Pre: 'For deg som besøker Bjorli er Sagelva en rolig og innholdsrik halvdagstur — en fin kontrast til ',
    introHikingLabel: 'fotturer',
    introFarmLabel: 'gardsbesøk',
    introActivitiesLabel: 'aktiviteter',
    introP3Post: ' i området.',
    cards: [
      { title: 'Levende vasskraft', desc: 'Et fullskala anlegg drevet av vatn — oppgangssag, sirkelsag, kvern og vadmelstampe står og virker når vatnet kjem.', alt: 'Vassdrevet mekanisme på Sagelva vasskraftsenter' },
      { title: 'Lokal historie', desc: '300 år med vasskraft på Stueflotten øverst i Romsdalen — bygd opp av lokale ildsjeler og tildelt Olavsrosa fra Norsk kulturarv i 2020.', alt: 'Anlegget på Sagelva i furuskogen i Lesja' },
      { title: 'For familier og nysgjerrige', desc: 'Lokale, engasjerte guider gir et levende innblikk i bygningar, mekanismar, historie og kultur — fint for både små og store.', alt: 'Guide formidler historien om Sagelva vasskraftsenter' },
    ],
    practicalTitle: 'Praktisk informasjon',
    locationLabel: 'Beliggenhet', locationBody: 'Brøste, Bjorli — Stueflotten i Lesja kommune.',
    timeLabel: 'Tidsbruk', timeBody: 'Beregn omtrent 1 time. Er du særlig interessert, går tida fort.',
    forLabel: 'Passer for', forBody: 'Familier, kulturinteresserte, rolige sommerdager og grupper.',
    accessLabel: 'Tilgjengelighet', accessBody: 'Godt gruset sti på anlegget. Deler kan oppleves med rullestol og barnevogn.',
    cafeNote: 'I kafeen Bedehuset har vertskapet servert vafler, kake, kaffe og saft i sommarsesongen. Tilbod og opningstider kan variere frå år til år.',
    infoBeforePre: 'Sjekk alltid ',
    infoLink: 'Sagelva vasskraftsenter',
    infoBeforePost: ' for oppdaterte åpningstider, arrangementer og praktisk informasjon før du drar.',
    goSagelva: 'Gå til sagelva.net',
    combineTitle: 'Kombiner Sagelva med en sommerdag på Bjorli',
    combineBody: 'Sagelva passer godt som en rolig halvdagstur for familier, par og grupper som vil oppleve mer av Bjorli.',
    seeAll: 'Se alle aktiviteter',
  },
  en: {
    metaTitle: 'Sagelva vasskraftsenter | Summer experience near Bjorli',
    metaDesc: 'Visit Sagelva vasskraftsenter in Lesja — water power, local history, guides and family-friendly summer experiences near Bjorli.',
    heroTitle: 'Sagelva vasskraftsenter',
    heroSubtitle: 'Water power, local history and living heritage in Lesja',
    visitBtn: 'Visit Sagelva',
    moreSummerBtn: 'See more summer activities',
    introTitle: 'Water power that has driven the valley for 300 years',
    introP1: 'Sagelva vasskraftsenter sits at Stueflotten at the top of Romsdalen, just by Bjorli in Lesja municipality. Here you can see how water from the Asbjørnsåa river has powered a sawmill, mill and fulling stamp for three hundred years — and still does today.',
    introP2: 'The site has been built up by local volunteers and shows a full-scale water-powered plant with frame saw, circular saw, mill and fulling stamp. In 2020 Sagelva received Olavsrosa from Norsk kulturarv in recognition of its living heritage work.',
    introP3Pre: 'For visitors to Bjorli, Sagelva makes a quiet, substantial half-day trip — a calm counterpoint to ',
    introHikingLabel: 'hiking',
    introFarmLabel: 'farm visits',
    introActivitiesLabel: 'activities',
    introP3Post: ' in the area.',
    cards: [
      { title: 'Living water power', desc: 'A full-scale plant driven by water — frame saw, circular saw, mill and fulling stamp all run when the water flows.', alt: 'Water-driven mechanism at Sagelva vasskraftsenter' },
      { title: 'Local history', desc: '300 years of water power at Stueflotten at the head of Romsdalen — built by local volunteers and awarded Olavsrosa by Norsk kulturarv in 2020.', alt: 'The Sagelva site among the pine forest in Lesja' },
      { title: 'For families and the curious', desc: 'Local, engaged guides give a hands-on insight into the buildings, mechanisms, history and culture — suited to both children and adults.', alt: 'A guide telling the story of Sagelva vasskraftsenter' },
    ],
    practicalTitle: 'Practical information',
    locationLabel: 'Location', locationBody: 'Brøste, Bjorli — Stueflotten in Lesja municipality.',
    timeLabel: 'Time needed', timeBody: 'Allow about one hour. If the subject grabs you, time tends to pass quickly.',
    forLabel: 'Suited to', forBody: 'Families, anyone interested in culture, quiet summer days and groups.',
    accessLabel: 'Accessibility', accessBody: 'Well-gravelled paths around the site. Parts can be visited with wheelchair and pram.',
    cafeNote: 'In the Bedehuset café the hosts have served waffles, cake, coffee and squash during the summer season. Offering and opening hours may vary year to year.',
    infoBeforePre: 'Always check ',
    infoLink: 'Sagelva vasskraftsenter',
    infoBeforePost: ' for current opening hours, events and practical information before your visit.',
    goSagelva: 'Go to sagelva.net',
    combineTitle: 'Combine Sagelva with a summer day at Bjorli',
    combineBody: 'Sagelva works well as a quiet half-day trip for families, couples and groups who want to see more of Bjorli.',
    seeAll: 'See all activities',
  },
  de: {
    metaTitle: 'Sagelva vasskraftsenter | Sommererlebnis nahe Bjorli',
    metaDesc: 'Besuchen Sie Sagelva vasskraftsenter in Lesja — Wasserkraft, lokale Geschichte, Führungen und familienfreundliche Sommererlebnisse nahe Bjorli.',
    heroTitle: 'Sagelva vasskraftsenter',
    heroSubtitle: 'Wasserkraft, lokale Geschichte und gelebte Vermittlung in Lesja',
    visitBtn: 'Sagelva besuchen',
    moreSummerBtn: 'Weitere Sommeraktivitäten ansehen',
    introTitle: 'Wasserkraft, die das Tal seit 300 Jahren antreibt',
    introP1: 'Sagelva vasskraftsenter liegt auf Stueflotten am oberen Ende von Romsdalen, direkt bei Bjorli in der Kommune Lesja. Hier sehen Sie, wie Wasser aus der Asbjørnsåa seit dreihundert Jahren Säge, Mühle und Walkstampfe antreibt — und es bis heute tut.',
    introP2: 'Die Anlage wurde von engagierten Einheimischen aufgebaut und zeigt einen vollständigen wasserbetriebenen Betrieb mit Gattersäge, Kreissäge, Mühle und Walkstampfe. 2020 erhielt Sagelva die Olavsrose von Norsk kulturarv als Anerkennung für die lebendige Kulturarbeit.',
    introP3Pre: 'Für Gäste in Bjorli ist Sagelva ein ruhiger, gehaltvoller Halbtagesausflug — ein passender Gegenpol zu ',
    introHikingLabel: 'Wanderungen',
    introFarmLabel: 'Hofbesuchen',
    introActivitiesLabel: 'Aktivitäten',
    introP3Post: ' in der Region.',
    cards: [
      { title: 'Gelebte Wasserkraft', desc: 'Eine vollständige, wasserbetriebene Anlage — Gattersäge, Kreissäge, Mühle und Walkstampfe laufen, sobald das Wasser kommt.', alt: 'Wasserbetriebener Mechanismus im Sagelva vasskraftsenter' },
      { title: 'Lokale Geschichte', desc: '300 Jahre Wasserkraft auf Stueflotten am oberen Ende von Romsdalen — aufgebaut von Einheimischen, 2020 mit der Olavsrose von Norsk kulturarv ausgezeichnet.', alt: 'Die Anlage von Sagelva im Kiefernwald in Lesja' },
      { title: 'Für Familien und Neugierige', desc: 'Engagierte Guides aus der Region geben einen lebendigen Einblick in Gebäude, Mechanismen, Geschichte und Kultur — geeignet für Groß und Klein.', alt: 'Eine Führung erklärt die Geschichte von Sagelva vasskraftsenter' },
    ],
    practicalTitle: 'Praktische Informationen',
    locationLabel: 'Lage', locationBody: 'Brøste, Bjorli — Stueflotten in der Kommune Lesja.',
    timeLabel: 'Zeitbedarf', timeBody: 'Rechnen Sie mit etwa einer Stunde. Wer sich besonders dafür interessiert, bleibt gern länger.',
    forLabel: 'Geeignet für', forBody: 'Familien, kulturinteressierte Gäste, ruhige Sommertage und Gruppen.',
    accessLabel: 'Zugänglichkeit', accessBody: 'Gut geschotterte Wege auf dem Gelände. Teile sind mit Rollstuhl und Kinderwagen erreichbar.',
    cafeNote: 'Im Café Bedehuset hat das Team in der Sommersaison Waffeln, Kuchen, Kaffee und Saft serviert. Angebot und Öffnungszeiten können von Jahr zu Jahr variieren.',
    infoBeforePre: 'Prüfen Sie immer ',
    infoLink: 'Sagelva vasskraftsenter',
    infoBeforePost: ' auf aktuelle Öffnungszeiten, Veranstaltungen und praktische Hinweise vor Ihrem Besuch.',
    goSagelva: 'Zu sagelva.net',
    combineTitle: 'Sagelva mit einem Sommertag in Bjorli verbinden',
    combineBody: 'Sagelva eignet sich gut als ruhiger Halbtagesausflug für Familien, Paare und Gruppen, die mehr von Bjorli sehen möchten.',
    seeAll: 'Alle Aktivitäten ansehen',
  },
  nl: {
    metaTitle: 'Sagelva vasskraftsenter | Zomeractiviteit dicht bij Bjorli',
    metaDesc: 'Bezoek Sagelva vasskraftsenter in Lesja — waterkracht, lokale geschiedenis, gidsen en familievriendelijke zomerbelevingen dicht bij Bjorli.',
    heroTitle: 'Sagelva vasskraftsenter',
    heroSubtitle: 'Waterkracht, lokale geschiedenis en levende overdracht in Lesja',
    visitBtn: 'Bezoek Sagelva',
    moreSummerBtn: 'Bekijk meer zomeractiviteiten',
    introTitle: 'Waterkracht die het dal al 300 jaar aandrijft',
    introP1: 'Sagelva vasskraftsenter ligt op Stueflotten bovenin Romsdalen, vlak bij Bjorli in de gemeente Lesja. Hier zie je hoe water uit de Asbjørnsåa al drie eeuwen lang zaagmolen, korenmolen en voldermolen aandrijft — en dat vandaag nog steeds doet.',
    introP2: 'De site is opgebouwd door lokale enthousiastelingen en toont een complete waterkrachtinstallatie met raamzaag, cirkelzaag, molen en voldermolen. In 2020 ontving Sagelva de Olavsroos van Norsk kulturarv als erkenning voor het levende erfgoedwerk.',
    introP3Pre: 'Voor wie Bjorli bezoekt is Sagelva een rustige, inhoudsvolle halve dag — een mooi contrast met ',
    introHikingLabel: 'wandelen',
    introFarmLabel: 'boerderijbezoek',
    introActivitiesLabel: 'activiteiten',
    introP3Post: ' in de omgeving.',
    cards: [
      { title: 'Levende waterkracht', desc: 'Een complete installatie aangedreven door water — raamzaag, cirkelzaag, molen en voldermolen draaien zodra het water komt.', alt: 'Waterkrachtmechanisme bij Sagelva vasskraftsenter' },
      { title: 'Lokale geschiedenis', desc: '300 jaar waterkracht op Stueflotten bovenin Romsdalen — opgebouwd door lokale vrijwilligers en in 2020 bekroond met de Olavsroos van Norsk kulturarv.', alt: 'De site van Sagelva in het dennenbos in Lesja' },
      { title: 'Voor families en nieuwsgierigen', desc: 'Lokale, betrokken gidsen geven een levendige inkijk in gebouwen, mechanismen, geschiedenis en cultuur — geschikt voor jong en oud.', alt: 'Gids vertelt het verhaal van Sagelva vasskraftsenter' },
    ],
    practicalTitle: 'Praktische informatie',
    locationLabel: 'Locatie', locationBody: 'Brøste, Bjorli — Stueflotten in de gemeente Lesja.',
    timeLabel: 'Tijdsindicatie', timeBody: 'Reken op ongeveer een uur. Ben je extra geïnteresseerd, dan vliegt de tijd voorbij.',
    forLabel: 'Geschikt voor', forBody: 'Families, cultuurliefhebbers, rustige zomerdagen en groepen.',
    accessLabel: 'Toegankelijkheid', accessBody: 'Goed verharde paden op het terrein. Delen zijn bereikbaar met rolstoel en kinderwagen.',
    cafeNote: 'In het café Bedehuset serveren de gastheren in het zomerseizoen wafels, taart, koffie en limonade. Aanbod en openingstijden kunnen per jaar verschillen.',
    infoBeforePre: 'Bekijk altijd ',
    infoLink: 'Sagelva vasskraftsenter',
    infoBeforePost: ' voor actuele openingstijden, evenementen en praktische informatie voor je bezoek.',
    goSagelva: 'Ga naar sagelva.net',
    combineTitle: 'Combineer Sagelva met een zomerdag op Bjorli',
    combineBody: 'Sagelva past goed als rustige halve dag voor families, stellen en groepen die meer van Bjorli willen zien.',
    seeAll: 'Bekijk alle activiteiten',
  },
  da: {
    metaTitle: 'Sagelva vasskraftsenter | Sommeraktivitet nær Bjorli',
    metaDesc: 'Oplev Sagelva vasskraftsenter i Lesja — vandkraft, lokal historie, guider og familievenlige sommeroplevelser nær Bjorli.',
    heroTitle: 'Sagelva vasskraftsenter',
    heroSubtitle: 'Vandkraft, lokal historie og levende formidling i Lesja',
    visitBtn: 'Besøg Sagelva',
    moreSummerBtn: 'Se flere sommeraktiviteter',
    introTitle: 'Vandkraft, der har drevet bygden i 300 år',
    introP1: 'Sagelva vasskraftsenter ligger på Stueflotten øverst i Romsdalen, lige ved Bjorli i Lesja kommune. Her kan du opleve, hvordan vand fra Asbjørnsåa har givet kraft til sav, mølle og vadmelstampe i tre hundrede år — og hvordan det stadig gør det i dag.',
    introP2: 'Anlægget er bygget op af lokale ildsjæle og viser et fuldskala vandkraftanlæg med opgangssav, rundsav, mølle og vadmelstampe. I 2020 modtog Sagelva Olavsrosa fra Norsk kulturarv som anerkendelse af det levende kulturarbejde.',
    introP3Pre: 'For dig, der besøger Bjorli, er Sagelva en rolig og indholdsrig halvdagstur — en fin kontrast til ',
    introHikingLabel: 'vandring',
    introFarmLabel: 'gårdsbesøg',
    introActivitiesLabel: 'aktiviteter',
    introP3Post: ' i området.',
    cards: [
      { title: 'Levende vandkraft', desc: 'Et fuldskala anlæg drevet af vand — opgangssav, rundsav, mølle og vadmelstampe står og kører, når vandet kommer.', alt: 'Vanddrevet mekanisme på Sagelva vasskraftsenter' },
      { title: 'Lokal historie', desc: '300 års vandkraft på Stueflotten øverst i Romsdalen — bygget op af lokale ildsjæle og tildelt Olavsrosa af Norsk kulturarv i 2020.', alt: 'Anlægget ved Sagelva i fyrreskoven i Lesja' },
      { title: 'For familier og nysgerrige', desc: 'Engagerede lokale guider giver et levende indblik i bygninger, mekanismer, historie og kultur — fint for både store og små.', alt: 'Guide fortæller historien om Sagelva vasskraftsenter' },
    ],
    practicalTitle: 'Praktisk information',
    locationLabel: 'Beliggenhed', locationBody: 'Brøste, Bjorli — Stueflotten i Lesja kommune.',
    timeLabel: 'Tidsforbrug', timeBody: 'Regn med cirka en time. Er du særligt interesseret, går tiden hurtigt.',
    forLabel: 'Passer til', forBody: 'Familier, kulturinteresserede, rolige sommerdage og grupper.',
    accessLabel: 'Tilgængelighed', accessBody: 'Velgrusede stier på området. Dele kan opleves med kørestol og barnevogn.',
    cafeNote: 'I caféen Bedehuset har værtskabet serveret vafler, kage, kaffe og saft i sommersæsonen. Tilbud og åbningstider kan variere fra år til år.',
    infoBeforePre: 'Tjek altid ',
    infoLink: 'Sagelva vasskraftsenter',
    infoBeforePost: ' for opdaterede åbningstider, arrangementer og praktisk information før dit besøg.',
    goSagelva: 'Gå til sagelva.net',
    combineTitle: 'Kombiner Sagelva med en sommerdag på Bjorli',
    combineBody: 'Sagelva passer godt som rolig halvdagstur for familier, par og grupper, der vil opleve mere af Bjorli.',
    seeAll: 'Se alle aktiviteter',
  },
  sv: {
    metaTitle: 'Sagelva vasskraftsenter | Sommaraktivitet nära Bjorli',
    metaDesc: 'Upplev Sagelva vasskraftsenter i Lesja — vattenkraft, lokal historia, guider och familjevänliga sommarupplevelser nära Bjorli.',
    heroTitle: 'Sagelva vasskraftsenter',
    heroSubtitle: 'Vattenkraft, lokal historia och levande förmedling i Lesja',
    visitBtn: 'Besök Sagelva',
    moreSummerBtn: 'Se fler sommaraktiviteter',
    introTitle: 'Vattenkraft som drivit bygden i 300 år',
    introP1: 'Sagelva vasskraftsenter ligger på Stueflotten överst i Romsdalen, alldeles intill Bjorli i Lesja kommun. Här ser du hur vatten från Asbjørnsåa drivit såg, kvarn och valkstamp i tre hundra år — och fortfarande gör det i dag.',
    introP2: 'Anläggningen är uppbyggd av lokala eldsjälar och visar en fullskalig vattenkraftanläggning med ramsåg, cirkelsåg, kvarn och valkstamp. 2020 fick Sagelva Olavsrosa från Norsk kulturarv som ett erkännande för det levande kulturarvsarbetet.',
    introP3Pre: 'För dig som besöker Bjorli är Sagelva en lugn och innehållsrik halvdagstur — en fin kontrast till ',
    introHikingLabel: 'vandring',
    introFarmLabel: 'gårdsbesök',
    introActivitiesLabel: 'aktiviteter',
    introP3Post: ' i området.',
    cards: [
      { title: 'Levande vattenkraft', desc: 'En fullskalig anläggning driven av vatten — ramsåg, cirkelsåg, kvarn och valkstamp går igång när vattnet kommer.', alt: 'Vattendriven mekanism på Sagelva vasskraftsenter' },
      { title: 'Lokal historia', desc: '300 år av vattenkraft på Stueflotten överst i Romsdalen — uppbyggd av lokala eldsjälar och tilldelad Olavsrosa av Norsk kulturarv 2020.', alt: 'Anläggningen vid Sagelva i tallskogen i Lesja' },
      { title: 'För familjer och nyfikna', desc: 'Engagerade lokala guider ger en levande inblick i byggnader, mekanismer, historia och kultur — passar både små och stora.', alt: 'Guide berättar historien om Sagelva vasskraftsenter' },
    ],
    practicalTitle: 'Praktisk information',
    locationLabel: 'Plats', locationBody: 'Brøste, Bjorli — Stueflotten i Lesja kommun.',
    timeLabel: 'Tidsåtgång', timeBody: 'Räkna med ungefär en timme. Är du särskilt intresserad går tiden fort.',
    forLabel: 'Passar', forBody: 'Familjer, kulturintresserade, lugna sommardagar och grupper.',
    accessLabel: 'Tillgänglighet', accessBody: 'Välgrusade stigar på området. Delar går att uppleva med rullstol och barnvagn.',
    cafeNote: 'I caféet Bedehuset har värdarna serverat våfflor, kaka, kaffe och saft under sommarsäsongen. Utbud och öppettider kan variera år för år.',
    infoBeforePre: 'Kolla alltid ',
    infoLink: 'Sagelva vasskraftsenter',
    infoBeforePost: ' för aktuella öppettider, evenemang och praktisk information innan ditt besök.',
    goSagelva: 'Gå till sagelva.net',
    combineTitle: 'Kombinera Sagelva med en sommardag på Bjorli',
    combineBody: 'Sagelva passar bra som en lugn halvdagstur för familjer, par och grupper som vill se mer av Bjorli.',
    seeAll: 'Se alla aktiviteter',
  },
};

const EXPERIENCE_IMAGES = [mekanismeImg, anleggImg, guideImg];

const Sagelva = () => {
  const t = usePageCopy(COPY);
  const lp = useLocalizedPath();

  useEffect(() => {
    const prev = document.title;
    document.title = t.metaTitle;
    setMeta('description', t.metaDesc);
    setMeta('og:title', t.metaTitle, 'property');
    setMeta('og:description', t.metaDesc, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', '/sagelva', 'property');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: 'Sagelva vasskraftsenter',
      description: t.metaDesc,
      url: SAGELVA_URL,
      address: { '@type': 'PostalAddress', addressLocality: 'Bjorli', addressRegion: 'Lesja', addressCountry: 'NO' },
    });
    document.head.appendChild(ld);
    return () => {
      document.title = prev;
      ld.remove();
    };
  }, [t.metaTitle, t.metaDesc]);

  return (
    <div>
      <PageHero title={t.heroTitle} subtitle={t.heroSubtitle} image={heroImg} />

      <section className="px-4 -mt-8 relative z-10">
        <div className="container mx-auto max-w-3xl flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg">
            <a href={SAGELVA_URL} target="_blank" rel="noopener noreferrer">
              {t.visitBtn} <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to={lp('/sommer')}>{t.moreSummerBtn}</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {t.introTitle}
            </h2>
            <p>{t.introP1}</p>
            <p>{t.introP2}</p>
            <p>
              {t.introP3Pre}
              <Link to={lp('/fotturer')} className="text-secondary underline-offset-2 hover:underline">{t.introHikingLabel}</Link>,
              {' '}<Link to={lp('/gardsbesok')} className="text-secondary underline-offset-2 hover:underline">{t.introFarmLabel}</Link>
              {' og '}
              <Link to={lp('/aktiviteter')} className="text-secondary underline-offset-2 hover:underline">{t.introActivitiesLabel}</Link>
              {t.introP3Post}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.cards.map((c, i) => (
              <motion.article
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-card rounded-2xl overflow-hidden border border-border/70 flex flex-col"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img src={EXPERIENCE_IMAGES[i]} alt={c.alt} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 leading-tight">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
            {t.practicalTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex gap-4">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">{t.locationLabel}</div>
                  <div className="text-sm text-muted-foreground">{t.locationBody}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex gap-4">
                <Clock className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">{t.timeLabel}</div>
                  <div className="text-sm text-muted-foreground">{t.timeBody}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex gap-4">
                <Users className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">{t.forLabel}</div>
                  <div className="text-sm text-muted-foreground">{t.forBody}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex gap-4">
                <Accessibility className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">{t.accessLabel}</div>
                  <div className="text-sm text-muted-foreground">{t.accessBody}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t.cafeNote}</p>

          <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5 flex gap-3 items-start">
            <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              {t.infoBeforePre}
              <a href={SAGELVA_URL} target="_blank" rel="noopener noreferrer" className="text-secondary underline-offset-2 hover:underline">{t.infoLink}</a>
              {t.infoBeforePost}
            </p>
          </div>

          <div className="mt-8">
            <Button asChild size="lg">
              <a href={SAGELVA_URL} target="_blank" rel="noopener noreferrer">
                {t.goSagelva} <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-muted/40">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            {t.combineTitle}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            {t.combineBody}
          </p>
          <Button asChild size="lg">
            <Link to={lp('/aktiviteter')}>
              {t.seeAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Sagelva;
