import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import farmHeroImg from '@/assets/farms/gardsbesok-lesja-kulturlandskap.avif';
import klatringHeroImg from '@/assets/klatring/klatring-hero-romsdalen-granitt.jpg';
import flyplassImg from '@/assets/photos/bjorli-flyplass-oversikt.png';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

type Card = {
  key: string;
  title: string;
  desc: string;
  href: string;
  image: string;
  alt: string;
  external?: boolean;
  objectPosition?: string;
};

type Section = { id: string; title: string; intro?: string; cards: Card[] };

type Copy = {
  metaTitle: string;
  metaDesc: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  readMore: string;
  sections: Section[];
};

// Card keys map to NO paths; we localise via useLocalizedPath.
const buildSections = (
  c: {
    rundtTitle: string; rundtIntro: string;
    fotturer: { t: string; d: string };
    sykling: { t: string; d: string };
    fiske: { t: string; d: string };
    familie: { t: string; d: string };
    gard: { t: string; d: string; alt: string };
    klatring: { t: string; d: string; alt: string };
    dagsturerTitle: string; dagsturerIntro: string;
    golden: { t: string; d: string };
    gondol: { t: string; d: string };
    sagelva: { t: string; d: string };
    naturTitle: string; naturIntro: string;
    korteTurer: { t: string; d: string };
    lengre: { t: string; d: string };
    tafjord: { t: string; d: string };
    natur: { t: string; d: string };
    luftigeTitle: string; luftigeIntro: string;
    flyplass: { t: string; d: string; alt: string; caption: string };
  },
  lp: (p: string) => string,
): Section[] => [
  {
    id: 'rundt-bjorli',
    title: c.rundtTitle,
    intro: c.rundtIntro,
    cards: [
      { key: 'fotturer', title: c.fotturer.t, desc: c.fotturer.d, href: lp('/fotturer'), image: images.hiking.src, alt: images.hiking.alt },
      { key: 'sykling', title: c.sykling.t, desc: c.sykling.d, href: lp('/sykling'), image: images.biking.src, alt: images.biking.alt },
      { key: 'fiske', title: c.fiske.t, desc: c.fiske.d, href: lp('/fiske'), image: images.fishingHero.src, alt: images.fishingHero.alt },
      { key: 'familie', title: c.familie.t, desc: c.familie.d, href: lp('/familie'), image: images.familySummer.src, alt: images.familySummer.alt },
      { key: 'gard', title: c.gard.t, desc: c.gard.d, href: lp('/gardsbesok'), image: farmHeroImg, alt: c.gard.alt },
      { key: 'klatring', title: c.klatring.t, desc: c.klatring.d, href: lp('/sommer/klatring-og-buldring-romsdalen'), image: klatringHeroImg, alt: c.klatring.alt },
    ],
  },
  {
    id: 'dagsturer',
    title: c.dagsturerTitle,
    intro: c.dagsturerIntro,
    cards: [
      { key: 'golden', title: c.golden.t, desc: c.golden.d, href: lp('/golden-train'), image: images.tipTrain.src, alt: images.tipTrain.alt },
      { key: 'gondol', title: c.gondol.t, desc: c.gondol.d, href: lp('/romsdalsgondolen'), image: images.romsdalsgondolen.src, alt: images.romsdalsgondolen.alt },
      { key: 'sagelva', title: c.sagelva.t, desc: c.sagelva.d, href: lp('/sagelva'), image: images.sagelva.src, alt: images.sagelva.alt },
    ],
  },
  {
    id: 'natur-og-ruter',
    title: c.naturTitle,
    intro: c.naturIntro,
    cards: [
      // KorteTurer is Norwegian-only (no localised alias). Linked from NO source only via lp('/sommer/korte-turer') which stays at root.
      { key: 'korte', title: c.korteTurer.t, desc: c.korteTurer.d, href: '/sommer/korte-turer', image: images.summerValley.src, alt: images.summerValley.alt },
      { key: 'lengre', title: c.lengre.t, desc: c.lengre.d, href: lp('/fotturer'), image: images.summerAerialValleyRiver.src, alt: images.summerAerialValleyRiver.alt },
      { key: 'tafjord', title: c.tafjord.t, desc: c.tafjord.d, href: lp('/fotturer'), image: images.summerAerialSkiCenterMountain.src, alt: images.summerAerialSkiCenterMountain.alt },
      { key: 'natur', title: c.natur.t, desc: c.natur.d, href: lp('/sommer'), image: images.summerAerialNature.src, alt: images.summerAerialNature.alt },
    ],
  },
  {
    id: 'luftige-opplevelser',
    title: c.luftigeTitle,
    intro: c.luftigeIntro,
    cards: [
      {
        key: 'flyplass',
        title: c.flyplass.t,
        desc: c.flyplass.d,
        href: 'https://www.lesjafsk.no/',
        image: flyplassImg,
        alt: c.flyplass.alt,
        external: true,
        objectPosition: '75% 30%',
      },
    ],
  },
];

