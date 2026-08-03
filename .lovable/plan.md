# Trailing-slash URL normalization (internal links, canonicals, hreflang, sitemap)

## 1. Verified root cause

Production is Cloudflare Pages. The prerender step writes each route as a directory index
(`dist/sommer/index.html`, `dist/en/summer/index.html`, ...). Cloudflare Pages canonicalizes
directory paths with a **308 to the trailing-slash version**. Verified live:

```text
https://www.bjorli.no/sommer   -> 308 https://www.bjorli.no/sommer/
https://bjorli.no/overnatting  -> 308 .../overnatting/
https://bjorli.no/en           -> 308 .../en/
https://bjorli.no/live         -> 308 .../live/
https://bjorli.no/sommer/      -> 200
```

Routes that are not prerendered (e.g. `/ski-holiday-norway`) return 200 without a slash, which is why
the redirect count (198) tracks the prerendered set plus legacy rules rather than every route.

The app generates every internal URL **without** a trailing slash, so:

- ~4,116 internal links point at the 308 URL (nav, footer, cards, CTAs, breadcrumbs, related links).
- ~196 canonicals point at a 308 URL (`SEOHead`, `PageMeta`, prerendered `<link rel="canonical">`).
- hreflang, `og:url`, JSON-LD `url` and `sitemap.xml` share the same non-slash form.

Additional proven issue: the legacy rule `/parking -> /parkering` lands on a URL that then 308s to
`/parkering/` — a two-hop chain ending on a non-200 destination.

**Decision: normalize forward to trailing slash**, matching what production already serves. Do not
fight Cloudflare's directory canonicalization.

Exclusions honoured everywhere: external URLs, `mailto:`, `tel:`, `#hash`, API routes, asset paths and
file extensions (`.pdf`, `.xml`, `.txt`, `.jpg`, `.png`, `.webp`, `.svg`) never get a slash appended.

## 1b. Resolved: canonical production host

Both hosts serve the trailing-slash routes directly, with **no redirect in either direction**:

```text
https://bjorli.no/          200      https://www.bjorli.no/          200
https://bjorli.no/sommer/   200      https://www.bjorli.no/sommer/   200
https://bjorli.no/en/       200      https://www.bjorli.no/en/       200
```

Both hosts already emit the same apex canonical, and `robots.txt` advertises the apex sitemap:

```text
curl https://bjorli.no/sommer/      -> <link rel="canonical" href="https://bjorli.no/sommer" />
curl https://www.bjorli.no/sommer/  -> <link rel="canonical" href="https://bjorli.no/sommer" />
robots.txt                          -> Sitemap: https://bjorli.no/sitemap.xml
```

**Selected canonical host: `https://bjorli.no` (apex).** It resolves 200 directly, matches the existing
canonical tags, the sitemap `ORIGIN` default and `robots.txt`. It is used consistently for canonical,
hreflang, x-default, sitemap `<loc>` + alternates, `og:url`, JSON-LD `url`/`isPartOf`, and the
`llms.txt` / `llms-full.txt` key-page URLs. No `www` absolute URLs are emitted anywhere.

Noted, not in scope: `www` also answers 200, so the site is reachable on two hosts. The apex canonical
tag on both already consolidates them for search engines. A host-level `www -> apex` 301 would be
cleaner, but that is a Cloudflare setting and is out of scope unless requested.

## 1c. Resolved: non-prerendered and private routes

Direct runtime checks on the apex host (no redirects anywhere):

```text
/admin/login             200      /admin/login/             200
/ski-holiday-norway      200      /ski-holiday-norway/      200
/nyheter/test-artikkel   200      /nyheter/test-artikkel/   200   (news detail)
/arrangementer/markens-grode 200  /arrangementer/markens-grode/ 200 (event detail)
/finnesikke              200      /finnesikke/              200   (404 route, SPA shell)
/robots.txt              200      /site.webmanifest         200
```

Non-prerendered paths fall through to the SPA shell with a 200 in **both** forms, so adding the slash
never introduces a redirect or a route failure — including admin, detail routes and 404s.

**Exclusions the shared helper still needs, and why:**

| Pattern | Excluded? | Reason |
| --- | --- | --- |
| `/admin` and `/admin/...` | Yes | Verified to work with a slash, but it is a private, `noindex` surface with zero SEO benefit. Excluding it keeps admin URLs, bookmarks and auth redirects byte-identical to today. |
| `/api`, `/api/...` | Yes | Endpoint paths; a slash can change server routing. Both the bare `/api` and the `/api/` prefix are excluded. |
| `/assets`, `/assets/...` | Yes | Build output; must stay exact. Both bare and prefixed forms excluded. |
| Any path with a file extension | Yes | `/Snartur_2023_web.pdf`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/site.webmanifest`, images. Extension matching allows long extensions so `.webmanifest` is covered. |
| `/` (root) | Yes (no-op) | Already ends in a slash, returned unchanged. |
| External, `//`, `mailto:`, `tel:`, bare `#hash` | Yes | Not internal paths. |
| Public content routes, incl. detail routes and 404 paths | **No** | Verified 200 in slash form; these get normalized. |

Query strings and fragments are always preserved and the slash is inserted before them.

## 2. There is already a single chokepoint

Almost all internal navigation goes through `useLocalizedPath()` (`lp()`), used in 36 files (Navbar,
Footer, ContentCard, Breadcrumbs, CTA blocks, listing templates, RelatedLinksBlock, ...). There are
only **4** hardcoded `to="/…"` literals in the whole `src` tree, and the only raw `href="/…"` values
are the two `Snartur_2023_web.pdf` asset links (excluded by rule).

