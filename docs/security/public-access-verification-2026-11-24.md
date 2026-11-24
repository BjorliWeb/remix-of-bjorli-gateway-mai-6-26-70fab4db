# Sikkerhetsforbedring – testresultater og produksjonsbeslutning

## Status

Godkjente endringer er **klargjort og testet i en isolert, lokal PostgreSQL 17.12**. Ingen migrasjon er kjørt mot den delte produksjonsdatabasen. Ingen funksjon er deployet, ingen publisering er utført og ingen sikkerhetsvarsler er skjult eller markert løst.

Produksjonen har fortsatt de opprinnelige tilgangene. «Etter» nedenfor gjelder den lokale testdatabasen, ikke produksjon.

## Eksakte endringer før/etter

Før: Alle tre tabeller har RLS aktivert. anon og authenticated har SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER og MAINTAIN på tabellnivå. RLS tillater bare offentlige SELECT, samt admin INSERT/UPDATE for seo_meta/services. Ingen DELETE-policy finnes.

Etter lokalt:

| Tabell | anon | authenticated | RLS |
|---|---|---|---|
| weather_snapshot | Ingen tabellprivilegier | Ingen tabellprivilegier | Offentlig SELECT-policy fjernet. Betrodd server beholder eksisterende tilgang. |
| seo_meta | SELECT | SELECT, INSERT, UPDATE | Offentlig lesing og adminvalidering uendret. |
| services | SELECT | SELECT, INSERT, UPDATE | Offentlig SELECT bare `is_active=true`; egen admin SELECT-policy gir aktive og inaktive rader. Admin INSERT/UPDATE uendret. |

Alle unødvendige publikumsprivilegier, inkludert DELETE og TRUNCATE, er fjernet. Ingen nye DELETE-rettigheter er gitt. service_role, eier, øvrige tabeller og globale standardprivilegier er urørt.

seo_meta får en tabellkommentar: Intended Public Access, bare offentlig publisert informasjon, aldri utkast, hemmeligheter, interne notater eller private bildelenker. Kommentaren er dokumentasjon, ikke en automatisk innholdsvalidator.

## Filer

- `docs/security/pending/20261124_public_access_up.sql`: transaksjonell SQL med førkontroll, fem sekunders låsetidsgrense, GRANT/REVOKE, tre policyendringer og kommentar. Ikke lagt i automatisk migrasjonshistorikk.
- `docs/security/pending/20261124_public_access_down.sql`: tilbakeføring av det observerte utgangspunktet.
- `scripts/security/public_access_fixture.sql`: syntetiske rader og roller i lokal database; ingen produksjonsdata kopiert.
- `scripts/security/test_public_access.py`: starter egen PostgreSQL uten nettverkslytting, eksplisitt lokal socket og database, uten Cloud-miljøvariabler; stopper og rydder testdatabasen etterpå.
- `AGENTS.md`: regel for isolert testing og SQL som avventer produksjonsgodkjenning.
- `roadmap.md`: oppgaven og produksjonsgodkjenning som gjenstående avhengighet.
- Denne rapporten.

Ingen React-, design-, språk-, vær-, SEO-, pris- eller authkode er endret. `public/sitemap.xml` hadde en tidligere endring og er urørt; SHA-256 før/etter: `24ce2be5e9e5958e9045434b1bac6cdd770394a3ec23771172c4d2f80aa04b9b`.

## Faktiske tester

### Bestått

- **12 lokale PostgreSQL-testgrupper**, med undermatriser for anon, vanlig innlogget bruker, moderator, admin og service_role. Faktisk SELECT/INSERT/UPDATE/DELETE, interne felt, aktiv/inaktiv tjeneste, administratorredigering, grunnprivilegier og TRUNCATE-avvisning testet. Alle skriveroperasjoner skjer lokalt og rulles tilbake.
- Eksakt semantisk tilbakeføring av ACL-er, policyer, kommentarer, RLS og radantall; ny anvendelse etter rollback besto. ACL-rekkefølge normaliseres fordi rettighetenes rekkefølge ikke har sikkerhetsbetydning.
- Duplisert anvendelse stopper før endring; testkontroll bekrefter uendret tilstand. service_role, user_roles og globale standardprivilegier uendret.
- **250 eksisterende Vitest-tester bestått**, 0 feil, 3 hoppet over, 30 testfiler. Inkluderer innloggings-, MFA-, passord-, rolle-, Fnugg-, pris-/fakta-, SEO- og innholdstester. Disse bruker lokale/simulerte svar og er ikke ekte produksjonsskriving.
- **396 nettleseråpninger:** 33 registrerte offentlige rutenøkler × 6 språk × desktop 1280 px/mobil 390 px. Etter å ha ventet på videresending/overskrift: alle har H1, canonical og 7 hreflang-elementer; ingen JavaScript-feil eller sideåpningsfeil. Dette er en smoke-test, ikke bevis for alle detaljer eller alle CMS-detaljadresser.
- Skjermbilder av forside, vær og heiskort gjennomgått. Fnugg viser Stengt, 0/6 og 0/11 på værbildet.
- Automatisk forhåndsvisningsbygg: **build OK** i siste kontrollerte logg. `git diff --check` besto.
- Live værjobb hadde tre siste registrerte kjøringer succeeded, 07:05/08:05/09:05 UTC. Dette bekrefter databasejobben, ikke alene et vellykket Google-kall. Eksisterende prognoser var lagret 06:05 og 09:05 UTC. Ingen refresh med gyldig nøkkel ble startet.

