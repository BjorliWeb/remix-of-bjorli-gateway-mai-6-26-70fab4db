import { describe, it, expect } from 'vitest';
import { GUIDE_ENABLED, SEASON_PASS_URL, isGuideVisible, type GuideStep } from './seasonPassGuide';

const step: GuideStep = { title: 'Velg sesongkort', text: 'Tekst', image: { src: '/a.png', alt: 'Skjermbilde' } };

describe('season pass guide activation', () => {
  it('guide is switched on with approved video', () => { expect(GUIDE_ENABLED).toBe(true); expect(isGuideVisible('no')).toBe(true); expect(isGuideVisible('en')).toBe(false); });
  it('valid steps alone never make the guide visible', () =>
    expect(isGuideVisible('no', false, [step])).toBe(false));
  it('visible only for Norwegian when enabled and valid', () => {
    expect(isGuideVisible('no', true, [step])).toBe(true);
    expect(isGuideVisible('en', true, [step])).toBe(false);
  });
  it('hidden when a step lacks alt text', () =>
    expect(isGuideVisible('no', true, [{ ...step, image: { src: '/a.png', alt: '' } }])).toBe(false));
  it('hidden when video has no source', () =>
    expect(isGuideVisible('no', true, [{ title: 't', text: 't', video: { src: '' } }])).toBe(false));
  it('buy button targets season pass group 4966', () =>
    expect(SEASON_PASS_URL).toBe('https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4966'));
});
