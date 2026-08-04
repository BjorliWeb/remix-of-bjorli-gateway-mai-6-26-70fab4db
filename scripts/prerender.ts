/**
 * Static prerender — Wave 1 + Wave 2 public routes.
 *
 * Approach (see docs handoff):
 *  - This is a client-side React SPA (createRoot in src/main.tsx). React
 *    fully replaces the #root DOM on mount, so any prerendered body cannot
 *    cause a hydration mismatch. That makes template-based prerender the
 *    safest equivalent to StaticRouter for this specific codebase.
 *  - We generate one HTML file per (canonical route x locale) for the
 *    routes listed in ROUTES below (Wave 1 hubs + Wave 2 static content,
 *    hubs and summer sub-pages). Each emitted file contains:
 *      • correct <html lang>
 *      • localized <title>, <meta description>
 *      • self-referencing canonical
 *      • full hreflang alternates + x-default
 *      • og:title/description/locale/url + twitter:*
 *      • WebPage JSON-LD (+ TouristDestination on home, id="jsonld-org"
 *        so runtime SEOHead takes it over instead of duplicating)
 *      • meaningful semantic <body> skeleton: H1 + lead + supporting
 *        paragraph (routeLeads.ts, distinct from title/description),
 *        expanded crawlable nav and per-page related links
 *  - The Vite-generated bundle <script> tag from dist/index.html is
 *    preserved verbatim so client hydration/CSR takes over exactly as
 *    today. Runtime-only widgets (GA4/consent, Turnstile, contact form,
 *    event form, Fnugg, webcams, alerts) remain client-only.
 *
 * Detail routes (`/nyheter/:slug`, `/arrangementer/:slug`, `/tips/:slug`,
 * `/aktiviteter/:slug`) are intentionally NOT prerendered here — they
 * need CMS data at build time and land in Wave 3.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { LOCALES, LOCALE_LABELS, LOCALE_PREFIX, type Locale } from '../src/i18n/locales/types';
import { ROUTE_SLUGS, slugForCanonical, type CanonicalRoute } from '../src/i18n/routes';
import { ogImageForCanonicalPath, seoForCanonicalPath, type RouteSeoEntry } from '../src/lib/seo/routeSeo';
import { leadForCanonicalPath, type RouteLeadEntry } from '../src/lib/seo/routeLeads';
import { buildWebPage } from '../src/lib/seo/schema';
import {
  SKI_HOLIDAY_NORWAY_LOCALE,
  SKI_HOLIDAY_NORWAY_PATH,
  SKI_HOLIDAY_NORWAY_SEO,
} from '../src/lib/seo/skiHolidayNorwaySeo';
import { absoluteUrl, normalizeInternalPath, CANONICAL_ORIGIN } from '../src/lib/url/normalizeInternalPath';

const DIST = resolve(process.cwd(), 'dist');
/**
 * Indexable URLs are pinned to the canonical apex origin regardless of the
 * build environment: a preview build must never bake a *.pages.dev or www
 * host into canonical / hreflang / og:url / JSON-LD.
 */
const ORIGIN = CANONICAL_ORIGIN;

/**
 * Canonical routes that get a prerendered HTML file per locale.
 *
 * Wave 1: primary destination hubs. Wave 2: static content pages, listing
 * hubs and summer sub-pages exposed in the audit report. Notes:
 *  - `handel` is a Norwegian-only page and is NOT in the CanonicalRoute
 *    registry — handled as a special case at the bottom of run().
 *  - `livecams` is intentionally excluded (Cloudflare 301 → vaer-og-webkamera).
 *  - `praktisk-info` is unpublished (see App.tsx) — do not prerender.
 *  - `ski-holiday-norway` is a CMS-driven landing without a ROUTE_SEO
 *    entry; skipped here, revisit when the CMS ships.
 */
const ROUTES: CanonicalRoute[] = [
  // Wave 1
  'home',
  'sommer',
  'vinter',
  'skisenter',
  'overnatting',
  'mat-og-drikke',
  'vaer-og-webkamera',
  'arrangementer',
  'kontakt',
  // Wave 2 — static content
  'heiskort',
  'apningstider',
  'skiskole',
  'skiutleie',
  'reisen-hit',
  'parkering',
  'personvern',
  'loypekart',
  'live',
  // Wave 2 — listing hubs (index only; detail :slug pages skipped)
  'tips',
  'nyheter',
  'aktiviteter',
  // Wave 2 — activity / summer sub-pages
  'langrenn',
  'fotturer',
  'sykling',
  'familie',
  'fiske',
  'gardsbesok',
  'golden-train',
  'romsdalsgondolen',
  'sagelva',
];

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

