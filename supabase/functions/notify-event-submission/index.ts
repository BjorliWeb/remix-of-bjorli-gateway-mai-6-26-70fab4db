import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/**
 * Internal notifier. Only callable server-to-server from other edge
 * functions (currently `submit-event`) using the shared
 * `INTERNAL_FUNCTION_SECRET` header. Never invoked from the browser.
 *
 * Sends an editor notification email via Resend when a new event
 * submission arrives. Requirements (Lovable Cloud secrets):
 *   - RESEND_API_KEY        (required for sending; function degrades to
 *                            log-only when missing, exactly like the old stub)
 *   - EDITOR_NOTIFY_EMAIL   (optional; defaults to skisenter@bjorli.no)
 *   - NOTIFY_FROM_EMAIL     (optional; defaults to Bjorli.no <varsling@bjorli.no>;
 *                            the domain must be verified in Resend first)
 *
 * Design constraints:
 *   - Must NEVER fail or delay the submission flow (caller is fire-and-forget,
 *     and we also never return 5xx for email problems).
 *   - Logs must not contain API keys.
 *   - Body contains only what the editor needs; the full submission lives in
 *     the admin panel.
 */

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const expected = Deno.env.get('INTERNAL_FUNCTION_SECRET');
  const provided = req.headers.get('x-internal-function-secret') ?? '';
  if (!expected || !provided || !timingSafeEqual(expected, provided)) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const title = typeof body.title === 'string' ? body.title.slice(0, 200) : '(uten tittel)';
    const organizer = typeof body.organizer === 'string' ? body.organizer.slice(0, 200) : '(ukjent)';
    const email = typeof body.email === 'string' ? body.email.slice(0, 200) : '(ukjent)';
    const language = typeof body.language === 'string' ? body.language.slice(0, 10) : 'no';

    const apiKey = Deno.env.get('RESEND_API_KEY');
    const editorEnv = Deno.env.get('EDITOR_NOTIFY_EMAIL');
    const fromEnv = Deno.env.get('NOTIFY_FROM_EMAIL');
    const to = editorEnv ?? 'skisenter@bjorli.no';
    const from = fromEnv ?? 'Bjorli.no <varsling@bjorli.no>';
    console.log('[notify-event-submission] debug', {
      hasResendKey: !!apiKey,
      hasEditorEnv: !!editorEnv,
      to,
      hasFromEnv: !!fromEnv,
      from,
      title,
    });
    if (!apiKey) {
      // Same graceful behaviour as the original stub: log and report why.
      console.log('[notify-event-submission] new submission (email not configured):', { title, organizer, language });
      console.log('[notify-event-submission] result', { queued: false, reason: 'email-not-configured' });
      return new Response(
        JSON.stringify({ ok: true, queued: false, reason: 'email-not-configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const adminUrl = 'https://bjorli.no/admin/innsendinger';

    const subject = `Nytt arrangement til vurdering: ${title}`;
    const html = [
      '<div style="font-family:sans-serif;max-width:560px">',
      '<h2 style="color:#14355F">Nytt arrangement sendt inn på bjorli.no</h2>',
      '<table style="border-collapse:collapse;font-size:14px">',
      `<tr><td style="padding:4px 12px 4px 0;color:#555">Tittel</td><td style="padding:4px 0"><strong>${escapeHtml(title)}</strong></td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#555">Arrangør</td><td style="padding:4px 0">${escapeHtml(organizer)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#555">Innsenders e-post</td><td style="padding:4px 0">${escapeHtml(email)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#555">Språk</td><td style="padding:4px 0">${escapeHtml(language)}</td></tr>`,
      '</table>',
      `<p style="margin-top:16px"><a href="${adminUrl}" style="background:#14355F;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Åpne innsendinger til vurdering</a></p>`,
      '<p style="color:#888;font-size:12px">Automatisk varsel fra bjorli.no. Innsendingen behandles i adminpanelet – ikke svar på denne e-posten.</p>',
      '</div>',
    ].join('');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });

    console.log('[notify-event-submission] resend status', res.status);
    if (!res.ok) {
      const errText = (await res.text()).slice(0, 300);
      console.error('[notify-event-submission] resend error', res.status, errText);
      console.log('[notify-event-submission] result', { queued: false, reason: `resend-${res.status}` });
      return new Response(
        JSON.stringify({ ok: true, queued: false, reason: `resend-${res.status}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    console.log('[notify-event-submission] notification sent for:', title);
    console.log('[notify-event-submission] result', { queued: true });
    return new Response(JSON.stringify({ ok: true, queued: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[notify-event-submission] error', String(err));
    return new Response(JSON.stringify({ ok: false, error: 'internal' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
