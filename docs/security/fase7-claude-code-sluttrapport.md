# Fase 7 – sluttrapport fra Claude Code (26.11.2026)

**Anbefaling:** Betinget GO for merge. Betinget GO for produksjonssetting når vilkårene i §15 er oppfylt.
Ingen produksjonsendring er gjort i denne fasen: ingen migrasjon, ingen Edge Function-deploy, ingen publisering, ingen konto- eller rolleendring.

Merking i rapporten: **[Verifisert]** = kjørt/observert i denne fasen. **[Rapportert]** = fra tidligere Lovable-rapporter, ikke kontrollert på nytt mot produksjon. **[Estimat]** / **[Antakelse]** = vurdering uten måling.

## 1. Dokumenter som er lest
- `docs/security/fase6-sikkerhetsstatus-2026-11-25.md` (primærkilde)
- `docs/security/fase2-…`, `fase3-…`, `fase3b-…`, `fase4-…`, `fase5-trinn3-…`, `fase5-trinn4-…`, `public-access-verification-…`
- `docs/security/pending/*.sql|.patch` (inkl. `20261124_event_image_ttl.patch`)
- `drizzle/migrations/0002–0004`, `roadmap.md`, `DEPLOYMENT.md`, `docs/PRODUCTION_HANDOFF.md`, `CLAUDE.md`
- Kode: `supabase/functions/list-approved-events`, `ai-event-assist`, `trigger-site-rebuild`, `submit-event`, `src/lib/cms/mockAdapter.ts`, `scripts/export-cms-content.ts`, `src/lib/auth/mfa.ts`, `src/pages/AdminEventSubmissions.tsx`, `src/components/admin/EventSubmissionEditForm.tsx`
- Git-historikk, inkl. `a3e0537`, `4db9023`, `6643fa9`

**Manglende:** Ingen definisjon av fase 7 fantes i repoet før mandatet. Det finnes ingen CI-konfigurasjon (`.github/workflows`) og ingen dokumentasjon av hvilken gren Cloudflare Pages bruker for produksjon.

## 2. Verifisert implementeringsstatus (repo)
| Tiltak | Status i repo |
|---|---|
| `has_role` kun egen rolle | Migrasjon 0002 finnes; harness OK **[Verifisert lokalt]** |
| MFA i RLS/Storage, rolletilbakekalling, siste-admin-vern | Migrasjon 0003; harness `test_editor_mfa.py` OK **[Verifisert lokalt]** |
| MFA i `ai-event-assist` og `trigger-site-rebuild` | Kode sjekker `has_current_editor_mfa` etter rollesjekk og før arbeid (`a3e0537`) **[Verifisert i kode]** |
| Public access (weather/services/seo_meta) | Migrasjon 0004; harness OK unntatt PG-versjonsavvik (§9) **[Verifisert lokalt]** |
| Klientmeldinger ved utløpt MFA | Finnes i `main` og i publisert frontend (§3) |

## 3. Verifisert produksjonsstatus (kun offentlig lesing)
- **Produksjon og staging kjører samme frontendpakke** (`/assets/index-Cw0b_Tyn.js`). Den delte chunken `mfa-L8hJQLn2.js` inneholder `has_current_editor_mfa`, `mfa_required` og `MFA_EXPIRED_MESSAGE`, og admin-chunken inneholder «Endringer lagret – publisering venter». **[Verifisert 26.11]**
  → Klientkoden for MFA fra fase 4/5 **er publisert**. Hvilken `main`-commit som er publisert, er ikke fastslått. Det må leses av i Cloudflare.
  *Rettelse:* Et tidligere utkast av denne rapporten sa at MFA-koden manglet i produksjon. Det var feil, fordi bare admin-chunken var undersøkt og ikke den delte `mfa`-chunken.
