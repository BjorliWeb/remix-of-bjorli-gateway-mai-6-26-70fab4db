# Fase 2 – samlet sikkerhetsutbedring (isolert miljø) – 24.11.2026

Status: implementert og testet i isolert miljø. **Ingenting er kjørt mot produksjonsdatabasen, ingen funksjon er deployet, nettstedet er ikke publisert.** Anbefaling: **GO** for produksjonssetting etter din godkjenning (se rekkefølge).

## 1. Endringer (alle klargjort, ikke aktivert)

| # | Funn | Fil | Endring |
|---|------|-----|---------|
| 1 | has_role kan brukes til å undersøke andre | `docs/security/pending/20261124_has_role_self_only_up.sql` / `_down.sql` | Samme signatur, eier, rettigheter og oppslag. Svar `true` bare når `_user_id = auth.uid()` eller kallet har JWT-rolle `service_role`. |
| 2 | Bildelenker etter avpublisering | `docs/security/pending/20261124_event_image_ttl.patch` | `createSignedUrls(paths, 3600)` → `600` i `list-approved-events`. Redaktørlenker (60 min) uendret. |
| 3–6 | weather_snapshot, services, seo_meta, grunnprivilegier | `docs/security/pending/20261124_public_access_up.sql` / `_down.sql` (fra forrige runde, uendret) | Fjerner direkte offentlig lesing av weather_snapshot; services filtreres på `is_active`, admin leser alle; seo_meta beholder offentlig lesing + kommentar «Intended Public Access»; fjerner DELETE/TRUNCATE/REFERENCES/TRIGGER/MAINTAIN fra anon/authenticated på de tre tabellene. |

Bildepatchen er bevisst **ikke** lagt i selve funksjonsfilen: endringer i serverfunksjoner kan bli deployet automatisk, og du har forbudt deploy. Patchen er generert fra gjeldende fil og endrer én linje.

Nye testfiler: `scripts/security/has_role_fixture.sql`, `scripts/security/test_has_role.py`.

## 2. Særskilt kontroll av `auth.jwt() IS NULL`

- **Ingen legitim bruker trenger det.** Alle 25 kall i de 19 policyene sender `auth.uid()` (kontrollert live, kun lesing). Eneste kall med fremmed ID er `issue_editor_email_code_for_delivery`, som bare kan kjøres av `service_role` (authenticated har ikke EXECUTE) og som i dag ikke kalles fra noen serverfunksjon i koden. Planlagte jobber (pg_cron) kunne ikke leses (ingen rettighet); ingen migrasjon planlegger jobber som bruker has_role.
- **Kunne vært en omgåelse:** en `authenticated`-økt uten claims ville blitt behandlet som betrodd. Testet: uten unntaket gir dette `false`.
- **Fjernet.** Økter uten JWT behandles ikke som betrodde. Konsekvens: direkte databaseøkter (f.eks. migrasjoner) får bare `false` for andres roller – ingen kjent bruk.
- **EXECUTE (live):** postgres, service_role, authenticated. Ikke PUBLIC, ikke anon (bekreftet med `has_function_privilege`). Uendret.
- **service_role-unntaket** dekker legitime serverprosesser (serverfunksjoner som kaller via service-nøkkelen bærer `role=service_role` i JWT). Serverfunksjonene i dag leser `user_roles` direkte og påvirkes ikke.
- **search_path:** `public`, alle objekter i funksjonen er schema-kvalifisert (`public.user_roles`, `auth.uid()`, `auth.jwt()`). NULL-resultat er eksplisitt gjort til `false`.

## 3. Faktiske testresultater

| Test | Resultat |
|------|----------|
| `test_has_role.py` (isolert PostgreSQL 17): 19 policyer × bruker/moderator/admin/uten-JWT, før endring, etter endring og etter rollback | **Bestått** – autorisert oppførsel identisk før/etter |
| Rolleoppslag etter endring: bruker→admin `f`, bruker→moderator `f`, moderator→admin `f`, admin→moderator `f`, egen rolle `t`, uten JWT `f`, server `t`, anon nektes | **Bestått** |
| Ingen roller endret (2 rader før/etter) | **Bestått** |
| Kombinert med public-access-migrasjonen: admin ser inaktive tjenester, bruker/moderator ikke | **Bestått** |
| Rollback gjenoppretter gammel funksjon | **Bestått** |
| `test_public_access.py` (12 grupper: weather/services/seo_meta lese/skrive/slette/TRUNCATE/privilegier/rollback) | **Bestått** |
| Vitest (admin-innlogging, MFA, innsendinger, arrangementer, prerender, seks språk m.m.) | **Bestått** 250, 3 hoppet over (samme som før) |
| Bildepatch: genereres fra gjeldende fil, eksakt ett treff | Kontrollert |

