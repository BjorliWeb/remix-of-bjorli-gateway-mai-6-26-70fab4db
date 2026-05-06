# Next.js App Router migration guide

This project is intentionally structured so that the current Vite + React Router
frontend can be moved to **Next.js App Router** and deployed on **Vercel**
with minimal refactoring. Editorial content stays behind the CMS adapter
layer (`src/lib/cms/*`), so swapping React Router for Next.js routing does
not require redesigning any component.

## Guiding principles

- **Routes are 1:1.** Every React Router `<Route>` maps to one App Router
  segment under `app/`.
- **Localization is path-prefix based.** Locales are `no` (root, no prefix),
  `en`, `de`, `nl`, `da`, `sv` — same as today.
- **CMS layer stays untouched.** Components keep importing from `@/lib/cms`
  and that module's `activeAdapter` is what changes (mock → Sanity / Strapi /
  DatoCMS / Storyblok).
- **No editorial content in Supabase.** Supabase is reserved for live
  operational data (alerts, status), form submissions, and user accounts.

## Suggested `app/` structure

```
app/
  layout.tsx                       ← global <Layout/>, fonts, providers
  page.tsx                         ← Index (winter homepage)
  sitemap.ts                       ← generates sitemap.xml at build
  robots.ts                        ← generates robots.txt at build
  [locale]/                        ← matches /en, /de, /nl, /da, /sv
    layout.tsx                     ← LanguageProvider, hreflang, html lang
    page.tsx                       ← localized homepage
    (shared route group)
      vinter/page.tsx
      sommer/page.tsx
      bjorli-skisenter/page.tsx
      heiskort/page.tsx
      apningstider/page.tsx
      live/page.tsx
      livecams/page.tsx
      loypekart/page.tsx
      skiutleie/page.tsx
      skiskole/page.tsx
      langrenn/page.tsx
      overnatting/page.tsx
      mat-og-drikke/page.tsx
      reisen-hit/page.tsx
      fotturer/page.tsx
      sykling/page.tsx
      familie/page.tsx
      aktiviteter/
        page.tsx                   ← listing
        [slug]/page.tsx            ← detail
      tips/
        page.tsx
        [slug]/page.tsx
      nyheter/
        page.tsx
        [slug]/page.tsx
      arrangementer/
        page.tsx
        [slug]/page.tsx
      praktisk-info/page.tsx
      kontakt/page.tsx
```

The Norwegian (default) routes live at the same paths but **without** the
`[locale]` prefix — handled either by mounting the same route group at the
root or via a `middleware.ts` rewrite.

## Route → App Router mapping

