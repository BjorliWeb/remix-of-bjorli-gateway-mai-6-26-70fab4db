# Google og AI-søk: gjennomgang, små rettelser og realistiske søkeord

## Slik står det i dag
Tallene under er Semrush-anslag for norske Google-søk på bjorli.no, ikke målte besøk. Search Console kan ikke leses før prosjektet er publisert.
- bjorli.no rangerer for rundt 750 søkeord og får anslagsvis 10 000 besøk i måneden fra Google.
- Nr. 1 på de viktigste søkene: «bjorli ski» og «bjorli skisenter» (4 400 søk i måneden hver), «webkamera bjorli», «bjorli webcam» (1 000–1 300) og «overnatting bjorli» (210).
- «sagelva» (880 søk) ligger på 4. plass, og «bjorli webcam» rangerer også med forsiden på 4.–6. plass.
- Svakhet: det generelle søket «bjorli» (4 400) lander på **personvernsiden** og kontaktsiden. Det burde vært forsiden.
- Konkurrenter med lite trafikk: bjorli.org, bjorlifjellstuer.no, bjorli-vintercamping.no og nasjonalparkriket.no (størst).

## Hva skanningen fant (ny skanning startet nå)
- Grunnleggende sideinnstillinger og regler for søkeroboter: i orden.
- **Sitemap «ute av takt»:** Dette er en feilmelding. Sitemapen bruker de norske adressene, som /bjorli-skisenter/ og /personvern/. /skisenter, /privacy og lignende er bare gamle adresser som sender videre. Sitemapen endres ikke.
- **AI-sammendraget (llms.txt):** Lenkene står som rene adresser og ikke i formatet AI-verktøy forventer. Dette er en reell, liten mangel.
- **Titler:** 5 av 174 er over 60 tegn (tysk og nederlandsk). Det er en liten, reell mangel.
- Eldre funn om manglende og:url og menyknapp uten navn er allerede rettet i koden.

## Rettelser (små, på ingen måte endring av design)
1. **llms.txt:** Gjør lenkene om til formatet `- [Navn](https://bjorli.no/...): kort beskrivelse`. Innhold og fakta er uendret. Også `llms-full.txt` kontrolleres.
2. **Fem lange titler** på tysk og nederlandsk forkortes til høyst 60 tegn uten å miste stedsnavn. Endringene gjøres i `routeSeo.ts`, og de nye titlene vises før lagring.
3. **«bjorli» lander på personvernsiden:** Jeg undersøker hvorfor, for eksempel om personvernsiden mangler `noindex` eller har en for generell tittel. Jeg foreslår en rettelse, men gjør den først etter at du har godkjent den, fordi den berører hvordan sider indekseres.
4. Testene og bygget kjøres. Ingen publisering.

## Hva dere realistisk kan rangere for
- **Beholde og styrke:** skisenter, webkamera, overnatting og heiskort. Der er dere allerede nr. 1.
- **Løfte fra side 1 til topp 3:** «sagelva» via sagelvasiden, og «bjorli webcam» ved å sende flere interne lenker til siden for vær og webkamera.
- **Nye, små nisjer med lav konkurranse:** «ting å gjøre på Bjorli», fotturer, sykling, fiske, Golden Train og «Bjorli sommer». Lav konkurranse betyr ikke at dette kommer raskt.
  - Volumene sjekker jeg med Semrush før vi skriver noe. Alle fakta må kunne spores til en kilde.
- Søkene på engelsk, tysk og nederlandsk er små. Der er det mest verdifullt med riktige titler og sammendrag.
