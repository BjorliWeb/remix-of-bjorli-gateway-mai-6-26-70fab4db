# Avpubliser utløpte arrangementer og opprett arrangementsarkiv

## Bekreftede forutsetninger
- Arkivside: `/arrangementer/arkiv/` med oversatte varianter (f.eks. `/en/events/archive/`).
- Sluttdatoer som legges inn: Sommerkafeen Lesjaverk 2026-08-15, Søndagsbuffet Bjorliheimen 2026-08-23, Landsskytterstevnet 2026-08-07, Høstmarked på Bjorli 2026-09-06.
- «Ny asfaltert pump track» har ingen sluttdato og blir stående som aktiv; rapporteres som manglende data.

## Dagens tilstand (verifisert)
- Arrangementene ligger som innhold i `src/i18n/locales/{no,en,de,nl,da,sv}.ts` under `events.items`, ikke i databasen.
- Datofeltet er fritekst («5.–6. september 2026»), så dagens filtrering i `src/lib/cms/mockAdapter.ts` (`mergeEvents`) sammenligner tekst mot dagens dato og arkiverer i praksis ingenting.
- Det finnes allerede en `status`-verdi (`published` / `archived`) på arrangementer, men arkiverte fjernes helt fra visningen og har ingen arkivside.
- Arrangementsdetaljer prerenderes som statisk HTML, og innsendte arrangementer hentes fra backend med `start_date` / `end_date`.

## Slik løses det

### 1. Maskinlesbar sluttdato
Legg til et valgfritt ISO-felt for sluttdato på arrangementer i innholdsstrukturen, og fyll det inn for de fire avsluttede arrangementene i alle seks språk. Fritekstdatoen som vises på siden beholdes uendret.

### 2. Automatisk arkivering i Europe/Oslo
Ny liten hjelpemodul som avgjør om et arrangement er arkivert: arkivert fra kl. 00:00 første kalenderdag etter sluttdato, beregnet i Europe/Oslo (håndterer sommer-/vintertid). Mangler sluttdato → aldri automatisk arkivert. Regelen brukes både på redaksjonelle arrangementer og på innsendte arrangementer fra backend. Enhetstester dekker sommertid, vintertid, midnattsgrensen og manglende dato.

### 3. Datakilde for aktive vs. arkiverte
Innholdslaget får to strømmer: aktive arrangementer (som i dag, uten arkiverte) og en arkivstrøm sortert etter sluttdato med nyeste først. Manuelt satt `archived`-status regnes fortsatt som arkivert. Forsiden, arrangementsoversikten, kalender/liste, filtrering og relaterte arrangementer bruker kun den aktive strømmen.

### 4. Arkivside
Ny side på `/arrangementer/arkiv/` (og oversatte stier) som gjenbruker eksisterende kortformat, typografi og oppsett fra arrangementsoversikten. Hvert kort får en diskret «Avsluttet»-merking. Bilder, titler, datoer, beskrivelser og språkversjoner beholdes. En tydelig lenke til arkivet legges nederst på arrangementsoversikten.

### 5. Detaljsider
Detaljsidene og URL-ene beholdes uendret slik at delte lenker virker. Arkiverte arrangementer får en diskret «Avsluttet»-merking øverst i innholdet. Ingen redirects.

### 6. SEO
- Arkivoversikten og arkiverte detaljsider: `noindex, follow`, både i ferdig HTML og i klienten.
- Canonical på detaljsidene er uendret.
- Arkiverte URL-er og selve arkivsiden utelates fra XML-sitemap.
- Arkivsiden og arkiverte detaljsider prerenderes fortsatt slik at innholdet finnes i ferdig HTML, og byggets dekningssjekk oppdateres så den ikke krever sitemap-oppføring for arkiverte sider.

## Filer som endres
- `src/i18n/locales/types.ts` og `src/i18n/locales/{no,en,de,nl,da,sv}.ts` — sluttdato + arkivtekster («Avsluttet», arkivtittel, ingress, lenketekst)
- `src/lib/cms/types.ts`, `src/lib/cms/mockAdapter.ts`, `src/lib/cms/adapter.ts`, `src/lib/cms/index.ts` — arkivlogikk og arkivstrøm
- Ny `src/lib/events/archiveStatus.ts` + test
- Ny `src/pages/EventsArchive.tsx`, samt `src/components/listing/EventsListingTemplate.tsx` og `src/components/listing/ContentDetailTemplate.tsx` for «Avsluttet»-merking og arkivlenke
- `src/App.tsx`, `src/i18n/routes.ts`, `src/lib/seo/routeSeo.ts` — ny rute og metadata
- `scripts/prerender.ts`, `scripts/build-sitemap.ts`, `scripts/lib/cmsSnapshot.ts` — prerender, noindex og sitemap-utelatelse

Ingen endringer i backend, RLS, analytics, navigasjon, design eller andre nyheter/arrangementer.

## Verifisering
Typecheck, alle tester og produksjonsbygg. Deretter kontroll i bygget/nettleser: de fire arrangementene borte fra forsiden og alle aktuelle-lister, til stede i arkivet, arkivet lenket fra arrangementssiden, detaljsider fortsatt 200 med «Avsluttet», `noindex, follow` i ferdig HTML, arkiverte URL-er ute av sitemap, og at øvrige arrangementer og nyheter er uendret.

Ingenting publiseres før du skriver «publiser».
