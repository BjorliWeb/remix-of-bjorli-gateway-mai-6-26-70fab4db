import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, Store, MapPin, Zap, ExternalLink, Utensils, ArrowRight, Hammer } from 'lucide-react';
import FaqBlock from '@/components/seo/FaqBlock';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';
import { trackExternalPartnerClick } from '@/lib/analytics';

const heroImg = images.resortEntrance.src;

type Section = { title: string; subtitle: string; body: string };
type Copy = {
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  intersport: Section & { linkLabel: string };
  bunnpris: Section & { evNote: string; bunnprisLink: string; evinyLink: string; teslaLink: string };
  lunt: Section & { linkLabel: string };
  xlbygg: Section & { linkLabel: string };
  larger: { title: string; body: string };
  practicalTitle: string;
  practicalItems: string[];
  foodTeaser: { title: string; body: string; linkLabel: string };
  faqTitle: string;
  faq: { q: string; a: string }[];
};

const COPY: Record<Locale, Copy> = {
  no: {
    heroTitle: 'Handel på Bjorli',
    heroSubtitle: 'Sportsutstyr, skiutleie, dagligvarer, lokale butikker og lading — det meste du trenger på samme sted.',
    intro: 'På Bjorli finner du det meste du trenger gjennom oppholdet, enten du skal i bakken, på hytta, handle mat eller bare ordne praktiske ærend. Her er en oversikt over sportsbutikk, dagligvarer, lokale butikker, lading og større handel i nærheten.',
    intersport: { title: 'Sportsutstyr, skiutleie og skiskole', subtitle: 'Sportsbutikk i velkomstsenteret', body: 'Sportsbutikken inne i velkomstsenteret drives av Intersport Ålesund. Her finner du sportsutstyr, kjente merker og service rett ved bakken. Herfra drives også skiutleie og skiskole.', linkLabel: 'Se Intersport Bjorli' },
    bunnpris: { title: 'Dagligvarer og praktiske ærend', subtitle: 'Dagligvarer, Post i Butikk og søndagsåpent', body: 'Bunnpris på Bjorli er åpen 7 dager i uka og ligger omtrent 400 meter fra skisenteret. Her får du dagligvarer, søndagsåpent og Post i Butikk.', evNote: 'Ved Bunnpris finner du også hurtiglading for elbil med Eviny, og det står Tesla Superchargers ved Bjorli.', bunnprisLink: 'Se Bunnpris Bjorli', evinyLink: 'Se Eviny hurtigladere', teslaLink: 'Se Tesla Supercharger Bjorli' },
    lunt: { title: 'Lokale butikker', subtitle: 'Interiør og gaver', body: 'Bjorli har også lokale butikker med blant annet klær, interiør og gaver. Lunt er en av butikkene som gir handelstilbudet på Bjorli litt ekstra.', linkLabel: 'Se Lunt Bjorli på Facebook' },
    xlbygg: { title: 'Byggevarer og oppussing', subtitle: 'Byggvarehus på Bjorli', body: 'XL-BYGG Bjorli er det lokale byggvarehuset på Bjorli og et nyttig stopp for hyttefolk og fastboende som trenger byggevarer, verktøy eller utstyr til hytteprosjekter. Sjekk butikkens egne kanaler for oppdatert utvalg og åpningstider.', linkLabel: 'Se XL-BYGG Bjorli' },
    larger: { title: 'Større innkjøp', body: 'Trenger du et større utvalg butikker, ligger både Dombås og Åndalsnes omtrent 50 km unna med bil. Der finner du flere butikker og tjenester for de større innkjøpene.' },
    practicalTitle: 'Praktisk informasjon',
    practicalItems: ['Åpningstider og tilbud kan variere gjennom året med sesong, helligdager og lokal drift.', 'Sjekk alltid butikkens egne kanaler for oppdatert informasjon før du planlegger besøket.', 'Enkelte tjenester følger skisesongen eller lokal etterspørsel.'],
    foodTeaser: { title: 'Mat og drikke på Bjorli', body: 'Ser du etter kafé, lunsj, lounge eller afterski? Se oversikten over mat og drikke på Bjorli, inkludert Heiskroa, T-Kroken og andre spisesteder i området.', linkLabel: 'Se mat og drikke' },
    faqTitle: 'Ofte stilte spørsmål',
    faq: [
      { q: 'Hvor kan jeg kjøpe sportsutstyr på Bjorli?', a: 'Intersport Bjorli ligger i velkomstsenteret ved skisenteret og drives av Intersport Ålesund. Her finner du sportsutstyr og kjente merker rett ved bakken.' },
      { q: 'Hvor kan jeg leie ski?', a: 'Skiutleie drives fra Intersport Bjorli i velkomstsenteret, like ved bakken.' },
      { q: 'Finnes det dagligvarebutikk på Bjorli?', a: 'Ja. Bunnpris Bjorli ligger omtrent 400 meter fra skisenteret og har dagligvarer og Post i Butikk.' },
      { q: 'Er det søndagsåpent på Bjorli?', a: 'Bunnpris Bjorli er åpen 7 dager i uka med søndagsåpent. Sjekk butikkens egne kanaler for oppdaterte åpningstider.' },
      { q: 'Finnes det elbillading på Bjorli?', a: 'Ja. Ved Bunnpris er det hurtiglading, og det finnes også Tesla Superchargers i området.' },
      { q: 'Finnes det lokale butikker på Bjorli?', a: 'Ja. Bjorli har lokale butikker med blant annet klær, interiør og gaver. Lunt Bjorli er ett av tilbudene. Utvalg og åpningstider kan variere gjennom året — sjekk butikkens egne kanaler før du besøker.' },
    ],
  },
  en: {
    heroTitle: 'Shopping in Bjorli',
    heroSubtitle: 'Sports gear, ski rental, groceries, local shops and charging — most of what you need in one place.',
    intro: 'Bjorli has most of what you need during your stay — whether you’re heading to the slopes, the cabin, the grocery store or just running errands. Here’s an overview of the sports shop, groceries, local shops, EV charging and bigger shopping nearby.',
    intersport: { title: 'Sports gear, ski rental and ski school', subtitle: 'Sports shop in the welcome centre', body: 'The sports shop inside the welcome centre is run by Intersport Ålesund. You’ll find equipment, well-known brands and service right next to the slopes. Ski rental and the ski school are run from here too.', linkLabel: 'Visit Intersport Bjorli' },
    bunnpris: { title: 'Groceries and everyday errands', subtitle: 'Groceries, post office counter and Sunday opening', body: 'Bunnpris in Bjorli is open seven days a week and sits about 400 metres from the ski resort. You’ll find groceries, Sunday opening and an in-store post counter.', evNote: 'Bunnpris also has Eviny fast chargers for electric cars, and Tesla Superchargers are available at Bjorli too.', bunnprisLink: 'Visit Bunnpris Bjorli', evinyLink: 'See Eviny fast chargers', teslaLink: 'See Tesla Supercharger Bjorli' },
    lunt: { title: 'Local shops', subtitle: 'Interior and gifts', body: 'Bjorli has local shops with clothes, interior pieces and gifts. Lunt is one of those small spots that gives Bjorli’s shopping a bit of extra character.', linkLabel: 'See Lunt Bjorli on Facebook' },
    xlbygg: { title: 'Building materials and DIY', subtitle: 'Builders’ merchant in Bjorli', body: 'XL-BYGG Bjorli is the local builders’ merchant and a handy stop for cabin owners and residents who need materials, tools or supplies for cabin projects. Check the store’s own channels for the latest range and hours.', linkLabel: 'Visit XL-BYGG Bjorli' },
    larger: { title: 'Larger shopping trips', body: 'If you need a wider selection of shops, both Dombås and Åndalsnes are around 50 km away by car. You’ll find more stores and services there for bigger shopping trips.' },
    practicalTitle: 'Practical information',
    practicalItems: ['Opening hours and offers vary through the year with season, holidays and local operations.', 'Always check the store’s own channels for current information before you go.', 'Some services follow the ski season or local demand.'],
    foodTeaser: { title: 'Food and drink in Bjorli', body: 'Looking for a café, lunch, lounge or après-ski? See the overview of food and drink in Bjorli, including Heiskroa, T-Kroken and other places to eat in the area.', linkLabel: 'See food and drink' },
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Where can I buy sports equipment in Bjorli?', a: 'Intersport Bjorli is in the welcome centre at the ski resort and is run by Intersport Ålesund. You’ll find sports gear and well-known brands right next to the slopes.' },
      { q: 'Where can I rent skis?', a: 'Ski rental is run from Intersport Bjorli in the welcome centre, right next to the slopes.' },
      { q: 'Is there a grocery store in Bjorli?', a: 'Yes. Bunnpris Bjorli is about 400 metres from the ski resort and carries groceries plus an in-store post counter.' },
      { q: 'Is anything open on Sundays in Bjorli?', a: 'Bunnpris Bjorli is open seven days a week, with a Sunday opening. Check the store’s own channels for current hours.' },
      { q: 'Is there EV charging in Bjorli?', a: 'Yes. There are fast chargers by Bunnpris, and you’ll also find Tesla Superchargers in the area.' },
      { q: 'Are there local shops in Bjorli?', a: 'Yes. Bjorli has local shops with clothes, interior pieces and gifts. Lunt Bjorli is one of them. Selection and opening hours can vary through the year — check the shop’s own channels before visiting.' },
    ],
  },
  de: {
    heroTitle: 'Einkaufen in Bjorli',
    heroSubtitle: 'Sportausrüstung, Skiverleih, Lebensmittel, lokale Geschäfte und Laden — das Wichtigste an einem Ort.',
    intro: 'In Bjorli finden Sie das meiste, was Sie während Ihres Aufenthalts brauchen — egal ob für die Piste, die Hütte, den Wocheneinkauf oder kleine Besorgungen. Hier ein Überblick über Sportgeschäft, Lebensmittel, lokale Läden, E-Laden und größere Einkäufe in der Nähe.',
    intersport: { title: 'Sportausrüstung, Skiverleih und Skischule', subtitle: 'Sportgeschäft im Welcome Center', body: 'Das Sportgeschäft im Welcome Center wird von Intersport Ålesund betrieben. Sie finden Ausrüstung, bekannte Marken und Service direkt an der Piste. Skiverleih und Skischule werden ebenfalls von hier aus organisiert.', linkLabel: 'Zu Intersport Bjorli' },
    bunnpris: { title: 'Lebensmittel und tägliche Besorgungen', subtitle: 'Lebensmittel, Postschalter und Sonntagsöffnung', body: 'Bunnpris in Bjorli hat sieben Tage die Woche geöffnet und liegt etwa 400 Meter vom Skigebiet entfernt. Hier gibt es Lebensmittel, Sonntagsöffnung und einen Postschalter im Geschäft.', evNote: 'Bei Bunnpris gibt es zusätzlich Schnellladesäulen für E-Autos von Eviny, und in Bjorli stehen auch Tesla Supercharger.', bunnprisLink: 'Zu Bunnpris Bjorli', evinyLink: 'Eviny-Schnelllader ansehen', teslaLink: 'Tesla Supercharger Bjorli ansehen' },
    lunt: { title: 'Lokale Geschäfte', subtitle: 'Interieur und Geschenke', body: 'In Bjorli gibt es auch lokale Geschäfte mit Kleidung, Wohnaccessoires und Geschenken. Lunt ist eines der Geschäfte, die dem Einkaufsangebot in Bjorli etwas mehr Charakter geben.', linkLabel: 'Lunt Bjorli auf Facebook ansehen' },
    xlbygg: { title: 'Baustoffe und Renovierung', subtitle: 'Baumarkt in Bjorli', body: 'XL-BYGG Bjorli ist der lokale Baumarkt und ein praktischer Stopp für Hütteneigentümer und Einheimische, die Baustoffe, Werkzeug oder Material für Projekte brauchen. Aktuelle Verfügbarkeit und Öffnungszeiten in den Kanälen des Geschäfts prüfen.', linkLabel: 'Zu XL-BYGG Bjorli' },
    larger: { title: 'Größere Einkäufe', body: 'Brauchen Sie eine größere Auswahl an Geschäften, liegen Dombås und Åndalsnes jeweils rund 50 km entfernt mit dem Auto. Dort finden Sie weitere Geschäfte und Dienstleistungen für größere Einkäufe.' },
    practicalTitle: 'Praktische Informationen',
    practicalItems: ['Öffnungszeiten und Angebote können sich je nach Saison, Feiertagen und lokalem Betrieb ändern.', 'Aktuelle Informationen am besten in den Kanälen des jeweiligen Geschäfts prüfen.', 'Einige Dienste richten sich nach der Skisaison oder der lokalen Nachfrage.'],
    foodTeaser: { title: 'Essen und Trinken in Bjorli', body: 'Auf der Suche nach Café, Mittagessen, Lounge oder Après-Ski? Hier finden Sie eine Übersicht über Essen und Trinken in Bjorli, darunter Heiskroa, T-Kroken und weitere Lokale in der Umgebung.', linkLabel: 'Essen und Trinken ansehen' },
    faqTitle: 'Häufige Fragen',
    faq: [
      { q: 'Wo kann ich in Bjorli Sportausrüstung kaufen?', a: 'Intersport Bjorli befindet sich im Welcome Center am Skigebiet und wird von Intersport Ålesund betrieben. Sie finden Sportausrüstung und bekannte Marken direkt an der Piste.' },
      { q: 'Wo kann ich Ski mieten?', a: 'Der Skiverleih wird von Intersport Bjorli im Welcome Center betrieben, direkt an der Piste.' },
      { q: 'Gibt es in Bjorli einen Lebensmittelladen?', a: 'Ja. Bunnpris Bjorli liegt rund 400 Meter vom Skigebiet entfernt und führt Lebensmittel sowie einen Postschalter.' },
      { q: 'Hat in Bjorli sonntags etwas geöffnet?', a: 'Bunnpris Bjorli hat sieben Tage die Woche geöffnet, mit Sonntagsöffnung. Aktuelle Zeiten in den Kanälen des Geschäfts prüfen.' },
      { q: 'Gibt es Lademöglichkeiten für E-Autos in Bjorli?', a: 'Ja. Bei Bunnpris stehen Schnelllader, und in der Umgebung gibt es auch Tesla Supercharger.' },
      { q: 'Gibt es in Bjorli lokale Geschäfte?', a: 'Ja. Bjorli hat lokale Geschäfte mit Kleidung, Wohnaccessoires und Geschenken. Lunt Bjorli ist eines davon. Angebot und Öffnungszeiten können variieren — vor dem Besuch bitte die eigenen Kanäle prüfen.' },
    ],
  },
  nl: {
    heroTitle: 'Winkelen in Bjorli',
    heroSubtitle: 'Sportuitrusting, skiverhuur, boodschappen, lokale winkels en laden — het meeste vind je op één plek.',
    intro: 'In Bjorli vind je het meeste wat je tijdens je verblijf nodig hebt — of je nu de piste op gaat, naar de hut, boodschappen doet of even iets praktisch wilt regelen. Hier vind je een overzicht van de sportwinkel, boodschappen, lokale winkels, laden en groter winkelen in de omgeving.',
    intersport: { title: 'Sportuitrusting, skiverhuur en skischool', subtitle: 'Sportwinkel in het welkomstcentrum', body: 'De sportwinkel in het welkomstcentrum wordt gerund door Intersport Ålesund. Je vindt uitrusting, bekende merken en service vlak naast de piste. Skiverhuur en de skischool zijn ook hier ondergebracht.', linkLabel: 'Bekijk Intersport Bjorli' },
    bunnpris: { title: 'Boodschappen en dagelijkse dingen', subtitle: 'Boodschappen, postpunt en zondag open', body: 'Bunnpris in Bjorli is zeven dagen per week open en ligt op ongeveer 400 meter van het skigebied. Je vindt er boodschappen, zondagopening en een postpunt in de winkel.', evNote: 'Bij Bunnpris staan ook Eviny-snelladers voor elektrische auto’s, en bij Bjorli vind je Tesla Superchargers.', bunnprisLink: 'Bekijk Bunnpris Bjorli', evinyLink: 'Bekijk Eviny-snelladers', teslaLink: 'Bekijk Tesla Supercharger Bjorli' },
    lunt: { title: 'Lokale winkels', subtitle: 'Interieur en cadeaus', body: 'Bjorli heeft ook lokale winkels met onder andere kleding, interieur en cadeaus. Lunt is een van die plekken die het winkelaanbod in Bjorli net wat persoonlijker maken.', linkLabel: 'Bekijk Lunt Bjorli op Facebook' },
    xlbygg: { title: 'Bouwmateriaal en klussen', subtitle: 'Bouwmarkt in Bjorli', body: 'XL-BYGG Bjorli is de lokale bouwmarkt en een handige stop voor huteigenaren en bewoners die materiaal, gereedschap of spullen voor klussen nodig hebben. Bekijk het assortiment en de openingstijden via de eigen kanalen van de winkel.', linkLabel: 'Bekijk XL-BYGG Bjorli' },
    larger: { title: 'Groter winkelen', body: 'Heb je een groter winkelaanbod nodig, dan liggen Dombås en Åndalsnes elk op ongeveer 50 km rijden. Daar vind je meer winkels en diensten voor de grotere boodschappen.' },
    practicalTitle: 'Praktische informatie',
    practicalItems: ['Openingstijden en aanbod kunnen variëren door het jaar — seizoen, feestdagen en lokale werking.', 'Controleer altijd de eigen kanalen van de winkel voor de actuele informatie voordat je gaat.', 'Sommige diensten volgen het skiseizoen of de lokale vraag.'],
    foodTeaser: { title: 'Eten en drinken in Bjorli', body: 'Op zoek naar een café, lunch, lounge of après-ski? Bekijk het overzicht van eten en drinken in Bjorli, met Heiskroa, T-Kroken en andere plekken in de omgeving.', linkLabel: 'Bekijk eten en drinken' },
    faqTitle: 'Veelgestelde vragen',
    faq: [
      { q: 'Waar kan ik sportuitrusting kopen in Bjorli?', a: 'Intersport Bjorli zit in het welkomstcentrum bij het skigebied en wordt gerund door Intersport Ålesund. Je vindt er sportartikelen en bekende merken vlak naast de piste.' },
      { q: 'Waar kan ik ski’s huren?', a: 'Skiverhuur loopt via Intersport Bjorli in het welkomstcentrum, vlak naast de piste.' },
      { q: 'Is er een supermarkt in Bjorli?', a: 'Ja. Bunnpris Bjorli ligt op ongeveer 400 meter van het skigebied en heeft boodschappen plus een postpunt in de winkel.' },
      { q: 'Is er iets open op zondag in Bjorli?', a: 'Bunnpris Bjorli is zeven dagen per week open, ook op zondag. Bekijk de actuele tijden via de eigen kanalen van de winkel.' },
      { q: 'Kan ik mijn elektrische auto opladen in Bjorli?', a: 'Ja. Bij Bunnpris staan snelladers, en in de buurt vind je ook Tesla Superchargers.' },
      { q: 'Zijn er lokale winkels in Bjorli?', a: 'Ja. Bjorli heeft lokale winkels met onder andere kleding, interieur en cadeaus. Lunt Bjorli is er één van. Aanbod en openingstijden kunnen wisselen — kijk vooraf even op de eigen kanalen van de winkel.' },
    ],
  },
  da: {
    heroTitle: 'Indkøb på Bjorli',
    heroSubtitle: 'Sportsudstyr, skiudlejning, dagligvarer, lokale butikker og opladning — det meste finder du samme sted.',
    intro: 'På Bjorli finder du det meste, du har brug for under opholdet — uanset om du skal på pisten, i hytten, handle ind eller bare ordne praktiske ting. Her er et overblik over sportsbutik, dagligvarer, lokale butikker, opladning og større indkøb i nærheden.',
    intersport: { title: 'Sportsudstyr, skiudlejning og skiskole', subtitle: 'Sportsbutik i velkomstcentret', body: 'Sportsbutikken i velkomstcentret drives af Intersport Ålesund. Her finder du udstyr, kendte mærker og service lige ved pisten. Skiudlejning og skiskole drives også herfra.', linkLabel: 'Se Intersport Bjorli' },
    bunnpris: { title: 'Dagligvarer og daglige ærinder', subtitle: 'Dagligvarer, posthus og søndagsåbent', body: 'Bunnpris på Bjorli har åbent syv dage om ugen og ligger omkring 400 meter fra skicentret. Her er dagligvarer, søndagsåbent og en posthusfunktion i butikken.', evNote: 'Ved Bunnpris er der også Eviny-lynladere til elbiler, og der står Tesla Superchargers ved Bjorli.', bunnprisLink: 'Se Bunnpris Bjorli', evinyLink: 'Se Eviny-lynladere', teslaLink: 'Se Tesla Supercharger Bjorli' },
    lunt: { title: 'Lokale butikker', subtitle: 'Interiør og gaver', body: 'Bjorli har også lokale butikker med blandt andet tøj, interiør og gaver. Lunt er en af de butikker, der giver indkøbstilbuddet på Bjorli lidt ekstra.', linkLabel: 'Se Lunt Bjorli på Facebook' },
    xlbygg: { title: 'Byggematerialer og DIY', subtitle: 'Byggemarked på Bjorli', body: 'XL-BYGG Bjorli er det lokale byggemarked og et nyttigt stop for hytteejere og fastboende, der har brug for materialer, værktøj eller udstyr til hytteprojekter. Tjek butikkens egne kanaler for aktuelt udvalg og åbningstider.', linkLabel: 'Se XL-BYGG Bjorli' },
    larger: { title: 'Større indkøb', body: 'Har du brug for et større udvalg af butikker, ligger både Dombås og Åndalsnes omkring 50 km væk i bil. Her er flere butikker og tjenester til de større indkøb.' },
    practicalTitle: 'Praktisk information',
    practicalItems: ['Åbningstider og tilbud kan variere gennem året med sæson, helligdage og lokal drift.', 'Tjek altid butikkens egne kanaler for aktuel information, før du planlægger besøget.', 'Nogle tjenester følger skisæsonen eller den lokale efterspørgsel.'],
    foodTeaser: { title: 'Mad og drikke på Bjorli', body: 'Leder du efter café, frokost, lounge eller afterski? Se oversigten over mad og drikke på Bjorli, inkl. Heiskroa, T-Kroken og andre spisesteder i området.', linkLabel: 'Se mad og drikke' },
    faqTitle: 'Ofte stillede spørgsmål',
    faq: [
      { q: 'Hvor kan jeg købe sportsudstyr på Bjorli?', a: 'Intersport Bjorli ligger i velkomstcentret ved skicentret og drives af Intersport Ålesund. Her finder du sportsudstyr og kendte mærker lige ved pisten.' },
      { q: 'Hvor kan jeg leje ski?', a: 'Skiudlejning drives fra Intersport Bjorli i velkomstcentret, lige ved pisten.' },
      { q: 'Er der en dagligvarebutik på Bjorli?', a: 'Ja. Bunnpris Bjorli ligger omkring 400 meter fra skicentret og har dagligvarer samt posthusfunktion.' },
      { q: 'Er der søndagsåbent på Bjorli?', a: 'Bunnpris Bjorli har åbent syv dage om ugen, med søndagsåbent. Tjek butikkens egne kanaler for opdaterede åbningstider.' },
      { q: 'Er der opladning til elbil på Bjorli?', a: 'Ja. Ved Bunnpris er der lynladere, og der står også Tesla Superchargers i området.' },
      { q: 'Er der lokale butikker på Bjorli?', a: 'Ja. Bjorli har lokale butikker med blandt andet tøj, interiør og gaver. Lunt Bjorli er en af dem. Udvalg og åbningstider kan variere — tjek butikkens egne kanaler før besøget.' },
    ],
  },
  sv: {
    heroTitle: 'Handel på Bjorli',
    heroSubtitle: 'Sportutrustning, skiduthyrning, livsmedel, lokala butiker och laddning — det mesta hittar du på ett ställe.',
    intro: 'På Bjorli finns det mesta du behöver under vistelsen — oavsett om du ska upp i backen, till stugan, handla mat eller bara fixa lite praktiska saker. Här är en översikt över sportbutik, livsmedel, lokala butiker, laddning och större handel i närheten.',
    intersport: { title: 'Sportutrustning, skiduthyrning och skidskola', subtitle: 'Sportbutik i välkomstcentret', body: 'Sportbutiken i välkomstcentret drivs av Intersport Ålesund. Du hittar utrustning, kända märken och service alldeles intill backen. Skiduthyrning och skidskola drivs också härifrån.', linkLabel: 'Se Intersport Bjorli' },
    bunnpris: { title: 'Livsmedel och vardagsärenden', subtitle: 'Livsmedel, postombud och söndagsöppet', body: 'Bunnpris på Bjorli har öppet sju dagar i veckan och ligger omkring 400 meter från skidanläggningen. Här finns livsmedel, söndagsöppet och postombud i butiken.', evNote: 'Vid Bunnpris finns även Eviny-snabbladdare för elbil, och vid Bjorli står Tesla Superchargers.', bunnprisLink: 'Se Bunnpris Bjorli', evinyLink: 'Se Eviny-snabbladdare', teslaLink: 'Se Tesla Supercharger Bjorli' },
    lunt: { title: 'Lokala butiker', subtitle: 'Inredning och presenter', body: 'Bjorli har också lokala butiker med bland annat kläder, inredning och presenter. Lunt är en av butikerna som ger handeln på Bjorli lite extra karaktär.', linkLabel: 'Se Lunt Bjorli på Facebook' },
    xlbygg: { title: 'Byggvaror och renovering', subtitle: 'Byggvaruhus på Bjorli', body: 'XL-BYGG Bjorli är det lokala byggvaruhuset och ett bra stopp för stugägare och fastboende som behöver material, verktyg eller utrustning till stugprojekt. Aktuellt sortiment och öppettider hittar du i butikens egna kanaler.', linkLabel: 'Se XL-BYGG Bjorli' },
    larger: { title: 'Större inköp', body: 'Behöver du ett bredare utbud av butiker ligger både Dombås och Åndalsnes ungefär 50 km bort med bil. Där hittar du fler butiker och tjänster för de större inköpen.' },
    practicalTitle: 'Praktisk information',
    practicalItems: ['Öppettider och utbud kan variera över året med säsong, helger och lokal drift.', 'Kontrollera alltid butikens egna kanaler för aktuell information innan besöket.', 'Vissa tjänster följer skidsäsongen eller den lokala efterfrågan.'],
    foodTeaser: { title: 'Mat och dryck på Bjorli', body: 'Letar du efter kafé, lunch, lounge eller afterski? Se översikten över mat och dryck på Bjorli, inklusive Heiskroa, T-Kroken och andra ställen i området.', linkLabel: 'Se mat och dryck' },
    faqTitle: 'Vanliga frågor',
    faq: [
      { q: 'Var kan jag köpa sportutrustning på Bjorli?', a: 'Intersport Bjorli ligger i välkomstcentret vid skidanläggningen och drivs av Intersport Ålesund. Du hittar sportutrustning och kända märken alldeles intill backen.' },
      { q: 'Var kan jag hyra skidor?', a: 'Skiduthyrningen drivs från Intersport Bjorli i välkomstcentret, intill backen.' },
      { q: 'Finns det en livsmedelsbutik på Bjorli?', a: 'Ja. Bunnpris Bjorli ligger omkring 400 meter från skidanläggningen och har livsmedel samt postombud i butiken.' },
      { q: 'Är något öppet på söndagar på Bjorli?', a: 'Bunnpris Bjorli har öppet sju dagar i veckan, med söndagsöppet. Aktuella tider finns i butikens egna kanaler.' },
      { q: 'Finns det elbilsladdning på Bjorli?', a: 'Ja. Vid Bunnpris finns snabbladdare och det finns även Tesla Superchargers i området.' },
      { q: 'Finns det lokala butiker på Bjorli?', a: 'Ja. Bjorli har lokala butiker med bland annat kläder, inredning och presenter. Lunt Bjorli är en av dem. Utbud och öppettider kan variera — kolla butikens egna kanaler innan besöket.' },
    ],
  },
};

