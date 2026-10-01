# SEO routing, 404 and redirects (Oct 2026)

## Language links
All internal links are built with `localizeHref(path, locale)` (`src/i18n/localizeHref.ts`),
which reads `ROUTE_SLUGS` in `src/i18n/routes.ts`. React (`useLocalizedPath`) and
`scripts/prerender.ts` use the same function. The build fails if any generated HTML
links to a missing page, a redirect source or a non-trailing-slash URL.

## 404 and app-only routes
- `dist/404.html` is written by prerender. With that file present Cloudflare Pages
  returns HTTP 404 for every URL without a file. There is no SPA fallback rule.
- App-only routes that must load directly get a noindex shell:
  `APP_SHELL_ROUTES` in `scripts/lib/linkCheck.ts` (admin login, reset password,
  MFA, submissions, submit-event forms, internal review pages). Add new
  non-public routes there.
- Supabase auth links (password reset) land on `/admin/reset-password/`, which is covered.
- There is no `functions/` directory, so no Pages Functions intercept `_redirects`.

## www -> bjorli.no (Cloudflare dashboard, not `_redirects`)
`_redirects` cannot match hostnames. Create one rule in the bjorli.no zone:
Rules -> Redirect Rules -> Create rule
- When: Custom filter expression: `(http.host eq "www.bjorli.no")`
- Then: Dynamic redirect, expression:
  `concat("https://bjorli.no", http.request.uri.path)`
- Status: 301, "Preserve query string" ON.
The `www` DNS record must be proxied (orange cloud). Test:
`curl -I "https://www.bjorli.no/heiskort/?a=1"` -> `301 location: https://bjorli.no/heiskort/?a=1`
(one hop, no chain).

## Publishing dynamic content
Prerender and sitemap are generated from the build-time CMS snapshot. Publishing,
editing or unpublishing a news/event/tip item only reaches static HTML and the sitemap
after a new Cloudflare Pages build (push to `main`, or the deploy hook described in
DEPLOYMENT.md once created). An unpublished item then has no HTML file -> HTTP 404,
and is removed from sitemap and links (covered by `src/test/seoRouting.test.ts`).

## Overlap recommendations (no changes made)
- `/langrenn/` vs `/aktiviteter/langrenn/`: keep `/langrenn/` as the main page; make the
  activity entry link to it (or 301 it) once editors confirm it has no unique content.
- `/live/` vs `/vaer-og-webkamera/`: keep `/vaer-og-webkamera/` as the indexable page;
  consider noindex,follow on `/live/` or a 301 if `/live/` shows only the same data.
- `/ski-holiday-norway/` vs `/en/bjorli-ski-resort/`: different intent (international
  "ski holiday in Norway" landing vs resort facts). Keep both, cross-link, keep distinct titles.

## HTTP verification still needed
Status codes and Location headers must be checked on a Cloudflare Pages preview deploy
(local `wrangler pages dev` did not answer in the sandbox). Check: the 19 audit URLs (301),
`/nb/mountain-information/` (301), `/seo-test-side-finnes-ikke-20261001/` (404),
`/nyheter/sesongkortsalget-er-apnet/` (404), `/admin/login/` (200), PDF 404.
