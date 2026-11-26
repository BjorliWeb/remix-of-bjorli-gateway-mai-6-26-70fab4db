/**
 * Fase 7: end-to-end test of supabase/functions/list-approved-events with a
 * fake Supabase (in-memory rows + fake Storage signer). No network, no Cloud DB.
 *
 * Run: npx vitest run --config scripts/security/functions/vitest.config.ts
 *
 * The real function file is executed unchanged: `Deno.serve` is shimmed below
 * and `npm:@supabase/supabase-js@2` is aliased to ./fakeSupabase.ts.
 */
import { describe, expect, it, beforeEach, vi } from 'vitest';

type Row = Record<string, unknown> & { id: string; status: string; image_urls: string[] | null };
const db: { rows: Row[]; selects: number; signCalls: Array<{ paths: string[]; ttl: number }>; objects: Set<string>; missingLinkColumns?: boolean } = {
  rows: [],
  selects: 0,
  signCalls: [],
  objects: new Set(),
};
let signSeq = 0;

class Query {
  private filters: Array<(r: Row) => boolean> = [];
  constructor(private cols: string) {}
  eq(c: string, v: unknown) { this.filters.push((r) => r[c] === v); return this; }
  in(c: string, vs: unknown[]) { this.filters.push((r) => vs.includes(r[c])); return this; }
  or() { return this; }
  order() { return this; }
  limit() { return this; }
  then(res: (v: unknown) => void) {
    db.selects += 1;
    const keep = this.cols.split(',');
    if (db.missingLinkColumns && keep.some((k) => k === 'ticket_url' || k === 'registration_url')) {
      // Database without migration 0005: PostgREST reports an undefined column.
      res({ data: null, error: { code: '42703', message: 'column event_submissions.ticket_url does not exist' } });
      return;
    }
    const data = db.rows
      .filter((r) => this.filters.every((f) => f(r)))
      .map((r) => Object.fromEntries(keep.filter((k) => k in r).map((k) => [k, structuredClone(r[k])])));
    res({ data, error: null });
  }
}


(globalThis as Record<string, unknown>).__fakeClient = () => ({
  from: () => ({ select: (cols: string) => new Query(cols) }),
  storage: {
    from: (bucket: string) => ({
      createSignedUrls: async (paths: string[], ttl: number) => {
        db.signCalls.push({ paths: [...paths], ttl });
        return {
          data: paths.map((p) => ({
            path: p,
            error: db.objects.has(p) ? null : 'Object not found',
            signedUrl: db.objects.has(p)
              ? `https://fake.supabase.co/storage/v1/object/sign/${bucket}/${p}?token=t${++signSeq}&ttl=${ttl}`
              : null,
          })),
          error: null,
        };
      },
    }),
  },
});

