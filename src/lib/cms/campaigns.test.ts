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

  it('uses one repository image and identifies online-only sales', () => {
    expect(c.image.wide.url).toBe(c.image.portrait.url);
    expect(c.image.portrait.url).not.toContain('/__l5e/assets-v1/');
    expect(c.image.alt.no).toBe(
      'Early Bird på Bjorli 4.–20. september, med skigjester og ansatte i bakken.',
    );
    expect(c.copy.no.onlineOnly).toBe(
      'Early Bird er kun tilgjengelig ved online kjøp på bjorli.no.',
    );
  });
});
