/**
 * Locale-keyed copy for /langrenn.
 * Proper names left untranslated: Bjorli, løyper.net.
 * Translations were rewritten to sound human — natural variation,
 * conversational flow, no AI boilerplate.
 */
import type { Locale } from '@/i18n/locales/types';

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
    heroTitle: 'Langrenn på Bjorli',
    heroSubtitle: 'Drøyt 80 km preparerte langrennsløyper – fra lysløype i bygda til åpne fjelløyper.',
    intro:
      'Bjorli har litt over <strong>80 km med oppkjørte langrennsløyper</strong>. Nettet strekker seg fra skogsterreng nede i bygda og opp på snaufjellet, og inkluderer en opplyst <strong>lysløype</strong> for kveldsøkter. Forholdene er stabile gjennom hele sesongen, og du kan velge alt fra korte runder til lange dagsturer på fjellet.',
    loypestatusTitle: 'Løypestatus akkurat nå',
    loypestatusBody:
      'Se hvilke løyper som er nylig preparert og hvilke som ikke er kjørt opp ennå. Oppdateres av løypelaget på Bjorli.',
    loypestatusCta: 'Se løypestatus på løyper.net',
    lysloypeBadge: 'Lysløype',
    lysloypeAlt:
      'Langrennsløper i Bjorli lysløype en mørk vinterkveld, med lyktestolper langs den preparerte løypa.',
    lysloypeTitle: 'Gå på ski etter mørkets frembrudd',
    lysloypeBody1:
      'Lysløypa på Bjorli gjør det mulig å trene og kose seg på ski lenge etter at sola har gått ned. En fin rundløype som passer like godt til en rolig kveldstur som til intervaller, og som ofte er det første som blir preparert tidlig i sesongen.',
    lysloypeBody2:
      'Sjekk gjeldende åpningstider og status før du drar – lyset styres lokalt og kan variere gjennom sesongen.',
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Før du går ut i løypa',
    cardCheck: {
      title: 'Sjekk forholdene',
      bodyBefore: 'Se ',
      linkText: 'løyper.net',
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
    heroTitle: 'Cross-country skiing in Bjorli',
    heroSubtitle: 'Just over 80 km of groomed trails — from a floodlit loop in the village to open mountain tracks.',
    intro:
      'Bjorli has a little over <strong>80 km of groomed cross-country trails</strong>. The network runs from forest terrain down in the village all the way up onto the open fells, and includes a floodlit <strong>lysløype</strong> for evening sessions. Conditions hold up well through the season, so you can pick anything from a short loop to a full day out on the mountain.',
    loypestatusTitle: 'Trail status right now',
    loypestatusBody:
      'See which trails were just groomed and which ones haven’t been touched yet. Updated by the local trail crew in Bjorli.',
    loypestatusCta: 'Check trail status on løyper.net',
    lysloypeBadge: 'Floodlit trail',
    lysloypeAlt:
      'A skier on the Bjorli floodlit trail on a dark winter evening, with lamp posts lining the groomed track.',
    lysloypeTitle: 'Ski long after the sun goes down',
    lysloypeBody1:
      'The floodlit loop in Bjorli lets you keep skiing well after sunset — whether you’re after a calm evening glide or a proper interval session. It’s also usually the first trail to be groomed at the start of the season.',
    lysloypeBody2:
      'Check current opening hours and status before you head out — the lighting is run locally and varies through the season.',
    praktiskBadge: 'Practical info',
    praktiskTitle: 'Before you head out',
    cardCheck: {
      title: 'Check the conditions',
      bodyBefore: 'Have a look at ',
      linkText: 'løyper.net',
      bodyAfter: ' to see what’s freshly groomed, and check the forecast before you set off.',
    },
    cardWeather: {
      title: 'Weather changes fast',
      body: 'Up on the mountain the wind can pick up and visibility can drop quickly. Bring extra layers, food and water — even on short tours.',
    },
    cardRespect: {
      title: 'Be considerate',
      body: 'Follow signs and markings, don’t wreck the tracks, and respect private areas and the cabins along the trails.',
    },
  },
  de: {
    heroTitle: 'Langlauf in Bjorli',
    heroSubtitle: 'Gut 80 km gespurte Loipen – von der beleuchteten Runde im Ort bis hinauf aufs offene Fjell.',
    intro:
      'Bjorli hat etwas mehr als <strong>80 km gespurte Langlaufloipen</strong>. Das Netz reicht vom Waldgelände im Ort bis hinauf aufs Fjell und schließt eine beleuchtete <strong>Lysløype</strong> für den Abend ein. Die Bedingungen halten die ganze Saison über – von der kurzen Runde bis zur langen Tagestour ist alles drin.',
    loypestatusTitle: 'Aktueller Loipenstatus',
    loypestatusBody:
      'Sieh nach, welche Loipen frisch präpariert sind und welche noch nicht gespurt wurden. Wird vom lokalen Loipenteam in Bjorli gepflegt.',
    loypestatusCta: 'Loipenstatus auf løyper.net ansehen',
    lysloypeBadge: 'Beleuchtete Loipe',
    lysloypeAlt:
      'Langläufer auf der beleuchteten Loipe in Bjorli an einem dunklen Winterabend, mit Lichtmasten entlang der präparierten Spur.',
    lysloypeTitle: 'Langlauf nach Einbruch der Dunkelheit',
    lysloypeBody1:
      'Die beleuchtete Loipe in Bjorli lässt dich noch lange nach Sonnenuntergang Ski laufen – ob gemütliche Abendrunde oder zügiges Intervalltraining. Sie wird in der Regel auch als Erste am Saisonbeginn präpariert.',
    lysloypeBody2:
      'Schau vor dem Aufbruch nach aktuellen Öffnungszeiten und Status – das Licht wird lokal gesteuert und ändert sich über die Saison.',
    praktiskBadge: 'Praktische Infos',
    praktiskTitle: 'Bevor du loslegst',
    cardCheck: {
      title: 'Bedingungen prüfen',
      bodyBefore: 'Schau bei ',
      linkText: 'løyper.net',
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
    heroTitle: 'Langlaufen in Bjorli',
    heroSubtitle: 'Ruim 80 km geprepareerde loipes – van een verlichte ronde in het dorp tot open bergloipes.',
    intro:
      'Bjorli heeft iets meer dan <strong>80 km geprepareerde langlaufloipes</strong>. Het netwerk loopt van bosachtig terrein in het dorp helemaal omhoog naar het open fjell en omvat een verlichte <strong>lysløype</strong> voor avondsessies. De condities blijven het hele seizoen door goed, dus je kunt kiezen tussen een korte ronde of een lange dagtocht het fjell op.',
    loypestatusTitle: 'Loipenstatus nu',
    loypestatusBody:
      'Bekijk welke loipes net geprepareerd zijn en welke nog niet. Bijgehouden door het lokale loipenteam in Bjorli.',
    loypestatusCta: 'Bekijk de loipenstatus op løyper.net',
    lysloypeBadge: 'Verlichte loipe',
    lysloypeAlt:
      'Langlaufer op de verlichte loipe van Bjorli op een donkere winteravond, met lichtmasten langs het geprepareerde spoor.',
    lysloypeTitle: 'Langlaufen na zonsondergang',
    lysloypeBody1:
      'Op de verlichte ronde in Bjorli kun je nog ver na zonsondergang doorgaan – of het nu een rustige avondtocht is of intervaltraining. Vaak is het ook de eerste loipe die aan het begin van het seizoen wordt geprepareerd.',
    lysloypeBody2:
      'Check vooraf de actuele openingstijden en status – de verlichting wordt lokaal geregeld en kan per seizoen verschillen.',
    praktiskBadge: 'Praktische info',
    praktiskTitle: 'Voordat je vertrekt',
    cardCheck: {
      title: 'Check de condities',
      bodyBefore: 'Kijk op ',
      linkText: 'løyper.net',
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
    heroTitle: 'Langrend på Bjorli',
    heroSubtitle: 'Godt 80 km præparerede langrendsspor – fra oplyst rute i bygden til åbne fjeldspor.',
    intro:
      'Bjorli har lidt over <strong>80 km præparerede langrendsspor</strong>. Sporene strækker sig fra skovterræn nede i bygden og op på fjeldet og indeholder en oplyst <strong>lysløype</strong> til aftensessioner. Forholdene er stabile hele sæsonen, og du kan vælge alt fra en kort runde til lange dagsture på fjeldet.',
    loypestatusTitle: 'Sporstatus lige nu',
    loypestatusBody:
      'Se hvilke spor der lige er præpareret og hvilke der endnu ikke er kørt op. Opdateres af det lokale spor-team på Bjorli.',
    loypestatusCta: 'Se sporstatus på løyper.net',
    lysloypeBadge: 'Oplyst spor',
    lysloypeAlt:
      'Langrendsløber på Bjorlis oplyste spor en mørk vinteraften, med lygtepæle langs det præparerede spor.',
    lysloypeTitle: 'Stå på ski efter mørkets frembrud',
    lysloypeBody1:
      'Den oplyste rute på Bjorli gør det muligt at fortsætte længe efter solnedgang – enten en rolig aftentur eller et ordentligt intervalpas. Det er ofte også det første spor, der præpareres tidligt i sæsonen.',
    lysloypeBody2:
      'Tjek aktuelle åbningstider og status før afgang – lyset styres lokalt og varierer hen over sæsonen.',
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Inden du tager af sted',
    cardCheck: {
      title: 'Tjek forholdene',
      bodyBefore: 'Kig på ',
      linkText: 'løyper.net',
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
    heroTitle: 'Längdåkning på Bjorli',
    heroSubtitle: 'Drygt 80 km preparerade spår – från elljusspår i byn till öppna fjällspår.',
    intro:
      'Bjorli har lite drygt <strong>80 km preparerade längdspår</strong>. Spårnätet sträcker sig från skogsterräng nere i byn ända upp på kalfjället och inkluderar ett <strong>elljusspår</strong> för kvällsåkning. Förhållandena håller hela säsongen, så du kan välja allt från en kort runda till en lång dag på fjället.',
    loypestatusTitle: 'Spårstatus just nu',
    loypestatusBody:
      'Se vilka spår som nyss preparerats och vilka som inte är körda än. Uppdateras av det lokala spårlaget i Bjorli.',
    loypestatusCta: 'Se spårstatus på løyper.net',
    lysloypeBadge: 'Elljusspår',
    lysloypeAlt:
      'Längdåkare på Bjorlis elljusspår en mörk vinterkväll, med lyktstolpar längs det preparerade spåret.',
    lysloypeTitle: 'Åk skidor långt efter solnedgång',
    lysloypeBody1:
      'Elljusspåret på Bjorli gör att du kan fortsätta åka långt efter solnedgång – från en lugn kvällsrunda till hårda intervaller. Det är dessutom oftast första spåret som prepareras tidigt på säsongen.',
    lysloypeBody2:
      'Kolla aktuella öppettider och status innan du ger dig ut – belysningen sköts lokalt och varierar över säsongen.',
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Innan du ger dig ut',
    cardCheck: {
      title: 'Kolla förhållandena',
      bodyBefore: 'Titta in på ',
      linkText: 'løyper.net',
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