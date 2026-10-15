import { describe, expect, it } from 'vitest';
import { fill } from './fill';
import { dictionaries } from './translations';

describe('fill', () => {
  it('replaces known placeholders and keeps unknown ones', () => {
    expect(fill('Open lifts: {open} of {total}', { open: 4, total: 6 })).toBe('Open lifts: 4 of 6');
    expect(fill('{a} {missing}', { a: 'x' })).toBe('x {missing}');
  });
});

describe('live status dictionary', () => {
  it('marks Norwegian-only updates on every language except Norwegian', () => {
    expect(dictionaries.no.live.originalNorwegian).toBe('');
    for (const l of ['en', 'de', 'nl', 'da', 'sv'] as const) {
      expect(dictionaries[l].live.originalNorwegian).not.toBe('');
    }
  });

  it('uses Bjorli Skisenter as a proper name, except the English display name', () => {
    for (const l of ['no', 'de', 'nl', 'da', 'sv'] as const) {
      expect(dictionaries[l].live.latestNews).toContain('Bjorli Skisenter');
    }
    expect(dictionaries.en.live.latestNews).toContain('Bjorli Ski Resort');
  });
});