### Feilet underveis og rettet i testen

- To første lokale testgrupper feilet fordi kontrollen sammenlignet ACL-strengrekkefølge og tok feil tabell fra sortert liste. Ingen policyfeil: testkontrollen ble rettet, deretter 12/12 bestått.
- Første nettleserkjøring leste åtte legacy-kameraadresser før videresending var ferdig. Etter eksplisitt venting: 396/396 bestått. Ingen appkode endret.

### Ikke testet / begrensninger

- Nytt offentlig `get-weather`-svar gjennom en isolert deployet Edge Function koblet til testdatabasen er ikke testet. Koden bruker service_role; samme rolle kunne lese og skrive prognosen i lokal test. Eksisterende live GET var tidligere i analysen verifisert med 200 og uten interne felt, og refresh uten nøkkel med 403. Dette er førtilstand, ikke ettertest i produksjon.
- Ekte admin-/redaktørinnlogging og faktisk publisering/innholdslesing etter disse reglene er ikke testet ende til ende. Lokale roller og eksisterende simulerte auth-tester besto; produksjon ble ikke brukt til skriving.
- Full prebuild/postbuild/prerenderkjede er ikke kjørt manuelt; miljøets automatiske forhåndsvisningsbygg besto. De tre hoppede testene krever `dist/404.html`: noindex 404/adminskall, lokaliserte lenker/canonical i ferdig HTML, og fravær av avpublisert Early Bird i filer/sitemap/lenker.
- Ekstern heiskortbetaling ble ikke gjennomført; prisregler/kjøpslenker er dekket av eksisterende tester. Eksterne kart, alle webkameraers levende bilder, video/lyd, e-post og tredjepartsintegrasjoners interne funksjoner er ikke uttømmende kontrollert.
- Nettleserkontrollen åpnet dagens uendrede backend, ikke lokal database. Den viser før-regresjonsstatus; det er ikke en full etter-regresjon av en isolert deploy.
- Verken API-forbruk eller caching er målt over tid. Ingen kode, jobbplan eller TTL er endret; tester har ikke utløst Google-refresh. Nettleserkontroll gjør vanlige offentlige lesekall.

## Separat analyse av de 13 linterforholdene – ingen endringer

Live-definisjoner, EXECUTE-grants, eierskap, RLS og public-schema CREATE-grants er kontrollert. Alle fem funksjoner er eid av postgres og SECURITY DEFINER: de kan derfor omgå RLS når de utfører sitt avgrensede arbeid. anon/authenticated har ikke CREATE i public, som reduserer search_path-manipulasjon. Serverprivilegier må behandles som betrodde.

### Seks WARN, fem ulike funksjoner

