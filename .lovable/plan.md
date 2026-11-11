# Bjorli Spisestedene: navn, vinterprogram og flere kategorier

Plan for oppgaven i den opplastede teksten, med de fire bildene. Arbeidet deles i fire avgrensede etapper som kan godkjennes hver for seg. Ingenting publiseres.

## Funnet ved gjennomgang
- «T-Kroken» finnes i seks kildefiler. De fleste treffene er i «Mat og drikke» (ca. 50), de gamle oversettelsene (ca. 36) og parkeringssiden (ca. 24). Noen få treff er i handel, tipsartikler og bildeoversikten.
- Et arrangement kan i dag bare ha én kategori, både i innsendingsskjemaet og i databasen. Flervalg krever derfor en databaseendring.
- Arrangementene har dato uten klokkeslett og et eget fritekstfelt for tid. «Tidspunkt kommer» kan derfor vises uten å sette «Hele dagen».

## Etappe A – Mat og drikke og navnestruktur
1. Serveringen i skisenteret flyttes øverst på «Mat og drikke». Den får overlinje, overskrift, introduksjon og brødtekst nøyaktig som oppgitt, med lenke til «Hva skjer».
2. Logoen for Bjorli Spisestedene legges inn i serveringsdelen. Hovedlogoen til Bjorli endres ikke.
3. Instagram-oppfordringen legges inn med en vanlig lenke til @bjorli_spisestedene.
4. «T-Kroken» byttes til «Bjorli Fjellkafe» i alt synlig innhold på alle seks språk. Det gjelder tekst, titler, metabeskrivelser, alt-tekster og strukturerte data. Setningene skrives om så de blir naturlige.
5. Adresser, ID-er, e-postadresser og eksterne lenker endres ikke. Treff i slike rapporteres, for eksempel parkeringssider med gammelt navn i adressen.
6. Bilder med «T-Kroken» brent inn rapporteres. De skjules ikke.
7. Heiskroa beskrives som varmestue. Fjellbua omtales med åpning etter forholdene. Spiseplikten knyttes til serveringsområdet i Bjorli Fjellkafe.

## Etappe B – Bilder og nyhetsartikkel
1. De fire bildene får de oppgitte filnavnene og riktig format. De optimaliseres etter mønsteret prosjektet allerede bruker, uten oppskalering.
2. Ny norsk nyhet med slug som inneholder «dette-skjer-i-vinter» og «2026-2027».
   - «Dette skjer i vinter» er hovedbilde.
   - Hver programplakat vises ved sin periode, i hel størrelse.
   - Alle 15 arrangementene står som vanlig tekst.
   - 7. november merkes «Tidligere i sesongen».
   - Hvert arrangement lenker til sin oppføring i kalenderen.
   - Artikkelen avsluttes med Instagram-oppfordringen og lenke til «Mat og drikke».
3. Artikkelen følger det vanlige mønsteret for nyheter: tittel, beskrivelse, canonical, delingsbilde, sitemap og ferdig første versjon av siden.

## Etappe C – Flere kategorier per arrangement
1. Kategoriene «Quiz», «Konsert» og «After-ski» legges til. Først sjekkes det om de finnes under andre skrivemåter, så det ikke blir dubletter.
2. Ett arrangement skal kunne ha flere kategorier. Databasen utvides, og alle eksisterende arrangementer og innsendte forslag beholder kategorien de har i dag. Det gamle feltet beholdes inntil videre.
3. Innsendingsskjemaet og redaktørskjemaet får avkrysningsbokser. Begge skjemaene og den offentlige visningen henter kategoriene fra samme liste. Valgte kategorier vises tydelig, og alt kan styres med tastatur.
4. Hele flyten skal virke: innsending, godkjenning, redigering, kort, detaljsider og filter. Et arrangement vises bare én gang i resultatlisten.
5. Reglene som bestemmer hva en redigering kan endre, holdes som før. Tilgangsreglene endres ikke.
6. Tester legges til for overføring fra én til flere kategorier og for filtrering uten dubletter.

## Etappe D – 15 kalenderoppføringer
1. Kalenderen sjekkes for dubletter. Treff oppdateres i stedet for å lage nye.
2. Hvert arrangement får sin egen oppføring med dato i norsk tid og kategoriene som er oppgitt. Arrangøren er Bjorli Spisestedene. Hver oppføring får en kort beskrivelse, lenke til nyheten og Instagram-lenke.
3. Det legges ikke inn klokkeslett, priser eller lokaler. Mangler et felt som må fylles ut for å publisere, lagres oppføringen som utkast og rapporteres.
4. 7. november skal havne blant tidligere arrangementer av seg selv.
5. Nyttårsaften får i tillegg en matkategori, hvis en slik finnes.

## Kontroll og levering
- Tester og produksjonsbygg kjøres.
- Nettleseren kontrolleres på 390 og 1280 px: plakater og logo skal vises hele, uten beskjæring.
- WCAG 2.1 AA kontrolleres i de berørte delene, både med automatisk test og manuelt.
- Rapporten følger punkt 10 i oppgaven, inkludert gjenværende treff på «T-Kroken» og eventuelle utkast.

## Teknisk
- Berørte filer: `src/pages/FoodDrink.tsx`, `src/i18n/legacyTranslations.ts`, `src/pages/Parkering.tsx`, `src/pages/Handel.tsx`, `src/lib/cms/tipArticles.ts`, `src/lib/images.ts`, `src/lib/cms/mockAdapter.ts`, `src/lib/cms/types.ts`, `src/pages/SubmitEvent.tsx`, `src/pages/AdminEventSubmissions.tsx`, `src/pages/Events.tsx`, `src/lib/events/*`, `scripts/prerender.ts`.
- Databaseendringen i `event_submissions`: en ny tekstliste `categories`, fylt fra `category`. Triggeren `event_submissions_guard_edit` oppdateres om nødvendig.
- Etappene leveres i rekkefølgen A, B, C, D. D bygger på C, og nyheten lenker til D. Lenkene legges derfor inn når D er klar.
