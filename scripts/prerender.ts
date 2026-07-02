/**
 * Static prerender — Wave 1 public routes.
 *
 * Approach (see docs handoff):
 *  - This is a client-side React SPA (createRoot in src/main.tsx). React
 *    fully replaces the #root DOM on mount, so any prerendered body cannot
 *    cause a hydration mismatch. That makes template-based prerender the
 *    safest equivalent to StaticRouter for this specific codebase.
 *  - We generate one HTML file per (canonical Wave 1 route x locale) with:
 *      • correct <html lang>
 *      • localized <title>, <meta description>
 *      • self-referencing canonical
 *      • full hreflang alternates + x-default
 *      • og:title/description/locale/url + twitter:*
 *      • meaningful semantic <body> skeleton (H1 + hero paragraph + nav)
 *  - The Vite-generated bundle <script> tag from dist/index.html is
 *    preserved verbatim so client hydration/CSR takes over exactly as
 *    today. Runtime-only widgets (GA4/consent, Turnstile, contact form,
 *    event form, Fnugg, webcams, alerts) remain client-only.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { LOCALES, LOCALE_LABELS, LOCALE_PREFIX, type Locale } from '../src/i18n/locales/types';
import { ROUTE_SLUGS, slugForCanonical, type CanonicalRoute } from '../src/i18n/routes';
import { seoForCanonicalPath } from '../src/lib/seo/routeSeo';

const DIST = resolve(process.cwd(), 'dist');
const ORIGIN = (process.env.SITE_URL ?? 'https://bjorli.no').replace(/\/$/, '');

/** Wave 1 canonical routes only. */
const WAVE1: CanonicalRoute[] = [
  'home',
  'sommer',
  'vinter',
  'skisenter',
  'overnatting',
  'mat-og-drikke',
  'handel',
  'vaer-og-webkamera',
  'arrangementer',
  'kontakt',
];

/**
 * NOTE: `handel` is not in the CanonicalRoute registry (routes.ts).
 * We still emit a single /handel HTML (Norwegian only) below because it is
 * a Norwegian-only page in the current router. We handle it as a special
 * case at the bottom of the file.
 */
const HAS_HANDEL_IN_REGISTRY = 'handel' in ROUTE_SLUGS;

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
  if (canonical === 'home') return ORIGIN + (prefix || '/');
  const slug = slugForCanonical(canonical, locale);
  return ORIGIN + (prefix || '') + '/' + slug;
};

const buildHreflangs = (canonical: CanonicalRoute): HreflangAlt[] => {
  const alts: HreflangAlt[] = [];
  for (const loc of LOCALES) {
    alts.push({ hreflang: LOCALE_LABELS[loc].htmlLang, href: buildHref(loc, canonical) });
  }
  alts.push({ hreflang: 'x-default', href: buildHref('en', canonical) });
  return alts;
};

