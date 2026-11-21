/** Uses the same pure presentation and content sources as the visible pages. */
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AlpineFacts, NordicSupport, TrailMapSections } from '../../src/components/ResortFactsSections';
import SkiappenMap from '../../src/components/SkiappenMap';
import { FACTS_COPY, SKIAPPEN_AREA_URL } from '../../src/lib/resortFacts';
import { LANGRENN_COPY } from '../../src/pages/langrennCopy';
import { getSkiCenterData } from '../../src/lib/cms/skiCenterData';
import { getSubPageData } from '../../src/lib/cms/subpageData';
import { localizeHref } from '../../src/i18n/localizeHref';
import type { Locale } from '../../src/i18n/locales/types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export const alpineFactsHtml = (locale: Locale) => renderToStaticMarkup(createElement(AlpineFacts, { locale }));

export function nordicPageHtml(locale: Locale) {
  const c = FACTS_COPY[locale];
  const t = LANGRENN_COPY[locale];
  return `<h1>${esc(t.heroTitle)}</h1><p>${esc(t.heroSubtitle)}</p>
    <section class="py-12"><p>${esc(t.intro)}</p><p>${esc(c.nordicBody)}</p></section>
    <section aria-labelledby="loypestatus-heading"><h2 id="loypestatus-heading">${esc(t.loypestatusTitle)}</h2><p>${esc(t.loypestatusBody)}</p>${renderToStaticMarkup(createElement(SkiappenMap, { locale }))}</section>
    <section class="py-12" aria-labelledby="lysloype-heading"><h2 id="lysloype-heading">${esc(t.lysloypeTitle)}</h2><p>${esc(t.lysloypeBody1)}</p><p>${esc(t.lysloypeBody2)}</p></section>
    <section aria-labelledby="praktisk-heading"><h2 id="praktisk-heading">${esc(t.praktiskTitle)}</h2>
      <h3>${esc(t.cardCheck.title)}</h3><p>${esc(t.cardCheck.bodyBefore)}<a href="${esc(SKIAPPEN_AREA_URL)}" target="_blank" rel="noopener noreferrer">${esc(t.cardCheck.linkText)}</a>${esc(t.cardCheck.bodyAfter)}</p>
      <h3>${esc(t.cardWeather.title)}</h3><p>${esc(t.cardWeather.body)}</p>
      <h3>${esc(t.cardRespect.title)}</h3><p>${esc(t.cardRespect.body)}</p>
    </section>${renderToStaticMarkup(createElement(NordicSupport, { locale }))}`;
}

export function trailMapPageHtml(locale: Locale, alpineImage: string) {
  const page = getSubPageData(locale, 'loypekart');
  if (!page) throw new Error(`Missing trail-map page: ${locale}`);
  const { trailMap } = getSkiCenterData(locale);
  return `<h1>${esc(page.title)}</h1><p>${esc(page.intro)}</p><p>${esc(page.body)}</p>` + renderToStaticMarkup(createElement(TrailMapSections, {
    locale, alpineImage, alpineAlt: trailMap.alt, openLabel: trailMap.ariaOpen, operationalNote: trailMap.note,
  }));
}

export function weatherNordicHtml(locale: Locale) {
  const c = FACTS_COPY[locale];
  return `<section aria-labelledby="langrenn-heading"><h2 id="langrenn-heading">${esc(c.nordicTitle)}</h2><p>${esc(c.nordicShort)}</p><p><a href="${esc(localizeHref('/langrenn', locale))}">${esc(c.nordicMore)}</a></p>${renderToStaticMarkup(createElement(SkiappenMap, { locale }))}</section>`;
}