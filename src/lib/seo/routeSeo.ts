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

export interface RouteSeoEntry {
  title: string;
  description: string;
}

type RouteSeoMap = Partial<Record<CanonicalRoute, Record<Locale, RouteSeoEntry>>>;

export const ROUTE_SEO: RouteSeoMap = {
  home: {
    no: {
      title: 'Bjorli – snøsikker fjelldestinasjon mellom Dombås og Åndalsnes',
      description:
        'Destinasjon Bjorli i Romsdalen – snøsikre vinterdager med Bjorli Skisenter, langrenn og familieopplevelser, og en rolig fjellbase for fotturer og sykling om sommeren.',
    },
    en: {
      title: 'Bjorli, Norway – snow-sure mountain destination near Åndalsnes',
      description:
        'Bjorli is a year-round mountain destination in Norway between Dombås and Åndalsnes, easy to reach by E136 or the Rauma Line. Snow-sure winters at Bjorli Skisenter and a calm base for hiking and cycling in summer.',
    },
    de: {
      title: 'Bjorli, Norwegen – schneesicheres Bergziel an der Raumabahn',
      description:
        'Bjorli ist ein ganzjähriges Bergreiseziel in Norwegen zwischen Dombås und Åndalsnes, gut erreichbar über die E136 und mit dem Zug auf der Raumabahn. Schneesichere Winter im Bjorli Skisenter und ruhige Sommertage in Romsdalen.',
    },
    nl: {
      title: 'Bjorli, Noorwegen – sneeuwzekere bergbestemming bij Åndalsnes',
      description:
        'Bjorli is een bergbestemming in Noorwegen tussen Dombås en Åndalsnes, makkelijk te bereiken via de E136 of met de trein op de Raumabanen. Sneeuwzekere winters bij Bjorli Skisenter en een rustige basis voor wandelen en fietsen in de zomer.',
    },
    da: {
      title: 'Bjorli, Norge – snøsikker fjelddestination ved Raumabanen',
      description:
        'Bjorli er en helårs fjelddestination i Norge mellem Dombås og Åndalsnes, nem at nå via E136 og med tog på Raumabanen. Snøsikre vintre på Bjorli Skisenter og en rolig fjeldbase om sommeren.',
    },
    sv: {
      title: 'Bjorli, Norge – snösäker fjälldestination nära Åndalsnes',
      description:
        'Bjorli är en åretrunt fjälldestination i Norge mellan Dombås och Åndalsnes, lätt att nå via E136 och med tåg på Raumabanen. Snösäkra vintrar på Bjorli Skidcenter och en lugn fjällbas på sommaren.',
    },
  },

  vinter: {
    no: { title: 'Vinter på Bjorli – alpint, langrenn og snøsikre dager', description: 'Vinter på Bjorli betyr lang sesong, alpint i Bjorli Skisenter, langrennsløyper og familievennlige forhold mellom Dombås og Åndalsnes.' },
    en: { title: 'Winter in Bjorli, Norway – alpine, cross-country and snow-sure days', description: 'Winter in Bjorli means a long season, alpine skiing at Bjorli Skisenter, cross-country trails and family-friendly conditions between Dombås and Åndalsnes.' },
    de: { title: 'Winter in Bjorli – Alpin, Langlauf und schneesichere Tage', description: 'Der Winter in Bjorli bedeutet lange Saison, Alpinski im Bjorli Skisenter, Langlaufloipen und familienfreundliche Bedingungen in Norwegen.' },
    nl: { title: 'Winter in Bjorli – alpineskiën, langlaufen en sneeuwzekere dagen', description: 'Winter in Bjorli: lang seizoen, alpineskiën in Bjorli Skisenter, langlaufloipes en familievriendelijke omstandigheden tussen Dombås en Åndalsnes.' },
    da: { title: 'Vinter på Bjorli – alpint, langrend og snøsikre dage', description: 'Vinter på Bjorli betyder lang sæson, alpint i Bjorli Skisenter, langrendsspor og familievenlige forhold i Norge.' },
    sv: { title: 'Vinter på Bjorli – alpint, längdåkning och snösäkra dagar', description: 'Vinter på Bjorli innebär lång säsong, alpint vid Bjorli Skidcenter, längdspår och familjevänliga förhållanden i Norge.' },
  },

  sommer: {
    no: { title: 'Sommer på Bjorli – fotturer, sykling og fjellopplevelser', description: 'Sommer på Bjorli – en rolig fjellbase for fotturer i Reinheimen og Dovrefjell, sykling, fiske og familieopplevelser i Romsdalen.' },
    en: { title: 'Summer in Bjorli, Norway – hiking, cycling and mountain holidays', description: 'Summer in Bjorli is a calm mountain base for hiking near Reinheimen and Dovrefjell national parks, cycling, fishing and family days out in Romsdalen.' },
    de: { title: 'Sommer in Bjorli – Wandern, Radfahren und Bergurlaub in Norwegen', description: 'Sommer in Bjorli: eine ruhige Bergbasis für Wanderungen rund um die Nationalparks Reinheimen und Dovrefjell, Radfahren, Angeln und Familienerlebnisse in Romsdal.' },
    nl: { title: 'Zomer in Bjorli – wandelen, fietsen en bergvakanties in Noorwegen', description: 'Zomer in Bjorli is een rustige bergbasis voor wandelingen bij Reinheimen en Dovrefjell, fietsen, vissen en familiedagen in Romsdalen.' },
    da: { title: 'Sommer på Bjorli – vandring, cykling og fjeldoplevelser', description: 'Sommer på Bjorli – en rolig fjeldbase for vandreture i Reinheimen og Dovrefjell, cykling, fiskeri og familieoplevelser i Romsdalen.' },
    sv: { title: 'Sommar på Bjorli – vandring, cykling och fjällupplevelser', description: 'Sommar på Bjorli är en lugn fjällbas för vandring i Reinheimen och Dovrefjell, cykling, fiske och familjedagar i Romsdalen.' },
  },

  skisenter: {
    no: { title: 'Bjorli Skisenter – snøsikkert alpinanlegg i Romsdalen', description: 'Bjorli Skisenter er kjent for tidlige åpninger og snøsikre forhold. Heiser, nedfarter, skiskole, skiutleie og barneområder mellom Dombås og Åndalsnes.' },
    en: { title: 'Bjorli Skisenter – snow-sure alpine skiing in Norway', description: 'Bjorli Skisenter is often among the first to open in Norway and is known for snow-sure conditions. Lifts, slopes, ski school, rental and children’s areas at the top of Romsdalen.' },
    de: { title: 'Bjorli Skisenter – schneesicheres Alpinskifahren in Norwegen', description: 'Bjorli gehört oft zu den ersten geöffneten Skigebieten Norwegens und ist bekannt für schneesichere Bedingungen. Lifte, Pisten, Skischule, Verleih und Kinderbereiche.' },
    nl: { title: 'Bjorli Skisenter – sneeuwzeker alpineskiën in Noorwegen', description: 'Bjorli Skisenter behoort vaak tot de eerste skigebieden in Noorwegen die opengaan en staat bekend om sneeuwzekere omstandigheden. Liften, pistes, skischool, verhuur en kinderzones.' },
    da: { title: 'Bjorli Skisenter – snøsikkert alpinanlæg i Norge', description: 'Bjorli Skisenter er ofte blandt de første der åbner i Norge og kendt for snøsikre forhold. Lifte, pister, skiskole, udlejning og børneområder.' },
    sv: { title: 'Bjorli Skidcenter – snösäker alpin skidåkning i Norge', description: 'Bjorli Skidcenter är ofta bland de första som öppnar i Norge och känt för snösäkra förhållanden. Liftar, backar, skidskola, uthyrning och barnområden.' },
  },

  heiskort: {
    no: { title: 'Heiskort – Bjorli Skisenter', description: 'Heiskort til Bjorli Skisenter – dagskort, flerdagskort og sesongkort. Se gjeldende informasjon og kjøp på bjorli.no.' },
    en: { title: 'Lift passes – Bjorli Skisenter, Norway', description: 'Lift passes for Bjorli Skisenter – day, multi-day and season passes. Check current information and buy on bjorli.no.' },
    de: { title: 'Skipässe – Bjorli Skisenter, Norwegen', description: 'Skipässe für das Bjorli Skisenter – Tages-, Mehrtages- und Saisonpässe. Aktuelle Informationen und Kauf auf bjorli.no.' },
    nl: { title: 'Skipassen – Bjorli Skisenter, Noorwegen', description: 'Skipassen voor Bjorli Skisenter – dag-, meerdaagse en seizoenpassen. Bekijk actuele informatie en koop op bjorli.no.' },
    da: { title: 'Liftkort – Bjorli Skisenter, Norge', description: 'Liftkort til Bjorli Skisenter – dagskort, flerdagskort og sæsonkort. Se aktuel information og køb på bjorli.no.' },
    sv: { title: 'Liftkort – Bjorli Skidcenter, Norge', description: 'Liftkort till Bjorli Skidcenter – dagskort, flerdagarskort och säsongskort. Se aktuell information och köp på bjorli.no.' },
  },

  apningstider: {
    no: { title: 'Åpningstider – Bjorli', description: 'Åpningstider for Bjorli Skisenter, heiser, restaurant og butikker. Se siste oppdaterte informasjon på bjorli.no.' },
    en: { title: 'Opening hours – Bjorli, Norway', description: 'Opening hours for Bjorli Skisenter, lifts, restaurant and shops. See the latest information on bjorli.no.' },
    de: { title: 'Öffnungszeiten – Bjorli, Norwegen', description: 'Öffnungszeiten für das Bjorli Skisenter, Lifte, Restaurant und Geschäfte. Aktuelle Informationen auf bjorli.no.' },
    nl: { title: 'Openingstijden – Bjorli, Noorwegen', description: 'Openingstijden voor Bjorli Skisenter, liften, restaurant en winkels. Bekijk de laatste informatie op bjorli.no.' },
    da: { title: 'Åbningstider – Bjorli, Norge', description: 'Åbningstider for Bjorli Skisenter, lifte, restaurant og butikker. Se den nyeste information på bjorli.no.' },
    sv: { title: 'Öppettider – Bjorli, Norge', description: 'Öppettider för Bjorli Skidcenter, liftar, restaurang och butiker. Se senaste informationen på bjorli.no.' },
  },

  'vaer-og-webkamera': {
    no: { title: 'Vær og webkamera – Bjorli', description: 'Se vær, snøforhold og live webkameraer fra Bjorli Skisenter og destinasjonen.' },
    en: { title: 'Weather and webcams – Bjorli, Norway', description: 'See weather, snow conditions and live webcams from Bjorli Skisenter and the destination.' },
    de: { title: 'Wetter und Webcams – Bjorli, Norwegen', description: 'Wetter, Schneebedingungen und Live-Webcams aus dem Bjorli Skisenter und der Region.' },
    nl: { title: 'Weer en webcams – Bjorli, Noorwegen', description: 'Bekijk weer, sneeuwcondities en live webcams van Bjorli Skisenter en de bestemming.' },
    da: { title: 'Vejr og webcams – Bjorli, Norge', description: 'Se vejr, sneforhold og live webcams fra Bjorli Skisenter og destinationen.' },
    sv: { title: 'Väder och webbkameror – Bjorli, Norge', description: 'Se väder, snöförhållanden och live-webbkameror från Bjorli Skidcenter och destinationen.' },
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
    no: { title: 'Overnatting på Bjorli – hytter, leiligheter og hotell', description: 'Finn overnatting på Bjorli – fra hytter og selvhusholdsleiligheter til hotell og camping, nær Bjorli Skisenter og Romsdalen.' },
    en: { title: 'Accommodation in Bjorli, Norway – cabins, apartments, hotels', description: 'Find accommodation in Bjorli – cabins, self-catering apartments, hotels and camping, close to Bjorli Skisenter and Romsdalen.' },
    de: { title: 'Unterkunft in Bjorli, Norwegen – Hütten, Apartments, Hotels', description: 'Unterkünfte in Bjorli – Hütten, Ferienwohnungen, Hotels und Camping in der Nähe des Skigebiets Bjorli und Romsdal.' },
    nl: { title: 'Accommodatie in Bjorli, Noorwegen – hutten, appartementen, hotels', description: 'Accommodatie in Bjorli – hutten, appartementen, hotels en camping dicht bij Bjorli Skisenter en Romsdalen.' },
    da: { title: 'Overnatning på Bjorli – hytter, lejligheder og hoteller', description: 'Find overnatning på Bjorli – hytter, selvhusholdningslejligheder, hoteller og camping nær Bjorli Skisenter.' },
    sv: { title: 'Boende på Bjorli – stugor, lägenheter och hotell', description: 'Hitta boende på Bjorli – stugor, självhushåll, hotell och camping nära Bjorli Skidcenter.' },
  },

  aktiviteter: {
    no: { title: 'Aktiviteter på Bjorli – hele året', description: 'Aktiviteter på Bjorli og i Romsdalen – fra ski og langrenn om vinteren til fotturer, sykling og fiske om sommeren.' },
    en: { title: 'Things to do in Bjorli, Norway – year-round', description: 'Things to do in Bjorli and Romsdalen – from skiing and cross-country in winter to hiking, cycling and fishing in summer.' },
    de: { title: 'Aktivitäten in Bjorli – das ganze Jahr', description: 'Aktivitäten in Bjorli und Romsdal – von Ski und Langlauf im Winter bis Wandern, Radfahren und Angeln im Sommer.' },
    nl: { title: 'Activiteiten in Bjorli – het hele jaar', description: 'Activiteiten in Bjorli en Romsdalen – van skiën en langlaufen in de winter tot wandelen, fietsen en vissen in de zomer.' },
    da: { title: 'Aktiviteter på Bjorli – hele året', description: 'Aktiviteter på Bjorli og i Romsdalen – fra ski og langrend om vinteren til vandring, cykling og fiskeri om sommeren.' },
    sv: { title: 'Aktiviteter på Bjorli – året om', description: 'Aktiviteter på Bjorli och i Romsdalen – från skidåkning och längdåkning på vintern till vandring, cykling och fiske på sommaren.' },
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
    sv: { title: 'Nyheter – Bjorli', description: 'Nyheter och driftmeddelanden från Bjorli och Bjorli Skidcenter.' },
  },

  'mat-og-drikke': {
    no: { title: 'Mat og drikke på Bjorli', description: 'Restauranter, kafeer og spisesteder på Bjorli – fra fjellmat på Heiskroa til lokale opplevelser.' },
    en: { title: 'Food and drink in Bjorli, Norway', description: 'Restaurants, cafés and places to eat in Bjorli – from mountain food at Heiskroa to local experiences.' },
    de: { title: 'Essen und Trinken in Bjorli', description: 'Restaurants, Cafés und Lokale in Bjorli – von Bergküche im Heiskroa bis zu lokalen Erlebnissen.' },
    nl: { title: 'Eten en drinken in Bjorli', description: 'Restaurants, cafés en eetgelegenheden in Bjorli – van bergkost bij Heiskroa tot lokale ervaringen.' },
    da: { title: 'Mad og drikke på Bjorli', description: 'Restauranter, caféer og spisesteder på Bjorli – fra fjeldmad på Heiskroa til lokale oplevelser.' },
    sv: { title: 'Mat och dryck på Bjorli', description: 'Restauranger, kaféer och matställen på Bjorli – från fjällmat på Heiskroa till lokala upplevelser.' },
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
    sv: { title: 'Kontakt – Destination Bjorli', description: 'Kontakta Destination Bjorli och Bjorli Skidcenter. Adress, telefon och e-post.' },
  },

  loypekart: {
    no: { title: 'Løypekart – Bjorli Skisenter', description: 'Løypekart for Bjorli Skisenter – nedfarter, heiser og barneområder.' },
    en: { title: 'Trail map – Bjorli Skisenter, Norway', description: 'Trail and slope map for Bjorli Skisenter – runs, lifts and children’s areas.' },
    de: { title: 'Pistenplan – Bjorli Skisenter', description: 'Pisten- und Loipenplan des Skigebiets Bjorli – Abfahrten, Lifte und Kinderbereiche.' },
    nl: { title: 'Pistekaart – Bjorli Skisenter', description: 'Pistekaart voor Bjorli Skisenter – afdalingen, liften en kinderzones.' },
    da: { title: 'Loipekort – Bjorli Skisenter', description: 'Loipe- og pistekort for Bjorli Skisenter – pister, lifte og børneområder.' },
    sv: { title: 'Spårkarta – Bjorli Skidcenter', description: 'Spår- och backkarta för Bjorli Skidcenter – backar, liftar och barnområden.' },
  },

  live: {
    no: { title: 'Live status – Bjorli', description: 'Live oppdateringer fra Bjorli Skisenter – heiser, nedfarter og forhold.' },
    en: { title: 'Live status – Bjorli, Norway', description: 'Live updates from Bjorli Skisenter – lifts, slopes and conditions.' },
    de: { title: 'Live-Status – Bjorli', description: 'Live-Updates aus dem Bjorli Skisenter – Lifte, Pisten und Bedingungen.' },
    nl: { title: 'Live status – Bjorli', description: 'Live updates van Bjorli Skisenter – liften, pistes en condities.' },
    da: { title: 'Live status – Bjorli', description: 'Live opdateringer fra Bjorli Skisenter – lifte, pister og forhold.' },
    sv: { title: 'Live status – Bjorli', description: 'Live uppdateringar från Bjorli Skidcenter – liftar, backar och förhållanden.' },
  },
};

/** Resolve canonical (NO) path → SEO entry for the requested locale. */
export const seoForCanonicalPath = (
  canonicalPath: string,
  locale: Locale,
): RouteSeoEntry | null => {
  const seg = canonicalPath === '/' ? 'home' : canonicalPath.replace(/^\//, '').split('/')[0];
  const entry = (ROUTE_SEO as Record<string, Record<Locale, RouteSeoEntry>>)[seg];
  return entry?.[locale] ?? null;
};