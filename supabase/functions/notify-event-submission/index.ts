import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/**
 * Placeholder notifier. Once the email domain is configured and
 * scaffold_transactional_email has been run, replace the body of this
 * function with a `supabase.functions.invoke('send-transactional-email', ...)`
 * call using a "new-event-submission" template addressed to the editor inbox.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

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