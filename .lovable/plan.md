# Kjøpsveiledning for sesongkort

## Mål
Ha klar en hjelpelenke og et dialogvindu med en steg-for-steg-karusell. Veiledningen skal være skjult for besøkende til innholdet er levert og godkjent.

## Plassering
- **Forsiden (vinter-hero):** En diskret lenke med et lite avspillingsikon rett under «Kjøp heiskort»: «Slik kjøper du sesongkort». Kjøpsknappen går fortsatt rett til nettbutikken.
- **Skisentersiden:** I den eksisterende heiskort-boksen, rett under kjøpsknappen: «Trenger du hjelp? Se hvordan du kjøper sesongkort.» Det blir ingen ny seksjon.
- Lenkene vises bare på norsk, og bare når veiledningen er slått på.

## Dialogvindu
- Tittel: «Slik kjøper du sesongkort». Introduksjon: «Følg kjøpet steg for steg i Bjorlis nettbutikk.»
- Et område for karusellen, en tydelig lukkeknapp og knappen «Kjøp sesongkort» nederst. Knappen går til `https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4966`.
- På mobil fyller dialogen nesten hele skjermen, med rulling inni og navigasjonen alltid synlig. På desktop får den en maksimal bredde på omtrent 720 px.

## Karusell
- Hvert steg har tittel, forklaringstekst og et bilde eller en video. Bildet vises helt, uten beskjæring.
- Hvert steg kan ha egen lyd. Den spiller bare når kunden trykker «Spill av forklaring», og kan pauses og spilles på nytt.
- Navigasjon med «Forrige», «Neste» og «Steg X av Y».
- Lyd og video stopper når kunden bytter steg eller lukker dialogen.
- Uten animasjoner. Ved redusert bevegelse er det ingen overganger.

## Innhold og aktivering
- Stegene ligger i én innholdsfil, som er tom nå. Lenkene vises først når det finnes godkjente steg.
- **Videoen du lastet opp (Facebook-reel med stemme):** Jeg kan ikke se eller høre videoen, så jeg bruker den ikke som ferdig innhold. Den kan legges inn som video i et steg når du har bekreftet tre ting: at den viser riktig kjøp av sesongkort, at den er godkjent, og at den har en undertekstfil (.vtt) med teksten til stemmen.

## Tilgjengelighet (WCAG 2.0 AA)
Dialogen bygger på nettstedets eksisterende dialogkomponent. Den gir fokus inn i dialogen ved åpning, holder fokus i dialogen, lukker med Escape, sender fokus tilbake til lenken og gjør bakgrunnen inaktiv. Den har også et tilgjengelig navn og synlig fokus. Kontrasten blir minst 4,5:1, og lyden har alltid tekst ved siden av.

## Kontroll
- Tester for to regler: at lenkene er skjult uten godkjente steg, og at kjøpsknappen går til riktig adresse.
- Midlertidig test med prøvesteg på mobil og desktop: tastatur, Escape, fokusretur, mediestopp ved steg-bytte og lukking, og kjøpslenken.
- Bygg og typesjekk. Ingen endringer i innlogging, backend, Cloudflare eller GA4. Ingen publisering.

## Teknisk
- Nye filer: `src/lib/seasonPassGuide.ts` (Node-safe stegdata og `isGuideEnabled(locale)`), `src/components/SeasonPassGuide.tsx` (Dialog fra shadcn + karusell), `seasonPassGuide.test.ts`.
- Hjelpelenkene legges inn i `src/pages/Index.tsx` (hero) og `src/pages/SkiCenter.tsx` (liftPass-boksen). Prerender endres ikke, fordi lenkene er skjult.
- Lyd og video håndteres med refs. `pause()` og `currentTime = 0` kjøres ved steg-bytte og når dialogen lukkes.

## Det som trengs for å aktivere
For hvert steg: tittel, forklaringstekst, et skjermbilde med alt-tekst (eller video med .vtt-undertekster), eventuelt en lydfil (mp3) og en godkjenning fra eier.
