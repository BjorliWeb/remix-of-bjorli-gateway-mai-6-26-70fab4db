# Fase 6 – sikkerhetsstatus i produksjon (25.11.2026)

Statusnivåer: **Implementert** (kode skrevet) → **Deployet** (aktiv i produksjon) → **Testet** (automatisk/isolert eller uinnlogget mot produksjon) → **Verifisert** (bekreftet med ekte innlogget økt).

## 1. Produksjonsstatus

| Tiltak | Status | Bevis |
|---|---|---|
| has_role kun egen rolle | Verifisert | Migrasjon 0002 (fase 3); REST-test egen=true/annen=false; eier logget inn |
| MFA i alle 16 tabellpolicyer | Deployet, testet, verifisert for admin m/ MFA | 0 policyer bruker has_role direkte, 20 bruker is_editor (19 + «MFA admins can read all roles») + 1 ny i 0004 |
| MFA i 3 Storage-policyer | Deployet, testet | Inngår i tallet over; bildevisning i Innsendinger bekreftet av eier |
| MFA i ai-event-assist | Deployet, testet uinnlogget | Commit a3e0537; avvisning *uten MFA* ikke testet med ekte økt |
| MFA i trigger-site-rebuild | Deployet, testet uinnlogget | Som over |
| Autorisert tilbakekalling av roller | Deployet, testet isolert | MFA-admin kan lese/slette alle roller; ikke testet i UI |
| Beskyttelse mot fjerning av siste admin | Deployet, testet i produksjon (rullet tilbake) + harness | Trigger `user_roles_keep_last_admin` finnes |
| Sperring av gammel testadmin | Deployet, verifisert (fase 4/5) | 0 roller, banned til 2126 |
| Klientmeldinger ved utløpt MFA | Implementert, enhetstestet | `src/lib/auth/mfa.ts` m.fl. ligger i main og følger med neste frontend-publisering |

Ingen nye privilegerte testkontoer er opprettet.

## 2. MFA-verifisering

Verifisert: admin med MFA får åpnet Innsendinger (eier, 25.11).
Testet isolert (PostgreSQL-harness `test_editor_mfa.py`: OK): admin/moderator uten MFA nektes lesing og skriving; Edge-koden sjekker MFA etter rollesjekk og *før* KI-kall/ombygging (kodegjennomgang).
**Ikke testet med ekte økt** – må gjøres manuelt av eier:
1. Logg inn med passord, men avbryt før to-trinns kode → åpne /admin/innsendinger: skal ikke vise data.
2. Med full MFA: kjør KI-assistent på en innsending og lagre en endring → skal fungere og utløse ombygging.
(Avvisning av anonyme kall er ikke brukt som bevis for MFA.)

## 3. Migrasjon 2 – public access

Påført som `drizzle/migrations/0004_public_access.sql` (identisk med pending-fil, uten BEGIN/COMMIT). Grunnlagssjekk (7 policyer) besto.
Produksjonsverifisering:
- weather_snapshot: anon/authenticated har ingen rettigheter (REST → 401). get-weather svarer 200 med data, siste henting 12:05, 0 feil – caching og frekvens uendret.
- services: offentlig policy `is_active = true`; ny «Admins can read all services» via is_editor. Skriving uendret (MFA-admin).
- seo_meta: offentlig lesing beholdt, kommentert som Intended Public Access.
- Privilegier: anon kun SELECT; authenticated SELECT/INSERT/UPDATE (ingen DELETE/TRUNCATE m.m.); service_role uendret. Ingen andre tabeller endret.
Ingen regresjon funnet → ingen rollback. Rollback-fil: `docs/security/pending/20261124_public_access_down.sql`.

## 4. Arrangementsbilder – forslag (ikke implementert)

Behold 3 600 s. Forslag ved eventuell senking til 600 s: `onError` på bildet ber én gang om ny signert lenke for akkurat den innsendingen via eksisterende feed-kall (kun når et bilde faktisk feiler, maks ett nytt forsøk per bilde, ingen polling/proxy). I tillegg kan lazy-bilder som kommer i visning etter at lenken er utløpt hente nye lenker samlet ved neste synlige kall. Krever separat godkjenning.

## 5. Regresjon

- Vitest: 256 bestått, 3 hoppet over.
- Sikkerhetsharness: test_has_role, test_editor_mfa, test_public_access – alle OK.
- Produksjonsbygg + prerender: OK, alle indekserbare ruter prerendret.
- Sitemap: 281 unike `<loc>`, 0 duplikater. 562 = 281 loc + 281 hreflang-alternativer (prerender-loggen teller begge); avviket er avklart, ikke en feil.
- Ikke testet i denne fasen: Kjøp billett/Påmelding, webkamera, Fnugg, heiskort, Cloudflare-caching og innlogget bildeopplasting – ingen av disse berøres av endringene (ingen endring i frontend, funksjoner eller ruter utover MFA-sjekkene).

## 6. Sikkerhetsskanning (etter migrasjon)

| Funn | Klasse |
|---|---|
| seo_meta leses av alle | Intended Public Access (dokumentert, ikke skjult) |
| weather_snapshot offentlig lesbar | Resolved |
| services viste inaktive | Resolved |
| has_role kunne sjekke andres roller | Resolved |
| MFA kun i klient | Resolved |
Ingen Critical/High/Medium/Low.
SECURITY DEFINER-funksjoner (tidligere analyse): alle har fast search_path; has_role er self-only, is_editor/verify/issue-funksjonene validerer auth.uid() eller rolle internt; ingen åpen eskalering – Informational.

## 7. Gjenstående risiko og tiltak (prioritert)
1. Eier kjører de to manuelle MFA-testene over.
2. Bare én administrator: gjenoppretting skjer via backend. Vurder en ekstra MFA-admin senere.
3. Ubrukt konto fra 07.07 (ingen roller) – vurder sperring.
4. Frontend med MFA-meldinger avventer eiers publiseringsgodkjenning.
5. Bildelenker: beslutning om forslaget i punkt 4.

Commits: 22f5b62, 5f426ce, a3e0537, a185091 og denne fasens commit.
