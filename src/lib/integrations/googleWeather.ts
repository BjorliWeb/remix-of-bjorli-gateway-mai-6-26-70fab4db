/**
 * Google Weather forecast for the Bjorli base point.
 *
 * The browser never talks to Google directly — the API key lives only in the
 * `get-weather` Edge Function, which is hard-locked to the owner-confirmed
 * base coordinates (62.2654301, 8.2129572).
 *
 * All numeric fields are `number | null`. Missing data must render as an
 * em dash, never as 0.
 */

import { supabase } from '@/integrations/supabase/client';

/** Direction the wind comes FROM. 0 degrees is valid (northerly). */
export interface WindDirection {
  windDirectionDegrees?: number | null;
  windDirectionCardinal?: string | null;
}

export interface WeatherHour extends WindDirection {
  startTime: string | null;
  temperatureC: number | null;
  speedMs: number | null;
  gustMs: number | null;
  precipitationMm: number | null;
  precipitationProbability: number | null;
  condition: string | null;
  conditionType: string | null;
  conditionIconBaseUri: string | null;
  isDaytime: boolean | null;
}

export interface WeatherDay extends WindDirection {
  date: string | null;
  startTime: string | null;
  maxTemperatureC: number | null;
  minTemperatureC: number | null;
  speedMs: number | null;
  gustMs: number | null;
  precipitationMm: number | null;
  precipitationProbability: number | null;
  condition: string | null;
  conditionType: string | null;
  conditionIconBaseUri: string | null;
  isDaytime: boolean | null;
}

export interface BjorliForecast {
  source: string;
  timeZone: string;
  /** When the server last retrieved data from Google (not forecast validity). */
  fetchedAt: string | null;
  /** Separate retrieval times — hourly and daily data expire differently. */
  hourlyFetchedAt: string | null;
  dailyFetchedAt: string | null;
  hours: WeatherHour[];
  days: WeatherDay[];
  /** True when a scheduled refresh was missed and part of the data expired. */
  stale: boolean;
}

export const EMPTY_FORECAST: BjorliForecast = {
  source: 'Google Weather API',
  timeZone: 'Europe/Oslo',
  fetchedAt: null,
  hourlyFetchedAt: null,
  dailyFetchedAt: null,
  hours: [],
  days: [],
  stale: false,
};

export const OSLO_TZ = 'Europe/Oslo';

/** Owner-confirmed base point, mirrored from the Edge Function for display. */
export const BJORLI_BASE_POINT = { latitude: 62.2654301, longitude: 8.2129572 } as const;

export async function fetchBjorliForecast(): Promise<BjorliForecast> {
  const { data, error } = await supabase.functions.invoke('get-weather', {
    method: 'GET',
  });
  if (error) throw error;
  const d = (data ?? {}) as Partial<BjorliForecast>;
  return {
    source: typeof d.source === 'string' ? d.source : EMPTY_FORECAST.source,
    timeZone: typeof d.timeZone === 'string' ? d.timeZone : OSLO_TZ,
    fetchedAt: typeof d.fetchedAt === 'string' ? d.fetchedAt : null,
    hourlyFetchedAt: typeof d.hourlyFetchedAt === 'string' ? d.hourlyFetchedAt : null,
    dailyFetchedAt: typeof d.dailyFetchedAt === 'string' ? d.dailyFetchedAt : null,
    hours: Array.isArray(d.hours) ? d.hours : [],
    days: Array.isArray(d.days) ? d.days : [],
    stale: d.stale === true,
  };
}

// ---------------------------------------------------------------------------
// Formatting helpers (pure — unit tested)
// ---------------------------------------------------------------------------

export const EM_DASH = '—';

const intlLocale = (locale: string) =>
  ({ no: 'nb-NO', en: 'en-GB', de: 'de-DE', nl: 'nl-NL', da: 'da-DK', sv: 'sv-SE' })[locale] ??
  'nb-NO';

export function formatTemperature(v: number | null): string {
  return v === null ? `${EM_DASH}°C` : `${Math.round(v)}°C`;
}

export function formatWind(speed: number | null, gust: number | null): string {
  if (speed === null && gust === null) return `${EM_DASH} m/s`;
  const s = speed === null ? EM_DASH : String(Math.round(speed));
  if (gust === null) return `${s} m/s`;
  return `${s} (${Math.round(gust)}) m/s`;
}

