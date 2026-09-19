/**
 * Sub-page content for footer secondary routes
 * (/heiskort, /langrenn, /fotturer, /sykling, /familie, /vinter, /live, /loypekart).
 *
 * Lives in the CMS layer so swapping to Sanity/Strapi/DatoCMS/Storyblok later
 * only changes this file's source, never the page components.
 *
 * The shared text/FAQ/links live in `subpageData.ts` so the prerender script
 * and the browser bundle read the same source. This file only adds the
 * Vite-resolved hero images and re-exports the public API.
 *
 * "Bjorli Skisenter" is a proper name and must NOT be translated in any locale.
 */
import type { CmsImage, Language } from './types';
import { images } from '@/lib/images';
import {
  SUBPAGE_SLUGS,
  SUBPAGES,
  type SubPageContent,
  type SubPageCta,
  type SubPageFaq,
  type SubPageHighlight,
  type SubPageIcon,
  type SubPageSlug,
} from './subpageData';

const heroWinter = images.heroWinter.src;
const crossCountry = images.crossCountry.src;
const hikingImg = images.hiking.src;
const bikingImg = images.biking.src;
const tipFamily = images.familySummer.src;

const meta = (url: string): Pick<CmsImage, 'wpField' | 'placeholder' | 'caption' | 'credit'> => {
  const hit = Object.values(images).find((i) => i.src === url) as
    | { wpField: string; placeholder: boolean; caption?: string; credit?: string }
    | undefined;
  return hit
    ? { wpField: hit.wpField, placeholder: hit.placeholder, caption: hit.caption, credit: hit.credit }
    : {};
};

const IMAGE_FOR_SLUG: Record<SubPageSlug, string> = {
  heiskort: heroWinter,
  langrenn: crossCountry,
  fotturer: hikingImg,
  sykling: bikingImg,
  familie: tipFamily,
  vinter: heroWinter,
  live: heroWinter,
  loypekart: crossCountry,
};

export interface CmsSubPage extends SubPageContent {
  heroImage: CmsImage;
}

export type { SubPageCta, SubPageFaq, SubPageHighlight, SubPageIcon, SubPageSlug };
export { SUBPAGE_SLUGS, isSubPageSlug } from './subpageData';

export const getSubPage = async (
  language: Language,
  slug: SubPageSlug,
): Promise<CmsSubPage | null> => {
  const localeMap = SUBPAGES[language] ?? SUBPAGES.no;
  const data = localeMap[slug];
  if (!data) return null;
  const url = IMAGE_FOR_SLUG[slug] ?? heroWinter;
  return {
    ...data,
    heroImage: { url, alt: data.heroImageAlt, ...meta(url) },
  };
};
