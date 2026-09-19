import type { Language } from './types';
import earlyBirdPortrait from '@/assets/photos/01_winter_ski_resort/bjorli-early-bird-2026-portrait.jpg';
import {
  EARLY_BIRD_2026 as EARLY_BIRD_2026_DATA,
  HOMEPAGE_CAMPAIGNS as HOMEPAGE_CAMPAIGNS_DATA,
  type CampaignData,
  type CampaignCopy,
  type CampaignTheme,
  isCampaignCtaActive as isCampaignCtaActiveData,
  isCampaignVisible as isCampaignVisibleData,
} from './campaignData';

export type { CampaignCopy, CampaignTheme };

export interface CampaignImage {
  /** Wide landscape variant, used from the md breakpoint up. */
  wide: { url: string; width: number; height: number };
  /** Portrait variant, used on small screens. */
  portrait: { url: string; width: number; height: number };
  /** CSS object-position for each variant, keeps the subject in frame. */
  focalDesktop: string;
  focalMobile: string;
  /** Localized alt text describing what is actually visible. */
  alt: Record<Language, string>;
}

export interface Campaign extends CampaignData {
  image: CampaignImage;
}

const EARLY_BIRD_IMAGE: CampaignImage = {
  // The same repository-hosted earlybird2 artwork is used at every breakpoint.
  wide: { url: earlyBirdPortrait, width: 1350, height: 1688 },
  portrait: { url: earlyBirdPortrait, width: 1350, height: 1688 },
  focalDesktop: '50% 45%',
  focalMobile: '50% 60%',
  alt: {
    no: 'Early Bird på Bjorli 4.–20. september, med skigjester og ansatte i bakken.',
    en: 'Early Bird at Bjorli, 4–20 September, with skiers and staff in the ski area.',
    de: 'Early Bird in Bjorli vom 4. bis 20. September, mit Skigästen und Mitarbeitenden im Skigebiet.',
    nl: 'Early Bird in Bjorli van 4 tot 20 september, met skigasten en medewerkers in het skigebied.',
    da: 'Early Bird på Bjorli 4.–20. september med skigæster og medarbejdere i skiområdet.',
    sv: 'Early Bird på Bjorli 4–20 september, med skidgäster och personal i skidområdet.',
  },
};

function attachImage(data: CampaignData): Campaign {
  if (data.id === 'early-bird-2026') {
    return { ...data, image: EARLY_BIRD_IMAGE };
  }
  throw new Error(`Unknown campaign: ${data.id}`);
}

export const HOMEPAGE_CAMPAIGNS: Campaign[] = HOMEPAGE_CAMPAIGNS_DATA.map(attachImage);
export const EARLY_BIRD_2026: Campaign = attachImage(EARLY_BIRD_2026_DATA);

export const isCampaignVisible = (c: CampaignData, now: Date = new Date()): boolean =>
  isCampaignVisibleData(c, now);

export const isCampaignCtaActive = (c: CampaignData, now: Date = new Date()): boolean =>
  isCampaignCtaActiveData(c, now);

/** The first currently visible homepage campaign, or null. */
export const getActiveHomepageCampaign = (now: Date = new Date()): Campaign | null => {
  const data = HOMEPAGE_CAMPAIGNS_DATA.find((c) => isCampaignVisibleData(c, now)) ?? null;
  return data ? attachImage(data) : null;
};
