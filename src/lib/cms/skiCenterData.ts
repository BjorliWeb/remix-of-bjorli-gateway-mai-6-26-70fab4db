/**
 * Node-safe page data for /bjorli-skisenter.
 *
 * This module is imported both by the React page and by the prerender
 * script, so the static HTML and the hydrated page share the same text,
 * links and CTAs. Images and tracking remain in the page component.
 */
import type { Locale } from '@/i18n/locales/types';
import { translations } from '@/i18n/legacyTranslations';
import { SALES_TERMS_COPY, type TermsCopy } from '@/pages/salesTermsContent';

export interface SkiCenterPageData {
  language: Locale;
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
  liftPass: {
    heading: string;
    support: string;
    cta: string;
    url: string;
  };
  trailMap: {
    ariaOpen: string;
    alt: string;
    caption: string;
    note: string;
  };
  salesTerms: {
    heading: string;
    lead: string;
    copy: TermsCopy;
  };
}

const LIFT_PASS_URL =
  'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862';

const PAGE_COPY: Record<
  Locale,
  Pick<SkiCenterPageData, 'liftPass' | 'trailMap' | 'salesTerms'> & {
    liftsLabel: string;
    slopesLabel: string;
    altitudeLabel: string;
    seasonLabel: string;
  }
> = {
  no: {
    liftsLabel: 'Heiser',
    slopesLabel: 'Nedfarter',
    altitudeLabel: 'Høyde',
    seasonLabel: 'Sesong',
    liftPass: {
      heading: 'Kjøp heiskort',
      support: 'Kjøp heiskort på nett før du kommer til Bjorli.',
      cta: 'Kjøp heiskort',
      url: LIFT_PASS_URL,
    },
    trailMap: {
      ariaOpen: 'Åpne løypekart i full størrelse',
      alt: 'Løypekart for Bjorli Skisenter med alpinløyper, heiser, langrennsløyper og symbolforklaring.',
      caption:
        'Løypekart for Bjorli Skisenter. Kartet viser alpinløyper, heiser, nærområde, symboler og tilknyttede langrennsløyper.',
      note: 'Se alltid skilt, vær- og føreforhold og oppdatert informasjon på bjorli.no for gjeldende drift.',
    },
    salesTerms: {
      heading: 'Salgsbetingelser',
      lead: 'Generelle salgsbetingelser ved kjøp av heiskort og andre produkter på nett.',
      copy: SALES_TERMS_COPY.no,
    },
  },
  en: {
    liftsLabel: 'Lifts',
    slopesLabel: 'Slopes',
    altitudeLabel: 'Altitude',
    seasonLabel: 'Season',
    liftPass: {
      heading: 'Buy lift pass',
      support: 'Buy your lift pass online before you arrive at Bjorli.',
      cta: 'Buy lift pass',
      url: LIFT_PASS_URL,
    },
    trailMap: {
      ariaOpen: 'Open trail map in full size',
      alt: 'Trail map for Bjorli Skisenter showing alpine slopes, lifts, cross-country trails and the symbol legend.',
      caption:
        'Trail map for Bjorli Skisenter. The map shows alpine slopes, lifts, the surrounding area, symbols and connected cross-country trails.',
      note: 'Always check on-mountain signage, weather and snow conditions, and current information on bjorli.no for live operations.',
    },
    salesTerms: {
      heading: 'Terms of Sale',
      lead: 'General terms of sale that apply when you buy lift passes and other products online.',
      copy: SALES_TERMS_COPY.en,
    },
  },
  de: {
    liftsLabel: 'Lifte',
    slopesLabel: 'Abfahrten',
    altitudeLabel: 'Höhe',
    seasonLabel: 'Saison',
    liftPass: {
      heading: 'Skipass kaufen',
      support: 'Kaufen Sie Ihren Skipass online, bevor Sie nach Bjorli kommen.',
      cta: 'Skipass kaufen',
      url: LIFT_PASS_URL,
    },
    trailMap: {
      ariaOpen: 'Loipenkarte in voller Größe öffnen',
      alt: 'Pisten- und Loipenkarte vom Bjorli Skisenter mit Abfahrten, Liften, Langlaufloipen und Zeichenerklärung.',
      caption:
        'Pisten- und Loipenkarte vom Bjorli Skisenter. Die Karte zeigt Abfahrten, Lifte, die Umgebung, Symbole sowie angeschlossene Langlaufloipen.',
      note: 'Beachten Sie immer die Beschilderung am Berg, die Wetter- und Schneebedingungen sowie aktuelle Informationen auf bjorli.no zum laufenden Betrieb.',
    },
    salesTerms: {
      heading: 'Verkaufsbedingungen',
      lead: 'Allgemeine Verkaufsbedingungen für den Online-Kauf von Skipässen und anderen Produkten.',
      copy: SALES_TERMS_COPY.de,
    },
  },
  nl: {
    liftsLabel: 'Liften',
    slopesLabel: 'Pistes',
    altitudeLabel: 'Hoogte',
    seasonLabel: 'Seizoen',
    liftPass: {
      heading: 'Skipas kopen',
      support: 'Koop je skipas online voordat je in Bjorli aankomt.',
      cta: 'Skipas kopen',
      url: LIFT_PASS_URL,
    },
    trailMap: {
      ariaOpen: 'Open de loipekaart op volledig formaat',
      alt: 'Pisten- en loipekaart van Bjorli Skisenter met alpine pistes, liften, langlaufloipes en symboollegenda.',
      caption:
        'Pisten- en loipekaart van Bjorli Skisenter. De kaart toont alpine pistes, liften, de omgeving, symbolen en aansluitende langlaufloipes.',
      note: 'Volg altijd de bewegwijzering op de berg, het weer en de sneeuwomstandigheden, en bekijk actuele informatie op bjorli.no voor de live situatie.',
    },
    salesTerms: {
      heading: 'Verkoopvoorwaarden',
      lead: 'Algemene verkoopvoorwaarden voor online aankopen van skipassen en andere producten.',
      copy: SALES_TERMS_COPY.nl,
    },
  },
  da: {
    liftsLabel: 'Lifte',
    slopesLabel: 'Pister',
    altitudeLabel: 'Højde',
    seasonLabel: 'Sæson',
    liftPass: {
      heading: 'Køb liftkort',
      support: 'Køb liftkort online, inden du kommer til Bjorli.',
      cta: 'Køb liftkort',
      url: LIFT_PASS_URL,
    },
    trailMap: {
      ariaOpen: 'Åbn pistekort i fuld størrelse',
      alt: 'Piste- og løjpekort for Bjorli Skisenter med alpine pister, lifte, langrendsløjper og signaturforklaring.',
      caption:
        'Piste- og løjpekort for Bjorli Skisenter. Kortet viser alpine pister, lifte, nærområdet, symboler og tilsluttede langrendsløjper.',
      note: 'Tjek altid skiltning på bjerget, vejr- og føreforhold samt opdateret information på bjorli.no for den aktuelle drift.',
    },
    salesTerms: {
      heading: 'Salgsbetingelser',
      lead: 'Generelle salgsbetingelser ved onlinekøb af liftkort og andre produkter.',
      copy: SALES_TERMS_COPY.da,
    },
  },
  sv: {
    liftsLabel: 'Liftar',
    slopesLabel: 'Pister',
    altitudeLabel: 'Höjd',
    seasonLabel: 'Säsong',
    liftPass: {
      heading: 'Köp liftkort',
      support: 'Köp liftkort online innan du kommer till Bjorli.',
      cta: 'Köp liftkort',
      url: LIFT_PASS_URL,
    },
    trailMap: {
      ariaOpen: 'Öppna pistkarta i full storlek',
      alt: 'Pist- och spårkarta för Bjorli Skisenter med alpina nedfarter, liftar, längdspår och teckenförklaring.',
      caption:
        'Pist- och spårkarta för Bjorli Skisenter. Kartan visar alpina nedfarter, liftar, närområdet, symboler och anslutna längdspår.',
      note: 'Kontrollera alltid skyltning på berget, väder- och förhållanden samt aktuell information på bjorli.no för pågående drift.',
    },
    salesTerms: {
      heading: 'Försäljningsvillkor',
      lead: 'Allmänna försäljningsvillkor som gäller vid köp av liftkort och andra produkter online.',
      copy: SALES_TERMS_COPY.sv,
    },
  },
};

export const getSkiCenterData = (language: Locale): SkiCenterPageData => {
  const locale = (language as Locale) ?? 'no';
  const t = translations[locale]?.skiCenter ?? translations.no.skiCenter;
  const copy = PAGE_COPY[locale] ?? PAGE_COPY.no;

  return {
    language: locale,
    title: t.title,
    subtitle: t.subtitle,
    description: t.desc,
    stats: [
      { label: copy.liftsLabel, value: '6' },
      { label: copy.slopesLabel, value: '11' },
      { label: copy.altitudeLabel, value: '575–1225m' },
      { label: copy.seasonLabel, value: 'Nov–Mai' },
    ],
    liftPass: copy.liftPass,
    trailMap: copy.trailMap,
    salesTerms: copy.salesTerms,
  };
};
