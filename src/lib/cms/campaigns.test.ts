import { describe, it, expect } from 'vitest';
import { EARLY_BIRD_2026 as c, isCampaignVisible, isCampaignCtaActive } from '@/lib/cms/campaigns';
describe('early bird schedule', () => {
  it('states', () => {
    expect(isCampaignVisible(c, new Date('2026-08-24T12:00:00Z'))).toBe(false);
    expect(isCampaignVisible(c, new Date('2026-08-25T12:00:00Z'))).toBe(true);
    expect(isCampaignCtaActive(c, new Date('2026-09-03T23:00:00Z'))).toBe(false);
    expect(isCampaignCtaActive(c, new Date('2026-09-04T08:00:00Z'))).toBe(true);
    expect(isCampaignVisible(c, new Date('2026-09-20T22:00:00Z'))).toBe(true);
    expect(isCampaignVisible(c, new Date('2026-09-21T01:00:00Z'))).toBe(false);
  });
});
