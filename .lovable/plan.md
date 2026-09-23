# Legg til webcam.io-kamera ved stolheisens toppstasjon

## Omfang
- Behold de fem eksisterende IPCamLive-kameraene uendret.
- Legg det nye webcam.io-kameraet sist i samme kamerarutenett på vær- og webkameraside i alle seks språk.
- Ikke endre værvarsel, Fnugg, øvrig innhold, publisering eller deployoppsett.

## Filer
**Inspisert:** `src/pages/WeatherWebcams.tsx`, `src/components/WebcamEmbed.tsx`, `src/App.tsx`, `package.json`.

**Forventet endret/opprettet:**
- Ny liten React-komponent for webcam.io-widgetens montering og opprydding.
- `src/pages/WeatherWebcams.tsx` for plassering og seks lokaliserte titler.

## Gjennomføring
1. Lag en egen webcam.io-komponent som setter `window.timelapseview_options["JZt3I"]` før leverandørscriptet lastes.
2. Monter scriptet bare for dette kameraet, og fjern script, widgetinnhold og globale innstillinger ved avmontering. Dette hindrer duplikater etter intern navigasjon.
3. Gi widgeten samme kortutseende og mellomrom som eksisterende kameraer. Begrens widget/iframe til tilgjengelig bredde uten horisontal scrolling eller avkuttede kontroller.
4. Legg kameraet sist etter eksisterende kameraer med tittelen «Webkamera 6 Stolheis toppstasjon» og naturlige oversettelser for EN, DE, NL, DA og SV.
5. Behold eksisterende kameraklikksporing, med webcam.io-widgetens URL for det nye kameraet.

## Kontroll
- Kjør TypeScript-kontroll og produksjonsbygg.
- Kontroller siden lokalt på desktop og mobil med ferdig lastet widget.
- Naviger bort og tilbake og bekreft at bare én widget finnes.
- Bekreft at fem eksisterende kameraer og værvarselet fortsatt vises og fungerer.

## Risiko og antakelse
- Widgeten lastes fra webcam.io og er derfor avhengig av at tredjepartsscriptet tillater innlasting i lokal forhåndsvisning.
- Ingen manuell publisering utføres.
