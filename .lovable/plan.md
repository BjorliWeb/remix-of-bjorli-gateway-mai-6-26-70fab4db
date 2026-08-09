# Production fixes: detail-page prerender, legacy URLs, canonical consistency, robots check

No redesign, no hosting change, no CMS migration. Cloudflare Pages stays as-is.

## 1. Detail-page prerender (highest priority)

Today `scripts/prerender.ts` explicitly skips `:slug` detail routes, so every
event/news/tip/activity URL is served the SPA fallback — crawlers see homepage
metadata. The blocker is that the CMS mock adapter cannot be imported by the
Node build script: it pulls in `@/...` aliases, image assets (`.jpg`, `.avif`)
and the Supabase client.

Fix in two steps:

**a) Build-time CMS export.** New `scripts/export-cms-content.ts` starts an
in-process Vite server (`createServer({ server: { middlewareMode: true } })`)
and uses `ssrLoadModule` to load `src/lib/cms/mockAdapter.ts` through the same
alias/asset pipeline the app uses. It writes a Node-safe JSON snapshot to
`.cache/cms-content.json` containing, per locale, for news / tips / events /
activities: `slug, title, intro, body excerpt, category, date, heroImage,
seoTitle, seoDescription, availableTranslations`. Only static editorial content
is exported; Supabase-backed approved events remain runtime-only (they are
merged client-side and are not prerendered).

**b) Detail renderer.** `scripts/prerender.ts` gains `renderDetail()` reusing
the existing `buildHtmlDocument`, emitting per detail URL:
`<html lang>`, title, meta description, self-referencing canonical (trailing
slash, apex origin), hreflang only for locales present in
`availableTranslations` + `x-default`, `og:*`/`twitter:*` incl. `og:locale`,
and a body skeleton with H1, intro, body excerpt, date/category (news/events),
and related internal links back to the listing hub and 3 sibling items.
JSON-LD comes from the same shapes already used at runtime
(`NewsArticle` / `Article` / `Event`, via `src/lib/cms/seo.ts` logic reused in
a small shared builder) so runtime `SEOHead` replaces rather than duplicates it.

**c) Sitemap.** `scripts/build-sitemap.ts` reads the same JSON snapshot and
adds the detail URLs (trailing slash, only locales with a translation). The
existing `assertSitemapCoverage()` then guarantees every listed detail URL has
a prerendered file — build fails otherwise.

## 2. Legacy WordPress URLs

`public/_redirects` is extended (301, before JS runs). Proposed per-URL decisions:

| Legacy URL | Decision |
| --- | --- |
| `/salgsbetingelser/` | 301 → `/personvern/` (sales terms are not migrated; if you want them as a real page, say so and I add a route instead) |
| `/author/bjorli/`, `/author/*` | 301 → `/nyheter/` (WP author archives, no value) |
| `/wp-content/uploads/**.pdf` (old program PDFs) | keep the files where they are; add `Disallow: /wp-content/` is already covered — instead add `X-Robots-Tag: noindex` for `/wp-content/*` in `public/_headers` so historical PDFs stay reachable but drop out of the index |
| `/category/*`, `/tag/*`, `/?p=`, `/feed/` | 301 → closest hub (`/nyheter/`) |

All redirect targets are final canonical slash URLs — no chains.
`docs/REDIRECTS.md` gets the same table.

## 3. Internal canonical consistency

Audit already shows navigation, footer and cards go through `useLocalizedPath`
+ `normalizeInternalPath`, so they are correct. Remaining work:

- Detail card links produced in the new prerender skeleton must use
  `normalizeInternalPath` (trailing slash).
- Verify no legacy `_redirects` source is itself linked internally
  (`/livecams`, `/parking`, `/hva-skjer`) — replace any occurrence with the
  final target.
- Re-run the trailing-slash unit tests plus a `dist/` grep for
  `href="/…"` without a trailing slash on non-file paths.

## 4. SEOHead robots check

`src/components/SEOHead.tsx:195` — change

```ts
const isProd = isProductionOrigin(SITE_ORIGIN);
```

to

```ts
const isProd = isProductionOrigin();
```

so indexability follows the real runtime origin (previews become `noindex`)
while canonical / hreflang / og:url keep using `CANONICAL_ORIGIN`. Comment
above `SITE_ORIGIN` updated to state the split explicitly.

## 5. CMS boundary

No change: the `CmsAdapter` abstraction stays, editorial content is not moved
into Supabase. The build-time export in step 1 reads through the adapter, so
swapping to the WordPress adapter later requires no prerender changes.

## Files to change

- `scripts/export-cms-content.ts` (new)
- `scripts/prerender.ts` (detail renderer + registry)
- `scripts/build-sitemap.ts` (detail URLs)
- `src/lib/cms/seo.ts` or a small shared JSON-LD builder (reuse, no behaviour change)
- `src/components/SEOHead.tsx` (one-line robots fix)
- `public/_redirects`, `public/_headers`, `docs/REDIRECTS.md`
- `package.json` (run the export before prerender/sitemap)

## Verification

Typecheck, unit tests, full build; report new file count, sitemap `<loc>`
count, and sample source for one detail URL per type showing title/H1/intro/
canonical/hreflang/OG/JSON-LD.
