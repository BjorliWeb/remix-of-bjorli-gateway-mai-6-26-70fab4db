# Oppfølging før publisering – 11. november 2026

## Status

Ingen publisering, endring av arrangementsrader, godkjenning eller ny funksjonsdeploy ble utført i denne oppfølgingen. Programflagget er fortsatt av. Arbeidet er **ikke fullt sluttgodkjent**: et komplett produksjonsbygg med aktivert program og en ekte innlogget kompatibilitetstest mangler.

## Utførte rettelser

- Relaterte arrangementskort viderefører nå `contain`, også for innsendte arrangementer. Programplakatene beskjæres ikke.
- Nyhetsartikkelen har eget delingsbilde, `public/og/spisestedene-vinter-2026-2027.jpg`, JPEG 1200 × 630. Hele eksisterende sesongplakat er skalert inn uten beskjæring; ingen ny tekst eller opplysninger er lagt til. CMS-feltet `ogImage` videreføres gjennom eksport og prerender, og eksisterende CMS-støtte beholdes.
- Innsendingsskjemaets tekstfelt manglet kobling mellom etikett og felt. Unike ID-er, `htmlFor`, `aria-describedby`, `aria-invalid` og annonserte feilmeldinger er lagt til. Feilmeldingene er tilpasset norsk/engelsk. Bildevelgeren kan åpnes med Enter eller mellomrom og har synlig fokusmarkering.
- Parkering bruker Fjellkafe, beholder 95/115/900 kr, opplyser at begge plassene er gratis etter 16.00 og nevner EasyPark. Den udokumenterte restaurantregistreringsfordelen er fjernet fra sideteksten. Alle seks språk og praktisk-informasjonssammendrag er oppdatert.
- Skiskolesiden, metadata, forside-FAQ og korte korttekster omtaler enkelte clinics/drop-in-kurs, uten løfte om komplett program eller tilbud for alle. Forespørsler går til skisenter@bjorli.no. Utvalgte tipstekster og llms-full.txt er også justert.

## Alle fire eksisterende oppføringer

Ingen av endringene under er lagret i den delte databasen. Dette er den konkrete redaksjonelle endringslisten for senere godkjent release.

| Dato | Eksisterende tittel | Adresse | Klargjort endring |
|---|---|---|---|
| 07.11.2026 | NOVEMBERFEST PÅ BJORLI | `/arrangementer/novemberfest-pa-bjorli-e1bf59da/` | Ingen radendring nødvendig. Behold mat/drikke-kategori og godkjent status; artikkelen lenker til den eksisterende oppføringen. |
| 14.11.2026 | Skredkveld Bjorli Skisenter | `/arrangementer/skredkveld-bjorli-skisenter-7239f108/` | Endre kategori fra `ski` til `kurs` ved senere godkjent oppdatering. Behold status og alt øvrig innhold. |
| 20.11.2026 | QUIZ PÅ BJORLI FJELLKAFE | `/arrangementer/quiz-pa-bjorli-fjellkafe-dd06d16d/` | Endre kategori til `quiz`; fjern den tidligere navneparentesen «(gamle T-kroken)» fra ingressen dersom den fortsatt finnes. Behold resten. |
| 28.11.2026 | PRAY FOR SNOW – party med DJ Preben M ❄️ | `/arrangementer/pray-for-snow-party-med-dj-preben-m-31600e68/` | Behold eksisterende innhold og send gjennom vanlig redaktørgodkjenning. Ingen automatisk godkjenning. |

Kontrollerte eksisterende tider og lokaler: 7. november 19.00–02.00; 14. november 18.00–19.30, restaurant åpen til 00.00; 20. november 20.00–00.00; 28. november 20.00–02.00. Alle fire er registrert ved Bjorli Fjellkafe. Eksisterende beskrivelser, quizpriser og booking-/påmeldingslenker er urørt.

### Pray for Snow

Databasen bekrefter `pending`. Oppføringen finnes allerede med dato, tittel, sted, tidspunkt og kategori, og trenger ikke dupliseres. Artikkelen beholder den eierbekreftede programomtalen som vanlig tekst, men lager ikke lenke til en utilgjengelig oppføring. `PRAY_FOR_SNOW_APPROVED` står til false. Etter normal godkjenning og kontroll av offentlig adresse kan denne settes til true for å inkludere lenken. Det opprettholder modereringen, men erstatter ikke den etterspurte produksjonsbyggkontrollen.

