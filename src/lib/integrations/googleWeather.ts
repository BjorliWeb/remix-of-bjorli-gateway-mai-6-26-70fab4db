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

export interface WeatherHour {
  startTime: string | null;
  temperatureC: number | null;
  speedMs: number | null;
  gustMs: number | null;
  precipitationMm: number | null;
  precipitationProbability: number | null;
  condition: string | null;
}

export interface WeatherDay {
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