| # | Funn / tilgjengelighet | Risiko og konkret anbefaling |
|---|---|---|
| 1 | event_submission_path_declared, anon EXECUTE | **Low / tilsiktet kapabilitetssjekk.** Returnerer bare boolsk for eksakt deklarert bildebane, matching upload_token og innsending yngre enn én time. Ingen rollekrav: offentlig opplasting er formålet. Brukes av storage INSERT-policy som i tillegg krever bucket og uploads-mappe. Tokenet er adgangsbevis, ikke identiteten til innlogget bruker. Behold nødvendig EXECUTE; test feil token, feil bane og utløp. Ikke fjern funksjonen blindt. |
| 2 | Samme funksjon, authenticated EXECUTE | **Low**, samme begrensning og hensikt. `search_path=public`, tabell og storage-hjelper er kvalifisert. Ingen personfelter returneres, men noen som kjenner hele banen kan undersøke dens eksistens. Vurder bruk av tom search_path ved separat godkjenning; ingen dokumentert eskalering. |
| 3 | has_current_editor_mfa, authenticated EXECUTE | **Low for direkte funksjonseksponering.** Ingen vilkårlig brukerparameter, bruker auth.uid og session_id fra JWT. Sjekker TOTP-tidspunkt eller sesjonsbundet ikke-revokert MFA etter rolleendring; tom search_path. Ingen skriving. Nødvendig i AdminLogin, AdminMfa og redaktørens sideport. Behold EXECUTE; test utløp, annen sesjon, rolleendring og malformed JWT. Separat viktig servergap beskrevet nedenfor. |
| 4 | has_role, authenticated EXECUTE | **Low, bekreftet rolle-probing.** Funksjonen aksepterer vilkårlig bruker-ID og returnerer boolsk rolleinformasjon ved å omgå user_roles sin «egen rolle»-SELECT. Gir ikke angriperen adminrolle: policyene sender auth.uid. `search_path=public`, tabell kvalifisert. Anbefal selv-/adminavgrensing for vanlige innloggede kall, med betrodd serverkompatibilitet; kontroller alle RLS- og serveravhengigheter før endring. Ikke revoker EXECUTE uten erstatning, fordi eksisterende admin-/moderatorpolicyer trenger den. |
| 5 | trg_user_roles_touch_privilege_state, authenticated EXECUTE | **Low.** RETURNS trigger kan ikke brukes som vanlig RPC for å utføre funksjonskroppen. Tom search_path. Oppdaterer kun rollen til berørt bruker sin MFA-ferskhetsgrense etter user_roles-endring. Faktisk triggervei krever lovlig rolleendring; user_roles INSERT/DELETE er adminstyrt. EXECUTE er unødvendig for publikumsrollen og kan foreslås fjernet separat, uten å fjerne triggeren. |
| 6 | verify_editor_email_code, authenticated EXECUTE | **Low for direkte eksponering, betinget Medium hvis utstedelse/tilbakekalling ikke holdes korrekt.** Tom search_path; avgrenser kode til auth.uid + JWT session_id; HMAC, utløp, radlås, maksimum fem sammenligninger, engangsforbruk. Skriver bare egen sesjonsverifisering. Ingen direkte admin-/moderatorrevalidering ved verifisering; utstederfunksjonen krever editorrolle og MFA-rolleendringsgulvet avviser eldre koder. Anbefal eksplisitt rollecheck og annullering ved rolleendring som forsvar i dybden, etter separat godkjenning. Ingen aktiv frontend-/Edge-kaller for e-postkoden funnet; native TOTP er dagens implementerte UI. |

**Viktig separat servergap (High under forutsetning av overtatt editor-passord/aal1-sesjon):** Live event_submissions-policyer krever admin/moderator, men **ikke has_current_editor_mfa**. Lokal ai-event-assist og trigger-site-rebuild kontrollerer også rolle uten aktuell MFA. UI krever MFA, men en gyldig editor-sesjon som ikke har gjennomført aktuell MFA kan etter de kontrollerte policyene gjøre direkte API-operasjoner. Det gir ikke vanlige brukere editorrettigheter, men serveren håndhever ikke UI-ens step-up-grense. Ikke utnyttet mot produksjon. Anbefaling: separat godkjent serverhåndheving med sesjons- og MFA-regresjonstester på alle editorveier. Ingen endring i denne oppgaven.

### Syv INFO – ingen RLS-policy

Fravær av policy betyr normalt deny-by-default, ikke offentlig eksponering. Alle syv har RLS aktiv, FORCE RLS av og betrodd servertilgang.

