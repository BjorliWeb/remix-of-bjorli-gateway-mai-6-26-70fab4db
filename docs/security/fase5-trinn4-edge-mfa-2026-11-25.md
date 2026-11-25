# Fase 5 – trinn 4: MFA i Edge-funksjoner (25.11.2026)

Eier bekreftet at /admin/innsendinger fungerer med to-trinns innlogging etter trinn 3.

## Endring

`docs/security/pending/20261124_editor_mfa_edge.patch` er lagt inn i koden og deployet:

- `supabase/functions/ai-event-assist/index.ts`: etter rollesjekken kalles
  `has_current_editor_mfa` med den innloggede brukerens egen JWT (aldri
  service-nøkkelen). Svarer 403 `mfa_required` ved feil eller `false` – slår
  aldri feil åpent.
- `supabase/functions/trigger-site-rebuild/index.ts`: samme sjekk via
  `userClient` før noe legges i ombyggingskøen. Svarer 403 `mfa_required`.

Ingen annen logikk er endret. Klienten viser allerede en egen melding ved
`mfa_required` (fase 4).

## Verifisering

- `has_current_editor_mfa` finnes i produksjon (SECURITY DEFINER, uten
  argumenter) – bekreftet før deploy.
- `deno check` på begge funksjonene: rent (isolert kopi, nodeModulesDir auto).
- Deploy OK; source SHA-256 registrert for begge.
- Live-kall uten token og med anon-nøkkel: 401 Unauthorized på begge
  funksjoner (uendret oppførsel for uinnloggede).

## Ikke verifisert

- Innlogget administrator/redaktør uten aktiv to-trinns økt → forventet 403
  `mfa_required`. Krever ekte økt; eier kan kontrollere ved å bruke
  KI-assistenten i /admin.
- Innlogget administrator/redaktør med to-trinns økt → forventet normal
  funksjon. Eier bekrefter ved vanlig bruk.

## Rollback

Fjern de to MFA-blokkene (se patch-filen) og redeploy funksjonene.
Databasen er ikke berørt i dette trinnet.