interface HreflangAlt {
  hreflang: string;
  href: string;
}

const buildHref = (locale: Locale, canonical: CanonicalRoute): string => {
  const prefix = LOCALE_PREFIX[locale];
  if (canonical === 'home') return absoluteUrl(prefix || '/', ORIGIN);
  const slug = slugForCanonical(canonical, locale);
  return absoluteUrl((prefix || '') + '/' + slug, ORIGIN);
};

const buildHreflangs = (canonical: CanonicalRoute): HreflangAlt[] => {
  const alts: HreflangAlt[] = [];
  for (const loc of LOCALES) {
    alts.push({ hreflang: LOCALE_LABELS[loc].htmlLang, href: buildHref(loc, canonical) });
  }
  alts.push({ hreflang: 'x-default', href: buildHref('en', canonical) });
  return alts;
};

/**
 * Link targets for the crawlable nav + related-links sections. `handel`
 * is not a CanonicalRoute (Norwegian-only page outside the registry) so
 * links model it explicitly; it is filtered out for non-NO locales.
 */
type LinkTarget = CanonicalRoute | 'handel';

/**
 * Human-readable link labels for the prerender skeleton. Kept local to this
 * script so we don't couple the build-time renderer to runtime i18n bundles.
 * Only used for the crawler-visible nav/related links; React replaces this
 * on mount. `handel` has a label only in Norwegian (page is NO-only).
 */
const PAGE_LABELS: Record<Locale, Partial<Record<LinkTarget, string>>> = {
  no: {
    home: 'Bjorli', sommer: 'Sommer', vinter: 'Vinter', aktiviteter: 'Aktiviteter',
    'vaer-og-webkamera': 'Vær og webkamera', arrangementer: 'Hva skjer',
    skisenter: 'Bjorli Skisenter', overnatting: 'Overnatting', 'mat-og-drikke': 'Mat og drikke',
    handel: 'Handel', kontakt: 'Kontakt', fotturer: 'Fotturer', sykling: 'Sykling',
    fiske: 'Fiske', familie: 'Familie', gardsbesok: 'Gårdsbesøk', 'golden-train': 'Golden Train',
    romsdalsgondolen: 'Romsdalsgondolen', sagelva: 'Sagelva', heiskort: 'Heiskort',
    apningstider: 'Åpningstider', skiskole: 'Skiskole', skiutleie: 'Skiutleie',
  },
  en: {
    home: 'Bjorli', sommer: 'Summer', vinter: 'Winter', aktiviteter: 'Activities',
    'vaer-og-webkamera': 'Weather and webcams', arrangementer: "What's on",
    skisenter: 'Bjorli Ski Resort', overnatting: 'Accommodation', 'mat-og-drikke': 'Food and drink',
    kontakt: 'Contact', fotturer: 'Hiking', sykling: 'Cycling',
    fiske: 'Fishing', familie: 'Family', gardsbesok: 'Farm visits', 'golden-train': 'Golden Train',
    romsdalsgondolen: 'Romsdalsgondolen', sagelva: 'Sagelva', heiskort: 'Ski passes',
    apningstider: 'Opening hours', skiskole: 'Ski school', skiutleie: 'Ski rental',
  },
  de: {
    home: 'Bjorli', sommer: 'Sommer', vinter: 'Winter', aktiviteter: 'Aktivitäten',
    'vaer-og-webkamera': 'Wetter und Webcams', arrangementer: 'Veranstaltungen',
    skisenter: 'Bjorli Skigebiet', overnatting: 'Unterkunft', 'mat-og-drikke': 'Essen und Trinken',
    kontakt: 'Kontakt', fotturer: 'Wandern', sykling: 'Radfahren',
    fiske: 'Angeln', familie: 'Familie', gardsbesok: 'Hofbesuche', 'golden-train': 'Golden Train',
    romsdalsgondolen: 'Romsdalsgondolen', sagelva: 'Sagelva', heiskort: 'Skipässe',
    apningstider: 'Öffnungszeiten', skiskole: 'Skischule', skiutleie: 'Skiverleih',
  },
  nl: {
    home: 'Bjorli', sommer: 'Zomer', vinter: 'Winter', aktiviteter: 'Activiteiten',
    'vaer-og-webkamera': 'Weer en webcams', arrangementer: 'Evenementen',
    skisenter: 'Bjorli Skigebied', overnatting: 'Accommodatie', 'mat-og-drikke': 'Eten en drinken',
    kontakt: 'Contact', fotturer: 'Wandelen', sykling: 'Fietsen',
    fiske: 'Vissen', familie: 'Familie', gardsbesok: 'Boerderijbezoek', 'golden-train': 'Golden Train',
    romsdalsgondolen: 'Romsdalsgondolen', sagelva: 'Sagelva', heiskort: 'Skipassen',
    apningstider: 'Openingstijden', skiskole: 'Skischool', skiutleie: 'Skiverhuur',
  },
  da: {
    home: 'Bjorli', sommer: 'Sommer', vinter: 'Vinter', aktiviteter: 'Aktiviteter',
    'vaer-og-webkamera': 'Vejr og webcams', arrangementer: 'Det sker',
    skisenter: 'Bjorli Skicenter', overnatting: 'Overnatning', 'mat-og-drikke': 'Mad og drikke',
    kontakt: 'Kontakt', fotturer: 'Vandring', sykling: 'Cykling',
    fiske: 'Fiskeri', familie: 'Familie', gardsbesok: 'Gårdsbesøg', 'golden-train': 'Golden Train',
    romsdalsgondolen: 'Romsdalsgondolen', sagelva: 'Sagelva', heiskort: 'Liftkort',
    apningstider: 'Åbningstider', skiskole: 'Skiskole', skiutleie: 'Skiudlejning',
  },
  sv: {
    home: 'Bjorli', sommer: 'Sommar', vinter: 'Vinter', aktiviteter: 'Aktiviteter',
    'vaer-og-webkamera': 'Väder och webbkameror', arrangementer: 'På gång',
    skisenter: 'Bjorli Skidanläggning', overnatting: 'Boende', 'mat-og-drikke': 'Mat och dryck',
    kontakt: 'Kontakt', fotturer: 'Vandring', sykling: 'Cykling',
    fiske: 'Fiske', familie: 'Familj', gardsbesok: 'Gårdsbesök', 'golden-train': 'Golden Train',
    romsdalsgondolen: 'Romsdalsgondolen', sagelva: 'Sagelva', heiskort: 'Liftkort',
    apningstider: 'Öppettider', skiskole: 'Skidskola', skiutleie: 'Skiduthyrning',
  },
};

