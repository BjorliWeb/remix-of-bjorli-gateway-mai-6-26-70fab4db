# Samlet sluttrapport – skisenter, langrenn og kart

## Utført
Eierens faktagrunnlag fra 21. november 2026 er brukt på norsk, engelsk, tysk, nederlandsk, dansk og svensk. Ingen publisering, deploy, push eller grenbytte. Ingen nye avhengigheter installert. Priser, booking, database, innlogging, redirects, analyseoppsett og dynamisk Fnugg-status er urørt.

### Sider
- **Bjorli Skisenter:** eksisterende faktakort erstattet av én samlet «i tall»-seksjon. Alle oppgitte hovedtall, fasiliteter og presiseringer er med. Vanskelighetsfordelingen viser tekstetiketter og 47/9/25/19 prosent etter løypelengde, i tillegg til farger. Den ubetingede Nov–Mai-statistikken er fjernet. Anleggets toppstasjon er ikke fremstilt som stolheisens toppstasjon.
- **Langrenn:** over 80 km i introduksjonen, 81 km i detaljtekst, ansvarlig løypelag, klassisk/skøyting, terreng og betinget preparering. Sygardsløypa og belysning til 22.00. Støtteseksjon med Vipps 508426 og konto 1503.19.64269; ingen betalingslenker eller QR-koder. Skiappen erstatter løyper.net-henvisningene.
- **Løypekart:** separate alpin- og langrennsdeler, korte fakta, lokaliserte lenker til fullstendige sider, eksisterende alpinkart med fullstørrelsesåpning og én Skiappen-visning. Udokumentert PDF-nedlastingslovnad fjernet.
- **Vær og webkamera:** kort 81 km-tekst, lenke til langrenn og gjenbruk av kart/kilde/hjelp/ekstern knapp. Eksisterende løypeoversikt, kameraer, vær og Fnugg beholdt. Ingen støttebetaling eller full skisenterfaktablokk her.
- **Øvrige tekstkilder:** generiske vintertekster og vinterhenvisninger i fem språkordbøker har ikke lenger ubetinget november–mai-lovnad. Skisenterbeskrivelser i legacy-ordboken bruker samme faktakilde, som også føder eksisterende SkiResort-strukturdata. Ingen motstridende anleggstall funnet i dagens felles forsidetekst; ingen ny faktablokk lagt på forsiden. Historiske artikler ikke endret.

### Filer endret
| Fil | Endring |
|---|---|
| `src/lib/resortFacts.ts` | Ny Node-sikker kilde med eierens tall, seks språk og eksakt Skiappen-adresse. |
| `src/lib/resortFacts.test.ts` | 19 konkrete tester av tall, betalingsnumre, fordeling og adapterens gjenbruk. |
| `src/components/SkiappenMap.tsx` | Værsidens eksisterende kartpresentasjon gjort gjenbrukbar; ingen egnet selvstendig komponent fantes. Ingen polling, lagring eller timeout-skjuling. |
| `src/components/ResortFactsSections.tsx` | Faktavisning, støtteopplysninger og to kartdeler, også brukt av prerender. |
| `src/lib/cms/skiCenterData.ts` | Delt beskrivelse og statistikk; kjøpsflyt og salgsbetingelser uendret. |
| `src/pages/SkiCenter.tsx` | Én faktaseksjon i stedet for gamle faktakort. |
| `src/pages/Langrenn.tsx`, `src/pages/langrennCopy.ts` | Oppdatert seks språk, kart og støtteopplysninger. Eksisterende klikkfunksjon bevart; partner/lenke følger nå Skiappen. |
| `src/pages/Loypekart.tsx` | Kartdeler lagt inn via eksisterende SubPage-plassering. |
| `src/pages/WeatherWebcams.tsx` | Kort introduksjon, lenke og delt kart. Eksisterende klikkfunksjon beholdt. |
| `src/lib/cms/subpageData.ts` | Konsistent langrennsgrunnlag, karttekst og vinterpresiseringer. Kun berørte oppføringer. |
| `src/i18n/legacyTranslations.ts` | Skisenterbeskrivelser fra felles faktakilde. |
| `src/i18n/locales/{no,de,nl,da,sv}.ts` | Kun ubetinget sesongintervall fjernet fra vinterhenvisning. Engelsk var allerede nøytral. |
| `src/index.css` | Lokale fargetokens og markører for vanskelighetsfordelingen; øvrig design uendret. |
| `scripts/lib/resortFactsHtml.ts`, `scripts/prerender.ts` | Samme faktaseksjoner og kart gjengis i første HTML; detaljer på langrenn og løypekart. Eksisterende asset-oppslag finner produksjonens alpinkart. |
| `AGENTS.md`, `roadmap.md`, denne rapporten | Delt kilde dokumentert og kontrollstatus registrert. |

