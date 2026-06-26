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
  heiskroaTKrokenTitle: string;
  paragraphs: string[];
  heiskroaPassesFor: string;
  heiskroaPractical: string;
  tkrokenPassesFor: string;
  tkrokenPractical: string;
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
    introEnd: ', og dagligvarer får du på Bunnpris Lesjaskog og Coop Marked Lesjaverk om du heller vil lage maten selv på hytta. I skisesongen, når heisene går, åpner i tillegg Heiskroa og T-Kroken inne på selve skisenteret.',
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
    heiskroaTKrokenTitle: 'Heiskroa og T-Kroken i skisenteret',
    paragraphs: [
      'I skisenteret finner du både Heiskroa og T-Kroken. Sammen gir de gjestene et godt tilbud gjennom skidagen, enten du vil ha en rask pause, varm drikke, lunsj, loungefølelse eller afterski etter siste tur.',
      'Begge serveringsstedene drives samlet, med vekt på god service, lun stemning og mat laget med omtanke. Der det er mulig brukes kortreiste og lokale råvarer.',
      'T-Kroken er stedet for deg som vil sette deg ned for mat, drikke og en mer komplett serveringsopplevelse. Her gjelder spiseplikt i serveringsområdet.',
      'Heiskroa fungerer også som varmestue, og passer godt for gjester som trenger en enkel pause, varme seg, vente på andre eller ta en stoppestund i løpet av skidagen.',
    ],
    heiskroaPassesFor: 'Varm pause, enkel servering, møtepunkt og varmestue.',
    heiskroaPractical: 'Varmestue finner du i Heiskroa. Åpent i skisesongen, når heisene går.',
    tkrokenPassesFor: 'Mat, drikke, loungefølelse og afterski.',
    tkrokenPractical: 'I serveringsområdet på T-Kroken gjelder spiseplikt. Åpent i skisesongen, når heisene går.',
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
      { q: 'Finnes det servering i skisenteret?', a: 'Ja. Bjorli Skisenter har to serveringssteder: Heiskroa og T-Kroken. Sammen dekker de alt fra en rask pause til mat, drikke og afterski.' },
      { q: 'Hva er forskjellen på Heiskroa og T-Kroken?', a: 'T-Kroken er for deg som vil sette deg ned for mat og drikke — her gjelder spiseplikt i serveringsområdet. Heiskroa fungerer også som varmestue og passer for en enklere pause i løpet av skidagen.' },
      { q: 'Hvor finner jeg varmestue?', a: 'Varmestue finner du i Heiskroa, sentralt i skisenteret.' },
      { q: 'Finnes det afterski på Bjorli?', a: 'Ja. T-Kroken tilbyr loungefølelse og afterski tett på bakken etter siste tur.' },
      { q: 'Finnes det andre spisesteder på Bjorli?', a: 'Ja. Utenfor skisenteret finner du blant annet HILLS Bjorli og YX Bjorli. Avdemsbue ligger omtrent 35 km unna og er et godt alternativ for en matopplevelse i Gudbrandsdalen.' },
      { q: 'Hvor ligger Avdemsbue?', a: 'Avdemsbue ligger omtrent 35 km fra Bjorli, i Gudbrandsdalen.' },
    ],
  },
  en: {
    introBefore: 'There are several places for food, drink and a good break in Bjorli all year. Outside the ski resort you’ll find ',
    introMid1: 'Avdemsbue',
    introMid2: 'HILLS Bjorli',
    introMid3: 'YX Bjorli',
    introMid4: 'Bunnpris Lesjaskog',
    introEnd: ', and groceries at Bunnpris Lesjaskog and Coop Marked Lesjaverk if you’d rather cook at the cabin. During the ski season, when the lifts are running, Heiskroa and T-Kroken also open up at the ski resort itself.',
    venuesTitle: 'Places to eat and meet in Bjorli',
    venuesIntro: 'Bjorli has several places to eat and meet outside the ski resort — open through the year. Selection and opening hours can vary, so always check each place’s own channels before you visit.',
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
    eyebrow: 'During the ski season, when the lifts run',
    heiskroaTKrokenTitle: 'Heiskroa and T-Kroken at the ski resort',
    paragraphs: [
      'At the ski resort you’ll find both Heiskroa and T-Kroken. Together they cover the ski day — a quick break, a hot drink, lunch, a lounge moment or après-ski after the last run.',
      'Both venues are run together, with a focus on good service, a warm atmosphere and food made with care. Local ingredients are used wherever possible.',
      'T-Kroken is the place to sit down for food, drink and a fuller dining experience. Note that food must be ordered in the dining area.',
      'Heiskroa also works as a warming room and is well suited for a simple break, somewhere to warm up, wait for friends or pause during the ski day.',
    ],
    heiskroaPassesFor: 'Warm break, simple service, meeting point and warming room.',
    heiskroaPractical: 'The warming room is inside Heiskroa. Open during the ski season, when the lifts run.',
    tkrokenPassesFor: 'Food, drink, lounge atmosphere and après-ski.',
    tkrokenPractical: 'Food must be ordered in the dining area at T-Kroken. Open during the ski season, when the lifts run.',
    passesForLabel: 'Good for: ',
    practicalLabel: 'Practical: ',
    practicalInfoTitle: 'Practical information',
    practicalItems: [
      'Opening hours vary with season, weather, holidays and events.',
      'Always check each place’s own channels for current information.',
      'For groups and larger bookings, contact the venue directly.',
    ],
    handelTeaserTitle: 'Shopping in Bjorli',
    handelTeaserBody: 'Need sports gear, ski rental, groceries, gifts or EV charging? See the overview of shops and everyday errands in Bjorli.',
    handelTeaserLink: 'See shopping in Bjorli',
    faqTitle: 'Frequently asked questions',
    faq: [
      { q: 'Is there food and drink at the ski resort?', a: 'Yes. Bjorli Skisenter has two venues: Heiskroa and T-Kroken. Together they cover everything from a quick break to food, drink and après-ski.' },
      { q: 'What is the difference between Heiskroa and T-Kroken?', a: 'T-Kroken is for sitting down to eat and drink — food must be ordered in the dining area. Heiskroa also works as a warming room and suits a simpler break during the ski day.' },
      { q: 'Where is the warming room?', a: 'The warming room is inside Heiskroa, in the centre of the ski resort.' },
      { q: 'Is there après-ski in Bjorli?', a: 'Yes. T-Kroken offers a lounge atmosphere and après-ski close to the slopes after the last run.' },
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
    introEnd: ', und Lebensmittel gibt es bei Bunnpris Lesjaskog und Coop Marked Lesjaverk, wenn Sie lieber in der Hütte selbst kochen. Während der Skisaison, wenn die Lifte laufen, öffnen zusätzlich Heiskroa und T-Kroken direkt im Skigebiet.',
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
    heiskroaTKrokenTitle: 'Heiskroa und T-Kroken im Skigebiet',
    paragraphs: [
      'Im Skigebiet gibt es Heiskroa und T-Kroken. Zusammen decken sie den ganzen Skitag ab — von der kurzen Pause über heiße Getränke und Mittagessen bis zum Lounge-Moment und Après-Ski nach der letzten Abfahrt.',
      'Beide Lokale werden gemeinsam betrieben, mit Fokus auf Service, eine warme Atmosphäre und sorgfältig zubereitetes Essen. Wo möglich kommen lokale Zutaten zum Einsatz.',
      'T-Kroken ist der richtige Ort, um sich für Essen, Trinken und ein vollständiges Service-Erlebnis hinzusetzen. Im Servicebereich besteht Verzehrpflicht.',
      'Heiskroa dient zugleich als Wärmestube und eignet sich für eine einfache Pause, zum Aufwärmen, Warten auf andere oder einen kurzen Stopp während des Skitags.',
    ],
    heiskroaPassesFor: 'Warme Pause, einfache Bewirtung, Treffpunkt und Wärmestube.',
    heiskroaPractical: 'Die Wärmestube befindet sich in der Heiskroa. Geöffnet in der Skisaison, wenn die Lifte laufen.',
    tkrokenPassesFor: 'Essen, Trinken, Lounge-Atmosphäre und Après-Ski.',
    tkrokenPractical: 'Im Servicebereich der T-Kroken besteht Verzehrpflicht. Geöffnet in der Skisaison, wenn die Lifte laufen.',
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
      { q: 'Gibt es Gastronomie im Skigebiet?', a: 'Ja. Das Bjorli Skisenter hat zwei Lokale: Heiskroa und T-Kroken. Zusammen decken sie von der kurzen Pause bis Essen, Trinken und Après-Ski alles ab.' },
      { q: 'Was ist der Unterschied zwischen Heiskroa und T-Kroken?', a: 'T-Kroken eignet sich für Essen und Trinken am Tisch — im Servicebereich besteht Verzehrpflicht. Heiskroa dient zugleich als Wärmestube und passt für eine einfachere Pause.' },
      { q: 'Wo finde ich die Wärmestube?', a: 'Die Wärmestube befindet sich in der Heiskroa, mitten im Skigebiet.' },
      { q: 'Gibt es Après-Ski in Bjorli?', a: 'Ja. T-Kroken bietet nach der letzten Abfahrt Lounge-Atmosphäre und Après-Ski direkt an der Piste.' },
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
    introEnd: ', en boodschappen haal je bij Bunnpris Lesjaskog en Coop Marked Lesjaverk als je liever zelf in de hut kookt. Tijdens het skiseizoen, wanneer de liften draaien, openen ook Heiskroa en T-Kroken in het skigebied zelf.',
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
    heiskroaTKrokenTitle: 'Heiskroa en T-Kroken in het skigebied',
    paragraphs: [
      'In het skigebied vind je Heiskroa en T-Kroken. Samen dekken ze de hele skidag — een snelle pauze, een warm drankje, lunch, lounge-moment of après-ski na de laatste afdaling.',
      'Beide plekken worden samen gerund, met aandacht voor service, een warme sfeer en eten dat met zorg wordt bereid. Waar mogelijk worden lokale ingrediënten gebruikt.',
      'T-Kroken is de plek om aan tafel te eten en drinken voor een vollere ervaring. In het serveerdeel geldt een eetverplichting.',
      'Heiskroa is ook warmteruimte en geschikt voor een simpele pauze, even opwarmen, op elkaar wachten of kort uitrusten tijdens de skidag.',
    ],
    heiskroaPassesFor: 'Warme pauze, eenvoudige bediening, ontmoetingsplek en warmteruimte.',
    heiskroaPractical: 'De warmteruimte zit in Heiskroa. Open tijdens het skiseizoen, als de liften draaien.',
    tkrokenPassesFor: 'Eten, drinken, lounge-sfeer en après-ski.',
    tkrokenPractical: 'In het serveerdeel van T-Kroken geldt een eetverplichting. Open tijdens het skiseizoen, als de liften draaien.',
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
      { q: 'Is er horeca in het skigebied?', a: 'Ja. Bjorli Skisenter heeft twee plekken: Heiskroa en T-Kroken. Samen dekken ze alles van een snelle pauze tot eten, drinken en après-ski.' },
      { q: 'Wat is het verschil tussen Heiskroa en T-Kroken?', a: 'T-Kroken is om te gaan zitten voor eten en drinken — in het serveerdeel geldt een eetverplichting. Heiskroa is ook warmteruimte en past voor een eenvoudiger pauze.' },
      { q: 'Waar is de warmteruimte?', a: 'De warmteruimte zit in Heiskroa, midden in het skigebied.' },
      { q: 'Is er après-ski in Bjorli?', a: 'Ja. T-Kroken biedt na de laatste afdaling lounge-sfeer en après-ski vlak naast de piste.' },
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
    introEnd: ', og dagligvarer får du på Bunnpris Lesjaskog og Coop Marked Lesjaverk, hvis du hellere vil lave maden selv i hytten. I skisæsonen, når liftene kører, åbner desuden Heiskroa og T-Kroken inde på selve skicentret.',
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
    heiskroaTKrokenTitle: 'Heiskroa og T-Kroken på skicentret',
    paragraphs: [
      'På skicentret finder du både Heiskroa og T-Kroken. Sammen dækker de hele skidagen — en hurtig pause, en varm drik, frokost, en lounge-stund eller afterski efter sidste tur.',
      'Begge steder drives sammen med fokus på god service, en lun stemning og mad lavet med omtanke. Hvor det er muligt bruges lokale råvarer.',
      'T-Kroken er stedet at sætte sig ned for mad, drikke og en mere komplet oplevelse. I serveringsområdet er der spisepligt.',
      'Heiskroa fungerer også som varmestue og passer godt til en enkel pause, til at varme sig, vente på de andre eller tage et kort stop i løbet af skidagen.',
    ],
    heiskroaPassesFor: 'Varm pause, enkel servering, mødested og varmestue.',
    heiskroaPractical: 'Varmestuen ligger i Heiskroa. Åbent i skisæsonen, når liftene kører.',
    tkrokenPassesFor: 'Mad, drikke, lounge-stemning og afterski.',
    tkrokenPractical: 'I serveringsområdet på T-Kroken er der spisepligt. Åbent i skisæsonen, når liftene kører.',
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
      { q: 'Er der servering på skicentret?', a: 'Ja. Bjorli Skisenter har to spisesteder: Heiskroa og T-Kroken. Sammen dækker de alt fra en hurtig pause til mad, drikke og afterski.' },
      { q: 'Hvad er forskellen på Heiskroa og T-Kroken?', a: 'T-Kroken er stedet at sætte sig ned for mad og drikke — i serveringsområdet er der spisepligt. Heiskroa fungerer også som varmestue og passer til en enklere pause.' },
      { q: 'Hvor finder jeg varmestue?', a: 'Varmestuen ligger i Heiskroa, centralt i skicentret.' },
      { q: 'Er der afterski på Bjorli?', a: 'Ja. T-Kroken tilbyder lounge-stemning og afterski tæt på pisten efter sidste tur.' },
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
    introEnd: ', och livsmedel handlar du på Bunnpris Lesjaskog och Coop Marked Lesjaverk om du hellre lagar maten i stugan. Under skidsäsongen, när liftarna går, öppnar dessutom Heiskroa och T-Kroken inne på själva skidanläggningen.',
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
    heiskroaTKrokenTitle: 'Heiskroa och T-Kroken på skidanläggningen',
    paragraphs: [
      'På skidanläggningen finns både Heiskroa och T-Kroken. Tillsammans täcker de hela skiddagen — en snabb paus, varm dryck, lunch, en stund i loungen eller afterski efter sista åket.',
      'Båda ställen drivs ihop, med fokus på service, ombonad stämning och mat lagad med omsorg. Där det är möjligt används lokala råvaror.',
      'T-Kroken är platsen för att sätta sig ner för mat, dryck och en mer komplett upplevelse. I serveringsdelen gäller matplikt.',
      'Heiskroa fungerar också som värmestuga och passar för en enkel paus, värma sig, vänta in sällskapet eller ta en kort stund under skiddagen.',
    ],
    heiskroaPassesFor: 'Varm paus, enkel servering, mötesplats och värmestuga.',
    heiskroaPractical: 'Värmestugan finns i Heiskroa. Öppet under skidsäsongen, när liftarna går.',
    tkrokenPassesFor: 'Mat, dryck, loungestämning och afterski.',
    tkrokenPractical: 'I serveringsdelen av T-Kroken gäller matplikt. Öppet under skidsäsongen, när liftarna går.',
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
      { q: 'Finns det servering på skidanläggningen?', a: 'Ja. Bjorli Skisenter har två ställen: Heiskroa och T-Kroken. Tillsammans täcker de allt från en snabb paus till mat, dryck och afterski.' },
      { q: 'Vad är skillnaden på Heiskroa och T-Kroken?', a: 'T-Kroken är platsen att sätta sig ner för mat och dryck — i serveringsdelen gäller matplikt. Heiskroa fungerar också som värmestuga och passar för en enklare paus.' },
      { q: 'Var finns värmestugan?', a: 'Värmestugan finns i Heiskroa, mitt på skidanläggningen.' },
      { q: 'Finns det afterski på Bjorli?', a: 'Ja. T-Kroken erbjuder loungestämning och afterski nära backen efter sista åket.' },
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
