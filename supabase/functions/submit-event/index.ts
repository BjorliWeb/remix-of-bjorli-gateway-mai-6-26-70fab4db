import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

const BodySchema = z.object({
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().max(280).optional().nullable(),
  description: z.string().trim().min(20).max(4000),
  organizer: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().nullable(),
  website: z.string().trim().max(500).optional().nullable(),
  startDate: z.string().min(1).max(40),
  endDate: z.string().max(40).optional().nullable(),
  time: z.string().trim().max(120).optional().nullable(),
  location: z.string().trim().min(2).max(240),
  maps: z.string().trim().max(500).optional().nullable(),
  category: z.string().min(1).max(80),
  imagePaths: z.array(z.string().max(300)).max(5).default([]),
  uploadToken: z.string().uuid(),
  language: z.enum(['no', 'en']).default('no'),
  consentRights: z.literal(true),
  consentEditing: z.literal(true),
  turnstileToken: z.string().min(1),
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) return false;
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
    return data?.success === true;
  } catch {
    return false;
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

  // Every image path must live inside uploads/<uploadToken>/ to match storage RLS.
  const tokenPrefix = `uploads/${parsed.data.uploadToken}/`;
  for (const p of parsed.data.imagePaths) {
    if (!p.startsWith(tokenPrefix)) {
      return jsonResponse({ ok: false, error: 'invalid-image-path' }, 400);
    }
  }

  const ip =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    null;

  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!ok) return jsonResponse({ ok: false, error: 'turnstile-failed' }, 400);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  const { error } = await supabase.from('event_submissions').insert({
    title: parsed.data.title,
    summary: parsed.data.summary || null,
    description: parsed.data.description,
    organizer: parsed.data.organizer,
    contact_name: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    website: parsed.data.website || null,
    start_date: parsed.data.startDate,
    end_date: parsed.data.endDate || null,
    time_text: parsed.data.time || null,
    location: parsed.data.location,
    maps_url: parsed.data.maps || null,
    category: parsed.data.category,
    image_urls: parsed.data.imagePaths,
    upload_token: parsed.data.uploadToken,
    language: parsed.data.language,
    consent_rights: parsed.data.consentRights,
    consent_editing: parsed.data.consentEditing,
    status: 'pending',
  });

  if (error) {
    console.error('[submit-event] insert error', error.message);
    return jsonResponse({ ok: false, error: 'insert-failed' }, 500);
  }

  return jsonResponse({ ok: true });
});