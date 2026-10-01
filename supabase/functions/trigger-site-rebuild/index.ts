// Request a static rebuild of the public site after an editor publishes,
// edits or unpublishes an event in admin.
//
// - Editors only (admin/moderator), resolved server-side from user_roles.
// - The Cloudflare Pages deploy hook URL lives ONLY in the backend secret
//   CLOUDFLARE_DEPLOY_HOOK_URL. It is never returned or logged.
// - Inactive until that secret exists: returns { status: 'not_configured' }
//   (HTTP 200) so admin actions never fail because of the hook.
// - Throttled to one hook call per 60 s per isolate; a rebuild picks up every
//   change made before it starts, so bursts of edits need only one build.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const REASONS = new Set(['publish', 'update', 'unpublish']);
const THROTTLE_MS = 60_000;
let lastTriggerAt = 0;

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

  const hook = Deno.env.get('CLOUDFLARE_DEPLOY_HOOK_URL');
  if (!hook) {
    console.log(`[rebuild] not_configured reason=${reason}`);
    return json({ status: 'not_configured' });
  }
  if (!/^https:\/\/api\.cloudflare\.com\//.test(hook)) {
    console.error('[rebuild] hook secret has unexpected format');
    return json({ status: 'misconfigured' }, 500);
  }

  const now = Date.now();
  if (now - lastTriggerAt < THROTTLE_MS) {
    console.log(`[rebuild] throttled reason=${reason}`);
    return json({ status: 'throttled' });
  }
  lastTriggerAt = now;

  try {
    const res = await fetch(hook, { method: 'POST' });
    console.log(`[rebuild] triggered reason=${reason} http=${res.status}`);
    if (!res.ok) {
      lastTriggerAt = 0;
      return json({ status: 'hook_failed', http: res.status }, 502);
    }
    return json({ status: 'triggered' });
  } catch (e) {
    lastTriggerAt = 0;
    console.error('[rebuild] hook request failed', e instanceof Error ? e.message : 'unknown');
    return json({ status: 'hook_failed' }, 502);
  }
});
