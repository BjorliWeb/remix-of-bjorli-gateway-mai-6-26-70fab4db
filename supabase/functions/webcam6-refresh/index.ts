// Scheduled webcam 6 refresh (webcam.io P4dKmP, Reolink Duo, two lenses).
//
// Runs every 5 minutes from pg_cron. Only the left lens (chair-lift roof top-left,
// mast near centre) may be published. Anything else — wrong lens, uncertain score,
// unknown source format, network error — keeps the previously approved image.
//
// Access: caller must present the refresh token stored in the private
// webcam6_state row (read by pg_cron inside the database).

import { createClient } from 'npm:@supabase/supabase-js@2';
import jpeg from 'npm:jpeg-js@0.4.4';
import { classify, extractFeatures } from './lensFilter.ts';
import { LEFT_TEMPLATE, RIGHT_TEMPLATE } from './templates.ts';

const WEBCAM_ID = 'P4dKmP';
const BUCKET = 'webcam6';
const LOCK_TIMEOUT_MS = 4 * 60_000;
const LOOKBACK_MS = 3 * 60 * 60_000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const URL_RE = /^https:\/\/assets\d+\.webcam\.io\/w\d+\/P4dKmP\/(\d{8})\/(\d{6})-[0-9a-f]{6}\.jpg$/;
const KEY_RE = /^(\d{8})\/(\d{6})-[0-9a-f]{6}$/;
const LOCAL_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const osloLocal = (d: Date) => {
  // "yyyy-mm-dd hh:mm:ss" wall-clock time in Europe/Oslo at instant d
  const s = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Oslo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).format(d);
  // dd/mm/yyyy, hh:mm:ss
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]} ${m[4]}:${m[5]}:${m[6]}` : '';
};

const b64 = (s: string) => btoa(s);

interface SourceImage { url: string; key: string; localTime: string }

/** Fetch the newest frame from webcam.io's image list. Throws on unknown format. */
async function fetchNewestSource(): Promise<SourceImage> {
  const now = new Date();
  // The API takes base64 timestamps; we send UTC to avoid DST ambiguity.
  const utc = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19) + ' +0000';
  const from = encodeURIComponent(b64(utc(new Date(now.getTime() - LOOKBACK_MS))));
  const to = encodeURIComponent(b64(utc(new Date(now.getTime() + 5 * 60_000))));
  const res = await fetch(
    `https://webcam.io/api/webcams/${WEBCAM_ID}/images.json?from=${from}&mode=0&to=${to}`,
    { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(15_000) },
  );
  if (!res.ok) throw new Error(`source_http_${res.status}`);
  const body = await res.json().catch(() => null);
  const list = body && Array.isArray(body.images) ? body.images : null;
  if (!list) throw new Error('source_format_unknown');
  const valid: SourceImage[] = [];
  for (const it of list) {
    if (!it || typeof it.url !== 'string' || typeof it.key !== 'string') throw new Error('source_format_unknown');
    if (!URL_RE.test(it.url) || !KEY_RE.test(it.key) || !it.url.endsWith(`${it.key}.jpg`)) {
      throw new Error('source_format_unknown');
    }
    valid.push({ url: it.url, key: it.key, localTime: typeof it.local_time === 'string' ? it.local_time : '' });
  }
  if (valid.length === 0) throw new Error('source_empty');
  valid.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  return valid[valid.length - 1];
}