// --------------------------------------------------------- wind direction

/** 8-point compass abbreviations, localised. Index 0 = north, clockwise. */
const COMPASS: Record<string, readonly string[]> = {
  no: ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV'],
  da: ['N', 'NØ', 'Ø', 'SØ', 'S', 'SV', 'V', 'NV'],
  sv: ['N', 'NO', 'O', 'SO', 'S', 'SV', 'V', 'NV'],
  en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  de: ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'],
  nl: ['N', 'NO', 'O', 'ZO', 'Z', 'ZW', 'W', 'NW'],
};

/** "comes from" preposition per locale. */
const FROM: Record<string, string> = {
  no: 'fra',
  da: 'fra',
  sv: 'från',
  en: 'from',
  de: 'aus',
  nl: 'uit',
};

/** Google cardinal enum -> degrees (16-point compass). */
const CARDINAL_DEGREES: Record<string, number> = {
  NORTH: 0,
  NORTH_NORTHEAST: 22.5,
  NORTHEAST: 45,
  EAST_NORTHEAST: 67.5,
  EAST: 90,
  EAST_SOUTHEAST: 112.5,
  SOUTHEAST: 135,
  SOUTH_SOUTHEAST: 157.5,
  SOUTH: 180,
  SOUTH_SOUTHWEST: 202.5,
  SOUTHWEST: 225,
  WEST_SOUTHWEST: 247.5,
  WEST: 270,
  WEST_NORTHWEST: 292.5,
  NORTHWEST: 315,
  NORTH_NORTHWEST: 337.5,
};

/**
 * Localised compass abbreviation for the direction the wind comes FROM.
 * Degrees win when present (0 is valid); the Google cardinal enum is the
 * fallback. Unknown / unspecified direction renders as an em dash.
 */
export function formatWindDirection(
  cardinal: string | null | undefined,
  degrees: number | null | undefined,
  locale: string,
): string {
  const points = COMPASS[locale] ?? COMPASS.no;
  let deg: number | null = null;
  if (typeof degrees === 'number' && Number.isFinite(degrees)) {
    deg = degrees;
  } else if (typeof cardinal === 'string') {
    const key = cardinal.toUpperCase();
    if (key in CARDINAL_DEGREES) deg = CARDINAL_DEGREES[key];
  }
  if (deg === null) return EM_DASH;
  const idx = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return points[idx];
}

/** e.g. "3 (7) m/s fra NV". Direction is where the wind comes from. */
export function formatWindWithDirection(
  speed: number | null,
  gust: number | null,
  cardinal: string | null | undefined,
  degrees: number | null | undefined,
  locale: string,
): string {
  const from = FROM[locale] ?? FROM.no;
  return `${formatWind(speed, gust)} ${from} ${formatWindDirection(cardinal, degrees, locale)}`;
}

/** Direction the wind blows TO, for a visual arrow. Text still describes FROM. */
export function windTargetDegrees(degrees: number | null | undefined): number | null {
  if (typeof degrees !== 'number' || !Number.isFinite(degrees)) return null;
  return (((degrees + 180) % 360) + 360) % 360;
}

export type WeatherSymbolKind =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm'
  | 'unknown';

/** Stable Google Weather condition enum -> local icon family. */
export function weatherSymbolKind(type: string | null | undefined): WeatherSymbolKind {
  const value = type?.toUpperCase() ?? '';
  if (!value || value === 'TYPE_UNSPECIFIED') return 'unknown';
  if (value.includes('THUNDER')) return 'storm';
  if (value.includes('SNOW') || value.includes('SLEET') || value.includes('ICE')) return 'snow';
  if (value.includes('RAIN') || value.includes('DRIZZLE') || value.includes('SHOWERS')) return 'rain';
  if (value.includes('FOG') || value.includes('HAZE') || value.includes('MIST')) return 'fog';
  if (value.includes('PARTLY') || value.includes('MOSTLY_CLEAR')) return 'partly-cloudy';
  if (value.includes('CLOUD') || value.includes('OVERCAST')) return 'cloudy';
  if (value.includes('CLEAR') || value.includes('SUNNY')) return 'clear';
  return 'unknown';
}



export function formatPrecipitation(v: number | null): string {
  if (v === null) return `${EM_DASH} mm`;
  return `${v < 1 && v > 0 ? v.toFixed(1) : Math.round(v)} mm`;
}

