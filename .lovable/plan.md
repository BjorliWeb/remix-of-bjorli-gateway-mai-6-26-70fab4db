# Redigerbar engelsk tekst for arrangementer

## Årsak (bekreftet i koden)
- Redaktørsiden viser den engelske teksten (tittel, ingress, beskrivelse) bare som skrivebeskyttede AI-blokker. Det finnes ingen felt for å redigere den.
- Knappen «Generer engelsk utkast på nytt» overskriver eksisterende engelsk tekst uten å spørre.
- Arrangementer sendt inn på engelsk viser bare «cleanup»-forslaget, heller ikke redigerbart.
- Funksjonen som leverer godkjente arrangementer til nettstedet sender ikke de engelske feltene. Den engelske siden viser derfor aldri den godkjente engelske teksten i dag. Dette må rettes for at punktet «offentlig engelsk visning bruker lagret tekst» skal kunne oppfylles.
- Databasevakten blokkerer ikke de engelske feltene. Den nullstiller bare engelsk godkjenning når norsk tekst endres. Ingen utvidelse av tilgangsregler trengs.

## Endringer
1. **Redigeringsfelt** i seksjonen «Engelsk tekst»: tre tydelig merkede felt (English title, English intro, English description) ved siden av merket originaltekst. Fylles med lagret tekst når oppføringen åpnes. Egen «Lagre engelsk tekst»-knapp. Gjelder ventende, godkjente og publiserte oppføringer. Samme design som dagens skjema.
2. **Lagring** skriver til de eksisterende engelske feltene. Godkjenning av arrangementet rører dem ikke. Publiserte arrangementer ber om ny bygging etter lagring, på samme måte som andre redaktørendringer.
3. **AI på nytt med bekreftelse**: finnes det engelsk tekst, spør en dialog «Erstatte den engelske teksten?». Avbryt beholder alt. AI-forslag fra andre handlinger (språkvask, SEO) skriver aldri til de engelske feltene.
4. **Endret originaltekst**: den engelske teksten beholdes. Diskret melding: «Den norske teksten er endret – gå gjennom den engelske.» Dagens oppførsel der engelsk godkjenning nullstilles beholdes, siden den bare markerer behov for gjennomgang og ikke sletter tekst.
5. **Offentlig visning**: funksjonen for godkjente arrangementer sender med engelsk tittel, ingress og beskrivelse bare når den engelske teksten er godkjent. Engelske sider og ferdig bygde sider bruker den, ellers norsk som i dag.
6. **Tilgang**: uendret. Bare administrator/moderator kan lagre. Innsendere får ingen nye rettigheter.

## Verifisering
- Tester: lagring/lasting av engelske felt, at godkjenning og originalendring ikke sletter dem, at AI på nytt krever bekreftelse, og at offentlig utdata bare inneholder godkjent engelsk.
- Ende-til-ende i nettleser med en testoppføring: generer, rediger, lagre, lukk/åpne, endre norsk, godkjenn, rediger publisert, regenerer med bekreftelse og avbryt.
- Kontroll av at en uinnlogget bruker ikke kan endre feltene.
- Eksisterende arrangementer endres ikke. Testoppføringen slettes etterpå.
- Tester og produksjonsbygg. Ingen publisering.

## Tekniske detaljer
- `src/pages/AdminEventSubmissions.tsx`: nytt redigerbart skjema, bekreftelsesdialog (eksisterende AlertDialog), `runAi` skriver engelsk bare ved `translate_en` + bekreftelse.
- Ny ren hjelpefunksjon i `src/lib/events/` for engelsk oppdatering og gjennomgangsvarsel, med tester.
- `supabase/functions/list-approved-events`: legg til `english_*` når `english_approved`; kobles inn i arrangementsadapter/prerender for `en`.
- Ingen databaseendring planlagt.
