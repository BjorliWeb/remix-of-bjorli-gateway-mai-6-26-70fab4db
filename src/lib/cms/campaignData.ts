import type { Language } from './types';

/**
 * Campaign text, dates and scheduling logic.
 *
 * Kept separate from campaign imagery so the prerender script can read the
 * same copy and date rules without importing Vite-resolved assets.
 */

export type CampaignTheme = 'winter' | 'neutral';

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

export interface CampaignData {
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
  copy: Record<Language, CampaignCopy>;
}

const SKIPERFORMANCE_SHOP =
  'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4965';

export const EARLY_BIRD_2026: CampaignData = {
  id: 'early-bird-2026',
  enabled: true,
  theme: 'winter',
  startsAt: '2026-08-25',
  endsAt: '2026-09-20',
  ctaFromDate: '2026-09-04',
  ctaHref: SKIPERFORMANCE_SHOP,
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

export const HOMEPAGE_CAMPAIGNS: CampaignData[] = [EARLY_BIRD_2026];

/**
 * Campaign days are Norwegian calendar days.
 *
 * `startsAt` / `endsAt` are interpreted as midnight Europe/Oslo. Both Early
 * Bird dates fall inside CEST (UTC+02:00), so the window is:
 *   opens  2026-09-04T00:00:00+02:00 (2026-09-03T22:00Z)
 *   closes 2026-09-21T00:00:00+02:00 (2026-09-20T22:00Z) — endsAt is inclusive.
 * Prerender and runtime both call these helpers, so static HTML and the
 * hydrated page always agree on whether the campaign is live.
 */
const OSLO_SUMMER_OFFSET = '+02:00';
const day = (iso: string): number => Date.parse(`${iso}T00:00:00${OSLO_SUMMER_OFFSET}`);

export const isCampaignVisible = (c: CampaignData, now: Date = new Date()): boolean => {
  if (!c.enabled) return false;
  const t = now.getTime();
  // endsAt is inclusive — the campaign runs through the whole end day.
  return t >= day(c.startsAt) && t < day(c.endsAt) + 24 * 60 * 60 * 1000;
};

export const isCampaignCtaActive = (c: CampaignData, now: Date = new Date()): boolean => {
  if (!c.ctaFromDate) return true;
  return now.getTime() >= day(c.ctaFromDate);
};

/** The first currently visible homepage campaign, or null. */
export const getActiveHomepageCampaign = (now: Date = new Date()): CampaignData | null =>
  HOMEPAGE_CAMPAIGNS.find((c) => isCampaignVisible(c, now)) ?? null;
