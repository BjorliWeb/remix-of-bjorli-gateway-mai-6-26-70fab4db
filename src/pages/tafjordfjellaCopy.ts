/**
 * Locale-keyed copy for /sommer/tafjordfjella.
 * Proper names preserved: Bjorli, Brøstdalen, Brøstet, Tafjordfjella,
 * Vakkerstøylen, Pyttbua, UT.no, Lesja, Romsdalen, Reinheimen.
 * Tone: human, varied, conversational — not AI-template.
 */
import type { Locale } from '@/i18n/locales/types';

export interface TourCopy {
  title: string;
  kind: string;
  desc: string;
}

export interface TafjordfjellaCopy {
  heroTitle: string;
  heroSubtitle: string;
  heroAlt: string;
  photoCredit: string;
  crumbHome: string;
  crumbSommer: string;
  crumbHere: string;
  introP1: string; // may contain <strong>
  introP2: string;
  geographyBadge: string;
  geographyTitle: string;
  geographyP1: string;
  geographyP2: string; // may contain <strong>/<em>
  toursBadge: string;
  toursTitle: string;
  toursIntro: string;
  toursSeeOnUt: string;
  tours: TourCopy[]; // 3 entries, in the same order as the NO source
  lengthBadge: string;
  lengthTitle: string;
  dayTrips: { title: string; body: string };
  skiTours: { title: string; body: string };
  hutToHut: { title: string; body: string };
  praktiskBadge: string;
  praktiskTitle: string;
  cardWeather: { title: string; body: string };
  cardShift: { title: string; body: string };
  cardPack: { title: string; body: string };
  cardUt: {
    title: string;
    bodyBefore: string;
    linkText: string;
    bodyAfter: string;
  };
  ctaAllHikes: string;
  ctaBackSummer: string;
}

