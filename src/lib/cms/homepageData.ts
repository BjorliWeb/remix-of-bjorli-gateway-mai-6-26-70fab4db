/**
 * Node-safe homepage content for the winter (default) homepage.
 *
 * This module is imported by both the React runtime (via the CMS adapter)
 * and the prerender script so the static HTML and the hydrated page share
 * the same hero text, intro, planning cards and key section links.
 */
import type { Language } from './types';

export interface HomepageCard {
  title: string;
  desc: string;
  /** Resolved route path or absolute external URL. */
  href: string;
  external?: boolean;
}

export interface HomepageHero {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLiftPass: string;
  ctaStay: string;
  ctaOpening: string;
  liftPassUrl: string;
}

export interface HomepageIntro {
  title: string;
  body: string;
  eyebrow?: string;
  statement?: string;
  supportingText?: string;
  proofPoints?: readonly string[];
}

export interface HomepageSectionCard {
  title: string;
  body: string;
  cta: string;
  href: string;
  eyebrow?: string;
}

export interface HomepageData {
  language: Language;
  hero: HomepageHero;
  intro: HomepageIntro;
  planning: {
    title: string;
    subtitle: string;
    cards: HomepageCard[];
  };
  skiCenter: HomepageSectionCard;
  accommodation: HomepageSectionCard;
}

const LIFT_PASS_URL =
  'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862';

