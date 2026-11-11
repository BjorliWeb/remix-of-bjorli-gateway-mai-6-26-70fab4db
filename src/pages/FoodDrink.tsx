import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { Coffee, Flame, ExternalLink, MapPin, Fuel, Utensils, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import FaqBlock from '@/components/seo/FaqBlock';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';
import { trackExternalPartnerClick } from '@/lib/analytics';

type Copy = {
  introBefore: string;
  introMid1: string;
  introMid2: string;
  introMid3: string;
  introMid4: string;
  introEnd: string;
  venuesTitle: string;
  venuesIntro: string;
  avdemsbueDesc: string;
  avdemsbueLink: string;
  hillsDesc: string;
  hillsLink: string;
  yxDesc: string;
  yxLink: string;
  localFoodTitle: string;
  localFoodBeforeBunnpris: string;
  localFoodBetween: string;
  localFoodAfter: string;
  eyebrow: string;
  skiTitle: string;
  skiIntro: string;
  skiBody: string[];
  fjellkafeText: string;
  loftetTitle: string;
  loftetBefore: string;
  loftetLink: string;
  loftetAfter: string;
  heiskroaText: string;
  fjellbuaText: string;
  instaBefore: string;
  instaAfter: string;
  logoAlt: string;
  collageAlt: string;
  passesForLabel: string;
  practicalLabel: string;
  practicalInfoTitle: string;
  practicalItems: string[];
  handelTeaserTitle: string;
  handelTeaserBody: string;
  handelTeaserLink: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
};

const COPY: Record<Locale, Copy> = {
  no: {
    introBefore: 'På Bjorli finner du flere steder for mat, drikke og gode pauser gjennom hele året. Utenfor skisenteret ligger blant annet ',
    introMid1: 'Avdemsbue',
    introMid2: 'HILLS Bjorli',
    introMid3: 'YX Bjorli',
    introMid4: 'Bunnpris Lesjaskog',
    introEnd: ", og dagligvarer får du på Bunnpris Lesjaskog og Coop Marked Lesjaverk om du heller vil lage maten selv på hytta. I skisesongen, når heisene går, finner du Bjorli Fjellkafe og Heiskroa inne på selve skisenteret.",
    venuesTitle: 'Spisesteder og møteplasser på Bjorli',
    venuesIntro: 'Bjorli har flere spisesteder og møteplasser utenfor selve skisenteret — åpne gjennom året. Utvalg og åpningstider kan variere, så sjekk alltid stedets egne kanaler før du planlegger besøket.',
    avdemsbueDesc: 'Avdemsbue ligger omtrent 35 km fra Bjorli og er et godt valg om du vil kombinere turen med lokalmat, gårdsmiljø og en matopplevelse i Gudbrandsdalen.',
    avdemsbueLink: 'Se Avdemsbue',
    hillsDesc: 'HILLS Bjorli er et serveringssted på Bjorli med mat, drikke og en sosial ramme i moderne lokaler.',
    hillsLink: 'Se HILLS Bjorli på Facebook',
    yxDesc: 'YX Bjorli er storkiosk, gatekjøkken, bensinstasjon og en sentral møteplass på Bjorli.',
    yxLink: 'Se YX Bjorli på Facebook',
    localFoodTitle: 'Lokalmat og dagligvarer',
    localFoodBeforeBunnpris: 'Vil du lage maten selv på hytta? Dagligvarer får du på ',
    localFoodBetween: ' og ',
    localFoodAfter: '. YX Bjorli har også et utvalg gjennom døgnet.',
    eyebrow: 'I skisesongen, når heisene går',
    skiTitle: "Bjorli Fjellkafe, Heiskroa og Fjellbua",
    skiIntro: "I Bjorli Skisenter finner du Bjorli Fjellkafe og Heiskroa. Ved Fjellheisen ligger også Fjellbua – Bjorli, som åpner når forholdene tilsier det. Her finner du steder for en rask pause, varm drikke, lunsj og hyggelige stunder gjennom skidagen.",
    skiBody: ["Bjorli Spisestedene er fellesbetegnelsen for serveringstilbudene i Bjorli Skisenter.", "Serveringsstedene drives samlet, med vekt på god service, lun stemning og mat laget med omtanke. Der det er mulig, brukes kortreiste og lokale råvarer."],
    fjellkafeText: "Bjorli Fjellkafe er navnet på hovedbygget og serveringskonseptene der. Kafeen er kaféområdet med mat og drikke, mens Loungen er loungeområdet. Det er spiseplikt i serveringsområdet i Bjorli Fjellkafe.",
    loftetTitle: "Loftet",
    loftetBefore: "Loftet ligger i andre etasje i Bjorli Fjellkafe. Her kan det være bar, quiz, afterski, undervisning og andre arrangementer. ",
    loftetLink: "Se hva som skjer",
    loftetAfter: " for aktuelle aktiviteter.",
    heiskroaText: "Heiskroa videreføres som varmestue. Her kan du varme deg, vente på andre og ta en enkel pause i løpet av skidagen.",
    fjellbuaText: "Fjellbua – Bjorli er serveringen ved Fjellheisen. Åpning avhenger av forholdene.",
    instaBefore: "Følg ",
    instaAfter: " på Instagram for de siste nyhetene om mat, drikke og arrangementer i Bjorli Skisenter.",
    logoAlt: "Logo for Bjorli Spisestedene",
    collageAlt: "Stemningsbilder fra Bjorli Fjellkafe og Heiskroa i Bjorli Skisenter med kafé, lounge, peis, bakst og vinterstemning.",
    passesForLabel: 'Passer for: ',
    practicalLabel: 'Praktisk: ',
    practicalInfoTitle: 'Praktisk informasjon',
    practicalItems: [
      'Åpningstider kan variere med sesong, vær, helligdager og arrangementer.',
      'Sjekk alltid stedets egne kanaler for oppdatert informasjon.',
      'For grupper og større besøk anbefales det å kontakte serveringsstedet direkte.',
    ],
    handelTeaserTitle: 'Handle på Bjorli',
    handelTeaserBody: 'Trenger du sportsutstyr, skiutleie, dagligvarer, gaver eller lading? Se oversikten over handel og praktiske ærend på Bjorli.',
    handelTeaserLink: 'Se handel på Bjorli',
    faqTitle: 'Ofte stilte spørsmål',
    faq: [
      { q: "Finnes det servering i skisenteret?", a: "Ja. I Bjorli Skisenter finner du Bjorli Fjellkafe og Heiskroa. Ved Fjellheisen ligger også Fjellbua – Bjorli, som åpner når forholdene tilsier det." },
      { q: "Hva er forskjellen på Bjorli Fjellkafe og Heiskroa?", a: "Bjorli Fjellkafe er hovedbygget med Kafeen og Loungen, og det er spiseplikt i serveringsområdet. Heiskroa er varmestue, der du kan varme deg, vente på andre og ta en enkel pause." },
      { q: "Hvor finner jeg varmestue?", a: "Varmestue finner du i Heiskroa i skisenteret." },
      { q: "Finnes det afterski på Bjorli?", a: "På Loftet i andre etasje i Bjorli Fjellkafe kan det være afterski, quiz og andre arrangementer. Se hva som skjer for aktuelle datoer." },
      { q: 'Finnes det andre spisesteder på Bjorli?', a: 'Ja. Utenfor skisenteret finner du blant annet HILLS Bjorli og YX Bjorli. Avdemsbue ligger omtrent 35 km unna og er et godt alternativ for en matopplevelse i Gudbrandsdalen.' },
      { q: 'Hvor ligger Avdemsbue?', a: 'Avdemsbue ligger omtrent 35 km fra Bjorli, i Gudbrandsdalen.' },
    ],
  },
  en: {
    introBefore: 'You’ll find several places to eat, drink and take a break in Bjorli. Outside the ski resort there’s ',
    introMid1: 'Avdemsbue',
    introMid2: 'HILLS Bjorli',
    introMid3: 'YX Bjorli',
    introMid4: 'Bunnpris Lesjaskog',
    introEnd: ", with groceries at Bunnpris Lesjaskog and Coop Marked Lesjaverk if you’d rather cook at the cabin. During the ski season, when the lifts are running, you’ll also find Bjorli Fjellkafe and Heiskroa at the ski resort itself.",
    venuesTitle: 'Places to eat and meet in Bjorli',
    venuesIntro: 'There are several places to eat and meet outside the ski resort. What’s on offer and the opening times can vary, so check each place’s own website or social media before you visit.',
    avdemsbueDesc: 'Avdemsbue is about 35 km from Bjorli and a good choice if you want to combine the trip with local food, a farm setting and a meal in Gudbrandsdalen.',
    avdemsbueLink: 'Visit Avdemsbue',
    hillsDesc: 'HILLS Bjorli serves food and drink in a modern, social setting in Bjorli.',
    hillsLink: 'See HILLS Bjorli on Facebook',
    yxDesc: 'YX Bjorli is a convenience store, kiosk grill, petrol station and a central meeting point in Bjorli.',
    yxLink: 'See YX Bjorli on Facebook',
    localFoodTitle: 'Local food and groceries',
    localFoodBeforeBunnpris: 'Want to cook at the cabin? Pick up groceries at ',
    localFoodBetween: ' and ',
    localFoodAfter: '. YX Bjorli also has a small selection around the clock.',
    eyebrow: 'During the ski season, when the lifts are running',
    skiTitle: "Bjorli Fjellkafe, Heiskroa and Fjellbua",
    skiIntro: "At Bjorli Skisenter you’ll find Bjorli Fjellkafe and Heiskroa. Up by Fjellheisen there’s also Fjellbua – Bjorli, which opens when conditions allow. Together they cover a quick break, a hot drink, lunch and a good time through the ski day.",
    skiBody: ["Bjorli Spisestedene is the shared name for the places to eat and drink at Bjorli Skisenter.", "They’re run together, with a focus on good service, a warm atmosphere and food made with care. Local ingredients are used wherever possible."],
    fjellkafeText: "Bjorli Fjellkafe is the name of the main building and the food and drink concepts inside it. Kafeen is the café area with food and drink, and Loungen is the lounge area. Food must be ordered in the dining area at Bjorli Fjellkafe.",
    loftetTitle: "Loftet",
    loftetBefore: "Loftet is on the second floor of Bjorli Fjellkafe. It can host a bar, quiz nights, après-ski, teaching and other events. ",
    loftetLink: "See what’s on",
    loftetAfter: " for current activities.",
    heiskroaText: "Heiskroa carries on as a warm-up room. Pop in to warm up, wait for the others or take a simple break during your ski day.",
    fjellbuaText: "Fjellbua – Bjorli serves food and drink by Fjellheisen. Opening depends on conditions.",
    instaBefore: "Follow ",
    instaAfter: " on Instagram for the latest news on food, drink and events at Bjorli Skisenter.",
    logoAlt: "Bjorli Spisestedene logo",
    collageAlt: "Bjorli Fjellkafe and Heiskroa at Bjorli Ski Resort, with the café, lounge, fireplace and baking on a winter’s day.",
    passesForLabel: 'Good for: ',
    practicalLabel: 'Good to know: ',
    practicalInfoTitle: 'Practical information',
    practicalItems: [
      'Opening times vary with the season, the weather, holidays and events.',
      'Check each place’s own website or social media for the latest information.',
      'For groups and larger bookings, contact the venue directly.',
    ],
    handelTeaserTitle: 'Shopping in Bjorli',
    handelTeaserBody: 'Need sports equipment, ski hire, groceries, gifts or EV charging? See the overview of shops and services in Bjorli.',
    handelTeaserLink: 'See shopping in Bjorli',
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: "Is there food and drink at the ski resort?", a: "Yes. At Bjorli Skisenter you’ll find Bjorli Fjellkafe and Heiskroa. Up by Fjellheisen there’s also Fjellbua – Bjorli, which opens when conditions allow." },
      { q: "What’s the difference between Bjorli Fjellkafe and Heiskroa?", a: "Bjorli Fjellkafe is the main building with Kafeen and Loungen, and food must be ordered in the dining area. Heiskroa is a warm-up room where you can get warm, wait for others and take a simple break." },
      { q: "Where can I find a warm-up room?", a: "The warm-up room is in Heiskroa at the ski resort." },
      { q: "Is there après-ski in Bjorli?", a: "Loftet, on the second floor of Bjorli Fjellkafe, can host après-ski, quiz nights and other events. See what’s on for current dates." },
      { q: 'Are there other places to eat in Bjorli?', a: 'Yes. Outside the ski resort you’ll find HILLS Bjorli and YX Bjorli, among others. Avdemsbue is about 35 km away and is a good option for a meal in Gudbrandsdalen.' },
      { q: 'Where is Avdemsbue?', a: 'Avdemsbue is about 35 km from Bjorli, in Gudbrandsdalen.' },
    ],
  },
  de: {
    introBefore: 'In Bjorli gibt es das ganze Jahr über mehrere Orte für Essen, Trinken und eine gute Pause. Außerhalb des Skigebiets liegen unter anderem ',
    introMid1: 'Avdemsbue',
    introMid2: 'HILLS Bjorli',
    introMid3: 'YX Bjorli',
    introMid4: 'Bunnpris Lesjaskog',
    introEnd: ", und Lebensmittel gibt es bei Bunnpris Lesjaskog und Coop Marked Lesjaverk, wenn Sie lieber in der Hütte selbst kochen. Während der Skisaison, wenn die Lifte laufen, finden Sie außerdem Bjorli Fjellkafe und Heiskroa direkt im Skigebiet.",
    venuesTitle: 'Lokale und Treffpunkte in Bjorli',
    venuesIntro: 'Bjorli hat mehrere Lokale und Treffpunkte außerhalb des Skigebiets — ganzjährig geöffnet. Angebot und Öffnungszeiten variieren, prüfen Sie vor dem Besuch die jeweiligen Kanäle.',
    avdemsbueDesc: 'Avdemsbue liegt etwa 35 km von Bjorli entfernt und ist eine gute Wahl, wenn Sie den Ausflug mit lokalem Essen, Hofatmosphäre und einer Mahlzeit im Gudbrandsdalen verbinden möchten.',
    avdemsbueLink: 'Avdemsbue besuchen',
    hillsDesc: 'HILLS Bjorli bietet Essen, Trinken und ein soziales Ambiente in modernen Räumen in Bjorli.',
    hillsLink: 'HILLS Bjorli auf Facebook ansehen',
    yxDesc: 'YX Bjorli ist Kiosk, Imbiss, Tankstelle und ein zentraler Treffpunkt in Bjorli.',
    yxLink: 'YX Bjorli auf Facebook ansehen',
    localFoodTitle: 'Lokale Lebensmittel und Einkäufe',
    localFoodBeforeBunnpris: 'Möchten Sie in der Hütte selbst kochen? Lebensmittel finden Sie bei ',
    localFoodBetween: ' und ',
    localFoodAfter: '. YX Bjorli führt rund um die Uhr eine kleine Auswahl.',
    eyebrow: 'Während der Skisaison, wenn die Lifte laufen',
    skiTitle: "Bjorli Fjellkafe, Heiskroa und Fjellbua",
    skiIntro: "Im Bjorli Skisenter gibt es Bjorli Fjellkafe und Heiskroa. Am Fjellheisen liegt außerdem Fjellbua – Bjorli, die öffnet, wenn die Bedingungen es zulassen. Hier finden Sie Orte für eine kurze Pause, ein warmes Getränk, Mittagessen und gemütliche Momente über den Skitag.",
    skiBody: ["Bjorli Spisestedene ist der gemeinsame Name für die Gastronomie im Bjorli Skisenter.", "Die Lokale werden gemeinsam betrieben – mit gutem Service, gemütlicher Stimmung und sorgfältig zubereitetem Essen. Wo möglich, kommen regionale Zutaten auf den Tisch."],
    fjellkafeText: "Bjorli Fjellkafe ist der Name des Hauptgebäudes und der Gastronomiekonzepte darin. Kafeen ist der Cafébereich mit Essen und Getränken, Loungen der Loungebereich. Im Servicebereich der Bjorli Fjellkafe besteht Verzehrpflicht.",
    loftetTitle: "Loftet",
    loftetBefore: "Loftet liegt im ersten Obergeschoss der Bjorli Fjellkafe. Hier kann es Bar, Quiz, Après-Ski, Unterricht und andere Veranstaltungen geben. ",
    loftetLink: "Veranstaltungen ansehen",
    loftetAfter: " – dort finden Sie aktuelle Termine.",
    heiskroaText: "Heiskroa bleibt als Wärmestube erhalten. Hier können Sie sich aufwärmen, auf andere warten und eine einfache Pause im Skitag einlegen.",
    fjellbuaText: "Fjellbua – Bjorli ist die Gastronomie am Fjellheisen. Ob geöffnet ist, hängt von den Bedingungen ab.",
    instaBefore: "Folgen Sie ",
    instaAfter: " auf Instagram für die neuesten Nachrichten zu Essen, Getränken und Veranstaltungen im Bjorli Skisenter.",
    logoAlt: "Logo von Bjorli Spisestedene",
    collageAlt: "Stimmungsbilder von Bjorli Fjellkafe und Heiskroa im Bjorli Skisenter mit Café, Lounge, Kamin, Gebäck und Winterstimmung.",
    passesForLabel: 'Gut für: ',
    practicalLabel: 'Praktisch: ',
    practicalInfoTitle: 'Praktische Informationen',
    practicalItems: [
      'Öffnungszeiten variieren je nach Saison, Wetter, Feiertagen und Veranstaltungen.',
      'Aktuelle Informationen am besten in den Kanälen des Lokals prüfen.',
      'Für Gruppen und größere Besuche das Lokal direkt kontaktieren.',
    ],
    handelTeaserTitle: 'Einkaufen in Bjorli',
    handelTeaserBody: 'Sportausrüstung, Skiverleih, Lebensmittel, Geschenke oder E-Laden? Hier finden Sie eine Übersicht zu Einkauf und Besorgungen in Bjorli.',
    handelTeaserLink: 'Einkaufen in Bjorli ansehen',
    faqTitle: 'Häufige Fragen',
    faq: [
      { q: "Gibt es Gastronomie im Skigebiet?", a: "Ja. Im Bjorli Skisenter gibt es Bjorli Fjellkafe und Heiskroa. Am Fjellheisen liegt außerdem Fjellbua – Bjorli, die öffnet, wenn die Bedingungen es zulassen." },
      { q: "Was ist der Unterschied zwischen Bjorli Fjellkafe und Heiskroa?", a: "Bjorli Fjellkafe ist das Hauptgebäude mit Kafeen und Loungen; im Servicebereich besteht Verzehrpflicht. Heiskroa ist eine Wärmestube zum Aufwärmen, Warten und für eine einfache Pause." },
      { q: "Wo finde ich eine Wärmestube?", a: "Die Wärmestube ist in der Heiskroa im Skigebiet." },
      { q: "Gibt es Après-Ski in Bjorli?", a: "Auf dem Loftet im ersten Obergeschoss der Bjorli Fjellkafe kann es Après-Ski, Quiz und andere Veranstaltungen geben. Aktuelle Termine finden Sie unter Veranstaltungen." },
      { q: 'Gibt es weitere Lokale in Bjorli?', a: 'Ja. Außerhalb des Skigebiets gibt es unter anderem HILLS Bjorli und YX Bjorli. Avdemsbue liegt etwa 35 km entfernt und ist eine gute Option für ein Essen in Gudbrandsdalen.' },
      { q: 'Wo liegt Avdemsbue?', a: 'Avdemsbue liegt etwa 35 km von Bjorli entfernt, in Gudbrandsdalen.' },
    ],
  },
  nl: {
    introBefore: 'In Bjorli vind je het hele jaar door verschillende plekken voor eten, drinken en een goede pauze. Buiten het skigebied liggen onder andere ',
    introMid1: 'Avdemsbue',
    introMid2: 'HILLS Bjorli',
    introMid3: 'YX Bjorli',
    introMid4: 'Bunnpris Lesjaskog',
    introEnd: ", en boodschappen haal je bij Bunnpris Lesjaskog en Coop Marked Lesjaverk als je liever zelf in de hut kookt. Tijdens het skiseizoen, wanneer de liften draaien, vind je ook Bjorli Fjellkafe en Heiskroa in het skigebied zelf.",
    venuesTitle: 'Eet- en ontmoetingsplekken in Bjorli',
    venuesIntro: 'Bjorli heeft meerdere eet- en ontmoetingsplekken buiten het skigebied — het hele jaar door open. Aanbod en openingstijden kunnen wisselen, dus check vooraf altijd de eigen kanalen van de plek.',
    avdemsbueDesc: 'Avdemsbue ligt op ongeveer 35 km van Bjorli en is een mooie keuze als je het bezoek wilt combineren met lokale producten, boerderijsfeer en een maaltijd in Gudbrandsdalen.',
    avdemsbueLink: 'Bekijk Avdemsbue',
    hillsDesc: 'HILLS Bjorli serveert eten en drinken in een moderne, sociale setting in Bjorli.',
    hillsLink: 'Bekijk HILLS Bjorli op Facebook',
    yxDesc: 'YX Bjorli is een ruime kiosk, snackbar, tankstation en een centrale ontmoetingsplek in Bjorli.',
    yxLink: 'Bekijk YX Bjorli op Facebook',
    localFoodTitle: 'Lokale producten en boodschappen',
    localFoodBeforeBunnpris: 'Wil je zelf in de hut koken? Boodschappen haal je bij ',
    localFoodBetween: ' en ',
    localFoodAfter: '. YX Bjorli heeft daarnaast dag en nacht een kleine selectie.',
    eyebrow: 'Tijdens het skiseizoen, als de liften draaien',
    skiTitle: "Bjorli Fjellkafe, Heiskroa en Fjellbua",
    skiIntro: "In Bjorli Skisenter vind je Bjorli Fjellkafe en Heiskroa. Bij Fjellheisen ligt ook Fjellbua – Bjorli, dat opengaat wanneer de omstandigheden het toelaten. Hier kun je terecht voor een snelle pauze, een warm drankje, lunch en gezellige momenten tijdens de skidag.",
    skiBody: ["Bjorli Spisestedene is de gezamenlijke naam voor de horeca in Bjorli Skisenter.", "De zaken worden samen gerund, met aandacht voor goede service, een warme sfeer en eten dat met zorg is bereid. Waar het kan, worden lokale producten gebruikt."],
    fjellkafeText: "Bjorli Fjellkafe is de naam van het hoofdgebouw en de horecaconcepten daarin. Kafeen is het cafégedeelte met eten en drinken, Loungen het loungegedeelte. In het serveergedeelte van Bjorli Fjellkafe geldt een eetverplichting.",
    loftetTitle: "Loftet",
    loftetBefore: "Loftet ligt op de eerste verdieping van Bjorli Fjellkafe. Hier kan een bar, quiz, après-ski, les of een ander evenement plaatsvinden. ",
    loftetLink: "Bekijk wat er te doen is",
    loftetAfter: " voor actuele activiteiten.",
    heiskroaText: "Heiskroa blijft een opwarmruimte. Hier kun je opwarmen, op anderen wachten en een eenvoudige pauze nemen tijdens de skidag.",
    fjellbuaText: "Fjellbua – Bjorli is de horeca bij Fjellheisen. Of het open is, hangt af van de omstandigheden.",
    instaBefore: "Volg ",
    instaAfter: " op Instagram voor het laatste nieuws over eten, drinken en evenementen in Bjorli Skisenter.",
    logoAlt: "Logo van Bjorli Spisestedene",
    collageAlt: "Sfeerbeelden van Bjorli Fjellkafe en Heiskroa bij Bjorli Skisenter met café, lounge, open haard, gebak en winterse sfeer.",
    passesForLabel: 'Geschikt voor: ',
    practicalLabel: 'Praktisch: ',
    practicalInfoTitle: 'Praktische informatie',
    practicalItems: [
      'Openingstijden variëren met seizoen, weer, feestdagen en evenementen.',
      'Check altijd de eigen kanalen van de plek voor actuele informatie.',
      'Neem voor groepen en grotere bezoeken rechtstreeks contact op met het serveerpunt.',
    ],
    handelTeaserTitle: 'Winkelen in Bjorli',
    handelTeaserBody: 'Sportuitrusting, skiverhuur, boodschappen, cadeaus of laden? Bekijk het overzicht van winkels en praktische zaken in Bjorli.',
    handelTeaserLink: 'Bekijk winkelen in Bjorli',
    faqTitle: 'Veelgestelde vragen',
    faq: [
      { q: "Is er horeca in het skigebied?", a: "Ja. In Bjorli Skisenter vind je Bjorli Fjellkafe en Heiskroa. Bij Fjellheisen ligt ook Fjellbua – Bjorli, dat opengaat wanneer de omstandigheden het toelaten." },
      { q: "Wat is het verschil tussen Bjorli Fjellkafe en Heiskroa?", a: "Bjorli Fjellkafe is het hoofdgebouw met Kafeen en Loungen; in het serveergedeelte geldt een eetverplichting. Heiskroa is een opwarmruimte om op te warmen, te wachten en even pauze te nemen." },
      { q: "Waar vind ik een opwarmruimte?", a: "De opwarmruimte is in Heiskroa in het skigebied." },
      { q: "Is er après-ski in Bjorli?", a: "Op Loftet, op de eerste verdieping van Bjorli Fjellkafe, kan après-ski, een quiz of een ander evenement plaatsvinden. Bekijk wat er te doen is voor actuele data." },
      { q: 'Zijn er andere eetplekken in Bjorli?', a: 'Ja. Buiten het skigebied vind je onder andere HILLS Bjorli en YX Bjorli. Avdemsbue ligt op ongeveer 35 km en is een goede optie voor een maaltijd in Gudbrandsdalen.' },
      { q: 'Waar ligt Avdemsbue?', a: 'Avdemsbue ligt op ongeveer 35 km van Bjorli, in Gudbrandsdalen.' },
    ],
  },
  da: {
    introBefore: 'På Bjorli er der flere steder til mad, drikke og en god pause hele året. Uden for skicentret ligger blandt andet ',
    introMid1: 'Avdemsbue',
    introMid2: 'HILLS Bjorli',
    introMid3: 'YX Bjorli',
    introMid4: 'Bunnpris Lesjaskog',
    introEnd: ", og dagligvarer får du på Bunnpris Lesjaskog og Coop Marked Lesjaverk, hvis du hellere vil lave maden selv i hytten. I skisæsonen, når liftene kører, finder du desuden Bjorli Fjellkafe og Heiskroa inde på selve skicentret.",
    venuesTitle: 'Spisesteder og mødesteder på Bjorli',
    venuesIntro: 'Bjorli har flere spisesteder og mødesteder uden for selve skicentret — åbne hele året. Udvalg og åbningstider kan variere, så tjek altid stedets egne kanaler før besøget.',
    avdemsbueDesc: 'Avdemsbue ligger omkring 35 km fra Bjorli og er et godt valg, hvis du vil kombinere turen med lokal mad, gårdsmiljø og en madoplevelse i Gudbrandsdalen.',
    avdemsbueLink: 'Se Avdemsbue',
    hillsDesc: 'HILLS Bjorli serverer mad og drikke i moderne rammer med en social atmosfære på Bjorli.',
    hillsLink: 'Se HILLS Bjorli på Facebook',
    yxDesc: 'YX Bjorli er storkiosk, grill, tankstation og et centralt mødested på Bjorli.',
    yxLink: 'Se YX Bjorli på Facebook',
    localFoodTitle: 'Lokal mad og dagligvarer',
    localFoodBeforeBunnpris: 'Vil du selv lave maden i hytten? Dagligvarer får du på ',
    localFoodBetween: ' og ',
    localFoodAfter: '. YX Bjorli har desuden et udvalg døgnet rundt.',
    eyebrow: 'I skisæsonen, når liftene kører',
    skiTitle: "Bjorli Fjellkafe, Heiskroa og Fjellbua",
    skiIntro: "I Bjorli Skisenter finder du Bjorli Fjellkafe og Heiskroa. Ved Fjellheisen ligger også Fjellbua – Bjorli, som åbner, når forholdene tillader det. Her er der steder til en hurtig pause, en varm drik, frokost og hyggelige stunder gennem skidagen.",
    skiBody: ["Bjorli Spisestedene er fællesbetegnelsen for serveringsstederne i Bjorli Skisenter.", "Stederne drives samlet, med vægt på god service, hyggelig stemning og mad lavet med omtanke. Hvor det er muligt, bruges lokale råvarer."],
    fjellkafeText: "Bjorli Fjellkafe er navnet på hovedbygningen og serveringskoncepterne der. Kafeen er caféområdet med mad og drikke, mens Loungen er loungeområdet. Der er spisepligt i serveringsområdet i Bjorli Fjellkafe.",
    loftetTitle: "Loftet",
    loftetBefore: "Loftet ligger på første sal i Bjorli Fjellkafe. Her kan der være bar, quiz, afterski, undervisning og andre arrangementer. ",
    loftetLink: "Se hvad der sker",
    loftetAfter: " for aktuelle aktiviteter.",
    heiskroaText: "Heiskroa fortsætter som varmestue. Her kan du varme dig, vente på andre og tage en enkel pause i løbet af skidagen.",
    fjellbuaText: "Fjellbua – Bjorli er serveringen ved Fjellheisen. Åbning afhænger af forholdene.",
    instaBefore: "Følg ",
    instaAfter: " på Instagram for de seneste nyheder om mad, drikke og arrangementer i Bjorli Skisenter.",
    logoAlt: "Logo for Bjorli Spisestedene",
    collageAlt: "Stemningsbilleder fra Bjorli Fjellkafe og Heiskroa i Bjorli Skisenter med café, lounge, pejs, bagværk og vinterstemning.",
    passesForLabel: 'Passer til: ',
    practicalLabel: 'Praktisk: ',
    practicalInfoTitle: 'Praktisk information',
    practicalItems: [
      'Åbningstider kan variere med sæson, vejr, helligdage og arrangementer.',
      'Tjek altid stedets egne kanaler for opdateret information.',
      'For grupper og større besøg anbefales det at kontakte stedet direkte.',
    ],
    handelTeaserTitle: 'Indkøb på Bjorli',
    handelTeaserBody: 'Mangler du sportsudstyr, skiudlejning, dagligvarer, gaver eller opladning? Se oversigten over indkøb og daglige ærinder på Bjorli.',
    handelTeaserLink: 'Se indkøb på Bjorli',
    faqTitle: 'Ofte stillede spørgsmål',
    faq: [
      { q: "Er der servering på skicentret?", a: "Ja. I Bjorli Skisenter finder du Bjorli Fjellkafe og Heiskroa. Ved Fjellheisen ligger også Fjellbua – Bjorli, som åbner, når forholdene tillader det." },
      { q: "Hvad er forskellen på Bjorli Fjellkafe og Heiskroa?", a: "Bjorli Fjellkafe er hovedbygningen med Kafeen og Loungen, og der er spisepligt i serveringsområdet. Heiskroa er varmestue, hvor du kan varme dig, vente på andre og tage en enkel pause." },
      { q: "Hvor finder jeg en varmestue?", a: "Varmestuen finder du i Heiskroa på skicentret." },
      { q: "Er der afterski på Bjorli?", a: "På Loftet på første sal i Bjorli Fjellkafe kan der være afterski, quiz og andre arrangementer. Se hvad der sker for aktuelle datoer." },
      { q: 'Er der andre spisesteder på Bjorli?', a: 'Ja. Uden for skicentret findes blandt andet HILLS Bjorli og YX Bjorli. Avdemsbue ligger omkring 35 km væk og er et godt alternativ for en madoplevelse i Gudbrandsdalen.' },
      { q: 'Hvor ligger Avdemsbue?', a: 'Avdemsbue ligger omkring 35 km fra Bjorli, i Gudbrandsdalen.' },
    ],
  },
  sv: {
    introBefore: 'På Bjorli finns flera ställen för mat, dryck och en bra paus hela året. Utanför skidanläggningen ligger bland annat ',
    introMid1: 'Avdemsbue',
    introMid2: 'HILLS Bjorli',
    introMid3: 'YX Bjorli',
    introMid4: 'Bunnpris Lesjaskog',
    introEnd: ", och livsmedel handlar du på Bunnpris Lesjaskog och Coop Marked Lesjaverk om du hellre lagar maten i stugan. Under skidsäsongen, när liftarna går, hittar du dessutom Bjorli Fjellkafe och Heiskroa inne på själva skidanläggningen.",
    venuesTitle: 'Mat- och mötesplatser på Bjorli',
    venuesIntro: 'Bjorli har flera mat- och mötesplatser utanför skidanläggningen — öppna året runt. Utbud och öppettider kan variera, så kontrollera alltid platsens egna kanaler innan besöket.',
    avdemsbueDesc: 'Avdemsbue ligger omkring 35 km från Bjorli och är ett bra val om du vill kombinera turen med lokala råvaror, gårdsmiljö och en måltid i Gudbrandsdalen.',
    avdemsbueLink: 'Se Avdemsbue',
    hillsDesc: 'HILLS Bjorli serverar mat och dryck i moderna lokaler med en social atmosfär på Bjorli.',
    hillsLink: 'Se HILLS Bjorli på Facebook',
    yxDesc: 'YX Bjorli är storkiosk, gatukök, bensinstation och en central mötesplats på Bjorli.',
    yxLink: 'Se YX Bjorli på Facebook',
    localFoodTitle: 'Lokal mat och livsmedel',
    localFoodBeforeBunnpris: 'Vill du laga maten själv i stugan? Livsmedel handlar du på ',
    localFoodBetween: ' och ',
    localFoodAfter: '. YX Bjorli har dessutom ett utbud dygnet runt.',
    eyebrow: 'Under skidsäsongen, när liftarna går',
    skiTitle: "Bjorli Fjellkafe, Heiskroa och Fjellbua",
    skiIntro: "I Bjorli Skisenter hittar du Bjorli Fjellkafe och Heiskroa. Vid Fjellheisen ligger också Fjellbua – Bjorli, som öppnar när förhållandena tillåter. Här finns ställen för en snabb paus, varm dryck, lunch och trevliga stunder under skiddagen.",
    skiBody: ["Bjorli Spisestedene är det gemensamma namnet på serveringarna i Bjorli Skisenter.", "Ställena drivs tillsammans, med fokus på god service, mysig stämning och mat lagad med omtanke. Där det går används lokala råvaror."],
    fjellkafeText: "Bjorli Fjellkafe är namnet på huvudbyggnaden och serveringskoncepten där. Kafeen är kaféområdet med mat och dryck, medan Loungen är loungeområdet. Det är matplikt i serveringsområdet i Bjorli Fjellkafe.",
    loftetTitle: "Loftet",
    loftetBefore: "Loftet ligger på andra våningen i Bjorli Fjellkafe. Här kan det vara bar, quiz, afterski, undervisning och andra evenemang. ",
    loftetLink: "Se vad som händer",
    loftetAfter: " för aktuella aktiviteter.",
    heiskroaText: "Heiskroa finns kvar som värmestuga. Här kan du värma dig, vänta på andra och ta en enkel paus under skiddagen.",
    fjellbuaText: "Fjellbua – Bjorli är serveringen vid Fjellheisen. Öppettiderna beror på förhållandena.",
    instaBefore: "Följ ",
    instaAfter: " på Instagram för de senaste nyheterna om mat, dryck och evenemang i Bjorli Skisenter.",
    logoAlt: "Logotyp för Bjorli Spisestedene",
    collageAlt: "Stämningsbilder från Bjorli Fjellkafe och Heiskroa på Bjorli Skisenter med kafé, lounge, öppen spis, bakverk och vinterstämning.",
    passesForLabel: 'Passar för: ',
    practicalLabel: 'Praktiskt: ',
    practicalInfoTitle: 'Praktisk information',
    practicalItems: [
      'Öppettider kan variera med säsong, väder, helger och evenemang.',
      'Kontrollera alltid platsens egna kanaler för aktuell information.',
      'För grupper och större sällskap rekommenderas att kontakta serveringsstället direkt.',
    ],
    handelTeaserTitle: 'Handel på Bjorli',
    handelTeaserBody: 'Behöver du sportutrustning, skiduthyrning, livsmedel, presenter eller laddning? Se översikten över handel och ärenden på Bjorli.',
    handelTeaserLink: 'Se handel på Bjorli',
    faqTitle: 'Vanliga frågor',
    faq: [
      { q: "Finns det servering på skidanläggningen?", a: "Ja. I Bjorli Skisenter hittar du Bjorli Fjellkafe och Heiskroa. Vid Fjellheisen ligger också Fjellbua – Bjorli, som öppnar när förhållandena tillåter." },
      { q: "Vad är skillnaden på Bjorli Fjellkafe och Heiskroa?", a: "Bjorli Fjellkafe är huvudbyggnaden med Kafeen och Loungen, och det är matplikt i serveringsområdet. Heiskroa är värmestuga där du kan värma dig, vänta på andra och ta en enkel paus." },
      { q: "Var hittar jag en värmestuga?", a: "Värmestugan finns i Heiskroa på skidanläggningen." },
      { q: "Finns det afterski på Bjorli?", a: "På Loftet på andra våningen i Bjorli Fjellkafe kan det vara afterski, quiz och andra evenemang. Se vad som händer för aktuella datum." },
      { q: 'Finns det andra matställen på Bjorli?', a: 'Ja. Utanför skidanläggningen finns bland annat HILLS Bjorli och YX Bjorli. Avdemsbue ligger omkring 35 km bort och är ett bra alternativ för en måltid i Gudbrandsdalen.' },
      { q: 'Var ligger Avdemsbue?', a: 'Avdemsbue ligger omkring 35 km från Bjorli, i Gudbrandsdalen.' },
    ],
  },
};