/** Crawlable primary nav — the main destination sections in site order. */
const NAV_ROUTES: LinkTarget[] = [
  'home', 'sommer', 'vinter', 'aktiviteter', 'vaer-og-webkamera', 'arrangementer',
  'skisenter', 'overnatting', 'mat-og-drikke', 'handel', 'kontakt',
];

/**
 * Page-specific related links ("Se også") for priority routes. Routes not
 * listed here render no related section — just the primary nav.
 */
const RELATED_LINKS: Partial<Record<LinkTarget, LinkTarget[]>> = {
  home: ['sommer', 'vinter', 'aktiviteter', 'vaer-og-webkamera', 'overnatting', 'arrangementer'],
  sommer: ['fotturer', 'sykling', 'fiske', 'familie', 'overnatting', 'vaer-og-webkamera'],
  vinter: ['skisenter', 'heiskort', 'apningstider', 'skiskole', 'skiutleie', 'vaer-og-webkamera'],
  aktiviteter: ['fotturer', 'sykling', 'fiske', 'familie', 'gardsbesok', 'golden-train', 'romsdalsgondolen', 'sagelva'],
  'vaer-og-webkamera': ['sommer', 'vinter', 'aktiviteter', 'skisenter', 'overnatting'],
  overnatting: ['aktiviteter', 'vaer-og-webkamera', 'mat-og-drikke', 'skisenter'],
  skisenter: ['heiskort', 'apningstider', 'skiskole', 'skiutleie', 'vaer-og-webkamera'],
  'mat-og-drikke': ['overnatting', 'aktiviteter', 'handel'],
  handel: ['mat-og-drikke', 'overnatting', 'aktiviteter'],
  kontakt: ['overnatting', 'vaer-og-webkamera', 'aktiviteter'],
  sykling: ['fotturer', 'fiske', 'sommer', 'aktiviteter', 'overnatting'],
  fotturer: ['sykling', 'fiske', 'familie', 'sommer', 'overnatting'],
  fiske: ['fotturer', 'sykling', 'sommer', 'overnatting'],
  familie: ['aktiviteter', 'sommer', 'vinter', 'overnatting', 'arrangementer'],
  arrangementer: ['aktiviteter', 'overnatting', 'vaer-og-webkamera', 'mat-og-drikke'],
};