## Faktisk gjennomførte kontroller

- Vitest: **175 bestått, 3 hoppet over, ingen feil**, 25 testfiler. Testene inkluderer eksplisitt aktivert program i minnet, at alle 11 nye oppføringer aktiveres, at produksjonsstandard forblir skjult, og at lenken til ventende 28. november ikke inkluderes.
- Automatisk forhåndsvisningsbygg: siste tilgjengelige logg viser **build OK**. Dette er **ikke dokumentasjon for hele produksjonskjeden** med CMS-eksport, sitemap og prerender og aktivert program. Ingen komplett produksjonsbyggkommando ble kjørt manuelt i denne økten; miljøets instruksjon reserverer bygg til den automatiske kontrollen.
- Nettleser: norsk og engelsk skjema samt parkering og skiskole på seks språk, ved 390, 768 og 1280 px: **42 visninger, ingen axe-avvik** for WCAG 2.0/2.1 A/AA-tagene.
- Tastatur: Enter åpner bildevelgeren, mellomrom velger Quiz. Alle eksplisitte skjemaetiketter peker på eksisterende felt. Lokale valideringsfeil har gyldige koblinger til de ugyldige feltene. Ingen innsending ble foretatt.
- Aktivert program kun i testnettleserens modulrespons: artikkelen åpnet, eget og:image bekreftet, 14 arrangementslenker og kalenderlenken åpnet riktige sider. Ingen lenke til den ventende oppføringen. Alle fire inspiserte bilder på siste detaljside var lastet og hadde object-fit: contain.
- Aktivert artikkel ved 390/768/1280 px: ingen axe-avvik; mobil- og desktopbilder visuelt kontrollert. Dette er utviklingsvisning, **ikke produksjonsbygg**.
- Parkering på seks faktiske språkadresser ved 390/768/1280 px: ingen sideveis rulling. Norske parkering/skiskole-skjermbilder er visuelt kontrollert. Ingen sidefeil i denne nettleserkontrollen.
- Offentlig deployet arrangementsleser returnerte HTTP 200 med både `category` og `categories`, kun godkjente oppføringer. Pray for Snow var ikke i den offentlige listen.
- Den deployede innsendingsfunksjonen aksepterte gammel én-kategori-payload frem til botbekreftelse og avviste en med vilje ugyldig bekreftelse med `turnstile-failed`. Ingen rad opprettet. Dette verifiserer valideringskompatibilitet og botvern, **ikke vellykket innsending**.
- Den aktive databasetriggeren ble lest: gamle enkeltkategorioppdateringer erstatter første kategori og bevarer tilleggskategorier; nye kategorilister normaliseres og speiles til kompatibilitetsfeltet. Identitet/samtykke/bildesti-vern og admin/moderator-policyer er fortsatt til stede. Ingen tilgangsendringer utført.

## Backend: klargjort versus aktivert

Databasen er delt mellom forhåndsvisning og publisert app. Kategoriutvidelsen og synkroniseringstriggeren er **allerede aktive** i dette delte backend-miljøet. Den offentlige arrangementsfunksjonen er deployet og returnerer kategorilister. Den deployede innsendingsfunksjonen kunne testes og godtar eldre payload uten kategoriliste fram til botkontroll.

Disse observasjonene må ikke forveksles med at den nye frontend-/innholdskoden er publisert. Denne oppfølgingen deployet ingen funksjoner og endret ingen eksisterende eller ventende arrangementsrader. Oppdatering av godkjente rader nå ville kunne endre produksjon umiddelbart; derfor er endringene bare dokumentert.

## Begrensninger og blokkere