let handler: (req: Request) => Promise<Response>;
(globalThis as Record<string, unknown>).Deno = {
  serve: (h: typeof handler) => { handler = h; },
  env: { get: (k: string) => ({ SUPABASE_URL: 'https://fake.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'fake' } as Record<string, string>)[k] },
};
await import('../../../supabase/functions/list-approved-events/index.ts');

// ---------------------------------------------------------------- fixtures
const A = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa'; // approved, 2 images
const B = 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb'; // approved, 1 image
const R = 'cccccccc-3333-4333-8333-cccccccccccc'; // rejected
const P = 'dddddddd-4444-4444-8444-dddddddddddd'; // pending (never published)
const base = { summary: 's', description: 'd', organizer: 'o', category: 'konsert', categories: ['konsert'],
  language: 'no', start_date: '2099-01-01', end_date: null, time_text: null, location: null, maps_url: null,
  website: null, email: 'secret@example.com', show_email_public: false, english_approved: false };
const reset = () => {
  db.rows = [
    { ...base, id: A, title: 'Konsert A', status: 'approved', image_urls: ['uploads/ta/a0.jpg', 'uploads/ta/a1.jpg'] },
    { ...base, id: B, title: 'Marked B', status: 'approved', image_urls: ['uploads/tb/b0.jpg'] },
    { ...base, id: R, title: 'Avvist R', status: 'rejected', image_urls: ['uploads/tr/r0.jpg'] },
    { ...base, id: P, title: 'Venter P', status: 'pending', image_urls: ['uploads/tp/p0.jpg'] },
  ];
  db.objects = new Set(['uploads/ta/a0.jpg', 'uploads/ta/a1.jpg', 'uploads/tb/b0.jpg', 'uploads/tr/r0.jpg',
    'uploads/tp/p0.jpg', 'private/secret.pdf']);
  db.selects = 0;
  db.signCalls = [];
  db.missingLinkColumns = false;
};

let ipSeq = 0;
const call = async (body: unknown, ip = `10.0.0.${++ipSeq}`) => {
  const res = await handler(new Request('https://fake.supabase.co/functions/v1/list-approved-events', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip },
    body: JSON.stringify(body),
  }));
  return { status: res.status, headers: res.headers, json: await res.json() as Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any -- test-only JSON access
};
const refresh = (items: unknown, ip?: string) => call({ refresh_images: items }, ip);

// ---------------------------------------------------------------- tests
beforeEach(reset);
const test = (name: string, fn: () => Promise<void>) => it(name, fn);
const assert = (c: unknown, msg: string) => expect(c, msg).toBeTruthy();

describe('list-approved-events: public event images', () => {
test('listing: public links are signed for 600 s, every image of a multi-image event', async () => {
  const r = await call({ language: 'no', scope: 'all' });
  assert(r.status === 200, `status ${r.status}`);
  assert(db.signCalls.length > 0 && db.signCalls.every((c) => c.ttl === 600), `ttl ${JSON.stringify(db.signCalls)}`);
  const a = r.json.events.find((e: { id: string }) => e.id === A);
  assert(a.image_signed_urls.length === 2, 'two images');
  assert(JSON.stringify(a.image_indexes) === '[0,1]', `indexes ${a.image_indexes}`);
});

test('listing: only approved events, no private fields, no raw path field', async () => {
  const r = await call({ language: 'no', scope: 'all' });
  const ids = r.json.events.map((e: { id: string }) => e.id).sort();
  assert(JSON.stringify(ids) === JSON.stringify([A, B].sort()), `ids ${ids}`);
  const s = JSON.stringify(r.json);
  assert(!s.includes('secret@example.com'), 'email leaked');
  assert(!s.includes('"image_urls"'), 'raw image_urls leaked');
});

test('listing: a missing image keeps the positions of the others', async () => {
  db.objects.delete('uploads/ta/a0.jpg');
  // Slug lookup = its own cache key, so the 60 s listing cache of earlier tests is not hit.
  const r = await call({ language: 'no', scope: 'all', slug: 'konsert-a-aaaaaaaa' });
  const a = r.json.event;
  assert(a.image_signed_urls.length === 1 && a.image_indexes[0] === 1, JSON.stringify(a));
});

test('refresh: approved event gets one fresh 600 s link, never cached', async () => {
  const r = await refresh([{ id: A, index: 1 }]);
  assert(r.status === 200, `status ${r.status}`);
  assert(r.json.images.length === 1 && r.json.images[0].index === 1, JSON.stringify(r.json));
  assert(r.json.images[0].url.includes('uploads/ta/a1.jpg') && r.json.images[0].url.includes('ttl=600'), r.json.images[0].url);
  assert(r.headers.get('cache-control') === 'no-store', `cache ${r.headers.get('cache-control')}`);
  assert(db.selects === 1 && db.signCalls.length === 1, `selects ${db.selects} signs ${db.signCalls.length}`);
});

test('refresh: several concurrent images = one DB read + one Storage call', async () => {
  const r = await refresh([{ id: A, index: 0 }, { id: A, index: 1 }, { id: B, index: 0 }]);
  assert(r.json.images.length === 3, JSON.stringify(r.json));
  assert(db.selects === 1 && db.signCalls.length === 1, `selects ${db.selects} signs ${db.signCalls.length}`);
});

test('refresh: rejected and pending (unpublished) events get nothing', async () => {
  const r = await refresh([{ id: R, index: 0 }, { id: P, index: 0 }]);
  assert(r.status === 200 && r.json.images.length === 0, JSON.stringify(r.json));
  assert(db.signCalls.length === 0, 'storage must not be called');
});

test('refresh: unpublishing takes effect immediately, even while the listing is cached', async () => {
  await call({ language: 'no', scope: 'all' }); // warm the 60 s listing cache
  db.rows.find((r) => r.id === A)!.status = 'pending'; // editor unpublishes
  const cached = await call({ language: 'no', scope: 'all' });
  assert(cached.headers.get('x-cache') === 'HIT', 'listing should still be the cached copy');
  const r = await refresh([{ id: A, index: 0 }]);
  assert(r.json.images.length === 0, 'stale cached data must not revive an unpublished event');
});

test('refresh: republishing makes the image renewable again', async () => {
  db.rows.find((r) => r.id === A)!.status = 'pending';
  assert((await refresh([{ id: A, index: 0 }])).json.images.length === 0, 'unpublished');
  db.rows.find((r) => r.id === A)!.status = 'approved';
  assert((await refresh([{ id: A, index: 0 }])).json.images.length === 1, 'republished');
});

test('refresh: cannot reach another event\'s image (index beyond this event\'s list)', async () => {
  const r = await refresh([{ id: B, index: 1 }, { id: B, index: 5 }]);
  assert(r.json.images.length === 0, JSON.stringify(r.json));
});

test('refresh: a client-supplied storage path is ignored', async () => {
  const r = await refresh([{ id: B, index: 0, path: 'private/secret.pdf' }]);
  assert(r.json.images.length === 1 && r.json.images[0].url.includes('uploads/tb/b0.jpg'), JSON.stringify(r.json));
  assert(!JSON.stringify(db.signCalls).includes('private/'), 'private object was signed');
});

test('refresh: arbitrary path / malformed requests are rejected with 400', async () => {
  for (const bad of [
    [{ path: 'private/secret.pdf' }],
    'private/secret.pdf',
    [{ id: '../private', index: 0 }],
    [{ id: A, index: -1 }],
    [],
    Array.from({ length: 13 }, (_, i) => ({ id: A, index: i % 2 })),
  ]) {
    const r = await refresh(bad);
    assert(r.status === 400, `expected 400 for ${JSON.stringify(bad)}, got ${r.status}`);
  }
  assert(db.selects === 0 && db.signCalls.length === 0, 'no DB/Storage work for invalid input');
});

test('refresh: unknown event id gives nothing and looks the same as unpublished', async () => {
  const unknown = await refresh([{ id: 'eeeeeeee-5555-4555-8555-eeeeeeeeeeee', index: 0 }]);
  const rejected = await refresh([{ id: R, index: 0 }]);
  assert(JSON.stringify(unknown.json) === JSON.stringify(rejected.json), 'responses differ');
});

test('refresh: image deleted from storage -> nothing (client shows reserve image)', async () => {
  db.objects.delete('uploads/tb/b0.jpg');
  const r = await refresh([{ id: B, index: 0 }]);
  assert(r.status === 200 && r.json.images.length === 0, JSON.stringify(r.json));
});

test('refresh: own per-IP limit (20/min) and does not consume the listing budget', async () => {
  const ip = '192.0.2.77';
  for (let i = 0; i < 20; i++) assert((await refresh([{ id: B, index: 0 }], ip)).status === 200, `call ${i}`);
  const limited = await refresh([{ id: B, index: 0 }], ip);
  assert(limited.status === 429 && limited.headers.get('retry-after') === '60', `got ${limited.status}`);
  assert((await call({ language: 'no', scope: 'all' }, ip)).status === 200, 'listing must still work');
});

test('anonymous access: no auth header needed for listing or refresh (public data only)', async () => {
  // `call` sends no Authorization header at all.
  assert((await call({ language: 'en', scope: 'all' })).status === 200, 'listing');
  assert((await refresh([{ id: A, index: 0 }])).status === 200, 'refresh');
});


  test('action links: returned for approved events, unsafe stored values become null', async () => {
    db.rows.find((r) => r.id === A)!.ticket_url = 'https://billett.example.no/';
    db.rows.find((r) => r.id === A)!.registration_url = 'https://meld.example.no/';
    db.rows.find((r) => r.id === B)!.ticket_url = 'javascript:alert(1)';
    // scope=current = cache keys not used by earlier tests (60 s listing cache).
    const a = (await call({ language: 'no', scope: 'current', slug: 'konsert-a-aaaaaaaa' })).json.event;
    expect(a.ticket_url).toBe('https://billett.example.no/');
    expect(a.registration_url).toBe('https://meld.example.no/');
    const b = (await call({ language: 'no', scope: 'current', slug: 'marked-b-bbbbbbbb' })).json.event;
    expect(b.ticket_url).toBeNull();
    expect(b.registration_url).toBeNull();
  });

  test('action links of unpublished or rejected events are never exposed', async () => {
    for (const r of db.rows) { r.ticket_url = `https://t.example.no/${r.id}`; }
    const body = JSON.stringify((await call({ language: 'no', scope: 'all', slug: 'venter-p-dddddddd' })).json)
      + JSON.stringify((await call({ language: 'no', scope: 'all', slug: 'avvist-r-cccccccc' })).json);
    expect(body).not.toContain('t.example.no');
  });

  test('deployed before migration 0005: listings keep working without the links', async () => {
    db.missingLinkColumns = true;
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const r = await call({ language: 'en', scope: 'all', slug: 'konsert-a-aaaaaaaa' });
    expect(r.status === 200 || r.status === 404).toBe(true);
    const list = await call({ language: 'no', scope: 'current' });
    expect(list.status).toBe(200);
    expect(list.json.events.length).toBeGreaterThan(0);
    expect(list.json.events[0].ticket_url).toBeNull();
  });
});
