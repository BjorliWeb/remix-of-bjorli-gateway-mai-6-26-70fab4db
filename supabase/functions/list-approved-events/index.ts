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
// - Public image links live 600 s (editors keep 3 600 s in the admin UI).
//   When a link has expired in an open page, the browser asks once for a new
//   one via POST { refresh_images: [{ id, index }] }. That path is never
//   cached, re-reads the row, and signs only images of events that are still
//   approved (see _shared/eventImageRefresh.ts). It has its own per-IP bucket.

import { createClient } from 'npm:@supabase/supabase-js@2';
import { includeForLanguage, publicEventText } from '../_shared/publicEventText.ts';
import {
  alignSignedUrls,
  parseRefreshRequest,
  PUBLIC_IMAGE_TTL_S,
  resolveRefreshTargets,
} from '../_shared/eventImageRefresh.ts';
import { safeHttpUrl } from '../_shared/httpUrl.ts';

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
  'categories',
  'language',
  'start_date',
  'end_date',
  'time_text',
  'location',
  'maps_url',
  'website',
  // Optional action links (requires migration 0005).
  'ticket_url',
  'registration_url',
  'image_urls',
  // Email gating: read email + flag from DB, then decide in the mapper
  // whether email appears in the JSON response. Never spread the row.
  'email',
  'show_email_public',
  // English version: only used when english_approved (see publicEventText).
  'english_draft_title',
  'english_draft_summary',
  'english_draft_description',
  'english_approved',
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
// Image renewals: separate bucket so a long-open page cannot starve listings.
// The client batches up to 12 images per request, so 20/min is generous.
const REFRESH_RATE_MAX = 20;