const foodDrinkImg = images.restaurantInterior.src;

const FoodDrink = () => {
  const { t } = useLanguage();
  const s = t.foodDrinkPage;
  const lp = useLocalizedPath();
  const c = usePageCopy(COPY);
  const faqItems = c.faq;

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={foodDrinkImg} />

      {/* Intro */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {c.introBefore}
              <strong className="text-foreground font-medium">{c.introMid1}</strong>,{' '}
              <strong className="text-foreground font-medium">{c.introMid2}</strong>{' og '}
              <strong className="text-foreground font-medium">{c.introMid3}</strong>
              {c.introEnd}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Other places */}
      <section className="py-16 md:py-24 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{c.venuesTitle}</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">{c.venuesIntro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Avdemsbue */}
            <Card className="overflow-hidden flex flex-col bg-card/60 backdrop-blur border-border/60">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={images.avdemsbue.src}
                  alt={images.avdemsbue.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-secondary" />
                  <h3 className="font-display text-xl font-bold">Avdemsbue</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {c.avdemsbueDesc}
                </p>
                <a
                  href="https://www.avdem.no/avdemsbue/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  onClick={() =>
                    trackExternalPartnerClick({
                      partner_name: 'Avdemsbue',
                      partner_category: 'food_drink',
                      link_url: 'https://www.avdem.no/avdemsbue/',
                      link_text: c.avdemsbueLink,
                    })
                  }
                >
                  {c.avdemsbueLink} <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* HILLS Bjorli */}
            <Card className="overflow-hidden flex flex-col bg-card/60 backdrop-blur border-border/60">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={images.hillsBjorli.src}
                  alt={images.hillsBjorli.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="h-5 w-5 text-secondary" />
                  <h3 className="font-display text-xl font-bold">HILLS Bjorli</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {c.hillsDesc}
                </p>
                <a
                  href="https://www.facebook.com/p/HILLS-Bjorli-100071004056072/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  onClick={() =>
                    trackExternalPartnerClick({
                      partner_name: 'HILLS Bjorli',
                      partner_category: 'food_drink',
                      link_url: 'https://www.facebook.com/p/HILLS-Bjorli-100071004056072/',
                      link_text: c.hillsLink,
                    })
                  }
                >
                  {c.hillsLink} <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* YX Bjorli */}
            <Card className="overflow-hidden flex flex-col bg-card/60 backdrop-blur border-border/60">
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary/15 to-muted flex items-center justify-center">
                <Fuel className="h-16 w-16 text-secondary/60" aria-hidden />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="h-5 w-5 text-secondary" />
                  <h3 className="font-display text-xl font-bold">YX Bjorli</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {c.yxDesc}
                </p>
                <a
                  href="https://www.facebook.com/profile.php?id=100057615902711"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  onClick={() =>
                    trackExternalPartnerClick({
                      partner_name: 'YX Bjorli',
                      partner_category: 'food_drink',
                      link_url: 'https://www.facebook.com/profile.php?id=100057615902711',
                      link_text: c.yxLink,
                    })
                  }
                >
                  {c.yxLink} <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Lokalmat og dagligvarer */}
          <div className="mt-10 rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-2">{c.localFoodTitle}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {c.localFoodBeforeBunnpris}
                  <strong className="text-foreground font-medium">Bunnpris Lesjaskog</strong>
                  {c.localFoodBetween}
                  <strong className="text-foreground font-medium">Coop Marked Lesjaverk</strong>
                  {c.localFoodAfter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured: Heiskroa & T-Kroken — only in ski season */}
      <section className="py-16 md:py-24 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-secondary text-xs font-semibold tracking-[0.22em] uppercase mb-3">{c.eyebrow}</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{c.heiskroaTKrokenTitle}</h2>
            <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {c.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            <img
              src={images.tkrokenCollage.src}
              alt={s.imageAlt}
              className="w-full h-auto rounded-2xl shadow-md border border-border"
              loading="lazy"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                    <Flame className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">Heiskroa</h3>
                  <p className="text-secondary font-medium mb-4">{s.heiskroa.tag}</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {s.heiskroa.desc}
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-semibold text-foreground">{c.passesForLabel}</span><span className="text-muted-foreground">{c.heiskroaPassesFor}</span></li>
                    <li><span className="font-semibold text-foreground">{c.practicalLabel}</span><span className="text-muted-foreground">{c.heiskroaPractical}</span></li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">T-Kroken</h3>
                  <p className="text-secondary font-medium mb-4">{s.tkroken.tag}</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {s.tkroken.desc}
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-semibold text-foreground">{c.passesForLabel}</span><span className="text-muted-foreground">{c.tkrokenPassesFor}</span></li>
                    <li><span className="font-semibold text-foreground">{c.practicalLabel}</span><span className="text-muted-foreground">{c.tkrokenPractical}</span></li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{c.practicalInfoTitle}</h2>
          <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
            {c.practicalItems.map((it) => <li key={it}>{it}</li>)}
          </ul>
        </div>
      </section>

      {/* Related: Handel */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-card/60 backdrop-blur border-border/60">
            <CardContent className="p-8 flex flex-col md:flex-row md:items-center gap-6">
              <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold mb-2">{c.handelTeaserTitle}</h2>
                <p className="text-muted-foreground leading-relaxed">{c.handelTeaserBody}</p>
              </div>
              <Link
                to={lp('/handel')}
                className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline shrink-0"
              >
                {c.handelTeaserLink} <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <FaqBlock title={c.faqTitle} items={faqItems} />
    </div>
  );
};

export default FoodDrink;
