// Scheduled Google Weather refresh for Bjorli — the ONLY place that calls Google.
//
// Cost / terms posture:
// - Hourly forecast values may be cached for max 1 hour (Google EEA terms 23.3).
// - Daily forecast values may be cached for max 24 hours (same clause).
// - Hourly data is refreshed once an hour; daily data at 07:00, 12:00 and 19:00
//   Europe/Oslo. Expected normal usage: 24 + 3 = 27 Google calls per day.
// - A row-level lock is taken BEFORE the Google call, so a duplicate or
//   overlapping trigger never produces a second call.
// - Expired data is deleted, also when the refresh fails, so the site shows an
//   "unavailable" state instead of stale values.

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-weather-refresh-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** Owner-confirmed Bjorli base point (Google Maps). Do not parameterise. */
const LATITUDE = 62.2654301;
const LONGITUDE = 8.2129572;

const HOURS = 24;
const DAYS = 7;

/** Google EEA terms 23.3 caching windows. */
const HOURLY_TTL_MS = 60 * 60_000;
const DAILY_TTL_MS = 24 * 60 * 60_000;

/** Don't re-fetch when fresh data already exists (duplicate protection). */
const HOURLY_MIN_AGE_MS = 50 * 60_000;
const DAILY_MIN_AGE_MS = 4 * 60 * 60_000;

const LOCK_TIMEOUT_MS = 5 * 60_000;

type Num = number | null;
type Rec = Record<string, unknown>;

const num = (v: unknown): Num => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const obj = (v: unknown): Rec => (v && typeof v === 'object' ? (v as Rec) : {});

function toMetersPerSecond(value: unknown, unit: unknown): Num {
  const n = num(value);
  if (n === null) return null;
  const u = typeof unit === 'string' ? unit.toUpperCase() : '';
  if (u === 'METERS_PER_SECOND') return n;
  if (u === 'KILOMETERS_PER_HOUR' || u === '') return n / 3.6;
  if (u === 'MILES_PER_HOUR') return n * 0.44704;
  return null;
}

function toMillimeters(value: unknown, unit: unknown): Num {
  const n = num(value);
  if (n === null) return null;
  const u = typeof unit === 'string' ? unit.toUpperCase() : '';
  if (u === 'MILLIMETERS' || u === '') return n;
  if (u === 'INCHES') return n * 25.4;
  return null;
}

function mapWind(w: unknown) {
  const wind = obj(w);
  const speed = obj(wind.speed);
  const gust = obj(wind.gust);
  const direction = obj(wind.direction);
  return {
    speedMs: toMetersPerSecond(speed.value, speed.unit),
    gustMs: toMetersPerSecond(gust.value, gust.unit),
    // 0 degrees is valid (northerly) — never a truthiness check.
    windDirectionDegrees: num(direction.degrees),
    windDirectionCardinal:
      typeof direction.cardinal === 'string' && direction.cardinal.length > 0
        ? direction.cardinal
        : null,
  };
}

function mapPrecip(p: unknown) {
  const precip = obj(p);
  const qpf = obj(precip.qpf);
  const probability = obj(precip.probability);
  return {
    precipitationMm: toMillimeters(qpf.quantity, qpf.unit),
    precipitationProbability: num(probability.percent),
  };
}

function mapCondition(c: unknown) {
  const cond = obj(c);
  const desc = obj(cond.description);
  return {
    condition: typeof desc.text === 'string' && desc.text.length > 0 ? desc.text : null,
    conditionType: typeof cond.type === 'string' && cond.type.length > 0 ? cond.type : null,
    conditionIconBaseUri:
      typeof cond.iconBaseUri === 'string' && cond.iconBaseUri.length > 0
        ? cond.iconBaseUri
        : null,
  };
}

