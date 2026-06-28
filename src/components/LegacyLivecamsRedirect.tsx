/**
 * Client-side handler for the legacy /livecams (and /livecams/) URL.
 *
 * NOTE on tracking coverage:
 *   The real 301 in `public/_redirects` is served by the host (Cloudflare
 *   Pages) BEFORE any JavaScript runs, so direct hits to /livecams that go
 *   through the CDN never reach this component and cannot fire a GA4 event.
 *   For those hits, traffic must be monitored via Google Search Console
 *   (redirect coverage report) and Cloudflare hosting analytics.
 *
 *   This component only catches the cases where /livecams is reached
 *   inside an already-loaded SPA session (in-app navigation, or a
 *   preview/dev environment where the _redirects rule is not active).
 *   In those cases we fire `legacy_livecams_redirect` and then 301-style
 *   navigate to the canonical /vaer-og-webkamera page.
 */
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { track } from '@/lib/analytics';

const TARGET = '/vaer-og-webkamera';

const LegacyLivecamsRedirect = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Respects cookie consent — track() is inert until consent is granted.
    track('legacy_livecams_redirect', {
      legacy_path: pathname.endsWith('/') ? pathname : pathname + '/',
      redirect_target: TARGET,
      page_type: 'legacy_redirect',
      source: 'legacy_url',
    });
  }, [pathname]);
  return <Navigate to={TARGET} replace />;
};

export default LegacyLivecamsRedirect;