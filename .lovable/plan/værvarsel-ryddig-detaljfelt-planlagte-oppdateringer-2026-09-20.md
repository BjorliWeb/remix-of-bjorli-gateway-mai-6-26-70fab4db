# Værvarsel: ryddig detaljfelt + planlagte oppdateringer

## 1. Detaljfeltet under timegrafen

I dag viser feltet «Nøyaktige verdier, 17» og gjentar klokkeslett, vindretning og vindkast, med engelsk værbeskrivelse fra Google.

Ny visning (eksempel norsk, valgt time 17):

```text
Værvarsel kl. 17.00
Regnbyger. Temperatur: 6 °C. Nedbør: 0,9 mm. Vind: 3 m/s fra vest. Vindkast: 10 m/s.
```

- Overskriften bruker klokkeslettet til valgt time.
- Værbeskrivelsen oversettes til sidens språk ut fra Googles værkode, ikke Googles engelske tekst.
- Gjentatt klokkeslett og gjentatt vindretning/vindkast fjernes fra setningen.
- Skjermleser-teksten per time har samme innhold, så tastaturbruk fungerer som før.
- Alle 6 språk. Graf, layout, vindpiler og 7-dagersvarsel er uendret.

## 2. Planlagte oppdateringer i stedet for henting ved besøk

- Timevarsel: hentes én gang hver hele time.
- 7-dagersvarsel: hentes kl. 07.00, 12.00 og 19.00 i Europe/Oslo, med riktig sommer-/vintertid.
- Time- og dagsdata lagres hver for seg, med egen hentetid og egen utløpstid.
- Sidevisning, navigasjon og oppfriskning leser kun lagrede data og kan aldri utløse et Google-kall.
- Lås før henting hindrer at to kjøringer henter samtidig.
- Ved hentefeil: utløpte data slettes, og visningen merkes utilgjengelig. Gyldige data beholdes med «Sist oppdatert».
- Kun fremtidige timer som finnes i prognosen vises; ingen antatte verdier.
- Forventet normalforbruk: 24 timekall + 3 dagskall = **27 Google-kall per døgn**. Retries og eventuell ekstra paginering rapporteres separat.

### Googles vilkår (EØS, punkt 23.3)

Mellomlagring er tillatt i inntil 1 time for Hourly Forecast-verdier og inntil 24 timer for Daily Forecast-verdier. Utløpstidene i løsningen settes nøyaktig etter dette, og utløpte verdier slettes.

Fnugg-status, driftsmeldinger, webkameraer og dagens design beholdes uendret.

## Teknisk

- `src/components/WeatherForecast.tsx`: ny overskrift med klokkeslett, forenklet detaljsetning.
- `src/lib/integrations/googleWeather.ts` (+ test): lokalisert tabell fra Googles `conditionType` til værtekst i 6 språk, med fallback til dagens symbolnavn.
- Ny tabell `public.weather_snapshot` med separate rader/kolonner for `hourly` og `daily`: prognose-JSON, `fetched_at`, `expires_at`, feilteller og låsefelt. RLS: offentlig lesing, skriving kun via serverfunksjon; nødvendige GRANTs.
- Ny funksjon `refresh-weather`: tar inn hvilken del som skal hentes, tar lås, kaller Google med eksplisitt `hours=24`/`pageSize=24` og `days=7`/`pageSize=7`, lagrer og setter utløpstid (1 t / 24 t). Ved feil: sletter utløpt data, øker teller, maks ett kort nytt forsøk.
- `get-weather` leser kun snapshot, returnerer separate hentetider og et utilgjengelig-flagg når data er utløpt eller slettet.
- Planlegging: `pg_cron` + `pg_net`. Én timesjobb henter timevarsel; samme jobb henter dagsvarsel kun når Oslo-klokken er 07, 12 eller 19.
- `useBjorliForecast`: leser lagrede data som før, ingen Google-kall.

## Verifisering

Typesjekk, tester og produksjonsbygg. Antall Google-kall verifiseres med serverlogger og tellere i databasen, ikke nettleserens nettverksfane. Nettleserkontroll bekrefter kun at gjentatte besøk leser lagrede data, at detaljfeltet er riktig på mobil og desktop, og at «Sist oppdatert» stemmer. Kort rapport med planlegging, kall per døgn og resultat.