1. **Komplett aktivert produksjonsbygg gjenstår.** Testnettleser og enhetstester er bestått, men kan ikke rapporteres som et bestått fullbygg. Neste testkjøring må aktivere kun prøvekopiens program, kjøre ordinær prebuild/build/postbuild uten å slippe inn ventende innsendte arrangementer, og kontrollere alle artikkellenker og delingsmetadata i ferdig HTML.
2. **Ekte innlogget redigering/gjenåpning og vellykket gammel innsending gjenstår.** Kode, aktive triggere, offentlig lesing og avvisningsflyt er kontrollert, men ingen godkjennings-/redigeringsrunde er gjennomført i et isolert backend-miljø. Delte produksjonsdata og moderering ble ikke endret for å lage et kunstig grønt resultat.
3. **Kartet er ikke avklart.** Det eksisterende kartet merker P2 og bruker navnet «Bjorli Toppen» i forklaringen. Det inneholder også gebyrtekst for 00.00–24.00 og en restaurantfordel som ikke samsvarer med de nye bekreftede opplysningene. Bildet og geografiske markører er urørt. Eier eller autoritativ kartkilde må bekrefte at P2 er samme parkering som Fjellkafe før navnet endres. Kartet må ikke presenteres som oppdatert dokumentasjon ved release.
4. **Ingen full WCAG-godkjenning.** Axe og de spesifikke tastatur-/etikettkontrollene over er gjennomført. Ekte skjermleser, samtlige kontraster over bilder, 200 % tekst, sommer-/vintervarianter av alle nye sider og alle mulige skjermstørrelser er ikke fullt kontrollert.
5. **Sosiale tjenester er ikke testet live.** Delingsfilen er visuelt kontrollert og metadata i aktivert utviklingsvisning er riktige; ferdig produksjons-HTML, MIME og Facebook/andre tjenesters cache krever neste fullbygg og senere godkjent preview/release.

## Publiseringsrekkefølge etter godkjenning

1. Avklar kartets P2-identitet og gamle vilkår; ferdigstill tilgjengelighetskontrollene.
2. Kjør full isolert produksjonsprøve med program aktivert; kontroller ferdig HTML, bilder, sitemap og alle lenker. Test innsending, redigering og gjenåpning mot isolerte data.
3. Få samlet godkjenning av resultatet og publiseringstidspunktet.
4. Redaktør godkjenner Pray for Snow gjennom normal moderering. Merk at dette kan gjøre oppføringen synlig straks og be om eget rebuild; dette skjer først innen det godkjente publiseringsvinduet.
5. Kontroller offentlig Pray for Snow-adresse, sett bekreftelsesflagget, og bruk den dokumenterte endringslisten for Skredkveld/Quiz uten å endre deres publiseringsstatus eller øvrige opplysninger.
6. Aktiver samlet vinterprogram i den godkjente kodeutgaven og publiser frontenden. Backend-utvidelsen er allerede aktiv; ingen ny kategori-migrering trengs.
7. Kontroller Cloudflare Preview og deretter produksjon: View Source, canonical/hreflang, 15 programomtaler, fungerende lenker, posterbilder, skjema og mobil/desktop. Kontroller delingsbildet med relevante sosiale forhåndsvisningsverktøy. Ingen analytics-endring er gjort, så GA4 DebugView er ikke del av denne endringen.

## Filer og endringsområder

- `src/components/listing/RelatedContentSection.tsx`: bilde-fit på relaterte kort.
- `src/pages/SubmitEvent.tsx`: etiketter, hint/feil-koblinger, lokale feilmeldinger og tastaturbetjent bildevelger.
- `src/pages/Parkering.tsx`, `src/lib/cms/practicalRules.ts`, `src/lib/cms/practicalRules.test.ts`: seks språk, priser og praktiske regler med tester.
- `src/i18n/legacyTranslations.ts`, `src/i18n/locales/{no,en,de,nl,da,sv}.ts`, `src/lib/seo/routeSeo.ts`: skiskole og praktiske sammendrag/FAQ/metadata.
- `src/lib/cms/tipArticles.ts`, `src/lib/cms/mockAdapter.ts`, `public/llms-full.txt`: tilsvarende korte omtaler.
- `src/lib/cms/winterProgram2026.ts`, tilhørende test: testaktivering, modereringssikker lenke og eget delingsbilde.
- `scripts/export-cms-content.ts`, `scripts/lib/cmsSnapshot.ts`, `scripts/prerender.ts`: eksplisitte CMS-delingsbilder gjennom hele statisk flyt.
- `public/og/spisestedene-vinter-2026-2027.jpg`: hele plakaten i 1200 × 630.
- `AGENTS.md`, `roadmap.md`, denne rapporten: strukturregler og status.

`git status --short`, `git diff --stat` og `git diff --name-only` ble kjørt. De viste ingen utskrift i det administrerte arbeidsmiljøet; det er ikke brukt som bevis på at ingen filer ble endret. Ingen stateful git-kommandoer eller repositoryinnstillinger ble endret.