| Current route (React Router)       | App Router file                              | Component today                           |
|------------------------------------|----------------------------------------------|-------------------------------------------|
| `/`                                | `app/page.tsx`                               | `src/pages/Index.tsx`                     |
| `/vinter`                          | `app/vinter/page.tsx`                        | `src/pages/Vinter.tsx`                    |
| `/sommer`                          | `app/sommer/page.tsx`                        | `src/pages/Sommer.tsx`                    |
| `/bjorli-skisenter`, `/skisenter`  | `app/bjorli-skisenter/page.tsx`              | `src/pages/SkiCenter.tsx`                 |
| `/heiskort`                        | `app/heiskort/page.tsx`                      | `src/pages/Heiskort.tsx`                  |
| `/apningstider`                    | `app/apningstider/page.tsx`                  | `src/pages/OpeningHours.tsx`              |
| `/live`                            | `app/live/page.tsx`                          | `src/pages/Live.tsx`                      |
| `/livecams`                        | `app/livecams/page.tsx`                      | `src/pages/Livecams.tsx`                  |
| `/loypekart`                       | `app/loypekart/page.tsx`                     | `src/pages/Loypekart.tsx`                 |
| `/skiutleie`                       | `app/skiutleie/page.tsx`                     | `src/pages/SkiRental.tsx`                 |
| `/skiskole`                        | `app/skiskole/page.tsx`                      | `src/pages/SkiSchool.tsx`                 |
| `/langrenn`                        | `app/langrenn/page.tsx`                      | `src/pages/Langrenn.tsx`                  |
| `/overnatting`                     | `app/overnatting/page.tsx`                   | `src/pages/Accommodation.tsx`             |
| `/mat-og-drikke`                   | `app/mat-og-drikke/page.tsx`                 | `src/pages/FoodDrink.tsx`                 |
| `/reisen-hit`                      | `app/reisen-hit/page.tsx`                    | `src/pages/GettingHere.tsx`               |
| `/fotturer`                        | `app/fotturer/page.tsx`                      | `src/pages/Fotturer.tsx`                  |
| `/sykling`                         | `app/sykling/page.tsx`                       | `src/pages/Sykling.tsx`                   |
| `/familie`                         | `app/familie/page.tsx`                       | `src/pages/Familie.tsx`                   |
| `/aktiviteter`                     | `app/aktiviteter/page.tsx`                   | `src/pages/Activities.tsx`                |
| `/aktiviteter/:slug`               | `app/aktiviteter/[slug]/page.tsx`            | `src/pages/ContentDetailPage.tsx` (kind)  |
| `/tips`                            | `app/tips/page.tsx`                          | `src/pages/Tips.tsx`                      |
| `/tips/:slug`                      | `app/tips/[slug]/page.tsx`                   | `src/pages/ContentDetailPage.tsx` (kind)  |
| `/nyheter`                         | `app/nyheter/page.tsx`                       | `src/pages/News.tsx`                      |
| `/nyheter/:slug`                   | `app/nyheter/[slug]/page.tsx`                | `src/pages/ContentDetailPage.tsx` (kind)  |
| `/arrangementer`                   | `app/arrangementer/page.tsx`                 | `src/pages/Events.tsx`                    |
| `/arrangementer/:slug`             | `app/arrangementer/[slug]/page.tsx`          | `src/pages/ContentDetailPage.tsx` (kind)  |
| `/praktisk-info`                   | `app/praktisk-info/page.tsx`                 | `src/pages/PracticalInfo.tsx`             |
| `/kontakt`                         | `app/kontakt/page.tsx`                       | `src/pages/Contact.tsx`                   |
| `/en/*`, `/de/*`, `/nl/*`, `/da/*`, `/sv/*` | `app/[locale]/...` (same tree)      | Same components, locale via `params`      |

## Component → App Router responsibilities

| Today                              | Becomes                                                                |
|------------------------------------|-----------------------------------------------------------------------|
| `src/components/SEOHead.tsx`       | Per-page `export const metadata` + `generateMetadata()`               |
| `src/components/Layout.tsx`        | `app/layout.tsx` (root) and `app/[locale]/layout.tsx`                 |
| `src/i18n/LanguageContext.tsx`     | Server-resolved locale from `params.locale`, passed to a thin client provider |
| `src/lib/cms/index.ts`             | Unchanged — called from RSC (server) for SSR/ISR                      |
| `public/sitemap.xml`               | `app/sitemap.ts` (programmatic, iterates locales × routes)            |
| `public/robots.txt`                | `app/robots.ts`                                                       |
| `useCms` hook                      | Replace with direct `await getX()` in server components               |

## Per-page metadata pattern (Next.js)

Today every page renders `<SEOHead/>` which mutates `document.head` on the
client. In Next.js, this becomes static `metadata` resolved on the server,
which is what Google / OG scrapers see:

```ts
// app/[locale]/heiskort/page.tsx
import { getSubPage } from '@/lib/cms/subpages';
import type { Metadata } from 'next';

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const sp = await getSubPage(params.locale as any, 'heiskort');
  if (!sp) return {};
  return {
    title: sp.seoTitle,
    description: sp.seoDescription,
    alternates: {
      canonical: `/heiskort`,
      languages: {
        no: '/heiskort',
        en: '/en/heiskort',
        de: '/de/heiskort',
        nl: '/nl/heiskort',
        da: '/da/heiskort',
        sv: '/sv/heiskort',
        'x-default': '/heiskort',
      },
    },
    openGraph: {
      title: sp.ogTitle ?? sp.seoTitle,
      description: sp.ogDescription ?? sp.seoDescription,
      images: sp.heroImage?.url ? [sp.heroImage.url] : undefined,
    },
  };
}
```