/** Hour label in Europe/Oslo, e.g. "14". */
export function formatHour(iso: string | null, locale: string): string {
  if (!iso) return EM_DASH;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return EM_DASH;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: '2-digit',
    timeZone: OSLO_TZ,
  }).format(d);
}

/** Short weekday label in Europe/Oslo, e.g. "man." */
export function formatWeekday(iso: string | null, locale: string): string {
  if (!iso) return EM_DASH;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return EM_DASH;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: OSLO_TZ,
  }).format(d);
}

/** Retrieval timestamp (date + time) in Europe/Oslo. */
export function formatFetchedAt(iso: string | null, locale: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: OSLO_TZ,
  }).format(d);
}

/** First forecast hour that is still in the future (or the first available). */
export function currentHour(forecast: BjorliForecast): WeatherHour | null {
  const now = Date.now();
  const upcoming = forecast.hours.find(
    (h) => h.startTime !== null && new Date(h.startTime).getTime() + 3_600_000 >= now,
  );
  return upcoming ?? forecast.hours[0] ?? null;
}

// ---------------------------------------------------------------------------
// Localised weather condition labels (from Google's stable condition enum)
// ---------------------------------------------------------------------------

export type ForecastLocale = 'no' | 'en' | 'de' | 'nl' | 'da' | 'sv';

const LOCALE_ORDER: ForecastLocale[] = ['no', 'en', 'de', 'nl', 'da', 'sv'];

