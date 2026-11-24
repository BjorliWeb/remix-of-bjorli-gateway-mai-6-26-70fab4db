# Fase 4 – MFA og privilegert tilgang – 24.11.2026

**Status: NO-GO for produksjon inntil du godkjenner. Alt er klart og testet i isolert miljø.**
Eneste produksjonsendring: sikring av testkontoen (godkjent i Fase 4 §1). Ingen RLS, MFA-oppsett, serverfunksjoner eller publisering er endret i produksjon.

## 1. Testkontoen r06b-admin-…@example.com
| Kontroll | Funn |
|---|---|
| Opprinnelse | Opprettet av assistenten 07.07.2026 for en sikkerhetstest av Storage (chathistorikken viser opprettelsen). `example.com` kan ikke motta e-post. |
| Bruk | Kun innlogget ved opprettelse. Ingen MFA-faktor, 0 vurderte innsendinger, ikke referert i kode eller jobber. Ikke en systemprosess. |
| Legitim admin finnes | Ja: marc…@barman.net (admin, verifisert TOTP, sist innlogget 24.11). |
| Utført | Adminrollen fjernet (1 rad). Kontoen sperret via backendens brukeradministrasjon (sperret til 2126). Ikke slettet; historikk beholdt. |
| Verifisert etterpå | 0 roller på kontoen, `banned_until` satt. Sperringen hindrer ny innlogging og fornyelse av økten. Gammel økt (juli) har ingen gyldige tilgangstokener og gir uansett ingen rolle. Ikke testet ved faktisk innloggingsforsøk (passord ikke lagret). |
| Angre | Opphev sperring og legg rollen tilbake fra backend (frarådes). |

**Merk:** Det finnes nå bare **én** administrator. Se §7.

## 2. Implementerte endringer (alle utenfor automatisk deploy)
| Fil | Innhold |
|---|---|
| `docs/security/pending/20261124_editor_mfa_up.sql` | Ny `public.is_editor(_role)` = rolle via `has_role` **og** `has_current_editor_mfa()`; SECURITY DEFINER, `search_path ''`, EXECUTE kun authenticated + service_role. Alle 19 rollepolicyer (16 tabell + 3 Storage) byttet til `(SELECT public.is_editor(...))`. Ny policy «MFA admins can read all roles». Trigger som hindrer fjerning av siste admin (DELETE, UPDATE av rolle/bruker, kaskade fra sletting av bruker; serialisert med transaksjonslås). Stopper hvis policysettet i produksjon har endret seg (forventer 19). |
| `docs/security/pending/20261124_editor_mfa_down.sql` | Full rollback til nøyaktig dagens uttrykk. |
| `docs/security/pending/20261124_editor_mfa_edge.patch` | `ai-event-assist` og `trigger-site-rebuild`: etter rollesjekk kalles `has_current_editor_mfa` med brukerens egen JWT; ellers HTTP 403 `{"error":"mfa_required"}` før KI-kall eller kø. Holdt utenfor `supabase/functions/` for å unngå automatisk deploy. Patchen er sjekket mot dagens filer. |
| `docs/security/pending/20261124_public_access_up.sql` | Migrasjon 2 justert: «Admins can read all services» bruker nå `is_editor` i stedet for `has_role`, så den ikke gjeninnfører en policy uten MFA. Må kjøres **etter** MFA-migrasjonen. |
| `src/lib/auth/mfa.ts` (+ test) | `isMfaRequiredError()` og felles melding. |
| `src/pages/AdminEventSubmissions.tsx` | KI-assistent: ved `mfa_required` vises «Ny to-trinns innlogging kreves»; ingenting endres. |
| `src/components/admin/EventSubmissionEditForm.tsx` | Avvist lagring + utløpt MFA gir egen melding; skjemaet beholder teksten (lagres ikke som «ren»). Ombygging avvist pga. MFA gir egen melding. |
| `scripts/security/test_editor_mfa.py`, `editor_mfa_fixture.sql` | Ny harness. `test_has_role.py` og `public_access_fixture.sql` fikk en stedfortreder for `is_editor` (bare rolledelen) fordi migrasjon 2 nå bruker den. |

Uendret med vilje: «Users can read own roles» (innlogging før MFA), `has_current_editor_mfa`, MFA-oppsett, 30 dager, offentlig opplasting, service_role.

## 3. Sikkerhetsstatus
| | Før | Etter (i harness) |
|---|---|---|
| Admin uten MFA leser innsendinger/kontakt | Ja | Nei |
| Admin uten MFA gir adminrolle | Ja | Nei |
| Redaktør uten MFA endrer/publiserer/sletter | Ja | Nei |
| Private bilder uten MFA | Ja | Nei |
| KI/ombygging uten MFA | Ja | Nei (patch, ikke kjørt mot ekte funksjon) |
| Admin fjerner andres rolle | Umulig (så ikke radene) | Mulig med MFA |
| Fjerne siste admin | Mulig | Avvist |
| Gammel testadmin i produksjon | Ja | **Fjernet (produksjon)** |

