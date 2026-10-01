# Tekniske SEO-rettelser bjorli.no (kontroll 1. oktober 2026)

## Bekreftet årsak (språklenker)
Rutekartet `ROUTE_SLUGS` i `src/i18n/routes.ts` har allerede riktige adresser for alle 6 språk. Feilen oppstår der lenker bygges som «språkprefiks + norsk slug», f.eks. i `scripts/prerender.ts` (forsidens knapper og tjenestekort: `/en` + `/overnatting`). Samme mønster kontrolleres i React-komponenter og CMS-data (`homepageData.ts`, tjenestekort).

## Arbeid

**1. Språklenker ved kilden**
- Én felles hjelper `localizedHref(canonicalRoute, locale)` basert på `ROUTE_SLUGS` + `normalizeInternalPath`, brukt i prerender, navigasjon, tjenestekort, knapper, canonical og hreflang.
- Erstatte alle «prefiks + norsk sti»-konstruksjoner; CMS-lenker lagres som rutenøkler, ikke ferdige norske stier.
- Byggsjekk: prerender feiler hvis en intern lenke i `dist/` peker til en adresse som ikke finnes.
- 301 i `public/_redirects` for de 19 feiladressene (begge varianter med/uten skråstrek; `/sv/spårkarta/` URL-kodet).

**2. Korrekt første HTML**
- Kontrollere at `/overnatting/`, `/tips/`, `/nyheter/`, tipsartikler og publiserte arrangementer prerendres med egen tittel, beskrivelse, én canonical, H1, hovedinnhold, lenker, `lang` og hreflang.
- `/nyheter/sesongkortsalget-er-apnet/` er avpublisert (alle språk) etter tidligere ønske — den skal gi 404, ikke forside-HTML. Bekreftes i spørsmålet under.

**3. Ukjente og gamle adresser**
- Legge til `404.html` (nyttig feilside, 6 språk via lenker) slik at Cloudflare Pages gir ekte HTTP 404 for ukjente adresser. Forutsetning: alle gyldige ruter prerendres (kontrolleres mot sitemap før aktivering, ellers blir gyldige sider 404).
- `/nb/*` gamle adresser: redirect der tydelig erstatning finnes (f.eks. `/nb/mountain-information/` → `/apningstider/` etter avklaring), ellers 404.
- Gamle PDF-er: fortsatt 404 (finnes ikke). Ekte 410 krever Cloudflare-funksjon; foreslås ikke nå.

**4. www → bjorli.no**
- Kan ikke gjøres i `_redirects` (støtter ikke vertsnavn). Krever en Cloudflare-regel (Bulk Redirect / Redirect Rule) i dashbordet. Jeg leverer nøyaktig regel og test; selve innstillingen gjøres av dere.

**5. Sitemap**
- Generert kun fra publiserte, indekserbare canonical-URL-er; legge til arrangementer som lenkes internt men mangler. Arkiverte (noindex) holdes ute. `lastmod` bare fra faktisk endringsdato i CMS.

**6. Hovedsidenes roller**
- Internlenking styres mot `/heiskort/`, `/overnatting/`, `/skiutleie/`, `/skiskole/`, `/langrenn/`, `/familie/`. Kjøpsknapper og partnerlenker beholdes.
- Kun anbefaling (ingen sammenslåing) for: `/langrenn/` vs `/aktiviteter/langrenn/`, `/live/` vs `/vaer-og-webkamera/`, `/ski-holiday-norway/` vs `/en/bjorli-ski-resort/`.

**7. Verifisering**
- Vitest: de 19 redirectene, språklenker i dist, canonical/hreflang gjensidighet, sitemap-mål finnes, 404 for ukjent side, dynamiske sider i første HTML.
- Playwright på representative sider etter hydrering (metadata og innhold uendret).
- Ingen publisering; produksjon kontrolleres først etter deploy.

## Utenfor omfang
Design, innhold, kjøpsflyt, de 4 nye tipsartiklene, Supabase-sikkerhet.