/** Body skeleton (semantic, crawler-visible). Replaced by React on hydrate. */
const bodySkeleton = (opts: {
  locale: Locale;
  title: string;
  description: string;
  canonical: CanonicalRoute;
}): string => {
  const { locale, title, description, canonical } = opts;
  const prefix = LOCALE_PREFIX[locale] || '';
  const homeHref = prefix || '/';
  // Small human-visible skeleton. Kept minimal so React swap is instant.
  const nav = [
    { label: 'Bjorli', href: homeHref },
    { label: slugForCanonical('sommer', locale) || 'sommer', href: `${prefix}/${slugForCanonical('sommer', locale)}` },
    { label: slugForCanonical('vinter', locale) || 'vinter', href: `${prefix}/${slugForCanonical('vinter', locale)}` },
    { label: slugForCanonical('skisenter', locale) || 'bjorli-skisenter', href: `${prefix}/${slugForCanonical('skisenter', locale)}` },
    { label: slugForCanonical('overnatting', locale) || 'overnatting', href: `${prefix}/${slugForCanonical('overnatting', locale)}` },
    { label: slugForCanonical('kontakt', locale) || 'kontakt', href: `${prefix}/${slugForCanonical('kontakt', locale)}` },
  ];
  const navHtml = nav
    .map((n) => `<a href="${escapeHtml(n.href)}">${escapeHtml(n.label)}</a>`)
    .join(' · ');
  return `<div id="root"><div data-prerender="wave1" style="min-height:100vh;padding:2rem 1.25rem;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0a2540;background:#f7f6f2">
  <header style="max-width:960px;margin:0 auto 2rem"><a href="${escapeHtml(homeHref)}" style="font-weight:700;font-size:1.125rem;text-decoration:none;color:inherit">Bjorli</a></header>
  <main style="max-width:960px;margin:0 auto">
    <h1 style="font-size:clamp(1.75rem,4vw,2.75rem);line-height:1.1;margin:0 0 1rem">${escapeHtml(title)}</h1>
    <p style="font-size:1.125rem;line-height:1.55;max-width:65ch;margin:0 0 1.5rem;color:#334">${escapeHtml(description)}</p>
    <nav aria-label="Primary" style="font-size:0.95rem;color:#456">${navHtml}</nav>
  </main>
</div></div>`;
};

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
  canonical: CanonicalRoute;
  title: string;
}

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

  const head = `<!doctype html>
<html lang="${escapeHtml(htmlLang)}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="author" content="Destinasjon Bjorli" />
    <meta name="theme-color" content="#001d28" />
    <link rel="canonical" href="${escapeHtml(href)}" />
    ${hreflangTags}
    <meta property="og:title" content="${escapeHtml(seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Bjorli" />
    <meta property="og:url" content="${escapeHtml(href)}" />
    <meta property="og:locale" content="${escapeHtml(ogLocale)}" />
    ${ogAlternates}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.description)}" />
    <meta name="twitter:site" content="@bjorli" />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    <link rel="icon" type="image/jpeg" href="/favicon.jpeg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.jpeg" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    ${base.preloads}
  </head>
  <body>
    ${bodySkeleton({ locale, title: seo.title, description: seo.description, canonical })}
    ${base.scripts}
  </body>
</html>
`;

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

const run = () => {
  const base = readBaseTemplate();
  const results: RouteOutput[] = [];
  const skipped: string[] = [];

  for (const canonical of WAVE1) {
    if (canonical === 'handel' && !HAS_HANDEL_IN_REGISTRY) continue;
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

  // /handel — Norwegian-only page in the router. Emit a single Norwegian
  // HTML at /handel/index.html using the ROUTE_SEO 'handel' entry.
  const handelSeo = seoForCanonicalPath('/handel', 'no');
  if (handelSeo) {
    const canonical = 'handel' as CanonicalRoute; // synthetic; only used for skeleton nav
    const href = ORIGIN + '/handel';
    // Hreflang: self only (Norwegian-only page).
    const hreflangTags = `<link rel="alternate" hreflang="no" href="${escapeHtml(href)}" />\n    <link rel="alternate" hreflang="x-default" href="${escapeHtml(href)}" />`;
    const html = `<!doctype html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(handelSeo.title)}</title>
    <meta name="description" content="${escapeHtml(handelSeo.description)}" />
    <meta name="author" content="Destinasjon Bjorli" />
    <meta name="theme-color" content="#001d28" />
    <link rel="canonical" href="${escapeHtml(href)}" />
    ${hreflangTags}
    <meta property="og:title" content="${escapeHtml(handelSeo.title)}" />
    <meta property="og:description" content="${escapeHtml(handelSeo.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Bjorli" />
    <meta property="og:url" content="${escapeHtml(href)}" />
    <meta property="og:locale" content="nb_NO" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(handelSeo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(handelSeo.description)}" />
    <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
    <link rel="icon" type="image/jpeg" href="/favicon.jpeg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.jpeg" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    ${base.preloads}
  </head>
  <body>
    ${bodySkeleton({ locale: 'no', title: handelSeo.title, description: handelSeo.description, canonical })}
    ${base.scripts}
  </body>
</html>
`;
    const abs = resolve(DIST, 'handel/index.html');
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, html, 'utf8');
    results.push({ filePath: 'handel/index.html', html, locale: 'no', canonical, title: handelSeo.title });
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
};

run();
