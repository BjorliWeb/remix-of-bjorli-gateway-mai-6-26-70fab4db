# Åpningstider – vedlikehold uten Lovable

Gjelder `/apningstider/` (alle seks språk) og Bjorli Fjellkafe på `/mat-og-drikke/`.
Sist oppdatert: sesongen 2026/2027 (26.11.2026).

## 1. Hvor åpningstidene ligger

| Hva | Fil | Rolle |
|---|---|---|
| Datoer, klokkeslett, perioder, unntak, kveldskjøring, Fjellkafe og Loungen | `src/lib/openingHours/season.ts` | **Eneste autoritative kilde** for fakta |
| Tekster på seks språk og formatering av datoer og tider | `src/lib/openingHours/seasonView.ts` | Ordlyd. Ingen datoer eller klokkeslett skal skrives her. |
| Sidedata for `/apningstider/` | `src/lib/cms/openingHoursData.ts` | Setter sammen seksjonene og de eksisterende linjene for butikk og Heiskroa |
| Visning | `src/pages/OpeningHours.tsx`, `src/pages/FoodDrink.tsx` | React |
| HTML for søkemotorer og besøkende uten JavaScript | `scripts/prerender.ts` (`openingHoursBodySkeleton`, `fjellkafeHoursHtml`) | Leser de samme modulene |
| Tester | `src/lib/openingHours/season.test.ts`, `seasonView.test.ts` | Kontrollerer datoer, ukedager, prioritet og språk |

Åpningstidene ligger ikke i databasen, Supabase eller noe CMS, og det finnes ingen redaktørskjerm for dem. Derfor kan ingen eldre CMS-data overskrive dem ved bygg. Redaktørfunksjonene i `/admin/innsendinger` gjelder arrangementer og er uberørt.

**Live driftsstatus** («går heisene nå?») kommer fra Fnugg (`src/lib/integrations/fnugg.ts` og `LiveFnuggStatus`) og er helt adskilt fra de planlagte tidene. Den skal ikke endres ved oppdatering av åpningstider.

Linjene for Intersport og Heiskroa på åpningstidssiden kommer fortsatt fra `openingHoursPage.shop` og `openingHoursPage.restaurant` i `src/i18n/legacyTranslations.ts`.

## 2. Slik endrer du datoer og klokkeslett

Alt gjøres i `season.ts`:

- **Tidligsesong:** `MINI_OPENING` og `LIFT1_EARLY`.
- **Ferier:** `CHRISTMAS`, `WINTER_BREAK` og `EASTER`. Hver har `start`, `end` og `hours`.
- **Ordinær sesong:** `REGULAR`, med `year`, `weeks` (ISO-ukenummer), `openDays` (1 = mandag … 7 = søndag), `hours` og `groupsOnRequestDays`.
- **Avslutningshelg:** `CLOSING_WEEKEND`. Sett `hours: null` når klokkeslett ikke er bekreftet.
- **Enkeltdager med avvikende tid:** legg dem i `EXCEPTIONS`, for eksempel julaften.
- **Kveldskjøring:** `EVENING`, med ukedag, periode, tid, prepareringsvindu og egen billett. Kveldskjøring som faller på en fredag i perioden, skal ikke legges inn på nytt i `EXCEPTIONS`.
- **Arrangementer som nevnes i tidligsesongen:** `SEASON_EVENTS`.
- **Serveringssteder:** `FJELLKAFE` (blant annet `november2026`) og `LOUNGEN`.

Formater:
- Datoer skrives `YYYY-MM-DD` og gjelder Europe/Oslo.
- Klokkeslett skrives `HH:MM`.
- En stengetid som er lik eller tidligere enn åpningstiden, betyr etter midnatt, for eksempel 10:00–02:00.

**Prioritet** (`dayPlan`): enkeltdato, så ferie, så tidligsesong eller særperiode, så ordinær uke.

Datoer som ingen regel dekker, får status `notCovered`. Koden antar aldri at slike dager er åpne eller stengte.

## 3. Ny sesong

1. Kopier dagens konstanter i `season.ts` og bytt alle datoer, år og uker.
2. Oppdater `SEASON_LABEL` og eventuelt `SEASON_EVENTS`.
3. Fjern utgåtte særtider, for eksempel `FJELLKAFE.november2026`, eller erstatt dem.
4. Oppdater forventede verdier i `season.test.ts`: ukedager, prioritet og listen i `uncoveredDates`.
5. Hvis en ny type informasjon trengs, legg til tekst for **alle seks språk** i `seasonView.ts`. TypeScript stopper bygget hvis et språk mangler.

## 4. Seks språk

- **Fakta:** finnes bare i `season.ts`, så alle språk viser automatisk samme datoer og tider.
- **Formatering:** `fmtRange` og `fmtDay` tilpasser formatet per språk, for eksempel `kl. 10.00–16.00`, `10:00–16:00` og `10:00–16:00 Uhr`.
- **Kontroll:** testen «every language shows exactly the same clock times» feiler hvis språkene viser ulike tider.
- **Merkenavn:** Mini-maNeuver, Bjorli Fjellkafe, Jibben Lever Tour og T-kroken oversettes ikke. Det kontrolleres også av en test.