const RELATED_HEADING: Record<Locale, string> = {
  no: 'Se også', en: 'See also', de: 'Siehe auch', nl: 'Zie ook', da: 'Se også', sv: 'Se även',
};

/** Href for a link target in a given locale. `handel` exists only at /handel (NO). */
const hrefForTarget = (target: LinkTarget, locale: Locale): string => {
  const prefix = LOCALE_PREFIX[locale] || '';
  if (target === 'handel') return normalizeInternalPath('/handel');
  if (target === 'home') return normalizeInternalPath(prefix || '/');
  return normalizeInternalPath(`${prefix}/${slugForCanonical(target, locale)}`);
};

/** Localized nav/related link list; drops `handel` outside Norwegian. */
const linksFor = (targets: LinkTarget[], locale: Locale): { label: string; href: string }[] =>
  targets
    .filter((t) => t !== 'handel' || locale === 'no')
    .map((t) => ({ label: PAGE_LABELS[locale][t] ?? t, href: hrefForTarget(t, locale) }));

/** Body skeleton (semantic, crawler-visible). Replaced by React on hydrate. */
const bodySkeleton = (opts: {
  locale: Locale;
  title: string;
  description: string;
  /** Skeleton key used for nav/related links only — not an SEO canonical. */
  canonical: LinkTarget | string;
  lead: RouteLeadEntry | null;
}): string => {
  const { locale, title, description, canonical, lead } = opts;
  const prefix = LOCALE_PREFIX[locale] || '';
  const homeHref = normalizeInternalPath(prefix || '/');
  // Crawler-visible skeleton: H1 distinct from <title>, lead distinct from
  // meta description (both fall back to the old behaviour when no entry
  // exists), expanded primary nav and per-page related links.
  const navHtml = linksFor(NAV_ROUTES, locale)
    .map((n) => `<a href="${escapeHtml(n.href)}">${escapeHtml(n.label)}</a>`)
    .join(' · ');
  const h1 = lead?.h1 ?? title;
  const leadText = lead?.lead ?? description;
  const supportingHtml = lead?.supporting
    ? `\n    <p style="font-size:1.05rem;line-height:1.55;max-width:65ch;margin:0 0 1.5rem;color:#334">${escapeHtml(lead.supporting)}</p>`
    : '';
  const related = RELATED_LINKS[canonical as LinkTarget];
  const relatedItems = related ? linksFor(related, locale) : [];
  const relatedHtml = relatedItems.length
    ? `\n    <section style="margin:0 0 1.5rem">
      <h2 style="font-size:1.125rem;margin:0 0 0.5rem">${escapeHtml(RELATED_HEADING[locale])}</h2>
      <ul style="margin:0;padding-left:1.25rem;line-height:1.7">
        ${relatedItems.map((n) => `<li><a href="${escapeHtml(n.href)}">${escapeHtml(n.label)}</a></li>`).join('\n        ')}
      </ul>
    </section>`
    : '';
  return `<div id="root"><div data-prerender="pr2" data-canonical="${escapeHtml(canonical)}" data-locale="${escapeHtml(locale)}" style="min-height:100vh;padding:2rem 1.25rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0a2540;background:#f7f6f2">
  <header style="max-width:960px;margin:0 auto 2rem">
    <a href="${escapeHtml(homeHref)}" style="font-weight:700;font-size:1.125rem;text-decoration:none;color:inherit">Bjorli</a>
    <nav aria-label="Primary" style="font-size:0.95rem;color:#456;margin-top:0.5rem">${navHtml}</nav>
  </header>
  <main style="max-width:960px;margin:0 auto">
    <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);line-height:1.1;margin:0 0 1rem">${escapeHtml(h1)}</h1>
    <p style="font-size:1.125rem;line-height:1.55;max-width:65ch;margin:0 0 1.5rem;color:#334">${escapeHtml(leadText)}</p>${supportingHtml}${relatedHtml}
  </main>
</div></div>`;
};

