# Teknisk kontroll: prerender vs. rendret innhold + strukturerte data

## 1. Mål
Sammenligne første HTML-respons (prerender) med det JavaScript rendrer for prioriterte sider, finne hvor innholdet er duplisert/forkortet/manglende, og lage en varig, kilde-sammenhengende fiks. Samtidig forenkle schema.org til én tydelig forretningsidentitet for Bjorli Skisenter.

## 2. Verifisert tilstand

### 2.1 Prerender-arkitektur (`scripts/prerender.ts`, `src/lib/seo/routeLeads.ts`)
- `scripts/prerender.ts` genererer én HTML-fil per kanonisk rute × språk.
- Body er et semantisk skjelett: `h1`, lead, evt. supporting, primærnavigasjon og relaterte lenker.
- Skjelettet henter tekst fra `ROUTE_LEADS`/`routeSeo.ts`, **ikke** fra samme kilder som React-sidene (`getHomepage`, `subpages.ts`, side-lokal copy).
- Vite-bundle beholdes; React erstatter hele `#root` ved hydrering.
- Head inneholder korrekt `<html lang>`, title, description, canonical, hreflang, og JSON-LD: `WebPage` på alle ruter, `TouristDestination` på forsiden.

### 2.2 Nettleserkontroller som ble utført
- Lokal Playwright-inspeksjon mot `http://localhost:8080` for JS-renderet DOM (H1, H2, knapper, FAQ, JSON-LD). Resultat: `/tmp/browser/audit/audit.json`.
- Forsøk på å hente prerenderet HTML fra Lovable Preview-URL returnerte `401 Unauthorized`.
- `dist/`-mappa fantes ikke i repoet, så første-HTML-sjekk er basert på kildekode, ikke en live fetch.

### 2.3 JS-renderet innhold som mangler i prerender-skjelettet

| Side | Første HTML (fra kode) | JS-renderet innhold (observert) | Status |
|---|---|---|---|
| `/` | H1 + 2 avsnitt fra `routeLeads.home`; navn og relaterte lenker | Hero H1, kampanje, statuskort, planleggingsseksjon, nyheter, arrangementer, overnatting, «Hvorfor Bjorli?», FAQ | Stort hull |
| `/bjorli-skisenter/` | Ingen egen `ROUTE_LEADS`-entry; trolig tittel + meta som body | H1, ingress, stats (6 heiser/11 nedfarter/575–1225 m/Nov–Mai), «Kjøp heiskort»-CTA, løypekart-figur, salgsbetingelser-accordion | Stort hull |
| `/heiskort/` | H1 + lead fra `routeLeads.heiskort` | H1, ingress, highlights (Dagskort/Flerdagskort/Sesongkort/Familievennlig), FAQ, CTA mot skiperformance | Middels hull |
| `/apningstider/` | H1 + lead fra `routeLeads.apningstider` | H1, «Status akkurat nå» (Fnugg), liste over åpningstider, note | Middels hull |
| `/skiskole/` | H1 + lead fra `routeLeads.skiskole` | H1, ingress, tilbud som h3, lenke til intersportbjorli.no/skiskole | Middels hull |
| `/nyheter/sesongkortsalget-er-apnet/` | H1, kategori, dato, intro, brødtekst, relaterte saker | Samme, pluss Early Bird-CTA og «Mer om Bjorli» | Lite hull |

### 2.4 Strukturerte data
- Forsiden: `TouristDestination` (plass) både i prerender og runtime.
- `/bjorli-skisenter/`: `SkiResort` + `LocalBusiness` via `<JsonLd>`. Mangler `@id`, `legalName`, `logo`, `sameAs`.
- `buildOrganization` finnes i `src/lib/seo/schema.ts` men er **ikke brukt** noe sted i runtime eller prerender.
- `/heiskort/` og andre subpages: bare `WebPage` via `SEOHead`. FAQ-HTML finnes, men `FAQPage` JSON-LD mangler (`FaqBlock` brukes ikke i `SubPage`).
- Nyhetsdetalj: to nesten like `NewsArticle`-noder (én fra `SEOHead`/resolveSeoForRoute, én fra `ContentDetailTemplate`s fallback).