## 5. Test før publisering

```bash
npx vitest run src/lib/openingHours
```

```bash
npx vitest run && npx tsc --noEmit -p tsconfig.app.json && npx eslint .
```

```bash
ALLOW_MISSING_EVENTS=1 npm run build
```

Bruk `ALLOW_MISSING_EVENTS=1` bare lokalt når Supabase-variablene mangler. Cloudflare bygger med ekte data.

Kontroller deretter `dist/apningstider/index.html` og de fem språkversjonene (`dist/en/opening-hours/` osv.). Hver side skal ha 9 seksjoner (`data-opening-section`) og de nye klokkeslettene. Ikke commit `public/sitemap.xml` eller `.cache/` fra et lokalt bygg.

## 6. Commit, push og publisering

1. Opprett en egen gren, for eksempel `content/opening-hours-2027-2028`.
2. Commit, push og opprett pull request mot `main`.
3. Cloudflare Pages lager en forhåndsvisning for grenen (`<gren>.bjorli-staging.pages.dev`, satt til noindex). Kontroller den på mobil og desktop.
4. Merge til `main`. Det publiserer bjorli.no automatisk via Cloudflare Pages.

Ingen database, Edge Function eller Lovable er involvert.

**Datostyrt visning:** perioder som er passert, merkes «Avsluttet». For en besøkende skjer det i nettleseren med en gang. Den prerenderte HTML-en oppdateres ved neste bygg, som skjer ved hver merge og hver gang en redaktør publiserer et arrangement.

## 7. Tilbakeføring

```bash
git revert <commit-id>
```

Push revert-commiten via en PR og merge. Cloudflare publiserer forrige versjon på nytt. Dette kan også gjøres med «Revert»-knappen på den mergede PR-en i GitHub.

## 8. Gjenbrukbart prompt for Claude Code

> Oppdater åpningstidene for Bjorli Skisenter for sesongen [ÅR/ÅR] i `src/lib/openingHours/season.ts`, etter `docs/content/opening-hours-maintenance.md`. Eierbekreftede fakta:
> - Tidligsesong: [datoer, heis, tider]
> - Juleferie: [periode, ordinær tid, unntak per dato, kveldskjøring]
> - Ordinær sesong: [uker, åpne dager, tid, dager for grupper på forespørsel]
> - Vinterferie: [periode, tid]
> - Påske: [periode, tid]
> - Avslutningshelg: [datoer, eventuelt tid]
> - Kveldskjøring: [ukedag, periode, tid, preparering]
> - Serveringssteder: [sted, periode, dager og tider]
>
> Endre bare fakta i `season.ts` og tekst i `seasonView.ts` for alle seks språk ved behov. Oppdater testene, og rapporter udekkede datoer og konflikter fra `uncoveredDates()` uten å finne på tider. Kjør tester, typesjekk, lint og bygg. Push til en egen gren, og opprett en PR uten å merge.

## 9. Status for sesongen 2026/2027 (til avklaring hos eier)

Følgende datoer er **ikke** dekket av sesongplanen og vises ikke med tider:
- **23.–25. november 2026:** mellom Mini-maNeuver-helgen og åpningen av Heis 1.
- **14.–15. desember 2026** (mandag og tirsdag): mellom tidligsesongen og juleferien.
- **4.–10. januar 2027** (uke 1): ingen dagkjøring er oppgitt, men fredag 8. januar ligger innenfor perioden for kveldskjøring (17.00–20.00).

Følgende er mulige konflikter eller uklarheter, og vises slik eieren har oppgitt dem:
- **16.–18. april 2027:** avslutningshelgen er oppgitt uten klokkeslett, men ligger i uke 15. Uke 15 er oppført med ordinær tid onsdag–søndag 10.00–16.00. Siden viser avslutningshelgen uten tider.
- **Fredag 19. mars 2027:** påsketiden varer til 17.00, mens preparering ved behov skjer 16.00–17.00 før kveldskjøringen 17.00–20.00.
- **Etter 18. april 2027:** ikke omtalt. Det antas ikke at anlegget er stengt eller åpent.
- **Bjorli Fjellkafe i november:** tidene gjelder fredag til søndag, men kafeen skal også ha åpent «i hele heisens åpningstid». Heis 1 går hver dag fra 26. november, så ukedagene er uavklart.
- **Varmestue:** Bjorli Fjellkafe har varmestue i andre etasje (der Loftet også ligger), og Heiskroa beskrives fortsatt som varmestue. Begge opplysningene beholdes.
- **TikTok:** nettstedet har ingen verifisert TikTok-adresse. TikTok nevnes i teksten, men det lenkes bare til Instagram og Facebook.
