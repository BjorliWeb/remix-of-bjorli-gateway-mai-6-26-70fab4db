import type { Language } from './types';

/**
 * Localized copy for the summer homepage sections rendered by
 * `mockAdapter.getHomepage({ season: 'summer' })`.
 *
 * Norwegian is the source. Every locale supplies its own strings so
 * non-NO routes (/en/summer, /de/sommer, /nl/zomer, /da/sommer,
 * /sv/sommar) never fall back to Norwegian.
 *
 * Protected proper names (Bjorli, Bjorli Skisenter, Raumabanen, Romsdalen,
 * Trollveggen, Trollstigen, Geiranger, Dovrefjell, Reinheimen,
 * Romsdalsalpene, Tafjordfjella, Åndalsnes, Lesja, Rauma, Lågen,
 * Lesjaskogsvatnet, Aursjøen, Dalsida, Sagelva, Vetlegrenda, Pumptrack,
 * Mardalsfossen, Mardøla) are kept verbatim across locales.
 */

export interface SummerHomepageCopy {
  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[]; // 3
  };
  picker: {
    eyebrow: string;
    title: string;
    readMore: string;
    cards: { title: string; desc: string; alt: string }[]; // 5
  };
  activitiesGrid: {
    eyebrow: string;
    title: string;
    readMore: string;
    cards: {
      title: string;
      desc: string;
      alt: string;
    }[]; // 9
  };
  biking: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
  hiking: {
    eyebrow: string;
    title: string;
    body: string;
    subcards: { title: string; desc: string }[]; // 4
    ctaPrimary: string;
    ctaSecondary: string;
  };
  fishing: {
    eyebrow: string;
    title: string;
    body: string;
    alt: string;
    cta: string;
  };
  family: {
    eyebrow: string;
    title: string;
    body: string;
    subcards: { title: string; desc: string }[]; // 5
    cta: string;
  };
  basecamp: {
    eyebrow: string;
    title: string;
    body: string;
    subcards: { title: string; desc: string }[]; // 4
    cta: string;
  };
  foodDrink: {
    eyebrow: string;
    title: string;
    body: string;
    alt: string;
    cta: string;
  };
}