export const TAFJORDFJELLA_COPY: Record<Locale, TafjordfjellaCopy> = {
  no: {
    heroTitle: 'Tafjordfjella',
    heroSubtitle: 'Fra Bjorli og inn i et av Vestlandets villeste fjellandskap – via Brøstdalen.',
    heroAlt: 'Sommerutsikt fra Bjorli mot fjellene innover Brøstdalen og Tafjordfjella.',
    crumbHome: 'Hjem',
    crumbSommer: 'Sommer',
    crumbHere: 'Tafjordfjella',
    introP1:
      'Med Bjorli som utgangspunkt kjører du kort vei før <strong>Brøstdalen</strong> åpner seg og tar deg innover mot Tafjordfjella. Få områder i Norge har samme kontrast på så lite plass: dype daler, frodig vestlandsk fjellterreng og snødekte vidder som ligger der året rundt.',
    introP2:
      'Området fungerer like godt til en luftig dagstur som til en lengre runde fra hytte til hytte. Du velger selv om det skal være rolige timer langs et vann, en hard fjelltur opp på første topp – eller flere dager med sekk og kart.',
    geographyBadge: 'Geografi',
    geographyTitle: 'Fra Bjorli inn i villere fjell',
    geographyP1:
      'Bjorli ligger lunt mellom Lesja og Romsdalen, med åpne fjell og bred dal rundt seg. Kjører du innover Brøstdalen merker du raskt at landskapet skifter karakter – sidedalene blir trangere, fossene tydeligere, og terrenget tipper over mot det vestlandske.',
    geographyP2:
      'Innenfor venter selve <strong>Tafjordfjella</strong>: et stort, sammenhengende fjellområde med høye topper, vann og lange vidder. Det er her ruter som <em>Vakkerstøylen</em> og <em>Pyttbua</em> ligger – samme fjell som du ser antydet fra fjellsiden over Bjorli, bare mye lenger inn.',
    toursBadge: 'Turforslag og hytter',
    toursTitle: 'Konkrete turer å starte med',
    toursIntro: 'Tre gode innganger til Tafjordfjella – med fullstendig ruteinfo, kart og hytteinfo hos UT.no.',
    toursSeeOnUt: 'Se på UT.no',
    tours: [
      {
        title: 'Vakkerstøylen',
        kind: 'Turisthytte',
        desc: 'Liten, enkel selvbetjent hytte midt i hjertet av Tafjordfjella. Fin målhytte for en lang dagstur fra Brøstet, eller første natt på en hyttetur videre innover.',
      },
      {
        title: 'Skitur til Vakkerstøylen fra Brøstet',
        kind: 'Skitur',
        desc: 'Klassisk skitur opp dalen og inn på fjellet. Lang dag, men jevn stigning og storslagent fjellandskap når du kommer opp på vidda.',
      },
      {
        title: 'Pyttbua',
        kind: 'Turisthytte',
        desc: 'Større betjent hytte lenger inn i Tafjordfjella – populært knutepunkt for hytte-til-hytte-turer både sommer og vinter.',
      },
    ],
    lengthBadge: 'Korte turer og lange turer',
    lengthTitle: 'Velg lengde etter dagsform og vær',
    dayTrips: {
      title: 'Dagsturer',
      body: 'Kjør inn Brøstdalen og finn et startpunkt – mange ruter holder fint som rundtur på en dag når du er tidlig ute.',
    },
    skiTours: {
      title: 'Skiturer',
      body: 'Sen vår og forsommer holder snøen seg lenge høyt oppe. Skitur til Vakkerstøylen fra Brøstet er en klassiker – lang, men gjennomførbar for trente turfolk.',
    },
    hutToHut: {
      title: 'Hytte til hytte',
      body: 'Vakkerstøylen, Pyttbua og nabohyttene henger sammen i et rutenett som lar deg legge opp turer på flere dager. Planlegg etappene etter vær og snøforhold.',
    },
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Før du legger ut',
    cardWeather: {
      title: 'Sjekk vær og forhold',
      body: 'Vind, sikt og snøforhold avgjør hvor langt du kommer. Les meldingen før avreise, og ha en plan B hvis været snur.',
    },
    cardShift: {
      title: 'Værskifter går fort',
      body: 'På fjellet kan en grei dag bli krevende på minutter. Snu i tide hvis sikten forsvinner – fjellet står der i morgen også.',
    },
    cardPack: {
      title: 'Pakk skikkelig',
      body: 'Vindtett skall, ekstra lag, mat, drikke, kart og kompass – også på korte turer. Lader og pannelampe når du går mot kveld.',
    },
    cardUt: {
      title: 'Bruk UT.no og merkede ruter',
      bodyBefore: 'Detaljerte ruter, høydeprofiler og hytteinfo ligger på ',
      linkText: 'ut.no',
      bodyAfter: '. Hold deg til merkede stier og varder når du er ukjent i området.',
    },
    ctaAllHikes: 'Se alle fotturer rundt Bjorli',
    ctaBackSummer: 'Tilbake til sommer på Bjorli',
  },
  en: {
    heroTitle: 'Tafjordfjella',
    heroSubtitle: 'From Bjorli into one of Vestlandet’s wildest mountain landscapes — via Brøstdalen.',
    heroAlt: 'Summer view from Bjorli looking towards the mountains of Brøstdalen and Tafjordfjella.',
    crumbHome: 'Home',
    crumbSommer: 'Summer',
    crumbHere: 'Tafjordfjella',
    introP1:
      'With Bjorli as your starting point it’s a short drive before <strong>Brøstdalen</strong> opens up and pulls you in towards Tafjordfjella. Few corners of Norway pack this much contrast into such a small area: deep valleys, lush west-coast mountain terrain and snow-covered plateaus that stay white most of the year.',
    introP2:
      'It works equally well for an airy day hike and a longer hut-to-hut round. Up to you whether the day is calm hours by a mountain lake, a hard push up the first summit — or several days out with a pack and a map.',
    geographyBadge: 'Geography',
    geographyTitle: 'From Bjorli into wilder mountains',
    geographyP1:
      'Bjorli sits comfortably between Lesja and Romsdalen, surrounded by open fells and a broad valley. Drive up Brøstdalen and the landscape quickly shifts — side valleys tighten, waterfalls show up everywhere, and the terrain tips over into something more west-coast in character.',
    geographyP2:
      'Beyond that lies <strong>Tafjordfjella</strong> proper: a large, continuous mountain area with high peaks, lakes and long open plateaus. This is where routes like <em>Vakkerstøylen</em> and <em>Pyttbua</em> sit — the same mountains you glimpse from the hillside above Bjorli, just much further in.',
    toursBadge: 'Routes and huts',
    toursTitle: 'Concrete trips to start with',
    toursIntro: 'Three good ways into Tafjordfjella — with full route info, maps and hut details on UT.no.',
    toursSeeOnUt: 'View on UT.no',
    tours: [
      {
        title: 'Vakkerstøylen',
        kind: 'Mountain hut',
        desc: 'Small, simple self-service hut right in the heart of Tafjordfjella. A great goal for a long day from Brøstet, or the first night of a hut-to-hut trip further in.',
      },
      {
        title: 'Ski tour to Vakkerstøylen from Brøstet',
        kind: 'Ski tour',
        desc: 'A classic ski tour up the valley and onto the fells. Long day out, but the climb is steady and the high plateau is spectacular when you reach it.',
      },
      {
        title: 'Pyttbua',
        kind: 'Mountain hut',
        desc: 'Larger staffed hut deeper inside Tafjordfjella — a popular hub for hut-to-hut trips in both summer and winter.',
      },
    ],
    lengthBadge: 'Short trips and long trips',
    lengthTitle: 'Pick the length to match the day and the weather',
    dayTrips: {
      title: 'Day hikes',
      body: 'Drive into Brøstdalen and pick a starting point — plenty of routes work nicely as a one-day round if you set off early.',
    },
    skiTours: {
      title: 'Ski tours',
      body: 'Late spring and early summer the snow lingers high up. The ski tour to Vakkerstøylen from Brøstet is a classic — long, but very doable for fit hikers.',
    },
    hutToHut: {
      title: 'Hut to hut',
      body: 'Vakkerstøylen, Pyttbua and the neighbouring huts link up into a route network that lets you plan multi-day trips. Plan stages around weather and snow conditions.',
    },
    praktiskBadge: 'Practical info',
    praktiskTitle: 'Before you head out',
    cardWeather: {
      title: 'Check the weather and conditions',
      body: 'Wind, visibility and snow decide how far you get. Read the forecast before you leave and keep a plan B if the weather turns.',
    },
    cardShift: {
      title: 'Weather shifts fast',
      body: 'Up on the fells a fine day can turn demanding in minutes. Turn back in time if visibility drops — the mountain will still be there tomorrow.',
    },
    cardPack: {
      title: 'Pack properly',
      body: 'Windproof shell, extra layers, food, water, map and compass — even on short trips. Throw in a power bank and head torch if you’re out into the evening.',
    },
    cardUt: {
      title: 'Use UT.no and marked routes',
      bodyBefore: 'Detailed routes, elevation profiles and hut info live on ',
      linkText: 'ut.no',
      bodyAfter: '. Stick to marked paths and cairns when the area is new to you.',
    },
    ctaAllHikes: 'See all hikes around Bjorli',
    ctaBackSummer: 'Back to summer in Bjorli',
  },
  de: {
    heroTitle: 'Tafjordfjella',
    heroSubtitle: 'Von Bjorli aus in eine der wildesten Berglandschaften Vestlandets – durch das Brøstdalen.',
    heroAlt: 'Sommerblick von Bjorli auf die Berge von Brøstdalen und Tafjordfjella.',
    crumbHome: 'Start',
    crumbSommer: 'Sommer',
    crumbHere: 'Tafjordfjella',
    introP1:
      'Mit Bjorli als Ausgangspunkt sind es nur wenige Kilometer, bevor sich das <strong>Brøstdalen</strong> öffnet und dich ins Tafjordfjella hineinzieht. Wenige Regionen Norwegens bieten so viel Kontrast auf so engem Raum: tiefe Täler, üppiges Bergland im Westküsten-Stil und schneebedeckte Hochflächen, die fast ganzjährig weiß bleiben.',
    introP2:
      'Das Gebiet eignet sich für eine luftige Tageswanderung genauso gut wie für eine längere Hütten-zu-Hütten-Runde. Ob ruhige Stunden an einem Bergsee, ein anstrengender Aufstieg auf den ersten Gipfel – oder mehrere Tage mit Rucksack und Karte, entscheidest du selbst.',
    geographyBadge: 'Geografie',
    geographyTitle: 'Von Bjorli in wildere Berge',
    geographyP1:
      'Bjorli liegt geschützt zwischen Lesja und Romsdalen, umgeben von offenen Fjells und einem breiten Tal. Fährst du ins Brøstdalen hinein, ändert die Landschaft schnell den Charakter – Seitentäler werden enger, Wasserfälle zeigen sich überall, und das Gelände kippt sichtbar Richtung Westküste.',
    geographyP2:
      'Dahinter beginnt das eigentliche <strong>Tafjordfjella</strong>: ein großes, zusammenhängendes Bergmassiv mit hohen Gipfeln, Seen und langen Hochflächen. Hier liegen Routen wie <em>Vakkerstøylen</em> und <em>Pyttbua</em> – dieselben Berge, die du vom Hang oberhalb Bjorlis schon erahnen kannst, nur viel weiter drinnen.',
    toursBadge: 'Touren und Hütten',
    toursTitle: 'Konkrete Touren zum Einstieg',
    toursIntro: 'Drei gute Zugänge ins Tafjordfjella – mit vollständigen Routeninfos, Karten und Hütteninfos bei UT.no.',
    toursSeeOnUt: 'Auf UT.no ansehen',
    tours: [
      {
        title: 'Vakkerstøylen',
        kind: 'Berghütte',
        desc: 'Kleine, einfache Selbstversorgerhütte mitten im Herzen des Tafjordfjella. Ein lohnendes Ziel für eine lange Tagestour ab Brøstet, oder die erste Nacht auf einer Mehrtagestour weiter ins Gebirge.',
      },
      {
        title: 'Skitour zur Vakkerstøylen ab Brøstet',
        kind: 'Skitour',
        desc: 'Klassische Skitour das Tal hinauf und aufs Fjell. Langer Tag, aber gleichmäßiger Anstieg – und großartiges Bergpanorama, sobald du oben auf der Hochfläche ankommst.',
      },
      {
        title: 'Pyttbua',
        kind: 'Berghütte',
        desc: 'Größere bewirtschaftete Hütte tiefer im Tafjordfjella – beliebter Knotenpunkt für Hütten-zu-Hütten-Touren im Sommer wie im Winter.',
      },
    ],
    lengthBadge: 'Kurze und lange Touren',
    lengthTitle: 'Länge nach Tagesform und Wetter wählen',
    dayTrips: {
      title: 'Tagestouren',
      body: 'Fahr ins Brøstdalen und such dir einen Startpunkt – viele Routen funktionieren prima als Tagesrunde, wenn du früh dran bist.',
    },
    skiTours: {
      title: 'Skitouren',
      body: 'Im späten Frühjahr und Frühsommer hält sich der Schnee oben lange. Die Skitour zur Vakkerstøylen ab Brøstet ist ein Klassiker – lang, aber für trainierte Tourengänger machbar.',
    },
    hutToHut: {
      title: 'Von Hütte zu Hütte',
      body: 'Vakkerstøylen, Pyttbua und die Nachbarhütten hängen in einem Routennetz zusammen, das mehrtägige Touren erlaubt. Etappen nach Wetter und Schneelage planen.',
    },
    praktiskBadge: 'Praktische Infos',
    praktiskTitle: 'Bevor du loslegst',
    cardWeather: {
      title: 'Wetter und Verhältnisse prüfen',
      body: 'Wind, Sicht und Schneeverhältnisse bestimmen, wie weit du kommst. Vorhersage vor dem Aufbruch lesen und einen Plan B bereithalten, falls das Wetter dreht.',
    },
    cardShift: {
      title: 'Wetter kann schnell umschlagen',
      body: 'Im Fjell wird aus einem guten Tag in Minuten ein anstrengender. Lieber rechtzeitig umkehren, wenn die Sicht weg ist – der Berg steht morgen noch da.',
    },
    cardPack: {
      title: 'Richtig packen',
      body: 'Winddichte Schale, zusätzliche Schichten, Essen, Trinken, Karte und Kompass – auch auf kurzen Touren. Powerbank und Stirnlampe, wenn es Richtung Abend geht.',
    },
    cardUt: {
      title: 'UT.no und markierte Routen nutzen',
      bodyBefore: 'Detaillierte Routen, Höhenprofile und Hütteninfos findest du auf ',
      linkText: 'ut.no',
      bodyAfter: '. Bleib auf markierten Pfaden und Steinmännchen, wenn dir das Gebiet neu ist.',
    },
    ctaAllHikes: 'Alle Wanderungen rund um Bjorli ansehen',
    ctaBackSummer: 'Zurück zum Sommer in Bjorli',
  },
  nl: {
    heroTitle: 'Tafjordfjella',
    heroSubtitle: 'Vanaf Bjorli een van de meest ruige berglandschappen van Vestlandet in – via Brøstdalen.',
    heroAlt: 'Zomers uitzicht vanaf Bjorli over de bergen van Brøstdalen en Tafjordfjella.',
    crumbHome: 'Home',
    crumbSommer: 'Zomer',
    crumbHere: 'Tafjordfjella',
    introP1:
      'Met Bjorli als uitvalsbasis is het maar een korte rit voordat <strong>Brøstdalen</strong> zich opent en je naar binnen trekt richting Tafjordfjella. Weinig delen van Noorwegen bieden zoveel contrast op zo’n klein oppervlak: diepe dalen, weelderig westkust-berggebied en sneeuwbedekte hoogvlakten die het grootste deel van het jaar wit blijven.',
    introP2:
      'Het gebied werkt net zo goed voor een luchtige dagwandeling als voor een langere hut-tot-hut-ronde. Of het nu rustige uren bij een meertje wordt, een stevige tocht omhoog naar de eerste top – of meerdere dagen met rugzak en kaart, dat kies je zelf.',
    geographyBadge: 'Geografie',
    geographyTitle: 'Vanaf Bjorli de ruige bergen in',
    geographyP1:
      'Bjorli ligt beschut tussen Lesja en Romsdalen, met open fjells en een breed dal eromheen. Rijd je Brøstdalen in, dan verandert het landschap snel – zijdalen worden smaller, watervallen vallen overal op, en het terrein kantelt richting de westkust.',
    geographyP2:
      'Daarachter ligt het echte <strong>Tafjordfjella</strong>: een groot, aaneengesloten berggebied met hoge toppen, meren en uitgestrekte hoogvlakten. Hier liggen routes als <em>Vakkerstøylen</em> en <em>Pyttbua</em> – dezelfde bergen die je vanaf de helling boven Bjorli al even ziet, alleen veel verder naar binnen.',
    toursBadge: 'Routes en hutten',
    toursTitle: 'Concrete tochten om mee te starten',
    toursIntro: 'Drie goede toegangen tot Tafjordfjella – met volledige route-informatie, kaarten en huttengegevens op UT.no.',
    toursSeeOnUt: 'Bekijk op UT.no',
    tours: [
      {
        title: 'Vakkerstøylen',
        kind: 'Berghut',
        desc: 'Kleine, eenvoudige zelfbedieningshut middenin Tafjordfjella. Een mooi doel voor een lange dag vanaf Brøstet, of de eerste nacht van een hut-tot-hut-tocht verder naar binnen.',
      },
      {
        title: 'Skitocht naar Vakkerstøylen vanaf Brøstet',
        kind: 'Skitocht',
        desc: 'Klassieke skitocht het dal in en het fjell op. Lange dag, maar de stijging is gelijkmatig en de hoogvlakte is grandioos zodra je er bent.',
      },
      {
        title: 'Pyttbua',
        kind: 'Berghut',
        desc: 'Grotere bemande hut dieper in Tafjordfjella – een populair knooppunt voor hut-tot-hut-tochten in zowel zomer als winter.',
      },
    ],
    lengthBadge: 'Korte en lange tochten',
    lengthTitle: 'Kies de lengte op basis van conditie en weer',
    dayTrips: {
      title: 'Dagtochten',
      body: 'Rijd Brøstdalen in en zoek een startpunt – veel routes werken prima als dagrondje als je vroeg vertrekt.',
    },
    skiTours: {
      title: 'Skitochten',
      body: 'Laat in het voorjaar en in het vroege voorjaar blijft de sneeuw lang liggen op hoogte. De skitocht naar Vakkerstøylen vanaf Brøstet is een klassieker – lang, maar haalbaar voor getrainde wandelaars.',
    },
    hutToHut: {
      title: 'Van hut naar hut',
      body: 'Vakkerstøylen, Pyttbua en de buurthutten hangen samen in een routenetwerk waarmee je meerdaagse tochten kunt plannen. Stem de etappes af op weer en sneeuwcondities.',
    },
    praktiskBadge: 'Praktische info',
    praktiskTitle: 'Voordat je vertrekt',
    cardWeather: {
      title: 'Check weer en condities',
      body: 'Wind, zicht en sneeuw bepalen hoe ver je komt. Lees vooraf de voorspelling en houd een plan B achter de hand als het weer omslaat.',
    },
    cardShift: {
      title: 'Weer slaat snel om',
      body: 'Op het fjell kan een prima dag binnen minuten zwaar worden. Keer op tijd om als het zicht verdwijnt – de berg staat morgen ook nog.',
    },
    cardPack: {
      title: 'Pak goed in',
      body: 'Winddichte jas, extra lagen, eten, drinken, kaart en kompas – ook op korte tochten. Powerbank en hoofdlamp als je richting de avond loopt.',
    },
    cardUt: {
      title: 'Gebruik UT.no en gemarkeerde routes',
      bodyBefore: 'Gedetailleerde routes, hoogteprofielen en huttengegevens staan op ',
      linkText: 'ut.no',
      bodyAfter: '. Houd je aan gemarkeerde paden en steenmannetjes als het gebied nieuw voor je is.',
    },
    ctaAllHikes: 'Alle wandelingen rond Bjorli',
    ctaBackSummer: 'Terug naar zomer in Bjorli',
  },
  da: {
    heroTitle: 'Tafjordfjella',
    heroSubtitle: 'Fra Bjorli og ind i et af Vestlandets vildeste fjeldlandskaber – via Brøstdalen.',
    heroAlt: 'Sommerudsigt fra Bjorli mod fjeldene ind mod Brøstdalen og Tafjordfjella.',
    crumbHome: 'Hjem',
    crumbSommer: 'Sommer',
    crumbHere: 'Tafjordfjella',
    introP1:
      'Med Bjorli som udgangspunkt kører du kort før <strong>Brøstdalen</strong> åbner sig og trækker dig ind mod Tafjordfjella. Få områder i Norge har samme kontrast på så lidt plads: dybe dale, frodigt vestlandsk fjeldterræn og snedækkede vidder, der ligger der året rundt.',
    introP2:
      'Området fungerer lige så godt til en luftig dagstur som til en længere runde fra hytte til hytte. Du vælger selv om det skal være rolige timer ved et vand, en hård fjeldtur op på første top – eller flere dage med rygsæk og kort.',
    geographyBadge: 'Geografi',
    geographyTitle: 'Fra Bjorli ind i vildere fjelde',
    geographyP1:
      'Bjorli ligger lunt mellem Lesja og Romsdalen, med åbne fjelde og en bred dal omkring sig. Kører du ind i Brøstdalen, ændrer landskabet hurtigt karakter – sidedalene bliver smallere, vandfaldene mere tydelige, og terrænet vipper over mod det vestlandske.',
    geographyP2:
      'Indenfor venter selve <strong>Tafjordfjella</strong>: et stort, sammenhængende fjeldområde med høje toppe, søer og lange vidder. Det er her ruter som <em>Vakkerstøylen</em> og <em>Pyttbua</em> ligger – samme fjelde som du aner fra fjeldsiden over Bjorli, bare meget længere inde.',
    toursBadge: 'Turforslag og hytter',
    toursTitle: 'Konkrete ture at starte med',
    toursIntro: 'Tre gode indgange til Tafjordfjella – med fuld ruteinfo, kort og hytteinfo hos UT.no.',
    toursSeeOnUt: 'Se på UT.no',
    tours: [
      {
        title: 'Vakkerstøylen',
        kind: 'Turisthytte',
        desc: 'Lille, enkel selvbetjent hytte midt i hjertet af Tafjordfjella. Fin målhytte for en lang dagstur fra Brøstet, eller første nat på en hyttetur længere ind.',
      },
      {
        title: 'Skitur til Vakkerstøylen fra Brøstet',
        kind: 'Skitur',
        desc: 'Klassisk skitur op ad dalen og ind på fjeldet. Lang dag, men jævn stigning og storslået fjeldlandskab, når du kommer op på vidden.',
      },
      {
        title: 'Pyttbua',
        kind: 'Turisthytte',
        desc: 'Større betjent hytte længere inde i Tafjordfjella – populært knudepunkt for hytte-til-hytte-ture både sommer og vinter.',
      },
    ],
    lengthBadge: 'Korte og lange ture',
    lengthTitle: 'Vælg længde efter dagsform og vejr',
    dayTrips: {
      title: 'Dagsture',
      body: 'Kør ind i Brøstdalen og find et startpunkt – mange ruter fungerer fint som dagsrunde, hvis du er tidligt ude.',
    },
    skiTours: {
      title: 'Skiture',
      body: 'Sent forår og forsommer holder sneen sig længe højt oppe. Skitur til Vakkerstøylen fra Brøstet er en klassiker – lang, men gennemførlig for trænede turfolk.',
    },
    hutToHut: {
      title: 'Hytte til hytte',
      body: 'Vakkerstøylen, Pyttbua og nabohytterne hænger sammen i et rutenet, der lader dig planlægge flere dages ture. Tilpas etaperne til vejr og sneforhold.',
    },
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Inden du tager af sted',
    cardWeather: {
      title: 'Tjek vejr og forhold',
      body: 'Vind, sigt og sneforhold afgør, hvor langt du kommer. Læs vejrudsigten før afrejse, og hav en plan B, hvis vejret skifter.',
    },
    cardShift: {
      title: 'Vejret skifter hurtigt',
      body: 'På fjeldet kan en fin dag blive krævende på få minutter. Vend om i tide, hvis sigtbarheden forsvinder – fjeldet står der også i morgen.',
    },
    cardPack: {
      title: 'Pak ordentligt',
      body: 'Vindtæt skal, ekstra lag, mad, drikke, kort og kompas – også på korte ture. Powerbank og pandelampe, hvis du går mod aften.',
    },
    cardUt: {
      title: 'Brug UT.no og afmærkede ruter',
      bodyBefore: 'Detaljerede ruter, højdeprofiler og hytteinfo ligger på ',
      linkText: 'ut.no',
      bodyAfter: '. Hold dig til afmærkede stier og varder, når området er nyt for dig.',
    },
    ctaAllHikes: 'Se alle vandreture omkring Bjorli',
    ctaBackSummer: 'Tilbage til sommer på Bjorli',
  },
  sv: {
    heroTitle: 'Tafjordfjella',
    heroSubtitle: 'Från Bjorli in i ett av Vestlandets vildaste fjällandskap – via Brøstdalen.',
    heroAlt: 'Sommarvy från Bjorli mot fjällen in mot Brøstdalen och Tafjordfjella.',
    crumbHome: 'Hem',
    crumbSommer: 'Sommar',
    crumbHere: 'Tafjordfjella',
    introP1:
      'Med Bjorli som utgångspunkt är det kort bilväg innan <strong>Brøstdalen</strong> öppnar sig och drar dig in mot Tafjordfjella. Få områden i Norge har samma kontraster på så liten yta: djupa dalar, frodig västkust-fjällterräng och snötäckta vidder som ligger där året om.',
    introP2:
      'Området funkar lika bra för en luftig dagsvandring som för en längre runda från stuga till stuga. Du väljer själv om det ska bli lugna timmar vid ett vatten, ett tufft pass upp till första toppen – eller flera dagar med ryggsäck och karta.',
    geographyBadge: 'Geografi',
    geographyTitle: 'Från Bjorli in i vildare fjäll',
    geographyP1:
      'Bjorli ligger lugnt mellan Lesja och Romsdalen, omgivet av öppna fjäll och en bred dal. Kör du in i Brøstdalen ändrar landskapet snabbt karaktär – sidodalarna smalnar, vattenfallen blir tydligare, och terrängen lutar åt det västländska.',
    geographyP2:
      'Innanför väntar själva <strong>Tafjordfjella</strong>: ett stort, sammanhängande fjällområde med höga toppar, sjöar och långa vidder. Här ligger rutter som <em>Vakkerstøylen</em> och <em>Pyttbua</em> – samma fjäll som du anar från sluttningen ovanför Bjorli, bara mycket längre in.',
    toursBadge: 'Turförslag och stugor',
    toursTitle: 'Konkreta turer att börja med',
    toursIntro: 'Tre bra ingångar till Tafjordfjella – med fullständig ruttinfo, kartor och stuginfo på UT.no.',
    toursSeeOnUt: 'Se på UT.no',
    tours: [
      {
        title: 'Vakkerstøylen',
        kind: 'Fjällstuga',
        desc: 'Liten, enkel självbetjäningsstuga mitt i hjärtat av Tafjordfjella. Fint mål för en lång dagstur från Brøstet, eller första natten på en längre stugtur längre in.',
      },
      {
        title: 'Skidtur till Vakkerstøylen från Brøstet',
        kind: 'Skidtur',
        desc: 'Klassisk skidtur upp för dalen och upp på fjället. Lång dag, men jämn stigning – och storslaget fjällandskap så fort du är uppe på vidden.',
      },
      {
        title: 'Pyttbua',
        kind: 'Fjällstuga',
        desc: 'Större bemannad stuga längre in i Tafjordfjella – populär knutpunkt för stuga-till-stuga-turer både sommar och vinter.',
      },
    ],
    lengthBadge: 'Korta och långa turer',
    lengthTitle: 'Välj längd efter dagsform och väder',
    dayTrips: {
      title: 'Dagsturer',
      body: 'Kör in i Brøstdalen och hitta en startpunkt – många rutter funkar fint som dagsrunda om du är ute tidigt.',
    },
    skiTours: {
      title: 'Skidturer',
      body: 'Sen vår och försommar håller sig snön länge högt upp. Skidturen till Vakkerstøylen från Brøstet är en klassiker – lång, men fullt möjlig för vana turgängare.',
    },
    hutToHut: {
      title: 'Stuga till stuga',
      body: 'Vakkerstøylen, Pyttbua och granstugorna hänger ihop i ett rutnät som låter dig planera flera dagars turer. Lägg etapperna efter väder och snöförhållanden.',
    },
    praktiskBadge: 'Praktisk info',
    praktiskTitle: 'Innan du ger dig ut',
    cardWeather: {
      title: 'Kolla väder och förhållanden',
      body: 'Vind, sikt och snö avgör hur långt du kommer. Läs prognosen innan avfärd och ha en plan B om vädret slår om.',
    },
    cardShift: {
      title: 'Vädret slår om snabbt',
      body: 'Uppe på fjället kan en bra dag bli krävande på några minuter. Vänd i tid om sikten försvinner – fjället står kvar i morgon också.',
    },
    cardPack: {
      title: 'Packa ordentligt',
      body: 'Vindtätt skal, extra lager, mat, dryck, karta och kompass – även på korta turer. Powerbank och pannlampa när det går mot kväll.',
    },
    cardUt: {
      title: 'Använd UT.no och markerade leder',
      bodyBefore: 'Detaljerade rutter, höjdprofiler och stuginfo finns på ',
      linkText: 'ut.no',
      bodyAfter: '. Håll dig till markerade leder och rösen när området är nytt för dig.',
    },
    ctaAllHikes: 'Se alla vandringar runt Bjorli',
    ctaBackSummer: 'Tillbaka till sommar på Bjorli',
  },
};