/**
 * Serialize a JSON-LD block for the static head. Escapes "<" as unicode
 * u003c so content can never close the script tag early. The homepage
 * TouristDestination reuses id="jsonld-org" so the runtime SEOHead takes
 * over the same element on hydration instead of appending a duplicate.
 */
const jsonLdScript = (data: Record<string, unknown>, id?: string): string =>
  `<script type="application/ld+json"${id ? ` id="${id}"` : ''}>${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

/**
 * TouristDestination for the homepage — same shape SEOHead writes at runtime.
 * No `inLanguage`: TouristDestination is a Place subtype and schema.org does
 * not define `inLanguage` on Place (it stays on WebPage, which is valid).
 */
const touristDestinationLd = (locale: Locale, description: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'TouristDestination',
  name: 'Bjorli',
  description,
  url: absoluteUrl(LOCALE_PREFIX[locale] || '/', ORIGIN),
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

/** Extract the Vite bundle <script> + preload <link>s from dist/index.html. */
const readBaseTemplate = (): { scripts: string; preloads: string } => {
  const p = resolve(DIST, 'index.html');
  if (!existsSync(p)) {
    throw new Error(
      `[prerender] dist/index.html not found. Run \`vite build\` before prerender.`,
    );
  }
  const html = readFileSync(p, 'utf8');
  // Grab all module scripts + modulepreload/preload/stylesheet <link>s that
  // Vite injected. We keep them verbatim so hashed asset names match.
  const scripts = Array.from(html.matchAll(/<script\b[^>]*type="module"[^>]*><\/script>/g))
    .map((m) => m[0])
    .join('\n    ');
  const preloads = Array.from(
    html.matchAll(/<link\b[^>]*rel="(?:modulepreload|preload|stylesheet)"[^>]*>/g),
  )
    .map((m) => m[0])
    .join('\n    ');
  if (!scripts) {
    throw new Error('[prerender] Could not find module script tag in dist/index.html');
  }
  return { scripts, preloads };
};

interface RouteOutput {
  filePath: string; // relative to dist
  html: string;
  locale: Locale;
  /** Grouping key for the build log — canonical route or standalone key. */
  canonical: string;
  title: string;
}

/**
 * Shared head+body document template. Used by the per-locale canonical
 * routes and by the standalone pages (handel, tafjordfjella, the EN-only
 * ski-holiday landing) so every prerendered file has identical structure.
 */
const buildHtmlDocument = (o: {
  htmlLang: string;
  title: string;
  description: string;
  href: string;
  hreflangTags: string;
  ogLocale: string;
  ogAlternates: string;
  ogImage: string;
  jsonLdTags: string;
  bodyHtml: string;
  base: { scripts: string; preloads: string };
}): string => `<!doctype html>
<html lang="${escapeHtml(o.htmlLang)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(o.title)}</title>
    <meta name="description" content="${escapeHtml(o.description)}" />
    <meta name="author" content="Destinasjon Bjorli" />
    <meta name="theme-color" content="#001d28" />
    <link rel="canonical" href="${escapeHtml(o.href)}" />
    ${o.hreflangTags}
    <meta property="og:title" content="${escapeHtml(o.title)}" />
    <meta property="og:description" content="${escapeHtml(o.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Bjorli" />
    <meta property="og:url" content="${escapeHtml(o.href)}" />
    <meta property="og:locale" content="${escapeHtml(o.ogLocale)}" />
    ${o.ogAlternates}
    <meta property="og:image" content="${escapeHtml(o.ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(o.title)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(o.title)}" />
    <meta name="twitter:description" content="${escapeHtml(o.description)}" />
    <meta name="twitter:image" content="${escapeHtml(o.ogImage)}" />
    <meta name="twitter:site" content="@bjorli" />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    <link rel="icon" type="image/jpeg" href="/favicon.jpeg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.jpeg" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    ${o.jsonLdTags}
    ${o.base.preloads}
  </head>
  <body>
    ${o.bodyHtml}
    ${o.base.scripts}
  </body>
</html>
`;

/** `/sommer/tafjordfjella` and its localized siblings (parent slug translated). */
const tafjordfjellaPath = (locale: Locale): string => {
  const prefix = LOCALE_PREFIX[locale] || '';
  return `${prefix}/${slugForCanonical('sommer', locale)}/tafjordfjella`;
};

/**
 * A page rendered outside the (canonical route x locale) matrix: NO-only
 * /handel, the Tafjordfjella family, and the EN-only ski-holiday landing.
 */
