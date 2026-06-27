import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const BodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().nullable(),
  message: z.string().trim().min(1).max(2000),
  turnstileToken: z.string().min(1),
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function verifyTurnstile(token: string, ip: string | null): Promise<{ ok: boolean; error?: string }> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) return { ok: false, error: 'missing-secret' };
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);
  if (ip) form.set('remoteip', ip);
  try {
    const r = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const data = await r.json();
    return data?.success === true ? { ok: true } : { ok: false, error: 'siteverify-failed' };
  } catch (_e) {
    return { ok: false, error: 'siteverify-network' };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ ok: false, error: 'method-not-allowed' }, 405);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: 'invalid-json' }, 400);
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: 'validation', issues: parsed.error.flatten() }, 400);
  }

  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    null;

  const verify = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!verify.ok) {
    return jsonResponse({ ok: false, error: 'turnstile-failed' }, 400);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.from('contact_messages').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
  });

  if (error) {
    console.error('[submit-contact] insert error', error.message);
    return jsonResponse({ ok: false, error: 'insert-failed' }, 500);
  }

  return jsonResponse({ ok: true });
});