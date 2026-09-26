// Public read-only access to the currently published webcam 6 image.
// - GET            -> JSON metadata { imageUrl, capturedAt, timeSource } or { imageUrl: null }
// - GET ?v=<hash>  -> the published JPEG, only when <hash> is the published version
// No analysis and no upstream calls happen here; it only reads stored data.

import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};
const HASH_RE = /^[0-9a-f]{64}$/;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: cors });

  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });
  const { data: s } = await db
    .from('webcam6_state')
    .select('published_path, published_hash, captured_at, time_source')
    .eq('id', true)
    .single();

  const v = new URL(req.url).searchParams.get('v');
  if (v !== null) {
    if (!HASH_RE.test(v) || !s?.published_path || v !== s.published_hash) {
      return new Response('Not found', { status: 404, headers: { ...cors, 'Cache-Control': 'no-store' } });
    }
    const { data: file, error } = await db.storage.from('webcam6').download(s.published_path);
    if (error || !file) return new Response('Unavailable', { status: 503, headers: { ...cors, 'Cache-Control': 'no-store' } });
    return new Response(file, {
      headers: { ...cors, 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
    });
  }

  const meta = s?.published_path && s.published_hash
    ? {
        imageUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webcam6-image?v=${s.published_hash}`,
        capturedAt: s.captured_at,
        timeSource: s.time_source === 'captured' ? 'captured' : 'fetched',
      }
    : { imageUrl: null };
  return new Response(JSON.stringify(meta), {
    headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
  });
});
