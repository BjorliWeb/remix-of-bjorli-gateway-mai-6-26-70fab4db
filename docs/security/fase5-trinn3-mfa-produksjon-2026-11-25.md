# Fase 5 – trinn 3: MFA i produksjon (25.11.2026)

Eier bekreftet innlogging med TOTP på /admin og valgte å fortsette uten ekstra administrator.

Aktivert: `20261124_editor_mfa_up.sql` (identisk SQL, som `drizzle/migrations/0003_editor_mfa.sql`).

Verifisert i produksjon:
- 0 policyer med `has_role(auth.uid()…)`, 20 med `is_editor` (19 endrede + «MFA admins can read all roles»).
- `is_editor` EXECUTE: authenticated, service_role (ikke anon).
- Trigger `user_roles_keep_last_admin` finnes; forsøk på å slette eneste admin ble avvist (testet i transaksjon, 1 admin igjen).
- Anon REST: event_submissions (23 rader i tabellen), contact_messages, user_roles → tom liste.

Ikke verifisert av agent: admin/moderator med og uten MFA mot ekte økter (krever eier eller godkjent testkonto med rolle). Eier må kontrollere /admin/innsendinger på nytt.

Rollback: `docs/security/pending/20261124_editor_mfa_down.sql` via ny migrasjon.
Neste: trinn 4 (Edge-funksjoner) etter eiers bekreftelse.