## 3. Årsaker
1. **To kilder til synlig tekst**: `routeLeads.ts` er kun for prerender; React bruker `subpages.ts`, `getHomepage` og side-lokal copy.
2. **SkiResort-schema er fragmentarisk**: `buildSkiResort` har hverken `@id`/`legalName`/`logo`/`sameAs`, og brukes kun på `/bjorli-skisenter/`.
3. **Duplikat JSON-LD på detaljsider**: `ContentDetailTemplate` lager alltid sin egen fallback, selv når `SEOHead` allerede har injisert et riktig `NewsArticle/Event/Article`-objekt.
4. **FAQ mangler schema**: `SubPage` rendrer FAQ-HTML, men kaller aldri `buildFaqPage` / `FaqBlock`.

## 4. Foreslåtte endringer (prioritert, minst mulig inngripende)

### 4.1 Felles innholdskilde for prerender og React
**Valg:** La prerender-skjelettet hente seksjonsdata fra de samme funksjonene React bruker (`getSubPage` for subpages, `getHomepage` for forsiden) i stedet for `routeLeads.ts`.

- `scripts/prerender.ts`:
  - Importer `getSubPage` fra `src/lib/cms/subpages.ts` for statiske sider.
  - Utvid `bodySkeleton` til å akseptere `sections` med `intro`, `highlights`, `ctas`, `faq`, evt. kampanje.
  - For forsiden: importer `getHomepage` og rendre hero-tittel/-undertittel, planleggingsseksjon og kampanje-tittel/CTA som ren HTML.
  - La `routeLeads.ts` kun være fallback for ruter som ikke finnes i CMS.
- **Risiko:** `subpages.ts` importerer bilder via Vite. Sjekk at Node-bygget kan kjøre fila i `scripts/prerender.ts`; hvis ikke, legg inn en bygge-sikker loader eller stubbare bilde-URLer.

### 4.2 Enkel prerender-utvidelse per side
- `/bjorli-skisenter/`: inkluder `t.skiCenter.title`, `t.skiCenter.subtitle`, `t.skiCenter.desc`, stats, lift-pass CTA-label, løypekart-caption, salgsbetingelser-ingress og spørsmål/svar.
- `/heiskort/`, `/skiskole/`, `/apningstider/` (og tilsvarende subpages): inkluder `page.intro`, `page.body`, highlights (h3+tittel+desc), CTAs, FAQ Q+A.
- Forsiden: inkluder hero-tittel, hero-undertittel, kampanje-tittel, kampanje-online-only-tekst, planleggingsseksjonens tittel/punkter, nyhetsoverskrift, arrangementoverskrift.

### 4.3 Schema.org: én tydelig forretningsidentitet
- `src/lib/seo/schema.ts`:
  - Utvid `buildSkiResort` til å inkludere:
    - `@id`: `https://bjorli.no/#skiresort`
    - `legalName`: `Nye Bjorli Skisenter AS`
    - `logo`: `https://bjorli.no/apple-touch-icon.jpeg` (eller dedikert logo-URL)
    - `sameAs`: eksisterende Facebook/Instagram-lenker
    - `url`: `https://bjorli.no/`
    - `address`, `geo`, `telephone` fra eksisterende konstanter
  - Vurder om `buildOrganization` skal fjernes eller merges inn i `buildSkiResort` for å unngå dupliserte organisasjons-noder.
- `src/components/SEOHead.tsx` / prerender-hodet:
  - Injiser `SkiResort` på forsiden og `/bjorli-skisenter/`.
  - Referer til `@id` fra detaljsider som `publisher`/`organizer` i stedet for inline `Organization { name: "Destinasjon Bjorli" }`.

### 4.4 Fjern duplikat JSON-LD på detaljsider
- `src/pages/ContentDetailPage.tsx`: hent løst SEO fra `resolveSeoForRoute` (eller bruk eksisterende data) og send `jsonLd` inn i `ContentDetailTemplate`.
- `src/components/listing/ContentDetailTemplate.tsx`: bruk `jsonLd`-propen når den finnes; slett fallback-genereringen eller kun bruk den som siste utvei.
- `scripts/prerender.ts`: bruk samme `buildJsonLd`-hjelper så prerender og runtime er identiske.