- **Cloudflare Pages bygger grenen uten feil.** PR #33 ga en vellykket forhåndsvisning (`claude-keen-dijkstra-o5madg.bjorli-staging.pages.dev`) med `x-robots-tag: noindex, nofollow`. Den inneholder fornyelseskoden (`refresh_images`). **[Verifisert]**
- `package-lock.json` er ute av synk med `package.json` (`npm ci` feiler lokalt), og `DEPLOYMENT.md` oppgir `npm ci`. Cloudflare-bygget lykkes likevel, så Cloudflare bruker trolig `bun.lockb`/`bun install`. **Ikke blokkerende.** Låsefilen eller dokumentasjonen bør ryddes i en egen PR.
- Databasen, Edge Functions og innloggede økter er ikke kontrollert. Agenten har ikke tilgang og skal heller ikke kontrollere dem.

## 4. Avvik fra tidligere Lovable-rapporter
1. Fase 6 omtaler frontend-MFA som «implementert, følger med neste publisering». Den finnes nå i produksjon (§3), så den er publisert etter fase 6-rapporten.
2. `test_public_access.py` feiler 6 deltester lokalt fordi privilegiet `MAINTAIN` først finnes i PostgreSQL 17 (lokalt: 16). Det er et miljøavvik og ingen regresjon. Lovable kjørte trolig PG 17. Testen er ikke endret.
3. Fase 6 punkt 3 («ubrukt konto fra 07.07, ingen roller – vurder sperring») stemmer ikke med fase 4, der testkontoen fra 07.07 allerede var sperret. Se §11.
4. Fase 6 sier 281 sitemap-URL-er. Det kunne ikke reproduseres lokalt uten tilgang til ekte arrangementsdata (lokalt: 276 uten innsendinger, 288 med 2 testinnsendinger). Avviket kommer av datagrunnlaget, ikke av kode.