/** [no, en, de, nl, da, sv] per Google `weatherCondition.type`. */
const CONDITION_LABELS: Record<string, readonly [string, string, string, string, string, string]> = {
  CLEAR: ['Klarvær', 'Clear', 'Klar', 'Helder', 'Klart vejr', 'Klart'],
  MOSTLY_CLEAR: ['Stort sett klart', 'Mostly clear', 'Überwiegend klar', 'Overwegend helder', 'Overvejende klart', 'Mestadels klart'],
  PARTLY_CLOUDY: ['Delvis skyet', 'Partly cloudy', 'Teilweise bewölkt', 'Halfbewolkt', 'Delvist skyet', 'Delvis molnigt'],
  MOSTLY_CLOUDY: ['Stort sett skyet', 'Mostly cloudy', 'Überwiegend bewölkt', 'Overwegend bewolkt', 'Overvejende skyet', 'Mestadels molnigt'],
  CLOUDY: ['Skyet', 'Cloudy', 'Bewölkt', 'Bewolkt', 'Skyet', 'Molnigt'],
  WINDY: ['Vindfullt', 'Windy', 'Windig', 'Winderig', 'Blæsende', 'Blåsigt'],
  WIND_AND_RAIN: ['Vind og regn', 'Wind and rain', 'Wind und Regen', 'Wind en regen', 'Vind og regn', 'Vind och regn'],
  LIGHT_RAIN_SHOWERS: ['Lette regnbyger', 'Light rain showers', 'Leichte Regenschauer', 'Lichte regenbuien', 'Lette regnbyger', 'Lätta regnskurar'],
  CHANCE_OF_SHOWERS: ['Mulighet for byger', 'Chance of showers', 'Schauer möglich', 'Kans op buien', 'Mulighed for byger', 'Risk för skurar'],
  SCATTERED_SHOWERS: ['Spredte byger', 'Scattered showers', 'Vereinzelte Schauer', 'Verspreide buien', 'Spredte byger', 'Spridda skurar'],
  RAIN_SHOWERS: ['Regnbyger', 'Rain showers', 'Regenschauer', 'Regenbuien', 'Regnbyger', 'Regnskurar'],
  HEAVY_RAIN_SHOWERS: ['Kraftige regnbyger', 'Heavy rain showers', 'Starke Regenschauer', 'Zware regenbuien', 'Kraftige regnbyger', 'Kraftiga regnskurar'],
  LIGHT_TO_MODERATE_RAIN: ['Lett til moderat regn', 'Light to moderate rain', 'Leichter bis mäßiger Regen', 'Lichte tot matige regen', 'Let til moderat regn', 'Lätt till måttligt regn'],
  MODERATE_TO_HEAVY_RAIN: ['Moderat til kraftig regn', 'Moderate to heavy rain', 'Mäßiger bis starker Regen', 'Matige tot zware regen', 'Moderat til kraftig regn', 'Måttligt till kraftigt regn'],
  RAIN: ['Regn', 'Rain', 'Regen', 'Regen', 'Regn', 'Regn'],
  LIGHT_RAIN: ['Lett regn', 'Light rain', 'Leichter Regen', 'Lichte regen', 'Let regn', 'Lätt regn'],
  HEAVY_RAIN: ['Kraftig regn', 'Heavy rain', 'Starker Regen', 'Zware regen', 'Kraftig regn', 'Kraftigt regn'],
  RAIN_PERIODICALLY_HEAVY: ['Regn, tidvis kraftig', 'Rain, periodically heavy', 'Regen, zeitweise stark', 'Regen, tijdelijk zwaar', 'Regn, tidvis kraftig', 'Regn, tidvis kraftigt'],
  LIGHT_SNOW_SHOWERS: ['Lette snøbyger', 'Light snow showers', 'Leichte Schneeschauer', 'Lichte sneeuwbuien', 'Lette snebyger', 'Lätta snöbyar'],
  CHANCE_OF_SNOW_SHOWERS: ['Mulighet for snøbyger', 'Chance of snow showers', 'Schneeschauer möglich', 'Kans op sneeuwbuien', 'Mulighed for snebyger', 'Risk för snöbyar'],
  SCATTERED_SNOW_SHOWERS: ['Spredte snøbyger', 'Scattered snow showers', 'Vereinzelte Schneeschauer', 'Verspreide sneeuwbuien', 'Spredte snebyger', 'Spridda snöbyar'],
  SNOW_SHOWERS: ['Snøbyger', 'Snow showers', 'Schneeschauer', 'Sneeuwbuien', 'Snebyger', 'Snöbyar'],
  HEAVY_SNOW_SHOWERS: ['Kraftige snøbyger', 'Heavy snow showers', 'Starke Schneeschauer', 'Zware sneeuwbuien', 'Kraftige snebyger', 'Kraftiga snöbyar'],
  LIGHT_TO_MODERATE_SNOW: ['Lett til moderat snø', 'Light to moderate snow', 'Leichter bis mäßiger Schneefall', 'Lichte tot matige sneeuw', 'Let til moderat sne', 'Lätt till måttligt snöfall'],
  MODERATE_TO_HEAVY_SNOW: ['Moderat til kraftig snø', 'Moderate to heavy snow', 'Mäßiger bis starker Schneefall', 'Matige tot zware sneeuw', 'Moderat til kraftig sne', 'Måttligt till kraftigt snöfall'],
  SNOW: ['Snø', 'Snow', 'Schnee', 'Sneeuw', 'Sne', 'Snö'],
  LIGHT_SNOW: ['Lett snø', 'Light snow', 'Leichter Schneefall', 'Lichte sneeuw', 'Let sne', 'Lätt snöfall'],
  HEAVY_SNOW: ['Kraftig snø', 'Heavy snow', 'Starker Schneefall', 'Zware sneeuw', 'Kraftig sne', 'Kraftigt snöfall'],
  SNOWSTORM: ['Snøstorm', 'Snowstorm', 'Schneesturm', 'Sneeuwstorm', 'Snestorm', 'Snöstorm'],
  SNOW_PERIODICALLY_HEAVY: ['Snø, tidvis kraftig', 'Snow, periodically heavy', 'Schnee, zeitweise stark', 'Sneeuw, tijdelijk zwaar', 'Sne, tidvis kraftig', 'Snö, tidvis kraftigt'],
  HEAVY_SNOW_STORM: ['Kraftig snøstorm', 'Heavy snowstorm', 'Schwerer Schneesturm', 'Zware sneeuwstorm', 'Kraftig snestorm', 'Kraftig snöstorm'],
  BLOWING_SNOW: ['Snøfokk', 'Blowing snow', 'Schneetreiben', 'Stuifsneeuw', 'Snefog', 'Snödrev'],
  RAIN_AND_SNOW: ['Sludd', 'Rain and snow', 'Schneeregen', 'Natte sneeuw', 'Slud', 'Snöblandat regn'],
  HAIL: ['Hagl', 'Hail', 'Hagel', 'Hagel', 'Hagl', 'Hagel'],
  HAIL_SHOWERS: ['Haglbyger', 'Hail showers', 'Hagelschauer', 'Hagelbuien', 'Haglbyger', 'Hagelskurar'],
  THUNDERSTORM: ['Tordenvær', 'Thunderstorm', 'Gewitter', 'Onweer', 'Tordenvejr', 'Åskväder'],
  THUNDERSHOWER: ['Tordenbyger', 'Thundershower', 'Gewitterschauer', 'Onweersbui', 'Tordenbyger', 'Åskskur'],
  LIGHT_THUNDERSTORM_RAIN: ['Lett tordenregn', 'Light thunderstorm rain', 'Leichter Gewitterregen', 'Lichte onweersregen', 'Let tordenregn', 'Lätt åskregn'],
  SCATTERED_THUNDERSTORMS: ['Spredte tordenbyger', 'Scattered thunderstorms', 'Vereinzelte Gewitter', 'Verspreide onweersbuien', 'Spredte tordenbyger', 'Spridda åskskurar'],
  HEAVY_THUNDERSTORM: ['Kraftig tordenvær', 'Heavy thunderstorm', 'Schweres Gewitter', 'Zwaar onweer', 'Kraftigt tordenvejr', 'Kraftigt åskväder'],
  FOG: ['Tåke', 'Fog', 'Nebel', 'Mist', 'Tåge', 'Dimma'],
  LIGHT_FOG: ['Lett tåke', 'Light fog', 'Leichter Nebel', 'Lichte mist', 'Let tåge', 'Lätt dimma'],
  HAZE: ['Dis', 'Haze', 'Dunst', 'Nevel', 'Dis', 'Dis'],
};

