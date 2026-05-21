import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');

    const body = await req.json();
    const mode = String(body.mode || 'cleanup');
    const title = String(body.title || '').slice(0, 300);
    const summary = String(body.summary || '').slice(0, 600);
    const description = String(body.description || '').slice(0, 6000);
    const language = body.language === 'en' ? 'en' : 'no';

    const langName = language === 'en' ? 'English' : 'Norwegian (Bokmål)';
    const prompts: Record<string, string> = {
      cleanup: `Rewrite the intro of this event in clean editorial ${langName}. Keep facts. Return JSON {"summary": "..."}.`,
      shorten: `Shorten the description to 2–3 tight paragraphs in editorial ${langName}. Keep facts. Return JSON {"description": "..."}.`,
      seo: `Suggest an SEO title (max 60 chars) and meta description (max 155 chars) in ${langName}. Return JSON {"seoTitle":"...","seoMeta":"..."}.`,
      quality: `Evaluate the submission quality for an editorial tourism site (Bjorli). Flag spam, off-topic or low-quality content. Return JSON {"qualityFlag":"OK | Trenger gjennomgang | Avvis – grunn"}.`,
    };
    const instruction = prompts[mode] || prompts.cleanup;

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