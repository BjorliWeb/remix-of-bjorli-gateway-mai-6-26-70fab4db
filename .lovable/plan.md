# Technical SEO verification: hreflang, timeouts, noindex, orphan

Verification-first task. No production behaviour changes unless a deterministic defect is proven.

## 1. Verify the three translation clusters (18 URLs)

Run the production build and assert, from `dist/` and `public/sitemap.xml`, for every URL in the `vinter`, `heiskort` and `skiskole` clusters:

- prerendered `index.html` exists at the expected path
- URL present in sitemap with trailing slash and apex `https://bjorli.no`
- self-referencing canonical
- hreflang set = 6 locales + `x-default`, all pointing at final canonical URLs
- no hreflang target matches a source line in `public/_redirects`
- no `noindex` in the prerendered head

Registry already confirms the slugs match the audit list (`routes.ts:85/88/99`), so this step is expected to pass and produce evidence, not edits.

## 2. Build-time invariant gap (only change likely needed)

Already covered: `assertSitemapCoverage()` in `scripts/prerender.ts` fails the build when any sitemap `<loc>` HTML URL lacks a prerendered file.

Not covered today:
- sitemap `<xhtml:link rel="alternate">` hrefs are never checked against prerendered output
- no check that an hreflang/canonical target is not a redirect source in `public/_redirects`

Smallest fix: extend the existing assertion (same function, same file) to also collect alternate hrefs and validate them with the identical path→file rule, plus a redirect-source cross-check. No architecture change, no new script, no test refactor.

## 3. Timeouts

Compare the three timed-out routes' build output against sibling locale pages (file size, template path used, any route-specific code path). If they use the same shared `buildHtmlDocument` path and are byte-comparable in structure to siblings that did not time out, report as transient crawl/CDN failures and recommend an Ahrefs recrawl. For `http://bjorli.no/`, confirm only that HTTP→HTTPS is handled at the hosting layer and that no internal link or canonical uses `http://`.

## 4. Non-indexable pages

Inventory every explicit noindex source: `SEOHead` route noindex + non-production origin gate, runtime-only Supabase submissions (`src/lib/cms/seo.ts:202`), preview `X-Robots-Tag` headers, `/admin/*`, `ImageInventory`. Report which public route types can legitimately be noindex. If the three exact URLs are not derivable from the repo, request the Ahrefs export rather than changing behaviour.

## 5. Orphan page

Build an internal-link graph from prerendered HTML: parse `<a href>` from every `dist/**/index.html`, compare against sitemap URLs, list URLs with zero incoming links. If exactly one deterministic orphan appears, report it and propose the single smallest contextual link placement (no nav redesign). Otherwise request the Ahrefs orphan export.

## 6. Out of scope

Meta description/title length, low word count, SERP mismatch, IndexNow, one-dofollow-link pages, design, copy, CMS, PDF policy, `/salgsbetingelser/`, existing redirects, hosting.

## Verification

`tsgo` typecheck, `vitest run`, production build (with both coverage assertions), plus the ad-hoc audit scripts above run against `dist/`. Audit scripts stay in `/tmp`, not committed, unless the invariant extension in step 2 is needed.

## Report delivered

The eight numbered answers requested, with the URL-by-URL table for the 18 cluster URLs and an explicit statement of any code change made and why.