/**
 * Localised weather description for a Google condition type.
 * Falls back to the caller-supplied symbol name when the enum is unknown —
 * never to Google's English text.
 */
export function localizedCondition(
  type: string | null | undefined,
  locale: string,
  fallback: string,
): string {
  const key = type?.toUpperCase() ?? '';
  const row = CONDITION_LABELS[key];
  if (!row) return fallback;
  const idx = LOCALE_ORDER.indexOf((locale as ForecastLocale) ?? 'no');
  return row[idx === -1 ? 0 : idx];
}

// --------------------------------------------- full-word compass direction

/** 8-point compass, full words. Index 0 = north, clockwise. */
const COMPASS_LONG: Record<string, readonly string[]> = {
  no: ['nord', 'nordøst', 'øst', 'sørøst', 'sør', 'sørvest', 'vest', 'nordvest'],
  da: ['nord', 'nordøst', 'øst', 'sydøst', 'syd', 'sydvest', 'vest', 'nordvest'],
  sv: ['norr', 'nordost', 'öster', 'sydost', 'söder', 'sydväst', 'väster', 'nordväst'],
  en: ['the north', 'the north-east', 'the east', 'the south-east', 'the south', 'the south-west', 'the west', 'the north-west'],
  de: ['Norden', 'Nordosten', 'Osten', 'Südosten', 'Süden', 'Südwesten', 'Westen', 'Nordwesten'],
  nl: ['het noorden', 'het noordoosten', 'het oosten', 'het zuidoosten', 'het zuiden', 'het zuidwesten', 'het westen', 'het noordwesten'],
};

/** Full-word direction the wind comes FROM, e.g. "vest". Em dash when unknown. */
export function formatWindDirectionLong(
  cardinal: string | null | undefined,
  degrees: number | null | undefined,
  locale: string,
): string {
  const short = formatWindDirection(cardinal, degrees, locale);
  if (short === EM_DASH) return EM_DASH;
  const points = COMPASS[locale] ?? COMPASS.no;
  const idx = points.indexOf(short);
  const long = COMPASS_LONG[locale] ?? COMPASS_LONG.no;
  return idx === -1 ? short : long[idx];
}

/** Clock label for a forecast hour, e.g. "17.00" (no/da/sv) or "17:00". */
export function formatHourClock(iso: string | null, locale: string): string {
  const hour = formatHour(iso, locale);
  if (hour === EM_DASH) return EM_DASH;
  const separator = locale === 'no' || locale === 'da' || locale === 'sv' ? '.' : ':';
  return `${hour}${separator}00`;
}

/** The "comes from" preposition for the current locale, e.g. "fra". */
export function windFromWord(locale: string): string {
  return FROM[locale] ?? FROM.no;
}
