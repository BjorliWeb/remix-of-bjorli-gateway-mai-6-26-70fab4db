/**
 * Prerender body content registry — crawler-visible leads for priority routes.
 *
 * Consumed ONLY by `scripts/prerender.ts` (build time). The live React UI
 * never reads this file, so nothing here changes the visible site.
 *
 * Purpose: the prerendered HTML skeleton used to repeat <title> as the H1
 * and the meta description as the only paragraph. This registry provides
 * distinct, human copy for the priority destination pages:
 *   - `h1`         crawlable H1, different from <title>
 *   - `lead`       intro paragraph, different from the meta description
 *   - `supporting` optional second paragraph with concrete next steps
 *
 * Rules (see CLAUDE.md):
 *   - Norwegian is the quality reference; other locales are natural
 *     rewrites, not word-for-word translations.
 *   - Concrete and local: Romsdalen, Reinheimen, Dovrefjell, E136,
 *     Raumabanen, Lesjaskogsvatnet, Sagelva, Lesja — no generic
 *     destination filler, no overuse of «rolig».
 *   - No invented facts: every claim here also appears elsewhere in the
 *     repo (routeSeo.ts, page copy, llms.txt).
 *
 * Routes without an entry keep the previous prerender behaviour
 * (description as the body paragraph). `handel` is Norwegian-only.
 */
import type { Locale } from '@/i18n/locales/types';

export interface RouteLeadEntry {
  /** Crawlable H1; falls back to the SEO title when absent. */
  h1?: string;
  /** Intro paragraph, distinct from the meta description. */
  lead: string;
  /** Optional second paragraph with next steps / internal context. */
  supporting?: string;
}

type RouteLeadMap = Partial<Record<string, Partial<Record<Locale, RouteLeadEntry>>>>;