| Tabell | Kontrollert formål / publikumstilgang | Risiko / anbefaling |
|---|---|---|
| editor_mfa_email_codes | Bruker/sesjon, HMAC, forsøk/utløp; ingen anon/authenticated tabellgrant. Avgrensede definerfunksjoner. | **Low / tilsiktet server-only.** Ikke legg til offentlig policy. Hold pepper og råkode hemmelig. |
| editor_mfa_verifications | Sesjonsbundet MFA, utløp/revokering; ingen publikumsgrant. has_current_editor_mfa leser. | **Low / tilsiktet server-only.** Test sesjonsbinding og rolleendringsgulv; behold lukket tabell. |
| editor_privilege_state | Siste rolleendring, trigger/hjelper; ingen publikumsgrant. | **Low / tilsiktet server-only.** Trigger må fortsatt virke, aldri klientstyrt. |
| trusted_devices | Tokenhash, bruker, levetid/revokering; ingen publikumsgrant. Ingen aktiv klient-/Edge-implementering funnet. | **Low / tilsiktet server-only.** Ikke anta at kommentaren beviser en ferdig trusted-device-flyt; gjennomgå faktisk aktivering før bruk. |
| site_rebuild_state | Durabel kø, feil/lås/status; brede anon/authenticated ACL, ingen policy. trigger-site-rebuild bruker server. | **Low minste-privilegiumsavvik.** Ordinær radtilgang blokkert, men TRUNCATE/grunnprivilegier unødvendige; foreslå revokering separat. MFA-gapet for funksjonen omtalt over. |
| weather_refresh_ticket | Internt engangstoken/tid, cron/refresh-weather; brede publikums-ACL, ingen policy. | **Low grunnprivilegier, potensielt sensitivt token.** Ikke lest tokenverdier. RLS nekter SELECT; foreslå alle publikumsgrants fjernet separat, behold server/jobben. |
| webcam6_state | Internt refresh-token, kildebaner, publiseringsbane og filtre/driftsdata; brede publikums-ACL, ingen policy. | **Low grunnprivilegier.** RLS nekter ordinær tilgang; offentlig kamera får bare bildet via webcam6-image. Foreslå publikumsgrants fjernet separat, uten å endre linsefilter, refresh eller bilde-endepunkt. |

For de tre med brede ACL er ingen offentlig TRUNCATE-vei funnet og ingen destruktiv produksjonstest gjort. Ikke kall dem direkte offentlig lesbare fordi GRANT finnes: RLS nekter rader.

## Utvidet skanning, ferdig 24.11.2026

Den raske skanningen fant fortsatt de tre opprinnelige aktive funnene; dette er forventet siden produksjon ikke er migrert. Dyp skanning rapporterte to WARN:

1. Innloggede kan undersøke andre brukeres roller via has_role, i samsvar med analysen over. Funksjonsresultatet er boolsk; ingen rolleeskalering dokumentert.
2. Tidligere utstedte bildelenker til arrangementer kan fortsatt virke inntil én time etter avpublisering, fordi list-approved-events bruker signerte lenker med 3600 sekunders levetid. **Low for vanlig offentlig arrangementsfoto, Medium ved behov for rask tilbakekalling av sensitivt/feilpublisert bilde.** Anbefal separat vurdering av kortere levetid eller en kontrollert bildeproxy som revaliderer status; også hurtigbuffer og allerede nedlastede kopier må tas i betraktning. Ingen automatisk løsning eller endring utført.

Avhengighetsskanningen i resultatet var fra 13.11 og markert utdatert; dette er ikke en aktuell full sikkerhetsgodkjenning av dependencies. Ingen funn er skjult.

## Rollback og produksjonsrekkefølge

1. Godkjenn testresultatene og avklar om utestede ende-til-ende-kontroller kreves først. Ingen frontend-/funksjonsdeploy trengs for disse tre tabellendringene.
2. Før produksjonsanvendelse: les policyer, grants/kolonnegrants og seo_meta-kommentar igjen. Sammenlign med dokumentert baseline; avbryt ved drift. Up-filen har en snevrere automatisk policykontroll, ikke en erstatning for full ACL-baselinekontroll.
3. Etter godkjenning: send up-filens **identiske SQL** til migrasjonsverktøyet. Ikke kjør den med produksjons-psql. Atomisk transaksjon og lock_timeout skal unngå halv endring/lang låsing.
4. Verifiser live ACL/RLS, anonym get-weather og SEO/tjenestelesing, betrodd automatisk neste værrefresh, og aktuelle editor-/adminflyter. Ikke utløs kunstig Google-refresh eller publiser testinnhold.
5. Hvis nødvendig: send down-filens identiske SQL som en ny migrasjon etter kontroll for senere endringer. Den gjenåpner tidligere direkte værlesing og inaktive tjenester samt brede ACL-er: det er en bevisst tilbakeføring til tidligere risiko, ikke en anbefalt permanent løsning.
6. Skann igjen. Bare faktisk løste produksjonsfunn kan markeres løst. seo_meta dokumenteres som tilsiktet offentlig, uten å skjule varsel kun for score.

**Anbefaling:** SQL-endringene er klare for gjennomgang og har bestått ekte isolerte RLS-/rollbacktester. Full produksjonsberedskap er **betinget**, ikke ubetinget godkjent: en isolert deployet vær-/auth-/publiseringsrunde og ferdig produksjons-HTML er ikke verifisert. Det separate MFA-servergapet bør prioriteres med egen godkjenning. Stoppunktet er nå din godkjenning; ingen produksjonssetting skjer i denne oppgaven.