## 5. Implementert bildeløsning
**Server – `supabase/functions/list-approved-events/index.ts` + `_shared/eventImageRefresh.ts`**
- Offentlige bildelenker signeres i **600 s** (før 3 600 s). Redaktørlenker i `/admin/innsendinger` beholder 3 600 s (uendret).
- Responsen har et nytt felt, `image_indexes` (bildets posisjon), ved siden av `image_signed_urls`. Endringen er bakoverkompatibel.
- Ny gren i samme funksjon: `POST { refresh_images: [{ id, index }] }` (maks 12):
  - Klienten sender **aldri** en lagringssti. Eventuelle ekstra felt ignoreres.
  - Raden leses på nytt for hver forespørsel (`status = 'approved'`) **uten cache** (`Cache-Control: no-store`).
  - Stien hentes fra radens `image_urls[index]` og valideres (ingen `..`, ledende `/`, `\` eller kontrolltegn).
  - Ukjente, avpubliserte og avviste arrangementer gir samme tomme svar, så svaret avslører ikke om et arrangement finnes.
  - Ugyldig format gir 400 før database eller Storage blir spurt.
  - Grenen har en egen per-IP-grense (20/min) og spiser ikke av kvoten til listevisningen (10/min).
  - En forespørsel koster én databaselesing og ett Storage-kall, uansett antall bilder.

**Klient – `src/lib/events/eventImageRecovery.ts`**
- CMS-adapteren registrerer hver signerte arrangementslenke. Registreringen er lokal og sender ingen forespørsel.
- `onError` på bildeelementene for arrangementer (kort, fremhevet kort, detalj-hero, lightbox, forsidekort, relaterte):
  - Bilder som ikke er registrert, ignoreres, så andre bilder oppfører seg som før.
  - Ved feil sendes **én** forespørsel. Feil som skjer samtidig, samles i én forespørsel (40 ms vindu, maks 12 bilder), og to forespørsler om samme bilde kjører aldri samtidig.
  - En fornyet lenke gjenbrukes i 9 minutter av alle elementer som viser bildet.
  - **Maks ett automatisk forsøk per element og feiltilstand.** Feiler det igjen, eller avslår serveren, vises det **eksisterende reservebildet** (`EVENT_IMAGES[0]`, samme som før). Reservebildet registreres ikke, så det kan aldri gå i løkke.
- Ingen polling, timere, nye tjenester, tabeller, avhengigheter eller designendringer.

**MFA-feilhåndtering – `src/pages/AdminEventSubmissions.tsx`, `src/lib/auth/mfa.ts`**
- Funn: RLS avviser `UPDATE` ved å treffe 0 rader, ikke med en feil. Statusendring, notater, AI-resultat, engelsk tekst, engelsk godkjenning og e-postsynlighet ble derfor vist som **vellykket** selv om serveren (f.eks. ved utløpt MFA) hadde avvist dem.
- Nå leses raden tilbake (`.select('id')`), og `classifyEditorWrite` klassifiserer resultatet. Ved avvisning og utløpt MFA vises `MFA_EXPIRED_MESSAGE`. Utvalg, notater og skjema beholdes, og det vises ingen suksessmelding.
- MFA-avvisning fra `trigger-site-rebuild` gir nå et varsel, med egen tekst for avpublisering. Andre feil fra ombyggingen er fortsatt stille, som før.
- `EventSubmissionEditForm.tsx` hadde allerede riktig håndtering og er ikke endret. MFA-arkitektur, rollemodell og 30-dagersgrense er uendret.

## 6. Endrede filer
| Fil | Endring |
|---|---|
| `supabase/functions/list-approved-events/index.ts` | 600 s, `image_indexes`, fornyelsesgren, egen rate-grense |
| `supabase/functions/_shared/eventImageRefresh.ts` (ny) | Ren validerings- og oppslagslogikk |
| `src/lib/events/eventImageRecovery.ts` (ny) | Behovsstyrt fornyelse i klienten |
| `src/lib/cms/mockAdapter.ts` | Registrerer signerte bilder |
| `src/components/ContentCard.tsx`, `ContentDetail.tsx`, `HomepageSections.tsx`, `listing/cards.tsx`, `listing/FeaturedContentCard.tsx`, `listing/ContentDetailTemplate.tsx` | `onError={handleEventImageError}` på bildene for arrangementer |
| `src/lib/auth/mfa.ts` | `classifyEditorWrite` |
| `src/pages/AdminEventSubmissions.tsx` | Avviste lagringer gir ikke lenger suksessmelding; MFA-varsel ved ombygging |
| Tester (nye) | `src/lib/events/eventImageRefresh.test.ts`, `src/lib/events/eventImageRecovery.test.ts`, `scripts/security/functions/*` |
| `src/lib/auth/mfa.test.ts` | Nye tester for `classifyEditorWrite` |
| `docs/security/fase7-claude-code-sluttrapport.md`, `roadmap.md` | Dokumentasjon |

## 7. Tester
**Nye automatiske tester [Verifisert]**
- `eventImageRefresh.test.ts` (34): 600 s; gyldig/ugyldig forespørsel; vilkårlig sti ignoreres; traversering; godkjent, avpublisert, avvist og ukjent arrangement; bilde fra annet arrangement (indeks utenfor); republisering; manglende bildeliste; posisjoner ved feilet signering.
- `eventImageRecovery.test.ts` (12): ingen kall ved normal visning; ikke-arrangementsbilder urørt; utløpt lenke etter >10 min; flere samtidige feil (ett kall); samme bilde flere steder; gjenmontering uten nytt kall; >12 feil deles opp; maks ett forsøk og så reservebilde; reservebilde uten løkke; avpublisert; 429/nettverksfeil; ny feiltilstand gir nytt enkeltforsøk.
- `scripts/security/functions/listApprovedEvents.test.ts` (15) kjører **den faktiske Edge-funksjonen** mot falsk Supabase. Dekker: 600 s for alle bilder; flere bilder; manglende bilde; kun godkjente; ingen e-post eller rå sti; fornyelse ikke cachet; én databaselesing og ett Storage-kall per batch; avvist og ventende; **avpublisering mens listen er cachet (X-Cache HIT) gir ingen ny lenke**; republisering; annet arrangements bilde; klientsti ignoreres; 400 ved vilkårlig sti; ukjent og avpublisert gir likt svar; slettet objekt; rate-grense 20/min uten å påvirke listen; anonym tilgang.
- `mfa.test.ts` (+3): 0 rader regnes som avvisning, 42501 og `protected_field` regnes som avvisning, andre feil regnes som feil.

**Nettlesertest (Playwright, lokal produksjonsbygg + falsk funksjon med ekte 600 s-utløp) [Verifisert]**
Desktop 1366×900 og iPhone 13, alle seks språk (no/en/de/nl/da/sv), 44 sjekker, 43 bestått.
- Normal visning: 0 fornyelseskall og 0 utløpte bilder.
- Side åpen i >10 min, deretter «Vis flere» (bilder som aldri var lastet): utløpte bilder ble fornyet i **ett** samlet kall, hvert bilde én gang, og bare `id` og `index` ble sendt.
- Avpublisert mens siden var åpen (foreldet klientcache): serveren avslo, det synlige reservebildet ble vist, og etter 4 s var det ingen flere kall (ingen polling eller løkke).
- Detaljside etter >10 min: hero-bildet ble fornyet. Lightbox gjenbrukte den fornyede lenken uten nytt kall.
- Det ene avviket (mobil/de) skyldtes at et lazy-bilde under bretten ennå ikke var lastet da målingen ble tatt. Det hadde ingen feil og utløste ingen fornyelse, og samme bilde lastet riktig i neste steg. Det er en svakhet i testoppsettet, ikke i koden.

**Prerender [Verifisert]:** Bygget mot falsk funksjon med 2 innsendinger med signerte bilder ga 12 prerenderte arrangementssider (6 språk). **0** HTML-filer inneholder signerte lenker eller tokens. Dette ivaretas av `scripts/export-cms-content.ts`, som fjerner bilder fra `submission-*`.

**Regresjon [Verifisert]**
| Kontroll | Resultat |
|---|---|
| Vitest (hele suiten) | 33 filer, **308 bestått**, 0 hoppet over. Baseline før endring: 256 bestått / 3 hoppet over. +49 nye tester; de 3 tidligere hoppede er SEO-tester mot `dist/` som kjører når bygg finnes (bestått). |
| Funksjonstester | 15/15 |
| Typesjekk (`tsc -p tsconfig.app.json`) | OK |
| ESLint | 40 funn, **identisk med `main`** (alle eksisterende). Ingen nye. |
| `test_has_role.py` | OK |
| `test_editor_mfa.py` | OK |
| `test_public_access.py` | 6/12 deltester feiler kun på `MAINTAIN` (PG16-miljø, §4); øvrige OK |
| Produksjonsbygg (`npm run build`, `ALLOW_MISSING_EVENTS=1`) | OK. 312 HTML-filer, alle indekserbare ruter prerendret, alle sitemap-URL-er løses, interne lenker OK |
| CI på PR #33 (Cloudflare Pages, eneste kontroll; ingen GitHub Actions) | ✅ Bygg og forhåndsvisning OK for `facee97` |
| Produksjonsbygg med testinnsendinger | OK. 324 HTML-filer (2 innsendinger) / 366 (9 innsendinger) |

**Ikke testet:** Ekte Supabase Storage og Edge-runtime (ingen deploy), ekte innloggede økter og MFA, Kjøp billett/Påmelding, vær, webkamera, Fnugg, heiskort, skiperformance, langrenn og kart, Cloudflare-caching. Ingen av disse er endret i koden. De berørte komponentene får bare en `onError`-handler som ikke gjør noe for bilder som ikke er registrert.

## 8. Gjenværende eksponeringstid etter avpublisering
| Lag | Varighet |
|---|---|
| Ny offentlig signert lenke | ≤ 600 s fra signering **[Verifisert i kode/test]** |
| Funksjonens minnecache for listen (per isolat) | ≤ 60 s. Lister kan i dette vinduet fortsatt dele ut nye 600 s-lenker. **Verst tenkelig ≈ 11 min** fra avpublisering til siste nye lenke slutter å virke **[Estimat]** |
| Klientens arrangementscache | ≤ 60 s. Kan ikke gi nye lenker etter avpublisering, fordi fornyelsen sjekker databasen **[Verifisert]** |
| HTTP-cache på listesvaret | `max-age=30, s-maxage=60` (uendret). POST-svar caches normalt ikke av CDN **[Antakelse]** |
| Lenker utstedt **før** deploy | Fortsatt gyldige i opptil 3 600 s etter deploy. De forkortes ikke |
| Storage/CDN-cache | Objekter lastes opp med supabase-js' standard `cacheControl` (3600). Om Supabase sin CDN serverer cachet innhold for en utløpt signert URL, er ikke verifisert **[Usikkert]** |
| Allerede nedlastede bilder | Nettleserens cache, skjermbilder og kopier kan ikke tilbakekalles |

600 s TTL begrenser gjenbruk av lenker, men **garanterer ikke** fullstendig tilbakekalling av bilder som allerede er distribuert.

## 9. Sikkerhetsvurdering
- Separat review-agent (Opus) gikk gjennom autorisasjon, publiseringsstatus, Storage, cache, race conditions, retry, misbruk og regresjon: **ingen høye eller middels funn.** Lave funn:
  1. Rekkefølgen for deploy (§13). Hvis klienten kommer før funksjonen, faller hver bildefeil tilbake til en full listeforespørsel (uten synlig feil, men med høyere kostnad).
  2. MFA-varsel ved avpublisering hadde feil tekst. **Rettet.**
  3. Rate-grensen bruker `cf-connecting-ip`/`x-forwarded-for`, som før. Det er ikke verifisert om Supabase-gatewayen overskriver disse. Med forfalskede headere vil hver fornyelse koste maks én databaselesing og ett Storage-kall med 12 bilder. Begrenset til kostnad, og ikke nytt i denne fasen.
  4. `.cache/` (byggeartefakt) er ikke i `.gitignore`. Den er ikke committet, og sjekk viste ingen tokens eller e-post.
- MFA-håndheving er ikke endret. Harness viser: uten MFA nektes lesing og skriving; admin uten MFA kan ikke tildele roller; MFA-admin kan tilbakekalle; siste admin er vernet; Storage krever MFA; rolleendring krever ny MFA. Edge-funksjonene sjekker MFA i koden. **Ekte økter er ikke testet** (§10).
- `seo_meta` er fortsatt tilsiktet offentlig og ikke endret.

## 10. Manuelle MFA-tester for eier (produksjon)
Ikke del passord, TOTP-koder eller tokener med noen. Lag ingen nye privilegerte kontoer.
1. **Uten MFA:** Logg inn med passord og avbryt før to-trinns kode. Åpne `/admin/innsendinger`. Siden skal sende deg til MFA og ikke vise data.
2. **Med MFA:** Åpne `/admin/innsendinger`. Listen og bildene vises.
3. **Lagring:** Endre et notat og lagre. Du skal se «Notater lagret», og endringen skal fortsatt være der etter oppdatering av siden.
4. **KI-assistent:** Kjør et KI-forslag. Forslaget skal oppdateres.
5. **Ombygging:** Lagre en endring på et publisert arrangement. Du skal ikke få MFA-varsel. Sjekk etter neste bygg at den offentlige siden er oppdatert.
6. **Etter neste frontend-publisering:** Skjer en avvisning, skal du se «Ny to-trinns innlogging kreves» og ikke en suksessmelding. Det kan bare testes naturlig etter 30 dager eller etter en rolleendring. Ikke fremprovoser det med kontoendringer.
7. **Bilder etter deploy:** Åpne `/arrangementer`, la fanen stå i over 10 minutter, og trykk «Vis flere» eller åpne et arrangement. Bildene skal vises (eller reservebildet hvis arrangementet er avpublisert).
8. **Avpublisering:** Avpubliser et testarrangement. Etter maks cirka 11 minutter skal nye økter ikke se bildet. Gamle lenker fra før deploy kan virke i opptil 1 time.

## 11. Status for den tidligere testkontoen
- Fase 4: `r06b-admin-…@example.com` ble opprettet 07.07.2026, adminrollen ble fjernet, og kontoen ble sperret til 2126. Fase 6, tabell §1, bekrefter «0 roller, banned til 2126».
- Fase 6 §7 punkt 3 nevner likevel en «ubrukt konto fra 07.07 (ingen roller) – vurder sperring». Det kan **ikke avgjøres fra repoet** om dette er samme konto (i så fall er formuleringen utdatert) eller en annen konto opprettet samme dag.
- **Avvik registrert. Ingen konto endret.** Eier bør i backend → Brukere sjekke alle kontoer opprettet 07.07.2026, med e-post, roller og `banned_until`.

## 12. Reserveadministrator og gjenoppretting
- **Anbefaling (ikke implementert):** Legg til én betrodd admin nummer to med egen TOTP før neste større endring. Vernet mot å fjerne siste admin gjør at en ny admin må legges til før en gammel kan fjernes.
- **Gjenoppretting i dag (fase 4 §7):** Mister admin TOTP-enheten, fjerner backend-operatør MFA-faktoren via serverens brukeradministrasjon etter at eier har bekreftet. Ny TOTP registreres ved neste innlogging. Ved kompromittert konto: fjern roller (virker umiddelbart), sperr kontoen eller logg ut alle økter (et utstedt token lever opptil cirka 1 time, men uten rolle).
- **Fremtidige forbedringer (ikke nå):** reserveadministrator, ferskere MFA (f.eks. ≤ 12 t) ved rolleendringer, og bedre tilbakekalling av økter ved passordbytte.

## 12b. Hva neste frontend-publisering inneholder
Produksjon har MFA-klientkoden (§3). Den nøyaktige publiserte commiten er likevel ikke kjent. Neste publisering etter merge inneholder de fire fase 7-commitene, pluss eventuelle `main`-commits som ennå ikke er publisert. Hvilke det er, kan leses av i Cloudflare (publisert commit) og sammenlignes med `git log <publisert>..main`. Kandidater fra den siste uken er blant annet `3c8df73` (datomerker i andre tidssoner) og `6643fa9`/`4db9023` (kun dokumentasjon).

## 13. Deploy-rekkefølge
1. Eier godkjenner PR-en. Merge til `main` kun etter godkjenning.
2. **Kontroller Cloudflare Pages:** hvilken gren som publiseres til produksjon, og om merge til `main` publiserer automatisk. Bestem tidspunktet ut fra det.
3. **Deploy Edge Function `list-approved-events`** (Lovable Cloud/Supabase). Funksjonen er bakoverkompatibel med dagens frontend, men gamle klienter får 600 s-lenker uten fornyelse. Sider som har stått åpne lenge, kan derfor vise ødelagte bilder til steg 4 er gjort. Gjør steg 3 og 4 rett etter hverandre.
4. Publiser frontend (staging først, så produksjon).
5. Kjør de manuelle testene i §10.
Ingen databasemigrasjon inngår.

## 14. Rollback
- **Edge Function:** Redeploy forrige versjon (`git show 6643fa9:supabase/functions/list-approved-events/index.ts`), eller sett 600 → 3600. Ingen datatap.
- **Frontend:** `git revert` av fase 7-commitene og ny publisering. Klientkoden er harmløs mot både gammel og ny funksjon.
- Ingen databaseendringer å rulle tilbake.

## 15. Konklusjon
- **Merge: Betinget GO.** Vilkår: eier har gjennomgått PR-en, og publisering skjer ikke automatisk ved merge før §13.2 er avklart.
- **Produksjonssetting: Betinget GO.** Vilkår: (a) funksjon og frontend deployes i rekkefølgen i §13, (b) forhåndsvisningen er kontrollert (Cloudflare-bygget er grønt), (c) eier kjører de manuelle testene i §10.
- **Ikke blokkerende, men åpent:** avklaring av kontoen fra 07.07 (§11), reserveadministrator (§12).
