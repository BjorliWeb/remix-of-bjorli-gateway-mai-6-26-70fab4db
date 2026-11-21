/**
 * Locale-keyed copy for /langrenn.
 * Proper names left untranslated: Bjorli, Skiappen.
 * Translations were rewritten to sound human — natural variation,
 * conversational flow, no AI boilerplate.
 */
import type { Locale } from '@/i18n/locales/types';
import { FACTS_COPY } from '@/lib/resortFacts';

export interface LangrennCard {
  title: string;
  body: string;
}

export interface LangrennCopy {
  heroTitle: string;
  heroSubtitle: string;
  intro: string; // may contain <strong>…</strong>
  loypestatusTitle: string;
  loypestatusBody: string;
  loypestatusCta: string;
  lysloypeBadge: string;
  lysloypeAlt: string;
  lysloypeTitle: string;
  lysloypeBody1: string;
  lysloypeBody2: string;
  praktiskBadge: string;
  praktiskTitle: string;
  cardCheck: { title: string; bodyBefore: string; linkText: string; bodyAfter: string };
  cardWeather: LangrennCard;
  cardRespect: LangrennCard;
}

export const LANGRENN_COPY: Record<Locale, LangrennCopy> = {
  no: {
    heroTitle: FACTS_COPY.no.nordicTitle,
    heroSubtitle: FACTS_COPY.no.nordicIntro,
    intro: FACTS_COPY.no.nordicIntro,
    loypestatusTitle: 'Løypestatus akkurat nå',
    loypestatusBody: FACTS_COPY.no.nordicShort,
    loypestatusCta: FACTS_COPY.no.mapCta,
    lysloypeBadge: 'Lysløype',
    lysloypeAlt:
      'Langrennsløper i Bjorli lysløype en mørk vinterkveld, med lyktestolper langs den preparerte løypa.',
    lysloypeTitle: 'Gå på ski etter mørkets frembrudd',
    lysloypeBody1: FACTS_COPY.no.floodlit,
    lysloypeBody2: FACTS_COPY.no.nordicShort,
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Før du går ut i løypa',
    cardCheck: {
      title: 'Sjekk forholdene',
      bodyBefore: 'Se ',
      linkText: 'Skiappen',
      bodyAfter: ' for hva som er nylig preparert, og sjekk værmelding før du legger ut.',
    },
    cardWeather: {
      title: 'Vær kan snu raskt',
      body: 'På fjellet kan vinden friske til og sikten bli dårlig på kort tid. Ha med ekstra klær, mat og drikke – også på korte turer.',
    },
    cardRespect: {
      title: 'Vis hensyn',
      body: 'Følg skilting og merking, ikke ødelegg sporene, og respekter private områder og hytter langs løypa.',
    },
  },
  en: {
    heroTitle: FACTS_COPY.en.nordicTitle,
    heroSubtitle: FACTS_COPY.en.nordicIntro,
    intro: FACTS_COPY.en.nordicIntro,
    loypestatusTitle: 'Trail status now',
    loypestatusBody: FACTS_COPY.en.nordicShort,
    loypestatusCta: FACTS_COPY.en.mapCta,
    lysloypeBadge: 'Floodlit trail',
    lysloypeAlt:
      'A skier on the floodlit trail in Bjorli on a dark winter evening, with lamp posts along the groomed track.',
    lysloypeTitle: 'Ski after the sun goes down',
    lysloypeBody1: FACTS_COPY.en.floodlit,
    lysloypeBody2: FACTS_COPY.en.nordicShort,
    praktiskBadge: 'Practical information',
    praktiskTitle: 'Before you head out',
    cardCheck: {
      title: 'Check the conditions',
      bodyBefore: 'Have a look at ',
      linkText: 'Skiappen',
      bodyAfter: ' to see what’s freshly groomed, and check the forecast before you set off.',
    },
    cardWeather: {
      title: 'Weather changes fast',
      body: 'Up on the mountain the wind can pick up and visibility can drop quickly. Bring extra layers, food and water, even on short trips.',
    },
    cardRespect: {
      title: 'Be considerate',
      body: 'Follow the signs and markings, don’t walk in the ski tracks, and respect private land and the cabins along the trails.',
    },
  },
  de: {
    heroTitle: FACTS_COPY.de.nordicTitle,
    heroSubtitle: FACTS_COPY.de.nordicIntro,
    intro: FACTS_COPY.de.nordicIntro,
    loypestatusTitle: 'Aktueller Loipenstatus',
    loypestatusBody: FACTS_COPY.de.nordicShort,
    loypestatusCta: FACTS_COPY.de.mapCta,
    lysloypeBadge: 'Beleuchtete Loipe',
    lysloypeAlt:
      'Langläufer auf der beleuchteten Loipe in Bjorli an einem dunklen Winterabend, mit Lichtmasten entlang der präparierten Spur.',
    lysloypeTitle: 'Langlauf nach Einbruch der Dunkelheit',
    lysloypeBody1: FACTS_COPY.de.floodlit,
    lysloypeBody2: FACTS_COPY.de.nordicShort,
    praktiskBadge: 'Praktische Infos',
    praktiskTitle: 'Bevor du loslegst',
    cardCheck: {
      title: 'Bedingungen prüfen',
      bodyBefore: 'Schau bei ',
      linkText: 'Skiappen',
      bodyAfter: ' nach, was frisch gespurt ist, und prüfe vorher die Wettervorhersage.',
    },
    cardWeather: {
      title: 'Wetter schlägt schnell um',
      body: 'Im Fjell kann der Wind plötzlich auffrischen und die Sicht schnell schlechter werden. Nimm zusätzliche Kleidung, Essen und Trinken mit – auch auf kurzen Touren.',
    },
    cardRespect: {
      title: 'Rücksicht nehmen',
      body: 'Halte dich an Schilder und Markierungen, zerstöre die Spur nicht und respektiere Privatgrundstücke und Hütten an der Loipe.',
    },
  },
  nl: {
    heroTitle: FACTS_COPY.nl.nordicTitle,
    heroSubtitle: FACTS_COPY.nl.nordicIntro,
    intro: FACTS_COPY.nl.nordicIntro,
    loypestatusTitle: 'Loipenstatus nu',
    loypestatusBody: FACTS_COPY.nl.nordicShort,
    loypestatusCta: FACTS_COPY.nl.mapCta,
    lysloypeBadge: 'Verlichte loipe',
    lysloypeAlt:
      'Langlaufer op de verlichte loipe van Bjorli op een donkere winteravond, met lichtmasten langs het geprepareerde spoor.',
    lysloypeTitle: 'Langlaufen na zonsondergang',
    lysloypeBody1: FACTS_COPY.nl.floodlit,
    lysloypeBody2: FACTS_COPY.nl.nordicShort,
    praktiskBadge: 'Praktische info',
    praktiskTitle: 'Voordat je vertrekt',
    cardCheck: {
      title: 'Check de condities',
      bodyBefore: 'Kijk op ',
      linkText: 'Skiappen',
      bodyAfter: ' voor wat net is geprepareerd en bekijk de weersverwachting voor je vertrekt.',
    },
    cardWeather: {
      title: 'Het weer kan snel omslaan',
      body: 'Op het fjell kan de wind plotseling aantrekken en het zicht snel verslechteren. Neem extra kleding, eten en drinken mee – ook op korte tochten.',
    },
    cardRespect: {
      title: 'Wees respectvol',
      body: 'Volg bordjes en markeringen, beschadig de sporen niet en respecteer privégebieden en hutten langs de loipe.',
    },
  },
  da: {
    heroTitle: FACTS_COPY.da.nordicTitle,
    heroSubtitle: FACTS_COPY.da.nordicIntro,
    intro: FACTS_COPY.da.nordicIntro,
    loypestatusTitle: 'Sporstatus lige nu',
    loypestatusBody: FACTS_COPY.da.nordicShort,
    loypestatusCta: FACTS_COPY.da.mapCta,
    lysloypeBadge: 'Oplyst spor',
    lysloypeAlt:
      'Langrendsløber på Bjorlis oplyste spor en mørk vinteraften, med lygtepæle langs det præparerede spor.',
    lysloypeTitle: 'Stå på ski efter mørkets frembrud',
    lysloypeBody1: FACTS_COPY.da.floodlit,
    lysloypeBody2: FACTS_COPY.da.nordicShort,
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Inden du tager af sted',
    cardCheck: {
      title: 'Tjek forholdene',
      bodyBefore: 'Kig på ',
      linkText: 'Skiappen',
      bodyAfter: ' for hvad der lige er præpareret, og tjek vejrudsigten før du tager af sted.',
    },
    cardWeather: {
      title: 'Vejret kan skifte hurtigt',
      body: 'Oppe på fjeldet kan vinden friske op og sigtbarheden falde hurtigt. Tag ekstra tøj, mad og drikke med – også på korte ture.',
    },
    cardRespect: {
      title: 'Tag hensyn',
      body: 'Følg skilte og markeringer, ødelæg ikke sporene, og respekter private områder og hytter langs ruten.',
    },
  },
  sv: {
    heroTitle: FACTS_COPY.sv.nordicTitle,
    heroSubtitle: FACTS_COPY.sv.nordicIntro,
    intro: FACTS_COPY.sv.nordicIntro,
    loypestatusTitle: 'Spårstatus just nu',
    loypestatusBody: FACTS_COPY.sv.nordicShort,
    loypestatusCta: FACTS_COPY.sv.mapCta,
    lysloypeBadge: 'Elljusspår',
    lysloypeAlt:
      'Längdåkare på Bjorlis elljusspår en mörk vinterkväll, med lyktstolpar längs det preparerade spåret.',
    lysloypeTitle: 'Åk skidor långt efter solnedgång',
    lysloypeBody1: FACTS_COPY.sv.floodlit,
    lysloypeBody2: FACTS_COPY.sv.nordicShort,
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Innan du ger dig ut',
    cardCheck: {
      title: 'Kolla förhållandena',
      bodyBefore: 'Titta in på ',
      linkText: 'Skiappen',
      bodyAfter: ' för vad som nyss har preparerats, och kolla väderprognosen innan du åker.',
    },
    cardWeather: {
      title: 'Vädret kan slå om snabbt',
      body: 'Uppe på fjället kan vinden öka och sikten försämras snabbt. Ta med extra kläder, mat och dryck – även på korta turer.',
    },
    cardRespect: {
      title: 'Visa hänsyn',
      body: 'Följ skyltar och markeringar, förstör inte spåren och respektera privata områden och stugor längs spåret.',
    },
  },
};