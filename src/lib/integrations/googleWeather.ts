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
}

export interface BjorliForecast {
  source: string;
  timeZone: string;
  /** When the server last retrieved data from Google (not forecast validity). */
  fetchedAt: string | null;
  hours: WeatherHour[];
  days: WeatherDay[];
  /** True when the server had to serve a cached copy after an upstream error. */
  stale: boolean;
}

export const EMPTY_FORECAST: BjorliForecast = {
  source: 'Google Weather API',
  timeZone: 'Europe/Oslo',
  fetchedAt: null,
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