export const ROUTE_LEADS: RouteLeadMap = {
  salgsbetingelser: {
    no: { h1: 'Salgsbetingelser', lead: 'Generelle salgsbetingelser ved kjøp av heiskort, aktiviteter og andre produkter på nett hos Bjorli Skisenter AS.' },
    en: { h1: 'Terms of Sale', lead: 'General terms of sale for online purchases of lift passes, activities and other products from Bjorli Skisenter AS. The Norwegian text is the authoritative version.' },
    de: { h1: 'Verkaufsbedingungen', lead: 'Allgemeine Verkaufsbedingungen für den Online-Kauf von Skipässen, Aktivitäten und anderen Produkten bei Bjorli Skisenter AS. Maßgeblich ist der norwegische Text.' },
    nl: { h1: 'Verkoopvoorwaarden', lead: 'Algemene verkoopvoorwaarden voor online aankopen van skipassen, activiteiten en andere producten bij Bjorli Skisenter AS. De Noorse tekst is leidend.' },
    da: { h1: 'Salgsbetingelser', lead: 'Generelle salgsbetingelser ved onlinekøb af liftkort, aktiviteter og andre produkter hos Bjorli Skisenter AS. Den norske tekst er den gældende.' },
    sv: { h1: 'Försäljningsvillkor', lead: 'Allmänna försäljningsvillkor vid onlineköp av liftkort, aktiviteter och andra produkter hos Bjorli Skisenter AS. Den norska texten gäller.' },
  },
  home: {
    no: {
      h1: 'Bjorli – helårsdestinasjon øverst i Gudbrandsdalen',
      lead: 'Bjorli ligger 575 meter over havet øverst i Gudbrandsdalen, helt på grensen til Romsdalen, med Raumabanen og E136 rett forbi. Om vinteren er det snøen som trekker folk hit – Bjorli Skisenter åpner ofte før resten av landet. Om sommeren byttes skiene ut med tursko, sykkel og fiskestang.',
      supporting: 'Herfra når du Trollveggen, Romsdalsgondolen i Åndalsnes og Dovrefjell på under en time i bil. Sjekk hva som skjer, finn overnatting og se dagens forhold på webkamera før du drar.',
    },
    en: {
      h1: 'Bjorli – a year-round mountain destination at the top of Gudbrandsdalen',
      lead: 'Bjorli sits 575 metres above sea level at the top of Gudbrandsdalen, right on the border of Romsdalen, with the Rauma Line and the E136 passing right through. In winter it is the snow that draws people here – Bjorli Skisenter often opens before the rest of Norway. Come summer, skis give way to hiking boots, bikes and fishing rods.',
      supporting: 'Trollveggen, the Romsdalsgondolen in Åndalsnes and Dovrefjell are all within an hour’s drive. Check what’s on, find a place to stay and have a look at the webcams before you set off.',
    },
    de: {
      h1: 'Bjorli – Ganzjahresziel am oberen Ende des Gudbrandsdalen',
      lead: 'Bjorli liegt auf 575 Metern am oberen Ende des Gudbrandsdalen, direkt an der Grenze zum Romsdalen. Raumabahn und E136 führen direkt vorbei. Im Winter ist es der Schnee, der die Leute herbringt – das Bjorli Skisenter öffnet oft früher als der Rest des Landes. Im Sommer werden die Ski gegen Wanderschuhe, Rad und Angelrute getauscht.',
      supporting: 'Trollveggen, die Romsdalsgondolen in Åndalsnes und das Dovrefjell erreichen Sie in unter einer Stunde mit dem Auto. Werfen Sie vor der Abfahrt einen Blick auf die Webcams, finden Sie eine Unterkunft und schauen Sie, was gerade los ist.',
    },
    nl: {
      h1: 'Bjorli – het hele jaar een bergbestemming, boven in Gudbrandsdalen',
      lead: 'Bjorli ligt op 575 meter hoogte boven in Gudbrandsdalen, vlak aan de grens met Romsdalen, met de Raumabanen en de E136 er vlak langs. In de winter komen mensen voor de sneeuw – Bjorli Skisenter gaat vaak eerder open dan de rest van Noorwegen. In de zomer maken de ski’s plaats voor wandelschoenen, fiets en hengel.',
      supporting: 'Trollveggen, de Romsdalsgondolen in Åndalsnes en Dovrefjell liggen allemaal binnen een uur rijden. Bekijk wat er te doen is, zoek een overnachting en check de webcams voor je vertrekt.',
    },
    da: {
      h1: 'Bjorli – helårsdestination øverst i Gudbrandsdalen',
      lead: 'Bjorli ligger 575 meter over havet øverst i Gudbrandsdalen, helt på grænsen til Romsdalen, med Raumabanen og E136 lige forbi. Om vinteren er det sneen, der trækker folk hertil – Bjorli Skisenter åbner ofte før resten af Norge. Om sommeren byttes skiene ud med vandrestøvler, cykel og fiskestang.',
      supporting: 'Herfra når du Trollveggen, Romsdalsgondolen i Åndalsnes og Dovrefjell på under en time i bil. Tjek hvad der sker, find overnatning og se dagens forhold på webcam, før du kører.',
    },
    sv: {
      h1: 'Bjorli – åretruntdestination överst i Gudbrandsdalen',
      lead: 'Bjorli ligger 575 meter över havet överst i Gudbrandsdalen, vid gränsen till Romsdalen, med Raumabanan och E136 alldeles intill. På vintern är det snön som lockar – Bjorli Skisenter öppnar ofta före resten av Norge. På sommaren byts skidorna mot kängor, cykel och fiskespö.',
      supporting: 'Härifrån når du Trollveggen, Romsdalsgondolen i Åndalsnes och Dovrefjell på under en timme med bil. Kolla vad som är på gång, hitta boende och se dagens förhållanden på webbkamera innan du åker.',
    },
  },

  sommer: {
    no: {
      h1: 'Sommer på Bjorli',
      lead: 'Sommeren på Bjorli handler om det som ligger rett utenfor døra: stier inn i Reinheimen, grusveier for sykkel, fiskevann i Lesja og badekulper i Sagelva. Lesjaskogsvatnet og Rauma gir noen av de fineste fiskemulighetene i dalen.',
      supporting: 'Bjorli er også et praktisk utgangspunkt for dagsturer – Romsdalsgondolen, Trollveggen og Dovrefjell ligger alle innen rekkevidde.',
    },
    en: {
      h1: 'Summer in Bjorli',
      lead: 'Summer in Bjorli is about what lies right outside the door: trails into Reinheimen, gravel roads for cycling, fishing lakes in Lesja and the bathing pools at Sagelva. Lesjaskogsvatnet and the Rauma river offer some of the finest fishing in the valley.',
      supporting: 'Bjorli also works well as a base for day trips – the Romsdalsgondolen, Trollveggen and Dovrefjell are all within reach.',
    },
    de: {
      h1: 'Sommer in Bjorli',
      lead: 'Der Sommer in Bjorli beginnt direkt vor der Tür: Pfade ins Reinheimen, Schotterwege zum Radfahren, Angelseen in Lesja und die Badegumpen der Sagelva. Lesjaskogsvatnet und die Rauma gehören zu den besten Angelgewässern des Tals.',
      supporting: 'Bjorli eignet sich außerdem gut als Basis für Tagesausflüge – Romsdalsgondolen, Trollveggen und Dovrefjell sind alle gut erreichbar.',
    },
    nl: {
      h1: 'Zomer in Bjorli',
      lead: 'De zomer in Bjorli speelt zich af direct buiten de deur: paden het Reinheimen in, gravelwegen om te fietsen, vismeren in Lesja en de zwemkommen van Sagelva. Lesjaskogsvatnet en de rivier de Rauma horen bij de beste viswateren van het dal.',
      supporting: 'Bjorli is bovendien een handige uitvalsbasis voor dagtochten – de Romsdalsgondolen, Trollveggen en Dovrefjell liggen allemaal binnen bereik.',
    },
    da: {
      h1: 'Sommer på Bjorli',
      lead: 'Sommeren på Bjorli handler om det, der ligger lige uden for døren: stier ind i Reinheimen, grusveje til cykling, fiskevande i Lesja og badehullerne i Sagelva. Lesjaskogsvatnet og Rauma byder på noget af dalens bedste fiskeri.',
      supporting: 'Bjorli er også et praktisk udgangspunkt for dagsture – Romsdalsgondolen, Trollveggen og Dovrefjell ligger alle inden for rækkevidde.',
    },
    sv: {
      h1: 'Sommar på Bjorli',
      lead: 'Sommaren på Bjorli handlar om det som ligger precis utanför dörren: stigar in i Reinheimen, grusvägar för cykling, fiskevatten i Lesja och badhöljorna i Sagelva. Lesjaskogsvatnet och älven Rauma bjuder på något av dalens bästa fiske.',
      supporting: 'Bjorli fungerar också bra som bas för dagsturer – Romsdalsgondolen, Trollveggen och Dovrefjell ligger alla inom räckhåll.',
    },
  },

  vinter: {
    no: {
      h1: 'Vinter på Bjorli',
      lead: 'Bjorli er et av de mest snøsikre stedene i Sør-Norge, og vintersesongen starter ofte tidligere her enn ellers i landet. Alpint i Bjorli Skisenter, preparerte langrennsløyper i høyfjellet og god plass til aking og skilek for de minste.',
      supporting: 'Heiskort, åpningstider, skiskole og skiutleie har egne sider – og webkameraet viser forholdene i bakken akkurat nå.',
    },
    en: {
      h1: 'Winter in Bjorli',
      lead: 'Bjorli is one of the most snow-sure places in southern Norway, and the season often starts earlier here than anywhere else in the country. Alpine skiing at Bjorli Skisenter, groomed cross-country trails in the high mountains, and plenty of room for sledging and snow play for the youngest.',
      supporting: 'Ski passes, opening hours, ski school and rental each have their own page – and the webcams show conditions on the slopes right now.',
    },
    de: {
      h1: 'Winter in Bjorli',
      lead: 'Bjorli gehört zu den schneesichersten Orten Südnorwegens, und die Saison beginnt hier oft früher als im Rest des Landes. Alpinski im Bjorli Skisenter, gespurte Loipen im Hochgebirge und viel Platz zum Rodeln und Schneespielen für die Kleinen.',
      supporting: 'Skipässe, Öffnungszeiten, Skischule und Verleih haben eigene Seiten – und die Webcams zeigen die aktuellen Bedingungen an der Piste.',
    },
    nl: {
      h1: 'Winter in Bjorli',
      lead: 'Bjorli is een van de meest sneeuwzekere plekken van Zuid-Noorwegen, en het seizoen begint hier vaak eerder dan elders in het land. Alpineskiën bij Bjorli Skisenter, geprepareerde langlaufloipes in het hooggebergte en volop ruimte om te sleeën voor de kleintjes.',
      supporting: 'Skipassen, openingstijden, skischool en verhuur hebben elk een eigen pagina – en de webcams laten zien hoe de pistes er nu bij liggen.',
    },
    da: {
      h1: 'Vinter på Bjorli',
      lead: 'Bjorli er et af de mest snesikre steder i det sydlige Norge, og sæsonen starter ofte tidligere her end i resten af landet. Alpint i Bjorli Skisenter, præparerede langrendsspor i højfjeldet og god plads til kælkning og sneleg for de mindste.',
      supporting: 'Liftkort, åbningstider, skiskole og skiudlejning har egne sider – og webcams viser forholdene i bakken lige nu.',
    },
    sv: {
      h1: 'Vinter på Bjorli',
      lead: 'Bjorli är en av de mest snösäkra platserna i södra Norge, och säsongen börjar ofta tidigare här än i resten av landet. Alpint på Bjorli Skisenter, preparerade längdspår i högfjället och gott om plats för pulka och snölek för de minsta.',
      supporting: 'Liftkort, öppettider, skidskola och uthyrning har egna sidor – och webbkamerorna visar förhållandena i backen just nu.',
    },
  },

  aktiviteter: {
    no: {
      h1: 'Aktiviteter på Bjorli og i Lesja',
      lead: 'Aktivitetene på Bjorli følger årstidene. Vinter betyr alpint, langrenn og skiskole i Bjorli Skisenter. Sommer betyr fotturer, sykling, fiske og gårdsbesøk i Lesja – pluss utflukter som Golden Train på Raumabanen og Romsdalsgondolen i Åndalsnes.',
      supporting: 'Sidene under samler det du trenger for å planlegge: hva som passer for barn, hvor du parkerer, og hva som er verdt en hel dag.',
    },
    en: {
      h1: 'Things to do in Bjorli and Lesja',
      lead: 'Activities in Bjorli follow the seasons. Winter means alpine skiing, cross-country and ski school at Bjorli Skisenter. Summer means hiking, cycling, fishing and farm visits in Lesja – plus outings like the Golden Train on the Rauma Line and the Romsdalsgondolen in Åndalsnes.',
      supporting: 'The pages below gather what you need to plan: what suits children, where to park, and what is worth a full day.',
    },
    de: {
      h1: 'Aktivitäten in Bjorli und Lesja',
      lead: 'Die Aktivitäten in Bjorli folgen den Jahreszeiten. Winter heißt Alpinski, Langlauf und Skischule im Bjorli Skisenter. Sommer heißt Wandern, Radfahren, Angeln und Hofbesuche in Lesja – dazu Ausflüge wie der Golden Train auf der Raumabahn und die Romsdalsgondolen in Åndalsnes.',
      supporting: 'Die Seiten unten sammeln alles für die Planung: was für Kinder passt, wo man parkt und was einen ganzen Tag wert ist.',
    },
    nl: {
      h1: 'Activiteiten in Bjorli en Lesja',
      lead: 'De activiteiten in Bjorli volgen de seizoenen. Winter betekent alpineskiën, langlaufen en skischool bij Bjorli Skisenter. Zomer betekent wandelen, fietsen, vissen en boerderijbezoek in Lesja – plus uitstapjes zoals de Golden Train op de Raumabanen en de Romsdalsgondolen in Åndalsnes.',
      supporting: 'De pagina’s hieronder bundelen wat je nodig hebt om te plannen: wat geschikt is voor kinderen, waar je parkeert en wat een hele dag waard is.',
    },
    da: {
      h1: 'Aktiviteter på Bjorli og i Lesja',
      lead: 'Aktiviteterne på Bjorli følger årstiderne. Vinter betyder alpint, langrend og skiskole i Bjorli Skisenter. Sommer betyder vandreture, cykling, fiskeri og gårdsbesøg i Lesja – plus udflugter som Golden Train på Raumabanen og Romsdalsgondolen i Åndalsnes.',
      supporting: 'Siderne herunder samler det, du skal bruge til planlægningen: hvad der passer til børn, hvor man parkerer, og hvad der er en hel dag værd.',
    },
    sv: {
      h1: 'Aktiviteter på Bjorli och i Lesja',
      lead: 'Aktiviteterna på Bjorli följer årstiderna. Vinter betyder alpint, längdåkning och skidskola på Bjorli Skisenter. Sommar betyder vandring, cykling, fiske och gårdsbesök i Lesja – plus utflykter som Golden Train på Raumabanan och Romsdalsgondolen i Åndalsnes.',
      supporting: 'Sidorna nedan samlar det du behöver för att planera: vad som passar barn, var du parkerar och vad som är värt en hel dag.',
    },
  },

  'vaer-og-webkamera': {
    no: {
      h1: 'Vær, snø og webkamera på Bjorli',
      lead: 'Se hvordan det faktisk ser ut på Bjorli akkurat nå. Webkameraene viser skisenteret og fjellet i sanntid, og værvarselet dekker både dalen og toppene. Praktisk før du pakker bilen – enten du skal stå på ski eller gå i fjellet.',
      supporting: 'Bra forhold? Finn overnatting, sjekk heiskort eller se hva som skjer på Bjorli denne uka.',
    },
    en: {
      h1: 'Weather, snow and webcams in Bjorli',
      lead: 'See what Bjorli actually looks like right now. The webcams show the ski resort and the mountain in real time, and the forecast covers both the valley and the tops. Handy before you pack the car – whether you are going skiing or heading into the hills.',
      supporting: 'Conditions look good? Find somewhere to stay, check lift passes or see what’s on in Bjorli this week.',
    },
    de: {
      h1: 'Wetter, Schnee und Webcams in Bjorli',
      lead: 'Sehen Sie, wie es in Bjorli gerade wirklich aussieht. Die Webcams zeigen Skigebiet und Berg in Echtzeit, der Wetterbericht deckt Tal und Gipfel ab. Praktisch, bevor Sie das Auto packen – ob es auf die Piste oder ins Gelände geht.',
      supporting: 'Gute Bedingungen? Unterkunft finden, Skipässe prüfen oder schauen, was diese Woche in Bjorli los ist.',
    },
    nl: {
      h1: 'Weer, sneeuw en webcams in Bjorli',
      lead: 'Bekijk hoe Bjorli er op dit moment echt bij ligt. De webcams tonen het skigebied en de berg in realtime, en de weersverwachting dekt zowel het dal als de toppen. Handig voordat je de auto inpakt – of je nu gaat skiën of de bergen in trekt.',
      supporting: 'Zien de omstandigheden er goed uit? Zoek een overnachting, bekijk de skipassen of kijk wat er deze week te doen is in Bjorli.',
    },
    da: {
      h1: 'Vejr, sne og webcams på Bjorli',
      lead: 'Se hvordan der faktisk ser ud på Bjorli lige nu. Webcams viser skicentret og fjeldet i realtid, og vejrudsigten dækker både dalen og toppene. Praktisk før du pakker bilen – uanset om du skal stå på ski eller vandre i fjeldet.',
      supporting: 'Ser forholdene gode ud? Find overnatning, tjek liftkort eller se hvad der sker på Bjorli i denne uge.',
    },
    sv: {
      h1: 'Väder, snö och webbkameror på Bjorli',
      lead: 'Se hur det faktiskt ser ut på Bjorli just nu. Webbkamerorna visar skidanläggningen och fjället i realtid, och prognosen täcker både dalen och topparna. Praktiskt innan du packar bilen – oavsett om du ska åka skidor eller ut på fjället.',
      supporting: 'Ser förhållandena bra ut? Hitta boende, kolla liftkort eller se vad som händer på Bjorli i veckan.',
    },
  },

  arrangementer: {
    no: {
      h1: 'Hva skjer på Bjorli',
      lead: 'Fra skifestivaler og konkurranser i bakken til lokale matdager og familiearrangementer – det skjer mer på Bjorli enn mange venter seg. Oversikten oppdateres gjennom sesongen.',
      supporting: 'Kombiner gjerne et arrangement med overnatting, og sjekk været på webkamera før du drar.',
    },
    en: {
      h1: 'What’s on in Bjorli',
      lead: 'From ski festivals and races on the slopes to local food days and family events – more happens in Bjorli than many expect. The overview is updated through the season.',
      supporting: 'Combine an event with an overnight stay, and check the webcams before you head out.',
    },
    de: {
      h1: 'Veranstaltungen in Bjorli',
      lead: 'Von Skifestivals und Rennen an der Piste bis zu lokalen Markttagen und Familienfesten – in Bjorli ist mehr los, als viele erwarten. Die Übersicht wird über die Saison laufend aktualisiert.',
      supporting: 'Verbinden Sie eine Veranstaltung mit einer Übernachtung – und werfen Sie vorher einen Blick auf die Webcams.',
    },
    nl: {
      h1: 'Evenementen in Bjorli',
      lead: 'Van skifestivals en wedstrijden op de piste tot lokale food-dagen en familie-evenementen – er gebeurt meer in Bjorli dan veel mensen verwachten. Het overzicht wordt gedurende het seizoen bijgewerkt.',
      supporting: 'Combineer een evenement met een overnachting, en check de webcams voordat je vertrekt.',
    },
    da: {
      h1: 'Det sker på Bjorli',
      lead: 'Fra skifestivaler og konkurrencer i bakken til lokale maddage og familiearrangementer – der sker mere på Bjorli, end mange regner med. Oversigten opdateres gennem sæsonen.',
      supporting: 'Kombinér et arrangement med en overnatning, og tjek vejret på webcam, inden du kører.',
    },
    sv: {
      h1: 'På gång på Bjorli',
      lead: 'Från skidfestivaler och tävlingar i backen till lokala matdagar och familjeevenemang – det händer mer på Bjorli än många väntar sig. Översikten uppdateras under säsongen.',
      supporting: 'Kombinera gärna ett evenemang med en övernattning, och kolla vädret på webbkamera innan du åker.',
    },
  },

  sykling: {
    no: {
      h1: 'Sykling på Bjorli og i Romsdalen',
      lead: 'Grusveier over Lesjaskogen, stier i fjellbjørkeskogen og landevei nedover Romsdalen – sykkelterrenget rundt Bjorli er variert og stort sett fritt for trafikk. Raumabanen gjør det enkelt å ta toget én vei og sykle den andre.',
      supporting: 'Kombiner gjerne med fottur eller fiske, eller legg turen mot Dovrefjell.',
    },
    en: {
      h1: 'Cycling in Bjorli and Romsdalen',
      lead: 'Gravel roads across Lesjaskogen, trails through the mountain birch forest and tarmac descending Romsdalen – the riding around Bjorli is varied and mostly free of traffic. The Rauma Line makes it easy to take the train one way and ride the other.',
      supporting: 'Combine it with a hike or some fishing, or point the bike towards Dovrefjell.',
    },
    de: {
      h1: 'Radfahren in Bjorli und Romsdal',
      lead: 'Schotterwege über den Lesjaskogen, Pfade durch den Fjellbirkenwald und Asphalt hinunter durchs Romsdal – das Terrain rund um Bjorli ist abwechslungsreich und weitgehend verkehrsfrei. Mit der Raumabahn fährt man bequem eine Strecke Zug und radelt die andere.',
      supporting: 'Lässt sich gut mit Wandern oder Angeln verbinden – oder Sie nehmen Kurs auf das Dovrefjell.',
    },
    nl: {
      h1: 'Fietsen in Bjorli en Romsdalen',
      lead: 'Gravelwegen over Lesjaskogen, paden door het berkenbos en asfalt omlaag door Romsdalen – het fietsterrein rond Bjorli is gevarieerd en grotendeels verkeersvrij. Dankzij de Raumabanen neem je makkelijk de trein heen en fiets je terug.',
      supporting: 'Goed te combineren met een wandeling of een dag vissen – of zet koers naar Dovrefjell.',
    },
    da: {
      h1: 'Cykling på Bjorli og i Romsdalen',
      lead: 'Grusveje over Lesjaskogen, stier i fjeldbirkeskoven og landevej ned gennem Romsdalen – cykelterrænet omkring Bjorli er varieret og stort set fri for trafik. Raumabanen gør det nemt at tage toget den ene vej og cykle den anden.',
      supporting: 'Kombinér gerne med en vandretur eller fiskeri, eller sæt kursen mod Dovrefjell.',
    },
    sv: {
      h1: 'Cykling på Bjorli och i Romsdalen',
      lead: 'Grusvägar över Lesjaskogen, stigar i fjällbjörkskogen och landsväg nedför Romsdalen – cykelterrängen runt Bjorli är varierad och i stort sett trafikfri. Raumabanan gör det enkelt att ta tåget ena vägen och cykla den andra.',
      supporting: 'Kombinera gärna med vandring eller fiske, eller styr mot Dovrefjell.',
    },
  },

  fotturer: {
    no: {
      h1: 'Fotturer fra Bjorli',
      lead: 'Fra Bjorli går stiene rett inn i Reinheimen – et av Norges største villmarksområder. Her finner du alt fra korte familieturer til Sagelva og rundt Lesjaskogsvatnet, til lange dagsturer i høyfjellet.',
      supporting: 'Ta med fiskestang, eller kombiner turen med sykkel. Turforslag finner du på aktivitetssidene.',
    },
    en: {
      h1: 'Hiking from Bjorli',
      lead: 'From Bjorli the trails lead straight into Reinheimen – one of Norway’s largest wilderness areas. There is everything from short family walks to Sagelva and around Lesjaskogsvatnet, to long day hikes in the high mountains.',
      supporting: 'Bring a fishing rod, or combine the hike with a bike ride. Route suggestions are on the activity pages.',
    },
    de: {
      h1: 'Wandern ab Bjorli',
      lead: 'Von Bjorli führen die Pfade direkt ins Reinheimen – eines der größten Wildnisgebiete Norwegens. Das Angebot reicht von kurzen Familienrunden zur Sagelva und um den Lesjaskogsvatnet bis zu langen Tagestouren im Hochgebirge.',
      supporting: 'Angelrute einpacken oder die Tour mit dem Rad kombinieren – Tourenvorschläge finden Sie auf den Aktivitätsseiten.',
    },
    nl: {
      h1: 'Wandelen vanuit Bjorli',
      lead: 'Vanuit Bjorli lopen de paden rechtstreeks het Reinheimen in – een van de grootste wildernisgebieden van Noorwegen. Je vindt er alles van korte gezinswandelingen naar Sagelva en rond Lesjaskogsvatnet tot lange dagtochten in het hooggebergte.',
      supporting: 'Neem een hengel mee, of combineer de wandeling met een fietstocht. Routesuggesties staan op de activiteitenpagina’s.',
    },
    da: {
      h1: 'Vandreture fra Bjorli',
      lead: 'Fra Bjorli går stierne direkte ind i Reinheimen – et af Norges største vildmarksområder. Her er alt fra korte familieture til Sagelva og rundt om Lesjaskogsvatnet til lange dagsture i højfjeldet.',
      supporting: 'Tag fiskestangen med, eller kombinér turen med cykling. Turforslag finder du på aktivitetssiderne.',
    },
    sv: {
      h1: 'Vandring från Bjorli',
      lead: 'Från Bjorli går stigarna rakt in i Reinheimen – ett av Norges största vildmarksområden. Här finns allt från korta familjeturer till Sagelva och runt Lesjaskogsvatnet, till långa dagsturer i högfjället.',
      supporting: 'Ta med fiskespöt, eller kombinera vandringen med cykel. Turförslag hittar du på aktivitetssidorna.',
    },
  },

  fiske: {
    no: {
      h1: 'Fiske på Bjorli og i Lesja',
      lead: 'Ørret i fjellvann, fluefiskesoner i elva og enkel tilgang på fiskekort – Lesja er et av de mest tilgjengelige fiskeområdene i fjell-Norge. Lesjaskogsvatnet og Rauma ligger begge få minutter fra Bjorli.',
      supporting: 'Mange kombinerer fisket med fottur eller sykkeltur – vannene ligger tett i terrenget rundt Bjorli.',
    },
    en: {
      h1: 'Fishing in Bjorli and Lesja',
      lead: 'Trout in mountain lakes, fly-fishing zones in the river and fishing licences that are easy to get hold of – Lesja is one of the most accessible fishing areas in the Norwegian mountains. Lesjaskogsvatnet and the Rauma are both a few minutes from Bjorli.',
      supporting: 'Many combine the fishing with a hike or a bike ride – the lakes lie close together in the terrain around Bjorli.',
    },
    de: {
      h1: 'Angeln in Bjorli und Lesja',
      lead: 'Forellen in Bergseen, Fliegenfischzonen im Fluss und Angelkarten ohne Umstände – Lesja gehört zu den zugänglichsten Angelrevieren der norwegischen Berge. Lesjaskogsvatnet und die Rauma liegen beide nur wenige Minuten von Bjorli entfernt.',
      supporting: 'Viele verbinden das Angeln mit einer Wanderung oder Radtour – die Seen liegen dicht beieinander rund um Bjorli.',
    },
    nl: {
      h1: 'Vissen in Bjorli en Lesja',
      lead: 'Forel in bergmeren, vliegviszones in de rivier en visvergunningen die je zo geregeld hebt – Lesja is een van de toegankelijkste visgebieden in de Noorse bergen. Lesjaskogsvatnet en de Rauma liggen allebei op een paar minuten van Bjorli.',
      supporting: 'Veel mensen combineren het vissen met een wandeling of fietstocht – de meren liggen dicht bij elkaar in het terrein rond Bjorli.',
    },
    da: {
      h1: 'Fiskeri på Bjorli og i Lesja',
      lead: 'Ørred i fjeldsøer, fluefiskezoner i elven og fiskekort, der er nemme at få fat i – Lesja er et af de mest tilgængelige fiskeområder i det norske fjeld. Lesjaskogsvatnet og Rauma ligger begge få minutter fra Bjorli.',
      supporting: 'Mange kombinerer fiskeriet med en vandre- eller cykeltur – søerne ligger tæt i terrænet omkring Bjorli.',
    },
    sv: {
      h1: 'Fiske på Bjorli och i Lesja',
      lead: 'Öring i fjällsjöar, flugfiskezoner i älven och fiskekort som är lätta att få tag på – Lesja är ett av de mest tillgängliga fiskeområdena i de norska fjällen. Lesjaskogsvatnet och Rauma ligger båda några minuter från Bjorli.',
      supporting: 'Många kombinerar fisket med en vandring eller cykeltur – vattnen ligger tätt i terrängen runt Bjorli.',
    },
  },

  familie: {
    no: {
      h1: 'Familieferie på Bjorli',
      lead: 'Bjorli er lagt til rette for barnefamilier: eget barneområde og skiskole i skisenteret om vinteren, korte fotturer, badekulper i Sagelva og gårdsbesøk i Lesja om sommeren. Avstandene er små, så dagene blir enkle å planlegge.',
      supporting: 'Se aktivitetene, finn overnatting med plass til hele familien, og sjekk hva som skjer mens dere er her.',
    },
    en: {
      h1: 'Family holidays in Bjorli',
      lead: 'Bjorli is set up for families: a dedicated children’s area and ski school at the resort in winter, short walks, the bathing pools at Sagelva and farm visits in Lesja in summer. Distances are short, which keeps the days easy to plan.',
      supporting: 'Browse the activities, find accommodation with room for the whole family, and see what’s on while you are here.',
    },
    de: {
      h1: 'Familienurlaub in Bjorli',
      lead: 'Bjorli ist auf Familien eingestellt: eigener Kinderbereich und Skischule im Skigebiet im Winter, kurze Wanderungen, die Badegumpen der Sagelva und Hofbesuche in Lesja im Sommer. Die Wege sind kurz – das macht die Tagesplanung einfach.',
      supporting: 'Stöbern Sie durch die Aktivitäten, finden Sie eine Unterkunft mit Platz für die ganze Familie und schauen Sie, was während Ihres Aufenthalts los ist.',
    },
    nl: {
      h1: 'Gezinsvakantie in Bjorli',
      lead: 'Bjorli is ingericht op gezinnen: een eigen kinderzone en skischool in het skigebied in de winter, korte wandelingen, de zwemkommen van Sagelva en boerderijbezoek in Lesja in de zomer. De afstanden zijn klein, dus de dagen zijn makkelijk te plannen.',
      supporting: 'Bekijk de activiteiten, zoek een accommodatie met ruimte voor het hele gezin en kijk wat er te doen is tijdens jullie verblijf.',
    },
    da: {
      h1: 'Familieferie på Bjorli',
      lead: 'Bjorli er indrettet til børnefamilier: eget børneområde og skiskole i skicentret om vinteren, korte vandreture, badehullerne i Sagelva og gårdsbesøg i Lesja om sommeren. Afstandene er små, så dagene er nemme at planlægge.',
      supporting: 'Se aktiviteterne, find overnatning med plads til hele familien, og tjek hvad der sker, mens I er her.',
    },
    sv: {
      h1: 'Familjesemester på Bjorli',
      lead: 'Bjorli är anpassat för barnfamiljer: eget barnområde och skidskola på anläggningen på vintern, korta vandringar, badhöljorna i Sagelva och gårdsbesök i Lesja på sommaren. Avstånden är korta, så dagarna blir enkla att planera.',
      supporting: 'Se aktiviteterna, hitta boende med plats för hela familjen och kolla vad som är på gång medan ni är här.',
    },
  },

  overnatting: {
    no: {
      h1: 'Overnatting på Bjorli',
      lead: 'På Bjorli bor du tett på både skisenteret og fjellet – i hytte, leilighet, hotell eller på camping. Mange av hyttene har ski inn/ski ut eller kort vei til løypenettet, og om sommeren er de samme hyttene base for tur- og fiskeferie.',
      supporting: 'Se aktivitetene i området og dagens forhold på webkamera når du planlegger oppholdet.',
    },
    en: {
      h1: 'Where to stay in Bjorli',
      lead: 'In Bjorli you stay close to both the ski resort and the mountains – in a cabin, apartment, hotel or at the campsite. Many cabins are ski in/ski out or a short way from the trail network, and in summer the same cabins become bases for hiking and fishing holidays.',
      supporting: 'Have a look at the activities nearby and today’s conditions on the webcams while planning your stay.',
    },
    de: {
      h1: 'Übernachten in Bjorli',
      lead: 'In Bjorli wohnt man nah an Skigebiet und Berg zugleich – in der Hütte, im Apartment, im Hotel oder auf dem Campingplatz. Viele Hütten liegen ski-in/ski-out oder nur wenige Schritte vom Loipennetz, und im Sommer werden dieselben Hütten zur Basis für Wander- und Angelurlaub.',
      supporting: 'Schauen Sie sich bei der Planung die Aktivitäten in der Umgebung und die aktuellen Bedingungen auf den Webcams an.',
    },
    nl: {
      h1: 'Overnachten in Bjorli',
      lead: 'In Bjorli verblijf je dicht bij zowel het skigebied als de bergen – in een hut, appartement, hotel of op de camping. Veel hutten liggen ski-in/ski-out of vlak bij het loipenetwerk, en in de zomer zijn dezelfde hutten de basis voor wandel- en visvakanties.',
      supporting: 'Bekijk de activiteiten in de omgeving en de omstandigheden van vandaag op de webcams terwijl je je verblijf plant.',
    },
    da: {
      h1: 'Overnatning på Bjorli',
      lead: 'På Bjorli bor du tæt på både skicentret og fjeldet – i hytte, lejlighed, hotel eller på camping. Mange af hytterne ligger ski ind/ski ud eller kort fra løjpenettet, og om sommeren er de samme hytter base for vandre- og fiskeferie.',
      supporting: 'Se aktiviteterne i området og dagens forhold på webcam, når du planlægger opholdet.',
    },
    sv: {
      h1: 'Boende på Bjorli',
      lead: 'På Bjorli bor du nära både skidanläggningen och fjället – i stuga, lägenhet, hotell eller på camping. Många stugor ligger ski-in/ski-out eller nära spårsystemet, och på sommaren blir samma stugor bas för vandrings- och fiskesemester.',
      supporting: 'Titta på aktiviteterna i området och dagens förhållanden på webbkamera när du planerar vistelsen.',
    },
  },

  skisenter: {
    no: {
      h1: 'Bjorli Skisenter',
      lead: 'Bjorli Skisenter ligger værbeskyttet øverst i Gudbrandsdalen, på grensen til Romsdalen, og er ofte blant de første alpinanleggene i Norge som åpner. Nedfarter for alle nivåer, eget barneområde, skiskole og skiutleie ved bunnstasjonen – og Heiskroa når beina trenger pause.',
      supporting: 'Toget stopper på Bjorli stasjon, noen minutters gange fra bakken. Kjører du, ligger anlegget rett ved E136 med parkering på P1 og P2.',
    },
    en: {
      h1: 'Bjorli Skisenter – the ski resort',
      lead: 'Bjorli Skisenter sits sheltered at the top of Gudbrandsdalen, on the border of Romsdalen, and is often among the first alpine resorts in Norway to open. Runs for every level, a dedicated children’s area, ski school and rental at the base station – and Heiskroa for when your legs need a break.',
      supporting: 'The train stops at Bjorli station, a few minutes’ walk from the slopes. Driving? The resort is right off the E136 with parking at P1 and P2.',
    },
    de: {
      h1: 'Bjorli Skisenter – das Skigebiet',
      lead: 'Das Bjorli Skisenter liegt wettergeschützt am oberen Ende des Gudbrandsdalen, an der Grenze zum Romsdalen, und gehört oft zu den ersten Alpingebieten Norwegens, die öffnen. Abfahrten für jedes Niveau, eigener Kinderbereich, Skischule und Verleih an der Talstation – und das Heiskroa, wenn die Beine eine Pause brauchen.',
      supporting: 'Der Zug hält am Bahnhof Bjorli, wenige Gehminuten von der Piste. Mit dem Auto: Das Gebiet liegt direkt an der E136, geparkt wird auf P1 und P2.',
    },
    nl: {
      h1: 'Bjorli Skisenter – het skigebied',
      lead: 'Bjorli Skisenter ligt beschut boven in Gudbrandsdalen, aan de grens met Romsdalen, en is vaak een van de eerste skigebieden van Noorwegen die opengaan. Afdalingen voor elk niveau, een eigen kinderzone, skischool en verhuur bij het basisstation – en Heiskroa voor als je benen even rust nodig hebben.',
      supporting: 'De trein stopt op station Bjorli, een paar minuten lopen van de piste. Kom je met de auto? Het gebied ligt direct aan de E136, met parkeren op P1 en P2.',
    },
    da: {
      h1: 'Bjorli Skisenter – skicentret',
      lead: 'Bjorli Skisenter ligger i læ øverst i Gudbrandsdalen, på grænsen til Romsdalen, og er ofte blandt de første alpinanlæg i Norge, der åbner. Pister til alle niveauer, eget børneområde, skiskole og skiudlejning ved bundstationen – og Heiskroa, når benene trænger til en pause.',
      supporting: 'Toget stopper på Bjorli station, få minutters gang fra bakken. Kører du selv, ligger anlægget lige ved E136 med parkering på P1 og P2.',
    },
    sv: {
      h1: 'Bjorli Skisenter – skidanläggningen',
      lead: 'Bjorli Skisenter ligger skyddat överst i Gudbrandsdalen, vid gränsen till Romsdalen, och är ofta bland de första alpinanläggningarna i Norge som öppnar. Nedfarter för alla nivåer, eget barnområde, skidskola och uthyrning vid bottenstationen – och Heiskroa när benen behöver en paus.',
      supporting: 'Tåget stannar på Bjorli station, några minuters promenad från backen. Kör du bil ligger anläggningen precis vid E136 med parkering på P1 och P2.',
    },
  },

  'mat-og-drikke': {
    no: {
      h1: 'Mat og drikke på Bjorli',
      lead: 'Heiskroa ved bunnstasjonen i skisenteret er det naturlige stoppet for fjellmat og afterski om vinteren. I tillegg finner du kafeer og spisesteder på og rundt Bjorli – og i Lesja er kortreist mat fra fjellgårdene en del av opplevelsen.',
      supporting: 'Skal du lage maten selv, finner du dagligvarer og det praktiske på handelssiden.',
    },
    en: {
      h1: 'Food and drink in Bjorli',
      lead: 'Heiskroa at the base station is the natural stop for mountain food and after-ski in winter. Beyond that there are cafés and places to eat in and around Bjorli – and in Lesja, local food from the mountain farms is part of the experience.',
      supporting: 'Cooking for yourself? There are grocery shops and practical services close by.',
    },
    de: {
      h1: 'Essen und Trinken in Bjorli',
      lead: 'Das Heiskroa an der Talstation ist im Winter der natürliche Stopp für Bergküche und Après-Ski. Dazu kommen Cafés und Lokale in und um Bjorli – und in Lesja gehört regionale Küche von den Bergbauernhöfen zum Erlebnis.',
      supporting: 'Wer selbst kocht: Lebensmittelgeschäfte und alles Praktische liegen in der Nähe.',
    },
    nl: {
      h1: 'Eten en drinken in Bjorli',
      lead: 'Heiskroa bij het basisstation is in de winter dé stop voor bergkost en après-ski. Daarnaast vind je cafés en eetgelegenheden in en rond Bjorli – en in Lesja hoort streeketen van de bergboerderijen bij de ervaring.',
      supporting: 'Kook je zelf? Supermarkt en praktische winkels zijn vlakbij.',
    },
    da: {
      h1: 'Mad og drikke på Bjorli',
      lead: 'Heiskroa ved bundstationen er om vinteren det naturlige stop for fjeldmad og afterski. Derudover finder du caféer og spisesteder på og omkring Bjorli – og i Lesja er lokal mad fra fjeldgårdene en del af oplevelsen.',
      supporting: 'Laver du selv maden, ligger dagligvarer og det praktiske lige i nærheden.',
    },
    sv: {
      h1: 'Mat och dryck på Bjorli',
      lead: 'Heiskroa vid bottenstationen är vinterns självklara stopp för fjällmat och afterski. Utöver det finns kaféer och matställen på och runt Bjorli – och i Lesja är närproducerat från fjällgårdarna en del av upplevelsen.',
      supporting: 'Lagar du maten själv finns livsmedel och det praktiska nära till hands.',
    },
  },

  handel: {
    no: {
      h1: 'Butikker og handel på Bjorli',
      lead: 'Det praktiske er på plass på Bjorli: dagligvarer, sportsbutikk med skiservice og bensinstasjon ligger langs E136, kort vei fra både skisenteret og hyttefeltene.',
      supporting: 'Mangler du noe til hytta eller turen, er det som regel raskere å handle lokalt enn å kjøre til Dombås eller Åndalsnes.',
    },
  },

  kontakt: {
    no: {
      h1: 'Kontakt Destinasjon Bjorli',
      lead: 'Lurer du på noe om Bjorli Skisenter, arrangementer eller området? Her finner du telefon, e-post og adresse til Destinasjon Bjorli – og svar på det mest praktiske.',
      supporting: 'Mye er allerede samlet på nettsidene: overnatting, aktiviteter og dagens forhold på webkamera.',
    },
    en: {
      h1: 'Contact Destinasjon Bjorli',
      lead: 'Questions about Bjorli Skisenter, events or the area? Here you’ll find phone, email and address for Destinasjon Bjorli – and answers to the most common practical questions.',
      supporting: 'Much of it is already on the site: accommodation, activities and today’s conditions on the webcams.',
    },
    de: {
      h1: 'Kontakt zu Destinasjon Bjorli',
      lead: 'Fragen zum Bjorli Skisenter, zu Veranstaltungen oder zur Region? Hier finden Sie Telefon, E-Mail und Adresse von Destinasjon Bjorli – und Antworten auf das Praktischste.',
      supporting: 'Vieles steht bereits auf der Website: Unterkünfte, Aktivitäten und die aktuellen Bedingungen auf den Webcams.',
    },
    nl: {
      h1: 'Contact met Destinasjon Bjorli',
      lead: 'Vragen over Bjorli Skisenter, evenementen of de omgeving? Hier vind je telefoon, e-mail en adres van Destinasjon Bjorli – en antwoorden op de meest praktische vragen.',
      supporting: 'Veel staat al op de site: accommodatie, activiteiten en de omstandigheden van vandaag op de webcams.',
    },
    da: {
      h1: 'Kontakt Destinasjon Bjorli',
      lead: 'Har du spørgsmål om Bjorli Skisenter, arrangementer eller området? Her finder du telefon, e-mail og adresse på Destinasjon Bjorli – og svar på det mest praktiske.',
      supporting: 'Meget er allerede samlet på siderne: overnatning, aktiviteter og dagens forhold på webcam.',
    },
    sv: {
      h1: 'Kontakta Destinasjon Bjorli',
      lead: 'Undrar du något om Bjorli Skisenter, evenemang eller området? Här hittar du telefon, e-post och adress till Destinasjon Bjorli – och svar på det mest praktiska.',
      supporting: 'Mycket finns redan samlat på sidorna: boende, aktiviteter och dagens förhållanden på webbkamera.',
    },
  },
};

/**
 * Resolve canonical (NO) path → lead entry for the requested locale.
 * Same lookup rules as `seoForCanonicalPath`: exact sub-path first, then
 * the top-level segment. Returns null when no entry exists — callers fall
 * back to the previous behaviour (meta description as body paragraph).
 */
export const leadForCanonicalPath = (
  canonicalPath: string,
  locale: Locale,
): RouteLeadEntry | null => {
  if (canonicalPath === '/') return ROUTE_LEADS.home?.[locale] ?? null;
  const trimmed = canonicalPath.replace(/^\//, '');
  return (
    ROUTE_LEADS[trimmed]?.[locale] ?? ROUTE_LEADS[trimmed.split('/')[0]]?.[locale] ?? null
  );
};