function mapHour(h: unknown) {
  const hour = obj(h);
  const interval = obj(hour.interval);
  const temp = obj(hour.temperature);
  return {
    startTime: typeof interval.startTime === 'string' ? interval.startTime : null,
    temperatureC: num(temp.degrees),
    ...mapWind(hour.wind),
    ...mapPrecip(hour.precipitation),
    ...mapCondition(hour.weatherCondition),
    isDaytime: typeof hour.isDaytime === 'boolean' ? hour.isDaytime : null,
  };
}

function mapDay(d: unknown) {
  const day = obj(d);
  const interval = obj(day.interval);
  const dd = obj(day.displayDate);
  const daytime = obj(day.daytimeForecast);
  const maxT = obj(day.maxTemperature);
  const minT = obj(day.minTemperature);
  const y = num(dd.year);
  const m = num(dd.month);
  const dnum = num(dd.day);
  return {
    date:
      y !== null && m !== null && dnum !== null
        ? `${y}-${String(m).padStart(2, '0')}-${String(dnum).padStart(2, '0')}`
        : null,
    startTime: typeof interval.startTime === 'string' ? interval.startTime : null,
    maxTemperatureC: num(maxT.degrees),
    minTemperatureC: num(minT.degrees),
    ...mapWind(daytime.wind),
    ...mapPrecip(daytime.precipitation),
    ...mapCondition(daytime.weatherCondition),
    isDaytime: typeof daytime.isDaytime === 'boolean' ? daytime.isDaytime : true,
  };
}

async function googleGet(path: string, key: string, extra: Record<string, string>) {
  const url = new URL(`https://weather.googleapis.com/v1/${path}`);
  url.searchParams.set('key', key);
  url.searchParams.set('location.latitude', String(LATITUDE));
  url.searchParams.set('location.longitude', String(LONGITUDE));
  url.searchParams.set('unitsSystem', 'METRIC');
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    const text = await res.text();
    // Never log the URL (it carries the key).
    console.error(`Google Weather ${path} failed [${res.status}]: ${text.slice(0, 500)}`);
    throw new Error(`weather_upstream_${res.status}`);
  }
  return (await res.json()) as Rec;
}

const admin = () =>
  createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } },
  );

/** True when this invocation won the lock and should call Google. */
async function acquire(
  db: ReturnType<typeof admin>,
  kind: 'hourly' | 'daily',
  minAgeMs: number,
): Promise<boolean> {
  const now = Date.now();
  const staleBefore = new Date(now - minAgeMs).toISOString();
  const lockExpired = new Date(now - LOCK_TIMEOUT_MS).toISOString();

  const { data, error } = await db
    .from('weather_snapshot')
    .update({ locked_at: new Date(now).toISOString() })
    .eq('kind', kind)
    // One combined OR expression: repeated .or() calls are not reliably ANDed.
    .or(
      [
        `and(fetched_at.is.null,locked_at.is.null)`,
        `and(fetched_at.is.null,locked_at.lt.${lockExpired})`,
        `and(fetched_at.lt.${staleBefore},locked_at.is.null)`,
        `and(fetched_at.lt.${staleBefore},locked_at.lt.${lockExpired})`,
      ].join(','),
    )
    .select('kind');

  if (error) throw new Error(`lock_failed: ${error.message}`);
  return Array.isArray(data) && data.length > 0;
}