So the fix is shared-logic-only. No repository-wide string replacement.

Note: the stack is Vite + React Router (not TanStack Start), so trailing-slash behaviour is entirely
ours to define in the URL builders — the router itself matches both forms.

## 3. Files that would change

| File | Change |
| --- | --- |
| `src/lib/url/normalizeInternalPath.ts` | **New.** Pure, dependency-free shared module. No React, no browser APIs, no app hooks — safe to import from both the app and the Node build scripts. |
| `src/i18n/useLocalizedPath.ts` | Imports the shared helper and applies it to `lp()`'s return value; `stripLocalePrefix()` tolerates a trailing slash on input so route matching is unchanged. |
| `src/components/SEOHead.tsx` | Canonical, hreflang alternates, x-default and `og:url` use the same normalizer. |
| `src/components/seo/PageMeta.tsx` | Same normalizer for its canonical override. |
| `scripts/prerender.ts` | `buildHref()` plus crawlable nav/related-link hrefs emit trailing slashes, so prerendered HTML matches the served URL. |
| `scripts/build-sitemap.ts` | `buildHref()` emits trailing slashes in `<loc>` and `xhtml:link` alternates. |
| `src/lib/seo/sitemap.ts` | `buildLocalizedHref()` aligned with the same rule. |
| `public/llms.txt`, `public/llms-full.txt` | Key-page URLs updated to the final 200 form. |
| The 4 hardcoded `to="/…"` literals | Routed through `lp()` or given the slash (App.tsx, NotFound-style link, AdminLogin, LegacyLivecamsRedirect). |
| `public/_redirects` | **Only** the proven-chain targets get a trailing slash (`/parking -> /parkering/`). No rule added, removed or repointed elsewhere. |

`src/lib/seo/schema.ts` needs no change: it receives URLs from the callers above and inherits the fix.

## 4. Files inspected, not changed

`src/i18n/routes.ts` (slug registry — routes stay untouched), `src/App.tsx` route table,
`src/components/NavLink.tsx`, `src/lib/seo/origin.ts`, `src/lib/seo/routeSeo.ts`,
`src/lib/seo/schema.ts`, `public/_headers`, `public/robots.txt`, `public/sitemap.xml` (generated),
`index.html`, and the 36 `lp()` consumer components.

## 5. Proposed shared implementation

```ts
// src/i18n/useLocalizedPath.ts
const FILE_EXT = /\.[a-z0-9]{2,5}$/i;

export const withTrailingSlash = (path: string): string => {
  if (!path.startsWith('/')) return path;   // external / mailto / tel / relative
  if (path.startsWith('//')) return path;   // protocol-relative
  const m = path.match(/^([^?#]*)([?#].*)?$/);
  const base = m?.[1] ?? path;
  const rest = m?.[2] ?? '';
  if (base.endsWith('/')) return path;
  if (FILE_EXT.test(base)) return path;     // .pdf .xml .jpg ...
  if (base.startsWith('/api/') || base.startsWith('/assets/')) return path;
  return base + '/' + rest;
};
```

`lp()` returns `withTrailingSlash(...)`; the SEO/canonical/sitemap/prerender builders apply the same
rule (the two Node scripts import the helper directly, since it is pure and dependency-free).
Query strings and hashes are preserved: `/vaer-og-webkamera?from=livecams` becomes
`/vaer-og-webkamera/?from=livecams`.

## 6. Representative routes to test

`/`, `/en/`, `/de/`, `/sommer/`, `/vinter/`, `/overnatting/`, `/en/summer/`, `/de/sommer/`,
`/nl/accommodatie/`, `/heiskort/`, `/vaer-og-webkamera/`, `/arrangementer/` plus one event detail,
`/nyheter/` plus one article, `/handel/`, `/live/`, `/admin/login` (behaviour unchanged), a 404 path,
and the legacy hits `/parking`, `/livecams`, `/hva-skjer`.

For each: rendered link `href`, canonical, hreflang set, `og:url`, sitemap entry, and `curl -I`
showing **200 with no redirect**.

## 7. Risks

- **Router matching**: React Router must still match `/sommer/`. It does by default, but every route
  and `stripLocalePrefix` normalization gets an explicit check.
- **Active-state styling**: `NavLink` active matching compares pathnames; a slash mismatch could drop
  the active highlight. Verify Navbar and Footer.
- **GA4 `page_path`**: values now carry a trailing slash. Event names, parameters and consent logic are
  untouched — a value-shape change only, worth flagging to report owners.
- **Search Console**: a short re-crawl period while the slash form consolidates. No property changes.
- **Sitemap churn**: one full-sitemap URL rewrite in a single deploy (expected).

## 8. Rollback

Single focused PR on `fix/trailing-slash-url-normalization`. Rollback = revert the PR. The normalizer
is additive, so making `withTrailingSlash` an identity function is a valid one-line hotfix without a
full revert.

## 9. Uncertainty requiring verification

1. Whether Cloudflare Pages' trailing-slash canonicalization is configurable for this project — if the
   strip-slash direction is preferred instead, the same helper flips with one constant.
2. Whether any external campaign links to a dynamic detail route in the non-slash form; those keep
   working via the 308, but worth confirming.
3. The sitemap uses `https://bjorli.no` while live links resolve on `www`. Out of scope unless asked.

## Scope confirmation

No copy, design, route names, packages, env vars, Supabase, GA4 config or Search Console changes.
Legacy redirects are touched only where a chain to a non-200 destination was proven.