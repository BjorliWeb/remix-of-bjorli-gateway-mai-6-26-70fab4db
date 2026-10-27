# Premium alpint design – først på forsiden

Avklart: Det nye designet prøves bare på forsiden (`/` og `/vinter`), for både sommer og vinter. Forsiden får et stort bilde over hele bredden med teksten oppå. Resten av nettstedet beholder dagens design til du har godkjent forsiden. Ingenting publiseres.

## Hva som endres på forsiden
1. **Farger:** Fjellkoks #1F2937 brukes på overskrifter og fjellblå #0F3D7A på knapper og lenker. Isblå #E6EEF5 og sand #F6F2ED gir enkelte rolige flater, og kobber #B07D57 brukes bare som små detaljer. Hvit er hovedbakgrunnen. Den røde knappen erstattes av fjellblå på forsiden. Kontrasten måles og skal holde AA.
2. **Skrift:** Jeg sammenligner Fraunces og Playfair Display med æ, ø og å, lesbarhet og filstørrelse. Den du velger, lastes fra vår egen server (OFL-lisens). Brødtekst, knapper og menyen beholder Mulish. Størrelsene settes etter beskrivelsen: hero 38–46 px på mobil og 56–72 px på desktop.
3. **Hero:** Godkjent bilde over hele bredden, med eyebrow, tittel, ingress, «Kjøp heiskort» og «Finn overnatting» oppå bildet. Teksten får en svak toning bare der den står, slik at fjellet fortsatt synes. Mobilbildet beskjæres med kontroll av hva som synes. Teksten, kjøpslenkene og lenken til sesongkortveiledningen beholdes.
4. **Snarveier:** De fire snarveiene legges i en lys stripe nederst i heroen, som i skissen. Innholdet er det samme som i dag.
5. **Seksjonene:** Kortene får rene kanter, lite skygge, faste bildeforhold og runde pilknapper. Plakater med tekst vises fortsatt hele. Overnatting og «Reisen hit» får en stor bildeflate med fjellblå toning og flere knapper på rad, som «Planlegg ditt opphold» i skissen.
6. **Uendret:** Rekkefølgen på seksjonene, avstandene (48/64/80 px), all tekst og alle språk, alle bilder, lenker, arrangementsreglene og menyen. Toppmeny og footer endres ikke i denne runden, fordi de deles med alle undersider.

## Kontroll
Ved 320, 390, 768, 1024, 1280 og 1440 px, sommer og vinter, norsk og engelsk. Jeg sjekker tastatur, kontrast og sideveis rulling, og du får før- og etterbilder. Testene kjøres på nytt.

## Spørsmål underveis
- Skissen viser «Utforsk Bjorli» og «Se film». Jeg beholder de eksisterende knappene med mindre du sier noe annet.
- Ny tekst fra skissen, som «Store opplevelser i alle årstider», brukes ikke uten din godkjenning.

## Tekniske detaljer
- Forsidefargene legges som HSL-variabler under `.home-alpine` i `src/index.css`, med varianter for `[data-season]`. Wrapperen settes i `Index.tsx`, så undersidene ikke påvirkes.
- Hero-markupen i `Index.tsx` og `scripts/prerender.ts` holdes identisk, slik at første HTML og React-versjonen er like.
- Ny skriftfil kommer i `public/fonts/` med lisens og preload. Den brukes bare på forsiden via `.home-alpine h1, h2`.
- Berørte filer: `Index.tsx`, `PracticalShortcuts.tsx`, `HomepageSections.tsx`, `index.css`, `prerender.ts` og `index.html` (preload).
- Ingen endringer i ruter, metadata, database, analyse eller avhengigheter. Minnet oppdateres når forsiden er godkjent.
