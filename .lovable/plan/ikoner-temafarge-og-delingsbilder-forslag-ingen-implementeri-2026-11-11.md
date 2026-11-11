# Ikoner, temafarge og delingsbilder – forslag (ingen implementering ennå)

## Hva jeg fant (lest nå)
- `favicon.jpeg` og `apple-touch-icon.jpeg`: identiske, 224 × 224 JPEG. Det er for lite til PWA (som trenger 512) og ikke 180 til Apple. JPEG gir heller ikke gjennomsiktighet.
- `manifest.json`: ett JPEG-ikon med `sizes: "any"`, og det er feil for rastergrafikk. Mangler 192, 512 og maskable.
- Temafarge: `#001d28` i index.html og prerender, men `#1a3a4a` i manifest. Ingen av dem er den godkjente fjellblå fargen #172D45.
- `public/og/`: alle seks er 1200 × 630 JPEG (200–325 KB, under WhatsApp-grensen). home = sommer og skisenter = vaer-og-webkamera er identiske.
- Rettelse: komponenten heter `PageMeta.tsx` (ikke SEOHead.tsx). Bildevalg for hver side skjer i `routeSeo.ts`, og CMS kan overstyre med `ogImage` eller hero-bildet.

## Steg 1 – Visuell oversikt (første steg etter godkjenning, før jeg endrer noe)
Jeg lager ett oversiktsark i `/mnt/documents/ikoner-og-deling/` med:
- Dagens ikon i 16, 32, 180 og 512 px, slik det ser ut i fanen, i bokmerket og på hjemskjermen
- Alle seks delingsbilder med dimensjon, størrelse og hvilke sider som bruker dem
- Min vurdering av hvert motiv: om det er lesbart som lite ikon, og om det passer sesongen og siden

## Steg 2 – Forslag til ikonsett (utkast, vises før det tas i bruk)
Kilden er den offisielle logoen `src/assets/bjorli-logo.jpeg`. Den tegnes aldri på nytt.
- `favicon.ico` (16/32/48)
- `favicon.svg` **bare** hvis det finnes en offisiell vektorlogo. Det har jeg ikke funnet, så den lages ikke.
- `apple-touch-icon.png` 180 × 180, med tett bakgrunn
- `icon-192.png`, `icon-512.png`
- `icon-maskable-512.png` med logoen innenfor sikker sone (80 %) på fjellblå bakgrunn
- PNG i stedet for JPEG. Dagens JPEG-filer blir liggende, slik at gamle bokmerker fortsatt virker.

## Steg 3 – Én temafarge
Forslag: **#172D45 (fjellblå)**. Den er den godkjente vinterfargen og samme farge som toppmenyen. Den brukes i index.html, prerender og manifest (`theme_color` og `background_color`).

## Steg 4 – Delingsbilder: bare reelle mangler
- Jeg kontrollerer i den ferdig bygde siden at `og:image` og `twitter:image` er absolutte adresser og peker til riktig fil på alle seks språk.
- Identiske bilder kan være en reell mangel: sommer deler bilde med forsiden, og vær/webkamera deler bilde med skisenteret. Jeg foreslår et eget bilde **bare** hvis et eksisterende foto fra samme side passer bedre. Jeg viser forslaget som før/etter. Ingen nye genererte bilder.
- Det som fungerer, og CMS-overstyringen, beholdes uendret.

## Steg 5 – Før/etter-forslag
Jeg lager eksempler på:
- fane og bokmerke på desktop
- hjemskjerm på iOS og Android, inkludert maskable-ikonet
- lenkekort for Facebook, X og iMessage på desktop og mobil

Deretter stopper jeg for godkjenning.

## Etter godkjenning (egen runde)
- Ikonfilene legges i `public/`
- index.html, prerender og manifest oppdateres
- Endringene for delingsbilder i `routeSeo.ts` (hvis noen) gjøres
- Jeg kontrollerer det ferdige bygget: at filene finnes, MIME-type (`_headers` ved behov), dimensjoner og referanser
- Testene kjøres

## Begrensninger
- Ingen nye avhengigheter: Pillow/ImageMagick finnes allerede i sandkassen.
- Ingen endring i design, språk, canonical, hreflang eller redirects.
- `sw.js` røres ikke.
- Ingen publisering.
