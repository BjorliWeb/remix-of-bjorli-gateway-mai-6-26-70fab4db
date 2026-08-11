import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import { LOCALES, LOCALE_LABELS, LOCALE_PREFIX, type Locale } from '@/i18n/translations';
import { stripLocalePrefix } from '@/i18n/useLocalizedPath';
import { translatePath } from '@/i18n/routes';
import { resolveSeoForRoute } from '@/lib/cms';
import { seoForCanonicalPath } from '@/lib/seo/routeSeo';
import { trackPageView } from '@/lib/analytics';
import { isProductionOrigin } from '@/lib/seo/origin';
import { isInternalNoindexPath } from '@/lib/seo/internalRoutes';
import { absoluteUrl, CANONICAL_ORIGIN } from '@/lib/url/normalizeInternalPath';

interface SeoData {
  title: string;
  description: string | null;
  og_image_url: string | null;
  keywords: string | null;
}

const seoByLocale: Record<Locale, { title: string; description: string; keywords: string }> = {
  no: {
    title: 'Bjorli – sommer, vinter og fjellopplevelser',
    description: 'Opplev Bjorli øverst i Gudbrandsdalen, ved grensen til Romsdalen. Finn alpint, langrenn, fotturer, sykling, fiske, overnatting og arrangementer.',
    keywords: 'bjorli, destinasjon bjorli, snøsikre bjorli, bjorli skisenter, vinterferie norge, hytte bjorli, romsdalen, ski, langrenn',
  },
  en: {
    title: 'Bjorli – summer, winter and mountain experiences',
    description: 'Bjorli lies in the upper part of Gudbrandsdalen, right by the Romsdalen border. Skiing, hiking, cycling, fishing, places to stay and events all year.',
    keywords: 'bjorli, bjorli norway, snow sure ski resort, ski holiday norway, romsdalen, alpine skiing, cross country skiing, family ski',
  },
  de: {
    title: 'Bjorli – Sommer, Winter und Bergerlebnisse',
    description: 'Bjorli liegt im oberen Gudbrandsdalen, direkt an der Grenze zum Romsdalen. Ski, Langlauf, Wandern, Radfahren, Angeln, Unterkünfte und Veranstaltungen.',
    keywords: 'bjorli, bjorli norwegen, schneesicheres skigebiet, skiurlaub norwegen, romsdal, alpinski, langlauf, familienurlaub norwegen',
  },
  nl: {
    title: 'Bjorli – zomer, winter en bergbelevingen',
    description: 'Bjorli ligt boven in Gudbrandsdalen, direct aan de grens met Romsdalen. Skiën, langlaufen, wandelen, fietsen, vissen, overnachten en evenementen.',
    keywords: 'bjorli, bjorli noorwegen, sneeuwzeker skigebied, skivakantie noorwegen, romsdalen, alpineskiën, langlaufen, gezinsvakantie noorwegen',
  },
  da: {
    title: 'Bjorli – sommer, vinter og fjeldoplevelser',
    description: 'Oplev Bjorli øverst i Gudbrandsdalen, ved grænsen til Romsdalen. Find alpint, langrend, vandreture, cykling, fiskeri, overnatning og arrangementer.',
    keywords: 'bjorli, bjorli norge, snøsikker skicenter, skiferie norge, romsdalen, alpint, langrend, familieferie norge',
  },
  sv: {
    title: 'Bjorli – sommar, vinter och fjällupplevelser',
    description: 'Upplev Bjorli högst upp i Gudbrandsdalen, vid gränsen till Romsdalen. Alpint, längdåkning, vandring, cykling, fiske, boende och evenemang.',
    keywords: 'bjorli, bjorli norge, snösäker skidort, skidsemester norge, romsdalen, alpint, längdåkning, familjesemester norge',
  },
};

/**
 * Indexable URLs are ALWAYS built on the canonical production origin, never
 * on `window.location.origin`. Otherwise a Cloudflare preview host, the www
 * host, or localhost would overwrite the prerendered apex canonical /
 * hreflang / og:url after hydration. Indexability itself is still decided by
 * the real origin via `isProductionOrigin()` below.
 */
const SITE_ORIGIN = CANONICAL_ORIGIN;