## 4. Faktiske testresultater
- `test_editor_mfa.py`: **OK**. Bruker × tilstand × 19 operasjoner før, etter og etter rollback. Tilstander: ingen MFA, gyldig TOTP, TOTP > 30 d, amr som strengliste, manipulert amr-type, manglende sesjonsfelt, e-postverifisering egen/annen/ugyldig sesjon, tilbakekalt, MFA før rolleendring, ny tildeling, fjernet rolle, anon, uten JWT, service_role, offentlig opplasting, rettigheter på funksjoner, én evaluering per spørring (InitPlan), siste admin via DELETE/UPDATE/flytting og **to samtidige transaksjoner** (nøyaktig én lyktes).
- `test_has_role.py`: OK. `test_public_access.py`: OK.
- Vitest: **253 bestått, 3 hoppet over**. Produksjonsbygg: OK, alle indekserbare sider prerendret, 562 sitemap-URL-er i orden.

**Ikke testet:** ekte Edge-funksjoner med patch (ikke deployet; Deno-typesjekk krasjet i sandkassen), RLS i produksjon, ekte innlogging med TOTP i nettleser, klientmeldingene i nettleser, kaskade fra faktisk sletting av Auth-bruker (bare simulert via trigger-logikk), passordbytte og gjenoppretting i praksis.

## 5. MFA-gyldighet og økter (vurdering fra kode og harness)
- **30 dager:** målt fra TOTP-tidspunktet i den signerte JWT-en, og aldri tidligere enn siste rolleendring. Bekreftet i harness.
- **Bundet til økt:** TOTP-tidspunktet ligger i den enkelte øktens JWT. En ny innlogging starter uten TOTP. E-postverifisering er bundet til `session_id` (testet). En tidligere verifisering gir **ikke** tilgang til en ny økt.
- **Tokenfornyelse:** beholder opprinnelig TOTP-tidspunkt, så 30-dagersgrensen forlenges ikke.
- **Rolleendringer:** ugyldiggjør tidligere MFA for den berørte brukeren (testet).
- **Utlogging/tilbakekalling:** stopper fornyelse; et utstedt tilgangstoken lever til det utløper (normalt ≤ 1 t).
- **Passordbytte/kontogjenoppretting:** andre åpne økter logges ikke automatisk ut, og en kapret økt med TOTP beholder tilgang i opptil 30 dager. Ved mistanke: sperr kontoen eller logg ut alle økter.
- **E-post-MFA:** finnes i databasen, men ikke i appen.
- **Anbefaling:** Behold 30 dager for vanlig redaktørarbeid. For tildeling og fjerning av roller anbefales ferskere MFA (f.eks. ≤ 12 timer), gjennom en egen `is_editor_fresh`-variant i de to rollepolicyene. Dette er ikke implementert og krever din godkjenning.

## 6. Tilbakekalling av roller
Med migrasjonen kan en admin med gyldig MFA se alle roller og fjerne dem gjennom den eksisterende regelen. Redaktører og vanlige brukere kan det ikke. Endringen gjelder fra neste forespørsel, og ny tildeling krever ny MFA. Admininnsyn er begrenset til rolletabellen (bruker-ID og rolle), ikke e-post eller personopplysninger. Ingen ny admin-side er laget.

**Slik gjør eier det i dag:** be assistenten fjerne rollen, eller åpne backend → Brukere og sperr eller slett kontoen der. Sperring stopper nye innlogginger og fornyelse av økter.

## 7. Gjenoppretting
- **Admin mister TOTP-enheten:** MFA-faktoren kan fjernes fra backend (brukeradministrasjon på serversiden, utført av assistenten etter eiers bekreftelse). Deretter registreres ny TOTP ved neste innlogging.
- **Risiko:** det finnes nå bare én admin. Anbefaler en andre betrodd adminkonto med TOTP før produksjonssetting. Vernet mot å fjerne siste admin krever at ny admin legges til før den gamle fjernes.

## 8. Ytelse og kostnad
`is_editor` evalueres én gang per spørring (InitPlan, verifisert), ikke per rad. To små oppslag med primærnøkkel/indeks. Ett ekstra RPC-kall per KI- eller ombyggingskall. Offentlige sider, vær, webkamera og Fnugg får ingen nye kall. Ingen polling eller bakgrunnsjobber. Ikke målt i produksjon.

## 9. Rollback per endring
1. MFA-migrasjon → kjør `*_editor_mfa_down.sql` gjennom migrasjonsverktøyet. Ingen data går tapt.
2. Edge-patch → reverser patchen og deploy.
3. Klientmeldinger → git restore av de tre filene. De er harmløse også uten serverendringen.
4. Testkonto → opphev sperringen og legg tilbake rollen (frarådes).

## 10. Anbefalt rekkefølge for produksjonssetting
0. Legg til en andre betrodd admin med TOTP (anbefalt).
1. Eier logger inn med TOTP og bekrefter at /admin/innsendinger fungerer i dag.
2. Kjør MFA-migrasjonen (identisk SQL fra pending, uten BEGIN/COMMIT).
3. Røyktest straks: logg inn med TOTP, åpne innsendinger, lagre et testarrangement, se et bilde og sjekk at offentlig innsending fortsatt virker. Hvis noe feiler: rollback 1.
4. Bruk Edge-patchen og deploy de to funksjonene, og test KI og ombygging.
5. Migrasjon 2 (public access). Bildepatchen holdes fortsatt på vent.

**GO/NO-GO:** Teknisk **GO** for trinn 2–4 når du godkjenner. Produksjonssetting er **NO-GO** til da.
