# Bjorli — Production Handoff

This document captures the state of the Lovable prototype at the end of the
prep phase, and explains what a developer needs to do to take it to a real
production deployment.

> Scope: this is a **prototype + design system + data model**. It is NOT
> the production frontend. The intended production stack is **Next.js
> (App Router) + WordPress (REST/WPGraphQL) + Vercel/Netlify**. See
> `docs/NEXTJS_MIGRATION.md` for the migration plan and this document for
> the deployment-readiness checklist.

---

## 1. Architecture

| Layer            | Prototype (now)                        | Production (planned)                              |
| ---------------- | -------------------------------------- | ------------------------------------------------- |
| Framework        | Vite + React 18 + React Router         | Next.js 15 App Router (RSC + Route Handlers)      |
| Styling          | Tailwind v3 + shadcn/ui + design tokens | Same — tokens copied 1:1                          |
| Content (CMS)    | Mock adapter (`src/lib/cms/mockAdapter.ts`) | WordPress (REST + ACF, optionally WPGraphQL) |
| Live ops data    | Fnugg public API (browser fetch)       | Fnugg via Next.js Route Handler with revalidate   |
| Runtime backend  | Lovable Cloud (Supabase)               | Optional: Supabase only for live alerts/overrides |
| Auth             | None (public site)                     | None on public surface; WP admin auth at CMS      |
| Hosting          | Lovable preview                        | Vercel or Netlify, custom domain bjorli.no        |
| Repo             | Lovable-managed                        | GitHub (Lovable → GitHub two-way sync)            |

## 2. Design system

- Brand: **Destinasjon Bjorli**. Permanent. *"Snøsikre Bjorli"* is a
  WINTER CAMPAIGN tagline only — not the navbar/footer brand.
- Two seasonal themes share the same brand. Toggled by `[data-season]`
  on `<html>` (set in `src/components/Layout.tsx` based on route).
- All colors live as HSL tokens in `src/index.css` and are exposed via
  Tailwind in `tailwind.config.ts`. **Never hardcode hex in components.**
- Winter palette: `#001d28 #003b4b #065b7c #3595ba #64cdf2 #c8eaf5`
- Summer palette: `#8cc4c3 #49abaa #1b8e94 #0f8e60 #f7b57b #e8e6d4`
- Fonts bundled: **Jost** (Futura-style headings) + **Mulish**
  (Brandon Grotesque-style body). Licensed Futura/Brandon are NOT included.
- Logo: `src/assets/bjorli-logo.jpeg`. Do not recreate as SVG.

## 3. Seasonal templates

- `Layout.tsx` sets `data-season="winter|summer"` based on route.
- Season-aware components use the `season-*` Tailwind tokens; pages that
  are exclusively one season use `winter-*` / `summer-*` tokens explicitly.

## 4. CMS content model

- Adapter pattern: `src/lib/cms/adapter.ts` defines the contract;
  `mockAdapter.ts` is the prototype implementation; the production
  WordPress adapter goes in the same folder.
- Content types modelled: `news`, `events`, `activities`, `tips`,
  plus structural pages (`subpages.ts`).
- SEO model lives in `src/lib/cms/seo.ts` and includes per-page
  `availableTranslations: Locale[]` and `translatedBody: boolean`.
- See `src/lib/cms/WORDPRESS_MAPPING.md` for the field-by-field ACF /
  REST plan and the WPML/Polylang translation-group strategy.

## 5. Multilingual routing

- Languages: **NO (root), EN /en, DE /de, NL /nl, DA /da, SV /sv**.
  Never `/dk` or `/se` (legacy aliases redirect — see `docs/REDIRECTS.md`).
- Slug registry: `src/i18n/routes.ts`. ASCII-safe slugs (`oeffnungszeiten`,
  `aabningstider`, `oppettider`, `langdakning`, `vaer-og-webkamera`).
  Stakeholder may switch to native special characters later by editing
  only that file.