/** The key encodes UTC. Trust it only when webcam.io's Oslo local_time agrees. */
function captureTime(src: SourceImage): Date | null {
  const m = src.key.match(KEY_RE);
  if (!m || !LOCAL_RE.test(src.localTime)) return null;
  const [d, t] = [m[1], m[2]];
  const iso = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}T${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4, 6)}Z`;
  const at = new Date(iso);
  if (Number.isNaN(at.getTime())) return null;
  return osloLocal(at) === src.localTime ? at : null;
}

async function sha256Hex(buf: Uint8Array) {
  const h = new Uint8Array(await crypto.subtle.digest('SHA-256', buf));
  return Array.from(h, (b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });

  const { data: state, error: stateErr } = await db.from('webcam6_state').select('*').eq('id', true).single();
  if (stateErr || !state) return json({ error: 'state_unavailable' }, 500);

  const presented = req.headers.get('x-webcam6-refresh-token') ?? '';
  if (!presented || presented !== state.refresh_token) return json({ error: 'forbidden' }, 403);

  const dryRun = new URL(req.url).searchParams.get('dry_run') === '1';

  // Single-flight lock.
  const nowIso = new Date().toISOString();
  const staleIso = new Date(Date.now() - LOCK_TIMEOUT_MS).toISOString();
  const { data: locked } = await db
    .from('webcam6_state')
    .update({ locked_at: nowIso })
    .eq('id', true)
    .or(`locked_at.is.null,locked_at.lt.${staleIso}`)
    .select('id');
  if (!locked || locked.length === 0) return json({ result: 'locked' });

  const finish = async (patch: Record<string, unknown>, result: string, extra: Record<string, unknown> = {}) => {
    await db
      .from('webcam6_state')
      .update({
        ...patch,
        locked_at: null,
        last_checked_at: new Date().toISOString(),
        last_result: result,
        checks_total: (state.checks_total ?? 0) + 1,
      })
      .eq('id', true);
    return json({ result, ...extra });
  };

  try {
    const src = await fetchNewestSource();
    if (src.url === state.last_source_url) return await finish({}, 'unchanged');

    const imgRes = await fetch(src.url, { signal: AbortSignal.timeout(20_000) });
    if (!imgRes.ok) throw new Error(`image_http_${imgRes.status}`);
    const type = imgRes.headers.get('content-type') ?? '';
    if (!type.startsWith('image/jpeg')) throw new Error('image_not_jpeg');
    const bytes = new Uint8Array(await imgRes.arrayBuffer());
    if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) throw new Error('image_size_invalid');
    const hash = await sha256Hex(bytes);

    if (hash === state.published_hash || hash === state.last_source_hash) {
      return await finish({ last_source_url: src.url }, 'duplicate');
    }

    const decoded = jpeg.decode(bytes, { useTArray: true, maxMemoryUsageInMB: 256 });
    const decision = classify(extractFeatures(decoded.data, decoded.width, decoded.height), LEFT_TEMPLATE, RIGHT_TEMPLATE);
    const scores = { ...decision, key: src.key };

    if (!decision.approved || dryRun) {
      return await finish(
        {
          last_source_url: src.url,
          last_source_hash: hash,
          last_scores: scores,
          last_error: null,
          rejections_total: (state.rejections_total ?? 0) + (decision.approved ? 0 : 1),
        },
        decision.approved ? 'dry_run_approved' : `rejected_${decision.reason}`,
        { scores },
      );
    }

    const captured = captureTime(src);
    const path = `images/${src.key.replace('/', '-')}-${hash.slice(0, 12)}.jpg`;
    const { error: upErr } = await db.storage.from(BUCKET).upload(path, bytes, {
      contentType: 'image/jpeg',
      upsert: false,
      cacheControl: '31536000',
    });
    if (upErr && !/exists/i.test(upErr.message)) throw new Error(`upload_failed`);

    const olderPath = state.previous_path;
    const res = await finish(
      {
        last_source_url: src.url,
        last_source_hash: hash,
        last_scores: scores,
        last_error: null,
        published_path: path,
        published_hash: hash,
        previous_path: state.published_path,
        captured_at: (captured ?? new Date()).toISOString(),
        time_source: captured ? 'captured' : 'fetched',
        published_at: new Date().toISOString(),
        approvals_total: (state.approvals_total ?? 0) + 1,
      },
      'published',
      { scores, path },
    );
    // Keep current + previous; drop older files.
    if (olderPath && olderPath !== path) await db.storage.from(BUCKET).remove([olderPath]);
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message.slice(0, 200) : 'unknown_error';
    console.error('webcam6-refresh', msg);
    return await finish({ last_error: msg, errors_total: (state.errors_total ?? 0) + 1 }, 'error', { error: msg });
  }
});
