/**
 * Per-route SEO metadata registry — invisible SEO layer.
 *
 * Provides localized seoTitle + seoDescription for every canonical route,
 * in all six supported languages. Consumed by `SEOHead` to override the
 * generic locale defaults whenever the user is on a known static page.
 *
 * Rules:
 *   - "Bjorli" appears prominently and naturally in every entry.
 *   - International languages (en/de/nl/da/sv) include "Norway" / localized
 *     equivalent where natural.
 *   - Language is careful: "often among the first to open", "snow-sure",
 *     "easy to reach", "a good base for". No overclaims, no fake ratings,
 *     no invented prices or hours.
 *   - Descriptions are written for humans first, not keyword-stuffed.
 *
 * When `resolveSeoForRoute` returns a CMS entry (news / tip / event /
 * activity detail), that takes precedence over this registry. This file
 * covers the static destination pages.
 */
import type { CanonicalRoute } from '@/i18n/routes';
import type { Locale } from '@/i18n/locales/types';
import {
  SKI_HOLIDAY_NORWAY_SEO,
  SKI_HOLIDAY_NORWAY_SLUG,
} from '@/lib/seo/skiHolidayNorwaySeo';

export interface RouteSeoEntry {
  title: string;
  description: string;
}

type RouteSeoMap = Partial<Record<CanonicalRoute, Record<Locale, RouteSeoEntry>>>;

