# Deployment — Cloudflare Pages

This Vite/React/TypeScript SPA is deployed as a static frontend to
Cloudflare Pages from GitHub. The live `bjorli.no` domain is **not**
touched until staging QA has been signed off.

## Cloudflare Pages project settings

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (project root) |
| Install command | `npm ci` |
| Node version | `20` (pinned via `.nvmrc` and `NODE_VERSION` env var) |

The build runs the `prebuild` script (`tsx scripts/build-sitemap.ts`) to
regenerate `public/sitemap.xml` from the canonical route registry, then
`vite build`. No `bun` runtime is required on Cloudflare Pages.

## Required environment variables (Preview + Production)

Public, inlined at build time by Vite. All are safe to ship in the
client bundle.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `NODE_VERSION=20`

## Optional production-only environment variables

Leave blank for Preview deployments so preview traffic does not enter
production analytics.

- `VITE_GA4_MEASUREMENT_ID`
- `VITE_GTM_ID`
- `VITE_GOOGLE_SITE_VERIFICATION`

## SPA routing

The app uses `react-router-dom` `BrowserRouter`. `public/_redirects`
ships a single rule (`/*  /index.html  200`) so deep links and page
refreshes fall back to `index.html` on Cloudflare Pages.

## Security

- **Never commit `.env`.** It is gitignored. Manage values in the
  Cloudflare Pages dashboard (Project → Settings → Environment variables).
- **Never expose the Supabase service role key** to the frontend or to
  Cloudflare Pages env vars. It stays inside Lovable Cloud / Supabase only.
- **Never put the Supabase DB password or any backend secret** in
  Cloudflare Pages env vars. Pages only needs the public `VITE_*` values.
- Only `VITE_*`-prefixed vars are read by the frontend build; nothing
  else is shipped to the browser.

## Out of scope for this readiness step

- No DNS changes.
- No `bjorli.no` / `www.bjorli.no` custom-domain attachment.
- No Supabase URL allow-list updates.
- No live-domain or WordPress changes.

These happen later, after the staging `*.pages.dev` (or
`staging.bjorli.no`) deployment has been QA'd.