- `SEOHead` emits `hreflang` only for locales listed in the page's
  `availableTranslations`; `x-default` points at English.

## 6. SEO / GEO / AEO

Templates support: SEO title, meta description, canonical, hreflang,
x-default, Open Graph, Twitter card, JSON-LD blocks, breadcrumbs, FAQ
schema placeholders, related internal links, localized route metadata.

Source-of-truth files:
- `src/components/SEOHead.tsx` — meta + hreflang + OG/Twitter
- `src/components/seo/JsonLd.tsx` — schema.org JSON-LD wrapper
- `src/components/seo/FaqBlock.tsx` — FAQ schema
- `src/lib/seo/schema.ts` — Organization / WebPage / BreadcrumbList helpers
- `src/lib/seo/sitemap.ts` — sitemap entry builder (consumed in production by `app/sitemap.ts`)
- `public/robots.txt`, `public/llms.txt`, `public/sitemap.xml` — placeholders

GEO/AEO notes are in `docs/SEO_GEO_AEO.md`.

## 7. Image strategy

- Real Bjorli photography is preferred. Existing assets live in
  `src/assets/`. AI/stock placeholders are intentionally limited to
  decorative spots and are flagged in code where used.
- Image components support: responsive sizes, alt text, priority/lazy,
  optional caption + credit, focal-point placeholder. WordPress media
  field placeholder is wired through the CMS adapter shape.

## 8. Fnugg integration

| Field shown in UI                | Fnugg path                                | Fallback shown            |
| -------------------------------- | ----------------------------------------- | ------------------------- |
| Heiser åpne                      | `_source.lifts.open` / `lifts.count`      | em-dash                   |
| Nedfarter åpne                   | `_source.slopes.open` / `slopes.count`    | em-dash                   |
| Snødybde (cm)                    | `_source.snow.*` (deepest available)      | em-dash                   |
| Temperatur (°C)                  | `_source.weather.*` (current temperature) | em-dash                   |
| I dag: Åpent / Stengt / Status …  | `_source.resort_open` (normalized)        | "Status ikke tilgjengelig"|
| Sist oppdatert                   | `_source.last_updated`                    | hidden                    |
| Driftsmelding (text only)        | `/search?index=blog&facet=site:177`       | "Ingen ny driftsmelding"  |

Code: `src/lib/integrations/fnugg.ts`, `src/hooks/useBjorliStatus.ts`,
`src/hooks/useBjorliFnuggPosts.ts`, `src/components/LiveFnuggStatus.tsx`,
`src/components/LiveAlertBanner.tsx`, `src/components/LiveStatusCards.tsx`.

**Production rule:** move all Fnugg fetches behind a Next.js Route
Handler (`app/api/fnugg/route.ts`) with `revalidate: 600` (10 min)
during winter season. This avoids browser-side hammering, gives one
canonical shape, and removes any CORS risk if Fnugg policy changes.
Fnugg images must NOT be rendered inside the Driftsmelding box.

## 9. Vær og webkamera

- Canonical NO route: `/vaer-og-webkamera` (legacy `/livecams` is a soft
  alias in `App.tsx`; real 301 to be configured at hosting layer).
- Page composition: `LiveFnuggStatus` (block variant) + `LiveAlertBanner`
  (Driftsmelding) + 4× `WebcamEmbed` IPCamLive iframes + Langrenn link
  to loyper.net.
- Webcam aliases migrated from the original WordPress page:
  `61b467311f905` (Baseområde), `61c4bf99a3979`, `61b717228326c`,
  `61b702b231cf9`. Labels for the last three need stakeholder confirmation.

## 10. Driftsmelding logic

Priority chain in `LiveAlertBanner`:
1. **Critical CMS alert** (manual override from Lovable Cloud / WordPress)
2. **Latest Fnugg blog post** for site_id 177
3. **Non-critical CMS alert**
4. **Safe fallback** ("Ingen ny driftsmelding tilgjengelig akkurat nå")

