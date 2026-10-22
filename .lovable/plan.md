# Gjennomgang av PR #25 – ingen kodeendringer

PR #25 (commit 24e24f9, flettet i 94dfda5) endrer bare 5 filer: recoveryLink.ts, en test for den, main.tsx, AdminResetPassword.tsx og en test for den. 49 av 49 tester for innlogging og tilbakestilling består.

1. Tokenet brukes ikke før «Fortsett»: OK. verifyOtp kalles bare i continueWithToken. Når siden åpnes, sjekker den ingenting.
2. token_hash fjernes før første GA4 page_view: OK. Tokenet fjernes med replaceState før render, og gtag har send_page_view: false.
3. Gamle #access_token-lenker: OK i koden. Lenkene røres ikke og testes. Risiko fra før PR-en (ikke verifisert i nettleseren): siden lastes forsinket, så auth-js kan tømme adressefeltet først. Da avhenger flyten av PASSWORD_RECOVERY-hendelsen eller getSession.
4. Rollesjekk og innlogging: uendret. AdminLogin, roles og mfa er ikke rørt.

Anbefaling: ingen endringer. Valgfritt senere: test en ekte gammel lenke i previewen før e-postmalen byttes.