async function refresh(kind: 'hourly' | 'daily', key: string) {
  const db = admin();
  const minAge = kind === 'hourly' ? HOURLY_MIN_AGE_MS : DAILY_MIN_AGE_MS;

  if (!(await acquire(db, kind, minAge))) {
    return { kind, skipped: true, reason: 'fresh_or_locked', googleCalls: 0 };
  }

  let attempts = 0;
  let lastError: unknown = null;

  // One retry only — never an open-ended loop.
  while (attempts < 2) {
    attempts += 1;
    try {
      const payload =
        kind === 'hourly'
          ? {
              hours: (
                (await googleGet('forecast/hours:lookup', key, {
                  hours: String(HOURS),
                  pageSize: String(HOURS),
                }).then((r) => r.forecastHours)) as unknown[] | undefined ?? []
              )
                .slice(0, HOURS)
                .map(mapHour),
            }
          : {
              days: (
                (await googleGet('forecast/days:lookup', key, {
                  days: String(DAYS),
                  pageSize: String(DAYS),
                }).then((r) => r.forecastDays)) as unknown[] | undefined ?? []
              )
                .slice(0, DAYS)
                .map(mapDay),
            };

      const fetchedAt = new Date();
      const ttl = kind === 'hourly' ? HOURLY_TTL_MS : DAILY_TTL_MS;
      const { error } = await db
        .from('weather_snapshot')
        .update({
          payload,
          fetched_at: fetchedAt.toISOString(),
          expires_at: new Date(fetchedAt.getTime() + ttl).toISOString(),
          error_count: 0,
          last_error: null,
          locked_at: null,
          updated_at: fetchedAt.toISOString(),
        })
        .eq('kind', kind);
      if (error) throw new Error(`store_failed: ${error.message}`);

      return { kind, skipped: false, googleCalls: attempts, retries: attempts - 1 };
    } catch (e) {
      lastError = e;
    }
  }

  // Failure: drop expired data so the UI reports "unavailable" instead of
  // showing values Google no longer allows us to cache.
  const message = lastError instanceof Error ? lastError.message : 'weather_failed';
  const { data: row } = await db
    .from('weather_snapshot')
    .select('expires_at, error_count')
    .eq('kind', kind)
    .maybeSingle();
  const expired =
    !row?.expires_at || new Date(row.expires_at as string).getTime() <= Date.now();

  await db
    .from('weather_snapshot')
    .update({
      ...(expired ? { payload: null, fetched_at: null, expires_at: null } : {}),
      error_count: ((row?.error_count as number) ?? 0) + 1,
      last_error: message.slice(0, 200),
      locked_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('kind', kind);

  console.error(`refresh-weather ${kind} failed after ${attempts} attempts: ${message}`);
  return { kind, skipped: false, failed: true, error: message, googleCalls: attempts, retries: attempts - 1 };
}

/** Oslo local hour, DST-correct. */
function osloHour(at: Date): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'Europe/Oslo',
    }).format(at),
  );
}

const DAILY_HOURS = [7, 12, 19];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Access control: either the shared refresh token, or a one-time ticket that
  // the scheduled database job rotates right before calling this function.
  const presented = req.headers.get('x-weather-refresh-token') ?? '';
  const expected = Deno.env.get('WEATHER_REFRESH_TOKEN');
  let allowed = !!expected && presented === expected;
  if (!allowed && presented) {
    const db = admin();
    const { data: ticket } = await db
      .from('weather_refresh_ticket')
      .select('token, created_at')
      .eq('id', true)
      .maybeSingle();
    const fresh =
      !!ticket?.created_at &&
      Date.now() - new Date(ticket.created_at as string).getTime() < 120_000;
    if (fresh && ticket?.token === presented) {
      allowed = true;
      // Consume the ticket so it cannot be replayed.
      await db
        .from('weather_refresh_ticket')
        .update({ token: crypto.randomUUID(), created_at: new Date(0).toISOString() })
        .eq('id', true);
    }
  }
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'forbidden' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const key = Deno.env.get('GOOGLE_WEATHER_API_KEY');
  if (!key) {
    console.error('GOOGLE_WEATHER_API_KEY is not configured');
    return new Response(JSON.stringify({ error: 'weather_not_configured' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: Rec = {};
  try {
    body = obj(await req.json());
  } catch {
    body = {};
  }

  const hour = osloHour(new Date());
  const wantHourly = body.kind === 'hourly' || body.kind === undefined || body.kind === 'auto';
  const wantDaily =
    body.kind === 'daily' ||
    ((body.kind === undefined || body.kind === 'auto') && DAILY_HOURS.includes(hour));

  const results = [];
  if (wantHourly) results.push(await refresh('hourly', key));
  if (wantDaily) results.push(await refresh('daily', key));

  return new Response(JSON.stringify({ osloHour: hour, results }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
