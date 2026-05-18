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
 * Lesjaskogsvannet, Aursjøen, Dalsida, Sagelva, Vetlegrenda, Pumptrack)
 * are kept verbatim across locales.
 */

export interface SummerHomepageCopy {
  intro: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; desc: string }[]; // 3
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
      title: 'Basecamp for fjell, fjord og ville naturopplevelser',
      subtitle:
        'Bjorli ligger høyt og åpent mellom Romsdalen, Dovrefjell og fjordlandskapet vestover — et naturlig utgangspunkt for fjellturer, fiske, fossefall og dagsturer ut i regionen.',
      items: [
        { title: 'Fjell og vann',     desc: 'Åpent høyfjell, Rauma, Lesjaskogsvatnet og fjellvann rett utenfor døra.' },
        { title: 'Aktive dager',      desc: 'Fottur, sykkel, fiske, familiedager og turer til Mardøla og Dovrefjell.' },
        { title: 'Basecamp vestover', desc: 'Bo på Bjorli og bruk dagene på dagsturer mot Romsdalen og fjordene.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Sommer på Bjorli',
      title: 'Dette kan du gjøre på Bjorli om sommeren',
      readMore: 'Les mer',
      cards: [
        { title: 'Fotturer', desc: 'Korte rusleturer og lengre dagsturer i åpent høyfjell — rett utenfor døra.', alt: 'Sommersti og utsikt over dalen — fottur i fjellet ved Bjorli' },
        { title: 'Sykkel og pumptrack', desc: 'Stier, grusveier og en pumptrack i sentrum — for nybegynnere og hele familien.', alt: 'Sykling i fjellet ved Bjorli en sommerdag' },
        { title: 'Fiske', desc: 'Fluefiske i Rauma, fiske i Lesjaskogsvatnet og dager ved fjellvannene rundt Bjorli.', alt: 'Fluefiske i en fjellelv nær Bjorli en stille sommerdag' },
        { title: 'Familieaktiviteter', desc: 'Trygge, romslige opplevelser i lavt tempo — passer for både små og store.', alt: 'Familie møter dyr i grønt sommerlandskap ved Bjorli' },
        { title: 'Gardsbesøk', desc: 'Besøk lokale gårder i Lesja — gårdsliv, dyr, lokal mat og kulturlandskap nær Bjorli.', alt: 'Kulturlandskap i Lesja nær Bjorli' },
        { title: 'Sagelva vasskraftsenter', desc: 'Opplev 300 år med vasskraft, lokalhistorie og levende formidling i Lesja.', alt: 'Sagelva vasskraftsenter i Lesja' },
        { title: 'Fossefall og moskus', desc: 'Mardalsfossen i Mardøla og guidede moskussafarier på Dovrefjell — to av regionens store naturopplevelser.', alt: 'Mardalsfossen og moskus på Dovrefjell — naturopplevelser i regionen rundt Bjorli' },
        { title: 'Dagsturer vestover', desc: 'Romsdalen, Raumabanen, Trollstigen, Geirangerområdet og Åndalsnes — fjordlandskap innen rekkevidde.', alt: 'Raumabanen langs elvedalen — regional dagstur fra Bjorli' },
        { title: 'Klatring og buldring', desc: 'Sportsklatring, buldring, via ferrata og alpine opplevelser i Romsdalen. Bjorli som basecamp mellom fjell, elv og fjord.', alt: 'Dramatiske granittvegger i Romsdalen — klatring og buldring' },
      ],
    },
    biking: {
      eyebrow: 'Sykkel og familie',
      title: 'Sykkel, pumptrack og aktive familiedager',
      body: 'Stier, grusveier og en pumptrack i sentrum gir varierte dager på sykkel for hele familien. Kombiner en runde på pumptracken med en sykkeltur langs Lesjaskogsvatnet, en kort stitur i fjellet eller en pause ved elva — kort vei mellom hytte, sentrum og natur gjør det enkelt å bygge dagen selv.',
      cta: 'Se sykkel og aktiviteter',
    },
    hiking: {
      eyebrow: 'Fottur og natur',
      title: 'Fjellturer rett fra bygda',
      body: 'Bjorli ligger høyt og åpent, så du er raskt ute i fjellet uten lang innmarsj. Gå korte stier fra sentrum, ta en familiedag i Reinheimen, eller legg en lengre dagstur inn i Romsdalsalpene og Dovrefjell — åpne vidder, fjellvann og utsikt mot Romsdalen vestover.',
      subcards: [
        { title: 'Korte turer',       desc: 'Lette stier fra sentrum og hyttene — fine for en pause eller en kveldstur i lyse sommernetter.' },
        { title: 'Familieturer',      desc: 'Oversiktlige stier og åpent terreng som passer både for barn og bestemødre.' },
        { title: 'Lengre fjellturer', desc: 'Dagsturer inn i Reinheimen, Dovrefjell og Romsdalsalpene — åpent høyfjell og lange utsikter.' },
        { title: 'Vann og utsikt',    desc: 'Fjellvann, elvedaler og platåer med utsikt mot Romsdalen og fjordene vestover.' },
      ],
      ctaPrimary: 'Se fotturer',
      ctaSecondary: 'Snarturer i Rauma og Lesja',
    },
    fishing: {
      eyebrow: 'Fiske, elv og fjellvann',
      title: 'Fluefiske i Rauma og dager ved Lesjaskogsvatnet',
      body: 'Rauma er kjent for fluefiske, og Lesjaskogsvatnet og fjellvannene rundt Bjorli gir lange dager ved vannet gjennom hele sommeren. Klart fjellvann, åpent landskap og lyse kvelder — fra rolig familiefiske til mer dedikerte dager med stang og vader.',
      alt: 'Fiske i en fjellelv nær Bjorli en stille sommerkveld',
      cta: 'Se fiskemuligheter',
    },
    family: {
      eyebrow: 'Familie',
      title: 'Familiedager med fjell, sykkel og vann',
      body: 'Bjorli er enkelt å reise til med barn. Korte avstander mellom hytte, sentrum og natur, åpent landskap rundt deg og lite kø gir mer tid til å være ute sammen — sykkel og pumptrack, fiske ved fjellvannet, korte fjellturer og rolige kvelder ved elva.',
      subcards: [
        { title: 'Korte fjellturer', desc: 'Lette stier rett fra hytta og sentrum — passer for små bein og barnevogn-tempo.' },
        { title: 'Sykkel og pumptrack', desc: 'Pumptrack i sentrum, grusveier og åpne uteområder for sykling og fri lek.' },
        { title: 'Fiske ved vannet',  desc: 'Fjellvann og elvepartier der barna kan prøve seg på fiske i trygge omgivelser.' },
        { title: 'Uteområder',       desc: 'Plener, badeplasser og samlingspunkter der dagene faller naturlig på plass.' },
        { title: 'Dagsturer sammen', desc: 'Raumabanen, Mardøla og guidet moskussafari på Dovrefjell — store opplevelser i rolig tempo.' },
      ],
      cta: 'Se familieaktiviteter',
    },
    basecamp: {
      eyebrow: 'Basecamp mellom fjell og fjord',
      title: 'Bo på Bjorli. Bruk dagene vestover.',
      body: 'Bjorli er en fjellbase med god plass og kort vei ut i regionen. Bo høyt og åpent, og bruk dagene på Raumabanen ned mot Åndalsnes, Mardalsfossen i Mardøla, moskussafari på Dovrefjell, fiske i Rauma og Lesjaskogsvatnet, og turer videre vestover mot Trollstigen, Geirangerområdet og fjordlandskapet.',
      subcards: [
        { title: 'Fjellvann og elv',         desc: 'Lesjaskogsvatnet, Aursjøen, Dalsida og Rauma — vann og fiske rett ved Bjorli.' },
        { title: 'Fossefall og moskus',      desc: 'Mardalsfossen i Mardøla og moskus på Dovrefjell — to av regionens store naturopplevelser.' },
        { title: 'Romsdalen og Raumabanen',  desc: 'Bratte fjell og togtur ned mot Åndalsnes — en av de mest kjente dagsturene fra Bjorli.' },
        { title: 'Fjordlandskap vestover',   desc: 'Trollstigen- og Geirangerområdet innen rekkevidde for dagsturer mot fjordene.' },
      ],
      cta: 'Se reise og dagsturer',
    },
    foodDrink: {
      eyebrow: 'Mat og møteplasser',
      title: 'Steder å pause i sommerlandskapet',
      body: 'Servering og rolige møteplasser i sentrum og rundt Bjorli — perfekt for en pause mellom turene eller en lang sommerkveld etter en dag ute.',
      alt: 'Interiør med bord og lykter — servering og møteplass på Bjorli',
      cta: 'Se mat og drikke',
    },
  },

  en: {
    intro: {
      eyebrow: 'Summer in Bjorli',
      title: 'A calm basecamp between mountains and fjords',
      subtitle:
        'Bjorli sits between the fjords, the national parks and some of Norway’s best-known landscapes — with plenty of space and a quiet pace.',
      items: [
        { title: 'Mountain calm', desc: 'Plenty of space, clean air and a quieter mountain experience.' },
        { title: 'Active days',   desc: 'Trails, cycling, fishing, hikes and family-friendly experiences.' },
        { title: 'Basecamp',      desc: 'Stay in Bjorli and spend your days between mountains, valleys and fjord landscapes.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Summer in Bjorli',
      title: 'What you can do in Bjorli in summer',
      readMore: 'Read more',
      cards: [
        { title: 'Hiking', desc: 'Short walks and longer day hikes in open high mountain terrain — right outside the door.', alt: 'Summer trail and valley view — hiking in the mountains near Bjorli' },
        { title: 'Cycling and pumptrack', desc: 'Trails, gravel roads and a pumptrack in the village — for beginners and the whole family.', alt: 'Cycling in the mountains near Bjorli on a summer day' },
        { title: 'Fishing', desc: 'Fly fishing in Rauma, river fishing and quiet days by the mountain lakes around Bjorli.', alt: 'Fly fishing in a mountain river near Bjorli on a quiet summer day' },
        { title: 'Family activities', desc: 'Safe, spacious experiences at a slow pace — for both small and tall.', alt: 'Family meeting animals in a green summer landscape near Bjorli' },
        { title: 'Farm visits', desc: 'Visit local farms in Lesja — farm life, animals, local food and cultural landscape near Bjorli.', alt: 'Cultural landscape in Lesja near Bjorli' },
        { title: 'Sagelva hydropower centre', desc: 'Discover 300 years of hydropower, local history and living storytelling in Lesja.', alt: 'Sagelva hydropower centre in Lesja' },
        { title: 'Nature and views', desc: 'Open plateaus, mountain ridges and quiet summer pastures in three national parks nearby.', alt: 'Open summer landscape near Bjorli' },
        { title: 'Day trips from Bjorli', desc: 'Romsdalen, Trollstigen, the Geiranger area and Åndalsnes within a short drive or train ride.', alt: 'Raumabanen along the river valley — a regional day trip from Bjorli' },
        { title: 'Climbing and bouldering', desc: 'Sport climbing, bouldering, via ferrata and alpine experiences in Romsdalen. Bjorli as a basecamp between mountains, river and fjord.', alt: 'Dramatic granite walls in Romsdalen — climbing and bouldering' },
      ],
    },
    biking: {
      eyebrow: 'Cycling and family',
      title: 'Cycling, play and active family days',
      body: 'Bjorli is an easy place to be active together as a family. Calm trails, gravel roads and a pumptrack in the village give short, manageable days on the bike — great for beginners and children trying it out. Pack the bike, ride a lap on the pumptrack and combine it with a short hike or a break by the water.',
      cta: 'See cycling and activities',
    },
    hiking: {
      eyebrow: 'Hiking and nature',
      title: 'Walks straight from the mountain village',
      body: 'Bjorli sits high and open, so you are out in the mountains quickly without a long approach. Choose a short stroll from the village, a family-friendly day hike, or go deeper into Reinheimen and Romsdalsalpene. A calm starting point for summer days in the Norwegian high mountains.',
      subcards: [
        { title: 'Short walks',     desc: 'Easy walks from the village and cabins — perfect for a break or a quiet evening.' },
        { title: 'Family hikes',    desc: 'Clear trails and open terrain suited to children and grandparents.' },
        { title: 'Longer mountain hikes', desc: 'Day hikes into Reinheimen, Dovrefjell and Romsdalsalpene for those who want to go further.' },
        { title: 'Views and nature', desc: 'Open plateaus, mountain ridges and quiet summer pastures — classic Norwegian high country.' },
      ],
      ctaPrimary: 'See hikes',
      ctaSecondary: 'Short hikes in Rauma and Lesja',
    },
    fishing: {
      eyebrow: 'Fishing and quiet days',
      title: 'Fly fishing, river fishing and mountain lakes',
      body: 'Rauma, Lågen and the mountain lakes around Bjorli offer good fishing through the whole summer. A calm pace, clean nature and long bright evenings by the water.',
      alt: 'Fishing in a mountain river near Bjorli on a quiet summer evening',
      cta: 'See fishing options',
    },
    family: {
      eyebrow: 'Family',
      title: 'Easy summer with children',
      body: 'Bjorli is an easy place to travel with children. Short distances between cabin, village and nature, open landscape around you and few queues — you avoid the dense city and tourist pressure, and get more time to be outside together.',
      subcards: [
        { title: 'Short walks',  desc: 'Easy trails right from the cabin and village — suited to small legs and stroller pace.' },
        { title: 'Cycling and play', desc: 'Pumptrack, gravel roads and open outdoor areas for cycling and free play.' },
        { title: 'Fishing',      desc: 'Calm mountain lakes and river stretches where children can try fishing.' },
        { title: 'Outdoor areas', desc: 'Lawns, swimming spots and meeting points where the day falls naturally into place.' },
        { title: 'Quiet days',   desc: 'Plenty of space and few people — a holiday without dense city or tourist pressure.' },
      ],
      cta: 'See family activities',
    },
    basecamp: {
      eyebrow: 'Basecamp between mountains and fjords',
      title: 'Stay in Bjorli. Experience more of the region.',
      body: 'Bjorli is a calm mountain base with plenty of space — stay high and open, and spend your days on trips out into valleys, mountains and fjord landscapes. Reinheimen, Tafjordfjella, Dovrefjell and Romsdalen surround you, and Romsdalsalpene, Raumabanen, the Trollstigen area, the Geiranger area and Åndalsnes are within reach for day trips.',
      subcards: [
        { title: 'Valleys and mountain lakes', desc: 'Lesjaskogsvannet, Aursjøen and Dalsida — calm landscapes right by Bjorli.' },
        { title: 'National parks',             desc: 'Reinheimen, Tafjordfjella and Dovrefjell surround the destination.' },
        { title: 'Romsdalen and Raumabanen',   desc: 'Dramatic mountains and a train ride down to Åndalsnes — within reach for day trips.' },
        { title: 'Fjord and coast',            desc: 'The Trollstigen and Geiranger areas within reach for day trips towards the fjords.' },
      ],
      cta: 'See travel and day trips',
    },
    foodDrink: {
      eyebrow: 'Food and meeting places',
      title: 'Places to pause in the summer landscape',
      body: 'Restaurants and calm meeting places in the village and around Bjorli — perfect for a break between trips or a long summer evening after a day outside.',
      alt: 'Interior with tables and lanterns — dining and meeting place in Bjorli',
      cta: 'See food and drink',
    },
  },

  de: {
    intro: {
      eyebrow: 'Sommer in Bjorli',
      title: 'Ein ruhiges Basislager zwischen Bergen und Fjorden',
      subtitle:
        'Bjorli liegt zwischen den Fjorden, den Nationalparks und einigen der bekanntesten Landschaften Norwegens — mit viel Platz und einem ruhigen Tempo.',
      items: [
        { title: 'Bergruhe',     desc: 'Viel Platz, saubere Luft und ein ruhigeres Bergerlebnis.' },
        { title: 'Aktive Tage',  desc: 'Pfade, Radfahren, Angeln, Wandern und familienfreundliche Erlebnisse.' },
        { title: 'Basislager',   desc: 'Wohnen Sie in Bjorli und verbringen Sie die Tage zwischen Bergen, Tälern und Fjordlandschaft.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Sommer in Bjorli',
      title: 'Das können Sie im Sommer in Bjorli unternehmen',
      readMore: 'Mehr erfahren',
      cards: [
        { title: 'Wandern', desc: 'Kurze Spaziergänge und längere Tageswanderungen im offenen Hochgebirge — direkt vor der Tür.', alt: 'Sommerpfad mit Blick ins Tal — Wandern in den Bergen bei Bjorli' },
        { title: 'Radfahren und Pumptrack', desc: 'Pfade, Schotterstraßen und ein Pumptrack im Ort — für Anfänger und die ganze Familie.', alt: 'Radfahren in den Bergen bei Bjorli an einem Sommertag' },
        { title: 'Angeln', desc: 'Fliegenfischen in der Rauma, Flussangeln und ruhige Tage an den Bergseen rund um Bjorli.', alt: 'Fliegenfischen in einem Bergfluss bei Bjorli an einem stillen Sommertag' },
        { title: 'Familienaktivitäten', desc: 'Sichere, weiträumige Erlebnisse in ruhigem Tempo — für Klein und Groß.', alt: 'Familie trifft Tiere in grüner Sommerlandschaft bei Bjorli' },
        { title: 'Hofbesuche', desc: 'Besuchen Sie lokale Höfe in Lesja — Hofleben, Tiere, lokale Küche und Kulturlandschaft nahe Bjorli.', alt: 'Kulturlandschaft in Lesja nahe Bjorli' },
        { title: 'Sagelva Wasserkraftzentrum', desc: 'Erleben Sie 300 Jahre Wasserkraft, lokale Geschichte und lebendige Vermittlung in Lesja.', alt: 'Sagelva Wasserkraftzentrum in Lesja' },
        { title: 'Natur und Aussicht', desc: 'Offene Hochebenen, Bergplateaus und stille Almtäler in drei nahen Nationalparks.', alt: 'Offene Sommerlandschaft bei Bjorli' },
        { title: 'Tagesausflüge ab Bjorli', desc: 'Romsdalen, Trollstigen, die Geiranger-Region und Åndalsnes in kurzer Auto- oder Zugfahrt.', alt: 'Raumabanen entlang des Flusstals — regionaler Tagesausflug ab Bjorli' },
        { title: 'Klettern und Bouldern', desc: 'Sportklettern, Bouldern, Via Ferrata und alpine Erlebnisse im Romsdalen. Bjorli als Basislager zwischen Bergen, Fluss und Fjord.', alt: 'Dramatische Granitwände im Romsdalen — Klettern und Bouldern' },
      ],
    },
    biking: {
      eyebrow: 'Radfahren und Familie',
      title: 'Radfahren, Spiel und aktive Familientage',
      body: 'Bjorli ist ein einfacher Ort, um als Familie gemeinsam aktiv zu sein. Ruhige Pfade, Schotterstraßen und ein Pumptrack im Ort sorgen für kurze, überschaubare Tage auf dem Rad — ideal für Anfänger und Kinder, die es ausprobieren möchten. Packen Sie das Rad ein, drehen Sie eine Runde auf dem Pumptrack und kombinieren Sie das mit einer kurzen Bergtour oder einer Pause am Wasser.',
      cta: 'Radfahren und Aktivitäten ansehen',
    },
    hiking: {
      eyebrow: 'Wandern und Natur',
      title: 'Touren direkt aus dem Bergdorf',
      body: 'Bjorli liegt hoch und offen, sodass Sie schnell in den Bergen sind, ohne lange Anstiege. Wählen Sie einen kurzen Spaziergang am Ort, eine familienfreundliche Tageswanderung oder gehen Sie tiefer ins Reinheimen und in die Romsdalsalpene. Ein ruhiger Ausgangspunkt für Sommertage im norwegischen Hochgebirge.',
      subcards: [
        { title: 'Kurze Touren',         desc: 'Leichte Spaziergänge vom Ort und den Hütten — ideal für eine Pause oder einen ruhigen Abend.' },
        { title: 'Familienwanderungen',  desc: 'Übersichtliche Pfade und offenes Gelände, geeignet für Kinder und Großeltern.' },
        { title: 'Längere Bergtouren',   desc: 'Tagestouren ins Reinheimen, Dovrefjell und in die Romsdalsalpene für alle, die weiter gehen möchten.' },
        { title: 'Aussicht und Natur',   desc: 'Offene Hochebenen, Bergplateaus und stille Almtäler — typisches norwegisches Hochgebirge.' },
      ],
      ctaPrimary: 'Wanderungen ansehen',
      ctaSecondary: 'Kurze Touren in Rauma und Lesja',
    },
    fishing: {
      eyebrow: 'Angeln und ruhige Tage',
      title: 'Fliegenfischen, Flussangeln und Bergseen',
      body: 'Die Rauma, der Lågen und die Bergseen rund um Bjorli bieten den ganzen Sommer über gute Angelbedingungen. Ein ruhiges Tempo, saubere Natur und lange helle Abende am Wasser.',
      alt: 'Angeln in einem Bergfluss bei Bjorli an einem stillen Sommerabend',
      cta: 'Angelmöglichkeiten ansehen',
    },
    family: {
      eyebrow: 'Familie',
      title: 'Einfacher Sommer mit Kindern',
      body: 'Bjorli ist ein einfacher Ort, um mit Kindern zu reisen. Kurze Wege zwischen Hütte, Ort und Natur, offene Landschaft rundherum und wenig Andrang — Sie entkommen dem dichten Stadt- und Touristendruck und haben mehr Zeit, gemeinsam draußen zu sein.',
      subcards: [
        { title: 'Kurze Touren',     desc: 'Leichte Pfade direkt von Hütte und Ort — passend für kleine Beine und Kinderwagen-Tempo.' },
        { title: 'Radfahren und Spiel', desc: 'Pumptrack, Schotterstraßen und offene Außenbereiche zum Radfahren und freien Spielen.' },
        { title: 'Angeln',           desc: 'Ruhige Bergseen und Flussabschnitte, an denen Kinder das Angeln ausprobieren können.' },
        { title: 'Außenbereiche',    desc: 'Wiesen, Badeplätze und Treffpunkte, an denen sich der Tag wie von selbst fügt.' },
        { title: 'Ruhige Tage',      desc: 'Viel Platz und wenig Menschen — ein Urlaub ohne dichten Stadt- oder Touristendruck.' },
      ],
      cta: 'Familienaktivitäten ansehen',
    },
    basecamp: {
      eyebrow: 'Basislager zwischen Bergen und Fjorden',
      title: 'Wohnen in Bjorli. Mehr von der Region erleben.',
      body: 'Bjorli ist ein ruhiges Bergquartier mit viel Platz — wohnen Sie hoch und offen und nutzen Sie die Tage für Ausflüge in Täler, Berge und Fjordlandschaften. Reinheimen, Tafjordfjella, Dovrefjell und Romsdalen liegen rundherum, und die Romsdalsalpene, die Raumabanen, das Trollstigen-Gebiet, die Geiranger-Region und Åndalsnes sind als Tagesausflug erreichbar.',
      subcards: [
        { title: 'Täler und Bergseen',         desc: 'Lesjaskogsvannet, Aursjøen und Dalsida — ruhige Landschaften direkt bei Bjorli.' },
        { title: 'Nationalparks',              desc: 'Reinheimen, Tafjordfjella und Dovrefjell umgeben das Reiseziel.' },
        { title: 'Romsdalen und Raumabanen',   desc: 'Dramatische Berge und eine Zugfahrt hinunter nach Åndalsnes — als Tagesausflug erreichbar.' },
        { title: 'Fjord und Küste',            desc: 'Trollstigen- und Geiranger-Region als Tagesausflug Richtung Fjorde erreichbar.' },
      ],
      cta: 'Anreise und Tagesausflüge ansehen',
    },
    foodDrink: {
      eyebrow: 'Essen und Treffpunkte',
      title: 'Orte für eine Pause in der Sommerlandschaft',
      body: 'Gastronomie und ruhige Treffpunkte im Ort und rund um Bjorli — perfekt für eine Pause zwischen den Touren oder einen langen Sommerabend nach einem Tag draußen.',
      alt: 'Innenraum mit Tischen und Laternen — Gastronomie und Treffpunkt in Bjorli',
      cta: 'Essen und Trinken ansehen',
    },
  },

  nl: {
    intro: {
      eyebrow: 'Zomer in Bjorli',
      title: 'Een rustig basiskamp tussen bergen en fjorden',
      subtitle:
        'Bjorli ligt tussen de fjorden, de nationale parken en enkele van Noorwegens bekendste landschappen — met veel ruimte en een rustig tempo.',
      items: [
        { title: 'Bergrust',     desc: 'Veel ruimte, schone lucht en een rustigere bergervaring.' },
        { title: 'Actieve dagen', desc: 'Paden, fietsen, vissen, wandelingen en gezinsvriendelijke ervaringen.' },
        { title: 'Basiskamp',    desc: 'Verblijf in Bjorli en breng je dagen door tussen bergen, valleien en fjordlandschap.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Zomer in Bjorli',
      title: 'Dit kun je doen in Bjorli in de zomer',
      readMore: 'Lees meer',
      cards: [
        { title: 'Wandelen', desc: 'Korte wandelingen en langere dagtochten in open hooggebergte — direct voor de deur.', alt: 'Zomerpad met uitzicht over de vallei — wandelen in de bergen bij Bjorli' },
        { title: 'Fietsen en pumptrack', desc: 'Paden, grindwegen en een pumptrack in het dorp — voor beginners en het hele gezin.', alt: 'Fietsen in de bergen bij Bjorli op een zomerdag' },
        { title: 'Vissen', desc: 'Vliegvissen in de Rauma, riviervissen en rustige dagen bij de bergmeren rond Bjorli.', alt: 'Vliegvissen in een bergrivier bij Bjorli op een stille zomerdag' },
        { title: 'Gezinsactiviteiten', desc: 'Veilige, ruime ervaringen in een rustig tempo — voor klein en groot.', alt: 'Gezin ontmoet dieren in groen zomerlandschap bij Bjorli' },
        { title: 'Boerderijbezoeken', desc: 'Bezoek lokale boerderijen in Lesja — boerderijleven, dieren, lokaal eten en cultuurlandschap bij Bjorli.', alt: 'Cultuurlandschap in Lesja bij Bjorli' },
        { title: 'Sagelva waterkrachtcentrum', desc: 'Beleef 300 jaar waterkracht, lokale geschiedenis en levendige vertelling in Lesja.', alt: 'Sagelva waterkrachtcentrum in Lesja' },
        { title: 'Natuur en uitzicht', desc: 'Open vlaktes, bergplateaus en stille zomerweiden in drie nabijgelegen nationale parken.', alt: 'Open zomerlandschap bij Bjorli' },
        { title: 'Dagtochten vanuit Bjorli', desc: 'Romsdalen, Trollstigen, de Geiranger-regio en Åndalsnes binnen een korte rit of treinreis.', alt: 'Raumabanen langs het rivierdal — regionale dagtocht vanuit Bjorli' },
        { title: 'Klimmen en boulderen', desc: 'Sportklimmen, boulderen, via ferrata en alpine ervaringen in Romsdalen. Bjorli als basiskamp tussen bergen, rivier en fjord.', alt: 'Dramatische granietwanden in Romsdalen — klimmen en boulderen' },
      ],
    },
    biking: {
      eyebrow: 'Fietsen en gezin',
      title: 'Fietsen, spel en actieve gezinsdagen',
      body: 'Bjorli is een eenvoudige plek om samen als gezin actief te zijn. Rustige paden, grindwegen en een pumptrack in het dorp zorgen voor korte, overzichtelijke dagen op de fiets — fijn voor beginners en kinderen die het willen proberen. Pak de fiets, rijd een rondje op de pumptrack en combineer dat met een korte wandeling of een pauze bij het water.',
      cta: 'Bekijk fietsen en activiteiten',
    },
    hiking: {
      eyebrow: 'Wandelen en natuur',
      title: 'Wandelingen direct vanuit het bergdorp',
      body: 'Bjorli ligt hoog en open, dus je bent snel in de bergen zonder lange aanloop. Kies een korte wandeling vanuit het dorp, een gezinsvriendelijke dagtocht of ga dieper Reinheimen en de Romsdalsalpene in. Een rustig vertrekpunt voor zomerdagen in het Noorse hooggebergte.',
      subcards: [
        { title: 'Korte wandelingen', desc: 'Lichte wandelingen vanuit het dorp en de hutten — ideaal voor een pauze of een rustige avond.' },
        { title: 'Gezinswandelingen', desc: 'Overzichtelijke paden en open terrein, geschikt voor kinderen en grootouders.' },
        { title: 'Langere bergtochten', desc: 'Dagtochten in Reinheimen, Dovrefjell en de Romsdalsalpene voor wie verder wil.' },
        { title: 'Uitzicht en natuur', desc: 'Open vlaktes, bergplateaus en stille zomerweiden — typisch Noors hooggebergte.' },
      ],
      ctaPrimary: 'Bekijk wandelingen',
      ctaSecondary: 'Korte tochten in Rauma en Lesja',
    },
    fishing: {
      eyebrow: 'Vissen en rustige dagen',
      title: 'Vliegvissen, riviervissen en bergmeren',
      body: 'De Rauma, de Lågen en de bergmeren rond Bjorli bieden de hele zomer goede visomstandigheden. Een rustig tempo, schone natuur en lange lichte avonden bij het water.',
      alt: 'Vissen in een bergrivier bij Bjorli op een stille zomeravond',
      cta: 'Bekijk vismogelijkheden',
    },
    family: {
      eyebrow: 'Gezin',
      title: 'Eenvoudige zomer met kinderen',
      body: 'Bjorli is een eenvoudige plek om met kinderen te reizen. Korte afstanden tussen hut, dorp en natuur, open landschap om je heen en weinig drukte — je ontsnapt aan de dichte stads- en toeristendruk en hebt meer tijd om samen buiten te zijn.',
      subcards: [
        { title: 'Korte wandelingen', desc: 'Lichte paden direct vanuit de hut en het dorp — geschikt voor kleine benen en kinderwagentempo.' },
        { title: 'Fietsen en spel',   desc: 'Pumptrack, grindwegen en open buitenruimtes voor fietsen en vrij spel.' },
        { title: 'Vissen',            desc: 'Rustige bergmeren en rivierstukken waar kinderen het vissen kunnen proberen.' },
        { title: 'Buitenruimtes',     desc: 'Grasvelden, zwemplekken en ontmoetingsplaatsen waar de dag vanzelf valt.' },
        { title: 'Rustige dagen',     desc: 'Veel ruimte en weinig mensen — een vakantie zonder dichte stads- of toeristendruk.' },
      ],
      cta: 'Bekijk gezinsactiviteiten',
    },
    basecamp: {
      eyebrow: 'Basiskamp tussen bergen en fjorden',
      title: 'Verblijf in Bjorli. Beleef meer van de regio.',
      body: 'Bjorli is een rustige bergbasis met veel ruimte — verblijf hoog en open en gebruik de dagen voor tochten naar valleien, bergen en fjordlandschappen. Reinheimen, Tafjordfjella, Dovrefjell en Romsdalen liggen om je heen, en de Romsdalsalpene, de Raumabanen, het Trollstigen-gebied, de Geiranger-regio en Åndalsnes zijn als dagtocht bereikbaar.',
      subcards: [
        { title: 'Valleien en bergmeren',     desc: 'Lesjaskogsvannet, Aursjøen en Dalsida — rustige landschappen vlakbij Bjorli.' },
        { title: 'Nationale parken',          desc: 'Reinheimen, Tafjordfjella en Dovrefjell omringen de bestemming.' },
        { title: 'Romsdalen en Raumabanen',   desc: 'Dramatische bergen en een treinrit naar Åndalsnes — als dagtocht bereikbaar.' },
        { title: 'Fjord en kust',             desc: 'Trollstigen- en Geiranger-regio als dagtocht bereikbaar richting de fjorden.' },
      ],
      cta: 'Bekijk reis en dagtochten',
    },
    foodDrink: {
      eyebrow: 'Eten en ontmoetingsplekken',
      title: 'Plekken om te pauzeren in het zomerlandschap',
      body: 'Horeca en rustige ontmoetingsplekken in het dorp en rond Bjorli — perfect voor een pauze tussen de tochten of een lange zomeravond na een dag buiten.',
      alt: 'Interieur met tafels en lantaarns — eetgelegenheid en ontmoetingsplek in Bjorli',
      cta: 'Bekijk eten en drinken',
    },
  },

  da: {
    intro: {
      eyebrow: 'Sommer i Bjorli',
      title: 'En rolig basislejr mellem fjelde og fjorde',
      subtitle:
        'Bjorli ligger mellem fjordene, nationalparkerne og nogle af Norges mest kendte landskaber — med god plads og roligt tempo.',
      items: [
        { title: 'Fjeldro',      desc: 'God plads, ren luft og en roligere fjeldoplevelse.' },
        { title: 'Aktive dage',  desc: 'Stier, cykling, fiskeri, vandreture og familievenlige oplevelser.' },
        { title: 'Basislejr',    desc: 'Bo i Bjorli og brug dagene mellem fjelde, dale og fjordlandskab.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Sommer i Bjorli',
      title: 'Dette kan du opleve i Bjorli om sommeren',
      readMore: 'Læs mere',
      cards: [
        { title: 'Vandring', desc: 'Korte spadsereture og længere dagsture i åbent højfjeld — lige uden for døren.', alt: 'Sommersti med udsigt over dalen — vandring i fjeldet ved Bjorli' },
        { title: 'Cykling og pumptrack', desc: 'Stier, grusveje og en pumptrack i centrum — for begyndere og hele familien.', alt: 'Cykling i fjeldet ved Bjorli en sommerdag' },
        { title: 'Fiskeri', desc: 'Fluefiskeri i Rauma, åfiskeri og rolige dage ved fjeldsøerne omkring Bjorli.', alt: 'Fluefiskeri i en fjeldå nær Bjorli en stille sommerdag' },
        { title: 'Familieaktiviteter', desc: 'Trygge, rummelige oplevelser i lavt tempo — passer både til små og store.', alt: 'Familie møder dyr i grønt sommerlandskab ved Bjorli' },
        { title: 'Gårdbesøg', desc: 'Besøg lokale gårde i Lesja — gårdliv, dyr, lokal mad og kulturlandskab nær Bjorli.', alt: 'Kulturlandskab i Lesja nær Bjorli' },
        { title: 'Sagelva vandkraftcenter', desc: 'Oplev 300 års vandkraft, lokalhistorie og levende formidling i Lesja.', alt: 'Sagelva vandkraftcenter i Lesja' },
        { title: 'Natur og udsigt', desc: 'Åbne vidder, fjeldplateauer og stille sæterdale i tre nærliggende nationalparker.', alt: 'Åbent sommerlandskab nær Bjorli' },
        { title: 'Dagsture fra Bjorli', desc: 'Romsdalen, Trollstigen, Geiranger-området og Åndalsnes inden for kort køre- eller togtur.', alt: 'Raumabanen langs ådalen — regional dagstur fra Bjorli' },
        { title: 'Klatring og bouldering', desc: 'Sportsklatring, bouldering, via ferrata og alpine oplevelser i Romsdalen. Bjorli som basislejr mellem fjeld, elv og fjord.', alt: 'Dramatiske granitvægge i Romsdalen — klatring og bouldering' },
      ],
    },
    biking: {
      eyebrow: 'Cykling og familie',
      title: 'Cykling, leg og aktive familiedage',
      body: 'Bjorli er et nemt sted at være aktiv sammen som familie. Rolige stier, grusveje og en pumptrack i centrum giver korte, overskuelige dage på cyklen — fint for begyndere og børn, der vil prøve. Pak cyklen, tag en runde på pumptracken og kombiner det med en kort tur i fjeldet eller en pause ved vandet.',
      cta: 'Se cykling og aktiviteter',
    },
    hiking: {
      eyebrow: 'Vandring og natur',
      title: 'Ture direkte fra fjeldbyen',
      body: 'Bjorli ligger højt og åbent, og du er hurtigt ude i fjeldet uden lang tilgang. Vælg en kort tur fra centrum, en familievenlig dagstur eller gå længere ind i Reinheimen og Romsdalsalpene. Et roligt udgangspunkt for sommerdage i norsk højfjeld.',
      subcards: [
        { title: 'Korte ture',        desc: 'Lette ture fra centrum og hytterne — fine til en pause eller en stille aften.' },
        { title: 'Familieture',       desc: 'Overskuelige stier og åbent terræn, der passer til børn og bedsteforældre.' },
        { title: 'Længere fjeldture', desc: 'Dagsture ind i Reinheimen, Dovrefjell og Romsdalsalpene for dem, der vil gå længere.' },
        { title: 'Udsigt og natur',   desc: 'Åbne vidder, fjeldplateauer og stille sæterdale — typisk norsk højfjeld.' },
      ],
      ctaPrimary: 'Se vandreture',
      ctaSecondary: 'Korte ture i Rauma og Lesja',
    },
    fishing: {
      eyebrow: 'Fiskeri og rolige dage',
      title: 'Fluefiskeri, åfiskeri og fjeldsøer',
      body: 'Rauma, Lågen og fjeldsøerne omkring Bjorli giver gode forhold for fiskeri hele sommeren. Et roligt tempo, ren natur og lange lyse aftener ved vandet.',
      alt: 'Fiskeri i en fjeldå nær Bjorli en stille sommeraften',
      cta: 'Se fiskemuligheder',
    },
    family: {
      eyebrow: 'Familie',
      title: 'Enkel sommer med børn',
      body: 'Bjorli er et nemt sted at rejse med børn. Korte afstande mellem hytte, centrum og natur, åbent landskab omkring dig og lidt kø — du slipper for det tætte by- og turistpres og får mere tid til at være ude sammen.',
      subcards: [
        { title: 'Korte ture',     desc: 'Lette stier direkte fra hytten og centrum — passer til små ben og barnevognstempo.' },
        { title: 'Cykling og leg', desc: 'Pumptrack, grusveje og åbne udeområder til cykling og fri leg.' },
        { title: 'Fiskeri',        desc: 'Rolige fjeldsøer og åstrækninger, hvor børn kan prøve at fiske.' },
        { title: 'Udeområder',     desc: 'Græsplæner, badesteder og samlingssteder, hvor dagen falder naturligt på plads.' },
        { title: 'Rolige dage',    desc: 'God plads og få mennesker — en ferie uden tæt by- eller turistpres.' },
      ],
      cta: 'Se familieaktiviteter',
    },
    basecamp: {
      eyebrow: 'Basislejr mellem fjelde og fjorde',
      title: 'Bo i Bjorli. Oplev mere af regionen.',
      body: 'Bjorli er en rolig fjeldbase med god plads — bo højt og åbent, og brug dagene på ture ud i dale, fjelde og fjordlandskaber. Reinheimen, Tafjordfjella, Dovrefjell og Romsdalen ligger omkring dig, og Romsdalsalpene, Raumabanen, Trollstigen-området, Geiranger-området og Åndalsnes er inden for rækkevidde som dagsture.',
      subcards: [
        { title: 'Dale og fjeldsøer',         desc: 'Lesjaskogsvannet, Aursjøen og Dalsida — rolige landskaber lige ved Bjorli.' },
        { title: 'Nationalparker',            desc: 'Reinheimen, Tafjordfjella og Dovrefjell omgiver destinationen.' },
        { title: 'Romsdalen og Raumabanen',   desc: 'Dramatiske fjelde og togtur ned mod Åndalsnes — inden for rækkevidde som dagstur.' },
        { title: 'Fjord og kyst',             desc: 'Trollstigen- og Geiranger-området inden for rækkevidde som dagstur mod fjordene.' },
      ],
      cta: 'Se rejse og dagsture',
    },
    foodDrink: {
      eyebrow: 'Mad og mødesteder',
      title: 'Steder at holde pause i sommerlandskabet',
      body: 'Servering og rolige mødesteder i centrum og omkring Bjorli — perfekt til en pause mellem turene eller en lang sommeraften efter en dag ude.',
      alt: 'Interiør med borde og lanterner — servering og mødested i Bjorli',
      cta: 'Se mad og drikke',
    },
  },

  sv: {
    intro: {
      eyebrow: 'Sommar i Bjorli',
      title: 'Ett lugnt basläger mellan fjäll och fjordar',
      subtitle:
        'Bjorli ligger mellan fjordarna, nationalparkerna och några av Norges mest kända landskap — med gott om plats och lugnt tempo.',
      items: [
        { title: 'Fjällro',     desc: 'Gott om plats, ren luft och en lugnare fjällupplevelse.' },
        { title: 'Aktiva dagar', desc: 'Stigar, cykling, fiske, vandringar och familjevänliga upplevelser.' },
        { title: 'Basläger',    desc: 'Bo i Bjorli och tillbringa dagarna mellan fjäll, dalar och fjordlandskap.' },
      ],
    },
    activitiesGrid: {
      eyebrow: 'Sommar i Bjorli',
      title: 'Det här kan du göra i Bjorli på sommaren',
      readMore: 'Läs mer',
      cards: [
        { title: 'Vandring', desc: 'Korta promenader och längre dagsturer i öppet högfjäll — precis utanför dörren.', alt: 'Sommarstig med utsikt över dalen — vandring i fjället vid Bjorli' },
        { title: 'Cykling och pumptrack', desc: 'Stigar, grusvägar och en pumptrack i centrum — för nybörjare och hela familjen.', alt: 'Cykling i fjället vid Bjorli en sommardag' },
        { title: 'Fiske', desc: 'Flugfiske i Rauma, åfiske och lugna dagar vid fjällsjöarna runt Bjorli.', alt: 'Flugfiske i en fjällälv nära Bjorli en stilla sommardag' },
        { title: 'Familjeaktiviteter', desc: 'Trygga, rymliga upplevelser i lågt tempo — passar både små och stora.', alt: 'Familj möter djur i grönt sommarlandskap vid Bjorli' },
        { title: 'Gårdsbesök', desc: 'Besök lokala gårdar i Lesja — gårdsliv, djur, lokal mat och kulturlandskap nära Bjorli.', alt: 'Kulturlandskap i Lesja nära Bjorli' },
        { title: 'Sagelva vattenkraftcenter', desc: 'Upplev 300 år av vattenkraft, lokalhistoria och levande förmedling i Lesja.', alt: 'Sagelva vattenkraftcenter i Lesja' },
        { title: 'Natur och utsikt', desc: 'Öppna vidder, fjällplatåer och stilla sätertrakter i tre närliggande nationalparker.', alt: 'Öppet sommarlandskap nära Bjorli' },
        { title: 'Dagsturer från Bjorli', desc: 'Romsdalen, Trollstigen, Geiranger-området och Åndalsnes inom kort bil- eller tågresa.', alt: 'Raumabanen längs floddalen — regional dagstur från Bjorli' },
        { title: 'Klättring och bouldering', desc: 'Sportklättring, bouldering, via ferrata och alpina upplevelser i Romsdalen. Bjorli som basläger mellan fjäll, älv och fjord.', alt: 'Dramatiska granitväggar i Romsdalen — klättring och bouldering' },
      ],
    },
    biking: {
      eyebrow: 'Cykling och familj',
      title: 'Cykling, lek och aktiva familjedagar',
      body: 'Bjorli är en enkel plats att vara aktiv tillsammans som familj. Lugna stigar, grusvägar och en pumptrack i centrum ger korta, överskådliga dagar på cykel — bra för nybörjare och barn som vill prova. Packa cykeln, ta ett varv på pumptracken och kombinera med en kort tur i fjället eller en paus vid vattnet.',
      cta: 'Se cykling och aktiviteter',
    },
    hiking: {
      eyebrow: 'Vandring och natur',
      title: 'Turer direkt från fjällbyn',
      body: 'Bjorli ligger högt och öppet, och du är snabbt ute i fjället utan lång inmarsch. Välj en kort promenad från centrum, en familjevänlig dagstur eller gå längre in i Reinheimen och Romsdalsalpene. En lugn utgångspunkt för sommardagar i norskt högfjäll.',
      subcards: [
        { title: 'Korta turer',         desc: 'Lätta promenader från centrum och stugorna — bra för en paus eller en lugn kväll.' },
        { title: 'Familjeturer',        desc: 'Överskådliga stigar och öppet terräng som passar barn och morföräldrar.' },
        { title: 'Längre fjällturer',   desc: 'Dagsturer in i Reinheimen, Dovrefjell och Romsdalsalpene för den som vill gå längre.' },
        { title: 'Utsikt och natur',    desc: 'Öppna vidder, fjällplatåer och stilla sätertrakter — typiskt norskt högfjäll.' },
      ],
      ctaPrimary: 'Se vandringar',
      ctaSecondary: 'Korta turer i Rauma och Lesja',
    },
    fishing: {
      eyebrow: 'Fiske och lugna dagar',
      title: 'Flugfiske, åfiske och fjällsjöar',
      body: 'Rauma, Lågen och fjällsjöarna runt Bjorli ger goda fiskeförhållanden hela sommaren. Ett lugnt tempo, ren natur och långa ljusa kvällar vid vattnet.',
      alt: 'Fiske i en fjällälv nära Bjorli en stilla sommarkväll',
      cta: 'Se fiskemöjligheter',
    },
    family: {
      eyebrow: 'Familj',
      title: 'Enkel sommar med barn',
      body: 'Bjorli är en enkel plats att resa med barn. Korta avstånd mellan stuga, centrum och natur, öppet landskap runt dig och lite köer — du slipper det täta stads- och turisttrycket och får mer tid att vara ute tillsammans.',
      subcards: [
        { title: 'Korta turer',     desc: 'Lätta stigar direkt från stugan och centrum — passar små ben och barnvagnstempo.' },
        { title: 'Cykling och lek', desc: 'Pumptrack, grusvägar och öppna uteområden för cykling och fri lek.' },
        { title: 'Fiske',           desc: 'Lugna fjällsjöar och åpartier där barnen kan prova på fiske.' },
        { title: 'Uteområden',      desc: 'Gräsmattor, badplatser och samlingsplatser där dagen faller på plats av sig själv.' },
        { title: 'Lugna dagar',     desc: 'Gott om plats och få människor — en semester utan tätt stads- eller turisttryck.' },
      ],
      cta: 'Se familjeaktiviteter',
    },
    basecamp: {
      eyebrow: 'Basläger mellan fjäll och fjordar',
      title: 'Bo i Bjorli. Upplev mer av regionen.',
      body: 'Bjorli är en lugn fjällbas med gott om plats — bo högt och öppet och använd dagarna till turer ut i dalar, fjäll och fjordlandskap. Reinheimen, Tafjordfjella, Dovrefjell och Romsdalen omger dig, och Romsdalsalpene, Raumabanen, Trollstigen-området, Geiranger-området och Åndalsnes är inom räckhåll som dagsturer.',
      subcards: [
        { title: 'Dalar och fjällsjöar',     desc: 'Lesjaskogsvannet, Aursjøen och Dalsida — lugna landskap precis vid Bjorli.' },
        { title: 'Nationalparker',           desc: 'Reinheimen, Tafjordfjella och Dovrefjell omger destinationen.' },
        { title: 'Romsdalen och Raumabanen', desc: 'Dramatiska fjäll och en tågresa ner mot Åndalsnes — inom räckhåll som dagstur.' },
        { title: 'Fjord och kust',           desc: 'Trollstigen- och Geiranger-området inom räckhåll som dagstur mot fjordarna.' },
      ],
      cta: 'Se resa och dagsturer',
    },
    foodDrink: {
      eyebrow: 'Mat och mötesplatser',
      title: 'Platser att pausa på i sommarlandskapet',
      body: 'Servering och lugna mötesplatser i centrum och runt Bjorli — perfekt för en paus mellan turerna eller en lång sommarkväll efter en dag ute.',
      alt: 'Interiör med bord och lyktor — servering och mötesplats i Bjorli',
      cta: 'Se mat och dryck',
    },
  },
};