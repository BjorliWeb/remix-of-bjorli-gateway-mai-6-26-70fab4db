import { assert, assertEquals } from 'jsr:@std/assert@1';
import { classify, extractFeatures } from './lensFilter.ts';
import { LEFT_TEMPLATE, RIGHT_TEMPLATE } from './templates.ts';

const solid = (w: number, h: number, v: number) => {
  const d = new Uint8Array(w * h * 4);
  for (let i = 0; i < d.length; i += 4) { d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  return d;
};

Deno.test('uniform fog/grey frame is never approved', () => {
  const d = classify(extractFeatures(solid(320, 180, 180), 320, 180), LEFT_TEMPLATE, RIGHT_TEMPLATE);
  assertEquals(d.approved, false);
});

Deno.test('black frame is rejected as too dark', () => {
  const d = classify(extractFeatures(solid(320, 180, 5), 320, 180), LEFT_TEMPLATE, RIGHT_TEMPLATE);
  assertEquals(d.approved, false);
  assertEquals(d.reason, 'too_dark');
});

Deno.test('templates have matching length', () => {
  assert(LEFT_TEMPLATE.length === RIGHT_TEMPLATE.length && LEFT_TEMPLATE.length === 32 * 18);
});

// 2-D stand-in: scoreLeft = descriptor[0], scoreRight = descriptor[1].
const run = (left: number, right: number, roofRatio: number) =>
  classify({ descriptor: [left, right], roofRatio, mastContrast: 0, meanLuma: 120 }, [1, 0], [0, 1]);

Deno.test('foggy left frame with clear roof is approved (11:40 case)', () => {
  assertEquals(run(0.26, -0.03, 0.24).approved, true);
});
Deno.test('weak score without a clear roof stays rejected', () => {
  assertEquals(run(0.26, -0.03, 0.55).reason, 'low_left_score');
});
Deno.test('score below fog minimum stays rejected', () => {
  assertEquals(run(0.15, -0.1, 0.2).reason, 'low_left_score');
});
Deno.test('right-lens-like margin is still rejected', () => {
  assertEquals(run(0.3, 0.2, 0.24).reason, 'low_margin');
});