const SEOHead = () => {
  const location = useLocation();
  const { locale } = useLanguage();
  const defaultSeo: SeoData = { ...seoByLocale[locale], og_image_url: null };
  const [seo, setSeo] = useState<SeoData>(defaultSeo);
  const [routeJsonLd, setRouteJsonLd] = useState<Record<string, unknown> | null>(null);
  /** True for runtime-only CMS entries (user submissions) — keep them out of the index. */
  const [routeNoindex, setRouteNoindex] = useState(false);
  /** Exact localized detail paths supplied by the CMS (detail routes only). */
  const [alternatePaths, setAlternatePaths] = useState<Partial<Record<Locale, string>> | null>(
    null,
  );
  // Locales for which a real translation of the current route exists.
  // Defaults to all six (mock content); real CMS adapter narrows this.
  const [availableLocales, setAvailableLocales] = useState<Locale[]>([...LOCALES]);

  // Canonical path is locale-stripped (e.g. /en/overnatting -> /overnatting)
  const { path: canonicalPath } = stripLocalePrefix(location.pathname);
  /**
   * Internal/admin/review routes (/admin/*, /hero-compare, /image-inventory)
   * are never public SEO surfaces. Resolved centrally here so the final
   * robots state cannot be overwritten with index,follow by another effect.
   */
  const internalNoindex = isInternalNoindexPath(location.pathname);

  useEffect(() => {
    let cancelled = false;
    const fetchSeo = async () => {
      const slug = canonicalPath === '/' ? '/' : canonicalPath;
      const fallback: SeoData = { ...seoByLocale[locale], og_image_url: null };

      // 1. CMS layer — per-route entry (news / tips / events / activities)
      const pageUrl = absoluteUrl(
        (LOCALE_PREFIX[locale] || '') + (slug === '/' ? '/' : slug),
        SITE_ORIGIN,
      );
      const cmsSeo = await resolveSeoForRoute(locale, slug, pageUrl);
      if (cancelled) return;
      if (cmsSeo) {
        setSeo({
          title: cmsSeo.title ?? fallback.title,
          description: cmsSeo.description ?? fallback.description,
          og_image_url: cmsSeo.image ?? null,
          keywords: fallback.keywords,
        });
        setRouteJsonLd(cmsSeo.jsonLd ?? null);
        setRouteNoindex(cmsSeo.noindex === true);
        setAlternatePaths(
          cmsSeo.alternatePaths && Object.keys(cmsSeo.alternatePaths).length > 0
            ? (cmsSeo.alternatePaths as Partial<Record<Locale, string>>)
            : null,
        );
        // Constrain hreflang emission to locales that actually have content.
        if (cmsSeo.availableTranslations && cmsSeo.availableTranslations.length > 0) {
          setAvailableLocales(cmsSeo.availableTranslations as Locale[]);
        } else {
          setAvailableLocales([...LOCALES]);
        }
        return;
      }
      setRouteJsonLd(null);
      setRouteNoindex(false);
      setAlternatePaths(null);
      // No CMS entry — the route is a static / locally-served page; assume all six.
      setAvailableLocales([...LOCALES]);

      // 1b. Static per-route SEO registry (covers all canonical destination pages
      // in all six languages — invisible SEO layer, no visual change).
      const staticEntry = seoForCanonicalPath(slug, locale);
      if (staticEntry) {
        setSeo({
          title: staticEntry.title,
          description: staticEntry.description,
          og_image_url: null,
          keywords: fallback.keywords,
        });
        return;
      }

      // 2. Optional Supabase override (seo_meta table) — kept for editorial control
      try {
        const { data } = await supabase
          .from('seo_meta')
          .select('title, description, og_image_url, keywords')
          .eq('page_slug', slug)
          .maybeSingle();
        if (cancelled) return;
        if (data) {
          setSeo(data);
          return;
        }
      } catch {
        /* table may not exist yet — ignore */
      }

      // 3. Locale defaults
      setSeo(fallback);
    };
    fetchSeo();
    return () => {
      cancelled = true;
    };
  }, [canonicalPath, locale]);

  useEffect(() => {
    document.title = seo.title;
    document.documentElement.lang = LOCALE_LABELS[locale].htmlLang;

    const setMeta = (name: string, content: string | null, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', seo.description);
    setMeta('keywords', seo.keywords);
    setMeta('og:title', seo.title, true);
    setMeta('og:description', seo.description, true);
    setMeta('og:type', 'website', true);
    // OpenGraph requires xx_YY codes (Norwegian Bokmål → nb_NO etc.).
    setMeta('og:locale', LOCALE_LABELS[locale].ogLocale, true);
    // og:locale:alternate for every OTHER available translation.
    document.querySelectorAll('meta[data-og-alt]').forEach((el) => el.remove());
    availableLocales
      .filter((loc) => loc !== locale)
      .forEach((loc) => {
        const el = document.createElement('meta');
        el.setAttribute('property', 'og:locale:alternate');
        el.setAttribute('content', LOCALE_LABELS[loc].ogLocale);
        el.setAttribute('data-og-alt', '1');
        document.head.appendChild(el);
      });
    if (seo.og_image_url) setMeta('og:image', seo.og_image_url, true);

    // Twitter card mirrors OG. Static defaults (site, card type) live in
    // index.html; we only override title/description/image dynamically.
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', seo.title);
    setMeta('twitter:description', seo.description ?? '');
    if (seo.og_image_url) setMeta('twitter:image', seo.og_image_url);

    // robots — production origins (www.bjorli.no / bjorli.no) are crawlable.
    // Lovable preview, staging, localhost, and any unknown origin default to
    // noindex,nofollow so preview deployments cannot leak into search.
    // TODO(prod): hosting should ALSO send `X-Robots-Tag: noindex` for
    // non-production deployments as defence-in-depth.
    // Indexability must reflect where the page is ACTUALLY served from, not
    // the pinned canonical origin — otherwise preview deployments would
    // advertise index,follow. Canonical/hreflang/og:url keep using
    // CANONICAL_ORIGIN; only robots uses the runtime origin.
    const isProd = isProductionOrigin();
    setMeta(
      'robots',
      isProd && !routeNoindex && !internalNoindex
        ? 'index,follow,max-image-preview:large,max-snippet:-1'
        : 'noindex,nofollow',
    );

    // Google Search Console verification (optional, env-driven).
    // Set VITE_GOOGLE_SITE_VERIFICATION at build time. Inert when empty.
    const gsc = (import.meta as unknown as { env?: Record<string, string> }).env
      ?.VITE_GOOGLE_SITE_VERIFICATION;
    if (gsc) setMeta('google-site-verification', gsc);

    // GA4 page_view on every route change (inert when no GA4/GTM ID set).
    trackPageView({
      path: location.pathname,
      title: seo.title,
      language: LOCALE_LABELS[locale].htmlLang,
    });

    /**
     * Exact localized path for `loc`.
     *
     * Detail routes have localized deep slugs, so their translated URLs come
     * from the CMS (`alternatePaths`) — `translatePath()` only localizes the
     * hub segment and would keep the source-language article slug. Static
     * routes keep the existing translatePath behaviour.
     */
    const pathForLocale = (loc: Locale): string | null => {
      const exact = alternatePaths?.[loc];
      if (exact) return exact;
      if (alternatePaths) return null; // detail route without this translation
      const localized = canonicalPath === '/' ? '/' : translatePath(canonicalPath, 'no', loc);
      return (LOCALE_PREFIX[loc] || '') + (localized === '/' ? '/' : localized);
    };

    const currentPath = pathForLocale(locale);
    const currentUrl = absoluteUrl(
      currentPath ??
        (LOCALE_PREFIX[locale] || '') +
          (canonicalPath === '/' ? '/' : translatePath(canonicalPath, 'no', locale)),
      SITE_ORIGIN,
    );
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
    // og:url always mirrors the canonical URL.
    setMeta('og:url', currentUrl, true);

    // hreflang alternates – ONLY for locales that actually have a translation.
    // x-default points to English when available, else NO, else first available.
    // Every existing alternate is removed first — including prerendered tags
    // without the marker attribute — so the DOM never holds both sets.
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    const emitLocales = alternatePaths
      ? (Object.keys(alternatePaths) as Locale[]).filter((l) => LOCALES.includes(l))
      : availableLocales;
    emitLocales.forEach((loc) => {
      const p = pathForLocale(loc);
      if (!p) return;
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', LOCALE_LABELS[loc].htmlLang);
      link.setAttribute('data-hreflang', '1');
      link.setAttribute('href', absoluteUrl(p, SITE_ORIGIN));
      document.head.appendChild(link);
    });
    // Choose x-default fallback: prefer EN, then NO, else the first available.
    const xDefaultLocale: Locale | undefined = emitLocales.includes('en')
      ? 'en'
      : emitLocales.includes('no')
      ? 'no'
      : emitLocales[0];
    const xDefaultPath = xDefaultLocale ? pathForLocale(xDefaultLocale) : null;
    if (xDefaultPath) {
      const xd = document.createElement('link');
      xd.setAttribute('rel', 'alternate');
      xd.setAttribute('hreflang', 'x-default');
      xd.setAttribute('data-hreflang', '1');
      xd.setAttribute('href', absoluteUrl(xDefaultPath, SITE_ORIGIN));
      document.head.appendChild(xd);
    }

    // JSON-LD: emit the destination-level TouristDestination ONLY on the
    // homepage. Inner pages describe more specific entities (SkiResort,
    // Article, Event, ...) and should not be tagged as the destination
    // itself — that confused Google and AI crawlers about which page is
    // about Bjorli the place vs. Bjorli Skisenter the operator.
    const existingOrg = document.getElementById('jsonld-org');
    if (canonicalPath === '/') {
      const script = existingOrg ?? document.createElement('script');
      if (!existingOrg) {
        script.id = 'jsonld-org';
        (script as HTMLScriptElement).setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: 'Bjorli',
        description: seo.description,
        url: absoluteUrl(LOCALE_PREFIX[locale] || '/', SITE_ORIGIN),
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
    } else if (existingOrg) {
      existingOrg.remove();
    }

    // Per-route JSON-LD (Article / NewsArticle / Event)
    let routeScript = document.getElementById('jsonld-route');
    if (routeJsonLd) {
      if (!routeScript) {
        routeScript = document.createElement('script');
        routeScript.id = 'jsonld-route';
        routeScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(routeScript);
      }
      routeScript.textContent = JSON.stringify(routeJsonLd);
    } else if (routeScript) {
      routeScript.remove();
    }
  }, [seo, canonicalPath, locale, routeJsonLd, routeNoindex, internalNoindex, availableLocales]);

  return null;
};

export default SEOHead;
