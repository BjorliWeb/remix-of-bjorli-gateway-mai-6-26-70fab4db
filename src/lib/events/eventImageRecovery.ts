/**
 * On-demand renewal of expired public event image links.
 *
 * Public event images are signed URLs that live 600 s. A page left open for
 * longer (or a lazy image scrolled into view late) will hit an expired link.
 * Only then — when the browser actually reports a load error — we ask
 * `list-approved-events` once for a fresh link for that one image:
 *
 * - No polling, no timers, no extra requests while images load normally.
 * - The request names (event id, image position), never a storage path; the
 *   server re-checks that the event is still approved before signing.
 * - Concurrent failures are batched into one request (≤ 12 images) and the
 *   same image is never requested twice at the same time.
 * - At most one automatic retry per <img> element and failure state; after
 *   that, or when the server declines, the existing reserve image is shown.
 *
 * Non-event images are left untouched: the handler only acts on URLs that the
 * CMS adapter registered as signed event images.
 */
import type { SyntheticEvent } from 'react';
import { loadSupabase } from '@/integrations/supabase/lazy';

export type EventImageRef = { id: string; index: number };

type Entry = EventImageRef & { fallback: string; origin: string };

/** Keep renewed links a minute short of their 600 s lifetime. */
const FRESH_REUSE_MS = 540_000;
const BATCH_WINDOW_MS = 40;
const MAX_BATCH = 12;
const MAX_REGISTRY = 2_000;

const registry = new Map<string, Entry>();
const fresh = new Map<string, { url: string; until: number }>();
const inflight = new Map<string, Promise<string | null>>();
/** Per element: origins (first failing URL) already retried once. */
const attempts = new WeakMap<HTMLImageElement, Set<string>>();

let queue: Array<{ ref: EventImageRef; resolve: (u: string | null) => void }> = [];
let timer: ReturnType<typeof setTimeout> | null = null;

const keyOf = (r: EventImageRef) => `${r.id}:${r.index}`;

const norm = (u: string): string => {
  try {
    return new URL(u, typeof location !== 'undefined' ? location.href : 'https://bjorli.no').href;
  } catch {
    return u;
  }
};

function remember(url: string, entry: Entry) {
  const k = norm(url);
  registry.delete(k);
  registry.set(k, entry);
  if (registry.size > MAX_REGISTRY) {
    const oldest = registry.keys().next().value;
    if (oldest !== undefined) registry.delete(oldest);
  }
}

/** Called by the CMS adapter for every signed event image it hands out. */
export function registerEventImage(url: string, id: string, index: number, fallback: string): void {
  if (!url || !id) return;
  remember(url, { id, index, fallback, origin: norm(url) });
}

async function sendBatch(batch: typeof queue): Promise<void> {
  const results = new Map<string, string>();
  try {
    const supabase = await loadSupabase();
    const { data, error } = await supabase.functions.invoke('list-approved-events', {
      body: { refresh_images: batch.map((b) => b.ref) },
    });
    if (!error) {
      const images = (data as { images?: Array<{ id: string; index: number; url: string }> })?.images ?? [];
      for (const im of images) {
        if (im && typeof im.url === 'string' && im.url) results.set(keyOf(im), im.url);
      }
    }
  } catch {
    /* network failure: every image in the batch falls back */
  }
  for (const b of batch) b.resolve(results.get(keyOf(b.ref)) ?? null);
}

function flush() {
  timer = null;
  const all = queue;
  queue = [];
  for (let i = 0; i < all.length; i += MAX_BATCH) void sendBatch(all.slice(i, i + MAX_BATCH));
}

/**
 * Fresh signed URL for one event image, or null when the server declines
 * (event unpublished, image gone, rate limited, offline). Shared across all
 * elements showing the same image.
 */
export function requestFreshEventImage(ref: EventImageRef): Promise<string | null> {
  const k = keyOf(ref);
  const cached = fresh.get(k);
  if (cached && cached.until > Date.now()) return Promise.resolve(cached.url);
  const running = inflight.get(k);
  if (running) return running;
  // Send exactly (id, index): nothing else from the page reaches the server.
  const clean: EventImageRef = { id: ref.id, index: ref.index };
  const p = new Promise<string | null>((resolve) => {
    queue.push({ ref: clean, resolve });
    if (!timer) timer = setTimeout(flush, BATCH_WINDOW_MS);
  }).then((url) => {
    inflight.delete(k);
    if (url) fresh.set(k, { url, until: Date.now() + FRESH_REUSE_MS });
    else fresh.delete(k);
    return url;
  });
  inflight.set(k, p);
  return p;
}

/** The reserve image is never registered, so its own failure cannot loop. */
function showFallback(el: HTMLImageElement, fallback: string) {
  el.dataset.eventImgFallback = '1';
  el.src = fallback;
}

/**
 * `onError` handler for any <img> that may show an event image. Safe on other
 * images: unknown URLs are ignored, so existing behaviour is unchanged.
 */
export function handleEventImageError(e: SyntheticEvent<HTMLImageElement>): void {
  const el = e.currentTarget;
  if (!el) return;
  const failing = norm(el.currentSrc || el.src);
  const entry = registry.get(failing);
  if (!entry) return;

  const tried = attempts.get(el) ?? new Set<string>();
  attempts.set(el, tried);
  if (tried.has(entry.origin)) {
    showFallback(el, entry.fallback);
    return;
  }
  tried.add(entry.origin);

  void requestFreshEventImage({ id: entry.id, index: entry.index }).then((url) => {
    // The element may have been given a different image meanwhile.
    if (norm(el.currentSrc || el.src) !== failing) return;
    if (url && norm(url) !== failing) {
      remember(url, { ...entry });
      el.src = url;
    } else {
      showFallback(el, entry.fallback);
    }
  });
}

/** Test-only: reset module state. */
export function __resetEventImageRecovery(): void {
  registry.clear();
  fresh.clear();
  inflight.clear();
  queue = [];
  if (timer) clearTimeout(timer);
  timer = null;
}