interface StandaloneSpec {
  /** Path with leading slash, no trailing slash — e.g. `/en/summer/tafjordfjella`. */
  path: string;
  locale: Locale;
  seo: RouteSeoEntry;
  /** Canonical (NO) path used for the OG image + lead lookups. */
  seoLookupPath: string;
  hreflangs: HreflangAlt[];
  /** Skeleton nav/related key. */
  skeletonKey: LinkTarget | string;
  /** Grouping key for the build log. */
  groupKey: string;
}

const renderStandalone = (
  spec: StandaloneSpec,
  base: { scripts: string; preloads: string },
): RouteOutput => {
  const { locale, seo } = spec;
  const href = absoluteUrl(spec.path, ORIGIN);
  const hreflangTags = spec.hreflangs
    .map(
      (a) =>
        `<link rel="alternate" hreflang="${escapeHtml(a.hreflang)}" href="${escapeHtml(a.href)}" />`,
    )
    .join('\n    ');
  // Only advertise og:locale:alternate for locales this page actually has.
  const ogAlternates = spec.hreflangs
    .filter((a) => a.hreflang !== 'x-default')
    .map((a) => LOCALES.find((l) => LOCALE_LABELS[l].htmlLang === a.hreflang))
    .filter((l): l is Locale => !!l && l !== locale)
    .map(
      (l) =>
        `<meta property="og:locale:alternate" content="${escapeHtml(LOCALE_LABELS[l].ogLocale)}" />`,
    )
    .join('\n    ');
  const jsonLdTags = jsonLdScript(
    buildWebPage({
      url: href,
      name: seo.title,
      description: seo.description,
      inLanguage: LOCALE_LABELS[locale].bcp47,
    }),
  );
  const html = buildHtmlDocument({
    htmlLang: LOCALE_LABELS[locale].htmlLang,
    title: seo.title,
    description: seo.description,
    href,
    hreflangTags,
    ogLocale: LOCALE_LABELS[locale].ogLocale,
    ogAlternates,
    ogImage: ORIGIN + ogImageForCanonicalPath(spec.seoLookupPath),
    jsonLdTags,
    bodyHtml: bodySkeleton({
      locale,
      title: seo.title,
      description: seo.description,
      canonical: spec.skeletonKey,
      lead: leadForCanonicalPath(spec.seoLookupPath, locale),
    }),
    base,
  });
  return {
    filePath: `${spec.path.replace(/^\//, '')}/index.html`,
    html,
    locale,
    canonical: spec.groupKey,
    title: seo.title,
  };
};

const renderRoute = (
  canonical: CanonicalRoute,
  locale: Locale,
  base: { scripts: string; preloads: string },
): RouteOutput | null => {
  const seo = seoForCanonicalPath(
    canonical === 'home' ? '/' : '/' + canonical,
    locale,
  );
  if (!seo) return null;

  const href = buildHref(locale, canonical);
  const hreflangs = buildHreflangs(canonical);
  const htmlLang = LOCALE_LABELS[locale].htmlLang;
  const ogLocale = LOCALE_LABELS[locale].ogLocale;
  const ogImage =
    ORIGIN + ogImageForCanonicalPath(canonical === 'home' ? '/' : '/' + canonical);
  const lead = leadForCanonicalPath(canonical === 'home' ? '/' : '/' + canonical, locale);

  // Static JSON-LD: WebPage on every route; TouristDestination on home
  // (id matches SEOHead so hydration replaces rather than duplicates it).
  const jsonLdTags = [
    jsonLdScript(
      buildWebPage({
        url: href,
        name: seo.title,
        description: seo.description,
        inLanguage: LOCALE_LABELS[locale].bcp47,
      }),
    ),
    ...(canonical === 'home'
      ? [jsonLdScript(touristDestinationLd(locale, seo.description), 'jsonld-org')]
      : []),
  ].join('\n    ');

  const hreflangTags = hreflangs
    .map(
      (a) =>
        `<link rel="alternate" hreflang="${escapeHtml(a.hreflang)}" href="${escapeHtml(a.href)}" />`,
    )
    .join('\n    ');

  const ogAlternates = LOCALES.filter((l) => l !== locale)
    .map(
      (l) =>
        `<meta property="og:locale:alternate" content="${escapeHtml(LOCALE_LABELS[l].ogLocale)}" />`,
    )
    .join('\n    ');

  const head = buildHtmlDocument({
    htmlLang,
    title: seo.title,
    description: seo.description,
    href,
    hreflangTags,
    ogLocale,
    ogAlternates,
    ogImage,
    jsonLdTags,
    bodyHtml: bodySkeleton({
      locale,
      title: seo.title,
      description: seo.description,
      canonical,
      lead,
    }),
    base,
  });

  // File path: dist/<locale-prefix>/<slug>/index.html
  //   / -> dist/index.html
  //   /en -> dist/en/index.html
  //   /en/summer -> dist/en/summer/index.html
  const prefix = LOCALE_PREFIX[locale];
  let relPath: string;
  if (canonical === 'home') {
    relPath = prefix ? `${prefix.replace(/^\//, '')}/index.html` : 'index.html';
  } else {
    const slug = slugForCanonical(canonical, locale);
    const prefixPart = prefix ? prefix.replace(/^\//, '') + '/' : '';
    relPath = `${prefixPart}${slug}/index.html`;
  }

  return { filePath: relPath, html: head, locale, canonical, title: seo.title };
};

const writeOutput = (out: RouteOutput): void => {
  const abs = resolve(DIST, out.filePath);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, out.html, 'utf8');
};

