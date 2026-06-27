import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/**
 * Internal notifier. Only callable server-to-server from other edge
 * functions (currently `submit-event`) using the shared
 * `INTERNAL_FUNCTION_SECRET` header. Never invoked from the browser.
 *
 * Once the email domain is configured and
 * scaffold_transactional_email has been run, replace the body of this
 * function with a `supabase.functions.invoke('send-transactional-email', ...)`
 * call using a "new-event-submission" template addressed to the editor inbox.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
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
    console.log('[notify-event-submission] new submission:', body);
    return new Response(JSON.stringify({ ok: true, queued: false, reason: 'email-domain-not-configured' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});