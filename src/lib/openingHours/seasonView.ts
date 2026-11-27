/**
 * Localized presentation of the 2026/2027 opening hours (six languages).
 *
 * Facts (dates, times) come ONLY from ./season.ts; this file holds wording
 * and formatting. Node-safe: shared by the React page (/apningstider,
 * /mat-og-drikke) and the prerenderer, so first HTML and hydrated page match.
 */
import type { Locale } from '@/i18n/locales/types';
import {
  CHRISTMAS, CLOSING_WEEKEND, EASTER, EVENING, EXCEPTIONS, FJELLKAFE, LIFT1_EARLY,
  REGULAR, SEASON_EVENTS, WINTER_BREAK, closesAfterMidnight, eveningOn, type IsoWeekday, type TimeRange,
} from './season';

/** Verified official channels already used on the site (Footer / schema.org). */
export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/bjorliskisenter/' },
  // TikTok: owner-confirmed 27.11.2026. Same order as the text (Instagram, TikTok, Facebook).
  { label: 'TikTok', href: 'https://www.tiktok.com/@bjorliskisenter' },
  { label: 'Facebook', href: 'https://www.facebook.com/bjorliskisenter' },
] as const;
export const STATUS_LINKS = [
  { label: 'bjorli.no', href: 'https://bjorli.no' },
  { label: 'fnugg.no', href: 'https://fnugg.no/bjorli/' },
] as const;

const INTL: Record<Locale, string> = { no: 'nb-NO', en: 'en-GB', de: 'de-DE', nl: 'nl-NL', da: 'da-DK', sv: 'sv-SE' };

const utc = (d: string) => new Date(`${d}T12:00:00Z`);