export const ROUTE_SEO: RouteSeoMap = {
  home: {
    no: {
      // Summer-first while DEFAULT_SEASON === 'summer' (src/lib/season.ts).
      // Restore the winter-leaning copy when switching back in mid-September.
      title: 'Bjorli – sommer, vinter og fjellopplevelser',
      description:
        'Opplev Bjorli øverst i Gudbrandsdalen, ved grensen til Romsdalen. Finn alpint, langrenn, fotturer, sykling, fiske, overnatting og arrangementer.',
    },
    en: {
      title: 'Bjorli – summer, winter and mountain experiences',
      description:
        'Bjorli lies in the upper part of Gudbrandsdalen, right by the Romsdalen border. Skiing, hiking, cycling, fishing, places to stay and events all year.',
    },
    de: {
      title: 'Bjorli – Sommer, Winter und Bergerlebnisse',
      description:
        'Bjorli liegt im oberen Gudbrandsdalen, direkt an der Grenze zum Romsdalen. Ski, Langlauf, Wandern, Radfahren, Angeln, Unterkünfte und Veranstaltungen.',
    },
    nl: {
      title: 'Bjorli – zomer, winter en bergbelevingen',
      description:
        'Bjorli ligt boven in Gudbrandsdalen, direct aan de grens met Romsdalen. Skiën, langlaufen, wandelen, fietsen, vissen, overnachten en evenementen.',
    },
    da: {
      title: 'Bjorli – sommer, vinter og fjeldoplevelser',
      description:
        'Oplev Bjorli øverst i Gudbrandsdalen, ved grænsen til Romsdalen. Find alpint, langrend, vandreture, cykling, fiskeri, overnatning og arrangementer.',
    },
    sv: {
      title: 'Bjorli – sommar, vinter och fjällupplevelser',
      description:
        'Upplev Bjorli högst upp i Gudbrandsdalen, vid gränsen till Romsdalen. Alpint, längdåkning, vandring, cykling, fiske, boende och evenemang.',
    },
  },

  vinter: {
    no: { title: 'Vinter på Bjorli – alpint, langrenn og snøsikre dager', description: 'Planlegg vinterferien på Bjorli med alpint, langrenn, skiskole og skiutleie. Se heiskort, åpningstider, vær, webkamera, aktiviteter og overnatting.' },
    en: { title: 'Winter in Bjorli – alpine, cross-country and snow-sure days', description: 'Plan your winter holiday in Bjorli with alpine skiing, cross-country, ski school and rental. Lift passes, opening hours, weather, webcams and places to stay.' },
    de: { title: 'Winter in Bjorli – Alpin, Langlauf und schneesichere Tage', description: 'Planen Sie den Winterurlaub in Bjorli mit Alpinski, Langlauf, Skischule und Verleih. Skipässe, Öffnungszeiten, Wetter, Webcams, Aktivitäten und Unterkünfte.' },
    nl: { title: 'Winter in Bjorli – alpineskiën, langlaufen en sneeuwzekere dagen', description: 'Plan je wintervakantie in Bjorli met alpineskiën, langlaufen, skischool en verhuur. Skipassen, openingstijden, weer, webcams, activiteiten en overnachten.' },
    da: { title: 'Vinter på Bjorli – alpint, langrend og snesikre dage', description: 'Planlæg vinterferien på Bjorli med alpint, langrend, skiskole og skiudlejning. Se liftkort, åbningstider, vejr, webcam, aktiviteter og overnatning.' },
    sv: { title: 'Vinter på Bjorli – alpint, längdåkning och snösäkra dagar', description: 'Planera vintersemestern på Bjorli med alpint, längdåkning, skidskola och uthyrning. Se liftkort, öppettider, väder, webbkamera, aktiviteter och boende.' },
  },

  sommer: {
    no: { title: 'Sommer på Bjorli – fotturer, sykling og fiske', description: 'Opplev sommeren på Bjorli med fotturer, sykling, fiske og familieaktiviteter. Finn turforslag, overnatting og utflukter i Gudbrandsdalen og Romsdalen.' },
    en: { title: 'Summer in Bjorli – hiking, cycling and fishing', description: 'Spend summer in Bjorli with hiking, cycling, fishing and family days out. Route ideas, places to stay and trips into Gudbrandsdalen and Romsdalen.' },
    de: { title: 'Sommer in Bjorli – Wandern, Radfahren und Angeln', description: 'Erleben Sie den Sommer in Bjorli mit Wandern, Radfahren, Angeln und Familienaktivitäten. Tourenideen, Unterkünfte und Ausflüge in Gudbrandsdalen und Romsdalen.' },
    nl: { title: 'Zomer in Bjorli – wandelen, fietsen en vissen', description: 'Beleef de zomer in Bjorli met wandelen, fietsen, vissen en gezinsactiviteiten. Routetips, overnachtingen en uitstapjes in Gudbrandsdalen en Romsdalen.' },
    da: { title: 'Sommer på Bjorli – vandreture, cykling og fiskeri', description: 'Oplev sommeren på Bjorli med vandreture, cykling, fiskeri og familieaktiviteter. Find turforslag, overnatning og udflugter i Gudbrandsdalen og Romsdalen.' },
    sv: { title: 'Sommar på Bjorli – vandring, cykling och fiske', description: 'Upplev sommaren på Bjorli med vandring, cykling, fiske och familjeaktiviteter. Hitta turförslag, boende och utflykter i Gudbrandsdalen och Romsdalen.' },
  },

  skisenter: {
    no: { title: 'Bjorli Skisenter – alpint, heiskort og skiskole', description: 'Snøsikkert alpinanlegg øverst i Gudbrandsdalen, ved grensen til Romsdalen. Se bakker, barneområde, skiskole, skiutleie, åpningstider og heiskort.' },
    en: { title: 'Bjorli Skisenter – alpine skiing, lift passes, ski school', description: 'A snow-sure ski area in the upper part of Gudbrandsdalen, by the Romsdalen border. Slopes, children’s area, ski school, rental, opening hours and lift passes.' },
    de: { title: 'Bjorli Skisenter – Alpinski, Skipässe und Skischule', description: 'Schneesicheres Skigebiet im oberen Gudbrandsdalen, an der Grenze zum Romsdalen. Pisten, Kinderland, Skischule, Verleih, Öffnungszeiten und Skipässe.' },
    nl: { title: 'Bjorli Skisenter – alpineskiën, skipassen en skischool', description: 'Sneeuwzeker skigebied boven in Gudbrandsdalen, aan de grens met Romsdalen. Pistes, kinderland, skischool, verhuur, openingstijden en skipassen.' },
    da: { title: 'Bjorli Skisenter – alpint, liftkort og skiskole', description: 'Snesikkert alpinanlæg øverst i Gudbrandsdalen, ved grænsen til Romsdalen. Se pister, børneområde, skiskole, skiudlejning, åbningstider og liftkort.' },
    sv: { title: 'Bjorli Skisenter – alpint, liftkort och skidskola', description: 'Snösäker skidanläggning högst upp i Gudbrandsdalen, vid gränsen till Romsdalen. Backar, barnområde, skidskola, uthyrning, öppettider och liftkort.' },
  },

  heiskort: {
    no: { title: 'Heiskort til Bjorli Skisenter – priser og kjøp', description: 'Kjøp heiskort til Bjorli Skisenter. Finn dagskort, flerdagskort og sesongkort, se priser og praktisk informasjon, og gjør deg klar før dagen i bakken.' },
    en: { title: 'Lift passes for Bjorli Skisenter – prices and purchase', description: 'Buy lift passes for Bjorli Skisenter. Day passes, multi-day and season passes, prices and practical details so you are ready before the day on the slopes.' },
    de: { title: 'Skipässe für das Bjorli Skisenter – Preise und Kauf', description: 'Kaufen Sie Skipässe für das Bjorli Skisenter. Tages-, Mehrtages- und Saisonpässe, Preise und praktische Hinweise für einen reibungslosen Skitag.' },
    nl: { title: 'Skipassen voor Bjorli Skisenter – prijzen en kopen', description: 'Koop skipassen voor Bjorli Skisenter. Dagpassen, meerdaagse passen en seizoenpassen, prijzen en praktische info zodat je klaar bent voor de piste.' },
    da: { title: 'Liftkort til Bjorli Skisenter – priser og køb', description: 'Køb liftkort til Bjorli Skisenter. Find dagskort, flerdagskort og sæsonkort, se priser og praktisk information, og bliv klar før dagen i bakken.' },
    sv: { title: 'Liftkort till Bjorli Skisenter – priser och köp', description: 'Köp liftkort till Bjorli Skisenter. Hitta dagskort, flerdagarskort och säsongskort, se priser och praktisk information inför dagen i backen.' },
  },

  apningstider: {
    no: { title: 'Åpningstider – Bjorli', description: 'Åpningstider for Bjorli Skisenter, heiser, restaurant og butikker. Se siste oppdaterte informasjon på bjorli.no.' },
    en: { title: 'Opening hours – Bjorli, Norway', description: 'Opening hours for Bjorli Skisenter, lifts, restaurant and shops. See the latest information on bjorli.no.' },
    de: { title: 'Öffnungszeiten – Bjorli, Norwegen', description: 'Öffnungszeiten für das Bjorli Skisenter, Lifte, Restaurant und Geschäfte. Aktuelle Informationen auf bjorli.no.' },
    nl: { title: 'Openingstijden – Bjorli, Noorwegen', description: 'Openingstijden voor Bjorli Skisenter, liften, restaurant en winkels. Bekijk de laatste informatie op bjorli.no.' },
    da: { title: 'Åbningstider – Bjorli, Norge', description: 'Åbningstider for Bjorli Skisenter, lifte, restaurant og butikker. Se den nyeste information på bjorli.no.' },
    sv: { title: 'Öppettider – Bjorli, Norge', description: 'Öppettider för Bjorli Skisenter, liftar, restaurang och butiker. Se senaste informationen på bjorli.no.' },
  },

  'vaer-og-webkamera': {
    no: { title: 'Vær og webkamera – Bjorli', description: 'Se vær, snøforhold og live webkameraer fra Bjorli Skisenter og destinasjonen.' },
    en: { title: 'Weather and webcams – Bjorli, Norway', description: 'See weather, snow conditions and live webcams from Bjorli Skisenter and the destination.' },
    de: { title: 'Wetter und Webcams – Bjorli, Norwegen', description: 'Wetter, Schneebedingungen und Live-Webcams aus dem Bjorli Skisenter und der Region.' },
    nl: { title: 'Weer en webcams – Bjorli, Noorwegen', description: 'Bekijk weer, sneeuwcondities en live webcams van Bjorli Skisenter en de bestemming.' },
    da: { title: 'Vejr og webcams – Bjorli, Norge', description: 'Se vejr, sneforhold og live webcams fra Bjorli Skisenter og destinationen.' },
    sv: { title: 'Väder och webbkameror – Bjorli, Norge', description: 'Se väder, snöförhållanden och live-webbkameror från Bjorli Skisenter och destinationen.' },
  },

  livecams: {
    no: { title: 'Livecams – Bjorli', description: 'Følg været og forholdene live fra Bjorli via webkameraer.' },
    en: { title: 'Live webcams – Bjorli, Norway', description: 'Follow the weather and conditions live from Bjorli via webcams.' },
    de: { title: 'Live-Webcams – Bjorli, Norwegen', description: 'Verfolgen Sie Wetter und Bedingungen in Bjorli live über Webcams.' },
    nl: { title: 'Live webcams – Bjorli, Noorwegen', description: 'Bekijk weer en condities live in Bjorli via webcams.' },
    da: { title: 'Live webcams – Bjorli, Norge', description: 'Følg vejret og forholdene live fra Bjorli via webcams.' },
    sv: { title: 'Live webbkameror – Bjorli, Norge', description: 'Följ vädret och förhållandena live från Bjorli via webbkameror.' },
  },

  overnatting: {
    no: { title: 'Overnatting på Bjorli – hytter, leiligheter og hotell', description: 'Finn overnatting på Bjorli nær skisenteret, langrennsløyper og fjell. Velg mellom hytter, leiligheter, hotell og camping for sommer- og vinterferie.' },
    en: { title: 'Accommodation in Bjorli – cabins, apartments and hotels', description: 'Find somewhere to stay in Bjorli, close to the ski centre, the cross-country trails and the mountains. Cabins, apartments, hotels and camping, all year.' },
    de: { title: 'Unterkunft in Bjorli – Hütten, Apartments und Hotels', description: 'Finden Sie eine Unterkunft in Bjorli, nahe Skizentrum, Langlaufloipen und Bergen. Hütten, Ferienwohnungen, Hotels und Camping für Sommer und Winter.' },
    nl: { title: 'Overnachten in Bjorli – hutten, appartementen en hotels', description: 'Vind een plek om te slapen in Bjorli, dicht bij het skicentrum, de langlaufloipes en de bergen. Hutten, appartementen, hotels en camping, zomer en winter.' },
    da: { title: 'Overnatning på Bjorli – hytter, lejligheder og hotel', description: 'Find overnatning på Bjorli nær skicentret, langrendsspor og fjeld. Vælg mellem hytter, lejligheder, hotel og camping til sommer- og vinterferie.' },
    sv: { title: 'Boende på Bjorli – stugor, lägenheter och hotell', description: 'Hitta boende på Bjorli nära skidanläggningen, längdspåren och fjället. Välj mellan stugor, lägenheter, hotell och camping för sommar och vinter.' },
  },

  aktiviteter: {
    no: { title: 'Aktiviteter på Bjorli og i Lesja – hele året', description: 'Finn aktiviteter på Bjorli og i Lesja året rundt: alpint, langrenn, fotturer, sykling, fiske, gårdsbesøk og familievennlige utflukter i fjellet.' },
    en: { title: 'Things to do in Bjorli and Lesja – all year round', description: 'Find things to do in Bjorli and Lesja year round: alpine and cross-country skiing, hiking, cycling, fishing, farm visits and family outings in the mountains.' },
    de: { title: 'Aktivitäten in Bjorli und Lesja – das ganze Jahr', description: 'Aktivitäten in Bjorli und Lesja rund ums Jahr: Alpinski, Langlauf, Wandern, Radfahren, Angeln, Hofbesuche und familienfreundliche Ausflüge in den Bergen.' },
    nl: { title: 'Activiteiten in Bjorli en Lesja – het hele jaar', description: 'Vind activiteiten in Bjorli en Lesja het hele jaar door: alpineskiën, langlaufen, wandelen, fietsen, vissen, boerderijbezoek en gezinsuitstapjes in de bergen.' },
    da: { title: 'Aktiviteter på Bjorli og i Lesja – hele året', description: 'Find aktiviteter på Bjorli og i Lesja året rundt: alpint, langrend, vandreture, cykling, fiskeri, gårdsbesøg og familievenlige udflugter i fjeldet.' },
    sv: { title: 'Aktiviteter på Bjorli och i Lesja – hela året', description: 'Hitta aktiviteter på Bjorli och i Lesja året runt: alpint, längdåkning, vandring, cykling, fiske, gårdsbesök och familjevänliga utflykter i fjället.' },
  },

  arrangementer: {
    no: { title: 'Arrangementer på Bjorli', description: 'Arrangementer, konkurranser og opplevelser på Bjorli gjennom året.' },
    en: { title: 'Events in Bjorli, Norway', description: 'Events, races and experiences in Bjorli throughout the year.' },
    de: { title: 'Veranstaltungen in Bjorli, Norwegen', description: 'Veranstaltungen, Rennen und Erlebnisse in Bjorli das ganze Jahr über.' },
    nl: { title: 'Evenementen in Bjorli, Noorwegen', description: 'Evenementen, wedstrijden en belevenissen in Bjorli het hele jaar door.' },
    da: { title: 'Arrangementer på Bjorli', description: 'Arrangementer, konkurrencer og oplevelser på Bjorli året rundt.' },
    sv: { title: 'Evenemang på Bjorli', description: 'Evenemang, tävlingar och upplevelser på Bjorli hela året.' },
  },

  tips: {
    no: { title: 'Tips og inspirasjon – Bjorli', description: 'Tips og inspirasjon for ferien på Bjorli – ski, langrenn, fotturer, familieaktiviteter og toget langs Raumabanen.' },
    en: { title: 'Tips and inspiration – Bjorli, Norway', description: 'Tips and inspiration for your Bjorli holiday – skiing, cross-country, hiking, family activities and the Rauma Line train.' },
    de: { title: 'Tipps und Inspiration – Bjorli, Norwegen', description: 'Tipps und Inspiration für Ihren Urlaub in Bjorli – Ski, Langlauf, Wandern, Familienaktivitäten und die Raumabahn.' },
    nl: { title: 'Tips en inspiratie – Bjorli, Noorwegen', description: 'Tips en inspiratie voor je vakantie in Bjorli – skiën, langlaufen, wandelen, familieactiviteiten en de Raumabanen.' },
    da: { title: 'Tips og inspiration – Bjorli', description: 'Tips og inspiration til ferien på Bjorli – ski, langrend, vandring, familie og toget på Raumabanen.' },
    sv: { title: 'Tips och inspiration – Bjorli', description: 'Tips och inspiration för semestern på Bjorli – skidåkning, längd, vandring, familj och tåget på Raumabanen.' },
  },

  nyheter: {
    no: { title: 'Nyheter – Bjorli', description: 'Nyheter, driftsmeldinger og oppdateringer fra Bjorli og Bjorli Skisenter.' },
    en: { title: 'News – Bjorli, Norway', description: 'News, operational updates and announcements from Bjorli and Bjorli Skisenter.' },
    de: { title: 'Neuigkeiten – Bjorli, Norwegen', description: 'Aktuelles und Betriebsmeldungen aus Bjorli und dem Bjorli Skisenter.' },
    nl: { title: 'Nieuws – Bjorli, Noorwegen', description: 'Nieuws en updates van Bjorli en Bjorli Skisenter.' },
    da: { title: 'Nyheder – Bjorli', description: 'Nyheder og driftsmeldinger fra Bjorli og Bjorli Skisenter.' },
    sv: { title: 'Nyheter – Bjorli', description: 'Nyheter och driftmeddelanden från Bjorli och Bjorli Skisenter.' },
  },

  'mat-og-drikke': {
    no: { title: 'Mat og drikke på Bjorli – spisesteder og lokale smaker', description: 'Finn spisesteder, kafeer og lokale smaker på Bjorli og i Lesja. Se hvor du kan spise, handle dagligvarer og oppleve kortreist mat fra fjellbygdene.' },
    en: { title: 'Food and drink in Bjorli – places to eat and local flavours', description: 'Find restaurants, cafés and local flavours in Bjorli and Lesja. See where to eat, shop for groceries and taste short-travelled food from the mountain villages.' },
    de: { title: 'Essen und Trinken in Bjorli – Lokale und regionale Küche', description: 'Restaurants, Cafés und regionale Küche in Bjorli und Lesja. Sehen Sie, wo Sie essen und einkaufen können und wo es Produkte aus den Bergdörfern gibt.' },
    nl: { title: 'Eten en drinken in Bjorli – restaurants en lokale smaken', description: 'Vind restaurants, cafés en lokale smaken in Bjorli en Lesja. Zie waar je kunt eten, boodschappen doen en streekproducten uit de bergdorpen kunt proeven.' },
    da: { title: 'Mad og drikke på Bjorli – spisesteder og lokale smage', description: 'Find spisesteder, caféer og lokale smage på Bjorli og i Lesja. Se hvor du kan spise, købe dagligvarer og opleve lokal mad fra fjeldbygderne.' },
    sv: { title: 'Mat och dryck på Bjorli – matställen och lokala smaker', description: 'Hitta matställen, kaféer och lokala smaker på Bjorli och i Lesja. Se var du kan äta, handla mat och uppleva närproducerat från fjällbygderna.' },
  },

  skiskole: {
    no: { title: 'Skiskole på Bjorli – kurs for alle nivåer', description: 'Skiskole på Bjorli med kurs for barn, voksne og nybegynnere. Lær alpint eller telemark med erfarne instruktører.' },
    en: { title: 'Ski school in Bjorli, Norway – lessons for all levels', description: 'Bjorli Ski School offers lessons for children, adults and beginners. Learn alpine or telemark with experienced instructors.' },
    de: { title: 'Skischule in Bjorli – Kurse für alle Niveaus', description: 'Skischule Bjorli mit Kursen für Kinder, Erwachsene und Anfänger. Alpin oder Telemark mit erfahrenen Lehrern.' },
    nl: { title: 'Skischool in Bjorli – lessen voor elk niveau', description: 'Skischool Bjorli met lessen voor kinderen, volwassenen en beginners. Alpine of telemark met ervaren instructeurs.' },
    da: { title: 'Skiskole på Bjorli – kurser for alle niveauer', description: 'Skiskole på Bjorli med kurser for børn, voksne og begyndere. Lær alpint eller telemark med erfarne instruktører.' },
    sv: { title: 'Skidskola på Bjorli – kurser för alla nivåer', description: 'Skidskola på Bjorli med kurser för barn, vuxna och nybörjare. Lär dig alpint eller telemark med erfarna instruktörer.' },
  },

  skiutleie: {
    no: { title: 'Skiutleie på Bjorli', description: 'Lei ski, snowboard og utstyr på Bjorli – moderne utstyr i alle størrelser, rett ved skisenteret.' },
    en: { title: 'Ski rental in Bjorli, Norway', description: 'Rent skis, snowboards and equipment in Bjorli – modern gear in all sizes, right next to the ski resort.' },
    de: { title: 'Skiverleih in Bjorli, Norwegen', description: 'Ski, Snowboard und Ausrüstung in Bjorli mieten – moderne Ausrüstung direkt am Skigebiet.' },
    nl: { title: 'Skiverhuur in Bjorli, Noorwegen', description: 'Huur ski’s, snowboards en uitrusting in Bjorli – moderne uitrusting direct naast het skigebied.' },
    da: { title: 'Skiudlejning på Bjorli', description: 'Lej ski, snowboard og udstyr på Bjorli – moderne udstyr lige ved skicentret.' },
    sv: { title: 'Skiduthyrning på Bjorli', description: 'Hyr skidor, snowboard och utrustning på Bjorli – modern utrustning intill skidcentret.' },
  },

  langrenn: {
    no: { title: 'Langrenn på Bjorli – preparerte løyper i høyfjellet', description: 'Langrenn på Bjorli med preparerte løyper i et snøsikkert høyfjellsterreng. Et godt utgangspunkt for klassisk og skøyting.' },
    en: { title: 'Cross-country skiing in Bjorli, Norway', description: 'Cross-country skiing in Bjorli with groomed trails in snow-sure mountain terrain – a strong base for both classic and skating.' },
    de: { title: 'Langlauf in Bjorli, Norwegen', description: 'Langlauf in Bjorli mit gespurten Loipen im schneesicheren Hochgebirge – guter Ausgangspunkt für Klassisch und Skating.' },
    nl: { title: 'Langlaufen in Bjorli, Noorwegen', description: 'Langlaufen in Bjorli met geprepareerde loipes in sneeuwzeker berggebied – sterke basis voor klassiek en skating.' },
    da: { title: 'Langrend på Bjorli', description: 'Langrend på Bjorli med præparerede spor i snøsikkert højfjeld – godt udgangspunkt for klassisk og skøjting.' },
    sv: { title: 'Längdåkning på Bjorli', description: 'Längdåkning på Bjorli med preparerade spår i snösäkert högfjäll – bra utgångspunkt för klassiskt och skate.' },
  },

  fotturer: {
    no: { title: 'Fotturer på Bjorli – Reinheimen og Romsdalen', description: 'Fotturer på Bjorli – ut i Reinheimen og Romsdalen med turer for hele familien og lengre dagsturer i fjellet.' },
    en: { title: 'Hiking in Bjorli, Norway – Reinheimen and Romsdalen', description: 'Hiking around Bjorli – into Reinheimen and Romsdalen, with easy family walks and longer mountain day hikes.' },
    de: { title: 'Wandern in Bjorli, Norwegen – Reinheimen und Romsdal', description: 'Wandern rund um Bjorli – im Reinheimen und Romsdal, mit Familienrouten und längeren Bergtouren.' },
    nl: { title: 'Wandelen in Bjorli, Noorwegen – Reinheimen en Romsdalen', description: 'Wandelen rond Bjorli – in Reinheimen en Romsdalen, met routes voor het hele gezin en langere dagtochten.' },
    da: { title: 'Vandring på Bjorli – Reinheimen og Romsdalen', description: 'Vandreture på Bjorli – ud i Reinheimen og Romsdalen med ture for hele familien og længere dagsture.' },
    sv: { title: 'Vandring på Bjorli – Reinheimen och Romsdalen', description: 'Vandring runt Bjorli – ut i Reinheimen och Romsdalen, för hela familjen och längre dagsturer.' },
  },

  sykling: {
    no: { title: 'Sykling på Bjorli og i Romsdalen', description: 'Sykling på Bjorli – grusveier, fjellruter og dagsturer i Romsdalen, Reinheimen og Dovrefjell.' },
    en: { title: 'Cycling in Bjorli, Norway and Romsdalen', description: 'Cycling around Bjorli – gravel roads, mountain routes and day rides in Romsdalen, Reinheimen and Dovrefjell.' },
    de: { title: 'Radfahren in Bjorli und Romsdal', description: 'Radfahren rund um Bjorli – Schotterstrassen, Bergrouten und Tagestouren in Romsdal, Reinheimen und Dovrefjell.' },
    nl: { title: 'Fietsen in Bjorli en Romsdalen', description: 'Fietsen rond Bjorli – grindwegen, bergroutes en dagtochten in Romsdalen, Reinheimen en Dovrefjell.' },
    da: { title: 'Cykling på Bjorli og i Romsdalen', description: 'Cykling på Bjorli – grusveje, fjeldruter og dagsture i Romsdalen, Reinheimen og Dovrefjell.' },
    sv: { title: 'Cykling på Bjorli och i Romsdalen', description: 'Cykling runt Bjorli – grusvägar, fjällrutter och dagsturer i Romsdalen, Reinheimen och Dovrefjell.' },
  },

  familie: {
    no: { title: 'Familieferie på Bjorli', description: 'Familieferie på Bjorli – barneområder, skiskole, korte avstander og rolige forhold gjør Bjorli til et godt valg for barnefamilier.' },
    en: { title: 'Family ski holidays in Bjorli, Norway', description: 'Family ski holidays in Bjorli – children’s areas, ski school, short distances and a calm atmosphere make Bjorli a good choice for families.' },
    de: { title: 'Familienurlaub in Bjorli, Norwegen', description: 'Familienurlaub in Bjorli – Kinderbereiche, Skischule, kurze Wege und ruhige Atmosphäre machen Bjorli ideal für Familien.' },
    nl: { title: 'Gezinsvakantie in Bjorli, Noorwegen', description: 'Gezinsvakantie in Bjorli – kinderzones, skischool, korte afstanden en een rustige sfeer maken Bjorli geschikt voor families.' },
    da: { title: 'Familieferie på Bjorli', description: 'Familieferie på Bjorli – børneområder, skiskole, korte afstande og rolige forhold gør Bjorli til et godt valg for familier.' },
    sv: { title: 'Familjesemester på Bjorli', description: 'Familjesemester på Bjorli – barnområden, skidskola, korta avstånd och lugn miljö gör Bjorli till ett bra val för familjer.' },
  },

  'reisen-hit': {
    no: { title: 'Reisen hit – slik kommer du til Bjorli', description: 'Bjorli er enkelt å nå med bil via E136 og med tog på Raumabanen, mellom Dombås og Åndalsnes.' },
    en: { title: 'Getting to Bjorli, Norway – by car or train', description: 'Bjorli is easy to reach by car on the E136 and by train on the Rauma Line, between Dombås and Åndalsnes.' },
    de: { title: 'Anreise nach Bjorli – mit Auto oder Zug', description: 'Bjorli ist mit dem Auto über die E136 und mit dem Zug auf der Raumabahn zwischen Dombås und Åndalsnes leicht erreichbar.' },
    nl: { title: 'Reizen naar Bjorli – met auto of trein', description: 'Bjorli is makkelijk te bereiken met de auto via de E136 en met de trein op de Raumabanen, tussen Dombås en Åndalsnes.' },
    da: { title: 'Rejsen til Bjorli – bil eller tog', description: 'Bjorli er let at nå med bil ad E136 og med tog på Raumabanen, mellem Dombås og Åndalsnes.' },
    sv: { title: 'Resa till Bjorli – bil eller tåg', description: 'Bjorli är lätt att nå med bil på E136 och med tåg på Raumabanen, mellan Dombås och Åndalsnes.' },
  },

  'praktisk-info': {
    no: { title: 'Praktisk info – Bjorli', description: 'Praktisk informasjon for besøk på Bjorli – parkering, fasiliteter, kart og nyttige tips.' },
    en: { title: 'Practical information – Bjorli, Norway', description: 'Practical information for your visit to Bjorli – parking, facilities, maps and useful tips.' },
    de: { title: 'Praktische Informationen – Bjorli', description: 'Praktische Informationen für Ihren Besuch in Bjorli – Parken, Einrichtungen, Karten und Tipps.' },
    nl: { title: 'Praktische informatie – Bjorli', description: 'Praktische informatie voor je bezoek aan Bjorli – parkeren, voorzieningen, kaarten en tips.' },
    da: { title: 'Praktisk info – Bjorli', description: 'Praktisk information til besøg på Bjorli – parkering, faciliteter, kort og nyttige tips.' },
    sv: { title: 'Praktisk info – Bjorli', description: 'Praktisk information för ditt besök på Bjorli – parkering, faciliteter, kartor och tips.' },
  },

  kontakt: {
    no: { title: 'Kontakt – Destinasjon Bjorli', description: 'Kontakt Destinasjon Bjorli og Bjorli Skisenter. Adresse, telefon og e-post.' },
    en: { title: 'Contact – Destination Bjorli, Norway', description: 'Contact Destination Bjorli and Bjorli Skisenter. Address, phone and email.' },
    de: { title: 'Kontakt – Destination Bjorli', description: 'Kontakt zu Destination Bjorli und dem Bjorli Skisenter. Adresse, Telefon und E-Mail.' },
    nl: { title: 'Contact – Destination Bjorli', description: 'Contact met Destination Bjorli en Bjorli Skisenter. Adres, telefoon en e-mail.' },
    da: { title: 'Kontakt – Destination Bjorli', description: 'Kontakt Destination Bjorli og Bjorli Skisenter. Adresse, telefon og e-mail.' },
    sv: { title: 'Kontakt – Destination Bjorli', description: 'Kontakta Destination Bjorli och Bjorli Skisenter. Adress, telefon och e-post.' },
  },

  loypekart: {
    no: { title: 'Løypekart – Bjorli Skisenter', description: 'Løypekart for Bjorli Skisenter – nedfarter, heiser og barneområder.' },
    en: { title: 'Trail map – Bjorli Skisenter, Norway', description: 'Trail and slope map for Bjorli Skisenter – runs, lifts and children’s areas.' },
    de: { title: 'Pistenplan – Bjorli Skisenter', description: 'Pisten- und Loipenplan des Skigebiets Bjorli – Abfahrten, Lifte und Kinderbereiche.' },
    nl: { title: 'Pistekaart – Bjorli Skisenter', description: 'Pistekaart voor Bjorli Skisenter – afdalingen, liften en kinderzones.' },
    da: { title: 'Loipekort – Bjorli Skisenter', description: 'Loipe- og pistekort for Bjorli Skisenter – pister, lifte og børneområder.' },
    sv: { title: 'Spårkarta – Bjorli Skisenter', description: 'Spår- och backkarta för Bjorli Skisenter – backar, liftar och barnområden.' },
  },

  live: {
    no: { title: 'Live status – Bjorli', description: 'Live oppdateringer fra Bjorli Skisenter – heiser, nedfarter og forhold.' },
    en: { title: 'Live status – Bjorli, Norway', description: 'Live updates from Bjorli Skisenter – lifts, slopes and conditions.' },
    de: { title: 'Live-Status – Bjorli', description: 'Live-Updates aus dem Bjorli Skisenter – Lifte, Pisten und Bedingungen.' },
    nl: { title: 'Live status – Bjorli', description: 'Live updates van Bjorli Skisenter – liften, pistes en condities.' },
    da: { title: 'Live status – Bjorli', description: 'Live opdateringer fra Bjorli Skisenter – lifte, pister og forhold.' },
    sv: { title: 'Live status – Bjorli', description: 'Live uppdateringar från Bjorli Skisenter – liftar, backar och förhållanden.' },
  },
};