## Bestått
- **208 tester bestått**, 28 testfiler, ingen feilede tester; siste kjøring 21:04 UTC. Dette inkluderer alle eksisterende tester og 19 nye faktatester.
- **192 nettleserkombinasjoner:** fire sider × seks språk × sommer/vinter × 320/390/768/1440 px. Ingen registrerte JavaScript-feil, ingen sideveis rulling i siden eller kontrollerte seksjoner etter mobilrettelsen.
- **Axe:** ingen WCAG 2.0/2.1 A/AA-funn i de kontrollerte fakta-, kart- og støtteseksjonene i denne runden. Hele nettstedet eller innholdet inne i tredjepartskartet er ikke sertifisert av denne testen.
- Seks språk: eksakt Vipps/konto lest tilbake fra synlig side; én Skiappen-iframe per side, riktig iframe- og knappeadresse, ingen løyper.net på langrennssiden.
- Lokal Node-gjengivelse av nye prerenderseksjoner på alle språk besto. Faktaseksjonens og kartets tekst sammenlignet direkte med nettleservisningen: identisk.
- Tastatur: Tab fra fullstørrelseskart til skisenterlenke og langrennslenke, Enter åpner langrenn, støtteopplysningene lest tilbake. Skiappen åpnet i ny fane og viste tittelen «Skiappen». Fokusmarkering observert som synlig outline. Dette er ikke en kontroll av tredjepartskartets fulle funksjonalitet.
- Alpinkart åpnet i ny fane og rendret som bilde i **1024 × 761**. Proporsjoner og eksisterende fil bevart.
- 200 % tekst ved 390 px, sommer/vinter: faktaseksjonen har ikke sideveis rulling etter rettelse; tall og etiketter bryter om. Den eksisterende sidens store rem-baserte innrykk gir en smal lesespalte ved denne innstillingen; dette er ikke endret som en generell layoutoppgave.
- Norske mobil-/desktopbilder av faktavisning, støtte og alpinkart inspisert. Elementbilder kan fange fast toppmeny over innholdet; ingen endring av toppmenyen er gjort.
- Siste automatiske bygglogg: **build OK, 21:04:16 UTC**. `git diff --check` besto.

## Feilet underveis, deretter rettet
- Lokal prerenderkontroll fant manglende React-import ved Node-gjengivelse av JSX. Rettet; samme kontroll besto på alle språk.
- Nye faktakort hadde lokal overbredde ved 320 px på enkelte språk. Tilpasset fleksibel kortinndeling; 192-visningers kontroll besto.
- Vanskelighetsetiketter hadde overbredde ved 200 % tekst. Tilpasset inndeling; gjentatt kontroll ved 390 px besto i begge temaer.
- Første nettleserskript hadde en feil i kontrollskriptet og tok bilder med informasjonskapseldialogen åpen. Rettet skriptet og lukket dialogen gjennom den ordinære avvisningsknappen; kontrollene gjentatt. Ingen endring av samtykkefunksjonen.

## Ikke testet / begrensninger
- **Full produksjonsbyggkjede og ferdige HTML-filer:** miljøet tillater ikke manuell appbygging, og har ikke ferdig `dist/404.html`. Automatisk «build OK» er ikke bevis for eksport, sitemap, prerender og ferdige cache-hashede bildehenvisninger samlet. Lokale HTML-fragmenter er kontrollert, men hele produksjonskjeden gjenstår.
- **Tre hoppede eksisterende tester:** krever ferdig produksjonsoutput og gjelder noindex på 404/admin-skall, lokaliserte forsidelenker/canonical og fravær av Early Bird i filer/sitemap. Ingen test hoppet over på grunn av denne funksjonen.
- **Ekte VoiceOver/NVDA**, full WCAG-vurdering og tredjepartskartets interne tastaturfunksjoner er ikke testet. Automatiske seksjonskontroller og egne tastaturhandlinger er ikke en full WCAG-godkjenning.
- **Cloudflare Preview, View Source på ferdig deploy og sosial deling:** ikke testet; ingen publisering. Canonical/hreflang og ruteoppsett er ikke endret, eksisterende lenketester besto.
- **Bildet omtalt i tekstfilen:** ingen bildefil var vedlagt denne meldingen. Ingen nytt stolheisbilde lagt inn; eksisterende skisenterbilde og alpinkart beholdt. Ikke brukt alpinbilde til langrenn.
- Ingen GA4 DebugView-test nødvendig for endret analyseoppsett, siden oppsett og hendelsesfunksjoner ikke er endret. Linkparametrene til det eksisterende langrennsklikket følger den erstattede lenken; faktisk GA4-mottak ikke testet.

## Manuell sjekkliste før publisering
1. Kjør godkjent full produksjonseksport/bygg/prerender i et støttet byggmiljø og de tre genererte HTML-testene etterpå.
2. Cloudflare Preview og View Source: alle seks språk, faktatall, støtteopplysninger, ett kart per side, hashed alpinkartadresse, canonical/hreflang og språklenker.
3. Desktop/mobil: les faktakort og presiseringer, åpne alpinkart i full størrelse, prøv lenkene mellom skisenter, kart og langrenn.
4. VoiceOver/NVDA: overskriftshierarki, faktalistene, lenkenavn, iframe-tittel og tilgang til ekstern Skiappen.
5. Ingen endring av delingsbilder eller sosial metadata i denne oppgaven; ingen ny sosial preview-test er utført.

## Git-status
Arbeidet er utført på eksisterende `main`. Ingen grenbytte eller push-kommando kjørt. Før commit ble `git status`, `git diff --stat` og `git diff --name-only` vist; alle endringer er avgrenset til filene ovenfor. Endringene lagres i prosjektets repository, men appen publiseres ikke.