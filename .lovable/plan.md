# Redigering av innsendte arrangementer på /admin/innsendinger

## Funn
- «Innsendte artikler» på /admin/innsendinger er arrangementer, ikke artikler. Siden har ingen egen artikkeleditor.
- Redaktør og administrator har allerede lov til å endre innsendinger i databasen. I dag kan de bare endre notater, status, engelsk utkast og om e-posten vises.
- En godkjent innsending *er* den publiserte siden. Det finnes ingen egen publisert kopi.
- Det finnes ingen felt for bildetekst eller «endret av». Feltet `updated_at` oppdateres automatisk.
- Bildene ligger i privat lagring. I dag kan bare skjemaet for offentlig innsending laste opp nye bilder.

## Hva som bygges
1. Knappen «Rediger» i detaljvisningen for hver innsending.
2. Et skjema der dagens innhold er fylt ut på forhånd: tittel, ingress, beskrivelse, arrangør, start- og sluttdato, klokkeslett, sted, kartlenke, nettside og kategori. Kategorilisten er den samme som i innsendingsskjemaet. I tillegg kommer bilder: fjerne eksisterende og laste opp nye, høyst 5 bilder på maks 8 MB hver, samme grenser som i dag.
3. Knappene «Lagre endringer» og «Avbryt». Avbryt forkaster endringene.
4. Samme regler for lengde og påkrevde felt som i innsendingsskjemaet. Feilmeldingene står ved feltet og blir lest opp av skjermlesere.
5. Bekreftelse når lagringen lykkes, en forståelig feilmelding når den feiler, og oversikten lastes på nytt med en gang.
6. Advarsel før redaktøren forlater skjemaet med ulagrede endringer, både ved lukking, Avbryt og når fanen lukkes.
7. **Godkjente arrangementer:** Over skjemaet står det at lagring endrer den publiserte siden. Etter lagring bestilles nytt bygg i den eksisterende byggkøen. Status endres aldri ved lagring.
8. Godkjenning, avvisning, AI-hjelp og engelsk godkjenning fungerer som før. ID, innsender, kontaktinfo, innsendingsdato og status røres ikke.

## Tilgang og sikkerhet
- **Database:** Én ny, smal regel sørger for at vanlig lagring ikke kan endre ID, innsendingsdato, opplastingsnøkkel, innsenders samtykker eller kontaktdata.
- **Bilder:** En ny regel lar bare redaktør og administrator laste opp og slette filer, og bare i bildemappen for innsendinger. Andre roller får ingen ny tilgang.
- Innlogging, totrinnsbekreftelse, passordtilbakestilling, offentlige sider og øvrige adminfunksjoner endres ikke. Ingen nye avhengigheter eller databasefelt.

## Verifisering
- Tester for skjemaregler og for at lagring aldri sender med status.
- I nettleseren som redaktør: redigere, lagre, laste siden på nytt, sjekke Avbryt og sjekke at status er uendret.
- Direkte lagringsforsøk som anonym og som innlogget bruker uten redaktørrolle skal avvises, både for innsendingen og for bildeopplasting.
- Godkjenn og avvis fungerer fortsatt. Ingen publisering eller deploy.

## Tekniske detaljer
- Ny komponent `src/components/admin/EventSubmissionEditForm.tsx` med zod-skjema delt i `src/lib/events/submissionEditSchema.ts`, som speiler grensene i `submit-event`.
- Lagringen gjør en eksplisitt `update` med en liste over tillatte felt, og oppdaterer så `load()`.
- Migrasjonen legger til en BEFORE UPDATE-trigger på `event_submissions`. Den avviser endring av `id`, `created_at`, `upload_token`, `consent_*`, `email`, `contact_name` og `phone`, og setter `reviewed_by = auth.uid()` når redaktøren lagrer. Feltet finnes allerede.
- Lagringsregler på `storage.objects` for bøtta `event-submissions` med `has_role` admin/moderator for INSERT og DELETE. Redaktørens opplastinger legges under `editor/<submission-id>/`.
- Opplastinger sjekkes i klienten for filtype (bilde) og størrelse. Bilder som fjernes, slettes fra lagringen etter at lagringen har lyktes.
