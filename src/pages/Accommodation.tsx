import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { Home, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { useLanguage } from '@/i18n/LanguageContext';
import type { Locale } from '@/i18n/locales/types';
import { trackAccommodationLinkClick } from '@/lib/analytics';
import imgNovasol from '@/assets/photos/accommodation/overnatting-novasol-bjorli-hytte.jpg';
import imgBjorliheimen from '@/assets/photos/accommodation/overnatting-bjorliheimen-fjellhotell.jpg';
import imgMountainLodge from '@/assets/photos/accommodation/overnatting-bjorli-mountain-lodge.jpg';
import imgVintercamping from '@/assets/photos/accommodation/overnatting-bjorli-vintercamping.jpg';
import imgAirbnb from '@/assets/photos/accommodation/overnatting-airbnb-bjorli.jpg';
import imgFinn from '@/assets/photos/accommodation/overnatting-finn-bjorli.jpg';
import imgBooking from '@/assets/photos/accommodation/overnatting-booking-bjorli.jpg';
import imgFjellstuer from '@/assets/photos/accommodation/overnatting-bjorli-fjellstuer.jpg';

/**
 * /overnatting — destination page listing accommodation providers on Bjorli.
 * Provider names and external URLs are constant across locales; only the
 * surrounding labels and descriptions are localized.
 */

const heroImg = images.summerValley.src;
const editorialImg = images.accommodation.src;

const PROVIDER_IMAGES: Record<ProviderKey, string> = {
  novasol: imgNovasol,
  bjorliheimen: imgBjorliheimen,
  mountainLodge: imgMountainLodge,
  vintercamping: imgVintercamping,
  airbnb: imgAirbnb,
  finn: imgFinn,
  booking: imgBooking,
  fjellstuer: imgFjellstuer,
};

const PROVIDER_ALT_TEMPLATE: Record<Locale, (name: string) => string> = {
  no: (n) => `${n} — overnatting på Bjorli.`,
  en: (n) => `${n} — accommodation in Bjorli.`,
  de: (n) => `${n} — Unterkunft in Bjorli.`,
  nl: (n) => `${n} — overnachten in Bjorli.`,
  da: (n) => `${n} — overnatning på Bjorli.`,
  sv: (n) => `${n} — boende på Bjorli.`,
};

type ProviderKey =
  | 'novasol'
  | 'bjorliheimen'
  | 'mountainLodge'
  | 'vintercamping'
  | 'airbnb'
  | 'finn'
  | 'booking'
  | 'fjellstuer';

interface ProviderBase {
  key: ProviderKey;
  name: string;
  href: string;
}

const providers: ProviderBase[] = [
  { key: 'novasol', name: 'Novasol', href: 'https://www.novasol.com/search?adult=2&child=0&pets=0&range=3&nights=3&accommodationType=novasol_cottages&regionName=Bjorli&placesId=62001&destinationCategory=578%7Coppland%7Clesja%7Cbjorli&page=1&sort=recommended&salesMarket=999&displayMode=LIST' },
  { key: 'bjorliheimen', name: 'Bjorliheimen Fjellhotel', href: 'https://www.bjorliheimen.no' },
  { key: 'mountainLodge', name: 'Bjorli Mountain Lodge', href: 'https://bjorlimountainlodge.no' },
  { key: 'vintercamping', name: 'Bjorli Vintercamping', href: 'https://www.bjorli-vintercamping.no' },
  { key: 'airbnb', name: 'Airbnb', href: 'https://www.airbnb.com/bjorli-norway/stays' },
  { key: 'finn', name: 'Finn.no', href: 'https://www.finn.no/reise/feriehus-hytteutleie/resultat/?lat_sw=62.095259&lng_sw=7.900766&lat_ne=62.456655&lng_ne=8.522246&nrFUSAds=2&country=Norge&city=Bjorli&no_of_bedrooms_from=0&no_of_beds_from=0' },
  { key: 'booking', name: 'Booking.com', href: 'https://www.booking.com/city/no/bjorli.html' },
  { key: 'fjellstuer', name: 'Bjorli Fjellstuer', href: 'https://bjorlifjellstuer.no/' },
];

const PROVIDER_CATEGORY: Record<ProviderKey, string> = {
  novasol: 'agency',
  bjorliheimen: 'hotel',
  mountainLodge: 'apartment',
  vintercamping: 'camping',
  airbnb: 'agency',
  finn: 'agency',
  booking: 'agency',
  fjellstuer: 'apartment',
};

type ProviderCopy = { category: string; desc: string; ctaLabel: string };

type Copy = {
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  editorialTitle: string;
  editorialBody: string;
  editorialImageAlt: string;
  providerSectionTitle: string;
  tipsTitle: string;
  tips: string[];
  relatedTitle: string;
  related: { label: string; canonical: string }[];
  providers: Record<ProviderKey, ProviderCopy>;
};

const COPY: Record<Locale, Copy> = {
  no: {
    heroTitle: 'Overnatting på Bjorli',
    heroSubtitle:
      'Hytter, leiligheter, hotell, camping og private utleieenheter på Bjorli og i nærområdet — samlet på ett sted så det blir lettere å finne det som passer for ditt opphold.',
    ctaPrimary: 'Se overnattingsmuligheter',
    ctaSecondary: 'Planlegg reisen hit',
    editorialTitle: 'Bo tett på fjellet',
    editorialBody:
      'Bjorli er et praktisk utgangspunkt enten du planlegger sommerdager i fjellet eller en uke i bakken. Velg fritt mellom hotell, leiligheter, hytter, camping og private utleieenheter.',
    editorialImageAlt: 'Hytter på Bjorli med utsikt mot fjellet.',
    providerSectionTitle: 'Overnattingsmuligheter',
    tipsTitle: 'Før du bestiller',
    tips: [
      'Sjekk pris, vilkår og tilgjengelighet direkte hos den enkelte aktør.',
      'Enkelte tilbud er sesongbaserte.',
      'Skihelger og ferier fylles raskt — det lønner seg å bestille tidlig.',
      'Reiser du uten bil, sjekk transport og avstand til det du planlegger å gjøre.',
    ],
    relatedTitle: 'Utforsk videre',
    related: [
      { label: 'Reisen hit', canonical: '/reisen-hit' },
      { label: 'Aktiviteter', canonical: '/aktiviteter' },
      { label: 'Sommer på Bjorli', canonical: '/sommer' },
      { label: 'Vinter på Bjorli', canonical: '/vinter' },
      { label: 'Vær og webkamera', canonical: '/vaer-og-webkamera' },
    ],
    providers: {
      novasol: { category: 'Private utleieenheter', desc: 'Utleie av private hytter og leiligheter på Bjorli og i Lesja gjennom Novasol.', ctaLabel: 'Søk hos Novasol' },
      bjorliheimen: { category: 'Hotell og hytter', desc: 'Hotell- og hytteovernatting midt på Bjorli.', ctaLabel: 'Søk hos Bjorliheimen' },
      mountainLodge: { category: 'Leiligheter', desc: 'Leiligheter på Bjorli for kortere og lengre opphold.', ctaLabel: 'Søk hos Bjorli Mountain Lodge' },
      vintercamping: { category: 'Hytter, camping, telt og bobil', desc: 'Overnatting for hytter, camping, telt og bobil.', ctaLabel: 'Søk hos Bjorli Vintercamping' },
      airbnb: { category: 'Leiligheter og hytter', desc: 'Private leiligheter og hytter på Bjorli lagt ut på Airbnb.', ctaLabel: 'Søk på Airbnb' },
      finn: { category: 'Leiligheter og hytter', desc: 'Private leiligheter og hytter på Bjorli lagt ut på Finn.no.', ctaLabel: 'Søk på Finn.no' },
      booking: { category: 'Leiligheter og hytter', desc: 'Overnatting på Bjorli tilgjengelig på Booking.com.', ctaLabel: 'Søk på Booking.com' },
      fjellstuer: { category: 'Leiligheter med hotellkomfort', desc: 'Leiligheter med hotellkomfort på Bjorli.', ctaLabel: 'Søk hos Bjorli Fjellstuer' },
    },
  },
  en: {
    heroTitle: 'Where to stay in Bjorli',
    heroSubtitle:
      'Cabins, apartments, hotels, camping and private rentals in and around Bjorli — gathered in one place so it’s easier to find something that fits your trip.',
    ctaPrimary: 'See places to stay',
    ctaSecondary: 'Plan your journey here',
    editorialTitle: 'Stay close to the mountains',
    editorialBody:
      'Bjorli is a practical base whether you’re planning summer days in the hills or a week on the slopes. Choose freely between hotels, apartments, cabins, camping and private rentals.',
    editorialImageAlt: 'Cabins in Bjorli with views toward the mountains.',
    providerSectionTitle: 'Places to stay',
    tipsTitle: 'Before you book',
    tips: [
      'Check prices, conditions and availability directly with each provider.',
      'Some offers are seasonal.',
      'Ski weekends and school holidays fill up fast — booking early helps.',
      'Travelling without a car? Check transport and distance to what you plan to do.',
    ],
    relatedTitle: 'Keep exploring',
    related: [
      { label: 'Getting here', canonical: '/reisen-hit' },
      { label: 'Things to do', canonical: '/aktiviteter' },
      { label: 'Summer in Bjorli', canonical: '/sommer' },
      { label: 'Winter in Bjorli', canonical: '/vinter' },
      { label: 'Weather & webcams', canonical: '/vaer-og-webkamera' },
    ],
    providers: {
      novasol: { category: 'Private rentals', desc: 'Private cabins and apartments in Bjorli and Lesja, rented through Novasol.', ctaLabel: 'Search Novasol' },
      bjorliheimen: { category: 'Hotel & cabins', desc: 'Hotel rooms and cabins right in the heart of Bjorli.', ctaLabel: 'Search Bjorliheimen' },
      mountainLodge: { category: 'Apartments', desc: 'Apartments in Bjorli for short and longer stays.', ctaLabel: 'Search Bjorli Mountain Lodge' },
      vintercamping: { category: 'Cabins, camping, tents and motorhomes', desc: 'Cabins, pitches for tents and motorhomes, and simple stays.', ctaLabel: 'Search Bjorli Vintercamping' },
      airbnb: { category: 'Apartments & cabins', desc: 'Private apartments and cabins in Bjorli listed on Airbnb.', ctaLabel: 'Search on Airbnb' },
      finn: { category: 'Apartments & cabins', desc: 'Private apartments and cabins in Bjorli listed on Finn.no.', ctaLabel: 'Search on Finn.no' },
      booking: { category: 'Apartments & cabins', desc: 'Places to stay in Bjorli, listed on Booking.com.', ctaLabel: 'Search on Booking.com' },
      fjellstuer: { category: 'Apartments with hotel service', desc: 'Apartments in Bjorli with the comfort of a hotel.', ctaLabel: 'Search Bjorli Fjellstuer' },
    },
  },
  de: {
    heroTitle: 'Unterkünfte in Bjorli',
    heroSubtitle:
      'Hütten, Apartments, Hotel, Camping und private Vermietung in und um Bjorli — gebündelt an einem Ort, damit Sie leichter das Passende für Ihre Reise finden.',
    ctaPrimary: 'Unterkünfte ansehen',
    ctaSecondary: 'Anreise planen',
    editorialTitle: 'Wohnen direkt am Berg',
    editorialBody:
      'Bjorli ist ein praktischer Ausgangspunkt — ob für Sommertage in den Bergen oder eine Woche auf der Piste. Wählen Sie frei zwischen Hotel, Apartments, Hütten, Camping und privater Vermietung.',
    editorialImageAlt: 'Hütten in Bjorli mit Blick auf die Berge.',
    providerSectionTitle: 'Unterkunftsmöglichkeiten',
    tipsTitle: 'Vor der Buchung',
    tips: [
      'Preise, Bedingungen und Verfügbarkeit am besten direkt beim Anbieter prüfen.',
      'Einige Angebote sind saisonabhängig.',
      'Skiwochenenden und Ferien sind schnell ausgebucht — frühzeitig buchen lohnt sich.',
      'Ohne Auto unterwegs? Prüfen Sie Anreise und Entfernung zu Ihren geplanten Aktivitäten.',
    ],
    relatedTitle: 'Weiter entdecken',
    related: [
      { label: 'Anreise', canonical: '/reisen-hit' },
      { label: 'Aktivitäten', canonical: '/aktiviteter' },
      { label: 'Sommer in Bjorli', canonical: '/sommer' },
      { label: 'Winter in Bjorli', canonical: '/vinter' },
      { label: 'Wetter & Webcams', canonical: '/vaer-og-webkamera' },
    ],
    providers: {
      novasol: { category: 'Private Vermietung', desc: 'Private Hütten und Apartments in Bjorli und Lesja, vermietet über Novasol.', ctaLabel: 'Bei Novasol suchen' },
      bjorliheimen: { category: 'Hotel & Hütten', desc: 'Hotelzimmer und Hütten mitten in Bjorli.', ctaLabel: 'Bei Bjorliheimen suchen' },
      mountainLodge: { category: 'Apartments', desc: 'Apartments in Bjorli für kurze und längere Aufenthalte.', ctaLabel: 'Bei Bjorli Mountain Lodge suchen' },
      vintercamping: { category: 'Hütten, Camping, Zelt & Wohnmobil', desc: 'Hütten, Stellplätze für Zelt und Wohnmobil sowie einfache Übernachtung.', ctaLabel: 'Bei Bjorli Vintercamping suchen' },
      airbnb: { category: 'Apartments & Hütten', desc: 'Private Apartments und Hütten in Bjorli auf Airbnb.', ctaLabel: 'Auf Airbnb suchen' },
      finn: { category: 'Apartments & Hütten', desc: 'Private Apartments und Hütten in Bjorli auf Finn.no.', ctaLabel: 'Auf Finn.no suchen' },
      booking: { category: 'Apartments & Hütten', desc: 'Unterkünfte in Bjorli, gelistet auf Booking.com.', ctaLabel: 'Auf Booking.com suchen' },
      fjellstuer: { category: 'Apartments mit Hotelkomfort', desc: 'Apartments in Bjorli mit Hotelkomfort und -service.', ctaLabel: 'Bei Bjorli Fjellstuer suchen' },
    },
  },
  nl: {
    heroTitle: 'Overnachten in Bjorli',
    heroSubtitle:
      'Hutten, appartementen, hotel, camping en privéverhuur in en rond Bjorli — overzichtelijk bij elkaar, zodat je sneller iets vindt dat bij je reis past.',
    ctaPrimary: 'Bekijk de mogelijkheden',
    ctaSecondary: 'Plan je reis hierheen',
    editorialTitle: 'Dicht bij de bergen verblijven',
    editorialBody:
      'Bjorli is een handige uitvalsbasis, of je nu zomerdagen in de bergen plant of een week op de piste. Kies vrij uit hotel, appartementen, hutten, camping en privéverhuur.',
    editorialImageAlt: 'Hutten in Bjorli met uitzicht op de bergen.',
    providerSectionTitle: 'Overnachtingsmogelijkheden',
    tipsTitle: 'Voor je boekt',
    tips: [
      'Check prijzen, voorwaarden en beschikbaarheid rechtstreeks bij de aanbieder.',
      'Sommige aanbiedingen zijn seizoensgebonden.',
      'Skiweekenden en vakanties zitten snel vol — vroeg boeken loont.',
      'Reis je zonder auto? Check vervoer en afstand tot wat je wilt doen.',
    ],
    relatedTitle: 'Verder verkennen',
    related: [
      { label: 'Reizen naar Bjorli', canonical: '/reisen-hit' },
      { label: 'Activiteiten', canonical: '/aktiviteter' },
      { label: 'Zomer in Bjorli', canonical: '/sommer' },
      { label: 'Winter in Bjorli', canonical: '/vinter' },
      { label: 'Weer & webcams', canonical: '/vaer-og-webkamera' },
    ],
    providers: {
      novasol: { category: 'Privéverhuur', desc: 'Privé-hutten en appartementen in Bjorli en Lesja, verhuurd via Novasol.', ctaLabel: 'Zoek bij Novasol' },
      bjorliheimen: { category: 'Hotel & hutten', desc: 'Hotelkamers en hutten midden in Bjorli.', ctaLabel: 'Zoek bij Bjorliheimen' },
      mountainLodge: { category: 'Appartementen', desc: 'Appartementen in Bjorli voor korte en langere verblijven.', ctaLabel: 'Zoek bij Bjorli Mountain Lodge' },
      vintercamping: { category: 'Hutten, camping, tent en camper', desc: 'Hutten, plekken voor tent en camper en eenvoudige overnachting.', ctaLabel: 'Zoek bij Bjorli Vintercamping' },
      airbnb: { category: 'Appartementen & hutten', desc: 'Privé-appartementen en -hutten in Bjorli op Airbnb.', ctaLabel: 'Zoek op Airbnb' },
      finn: { category: 'Appartementen & hutten', desc: 'Privé-appartementen en -hutten in Bjorli op Finn.no.', ctaLabel: 'Zoek op Finn.no' },
      booking: { category: 'Appartementen & hutten', desc: 'Overnachtingen in Bjorli op Booking.com.', ctaLabel: 'Zoek op Booking.com' },
      fjellstuer: { category: 'Appartementen met hotelcomfort', desc: 'Appartementen in Bjorli met het comfort van een hotel.', ctaLabel: 'Zoek bij Bjorli Fjellstuer' },
    },
  },
  da: {
    heroTitle: 'Overnatning på Bjorli',
    heroSubtitle:
      'Hytter, lejligheder, hotel, camping og private udlejninger på Bjorli og i nærområdet — samlet ét sted, så det er lettere at finde det rette for din tur.',
    ctaPrimary: 'Se overnatningsmuligheder',
    ctaSecondary: 'Planlæg rejsen hertil',
    editorialTitle: 'Bo tæt på fjeldet',
    editorialBody:
      'Bjorli er et praktisk udgangspunkt, uanset om du planlægger sommerdage i fjeldet eller en uge på pisten. Vælg frit mellem hotel, lejligheder, hytter, camping og private udlejninger.',
    editorialImageAlt: 'Hytter på Bjorli med udsigt mod fjeldet.',
    providerSectionTitle: 'Overnatningsmuligheder',
    tipsTitle: 'Inden du booker',
    tips: [
      'Tjek pris, vilkår og tilgængelighed direkte hos den enkelte udbyder.',
      'Nogle tilbud er sæsonbaserede.',
      'Skiweekender og ferier bliver hurtigt fyldt — book gerne tidligt.',
      'Rejser du uden bil? Tjek transport og afstand til det, du planlægger.',
    ],
    relatedTitle: 'Udforsk videre',
    related: [
      { label: 'Rejsen hertil', canonical: '/reisen-hit' },
      { label: 'Aktiviteter', canonical: '/aktiviteter' },
      { label: 'Sommer på Bjorli', canonical: '/sommer' },
      { label: 'Vinter på Bjorli', canonical: '/vinter' },
      { label: 'Vejr & webcams', canonical: '/vaer-og-webkamera' },
    ],
    providers: {
      novasol: { category: 'Privat udlejning', desc: 'Private hytter og lejligheder på Bjorli og i Lesja, udlejet via Novasol.', ctaLabel: 'Søg hos Novasol' },
      bjorliheimen: { category: 'Hotel & hytter', desc: 'Hotelværelser og hytter midt på Bjorli.', ctaLabel: 'Søg hos Bjorliheimen' },
      mountainLodge: { category: 'Lejligheder', desc: 'Lejligheder på Bjorli til korte og længere ophold.', ctaLabel: 'Søg hos Bjorli Mountain Lodge' },
      vintercamping: { category: 'Hytter, camping, telt og autocamper', desc: 'Hytter, pladser til telt og autocamper samt enkel overnatning.', ctaLabel: 'Søg hos Bjorli Vintercamping' },
      airbnb: { category: 'Lejligheder & hytter', desc: 'Private lejligheder og hytter på Bjorli annonceret på Airbnb.', ctaLabel: 'Søg på Airbnb' },
      finn: { category: 'Lejligheder & hytter', desc: 'Private lejligheder og hytter på Bjorli annonceret på Finn.no.', ctaLabel: 'Søg på Finn.no' },
      booking: { category: 'Lejligheder & hytter', desc: 'Overnatninger på Bjorli, vist på Booking.com.', ctaLabel: 'Søg på Booking.com' },
      fjellstuer: { category: 'Lejligheder med hotelkomfort', desc: 'Lejligheder på Bjorli med hotelkomfort og service.', ctaLabel: 'Søg hos Bjorli Fjellstuer' },
    },
  },
  sv: {
    heroTitle: 'Boende på Bjorli',
    heroSubtitle:
      'Stugor, lägenheter, hotell, camping och privat uthyrning på Bjorli och i närområdet — samlat på ett ställe så det blir enklare att hitta något som passar din resa.',
    ctaPrimary: 'Se boendealternativ',
    ctaSecondary: 'Planera resan hit',
    editorialTitle: 'Bo nära fjället',
    editorialBody:
      'Bjorli är en praktisk bas oavsett om du planerar sommardagar i fjället eller en vecka i backen. Välj fritt mellan hotell, lägenheter, stugor, camping och privat uthyrning.',
    editorialImageAlt: 'Stugor på Bjorli med utsikt mot fjället.',
    providerSectionTitle: 'Boendealternativ',
    tipsTitle: 'Innan du bokar',
    tips: [
      'Kolla pris, villkor och tillgänglighet direkt hos respektive aktör.',
      'En del erbjudanden är säsongsbaserade.',
      'Skidhelger och lov fylls snabbt — boka gärna i god tid.',
      'Reser du utan bil? Kolla transport och avstånd till det du tänker göra.',
    ],
    relatedTitle: 'Utforska vidare',
    related: [
      { label: 'Resa hit', canonical: '/reisen-hit' },
      { label: 'Aktiviteter', canonical: '/aktiviteter' },
      { label: 'Sommar på Bjorli', canonical: '/sommer' },
      { label: 'Vinter på Bjorli', canonical: '/vinter' },
      { label: 'Väder & webbkameror', canonical: '/vaer-og-webkamera' },
    ],
    providers: {
      novasol: { category: 'Privat uthyrning', desc: 'Privata stugor och lägenheter på Bjorli och i Lesja, uthyrda via Novasol.', ctaLabel: 'Sök hos Novasol' },
      bjorliheimen: { category: 'Hotell & stugor', desc: 'Hotellrum och stugor mitt på Bjorli.', ctaLabel: 'Sök hos Bjorliheimen' },
      mountainLodge: { category: 'Lägenheter', desc: 'Lägenheter på Bjorli för kortare och längre vistelser.', ctaLabel: 'Sök hos Bjorli Mountain Lodge' },
      vintercamping: { category: 'Stugor, camping, tält och husbil', desc: 'Stugor, platser för tält och husbil samt enklare boende.', ctaLabel: 'Sök hos Bjorli Vintercamping' },
      airbnb: { category: 'Lägenheter & stugor', desc: 'Privata lägenheter och stugor på Bjorli på Airbnb.', ctaLabel: 'Sök på Airbnb' },
      finn: { category: 'Lägenheter & stugor', desc: 'Privata lägenheter och stugor på Bjorli på Finn.no.', ctaLabel: 'Sök på Finn.no' },
      booking: { category: 'Lägenheter & stugor', desc: 'Boende på Bjorli, listat på Booking.com.', ctaLabel: 'Sök på Booking.com' },
      fjellstuer: { category: 'Lägenheter med hotellkomfort', desc: 'Lägenheter på Bjorli med hotellkomfort och service.', ctaLabel: 'Sök hos Bjorli Fjellstuer' },
    },
  },
};

const Accommodation = () => {
  const t = usePageCopy(COPY);
  const lp = useLocalizedPath();
  const { locale } = useLanguage();
  const altFor = PROVIDER_ALT_TEMPLATE[locale] ?? PROVIDER_ALT_TEMPLATE.no;
  return (
    <div>
      <PageHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        image={heroImg}
      />

      {/* Hero CTAs */}
      <section className="py-10 px-4 border-b border-border/60">
        <div className="container mx-auto max-w-5xl flex flex-wrap gap-3 justify-center">
          <a href="#overnattingsmuligheter">
            <Button size="lg" className="font-medium">
              {t.ctaPrimary}
            </Button>
          </a>
          <Link to={lp('/reisen-hit')}>
            <Button size="lg" variant="outline" className="font-medium">
              {t.ctaSecondary}
            </Button>
          </Link>
        </div>
      </section>

      {/* Editorial */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{t.editorialTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{t.editorialBody}</p>
          </motion.div>
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            src={editorialImg}
            alt={t.editorialImageAlt}
            loading="lazy"
            className="rounded-2xl w-full aspect-[5/4] object-cover"
          />
        </div>
      </section>

      {/* Provider grid */}
      <section id="overnattingsmuligheter" className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 text-center">
            {t.providerSectionTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((p, i) => {
              const pc = t.providers[p.key];
              return (
              <motion.article
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-secondary/40 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl bg-muted">
                  <img
                    src={PROVIDER_IMAGES[p.key]}
                    alt={altFor(p.name)}
                    loading="lazy"
                    className="w-full aspect-[16/10] object-cover"
                  />
                </div>
                <Home className="h-5 w-5 mb-3 text-secondary" />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {pc.category}
                </span>
                <h3 className="font-display text-xl font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  {pc.desc}
                </p>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-auto"
                  onClick={() =>
                    trackAccommodationLinkClick({
                      provider_name: p.name,
                      provider_category: PROVIDER_CATEGORY[p.key],
                      link_url: p.href,
                      link_text: pc.ctaLabel,
                    })
                  }
                >
                  <Button variant="outline" className="w-full font-medium">
                    {pc.ctaLabel}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">{t.tipsTitle}</h2>
          <ul className="space-y-3">
            {t.tips.map((tip) => (
              <li
                key={tip}
                className="flex gap-3 text-muted-foreground leading-relaxed"
              >
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related links */}
      <section className="py-12 md:py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">{t.relatedTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {t.related.map((l) => (
              <Link
                key={l.canonical}
                to={lp(l.canonical)}
                className="group flex items-center justify-between gap-3 bg-card rounded-xl border border-border px-5 py-4 hover:border-secondary/40 transition-colors"
              >
                <span className="font-medium">{l.label}</span>
                <ArrowRight className="h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accommodation;
