import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink, MapPin, Phone, Mail, Info, Camera } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';

import heroImg from '@/assets/farms/gardsbesok-lesja-kulturlandskap.avif';
import brendjordsbyenImg from '@/assets/farms/gardsbesok-brendjordsbyen-tun.avif';
import brendjordsbyenAltImg from '@/assets/farms/gardsbesok-brendjordsbyen-interior.avif';
import bjokneImg from '@/assets/farms/gardsbesok-bjokne-smabruk.avif';
import ljosbakkenImg from '@/assets/farms/gardsbesok-ljosbakken-gard.avif';
import kolstadImg from '@/assets/farms/gardsbesok-kolstad-gard.avif';
import kolstadMiljoImg from '@/assets/farms/gardsbesok-kolstad-gard-miljo.avif';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

type Cta = { label: string; href: string };
type FarmText = { title: string; alt: string; text: string };
type Copy = {
  metaTitle: string; metaDesc: string;
  heroTitle: string; heroSubtitle: string;
  bcHome: string; bcSummer: string; bcActivities: string; bcSelf: string;
  introTitle: string; introP1: string; introP2: string; introP3: string;
  seeFarms: string; summerLink: string;
  farms: { brend: FarmText; bjokne: FarmText; kolstad: FarmText };
  ctaBrend: string; ctaBjokneA: string; ctaBjokneB: string; ctaKolstad: string;
  practicalTitle: string; practicalBody: string;
  linkStay: string; linkActivities: string; linkGetting: string;
  imageCreditLabel: string; imageCreditBody: string;
  ariaOpensNewTab: (label: string) => string;
  altBrendAlt: string; altLjos: string; altKolstadMiljo: string;
};

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', Copy> = {
  no: {
    metaTitle: 'Gardsbesøk på Bjorli | Gårder, dyr og lokal kultur i Lesja',
    metaDesc: 'Opplev gårdsbesøk rundt Bjorli og Lesja. Besøk Brendjordsbyen, Bjøkne/Ljosbakken gard og Kolstad Gård for gårdsliv, overnatting, lokal mat og kulturlandskap.',
    heroTitle: 'Gardsbesøk på Bjorli',
    heroSubtitle: 'Rundt Bjorli er det mange flotte gårder som har åpent for besøk, servering og overnatting.',
    bcHome: 'Bjorli', bcSummer: 'Sommer', bcActivities: 'Aktiviteter', bcSelf: 'Gardsbesøk',
    introTitle: 'Gårdsopplevelser nær Bjorli',
    introP1: 'Opplev sjarmen og naturskjønnheten ved gårdsbesøk. Her kan du komme tett på gårdsliv, dyr, lokal matkultur og levende kulturlandskap. Gårdsbesøk passer både for familier, par og gjester som ønsker en roligere opplevelse tett på naturen.',
    introP2: 'Kombiner gjerne et opphold på Bjorli med lokal mat, overnatting, kulturlandskap, fjellturer og rolige aktiviteter på en av gårdene i Lesja.',
    introP3: 'Tilbud, åpningstider og booking kan variere. Sjekk alltid gårdens egen nettside før besøk.',
    seeFarms: 'Se gårdene', summerLink: 'Sommer på Bjorli',
    farms: {
      brend: { title: 'Brendjordsbyen', alt: 'Brendjordsbyen i Lesja med restaurerte tømmerhus', text: 'I århundrer har Brendjordsbyen tatt imot fastboende og langveisfarende fra alle himmelretninger med mat og hvile i hjertet av fjellbygda Lesja. I dag er du velkommen til å våkne i unikt restaurerte og verneverdige tømmerhus midt i et levende kulturlandskap, med fjell og gårdsdrift rundt — og ferskt bakverk fra vedfyrt steinovn i fjøset.' },
      bjokne: { title: 'Bjøkne / Ljosbakken gard', alt: 'Småbruket på Bjøkne ved Ljosbakken gard', text: 'Lev småbrukslivet på ekte, og gi hele familien en ferie der dere bor på og driver et småbruk. Bjøkne ligger i Lesja i Nord-Gudbrandsdalen og er en del av Ljosbakken gard. SmåbruksOpplevelsen er et pakkekonsept med eget lite småbruk, jord under neglene i kjøkkenhagen, kontakt med dyr, enkle gårdsoppgaver etter ønske og måltider av råvarer fra Nord-Gudbrandsdalen. Det tilbys også vanlig gårdsovernatting i et koselig gårdshus — fint for par, barnefamilier og friluftsfolk.' },
      kolstad: { title: 'Kolstad Gård', alt: 'Kolstad Gård i Lesja', text: 'På tur fra øst til vest eller sør til nord? Øverst i Gudbrandsdalen, mellom Romsdalen og Trøndelag, ligger Lesja og Kolstad gård. Du finner gården i Lesja sentrum, like ved Lesja kyrkje, Lesja Bygdemuseum og Tunstugu.' },
    },
    ctaBrend: 'Besøk Brendjordsbyen', ctaBjokneA: 'Se Småbruket Bjøkne', ctaBjokneB: 'Se Ljosbakken gard', ctaKolstad: 'Besøk Kolstad Gård',
    practicalTitle: 'Praktisk informasjon',
    practicalBody: 'Gårdsbesøk, servering og overnatting kan være sesongbasert og må ofte avtales på forhånd. Sjekk gårdens egen nettside for oppdatert informasjon om booking, åpningstider og tilgjengelige aktiviteter.',
    linkStay: 'Overnatting på Bjorli', linkActivities: 'Flere aktiviteter', linkGetting: 'Slik kommer du hit',
    imageCreditLabel: 'Bildekreditering:',
    imageCreditBody: ' Alle bilder er hentet fra hjemmesidene til gårdene som er oppført på denne siden.',
    ariaOpensNewTab: (l) => `${l} (åpnes i ny fane)`,
    altBrendAlt: 'Brendjordsbyen med historisk gårdsmiljø',
    altLjos: 'Ljosbakken gard og småbruksopplevelse i Lesja',
    altKolstadMiljo: 'Gårdsmiljø ved Kolstad Gård i Lesja',
  },
  en: {
    metaTitle: 'Farm visits at Bjorli | Farms, animals and local culture in Lesja',
    metaDesc: 'Discover farm visits around Bjorli and Lesja. Visit Brendjordsbyen, Bjøkne/Ljosbakken gard and Kolstad Gård for farm life, accommodation, local food and cultural landscapes.',
    heroTitle: 'Farm visits at Bjorli',
    heroSubtitle: 'Around Bjorli there are several characterful farms that welcome visitors for tours, meals and overnight stays.',
    bcHome: 'Bjorli', bcSummer: 'Summer', bcActivities: 'Activities', bcSelf: 'Farm visits',
    introTitle: 'Farm experiences near Bjorli',
    introP1: 'A farm visit brings you close to farm life, animals, local food culture and living cultural landscapes. It suits families, couples and anyone who wants a quieter experience close to nature.',
    introP2: 'Combine a stay at Bjorli with local food, accommodation, cultural landscapes, mountain walks and unhurried activities on one of the farms in Lesja.',
    introP3: 'Offerings, opening hours and booking can vary. Please check the farm’s own website before visiting.',
    seeFarms: 'See the farms', summerLink: 'Summer at Bjorli',
    farms: {
      brend: { title: 'Brendjordsbyen', alt: 'Brendjordsbyen in Lesja with restored timber houses', text: 'For centuries Brendjordsbyen has welcomed locals and travellers from all directions with food and rest in the heart of the mountain village of Lesja. Today you’re welcome to wake up in carefully restored, listed timber houses set in living cultural landscape, with mountains and working farms around you — and fresh bread from a wood-fired stone oven in the barn.' },
      bjokne: { title: 'Bjøkne / Ljosbakken gard', alt: 'The smallholding at Bjøkne, part of Ljosbakken gard', text: 'Experience smallholding life for real and give the whole family a holiday where you live on and help run a small farm. Bjøkne lies in Lesja in northern Gudbrandsdalen and is part of Ljosbakken gard. The smallholding package gives guests their own small farm, soil on the hands in the kitchen garden, time with the animals, simple farm tasks if you wish and meals built on produce from northern Gudbrandsdalen. Ordinary farm accommodation is also offered in a snug farmhouse — good for couples, families and outdoor people.' },
      kolstad: { title: 'Kolstad Gård', alt: 'Kolstad Gård in Lesja', text: 'On the road from east to west, or south to north? At the head of Gudbrandsdalen, between Romsdalen and Trøndelag, you’ll find Lesja and Kolstad farm. The farm sits in the centre of Lesja, close to Lesja kyrkje, Lesja Bygdemuseum and Tunstugu.' },
    },
    ctaBrend: 'Visit Brendjordsbyen', ctaBjokneA: 'See Småbruket Bjøkne', ctaBjokneB: 'See Ljosbakken gard', ctaKolstad: 'Visit Kolstad Gård',
    practicalTitle: 'Practical information',
    practicalBody: 'Farm visits, meals and accommodation can be seasonal and usually need to be arranged in advance. Check the farm’s own website for current information on booking, opening hours and available activities.',
    linkStay: 'Accommodation at Bjorli', linkActivities: 'More activities', linkGetting: 'Getting here',
    imageCreditLabel: 'Image credit:',
    imageCreditBody: ' All images are sourced from the websites of the farms listed on this page.',
    ariaOpensNewTab: (l) => `${l} (opens in a new tab)`,
    altBrendAlt: 'Brendjordsbyen with its historic farm setting',
    altLjos: 'Ljosbakken gard and the smallholding experience in Lesja',
    altKolstadMiljo: 'Farm setting at Kolstad Gård in Lesja',
  },
  de: {
    metaTitle: 'Hofbesuche in Bjorli | Höfe, Tiere und lokale Kultur in Lesja',
    metaDesc: 'Erleben Sie Hofbesuche rund um Bjorli und Lesja. Besuchen Sie Brendjordsbyen, Bjøkne/Ljosbakken gard und Kolstad Gård für Hofleben, Übernachtung, lokale Küche und Kulturlandschaft.',
    heroTitle: 'Hofbesuche in Bjorli',
    heroSubtitle: 'Rund um Bjorli laden mehrere charaktervolle Höfe zu Besuchen, Bewirtung und Übernachtung ein.',
    bcHome: 'Bjorli', bcSummer: 'Sommer', bcActivities: 'Aktivitäten', bcSelf: 'Hofbesuche',
    introTitle: 'Hoferlebnisse in der Nähe von Bjorli',
    introP1: 'Bei einem Hofbesuch kommen Sie dem Hofleben, den Tieren, der lokalen Esskultur und der gelebten Kulturlandschaft nahe. Geeignet für Familien, Paare und Gäste, die ein ruhigeres Erlebnis nah an der Natur suchen.',
    introP2: 'Verbinden Sie einen Aufenthalt in Bjorli mit lokaler Küche, Übernachtung, Kulturlandschaft, Bergwanderungen und ruhigen Aktivitäten auf einem der Höfe in Lesja.',
    introP3: 'Angebot, Öffnungszeiten und Buchung können variieren. Bitte prüfen Sie immer die Website des jeweiligen Hofes vor dem Besuch.',
    seeFarms: 'Die Höfe ansehen', summerLink: 'Sommer in Bjorli',
    farms: {
      brend: { title: 'Brendjordsbyen', alt: 'Brendjordsbyen in Lesja mit restaurierten Holzhäusern', text: 'Seit Jahrhunderten empfängt Brendjordsbyen Einheimische und Reisende aus allen Richtungen mit Essen und Ruhe im Herzen des Bergorts Lesja. Heute sind Sie eingeladen, in sorgfältig restaurierten, denkmalgeschützten Holzhäusern aufzuwachen, mitten in einer lebendigen Kulturlandschaft mit Bergen und arbeitenden Höfen — und frischem Gebäck aus dem holzbefeuerten Steinofen im Stall.' },
      bjokne: { title: 'Bjøkne / Ljosbakken gard', alt: 'Der Kleinbetrieb auf Bjøkne, Teil von Ljosbakken gard', text: 'Erleben Sie das Leben auf einem Kleinbetrieb hautnah und schenken Sie der Familie einen Urlaub, in dem Sie auf einem Småbruk wohnen und mithelfen. Bjøkne liegt in Lesja im nördlichen Gudbrandsdalen und gehört zu Ljosbakken gard. Das Paketangebot stellt Gästen einen kleinen Hof zur Verfügung, mit Arbeit im Küchengarten, Zeit mit den Tieren, einfachen Aufgaben nach Wunsch und Mahlzeiten aus regionalen Produkten. Auch klassische Hofübernachtung in einem gemütlichen Haus wird angeboten — gut für Paare, Familien und Aktivurlauber.' },
      kolstad: { title: 'Kolstad Gård', alt: 'Kolstad Gård in Lesja', text: 'Auf dem Weg von Ost nach West oder von Süd nach Nord? Am oberen Ende des Gudbrandsdalen, zwischen Romsdalen und Trøndelag, liegen Lesja und der Kolstad-Hof. Sie finden den Hof im Zentrum von Lesja, direkt bei Lesja kyrkje, Lesja Bygdemuseum und Tunstugu.' },
    },
    ctaBrend: 'Brendjordsbyen besuchen', ctaBjokneA: 'Småbruket Bjøkne ansehen', ctaBjokneB: 'Ljosbakken gard ansehen', ctaKolstad: 'Kolstad Gård besuchen',
    practicalTitle: 'Praktische Informationen',
    practicalBody: 'Hofbesuche, Bewirtung und Übernachtung sind teils saisonal und müssen häufig vorab vereinbart werden. Aktuelle Informationen zu Buchung, Öffnungszeiten und Angeboten finden Sie auf der jeweiligen Hof-Website.',
    linkStay: 'Übernachten in Bjorli', linkActivities: 'Weitere Aktivitäten', linkGetting: 'Anreise',
    imageCreditLabel: 'Bildnachweis:',
    imageCreditBody: ' Alle Bilder stammen von den Websites der auf dieser Seite aufgeführten Höfe.',
    ariaOpensNewTab: (l) => `${l} (öffnet in neuem Tab)`,
    altBrendAlt: 'Brendjordsbyen mit historischem Hofumfeld',
    altLjos: 'Ljosbakken gard und das Småbruk-Erlebnis in Lesja',
    altKolstadMiljo: 'Hofumfeld bei Kolstad Gård in Lesja',
  },
  nl: {
    metaTitle: 'Boerderijbezoek bij Bjorli | Boerderijen, dieren en lokale cultuur in Lesja',
    metaDesc: 'Bezoek boerderijen rond Bjorli en Lesja. Brendjordsbyen, Bjøkne/Ljosbakken gard en Kolstad Gård bieden boerderijleven, overnachting, lokale producten en cultuurlandschap.',
    heroTitle: 'Boerderijbezoek bij Bjorli',
    heroSubtitle: 'Rond Bjorli liggen meerdere karaktervolle boerderijen die open zijn voor bezoek, eten en overnachting.',
    bcHome: 'Bjorli', bcSummer: 'Zomer', bcActivities: 'Activiteiten', bcSelf: 'Boerderijbezoek',
    introTitle: 'Boerderijbelevingen dicht bij Bjorli',
    introP1: 'Bij een boerderijbezoek kom je dicht bij het boerenleven, dieren, lokale eetcultuur en het levende cultuurlandschap. Het past bij families, stellen en gasten die een rustigere beleving dicht bij de natuur zoeken.',
    introP2: 'Combineer een verblijf in Bjorli gerust met lokale producten, overnachting, cultuurlandschap, bergwandelingen en rustige activiteiten op een van de boerderijen in Lesja.',
    introP3: 'Aanbod, openingstijden en boekingen kunnen wisselen. Bekijk altijd de eigen website van de boerderij voor je bezoek.',
    seeFarms: 'Bekijk de boerderijen', summerLink: 'Zomer in Bjorli',
    farms: {
      brend: { title: 'Brendjordsbyen', alt: 'Brendjordsbyen in Lesja met gerestaureerde houten huizen', text: 'Al eeuwen lang ontvangt Brendjordsbyen bewoners en reizigers uit alle windrichtingen met eten en rust, midden in het bergdorp Lesja. Vandaag ben je welkom om wakker te worden in zorgvuldig gerestaureerde, beschermde houten huizen in een levend cultuurlandschap, met bergen en werkende boerderijen rondom — en vers gebak uit de houtgestookte steenoven in de schuur.' },
      bjokne: { title: 'Bjøkne / Ljosbakken gard', alt: 'De kleine boerderij Bjøkne, onderdeel van Ljosbakken gard', text: 'Beleef het leven op een kleine boerderij van dichtbij en gun het gezin een vakantie waar je woont op en meedraait met een småbruk. Bjøkne ligt in Lesja in noordelijk Gudbrandsdalen en hoort bij Ljosbakken gard. Het arrangement geeft gasten een eigen kleine boerderij, aarde onder de nagels in de moestuin, tijd met de dieren, eenvoudige werkzaamheden naar wens en maaltijden van producten uit noordelijk Gudbrandsdalen. Ook gewone boerderijovernachting in een gezellig huis is mogelijk — fijn voor stellen, gezinnen en buitenmensen.' },
      kolstad: { title: 'Kolstad Gård', alt: 'Kolstad Gård in Lesja', text: 'Onderweg van oost naar west of zuid naar noord? Bovenin Gudbrandsdalen, tussen Romsdalen en Trøndelag, vind je Lesja en Kolstad gård. De boerderij ligt in het centrum van Lesja, vlak bij Lesja kyrkje, Lesja Bygdemuseum en Tunstugu.' },
    },
    ctaBrend: 'Bezoek Brendjordsbyen', ctaBjokneA: 'Bekijk Småbruket Bjøkne', ctaBjokneB: 'Bekijk Ljosbakken gard', ctaKolstad: 'Bezoek Kolstad Gård',
    practicalTitle: 'Praktische informatie',
    practicalBody: 'Boerderijbezoek, eten en overnachting zijn vaak seizoensgebonden en moeten regelmatig vooraf worden afgestemd. Bekijk de website van de boerderij voor actuele informatie over boeking, openingstijden en beschikbare activiteiten.',
    linkStay: 'Overnachten in Bjorli', linkActivities: 'Meer activiteiten', linkGetting: 'Reizen naar Bjorli',
    imageCreditLabel: 'Beeldcredits:',
    imageCreditBody: ' Alle beelden zijn afkomstig van de websites van de op deze pagina genoemde boerderijen.',
    ariaOpensNewTab: (l) => `${l} (opent in nieuw tabblad)`,
    altBrendAlt: 'Brendjordsbyen met historische boerderijomgeving',
    altLjos: 'Ljosbakken gard en de småbruk-beleving in Lesja',
    altKolstadMiljo: 'Boerderijomgeving bij Kolstad Gård in Lesja',
  },
  da: {
    metaTitle: 'Gårdsbesøg på Bjorli | Gårde, dyr og lokal kultur i Lesja',
    metaDesc: 'Oplev gårdsbesøg omkring Bjorli og Lesja. Besøg Brendjordsbyen, Bjøkne/Ljosbakken gard og Kolstad Gård for gårdsliv, overnatning, lokal mad og kulturlandskab.',
    heroTitle: 'Gårdsbesøg på Bjorli',
    heroSubtitle: 'Omkring Bjorli ligger flere stemningsfulde gårde med åbent for besøg, servering og overnatning.',
    bcHome: 'Bjorli', bcSummer: 'Sommer', bcActivities: 'Aktiviteter', bcSelf: 'Gårdsbesøg',
    introTitle: 'Gårdsoplevelser nær Bjorli',
    introP1: 'Et gårdsbesøg bringer dig tæt på gårdslivet, dyrene, den lokale madkultur og det levende kulturlandskab. Det passer både til familier, par og gæster, der ønsker en roligere oplevelse tæt på naturen.',
    introP2: 'Kombiner gerne et ophold på Bjorli med lokal mad, overnatning, kulturlandskab, fjeldture og rolige aktiviteter på en af gårdene i Lesja.',
    introP3: 'Tilbud, åbningstider og booking kan variere. Tjek altid gårdens egen hjemmeside før dit besøg.',
    seeFarms: 'Se gårdene', summerLink: 'Sommer på Bjorli',
    farms: {
      brend: { title: 'Brendjordsbyen', alt: 'Brendjordsbyen i Lesja med restaurerede tømmerhuse', text: 'I århundreder har Brendjordsbyen taget imod fastboende og langvejsfarende fra alle verdenshjørner med mad og hvile i hjertet af fjeldbygden Lesja. I dag er du velkommen til at vågne i omhyggeligt restaurerede, fredede tømmerhuse midt i et levende kulturlandskab med fjelde og gårdsdrift omkring — og friskt brød fra en brændefyret stenovn i laden.' },
      bjokne: { title: 'Bjøkne / Ljosbakken gard', alt: 'Småbruget på Bjøkne, en del af Ljosbakken gard', text: 'Lev småbrugslivet på rigtigt og giv hele familien en ferie, hvor I bor og er med på et lille brug. Bjøkne ligger i Lesja i Nord-Gudbrandsdalen og er en del af Ljosbakken gard. Pakketilbuddet giver gæster eget lille brug, jord under neglene i køkkenhaven, tid med dyrene, enkle gårdsopgaver efter ønske og måltider af råvarer fra Nord-Gudbrandsdalen. Der tilbydes også almindelig gårdsovernatning i et hyggeligt gårdshus — fint for par, familier og friluftsfolk.' },
      kolstad: { title: 'Kolstad Gård', alt: 'Kolstad Gård i Lesja', text: 'På tur fra øst til vest eller syd til nord? Øverst i Gudbrandsdalen, mellem Romsdalen og Trøndelag, ligger Lesja og Kolstad gård. Gården ligger i Lesja centrum, lige ved Lesja kyrkje, Lesja Bygdemuseum og Tunstugu.' },
    },
    ctaBrend: 'Besøg Brendjordsbyen', ctaBjokneA: 'Se Småbruket Bjøkne', ctaBjokneB: 'Se Ljosbakken gard', ctaKolstad: 'Besøg Kolstad Gård',
    practicalTitle: 'Praktisk information',
    practicalBody: 'Gårdsbesøg, servering og overnatning kan være sæsonbaseret og skal ofte aftales på forhånd. Tjek gårdens egen hjemmeside for opdateret information om booking, åbningstider og aktiviteter.',
    linkStay: 'Overnatning på Bjorli', linkActivities: 'Flere aktiviteter', linkGetting: 'Sådan kommer du hertil',
    imageCreditLabel: 'Billedkreditering:',
    imageCreditBody: ' Alle billeder er hentet fra hjemmesiderne hos de gårde, der er nævnt på denne side.',
    ariaOpensNewTab: (l) => `${l} (åbnes i nyt faneblad)`,
    altBrendAlt: 'Brendjordsbyen med historisk gårdsmiljø',
    altLjos: 'Ljosbakken gard og småbrugsoplevelsen i Lesja',
    altKolstadMiljo: 'Gårdsmiljø ved Kolstad Gård i Lesja',
  },
  sv: {
    metaTitle: 'Gårdsbesök på Bjorli | Gårdar, djur och lokal kultur i Lesja',
    metaDesc: 'Upplev gårdsbesök runt Bjorli och Lesja. Besök Brendjordsbyen, Bjøkne/Ljosbakken gard och Kolstad Gård för gårdsliv, övernattning, lokal mat och kulturlandskap.',
    heroTitle: 'Gårdsbesök på Bjorli',
    heroSubtitle: 'Runt Bjorli ligger flera stämningsfulla gårdar som tar emot besök, servering och övernattning.',
    bcHome: 'Bjorli', bcSummer: 'Sommar', bcActivities: 'Aktiviteter', bcSelf: 'Gårdsbesök',
    introTitle: 'Gårdsupplevelser nära Bjorli',
    introP1: 'Ett gårdsbesök tar dig nära gårdslivet, djuren, den lokala matkulturen och det levande kulturlandskapet. Det passar familjer, par och gäster som vill ha en lugnare upplevelse nära naturen.',
    introP2: 'Kombinera gärna en vistelse på Bjorli med lokal mat, övernattning, kulturlandskap, fjällvandring och lugna aktiviteter på en av gårdarna i Lesja.',
    introP3: 'Utbud, öppettider och bokning kan variera. Kolla alltid gårdens egen webbplats före ditt besök.',
    seeFarms: 'Se gårdarna', summerLink: 'Sommar på Bjorli',
    farms: {
      brend: { title: 'Brendjordsbyen', alt: 'Brendjordsbyen i Lesja med restaurerade timmerhus', text: 'I århundraden har Brendjordsbyen tagit emot fastboende och långväga gäster från alla håll med mat och vila i hjärtat av fjällbygden Lesja. I dag är du välkommen att vakna i noggrant restaurerade, skyddade timmerhus mitt i ett levande kulturlandskap, med fjäll och gårdsdrift runt omkring — och nybakat bröd ur den vedeldade stenugnen i ladan.' },
      bjokne: { title: 'Bjøkne / Ljosbakken gard', alt: 'Småbruket på Bjøkne, del av Ljosbakken gard', text: 'Lev småbrukslivet på riktigt och ge hela familjen en semester där ni bor och hjälper till på ett litet bruk. Bjøkne ligger i Lesja i norra Gudbrandsdalen och är en del av Ljosbakken gard. Paketet ger gästerna ett eget litet bruk, jord under naglarna i köksträdgården, tid med djuren, enkla sysslor efter önskemål och måltider av råvaror från norra Gudbrandsdalen. Vanlig gårdsövernattning i ett mysigt gårdshus erbjuds också — bra för par, familjer och friluftsmänniskor.' },
      kolstad: { title: 'Kolstad Gård', alt: 'Kolstad Gård i Lesja', text: 'På väg från öst till väst eller syd till nord? Överst i Gudbrandsdalen, mellan Romsdalen och Trøndelag, ligger Lesja och Kolstad gård. Gården ligger i centrala Lesja, alldeles intill Lesja kyrkje, Lesja Bygdemuseum och Tunstugu.' },
    },
    ctaBrend: 'Besök Brendjordsbyen', ctaBjokneA: 'Se Småbruket Bjøkne', ctaBjokneB: 'Se Ljosbakken gard', ctaKolstad: 'Besök Kolstad Gård',
    practicalTitle: 'Praktisk information',
    practicalBody: 'Gårdsbesök, servering och övernattning kan vara säsongsbundna och behöver ofta bokas i förväg. Kolla gårdens egen webbplats för aktuell information om bokning, öppettider och tillgängliga aktiviteter.',
    linkStay: 'Boende på Bjorli', linkActivities: 'Fler aktiviteter', linkGetting: 'Resa hit',
    imageCreditLabel: 'Bildkredit:',
    imageCreditBody: ' Alla bilder är hämtade från webbplatserna hos de gårdar som listas på denna sida.',
    ariaOpensNewTab: (l) => `${l} (öppnas i ny flik)`,
    altBrendAlt: 'Brendjordsbyen med historisk gårdsmiljö',
    altLjos: 'Ljosbakken gard och småbruksupplevelsen i Lesja',
    altKolstadMiljo: 'Gårdsmiljö vid Kolstad Gård i Lesja',
  },
};

