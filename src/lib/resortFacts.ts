/** Owner-confirmed editorial source: uploaded fact sheet, 21 November 2026.
 * Static specifications, never a replacement for Fnugg's current operating status.
 * Node-safe: shared by page content and prerender.
 */
import type { Locale } from '@/i18n/locales/types';

export const RESORT_FACTS = {
  baseAltitude: 575, summitAltitude: 1225, vertical: 650, longestRunKm: 5,
  runs: 11, alpineKm: 20, lifts: 6, chairlifts: 1, chairSeats: 6, surfaceLifts: 5,
  beginnerLifts: 2, floodlitKm: 1.8, snowmakingKm: 8, usualOpeningDaysMoreThan: 150,
  difficulty: { green: 47, blue: 9, red: 25, black: 19 },
  nordicKm: 81, nordicMarketingKmMoreThan: 80, lightsUntil: '22.00',
  vipps: '508426', bankAccount: '1503.19.64269',
} as const;

export const SKIAPPEN_AREA_URL = 'https://skiappen.no/?lat=62.25418&lng=8.25897&zoom=11';

interface FactsCopy {
  heading: string; labels: readonly [string, string, string, string, string, string, string];
  altitudeUnit: string; difficultyHeading: string; difficultyNote: string;
  difficultyLabels: readonly [string, string, string, string];
  description: string; facilities: readonly string[];
  nordicTitle: string; nordicIntro: string; nordicBody: string; nordicShort: string;
  floodlit: string; supportTitle: string; supportBody: string; bankLabel: string;
  alpineTitle: string; fullFacts: string; nordicMore: string; mapIntro: string;
  mapTitle: string; attribution: string; mapHelp: string; mapCta: string; newTab: string;
}

const f = RESORT_FACTS;
const decimal = (n: number, locale: Locale) => new Intl.NumberFormat(locale === 'no' ? 'nb-NO' : locale).format(n);