Bolded Norwegian dates via `Intl.DateTimeFormat`. CTA links to
`https://fnugg.no/bjorli/` when the source is a Fnugg post.

## 11. WordPress integration assumptions (deferred)

- REST: `/wp-json/wp/v2/{posts,pages,media,...}`
- Optional: WPGraphQL for one-shot localized queries
- ACF for editorial fields (hero image, focal point, caption, credit, FAQ)
- WPML or Polylang for translation groups → drives `availableTranslations`
- Custom post types likely needed: `event`, `activity`, `tip`, `webcam`,
  `alert` (driftsmelding override).
- Preview mode via `WORDPRESS_PREVIEW_SECRET` + Next.js Draft Mode.
- SEO metadata sourced from Yoast or RankMath REST fields.

## 12. Deployment assumptions

- Repo: Lovable → GitHub two-way sync, `main` is production.
- Host: Vercel (preferred) or Netlify. Custom domain `bjorli.no`.
- Preview deployments per branch; PR previews **must** return
  `X-Robots-Tag: noindex` (and ideally Vercel Password Protection or
  Netlify Basic Auth) until launch.
- Headers: HSTS, strict CSP (allow `api.fnugg.no`, IPCamLive, Cloudinary),
  `Referrer-Policy: strict-origin-when-cross-origin`.
- Caching: WP REST → ISR `revalidate: 300`; Fnugg → 600; static assets
  long-cache via Vercel/Netlify defaults.
- Image optimization: `next/image` with WP media as remote pattern.
- `app/sitemap.ts` and `app/robots.ts` generated server-side from the
  WordPress content list + `src/i18n/routes.ts`.

## 13. Lovable preview vs production

The current `index.html` does not embed Lovable badge scripts, but the
Lovable editor injects a badge into the **preview** at runtime. Before
launch:

- Badge can be hidden via Workspace Settings → Publish (Pro plan), or
- The Next.js production build never includes Lovable preview scripts at
  all, so this concern goes away naturally after migration.

> **TODO before production deployment:** confirm no Lovable preview
> scripts or badges are present in the built bundle. Comment in
> `index.html` documents this expectation.

## 14. Staging protection

- Staging / preview deployments must be `noindex` (via response header
  `X-Robots-Tag: noindex, nofollow` and a meta robots tag).
- Production `bjorli.no` must be crawlable.
- Implement via env-aware logic in `app/layout.tsx` and Vercel/Netlify
  header rules.

## 15. Known deferred items

- Real WordPress connection (REST/GraphQL adapter)
- Real translation groups (WPML/Polylang) and translated bodies
- Real sitemap generation from WordPress
- Final `robots.txt` (env-aware) and `llms.txt`
- Final redirect map (see `docs/REDIRECTS.md`)
- Production analytics (Plausible or GA4) + cookie consent if needed
- Search Console + Bing Webmaster verification
- Final image optimization / CDN strategy (likely Cloudinary or Vercel)
- Final Fnugg caching strategy in Next.js
- Webcam embed provider testing across locales/devices
- CMS alert override logic end-to-end with editorial team
- Launch QA sweep (Lighthouse, Axe, link checker, multilingual smoke test)

## 16. Risks / recommended next actions

1. **Fnugg API stability** — the search params are reverse-engineered;
   document them with the Fnugg team if possible before launch.
2. **Webcam labels** — only "Baseområde" is confirmed; get the other
   three labels in all six languages.
3. **Translation coverage** — body content is currently NO-only.
   Plan translator workflow before flipping `SHOW_TRANSLATION_PLACEHOLDERS`.
4. **WordPress field mapping** — finalize ACF field names early; the
   adapter shape in `src/lib/cms/types.ts` is the source of truth.
5. **Redirect QA** — generate the legacy URL inventory from Search
   Console BEFORE launch, not after, to catch high-traffic pages.
