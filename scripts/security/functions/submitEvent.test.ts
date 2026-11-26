/**
 * End-to-end test of supabase/functions/submit-event with a fake Supabase
 * client and a stubbed Turnstile check. No network, no Cloud DB.
 * Run: npx vitest run --config scripts/security/functions/vitest.config.ts
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const inserts: Array<Record<string, unknown>> = [];
(globalThis as Record<string, unknown>).__fakeClient = () => ({
  from: () => ({ insert: async (row: Record<string, unknown>) => { inserts.push(row); return { error: null }; } }),
});
let handler: (req: Request) => Promise<Response>;
(globalThis as Record<string, unknown>).Deno = {
  serve: (h: typeof handler) => { handler = h; },
  env: { get: (k: string) => ({ TURNSTILE_SECRET_KEY: 'x', SUPABASE_URL: 'https://fake.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'fake' } as Record<string, string>)[k] },
};
// Turnstile always passes; the notify call is ignored.
vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true }))));
vi.spyOn(console, 'log').mockImplementation(() => {});
await import('../../../supabase/functions/submit-event/index.ts');

const TOKEN = '11111111-2222-4333-8444-555555555555';
const valid = {
  title: 'Konsert på Bjorli', description: 'En lang nok beskrivelse av arrangementet.', organizer: 'Bjorli IL',
  contactName: 'Ola Test', email: 'ola@example.com', startDate: '2099-02-01', location: 'Bjorli',
  category: 'konsert', categories: ['konsert'], imagePaths: [], uploadToken: TOKEN, language: 'no',
  consentRights: true, consentEditing: true, turnstileToken: 'tok',
};
const submit = async (extra: Record<string, unknown>) => {
  const res = await handler(new Request('https://fake/functions/v1/submit-event', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...valid, ...extra }),
  }));
  return { status: res.status, json: await res.json() as Record<string, unknown> };
};

beforeEach(() => { inserts.length = 0; });

describe('submit-event: optional action links', () => {
  it('submission without any links works and stores no link columns', async () => {
    const r = await submit({});
    expect(r).toEqual({ status: 200, json: { ok: true } });
    expect(inserts[0].website).toBeNull();
    expect('ticket_url' in inserts[0]).toBe(false);
    expect('registration_url' in inserts[0]).toBe(false);
    expect(inserts[0].status).toBe('pending');
  });

  it('submitter can add both new links (and website)', async () => {
    const r = await submit({ website: 'https://arr.example.no/', ticketUrl: 'https://billett.example.no/', registrationUrl: 'https://meld.example.no/' });
    expect(r.status).toBe(200);
    expect(inserts[0]).toMatchObject({
      website: 'https://arr.example.no/', ticket_url: 'https://billett.example.no/', registration_url: 'https://meld.example.no/',
      status: 'pending', // links never change the moderation flow
    });
  });

  it('old clients (no link fields) still work', async () => {
    const r = await submit({ ticketUrl: undefined, registrationUrl: undefined });
    expect(r.status).toBe(200);
  });

  it.each([
    ['ticketUrl', 'javascript:alert(1)'],
    ['registrationUrl', 'data:text/html,<script>x</script>'],
    ['ticketUrl', 'www.example.no'],
    ['registrationUrl', 'https://localhost/x'],
    ['website', 'javascript:alert(1)'],
    ['maps', 'vbscript:x'],
  ])('rejects unsafe %s=%s before anything is stored', async (field, value) => {
    const r = await submit({ [field]: value });
    expect(r.status).toBe(400);
    expect(r.json).toMatchObject({ ok: false, error: 'invalid-url', field });
    expect(inserts).toHaveLength(0);
  });

  it('cannot set status or publish via the API (unknown fields are ignored)', async () => {
    const r = await submit({ ticketUrl: 'https://billett.example.no/', status: 'approved' });
    expect(r.status).toBe(200);
    expect(inserts[0].status).toBe('pending');
  });
});
