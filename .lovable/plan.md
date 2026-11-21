# Eierbekreftede fakta om alpint og langrenn

## Mål og avgrensning
Oppdater faktainnhold på norsk, engelsk, tysk, nederlandsk, dansk og svensk med eierens opplastede tekst som kilde. Behold dagens design, URL-er, canonical, hreflang, priser, kjøpsflyt og dynamiske driftsopplysninger. Ingen publisering eller endringer i database, innlogging, analyseverktøy eller driftsoppsett.

## 1. Felles faktagrunnlag
- Samle gjenbrukte tall og presiseringer i en liten Node-sikker kilde som både sidene og prerenderingen bruker, med eksisterende oversettelsesoppsett.
- Skill anleggets totale kapasitet fra dagens åpne heiser og nedfarter. Fnugg beholdes urørt.
- Test konkrete eieropplysninger: 575/1225 moh., 650 m høydeforskjell, 5 km lengste nedfart, 11 nedfarter, 20 km alpint, 6 heiser inklusive 2 i nybegynnerområdet, samt fordelingen 47/9/25/19 prosent etter lengde.
- Ta med øvrige bekreftede anleggsopplysninger uten å gjøre snøproduksjon eller normalt over 150 åpningsdager til garantier.

## 2. Skisenteret
- Oppdater eksisterende faktakort og samle dem under «Bjorli Skisenter i tall», ikke legg til en duplisert faktablokk.
- Presenter resten av faktaene med korte, oversiktlige beskrivelser.
- Vis vanskelighetsfordelingen horisontalt med tekstetiketter og prosenttall; farge blir bare et tillegg.
- Behold løypekart, billettknapper og salgsbetingelser.

## 3. Langrenn
- Oppdater introduksjon og hovedtekst: «over 80 km» i markedsføring, «81 km» i detaljtekst; klassisk og skøyting, skog- og høyfjellsterreng, preparering når forholdene tillater det.
- Beskriv Sygardsløypa og at lyset er på frem til kl. 22.00 hver kveld.
- Lag en nøktern «Støtt løypelaget»-seksjon med formålet, Vipps **508426** og konto **1503.19.64269**. Ingen betalingslenker eller QR-koder.
- Erstatt utdaterte løyper.net-henvisninger i berørte deler med Skiappen for siste registrerte preparering.

## 4. Løypekart og vær
- På løypekartsiden: skill alpint og langrenn tydelig. Behold eksisterende alpinkart og fullstørrelsesvisning; vis korte alpin- og langrennsfakta og språktilpassede lenker til de fullstendige sidene.
- Gjenbruk eksisterende Skiappen-visning og områdelenke på langrennssiden og i kartets langrennsdel, med maksimalt én innebygd Skiappen-visning per side.
- På værsiden: kort introduksjon med 81 km for klassisk og skøyting og lenke til langrennssiden. Behold kart, kilde, hjelpeinformasjon, Skiappen-knapp og eksisterende løypeoversikt. Ingen betaling eller full skisenterfaktablokk her.
- Ingen egen polling, lagring, «Live»-påstand eller timeout-basert skjuling av kartet.

## 5. Motstridende omtaler og første HTML
- Gjennomgå forsiden, vinter, skisenter-, langrenns- og karttekstene, oversettelser, metadata og strukturert informasjon for generelle motstridende tall og ubetinget sesonglovnad.
- Rett bare dokumenterte motsetninger. Behold historiske artikler som historiske og unngå nye fullstendige faktaseksjoner på øvrige sider.
- La prerenderingen bruke samme fakta som de synlige sidene og behold alle eksisterende språklenker og SEO-felt.

## Bilde
Denne meldingen inneholder bare tekstfilen; det omtalte bildet er ikke vedlagt her. Undersøk eksisterende relevante stolheisbilder i prosjektet. Ikke gjett hvilket bilde eieren mener, og ikke bruk alpinbildet til langrenn. Resten av oppgaven er ikke avhengig av et nytt bilde.

## Kontroller og leveranse
- Relevante eksisterende tester og nye konkrete faktatester, inklusive betalingsnumre på alle språk og kartlenkens eksakte adresse.
- Mobil og desktop på alle seks språk, sommer/vinter, lesbarhet, kontrast, tastatur, kartets fullstørrelsesvisning og interne lenker. Automatiske tilgjengelighetstester samt manuell kontroll; ekte skjermleser rapporteres separat dersom den ikke kan utføres.
- Kontroller automatisk byggstatus. Full produksjonsbyggkjede og ferdig prerender-HTML kontrolleres dersom miljøet gjør dette tilgjengelig; ikke rapporter preview-bygg som full produksjonskontroll.
- Samlet rapport: sider og filer endret, dokumenterte rettelser, faktisk utførte tester, resultater og begrensninger. Ingen publisering.

## Tekniske inspeksjons- og endringspunkter
Bekreftede inspeksjonspunkter: `src/pages/SkiCenter.tsx`, `src/lib/cms/skiCenterData.ts`, `src/pages/Langrenn.tsx`, `src/pages/langrennCopy.ts`, `src/pages/Loypekart.tsx`, `src/components/SubPage.tsx`, `src/lib/cms/subpages.ts`, `src/pages/WeatherWebcams.tsx`, `src/pages/Vinter.tsx`, `src/lib/cms/mockAdapter.ts`, `src/i18n/legacyTranslations.ts`, `src/lib/seo/routeSeo.ts` og `scripts/prerender.ts`.

Forventede endringer: relevante side- og tekstkilder ovenfor, en liten delt faktamodul, en gjenbrukbar Skiappen-visning, nødvendige lokale stilregler og målrettede tester. `SubPage` og SEO-filer endres bare dersom undersøkelsen påviser behov. Delte komponentendringer skal ikke påvirke andre sider.

Prosjektet er `/dev-server`, nåværende gren er `main`, og prosjektstatus var ren før planlegging. Miljøet tillater ikke manuell opprettelse/bytte av gren eller push; ingen slik operasjon eller produksjonsdeploy utføres. Eierens faktagrunnlag er registrert som varig redaksjonell kilde.