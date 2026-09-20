# Visuell værprognose på værsiden

## Mål
Erstatt dagens timekort og dagtabell med en samlet, tilgjengelig værvisualisering under webkameraene. Forsiden, Fnugg, føremeldinger og webkameraer forblir uendret.

## Filer som berøres
- `supabase/functions/get-weather/index.ts`
- `src/lib/integrations/googleWeather.ts`
- `src/lib/integrations/googleWeather.test.ts`
- `src/components/WeatherForecast.tsx`
- Eventuelt én ny, liten værvisualiseringskomponent dersom dette holder hovedkomponenten enklere

Ingen nye pakker er nødvendige: prosjektet har allerede Recharts og Lucide.

## Gjennomføring
1. **Videreføre eksisterende Google-data**
   - Utvide samme time- og dagskall med Googles stabile værtype/kode, ikonreferanse og dag/natt-felt der responsen tilbyr det.
   - Beholde eksisterende tekst, temperatur, nedbør, vind/vindkast og vindretning.
   - Ingen ekstra API-kall; manglende felt beholdes som `null`.

2. **Felles værsymboler**
   - Lage én avgrenset mapping fra Googles værtype til eksisterende Lucide-symboler.
   - Bruke dag/natt-variant når datagrunnlaget støtter det; ellers et nøytralt symbol eller `—`, aldri en oppdiktet tilstand.
   - Gi symbolene lokaliserte, tilgjengelige beskrivelser på NO, EN, DE, NL, DA og SV.

3. **Sammenhengende 24-timers tidslinje**
   - Bygge én felles timegrid der klokkeslett, symbol, temperaturkurve, nedbørssøyler og vind deler identiske kolonner.
   - Temperaturkurven får brudd ved manglende målinger. Nedbør vises i et eget felt med mm, uten å gjøre manglende data til null.
   - Nederst vises vindstyrke, tydelig vindkast og pil mot retningen vinden blåser. Teksten beholder retningen vinden kommer fra.
   - Hele tidslinjen ruller samlet horisontalt på mobil.
   - Hver time blir fokuserbar og viser samme nøyaktige verdier ved trykk, hover og tastaturfokus.
   - Legge inn skjermlesertekst som forklarer forskjellen mellom pilens målretning og tekstens fra-retning.

4. **Kompakt 7-dagersvisning**
   - Erstatte tabellen med responsive dagsrader for ukedag, symbol, min./maks. temperatur, nedbør og vind.
   - Stable eller omgruppere feltene på smale skjermer uten overlapping.

5. **Beholde eksisterende rammer**
   - Beholde plasseringen rett under webkameraene, dagens typografi, fargetokens, kilde, hentetid, laste-/feiltilstand og markering av utdaterte data.
   - Ingen værseksjon eller værkall på forsiden.

## Verifisering
- Utvide enhetstestene for nye værfelt, symbolmapping, dag/natt, manglende verdier og vindpilens motsatte retning.
- Kjøre TypeScript-kontroll, relevante tester og produksjonsbygg.
- Rulle ut kun den eksisterende `get-weather`-funksjonen, som godkjent; ikke publisere nettstedet.
- Kontrollere ekte API-respons for nye felt uten å eksponere nøkkelen.
- Kontrollere værsiden visuelt på 390 px og 1280 px med ferdig innlastede data, inkludert samlet mobilrulling, fokus/trykk, kilde/tidspunkt og manglende verdier.
- Bekrefte at forsiden ikke viser prognosen og ikke utløser `get-weather`.

## Risiko og avgrensning
- Googles faktiske felt for værtype, ikon og dag/natt må bekreftes i den levende responsen før mappingen ferdigstilles; planen antar ikke feltnavn som ikke er kontrollert.
- Kun værfunksjonen rulles ut. Cloudflare-nettstedet og øvrige backend-funksjoner publiseres ikke.
- Endringene holder seg til det eksisterende værtillegget og endrer ikke Fnugg, analyse, sikkerhet eller øvrig sideinnhold.
