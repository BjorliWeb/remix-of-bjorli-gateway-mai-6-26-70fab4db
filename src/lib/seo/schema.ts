/**
 * Reusable schema.org JSON-LD builders for Bjorli.
 *
 * These are pure functions — call them from page components and pass the
 * result to `<JsonLd>`. Keep them factual and minimal: only emit fields
 * we can actually populate. Empty / undefined values are stripped.
 *
 * Coverage:
 *   - Organization
 *   - TouristDestination
 *   - SkiResort + LocalBusiness (Bjorli Skisenter)
 *   - LodgingBusiness (Accommodation)
 *   - FoodEstablishment (Mat & drikke)
 *   - Place
 *   - Article / NewsArticle
 *   - Event
 *   - FAQPage
 *   - BreadcrumbList
 *   - WebPage (fallback)
 */

const BJORLI_GEO = { latitude: 62.05, longitude: 8.15 } as const;

const BJORLI_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Bjorliveien 84',
  addressLocality: 'Bjorli',
  postalCode: '2669',
  addressRegion: 'Innlandet',
  addressCountry: 'NO',
} as const;

const strip = <T extends Record<string, unknown>>(obj: T): T => {
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    if (v === undefined || v === null || v === '') delete obj[k];
  });
  return obj;
};

export const buildOrganization = (siteUrl: string) =>
  strip({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Destinasjon Bjorli',
    url: siteUrl,
    logo: `${siteUrl}/apple-touch-icon.jpeg`,
    address: BJORLI_ADDRESS,
    sameAs: [
      'https://www.facebook.com/bjorliskisenter',
      'https://www.instagram.com/bjorliskisenter/',
    ],
  });

export const buildTouristDestination = (siteUrl: string, description?: string) =>
  strip({
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Bjorli',
    description,
    url: siteUrl,
    address: BJORLI_ADDRESS,
    geo: { '@type': 'GeoCoordinates', ...BJORLI_GEO },
    touristType: ['SkiResort', 'FamilyHoliday', 'NatureLover', 'WinterSports'],
  });

export const buildSkiResort = (url: string, description?: string) =>
  strip({
    '@context': 'https://schema.org',
    '@type': ['SkiResort', 'LocalBusiness'],
    name: 'Bjorli Skisenter',
    description,
    url,
    address: BJORLI_ADDRESS,
    geo: { '@type': 'GeoCoordinates', ...BJORLI_GEO },
    telephone: '+4748152200',
    priceRange: '$$',
  });

export const buildLodgingBusiness = (params: {
  url: string;
  name: string;
  description?: string;
  image?: string;
  bookingUrl?: string;
}) =>
  strip({
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: params.name,
    description: params.description,
    url: params.url,
    image: params.image,
    address: BJORLI_ADDRESS,
    geo: { '@type': 'GeoCoordinates', ...BJORLI_GEO },
    potentialAction: params.bookingUrl
      ? { '@type': 'ReserveAction', target: params.bookingUrl }
      : undefined,
  });

export const buildFoodEstablishment = (params: {
  url: string;
  name: string;
  description?: string;
  image?: string;
  menuUrl?: string;
}) =>
  strip({
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: params.name,
    description: params.description,
    url: params.url,
    image: params.image,
    hasMenu: params.menuUrl,
    address: BJORLI_ADDRESS,
    geo: { '@type': 'GeoCoordinates', ...BJORLI_GEO },
  });

export const buildPlace = (params: { url: string; name: string; description?: string }) =>
  strip({
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: params.name,
    description: params.description,
    url: params.url,
    address: BJORLI_ADDRESS,
    geo: { '@type': 'GeoCoordinates', ...BJORLI_GEO },
  });

export const buildFaqPage = (faq: { q: string; a: string }[]) =>
  strip({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });

export const buildBreadcrumb = (items: { label: string; url?: string }[]) =>
  strip({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.url,
    })),
  });

export const buildWebPage = (params: {
  url: string;
  name: string;
  description?: string;
  inLanguage?: string;
}) =>
  strip({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.name,
    description: params.description,
    url: params.url,
    inLanguage: params.inLanguage,
    isPartOf: { '@type': 'WebSite', name: 'bjorli.no', url: new URL(params.url).origin },
  });