function rateLimited(key: string, max = RATE_MAX): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.windowStart > RATE_WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    if (buckets.size > 5000) {
      // Bound memory in the isolate.
      for (const [k, v] of buckets) {
        if (now - v.windowStart > RATE_WINDOW_MS) buckets.delete(k);
      }
    }
    return false;
  }
  b.count += 1;
  return b.count > max;
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
  // scope=all also returns finished (archived) approved events so archive
  // pages keep resolving; default stays current-only for old clients.
  let scope = url.searchParams.get('scope') === 'all' ? 'all' : 'current';
  let refreshRaw: unknown = undefined;
  if (req.method === 'POST') {
    try {
      const j = await req.json();
      if (j && typeof j === 'object' && 'refresh_images' in j) {
        refreshRaw = (j as { refresh_images: unknown }).refresh_images;
      }
      if (!lang && j && typeof j.language === 'string') lang = j.language;
      if (j && (j as { scope?: unknown }).scope === 'all') scope = 'all';
      if (j && typeof (j as { slug?: unknown }).slug === 'string') {
        slug = (j as { slug: string }).slug;
      }
    } catch {
      /* ignore */
    }
  }
  const ip =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';

  if (refreshRaw !== undefined) {
    return await refreshImages(refreshRaw, ip);
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

  const cacheKey = slug ? `${lang}|${scope}|slug:${slug}` : `${lang}|${scope}|list`;
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

  const supabase = serviceClient();

  const today = todayIso();
  const runSelect = (columns: readonly string[]) => {
    let query = supabase
      .from('event_submissions')
      .select(columns.join(','))
      .eq('status', 'approved')
      // English also lists Norwegian events that have an approved English text.
      .in('language', lang === 'en' ? ['en', 'no'] : [lang]);
    if (scope === 'current') {
      // Visible through end_date; when end_date null, visible through start_date.
      query = query.or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`);
    }
    return query
      .order('start_date', { ascending: true })
      .limit(scope === 'all' ? 300 : 100);
  };
  let { data, error } = await runSelect(PUBLIC_COLUMNS);
  if (error?.code === '42703') {
    // Undefined column: this function was deployed before migration 0005.
    // Keep listings working without the optional action links.
    console.error('list-approved-events: action link columns missing, serving without them');
    ({ data, error } = await runSelect(
      PUBLIC_COLUMNS.filter((c) => c !== 'ticket_url' && c !== 'registration_url'),
    ));
  }

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

  const rows = ((data ?? []) as unknown as Row[]).filter((r) =>
    includeForLanguage(r as never, lang),
  );

  // Mapper is the ONLY exit path for row data. It never spreads the row and
  // only sets `email` when show_email_public===true.
  const toPublicEvent = async (r: Row) => {
      const paths = Array.isArray(r.image_urls) ? r.image_urls : [];
      let signed: string[] = [];
      let signedIdx: number[] = [];
      if (paths.length > 0) {
        const { data: s } = await supabase.storage
          .from('event-submissions')
          // 10 min: limits reuse of public links after an event is withdrawn.
          .createSignedUrls(paths, PUBLIC_IMAGE_TTL_S);
        ({ urls: signed, indexes: signedIdx } = alignSignedUrls(s ?? []));
      }
      const text = publicEventText(r as never, lang);
      // Explicit whitelist of what leaves this function.
      const out: Record<string, unknown> = {
        id: r.id,
        slug: `${slugify(String(r.title))}-${String(r.id).slice(0, 8)}`,
        title: text.title,
        summary: text.summary,
        description: text.description,
        organizer: (r as Row).organizer ?? null,
        category: (r as Row).category ?? null,
        categories: Array.isArray((r as Row).categories) ? (r as Row).categories : [],
        // Public language of this entry (an approved English version is 'en').
        language: lang,
        start_date: r.start_date,
        end_date: r.end_date,
        time_text: (r as Row).time_text ?? null,
        location: (r as Row).location ?? null,
        maps_url: (r as Row).maps_url ?? null,
        website: (r as Row).website ?? null,
        // Only safe http(s) links leave the function; anything else is null.
        ticket_url: safeHttpUrl((r as Row).ticket_url) ?? null,
        registration_url: safeHttpUrl((r as Row).registration_url) ?? null,
        image_signed_urls: signed,
        // Position of each signed URL in the event's image list, so an
        // expired link can be renewed by (id, index) without a storage path.
        image_indexes: signedIdx,
      };
      // Email gate — enforced in code, not just in the UI.
      if (r.show_email_public === true && typeof r.email === 'string' && r.email.length > 0) {
        out.email = r.email;
      }
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
function serviceClient() {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Renew expired public image links. Never cached: publication status is read
 * from the database on every call, so stale client data cannot revive an
 * unpublished event's images. Unknown, unpublished and rejected events are
 * indistinguishable in the response (the item is simply missing).
 */
async function refreshImages(raw: unknown, ip: string): Promise<Response> {
  const json = (body: unknown, status: number, extra: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...extra,
      },
    });

  if (rateLimited(`refresh|${ip}`, REFRESH_RATE_MAX)) {
    return json({ error: 'rate limited' }, 429, { 'Retry-After': '60' });
  }
  const items = parseRefreshRequest(raw);
  if (!items) return json({ error: 'invalid refresh request' }, 400);

  const supabase = serviceClient();
  const ids = [...new Set(items.map((i) => i.id))];
  const { data, error } = await supabase
    .from('event_submissions')
    .select('id,status,image_urls')
    .in('id', ids)
    .eq('status', 'approved');
  if (error) {
    console.error('list-approved-events refresh select failed', error.message);
    return json({ error: 'query failed' }, 500);
  }

  const targets = resolveRefreshTargets(items, (data ?? []) as never);
  if (targets.length === 0) return json({ images: [] }, 200);

  const { data: s, error: signErr } = await supabase.storage
    .from('event-submissions')
    .createSignedUrls(targets.map((t) => t.path), PUBLIC_IMAGE_TTL_S);
  if (signErr) {
    console.error('list-approved-events refresh sign failed', signErr.message);
    return json({ error: 'sign failed' }, 500);
  }
  const images = targets.flatMap((t, i) => {
    const signedUrl = s?.[i]?.signedUrl;
    return signedUrl ? [{ id: t.id, index: t.index, url: signedUrl }] : [];
  });
  return json({ images }, 200);
}
