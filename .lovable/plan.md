# Skiappen-kart i «Langrenn og løypekart»

## Funnet før planen
- Skiappen har ingen offisiell embed-løsning, verken i dokumentasjonen eller på info-sidene.
- Områdelenken (`skiappen.no/?lat=62.25418&lng=8.25897&zoom=11`) svarer uten X-Frame-Options og uten CSP `frame-ancestors`. Skiappen sperrer altså ikke innbygging.
- Vår egen sikkerhetspolicy (`frame-src`) tillater i dag bare Cloudflare, ipcamlive, Google og webcam.io. Derfor må skiappen.no legges til eksplisitt der.

## Endringer (bare denne seksjonen, alle seks språk)
1. Begge loyper.net-knappene («Se løypestatus» og «Se løypekart») og teksten «loyper.net, åpnes i ny fane» fjernes.
2. Ny tekst: «Bjorli har langrennsløyper i variert høyfjells- og skogsterreng. Se løypene i kartet og sjekk når de sist ble preparert.» Teksten oversettes naturlig til en, de, nl, da og sv.
3. Kartet legges inn under teksten, i full bredde innenfor innholdsrammen:
   - 600 px høyt på desktop og 480 px på mobil.
   - Avrundet ramme som resten av siden.
   - Det lastes først når besøkende kommer ned til seksjonen.
   - Tittel: «Langrennsløyper og prepareringsstatus på Bjorli fra Skiappen» (oversatt).
   - Kartet får ikke tillatelse til å be om posisjonen din.
4. Under kartet står kildeteksten: «Kart og prepareringsstatus leveres av Skiappen. Fargene viser tid siden siste registrerte preparering.»
5. Knappen «Åpne stort kart i Skiappen» står der alltid. Den åpner områdelenken i ny fane, og skjermlesere får beskjed om at den åpner en ny fane.
6. Hvis kartet likevel ikke kan vises (blokkert eller feil), vises ingen tom ramme. Da står bare knappen «Se løypekart og preparering i Skiappen».
7. Alpinkartet, webkameraene, værvarselet og Fnugg forblir uendret.
8. Ingen egen lagring, kopiering av data, «Live»-merke eller faste prepareringstider.

## Kontroller
- I nettleseren, fra nettstedets egen adresse: kartet vises, starter med oversikt over Bjorli, og zoom, panorering, løypedetaljer og tegnforklaring virker. Kontrolleres på mobil (390 px) og desktop.
- Ingen sideveis rulling.
- Tastatur: synlig fokus på knappen.
- loyper.net er borte fra seksjonen.
- Reserveknappen virker når kartet er blokkert.
- Tester, produksjonsbygg og axe WCAG 2.1 AA.
- Ingen publisering.

## Tekniske detaljer
- `src/pages/WeatherWebcams.tsx`: `langrennStatusCta`, `langrennMapCta` og `externalNewTab` erstattes med `langrennMapTitle`, `langrennAttribution`, `langrennOpenCta` og `langrennFallbackCta` i alle seks COPY-språk. Kartet legges inn med `<iframe loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen">`, uten `geolocation`. Høyden settes med `h-[480px] md:h-[600px]`.
- `scripts/build-deploy-headers.ts`: `https://skiappen.no https://www.skiappen.no` legges til i `frame-src`. Policyen svekkes ellers ikke.
- Reservevisning: om iframen ikke har lastet innen rimelig tid, skjules rammen og bare reserveknappen vises. Ordinær nettleserblokkering kan ikke alltid oppdages pålitelig, og det oppgis som begrensning dersom testen viser det.
