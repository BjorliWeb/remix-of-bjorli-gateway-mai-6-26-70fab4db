# Løypeoversikt – kontroll 21. november 2026

Ingen publisering, backenddeploy, endring av CSP eller analyseoppsett.

## Utført
- `src/lib/trails/data.json`: de åtte løypene fra opplastet JavaScript, uten å kjøre opplastet kode; koordinater, høyder, lengder og retningsavhengige stigningstall beholdt.
- `src/lib/trails/trails.ts`: Node-sikre profil-, segment- og GPX-funksjoner, stabile anker/navn og oversettelser på seks språk.
- `src/lib/trails/trails.test.ts`: seks konkrete tester for kildedata, høyder, reversering, ikke-mutering og GPX-segmenter.
- `src/components/BjorliTrails.tsx`: liste, høydeprofil med peker og tastaturstyrt avlesning, tekstlige høydeopplysninger, snu retning og GPX.
- `src/pages/WeatherWebcams.tsx`: listen under eksisterende kart, kilde, hjelp og ekstern knapp. Øvrig side urørt.
- `src/index.css`: lokale løypemarkører og tilgjengelig fokus/tekstforstørrelse. Mulish på kontroller og korttitler; eksisterende serif på seksjonsoverskrift.
- `scripts/prerender.ts`: grunnopplysninger og kilder fra samme Node-sikre modul på alle språk.
- `AGENTS.md`, `roadmap.md` og arkivert plan: dokumentasjon.

## Faktisk gjennomførte kontroller
- Hele Vitest-settet: **189 bestått, 3 hoppet over, 0 feil**, 27 testfiler.
- De tre hoppede testene krever `dist/404.html`: noindex 404/admin-shells, lokaliserte forsidelenker/canonical og fravær av Early Bird. Det finnes ingen `dist` i dette miljøet.
- Nettleser: **48 kombinasjoner** (6 språk × sommer/vinter × 320/390/768/1440 px). Ingen sideveis rulling på siden eller løypeseksjonen, ingen axe WCAG 2.0/2.1 A/AA-avvik i løypeseksjonen og ingen registrerte JavaScript-feil.
- Ekstra 200 % tekst ved 390 px: ingen sideveis rulling i seksjonen. Kort, knapper og statistikk bryter om; høydeaksene er justert slik at tall ikke overlapper.
- Tastatur: Enter åpner/lukker, Tab til GPX og retning, Space snur retningen, fokus beholdes; piltast og End avleser profilen. Knapper og felt har lokal fokusmarkering.
- Alle språk: faktisk GPX-nedlasting med `bjorli-fjelloypa-motsatt.gpx`, 484 punkter og to segmenter. MIME satt til `application/gpx+xml`.
- Direkte norsk lenke med `#loype-fjelloypa` åpner riktig løype; redusert bevegelse kontrollert. Eksisterende Skiappen-knapps URL bevart.
- Målte farger på hvit kortbakgrunn: tekst 15,06:1 vinter / 15,23:1 sommer; mindre tekst 8,31:1 / 8,93:1; graf 14,02:1 / 11,33:1; lokal fokusfarge 8,99:1 / 4,81:1. Løypeprikker er dekorative, med navn som tekst; ingen informasjon avhenger av farge.
- Mobil-/desktopbilder og begge fargetemaer visuelt inspisert. Nærbilder tatt uten fast toppmeny over motivet; dette endrer ikke appen.
- `git diff --check`: bestått.
- Automatisk bygglogg: siste relevante oppføring **build OK**, 18:44:28 UTC.

## Avgrensninger – ikke verifisert
- **Fullt produksjonsbygg med prebuild/postbuild og ferdig prerender-HTML er ikke kjørt.** Miljøets instruksjoner lar bygg kjøre automatisk, ikke manuelt; automatisk build OK beviser ikke hele eksport-/prerenderkjeden. Koden for første HTML er klargjort, men ferdige filer, lenker og identitet mot React er derfor ikke verifisert ende til ende.
- Appen bruker `createRoot`, ikke React-hydrering. Ingen JavaScript-feil ble observert, men det er ikke dokumentasjon på en hydratisert produksjonsside.
- Ekte VoiceOver/NVDA ikke tilgjengelig. Semantikk og automatiske tilgjengelighetstester erstatter ikke full skjermlesertest eller WCAG-sertifisering.
- Skiappens interne kartinnhold og produksjonens sikkerhetspolicy er ikke retestet; begge er urørt.
- Ingen uavhengig kontroll av de leverte traseene/høydene. README angir kildene; dette er ikke navigasjons- eller sikkerhetsgaranti.

## Manuell kontroll før publisering
1. Kjør full eksport, produksjonsbygg og prerender i godkjent byggmiljø; kjør de tre genererte HTML-testene etterpå.
2. Cloudflare Preview/View Source: åtte løypenavn, samme grunnopplysninger/kilder på alle språk, canonical/hreflang og eksisterende kartknapp.
3. Desktop/mobil: åpne hvert kort, avles profil, snu retning og importer begge GPX-retningene i ønsket kartverktøy.
4. VoiceOver/NVDA: korttilstand, knapper, avlesning og meldinger.
5. Ingen sosial metadata eller GA4 endret; sosialverktøy/DebugView ikke nødvendig for denne oppgaven.

Ingen produksjonsendringer. Full byggkjede og ekte skjermleser gjenstår før endelig godkjenning.