const PAGE_COPY: Record<Language, HomepageData> = {
  no: {
    language: 'no',
    hero: {
      eyebrow: 'Destinasjon Bjorli – vinter',
      title: 'Snøsikre skidager for hele familien',
      subtitle: 'Alpint, langrenn, hytter og enkle fjelldager på Bjorli – mellom fjell og fjord.',
      ctaLiftPass: 'Kjøp heiskort',
      ctaStay: 'Finn overnatting',
      ctaOpening: 'Se åpningstider og føre',
      liftPassUrl: LIFT_PASS_URL,
    },
    intro: {
      title: 'Opplev vinteren på Bjorli',
      body: 'Bjorli er en snøsikker vinterdestinasjon for familier, hyttegjester og alle som vil ha ekte fjelldager uten stress. Her finner du alpint, langrenn, skiutleie, skiskole, mat og drikke, overnatting og enkel adkomst med bil og tog.',
      eyebrow: 'Destinasjon Bjorli',
      statement: 'Ekte vinter, korte avstander og rolige fjelldager mellom Østlandet og fjordene på Nordvestlandet.',
      supportingText: 'Bjorli samler alpint, langrenn, hytter, servering og natur tett på hverandre. Her er det enkelt å planlegge en vinterhelg, en familieferie eller noen rolige dager på fjellet.',
      proofPoints: ['Snøsikkert og familievennlig', 'Tog til fjellet med Raumabanen', 'Ski, hytter og natur tett på hverandre'],
    },
    planning: {
      title: 'Alt du trenger for vinterdagen',
      subtitle: 'Planlegg dagen på fjellet med oppdatert informasjon, heiskort og praktiske tjenester.',
      cards: [
        { title: 'Bjorli Skisenter', desc: 'Familievennlige nedfarter og snøsikre forhold', href: '/bjorli-skisenter' },
        { title: 'Heiskort', desc: 'Kjøp dagskort eller sesongkort online', href: LIFT_PASS_URL, external: true },
        { title: 'Åpningstider', desc: 'Dagens åpningstider i skisenteret', href: '/apningstider' },
        { title: 'Livecams', desc: 'Se forholdene i fjellet i sanntid', href: '/vaer-og-webkamera' },
        { title: 'Løypekart', desc: 'Oversikt over alle nedfarter og heiser', href: '/loypekart' },
        { title: 'Overnatting', desc: 'Hytter, leiligheter og hoteller', href: '/overnatting' },
        { title: 'Skiutleie', desc: 'Ski, snowboard og utstyr i alle størrelser', href: '/skiutleie' },
        { title: 'Mat & drikke', desc: 'Heiskroa og spisesteder ved fjellet', href: '/mat-og-drikke' },
      ],
    },
    skiCenter: {
      eyebrow: 'Vintersesongens hjerte',
      title: 'Bjorli Skisenter',
      body: 'I vintersesongen er Bjorli Skisenter det naturlige samlingspunktet på destinasjonen. Her finner du familievennlige nedfarter, heiskort, skiutleie, skiskole, mat og drikke, livecams og oppdatert informasjon om forholdene.',
      cta: 'Se Bjorli Skisenter',
      href: '/bjorli-skisenter',
    },
    accommodation: {
      eyebrow: 'Overnatting',
      title: 'Bo tett på fjellet',
      body: 'Velg mellom hytter, leiligheter og hotell på Bjorli. Her bor du med kort vei til aktiviteter, servering, tog, ski og naturopplevelser.',
      cta: 'Finn overnatting',
      href: '/overnatting',
    },
  },
  en: {
    language: 'en',
    hero: {
      eyebrow: 'Winter in Bjorli, Norway',
      title: 'Your family ski holiday starts here',
      subtitle: 'Days on the slopes, fresh mountain air and cosy evenings together. Discover Bjorli, a welcoming base for skiing and winter holidays in the Norwegian mountains.',
      ctaLiftPass: 'Buy lift passes',
      ctaStay: 'Find your accommodation',
      ctaOpening: 'Opening times & snow conditions',
      liftPassUrl: LIFT_PASS_URL,
    },
    intro: {
      title: 'Find your winter in Bjorli',
      body: 'Spend the day skiing, explore the cross-country trails or take a break over lunch. With ski hire, lessons and a choice of places to stay, you can plan a holiday that suits your family.',
      eyebrow: 'Winter holidays',
      statement: 'Find your winter in Bjorli',
      // Two short paragraphs; a blank line starts a new paragraph.
      supportingText: 'Spend the day skiing, explore the cross-country trails or take a break over lunch. With ski hire, lessons and a choice of places to stay, you can plan a holiday that suits your family.\n\nBring everyone together for a week in the mountains or settle in for a shorter winter break. Bjorli combines days outdoors with time to enjoy each other’s company.',
      proofPoints: ['Skiing and winter fun for the family', 'Rail access via the Rauma Line', 'Cabins, apartments and mountain scenery'],
    },
    planning: {
      title: 'Plan your time on the slopes',
      subtitle: 'Find lift passes, check the latest conditions and get ready for your days on the mountain.',
      cards: [
        { title: 'Bjorli Ski Resort', desc: 'Explore the slopes and plan your visit.', href: '/bjorli-skisenter' },
        { title: 'Lift passes', desc: 'Buy day passes and season passes online.', href: LIFT_PASS_URL, external: true },
        { title: 'Opening times', desc: 'Check when the lifts are running.', href: '/apningstider' },
        { title: 'Webcams', desc: 'Take a look at the latest images from the mountain.', href: '/vaer-og-webkamera' },
        { title: 'Piste map', desc: 'Find your way around the runs and lifts.', href: '/loypekart' },
        { title: 'Where to stay', desc: 'Explore accommodation in Bjorli.', href: '/overnatting' },
        { title: 'Ski hire', desc: 'Find skis, snowboards and equipment for your stay.', href: '/skiutleie' },
        { title: 'Food & drink', desc: 'Find a spot for lunch or a meal after skiing.', href: '/mat-og-drikke' },
      ],
    },
    skiCenter: {
      eyebrow: 'Skiing in Bjorli',
      title: 'Discover Bjorli Ski Resort',
      body: 'Make the slopes part of your family holiday, with ski hire and lessons to help you get started. Explore the piste map, choose your lift passes and check the latest conditions before you head out.',
      cta: 'Explore the ski resort',
      href: '/bjorli-skisenter',
    },
    accommodation: {
      eyebrow: 'Where to stay',
      title: 'Make yourself at home in Bjorli',
      body: 'Choose a cabin or apartment as your base for days in the mountains. Enjoy breakfast together, head out for the day and settle in for a cosy evening. Explore the places to stay and find the right fit for your holiday.',
      cta: 'Find your accommodation',
      href: '/overnatting',
    },
  },
  de: {
    language: 'de',
    hero: {
      eyebrow: 'Destination Bjorli – Winter',
      title: 'Schneesichere Skitage für die ganze Familie',
      subtitle: 'Alpinski, Langlauf, Hütten und unkomplizierte Bergtage auf Bjorli – zwischen Berg und Fjord.',
      ctaLiftPass: 'Skipass kaufen',
      ctaStay: 'Unterkunft finden',
      ctaOpening: 'Öffnungszeiten und Bedingungen',
      liftPassUrl: LIFT_PASS_URL,
    },
    intro: {
      title: 'Der Winter in Bjorli',
      body: 'Bjorli ist eine schneesichere Winterdestination für Familien, Hüttengäste und alle, die echte Bergtage ohne Stress wollen. Hier finden Sie Alpin- und Langlaufski, Skiverleih, Skischule, Gastronomie, Unterkünfte und eine bequeme Anreise mit Auto oder Bahn.',
      eyebrow: 'Destination Bjorli',
      statement: 'Echter Winter, kurze Wege und ruhige Bergtage zwischen Ostnorwegen und den Westfjorden.',
      supportingText: 'Bjorli vereint Alpinski, Langlauf, Hütten, Gastronomie und Natur dicht beieinander – ideal für ein Winterwochenende, einen Familienurlaub oder ein paar ruhige Bergtage.',
      proofPoints: ['Schneesicher und familienfreundlich', 'Mit der Rauma-Bahn ins Gebirge', 'Ski, Hütten und Natur eng beisammen'],
    },
    planning: {
      title: 'Alles für Ihren Tag am Berg',
      subtitle: 'Planen Sie Ihren Skitag mit aktuellen Informationen, Skipässen und nützlichen Angeboten.',
      cards: [
        { title: 'Bjorli Skisenter', desc: 'Familienfreundliche Pisten und schneesichere Bedingungen', href: '/bjorli-skisenter' },
        { title: 'Skipass', desc: 'Tages- und Saisonkarten online kaufen', href: LIFT_PASS_URL, external: true },
        { title: 'Öffnungszeiten', desc: 'Die heutigen Zeiten im Skigebiet', href: '/apningstider' },
        { title: 'Livecams', desc: 'Bedingungen am Berg in Echtzeit', href: '/vaer-og-webkamera' },
        { title: 'Pistenplan', desc: 'Alle Pisten und Lifte auf einen Blick', href: '/loypekart' },
        { title: 'Unterkunft', desc: 'Hütten, Apartments und Hotels', href: '/overnatting' },
        { title: 'Skiverleih', desc: 'Ski, Snowboard und Ausrüstung in allen Größen', href: '/skiutleie' },
        { title: 'Essen & Trinken', desc: 'Heiskroa (die Hüttenbar am Lift) und Gastronomie am Berg', href: '/mat-og-drikke' },
      ],
    },
    skiCenter: {
      eyebrow: 'Im Herzen der Wintersaison',
      title: 'Bjorli Skisenter',
      body: 'Im Winter ist das Bjorli Skisenter der natürliche Treffpunkt im Zielgebiet. Hier finden Sie familienfreundliche Pisten, Skipässe, Skiverleih, Skischule, Gastronomie, Livecams und aktuelle Informationen zu den Bedingungen.',
      cta: 'Bjorli Skisenter ansehen',
      href: '/bjorli-skisenter',
    },
    accommodation: {
      eyebrow: 'Unterkunft',
      title: 'Direkt am Berg wohnen',
      body: 'Wählen Sie zwischen Hütten, Apartments und Hotels auf Bjorli. Sie wohnen nah an Aktivitäten, Gastronomie, Zug, Ski und Naturerlebnissen.',
      cta: 'Unterkunft finden',
      href: '/overnatting',
    },
  },
  nl: {
    language: 'nl',
    hero: {
      eyebrow: 'Bestemming Bjorli – winter',
      title: 'Sneeuwzekere skidagen voor het hele gezin',
      subtitle: 'Alpineskiën, langlaufen, hutten en eenvoudige bergdagen op Bjorli – tussen berg en fjord.',
      ctaLiftPass: 'Skipas kopen',
      ctaStay: 'Verblijf vinden',
      ctaOpening: 'Openingstijden en omstandigheden',
      liftPassUrl: LIFT_PASS_URL,
    },
    intro: {
      title: 'Winter in Bjorli',
      body: 'Bjorli is een sneeuwzekere winterbestemming voor gezinnen, hutgasten en iedereen die echte bergdagen zonder stress wil. Hier vind je alpineskiën, langlauf, skiverhuur, skischool, eten en drinken, accommodatie en een eenvoudige bereikbaarheid met auto of trein.',
      eyebrow: 'Bestemming Bjorli',
      statement: 'Echte winter, korte afstanden en rustige bergdagen tussen Oost-Noorwegen en de westelijke fjorden.',
      supportingText: 'Op Bjorli liggen alpineskiën, langlauf, hutten, restaurants en natuur dicht bij elkaar. Ideaal voor een winterweekend, een gezinsvakantie of een paar rustige bergdagen.',
      proofPoints: ['Sneeuwzeker en gezinsvriendelijk', 'Met de trein de bergen in via de Raumabanen', 'Ski, hutten en natuur dicht bij elkaar'],
    },
    planning: {
      title: 'Alles wat je nodig hebt voor een dag op de berg',
      subtitle: 'Plan je dag met actuele informatie, liftpassen en praktische diensten.',
      cards: [
        { title: 'Bjorli Skisenter', desc: 'Familievriendelijke pistes en sneeuwzekere omstandigheden', href: '/bjorli-skisenter' },
        { title: 'Skipas', desc: 'Koop dag- of seizoenpassen online', href: LIFT_PASS_URL, external: true },
        { title: 'Openingstijden', desc: 'De tijden van vandaag in het skigebied', href: '/apningstider' },
        { title: 'Livecams', desc: 'Bekijk de omstandigheden op de berg in realtime', href: '/vaer-og-webkamera' },
        { title: 'Pistekaart', desc: 'Alle pistes en liften in één overzicht', href: '/loypekart' },
        { title: 'Verblijf', desc: 'Hutten, appartementen en hotels', href: '/overnatting' },
        { title: 'Skiverhuur', desc: 'Ski’s, snowboards en uitrusting in alle maten', href: '/skiutleie' },
        { title: 'Eten & drinken', desc: 'Heiskroa (het bergcafé) en restaurants aan de berg', href: '/mat-og-drikke' },
      ],
    },
    skiCenter: {
      eyebrow: 'Hart van het winterseizoen',
      title: 'Bjorli Skisenter',
      body: 'In de winter is Bjorli Skisenter de natuurlijke ontmoetingsplek op de bestemming. Hier vind je familievriendelijke pistes, liftpassen, skiverhuur, skischool, eten en drinken, livecams en actuele informatie over de omstandigheden.',
      cta: 'Bekijk Bjorli Skisenter',
      href: '/bjorli-skisenter',
    },
    accommodation: {
      eyebrow: 'Verblijf',
      title: 'Dicht bij de berg verblijven',
      body: 'Kies tussen hutten, appartementen en hotels op Bjorli. Je verblijft dicht bij activiteiten, restaurants, de trein, skiën en natuurbelevenissen.',
      cta: 'Verblijf vinden',
      href: '/overnatting',
    },
  },
  da: {
    language: 'da',
    hero: {
      eyebrow: 'Destination Bjorli – vinter',
      title: 'Snesikre skidage for hele familien',
      subtitle: 'Alpinski, langrend, hytter og enkle fjelddage på Bjorli – mellem fjeld og fjord.',
      ctaLiftPass: 'Køb liftkort',
      ctaStay: 'Find overnatning',
      ctaOpening: 'Åbningstider og forhold',
      liftPassUrl: LIFT_PASS_URL,
    },
    intro: {
      title: 'Vinter på Bjorli',
      body: 'Bjorli er en snesikker vinterdestination for familier, hyttegæster og alle, der ønsker ægte fjelddage uden stress. Her finder du alpinski, langrend, skiudlejning, skiskole, mad og drikke, overnatning og let adgang med bil og tog.',
      eyebrow: 'Destination Bjorli',
      statement: 'Ægte vinter, korte afstande og rolige bjergdage mellem Østnorge og fjordene mod vest.',
      supportingText: 'På Bjorli ligger alpinski, langrend, hytter, servering og natur tæt sammen. Det er nemt at planlægge en vinterweekend, en familieferie eller nogle rolige dage i fjeldet.',
      proofPoints: ['Snesikkert og familievenligt', 'Tog til fjeldet med Raumabanen', 'Ski, hytter og natur tæt på'],
    },
    planning: {
      title: 'Alt du behøver til en dag på fjeldet',
      subtitle: 'Planlæg dagen med opdateret information, liftkort og praktiske services.',
      cards: [
        { title: 'Bjorli Skisenter', desc: 'Familievenlige pister og snesikre forhold', href: '/bjorli-skisenter' },
        { title: 'Liftkort', desc: 'Køb dags- eller sæsonkort online', href: LIFT_PASS_URL, external: true },
        { title: 'Åbningstider', desc: 'Dagens tider i skicentret', href: '/apningstider' },
        { title: 'Livecams', desc: 'Se forholdene på fjeldet i realtid', href: '/vaer-og-webkamera' },
        { title: 'Pistekort', desc: 'Overblik over alle pister og lifte', href: '/loypekart' },
        { title: 'Overnatning', desc: 'Hytter, lejligheder og hoteller', href: '/overnatting' },
        { title: 'Skiudlejning', desc: 'Ski, snowboard og udstyr i alle størrelser', href: '/skiutleie' },
        { title: 'Mad & drikke', desc: 'Heiskroa (bjergcaféen) og spisesteder ved fjeldet', href: '/mat-og-drikke' },
      ],
    },
    skiCenter: {
      eyebrow: 'Vinterens hjerte',
      title: 'Bjorli Skisenter',
      body: 'Om vinteren er Bjorli Skisenter det naturlige samlingspunkt på destinationen. Her finder du familievenlige pister, liftkort, skiudlejning, skiskole, mad og drikke, livecams og opdateret information om forholdene.',
      cta: 'Se Bjorli Skisenter',
      href: '/bjorli-skisenter',
    },
    accommodation: {
      eyebrow: 'Overnatning',
      title: 'Bo tæt på fjeldet',
      body: 'Vælg mellem hytter, lejligheder og hoteller på Bjorli. Her bor du tæt på aktiviteter, servering, tog, ski og naturoplevelser.',
      cta: 'Find overnatning',
      href: '/overnatting',
    },
  },
  sv: {
    language: 'sv',
    hero: {
      eyebrow: 'Destination Bjorli – vinter',
      title: 'Snösäkra skiddagar för hela familjen',
      subtitle: 'Utförsåkning, längdåkning, stugor och enkla fjälldagar på Bjorli – mellan fjäll och fjord.',
      ctaLiftPass: 'Köp liftkort',
      ctaStay: 'Hitta boende',
      ctaOpening: 'Öppettider och förhållanden',
      liftPassUrl: LIFT_PASS_URL,
    },
    intro: {
      title: 'Vinter på Bjorli',
      body: 'Bjorli är en snösäker vinterdestination för familjer, stuggäster och alla som vill ha riktiga fjälldagar utan stress. Här finns utförsåkning, längdåkning, skiduthyrning, skidskola, mat och dryck, boende och enkel resa med bil och tåg.',
      eyebrow: 'Destination Bjorli',
      statement: 'Äkta vinter, korta avstånd och lugna fjälldagar mellan östra Norge och fjordarna i väst.',
      supportingText: 'På Bjorli ligger alpint, längdåkning, stugor, servering och natur tätt ihop. Här är det enkelt att planera en vinterhelg, en familjesemester eller några lugna dagar i fjället.',
      proofPoints: ['Snösäkert och familjevänligt', 'Tåg till fjället med Raumabanen', 'Skidor, stugor och natur tätt ihop'],
    },
    planning: {
      title: 'Allt du behöver för en dag på fjället',
      subtitle: 'Planera dagen med uppdaterad information, liftkort och praktiska tjänster.',
      cards: [
        { title: 'Bjorli Skisenter', desc: 'Familjevänliga nedfarter och snösäkra förhållanden', href: '/bjorli-skisenter' },
        { title: 'Liftkort', desc: 'Köp dags- eller säsongskort online', href: LIFT_PASS_URL, external: true },
        { title: 'Öppettider', desc: 'Dagens tider i anläggningen', href: '/apningstider' },
        { title: 'Webbkameror', desc: 'Se förhållandena på fjället i realtid', href: '/vaer-og-webkamera' },
        { title: 'Pistkarta', desc: 'Alla nedfarter och liftar i ett överblick', href: '/loypekart' },
        { title: 'Boende', desc: 'Stugor, lägenheter och hotell', href: '/overnatting' },
        { title: 'Skiduthyrning', desc: 'Skidor, snowboard och utrustning i alla storlekar', href: '/skiutleie' },
        { title: 'Mat & dryck', desc: 'Heiskroa (bergkafét) och matställen vid fjället', href: '/mat-og-drikke' },
      ],
    },
    skiCenter: {
      eyebrow: 'Vinterns hjärta',
      title: 'Bjorli Skisenter',
      body: 'På vintern är Bjorli Skisenter den naturliga mötesplatsen på destinationen. Här finns familjevänliga nedfarter, liftkort, skiduthyrning, skidskola, mat och dryck, webbkameror och aktuell information om förhållandena.',
      cta: 'Se Bjorli Skisenter',
      href: '/bjorli-skisenter',
    },
    accommodation: {
      eyebrow: 'Boende',
      title: 'Bo nära fjället',
      body: 'Välj mellan stugor, lägenheter och hotell på Bjorli. Här bor du nära aktiviteter, restauranger, tåg, skidåkning och naturupplevelser.',
      cta: 'Hitta boende',
      href: '/overnatting',
    },
  },
};

export const getHomepageData = (language: Language): HomepageData => {
  const lang = language ?? 'no';
  return PAGE_COPY[lang] ?? PAGE_COPY.no;
};
