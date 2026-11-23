# Rett feil «Åpent»-status fra Fnugg

## Årsak (bekreftet)
Rådata fra Fnugg (anlegg 177, hentet 23.11.2026 kl. 14:3x):
- `resort_open: true`, `resort_open_override: true`
- `resort_opening_date: 2026-11-21`, `resort_closing_date: 2027-04-18`
- `opening_hours.monday.closed: true` (man–fre stengt, lør–søn 10–16)
- `lifts.open: 0 / 6`, `slopes.open: 0 / 11`, `last_updated: 2026-11-23T13:14Z`

Feilen ligger i vår egen logikk, ikke hos Fnugg: `LiveFnuggStatus.todayState()` viser «Åpent» kun basert på `resort_open`. Hos Fnugg betyr dette feltet «sesongen er åpnet», ikke «åpent akkurat nå». Heiser, nedfarter og dagens åpningstider blir ignorert. Ikke caching (hentes med `no-store` hvert 10. min) og ikke prerendering (statusen er kun i nettleseren; prerender viser ingen status).

## Ny statusregel (én felles funksjon)
Rekkefølge:
1. Ingen data / API-feil → «Status ikke tilgjengelig» (aldri «Åpent»).
2. Data eldre enn 24 t (`last_updated`) → «Status ikke tilgjengelig».
3. Dato utenfor Fnuggs sesong (før åpnings- eller etter stengedato), eller `resort_open: false` → «Sesongstengt».
4. I sesong, minst én heis åpen → «Åpent».
5. I sesong, 0 heiser åpne → «Stengt» (dekker både vanlig stengt dag og midlertidig stengt).
6. Motstrid (f.eks. åpne heiser på en dag åpningstidene sier stengt, eller heistall mangler): heistall fra Fnugg vinner hvis de finnes; mangler de → «Status ikke tilgjengelig». Åpningstider alene avgjør aldri «Åpent».

Tid vurderes i Europe/Oslo. «Sist oppdatert» vises fra Fnuggs `last_updated` (siste gyldige svar beholdes ved senere feil, som i dag).

23.11.2026 (mandag, i sesong, 0/6 heiser) → «Stengt».

## Endringer
- `src/lib/integrations/fnugg.ts`: les `resort_opening_date`/`resort_closing_date`; ny ren funksjon `resolveOperationalState(status, now)` → `open | closed | seasonClosed | unavailable`.
- `src/components/LiveFnuggStatus.tsx`: bruk funksjonen i stedet for `resort_open`. Samme design.
- `src/i18n/locales/{no,en,de,nl,da,sv}.ts` + `types.ts`: ny tekst `seasonClosed` (Sesongstengt / Closed for the season / Saisonpause / Seizoen gesloten / Sæsonlukket / Säsongsstängt).
- `src/lib/integrations/fnugg.test.ts`: tester for sesongstengt, åpent, midlertidig stengt (0 heiser i sesong), API-feil/manglende data, foreldede data, motstrid, og nøyaktig dagens råsvar → «Stengt».

Komponenten brukes også på vær-siden og forsidens statuskort; de får samme rettelse automatisk (samme komponent), uten andre endringer.

## Verifisering
- Kjør testene.
- Nettleserkontroll av /apningstider/ på alle 6 språk med ekte Fnugg-svar (forventet «Stengt», 0/6, 0/11, sist oppdatert) og simulerte svar for åpent, sesongstengt og API-feil.
- Ingen publisering.
