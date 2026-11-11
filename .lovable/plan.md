# Søket «bjorli»: forsiden skal være hovedresultatet

## Hva som er dokumentert så langt (lest 11.11.2026)
**Semrush, norsk database, nåværende øyeblikksbilde.** Semrush oppgir ingen eksakt måledato. Tallene er anslag, ikke målt trafikk, og ikke et sikkert bilde av Googles resultat i dag.
- «bjorli» (anslagsvis 4 400 søk/mnd): **posisjon 1 = /personvern/** og **posisjon 8 = /kontakt/**. Forsiden står ikke oppført for dette søket.
- Forsiden er nr. 1 på «bjorli ski» og «bjorli skisenter». Flere adresser fra oss rangerer altså samtidig.
- Semrush skiller ikke mellom hovedresultat og underlenker under hovedresultatet. En mulig forklaring er at personvernsiden er registrert som en underlenke. Det er en **hypotese**.

**Produksjon, første HTML fra bjorli.no:**
| Adresse | Status | Tittel | Canonical | Robots | H1 |
|---|---|---|---|---|---|
| / | 200 | «Bjorli – snøsikkert skisenter og fjellferie hele året» | https://bjorli.no/ | ingen (indekserbar) | «Snøsikre skidager for hele familien» |
| /personvern/ | 200 | «Personvern \| Bjorli» | egen adresse | ingen | «Personvern \| Bjorli» |
| /kontakt/ | 200 | «Kontakt – Destinasjon Bjorli» | egen adresse | ingen | «Kontakt Destinasjon Bjorli» |

- Ingen X-Robots-Tag noe sted. www og http sender videre med 301.
- Alle tre sidene har 7 hreflang-lenker og eget innhold i første HTML (forsiden 302 ord).
- **Ingen verifisert teknisk feil er funnet ennå.** Funn som er verdt å se nærmere på:
  - Forsidens H1 inneholder ikke ordet «Bjorli».
  - Personvernsidens H1 er lik tittelen («Personvern | Bjorli»).

## Undersøkelser som gjenstår (steg 1)
1. **Ferdig rendret side** i nettleser for de tre adressene. Jeg ser etter om tittel, canonical, robots eller hreflang endres etter lasting. Jeg sjekker også om logo og «Hjem» peker til https://bjorli.no/.
2. **Sesongbytte:** Jeg sammenligner sommer- og vinterversjonen av forsiden, både i prerender og etter lasting, for ulike titler, beskrivelser, H1 eller canonical.
3. **Fallback:** Jeg kontrollerer at 404-siden og sidene som kun er app-skall ikke bruker forsidens metadata eller canonical.
4. **Sitemap:** Jeg kontrollerer at /, /personvern/ og /kontakt/ står med kanonisk adresse og riktige hreflang-alternativer.
5. **Search Console:** Lovable har ikke tilgang i dag, fordi prosjektet ikke er koblet og Lovable-versjonen ikke er publisert. Det betyr ikke at data mangler i Google. Jeg kan tilby å koble til Search Console:
   - Jeg filtrerer på det eksakte søket «bjorli» og sammenligner siste 28 dager med perioden før: klikk, visninger, CTR og posisjon per landingsside.
   - Jeg ser på indekseringsstatus og Googles valgte canonical for forsiden.
   - Uten tilgang trekker jeg ingen konklusjon om Googles canonical.

## Rettelser (steg 2, bare ved dokumentert behov)
- Hvis det blir funnet en feil i metadata, rendering, canonical, robots eller hjemlenker, rettes den der den oppstår, i prerender eller React.
- **Forslag, vises før endring:**
  - Forsidens H1 bør nevne Bjorli tydelig, for eksempel «Bjorli – snøsikre skidager for hele familien». Sommerversjonen får tilsvarende. Teksten ellers og designet beholdes, på alle seks språk.
  - Personvernsiden får H1 «Personvern» i stedet for å gjenta tittelen.
- **Ikke:**
  - canonical eller omdirigering fra kontakt eller personvern til forsiden
  - noindex på kontakt
  - noindex på personvern som automatisk løsning (det er et eget valg du tar)

## Verifisering
- Tester og produksjonsbygg kjøres. Jeg kontrollerer første HTML og ferdig rendret side etter endringen.
- Leveres: dokumentert årsak (eller at den ikke kan fastslås), endringer som er gjort, gjenværende hypoteser og kontroller etter publisering:
  - URL-inspeksjon av forsiden i Search Console
  - ny Semrush-måling om 2–4 uker
- Ingen publisering, og ingen endring i design eller annet innhold.

## Den tidligere SEO-gjennomgangen (beholdes)
- llms.txt får lenker i riktig format.
- Fem tyske og nederlandske titler forkortes til høyst 60 tegn.
- Feilmeldingen fra skanningen om at sitemapen er ute av takt avvises: sitemapen er riktig, og /skisenter, /privacy og lignende er bare gamle adresser som sender videre.
