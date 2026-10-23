# Ny design for Bjorli.no – etappevis

Avklart: Den nye paletten gjelder bare vinter. Sommer beholder dagens turkis og grønt, men får ny typografi, layout og knappestil. Overskrifter settes i Source Serif 4, som lastes fra egen server med OFL-lisens. Brødtekst beholder Mulish. Arbeidet leveres i etapper, og du kontrollerer resultatet etter hver etappe. Ingenting deployes eller publiseres.

## Etappe 1 – Grunnmur, meny, hero og rekkefølge
1. **Vinterfarger** som felles designvariabler: fjellblå #172D45, snøhvit #FAFBFC, steingrå #EDF0F3, koksgrå #202833, rød #B73730 og hvit. Kontrasten måles, og nyansene justeres til AA hvis det trengs. Sommer får tilsvarende knappe- og lenkeregler i sine egne farger.
2. **Typografi:** Overskrifter i Source Serif 4, brødtekst i Mulish. Størrelsene følger spesifikasjonen: 34–40 og 28–32 px på mobil, 48–64 og 32–40 px på desktop, og 16–18 px brødtekst med 1,55 i linjehøyde.
3. **Felles knapper og lenker:** Rød primærknapp og tydelig sekundærknapp. Sekundære tekstlenker er understreket. Trykkflatene er minst 44 px.
4. **Toppmeny:** Fjellblå meny med hvit logo og rød «Kjøp heiskort» på desktop. Mobilmenyen viser ikon og teksten «Meny». Siden får en «Hopp til hovedinnhold»-lenke, og ankerlenker får avstand under den faste menyen.
5. **Hero:** På desktop deles den omtrent 45/55 mellom tekst og bilde. På mobil kommer bildet først, med begrenset høyde. Godkjent budskap og logikken for sommer og vinter beholdes.
6. **Praktisk informasjon:** En stripe rett under hero med Åpningstider, Føre og heiser, Vær og webkamera og Løypekart. Den vises som 2 × 2 på mobil, med eksisterende status og oppdateringstid.
7. **Seksjonsrekkefølge** endres i kilden, slik at prerender og React følger samme rekkefølge.

## Etappe 2 – Forsidens seksjoner
- **Siste nytt:** Kompakt visning med bilde og tekst side om side, og lenke til hele meldingen. Årsaken til at «Høstfargene» deles midt i ordet blir undersøkt og rettet.
- **Arrangementskort:** Naturlige datoer på valgt språk og lesbare kategorinavn i stedet for interne verdier. Bildevisningen med hele bildet beholdes, og høyden begrenses på mobil.
- **Pumptrack «Juni 2026»:** Jeg kommer først med en anbefaling og endrer ingenting før du har svart.
- **Destinasjon:** Tekst og stort bilde. Praktiske tjenester vises i kompakte grupper, fire kolonner på desktop og to på mobil.
- **Overnatting:** Fjellblå flate med rød knapp og bilde ved siden av teksten.
- **Tips, opplevelser og reise:** Variert layout. Hver seksjon får én hovedhandling.
- **FAQ og footer:** Tilgjengelig trekkspill og fjellblå footer med understrekede lenker.

## Etappe 3 – Undersider og WCAG-kontroll
- Offentlige undersider får nye farger, skrift, knapper og lenker gjennom de delte komponentene. Innholdsstrukturen beholdes. Admin og innlogging berøres ikke.
- Kontroll ved 320, 390, 768 og 1440 px: sommer og vinter, alle seks språk, brede, stående og kvadratiske bilder, tastatur, 200 % tekstforstørrelse og kontrastmålinger.
- Du får før- og etterbilder av forsiden på mobil og desktop. Automatiske tester regnes ikke alene som bevis for WCAG-samsvar.

## Rammer
Ruter, metadata, strukturerte data, språk, datakilder, GA4, database og Cloudflare endres ikke. Det legges ikke til nye avhengigheter. Forslag til ny ordlyd leveres separat.

## Tekniske detaljer
- Fargene legges inn i `:root` i `src/index.css`. `[data-season='summer']` beholder sommerverdiene. Nye variabler: `--cta`, `--cta-foreground` og `--link`.
- Skriftfilene for Source Serif 4 (woff2, latin og latin-ext, vekt 600 og 700) legges i `public/fonts/` med OFL-lisensfil og preload av hovedvekten. Overskriftsfonten byttes i `tailwind.config.ts` og i base-reglene for h1–h6.
- Dette erstatter tidligere minne om Jost og den offisielle vinterpaletten, og minnet oppdateres.
- Filer som berøres: `Navbar.tsx`, `Footer.tsx`, `Layout.tsx`, `PageHero.tsx`, `HomepageSections.tsx`, `HomepageCampaign.tsx`, `LiveStatusCards.tsx`, `mockAdapter.ts`, `ui/button.tsx`, `cards.tsx` og `FaqBlock.tsx`.
- Avstandsreglene i `homepage-spacing` (48/64/80) beholdes.