const Handel = () => {
  const lp = useLocalizedPath();
  const t = usePageCopy(COPY);
  const faqItems = t.faq;

  return (
    <div>
      <PageHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        image={heroImg}
      />

      {/* Intro */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{t.intro}</p>
          </motion.div>

          {/* Intersport */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.intersport.title}</h2>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Intersport Bjorli</h3>
                <p className="text-secondary font-medium mb-4">{t.intersport.subtitle}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{t.intersport.body}</p>
                <a
                  href="https://intersportbjorli.no/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  onClick={() =>
                    trackExternalPartnerClick({
                      partner_name: 'Intersport Bjorli',
                      partner_category: 'shopping',
                      link_url: 'https://intersportbjorli.no/',
                      link_text: t.intersport.linkLabel,
                    })
                  }
                >
                  {t.intersport.linkLabel} <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bunnpris */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.bunnpris.title}</h2>
            <Card className="overflow-hidden bg-card/60 backdrop-blur border-border/60">
              <div className="bg-muted">
                <img
                  src={images.bunnprisBjorli.src}
                  alt={images.bunnprisBjorli.alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Bunnpris Bjorli</h3>
                <p className="text-secondary font-medium mb-4">{t.bunnpris.subtitle}</p>
                <p className="text-muted-foreground leading-relaxed mb-4">{t.bunnpris.body}</p>
                <div className="rounded-xl border border-border bg-muted/40 p-4 mb-6 flex items-start gap-3">
                  <Zap className="h-5 w-5 text-secondary mt-0.5 shrink-0" aria-hidden />
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.bunnpris.evNote}</p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <a
                    href="https://www.bunnpris.no/butikker/bunnpris-bjorli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                    onClick={() =>
                      trackExternalPartnerClick({
                        partner_name: 'Bunnpris Bjorli',
                        partner_category: 'shopping',
                        link_url: 'https://www.bunnpris.no/butikker/bunnpris-bjorli',
                        link_text: t.bunnpris.bunnprisLink,
                      })
                    }
                  >
                    {t.bunnpris.bunnprisLink} <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="https://share.google/UgR9PsUAMp5H1aIQO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                    onClick={() =>
                      trackExternalPartnerClick({
                        partner_name: 'Eviny',
                        partner_category: 'transport',
                        link_url: 'https://share.google/UgR9PsUAMp5H1aIQO',
                        link_text: t.bunnpris.evinyLink,
                      })
                    }
                  >
                    {t.bunnpris.evinyLink} <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.tesla.com/findus/location/supercharger/407723"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                    onClick={() =>
                      trackExternalPartnerClick({
                        partner_name: 'Tesla Supercharger',
                        partner_category: 'transport',
                        link_url: 'https://www.tesla.com/findus/location/supercharger/407723',
                        link_text: t.bunnpris.teslaLink,
                      })
                    }
                  >
                    {t.bunnpris.teslaLink} <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lunt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.lunt.title}</h2>
            <Card className="overflow-hidden bg-card/60 backdrop-blur border-border/60">
              <div className="bg-[#2b2b2b] flex items-center justify-center p-6 md:p-10">
                <img
                  src={images.luntBjorli.src}
                  alt={images.luntBjorli.alt}
                  className="w-full h-auto max-w-md"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Lunt Bjorli</h3>
                <p className="text-secondary font-medium mb-4">{t.lunt.subtitle}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{t.lunt.body}</p>
                <a
                  href="https://www.facebook.com/p/Lunt-Bjorli-100057398750786/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  onClick={() =>
                    trackExternalPartnerClick({
                      partner_name: 'Lunt Bjorli',
                      partner_category: 'shopping',
                      link_url: 'https://www.facebook.com/p/Lunt-Bjorli-100057398750786/',
                      link_text: t.lunt.linkLabel,
                    })
                  }
                >
                  {t.lunt.linkLabel} <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </motion.div>

          {/* Større innkjøp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.xlbygg.title}</h2>
            <Card className="overflow-hidden bg-card/60 backdrop-blur border-border/60">
              <div className="bg-muted">
                <img
                  src={images.xlByggBjorli.src}
                  alt={images.xlByggBjorli.alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                  <Hammer className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">XL-BYGG Bjorli</h3>
                <p className="text-secondary font-medium mb-4">{t.xlbygg.subtitle}</p>
                <p className="text-muted-foreground leading-relaxed mb-6">{t.xlbygg.body}</p>
                <a
                  href="https://xl-bygg.no/butikker/xl-bygg-bjorli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  onClick={() =>
                    trackExternalPartnerClick({
                      partner_name: 'XL-BYGG Bjorli',
                      partner_category: 'shopping',
                      link_url: 'https://xl-bygg.no/butikker/xl-bygg-bjorli',
                      link_text: t.xlbygg.linkLabel,
                    })
                  }
                >
                  {t.xlbygg.linkLabel} <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </motion.div>

          {/* Større innkjøp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.larger.title}</h2>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">{t.larger.body}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-12 md:py-16 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{t.practicalTitle}</h2>
          <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
            {t.practicalItems.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related: Food & Drink */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-card/60 backdrop-blur border-border/60">
            <CardContent className="p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <Utensils className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold mb-2">{t.foodTeaser.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{t.foodTeaser.body}</p>
              </div>
              <Link
                to={lp('/mat-og-drikke')}
                className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline shrink-0"
              >
                {t.foodTeaser.linkLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <FaqBlock title={t.faqTitle} items={faqItems} />
    </div>
  );
};

export default Handel;