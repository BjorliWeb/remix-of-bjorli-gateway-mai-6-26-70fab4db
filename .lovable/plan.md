# Fjern Bjorli-logoen fra vinterens hero-bilde

## Funn
- Logoen er brent inn i selve bildefilen, nederst til høyre (ca. x 1690–1820, y 930–1010 av 1920×1079). Den er ikke et eget element på siden.
- Bildet brukes av vinterforsiden på både desktop og mobil, i den første siden som lastes inn, og på den interne sammenligningssiden for hero-bilder.
- Sommerens hero bruker et annet bilde og berøres ikke.

## Fremgangsmåte
1. Lag en maske over bare logoområdet, med litt margin. Fyll inn snøen med en endring som bare rører det maskerte feltet («inpaint»). Alle andre piksler blir som før.
2. Kontroller resultatet:
   - størrelsen er fortsatt 1920×1079, og utsnittet er det samme
   - pikslene utenfor masken er de samme som før (pikselsammenligning)
   - ingen synlige spor: forstørret utsnitt før og etter
3. Erstatt bildefilen på samme sted og med samme navn. Da trenger ikke kode, layout og prerendering å endres.
4. Ta skjermbilder av vinterforsiden på desktop (1440 px) og mobil (390 px), og vis før og etter. Bygg og tester kjøres.

## Ikke endret
Design, layout, tekst, knapper, sommerens hero og alle andre bilder. Ingen beskjæring. Ingen publisering.