The same shape applies to news / events / tips / activities detail pages —
the data already comes from the CMS adapter via `getNewsItem`, `getTipItem`,
`getEventItem`, `getActivityItem`.

## Sitemap generation

Replace `public/sitemap.xml` with `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';

const ROUTES = [
  '/', '/vinter', '/sommer', '/bjorli-skisenter', '/heiskort',
  '/apningstider', '/live', '/livecams', '/loypekart', '/skiutleie',
  '/skiskole', '/langrenn', '/overnatting', '/mat-og-drikke',
  '/reisen-hit', '/fotturer', '/sykling', '/familie',
  '/aktiviteter', '/tips', '/nyheter', '/arrangementer',
  '/praktisk-info', '/kontakt',
];
const LOCALES = ['', '/en', '/de', '/nl', '/da', '/sv'];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = 'https://bjorli.no';
  return ROUTES.flatMap((path) =>
    LOCALES.map((prefix) => ({
      url: `${origin}${prefix}${path === '/' ? '' : path}` || `${origin}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1.0 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((p) => [p === '' ? 'no' : p.slice(1), `${origin}${p}${path === '/' ? '' : path}`])
        ),
      },
    })),
  );
}
```

## Vercel deployment notes

- **Framework preset**: Next.js (auto-detected).
- **Environment variables**: copy `VITE_SUPABASE_URL` →
  `NEXT_PUBLIC_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` →
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Server-only secrets (CMS write tokens,
  webhook signing keys) go without the `NEXT_PUBLIC_` prefix.
- **Image domains**: add the future CMS asset host (`cdn.sanity.io`,
  `images.ctfassets.net`, etc.) to `next.config.js` `images.remotePatterns`.
- **ISR**: list pages can be statically rendered with `revalidate` (e.g.
  `export const revalidate = 300`). Operational data (`/live`,
  `/apningstider`) should be `dynamic = 'force-dynamic'` or use
  client-side fetching.
- **`/live` and operational data**: keep fetching from the operational
  backend (Supabase) on the client. Do not pre-render this data.
- **Form submissions** (`/kontakt`): convert to a Route Handler at
  `app/api/contact/route.ts` that validates and forwards to Supabase /
  email — never inline credentials in client components.
- **Redirects**: define legacy `/skisenter` → `/bjorli-skisenter` in
  `next.config.js` `redirects()` (already aliased today via React Router).

## What changes vs. what stays

**Stays the same:**
- All component files in `src/components/*` (drop `<SEOHead/>`, replace
  router-specific imports with `next/link` and `next/navigation`).
- The full `src/lib/cms/*` module — public API and adapter contract.
- All assets under `src/assets/`.
- Tailwind tokens, `index.css`, design system.
- i18n dictionaries.

**Changes:**
- `react-router-dom` → `next/link` + `next/navigation` (`useRouter`,
  `usePathname`, `useParams`).
- `<SEOHead/>` is replaced by per-page `metadata` exports.
- `BrowserRouter` and the `App.tsx` route table are deleted; the file
  system under `app/` becomes the source of truth.
- `useCms` hook is only used in client components; server components
  call adapter functions directly with `await`.

## Pre-migration checklist (already in place)

- [x] CMS-agnostic content adapter (`src/lib/cms/*`).
- [x] Per-route SEO resolved through the CMS layer (`resolveSeoForRoute`).
- [x] hreflang alternates emitted for all 6 locales + `x-default`.
- [x] One `<h1>` per page (verified in `PageHero` and homepage hero).
- [x] Crawlable intro text on every page (`intro` field on every CMS entry).
- [x] Semantic HTML across listing/detail templates (`<article>`, `<nav>`,
  `<section>`, `<details>`).
- [x] Sitemap covers every route × locale with hreflang alternates.
- [x] Structured data (`WebPage`, `Article`, `NewsArticle`, `Event`,
  `TouristDestination`).
- [x] Mock adapter shape matches Sanity / Strapi / DatoCMS / Storyblok
  conventions (see `src/lib/cms/types.ts`).