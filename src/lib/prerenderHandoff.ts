/**
 * Prerender → React handoff.
 *
 * Public routes ship a prerendered HTML skeleton (scripts/prerender.ts).
 * When React mounts it replaces that skeleton. If the hero then replays
 * its entrance animation (opacity 0 → 1), the visitor sees the headline
 * vanish and fade back in — a visible blink.
 *
 * main.tsx calls `markPrerenderedBoot()` before rendering. The first hero
 * that mounts calls `consumePrerenderedBoot()` and skips its entrance
 * animation; later client-side navigations animate as normal.
 */
let prerenderedBoot = false;

export function markPrerenderedBoot(): void {
  if (typeof document === 'undefined') return;
  prerenderedBoot = !!document.querySelector('#root [data-prerender]');
}

export function consumePrerenderedBoot(): boolean {
  const value = prerenderedBoot;
  prerenderedBoot = false;
  return value;
}