/**
 * Build-time assertion: every HTML URL advertised in public/sitemap.xml
 * must have a matching prerendered file in dist. Runs AFTER prerender so
 * the dist output exists.
 *
 *   https://bjorli.no/                    -> dist/index.html
 *   https://bjorli.no/sommer/             -> dist/sommer/index.html
 *   https://bjorli.no/ski-holiday-norway/ -> dist/ski-holiday-norway/index.html
 *
 * Direction is one-way: a prerendered page that is not in the sitemap is
 * fine; a sitemap URL without a prerendered page is a build failure.
 * Non-HTML resources (sitemaps, feeds, files with an extension) are ignored.
 */
const assertSitemapCoverage = (): void => {
  const sitemapPath = resolve(process.cwd(), 'public/sitemap.xml');
  if (!existsSync(sitemapPath)) {
    throw new Error('[prerender] public/sitemap.xml not found — run build-sitemap first.');
  }
  const xml = readFileSync(sitemapPath, 'utf8');
  const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) =>
    m[1].replace(/&amp;/g, '&').trim(),
  );

  const failures: { url: string; expected: string }[] = [];
  let checked = 0;
  for (const loc of locs) {
    let pathname: string;
    try {
      pathname = new URL(loc).pathname;
    } catch {
      failures.push({ url: loc, expected: '(unparseable URL in sitemap)' });
      continue;
    }
    // Sitemap <loc> values may be percent-encoded (non-ASCII slugs such as
    // /sv/spårkarta/); dist paths are written with the raw characters.
    let decoded = pathname;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      /* keep the raw pathname if it is not valid percent-encoding */
    }
    const clean = decoded.replace(/\/+$/, '');
    const lastSegment = clean.split('/').pop() ?? '';
    // Skip non-HTML resources: sitemaps, feeds, anything with a file extension.
    if (/\.[a-z0-9]{2,5}$/i.test(lastSegment)) continue;
    checked += 1;
    const rel = clean === '' ? 'index.html' : `${clean.replace(/^\//, '')}/index.html`;
    if (!existsSync(resolve(DIST, rel))) {
      failures.push({ url: loc, expected: `dist/${rel}` });
    }
  }

  if (failures.length) {
    const detail = failures
      .map((f) => `  - ${f.url}\n      expected prerendered file: ${f.expected}`)
      .join('\n');
    throw new Error(
      `[prerender] sitemap coverage FAILED — ${failures.length} of ${checked} sitemap HTML URL(s) have no prerendered page:\n${detail}`,
    );
  }
  // eslint-disable-next-line no-console
  console.log(
    `[prerender] sitemap coverage: all ${checked} sitemap HTML URLs have a matching prerendered file.`,
  );
};

