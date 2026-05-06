# CMS Adapter Layer

Frontend is **CMS-agnostic**. Components consume content only through
`@/lib/cms`, never via Supabase or a CMS SDK directly.

**Target architecture**:

- **Lovable** — design system + component prototype
- **WordPress** — CMS / content source (REST or WPGraphQL + ACF)
- **Next.js** — production frontend (App Router)
- **Vercel / Netlify** — frontend hosting
- **Supabase / Lovable Cloud** — runtime ops only (live alerts, opening hours)

The mock adapter in this folder mirrors the field shape WordPress will
expose, so swapping providers is a one-line change in `index.ts` plus
a new adapter file.

## Files

- `types.ts` — CMS-friendly field names (`title`, `slug`, `language`, `intro`,
  `body`, `heroImage`, `category`, `season`, `publishedAt`, `updatedAt`,
  `seoTitle`, `seoDescription`, `ogTitle`, `ogDescription`, `ogImage`,
  `canonicalUrl`, `relatedContent`).
- `adapter.ts` — `CmsAdapter` contract every provider must implement.
- `mockAdapter.ts` — Current implementation, served from local i18n + assets.
- `index.ts` — Public API: `getHomepage`, `getNews`, `getEvents`, `getTips`,
  `getActivities`, `getNavigation`, `getFooter`, `getAlerts`,
  `getOpeningHours`, `getPage`, `getAccommodations`, `getFoodDrink`,
  `getSeoSettings`, plus single-item variants.
- `useCms.ts` — React hook helper.
- `WORDPRESS_MAPPING.md` — Detailed CPT / ACF / REST / WPGraphQL field map
  for every content type. Read this before implementing the WP adapter.

## Swapping to WordPress (planned production source)

1. Create `wordpressAdapter.ts` implementing `CmsAdapter` from `adapter.ts`.
   Use either:
   - WordPress REST: `/wp-json/wp/v2/{cpt}?lang={no|en|de|nl|da|sv}`
   - WPGraphQL + ACF: `query Pages($lang: LanguageCodeFilterEnum)`.
2. Map each WP field to the names in `types.ts` inside the adapter —
   never leak `acf.*` or `_embedded` shapes to components.
3. In `index.ts`, change:
   ```ts
   const activeAdapter: CmsAdapter = wordpressAdapter;
   ```
4. No component changes required.
5. See `WORDPRESS_MAPPING.md` for the field-by-field mapping.

## Rules

- Never import from `mockAdapter.ts` directly in components.
- Never add Supabase queries for editorial content. Supabase is reserved for
  user data, form submissions, and live operational data (status, alerts
  feed) — not for CMS-managed pages.
- All new content fields must be added to `types.ts` first, then exposed by
  every adapter.
