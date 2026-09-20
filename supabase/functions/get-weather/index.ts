// Google Weather API proxy for Bjorli — fixed base point only.
//
// Security / cost posture (mirrors list-approved-events):
// - The API key never leaves the server. It is read from the
//   GOOGLE_WEATHER_API_KEY backend secret.
// - The endpoint is hard-locked to the owner-confirmed base coordinates.
//   No caller-supplied location, radius or free-form parameters.
// - 15 minute in-memory response cache (Google allows temporary caching of
//   forecast content; we also send the source + fetch time to the client so
//   the UI can label the data honestly).
// - Per-IP token bucket, since *.functions.supabase.co is reachable directly.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

/** Owner-confirmed Bjorli base point (Google Maps). Do not parameterise. */
const LATITUDE = 62.2654301;
const LONGITUDE = 8.2129572;

const HOURS = 24;
const DAYS = 7;

const CACHE_TTL_MS = 15 * 60_000;
let cache: { at: number; body: string } | null = null;

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const buckets = new Map<string, { count: number; windowStart: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.windowStart > RATE_WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) {
        if (now - v.windowStart > RATE_WINDOW_MS) buckets.delete(k);
      }
    }
    return false;
  }
  b.count += 1;
  return b.count > RATE_MAX;
}

// ---------------------------------------------------------------------------
// Normalisation — every missing value becomes null, never 0.
// ---------------------------------------------------------------------------

type Num = number | null;

const num = (v: unknown): Num =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

/** Google returns KILOMETERS_PER_HOUR under METRIC. Normalise to m/s. */
function toMetersPerSecond(value: unknown, unit: unknown): Num {
  const n = num(value);
  if (n === null) return null;
  const u = typeof unit === 'string' ? unit.toUpperCase() : '';
  if (u === 'METERS_PER_SECOND') return n;
  if (u === 'KILOMETERS_PER_HOUR' || u === '') return n / 3.6;
  if (u === 'MILES_PER_HOUR') return n * 0.44704;
  return null;
}

/** Precipitation QPF. METRIC => MILLIMETERS. */
function toMillimeters(value: unknown, unit: unknown): Num {
  const n = num(value);
  if (n === null) return null;
  const u = typeof unit === 'string' ? unit.toUpperCase() : '';
  if (u === 'MILLIMETERS' || u === '') return n;
  if (u === 'INCHES') return n * 25.4;
  return null;
}

type Rec = Record<string, unknown>;
const obj = (v: unknown): Rec => (v && typeof v === 'object' ? (v as Rec) : {});

function mapWind(w: unknown) {
  const wind = obj(w);
  const speed = obj(wind.speed);
  const gust = obj(wind.gust);
  const direction = obj(wind.direction);
  const cardinal =
    typeof direction.cardinal === 'string' && direction.cardinal.length > 0
      ? direction.cardinal
      : null;
  return {
    speedMs: toMetersPerSecond(speed.value, speed.unit),
    gustMs: toMetersPerSecond(gust.value, gust.unit),
    // Direction the wind comes FROM. 0 is a valid (northerly) value, so this
    // must stay `num()` — never a truthiness check.
    windDirectionDegrees: num(direction.degrees),
    windDirectionCardinal: cardinal,
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
  const date =
    y !== null && m !== null && dnum !== null
      ? `${y}-${String(m).padStart(2, '0')}-${String(dnum).padStart(2, '0')}`
      : null;
  return {
    date,
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const ip =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'rate limited' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }

  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL_MS) {
    return new Response(cache.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=900',
        'X-Cache': 'HIT',
      },
    });
  }

  const key = Deno.env.get('GOOGLE_WEATHER_API_KEY');
  if (!key) {
    console.error('GOOGLE_WEATHER_API_KEY is not configured');
    return new Response(
      JSON.stringify({ error: 'weather_not_configured' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const [hourly, daily] = await Promise.all([
      googleGet('forecast/hours:lookup', key, { hours: String(HOURS), pageSize: String(HOURS) }),
      googleGet('forecast/days:lookup', key, { days: String(DAYS), pageSize: String(DAYS) }),
    ]);

    const hours = Array.isArray(hourly.forecastHours)
      ? (hourly.forecastHours as unknown[]).slice(0, HOURS).map(mapHour)
      : [];
    const days = Array.isArray(daily.forecastDays)
      ? (daily.forecastDays as unknown[]).slice(0, DAYS).map(mapDay)
      : [];

    const body = JSON.stringify({
      location: { latitude: LATITUDE, longitude: LONGITUDE, label: 'base' },
      timeZone: 'Europe/Oslo',
      source: 'Google Weather API',
      fetchedAt: new Date(now).toISOString(),
      hours,
      days,
    });
    cache = { at: now, body };

    return new Response(body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=900',
        'X-Cache': 'MISS',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'weather_failed';
    // Serve stale cache rather than nothing, clearly marked.
    if (cache) {
      const stale = { ...JSON.parse(cache.body), stale: true };
      return new Response(JSON.stringify(stale), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'STALE' },
      });
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
