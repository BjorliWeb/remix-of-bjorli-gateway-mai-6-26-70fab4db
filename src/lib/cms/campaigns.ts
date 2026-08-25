import type { Language } from './types';
import earlyBirdPortrait from '@/assets/photos/01_winter_ski_resort/bjorli-early-bird-2026-portrait.jpg';

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
  onlineOnly: string;
  /** Calm note shown before the CTA window opens. */
  preCtaNote: string;
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
  },
  copy: {
    no: {
      eyebrow: 'EARLY BIRD',
      headline: 'Sesongens beste pris nærmer seg',
      period: '4.–20. september 2026',
      body: 'Fra 4.–20. september får du sesongens beste priser på sesongkort på Bjorli. Vet du allerede nå at du skal stå på ski hos oss i vinter, er dette tidspunktet å sikre seg sesongkortet før prisene går opp.',
      onlineOnly: 'Early Bird er kun tilgjengelig for online kjøp på bjorli.no i perioden 4.–20. september.',
      preCtaNote: 'Kom tilbake 4. september for å kjøpe Early Bird online.',
      supportingLine: 'Er du klar for en ny vinter?',
      ctaLabel: 'Kjøp Early Bird online',
    },
    en: {
      eyebrow: 'EARLY BIRD',
      headline: 'The best price of the season is almost here',
      period: '4–20 September 2026',
      body: 'Between 4 and 20 September the season passes for Bjorli go on sale at their lowest price of the year. If you already know you will be skiing with us this winter, this is the window to sort it out before prices go up.',
      onlineOnly: 'Early Bird is available exclusively online at bjorli.no from 4 to 20 September.',
      preCtaNote: 'Come back on 4 September to buy Early Bird online.',
      supportingLine: 'Ready for another winter?',
      ctaLabel: 'Buy Early Bird online',
    },
    de: {
      eyebrow: 'EARLY BIRD',
      headline: 'Der beste Preis der Saison steht bevor',
      period: '4.–20. September 2026',
      body: 'Vom 4. bis 20. September gibt es die Saisonkarten für Bjorli zum günstigsten Preis des Jahres. Wenn Sie jetzt schon wissen, dass Sie diesen Winter bei uns Ski fahren, sollten Sie sich die Karte sichern, bevor die Preise steigen.',
      onlineOnly: 'Early Bird ist vom 4. bis 20. September ausschließlich online auf bjorli.no erhältlich.',
      preCtaNote: 'Kommen Sie am 4. September wieder, um Early Bird online zu kaufen.',
      supportingLine: 'Bereit für einen neuen Winter?',
      ctaLabel: 'Early Bird online kaufen',
    },
    nl: {
      eyebrow: 'EARLY BIRD',
      headline: 'De beste prijs van het seizoen komt eraan',
      period: '4–20 september 2026',
      body: 'Van 4 tot en met 20 september koop je het seizoenskaart voor Bjorli tegen de laagste prijs van het jaar. Weet je nu al dat je deze winter bij ons skiet? Dan is dit hét moment, voordat de prijzen omhooggaan.',
      onlineOnly: 'Early Bird is van 4 tot en met 20 september uitsluitend online verkrijgbaar via bjorli.no.',
      preCtaNote: 'Kom op 4 september terug om Early Bird online te kopen.',
      supportingLine: 'Klaar voor een nieuwe winter?',
      ctaLabel: 'Koop Early Bird online',
    },
    da: {
      eyebrow: 'EARLY BIRD',
      headline: 'Sæsonens bedste pris nærmer sig',
      period: '4.–20. september 2026',
      body: 'Fra 4. til 20. september får du sæsonkortet til Bjorli til årets bedste pris. Ved du allerede nu, at du skal stå på ski hos os i vinter, er det nu, du skal sikre dig kortet – inden priserne stiger.',
      onlineOnly: 'Early Bird kan kun købes online på bjorli.no i perioden 4.–20. september.',
      preCtaNote: 'Kom tilbage den 4. september for at købe Early Bird online.',
      supportingLine: 'Er du klar til en ny vinter?',
      ctaLabel: 'Køb Early Bird online',
    },
    sv: {
      eyebrow: 'EARLY BIRD',
      headline: 'Säsongens bästa pris närmar sig',
      period: '4–20 september 2026',
      body: 'Mellan 4 och 20 september får du säsongskortet på Bjorli till årets bästa pris. Vet du redan nu att du ska åka skidor hos oss i vinter är det här läget att fixa kortet innan priserna går upp.',
      onlineOnly: 'Early Bird kan endast köpas online på bjorli.no 4–20 september.',
      preCtaNote: 'Kom tillbaka den 4 september för att köpa Early Bird online.',
      supportingLine: 'Redo för en ny vinter?',
      ctaLabel: 'Köp Early Bird online',
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
