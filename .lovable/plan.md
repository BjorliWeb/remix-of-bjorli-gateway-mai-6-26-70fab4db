# Winter homepage + reusable Early Bird campaign section

## What changes for visitors

- `/` and every localized homepage (`/en`, `/de`, `/nl`, `/da`, `/sv`) go back to the winter homepage: winter hero, winter theme tokens, winter sections. Summer stays fully available at `/sommer/` and its localized aliases and in navigation.
- A new campaign band sits directly below the hero. It is configuration-driven and can be reused later for opening weekend, Christmas, Easter and other campaigns.
- Early Bird behaviour, per your instruction:
  - Before 4 Sep 2026: teaser only — label, headline, campaign period, body and the anticipation line. No prices, no CTA button.
  - 4–20 Sep 2026: the primary CTA "Kjøp sesongkort" appears, pointing at the existing Skiperformance shop URL already used across the site.
  - After 20 Sep 2026: the section disappears completely, leaving no gap.

## Season switch

`src/lib/season.ts` already carries the seasonal switch with a TODO to flip back in mid-September. Flipping `DEFAULT_SEASON` from `'summer'` to `'winter'` moves the root route to the winter homepage component, the winter theme and the winter navbar CTA in one place — no route, canonical or hreflang changes.

The homepage SEO copy in `src/lib/seo/routeSeo.ts` is currently written summer-first (an inline comment marks it). It gets restored to winter-leaning copy for all six locales, keeping the corrected geography ("øverst i Gudbrandsdalen, ved grensen til Romsdalen") and existing title/description length conventions. Canonicals, hreflang, og:locale, sitemap and trailing slashes are untouched.

## Campaign configuration

New file `src/lib/cms/campaigns.ts`, following the existing structured content pattern (same style as `subpages.ts` / `summerHomepageCopy.ts`) — no new CMS, table or dependency:

```text
Campaign {
  id, enabled, theme?
  startsAt, endsAt            // ISO dates, controls visibility
  ctaFromDate?                // CTA hidden before this date
  image { src, alt, focalDesktop, focalMobile, aspect }
  copy per locale: eyebrow, headline, period, body, supportingLine,
                   ctaLabel, ctaHref, secondaryCta?
}
```

Norwegian source copy exactly as supplied (EARLY BIRD / "Sesongens beste pris nærmer seg" / 4.–20. september 2026 / body / "Er du klar for en ny vinter? ⛷️❄️"). EN, DE, NL, DA, SV are human-sounding translations that preserve meaning, dates and CTA intent — no robotic phrasing.

## Campaign component

New `src/components/HomepageCampaign.tsx`:

- Returns `null` when disabled, before `startsAt`, or after `endsAt` — no wrapper, no empty spacing.
- Full-bleed image band using the existing design tokens, radii and spacing rhythm; a soft winter-blue gradient only on the text side for readability.
- Separate `object-position` for mobile and desktop so the skier/lift subject stays in the safe area; fixed aspect ratio to prevent layout shift; `loading="lazy"`, `decoding="async"`, explicit width/height.
- Heading renders as `h2` so the homepage heading order stays valid.
- Motion respects `prefers-reduced-motion`, matching how the hero handles it.
- CTA is an external link with the existing ski-pass analytics call (`trackSkiPassClick`, `cta_location: 'campaign_early_bird'`) — no new event names.

Rendered from `src/pages/Index.tsx` between the hero and `HomepageSections`.

## Campaign image

You are uploading the winter photo. I will register it through the project's asset pipeline, serve it as optimized WebP/AVIF with a fallback, and write descriptive Norwegian alt text based on what is actually visible in it. If the upload does not arrive, I will pause and ask rather than substitute another photo.

## Explicitly unchanged

Header, footer, navigation, Fnugg live status, analytics and consent, Turnstile, forms, Supabase, redirects, robots, sitemap generation, prerender route registry, structured data and metadata architecture, packages and environment variables.

## Files changed

- `src/lib/season.ts` — `DEFAULT_SEASON` → `'winter'`
- `src/lib/seo/routeSeo.ts` — winter-first homepage title/description, 6 locales
- `src/lib/cms/campaigns.ts` — new campaign config + localized copy
- `src/components/HomepageCampaign.tsx` — new component
- `src/pages/Index.tsx` — mount the campaign below the hero
- `src/assets/...asset.json` — pointer for the uploaded campaign image

## Verification

Lint, typecheck and production build; confirm all localized homepage routes prerender and the sitemap URL count is unchanged; test the campaign in scheduled, active and expired states by shifting the clock; check mobile/tablet/desktop for overflow, contrast, focus visibility and no horizontal scroll.
