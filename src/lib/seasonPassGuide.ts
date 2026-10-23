/**
 * Season pass purchase guide (sesongkort). Node-safe content + activation.
 *
 * Visibility requires ALL of: Norwegian locale, GUIDE_ENABLED === true and
 * every step passing validation. Content alone never activates the guide.
 */
import type { Locale } from '@/i18n/locales/types';
import videoAsset from '@/assets/guide/sesongkort-veiledning.mp4.asset.json';
import posterAsset from '@/assets/guide/sesongkort-veiledning-poster.jpg.asset.json';

/** Explicit activation flag. Keep false until content is delivered and approved. */
export const GUIDE_ENABLED = true;

export const SEASON_PASS_URL =
  'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4966';

export interface GuideStep {
  title: string;
  /** Readable text version of the full instruction (always required). */
  text: string;
  /** Optional static explanation shown instead of animated media when the user prefers reduced motion. */
  staticText?: string;
  image?: { src: string; alt: string };
  /** Video may contain calm zoom/pointer highlights; captions optional (owner decision 23.10.2026). */
  video?: { src: string; captionsSrc?: string; poster?: string; staticImage?: { src: string; alt: string } };
  audio?: { src: string };
}

/** Approved steps. Empty until delivered content is approved by the owner. */
export const GUIDE_STEPS: GuideStep[] = [
  {
    title: 'Slik kjøper du sesongkort',
    text: 'Videoen viser kjøp av sesongkort i Bjorlis nettbutikk. Trykk på avspilling for å starte.',
    video: { src: videoAsset.url, poster: posterAsset.url },
  },
];

export const GUIDE_COPY = {
  title: 'Slik kjøper du sesongkort',
  intro: 'Følg kjøpet steg for steg i Bjorlis nettbutikk.',
  homeLink: 'Slik kjøper du sesongkort',
  skiCenterLink: 'Trenger du hjelp? Se hvordan du kjøper sesongkort.',
  buy: 'Kjøp sesongkort',
  prev: 'Forrige',
  next: 'Neste',
  close: 'Lukk',
  play: 'Spill av forklaring',
  pause: 'Pause forklaring',
  replay: 'Spill av på nytt',
  step: (n: number, total: number) => `Steg ${n} av ${total}`,
};

const nonEmpty = (s?: string) => typeof s === 'string' && s.trim().length > 0;

export function isValidStep(s: GuideStep): boolean {
  if (!nonEmpty(s.title) || !nonEmpty(s.text)) return false;
  if (!s.image && !s.video) return false;
  if (s.image && (!nonEmpty(s.image.src) || !nonEmpty(s.image.alt))) return false;
  if (s.video && !nonEmpty(s.video.src)) return false;
  if (s.audio && !nonEmpty(s.audio.src)) return false;
  return true;
}

export function isGuideVisible(
  locale: Locale,
  enabled: boolean = GUIDE_ENABLED,
  steps: GuideStep[] = GUIDE_STEPS,
): boolean {
  return locale === 'no' && enabled === true && steps.length > 0 && steps.every(isValidStep);
}