### 4.5 FAQ-schema på subpages
- `src/components/SubPage.tsx`: når `page.faq` finnes, rendre `FaqBlock` (som både viser HTML og emitter `FAQPage` JSON-LD) i stedet for egne `<details>`.
- Alternativt behold nåværende HTML og injiser kun `JsonLd data={buildFaqPage(page.faq)}`.
- `scripts/prerender.ts`: emitter tilsvarende `FAQPage` JSON-LD for subpages med FAQ.

### 4.6 Byggetids-validering
- I `scripts/prerender.ts`: etter generering, sjekk at mål-HTML-filene inneholder forventet H1, intro og minst én seksjon til (f.eks. highlights/FAQ/CTA) som React-siden også viser.
- Sjekk at JSON-LD er gyldig JSON og at alle `@id`/URLer bruker `https://bjorli.no/`.
- Sjekk at det ikke finnes duplikate `application/ld+json`-noder med samme `@type`+`url` på samme side.

## 5. Filer som forventes endres
- `scripts/prerender.ts` – utvide skjelett og hente CMS-data for statiske sider.
- `src/lib/seo/schema.ts` – utvide `buildSkiResort`, vurdere fjerne/merge `buildOrganization`.
- `src/components/SEOHead.tsx` – injisere `SkiResort` business schema.
- `src/components/seo/JsonLd.tsx` – sikre at head-injisering kan brukes fra SEOHead.
- `src/pages/SkiCenter.tsx` – evt. eksportere copy/stats som gjenbrukes i prerender.
- `src/components/SubPage.tsx` – legge til FAQ JSON-LD.
- `src/pages/ContentDetailPage.tsx` og `src/components/listing/ContentDetailTemplate.tsx` – fjerne duplikat JSON-LD.
- `src/lib/cms/subpages.ts` – vurdere å eksportere en bygge-sikker variant dersom Vite-assets blokkerer Node-import.
- `src/lib/seo/routeLeads.ts` – beholdes kun som fallback.

## 6. Verifiseringsplan
1. `bun run build` for å produsere `dist/`.
2. Kjør prerender ( `postbuild` i `package.json` ).
3. Bruk Playwright mot `dist/` servert lokalt (`npx serve dist`) og sammenligne H1/H2/CTA/FAQ/priser/salgsbetingelser med JS-renderet output.
4. Sjekk `dist/<path>/index.html` direkte for JSON-LD. Validér i Googles Rich Results Test / Schema Markup Validator.
5. Bekreft at canonical/hreflang/og:url fortsatt er `https://bjorli.no/...` og at ingen `localhost`/`pages.dev`/lovable-URLer har lekket inn.
6. Kjør testene (`bun test` / `vitest`).
7. Manuell sjekk av alle seks språk for de endrede rutene.

## 7. Konklusjon og usikkerhet
**Konklusjon:** Prerenderen gir korrekt metadata og en kort semantisk intro, men selve sideinnholdet (H2-er, highlights, FAQ, CTA-er, kampanje, priser/vilkår) er stort sett JavaScript-avhengig i dag. Den minste varige fiksen er å la prerender-skjelettet rendre det samme tekstinnholdet React allerede henter fra CMS/lokale kilder, samtidig som schema.org ryddes til én `SkiResort`-identitet og duplikat JSON-LD fjernes.

**Usikkerhet:**
- Kan `subpages.ts` og `getHomepage` importeres trygt i `scripts/prerender.ts` uten Vite-assets-problemer? Dette må testes først.
- Er telefon, adresse, koordinater og sosiale profiler i `src/lib/seo/schema.ts` korrekte for Bjorli Skisenter AS? De er tatt fra eksisterende kode, men bør bekreftes av Bjorli før de gjøres til «én sann kilde».
- Preview-URL var utilgjengelig under kontrollen, så første-HTML-data er kildekodeavledet, ikke målt i produksjon.

---
**Neste steg:** Godkjenn planen; deretter implementeres endringene og verifiseres uten publisering.