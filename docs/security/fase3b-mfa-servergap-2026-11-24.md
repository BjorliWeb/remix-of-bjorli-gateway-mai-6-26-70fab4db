# Fase 3B – MFA-servergap og tilbakekalling av roller – 24.11.2026

Kun analyse. Ingen endring i produksjonsdatabase, MFA-oppsett, roller, RLS, serverfunksjoner eller publisering. Migrasjon 1 (has_role) beholdes. Migrasjon 2 og bildepatchen er fortsatt satt på vent.

Bevisgrunnlag: live policyer (bare lesing), koden, produksjonstest kun med lesing (fase 3, testadmin) og isolert PostgreSQL-harness (`scripts/security/test_has_role.py`, kjørt på nytt 10:47 UTC: OK). I harnessen har admin-/moderatorøktene ingen MFA i JWT. Likevel lykkes alle lese- og skriveoperasjoner nedenfor.

## 1. Hvor MFA håndheves i dag

| Lag | Rolle sjekket | MFA sjekket |
|---|---|---|
| UI: AdminLogin, AdminMfa, sideporten i AdminEventSubmissions | ja (`user_roles`, egne rader) | **ja** – `has_current_editor_mfa()` |
| RLS (19 policyer + 3 Storage-policyer) via `has_role` | ja | **nei** |
| Edge: `ai-event-assist`, `trigger-site-rebuild` (getClaims + service-oppslag i user_roles) | ja | **nei** |
| `has_current_editor_mfa()` | – | Signert JWT `amr` totp-tidspunkt > max(30 dager, siste rolleendring), eller sesjonsbundet `editor_mfa_verifications` (session_id fra JWT, ikke revokert, ikke utløpt) |
| `verify_editor_email_code` / `issue_editor_email_code_for_delivery` | issue: ja | e-poststeget er ikke koblet til UI. Bare TOTP er i bruk |

Rotårsak: MFA ble bygget som en grense i klienten. Serverreglene bruker bare `has_role`, så en gyldig passordøkt (aal1) med rolle får samme tilgang som en MFA-verifisert økt. Funksjonen som skal kontrollere dette (`has_current_editor_mfa`) finnes og er klientsikker (bruker signert JWT og server-tabeller), men brukes ikke av serveren.

## 2. Hva som er tilgjengelig før MFA (forutsetter at passord og rolle er kjent)

| Funksjon | Tilgang før MFA | Status | Risiko |
|---|---|---|---|
| event_submissions (innsendinger, inkl. navn/e-post/telefon) les | admin + moderator | **Bekreftet i produksjon** (lesing) og i harness | Høy (personopplysninger) |
| event_submissions endre/slette = **publisere, avpublisere og endre arrangementer** | admin + moderator | **Bekreftet i harness**. Ikke prøvd i produksjon (destruktivt) | Høy |
| contact_messages les | admin | **Bekreftet i produksjon** og i harness | Høy (personopplysninger) |
| Private bilder (event-submissions-bøtta) les/last opp/slett | admin + moderator | Lesing/listing **bekreftet i produksjon**. Skriving bekreftet i harness | Middels–høy |
| user_roles INSERT (gi roller, også admin) | admin | **Bekreftet i harness** | **Høy – kan gi en annen konto adminrettigheter** |
| user_roles DELETE av andres rolle | admin | Treffer 0 rader (se §4) | – |
| alerts, operational_status (driftsstatus) endre | admin | Bekreftet i harness | Middels (offentlig feilinformasjon) |
| seo_meta, services endre (CMS-metadata) | admin | Bekreftet i harness | Lav–middels |
| trigger-site-rebuild | admin + moderator | Fra koden (rollesjekk, ingen MFA). Ikke kjørt | Lav (bare ombygging, kø med 60 s grense) |
| ai-event-assist | admin + moderator | Fra koden. Ikke kjørt | Middels (KI-kostnad, endrer tekst via service-klient) |
| Brukeradministrasjon (Auth-brukere) | ingen app-funksjon | Ingen eksponering funnet | – |
| reset-password | bare gjenopprettingsøkt, endrer kun eget passord | Neste innlogging krever fortsatt MFA | Lav |
| RPC: has_role (bare egen), has_current_editor_mfa, verify_editor_email_code | ingen omgåelse | – | Lav |
| Offentlige funksjoner (submit-*, get-weather, list-approved-events, webcam6-*) | gir ikke redaktørdata | – | – |

Hypotetisk, ikke bekreftet: misbruk krever stjålet passord eller en kapret aal1-økt for en redaktør. Vanlige brukere og anonyme får ikke tilgang.

Tilleggsfunn: `r06b-admin-…@example.com` er en **testkonto med adminrolle i produksjon**. Sammen med gapet over er den en reell inngang. Anbefaler at eier fjerner adminrollen eller sperrer kontoen (krever din godkjenning).

## 3. Anbefalt minimal løsning (gjenbruker dagens MFA)

En hjelpefunksjon og identiske policyer der bare MFA-kravet er lagt til:

