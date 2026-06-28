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
import { Navigate } from 'react-router-dom';

/**
 * Client-side redirect for the legacy /livecams (and /livecams/) URL.
 * Forwards to the canonical /vaer-og-webkamera page with a `from=livecams`
 * query flag; the target page reads that flag, fires the
 * `legacy_redirect_visit` GA4 event (consent-gated), then strips the
 * query from the visible URL so nothing duplicate gets indexed.
 *
 * The production 301 in `public/_redirects` carries the same query string,
 * so direct CDN hits also land on /vaer-og-webkamera?from=livecams and
 * trigger the same client-side tracking once the SPA boots.
 */
const LegacyLivecamsRedirect = () => (
  <Navigate to="/vaer-og-webkamera?from=livecams" replace />
);

export default LegacyLivecamsRedirect;