### Ikke testet (krever produksjon/deploy eller ekte økter)
- Ekte innlogging/MFA mot backend etter migrasjon, `/admin/innsendinger` og rolleadministrasjon i nettleser med ekte konto.
- Ekte Storage-API (policyene er testet med en speilet tabell, ikke Storage-tjenesten).
- 600 s-levetid i deployet funksjon, utløp i ekte nettleser, side åpen >10 min, avpublisering/republisering live.
- Cloudflare-cache, ferdig produksjonsbygg/HTML, sikkerhetsskanning etter endring (skanneren leser produksjon, som er uendret).
- Vær, webkamera, Fnugg, heiskort/Skiperformance, SEO/sitemap: ingen kode i disse er endret; dekket kun av eksisterende Vitest.

## 4. Gjenværende eksponering for arrangementsbilder (beregnet, ikke målt)

- **Nye lenker:** utstedes ikke for avpubliserte arrangementer – spørringen henter bare `approved`.
- **Bufrede svar** (funksjon 60 s, CDN `s-maxage=60`, nettleser `max-age=30`, app 60 s) kan i inntil ~3,5 min fortsatt vise arrangementet med *allerede utstedte* lenker; ingen nye lenker lages.
- **Signert lenke:** gyldig i 10 min fra utstedelse (før: 60 min). Verste tilfelle etter avpublisering: ~10 min (før: ~60 min).
- **Allerede nedlastede bilder** kan ligge i besøkendes nettleserbuffer; det kan ikke trekkes tilbake. Lagringstjenestens egen CDN-bufring av signerte lenker er ikke verifisert.
- **Utløpte lenker:** Appen henter arrangementslisten på nytt ved navigering etter 60 s, så nye sidevisninger får ferske lenker uten ekstra kall. Det finnes ingen bildefallback ved lastefeil: på en side åpen >10 min kan et ikke-lastet (lazy) bilde vises som brutt til siden lastes på nytt. Ikke utbedret (ville vært en ny funksjon/designendring).
- Statisk HTML/prerender/sitemap inneholder aldri signerte lenker.

## 5. Ytelse og kostnad (estimat)
- has_role: to billige sammenligninger i samme spørring; ingen nye spørringer.
- Bildelenker: lages bare ved bufferbom (uendret frekvens); levetid påvirker ikke antall Storage-kall eller cache.
- weather_snapshot: get-weather og planlagt oppdatering bruker serverrettigheter; ingen endring i Google Weather-kall.

## 6. Rollback per endring
1. has_role: kjør `20261124_has_role_self_only_down.sql` via migrasjon.
2. Bildelenker: sett 600 → 3600 og redeploy funksjonen.
3–6. `20261124_public_access_down.sql`.

## 7. Anbefalt rekkefølge for produksjonssetting
1. has_role-migrasjon (identisk SQL via migrasjonsverktøyet) → kontroller admin- og redaktørinnlogging, `/admin/innsendinger`.
2. public-access-migrasjon → kontroller værsiden og get-weather.
3. Bildepatch i funksjonen + deploy → kontroller arrangementsliste og -detalj.
4. Ny sikkerhetsskanning. Forventet: has_role, weather_snapshot og services løst; bildefunnet kan fortsatt flagges (levetid redusert, ikke null); seo_meta forblir Info (tilsiktet).

## 8. Uavklarte funn (ikke rettet, utenfor omfang)
- Administratorer kan ikke fjerne *andres* roller via appen: `user_roles` kan bare leses for egne rader, så DELETE-policyen treffer 0 rader (eksisterende oppførsel, oppdaget i testen).
- Øvrige SECURITY DEFINER-varsler fra linteren og MFA-servergapet: se `public-access-verification-2026-11-24.md`; krever egen godkjenning.
