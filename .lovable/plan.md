# Fase 1 – Målrettet sikkerhetsutbedring (to funn)

Kun lesing er gjort. Ingen kode, database, deploy eller publisering er endret.

## Funn 1: Rollesjekk kan brukes til å undersøke andre (prioritet 1)

**Verifisert rotårsak (live database, kun lesing):** `public.has_role(_user_id, _role)` er SECURITY DEFINER og kan kjøres av `authenticated` og `service_role` (ikke `anon`). Funksjonen sjekker ikke hvem som spør, så en innlogget bruker kan sende inn en annens ID og få svar ja/nei.

**Kartlagte avhengigheter:**
- 25 kall i 19 tilgangsregler (alerts, contact_messages, event_submissions, operational_status, seo_meta, services, user_roles og 3 regler for eventbilder i lagring). **Alle sender `auth.uid()`**, altså egen bruker.
- `issue_editor_email_code_for_delivery` (MFA-e-postkode) sender en vilkårlig bruker-ID, men kan bare kjøres av serveren (`service_role`), ikke av innloggede brukere.
- Appen og serverfunksjonene (`AdminLogin`, `AdminMfa`, `AdminEventSubmissions`, `trigger-site-rebuild`, `ai-event-assist`) leser `user_roles` direkte, ikke via `has_role`. Ingen RPC-kall til `has_role` finnes i koden.
- Rolleadministrasjon skjer via tilgangsreglene på `user_roles` (som bruker `auth.uid()`).

**Anbefalt løsning (minst mulig endring):** Samme signatur, samme rettigheter, samme oppslag – men svaret blir `false` hvis en innlogget bruker spør om noen andre enn seg selv. Server/intern bruk (uten innlogget bruker eller som `service_role`) fungerer som før.

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
  AND (
    _user_id = auth.uid()
    OR coalesce(auth.jwt() ->> 'role', '') = 'service_role'
    OR auth.jwt() IS NULL          -- interne databasejobber uten innlogging
  );
$$;
```
Rollback: gjenopprett dagens funksjonstekst uendret (`..._down.sql`).

**Sikkerhetsgevinst:** Ordinære brukere kan ikke lenger kartlegge hvem som er administrator/redaktør. Ingen ny funksjon introduseres, så ingen ny svakhet av samme type.
**Risiko:** Lav – alle eksisterende kall bruker egen ID. Ingen rekursjon (funksjonen leser fortsatt `user_roles` som eier). Ingen roller endres; administratorer kan ikke stenges ute.
**Ytelse/kostnad:** Uendret (to billige sjekker i samme spørring).

## Funn 2: Bildelenker virker etter avpublisering (prioritet 2)

**Verifisert rotårsak:** `list-approved-events` lager signerte lenker med 3 600 s levetid. Avpublisering stopper nye lenker umiddelbart (kun `approved` hentes), men allerede utdelte lenker virker til de utløper.

**Kartlagt bruk:**
- Statisk HTML/prerender og sitemap: signerte lenker skrives **aldri** til HTML (`export-cms-content` fjerner dem). Ingen risiko for utløpte lenker i statiske sider.
- Arrangementsliste/-detalj: hentes live i nettleseren. Feeden bufres 60 s i funksjonen, `s-maxage=60` i CDN og `max-age=30` i nettleser → en lenke kan være opptil ~2,5 min gammel når den vises.
- Service worker: rører ikke backend/lagring.
- Redaktørvisning: egne lenker (60 min) for innloggede redaktører – utenfor funnet, foreslås uendret.

**Anbefalt løsning:** Reduser levetiden fra 3 600 til **600 s** (én linje). 300 s gir for liten margin for bilder lenger ned på siden (lazy loading) når siden har stått åpen litt. Ingen ny proxy eller lagringsarkitektur.

**Sikkerhetsgevinst:** Maks gjenværende eksponering etter avpublisering går fra ~62 min til ~12 min (600 s + inntil ~2,5 min buffer).
**Gjenværende begrensning:** Allerede utdelte lenker kan ikke trekkes tilbake uten flytting/sletting av filen. Bilder allerede lastet i en besøkendes nettleser kan ligge i nettleserens buffer.
**Risiko:** Lav. En besøkende som lar siden stå åpen >10 min og så ruller til et ikke-lastet bilde kan se reservebildet; ny sidevisning henter ferske lenker.
**Ytelse/kostnad:** Uendret. Lenker lages bare ved bufferbom (maks én gang per minutt per språk/visning) – levetiden påvirker ikke antall kall, databasespørringer eller CDN-buffer.
Rollback: sett tallet tilbake til 3 600 og redeploy funksjonen.

## Testplan (fase 2)
- Isolert lokal PostgreSQL (eksisterende harness `scripts/security/`): bruker A spør om bruker B → false; egen rolle → riktig; admin/moderator-regler på alle 19 policyer virker; service-kall til MFA-koden virker; rollback gjenoppretter dagens oppførsel.
- Eksisterende Vitest-suite (admin-innlogging, MFA, innsendinger, arrangementer, seks språk, prerender/sitemap) + produksjonsbygg.
- Mock-test av feeden: lenker lages med 600 s; avpublisert arrangement utelates.
- Ny sikkerhetsskanning etter godkjent produksjonssetting.

## Leveranse i fase 2
- `docs/security/pending/20261124_has_role_self_only_up.sql` / `_down.sql`, testet lokalt, deretter identisk SQL via migrasjon **kun etter din eksplisitte godkjenning av produksjonsendring**.
- Én linje i `supabase/functions/list-approved-events/index.ts`; deploy av funksjonen først etter godkjenning.
- Ingen endring av roller, design, innhold eller andre policyer.
