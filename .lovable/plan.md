# Bytt widget for Webkamera 6

## Omfang
- Erstatt webcam.io-widgeten `JZt3I` med `NJn0t` og de oppgitte parameterne `e: P4dKmP`, `t: 2`.
- Fjern all initialisering og opprydding som er knyttet til den gamle widget-ID-en.
- Behold eksisterende tittel, oversettelser, LIVE-indikator, sporing og plassering etter kamera 1–5.

## Implementering
- Tilpass den eksisterende React-integrasjonen slik at innstillingene opprettes før det nye lasteskriptet settes inn.
- Begrens widgetens synlige område til selve kamerabildet og skjul widgetens undermeny, avspillingskontroller og ekstratekst.
- Match kortets bildeområde, totalhøyde, marger, avrunding og tittelfelt med Webkamera 5 på mobil og desktop.
- Ved demontering fjernes widgetens elementer, skript og globale innstillinger, slik at retur til siden gir nøyaktig én fungerende widget.

## Kontroll
- Kjør TypeScript-kontroll og produksjonsbygg.
- Kontroller lokalt på desktop og mobil at kamera 6 laster, ikke gir horisontal scrolling, og visuelt samsvarer med kamera 1–5.
- Naviger bort og tilbake og bekreft at bildet laster igjen uten dupliserte widgeter eller skript.
- Bekreft at eksisterende kameraer, værvarsel og øvrig sideinnhold er uendret.

## Risiko og avgrensning
- Endringen berører bare komponenten for kamera 6; ingen publisering eller deployoppsett endres.
- webcam.io styrer innholdet inne i sin eksterne iframe. Hvis leverandøren ikke tilbyr kontrollfri visning via `t: 2`, kan innhold inne i iframe ikke skjules sikkert med lokal CSS; dette rapporteres som en ekstern begrensning fremfor å omgå sikkerhetsgrenser.
