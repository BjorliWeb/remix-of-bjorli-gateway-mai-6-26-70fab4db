# Roadmap

- [x] Reduser forsideavstander og kontroller mobil, nettbrett og desktop.

- [x] Gjennomgå PR #25 (tilbakestilling av passord)
- [x] E-post for nytt passord lenker til /admin/reset-password/#token_hash=…&type=recovery
- [ ] Test en ekte e-post for nytt passord (venter på at brukeren ber om en)
- [x] Redaktører kan redigere innsendte arrangementer på /admin/innsendinger (med justeringer: reviewed_by urørt, trigger kontrollert, bildehåndtering, publisering/engelsk)
- [x] Nettlesertest som innlogget redaktør (kjørt i delt database med merkede testdata, ryddet)
- [x] Arrangementsbilder vises uten beskjæring (contain) overalt + forstørret visning på detaljside

- [x] Redesign etappe 1: farger, skrift, meny, hero, snarveier, rekkefølge
- [x] Redesign etappe 2: forsidens seksjoner
- [ ] Redesign etappe 3: undersider og WCAG-kontroll (påbegynt: kontrast, mobilbredde, Escape i meny fikset; gjenstår manuell skjermleser, sommer/vinter-bilder, før/etter)

- [x] Kjøpsveiledning for sesongkort: inngang, dialog og karusell (skjult, flagg false)
- [ ] Aktiver sesongkortveiledningen (venter på godkjente steg, bilder, lyd/video med undertekster)
- [x] Forsideprøve: Fraunces, full hero (sommer/vinter), sammenligning rød/fjellblå knapp, før/etter-bilder (venter på godkjenning)
- [ ] WCAG 2.1 AA for alle designendringer: forsiden verifisert automatisk; navbar ved 200 % tekst på mobil og manuell skjermleser gjenstår

- [x] Fjern logo fra vinterhero (cache-sikkert, full kvalitet, før/etter desktop+mobil, ikke publiser)
- [x] Søket «bjorli»: undersøk rendret side/sesong/fallback/sitemap, H1 forside (vinter/sommer) + personvern på 6 språk, llms.txt-format, 5 lange titler, test+bygg
- [x] Spisestedene A–D samlet: Mat og drikke, T-Kroken→Bjorli Fjellkafe, bilder, nyhet (utkast), 15 kalenderoppføringer (utkast), flere kategorier gjennom hele flyten. Ingen publisering.
- [x] Oppfølging: fire eksisterende oppføringer dokumentert, plakater/delingsbilde, skjemaetiketter, parkering og skiskole rettet; 175 tester og 45 axe-visninger bestått. Ingen publisering.
- [ ] Fullt produksjonsbygg med aktivert program: venter på full isolert byggkontroll; automatisk preview-bygg alene dokumenterer ikke prebuild/postbuild.
- [ ] Kart: eier må bekrefte P2/Fjellkafe versus «Bjorli Toppen» før kartnavn/vilkår oppdateres.
- [ ] Innlogget kompatibilitetsrunde: venter på isolert backend-test uten produksjonsendringer og vanlig moderering av Pray for Snow.