// --- Added entries for pages without per-locale slug aliasing ------------
// Parkering and Personvern share a single slug across locales (see
// ROUTE_SLUGS). They still resolve through `seoForCanonicalPath` because
// the lookup is by canonical key, not by localized slug.
(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>).parkering = {
  no: { title: 'Parkering ved Bjorli Skisenter', description: 'Slik fungerer parkering og betaling på P1 og P2 ved Bjorli Skisenter — drevet av Parkly med skiltgjenkjenning.' },
  en: { title: 'Parking at Bjorli Skisenter, Norway', description: 'How parking and payment work at P1 and P2 at Bjorli Skisenter — run by Parkly with number-plate recognition.' },
  de: { title: 'Parken am Bjorli Skisenter, Norwegen', description: 'So funktionieren Parken und Bezahlen auf P1 und P2 am Bjorli Skisenter — betrieben von Parkly mit Kennzeichenerkennung.' },
  nl: { title: 'Parkeren bij Bjorli Skisenter, Noorwegen', description: 'Zo werken parkeren en betalen op P1 en P2 bij Bjorli Skisenter — verzorgd door Parkly met kentekenherkenning.' },
  da: { title: 'Parkering ved Bjorli Skisenter, Norge', description: 'Sådan fungerer parkering og betaling på P1 og P2 ved Bjorli Skisenter — drives af Parkly med nummerpladegenkendelse.' },
  sv: { title: 'Parkering vid Bjorli Skisenter, Norge', description: 'Så fungerar parkering och betalning på P1 och P2 vid Bjorli Skisenter — sköts av Parkly med registreringsskyltigenkänning.' },
};
(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>).personvern = {
  no: { title: 'Personvern | Bjorli', description: 'Slik behandler Bjorli Skisenter AS personopplysninger, informasjonskapsler og henvendelser via bjorli.no.' },
  en: { title: 'Privacy | Bjorli', description: 'How Bjorli Skisenter AS processes personal data, cookies and enquiries on bjorli.no.' },
  de: { title: 'Datenschutz | Bjorli', description: 'Wie die Bjorli Skisenter AS personenbezogene Daten, Cookies und Anfragen über bjorli.no verarbeitet.' },
  nl: { title: 'Privacy | Bjorli', description: 'Hoe Bjorli Skisenter AS persoonsgegevens, cookies en aanvragen via bjorli.no verwerkt.' },
  da: { title: 'Privatliv | Bjorli', description: 'Sådan behandler Bjorli Skisenter AS personoplysninger, cookies og henvendelser via bjorli.no.' },
  sv: { title: 'Integritet | Bjorli', description: 'Så behandlar Bjorli Skisenter AS personuppgifter, cookies och förfrågningar via bjorli.no.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>).salgsbetingelser = {
  no: { title: 'Salgsbetingelser | Bjorli', description: 'Generelle salgsbetingelser ved kjøp av heiskort og andre produkter på nett hos Bjorli Skisenter AS.' },
  en: { title: 'Terms of Sale | Bjorli', description: 'General terms of sale for online purchases of lift passes and other products from Bjorli Skisenter AS.' },
  de: { title: 'Verkaufsbedingungen | Bjorli', description: 'Allgemeine Verkaufsbedingungen für den Online-Kauf von Skipässen und anderen Produkten bei Bjorli Skisenter AS.' },
  nl: { title: 'Verkoopvoorwaarden | Bjorli', description: 'Algemene verkoopvoorwaarden voor online aankopen van skipassen en andere producten bij Bjorli Skisenter AS.' },
  da: { title: 'Salgsbetingelser | Bjorli', description: 'Generelle salgsbetingelser ved onlinekøb af liftkort og andre produkter hos Bjorli Skisenter AS.' },
  sv: { title: 'Försäljningsvillkor | Bjorli', description: 'Allmänna försäljningsvillkor vid onlineköp av liftkort och andra produkter hos Bjorli Skisenter AS.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>).handel = {
  no: { title: 'Butikker og handel på Bjorli', description: 'Hvor du handler mat, sportsutstyr og det praktiske på Bjorli — fra dagligvarer til skiservice og bensin.' },
  en: { title: 'Shops and groceries in Bjorli, Norway', description: 'Where to shop on Bjorli — groceries, sports gear, ski service and fuel within easy reach of the resort.' },
  de: { title: 'Geschäfte und Einkaufen in Bjorli', description: 'Wo man in Bjorli einkauft — Lebensmittel, Sportausrüstung, Skiservice und Tankstelle in der Nähe des Skigebiets.' },
  nl: { title: 'Winkels en boodschappen in Bjorli', description: 'Waar je in Bjorli winkelt — supermarkt, sportzaak, skiservice en tankstation vlak bij het skigebied.' },
  da: { title: 'Butikker og indkøb på Bjorli', description: 'Hvor du handler på Bjorli — dagligvarer, sportsudstyr, skiservice og tankstation tæt på skicentret.' },
  sv: { title: 'Butiker och inköp på Bjorli', description: 'Var du handlar på Bjorli — livsmedel, sportutrustning, skidservice och bensinstation nära skidanläggningen.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>).fiske = {
  no: { title: 'Fiske på Bjorli og i Lesja – ørret og fluefiske', description: 'Fjellvann, klare elver og fluefiskesoner i Lesja. Slik finner du fiskekort, soner og praktisk info før du drar ut.' },
  en: { title: 'Fishing in Bjorli, Norway – trout, mountain and fly fishing', description: 'Mountain lakes, clear rivers and fly-fishing zones in Lesja. Find fishing licences, zones and practical info before you head out.' },
  de: { title: 'Angeln in Bjorli und Lesja – Forelle und Fliegenfischen', description: 'Bergseen, klare Flüsse und Fliegenfischzonen in Lesja. Angelkarten, Zonen und nützliche Hinweise für den Tag am Wasser.' },
  nl: { title: 'Vissen op Bjorli en in Lesja – forel en vliegvissen', description: 'Bergmeren, heldere rivieren en vliegviszones in Lesja. Vergunningen, zones en praktische tips voor je visdag.' },
  da: { title: 'Fiskeri på Bjorli og i Lesja – ørred og fluefiskeri', description: 'Fjeldsøer, klare elve og fluefiskezoner i Lesja. Find fiskekort, zoner og praktisk info før du tager ud.' },
  sv: { title: 'Fiske på Bjorli och i Lesja – öring och flugfiske', description: 'Fjällsjöar, klara älvar och flugfiskezoner i Lesja. Hitta fiskekort, zoner och praktisk info inför fiskedagen.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>).gardsbesok = {
  no: { title: 'Gårdsbesøk i Lesja – dyr, kortreist mat og fjellgårder', description: 'Besøk en levende fjellgård i Lesja. Møt dyrene, smak lokal mat og lær hvordan landbruket fungerer høyt til fjells.' },
  en: { title: 'Farm visits near Bjorli, Norway – animals, local food, mountain farms', description: 'Visit a working mountain farm in Lesja. Meet the animals, taste local food and see how farming works up in the highlands.' },
  de: { title: 'Bauernhofbesuche bei Bjorli – Tiere, regionale Küche, Bergbauernhöfe', description: 'Besuchen Sie einen lebendigen Bergbauernhof in Lesja. Tiere erleben, regionale Produkte probieren und Landwirtschaft auf 700 Metern verstehen.' },
  nl: { title: 'Boerderijbezoek bij Bjorli – dieren, streekproducten, bergboerderijen', description: 'Bezoek een werkende bergboerderij in Lesja. Ontmoet de dieren, proef streekproducten en zie hoe landbouw in het hoogland werkt.' },
  da: { title: 'Gårdsbesøg ved Bjorli – dyr, lokal mad og fjeldgårde', description: 'Besøg en levende fjeldgård i Lesja. Mød dyrene, smag lokal mad og se, hvordan landbruget fungerer højt i fjeldet.' },
  sv: { title: 'Gårdsbesök vid Bjorli – djur, närodlat och fjällgårdar', description: 'Besök en levande fjällgård i Lesja. Möt djuren, smaka närproducerat och se hur jordbruket fungerar uppe i fjällen.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>)['golden-train'] = {
  no: { title: 'Golden Train – togtur over Dovrefjell og Raumabanen', description: 'Reis fra Oslo til Åndalsnes via Bjorli med Dovrebanen og Raumabanen. Vid utsikt, fjelltunneler og en av Europas mest dramatiske togstrekninger.' },
  en: { title: 'Golden Train – Oslo to Åndalsnes via Bjorli and the Rauma Line', description: 'Travel from Oslo to Åndalsnes through Dovrefjell and down the Rauma Line, with a stop at Bjorli. One of Europe’s most dramatic rail journeys.' },
  de: { title: 'Golden Train – mit der Bahn von Oslo nach Åndalsnes über Bjorli', description: 'Mit der Dovrebahn und der Raumabahn von Oslo nach Åndalsnes, mit Halt in Bjorli. Eine der spektakulärsten Bahnstrecken Europas.' },
  nl: { title: 'Golden Train – met de trein van Oslo naar Åndalsnes via Bjorli', description: 'Reis met de Dovrebanen en Raumabanen van Oslo naar Åndalsnes, met stop in Bjorli. Een van de mooiste treinroutes van Europa.' },
  da: { title: 'Golden Train – med toget fra Oslo til Åndalsnes via Bjorli', description: 'Rejs med Dovrebanen og Raumabanen fra Oslo til Åndalsnes med stop på Bjorli. En af Europas mest dramatiske togture.' },
  sv: { title: 'Golden Train – med tåget från Oslo till Åndalsnes via Bjorli', description: 'Res med Dovrebanan och Raumabanan från Oslo till Åndalsnes med stopp på Bjorli. En av Europas mest dramatiska tågsträckor.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>).romsdalsgondolen = {
  no: { title: 'Romsdalsgondolen – fra Åndalsnes til Nesaksla', description: 'Ta gondolen fra Åndalsnes opp til Nesaksla på 708 meter. Utsikt over Romsdalsfjorden, Trollveggen og Romsdalshornet — kort vei fra Bjorli.' },
  en: { title: 'Romsdalsgondolen – gondola from Åndalsnes to Nesaksla', description: 'Ride the gondola from Åndalsnes up to Nesaksla at 708 m. Views over the Romsdal fjord, Trollveggen and Romsdalshornet — a short drive from Bjorli.' },
  de: { title: 'Romsdalsgondolen – Gondelbahn von Åndalsnes nach Nesaksla', description: 'Mit der Gondel von Åndalsnes auf den Nesaksla (708 m). Blick auf den Romsdalsfjord, die Trollwand und das Romsdalshorn — nahe Bjorli.' },
  nl: { title: 'Romsdalsgondolen – gondel van Åndalsnes naar Nesaksla', description: 'Met de gondel van Åndalsnes naar Nesaksla op 708 m. Uitzicht over de Romsdalsfjord, Trollveggen en Romsdalshornet — kort rijden vanaf Bjorli.' },
  da: { title: 'Romsdalsgondolen – gondol fra Åndalsnes til Nesaksla', description: 'Tag gondolen fra Åndalsnes op til Nesaksla i 708 meters højde. Udsigt over Romsdalsfjorden, Trollveggen og Romsdalshornet — tæt på Bjorli.' },
  sv: { title: 'Romsdalsgondolen – gondol från Åndalsnes till Nesaksla', description: 'Åk gondolen från Åndalsnes upp till Nesaksla på 708 meter. Utsikt över Romsdalsfjorden, Trollveggen och Romsdalshornet — nära Bjorli.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>).sagelva = {
  no: { title: 'Sagelva – kort tur og badekulper nær Bjorli', description: 'Sagelva ligger like ved Bjorli — kort fottur, små fosser og fine kulper for å kjøle føttene en sommerdag.' },
  en: { title: 'Sagelva – short walk and pools near Bjorli, Norway', description: 'Sagelva is right next to Bjorli — a short walk, small waterfalls and pools to cool off on a warm summer day.' },
  de: { title: 'Sagelva – kurze Wanderung und Badegumpen bei Bjorli', description: 'Sagelva liegt direkt bei Bjorli — kurze Wanderung, kleine Wasserfälle und Gumpen für die Abkühlung an warmen Sommertagen.' },
  nl: { title: 'Sagelva – korte wandeling en zwemkommen bij Bjorli', description: 'Sagelva ligt vlak bij Bjorli — korte wandeling, kleine watervallen en kommen om af te koelen op een warme zomerdag.' },
  da: { title: 'Sagelva – kort tur og badehuller nær Bjorli', description: 'Sagelva ligger lige ved Bjorli — kort tur, små vandfald og gode huller til en svalende dukkert om sommeren.' },
  sv: { title: 'Sagelva – kort promenad och badhöljor nära Bjorli', description: 'Sagelva ligger alldeles intill Bjorli — kort promenad, små vattenfall och höljor att svalka sig i en sommardag.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>)['sommer/klatring-og-buldring-romsdalen'] = {
  no: { title: 'Klatring og buldring i Romsdalen – kort fra Bjorli', description: 'Romsdalen er et av Norges sterkeste klatreområder. Sportsklatring, buldring, via ferrata og Norsk Tindesenter — alt innen rimelig kjøreavstand fra Bjorli.' },
  en: { title: 'Climbing and bouldering in Romsdalen, Norway – near Bjorli', description: 'Romsdalen is one of Norway’s strongest climbing regions. Sport climbing, bouldering, via ferrata and Norsk Tindesenter — all within easy reach of Bjorli.' },
  de: { title: 'Klettern und Bouldern in Romsdal – nahe Bjorli', description: 'Romsdal ist eine der bekanntesten Klettergegenden Norwegens. Sportklettern, Bouldern, Klettersteig und das Norsk Tindesenter — alles in der Nähe von Bjorli.' },
  nl: { title: 'Klimmen en boulderen in Romsdalen – vlak bij Bjorli', description: 'Romsdalen is een van Noorwegens bekendste klimgebieden. Sportklimmen, boulderen, via ferrata en Norsk Tindesenter — op korte rijafstand van Bjorli.' },
  da: { title: 'Klatring og bouldering i Romsdalen – tæt på Bjorli', description: 'Romsdalen er et af Norges stærkeste klatreområder. Sportsklatring, bouldering, via ferrata og Norsk Tindesenter — alt i kort køreafstand fra Bjorli.' },
  sv: { title: 'Klättring och bouldering i Romsdalen – nära Bjorli', description: 'Romsdalen är ett av Norges starkaste klätterområden. Sportklättring, bouldering, via ferrata och Norsk Tindesenter — på kort köravstånd från Bjorli.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>)['sommer/korte-turer'] = {
  no: { title: '10 korte turer rundt Bjorli – familievennlige fotturer', description: 'Ti korte turer i Lesja og Rauma, henta fra heftet «Snartur i Rauma og Lesja». Kart, parkering og praktisk info for hver tur.' },
  en: { title: '10 short walks around Bjorli, Norway – family-friendly hikes', description: 'Ten short walks in Lesja and Rauma, drawn from the «Snartur i Rauma og Lesja» booklet. Map, parking and practical info for each route.' },
  de: { title: '10 kurze Wanderungen rund um Bjorli – familienfreundlich', description: 'Zehn kurze Wanderungen in Lesja und Rauma aus dem Heft «Snartur i Rauma og Lesja». Karte, Parken und praktische Tipps zu jeder Tour.' },
  nl: { title: '10 korte wandelingen rond Bjorli – gezinsvriendelijk', description: 'Tien korte wandelingen in Lesja en Rauma uit het boekje «Snartur i Rauma og Lesja». Kaart, parkeren en praktische info per route.' },
  da: { title: '10 korte ture rundt om Bjorli – familievenlige vandreture', description: 'Ti korte ture i Lesja og Rauma fra hæftet «Snartur i Rauma og Lesja». Kort, parkering og praktisk info til hver tur.' },
  sv: { title: '10 korta turer runt Bjorli – familjevänliga vandringar', description: 'Tio korta turer i Lesja och Rauma från häftet «Snartur i Rauma og Lesja». Karta, parkering och praktisk info för varje tur.' },
};

(ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>)['sommer/tafjordfjella'] = {
  no: { title: 'Tafjordfjella fra Bjorli | Turforslag og hytter', description: 'Bruk Bjorli og Brøstdalen som utgangspunkt for turer inn i Tafjordfjella, med ruter mot Vakkerstøylen, Pyttbua og flotte fjellområder.' },
  en: { title: 'Tafjordfjella from Bjorli – hikes, ski tours and huts', description: 'Use Bjorli and Brøstdalen as your base for hikes and ski tours into Tafjordfjella, with routes to Vakkerstøylen, Pyttbua and surrounding mountains.' },
  de: { title: 'Tafjordfjella ab Bjorli – Touren und Hütten', description: 'Bjorli und Brøstdalen als Ausgangspunkt für Wanderungen und Skitouren in das Tafjordfjella – mit Routen zur Vakkerstøylen und Pyttbua.' },
  nl: { title: 'Tafjordfjella vanaf Bjorli – routes en hutten', description: 'Gebruik Bjorli en Brøstdalen als basis voor wandel- en skitochten in Tafjordfjella, met routes naar Vakkerstøylen, Pyttbua en omliggende bergen.' },
  da: { title: 'Tafjordfjella fra Bjorli – ture og hytter', description: 'Brug Bjorli og Brøstdalen som udgangspunkt for ture ind i Tafjordfjella, med ruter mod Vakkerstøylen, Pyttbua og flotte fjeldområder.' },
  sv: { title: 'Tafjordfjella från Bjorli – turförslag och stugor', description: 'Använd Bjorli och Brøstdalen som utgångspunkt för turer in i Tafjordfjella, med rutter mot Vakkerstøylen, Pyttbua och vidsträckta fjäll.' },
};

/**
 * EN-only landing at /ski-holiday-norway. Only the `en` locale is
 * populated — there are no localized variants of this route, and
 * `seoForCanonicalPath` returns null for the other locales so nothing
 * localized is ever generated. Metadata comes from the shared module so
 * the page, SEOHead/PageMeta, the CMS fixture and prerender never drift.
 */
(ROUTE_SEO as Record<string, Partial<Record<Locale, RouteSeoEntry>>>)[
  SKI_HOLIDAY_NORWAY_SLUG
] = {
  en: { ...SKI_HOLIDAY_NORWAY_SEO },
};

/**
 * Route-specific Open Graph / Twitter share images (1200x630, generated
 * from the hero photo already used on each page — see public/og/).
 * Everything not listed here falls back to DEFAULT_OG_IMAGE, a wide aerial
 * shot of the whole destination (village, slopes, Rauma and mountains).
 * Paths are origin-relative; callers prepend the site origin.
 */
export const DEFAULT_OG_IMAGE = '/og/default.jpg';

const ROUTE_OG_IMAGES: Partial<Record<string, string>> = {
  home: '/og/home.jpg',
  sommer: '/og/sommer.jpg',
  skisenter: '/og/skisenter.jpg',
  overnatting: '/og/overnatting.jpg',
  'vaer-og-webkamera': '/og/vaer-og-webkamera.jpg',
};

/** Resolve canonical (NO) path → OG image path (same lookup rules as SEO). */
export const ogImageForCanonicalPath = (canonicalPath: string): string => {
  if (canonicalPath === '/') return ROUTE_OG_IMAGES.home ?? DEFAULT_OG_IMAGE;
  const trimmed = canonicalPath.replace(/^\//, '');
  return (
    ROUTE_OG_IMAGES[trimmed] ?? ROUTE_OG_IMAGES[trimmed.split('/')[0]] ?? DEFAULT_OG_IMAGE
  );
};

/** Resolve canonical (NO) path → SEO entry for the requested locale. */
export const seoForCanonicalPath = (
  canonicalPath: string,
  locale: Locale,
): RouteSeoEntry | null => {
  const map = ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>;
  if (canonicalPath === '/') return map.home?.[locale] ?? null;
  const trimmed = canonicalPath.replace(/^\//, '');
  // Try the full canonical sub-path first (e.g. 'sommer/korte-turer'),
  // then fall back to the top-level segment (e.g. 'sommer').
  return map[trimmed]?.[locale] ?? map[trimmed.split('/')[0]]?.[locale] ?? null;
};