const COPY_RAW = {
  no: {
    metaTitle: 'Aktiviteter på Bjorli | Tur, sykling, fiske, gardsbesøk og dagsturer',
    metaDesc: 'Oversikt over aktiviteter i og rundt Bjorli — fotturer, sykling, fiske, familieaktiviteter, gardsbesøk, dagsturer som Golden Train og Romsdalsgondolen, samt natur og utsikt.',
    heroTitle: 'Aktiviteter på Bjorli',
    heroSubtitle: 'Finn fotturer, sykling, fiske, familieopplevelser og dagsturer med Bjorli som base.',
    intro: 'Bjorli er et helårs reisemål med korte aktiviteter rett utenfor døra og store opplevelser innen kort kjøreavstand- eller togreise. Her finner du fotturer, sykling, fiske, familieopplevelser, lokal kultur og dagsturer mot Romsdalen, fjellet og fjorden.',
    readMore: 'Les mer',
    rundtTitle: 'Aktiviteter i og rundt Bjorli',
    rundtIntro: 'Opplevelser du kan starte rett fra døra — i fjellet, langs elva og på gårdene i Lesja.',
    fotturer: { t: 'Fotturer', d: 'Korte turer, fjellstier og lengre ruter i Bjorli-fjella.' },
    sykling: { t: 'Sykling og pumptrack', d: 'Pumptrack, grusveier og stisykling for aktive sommerdager.' },
    fiske: { t: 'Fiske', d: 'Fjellvann, elver og rolige fiskeplasser rundt Bjorli.' },
    familie: { t: 'Familieaktiviteter', d: 'Lavterskel opplevelser for barn og voksne gjennom sommeren.' },
    gard: { t: 'Gardsbesøk', d: 'Møt dyr, gårdsliv og kulturlandskap i nærområdet rundt Bjorli.', alt: 'Kulturlandskap og gard i Lesja' },
    klatring: { t: 'Klatring og buldring', d: 'Sportsklatring, buldring, via ferrata og lengre fjellruter i Romsdalen. Bjorli er en praktisk base for klatredager vestover.', alt: 'Bratte fjellvegger i Romsdalen — klatring og buldring' },
    dagsturerTitle: 'Dagsturer og lokale opplevelser',
    dagsturerIntro: 'Bruk Bjorli som base og kombiner togtur, gondol og lokal kulturhistorie.',
    golden: { t: 'The Golden Train', d: 'En scenisk togreise på Raumabanen, med Bjorli som naturlig utgangspunkt.' },
    gondol: { t: 'Romsdalsgondolen', d: 'Fjord- og fjellutsikt i Åndalsnes, innen rekkevidde fra Bjorli.' },
    sagelva: { t: 'Sagelva vasskraftsenter', d: 'Vasskraft, lokalhistorie og levende formidling i Lesja.' },
    naturTitle: 'Fjell, natur og ruter',
    naturIntro: 'Tematiske turforslag for deg som vil ut i naturen rundt Bjorli.',
    korteTurer: { t: 'Korte turer', d: 'Enkle turer for en rolig formiddag eller ettermiddag i fjellet.' },
    lengre: { t: 'Lengre fotturer', d: 'Toppturer, dagsmarsjer og fjellruter for vante turgåere.' },
    tafjord: { t: 'Tafjordfjella', d: 'Store fjellområder, åpne vidder og turmuligheter fra Bjorli-siden.' },
    natur: { t: 'Natur og utsikt', d: 'Utsiktspunkt, elvelandskap og stille natur i Lesja og Romsdalen.' },
  },
  en: {
    metaTitle: 'Things to do at Bjorli | Hiking, cycling, fishing, farm visits and day trips',
    metaDesc: 'Activities in and around Bjorli — hiking, cycling, fishing, family activities, farm visits, day trips like The Golden Train and Romsdalsgondolen, plus nature and viewpoints.',
    heroTitle: 'Things to do at Bjorli',
    heroSubtitle: 'Find hiking, cycling, fishing, family activities and day trips with Bjorli as your base.',
    intro: 'Bjorli is a year-round destination with easy activities just outside the door and bigger experiences within a short drive or train ride. Here you’ll find hiking, cycling, fishing, family activities, local culture and day trips towards Romsdalen, the mountains and the fjord.',
    readMore: 'Read more',
    rundtTitle: 'Activities in and around Bjorli',
    rundtIntro: 'Experiences you can start right from the door — in the mountains, along the river and on the farms in Lesja.',
    fotturer: { t: 'Hiking', d: 'Short walks, mountain trails and longer routes in the Bjorli mountains.' },
    sykling: { t: 'Cycling and pump track', d: 'Pump track, gravel roads and trail riding for active summer days.' },
    fiske: { t: 'Fishing', d: 'Mountain lakes, rivers and quiet fishing spots around Bjorli.' },
    familie: { t: 'Family activities', d: 'Easy, accessible experiences for children and adults through the summer.' },
    gard: { t: 'Farm visits', d: 'Meet farm animals, farm life and cultural landscapes near Bjorli.', alt: 'Farmland and cultural landscape in Lesja' },
    klatring: { t: 'Climbing and bouldering', d: 'Sport climbing, bouldering, via ferrata and longer mountain routes in Romsdalen. Bjorli is a practical base for climbing days west toward Åndalsnes.', alt: 'Steep mountain walls in Romsdalen — climbing and bouldering' },
    dagsturerTitle: 'Day trips and local experiences',
    dagsturerIntro: 'Use Bjorli as a base and combine train rides, the gondola and local cultural history.',
    golden: { t: 'The Golden Train', d: 'A scenic train journey on the Rauma Line, with Bjorli as a natural starting point.' },
    gondol: { t: 'Romsdalsgondolen', d: 'Fjord and mountain views in Åndalsnes, within easy reach of Bjorli.' },
    sagelva: { t: 'Sagelva vasskraftsenter', d: 'Water power, local history and living heritage in Lesja.' },
    naturTitle: 'Mountains, nature and routes',
    naturIntro: 'Themed walk suggestions for getting out into the nature around Bjorli.',
    korteTurer: { t: 'Short walks', d: 'Easy walks for a quiet morning or afternoon in the mountains.' },
    lengre: { t: 'Longer hikes', d: 'Summits, full-day routes and mountain trails for experienced walkers.' },
    tafjord: { t: 'Tafjordfjella', d: 'Wide mountain areas, open plateaus and hiking options from the Bjorli side.' },
    natur: { t: 'Nature and views', d: 'Viewpoints, river landscapes and quiet nature in Lesja and Romsdalen.' },
  },
  de: {
    metaTitle: 'Aktivitäten in Bjorli | Wandern, Radfahren, Angeln, Hofbesuche und Tagesausflüge',
    metaDesc: 'Aktivitäten in und um Bjorli — Wandern, Radfahren, Angeln, Familienangebote, Hofbesuche, Tagesausflüge wie The Golden Train und Romsdalsgondolen sowie Natur und Aussicht.',
    heroTitle: 'Aktivitäten in Bjorli',
    heroSubtitle: 'Wandern, Radfahren, Angeln, Familienerlebnisse und Tagesausflüge mit Bjorli als Ausgangspunkt.',
    intro: 'Bjorli ist ein Ganzjahresziel mit kurzen Aktivitäten direkt vor der Tür und größeren Erlebnissen in kurzer Auto- oder Zugreichweite. Sie finden hier Wanderungen, Radfahren, Angeln, Familienerlebnisse, lokale Kultur und Tagesausflüge in Richtung Romsdalen, Berge und Fjord.',
    readMore: 'Mehr erfahren',
    rundtTitle: 'Aktivitäten in und um Bjorli',
    rundtIntro: 'Erlebnisse, die direkt vor der Haustür beginnen — in den Bergen, am Fluss und auf den Höfen in Lesja.',
    fotturer: { t: 'Wandern', d: 'Kurze Touren, Bergpfade und längere Routen in den Bergen um Bjorli.' },
    sykling: { t: 'Radfahren und Pumptrack', d: 'Pumptrack, Schotterstraßen und Trails für aktive Sommertage.' },
    fiske: { t: 'Angeln', d: 'Bergseen, Flüsse und ruhige Angelplätze rund um Bjorli.' },
    familie: { t: 'Familienangebote', d: 'Unkomplizierte Erlebnisse für Kinder und Erwachsene im Sommer.' },
    gard: { t: 'Hofbesuche', d: 'Hoftiere, Hofleben und Kulturlandschaften in der Umgebung von Bjorli.', alt: 'Kulturlandschaft und Hof in Lesja' },
    klatring: { t: 'Klettern und Bouldern', d: 'Sportklettern, Bouldern, Via Ferrata und längere Bergrouten im Romsdalen. Bjorli ist eine praktische Basis für Klettertage Richtung Åndalsnes.', alt: 'Steile Felswände im Romsdalen — Klettern und Bouldern' },
    dagsturerTitle: 'Tagesausflüge und lokale Erlebnisse',
    dagsturerIntro: 'Bjorli als Basis: Zugfahrt, Gondel und lokale Kulturgeschichte lassen sich gut kombinieren.',
    golden: { t: 'The Golden Train', d: 'Landschaftliche Zugfahrt auf der Raumabahn mit Bjorli als naheliegendem Ausgangspunkt.' },
    gondol: { t: 'Romsdalsgondolen', d: 'Fjord- und Bergblick in Åndalsnes, in kurzer Entfernung von Bjorli.' },
    sagelva: { t: 'Sagelva vasskraftsenter', d: 'Wasserkraft, lokale Geschichte und gelebte Vermittlung in Lesja.' },
    naturTitle: 'Berge, Natur und Routen',
    naturIntro: 'Themenvorschläge für alle, die die Natur rund um Bjorli erkunden möchten.',
    korteTurer: { t: 'Kurze Touren', d: 'Einfache Touren für einen ruhigen Vor- oder Nachmittag in den Bergen.' },
    lengre: { t: 'Längere Wanderungen', d: 'Gipfeltouren, Tagesmärsche und Bergrouten für erfahrene Wanderer.' },
    tafjord: { t: 'Tafjordfjella', d: 'Große Bergareale, offene Hochflächen und Tourenmöglichkeiten von Bjorli aus.' },
    natur: { t: 'Natur und Aussicht', d: 'Aussichtspunkte, Flusslandschaften und ruhige Natur in Lesja und Romsdalen.' },
  },
  nl: {
    metaTitle: 'Activiteiten in Bjorli | Wandelen, fietsen, vissen, boerderijbezoek en dagtrips',
    metaDesc: 'Overzicht van activiteiten in en rond Bjorli — wandelen, fietsen, vissen, familieactiviteiten, boerderijbezoek, dagtrips zoals The Golden Train en Romsdalsgondolen en natuur en uitzicht.',
    heroTitle: 'Activiteiten in Bjorli',
    heroSubtitle: 'Wandelen, fietsen, vissen, familie-uitjes en dagtrips met Bjorli als uitvalsbasis.',
    intro: 'Bjorli is een bestemming voor het hele jaar, met korte activiteiten vlak bij de deur en grotere belevingen op korte rij- of treinafstand. Je vindt er wandelen, fietsen, vissen, familie-uitjes, lokale cultuur en dagtrips richting Romsdalen, de bergen en de fjord.',
    readMore: 'Lees meer',
    rundtTitle: 'Activiteiten in en rond Bjorli',
    rundtIntro: 'Belevingen die je direct vanaf de deur kunt starten — in de bergen, langs de rivier en op de boerderijen in Lesja.',
    fotturer: { t: 'Wandelen', d: 'Korte wandelingen, bergpaden en langere routes in de bergen van Bjorli.' },
    sykling: { t: 'Fietsen en pumptrack', d: 'Pumptrack, grindwegen en singletracks voor actieve zomerdagen.' },
    fiske: { t: 'Vissen', d: 'Bergmeren, rivieren en rustige visplekken rond Bjorli.' },
    familie: { t: 'Familieactiviteiten', d: 'Laagdrempelige activiteiten voor kinderen en volwassenen in de zomer.' },
    gard: { t: 'Boerderijbezoek', d: 'Maak kennis met boerderijdieren, het boerenleven en cultuurlandschap bij Bjorli.', alt: 'Cultuurlandschap en boerderij in Lesja' },
    klatring: { t: 'Klimmen en boulderen', d: 'Sportklimmen, boulderen, via ferrata en langere bergroutes in Romsdalen. Bjorli is een praktische uitvalsbasis voor klimdagen richting Åndalsnes.', alt: 'Steile rotswanden in Romsdalen — klimmen en boulderen' },
    dagsturerTitle: 'Dagtrips en lokale belevingen',
    dagsturerIntro: 'Gebruik Bjorli als basis en combineer een treinrit, de kabelbaan en lokale cultuurgeschiedenis.',
    golden: { t: 'The Golden Train', d: 'Een schilderachtige treinreis op de Raumabanen, met Bjorli als logisch beginpunt.' },
    gondol: { t: 'Romsdalsgondolen', d: 'Fjord- en bergpanorama’s in Åndalsnes, binnen handbereik vanuit Bjorli.' },
    sagelva: { t: 'Sagelva vasskraftsenter', d: 'Waterkracht, lokale geschiedenis en levende overdracht in Lesja.' },
    naturTitle: 'Bergen, natuur en routes',
    naturIntro: 'Themasuggesties voor wie de natuur rond Bjorli in wil.',
    korteTurer: { t: 'Korte wandelingen', d: 'Eenvoudige wandelingen voor een rustige ochtend of middag in de bergen.' },
    lengre: { t: 'Langere wandeltochten', d: 'Toppen, dagtochten en bergroutes voor ervaren wandelaars.' },
    tafjord: { t: 'Tafjordfjella', d: 'Uitgestrekte berggebieden, open hoogvlakten en routes vanaf de Bjorli-kant.' },
    natur: { t: 'Natuur en uitzicht', d: 'Uitzichtpunten, rivierlandschappen en stille natuur in Lesja en Romsdalen.' },
  },
  da: {
    metaTitle: 'Aktiviteter på Bjorli | Vandring, cykling, fiskeri, gårdsbesøg og dagsture',
    metaDesc: 'Overblik over aktiviteter i og omkring Bjorli — vandring, cykling, fiskeri, familieaktiviteter, gårdsbesøg, dagsture som The Golden Train og Romsdalsgondolen samt natur og udsigt.',
    heroTitle: 'Aktiviteter på Bjorli',
    heroSubtitle: 'Find vandring, cykling, fiskeri, familieoplevelser og dagsture med Bjorli som base.',
    intro: 'Bjorli er et helårsmål med korte aktiviteter lige uden for døren og større oplevelser inden for kort køre- eller togafstand. Her finder du vandring, cykling, fiskeri, familieoplevelser, lokal kultur og dagsture mod Romsdalen, fjeldet og fjorden.',
    readMore: 'Læs mere',
    rundtTitle: 'Aktiviteter i og omkring Bjorli',
    rundtIntro: 'Oplevelser, du kan starte lige fra døren — i fjeldet, langs elven og på gårdene i Lesja.',
    fotturer: { t: 'Vandring', d: 'Korte ture, fjeldstier og længere ruter i fjeldene omkring Bjorli.' },
    sykling: { t: 'Cykling og pumptrack', d: 'Pumptrack, grusveje og sti-cykling til aktive sommerdage.' },
    fiske: { t: 'Fiskeri', d: 'Fjeldsøer, elve og rolige fiskepladser omkring Bjorli.' },
    familie: { t: 'Familieaktiviteter', d: 'Nemme oplevelser for børn og voksne gennem sommeren.' },
    gard: { t: 'Gårdsbesøg', d: 'Mød dyr, gårdsliv og kulturlandskab i nærområdet ved Bjorli.', alt: 'Kulturlandskab og gård i Lesja' },
    klatring: { t: 'Klatring og bouldering', d: 'Sportsklatring, bouldering, via ferrata og længere fjeldruter i Romsdalen. Bjorli er en praktisk base for klatredage mod Åndalsnes.', alt: 'Stejle fjeldvægge i Romsdalen — klatring og bouldering' },
    dagsturerTitle: 'Dagsture og lokale oplevelser',
    dagsturerIntro: 'Brug Bjorli som base og kombiner togtur, gondol og lokal kulturhistorie.',
    golden: { t: 'The Golden Train', d: 'En naturskøn togtur på Raumabanen med Bjorli som naturligt udgangspunkt.' },
    gondol: { t: 'Romsdalsgondolen', d: 'Fjord- og fjeldudsigt i Åndalsnes, inden for rækkevidde fra Bjorli.' },
    sagelva: { t: 'Sagelva vasskraftsenter', d: 'Vandkraft, lokal historie og levende formidling i Lesja.' },
    naturTitle: 'Fjeld, natur og ruter',
    naturIntro: 'Tematiske turforslag til dig, der vil ud i naturen omkring Bjorli.',
    korteTurer: { t: 'Korte ture', d: 'Enkle ture til en rolig formiddag eller eftermiddag i fjeldet.' },
    lengre: { t: 'Længere vandreture', d: 'Toptur, dagsmarcher og fjeldruter for vante vandrere.' },
    tafjord: { t: 'Tafjordfjella', d: 'Store fjeldområder, åbne vidder og turmuligheder fra Bjorli-siden.' },
    natur: { t: 'Natur og udsigt', d: 'Udsigtspunkter, elvelandskaber og stille natur i Lesja og Romsdalen.' },
  },
  sv: {
    metaTitle: 'Aktiviteter på Bjorli | Vandring, cykling, fiske, gårdsbesök och dagsturer',
    metaDesc: 'Översikt över aktiviteter i och runt Bjorli — vandring, cykling, fiske, familjeaktiviteter, gårdsbesök, dagsturer som The Golden Train och Romsdalsgondolen samt natur och utsikt.',
    heroTitle: 'Aktiviteter på Bjorli',
    heroSubtitle: 'Vandring, cykling, fiske, familjeupplevelser och dagsturer med Bjorli som bas.',
    intro: 'Bjorli är ett helårsmål med korta aktiviteter precis utanför dörren och större upplevelser inom kort bil- eller tågresa. Här hittar du vandring, cykling, fiske, familjeupplevelser, lokal kultur och dagsturer mot Romsdalen, fjället och fjorden.',
    readMore: 'Läs mer',
    rundtTitle: 'Aktiviteter i och runt Bjorli',
    rundtIntro: 'Upplevelser du kan starta direkt från dörren — i fjället, längs älven och på gårdarna i Lesja.',
    fotturer: { t: 'Vandring', d: 'Korta turer, fjällstigar och längre rutter i fjällen runt Bjorli.' },
    sykling: { t: 'Cykling och pumptrack', d: 'Pumptrack, grusvägar och stigcykling för aktiva sommardagar.' },
    fiske: { t: 'Fiske', d: 'Fjällsjöar, älvar och lugna fiskeplatser runt Bjorli.' },
    familie: { t: 'Familjeaktiviteter', d: 'Lättillgängliga upplevelser för barn och vuxna under sommaren.' },
    gard: { t: 'Gårdsbesök', d: 'Möt djur, gårdsliv och kulturlandskap i området kring Bjorli.', alt: 'Kulturlandskap och gård i Lesja' },
    klatring: { t: 'Klättring och bouldering', d: 'Sportklättring, bouldering, via ferrata och längre fjällrutter i Romsdalen. Bjorli är en praktisk bas för klätterdagar mot Åndalsnes.', alt: 'Branta fjällväggar i Romsdalen — klättring och bouldering' },
    dagsturerTitle: 'Dagsturer och lokala upplevelser',
    dagsturerIntro: 'Använd Bjorli som bas och kombinera tågresa, gondol och lokal kulturhistoria.',
    golden: { t: 'The Golden Train', d: 'En naturskön tågresa på Raumabanen, med Bjorli som naturlig utgångspunkt.' },
    gondol: { t: 'Romsdalsgondolen', d: 'Fjord- och fjällutsikt i Åndalsnes, inom räckhåll från Bjorli.' },
    sagelva: { t: 'Sagelva vasskraftsenter', d: 'Vattenkraft, lokal historia och levande förmedling i Lesja.' },
    naturTitle: 'Fjäll, natur och rutter',
    naturIntro: 'Tematiska turförslag för dig som vill ut i naturen runt Bjorli.',
    korteTurer: { t: 'Korta turer', d: 'Enkla turer för en lugn för- eller eftermiddag i fjället.' },
    lengre: { t: 'Längre vandringar', d: 'Toppturer, dagsmarscher och fjällrutter för vana vandrare.' },
    tafjord: { t: 'Tafjordfjella', d: 'Stora fjällområden, öppna vidder och turmöjligheter från Bjorli-sidan.' },
    natur: { t: 'Natur och utsikt', d: 'Utsiktspunkter, älvlandskap och stilla natur i Lesja och Romsdalen.' },
  },
};

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', Copy> = (() => {
  const out = {} as Record<keyof typeof COPY_RAW, Copy>;
  (Object.keys(COPY_RAW) as (keyof typeof COPY_RAW)[]).forEach((k) => {
    const c = COPY_RAW[k];
    out[k] = {
      metaTitle: c.metaTitle,
      metaDesc: c.metaDesc,
      heroTitle: c.heroTitle,
      heroSubtitle: c.heroSubtitle,
      intro: c.intro,
      readMore: c.readMore,
      // sections are built lazily inside the component because they need lp()
      sections: [] as Section[],
    };
  });
  return out;
})();

