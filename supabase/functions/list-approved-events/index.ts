// Public read-only listing of approved event submissions.
//
// Security posture:
// - Column allowlist is enforced in code below. Private columns
//   (email, phone, contact_name, editor_notes, reviewed_by, reviewed_at,
//   upload_token, consent_*, ai_quality_notes) are never selected and
//   never mapped into the response. RLS on event_submissions stays
//   admin-only (R-05/R-06). This function uses the service role to read
//   only the safe subset.
// - Images: raw storage paths are never returned. Signed URLs are minted
//   against the private `event-submissions` bucket (R-06 kept intact).
// - Abuse protection: 60s in-memory response cache keyed by language, and
//   a per-IP token bucket (10 req / 60s). This function is reachable
//   directly at *.functions.supabase.co, bypassing any Cloudflare rules,
//   so throttling MUST live here.

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

const PUBLIC_COLUMNS = [
  'id',
  'title',
  'summary',
  'description',
  'organizer',
  'category',
  'language',
  'start_date',
  'end_date',
  'time_text',
  'location',
  'maps_url',
  'website',
  'image_urls',
  // Email gating: read email + flag from DB, then decide in the mapper
  // whether email appears in the JSON response. Never spread the row.
  'email',
  'show_email_public',
] as const;

type Row = Record<string, unknown> & {
  id: string;
  title: string;
  language: string;
  start_date: string;
  end_date: string | null;
  image_urls: string[] | null;
  email: string | null;
  show_email_public: boolean | null;
};

const CACHE_TTL_MS = 60_000;
type CacheEntry = { at: number; body: string };
const cache = new Map<string, CacheEntry>();

// Token bucket: 10 requests / 60s per IP. Cleared opportunistically.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;
const buckets = new Map<string, { count: number; windowStart: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now - b.windowStart > RATE_WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now });
    if (buckets.size > 5000) {
      // Bound memory in the isolate.
      for (const [k, v] of buckets) {
        if (now - v.windowStart > RATE_WINDOW_MS) buckets.delete(k);
      }
    }
    return false;
  }
  b.count += 1;
  return b.count > RATE_MAX;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'event';
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
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

  // Language param: accept via query string OR JSON body { language }.
  const url = new URL(req.url);
  let lang = url.searchParams.get('language') ?? '';
  let slug = url.searchParams.get('slug') ?? '';
  if (!lang && req.method === 'POST') {
    try {
      const j = await req.json();
      if (j && typeof j.language === 'string') lang = j.language;
      if (j && typeof (j as { slug?: unknown }).slug === 'string') {
        slug = (j as { slug: string }).slug;
      }
    } catch {
      /* ignore */
    }
  }
  if (!lang) lang = 'no';
  if (!/^[a-z]{2}$/.test(lang)) {
    return new Response(JSON.stringify({ error: 'invalid language' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  // Slug format: slugify(title)-<8 hex chars of id>. Reject anything else
  // to keep the cache key surface small and avoid oracle-y probes.
  if (slug && !/^[a-z0-9-]{1,120}$/.test(slug)) {
    return new Response(JSON.stringify({ error: 'invalid slug' }), {
      status: 400,
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
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    });
  }

  const cacheKey = slug ? `${lang}|slug:${slug}` : `${lang}|list`;
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && now - cached.at < CACHE_TTL_MS) {
    return new Response(cached.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=30, s-maxage=60',
        'X-Cache': 'HIT',
      },
    });
  }

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const today = todayIso();
  const { data, error } = await supabase
    .from('event_submissions')
    .select(PUBLIC_COLUMNS.join(','))
    .eq('status', 'approved')
    .eq('language', lang)
    // Visible through end_date; when end_date null, visible through start_date.
    .or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`)
    .order('start_date', { ascending: true })
    .limit(100);

  if (error) {
    // Log the error object only (no row data — rows contain email).
    console.error('list-approved-events select failed', error.message);
    return new Response(
      JSON.stringify({ error: 'query failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  const rows = (data ?? []) as unknown as Row[];

  // Mapper is the ONLY exit path for row data. It never spreads the row and
  // only sets `email` when show_email_public===true.
  const toPublicEvent = async (r: Row) => {
      const paths = Array.isArray(r.image_urls) ? r.image_urls : [];
      let signed: string[] = [];
      if (paths.length > 0) {
        const { data: s } = await supabase.storage
          .from('event-submissions')
          .createSignedUrls(paths, 3600);
        signed = (s ?? [])
          .map((x) => x.signedUrl)
          .filter((u): u is string => Boolean(u));
      }
      // Explicit whitelist of what leaves this function.
      const out: Record<string, unknown> = {
        id: r.id,
        slug: `${slugify(String(r.title))}-${String(r.id).slice(0, 8)}`,
        title: r.title,
        summary: (r as Row).summary ?? null,
        description: (r as Row).description ?? null,
        organizer: (r as Row).organizer ?? null,
        category: (r as Row).category ?? null,
        language: r.language,
        start_date: r.start_date,
        end_date: r.end_date,
        time_text: (r as Row).time_text ?? null,
        location: (r as Row).location ?? null,
        maps_url: (r as Row).maps_url ?? null,
        website: (r as Row).website ?? null,
        image_signed_urls: signed,
      };
      // Email gate — enforced in code, not just in the UI.
      if (r.show_email_public === true && typeof r.email === 'string' && r.email.length > 0) {
        out.email = r.email;
      }
      // TEMP DEBUG: expose read-back values so we can diagnose the gate.
      out.__debug_show_email_public = r.show_email_public;
      out.__debug_has_email = typeof r.email === 'string';
      return out;
  };

  let body: string;
  let status = 200;
  if (slug) {
    // Single-event lookup: find the row whose derived slug matches.
    const match = rows.find(
      (r) => `${slugify(String(r.title))}-${String(r.id).slice(0, 8)}` === slug,
    );
    if (!match) {
      // 404 is not cached (short-lived; slug typos shouldn't poison the cache).
      return new Response(JSON.stringify({ error: 'not found' }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }
    const event = await toPublicEvent(match);
    body = JSON.stringify({ event });
  } else {
    const events = await Promise.all(rows.map(toPublicEvent));
    body = JSON.stringify({ events });
  }
  cache.set(cacheKey, { at: now, body });

  return new Response(body, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, s-maxage=60',
      'X-Cache': 'MISS',
    },
  });
});