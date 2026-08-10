# Detail-page SEO correctness fixes

Four targeted fixes. No redesign, no hosting/CMS architecture change, no copy rewrites.

## 1. Activity translation-group collisions

`scripts/lib/cmsSnapshot.ts` derives the translation key from the trailing numeric id suffix only, so `activity-no-w-0` and `activity-no-s-0` both collapse to group `0` and summer activities overwrite winter ones.

- Change `groupKeyOf()` to capture an optional season segment: match `-(w|s)-(\d+)$` first and return `w-0` / `s-0`; fall back to the existing `-(\d+)$` rule, then to the slug.
- News, tips and events keep the current numeric keys — their ids have no season segment, so behaviour is unchanged by construction.
- Regression test: build the snapshot shape for all six locales and assert `buildTranslationGroups(snapshot, 'activities')` yields one group per winter item plus one per summer item, each with all six locales present, and that no group mixes a winter and a summer entry. Add a control assertion that news grouping counts are unchanged.
- Re-run sitemap + prerender and confirm every winter and summer activity detail URL appears.

## 2. Detail-page runtime hreflang

Prerender emits per-locale detail URLs from the real translated slugs. `SEOHead` rebuilds them at runtime with `translatePath()`, which only localizes the hub segment and keeps the source slug — wrong whenever a translation has a different slug.

- Extend `ResolvedSeo` in `src/lib/cms/seo.ts` with `alternates?: Partial<Record<Language, string>>` — exact localized detail paths taken from the CMS translation group (locale prefix + localized hub slug + that locale's own entry slug, normalized with `normalizeInternalPath`).
- `SEOHead` uses `alternates` when present for canonical/hreflang/x-default on detail routes; static routes keep `translatePath()` exactly as today.
- Duplicate control: keep clearing `link[rel=alternate][data-hreflang]` before re-emitting, and also remove prerendered alternates that lack the marker attribute so the prerendered set is replaced, never doubled.
- Tests: a NO entry and its EN translation with deliberately different slugs; assert the emitted alternate hrefs use each locale's own slug and that exactly one link per locale plus one `x-default` exists after two consecutive renders.

## 3. Event JSON-LD consistency

Prerender only emits `Event` when `startsAt` is a valid ISO date; runtime `src/lib/cms/seo.ts` always emits `Event` for the events route and falls back to `publishedAt`, which can be a display string like "31. juli – 7. august 2026".

- Export the ISO check (reuse the same predicate as `scripts/lib/cmsSnapshot.ts` `isIsoDate`, moved to a shared module under `src/lib/` so both build and runtime import one implementation).
- Runtime rule: emit `Event` only when `startsAt` is valid ISO; otherwise emit `Article`. Only set `datePublished` / `dateModified` / `startDate` / `endDate` when the underlying value is valid ISO.
- Display dates stay untouched in the UI.
- Test: one event with an ISO `startsAt` → `Event` with `startDate`; one with a display-string date → `Article`, no `startDate`.

## 4. Remove fake editorial freshness

`nowIso()` is used for `publishedAt` / `updatedAt` on static tips and activities (and the generic `getPage` stub), which makes every crawl report fresh content.

- Replace those with a single stable editorial constant date in `src/lib/cms/mockAdapter.ts`, or omit the fields where the type allows, until real CMS dates exist.
- Live/operational paths (approved Supabase event submissions, the "now" comparisons in event filtering) keep real current timestamps.

## Verification

`tsgo` typecheck, `vitest run`, and a full production build. Report: total prerender file count, sitemap URL count, activity detail page count before/after, one NO/EN detail hreflang example, one event JSON-LD example.
