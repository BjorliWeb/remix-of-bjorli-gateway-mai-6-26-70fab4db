import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // --- Auth gate: require signed-in admin -------------------------------
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const service = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: roleRows, error: roleErr } = await service
      .from('user_roles')
      .select('role')
      .eq('user_id', claims.claims.sub)
      .eq('role', 'admin')
      .limit(1);
    if (roleErr || !roleRows || roleRows.length === 0) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // ----------------------------------------------------------------------

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');

    const body = await req.json();
    const mode = String(body.mode || 'improve_intro_no');
    const title = String(body.title || '').slice(0, 300);
    const summary = String(body.summary || '').slice(0, 600);
    const description = String(body.description || '').slice(0, 6000);

    // v1 supports Norwegian editing + one-way English draft translation.
    // Other locales (DE/NL/DA/SV) are intentionally not exposed.
    const prompts: Record<string, string> = {
      shorten_no: `Forkort beskrivelsen til 2–3 stramme avsnitt på naturlig redaksjonell norsk (bokmål). Behold alle fakta, datoer, priser og stedsnavn. Ikke legg til påstander. Returnér JSON {"description":"..."}.`,
      improve_intro_no: `Skriv om ingressen til én tydelig setning på naturlig redaksjonell norsk (bokmål) for bjorli.no. Behold fakta. Ikke overdriv. Returnér JSON {"summary":"..."}.`,
      editorial_no: `Skriv om beskrivelsen i en rolig, redaksjonell destinasjonstone på norsk (bokmål). Behold alle fakta, datoer, priser, stedsnavn, arrangørnavn og lenker. Ikke legg til markedsføringspåstander. Returnér JSON {"description":"..."}.`,
      seo_title_no: `Foreslå én SEO-tittel på norsk (bokmål), maks 60 tegn, basert på arrangementet. Returnér JSON {"seoTitle":"..."}.`,
      seo_meta_no: `Foreslå én meta-beskrivelse på norsk (bokmål), maks 155 tegn, basert på arrangementet. Returnér JSON {"seoMeta":"..."}.`,
      missing_info: `Gå gjennom innsendingen og pek ut manglende eller uklar informasjon en redaktør bør be om før publisering (f.eks. pris, tid, kontakt, bilder, lokasjon). Skriv kort og konkret på norsk. Returnér JSON {"qualityFlag":"..."}.`,
      translate_en: `Translate this event into natural British English for bjorli.no. Keep all facts, dates, times, prices, place names, organizer names and booking links unchanged. Use clear destination language. Do not add claims. Do not exaggerate. Do not overwrite the Norwegian original. Return an editable English draft only. Returnér JSON {"englishTitle":"...","englishSummary":"...","englishDescription":"..."}.`,
      // English-source cleanup. Always produces an English DRAFT — editor previews
      // and approves before anything overwrites the original submission text.
      shorten_en: `Shorten the description to 2–3 tight paragraphs in natural British English for bjorli.no. Keep all facts, dates, times, prices, place names, organizer names and booking links unchanged. Do not add claims. Do not exaggerate. Return an editable English draft only. Return JSON {"englishDescription":"..."}.`,
      improve_intro_en: `Rewrite the intro as one clear sentence in natural British English for bjorli.no. Keep facts. Do not exaggerate. Return an editable English draft only. Return JSON {"englishSummary":"..."}.`,
      editorial_en: `Rewrite the description in a calm, editorial destination tone in British English for bjorli.no. Keep all facts, dates, times, prices, place names, organizer names and booking links unchanged. Do not add marketing claims. Return an editable English draft only. Return JSON {"englishDescription":"..."}.`,
    };
    const instruction = prompts[mode] || prompts.improve_intro_no;

    const userContent = `Title: ${title}\nSummary: ${summary}\nDescription: ${description}`;

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: `${instruction} Respond with raw JSON only, no markdown fences.` },
          { role: 'user', content: userContent },
        ],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI gateway ${res.status}: ${t}`);
    }
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content ?? '{}';
    let parsed: Record<string, string> = {};
    try {
      parsed = JSON.parse(raw.replace(/^```(?:json)?\n?|\n?```$/g, '').trim());
    } catch {
      parsed = { summary: raw };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});