const run = () => {
  // (see assertSitemapCoverage below — it runs last, once dist is written)
  const base = readBaseTemplate();
  const results: RouteOutput[] = [];
  const skipped: string[] = [];

  for (const canonical of ROUTES) {
    for (const locale of LOCALES) {
      const out = renderRoute(canonical, locale, base);
      if (!out) {
        skipped.push(`${canonical}@${locale}`);
        continue;
      }
      writeOutput(out);
      results.push(out);
    }
  }

  // ── Standalone pages outside the (route x locale) matrix ─────────────
  const standalones: StandaloneSpec[] = [];

  // /handel — Norwegian-only page in the router; hreflang self only.
  const handelSeo = seoForCanonicalPath('/handel', 'no');
  if (handelSeo) {
    const handelHref = absoluteUrl('/handel', ORIGIN);
    standalones.push({
      path: '/handel',
      locale: 'no',
      seo: handelSeo,
      seoLookupPath: '/handel',
      hreflangs: [
        { hreflang: 'no', href: handelHref },
        { hreflang: 'x-default', href: handelHref },
      ],
      skeletonKey: 'handel',
      groupKey: 'handel',
    });
  }

  // /sommer/tafjordfjella + localized siblings — real routes in App.tsx
  // with their own ROUTE_SEO entries, listed in sitemap.xml.
  const tafjordHreflangs: HreflangAlt[] = LOCALES.map((l) => ({
    hreflang: LOCALE_LABELS[l].htmlLang,
    href: absoluteUrl(tafjordfjellaPath(l), ORIGIN),
  }));
  tafjordHreflangs.push({
    hreflang: 'x-default',
    href: absoluteUrl(tafjordfjellaPath('en'), ORIGIN),
  });
  for (const locale of LOCALES) {
    const seo = seoForCanonicalPath('/sommer/tafjordfjella', locale);
    if (!seo) {
      skipped.push(`sommer/tafjordfjella@${locale}`);
      continue;
    }
    standalones.push({
      path: tafjordfjellaPath(locale),
      locale,
      seo,
      seoLookupPath: '/sommer/tafjordfjella',
      hreflangs: tafjordHreflangs,
      skeletonKey: 'sommer',
      groupKey: 'sommer/tafjordfjella',
    });
  }

  // /ski-holiday-norway — EN-only landing, no locale prefix and no
  // localized variants (see src/lib/seo/skiHolidayNorwaySeo.ts).
  const skiHolidayHref = absoluteUrl(SKI_HOLIDAY_NORWAY_PATH, ORIGIN);
  standalones.push({
    path: SKI_HOLIDAY_NORWAY_PATH,
    locale: SKI_HOLIDAY_NORWAY_LOCALE,
    seo: { ...SKI_HOLIDAY_NORWAY_SEO },
    seoLookupPath: '/vinter',
    hreflangs: [
      { hreflang: 'en', href: skiHolidayHref },
      { hreflang: 'x-default', href: skiHolidayHref },
    ],
    skeletonKey: 'skisenter',
    groupKey: 'ski-holiday-norway',
  });

  for (const spec of standalones) {
    const out = renderStandalone(spec, base);
    writeOutput(out);
    results.push(out);
  }

  const grouped: Record<string, number> = {};
  for (const r of results) grouped[r.canonical] = (grouped[r.canonical] ?? 0) + 1;

  // eslint-disable-next-line no-console
  console.log(
    `[prerender] wrote ${results.length} HTML files across ${Object.keys(grouped).length} canonical routes:`,
  );
  for (const [k, v] of Object.entries(grouped)) {
    // eslint-disable-next-line no-console
    console.log(`  - ${k}: ${v} locales`);
  }
  if (skipped.length) {
    // eslint-disable-next-line no-console
    console.warn(`[prerender] skipped (no SEO entry): ${skipped.join(', ')}`);
  }

  // ── Coverage check ────────────────────────────────────────────────
  // Warn (do not fail the build) when a canonical route exists in the
  // route registry but is not covered by prerender. This flags any new
  // public page added after Wave 2 so it can be scheduled for a future
  // wave. We deliberately skip routes we know are excluded on purpose.
  const EXCLUDED_FROM_COVERAGE: ReadonlySet<CanonicalRoute> = new Set<CanonicalRoute>([
    'livecams', // legacy alias; Cloudflare 301 → vaer-og-webkamera
    'praktisk-info', // unpublished (see App.tsx)
  ]);
  const covered = new Set<string>(ROUTES);
  const missing: CanonicalRoute[] = (Object.keys(ROUTE_SLUGS) as CanonicalRoute[]).filter(
    (k) => !covered.has(k) && !EXCLUDED_FROM_COVERAGE.has(k),
  );
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn(
      `[prerender] coverage: ${missing.length} canonical route(s) in registry but NOT prerendered — consider adding to ROUTES:\n  - ${missing.join('\n  - ')}`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.log('[prerender] coverage: all indexable canonical routes are prerendered.');
  }

  assertSitemapCoverage();
};

run();
