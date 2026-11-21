import data from './data.json';
import type { Locale } from '@/i18n/locales/types';

/** Owner-supplied route data; elevations attributed to Kartverket in the upload. */
export type TrailPoint = [number, number, number, number, number];
export interface Trail {
  name: string; color: string; textColor: string; lengthKm: number; loop: boolean;
  ascent: number; descent: number; ascentReverse: number; descentReverse: number;
  minEle: number; maxEle: number; gpx: string; points: TrailPoint[];
}
export const TRAILS = data as Trail[];
export const trailId = (name: string) => 'loype-' + name.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const number = (value: number, locale: Locale, decimals = 0) => new Intl.NumberFormat(locale === 'no' ? 'nb-NO' : locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
export const distance = (meters: number, locale: Locale) => `${number(meters / 1000, locale, 1)} km`;
export function profileFor(trail: Trail, reversed = false): TrailPoint[] {
  if (!reversed) return trail.points;
  const total = trail.points.at(-1)?.[3] ?? 0;
  return trail.points.map((_, i, pts) => {
    const p = pts[pts.length - 1 - i];
    return [p[0], p[1], p[2], total - p[3], i > 0 && pts[pts.length - i]?.[4] === 1 ? 1 : 0];
  });
}
export function segmentsFor(points: TrailPoint[]): TrailPoint[][] {
  const segments: TrailPoint[][] = [];
  for (const point of points) {
    if (!segments.length || point[4] === 1) segments.push([]);
    segments[segments.length - 1].push(point);
  }
  return segments;
}
const xml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function gpxFor(trail: Trail, reversed = false): string {
  const name = xml(`Bjorli – ${trail.name}${reversed ? ' (reverse)' : ''}`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="bjorli.no" xmlns="http://www.topografix.com/GPX/1/1"><metadata><name>${name}</name></metadata><trk><name>${name}</name>${segmentsFor(profileFor(trail, reversed)).map(segment => `<trkseg>${segment.map(p => `<trkpt lat="${p[0].toFixed(6)}" lon="${p[1].toFixed(6)}"><ele>${p[2].toFixed(1)}</ele></trkpt>`).join('')}</trkseg>`).join('')}</trk></gpx>\n`;
}
export const gpxFilename = (trail: Trail, reversed = false) => `bjorli-${trailId(trail.name).slice(6)}${reversed ? '-motsatt' : ''}.gpx`;

export interface TrailCopy {
  title: string; loop: string; oneWay: string; length: string; ascent: string; descent: string;
  download: string; reverse: string; normal: string; reversed: string; profile: string;
  start: string; end: string; lowest: string; highest: string; elevation: string;
  read: string; source: string; gap: string;
}
export const TRAIL_COPY: Record<Locale, TrailCopy> = {
  no: { title: 'Langrennsløyper', loop: 'Rundløype', oneWay: 'Én vei', length: 'Lengde', ascent: 'Stigning', descent: 'Nedstigning', download: 'Last ned GPX', reverse: 'Snu retning', normal: 'Vanlig retning', reversed: 'Motsatt retning', profile: 'Høydeprofil', start: 'Start', end: 'Mål', lowest: 'Laveste punkt', highest: 'Høyeste punkt', elevation: 'moh.', read: 'Avles høydeprofil', source: 'Høydedata © Kartverket. Traseer fra Bjorli Lesja Løypelag. Følg alltid skilting og sjekk preparering i kartet over.', gap: 'Kildedataene har et brudd på omtrent 400 meter. Bruddet inngår ikke i oppgitt lengde; GPX-filen har to segmenter.' },
  en: { title: 'Cross-country trails', loop: 'Loop', oneWay: 'One way', length: 'Length', ascent: 'Ascent', descent: 'Descent', download: 'Download GPX', reverse: 'Reverse direction', normal: 'Original direction', reversed: 'Reverse direction', profile: 'Elevation profile', start: 'Start', end: 'Finish', lowest: 'Lowest point', highest: 'Highest point', elevation: 'm above sea level', read: 'Read elevation profile', source: 'Elevation data © Kartverket. Routes from Bjorli Lesja Løypelag. Follow signs and check grooming in the map above.', gap: 'The source data has a gap of about 400 metres. This gap is excluded from the stated length; the GPX file has two segments.' },
  de: { title: 'Langlaufloipen', loop: 'Rundloipe', oneWay: 'Einfache Strecke', length: 'Länge', ascent: 'Aufstieg', descent: 'Abstieg', download: 'GPX herunterladen', reverse: 'Richtung umkehren', normal: 'Ursprüngliche Richtung', reversed: 'Umgekehrte Richtung', profile: 'Höhenprofil', start: 'Start', end: 'Ziel', lowest: 'Tiefster Punkt', highest: 'Höchster Punkt', elevation: 'm ü. M.', read: 'Höhenprofil ablesen', source: 'Höhendaten © Kartverket. Strecken von Bjorli Lesja Løypelag. Beachten Sie die Beschilderung und prüfen Sie die Präparierung in der Karte oben.', gap: 'Die Quelldaten enthalten eine Lücke von etwa 400 Metern. Sie ist nicht in der angegebenen Länge enthalten; die GPX-Datei hat zwei Segmente.' },
  nl: { title: 'Langlaufloipes', loop: 'Rondje', oneWay: 'Enkele reis', length: 'Lengte', ascent: 'Stijging', descent: 'Daling', download: 'Download GPX', reverse: 'Keer richting om', normal: 'Oorspronkelijke richting', reversed: 'Omgekeerde richting', profile: 'Hoogteprofiel', start: 'Start', end: 'Eindpunt', lowest: 'Laagste punt', highest: 'Hoogste punt', elevation: 'm boven zeeniveau', read: 'Hoogteprofiel aflezen', source: 'Hoogtegegevens © Kartverket. Routes van Bjorli Lesja Løypelag. Volg de bewegwijzering en bekijk de preparatie in de kaart hierboven.', gap: 'De brongegevens bevatten een onderbreking van ongeveer 400 meter. Deze telt niet mee in de vermelde lengte; het GPX-bestand heeft twee segmenten.' },
  da: { title: 'Langrendsløjper', loop: 'Rundløjpe', oneWay: 'Én vej', length: 'Længde', ascent: 'Stigning', descent: 'Nedstigning', download: 'Hent GPX', reverse: 'Vend retning', normal: 'Oprindelig retning', reversed: 'Modsat retning', profile: 'Højdeprofil', start: 'Start', end: 'Mål', lowest: 'Laveste punkt', highest: 'Højeste punkt', elevation: 'm over havet', read: 'Aflæs højdeprofil', source: 'Højdedata © Kartverket. Ruter fra Bjorli Lesja Løypelag. Følg skiltningen og tjek præpareringen i kortet ovenfor.', gap: 'Kildedataene har et brud på omkring 400 meter. Bruddet indgår ikke i den angivne længde; GPX-filen har to segmenter.' },
  sv: { title: 'Längdspår', loop: 'Slinga', oneWay: 'Enkel väg', length: 'Längd', ascent: 'Stigning', descent: 'Nedför', download: 'Ladda ner GPX', reverse: 'Vänd riktning', normal: 'Ursprunglig riktning', reversed: 'Motsatt riktning', profile: 'Höjdprofil', start: 'Start', end: 'Mål', lowest: 'Lägsta punkt', highest: 'Högsta punkt', elevation: 'm över havet', read: 'Avläs höjdprofil', source: 'Höjddata © Kartverket. Sträckor från Bjorli Lesja Løypelag. Följ skyltningen och kontrollera prepareringen i kartan ovan.', gap: 'Källdata har ett avbrott på ungefär 400 meter. Det ingår inte i den angivna längden; GPX-filen har två segment.' },
};
export const trailSummary = (trail: Trail, locale: Locale) => `${trail.loop ? TRAIL_COPY[locale].loop : TRAIL_COPY[locale].oneWay} · ${distance(trail.lengthKm * 1000, locale)} · ${number(trail.ascent, locale)} m ${TRAIL_COPY[locale].ascent.toLowerCase()}`;
