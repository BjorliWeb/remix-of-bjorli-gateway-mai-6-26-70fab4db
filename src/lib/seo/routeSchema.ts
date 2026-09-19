/**
 * Single source of truth for the JSON-LD a canonical route owns.
 *
 * Both the prerenderer (`scripts/prerender.ts`) and the runtime
 * (`src/components/SEOHead.tsx`) call `buildRouteSchemas()`, so a page
 * carries exactly the same structured data whether it was requested
 * directly (crawler / hard reload) or reached through client-side
 * navigation. Every node has a stable script id and exactly one owner:
 * SEOHead creates, updates and removes them at runtime.
 */
import { buildFaqPage, buildSkiResort, buildWebPage } from './schema';
import { getSkiCenterData } from '../cms/skiCenterData';
import { getSubPageData } from '../cms/subpageData';
import type { Locale } from '../../i18n/locales/types';

/** Stable <script> ids — shared by prerender and runtime. */
export const SCHEMA_IDS = {
  /** WebPage (or the CMS entry's Article/Event) for the current route. */
  webPage: 'jsonld-route',
  /** TouristDestination — homepage only. */
  touristDestination: 'jsonld-org',
  /** SkiResort + LocalBusiness — Bjorli Skisenter. */
  skiResort: 'jsonld-ski-resort',
  /** FAQPage — routes that render an FAQ block. */
  faq: 'jsonld-faq',
} as const;

/** Ids managed by SEOHead, in emission order. */
export const MANAGED_SCHEMA_IDS: readonly string[] = [
  SCHEMA_IDS.webPage,
  SCHEMA_IDS.touristDestination,
  SCHEMA_IDS.skiResort,
  SCHEMA_IDS.faq,
];

export interface RouteSchema {
  id: string;
  data: Record<string, unknown>;
}

/** Destination-level node. Homepage only — inner pages describe narrower entities. */
export const buildTouristDestinationLd = (
  url: string,
  description: string,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'Bjorli',
  description,
  url,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Bjorliveien 84',
    addressLocality: 'Bjorli',
    postalCode: '2669',
    addressCountry: 'NO',
  },
  telephone: '+4748152200',
  geo: { '@type': 'GeoCoordinates', latitude: 62.05, longitude: 8.15 },
});

export interface RouteSchemaInput {
  /** Canonical route key ('home', 'skisenter', 'heiskort', …). */
  canonical: string;
  locale: Locale;
  /** Absolute URL of the page. */
  url: string;
  title: string;
  description: string;
  /** BCP-47 tag for `inLanguage`. */
  inLanguage?: string;
}

export const buildRouteSchemas = (o: RouteSchemaInput): RouteSchema[] => {
  const out: RouteSchema[] = [
    {
      id: SCHEMA_IDS.webPage,
      data: buildWebPage({
        url: o.url,
        name: o.title,
        description: o.description,
        inLanguage: o.inLanguage,
      }),
    },
  ];

  if (o.canonical === 'home') {
    out.push({
      id: SCHEMA_IDS.touristDestination,
      data: buildTouristDestinationLd(o.url, o.description),
    });
  }

  if (o.canonical === 'skisenter') {
    out.push({
      id: SCHEMA_IDS.skiResort,
      data: buildSkiResort(o.url, getSkiCenterData(o.locale).description),
    });
  }

  if (o.canonical === 'heiskort') {
    const faq = getSubPageData(o.locale, 'heiskort')?.faq;
    if (faq?.length) out.push({ id: SCHEMA_IDS.faq, data: buildFaqPage([...faq]) });
  }

  return out;
};
