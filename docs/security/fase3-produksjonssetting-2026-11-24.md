# Fase 3 – kontrollert produksjonssetting – 24.11.2026 (delrapport, STOPPET før migrasjon 2)

## Forhåndskontroller (10:36–10:38 UTC)
| Kontroll | Resultat |
|---|---|
| Live has_role identisk med rollback-fil (`_has_role_self_only_down.sql`) | Ja (samme kropp) |
| Policygrunnlag weather_snapshot/services/seo_meta = 7 policyer som forventet | Ja – rollback-filer samsvarer |
| Policyer som kaller has_role med fremmed ID | 0 |
| EXECUTE has_role: anon nei, authenticated ja, service_role ja | Bekreftet |
| Vitest | 250 bestått, 3 hoppet over |
| Produksjonsbygg + prerender | OK, 328 HTML-filer, 281 sitemap-URL-er, full dekning; canonical og hreflang (7 per side) kontrollert på NO/EN/DE |
| Andre pågående kodeendringer | Ingen overskrevet |
| MFA-servergap vs. migrasjonen | Påvirkes ikke: has_role-endringen rører ikke MFA eller innlogging. Gapet er uendret (finnes fortsatt). |

## Migrasjon 1: has_role – AKTIVERT
- Tidspunkt: 2026-11-24 ca. 10:38 UTC. Fil: `drizzle/migrations/0002_has_role_self_only.sql`.
- Identisk SQL med `pending/20261124_has_role_self_only_up.sql`, unntatt `BEGIN;`/`COMMIT;` (migrasjonsverktøyet styrer transaksjonen selv og avviser dem).
- Funksjonens fingeravtrykk endret (187a79… → b88c93…); EXECUTE uendret (anon nei).

### Faktiske produksjonstester etter migrasjonen (eksisterende testadmin r06b-admin…@example.com, ekte API)
| Test | Resultat |
|---|---|
| has_role egen admin-rolle | true |
| has_role annen brukers moderatorrolle | false (riktig) |
| anon kaller has_role | nektet (401) |
| Admin leser event_submissions, contact_messages, egne roller | OK |
| Storage event-submissions: admin lister / anon | OK / tom (riktig) |
| /admin/innsendinger i nettleser | Rollesjekk bestått; stoppet ved MFA-steget |
| Offentlig: get-weather, list-approved-events, webcam6-image | 200 |

### Ikke verifisert – årsak til STOPP
- **Ekte admin-/redaktørinnlogging med MFA**: Innloggingstjenesten avviser MFA-oppsett for testøkten fra sandkassen («A valid session … required»). Dette er en begrensning ved testøkten, ikke has_role (innloggingstjenesten bruker ikke has_role). Må testes manuelt av eier.
- Redaktør (moderator)-konto: ingen autorisert testkonto; ikke testet.
- Brukeradministrasjon i UI, autoriserte serverfunksjoner som trigger-site-rebuild/ai-event-assist (ikke kjørt for å unngå deploy/AI-kostnad).
- Ingen regresjon bekreftet → ingen rollback.

## Migrasjon 2: public-access – IKKE kjørt
Holdes tilbake til eier har bekreftet innlogging + MFA.

## Funn bekreftet live
- MFA-servergapet er reelt: testadmin uten gjennomført MFA (`has_current_editor_mfa` = false) kunne lese innsendinger og kontaktmeldinger direkte via API.

## Punkt 4–8
Ikke påbegynt (avhenger av stoppunktet). Rollback for migrasjon 1: `pending/20261124_has_role_self_only_down.sql` uten BEGIN/COMMIT via migrasjonsverktøyet.
