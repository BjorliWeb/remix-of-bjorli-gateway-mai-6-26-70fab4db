# SEO, GA4 and Search Console — launch setup

Short checklist for activating analytics, search-console verification and
the localized sitemap on the production deployment of bjorli.no.

This document covers operational setup only. SEO/GEO/AEO architecture is
in `docs/SEO_GEO_AEO.md`.

## 1. Google Analytics 4 (GA4)

Set the Measurement ID in the **production** environment only.

1. In Google Analytics, create (or open) the GA4 property for `bjorli.no`.
2. Copy the **Measurement ID** (format `G-XXXXXXXXXX`).
3. Set the env var on the production host (Vercel / Netlify / etc.):

   ```bash
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. Redeploy. `src/lib/analytics.ts` loads `gtag.js` once and emits
   `page_view` on every SPA route change via `SEOHead`.

If a Tag Manager workflow is preferred instead, set `VITE_GTM_ID` instead
of the GA4 ID and configure GA4 as a tag inside GTM. Do not set both —
the analytics helper handles each mode separately.

### Important — do NOT use the production GA4 ID in preview / staging

The Lovable preview is noindex, but analytics will still fire if the env
var is present. To avoid polluting the production property with internal
traffic:

- Leave `VITE_GA4_MEASUREMENT_ID` empty on the Lovable preview.
- Use a separate GA4 property (or stream) for staging if needed.
- If a single property is intentional, filter internal traffic in GA4.

### Consent

`src/lib/analytics.ts` implements **Google Consent Mode v2** with
default-deny. Before `gtag.js` loads, the helper pushes:

```js
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
});
```

The in-house `ConsentBanner` (`src/components/ConsentBanner.tsx`) shows
on first visit, persists the choice in `localStorage` under
`bjorli_consent_v1`, and on Accept calls `setAnalyticsConsent(true)`
which flips `analytics_storage` to `granted`. The footer "Cookies" link
re-opens the banner.

### Production-only enablement

Even if `VITE_GA4_MEASUREMENT_ID` is accidentally set on a non-production
origin, `bootstrap()` short-circuits via `isProductionOrigin()` — no
gtag/GTM script is injected on Lovable preview, staging, or localhost.
Production origins are listed in `src/lib/seo/origin.ts`.

### Phase 1 tracking scope

- `page_view` on every SPA route change, stamped with `language`,
  `season` and `page_path` via `src/lib/analyticsContext.ts`.
- Pre-existing CTA `track()` calls in `Navbar`, `HomepageSections`,
  `LiveStatusCards`, `Livecams`, `GettingHere`, `SkiHolidayNorway`
  auto-merge ambient context.

### Next phase (not yet implemented)

- Document-level outbound link auto-listener (`click_external_link`).
- Per-page CTA coverage for remaining static pages.
- `click_phone`, `click_email`, `season_switch`, `view_*` events.
- Localized banner copy for DE, NL, DA, SV (currently NO + EN; other
  locales fall back to EN).

## 2. Google Search Console

1. In Search Console, add `https://bjorli.no/` as a URL-prefix
   property (not a domain property — that would require DNS verification
   instead of a meta tag).
2. Choose **HTML tag** verification. Copy the `content` value from the
   meta tag (everything after `content="` and before the closing quote —
   do NOT include `google-site-verification=`).
3. Set the env var on production:

   ```bash
   VITE_GOOGLE_SITE_VERIFICATION=<token>
   ```

4. Redeploy. `SEOHead` emits the meta tag on every page when this env var
   is present.
5. Click **Verify** in Search Console.
6. Submit the sitemap once verification succeeds:

   ```
   https://bjorli.no/sitemap.xml
   ```

## 3. Sitemap

`public/sitemap.xml` is generated automatically before `vite dev` and
`vite build` by `scripts/build-sitemap.ts` (wired via `predev` /
`prebuild` in `package.json`). The generator reads `src/i18n/routes.ts`
— the same registry the router uses — so localized slugs in the sitemap
always match the actual URLs (e.g. `/en/summer`, `/de/sommer`,
`/nl/zomer`, `/da/sommer`, `/sv/sommar`).

To regenerate manually:

```bash
bun run scripts/build-sitemap.ts
```

### After every production deploy

- Open `https://bjorli.no/sitemap.xml` and confirm it loads.
- Spot-check 2–3 localized URLs by clicking through.
- In Search Console → Sitemaps, confirm the latest submission has
  `Status: Success` and a reasonable URL count.

## 4. robots.txt and llms.txt

- `public/robots.txt` — explicit allow for Googlebot, Bingbot, GPTBot,
  ClaudeBot, PerplexityBot, Applebot, OAI-SearchBot, etc. Edit in place
  if a crawler needs to be added or blocked.
- `public/llms.txt` and `public/llms-full.txt` — factual summaries for
  AI/answer engines. Update when canonical routes change. Do not invent
  facts, prices, opening hours or schedules.

## 5. Production-host responsibilities (Vercel / Netlify)

- Return `X-Robots-Tag: noindex` for any non-production deployment (the
  meta-tag noindex in `SEOHead` is a runtime fallback, not a substitute
  for a header on preview/staging hosts).
- Force HTTPS and HSTS.
- Cache `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` with a
  short TTL (≤ 1 hour) so updates propagate quickly.