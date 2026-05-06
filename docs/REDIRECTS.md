# Redirects — placeholder map

This document is the seed for the production redirect map. It will be
implemented in the Next.js frontend via either:

- `next.config.js` `async redirects()` (preferred for static, well-known mappings)
- A middleware-based lookup table (for bulk WordPress URL migration)
- Hosting-level rules (Vercel `vercel.json` or Netlify `_redirects`)

DO NOT add final redirects in this Lovable prototype. SPA route aliases
(e.g. `/livecams` rendering the same component as `/vaer-og-webkamera`) are
kept in `src/App.tsx` only as a soft fallback so deep links don't 404 in
the prototype. Real 301s must be configured at the hosting layer.

## Schema

Each row in the production redirect table should have:

| field        | type   | description                                          |
| ------------ | ------ | ---------------------------------------------------- |
| old_url      | string | Path or full URL on the legacy WordPress site        |
| new_url      | string | Canonical localized path on the new frontend         |
| status_code  | int    | 301 (permanent) by default; 302 only for temporary   |
| language     | enum   | no \| en \| de \| nl \| da \| sv                     |
| notes        | string | Free-text reason / source / ticket reference         |

## Known cases (seed entries)

| old_url                              | new_url                                   | status | lang | notes                                         |
| ------------------------------------ | ----------------------------------------- | ------ | ---- | --------------------------------------------- |
| /livecams                            | /vaer-og-webkamera                        | 301    | no   | Page renamed & expanded with weather + Fnugg  |
| /en/livecams                         | /en/weather-and-webcams                   | 301    | en   | Same renaming, English locale                 |
| /de/livecams                         | /de/wetter-und-webcams                    | 301    | de   |                                               |
| /nl/livecams                         | /nl/weer-en-webcams                       | 301    | nl   |                                               |
| /da/livecams                         | /da/vejr-og-webcams                       | 301    | da   |                                               |
| /sv/livecams                         | /sv/vader-och-webbkameror                 | 301    | sv   |                                               |
| /dk/*                                | /da/*                                     | 301    | da   | Legacy /dk locale prefix never used in new IA |
| /se/*                                | /sv/*                                     | 301    | sv   | Legacy /se locale prefix never used           |

## Categories still to enumerate (deferred to WP migration)

- Old WordPress page URLs → new localized routes
- Old `/nyheter/<wp-slug>` article URLs → new CMS-driven slugs (if changed)
- Old `/arrangementer/<wp-slug>` event URLs
- Old `/aktiviteter/<wp-slug>` activity URLs
- Old media URLs under `/wp-content/uploads/...` — should generally remain
  reachable via the WordPress origin or be proxied; do NOT 301 these to
  new CDN URLs without verifying social/email backlinks.

## Source of truth at migration time

1. Export full URL list from current bjorli.no (sitemap + Search Console).
2. Map each entry to a canonical route key (`src/i18n/routes.ts`).
3. Resolve unmapped URLs case-by-case with the editorial team.
4. Generate the production redirect file from this CSV/JSON.