const ActivityCard = ({ card, index, readMore }: { card: Card; index: number; readMore: string }) => {
  const inner = (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group h-full bg-card rounded-2xl overflow-hidden border border-border/60 shadow-[0_1px_2px_hsl(var(--foreground)/0.04)] hover:shadow-[0_18px_40px_-20px_hsl(var(--foreground)/0.25)] hover:border-secondary/50 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
        <img
          src={card.image}
          alt={card.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
          style={card.objectPosition ? { objectPosition: card.objectPosition } : undefined}
        />
      </div>
      <div className="p-7 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground mb-3 leading-tight tracking-tight group-hover:text-secondary transition-colors">
          {card.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{card.desc}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary mt-auto pt-1 border-t border-border/0 group-hover:border-border/40 transition-colors">
          <span>{readMore}</span>
          {card.external ? (
            <ExternalLink className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
      </div>
    </motion.article>
  );

  if (card.external) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return (
    <Link to={card.href} className="block h-full">
      {inner}
    </Link>
  );
};

const Activities = () => {
  const t = usePageCopy(COPY);
  const lp = useLocalizedPath();
  // Resolve full per-locale strings (sections need lp())
  const raw = COPY_RAW[(Object.keys(COPY_RAW) as (keyof typeof COPY_RAW)[]).find((k) => COPY[k] === t) ?? 'no'];
  const sections = buildSections(raw, lp);

  useEffect(() => {
    document.title = t.metaTitle;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', t.metaDesc);
  }, [t.metaTitle, t.metaDesc]);

  return (
    <div>
      <PageHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        image={images.heroSummer.src}
      />

      <section className="pt-16 md:pt-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{t.intro}</p>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="py-20 md:py-28 px-4 even:bg-muted/30">
          <div className="container mx-auto">
            <div className="max-w-2xl mb-12 md:mb-14">
              <div className="h-px w-12 bg-secondary mb-6" aria-hidden />
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-[1.05] tracking-tight">
                {section.title}
              </h2>
              {section.intro && (
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{section.intro}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
              {section.cards.map((card, i) => (
                <ActivityCard key={card.key} card={card} index={i} readMore={t.readMore} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Activities;
