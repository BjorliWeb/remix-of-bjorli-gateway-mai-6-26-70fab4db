# Conversion-clarity pass — change plan

**Status:** Ready for Cloudflare Pages staging deploy. Copy/CTA pass completed; no pending source changes. Last updated: 2026-06-15.

## Completed milestones
- **Cloudflare Pages readiness** — SPA fallback (`public/_redirects`), `.nvmrc`, `.gitignore`, `DEPLOYMENT.md`, build scripts verified.
- **GitHub sync safety** — working tree clean, `.env` untracked, required files present. Exact GitHub repo name must be verified in Lovable UI (sandbox remotes point to internal Lovable storage).
- **Norwegian accommodation page (`/overnatting`)** — updated copy, provider sections, and external booking link; TypeScript check passed.
- **Package lock integrity** — `package-lock.json` regenerated and present.

## Remaining before first *.pages.dev deploy
- Verify GitHub sync target in Lovable UI (expected: `remix-of-bjorli-gateway-mai-6-26-70fab4db`).
- Configure Cloudflare Pages build settings per `DEPLOYMENT.md`.
- Deploy to staging `*.pages.dev` and verify SPA routing.

## Out of scope (preserved)
Design, layout, routes, images, SEO metadata, schema, analytics, CMS logic, Supabase schema/RLS, domain settings, live bjorli.no, old WordPress site.


Scope: copy + CTA hierarchy only. No redesign, no new routes, no fake proof, no klatrepark. NO is primary; EN/DA/NL/DE/SV updated where the same string lives.

## Pages & risk

### 1. Homepage hero (`src/i18n/locales/no.ts` → `hero`) — LOW
- H1 → "Snøsikre skidager for hele familien"
- Subtitle → "Alpint, langrenn, hytter og enkle fjelldager på Bjorli – mellom Østlandet og fjordene på Vestlandet."
- Keep primary CTA "Kjøp heiskort" and secondary "Finn overnatting" prominent in `src/pages/Index.tsx`; demote the "Åpningstider" link to a smaller inline link so only 2 strong CTAs are visible in the first viewport.
- EN/DA/NL/DE/SV: refresh hero title + subtitle to match tone (no "rolig").

### 2. Mobile hero typography (`src/pages/Index.tsx`) — LOW
- Reduce H1 base size at 360–430px (`text-4xl sm:text-5xl md:text-8xl ...`) and tighten subtitle/CTA spacing so H1 + sub + primary CTA fit above the fold on iPhone SE → 14 Pro Max.

### 3. `/overnatting` (`src/pages/Accommodation.tsx` + `accommodationPage` strings) — MEDIUM
- New H1: "Overnatting på Bjorli – hytter, leiligheter og hotell".
- Add 5 labelled sections: Hytter og leiligheter / Hotell / Familie og grupper / Nær skisenteret / Camping (still cards, same visual system).
- Single primary CTA "Finn overnatting" pointing to existing `https://bjorli.no/overnatting/` link, clearly labelled as the booking source (flagged in QA report for later Mews move).

### 4. Proof section "Hvorfor Bjorli?" (`whyBjorli` in all locales) — LOW
- Replace generic items with the 5 factual points requested (snøsikker, familievennlig, Raumabanen, kort vei, basecamp mellom fjell og fjord). Title stays "Hvorfor Bjorli?".

### 5. "Passer for" lines — LOW
- Add a short "Passer for: barnefamilier · hyttegjester · vennegjenger · skiturister" line under `intro.body` (NO + parity locales). No layout change — rendered as a small muted paragraph already supported by `HomepageSections`. If the section component doesn't have a slot, append into the existing body string to avoid component changes.

### 6. QA (no code) — LOW
- Check homepage, /overnatting, /sommer, /vaer-og-webkamera, /heiskort on 375px + 1280px.
- Report unclear CTA hierarchy, awkward wrap, external WP/Skiperformance links to migrate later, and confirm zero klatrepark references (already grepped — none in source).

## Out of scope
Sommer hero (just rewritten), KlatringRomsdalen (just rewritten), winter copy beyond the items above, navigation, footer, schema, sitemap, llms.
