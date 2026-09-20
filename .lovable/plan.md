# Værvarsel: ryddig detaljfelt + faste oppdateringstider

## 1. Detaljfeltet under timegrafen

I dag viser feltet «Nøyaktige verdier, 17» og gjentar klokkeslett, vindretning og vindkast to ganger, med engelsk værbeskrivelse fra Google.

Ny visning (eksempel norsk, valgt time 17):

```text
Værvarsel kl. 17.00
Regnbyger. Temperatur: 6 °C. Nedbør: 0,9 mm. Vind: 3 m/s fra vest. Vindkast: 10 m/s.
```

- Overskriften bruker klokkeslettet til den valgte timen.
- Værbeskrivelsen oversettes til sidens språk ut fra Googles værkode (ikke Googles engelske tekst).
- Klokkeslett, vindretning og vindkast fjernes fra selve setningen (vindretning står som «fra vest» i vindlinjen, vindkast på egen linje).
- Skjermleser-teksten på hver time beholder samme innhold, slik at tastaturbruk fortsatt fungerer.
- Alle 6 språk. Graf, layout, vindpiler og 7-dagersvarselet er uendret.

## 2. Faste oppdateringer kl. 07.00, 12.00 og 19.00 (Europe/Oslo)

I dag henter vi fra Google når noen besøker siden (med 15 minutters mellomlagring i minnet). Ny løsning:

- En planlagt jobb i databasen kjører hver hele time og starter henting kun når klokken i Oslo er 07, 12 eller 19. Dette gir riktig tid både sommer og vinter.
- Hentingen lagrer siste vellykkede prognose i databasen, felles for alle besøkende.
- Sidevisning, navigasjon og automatisk oppfriskning leser kun lagret prognose og kan aldri utløse et Google-kall.
- Ved feil beholdes forrige prognose, og visningen merkes tydelig som utdatert når en planlagt oppdatering er uteblitt. Ett kort nytt forsøk per planlagt kjøring, ingen løpende gjentak.
- «Sist oppdatert» viser faktisk hentetid fra Google.
- Kun fremtidige timer som finnes i prognosen vises. Ingen utfylling av manglende timer.
- Antall Google-kall: 2 per oppdatering (time + dag) × 3 oppdateringer = **6 kall per døgn**, uavhengig av trafikk.

Fnugg-status, driftsmeldinger, webkameraer og dagens design beholdes uendret.

### Googles vilkår

Google tillater midlertidig mellomlagring av værinnhold (inntil 30 dager) så lenge kilde og tidspunkt oppgis. Lagring i inntil 12 timer er godt innenfor. Jeg kontrollerer gjeldende vilkårstekst før implementering og rapporterer konkret dersom noe hindrer løsningen.

## Teknisk

- `src/components/WeatherForecast.tsx`: ny overskrift med klokkeslett, forenklet detalsetning, fjernet dobbel retning/kast.
- `src/lib/integrations/googleWeather.ts` (+ test): lokalisert tabell fra Googles `conditionType`-koder til værtekst i 6 språk (f.eks. `RAIN_SHOWERS` → «Regnbyger» / «Rain showers» / «Regenschauer» / «Regenbuien» / «Regnbyger» / «Regnskurar»), med fallback til eksisterende symbolnavn.
- Ny tabell `public.weather_snapshot` (én rad) med prognose-JSON, `fetched_at` og feiltellere. RLS med offentlig lese-tilgang og skrive kun fra serverfunksjon, inkludert nødvendige GRANTs.
- Ny funksjon `refresh-weather`: henter fra Google og skriver snapshot; beskyttet med intern nøkkel, kalles kun av planleggeren.
- `get-weather` endres til kun å lese snapshot fra databasen — ingen Google-kall. Svarer med `fetchedAt` og et flagg for utdatert data når snapshotet er eldre enn forventet.
- Planlegging: aktiver `pg_cron` + `pg_net` og legg opp én timesjobb som kaller `refresh-weather` når Oslo-klokken er 07, 12 eller 19. Duplikater unngås ved at jobben ikke skriver på nytt dersom snapshotet allerede er hentet i samme tidsvindu.
- `useBjorliForecast`: leser videre som i dag (ingen Google-kall), oppfriskning kan reduseres til å hente lagret data.

## Verifisering

Typesjekk, eksisterende og utvidede tester, produksjonsbygg. Nettleserkontroll: gjentatte sidebesøk og navigasjon viser null Google-kall, detaljfeltet vises korrekt på mobil og desktop, og «Sist oppdatert» stemmer med lagret hentetid. Rapport med valgt planlegging, kall per døgn og resultat.
