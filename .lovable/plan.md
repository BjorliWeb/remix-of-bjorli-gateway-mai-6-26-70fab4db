# Webkamera 6: vis bare venstre linse

## Funn i dagens oppsett
- **Tidsstyring:** Backend har tidsstyrte jobber og nettverkskall fra databasen tilgjengelig. Værvarselet har allerede et lagringsoppsett med låsing (`weather_snapshot`). Planlagt oppdatering av været er ikke aktivert ennå.
- **Lagring:** Fillagring finnes, men den eneste bøtta i bruk er privat (`event-submissions`). En egen offentlig bøtte for kamerabildet må opprettes.
- **Bildeanalyse:** Ingen finnes i dag. Backend-funksjonene kan dekode bilder og sammenligne piksler uten ny server.
- **Kilde:** Den offentlige siden `webcam.io/webcams/P4dKmP` svarer HTTP 200 og viser bilde-URL-er som `assets12.webcam.io/w12/P4dKmP/20260926/101008-d77190.jpg`. Dato og klokkeslett står i filnavnet. Tidssonen er ikke bekreftet, og det finnes ikke noe dokumentert API. Dette må kontrolleres i første steg.
- **Forstørring:** `WeatherWebcams.tsx` har ingen egen forstørrelsesfunksjon. Kamera 1–5 slår av zoom i IPCamLive (`disablezoombutton=1`). Hvilken funksjon som skal beholdes, må avklares (se «Åpne punkter»).
- **Motivreferanse:** Bildet ble ikke med i opplastingen. Bare planteksten kom fram.

## Anbefalt løsning
```text
Tidsjobb (hvert 5. min) -> funksjonen webcam6-refresh
  -> hent siste bilde-URL fra webcam.io
  -> samme URL som sist? stopp (ingen analyse)
  -> last ned -> motivtest mot referanser for venstre linse
  -> godkjent med høy sikkerhet? lagre som webcam6/latest.jpg + metadata
  -> ellers: behold forrige godkjente bilde, logg årsaken
Nettside -> leser latest.jpg + opptakstid (ingen analyse per visning)
```

**Motivtest (deterministisk, ingen betalt tjeneste):**
- Bildet skaleres ned til gråtone, og kantstrukturen beregnes. Dermed påvirker lysstyrke og farge testen lite.
- Faste områder sammenlignes med referansemaler: taket øverst til venstre og masten nær midten. Strukturen sammenlignes også med referanser fra høyre linse.
- Bildet godkjennes bare når likheten med venstre linse er klart høy **og** klart høyere enn likheten med høyre linse. Alt annet regnes som usikkert og avvises.
- Referansene hentes fra webcam.io-arkivet for begge linser, både i dagslys og mørke. De lagres i backend.
- Valgfritt senere: en AI-bildemodell som ekstra kontroll når testen er usikker. Den gir en liten kostnad per bilde og er ikke med i denne fasen.

**Kostnad:** Jobben kjører 288 ganger i døgnet. De fleste kjøringene er bare en rask sjekk av URL-en, og cirka 96 nye bilder analyseres per døgn. Hyppige kjøringer holder databasen aktiv og kan øke Cloud-kostnaden litt. Kjøring hvert 15. minutt (96 per døgn) er billigere, men betyr at et godkjent bilde kan komme opptil 15 minutter senere. Ingen ny server eller betalt tjeneste trengs.

**Tilganger:** Kun eksisterende backend. Du må godkjenne en ny offentlig lagringsbøtte, en ny tabell for bildestatus, én ny funksjon og én tidsjobb. Du ga ikke eksplisitt tillatelse til endringer i backend i denne fasen, så dette gjøres først etter godkjenning.

## Tid, feil og oppstart
- **Opptakstid:** Hentes fra filnavnet når tidssonen er bekreftet. Hvis ikke vises teksten «Hentet kl. …». Tidspunktet oppdateres bare når et nytt bilde godkjennes. Ingen varsel etter 1 time.
- **Duplikater:** Siste kilde-URL lagres. Er URL-en uendret, skjer ingen analyse og ingen oppdatering. En lås hindrer at to kjøringer overlapper.
- **Feil:** Nettverksfeil, feil motiv eller usikkert resultat gir ingen endring. Årsaken logges med tellere.
- **Før første godkjente bilde:** Kortet viser dagens «ikke tilgjengelig»-felt i samme boksstørrelse. Bilde fra feil linse brukes aldri som reserve. Arkivet kan eventuelt brukes til å finne et første godkjent bilde.

## Test av motivfilteret
- Testsett fra arkivet: minst 20 bilder per linse, fordelt på dagslys, skumring/mørke, tåke og snø/nedbør. Hvert bilde merkes manuelt.
- Mål: 0 godkjente bilder fra høyre linse, og en rimelig andel godkjente bilder fra venstre linse. Grensene settes strengt.
- Begrensninger: Tett tåke, snø på linsen og mørke uten lys kan gjøre bildene fra begge linser strukturløse. Da avvises bildet, og forrige godkjente bilde beholdes. Endres kamerautsnittet, må referansene lages på nytt. Gjenkjenningen er ikke feilfri, men den er bygget for å heller avvise enn å slippe gjennom feil motiv.

## Komponenter som endres (etter godkjenning)
- Ny backend-funksjon `webcam6-refresh`, ny tabell for bildestatus, ny offentlig bøtte og én tidsjobb.
- `src/components/WebcamIoEmbed.tsx` erstattes med en bildekomponent. Boksstørrelse, tittel, LIVE-indikator, sporing og responsivitet beholdes.
- `src/pages/WeatherWebcams.tsx`: bare byttet av komponent for kamera 6.
- Kamera 1–5, værvarselet og designet endres ikke.

## Åpne punkter
1. Last opp motivreferansen på nytt.
2. Forstørrelsesfunksjon: Siden har ingen egen forstørring i dag. Skal bildet kunne åpnes i full størrelse ved klikk?
3. Hvilken frekvens velger du: 5 eller 15 minutter?