const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const Gardsbesok = () => {
  const t = usePageCopy(COPY);
  const lp = useLocalizedPath();

  const FARMS = [
    {
      id: 'brendjordsbyen', image: brendjordsbyenImg, text: t.farms.brend, address: 'Brendjordsvegen 57, 2666 Lora',
      phone: ['+47 917 08 319', '+47 982 07 238'], email: 'post@brendjordsbyen.no',
      ctas: [{ label: t.ctaBrend, href: 'https://brendjordsbyen.no/' }] as Cta[],
    },
    {
      id: 'bjokne', image: bjokneImg, text: t.farms.bjokne, address: 'Bjøknegeilen 24, 2666 Lora',
      phone: ['+47 476 06 056'], email: 'hei@smabruketbjokne.no',
      ctas: [
        { label: t.ctaBjokneA, href: 'https://www.smabruketbjokne.no/' },
        { label: t.ctaBjokneB, href: 'https://www.ljosbakken.no/' },
      ] as Cta[],
    },
    {
      id: 'kolstad', image: kolstadImg, text: t.farms.kolstad, address: 'Kyrkjevegen 71, 2665 Lesja',
      phone: ['+47 97 64 93 72'], email: undefined as string | undefined,
      ctas: [{ label: t.ctaKolstad, href: 'https://www.kolstadgard.no/' }] as Cta[],
    },
  ];

  useEffect(() => {
    const prevTitle = document.title;
    document.title = t.metaTitle;
    setMeta('description', t.metaDesc);
    setMeta('og:title', t.metaTitle, 'property');
    setMeta('og:description', t.metaDesc, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', '/gardsbesok', 'property');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.bcHome, item: '/' },
          { '@type': 'ListItem', position: 2, name: t.bcActivities, item: '/aktiviteter' },
          { '@type': 'ListItem', position: 3, name: t.bcSelf, item: '/gardsbesok' },
        ],
      },
    ]);
    document.head.appendChild(ld);
    return () => {
      document.title = prevTitle;
      document.head.removeChild(ld);
    };
  }, [t.metaTitle, t.metaDesc, t.bcHome, t.bcActivities, t.bcSelf]);

  return (
    <div>
      <PageHero title={t.heroTitle} subtitle={t.heroSubtitle} image={heroImg} />

      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label={t.bcSelf}>
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">{t.bcHome}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp('/sommer')} className="hover:text-secondary">{t.bcSummer}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp('/aktiviteter')} className="hover:text-secondary">{t.bcActivities}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">{t.bcSelf}</li>
        </ol>
      </nav>

      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.introTitle}</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
            <p>{t.introP1}</p>
            <p>{t.introP2}</p>
            <p className="text-base text-muted-foreground">{t.introP3}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#gardene" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
              {t.seeFarms}
            </a>
            <Link to={lp('/sommer')} className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors">
              {t.summerLink}
            </Link>
          </div>
        </div>
      </section>

      <section id="gardene" className="pb-16 md:pb-24 px-4 scroll-mt-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FARMS.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full overflow-hidden bg-card/60 backdrop-blur border-border/60 hover:border-secondary/50 transition-colors">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={f.image} alt={f.text.alt} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
                  </div>
                  <CardContent className="p-6 flex flex-col">
                    <h3 className="font-display text-xl font-semibold mb-3">{f.text.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{f.text.text}</p>

                    <ul className="space-y-2 text-sm text-foreground/80 mb-5">
                      <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-secondary shrink-0" /><span>{f.address}</span></li>
                      {f.phone.map((p) => (
                        <li key={p} className="flex gap-2">
                          <Phone className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                          <a href={`tel:${p.replace(/\s+/g, '')}`} className="hover:text-secondary">{p}</a>
                        </li>
                      ))}
                      {f.email && (
                        <li className="flex gap-2">
                          <Mail className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                          <a href={`mailto:${f.email}`} className="hover:text-secondary break-all">{f.email}</a>
                        </li>
                      )}
                    </ul>

                    <div className="mt-auto flex flex-col gap-2">
                      {f.ctas.map((c, idx) => (
                        <a
                          key={c.href}
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t.ariaOpensNewTab(c.label)}
                          className={idx === 0
                            ? 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm'
                            : 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm'}
                        >
                          {c.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24 px-4">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { src: brendjordsbyenAltImg, alt: t.altBrendAlt },
            { src: ljosbakkenImg, alt: t.altLjos },
            { src: kolstadMiljoImg, alt: t.altKolstadMiljo },
          ].map((img) => (
            <div key={img.src} className="rounded-2xl overflow-hidden shadow-sm aspect-[4/3]">
              <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
              <Info className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">{t.practicalTitle}</h2>
          </div>
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">{t.practicalBody}</p>
          <div className="flex flex-wrap gap-3">
            <Link to={lp('/overnatting')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm">{t.linkStay}</Link>
            <Link to={lp('/aktiviteter')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm">{t.linkActivities}</Link>
            <Link to={lp('/reisen-hit')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm">{t.linkGetting}</Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Camera className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
            <p>
              <span className="font-semibold text-foreground">{t.imageCreditLabel}</span>
              {t.imageCreditBody}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gardsbesok;
