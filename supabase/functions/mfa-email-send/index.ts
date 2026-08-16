import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

/**
 * Sends a 6-digit second-factor code to a signed-in editor's own address.
 *
 * Why this function has to exist: the issuing RPC returns the plaintext code,
 * so `authenticated` must never hold EXECUTE on it. If the browser could call
 * it directly it would simply read its own code and the email factor would
 * prove nothing. service_role therefore stays on this side of the wire, and
 * the code goes out by email only.
 *
 * Identity is taken from the verified JWT — never from the request body — and
 * handed to the RPC, which re-checks the role itself.
 *
 * Secrets (Lovable Cloud):
 *   - RESEND_API_KEY      required; reuses the sender already used by
 *                         notify-event-submission, so no new provider
 *   - NOTIFY_FROM_EMAIL   optional; defaults to Bjorli.no <varsling@bjorli.no>
 *
 * Unlike notify-event-submission this must NOT degrade to log-only when email
 * is unconfigured: silently not sending would strand the editor at a code
 * prompt that can never be satisfied.
 */

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const head = local.slice(0, 2);
  return `${head}${'*'.repeat(Math.max(1, local.length - head.length))}@${domain}`;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anon = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await anon.auth.getClaims(token);
    const userId = claims?.claims?.sub;
    const sessionId = claims?.claims?.session_id;
    if (claimsErr || !userId || !sessionId) return json({ error: 'unauthorized' }, 401);

    // service_role is confined to this one call: issuing + delivering the code.
    const service = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data, error: rpcErr } = await service.rpc('issue_editor_email_code_for_delivery', {
      _user_id: userId,
      _session_id: sessionId,
    });
    if (rpcErr || !data) {
      console.error('[mfa-email-send] rpc failed', rpcErr?.message ?? 'no data');
      return json({ error: 'internal' }, 500);
    }

    const result = data as Record<string, unknown>;
    if (result.error === 'forbidden') return json({ error: 'forbidden' }, 403);
    if (result.error === 'cooldown') {
      return json({ error: 'cooldown', retry_after: result.retry_after ?? 60 }, 429);
    }
    if (result.error === 'rate_limited') return json({ error: 'rate_limited' }, 429);

    const code = String(result.code ?? '');
    const email = String(result.email ?? '');
    if (!code || !email) return json({ error: 'internal' }, 500);

    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      // Fail loudly. The code already exists in the database, so pretending to
      // have sent it would leave the editor unable to continue.
      console.error('[mfa-email-send] RESEND_API_KEY missing — cannot deliver code');
      return json({ error: 'email_unavailable' }, 503);
    }

    const from = Deno.env.get('NOTIFY_FROM_EMAIL') ?? 'Bjorli.no <varsling@bjorli.no>';
    const html = [
      '<div style="font-family:sans-serif;max-width:480px">',
      '<h2 style="color:#14355F">Innloggingskode for bjorli.no</h2>',
      '<p style="font-size:14px">Bruk denne koden for å fullføre innloggingen i redaktørpanelet:</p>',
      `<p style="font-size:30px;letter-spacing:6px;font-weight:700;margin:20px 0">${code}</p>`,
      '<p style="font-size:14px">Koden er gyldig i 5 minutter og kan bare brukes én gang.</p>',
      '<p style="color:#888;font-size:12px">Ba du ikke om denne koden? Da har noen tastet passordet ditt. Bytt passord på bjorli.no/admin/login og si fra til den som administrerer nettstedet.</p>',
      '</div>',
    ].join('');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Innloggingskode for bjorli.no',
        html,
      }),
    });

    // Status only — never the code, never the address.
    console.log('[mfa-email-send] resend status', res.status);
    if (!res.ok) return json({ error: 'email_unavailable' }, 503);

    return json({
      masked_email: maskEmail(email),
      cooldown_seconds: Number(result.cooldown_seconds ?? 60),
    });
  } catch (err) {
    console.error('[mfa-email-send] error', String(err));
    return json({ error: 'internal' }, 500);
  }
});
