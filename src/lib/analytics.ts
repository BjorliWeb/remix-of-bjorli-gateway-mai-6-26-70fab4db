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
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

let bootstrapped = false;
let consentGranted = false;

/**
 * Consent gate. Production should set this from a CMP (Cookiebot, Klaro,
 * OneTrust) or Google Consent Mode v2 BEFORE any tracking fires.
 *
 * In the current Vite prototype no consent UI is shipped, so events are
 * additionally gated on the env IDs being present — meaning nothing fires
 * until both an ID is configured AND consent is granted.
 * TODO(prod): wire CMP / Consent Mode v2 in the Next.js app.
 */
export const setAnalyticsConsent = (granted: boolean): void => {
  consentGranted = granted;
  if (granted) {
    bootstrap();
    // Consent Mode v2 — flip the relevant categories to "granted".
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
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
  // If a consent flag has been explicitly granted, honour it. If no consent
  // call has happened yet, allow events ONLY when no CMP integration is
  // configured (the current prototype). Production must call
  // setAnalyticsConsent(true) after a CMP "accept".
  return consentGranted || !hasCmpFlag();
};

// In the prototype no CMP is wired; this returns false. Production should
// flip this to true via window.__bjorliCmp = true once a CMP is loaded.
const hasCmpFlag = (): boolean =>
  typeof window !== 'undefined' && Boolean((window as unknown as { __bjorliCmp?: boolean }).__bjorliCmp);

const bootstrap = (): void => {
  if (bootstrapped || typeof window === 'undefined') return;
  // Production guard — never inject GA4/GTM scripts on Lovable preview,
  // staging, localhost, or any non-production origin, even if the env
  // var has accidentally been set.
  if (!isProductionOrigin(window.location.origin)) return;
  bootstrapped = true;
  window.dataLayer = window.dataLayer || [];
  // Consent Mode v2 default-deny — MUST be pushed before gtag.js loads.
  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer!.push(args as unknown as Record<string, unknown>);
  };
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

/** SPA page_view helper — call on every route change. */
export const trackPageView = (params: {
  path: string;
  title: string;
  language: string;
}): void => {
  if (!canFire()) return;
  bootstrap();
  if (typeof window === 'undefined') return;
  // GA4 expects page_location + page_title; we strip query strings to avoid
  // accidental PII leakage from search params or tokens.
  const safePath = params.path.split('?')[0];
  const page_location = window.location.origin + safePath;
  const ambient = getAnalyticsContext();
  const season = ambient.season;
  if (GA4_ID && window.gtag) {
    window.gtag('event', 'page_view', {
      page_location,
      page_title: params.title,
      language: params.language,
      season,
    });
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page_path: safePath,
    page_title: params.title,
    language: params.language,
    season,
  });
};

/** True only when a real measurement ID is configured at build time. */
export const isAnalyticsEnabled = (): boolean => Boolean(GA4_ID || GTM_ID);
