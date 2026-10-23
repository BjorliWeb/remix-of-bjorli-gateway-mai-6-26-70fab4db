/**
 * Season pass purchase guide (sesongkort). Node-safe content + activation.
 *
 * Visibility requires ALL of: Norwegian locale, GUIDE_ENABLED === true and
 * every step passing validation. Content alone never activates the guide.
 */
import type { Locale } from '@/i18n/locales/types';

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
  /** Video may contain calm zoom/pointer highlights; captions required. */
  video?: { src: string; captionsSrc: string; poster?: string; staticImage?: { src: string; alt: string } };
  audio?: { src: string };
}

/** Approved steps. Empty until delivered content is approved by the owner. */
export const GUIDE_STEPS: GuideStep[] = [{title:"PRØVE 1",text:"Prøvetekst 1",image:{src:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1400'%3E%3Crect width='800' height='1400' fill='%23ccc'/%3E%3C/svg%3E",alt:"Prøvebilde"},audio:{src:"/sample.wav"}},{title:"PRØVE 2",text:"Prøvetekst 2",image:{src:"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1400'%3E%3Crect width='800' height='1400' fill='%23ccc'/%3E%3C/svg%3E",alt:"Prøvebilde 2"}}];

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
  if (s.video && (!nonEmpty(s.video.src) || !nonEmpty(s.video.captionsSrc))) return false;
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
