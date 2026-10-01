// Request a static rebuild of the public site after an editor publishes,
// edits or unpublishes an event in admin.
//
// - Editors only (admin/moderator), resolved server-side from user_roles.
// - The Cloudflare Pages deploy hook URL lives ONLY in the backend secret
//   CLOUDFLARE_DEPLOY_HOOK_URL. It is never returned or logged.
// - Inactive until that secret exists: returns { status: 'not_configured' }
//   (HTTP 200) so admin actions never fail because of the hook.
// - Durable queue in site_rebuild_state: every request marks a rebuild as
//   owed; at most one hook call per 60 s (atomic DB claim). Requests inside
//   the window are queued and re-flushed when it ends; hook failures keep the
//   rebuild owed (last_error/failed_attempts) and are retried on the next call.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const REASONS = new Set(['publish', 'update', 'unpublish', 'retry']);
const THROTTLE_MS = 60_000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);
  const userClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: claims, error: claimsErr } = await userClient.auth.getClaims(
    authHeader.replace('Bearer ', ''),
  );
  if (claimsErr || !claims?.claims?.sub) return json({ error: 'Unauthorized' }, 401);

  const service = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const { data: roleRows, error: roleErr } = await service
    .from('user_roles')
    .select('role')
    .eq('user_id', claims.claims.sub)
    .in('role', ['admin', 'moderator'])
    .limit(1);
  if (roleErr || !roleRows || roleRows.length === 0) return json({ error: 'Forbidden' }, 403);

  let reason = 'update';
  try {
    const b = await req.json();
    if (b && typeof b.reason === 'string' && REASONS.has(b.reason)) reason = b.reason;
  } catch {
    /* default reason */
  }

  // Durable queue: record that a rebuild is owed BEFORE any throttling, so
  // no change is dropped. Builds read data when they start, so any request
  // arriving after a claim simply leaves `pending` set for the next build.
  await markPending(service);
  const result = await flush(service, reason);
  if (result.status === 'queued') {
    // Wake again when the throttle window ends (no permanent poller).
    const wait = Math.max(1000, result.retryInMs ?? THROTTLE_MS);
    // deno-lint-ignore no-explicit-any
    (globalThis as any).EdgeRuntime?.waitUntil(
      new Promise((r) => setTimeout(r, wait)).then(() => flush(service, reason)),
    );
  }
  return json(result.body, result.http);
});

// deno-lint-ignore no-explicit-any
type Svc = any;

async function markPending(service: Svc) {
  const now = new Date().toISOString();
  const { error } = await service
    .from('site_rebuild_state')
    .update({ pending: true, requested_at: now, updated_at: now })
    .eq('id', true);
  if (error) console.error('[rebuild] could not mark pending', error.message);
}

async function flush(
  service: Svc,
  reason: string,
): Promise<{ status: string; http: number; body: unknown; retryInMs?: number }> {
  const hook = Deno.env.get('CLOUDFLARE_DEPLOY_HOOK_URL');
  const record = async (patch: Record<string, unknown>) =>
    service.from('site_rebuild_state').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', true);

  if (!hook) {
    console.log(`[rebuild] not_configured reason=${reason} (stays pending)`);
    await record({ last_status: 'not_configured' });
    return { status: 'not_configured', http: 200, body: { status: 'not_configured', pending: true } };
  }
  if (!/^https:\/\/api\.cloudflare\.com\//.test(hook)) {
    console.error('[rebuild] hook secret has unexpected format');
    await record({ last_status: 'misconfigured', last_error: 'hook format' });
    return { status: 'misconfigured', http: 500, body: { status: 'misconfigured', pending: true } };
  }

  // Atomic claim: only one caller fires per throttle window.
  const cutoff = new Date(Date.now() - THROTTLE_MS).toISOString();
  const nowIso = new Date().toISOString();
  const { data: claimed } = await service
    .from('site_rebuild_state')
    .update({ pending: false, last_triggered_at: nowIso, updated_at: nowIso })
    .eq('id', true)
    .eq('pending', true)
    .or(`last_triggered_at.is.null,last_triggered_at.lt.${cutoff}`)
    .select('id');
  if (!claimed || claimed.length === 0) {
    const { data: st } = await service.from('site_rebuild_state').select('pending,last_triggered_at').eq('id', true).maybeSingle();
    if (!st?.pending) return { status: 'idle', http: 200, body: { status: 'already_included' } };
    const retryInMs = st.last_triggered_at
      ? new Date(st.last_triggered_at).getTime() + THROTTLE_MS - Date.now() + 500
      : THROTTLE_MS;
    console.log(`[rebuild] queued reason=${reason} retryInMs=${retryInMs}`);
    return { status: 'queued', http: 200, body: { status: 'queued', pending: true }, retryInMs };
  }

  try {
    const res = await fetch(hook, { method: 'POST' });
    console.log(`[rebuild] triggered reason=${reason} http=${res.status}`);
    if (!res.ok) throw new Error(`http ${res.status}`);
    await record({ last_status: 'triggered', last_error: null, failed_attempts: 0 });
    return { status: 'triggered', http: 200, body: { status: 'triggered' } };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown';
    console.error('[rebuild] hook request failed', msg);
    // Re-arm: keep the change owed and allow an immediate retry.
    const { data: st } = await service.from('site_rebuild_state').select('failed_attempts').eq('id', true).maybeSingle();
    await record({
      pending: true,
      last_triggered_at: null,
      last_status: 'hook_failed',
      last_error: msg.slice(0, 200),
      failed_attempts: (st?.failed_attempts ?? 0) + 1,
    });
    return { status: 'hook_failed', http: 502, body: { status: 'hook_failed', pending: true } };
  }
}
