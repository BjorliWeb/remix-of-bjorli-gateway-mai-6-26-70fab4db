/**
 * Bjorli analytics — GA4-ready, privacy-conscious, GTM-compatible.
 *
 * Behaviour:
 *   - Loads gtag.js once when `VITE_GA4_MEASUREMENT_ID` is set.
 *     If `VITE_GTM_ID` is set instead, GA4 should be wired inside GTM and
 *     this module pushes events to `window.dataLayer` only.
 *   - Inert (no network, no console) when neither env var is set —
 *     safe to leave calls in production for future activation.
 *   - Never logs personal data: no email, name, phone, message body, or
 *     query strings that could contain PII.
 *
 * In Next.js production, replace the script-injection block with
 * `next/script` in `app/layout.tsx`. The `track()` API stays identical.
 */
import { isProductionOrigin } from '@/lib/seo/origin';
import { getAnalyticsContext } from '@/lib/analyticsContext';

type EnvLike = { env?: Record<string, string | undefined> };
const env = (import.meta as unknown as EnvLike).env ?? {};
const GA4_ID = env.VITE_GA4_MEASUREMENT_ID;
const GTM_ID = env.VITE_GTM_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let bootstrapped = false;
let consentGranted = false;

/**
 * Cached params from the most recent trackPageView() call. When the page
 * mounts before the user has accepted analytics consent, the call is
 * suppressed by canFire() — we stash the params here so we can replay
 * exactly one page_view as soon as setAnalyticsConsent(true) runs,
 * without waiting for the next SPA navigation.
 */
let lastPageViewParams: { path: string; title: string; language: string } | null = null;
/**
 * Dedupe guard. Stores the `${path}|${title}` of the most recently sent
 * page_view so a replay-on-consent followed immediately by a route-change
 * trackPageView for the same page doesn't double-count.
 */
let lastSentKey: string | null = null;

// -------- debug ----------------------------------------------------------
// Activated by appending ?debug_ga4=1 to any URL. Survives SPA navigation
// for the lifetime of the tab. Never logs in production without the flag.
const isDebug = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    if (window.location.search.includes('debug_ga4=1')) {
      window.sessionStorage.setItem('bjorli_debug_ga4', '1');
      return true;
    }
    return window.sessionStorage.getItem('bjorli_debug_ga4') === '1';
  } catch {
    return window.location.search.includes('debug_ga4=1');
  }
};
const dbg = (...args: unknown[]): void => {
  if (isDebug()) {
    console.log('[ga4]', ...args);
  }
};
const maskedId = (): string => (GA4_ID ? `…${GA4_ID.slice(-4)}` : 'unset');

