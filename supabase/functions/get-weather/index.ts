// Public weather endpoint for Bjorli — READ ONLY.
//
// This function never calls Google. It only reads the shared forecast that the
// scheduled `refresh-weather` function stores in `weather_snapshot`, so page
// views, navigation and polling can never trigger a Google request.
//
// Expired rows (Google EEA terms 23.3: 1 h hourly, 24 h daily) are dropped and
// reported as unavailable rather than served as values.

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const LATITUDE = 62.2654301;
const LONGITUDE = 8.2129572;

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 60;
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

interface Row {
  kind: string;
  payload: Record<string, unknown> | null;
  fetched_at: string | null;
  expires_at: string | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
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

  const db = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } },
  );

  const { data, error } = await db
    .from('weather_snapshot')
    .select('kind, payload, fetched_at, expires_at');

  if (error) {
    console.error(`weather_snapshot read failed: ${error.message}`);
    return new Response(JSON.stringify({ error: 'weather_unavailable' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rows = (data ?? []) as Row[];
  const now = Date.now();
  const valid = (r: Row | undefined) =>
    !!r?.payload && !!r.expires_at && new Date(r.expires_at).getTime() > now;

  const hourlyRow = rows.find((r) => r.kind === 'hourly');
  const dailyRow = rows.find((r) => r.kind === 'daily');
  const hourlyOk = valid(hourlyRow);
  const dailyOk = valid(dailyRow);

  const hours = hourlyOk ? ((hourlyRow!.payload!.hours as unknown[]) ?? []) : [];
  const days = dailyOk ? ((dailyRow!.payload!.days as unknown[]) ?? []) : [];

  // Only future hours — never pad the timeline with assumed values.
  const futureHours = (hours as { startTime: string | null }[]).filter(
    (h) => h.startTime !== null && new Date(h.startTime).getTime() + 3_600_000 >= now,
  );

  const body = JSON.stringify({
    location: { latitude: LATITUDE, longitude: LONGITUDE, label: 'base' },
    timeZone: 'Europe/Oslo',
    source: 'Google Weather API',
    fetchedAt: hourlyOk ? hourlyRow!.fetched_at : (dailyOk ? dailyRow!.fetched_at : null),
    hourlyFetchedAt: hourlyOk ? hourlyRow!.fetched_at : null,
    dailyFetchedAt: dailyOk ? dailyRow!.fetched_at : null,
    hours: futureHours,
    days,
    // A missed scheduled refresh: part of the data expired and was dropped.
    stale: !hourlyOk || !dailyOk,
  });

  return new Response(body, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=120, s-maxage=300',
    },
  });
});
