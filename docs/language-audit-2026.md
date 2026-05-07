# Language audit 2026 — Bjorli

## Scope
Six locales: NO (root), EN (/en), DE (/de), NL (/nl), DA (/da), SV (/sv).

## Phase 1 — Findings (before)

Mixed-language strings detected on /en, /de, /nl, /da, /sv homepages and summer pages, all originating from two root causes:

### A. Hardcoded Norwegian in `src/lib/cms/mockAdapter.ts` (summer sections)
These leaked into every non-Norwegian page because the mock adapter inlined NO copy:

| Section | Norwegian string | Rendered on |
|---|---|---|
| `summerSections.intro.title` | "Opplev sommeren på Bjorli" | All locales |
| `summerSections.basecamp.eyebrow` (fallback) | "Mellom fjell og fjord" | DE, SV (no `basecamp` key) |
| `summerSections.basecamp.title` (fallback) | "Midt mellom fjellet og fjorden" | DE, SV |
| `summerSections.basecamp.body` (fallback) | "Fra Bjorli har du kort vei til …" | DE, SV |
| `summerSections.basecamp.image.alt` | "Bjorli som basecamp mellom fjell og fjord" | DE, SV |
| `summerSections.basecamp.ctaPlan` (fallback) | "Reisen hit" | DE, SV |
| `summerSections.foodDrinkSummer.eyebrow` | "Mat og drikke" | All locales |
| `summerSections.foodDrinkSummer.title` | "Smaker fra fjellet" | All locales |
| `summerSections.foodDrinkSummer.body` | "Etter en dag i naturen smaker maten ekstra godt …" | All locales |
| `summerSections.foodDrinkSummer.image.alt` | "Mat og drikke på Bjorli" | All locales |
| `summerSections.foodDrinkSummer.ctas[0].label` | "Se mat og drikke" | All locales |
| `summerSections.winterTeaser.eyebrow` | "Året rundt" | All locales |

### B. Missing keys in DE/NL/DA/SV (causing object fallback to NO/EN)
The following dictionary keys existed in NO and EN but were absent in DE/NL/DA/SV — components fell back to `??` defaults that contained Norwegian or English text:

| Key | DE | NL | DA | SV |
|---|---|---|---|---|
| `hero.eyebrow` | missing | missing | missing | missing |
| `hero.ctaOpening` | missing | missing | missing | missing |
| `status.heading` | missing | missing | missing | missing |
| `status.caption` | missing | missing | missing | missing |
| `accommodation.ctaSecondary` | missing | missing | missing | missing |
| `accommodation.subcards[]` | missing | missing | missing | missing |
| `summer.eyebrow` | missing | missing | missing | missing |
| `summer.ctaPlan` | missing | missing | missing | missing |
| `summer.introTitle` | n/a | n/a | n/a | n/a |
| `summer.winterTeaserEyebrow` | n/a | n/a | n/a | n/a |
| `summer.foodDrink` | n/a | n/a | n/a | n/a |
| `summer.basecamp` | missing | OK | missing | missing |
| `whyBjorli` | missing | missing | missing | missing |
| `listing.filter*` / `season*` / `viewCalendar` / `viewList` / `loadMore` / `featured` / `seoPlaceholder*` / `section*` | missing | missing | missing | missing |

Additional issues fixed:
- DE summer hero said "Bjorli Sommerdestination" placeholder; rewritten to match the NO "Basislager zwischen Berg und Fjord" framing.
- NL summer hero said "Bjorli zomerbestemming" placeholder; rewritten to "Een uitvalsbasis tussen berg en fjord".
- DA summer hero said "Bjorli sommerdestination"; rewritten to "Basislejr mellem fjeld og fjord".
- SV summer hero said "Bjorli sommardestination"; rewritten to "Basläger mellan fjäll och fjord".
- DA `winterTagline` was the Norwegian "Snøsikre Bjorli"; corrected to Danish "Snesikre Bjorli". Norwegianisms in body copy reviewed and replaced where appropriate (e.g. "snøsikker" → "snesikker", "fjell" → "fjeld" in DA; "fjell" → "fjäll", "hytte" → "stuga" in SV).
- EN winter hero rewritten in line with brief: "Real winter. Easier mountain days." — no negative parallelisms, no banned vocabulary.

