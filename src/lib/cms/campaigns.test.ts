import { describe, it, expect } from 'vitest';
import { EARLY_BIRD_2026 as c, isCampaignVisible, isCampaignCtaActive } from '@/lib/cms/campaigns';
describe('early bird schedule', () => {
  it('states', () => {
    // Boundaries are Norwegian calendar days (Europe/Oslo, CEST = UTC+02:00).
    expect(isCampaignVisible(c, new Date('2026-08-24T12:00:00Z'))).toBe(false);
    expect(isCampaignVisible(c, new Date('2026-08-25T12:00:00Z'))).toBe(true);
    // 03.09 21:59 UTC = 23:59 Oslo → not yet; 22:00 UTC = 04.09 00:00 Oslo → active.
    expect(isCampaignCtaActive(c, new Date('2026-09-03T21:59:00Z'))).toBe(false);
    expect(isCampaignCtaActive(c, new Date('2026-09-03T22:00:00Z'))).toBe(true);
    expect(isCampaignCtaActive(c, new Date('2026-09-04T08:00:00Z'))).toBe(true);
    // Visible through 20.09 in Oslo; gone from 21.09 00:00 Oslo (20.09 22:00 UTC).
    expect(isCampaignVisible(c, new Date('2026-09-20T21:59:00Z'))).toBe(true);
    expect(isCampaignVisible(c, new Date('2026-09-20T22:00:00Z'))).toBe(false);
  });

  it('uses one repository image and identifies online-only sales', () => {
    expect(c.image.wide.url).toBe(c.image.portrait.url);
    expect(c.image.portrait.url).not.toContain('/__l5e/assets-v1/');
    expect(c.image.alt.no).toBe(
      'Early Bird på Bjorli 4.–20. september, med skigjester og ansatte i bakken.',
    );
    expect(c.copy.no.onlineOnly).toBe(
      'Early Bird er kun tilgjengelig for online kjøp på bjorli.no i perioden 4.–20. september.',
    );
  });
});
