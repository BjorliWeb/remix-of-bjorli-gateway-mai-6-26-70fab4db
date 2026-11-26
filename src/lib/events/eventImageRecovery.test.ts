import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SyntheticEvent } from 'react';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@/integrations/supabase/lazy', () => ({
  loadSupabase: async () => ({ functions: { invoke } }),
}));

const {
  __resetEventImageRecovery,
  handleEventImageError,
  registerEventImage,
  requestFreshEventImage,
} = await import('./eventImageRecovery');

const A = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
const B = 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb';
const FALLBACK = 'https://bjorli.no/assets/fallback.jpg';
const signed = (id: string, n: number) =>
  `https://proj.supabase.co/storage/v1/object/sign/event-submissions/uploads/${id}/img.jpg?token=t${n}`;

/** Server stub: answers every requested image unless listed as unpublished. */
const serve = (unpublished: string[] = [], gen = { n: 100 }) =>
  invoke.mockImplementation(async (_fn: string, { body }: { body: { refresh_images: Array<{ id: string; index: number }> } }) => ({
    data: {
      images: body.refresh_images
        .filter((r) => !unpublished.includes(r.id))
        .map((r) => ({ ...r, url: signed(r.id, gen.n++) })),
    },
    error: null,
  }));

const img = (src: string) => {
  const el = document.createElement('img');
  el.src = src;
  document.body.appendChild(el);
  return el;
};
const fail = (el: HTMLImageElement) =>
  handleEventImageError({ currentTarget: el } as unknown as SyntheticEvent<HTMLImageElement>);
/** Let the batch window elapse and all promise callbacks settle. */
const settle = async () => {
  await vi.advanceTimersByTimeAsync(50);
  for (let i = 0; i < 5; i++) await Promise.resolve();
};

beforeEach(() => {
  vi.useFakeTimers();
  invoke.mockReset();
  __resetEventImageRecovery();
  document.body.innerHTML = '';
});
afterEach(() => vi.useRealTimers());

describe('normal display', () => {
  it('makes no request while images load fine (registration is local only)', async () => {
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    img(signed(A, 1));
    await settle();
    expect(invoke).not.toHaveBeenCalled();
  });

  it('ignores errors on images that are not signed event images', async () => {
    const el = img('https://bjorli.no/assets/webcam.jpg');
    fail(el);
    await settle();
    expect(invoke).not.toHaveBeenCalled();
    expect(el.src).toBe('https://bjorli.no/assets/webcam.jpg');
  });
});

describe('expired link (page open > 10 min, or a late lazy-loaded image)', () => {
  it('asks once with (id, index) only — never a storage path — and swaps in the fresh link', async () => {
    serve();
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    const el = img(signed(A, 1));
    vi.advanceTimersByTime(11 * 60_000); // the 600 s link is now expired
    fail(el);
    await settle();
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke).toHaveBeenCalledWith('list-approved-events', { body: { refresh_images: [{ id: A, index: 0 }] } });
    expect(JSON.stringify(invoke.mock.calls[0])).not.toContain('uploads/');
    expect(el.src).toBe(signed(A, 100));
  });

  it('batches simultaneous failures of several events into one request', async () => {
    serve();
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    registerEventImage(signed(B, 1), B, 0, FALLBACK);
    const a = img(signed(A, 1));
    const b = img(signed(B, 1));
    fail(a);
    fail(b);
    await settle();
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0][1].body.refresh_images).toEqual([{ id: A, index: 0 }, { id: B, index: 0 }]);
    expect(a.src).not.toBe(signed(A, 1));
    expect(b.src).not.toBe(signed(B, 1));
  });

  it('coalesces the same image shown in several places (card + hero + lightbox)', async () => {
    serve();
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    const els = [img(signed(A, 1)), img(signed(A, 1)), img(signed(A, 1))];
    els.forEach(fail);
    await settle();
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0][1].body.refresh_images).toEqual([{ id: A, index: 0 }]);
    els.forEach((el) => expect(el.src).toBe(signed(A, 100)));
  });

  it('reuses a renewed link for a remounted element without a new request', async () => {
    serve();
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    fail(img(signed(A, 1)));
    await settle();
    const remounted = img(signed(A, 1));
    fail(remounted);
    await settle();
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(remounted.src).toBe(signed(A, 100));
  });

  it('splits more than 12 simultaneous failures into bounded batches', async () => {
    serve();
    const ids = Array.from({ length: 15 }, (_, i) => `${String(i).padStart(8, '0')}-1111-4111-8111-aaaaaaaaaaaa`);
    ids.forEach((id) => registerEventImage(signed(id, 1), id, 0, FALLBACK));
    ids.map((id) => img(signed(id, 1))).forEach(fail);
    await settle();
    expect(invoke).toHaveBeenCalledTimes(2);
    expect(invoke.mock.calls[0][1].body.refresh_images).toHaveLength(12);
    expect(invoke.mock.calls[1][1].body.refresh_images).toHaveLength(3);
  });
});

describe('retry limit and reserve image', () => {
  it('retries at most once per element: a failing renewed link shows the reserve image', async () => {
    serve();
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    const el = img(signed(A, 1));
    fail(el);
    await settle();
    expect(el.src).toBe(signed(A, 100));
    fail(el); // renewed link fails too (e.g. image deleted from storage)
    await settle();
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(el.src).toBe(FALLBACK);
    expect(el.dataset.eventImgFallback).toBe('1');
    fail(el); // the reserve image itself failing must not loop
    await settle();
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(el.src).toBe(FALLBACK);
  });

  it('unpublished / rejected event: server declines, reserve image is shown, no second request', async () => {
    serve([A]);
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    const el = img(signed(A, 1));
    fail(el);
    await settle();
    expect(el.src).toBe(FALLBACK);
    fail(el);
    await settle();
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it('rate limit or network error: reserve image, no retry loop', async () => {
    invoke.mockResolvedValue({ data: null, error: { context: { status: 429 } } });
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    const el = img(signed(A, 1));
    fail(el);
    await settle();
    expect(el.src).toBe(FALLBACK);
    invoke.mockReset();
    invoke.mockRejectedValue(new Error('offline'));
    registerEventImage(signed(B, 1), B, 0, FALLBACK);
    const el2 = img(signed(B, 1));
    fail(el2);
    await settle();
    expect(el2.src).toBe(FALLBACK);
    expect(invoke).toHaveBeenCalledTimes(1);
  });

  it('a new failure state (fresh feed gives the element a new link) gets its own single retry', async () => {
    serve();
    registerEventImage(signed(A, 1), A, 0, FALLBACK);
    const el = img(signed(A, 1));
    fail(el);
    await settle();
    fail(el);
    await settle();
    expect(el.src).toBe(FALLBACK);
    // Republished / refetched feed: React sets a newly signed link on the same element.
    vi.advanceTimersByTime(10 * 60_000); // cached renewal no longer reused
    registerEventImage(signed(A, 2), A, 0, FALLBACK);
    el.src = signed(A, 2);
    fail(el);
    await settle();
    expect(invoke).toHaveBeenCalledTimes(2);
    expect(el.src).toBe(signed(A, 101));
  });
});

describe('requestFreshEventImage', () => {
  it('never runs two requests for the same image at once', async () => {
    serve();
    const p1 = requestFreshEventImage({ id: A, index: 0 });
    const p2 = requestFreshEventImage({ id: A, index: 0 });
    await settle();
    expect(await p1).toBe(await p2);
    expect(invoke).toHaveBeenCalledTimes(1);
  });
});