export const FACTS_COPY: Record<Locale, FactsCopy> = {
  no: {
    heading: 'Bjorli Skisenter i tall',
    labels: ['Heiser totalt', 'Nedfarter', 'Alpinløyper', 'Bunnstasjon', 'Toppstasjon i anlegget', 'Høydeforskjell', 'Lengste nedfart'], altitudeUnit: 'moh.',
    difficultyHeading: 'Vanskelighetsfordeling', difficultyNote: 'Omtrentlig fordeling målt i løypelengde, ikke antall nedfarter.', difficultyLabels: ['Grønne', 'Blå', 'Røde', 'Svarte'],
    description: `Bjorli Skisenter har ${f.runs} nedfarter med totalt ${f.alpineKm} km preparerte alpinløyper. Bunnstasjonen ligger ${f.baseAltitude} moh. og anleggets toppstasjon ${f.summitAltitude} moh.`,
    facilities: [
      `${f.lifts} heiser totalt: ${f.chairlifts} sekseters ekspress-stolheis og ${f.surfaceLifts} skitrekk av typen T-krok/Poma.`,
      `Eget nybegynnerområde med ${f.beginnerLifts} heiser, som inngår i totalen på ${f.lifts}.`,
      'En lang funslope og en stor blå terrengpark.',
      `${decimal(f.floodlitKm, 'no')} km flombelyste bakker.`,
      `Et omfattende snøkanonanlegg kan raskt dekke ${f.snowmakingKm} km med bakker når forholdene ligger til rette.`,
      `Normalt over ${f.usualOpeningDaysMoreThan} åpningsdager per sesong. Åpningsdatoer og sesonglengde avhenger av forholdene; dette er ingen garanti for inneværende sesong.`,
    ],
    nordicTitle: 'Langrenn på Bjorli',
    nordicIntro: `Med over ${f.nordicMarketingKmMoreThan} kilometer langrennsløyper, fra kveldsturer i lysløypa til lange runder på høyfjellet, er Bjorli et flott utgangspunkt for langrenn.`,
    nordicBody: `Bjorli Lesja Løypelag har ansvaret for langrennsløypene rundt Bjorli. Løypenettet omfatter ${f.nordicKm} km i variert høyfjells- og skogsterreng, med løyper for både klassisk og skøyting. Løypene prepareres etter løypekartet når snø- og føreforholdene tillater det.`,
    nordicShort: `${f.nordicKm} km løypenett for klassisk og skøyting i skog- og høyfjellsterreng. Se Skiappen for siste registrerte preparering.`,
    floodlit: `Sygardsløypa er lysløypa på Bjorli. Her er lyset på frem til kl. ${f.lightsUntil} hver kveld.`,
    supportTitle: 'Støtt løypelaget', supportBody: 'Løypelaget drives uten profittformål. Alle inntekter går til drift, vedlikehold og utvikling av løypene.', bankLabel: 'Kontonummer',
    alpineTitle: 'Alpinløypekart', fullFacts: 'Komplette fakta om Bjorli Skisenter', nordicMore: 'Mer om langrenn og løypelaget', mapIntro: 'Alpinløypekart for Bjorli Skisenter og langrennskart for løypenettet rundt Bjorli.',
    mapTitle: 'Langrennsløyper og prepareringsstatus på Bjorli fra Skiappen', attribution: 'Kart og prepareringsstatus leveres av Skiappen. Fargene viser tid siden siste registrerte preparering.', mapHelp: 'Vises ikke kartet? Bruk knappen under for å åpne det i Skiappen.', mapCta: 'Åpne stort kart i Skiappen', newTab: 'åpnes i ny fane',
  },
  en: {
    heading: 'Bjorli Ski Resort in numbers', labels: ['Total lifts', 'Runs', 'Alpine pistes', 'Base station', 'Resort summit station', 'Vertical drop', 'Longest run'], altitudeUnit: 'm above sea level',
    difficultyHeading: 'Piste difficulty', difficultyNote: 'Approximate share of piste length, not the number of runs.', difficultyLabels: ['Green', 'Blue', 'Red', 'Black'],
    description: `Bjorli Ski Resort has ${f.runs} runs totalling ${f.alpineKm} km of groomed alpine pistes. The base station is at ${f.baseAltitude} m above sea level and the resort summit station at ${f.summitAltitude} m.`,
    facilities: [
      `${f.lifts} lifts in total: ${f.chairlifts} six-seat express chairlift and ${f.surfaceLifts} T-bar/Poma surface lifts.`,
      `A dedicated beginner area with ${f.beginnerLifts} lifts, included in the total of ${f.lifts}.`,
      'A long funslope and a large blue-grade terrain park.',
      `${f.floodlitKm} km of floodlit slopes.`,
      `An extensive snowmaking system can quickly cover ${f.snowmakingKm} km of slopes when conditions allow.`,
      `Normally more than ${f.usualOpeningDaysMoreThan} opening days per season. Dates and season length depend on conditions; this is not a guarantee for the current season.`,
    ],
    nordicTitle: 'Cross-country skiing in Bjorli', nordicIntro: `With over ${f.nordicMarketingKmMoreThan} kilometres of cross-country trails, from evenings on the floodlit trail to long mountain loops, Bjorli is a great base for cross-country skiing.`,
    nordicBody: `Bjorli Lesja Løypelag looks after the cross-country trails around Bjorli. The ${f.nordicKm} km network runs through varied mountain and forest terrain, with trails for classic and skate skiing. Grooming follows the trail map when snow and trail conditions allow.`,
    nordicShort: `An ${f.nordicKm} km network for classic and skate skiing through forests and high-mountain terrain. Check Skiappen for the latest recorded grooming.`,
    floodlit: `Sygardsløypa is Bjorli’s floodlit trail. The lights stay on until ${f.lightsUntil} every evening.`,
    supportTitle: 'Support the trail association', supportBody: 'The trail association is run on a not-for-profit basis. All income goes towards running, maintaining and developing the trails.', bankLabel: 'Bank account',
    alpineTitle: 'Alpine piste map', fullFacts: 'Full details about Bjorli Ski Resort', nordicMore: 'More about cross-country skiing and the trail association', mapIntro: 'The alpine piste map for Bjorli Ski Resort and a cross-country map of the trails around Bjorli.',
    mapTitle: 'Cross-country trails and grooming status in Bjorli from Skiappen', attribution: 'Map and grooming status are provided by Skiappen. The colours show the time since the last recorded grooming.', mapHelp: 'Map not showing? Use the button below to open it in Skiappen.', mapCta: 'Open the full map in Skiappen', newTab: 'opens in a new tab',
  },
  de: {
    heading: 'Bjorli Skisenter in Zahlen', labels: ['Lifte insgesamt', 'Abfahrten', 'Alpinpisten', 'Talstation', 'Höchste Station im Skigebiet', 'Höhenunterschied', 'Längste Abfahrt'], altitudeUnit: 'm ü. M.',
    difficultyHeading: 'Schwierigkeitsgrade', difficultyNote: 'Ungefähre Anteile nach Pistenlänge, nicht nach Anzahl der Abfahrten.', difficultyLabels: ['Grün', 'Blau', 'Rot', 'Schwarz'],
    description: `Das Bjorli Skisenter hat ${f.runs} Abfahrten mit insgesamt ${f.alpineKm} km präparierten Alpinpisten. Die Talstation liegt auf ${f.baseAltitude} m und die höchste Station des Skigebiets auf ${f.summitAltitude} m über dem Meer.`,
    facilities: [
      `${f.lifts} Lifte insgesamt: ${f.chairlifts} kuppelbarer Sechser-Sessellift und ${f.surfaceLifts} T-Bügel-/Poma-Schlepplifte.`,
      `Ein eigener Anfängerbereich mit ${f.beginnerLifts} Liften, die in den insgesamt ${f.lifts} Liften enthalten sind.`,
      'Eine lange Funslope und ein großer blauer Terrainpark.',
      `${decimal(f.floodlitKm, 'de')} km beleuchtete Pisten.`,
      `Eine umfangreiche Beschneiungsanlage kann bei geeigneten Bedingungen schnell ${f.snowmakingKm} km Pisten beschneien.`,
      `Normalerweise über ${f.usualOpeningDaysMoreThan} Öffnungstage pro Saison. Termine und Saisonlänge hängen von den Bedingungen ab; dies ist keine Garantie für die laufende Saison.`,
    ],
    nordicTitle: 'Langlauf in Bjorli', nordicIntro: `Mit über ${f.nordicMarketingKmMoreThan} Kilometern Langlaufloipen, von Abendrunden auf der beleuchteten Loipe bis zu langen Touren im Hochfjell, ist Bjorli ein guter Ausgangspunkt zum Langlaufen.`,
    nordicBody: `Bjorli Lesja Løypelag betreut die Langlaufloipen rund um Bjorli. Das ${f.nordicKm} km lange Netz führt durch abwechslungsreiches Hochfjell- und Waldgelände, mit Loipen für klassischen Langlauf und Skating. Die Loipen werden gemäß Loipenkarte präpariert, wenn Schnee- und Loipenverhältnisse es erlauben.`,
    nordicShort: `${f.nordicKm} km Loipennetz für klassischen Langlauf und Skating in Wald- und Hochfjellgelände. Die zuletzt registrierte Präparierung finden Sie in Skiappen.`,
    floodlit: `Sygardsløypa ist die beleuchtete Loipe in Bjorli. Das Licht bleibt jeden Abend bis ${f.lightsUntil} Uhr eingeschaltet.`,
    supportTitle: 'Den Loipenverein unterstützen', supportBody: 'Der Loipenverein arbeitet ohne Gewinnerzielungsabsicht. Alle Einnahmen fließen in den Betrieb, die Pflege und die Weiterentwicklung der Loipen.', bankLabel: 'Kontonummer',
    alpineTitle: 'Alpinpistenkarte', fullFacts: 'Alle Fakten zum Bjorli Skisenter', nordicMore: 'Mehr über Langlauf und den Loipenverein', mapIntro: 'Die Alpinpistenkarte des Bjorli Skisenter und die Langlaufkarte für das Loipennetz rund um Bjorli.',
    mapTitle: 'Langlaufloipen und Präparierungsstatus in Bjorli von Skiappen', attribution: 'Karte und Präparierungsstatus stammen von Skiappen. Die Farben zeigen die Zeit seit der letzten registrierten Präparierung.', mapHelp: 'Wird die Karte nicht angezeigt? Öffnen Sie sie über die Schaltfläche unten in Skiappen.', mapCta: 'Große Karte in Skiappen öffnen', newTab: 'wird in einem neuen Tab geöffnet',
  },
  nl: {
    heading: 'Bjorli Skisenter in cijfers', labels: ['Liften in totaal', 'Afdalingen', 'Alpine pistes', 'Dalstation', 'Hoogste station van het skigebied', 'Hoogteverschil', 'Langste afdaling'], altitudeUnit: 'm boven zeeniveau',
    difficultyHeading: 'Moeilijkheidsgraad', difficultyNote: 'Geschatte verdeling naar pistelengte, niet naar aantal afdalingen.', difficultyLabels: ['Groen', 'Blauw', 'Rood', 'Zwart'],
    description: `Bjorli Skisenter heeft ${f.runs} afdalingen met in totaal ${f.alpineKm} km geprepareerde alpine pistes. Het dalstation ligt op ${f.baseAltitude} m en het hoogste station van het skigebied op ${f.summitAltitude} m boven zeeniveau.`,
    facilities: [
      `${f.lifts} liften in totaal: ${f.chairlifts} zespersoons express-stoeltjeslift en ${f.surfaceLifts} T-beugel-/Poma-sleepliften.`,
      `Een apart beginnersgebied met ${f.beginnerLifts} liften, inbegrepen in het totaal van ${f.lifts}.`,
      'Een lange funslope en een groot blauw terrainpark.',
      `${decimal(f.floodlitKm, 'nl')} km verlichte pistes.`,
      `Een uitgebreid sneeuwkanonnensysteem kan bij geschikte omstandigheden snel ${f.snowmakingKm} km pistes van sneeuw voorzien.`,
      `Normaal gesproken meer dan ${f.usualOpeningDaysMoreThan} openingsdagen per seizoen. Data en seizoenlengte hangen af van de omstandigheden; dit is geen garantie voor het huidige seizoen.`,
    ],
    nordicTitle: 'Langlaufen in Bjorli', nordicIntro: `Met ruim ${f.nordicMarketingKmMoreThan} kilometer langlaufloipes, van avondrondes op de verlichte loipe tot lange tochten in de bergen, is Bjorli een fijne uitvalsbasis voor langlaufen.`,
    nordicBody: `Bjorli Lesja Løypelag zorgt voor de langlaufloipes rond Bjorli. Het netwerk omvat ${f.nordicKm} km in afwisselend hooggebergte- en bosterrein, met loipes voor klassiek langlaufen en skating. De loipes worden volgens de loipekaart geprepareerd wanneer de sneeuw- en spooromstandigheden dat toelaten.`,
    nordicShort: `${f.nordicKm} km loipenetwerk voor klassiek langlaufen en skating door bos- en hooggebergteterrein. Kijk op Skiappen voor de laatst geregistreerde preparatie.`,
    floodlit: `Sygardsløypa is de verlichte loipe van Bjorli. De verlichting blijft elke avond aan tot ${f.lightsUntil} uur.`,
    supportTitle: 'Steun de loipevereniging', supportBody: 'De loipevereniging werkt zonder winstoogmerk. Alle inkomsten gaan naar het beheer, onderhoud en de ontwikkeling van de loipes.', bankLabel: 'Rekeningnummer',
    alpineTitle: 'Alpine pistekaart', fullFacts: 'Alle feiten over Bjorli Skisenter', nordicMore: 'Meer over langlaufen en de loipevereniging', mapIntro: 'De alpine pistekaart van Bjorli Skisenter en de langlaufkaart voor het loipenetwerk rond Bjorli.',
    mapTitle: 'Langlaufloipes en preparatiestatus in Bjorli van Skiappen', attribution: 'Kaart en preparatiestatus worden geleverd door Skiappen. De kleuren tonen de tijd sinds de laatst geregistreerde preparatie.', mapHelp: 'Wordt de kaart niet getoond? Open hem met de knop hieronder in Skiappen.', mapCta: 'Open de grote kaart in Skiappen', newTab: 'opent in een nieuw tabblad',
  },
  da: {
    heading: 'Bjorli Skisenter i tal', labels: ['Lifter i alt', 'Nedfarter', 'Alpinpister', 'Bundstation', 'Anlæggets topstation', 'Højdeforskel', 'Længste nedfart'], altitudeUnit: 'moh.',
    difficultyHeading: 'Sværhedsfordeling', difficultyNote: 'Omtrentlig fordeling efter pistelængde, ikke antal nedfarter.', difficultyLabels: ['Grønne', 'Blå', 'Røde', 'Sorte'],
    description: `Bjorli Skisenter har ${f.runs} nedfarter med i alt ${f.alpineKm} km præparerede alpinpister. Bundstationen ligger ${f.baseAltitude} moh. og anlæggets topstation ${f.summitAltitude} moh.`,
    facilities: [
      `${f.lifts} lifter i alt: ${f.chairlifts} sekspersoners ekspres-stolelift og ${f.surfaceLifts} T-bøjle-/Poma-skilifter.`,
      `Et særskilt begynderområde med ${f.beginnerLifts} lifter, der indgår i de ${f.lifts} lifter i alt.`,
      'En lang funslope og en stor blå terrænpark.',
      `${decimal(f.floodlitKm, 'da')} km oplyste pister.`,
      `Et omfattende snekanonanlæg kan hurtigt dække ${f.snowmakingKm} km pister, når forholdene tillader det.`,
      `Normalt over ${f.usualOpeningDaysMoreThan} åbningsdage pr. sæson. Datoer og sæsonlængde afhænger af forholdene; dette er ikke en garanti for den aktuelle sæson.`,
    ],
    nordicTitle: 'Langrend på Bjorli', nordicIntro: `Med over ${f.nordicMarketingKmMoreThan} kilometer langrendsspor, fra aftenture i det oplyste spor til lange runder på højfjeldet, er Bjorli et godt udgangspunkt for langrend.`,
    nordicBody: `Bjorli Lesja Løypelag har ansvaret for langrendssporene omkring Bjorli. Spornettet omfatter ${f.nordicKm} km i varieret højfjelds- og skovterræn med spor til både klassisk og skøjteteknik. Sporene præpareres efter løjpekortet, når sne- og føreforholdene tillader det.`,
    nordicShort: `${f.nordicKm} km spornet til klassisk og skøjteteknik i skov- og højfjeldsterræn. Se Skiappen for senest registrerede præparering.`,
    floodlit: `Sygardsløypa er det oplyste langrendsspor på Bjorli. Her er lyset tændt frem til kl. ${f.lightsUntil} hver aften.`,
    supportTitle: 'Støt løypelaget', supportBody: 'Løypelaget drives uden profitformål. Alle indtægter går til drift, vedligeholdelse og udvikling af sporene.', bankLabel: 'Kontonummer',
    alpineTitle: 'Alpinpistekort', fullFacts: 'Alle fakta om Bjorli Skisenter', nordicMore: 'Mere om langrend og løypelaget', mapIntro: 'Alpinpistekort for Bjorli Skisenter og langrendskort for spornettet omkring Bjorli.',
    mapTitle: 'Langrendsspor og præpareringsstatus på Bjorli fra Skiappen', attribution: 'Kort og præpareringsstatus leveres af Skiappen. Farverne viser tiden siden sidste registrerede præparering.', mapHelp: 'Vises kortet ikke? Brug knappen nedenfor til at åbne det i Skiappen.', mapCta: 'Åbn stort kort i Skiappen', newTab: 'åbnes i en ny fane',
  },
  sv: {
    heading: 'Bjorli Skisenter i siffror', labels: ['Liftar totalt', 'Nedfarter', 'Alpina pister', 'Dalstation', 'Anläggningens toppstation', 'Höjdskillnad', 'Längsta nedfart'], altitudeUnit: 'm ö.h.',
    difficultyHeading: 'Svårighetsfördelning', difficultyNote: 'Ungefärlig fördelning efter pistlängd, inte antal nedfarter.', difficultyLabels: ['Gröna', 'Blå', 'Röda', 'Svarta'],
    description: `Bjorli Skisenter har ${f.runs} nedfarter med totalt ${f.alpineKm} km preparerade alpina pister. Dalstationen ligger ${f.baseAltitude} m ö.h. och anläggningens toppstation ${f.summitAltitude} m ö.h.`,
    facilities: [
      `${f.lifts} liftar totalt: ${f.chairlifts} sexsitsig express-stollift och ${f.surfaceLifts} T-bygel-/Poma-släpliftar.`,
      `Ett eget nybörjarområde med ${f.beginnerLifts} liftar, som ingår i de totalt ${f.lifts} liftarna.`,
      'En lång funslope och en stor blå terrängpark.',
      `${decimal(f.floodlitKm, 'sv')} km belysta pister.`,
      `En omfattande snökanonanläggning kan snabbt täcka ${f.snowmakingKm} km pister när förhållandena tillåter det.`,
      `Normalt över ${f.usualOpeningDaysMoreThan} öppetdagar per säsong. Datum och säsongslängd beror på förhållandena; detta är ingen garanti för innevarande säsong.`,
    ],
    nordicTitle: 'Längdåkning på Bjorli', nordicIntro: `Med över ${f.nordicMarketingKmMoreThan} kilometer längdspår, från kvällsturer i elljusspåret till långa rundor på högfjället, är Bjorli en fin utgångspunkt för längdåkning.`,
    nordicBody: `Bjorli Lesja Løypelag ansvarar för längdspåren runt Bjorli. Spårnätet omfattar ${f.nordicKm} km i varierad högfjälls- och skogsterräng, med spår för både klassiskt och skate. Spåren prepareras enligt spårkartan när snö- och spårförhållandena tillåter det.`,
    nordicShort: `${f.nordicKm} km spårnät för klassiskt och skate i skogs- och högfjällsterräng. Se Skiappen för senast registrerade preparering.`,
    floodlit: `Sygardsløypa är elljusspåret på Bjorli. Belysningen är tänd fram till kl. ${f.lightsUntil} varje kväll.`,
    supportTitle: 'Stöd spårföreningen', supportBody: 'Spårföreningen drivs utan vinstsyfte. Alla intäkter går till drift, underhåll och utveckling av spåren.', bankLabel: 'Kontonummer',
    alpineTitle: 'Alpin pistkarta', fullFacts: 'Alla fakta om Bjorli Skisenter', nordicMore: 'Mer om längdåkning och spårföreningen', mapIntro: 'Alpin pistkarta för Bjorli Skisenter och längdkarta för spårnätet runt Bjorli.',
    mapTitle: 'Längdspår och prepareringsstatus i Bjorli från Skiappen', attribution: 'Karta och prepareringsstatus levereras av Skiappen. Färgerna visar tid sedan senast registrerade preparering.', mapHelp: 'Visas inte kartan? Använd knappen nedan för att öppna den i Skiappen.', mapCta: 'Öppna stor karta i Skiappen', newTab: 'öppnas i en ny flik',
  },
};

export function alpineStats(locale: Locale) {
  const c = FACTS_COPY[locale];
  return [f.lifts, f.runs, `${f.alpineKm} km`, `${f.baseAltitude} ${c.altitudeUnit}`, `${f.summitAltitude} ${c.altitudeUnit}`, `${f.vertical} m`, `${f.longestRunKm} km`]
    .map((value, i) => ({ label: c.labels[i], value: String(value) }));
}

export function alpineMapStats(locale: Locale) {
  const stats = alpineStats(locale);
  return [stats[1], stats[2], stats[0], stats[5], stats[6]];
}

export function difficultyDistribution(locale: Locale) {
  return (Object.entries(f.difficulty) as [keyof typeof f.difficulty, number][])
    .map(([key, percent], i) => ({ key, percent, label: FACTS_COPY[locale].difficultyLabels[i] }));
}