/** "21. november", "21 November", "21. November" … (no year). */
export const fmtDay = (locale: Locale, d: string, withYear = false): string =>
  new Intl.DateTimeFormat(INTL[locale], { day: 'numeric', month: 'long', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC' }).format(utc(d));

/** "lørdag 21. november", "Saturday 21 November", "Samstag, 21. November" … */
export const fmtWeekdayDay = (locale: Locale, d: string, withYear = false): string => {
  const wd = new Intl.DateTimeFormat(INTL[locale], { weekday: 'long', timeZone: 'UTC' }).format(utc(d));
  return `${wd}${locale === 'de' ? ', ' : ' '}${fmtDay(locale, d, withYear)}`;
};

const weekdayName = (locale: Locale, wd: IsoWeekday): string =>
  // 2027-03-01 is a Monday → Monday + (wd - 1)
  new Intl.DateTimeFormat(INTL[locale], { weekday: 'long', timeZone: 'UTC' }).format(utc(`2027-03-0${wd}`));

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const hm = (locale: Locale, t: string) => (locale === 'en' || locale === 'de' ? t : t.replace(':', '.'));

/** "kl. 10.00–16.00", "10:00–16:00", "10:00–16:00 Uhr", "10.00–16.00 uur". */
export const fmtRange = (locale: Locale, r: TimeRange): string => {
  const core = `${hm(locale, r.open)}–${hm(locale, r.close)}`;
  switch (locale) {
    case 'de': return `${core} Uhr`;
    case 'nl': return `${core} uur`;
    case 'en': return core;
    default: return `kl. ${core}`;
  }
};

const THROUGH: Record<Locale, string> = {
  no: 'til og med', en: 'to', de: 'bis', nl: 'tot en met', da: 'til og med', sv: 'till och med',
};

/** "16. desember 2026 til og med 3. januar 2027" (year on the start only when it differs). */
export const fmtSpan = (locale: Locale, start: string, end: string, weekday = false): string => {
  const crossYear = start.slice(0, 4) !== end.slice(0, 4);
  const f = weekday ? fmtWeekdayDay : fmtDay;
  return `${f(locale, start, crossYear)} ${THROUGH[locale]} ${f(locale, end, true)}`;
};

/* ------------------------------------------------------------------ */

interface Copy {
  sections: {
    early: string; christmas: string; regular: string; winterBreak: string; easter: string;
    closing: string; evening: string; mini: string; disclaimer: string;
  };
  past: string;
  miniWeekends: string;
  lift1: (span: string, range: string) => string;
  jibben: (day: string) => string;
  social: string;
  christmasDaily: (span: string, range: string) => string;
  exceptionsTitle: string;
  eveningNote: (dates: string, range: string) => string;
  regularWeeks: string;
  regularGroups: string;
  winterDaily: (span: string, range: string) => string;
  winterNote: string;
  easterDaily: (span: string, range: string) => string;
  easterNote: string;
  closingDates: (span: string) => string;
  closingNoHours: string;
  eveningMain: (weekday: string, range: string, span: string) => string;
  grooming: (from: string, to: string) => string;
  eveningTicket: string;
  miniName: string;
  miniFormerly: string;
  miniFree: string;
  miniPrices: string;
  pricesLink: string;
  disclaimer: string;
  statusLinksLabel: string;
  plannedVsLive: string;
  and: string;
  /* Bjorli Fjellkafe (food & drink page) */
  fjellkafe: string;
  fjellkafeNovemberTitle: string;
  fjellkafeAfterMidnight: (nextWeekday: string) => string;
  loungen: string;
}

const C: Record<Locale, Copy> = {
  no: {
    sections: {
      early: 'Sesongstart og tidligsesong', christmas: 'Juleferien', regular: 'Ordinær vintersesong',
      winterBreak: 'Vinterferien', easter: 'Påskeferien', closing: 'Avslutningshelg', evening: 'Kveldskjøring',
      mini: 'Mini-maNeuver-bakken', disclaimer: 'Forbehold om endringer',
    },
    past: 'Avsluttet',
    miniWeekends: 'Mini-maNeuver-bakken er åpen hver lørdag og søndag og følger senterets åpningstider.',
    lift1: (span, range) => `Heis 1 (T-kroken) er åpen hver dag fra ${span}, ${range}.`,
    jibben: (day) => `${cap(day)} er Bjorli vertskap for Jibben Lever Tour.`,
    social: 'Følg oss på Instagram, TikTok og Facebook for siste nytt om snøforhold, åpning og aktiviteter.',
    christmasDaily: (span, range) => `Åpent hver dag fra ${span}, ${range}.`,
    exceptionsTitle: 'Avvikende åpningstider',
    eveningNote: (dates, range) => `Kveldskjøring ${dates}: ${range}.`,
    regularWeeks: 'Uke 2–6, 9–11 og 13–15 i 2027',
    regularGroups: 'Ingen ordinær åpning, men grupper kan få åpnet på forespørsel.',
    winterDaily: (span, range) => `Åpent hver dag fra ${span}, ${range}.`,
    winterNote: 'Gjelder vinterferieukene 7 og 8, inkludert helgen før uke 7.',
    easterDaily: (span, range) => `Åpent hver dag fra ${span}, ${range}.`,
    easterNote: 'I påskeferien gjelder disse åpningstidene, også i uker som ellers følger ordinær åpningstid.',
    closingDates: (span) => `Avslutningshelgen er fra ${span}.`,
    closingNoHours: 'Åpningstidene for avslutningshelgen er ikke fastsatt ennå.',
    eveningMain: (weekday, range, span) => `${cap(weekday)}er ${range}, fra ${span}.`,
    grooming: (from, to) => `Ved behov prepareres bakkene mellom kl. ${from} og ${to}.`,
    eveningTicket: 'Kveldskjøring krever egen billett.',
    miniName: 'Mini-maNeuver-bakken',
    miniFormerly: 'Tidligere kjent som barnebakken eller juniorbakken.',
    miniFree: 'Gratis for barn fra 0 til og med 6 år.',
    miniPrices: 'Lave priser for alle andre.',
    pricesLink: 'Se priser på heiskort',
    disclaimer: 'Ved gode snøforhold kan vi utvide åpningstidene og åpne flere dager. Åpningstidene kan også endres ved behov, for eksempel på grunn av vær, snøforhold eller drift.',
    statusLinksLabel: 'Oppdatert informasjon finner du på',
    plannedVsLive: 'Tidene på denne siden er planlagte åpningstider. Om heisene faktisk går akkurat nå, ser du i driftsstatusen øverst.',
    and: 'og',
    fjellkafe: 'Bjorli Fjellkafe har åpent med kafé og varmestue i hele heisens åpningstid. Kafeen er betjent, og varmestuen ligger i andre etasje.',
    fjellkafeNovemberTitle: 'Åpningstider i november 2026',
    fjellkafeAfterMidnight: (w) => `natt til ${w}`,
    loungen: 'Loungen åpner i desember 2026.',
  },
  en: {
    sections: {
      early: 'Season opening and early season', christmas: 'Christmas holidays', regular: 'Regular winter season',
      winterBreak: 'Winter half-term', easter: 'Easter holidays', closing: 'Closing weekend', evening: 'Evening skiing',
      mini: 'Mini-maNeuver slope', disclaimer: 'Subject to change',
    },
    past: 'Ended',
    miniWeekends: 'The Mini-maNeuver slope is open every Saturday and Sunday and follows the resort’s opening hours.',
    lift1: (span, range) => `Lift 1 (T-kroken) is open every day from ${span}, ${range}.`,
    jibben: (day) => `On ${day}, Bjorli hosts the Jibben Lever Tour.`,
    social: 'Follow us on Instagram, TikTok and Facebook for the latest on snow, openings and activities.',
    christmasDaily: (span, range) => `Open every day from ${span}, ${range}.`,
    exceptionsTitle: 'Different opening times',
    eveningNote: (dates, range) => `Evening skiing on ${dates}: ${range}.`,
    regularWeeks: 'Weeks 2–6, 9–11 and 13–15 of 2027',
    regularGroups: 'No regular opening, but groups can request opening.',
    winterDaily: (span, range) => `Open every day from ${span}, ${range}.`,
    winterNote: 'Covers the Norwegian winter half-term weeks 7 and 8, including the weekend before week 7.',
    easterDaily: (span, range) => `Open every day from ${span}, ${range}.`,
    easterNote: 'During the Easter holidays these times apply, including in weeks that otherwise follow regular hours.',
    closingDates: (span) => `The closing weekend runs from ${span}.`,
    closingNoHours: 'Opening times for the closing weekend have not been set yet.',
    eveningMain: (weekday, range, span) => `${weekday}s, ${range}, from ${span}.`,
    grooming: (from, to) => `When needed, the slopes are groomed between ${from} and ${to}.`,
    eveningTicket: 'Evening skiing requires a separate ticket.',
    miniName: 'Mini-maNeuver slope',
    miniFormerly: 'Our beginners’ and children’s slope, previously known locally as “barnebakken” or “juniorbakken”.',
    miniFree: 'Free for children aged 0 to 6.',
    miniPrices: 'Low prices for everyone else.',
    pricesLink: 'See lift ticket prices',
    disclaimer: 'When snow conditions are good, we may extend opening times and open on more days. Opening times may also change when needed, for example because of weather, snow conditions or operations.',
    statusLinksLabel: 'For the latest information, see',
    plannedVsLive: 'The times on this page are planned opening times. Whether the lifts are running right now is shown in the live status at the top.',
    and: 'and',
    fjellkafe: 'Bjorli Fjellkafe’s café and warming room are open whenever the lifts are running. The café is staffed, and the warming room is on the first floor (one floor up).',
    fjellkafeNovemberTitle: 'Opening times in November 2026',
    fjellkafeAfterMidnight: (w) => `into ${w} morning`,
    loungen: 'Loungen (the lounge) opens in December 2026.',
  },
  de: {
    sections: {
      early: 'Saisonstart und Vorsaison', christmas: 'Weihnachtsferien', regular: 'Reguläre Wintersaison',
      winterBreak: 'Winterferien', easter: 'Osterferien', closing: 'Abschlusswochenende', evening: 'Abendskifahren',
      mini: 'Mini-maNeuver-Hang', disclaimer: 'Änderungen vorbehalten',
    },
    past: 'Beendet',
    miniWeekends: 'Der Mini-maNeuver-Hang ist jeden Samstag und Sonntag zu den Öffnungszeiten des Skigebiets geöffnet.',
    lift1: (span, range) => `Lift 1 (T-kroken) ist vom ${span} täglich geöffnet, ${range}.`,
    jibben: (day) => `Am ${day} ist Bjorli Gastgeber der Jibben Lever Tour.`,
    social: 'Folgen Sie uns auf Instagram, TikTok und Facebook – dort gibt es das Neueste zu Schnee, Öffnung und Aktivitäten.',
    christmasDaily: (span, range) => `Täglich geöffnet vom ${span}, ${range}.`,
    exceptionsTitle: 'Abweichende Öffnungszeiten',
    eveningNote: (dates, range) => `Abendskifahren am ${dates}: ${range}.`,
    regularWeeks: 'Kalenderwochen 2–6, 9–11 und 13–15 im Jahr 2027',
    regularGroups: 'Kein regulärer Betrieb, Gruppen können aber eine Öffnung anfragen.',
    winterDaily: (span, range) => `Täglich geöffnet vom ${span}, ${range}.`,
    winterNote: 'Gilt für die norwegischen Winterferienwochen 7 und 8, einschließlich des Wochenendes vor Woche 7.',
    easterDaily: (span, range) => `Täglich geöffnet vom ${span}, ${range}.`,
    easterNote: 'In den Osterferien gelten diese Zeiten, auch in Wochen, die sonst den regulären Öffnungszeiten folgen.',
    closingDates: (span) => `Das Abschlusswochenende ist vom ${span}.`,
    closingNoHours: 'Die Öffnungszeiten für das Abschlusswochenende stehen noch nicht fest.',
    eveningMain: (weekday, range, span) => `${cap(weekday)}s, ${range}, vom ${span}.`,
    grooming: (from, to) => `Bei Bedarf werden die Pisten zwischen ${from} und ${to} Uhr präpariert.`,
    eveningTicket: 'Für das Abendskifahren ist ein separates Ticket nötig.',
    miniName: 'Mini-maNeuver-Hang',
    miniFormerly: 'Unser Anfänger- und Kinderhang, früher als „barnebakken“ oder „juniorbakken“ bekannt.',
    miniFree: 'Kostenlos für Kinder von 0 bis 6 Jahren.',
    miniPrices: 'Günstige Preise für alle anderen.',
    pricesLink: 'Preise für Skipässe ansehen',
    disclaimer: 'Bei guten Schneeverhältnissen können wir die Öffnungszeiten verlängern und an weiteren Tagen öffnen. Die Öffnungszeiten können sich bei Bedarf auch ändern, zum Beispiel wegen Wetter, Schneelage oder Betrieb.',
    statusLinksLabel: 'Aktuelle Informationen finden Sie auf',
    plannedVsLive: 'Die Zeiten auf dieser Seite sind geplante Öffnungszeiten. Ob die Lifte gerade laufen, zeigt der Live-Status oben.',
    and: 'und',
    fjellkafe: 'Café und Aufwärmraum der Bjorli Fjellkafe sind während der gesamten Liftbetriebszeiten geöffnet. Das Café ist bedient, der Aufwärmraum liegt im ersten Obergeschoss.',
    fjellkafeNovemberTitle: 'Öffnungszeiten im November 2026',
    fjellkafeAfterMidnight: (w) => `in der Nacht zum ${w}`,
    loungen: 'Die Loungen (Lounge) öffnet im Dezember 2026.',
  },
  nl: {
    sections: {
      early: 'Seizoensstart en voorseizoen', christmas: 'Kerstvakantie', regular: 'Regulier winterseizoen',
      winterBreak: 'Wintervakantie', easter: 'Paasvakantie', closing: 'Slotweekend', evening: 'Avondskiën',
      mini: 'Mini-maNeuver-helling', disclaimer: 'Wijzigingen voorbehouden',
    },
    past: 'Afgelopen',
    miniWeekends: 'De Mini-maNeuver-helling is elke zaterdag en zondag open en volgt de openingstijden van het skigebied.',
    lift1: (span, range) => `Lift 1 (T-kroken) is elke dag open van ${span}, ${range}.`,
    jibben: (day) => `Op ${day} is Bjorli gastheer van de Jibben Lever Tour.`,
    social: 'Volg ons op Instagram, TikTok en Facebook voor het laatste nieuws over sneeuw, opening en activiteiten.',
    christmasDaily: (span, range) => `Elke dag open van ${span}, ${range}.`,
    exceptionsTitle: 'Afwijkende openingstijden',
    eveningNote: (dates, range) => `Avondskiën op ${dates}: ${range}.`,
    regularWeeks: 'Week 2–6, 9–11 en 13–15 van 2027',
    regularGroups: 'Geen reguliere opening, maar groepen kunnen een opening aanvragen.',
    winterDaily: (span, range) => `Elke dag open van ${span}, ${range}.`,
    winterNote: 'Geldt voor de Noorse wintervakantieweken 7 en 8, inclusief het weekend vóór week 7.',
    easterDaily: (span, range) => `Elke dag open van ${span}, ${range}.`,
    easterNote: 'Tijdens de paasvakantie gelden deze tijden, ook in weken die verder de reguliere openingstijden volgen.',
    closingDates: (span) => `Het slotweekend is van ${span}.`,
    closingNoHours: 'De openingstijden voor het slotweekend zijn nog niet vastgesteld.',
    eveningMain: (weekday, range, span) => `Elke ${weekday}, ${range}, van ${span}.`,
    grooming: (from, to) => `Indien nodig worden de pistes tussen ${from} en ${to} uur geprepareerd.`,
    eveningTicket: 'Voor avondskiën heb je een apart ticket nodig.',
    miniName: 'Mini-maNeuver-helling',
    miniFormerly: 'Onze beginners- en kinderhelling, vroeger bekend als ‘barnebakken’ of ‘juniorbakken’.',
    miniFree: 'Gratis voor kinderen van 0 tot en met 6 jaar.',
    miniPrices: 'Lage prijzen voor alle anderen.',
    pricesLink: 'Bekijk de skipasprijzen',
    disclaimer: 'Bij goede sneeuwomstandigheden kunnen we de openingstijden verlengen en op meer dagen opengaan. De openingstijden kunnen ook wijzigen als dat nodig is, bijvoorbeeld door het weer, de sneeuw of de bedrijfsvoering.',
    statusLinksLabel: 'Actuele informatie vind je op',
    plannedVsLive: 'De tijden op deze pagina zijn geplande openingstijden. Of de liften op dit moment draaien, zie je in de live status bovenaan.',
    and: 'en',
    fjellkafe: 'Het café en de opwarmruimte van Bjorli Fjellkafe zijn open zolang de liften draaien. Het café is bemand en de opwarmruimte ligt op de eerste verdieping.',
    fjellkafeNovemberTitle: 'Openingstijden in november 2026',
    fjellkafeAfterMidnight: (w) => `in de nacht naar ${w}`,
    loungen: 'Loungen (de lounge) gaat open in december 2026.',
  },
  da: {
    sections: {
      early: 'Sæsonstart og tidlig sæson', christmas: 'Juleferien', regular: 'Almindelig vintersæson',
      winterBreak: 'Vinterferien', easter: 'Påskeferien', closing: 'Afslutningsweekend', evening: 'Aftenskiløb',
      mini: 'Mini-maNeuver-bakken', disclaimer: 'Forbehold for ændringer',
    },
    past: 'Afsluttet',
    miniWeekends: 'Mini-maNeuver-bakken har åbent hver lørdag og søndag og følger skicentrets åbningstider.',
    lift1: (span, range) => `Lift 1 (T-kroken) har åbent hver dag fra ${span}, ${range}.`,
    jibben: (day) => `${cap(day)} er Bjorli vært for Jibben Lever Tour.`,
    social: 'Følg os på Instagram, TikTok og Facebook for det seneste om sne, åbning og aktiviteter.',
    christmasDaily: (span, range) => `Åbent hver dag fra ${span}, ${range}.`,
    exceptionsTitle: 'Afvigende åbningstider',
    eveningNote: (dates, range) => `Aftenskiløb ${dates}: ${range}.`,
    regularWeeks: 'Uge 2–6, 9–11 og 13–15 i 2027',
    regularGroups: 'Ingen almindelig drift, men grupper kan forespørge om åbning.',
    winterDaily: (span, range) => `Åbent hver dag fra ${span}, ${range}.`,
    winterNote: 'Gælder de norske vinterferieuger 7 og 8, inklusive weekenden før uge 7.',
    easterDaily: (span, range) => `Åbent hver dag fra ${span}, ${range}.`,
    easterNote: 'I påskeferien gælder disse åbningstider, også i uger der ellers følger de almindelige åbningstider.',
    closingDates: (span) => `Afslutningsweekenden er fra ${span}.`,
    closingNoHours: 'Åbningstiderne for afslutningsweekenden er ikke fastlagt endnu.',
    eveningMain: (weekday, range, span) => `${cap(weekday)}e ${range}, fra ${span}.`,
    grooming: (from, to) => `Ved behov præpareres pisterne mellem kl. ${from} og ${to}.`,
    eveningTicket: 'Aftenskiløb kræver en separat billet.',
    miniName: 'Mini-maNeuver-bakken',
    miniFormerly: 'Vores begynder- og børnebakke, tidligere kendt som barnebakken eller juniorbakken.',
    miniFree: 'Gratis for børn fra 0 til og med 6 år.',
    miniPrices: 'Lave priser for alle andre.',
    pricesLink: 'Se priser på liftkort',
    disclaimer: 'Ved gode sneforhold kan vi udvide åbningstiderne og åbne flere dage. Åbningstiderne kan også ændres efter behov, for eksempel på grund af vejr, sneforhold eller drift.',
    statusLinksLabel: 'Opdateret information finder du på',
    plannedVsLive: 'Tiderne på denne side er planlagte åbningstider. Om liftene kører lige nu, ser du i driftsstatus øverst.',
    and: 'og',
    fjellkafe: 'Bjorli Fjellkafe har åbent med café og varmestue i hele liftens åbningstid. Caféen er betjent, og varmestuen ligger på første sal.',
    fjellkafeNovemberTitle: 'Åbningstider i november 2026',
    fjellkafeAfterMidnight: (w) => `natten til ${w}`,
    loungen: 'Loungen åbner i december 2026.',
  },
  sv: {
    sections: {
      early: 'Säsongsstart och försäsong', christmas: 'Jullovet', regular: 'Ordinarie vintersäsong',
      winterBreak: 'Sportlovet', easter: 'Påsklovet', closing: 'Avslutningshelg', evening: 'Kvällsåkning',
      mini: 'Mini-maNeuver-backen', disclaimer: 'Förbehåll för ändringar',
    },
    past: 'Avslutad',
    miniWeekends: 'Mini-maNeuver-backen har öppet varje lördag och söndag och följer anläggningens öppettider.',
    lift1: (span, range) => `Lift 1 (T-kroken) har öppet varje dag från ${span}, ${range}.`,
    jibben: (day) => `${cap(day)} är Bjorli värd för Jibben Lever Tour.`,
    social: 'Följ oss på Instagram, TikTok och Facebook för det senaste om snö, öppning och aktiviteter.',
    christmasDaily: (span, range) => `Öppet varje dag från ${span}, ${range}.`,
    exceptionsTitle: 'Avvikande öppettider',
    eveningNote: (dates, range) => `Kvällsåkning ${dates}: ${range}.`,
    regularWeeks: 'Vecka 2–6, 9–11 och 13–15 år 2027',
    regularGroups: 'Ingen ordinarie drift, men grupper kan begära öppning.',
    winterDaily: (span, range) => `Öppet varje dag från ${span}, ${range}.`,
    winterNote: 'Gäller de norska sportlovsveckorna 7 och 8, inklusive helgen före vecka 7.',
    easterDaily: (span, range) => `Öppet varje dag från ${span}, ${range}.`,
    easterNote: 'Under påsklovet gäller dessa öppettider, även i veckor som annars följer de ordinarie öppettiderna.',
    closingDates: (span) => `Avslutningshelgen är från ${span}.`,
    closingNoHours: 'Öppettiderna för avslutningshelgen är inte fastställda ännu.',
    eveningMain: (weekday, range, span) => `${cap(weekday)}ar ${range}, från ${span}.`,
    grooming: (from, to) => `Vid behov prepareras backarna mellan kl. ${from} och ${to}.`,
    eveningTicket: 'Kvällsåkning kräver en separat biljett.',
    miniName: 'Mini-maNeuver-backen',
    miniFormerly: 'Vår nybörjar- och barnbacke, tidigare känd som barnebakken eller juniorbakken.',
    miniFree: 'Gratis för barn från 0 till och med 6 år.',
    miniPrices: 'Låga priser för alla andra.',
    pricesLink: 'Se priser på liftkort',
    disclaimer: 'Vid goda snöförhållanden kan vi förlänga öppettiderna och öppna fler dagar. Öppettiderna kan också ändras vid behov, till exempel på grund av väder, snöförhållanden eller drift.',
    statusLinksLabel: 'Uppdaterad information finns på',
    plannedVsLive: 'Tiderna på den här sidan är planerade öppettider. Om liftarna går just nu ser du i driftstatusen högst upp.',
    and: 'och',
    fjellkafe: 'Bjorli Fjellkafe har öppet med kafé och värmestuga under liftens alla öppettider. Kaféet är bemannat och värmestugan ligger på andra våningen.',
    fjellkafeNovemberTitle: 'Öppettider i november 2026',
    fjellkafeAfterMidnight: (w) => `natten mot ${w}`,
    loungen: 'Loungen öppnar i december 2026.',
  },
};

export const openingHoursCopy = (locale: Locale): Copy => C[locale] ?? C.no;

/* ------------------------------------------------------------------ */
/* Sections: one structured description, rendered by React and prerender. */

export type SectionId = keyof Copy['sections'];

export interface Row {
  /** Optional bold label ("Onsdag–søndag", "24. desember"). */
  label?: string;
  text: string;
  /** Visually highlighted (deviating times, holiday hours). */
  highlight?: boolean;
}

export interface Section {
  id: SectionId;
  title: string;
  rows: Row[];
  /** Short supporting notes under the rows. */
  notes: string[];
  /** Last date the section is relevant (Oslo date); undefined = always. */
  end?: string;
  past: boolean;
  links?: Array<{ label: string; href: string }>;
}

const joinList = (locale: Locale, items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${openingHoursCopy(locale).and} ${items[items.length - 1]}`;

export const buildSections = (locale: Locale, today: string): Section[] => {
  const c = openingHoursCopy(locale);
  const range = (r: TimeRange) => fmtRange(locale, r);
  const sec = (s: Omit<Section, 'past'>): Section => ({ ...s, past: s.end ? today > s.end : false });

  const xmasExceptions = EXCEPTIONS.filter((e) => e.date >= CHRISTMAS.start && e.date <= CHRISTMAS.end);
  // Fridays inside the Christmas holidays: evening skiing comes from EVENING, not a copy.
  const xmasEvenings = EXCEPTIONS.map((e) => e.date)
    .filter((d) => d >= CHRISTMAS.start && d <= CHRISTMAS.end && eveningOn(d));
  const openWeekdays = REGULAR.openDays;
  const dayName = (wd: IsoWeekday) => weekdayName(locale, wd);
  const regularOpenLabel = cap(`${dayName(openWeekdays[0])}–${dayName(openWeekdays[openWeekdays.length - 1])}`);
  const regularGroupLabel = cap(`${dayName(REGULAR.groupsOnRequestDays[0])} ${c.and} ${dayName(REGULAR.groupsOnRequestDays[1])}`);

  return [
    sec({
      id: 'early', title: c.sections.early, end: LIFT1_EARLY.end,
      rows: [
        { text: c.miniWeekends },
        { text: c.lift1(fmtSpan(locale, LIFT1_EARLY.start, LIFT1_EARLY.end, true), range(LIFT1_EARLY.hours!)), highlight: true },
        ...SEASON_EVENTS.map((e) => ({ text: c.jibben(fmtWeekdayDay(locale, e.date, true)) })),
      ],
      notes: [c.social],
      links: [...SOCIAL_LINKS],
    }),
    sec({
      id: 'christmas', title: c.sections.christmas, end: CHRISTMAS.end,
      rows: [
        { text: c.christmasDaily(fmtSpan(locale, CHRISTMAS.start, CHRISTMAS.end), range(CHRISTMAS.hours!)) },
        ...xmasExceptions.map((e) => ({ label: cap(fmtWeekdayDay(locale, e.date, e.date.startsWith('2027'))), text: range(e.hours), highlight: true })),
        { text: c.eveningNote(joinList(locale, xmasEvenings.map((d) => fmtDay(locale, d, d.startsWith('2027')))), range(EVENING.hours)), highlight: true },
      ],
      notes: [],
    }),
    sec({
      id: 'regular', title: c.sections.regular, end: '2027-04-18',
      rows: [
        { label: regularOpenLabel, text: range(REGULAR.hours), highlight: true },
        { label: regularGroupLabel, text: c.regularGroups },
      ],
      notes: [c.regularWeeks],
    }),
    sec({
      id: 'winterBreak', title: c.sections.winterBreak, end: WINTER_BREAK.end,
      rows: [{ text: c.winterDaily(fmtSpan(locale, WINTER_BREAK.start, WINTER_BREAK.end), range(WINTER_BREAK.hours!)), highlight: true }],
      notes: [c.winterNote],
    }),
    sec({
      id: 'easter', title: c.sections.easter, end: EASTER.end,
      rows: [{ text: c.easterDaily(fmtSpan(locale, EASTER.start, EASTER.end), range(EASTER.hours!)), highlight: true }],
      notes: [c.easterNote],
    }),
    sec({
      id: 'closing', title: c.sections.closing, end: CLOSING_WEEKEND.end,
      rows: [{ text: c.closingDates(fmtSpan(locale, CLOSING_WEEKEND.start, CLOSING_WEEKEND.end, true)) }],
      notes: [c.closingNoHours],
    }),
    sec({
      id: 'evening', title: c.sections.evening, end: EVENING.end,
      rows: [
        { text: c.eveningMain(dayName(EVENING.weekday), range(EVENING.hours), fmtSpan(locale, EVENING.start, EVENING.end)), highlight: true },
        { text: c.grooming(hm(locale, EVENING.groomingWindow.open), hm(locale, EVENING.groomingWindow.close)) },
        { text: c.eveningTicket },
      ],
      notes: [],
    }),
    sec({
      id: 'mini', title: c.sections.mini,
      rows: [{ text: c.miniFree, highlight: true }, { text: c.miniPrices }],
      notes: [c.miniFormerly],
      links: [{ label: c.pricesLink, href: '/heiskort' }],
    }),
    sec({
      id: 'disclaimer', title: c.sections.disclaimer,
      rows: [{ text: c.disclaimer }],
      notes: [c.plannedVsLive, c.statusLinksLabel],
      links: [...STATUS_LINKS],
    }),
  ];
};

/** Bjorli Fjellkafe November hours as display rows (only until 30 Nov 2026). */
export const fjellkafeNovemberRows = (locale: Locale): Row[] => {
  const c = openingHoursCopy(locale);
  return FJELLKAFE.november2026.days.map(({ weekday, hours }) => {
    const label = cap(weekdayName(locale, weekday));
    if (!closesAfterMidnight(hours)) return { label, text: fmtRange(locale, hours) };
    const next = weekdayName(locale, (weekday % 7 + 1) as IsoWeekday);
    const text = fmtRange(locale, hours);
    // Closing at midnight is clear as "00.00"; later closings say "into the night of …".
    return hours.close === '00:00' ? { label, text } : { label, text: `${text} (${c.fjellkafeAfterMidnight(next)})` };
  });
};

export const fjellkafeNovemberActive = (today: string) => today <= FJELLKAFE.november2026.end;
