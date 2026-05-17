# SEO / GEO / AEO Architecture — Bjorli

This document describes how the Bjorli destination site is structured for
**SEO** (Search Engine Optimization), **GEO** (Generative Engine Optimization)
and **AEO** (Answer Engine Optimization), and how each piece will carry
over to the Next.js production frontend.

> Important: we cannot force LLMs to update their training data. The goal is
> to make Bjorli's public information **easy to crawl, easy to understand,
> easy to quote and easy to cite**. The site is structured so AI search,
> ChatGPT Search, Claude, Perplexity and Google AI Overviews can answer
> questions about Bjorli using bjorli.no as the source.

## 1. Files at the site root

| File | Purpose | Today | Next.js |
|---|---|---|---|
| `/robots.txt` | Crawl rules; explicitly allows AI/answer-engine bots | `public/robots.txt` | `app/robots.ts` |
| `/sitemap.xml` | Discovery for all locales + pages | `public/sitemap.xml` (static placeholder) | `app/sitemap.ts` (generated from WordPress) |
| `/llms.txt` | Plain-text summary for LLMs (key pages, languages, facts) | `public/llms.txt` | `app/llms.txt/route.ts` |
| `/humans.txt` | People + tech credits | `public/humans.txt` | `app/humans.txt/route.ts` |
| `/manifest.json` | PWA manifest | `public/manifest.json` | `app/manifest.ts` |
| `/sw.js` | Service worker (offline + caching) | `public/sw.js` | `next-pwa` or custom |

### Staging protection
The Lovable preview is intentionally crawlable. **In Next.js**, gate
`robots.ts` on the deployment environment so non-production hosts return
`Disallow: /` — this is the "no-indexed staging protection" placeholder.

## 2. Per-page metadata contract

Every page template supports the full SEO field set via `CmsSeo` (see
`src/lib/cms/types.ts`):

- `seoTitle`, `seoDescription`
- `ogTitle`, `ogDescription`, `ogImage`
- `twitterCard`, `twitterTitle`, `twitterDescription`, `twitterImage`, `twitterSite`
- `canonicalUrl` (each language self-canonicalizes)
- `robots`, `noindex`, `nofollow`
- `schemaType` (override the JSON-LD `@type`)
- `faq` (drives both visible FAQ block and FAQPage schema)

The frontend layer that consumes these:

- `src/components/SEOHead.tsx` — global default + per-route resolver (already wired).
- `src/components/seo/PageMeta.tsx` — per-page imperative override placeholder.
- `src/components/seo/JsonLd.tsx` — single JSON-LD block, multiple per page allowed.
- `src/components/seo/FaqBlock.tsx` — visible Q&A + FAQPage schema.
- `src/components/seo/RelatedLinksBlock.tsx` — semantic internal linking.
- `src/components/seo/PageSummaryBlock.tsx` — short factual summary for GEO/AEO.

In Next.js App Router these collapse into:

- `export const metadata` / `export async function generateMetadata()` for `<head>`.
- Server components rendering `<JsonLd>` for structured data.
- The visible `<FaqBlock>` / `<RelatedLinksBlock>` / `<PageSummaryBlock>` components are reused as-is.

## 3. Hreflang + canonical

Six supported languages, each self-canonicalizing:

| Locale | URL prefix |
|---|---|
| `no` | `/` (root) |
| `en` | `/en/` |
| `de` | `/de/` |
| `nl` | `/nl/` |
| `da` | `/da/` |
| `sv` | `/sv/` |

Never use `/dk/` or `/se/`.

`SEOHead` already emits `<link rel="alternate" hreflang="…">` for every
locale plus `x-default` (currently pointing at the Norwegian root URL —
swap to `/en/` if international becomes the primary entry point).

Seasonal homepages: if winter and summer ever live on **separate URLs**
(`/vinter`, `/sommer`), each canonicalizes to itself. If they share the
root URL with seasonal swaps, only the metadata (title, description,
OG image) changes per season — the canonical stays `/`.

## 4. Schema.org coverage

Builders live in `src/lib/seo/schema.ts`. Map them to pages as follows:

| Page | Recommended JSON-LD |
|---|---|
| Homepage | `Organization` + `TouristDestination` + `WebPage` |
| Vinter / Sommer | `WebPage` + `TouristDestination` (season facet) |
| Bjorli Skisenter | `SkiResort` + `LocalBusiness` + `FAQPage` |
| Heiskort | `WebPage` + `FAQPage` (price/where-to-buy questions) |
| Åpningstider | `WebPage` + `FAQPage` (operational hours) |
| Livecams | `WebPage` |
| Løypekart | `WebPage` + `Place` |
| Skiutleie | `LocalBusiness` + `FAQPage` |
| Skiskole | `LocalBusiness` + `FAQPage` |
| Langrenn | `WebPage` + `Place` |
| Overnatting (listing) | `WebPage` |
| Accommodation (detail) | `LodgingBusiness` |
| Mat og drikke (listing) | `WebPage` |
| Restaurant (detail) | `FoodEstablishment` |
| Reisen hit | `WebPage` + `FAQPage` (travel questions) |
| Praktisk info | `WebPage` + `FAQPage` |
| Kontakt | `Organization` + `ContactPage` |
| Nyheter listing | `WebPage` |
| News article | `NewsArticle` |
| Arrangementer listing | `WebPage` |
| Event detail | `Event` |
| Tips listing | `WebPage` |
| Tip article | `Article` |
| Aktiviteter listing | `WebPage` |
| Activity detail | `Article` + `Place` |
| Any nested page | `BreadcrumbList` (already emitted by `Breadcrumbs`) |

## 5. Internal linking (RelatedLinksBlock)

Reinforces destination structure for both crawlers and users.

- **Bjorli Skisenter** → Heiskort, Åpningstider, Livecams, Skiutleie, Skiskole, Overnatting, Mat og drikke
- **Sommer** → Fotturer, Sykling, Familie, Overnatting, Mat og drikke, Reisen hit
- **Reisen hit** → Overnatting, Vinter, Sommer, Praktisk info
- **Tips article** → relevant Activity, Event, Accommodation, seasonal page
- **News article** → related News, Bjorli Skisenter, current season
- **Event detail** → Bjorli Skisenter, Overnatting, Reisen hit

## 6. AEO — FAQ readiness

Every operational page should ship a short FAQ that mirrors how real
visitors phrase questions. Examples (translated per locale, populated
from WordPress later):

- When does Bjorli Skisenter open?
- Where can I buy ski passes for Bjorli?
- How do I get to Bjorli by train?
- Is Bjorli suitable for families?
- What can I do in Bjorli in summer?
- Where can I stay in Bjorli?
- Are there livecams at Bjorli?
- Is there ski rental at Bjorli?

Use `<FaqBlock items={…} />` — it renders the visible block **and** the
`FAQPage` JSON-LD in one component.

## 7. Image SEO

`CmsImage` already supports `alt`, `caption`, `credit`, `width`, `height`,
`wpField` and a `placeholder` flag. Production rules:

- Meaningful images: descriptive `alt` text in the page language.
- Decorative icons: `alt=""`.
- Hero images: `loading="eager"` + `fetchpriority="high"`.
- Below-the-fold: `loading="lazy"`.
- Add `<image:image>` entries to `sitemap.xml` once WordPress is wired in.

## 8. Content quality for LLMs (GEO)

- Short factual intro near the top of every page (`PageSummaryBlock`).
- Clear heading hierarchy (one H1, then H2/H3).
- No critical info baked only into images or PDFs.
- Bjorli mentioned explicitly by name in the first paragraph.
- Avoid marketing fluff in factual blocks ("magical", "unforgettable").
- Tables are fine and well-extracted by LLMs — use them for opening
  hours, prices, distances.

## 9. Redirect map placeholder

When migrating from the legacy bjorli.no URLs:

1. Audit current top traffic pages from Google Search Console.
2. Build a CSV `oldPath,newPath,status` (default 301).
3. Implement in Next.js `next.config.js` under `redirects()` or in
   `middleware.ts` for locale-aware rewrites.
4. Update `sitemap.xml` to only include the new canonical URLs.

## 10. Production handoff checklist

Before flipping bjorli.no to the new Next.js frontend:

- [ ] All pages return correct canonical + hreflang for their locale.
- [ ] `sitemap.xml` is generated from WordPress, not static.
- [ ] `robots.txt` returns environment-appropriate rules (production allows, staging disallows).
- [ ] `llms.txt` is up to date with current page list and key facts.
- [ ] FAQ schema validates in Google Rich Results Test for all FAQ-bearing pages.
- [ ] BreadcrumbList validates for all detail pages.
- [ ] Event / NewsArticle / Article schemas validate.
- [ ] No `noindex` left on production pages by accident.
- [ ] 301 redirect map covers all legacy URLs.
- [ ] Open Graph + Twitter cards preview correctly in Slack / Facebook / X debuggers.
- [ ] Page speed: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- [ ] PWA: manifest + service worker registered; Lighthouse PWA score ≥ 90.