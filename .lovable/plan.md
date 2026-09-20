# Kontroll: OperStack-rapport vs. faktisk produksjon (bjorli.no)

Kontrolltidspunkt: 20.09.2026 kl. 09:28–09:29 UTC. Alle svar hentet med direkte HTTP-henting uten JavaScript. Ingen kodeendringer gjort.

## 1. Hentede sider

| Forespurt URL | Endelig URL | Status | Canonical | Robots |
|---|---|---|---|---|
| https://bjorli.no/ | samme | 200 | https://bjorli.no/ | ikke satt |
| https://bjorli.no/bjorli-skisenter/ | samme | 200 | https://bjorli.no/bjorli-skisenter/ | ikke satt |
| https://bjorli.no/heiskort/ | samme | 200 | https://bjorli.no/heiskort/ | ikke satt |
| https://bjorli.no/nyheter/sesongkortsalget-er-apnet/ | samme | 200 | samme | ikke satt |
| https://www.bjorli.no/heiskort/ | samme (ingen 301) | 200 | https://bjorli.no/heiskort/ | ikke satt |

Alle svar var `cf-cache-status: DYNAMIC`, altså ikke levert fra Cloudflare-cache.

## 2. Strukturerte data i produksjon

| Side | Script-ID | @type | @id |
|---|---|---|---|
| / | jsonld-route | WebPage | mangler |
| / | jsonld-org | TouristDestination | mangler |
| /bjorli-skisenter/ | jsonld-route | WebPage | mangler |
| /bjorli-skisenter/ | jsonld-ski-resort | ["SkiResort","LocalBusiness"] | https://bjorli.no/#skiresort |
| /heiskort/ | jsonld-route | WebPage | mangler |
| /heiskort/ | jsonld-faq | FAQPage (3 spørsmål) | mangler |
| /nyheter/sesongkortsalget-er-apnet/ | jsonld-route | NewsArticle | mangler |

Alle nodene er merket `data-prerender-schema` og ligger i den første HTML-responsen. Ingen `@graph`, ingen duplikater, ingen motstridende verdier. FAQ-tekstene samsvarer med synlig innhold, inkludert den bekreftede formuleringen «Barn 0–6 år kjører gratis og trenger ikke eget Keycard».

## 3. Sammenligning med siste bygg

Produksjonsresponsene samsvarer nøyaktig med schema-byggeren i repoet (`src/lib/seo/routeSchema.ts`, script-ID-ene `jsonld-route`, `jsonld-org`, `jsonld-ski-resort`, `jsonld-faq`) og med siste commit `fcf9aea` (20.09.2026 08:45 UTC), inkludert den nye heiskort-teksten. Produksjon er altså oppdatert.

Konklusjon på avviket: OperStack-rapporten beskriver ikke dagens produksjon. FAQPage, sidetyper og virksomhetsschema finnes. Bekreftet årsak: rapporten/søkeverktøyet bygger på eldre uttrekk. Hypotese, ikke bekreftet: verktøyet kan også ha kjørt mot www eller mot en ikke-oppdatert indekskopi.

## 4. Reelle svakheter som rapporten delvis treffer

Disse er bekreftet i dagens produksjonsrespons:

1. Ingen virksomhetsnode (Organization/LocalBusiness) på forsiden — kun `TouristDestination` uten `@id`. Det finnes ingen felles, gjenbrukt virksomhets-`@id` på tvers av sidene.
2. Nodene mangler `@id` (unntatt SkiResort), og sidene kobler ikke `WebPage` → virksomhet/`isPartOf`/`publisher` via `@id`.
3. `NewsArticle` har `publisher` som løs Organization uten `@id` og uten logo.
4. Ingen `BreadcrumbList` på undersider.
5. `www.bjorli.no` svarer 200 i stedet for å 301-e til kanonisk domene (canonical peker riktig, så indekseringsrisikoen er lav, men duplikatlevering er reell).

## 5. Minste nødvendige tiltak (til senere godkjenning, ikke utført nå)

- Legg til én virksomhetsnode med fast `@id` (`https://bjorli.no/#organization`) i den delte schema-byggeren, og referer til den fra `WebPage`, `TouristDestination`, `SkiResort` og `NewsArticle.publisher`.
- Gi alle noder stabile `@id`-verdier og koble `WebPage.isPartOf` til en `WebSite`-node med `@id`.
- Vurder `BreadcrumbList` på undersider.
- Vurder 301 fra `www` til apex i Cloudflare (utenfor repoet, krever eksplisitt godkjenning).
- Send OperStack en ny kjøring mot kanonisk domene etter neste deploy.

## Begrensninger

- Ekstern schema-validator (validator.schema.org) er ikke kjørt i denne kontrollen.
- Deploy-status er utledet fra innholdssammenligning med siste commit; selve Cloudflare-deployloggen er ikke inspisert.