const getPagePath = (): string => {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}`;
};

const getPageLocation = (): string => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
};

const debugGtagState = (label: string): void => {
  if (!isDebug() || typeof window === 'undefined') return;
  dbg(label, {
    ga4Id: maskedId(),
    gtagExists: typeof window.gtag === 'function',
    dataLayerExists: Array.isArray(window.dataLayer),
    dataLayerLength: window.dataLayer?.length ?? 0,
    dataLayer: window.dataLayer,
  });
};

/**
 * Consent gate. Production should set this from a CMP (Cookiebot, Klaro,
 * OneTrust) or Google Consent Mode v2 BEFORE any tracking fires.
 *
 * The in-house consent banner is authoritative: analytics events are never
 * emitted until setAnalyticsConsent(true) runs after the user accepts.
 */
export const setAnalyticsConsent = (granted: boolean): void => {
  consentGranted = granted;
  dbg('setAnalyticsConsent', { granted, gtagAvailable: typeof window !== 'undefined' && !!window.gtag, ga4Id: maskedId() });
  if (granted) {
    bootstrap();
    debugGtagState('after bootstrap before consent update');
    // Consent Mode v2 — flip the relevant categories to "granted" before
    // re-running config and sending the first manual page_view.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      debugGtagState('after consent update');
      if (GA4_ID) {
        window.gtag('config', GA4_ID, { send_page_view: false, anonymize_ip: true });
        dbg('gtag config after consent grant', {
          ga4Id: maskedId(),
          send_page_view: false,
          anonymize_ip: true,
        });
        debugGtagState('after config following consent');
      }
    }
    // Immediately replay (or freshly send) a page_view for the current
    // page. Without this, the very first page after consent is missing
    // from GA4 because the SEOHead trackPageView fired before consent
    // was granted and was dropped by canFire().
    if (typeof window !== 'undefined') {
      const replay = lastPageViewParams ?? {
        path: getPagePath(),
        title: typeof document !== 'undefined' ? document.title : '',
        language: document?.documentElement?.lang || 'no',
      };
      dbg('replay page_view after consent', replay);
      sendPageView(replay, { force: true });
    }
  } else if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  }
};

const canFire = (): boolean => {
  if (!GA4_ID && !GTM_ID) return false;
  return consentGranted;
};

const bootstrap = (): void => {
  if (bootstrapped || typeof window === 'undefined') return;
  // Production guard — never inject GA4/GTM scripts on Lovable preview,
  // staging, localhost, or any non-production origin, even if the env
  // var has accidentally been set.
  if (!isProductionOrigin(window.location.origin)) {
    dbg('bootstrap skipped — non-production origin', window.location.origin);
    return;
  }
  bootstrapped = true;
  dbg('bootstrap()', { ga4Id: maskedId(), gtmId: GTM_ID ? '(set)' : 'unset' });
  window.dataLayer = window.dataLayer || [];
  // Consent Mode v2 default-deny — MUST be pushed before gtag.js loads.
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer!.push(arguments);
  };
  debugGtagState('official gtag queue ready');
  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  });

  // GTM: tag manager loads GA4 itself; we only own dataLayer.
  if (GTM_ID) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(s);
    return;
  }

  // GA4 direct: load gtag.js exactly once.
  if (GA4_ID) {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);
    window.gtag('js', new Date());
    // anonymize_ip is enforced; SPA page_view is sent manually via trackPageView.
    window.gtag('config', GA4_ID, { send_page_view: false, anonymize_ip: true });
    dbg('gtag config during bootstrap', {
      ga4Id: maskedId(),
      send_page_view: false,
      anonymize_ip: true,
      consentGranted,
    });
    debugGtagState('after bootstrap config');
  }
};

export type AnalyticsEventName =
  // navigation / lifecycle
  | 'page_view'
  | 'change_language'
  | 'season_switch'
  // primary CTAs
  | 'click_buy_ski_pass'
  | 'click_accommodation'
  | 'click_bjorli_skisenter'
  | 'click_weather_webcams'
  | 'click_opening_hours'
  | 'click_livecams'
  | 'click_directions'
  | 'click_train_info'
  // contact
  | 'click_phone'
  | 'click_email'
  // content
  | 'click_event'
  | 'click_news'
  | 'click_tip'
  | 'click_activity'
  // outbound + integrations
  | 'click_external_link'
  | 'view_fnugg_status'
  | 'click_fnugg_source'
  // future
  | 'search_site';

export interface BaseEventParams {
  page_path?: string;
  page_title?: string;
  language?: string;
  season?: 'winter' | 'summer';
  link_url?: string;
  link_text?: string;
  destination_type?: string;
  content_type?: 'news' | 'tip' | 'event' | 'activity' | 'page';
  content_slug?: string;
  outbound?: boolean;
  /** Free-form extra. Never include PII. */
  [key: string]: unknown;
}

/** Push an event. Inert when no GA4/GTM ID is configured or consent is denied. */
export const track = (event: AnalyticsEventName, params: BaseEventParams = {}): void => {
  if (!canFire()) return;
  bootstrap();
  if (typeof window === 'undefined') return;
  // Auto-merge ambient context (language / season / page_path) so
  // individual call sites stay terse. Explicit params win.
  const ambient = getAnalyticsContext();
  const merged: BaseEventParams = { ...ambient, ...params };
  // Strip undefined keys so GA4 reports stay clean.
  const clean: Record<string, unknown> = {};
  Object.entries(merged).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') clean[k] = v;
  });
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...clean });
  if (GA4_ID && window.gtag) {
    window.gtag('event', event, clean);
  }
};

/**
 * Internal helper that actually emits a page_view to GA4 + dataLayer.
 * Centralises dedupe + debug logging so both route-change tracking and
 * the consent-replay path go through the same code path.
 */
const sendPageView = (
  params: { path: string; title: string; language: string },
  opts: { force?: boolean } = {},
): void => {
  if (typeof window === 'undefined') return;
  const pathWithSearch = params.path || getPagePath();
  const key = pathWithSearch;
  if (!opts.force && key === lastSentKey) {
    dbg('page_view skipped (dedupe)', key);
    return;
  }
  lastSentKey = key;
  const page_location = getPageLocation();
  const ambient = getAnalyticsContext();
  const season = ambient.season;
  const eventParams = {
    send_to: GA4_ID,
    page_title: params.title,
    page_location,
    page_path: pathWithSearch,
    language: params.language,
    season,
  };
  debugGtagState('before manual page_view');
  dbg('page_view ->', { ga4Id: maskedId(), ...eventParams, send_to: maskedId() });
  if (GA4_ID && window.gtag) {
    window.gtag('event', 'page_view', eventParams);
    dbg('gtag event page_view after config', { ga4Id: maskedId(), eventParams: { ...eventParams, send_to: maskedId() } });
  }
  debugGtagState('after manual page_view');
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_path: pathWithSearch,
    page_title: params.title,
    language: params.language,
    season,
  });
  debugGtagState('after dataLayer page_view marker');
};

/**
 * SPA page_view helper — call on every route change.
 *
 * Always caches the latest params so that, if the user accepts analytics
 * consent AFTER this route has mounted, setAnalyticsConsent(true) can
 * immediately replay the current page_view without waiting for the next
 * navigation.
 */
export const trackPageView = (params: {
  path: string;
  title: string;
  language: string;
}): void => {
  lastPageViewParams = params;
  dbg('trackPageView()', { ...params, canFire: canFire(), consentGranted, prodOrigin: typeof window !== 'undefined' && isProductionOrigin(window.location.origin) });
  if (!canFire()) return;
  bootstrap();
  sendPageView(params);
};

/** True only when a real measurement ID is configured at build time. */
export const isAnalyticsEnabled = (): boolean => Boolean(GA4_ID || GTM_ID);