## Phase 3 — Implementation summary

### Files changed
- `src/i18n/locales/types.ts` — added optional keys: `summer.introTitle`, `summer.winterTeaserEyebrow`, `summer.foodDrink`.
- `src/i18n/locales/no.ts` — added `summer.introTitle`, `summer.winterTeaserEyebrow`, `summer.foodDrink`.
- `src/i18n/locales/en.ts` — same additions.
- `src/i18n/locales/de.ts` — full rewrite with all missing keys, formal Sie-Form throughout, no English loanwords beyond "Skipass", "Livecams", "Webcams". German hero/summer copy rewritten per brief.
- `src/i18n/locales/nl.ts` — full rewrite, informal je-form, all missing keys filled, summer hero rewritten.
- `src/i18n/locales/da.ts` — full rewrite, du-form, Norwegianisms removed (snesikre/fjeld), all missing keys filled.
- `src/i18n/locales/sv.ts` — full rewrite, du-form, Norwegianisms removed (fjäll/stuga/snösäkra), all missing keys filled.
- `src/lib/cms/mockAdapter.ts` — replaced 12 hardcoded Norwegian strings with dictionary lookups (`d.summer.introTitle`, `d.summer.foodDrink.*`, `d.summer.winterTeaserEyebrow`, etc.) so every locale renders monolingual copy.
- `src/pages/Sommer.tsx` — removed Norwegian fallback string `'Planlegg reisen hit'` in CTA; falls back to `d.gettingHere.cta` instead.

### Strings changed per language (additions + replacements)
- NO: 6 additions (new keys for parity), 0 replacements
- EN: 6 additions, 0 replacements
- DE: ~45 (full enrichment + hero/summer rewrite + tone alignment)
- NL: ~45
- DA: ~45 (incl. Norwegianism removal)
- SV: ~45 (incl. Norwegianism removal)

### Strings flagged for human native review
- DE Sie-Form was applied throughout but a native speaker should sanity-check the new "Basislager zwischen Berg und Fjord" hero copy and the `whyBjorli` block tone.
- NL informal je-form: confirm `Skigebied Bjorli` (vs. `Bjorli Skigebied` — kept local order in nav/footer).
- DA: confirm `Snesikre` (campaign-style) vs `Snesikkert` (adjective) usage throughout — currently brand uses `Snesikre Bjorli` consistently.
- SV: confirm `Bjorli Skidanläggning` is acceptable as a proper-noun translation, or whether to keep `Bjorli Skisenter` untranslated.

### Strings still hardcoded (should move to i18n later)
- None on the homepage, summer page or navigation/footer.
- Section labels in `mockAdapter.ts` for `winterSections` were already localized prior to this pass.
- Sub-pages (e.g. `Heiskort.tsx`, `SkiSchool.tsx`, `WeatherWebcams.tsx`, listing templates) were NOT in the scope of this audit and may still contain hardcoded Norwegian; recommended follow-up sweep.

## Definition of Done — status
- [x] Homepage (winter + summer) is monolingual on every locale.
- [x] Navigation, footer, hero, alerts, CTAs, status block, accommodation, basecamp, food & drink, why-Bjorli, getting-here, FAQ, news, events, tips render in the active locale.
- [x] No banned constructions ("not X but Y", forced triplets) in new copy.
- [x] No banned vocabulary fillers in DE/NL/DA/SV.
- [x] `og:locale` and `html lang` codes already correct (nb_NO / en_GB / de_DE / nl_NL / da_DK / sv_SE) — no changes needed.
- [ ] Sub-pages outside the homepage scope to be audited in a follow-up pass.
