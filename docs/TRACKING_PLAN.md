# Bjorli — GA4 Tracking Plan

All events are emitted from `src/lib/analytics.ts`. The module is inert
unless `VITE_GA4_MEASUREMENT_ID` or `VITE_GTM_ID` is set at build time.
No personal data is ever sent (no email, name, phone, message body, or
raw query strings).

## Common parameters (any event may include)

- `page_path` — locale-prefixed pathname, query stripped
- `page_title` — current document.title
- `language` — active locale (`no` / `en` / `de` / `nl` / `da` / `sv`)
- `season` — `winter` | `summer`, when applicable
- `link_url` — destination URL for outbound clicks (host only when PII risk)
- `link_text` — visible link text
- `destination_type` — e.g. `accommodation`, `activity`
- `content_type` — `news` | `tip` | `event` | `activity` | `page`
- `content_slug` — slug of the content item
- `outbound` — boolean

## Event catalogue

| Event | Trigger | Key params | Business question | Implemented in |
|---|---|---|---|---|
| `page_view` | Every route change in SPA | `page_path`, `page_title`, `language` | What pages get traffic? | `SEOHead.tsx` via `trackPageView()` |
| `change_language` | User selects new locale | `from`, `to`, `page_path` | Which markets convert per page? | ✅ `Navbar.tsx` language dropdown |
| `season_switch` | Winter ↔ summer toggle | `to`, `page_path` | Seasonal interest split | `Layout.tsx` (TODO wire) |
| `click_buy_ski_pass` | Any "Kjøp heiskort" / "Buy lift pass" CTA | `link_text`, `page_path`, `outbound` | CTA effectiveness | ✅ `Navbar.tsx` (winter CTA), ✅ `HomepageSections.tsx` (skiperformance links) |
| `click_accommodation` | Accommodation card / CTA | `content_slug`, `link_text` | Which lodging gets clicks? | ✅ `Navbar.tsx` (summer CTA), ✅ `HomepageSections.tsx` (`/overnatting` links) |
| `click_bjorli_skisenter` | Card linking to ski center | `link_text`, `page_path` | Funnel into core product | ✅ `HomepageSections.tsx` (`/skisenter` links) |
| `click_weather_webcams` | Weather/webcam card | `link_text` | Operational interest | ✅ `LiveStatusCards.tsx` (camera link) |
| `click_opening_hours` | Opening hours card | `link_text` | Operational interest | ✅ `LiveStatusCards.tsx` (clock link) |
| `click_livecams` | Legacy livecams CTA | `link_text` | Operational interest | ✅ `Livecams.tsx` |
| `click_directions` | "Get directions" / map links | `link_text`, `page_path` | Travel intent | ✅ `GettingHere.tsx` (Google Maps), ✅ `HomepageSections.tsx` |
| `click_train_info` | Rauma Line / Entur outbound | `link_url`, `outbound: true` | Train demand | ✅ `GettingHere.tsx` (Entur) |
| `click_phone` | tel: link | `link_text`, `page_path` | Phone-led conversions | Footer, Contact (TODO) |
| `click_email` | mailto: link | `link_text`, `page_path` | Email-led conversions | Footer, Contact (TODO) |
| `click_event` | Event card or CTA | `content_slug`, `content_type: event` | Event interest | Events listing (TODO) |
| `click_news` | News card or CTA | `content_slug`, `content_type: news` | Editorial value | News listing (TODO) |
| `click_tip` | Tip card or CTA | `content_slug`, `content_type: tip` | Editorial value | Tips listing (TODO) |
| `click_activity` | Activity card or CTA | `content_slug`, `content_type: activity` | Activity discovery | Activities listing (TODO) |
| `click_external_link` | Any outbound non-Bjorli link | `link_url`, `outbound: true` | Reciprocal link impact | ✅ Partial — generic fallback in `HomepageSections.tsx`; site-wide outbound handler (TODO) |
| `view_fnugg_status` | Fnugg status block becomes visible | `surface` | Live status engagement | `LiveFnuggStatus.tsx` (TODO wire) |
| `click_fnugg_source` | "Source: Fnugg" link | `link_url`, `outbound: true` | Trust signal traffic | Fnugg attribution (TODO) |
| `search_site` | Future site search | `query_length` (no raw query) | Search demand | When search ships |

## Consent & privacy

- `src/lib/analytics.ts` exports `setAnalyticsConsent(granted)`. Nothing
  fires until BOTH a measurement ID is configured AND consent is granted
  (or no CMP integration is detected — current prototype state).
- TODO(prod): wire **Google Consent Mode v2** via **Google Tag Manager** in
  the Next.js `app/layout.tsx` using `next/script`. Default all consent
  signals to `denied`, then update on CMP "accept" (Cookiebot / Klaro /
  custom). Set `window.__bjorliCmp = true` once a CMP is loaded so the
  prototype-style auto-fire is disabled.
- TODO(prod): for non-production deployments, hosting must also send
  `X-Robots-Tag: noindex` in addition to the meta robots tag emitted by
  `SEOHead.tsx` for non-production origins.

## Privacy notes

- IP anonymization is enabled in GA4 (`anonymize_ip: true` on direct GA4
  load; configure at GTM tag level when using GTM).
- Query strings are stripped before being sent as `page_location`.
- Do not pass form input values, names, emails or phone numbers in
  any event parameter.
- Cookie consent UX (Plausible / Cookiebot / custom) must wrap GA4
  bootstrap in the production Next.js app. The current Vite prototype
  defers consent to the deploy environment.

## Activation checklist

1. Create a GA4 property for bjorli.no.
2. Set `VITE_GA4_MEASUREMENT_ID` (or `VITE_GTM_ID` if using GTM) in the
   build environment.
3. Verify `page_view` fires on route changes via the GA4 DebugView.
4. Wire remaining `click_*` events on the call sites listed above.
5. In Search Console, link the GA4 property and submit `sitemap.xml`.