export const SUMMER_HOMEPAGE_COPY: Record<Language, SummerHomepageCopy> = {
  no: {
    intro: {
      eyebrow: 'Sommer på Bjorli',
      title: 'Fjell, vann og dagsturer vestover',
      subtitle:
        'Bjorli gir kort vei til fotturer, sykkel, fiske i Rauma og Lesjaskogsvatnet, moskus på Dovrefjell, Mardalsfossen i Mardøla og dagsturer ut i Romsdalen og mot fjordene.',
      items: [
        { title: 'Fjell og vann',     desc: 'Åpent høyfjell, Rauma, Lesjaskogsvatnet og fjellvann rett utenfor døra.' },
        { title: 'Aktive dager',      desc: 'Fottur, sykkel, fiske, gardsbesøk og turer til Mardalsfossen og Dovrefjell.' },
        { title: 'Vestover på dagstur', desc: 'Bo på Bjorli og bruk dagene i Romsdalen, langs Raumabanen og mot fjordene.' },
      ],
    },
    picker: {
      eyebrow: 'Sommerdager',
      title: 'Velg din sommerdag på Bjorli',
      readMore: 'Les mer',
      cards: [
        { title: 'Aktiv familiedag', desc: 'Pumptrack, fiske og korte turer.', alt: 'Familie på tur i sommerlandskap ved Bjorli' },
        { title: 'På sykkel og pumptrack', desc: 'Stier, grusveier og pumptrack i sentrum.', alt: 'Sykling og pumptrack på Bjorli en sommerdag' },
        { title: 'Til fjells', desc: 'Korte stier og lange dagsturer i høyfjellet.', alt: 'Åpent høyfjell og dalføre ved Bjorli' },
        { title: 'Ved vannet', desc: 'Fluefiske og rolige stunder ved Rauma.', alt: 'Stille fjellvann nær Bjorli en sommerdag' },
        { title: 'Luftig dag i Romsdalen', desc: 'Klatring, buldring og via ferrata.', alt: 'Bratte fjellvegger i Romsdalen' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Sommer på Bjorli',
      title: 'Dette kan du gjøre på Bjorli om sommeren',
      readMore: 'Les mer',
      cards: [
        { title: 'Fotturer', desc: 'Korte stier fra sentrum og lengre dagsturer i Reinheimen, Dovrefjell og Romsdalsalpene.', alt: 'Sommersti og utsikt over dalen — fottur i fjellet ved Bjorli' },
        { title: 'Sykkel og pumptrack', desc: 'Stier, grusveier og en pumptrack i sentrum — for nybegynnere og hele familien.', alt: 'Sykling i fjellet ved Bjorli en sommerdag' },
        { title: 'Fiske', desc: 'Fluefiske i Rauma, fiske i Lesjaskogsvatnet, Lågen og fjellvannene rundt Bjorli.', alt: 'Fluefiske i en fjellelv nær Bjorli en sommerdag' },
        { title: 'Familieaktiviteter', desc: 'Pumptrack, fiske ved vannet, korte fjellturer og gardsbesøk i Lesja.', alt: 'Familie møter dyr i grønt sommerlandskap ved Bjorli' },
        { title: 'Gardsbesøk', desc: 'Lokale gårder i Lesja med gårdsliv, dyr, lokal mat og kulturlandskap nær Bjorli.', alt: 'Kulturlandskap i Lesja nær Bjorli' },
        { title: 'Sagelva vasskraftsenter', desc: '300 år med vasskraft, lokalhistorie og levende formidling i Lesja.', alt: 'Sagelva vasskraftsenter i Lesja' },
        { title: 'Fossefall og moskus', desc: 'Mardalsfossen i Mardøla — en av Europas høye fossefall — og guidet moskussafari på Dovrefjell.', alt: 'Mardalsfossen og moskus på Dovrefjell — naturopplevelser i regionen rundt Bjorli' },
        { title: 'Dagsturer vestover', desc: 'Romsdalen, Raumabanen, Trollstigen, Geirangerområdet og Åndalsnes innen rekkevidde.', alt: 'Raumabanen langs elvedalen — regional dagstur fra Bjorli' },
        { title: 'Klatring og buldring', desc: 'Sportsklatring, buldring, via ferrata og alpine turer ved de bratte fjellveggene i Romsdalen.', alt: 'Bratte fjellvegger i Romsdalen — klatring og buldring' },
      ],
    },
    biking: {
      eyebrow: 'Sykkel og familie',
      title: 'Sykkel, pumptrack og aktive familiedager',
      body: 'Pumptrack i sentrum, stier i fjellet og grusveier langs Lesjaskogsvatnet gir varierte dager på sykkel. Kombiner en runde på pumptracken med en sykkeltur langs vannet, en kort stitur eller en pause ved elva — kort vei mellom hytte, sentrum og natur gjør det enkelt å bygge dagen selv.',
      cta: 'Se sykkel og aktiviteter',
    },
    hiking: {
      eyebrow: 'Fottur og natur',
      title: 'Fjellturer rett fra bygda',
      body: 'Bjorli ligger høyt og åpent, så du er raskt ute i fjellet uten lang innmarsj. Korte stier fra sentrum, familiedager i Reinheimen, lengre dagsturer inn i Dovrefjell og Romsdalsalpene — åpne vidder, fjellvann og utsikt mot Romsdalen vestover.',
      subcards: [
        { title: 'Korte turer',       desc: 'Lette stier fra sentrum og hyttene — fine for en kveldstur i lyse sommernetter.' },
        { title: 'Familieturer',      desc: 'Åpne stier og oversiktlig terreng som passer både for barn og bestemødre.' },
        { title: 'Lengre fjellturer', desc: 'Dagsturer inn i Reinheimen, Dovrefjell og Romsdalsalpene — åpent høyfjell og lange utsikter.' },
        { title: 'Vann og utsikt',    desc: 'Fjellvann, elvedaler og platåer med utsikt mot Romsdalen og fjordene vestover.' },
      ],
      ctaPrimary: 'Se fotturer',
      ctaSecondary: 'Snarturer i Rauma og Lesja',
    },
    fishing: {
      eyebrow: 'Fiske, elv og fjellvann',
      title: 'Fluefiske i Rauma, fiske i Lesjaskogsvatnet og Lågen',
      body: 'Rauma er kjent for fluefiske. Lesjaskogsvatnet, Lågen og fjellvannene rundt Bjorli gir lange dager ved vannet gjennom hele sommeren — fra rolige familiefiske til mer dedikerte dager med stang og vader.',
      alt: 'Fiske i en fjellelv nær Bjorli en sommerkveld',
      cta: 'Se fiskemuligheter',
    },
    family: {
      eyebrow: 'Familie',
      title: 'Familiedager med pumptrack, vann og fjell',
      body: 'Bjorli er enkelt å reise til med barn. Kort vei mellom hytte, sentrum og natur gir mer tid ute sammen — pumptrack i sentrum, fiske ved fjellvannet, korte stier fra døra, gardsbesøk i Lesja og dagsturer med Raumabanen mot Åndalsnes.',
      subcards: [
        { title: 'Korte fjellturer', desc: 'Lette stier rett fra hytta og sentrum — passer for små bein og barnevogn-tempo.' },
        { title: 'Sykkel og pumptrack', desc: 'Pumptrack i sentrum, grusveier og åpne uteområder for sykling og fri lek.' },
        { title: 'Fiske ved vannet',  desc: 'Fjellvann og elvepartier der barna kan prøve seg på fiske i trygge omgivelser.' },
        { title: 'Gardsbesøk',        desc: 'Lokale gårder i Lesja med dyr, lokal mat og åpent kulturlandskap.' },
        { title: 'Dagsturer sammen',  desc: 'Raumabanen mot Åndalsnes, Mardalsfossen i Mardøla og moskussafari på Dovrefjell.' },
      ],
      cta: 'Se familieaktiviteter',
    },
    basecamp: {
      eyebrow: 'Mellom fjell og fjord',
      title: 'Bo på Bjorli. Bruk dagene ut i regionen.',
      body: 'Bjorli ligger høyt og åpent med kort vei ut i regionen. Bruk dagene på Raumabanen ned mot Åndalsnes, Mardalsfossen i Mardøla, moskussafari på Dovrefjell, fiske i Rauma og Lesjaskogsvatnet, og turer videre vestover mot Trollstigen, Geirangerområdet og fjordlandskapet.',
      subcards: [
        { title: 'Fjellvann og elv',         desc: 'Lesjaskogsvatnet, Aursjøen, Dalsida og Rauma — vann og fiske rett ved Bjorli.' },
        { title: 'Fossefall og moskus',      desc: 'Mardalsfossen i Mardøla og guidet moskussafari på Dovrefjell.' },
        { title: 'Romsdalen og Raumabanen',  desc: 'Bratte fjell og togtur ned mot Åndalsnes — en av de mest kjente dagsturene fra Bjorli.' },
        { title: 'Fjordlandskap vestover',   desc: 'Trollstigen- og Geirangerområdet innen rekkevidde for dagsturer mot fjordene.' },
      ],
      cta: 'Se reise og dagsturer',
    },
    foodDrink: {
      eyebrow: 'Mat og møteplasser',
      title: 'Steder å pause i sommerlandskapet',
      body: 'Servering og møteplasser i sentrum og rundt Bjorli — for en pause mellom turene eller en lang sommerkveld etter en dag ute.',
      alt: 'Interiør med bord og lykter — servering og møteplass på Bjorli',
      cta: 'Se mat og drikke',
    },
  },

  en: {
    intro: {
      eyebrow: 'Summer in Bjorli',
      title: 'Mountains, water and day trips westward',
      subtitle:
        'Bjorli gives you easy access to hiking, cycling, fly fishing in Rauma, Lesjaskogsvatnet, muskox on Dovrefjell, Mardalsfossen in Mardøla and day trips into Romsdalen and toward the fjords.',
      items: [
        { title: 'Mountains and water', desc: 'Open high country, Rauma, Lesjaskogsvatnet and mountain lakes right outside the door.' },
        { title: 'Active days',         desc: 'Hiking, cycling, fishing, farm visits and trips to Mardalsfossen and Dovrefjell.' },
        { title: 'Days out westward',   desc: 'Stay in Bjorli and spend your days in Romsdalen, on the Raumabanen and toward the fjords.' },
      ],
    },
    picker: {
      eyebrow: 'Summer days',
      title: 'Pick your summer day at Bjorli',
      readMore: 'Read more',
      cards: [
        { title: 'Active family day', desc: 'Pumptrack, fishing and short walks.', alt: 'Family in summer landscape near Bjorli' },
        { title: 'On the bike and pumptrack', desc: 'Trails, gravel and a village pumptrack.', alt: 'Cycling and pumptrack at Bjorli on a summer day' },
        { title: 'Up to the mountains', desc: 'Short trails and long high-country days.', alt: 'Open high country and valley near Bjorli' },
        { title: 'By the water', desc: 'Fly fishing and quiet hours by Rauma.', alt: 'Calm mountain lake near Bjorli on a summer day' },
        { title: 'Airy day in Romsdalen', desc: 'Climbing, bouldering and via ferrata.', alt: 'Steep mountain walls in Romsdalen' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Summer in Bjorli',
      title: 'What you can do in Bjorli in summer',
      readMore: 'Read more',
      cards: [
        { title: 'Hiking', desc: 'Short walks from the village and longer day hikes into Reinheimen, Dovrefjell and Romsdalsalpene.', alt: 'Summer trail and valley view — hiking in the mountains near Bjorli' },
        { title: 'Cycling and pumptrack', desc: 'Trails, gravel roads and a pumptrack in the village — for beginners and the whole family.', alt: 'Cycling in the mountains near Bjorli on a summer day' },
        { title: 'Fishing', desc: 'Fly fishing in Rauma, fishing in Lesjaskogsvatnet, Lågen and the mountain lakes around Bjorli.', alt: 'Fly fishing in a mountain river near Bjorli on a summer day' },
        { title: 'Family activities', desc: 'Pumptrack, fishing by the water, short mountain walks and farm visits in Lesja.', alt: 'Family meeting animals in a green summer landscape near Bjorli' },
        { title: 'Farm visits', desc: 'Local farms in Lesja — farm life, animals, local food and cultural landscape near Bjorli.', alt: 'Cultural landscape in Lesja near Bjorli' },
        { title: 'Sagelva hydropower centre', desc: '300 years of hydropower, local history and living storytelling in Lesja.', alt: 'Sagelva hydropower centre in Lesja' },
        { title: 'Waterfalls and muskox', desc: 'Mardalsfossen in Mardøla — one of Europe’s tall waterfalls — and guided muskox safaris on Dovrefjell.', alt: 'Mardalsfossen and muskox on Dovrefjell — nature in the region around Bjorli' },
        { title: 'Day trips westward', desc: 'Romsdalen, Raumabanen, Trollstigen, the Geiranger area and Åndalsnes within reach.', alt: 'Raumabanen along the river valley — a regional day trip from Bjorli' },
        { title: 'Climbing and bouldering', desc: 'Sport climbing, bouldering, via ferrata and alpine routes on the steep mountain walls in Romsdalen.', alt: 'Steep mountain walls in Romsdalen — climbing and bouldering' },
      ],
    },
    biking: {
      eyebrow: 'Cycling and family',
      title: 'Cycling, pumptrack and active family days',
      body: 'A pumptrack in the village, trails in the mountains and gravel roads along Lesjaskogsvatnet make for varied days on the bike. Ride a lap on the pumptrack, follow the lake on gravel, take a short hike or stop by the river — short distances between cabin, village and nature make it easy to build the day yourself.',
      cta: 'See cycling and activities',
    },
    hiking: {
      eyebrow: 'Hiking and nature',
      title: 'Mountain walks straight from the village',
      body: 'Bjorli sits high and open, so you are out in the mountains quickly without a long approach. Short trails from the village, family days in Reinheimen, longer day hikes into Dovrefjell and Romsdalsalpene — open plateaus, mountain lakes and views toward Romsdalen.',
      subcards: [
        { title: 'Short walks',     desc: 'Easy paths from the village and cabins — perfect for an evening walk in bright summer nights.' },
        { title: 'Family hikes',    desc: 'Open trails and clear terrain suited to children and grandparents.' },
        { title: 'Longer mountain hikes', desc: 'Day hikes into Reinheimen, Dovrefjell and Romsdalsalpene — open high country and long views.' },
        { title: 'Water and views', desc: 'Mountain lakes, river valleys and plateaus with views toward Romsdalen and the fjords westward.' },
      ],
      ctaPrimary: 'See hikes',
      ctaSecondary: 'Short hikes in Rauma and Lesja',
    },
    fishing: {
      eyebrow: 'Fishing, rivers and mountain lakes',
      title: 'Fly fishing in Rauma, fishing in Lesjaskogsvatnet and Lågen',
      body: 'Rauma is known for fly fishing. Lesjaskogsvatnet, Lågen and the mountain lakes around Bjorli give long days by the water through the whole summer — from family fishing to dedicated days with rod and waders.',
      alt: 'Fishing in a mountain river near Bjorli on a summer evening',
      cta: 'See fishing options',
    },
    family: {
      eyebrow: 'Family',
      title: 'Family days with pumptrack, water and mountains',
      body: 'Bjorli is easy to travel to with children. Short distances between cabin, village and nature give more time outside together — pumptrack in the village, fishing by the mountain lake, short trails from the door, farm visits in Lesja and day trips on the Raumabanen toward Åndalsnes.',
      subcards: [
        { title: 'Short mountain walks', desc: 'Easy trails right from the cabin and village — suited to small legs and stroller pace.' },
        { title: 'Cycling and pumptrack', desc: 'Pumptrack in the village, gravel roads and open outdoor areas for cycling and free play.' },
        { title: 'Fishing by the water', desc: 'Mountain lakes and river stretches where children can try fishing in safe surroundings.' },
        { title: 'Farm visits',        desc: 'Local farms in Lesja with animals, local food and open cultural landscape.' },
        { title: 'Day trips together', desc: 'Raumabanen toward Åndalsnes, Mardalsfossen in Mardøla and a muskox safari on Dovrefjell.' },
      ],
      cta: 'See family activities',
    },
    basecamp: {
      eyebrow: 'Between mountains and fjords',
      title: 'Stay in Bjorli. Spend your days out in the region.',
      body: 'Bjorli sits high and open with easy access to the wider region. Spend your days on the Raumabanen down to Åndalsnes, Mardalsfossen in Mardøla, a muskox safari on Dovrefjell, fishing in Rauma and Lesjaskogsvatnet, and trips westward toward Trollstigen, the Geiranger area and the fjord landscape.',
      subcards: [
        { title: 'Mountain lakes and river', desc: 'Lesjaskogsvatnet, Aursjøen, Dalsida and Rauma — water and fishing right by Bjorli.' },
        { title: 'Waterfalls and muskox',    desc: 'Mardalsfossen in Mardøla and guided muskox safaris on Dovrefjell.' },
        { title: 'Romsdalen and Raumabanen', desc: 'Steep mountains and a train ride down to Åndalsnes — one of the best-known day trips from Bjorli.' },
        { title: 'Fjord landscape westward', desc: 'The Trollstigen and Geiranger areas within reach for day trips toward the fjords.' },
      ],
      cta: 'See travel and day trips',
    },
    foodDrink: {
      eyebrow: 'Food and meeting places',
      title: 'Places to pause in the summer landscape',
      body: 'Restaurants and meeting places in the village and around Bjorli — for a break between trips or a long summer evening after a day outside.',
      alt: 'Interior with tables and lanterns — dining and meeting place in Bjorli',
      cta: 'See food and drink',
    },
  },

  de: {
    intro: {
      eyebrow: 'Sommer in Bjorli',
      title: 'Berge, Wasser und Tagesausflüge gen Westen',
      subtitle:
        'Von Bjorli aus erreichen Sie unkompliziert Wanderungen, Radtouren, das Fliegenfischen in der Rauma, den Lesjaskogsvatnet, Moschusochsen im Dovrefjell, den Wasserfall Mardalsfossen im Mardøla und Tagesausflüge ins Romsdalen und zu den Fjorden.',
      items: [
        { title: 'Berge und Wasser', desc: 'Offenes Hochgebirge, die Rauma, der Lesjaskogsvatnet und Bergseen direkt vor der Tür.' },
        { title: 'Aktive Tage',      desc: 'Wandern, Radfahren, Angeln, Hofbesuche und Touren zum Mardalsfossen und ins Dovrefjell.' },
        { title: 'Tage gen Westen',  desc: 'Wohnen Sie in Bjorli und verbringen Sie die Tage im Romsdalen, auf der Raumabanen und Richtung Fjorde.' },
      ],
    },
    picker: {
      eyebrow: 'Sommertage',
      title: 'Wählen Sie Ihren Sommertag in Bjorli',
      readMore: 'Mehr erfahren',
      cards: [
        { title: 'Aktiver Familientag', desc: 'Pumptrack, Angeln und kurze Wanderungen.', alt: 'Familie in Sommerlandschaft bei Bjorli' },
        { title: 'Mit dem Rad und Pumptrack', desc: 'Pfade, Schotterwege und Pumptrack im Ort.', alt: 'Radfahren und Pumptrack in Bjorli im Sommer' },
        { title: 'Hinauf in die Berge', desc: 'Kurze Pfade und lange Tage im Hochgebirge.', alt: 'Offenes Hochgebirge und Tal bei Bjorli' },
        { title: 'Am Wasser', desc: 'Fliegenfischen und ruhige Stunden an der Rauma.', alt: 'Ruhiger Bergsee bei Bjorli im Sommer' },
        { title: 'Luftiger Tag im Romsdalen', desc: 'Klettern, Bouldern und Klettersteig.', alt: 'Steile Bergwände im Romsdalen' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Sommer in Bjorli',
      title: 'Das können Sie im Sommer in Bjorli unternehmen',
      readMore: 'Mehr erfahren',
      cards: [
        { title: 'Wandern', desc: 'Kurze Wege vom Ort und längere Tageswanderungen ins Reinheimen, Dovrefjell und in die Romsdalsalpene.', alt: 'Sommerpfad mit Blick ins Tal — Wandern in den Bergen bei Bjorli' },
        { title: 'Radfahren und Pumptrack', desc: 'Pfade, Schotterstraßen und ein Pumptrack im Ort — für Anfänger und die ganze Familie.', alt: 'Radfahren in den Bergen bei Bjorli an einem Sommertag' },
        { title: 'Angeln', desc: 'Fliegenfischen in der Rauma, Angeln im Lesjaskogsvatnet, im Lågen und an den Bergseen rund um Bjorli.', alt: 'Fliegenfischen in einem Bergfluss bei Bjorli an einem Sommertag' },
        { title: 'Familienaktivitäten', desc: 'Pumptrack, Angeln am Wasser, kurze Bergwanderungen und Hofbesuche in Lesja.', alt: 'Familie trifft Tiere in grüner Sommerlandschaft bei Bjorli' },
        { title: 'Hofbesuche', desc: 'Lokale Höfe in Lesja mit Hofleben, Tieren, regionaler Küche und Kulturlandschaft nahe Bjorli.', alt: 'Kulturlandschaft in Lesja nahe Bjorli' },
        { title: 'Sagelva Wasserkraftzentrum', desc: '300 Jahre Wasserkraft, lokale Geschichte und lebendige Vermittlung in Lesja.', alt: 'Sagelva Wasserkraftzentrum in Lesja' },
        { title: 'Wasserfälle und Moschusochsen', desc: 'Mardalsfossen im Mardøla — einer der hohen Wasserfälle Europas — und geführte Moschus-Safaris im Dovrefjell.', alt: 'Mardalsfossen und Moschusochsen im Dovrefjell — Natur in der Region um Bjorli' },
        { title: 'Tagesausflüge gen Westen', desc: 'Romsdalen, Raumabanen, Trollstigen, die Geiranger-Region und Åndalsnes in Reichweite.', alt: 'Raumabanen entlang des Flusstals — regionaler Tagesausflug ab Bjorli' },
        { title: 'Klettern und Bouldern', desc: 'Sportklettern, Bouldern, Via Ferrata und alpine Touren an den steilen Felswänden im Romsdalen.', alt: 'Steile Felswände im Romsdalen — Klettern und Bouldern' },
      ],
    },
    biking: {
      eyebrow: 'Radfahren und Familie',
      title: 'Radfahren, Pumptrack und aktive Familientage',
      body: 'Ein Pumptrack im Ort, Pfade in den Bergen und Schotterstraßen entlang des Lesjaskogsvatnet sorgen für abwechslungsreiche Tage auf dem Rad. Drehen Sie eine Runde auf dem Pumptrack, folgen Sie dem See auf Schotter, gehen Sie eine kurze Bergtour oder machen Sie Pause am Fluss — die kurzen Wege zwischen Hütte, Ort und Natur machen es leicht, den Tag selbst zu gestalten.',
      cta: 'Radfahren und Aktivitäten ansehen',
    },
    hiking: {
      eyebrow: 'Wandern und Natur',
      title: 'Bergtouren direkt aus dem Ort',
      body: 'Bjorli liegt hoch und offen, sodass Sie schnell in den Bergen sind, ohne lange Anstiege. Kurze Wege vom Ort, Familientage im Reinheimen, längere Tagestouren ins Dovrefjell und in die Romsdalsalpene — offene Hochebenen, Bergseen und Blick Richtung Romsdalen.',
      subcards: [
        { title: 'Kurze Touren',         desc: 'Leichte Wege vom Ort und den Hütten — ideal für einen Abendspaziergang in den hellen Sommernächten.' },
        { title: 'Familienwanderungen',  desc: 'Offene Pfade und übersichtliches Gelände, geeignet für Kinder und Großeltern.' },
        { title: 'Längere Bergtouren',   desc: 'Tagestouren ins Reinheimen, Dovrefjell und in die Romsdalsalpene — offenes Hochgebirge und weite Ausblicke.' },
        { title: 'Wasser und Aussicht',  desc: 'Bergseen, Flusstäler und Plateaus mit Blick Richtung Romsdalen und Fjorde im Westen.' },
      ],
      ctaPrimary: 'Wanderungen ansehen',
      ctaSecondary: 'Kurze Touren in Rauma und Lesja',
    },
    fishing: {
      eyebrow: 'Angeln, Fluss und Bergseen',
      title: 'Fliegenfischen in der Rauma, Angeln im Lesjaskogsvatnet und Lågen',
      body: 'Die Rauma ist für das Fliegenfischen bekannt. Lesjaskogsvatnet, der Lågen und die Bergseen rund um Bjorli geben Ihnen den ganzen Sommer über lange Tage am Wasser — vom Familienangeln bis zu engagierten Tagen mit Rute und Wathose.',
      alt: 'Angeln in einem Bergfluss bei Bjorli an einem Sommerabend',
      cta: 'Angelmöglichkeiten ansehen',
    },
    family: {
      eyebrow: 'Familie',
      title: 'Familientage mit Pumptrack, Wasser und Bergen',
      body: 'Bjorli ist mit Kindern unkompliziert zu erreichen. Kurze Wege zwischen Hütte, Ort und Natur lassen mehr Zeit draußen — Pumptrack im Ort, Angeln am Bergsee, kurze Wege direkt vor der Tür, Hofbesuche in Lesja und Tagesausflüge mit der Raumabanen nach Åndalsnes.',
      subcards: [
        { title: 'Kurze Bergtouren',     desc: 'Leichte Pfade direkt von Hütte und Ort — passend für kleine Beine und Kinderwagen-Tempo.' },
        { title: 'Radfahren und Pumptrack', desc: 'Pumptrack im Ort, Schotterstraßen und offene Außenbereiche zum Radfahren und freien Spielen.' },
        { title: 'Angeln am Wasser',     desc: 'Bergseen und Flussabschnitte, an denen Kinder in sicherer Umgebung das Angeln probieren können.' },
        { title: 'Hofbesuche',           desc: 'Lokale Höfe in Lesja mit Tieren, regionaler Küche und offener Kulturlandschaft.' },
        { title: 'Tagesausflüge gemeinsam', desc: 'Raumabanen nach Åndalsnes, Mardalsfossen im Mardøla und Moschus-Safari im Dovrefjell.' },
      ],
      cta: 'Familienaktivitäten ansehen',
    },
    basecamp: {
      eyebrow: 'Zwischen Bergen und Fjorden',
      title: 'Wohnen in Bjorli. Tage in der Region verbringen.',
      body: 'Bjorli liegt hoch und offen, mit kurzen Wegen in die Region. Verbringen Sie die Tage mit der Raumabanen hinunter nach Åndalsnes, am Mardalsfossen im Mardøla, auf Moschus-Safari im Dovrefjell, beim Angeln in der Rauma und im Lesjaskogsvatnet sowie auf Touren weiter Richtung Trollstigen, Geiranger und Fjordlandschaft.',
      subcards: [
        { title: 'Bergseen und Fluss',         desc: 'Lesjaskogsvatnet, Aursjøen, Dalsida und die Rauma — Wasser und Angeln direkt bei Bjorli.' },
        { title: 'Wasserfälle und Moschus',    desc: 'Mardalsfossen im Mardøla und geführte Moschus-Safari im Dovrefjell.' },
        { title: 'Romsdalen und Raumabanen',   desc: 'Steile Berge und eine Zugfahrt hinunter nach Åndalsnes — einer der bekanntesten Tagesausflüge ab Bjorli.' },
        { title: 'Fjordlandschaft im Westen',  desc: 'Trollstigen- und Geiranger-Region in Reichweite für Tagesausflüge zu den Fjorden.' },
      ],
      cta: 'Anreise und Tagesausflüge ansehen',
    },
    foodDrink: {
      eyebrow: 'Essen und Treffpunkte',
      title: 'Orte für eine Pause in der Sommerlandschaft',
      body: 'Gastronomie und Treffpunkte im Ort und rund um Bjorli — für eine Pause zwischen den Touren oder einen langen Sommerabend nach einem Tag draußen.',
      alt: 'Innenraum mit Tischen und Laternen — Gastronomie und Treffpunkt in Bjorli',
      cta: 'Essen und Trinken ansehen',
    },
  },

  nl: {
    intro: {
      eyebrow: 'Zomer in Bjorli',
      title: 'Bergen, water en dagtochten naar het westen',
      subtitle:
        'Vanuit Bjorli bereik je eenvoudig wandelingen, fietsen, vliegvissen in de Rauma, Lesjaskogsvatnet, muskusossen op Dovrefjell, de waterval Mardalsfossen in Mardøla en dagtochten in Romsdalen en richting de fjorden.',
      items: [
        { title: 'Bergen en water',  desc: 'Open hooggebergte, de Rauma, Lesjaskogsvatnet en bergmeren direct voor de deur.' },
        { title: 'Actieve dagen',    desc: 'Wandelen, fietsen, vissen, boerderijbezoeken en tochten naar Mardalsfossen en Dovrefjell.' },
        { title: 'Dagen naar het westen', desc: 'Verblijf in Bjorli en breng je dagen door in Romsdalen, op de Raumabanen en richting de fjorden.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Zomer in Bjorli',
      title: 'Dit kun je doen in Bjorli in de zomer',
      readMore: 'Lees meer',
      cards: [
        { title: 'Wandelen', desc: 'Korte paden vanuit het dorp en langere dagtochten in Reinheimen, Dovrefjell en de Romsdalsalpene.', alt: 'Zomerpad met uitzicht over de vallei — wandelen in de bergen bij Bjorli' },
        { title: 'Fietsen en pumptrack', desc: 'Paden, grindwegen en een pumptrack in het dorp — voor beginners en het hele gezin.', alt: 'Fietsen in de bergen bij Bjorli op een zomerdag' },
        { title: 'Vissen', desc: 'Vliegvissen in de Rauma, vissen in Lesjaskogsvatnet, de Lågen en de bergmeren rond Bjorli.', alt: 'Vliegvissen in een bergrivier bij Bjorli op een zomerdag' },
        { title: 'Gezinsactiviteiten', desc: 'Pumptrack, vissen aan het water, korte bergwandelingen en boerderijbezoeken in Lesja.', alt: 'Gezin ontmoet dieren in groen zomerlandschap bij Bjorli' },
        { title: 'Boerderijbezoeken', desc: 'Lokale boerderijen in Lesja met boerderijleven, dieren, lokaal eten en cultuurlandschap bij Bjorli.', alt: 'Cultuurlandschap in Lesja bij Bjorli' },
        { title: 'Sagelva waterkrachtcentrum', desc: '300 jaar waterkracht, lokale geschiedenis en levendige vertelling in Lesja.', alt: 'Sagelva waterkrachtcentrum in Lesja' },
        { title: 'Watervallen en muskusossen', desc: 'Mardalsfossen in Mardøla — een van de hoge watervallen in Europa — en geleide muskussafaris op Dovrefjell.', alt: 'Mardalsfossen en muskusossen op Dovrefjell — natuur in de regio rond Bjorli' },
        { title: 'Dagtochten naar het westen', desc: 'Romsdalen, Raumabanen, Trollstigen, de Geiranger-regio en Åndalsnes binnen bereik.', alt: 'Raumabanen langs het rivierdal — regionale dagtocht vanuit Bjorli' },
        { title: 'Klimmen en boulderen', desc: 'Sportklimmen, boulderen, via ferrata en alpine routes op de steile bergwanden in Romsdalen.', alt: 'Steile bergwanden in Romsdalen — klimmen en boulderen' },
      ],
    },
    biking: {
      eyebrow: 'Fietsen en gezin',
      title: 'Fietsen, pumptrack en actieve gezinsdagen',
      body: 'Een pumptrack in het dorp, paden in de bergen en grindwegen langs Lesjaskogsvatnet zorgen voor afwisselende dagen op de fiets. Rijd een rondje op de pumptrack, volg het meer over grind, maak een korte wandeling of pauzeer bij de rivier — korte afstanden tussen hut, dorp en natuur maken het eenvoudig om de dag zelf in te delen.',
      cta: 'Bekijk fietsen en activiteiten',
    },
    hiking: {
      eyebrow: 'Wandelen en natuur',
      title: 'Bergwandelingen direct vanuit het dorp',
      body: 'Bjorli ligt hoog en open, dus je bent snel in de bergen zonder lange aanloop. Korte paden vanuit het dorp, gezinsdagen in Reinheimen, langere dagtochten in Dovrefjell en de Romsdalsalpene — open vlaktes, bergmeren en uitzicht richting Romsdalen.',
      subcards: [
        { title: 'Korte wandelingen',    desc: 'Lichte paden vanuit het dorp en de hutten — ideaal voor een avondwandeling in de lichte zomernachten.' },
        { title: 'Gezinswandelingen',    desc: 'Open paden en overzichtelijk terrein, geschikt voor kinderen en grootouders.' },
        { title: 'Langere bergtochten',  desc: 'Dagtochten in Reinheimen, Dovrefjell en de Romsdalsalpene — open hooggebergte en weidse uitzichten.' },
        { title: 'Water en uitzicht',    desc: 'Bergmeren, rivierdalen en plateaus met uitzicht richting Romsdalen en de fjorden in het westen.' },
      ],
      ctaPrimary: 'Bekijk wandelingen',
      ctaSecondary: 'Korte tochten in Rauma en Lesja',
    },
    fishing: {
      eyebrow: 'Vissen, rivier en bergmeren',
      title: 'Vliegvissen in de Rauma, vissen in Lesjaskogsvatnet en de Lågen',
      body: 'De Rauma staat bekend om vliegvissen. Lesjaskogsvatnet, de Lågen en de bergmeren rond Bjorli geven je de hele zomer lange dagen aan het water — van gezinsvissen tot toegewijde dagen met hengel en lieslaarzen.',
      alt: 'Vissen in een bergrivier bij Bjorli op een zomeravond',
      cta: 'Bekijk vismogelijkheden',
    },
    family: {
      eyebrow: 'Gezin',
      title: 'Gezinsdagen met pumptrack, water en bergen',
      body: 'Bjorli is eenvoudig te bereizen met kinderen. Korte afstanden tussen hut, dorp en natuur geven meer tijd buiten samen — pumptrack in het dorp, vissen bij het bergmeer, korte paden vanaf de deur, boerderijbezoeken in Lesja en dagtochten met de Raumabanen richting Åndalsnes.',
      subcards: [
        { title: 'Korte bergwandelingen', desc: 'Lichte paden direct vanaf de hut en het dorp — geschikt voor kleine benen en kinderwagentempo.' },
        { title: 'Fietsen en pumptrack',  desc: 'Pumptrack in het dorp, grindwegen en open buitenruimtes voor fietsen en vrij spel.' },
        { title: 'Vissen aan het water',  desc: 'Bergmeren en rivierstukken waar kinderen het vissen kunnen proberen in veilige omgeving.' },
        { title: 'Boerderijbezoeken',     desc: 'Lokale boerderijen in Lesja met dieren, lokaal eten en open cultuurlandschap.' },
        { title: 'Dagtochten samen',      desc: 'Raumabanen richting Åndalsnes, Mardalsfossen in Mardøla en een muskussafari op Dovrefjell.' },
      ],
      cta: 'Bekijk gezinsactiviteiten',
    },
    basecamp: {
      eyebrow: 'Tussen bergen en fjorden',
      title: 'Verblijf in Bjorli. Breng je dagen door in de regio.',
      body: 'Bjorli ligt hoog en open, met korte afstanden naar de regio. Breng je dagen door met de Raumabanen richting Åndalsnes, bij Mardalsfossen in Mardøla, op muskussafari op Dovrefjell, met vissen in de Rauma en Lesjaskogsvatnet, en met tochten verder westwaarts richting Trollstigen, het Geiranger-gebied en het fjordlandschap.',
      subcards: [
        { title: 'Bergmeren en rivier',     desc: 'Lesjaskogsvatnet, Aursjøen, Dalsida en de Rauma — water en vissen vlakbij Bjorli.' },
        { title: 'Watervallen en muskus',   desc: 'Mardalsfossen in Mardøla en geleide muskussafari op Dovrefjell.' },
        { title: 'Romsdalen en Raumabanen', desc: 'Steile bergen en een treinrit naar Åndalsnes — een van de bekendste dagtochten vanuit Bjorli.' },
        { title: 'Fjordlandschap westwaarts', desc: 'Trollstigen- en Geiranger-regio binnen bereik voor dagtochten richting de fjorden.' },
      ],
      cta: 'Bekijk reis en dagtochten',
    },
    foodDrink: {
      eyebrow: 'Eten en ontmoetingsplekken',
      title: 'Plekken om te pauzeren in het zomerlandschap',
      body: 'Horeca en ontmoetingsplekken in het dorp en rond Bjorli — voor een pauze tussen de tochten of een lange zomeravond na een dag buiten.',
      alt: 'Interieur met tafels en lantaarns — eetgelegenheid en ontmoetingsplek in Bjorli',
      cta: 'Bekijk eten en drinken',
    },
  },

  da: {
    intro: {
      eyebrow: 'Sommer i Bjorli',
      title: 'Fjelde, vand og dagsture mod vest',
      subtitle:
        'Fra Bjorli har du nem adgang til vandring, cykling, fluefiskeri i Rauma, Lesjaskogsvatnet, moskusokser på Dovrefjell, vandfaldet Mardalsfossen i Mardøla og dagsture ind i Romsdalen og mod fjordene.',
      items: [
        { title: 'Fjelde og vand',  desc: 'Åbent højfjeld, Rauma, Lesjaskogsvatnet og fjeldsøer lige uden for døren.' },
        { title: 'Aktive dage',     desc: 'Vandring, cykling, fiskeri, gårdbesøg og ture til Mardalsfossen og Dovrefjell.' },
        { title: 'Dage mod vest',   desc: 'Bo i Bjorli og brug dagene i Romsdalen, på Raumabanen og mod fjordene.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Sommer i Bjorli',
      title: 'Dette kan du opleve i Bjorli om sommeren',
      readMore: 'Læs mere',
      cards: [
        { title: 'Vandring', desc: 'Korte stier fra centrum og længere dagsture i Reinheimen, Dovrefjell og Romsdalsalpene.', alt: 'Sommersti med udsigt over dalen — vandring i fjeldet ved Bjorli' },
        { title: 'Cykling og pumptrack', desc: 'Stier, grusveje og en pumptrack i centrum — for begyndere og hele familien.', alt: 'Cykling i fjeldet ved Bjorli en sommerdag' },
        { title: 'Fiskeri', desc: 'Fluefiskeri i Rauma, fiskeri i Lesjaskogsvatnet, Lågen og fjeldsøerne omkring Bjorli.', alt: 'Fluefiskeri i en fjeldå nær Bjorli en sommerdag' },
        { title: 'Familieaktiviteter', desc: 'Pumptrack, fiskeri ved vandet, korte fjeldture og gårdbesøg i Lesja.', alt: 'Familie møder dyr i grønt sommerlandskab ved Bjorli' },
        { title: 'Gårdbesøg', desc: 'Lokale gårde i Lesja med gårdliv, dyr, lokal mad og kulturlandskab nær Bjorli.', alt: 'Kulturlandskab i Lesja nær Bjorli' },
        { title: 'Sagelva vandkraftcenter', desc: '300 års vandkraft, lokalhistorie og levende formidling i Lesja.', alt: 'Sagelva vandkraftcenter i Lesja' },
        { title: 'Vandfald og moskus', desc: 'Mardalsfossen i Mardøla — et af Europas høje vandfald — og guidede moskussafarier på Dovrefjell.', alt: 'Mardalsfossen og moskus på Dovrefjell — natur i regionen omkring Bjorli' },
        { title: 'Dagsture mod vest', desc: 'Romsdalen, Raumabanen, Trollstigen, Geiranger-området og Åndalsnes inden for rækkevidde.', alt: 'Raumabanen langs ådalen — regional dagstur fra Bjorli' },
        { title: 'Klatring og bouldering', desc: 'Sportsklatring, bouldering, via ferrata og alpine ture på de stejle fjeldvægge i Romsdalen.', alt: 'Stejle fjeldvægge i Romsdalen — klatring og bouldering' },
      ],
    },
    biking: {
      eyebrow: 'Cykling og familie',
      title: 'Cykling, pumptrack og aktive familiedage',
      body: 'En pumptrack i centrum, stier i fjeldet og grusveje langs Lesjaskogsvatnet giver varierede dage på cyklen. Tag en runde på pumptracken, følg søen ad grusvej, gå en kort fjeldtur eller hold pause ved åen — korte afstande mellem hytte, centrum og natur gør det nemt at bygge dagen selv.',
      cta: 'Se cykling og aktiviteter',
    },
    hiking: {
      eyebrow: 'Vandring og natur',
      title: 'Fjeldture direkte fra byen',
      body: 'Bjorli ligger højt og åbent, og du er hurtigt ude i fjeldet uden lang tilgang. Korte stier fra centrum, familiedage i Reinheimen, længere dagsture ind i Dovrefjell og Romsdalsalpene — åbne vidder, fjeldsøer og udsigt mod Romsdalen.',
      subcards: [
        { title: 'Korte ture',        desc: 'Lette stier fra centrum og hytterne — fine til en aftentur i de lyse sommernætter.' },
        { title: 'Familieture',       desc: 'Åbne stier og overskueligt terræn, der passer til børn og bedsteforældre.' },
        { title: 'Længere fjeldture', desc: 'Dagsture ind i Reinheimen, Dovrefjell og Romsdalsalpene — åbent højfjeld og vide udsigter.' },
        { title: 'Vand og udsigt',    desc: 'Fjeldsøer, ådale og plateauer med udsigt mod Romsdalen og fjordene mod vest.' },
      ],
      ctaPrimary: 'Se vandreture',
      ctaSecondary: 'Korte ture i Rauma og Lesja',
    },
    fishing: {
      eyebrow: 'Fiskeri, å og fjeldsøer',
      title: 'Fluefiskeri i Rauma, fiskeri i Lesjaskogsvatnet og Lågen',
      body: 'Rauma er kendt for fluefiskeri. Lesjaskogsvatnet, Lågen og fjeldsøerne omkring Bjorli giver lange dage ved vandet hele sommeren — fra familiefiskeri til mere dedikerede dage med stang og waders.',
      alt: 'Fiskeri i en fjeldå nær Bjorli en sommeraften',
      cta: 'Se fiskemuligheder',
    },
    family: {
      eyebrow: 'Familie',
      title: 'Familiedage med pumptrack, vand og fjeld',
      body: 'Bjorli er nemt at rejse til med børn. Korte afstande mellem hytte, centrum og natur giver mere tid ude sammen — pumptrack i centrum, fiskeri ved fjeldsøen, korte stier fra døren, gårdbesøg i Lesja og dagsture med Raumabanen mod Åndalsnes.',
      subcards: [
        { title: 'Korte fjeldture',   desc: 'Lette stier direkte fra hytten og centrum — passer til små ben og barnevognstempo.' },
        { title: 'Cykling og pumptrack', desc: 'Pumptrack i centrum, grusveje og åbne udeområder til cykling og fri leg.' },
        { title: 'Fiskeri ved vandet', desc: 'Fjeldsøer og åstrækninger, hvor børn kan prøve at fiske i trygge omgivelser.' },
        { title: 'Gårdbesøg',         desc: 'Lokale gårde i Lesja med dyr, lokal mad og åbent kulturlandskab.' },
        { title: 'Dagsture sammen',   desc: 'Raumabanen mod Åndalsnes, Mardalsfossen i Mardøla og moskussafari på Dovrefjell.' },
      ],
      cta: 'Se familieaktiviteter',
    },
    basecamp: {
      eyebrow: 'Mellem fjelde og fjorde',
      title: 'Bo i Bjorli. Brug dagene ude i regionen.',
      body: 'Bjorli ligger højt og åbent med korte afstande ud i regionen. Brug dagene på Raumabanen ned mod Åndalsnes, Mardalsfossen i Mardøla, moskussafari på Dovrefjell, fiskeri i Rauma og Lesjaskogsvatnet samt ture videre mod Trollstigen, Geiranger-området og fjordlandskabet.',
      subcards: [
        { title: 'Fjeldsøer og å',           desc: 'Lesjaskogsvatnet, Aursjøen, Dalsida og Rauma — vand og fiskeri lige ved Bjorli.' },
        { title: 'Vandfald og moskus',       desc: 'Mardalsfossen i Mardøla og guidet moskussafari på Dovrefjell.' },
        { title: 'Romsdalen og Raumabanen',  desc: 'Stejle fjelde og en togtur ned mod Åndalsnes — en af de mest kendte dagsture fra Bjorli.' },
        { title: 'Fjordlandskab mod vest',   desc: 'Trollstigen- og Geiranger-området inden for rækkevidde som dagstur mod fjordene.' },
      ],
      cta: 'Se rejse og dagsture',
    },
    foodDrink: {
      eyebrow: 'Mad og mødesteder',
      title: 'Steder at holde pause i sommerlandskabet',
      body: 'Servering og mødesteder i centrum og omkring Bjorli — til en pause mellem turene eller en lang sommeraften efter en dag ude.',
      alt: 'Interiør med borde og lanterner — servering og mødested i Bjorli',
      cta: 'Se mad og drikke',
    },
  },

  sv: {
    intro: {
      eyebrow: 'Sommar i Bjorli',
      title: 'Fjäll, vatten och dagsturer västerut',
      subtitle:
        'Från Bjorli har du nära till vandring, cykling, flugfiske i Rauma, Lesjaskogsvatnet, myskoxar på Dovrefjell, vattenfallet Mardalsfossen i Mardøla och dagsturer in i Romsdalen och mot fjordarna.',
      items: [
        { title: 'Fjäll och vatten', desc: 'Öppet högfjäll, Rauma, Lesjaskogsvatnet och fjällsjöar precis utanför dörren.' },
        { title: 'Aktiva dagar',     desc: 'Vandring, cykling, fiske, gårdsbesök och turer till Mardalsfossen och Dovrefjell.' },
        { title: 'Dagar västerut',   desc: 'Bo i Bjorli och tillbringa dagarna i Romsdalen, på Raumabanen och mot fjordarna.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Sommar i Bjorli',
      title: 'Det här kan du göra i Bjorli på sommaren',
      readMore: 'Läs mer',
      cards: [
        { title: 'Vandring', desc: 'Korta stigar från centrum och längre dagsturer i Reinheimen, Dovrefjell och Romsdalsalpene.', alt: 'Sommarstig med utsikt över dalen — vandring i fjället vid Bjorli' },
        { title: 'Cykling och pumptrack', desc: 'Stigar, grusvägar och en pumptrack i centrum — för nybörjare och hela familjen.', alt: 'Cykling i fjället vid Bjorli en sommardag' },
        { title: 'Fiske', desc: 'Flugfiske i Rauma, fiske i Lesjaskogsvatnet, Lågen och fjällsjöarna runt Bjorli.', alt: 'Flugfiske i en fjällälv nära Bjorli en sommardag' },
        { title: 'Familjeaktiviteter', desc: 'Pumptrack, fiske vid vattnet, korta fjällturer och gårdsbesök i Lesja.', alt: 'Familj möter djur i grönt sommarlandskap vid Bjorli' },
        { title: 'Gårdsbesök', desc: 'Lokala gårdar i Lesja med gårdsliv, djur, lokal mat och kulturlandskap nära Bjorli.', alt: 'Kulturlandskap i Lesja nära Bjorli' },
        { title: 'Sagelva vattenkraftcenter', desc: '300 år av vattenkraft, lokalhistoria och levande förmedling i Lesja.', alt: 'Sagelva vattenkraftcenter i Lesja' },
        { title: 'Vattenfall och myskoxar', desc: 'Mardalsfossen i Mardøla — ett av Europas höga vattenfall — och guidade myskoxsafarier på Dovrefjell.', alt: 'Mardalsfossen och myskoxar på Dovrefjell — natur i regionen runt Bjorli' },
        { title: 'Dagsturer västerut', desc: 'Romsdalen, Raumabanen, Trollstigen, Geiranger-området och Åndalsnes inom räckhåll.', alt: 'Raumabanen längs floddalen — regional dagstur från Bjorli' },
        { title: 'Klättring och bouldering', desc: 'Sportklättring, bouldering, via ferrata och alpina turer på de branta fjällväggarna i Romsdalen.', alt: 'Branta fjällväggar i Romsdalen — klättring och bouldering' },
      ],
    },
    biking: {
      eyebrow: 'Cykling och familj',
      title: 'Cykling, pumptrack och aktiva familjedagar',
      body: 'En pumptrack i centrum, stigar i fjället och grusvägar längs Lesjaskogsvatnet ger varierade dagar på cykel. Ta ett varv på pumptracken, följ sjön på grus, gå en kort fjälltur eller pausa vid älven — korta avstånd mellan stuga, centrum och natur gör det enkelt att bygga dagen själv.',
      cta: 'Se cykling och aktiviteter',
    },
    hiking: {
      eyebrow: 'Vandring och natur',
      title: 'Fjällturer direkt från byn',
      body: 'Bjorli ligger högt och öppet, och du är snabbt ute i fjället utan lång inmarsch. Korta stigar från centrum, familjedagar i Reinheimen, längre dagsturer in i Dovrefjell och Romsdalsalpene — öppna vidder, fjällsjöar och utsikt mot Romsdalen.',
      subcards: [
        { title: 'Korta turer',         desc: 'Lätta stigar från centrum och stugorna — fina för en kvällstur i de ljusa sommarnätterna.' },
        { title: 'Familjeturer',        desc: 'Öppna stigar och överskådlig terräng som passar barn och morföräldrar.' },
        { title: 'Längre fjällturer',   desc: 'Dagsturer in i Reinheimen, Dovrefjell och Romsdalsalpene — öppet högfjäll och vida utsikter.' },
        { title: 'Vatten och utsikt',   desc: 'Fjällsjöar, älvdalar och platåer med utsikt mot Romsdalen och fjordarna västerut.' },
      ],
      ctaPrimary: 'Se vandringar',
      ctaSecondary: 'Korta turer i Rauma och Lesja',
    },
    fishing: {
      eyebrow: 'Fiske, älv och fjällsjöar',
      title: 'Flugfiske i Rauma, fiske i Lesjaskogsvatnet och Lågen',
      body: 'Rauma är känt för flugfiske. Lesjaskogsvatnet, Lågen och fjällsjöarna runt Bjorli ger långa dagar vid vattnet hela sommaren — från familjefiske till dedikerade dagar med spö och vadarbyxor.',
      alt: 'Fiske i en fjällälv nära Bjorli en sommarkväll',
      cta: 'Se fiskemöjligheter',
    },
    family: {
      eyebrow: 'Familj',
      title: 'Familjedagar med pumptrack, vatten och fjäll',
      body: 'Bjorli är enkelt att resa till med barn. Korta avstånd mellan stuga, centrum och natur ger mer tid ute tillsammans — pumptrack i centrum, fiske vid fjällsjön, korta stigar från dörren, gårdsbesök i Lesja och dagsturer med Raumabanen mot Åndalsnes.',
      subcards: [
        { title: 'Korta fjällturer',  desc: 'Lätta stigar direkt från stugan och centrum — passar små ben och barnvagnstempo.' },
        { title: 'Cykling och pumptrack', desc: 'Pumptrack i centrum, grusvägar och öppna uteområden för cykling och fri lek.' },
        { title: 'Fiske vid vattnet', desc: 'Fjällsjöar och älvpartier där barnen kan prova på fiske i trygga miljöer.' },
        { title: 'Gårdsbesök',        desc: 'Lokala gårdar i Lesja med djur, lokal mat och öppet kulturlandskap.' },
        { title: 'Dagsturer tillsammans', desc: 'Raumabanen mot Åndalsnes, Mardalsfossen i Mardøla och en myskoxsafari på Dovrefjell.' },
      ],
      cta: 'Se familjeaktiviteter',
    },
    basecamp: {
      eyebrow: 'Mellan fjäll och fjordar',
      title: 'Bo i Bjorli. Använd dagarna ute i regionen.',
      body: 'Bjorli ligger högt och öppet med nära avstånd ut i regionen. Använd dagarna till Raumabanen ner mot Åndalsnes, Mardalsfossen i Mardøla, myskoxsafari på Dovrefjell, fiske i Rauma och Lesjaskogsvatnet samt turer vidare västerut mot Trollstigen, Geiranger-området och fjordlandskapet.',
      subcards: [
        { title: 'Fjällsjöar och älv',       desc: 'Lesjaskogsvatnet, Aursjøen, Dalsida och Rauma — vatten och fiske precis vid Bjorli.' },
        { title: 'Vattenfall och myskoxar',  desc: 'Mardalsfossen i Mardøla och guidad myskoxsafari på Dovrefjell.' },
        { title: 'Romsdalen och Raumabanen', desc: 'Branta fjäll och en tågresa ner mot Åndalsnes — en av de mest kända dagsturerna från Bjorli.' },
        { title: 'Fjordlandskap västerut',   desc: 'Trollstigen- och Geiranger-området inom räckhåll som dagstur mot fjordarna.' },
      ],
      cta: 'Se resa och dagsturer',
    },
    foodDrink: {
      eyebrow: 'Mat och mötesplatser',
      title: 'Platser att pausa på i sommarlandskapet',
      body: 'Servering och mötesplatser i centrum och runt Bjorli — för en paus mellan turerna eller en lång sommarkväll efter en dag ute.',
      alt: 'Interiör med bord och lyktor — servering och mötesplats i Bjorli',
      cta: 'Se mat och dryck',
    },
  },
};