```sql
-- SECURITY DEFINER, search_path '', EXECUTE kun authenticated/service_role
public.is_editor(_role app_role) = public.has_role(auth.uid(), _role) AND public.has_current_editor_mfa()
```
- Alle 19 policyer og de 3 redaktørpolicyene i Storage: `has_role(auth.uid(), X)` → `(select public.is_editor(X))`. Effekt: hvert kall evalueres én gang per spørring, ikke per rad.
- **Unntak (må være tilgjengelig før MFA):** `user_roles` «Users can read own roles». Ingen policy krever MFA for egne roller, så innloggingsflyten får ikke en sirkulær avhengighet. `has_current_editor_mfa` leser server-tabeller direkte og bruker ikke RLS, så det blir ingen rekursjon.
- Offentlig opplasting til declared paths, offentlig lesing og service_role påvirkes ikke.
- Edge: i `ai-event-assist` og `trigger-site-rebuild` legges det til ett RPC-kall `has_current_editor_mfa` med brukerens egen JWT etter rollesjekken (403 `mfa_required`).
- Klient: ingen endring er nødvendig. Klienten krever allerede MFA før redaktørsiden.

Filer som berøres (når det er godkjent): ny migrasjon (+ rollback-fil under `docs/security/pending/`), `supabase/functions/ai-event-assist/index.ts`, `supabase/functions/trigger-site-rebuild/index.ts`, utvidet harness `scripts/security/test_editor_mfa.py`.

Risiko for innlogging: lav. Innloggingen bruker bare egne roller og MFA-RPC-er, og det endres ikke. Kjent konsekvens: en økt som har bestått MFA for mer enn 30 dager siden, eller før en rolleendring, mister skrivetilgang til den logger inn med MFA på nytt. UI-et ber allerede om ny MFA i det tilfellet. Hvis en admin mister TOTP-enheten, gjenopprettes tilgangen fortsatt fra backend.

## 4. Tilbakekalling av roller

- **I dag:** «Only admins can delete roles» finnes, men admin kan bare *se* egne rader i user_roles. Derfor treffer DELETE 0 rader for andre brukere. Det finnes heller ingen side for rolleadministrasjon. Tilbakekalling kan bare gjøres fra backend (databasen eller brukerlisten i Lovable Cloud).
- **Effekt:** umiddelbar. Rollene står ikke i JWT. has_role og Edge-funksjonene leser user_roles live, så neste forespørsel nektes selv om økten fortsatt er gyldig.
- **MFA etter fjerning:** gir ikke tilgang. Rolle kreves alltid, og rolleendringer oppdaterer `editor_privilege_state`, slik at tidligere MFA blir ugyldig.
- **Kompromittert konto:** fjern rollene (stopper privilegier umiddelbart) og sperr brukeren eller logg ut alle økter i Lovable Cloud → Brukere (stopper fornyelse av økten). Et utstedt tilgangstoken kan leve til det utløper (vanligvis ≤ 1 t), men har da ingen rolle.
- **Enkleste sikre forbedring (valgfri):** SELECT-policy «Admins (med MFA) kan lese alle roller» via `is_editor('admin')`, slik at eksisterende DELETE fungerer, og en trigger BEFORE DELETE/UPDATE på user_roles som avviser fjerning av siste admin. Ingen ny UI er nødvendig nå.

## 5. Testplan (isolert harness først, deretter manuelt i produksjon)
MFA, per tabell eller funksjon, for anon, bruker, moderator og admin × {uten MFA, TOTP fersk, TOTP > 30 d, TOTP før rolleendring, e-postverifisering i annen sesjon, revokert}:
- Før MFA: egne roller lesbare. Innsendinger, kontakt, bilder, roller, varsler, driftsstatus, SEO og tjenester nektes. Edge gir 403.
- Etter MFA: dagens tilgang er identisk (samme resultater som harness-baseline).
- Offentlig: innsending, opplasting til declared path, arrangementsfeed, vær og webkamera er uendret.
- Manuelt (eier): admin- og redaktørinnlogging → MFA → /admin/innsendinger: godkjenn, avpubliser og publiser på nytt et testarrangement, last opp bilde, KI-assistent, ombygging.

Tilbakekalling: admin med MFA fjerner moderatorrollen → moderatorens neste forespørsel nektes. Moderatoren kan ikke fjerne roller. Fjerning av siste admin avvises. Roller gitt på nytt krever ny MFA.

## 6. Rollback
Gjenopprett policyene til nøyaktig dagens uttrykk (`has_role(auth.uid(), …)`), slett `is_editor` og sett inn de to Edge-filene på nytt (git restore + deploy). Valgfri rolle-endring: slett ny policy og trigger. Ingen dataendringer, så rollbacken taper ingen data.

## 7. Ytelse og API-forbruk
Ett ekstra raskt oppslag per spørring (initplan) mot små tabeller med indeks på user_id. Ett ekstra RPC-kall per redaktørkall til KI-assistenten eller ombyggingen. Offentlige sider og vær-, webkamera- og Fnugg-kall påvirkes ikke.

## 8. Prioritet og rekkefølge
1. **Høy, straks (kun drift):** fjern adminrollen fra testkontoen r06b-admin… eller sperr den.
2. **Høy:** MFA-håndheving i RLS, Storage og de to Edge-funksjonene (§3).
3. Middels: admin-lesing av roller og vern av siste admin (§4).
4. Deretter: migrasjon 2 (etter din bekreftelse av manuell innlogging). Bildeløsningen beholdes på vent.
