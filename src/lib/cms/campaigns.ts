import type { Language } from './types';
import portraitAsset from '@/assets/early-bird-portrait.jpg.asset.json';

/**
 * Reusable homepage campaign configuration.
 *
 * Campaigns are plain structured content — same pattern as `subpages.ts`
 * and `summerHomepageCopy.ts`. No CMS, no database table, no dependency.
 * Add a new entry here (Early Bird, opening weekend, Christmas, Easter …)
 * and it appears on the homepage within its date window.
 *
 * Visibility rules, evaluated at render time:
 *   enabled === false            → hidden
 *   now < startsAt               → hidden
 *   now > endsAt                 → hidden (automatic expiry)
 *   now < ctaFromDate            → visible, but WITHOUT the CTA button
 *
 * `teaser` copy is used before `ctaFromDate`; `live` copy from then on.
 */

export type CampaignTheme = 'winter' | 'neutral';

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

export interface CampaignCopy {
  eyebrow: string;
  headline: string;
  period: string;
  body: string;
  supportingLine: string;
  /** Shown only once `ctaFromDate` has passed. */
  ctaLabel: string;
  secondaryCtaLabel?: string;
}

export interface Campaign {
  id: string;
  enabled: boolean;
  theme: CampaignTheme;
  /** ISO date (inclusive) when the section starts showing. */
  startsAt: string;
  /** ISO date (inclusive) after which the section disappears. */
  endsAt: string;
  /** ISO date (inclusive) from which the primary CTA is rendered. */
  ctaFromDate?: string;
  /** External purchase destination — the existing shop URL. */
  ctaHref: string;
  /** Optional internal secondary destination (canonical route path). */
  secondaryCtaHref?: string;
  image: CampaignImage;
  copy: Record<Language, CampaignCopy>;
}

const SKIPERFORMANCE_SHOP =
  'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862';

export const EARLY_BIRD_2026: Campaign = {
  id: 'early-bird-2026',
  enabled: true,
  theme: 'winter',
  startsAt: '2026-08-25',
  endsAt: '2026-09-20',
  ctaFromDate: '2026-09-04',
  ctaHref: SKIPERFORMANCE_SHOP,
  image: {
    wide: { url: wideAsset.url, width: 1858, height: 624 },
    portrait: { url: portraitAsset.url, width: 1350, height: 1688 },
    focalDesktop: '50% 45%',
    focalMobile: '50% 60%',
    alt: {
      no: 'Skikjører i oransje dress svinger nedover en preparert bakke på Bjorli, med kampanjeteksten Early Bird 4.–20. september.',
      en: 'A skier in an orange suit carving down a groomed slope at Bjorli, with the Early Bird 4–20 September campaign text.',
      de: 'Skifahrer im orangefarbenen Anzug auf einer präparierten Piste in Bjorli, mit dem Kampagnentext Early Bird 4.–20. September.',
      nl: 'Een skiër in een oranje pak op een geprepareerde piste in Bjorli, met de campagnetekst Early Bird 4–20 september.',
      da: 'Skiløber i orange dragt på en præpareret bakke på Bjorli, med kampagneteksten Early Bird 4.–20. september.',
      sv: 'Skidåkare i orange dress i en preparerad backe på Bjorli, med kampanjtexten Early Bird 4–20 september.',
    },
  },
  copy: {
    no: {
      eyebrow: 'EARLY BIRD',
      headline: 'Sesongens beste pris nærmer seg',
      period: '4.–20. september 2026',
      body: 'Fra 4.–20. september får du sesongens beste priser på sesongkort på Bjorli. Vet du allerede nå at du skal stå på ski hos oss i vinter, er dette tidspunktet å sikre seg sesongkortet før prisene går opp.',
      supportingLine: 'Er du klar for en ny vinter?',
      ctaLabel: 'Kjøp sesongkort',
    },
    en: {
      eyebrow: 'EARLY BIRD',
      headline: 'The best price of the season is almost here',
      period: '4–20 September 2026',
      body: 'Between 4 and 20 September the season passes for Bjorli go on sale at their lowest price of the year. If you already know you will be skiing with us this winter, this is the window to sort it out before prices go up.',
      supportingLine: 'Ready for another winter?',
      ctaLabel: 'Buy your season pass',
    },
    de: {
      eyebrow: 'EARLY BIRD',
      headline: 'Der beste Preis der Saison steht bevor',
      period: '4.–20. September 2026',
      body: 'Vom 4. bis 20. September gibt es die Saisonkarten für Bjorli zum günstigsten Preis des Jahres. Wenn Sie jetzt schon wissen, dass Sie diesen Winter bei uns Ski fahren, sollten Sie sich die Karte sichern, bevor die Preise steigen.',
      supportingLine: 'Bereit für einen neuen Winter?',
      ctaLabel: 'Saisonkarte kaufen',
    },
    nl: {
      eyebrow: 'EARLY BIRD',
      headline: 'De beste prijs van het seizoen komt eraan',
      period: '4–20 september 2026',
      body: 'Van 4 tot en met 20 september koop je het seizoenskaart voor Bjorli tegen de laagste prijs van het jaar. Weet je nu al dat je deze winter bij ons skiet? Dan is dit hét moment, voordat de prijzen omhooggaan.',
      supportingLine: 'Klaar voor een nieuwe winter?',
      ctaLabel: 'Koop je seizoenskaart',
    },
    da: {
      eyebrow: 'EARLY BIRD',
      headline: 'Sæsonens bedste pris nærmer sig',
      period: '4.–20. september 2026',
      body: 'Fra 4. til 20. september får du sæsonkortet til Bjorli til årets bedste pris. Ved du allerede nu, at du skal stå på ski hos os i vinter, er det nu, du skal sikre dig kortet – inden priserne stiger.',
      supportingLine: 'Er du klar til en ny vinter?',
      ctaLabel: 'Køb sæsonkort',
    },
    sv: {
      eyebrow: 'EARLY BIRD',
      headline: 'Säsongens bästa pris närmar sig',
      period: '4–20 september 2026',
      body: 'Mellan 4 och 20 september får du säsongskortet på Bjorli till årets bästa pris. Vet du redan nu att du ska åka skidor hos oss i vinter är det här läget att fixa kortet innan priserna går upp.',
      supportingLine: 'Redo för en ny vinter?',
      ctaLabel: 'Köp säsongskort',
    },
  },
};

export const HOMEPAGE_CAMPAIGNS: Campaign[] = [EARLY_BIRD_2026];

/** Parse an ISO date (YYYY-MM-DD) as a UTC day boundary. */
const day = (iso: string): number => Date.parse(`${iso}T00:00:00Z`);

export const isCampaignVisible = (c: Campaign, now: Date = new Date()): boolean => {
  if (!c.enabled) return false;
  const t = now.getTime();
  // endsAt is inclusive — the campaign runs through the whole end day.
  return t >= day(c.startsAt) && t < day(c.endsAt) + 24 * 60 * 60 * 1000;
};

export const isCampaignCtaActive = (c: Campaign, now: Date = new Date()): boolean => {
  if (!c.ctaFromDate) return true;
  return now.getTime() >= day(c.ctaFromDate);
};

/** The first currently visible homepage campaign, or null. */
export const getActiveHomepageCampaign = (now: Date = new Date()): Campaign | null =>
  HOMEPAGE_CAMPAIGNS.find((c) => isCampaignVisible(c, now)) ?? null;
