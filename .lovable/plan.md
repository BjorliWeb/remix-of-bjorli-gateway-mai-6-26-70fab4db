# Løypeoversikt under Skiappen-kartet

## Mål og avgrensning
Legg løypeoversikten fra de to opplastede filene inn i «Langrenn og løypekart» på vær- og webkamerasiden, på alle seks språk. Behold Skiappen-kartet, kildeteksten, hjelpeteksten og den alltid synlige knappen. Ingen endringer av webkameraer, vær, alpinkart, øvrige sider, sikkerhetspolicy eller analyseoppsett. Ingen publisering eller backenddeploy.

## Hva filene inneholder
- JavaScript-filen har data for åtte løyper, høydeprofiler, reversering av retning og GPX-generering direkte i nettleseren. Separate GPX-filer er derfor ikke nødvendige.
- README oppgir Bjorli Lesja Løypelag som trasekilde og Kartverket som høydekilde. Kildeangivelsene beholdes; dataene behandles som levert materiale, ikke som uavhengig verifiserte målinger.
- Fjelløypa har et oppgitt brudd i traseen. Det skal bevares som to segmenter, ikke tegnes eller eksporteres som en sammenhengende forbindelse.
- Den leverte løsningen har bare norske tekster, egen farge-/knappestil og høydeavlesning med peker, men ikke tastatur. Den kan derfor ikke legges inn uendret og samtidig oppfylle språk- og tilgjengelighetskravene.

## Minste trygge gjennomføring
1. Gjenbruk de leverte løypedataene og beregningsreglene i en liten React-versjon. Ingen ny avhengighet eller global script-tag i `index.html`.
2. Vis løypelisten under kartets eksisterende kilde, hjelp og knapp. Hver løype får navn, lengde og oppgitt rundløype/én vei. Ved åpning vises høydeprofil, stigning, nedstigning, retning og GPX-nedlasting.
3. Bruk eksisterende skrifter, fargetokens, knapper og tilgjengelig åpne/lukke-mønster. Løypenavn og geografiske data beholdes; tekster, tallformat og tilgjengelige navn tilpasses NO, EN, DE, NL, DA og SV.
4. Behold direkte lenker som `#loype-fjelloypa`, også etter språktilpasset sideadresse. Respekter redusert bevegelse og sørg for at menyen ikke dekker valgt løype.
5. Bevar segmentbrudd ved både normal og snudd retning. GPX skal inneholde koordinater og høyder fra de leverte dataene, med korrekt filnavn og MIME-type.
6. La løypenavn, grunnopplysninger og kildeangivelse være tilgjengelige i første HTML uten JavaScript. Bruk samme data og språkregler i prerender og React, slik at innholdet ikke endres ved lasting.

## Tilgjengelighet og kontroll
- Tastatur: åpne/lukke, snu retning, laste ned og avlese høydeprofil uten mus; synlig fokus og korrekt annonsert tilstand.
- Tekstlig alternativ til grafen, forklarte enheter og kildeangivelse. Farge skal ikke være eneste informasjonsbærer.
- Mål kontrast på tekst, fokus, graf og løypemerker. Kontroller 200 % tekst, smale skjermer og redusert bevegelse.
- Nettlesertest på 390, 768 og 1440 px for alle seks språk, i sommer- og vintervisning; suppler med 320 px for reflow. Kontroller at eksisterende kartknapp fortsatt virker og at siden ikke får sideveis rulling.
- Automatiske WCAG 2.0/2.1 AA-tester samt manuelle tastatur- og semantikkontroller av vår seksjon. Skiappens eksterne innhold vurderes separat. Ekte skjermlesertest rapporteres som uverifisert dersom verktøyet ikke er tilgjengelig.
- Enhetstester for åtte løyper, reversering, stigning/nedstigning, GPX-segmenter og kildeverdier. Kjør relevante tester og kontroller produksjonsbyggets HTML, referanser og hydratisering.
- Vis skjermbilder på mobil og desktop, og rapporter hva som faktisk er kontrollert. Ingen publisering.

## Tekniske detaljer og forventede filer
**Inspisert:** opplastet `README.md` og `bjorli-loyper.js`, `src/pages/WeatherWebcams.tsx`, `scripts/prerender.ts` (lokalisert integrasjonspunkt), `package.json`, `AGENTS.md` og eksisterende teststruktur. Prerenderens aktuelle renderfunksjoner og globale stilregler leses i sin helhet før endring.

**Forventet endret/opprettet:**
- `src/lib/trails/`: Node-sikre data, språkstrenger og profil-/GPX-funksjoner med tester.
- `src/components/BjorliTrails.tsx`: løypeliste og høydeprofiler med eksisterende designkomponenter.
- `src/pages/WeatherWebcams.tsx`: plassering av oversikten.
- `scripts/prerender.ts`: grunnopplysninger i første HTML fra samme modul.
- `src/index.css`: bare eventuelle nødvendige, lokalt avgrensede graf-/løypefargetokens.
- `AGENTS.md`: kort regel om delte data og segmentbevaring.

## Risikoer og forutsetninger
- Opplastede data brukes uendret som grunnlag; ingen nye påstander om løypeforhold, preparering eller trygghet.
- Den leverte grafen forbinder segmentbrudd visuelt selv om GPX skiller dem; dette korrigeres i integrasjonen.
- Ingen nye datahentinger eller automatisk oppdatering. Preparering vises fortsatt i Skiappen, ikke som «live» i løypelisten.
- Prosjektet har en eksisterende endring i `public/sitemap.xml`. Den holdes utenfor denne oppgaven.
- Oppgaven gjennomføres i eksisterende utviklingsmiljø. Ingen endring av produksjon, backend, redirects eller analyseoppsett.
