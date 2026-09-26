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
