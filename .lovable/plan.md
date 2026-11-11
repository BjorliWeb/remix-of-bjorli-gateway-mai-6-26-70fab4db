# Kontroll: tester, produksjonsbygg og ny adresse for vinterbildet (ingen publisering)

## Hva som kontrolleres
1. **Tester:** Hele testsettet kjøres (`vitest run`). Jeg rapporterer hvor mange som består, hoppes over og feiler.
2. **Produksjonsbygg:** Det vanlige bygget kjøres, inkludert prerender og sitemap.
   - Hvis bygget stopper fordi backend begrenser antall forespørsler (HTTP 429), slik det skjedde tidligere, venter jeg 60 sekunder og prøver én gang til. Så rapporterer jeg resultatet.
3. **Ny bildeadresse for vinterheroen** (`src/assets/hero-winter.jpg`):
   - Den forrige bygde versjonen tas vare på i `/tmp` før det nye bygget.
   - Jeg sammenligner filnavnet på vinterbildet i forsidens HTML, i `dist/assets` og i `<link rel="preload">`. Det skal være ulikt før og etter.
   - Gjenstår det ikke noe tidligere bygg, sammenligner jeg i stedet med en versjon bygget fra den forrige bildefilen. Hvis det heller ikke er mulig, oppgir jeg det.
4. **Andre bilder beholder adressen:** Jeg lister alle bildefiler i `dist/assets`, `public/og` og ikonene, med hash, og sammenligner før og etter. Bare vinterbildet skal ha endret navn.
5. **Kontroll i bygget:** Jeg sjekker at den nye bildefilen finnes, er JPEG og har samme oppløsning som originalen. Jeg sjekker også at forsiden og `/vinter` på alle seks språk peker til den.

## Rapport
Til slutt rapporterer jeg testresultatet, byggresultatet, gammel og ny bildeadresse og en liste over eventuelle andre bilder som har endret seg. Jeg sier tydelig hvis noe ikke ble kontrollert.

## Ikke med i denne runden
- Ingen publisering og ingen kodeendringer.
- Oppgaven i den opplastede teksten (spisestedene, nyhetsartikkelen om vinterprogrammet, egne kalenderarrangementer og flere kategorier per arrangement) og de fire bildene tas som egen plan etterpå.
