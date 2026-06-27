import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import parkeringKart from '@/assets/parkering-kart-bjorli.png';
import betalingsautomatBilde from '@/assets/parkering-betalingsautomat.jpeg';
import { Car, CreditCard, Info, Banknote, ExternalLink, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';
import { trackExternalPartnerClick } from '@/lib/analytics';

/**
 * Dedicated parking page for Bjorli Skisenter.
 * Factual practical info — no invented discounts, opening hours or terms.
 * Prices are taken from the published practical parking rates.
 */

type Copy = {
  heroTitle: string;
  heroSubtitle: string;
  intro1: string;
  intro2Before: string;
  intro2P1: string;
  intro2And: string;
  intro2P2: string;
  intro2After: string;
  mapAlt: string;
  mapCaption: string;
  p1Name: string;
  p1Desc: string;
  p2Name: string;
  p2Desc: string;
  paymentTitle: string;
  paymentItems: string[];
  paymentCta: string;
  machineTitle: string;
  machineDesc: string;
  machineAlt: string;
  machineCaption: string;
  supportTitle: string;
  supportDesc: string;
  supportCta: string;
  noteText: string;
};

const COPY: Record<Locale, Copy> = {
  no: {
    heroTitle: 'Parkering ved Bjorli Skisenter',
    heroSubtitle: 'Slik fungerer parkering og betaling på P1 og P2.',
    intro1:
      'Parkeringen ved skisenteret driftes av Parkly med skiltgjenkjenning, så du trenger ikke trekke billett. Følg skiltingen og betalingsanvisningene når du kommer fram.',
    intro2Before: 'Det finnes to områder å velge mellom: ',
    intro2P1: 'P1 / Hovedparkering',
    intro2And: ' og ',
    intro2P2: 'P2 / T-Kroken',
    intro2After: '.',
    mapAlt: 'Kart over parkering ved Bjorli Skisenter med P1, P2 og betalingsautomat merket BA.',
    mapCaption:
      'Oversikt over parkeringen. P1 er hovedparkeringen, P2 ligger ved T-Kroken, og BA viser hvor betalingsautomaten står.',
    p1Name: 'P1 – Hovedparkering',
    p1Desc: '30 minutters gjennomkjøring, deretter kr 95 per parkering.',
    p2Name: 'P2 – T-Kroken',
    p2Desc:
      '30 minutters gjennomkjøring, deretter kr 115 per parkeringsopphold mellom kl. 08:00–16:00. Spiser du på T-Kroken parkerer du gratis inntil 2 timer mot registrering i restauranten.',
    paymentTitle: 'Betaling',
    paymentItems: [
      'Du betaler via Parkly — i app, på nett eller på betalingsautomaten på området.',
      'Servicetillegg og fakturagebyr kan tilkomme.',
      'Årskort parkering koster kr 900 per plass.',
      'Spørsmål om parkering eller betaling rettes til Parkly kundeservice.',
    ],
    paymentCta: 'Betal parkering på nett',
    machineTitle: 'Betalingsautomat',
    machineDesc:
      'Vil du heller betale på stedet før du kjører ut? Det står en egen betalingsautomat rett rundt hjørnet for skikortautomaten. På kartet er den merket BA.',
    machineAlt: 'Betalingsautomat for parkering ved Bjorli Skisenter.',
    machineCaption: 'Betalingsautomaten ved skisenteret — rett rundt hjørnet for skikortautomaten.',
    supportTitle: 'Kundeservice',
    supportDesc: 'Alt som handler om parkering og betaling håndteres av Parkly.',
    supportCta: 'Kontakt Parkly kundeservice',
    noteText:
      'Prisene over er gjeldende parkeringssatser. Skiltene på området går alltid foran — sjekk dem før du forlater bilen.',
  },
  en: {
    heroTitle: 'Parking at Bjorli Skisenter',
    heroSubtitle: 'How parking and payment work at P1 and P2.',
    intro1:
      'Parking at the ski resort is run by Parkly using number-plate recognition, so there is no ticket to collect. Just follow the signs and the payment instructions when you arrive.',
    intro2Before: 'There are two areas to choose from: ',
    intro2P1: 'P1 / Main car park',
    intro2And: ' and ',
    intro2P2: 'P2 / T-Kroken',
    intro2After: '.',
    mapAlt: 'Map of parking at Bjorli Skisenter showing P1, P2 and the payment machine marked BA.',
    mapCaption:
      'Parking overview. P1 is the main car park, P2 is by T-Kroken, and BA marks the payment machine.',
    p1Name: 'P1 – Main car park',
    p1Desc: '30 minutes drive-through, then NOK 95 per parking stay.',
    p2Name: 'P2 – T-Kroken',
    p2Desc:
      '30 minutes drive-through, then NOK 115 per stay between 08:00 and 16:00. Guests eating at T-Kroken park free for up to 2 hours, registered in the restaurant.',
    paymentTitle: 'Payment',
    paymentItems: [
      'You pay through Parkly — in the app, online or at the on-site payment machine.',
      'Service fees and invoice charges may apply.',
      'An annual parking pass costs NOK 900 per space.',
      'Any questions about parking or payment go to Parkly customer service.',
    ],
    paymentCta: 'Pay for parking online',
    machineTitle: 'Payment machine',
    machineDesc:
      'Prefer to pay on site before you drive out? There is a dedicated machine just around the corner from the lift-ticket machine. It is marked BA on the map.',
    machineAlt: 'Parking payment machine at Bjorli Skisenter.',
    machineCaption: 'The payment machine at the resort, just around the corner from the lift-ticket machine.',
    supportTitle: 'Customer service',
    supportDesc: 'Anything to do with parking and payment is handled by Parkly.',
    supportCta: 'Contact Parkly customer service',
    noteText:
      'The prices above are the current parking rates. The signs on site always take precedence — check them before you leave the car.',
  },
  de: {
    heroTitle: 'Parken am Bjorli Skisenter',
    heroSubtitle: 'So funktionieren Parken und Bezahlen auf P1 und P2.',
    intro1:
      'Das Parken am Skigebiet wird von Parkly mit Kennzeichenerkennung betrieben — Sie müssen also kein Ticket ziehen. Folgen Sie bei der Ankunft einfach der Beschilderung und den Bezahlhinweisen.',
    intro2Before: 'Es gibt zwei Bereiche zur Auswahl: ',
    intro2P1: 'P1 / Hauptparkplatz',
    intro2And: ' und ',
    intro2P2: 'P2 / T-Kroken',
    intro2After: '.',
    mapAlt: 'Karte der Parkflächen am Bjorli Skisenter mit P1, P2 und Bezahlautomat (BA).',
    mapCaption:
      'Übersicht der Parkflächen. P1 ist der Hauptparkplatz, P2 liegt am T-Kroken, BA zeigt den Bezahlautomaten.',
    p1Name: 'P1 – Hauptparkplatz',
    p1Desc: '30 Minuten Durchfahrt, danach 95 NOK pro Parkvorgang.',
    p2Name: 'P2 – T-Kroken',
    p2Desc:
      '30 Minuten Durchfahrt, danach 115 NOK pro Aufenthalt zwischen 08:00 und 16:00 Uhr. Gäste, die im T-Kroken essen, parken bis zu 2 Stunden kostenlos — Registrierung erfolgt im Restaurant.',
    paymentTitle: 'Bezahlung',
    paymentItems: [
      'Bezahlt wird über Parkly — in der App, online oder am Bezahlautomaten vor Ort.',
      'Servicegebühren und Rechnungszuschläge können hinzukommen.',
      'Eine Jahres-Parkkarte kostet 900 NOK pro Stellplatz.',
      'Fragen rund um Parken und Bezahlen beantwortet der Parkly-Kundenservice.',
    ],
    paymentCta: 'Parken online bezahlen',
    machineTitle: 'Bezahlautomat',
    machineDesc:
      'Lieber direkt vor Ort bezahlen, bevor Sie wegfahren? Der Bezahlautomat steht gleich um die Ecke vom Skipass-Automaten. Auf der Karte ist er mit BA markiert.',
    machineAlt: 'Bezahlautomat für die Parkflächen am Bjorli Skisenter.',
    machineCaption: 'Der Bezahlautomat am Skigebiet — gleich um die Ecke vom Skipass-Automaten.',
    supportTitle: 'Kundenservice',
    supportDesc: 'Alles rund um Parken und Bezahlen wird von Parkly betreut.',
    supportCta: 'Parkly-Kundenservice kontaktieren',
    noteText:
      'Die genannten Preise sind die aktuellen Parkgebühren. Maßgeblich sind immer die Schilder vor Ort — prüfen Sie diese, bevor Sie das Auto verlassen.',
  },
  nl: {
    heroTitle: 'Parkeren bij Bjorli Skisenter',
    heroSubtitle: 'Zo werken parkeren en betalen op P1 en P2.',
    intro1:
      'Het parkeren bij het skigebied wordt verzorgd door Parkly met kentekenherkenning — je hoeft dus geen kaartje te trekken. Volg gewoon de borden en de betaalinstructies bij aankomst.',
    intro2Before: 'Er zijn twee zones om uit te kiezen: ',
    intro2P1: 'P1 / Hoofdparking',
    intro2And: ' en ',
    intro2P2: 'P2 / T-Kroken',
    intro2After: '.',
    mapAlt: 'Kaart van de parkeerplaatsen bij Bjorli Skisenter met P1, P2 en de betaalautomaat (BA).',
    mapCaption:
      'Overzicht van de parkeerplaatsen. P1 is de hoofdparking, P2 ligt bij T-Kroken en BA geeft de betaalautomaat aan.',
    p1Name: 'P1 – Hoofdparking',
    p1Desc: '30 minuten doorrijden, daarna NOK 95 per parkeerbeurt.',
    p2Name: 'P2 – T-Kroken',
    p2Desc:
      '30 minuten doorrijden, daarna NOK 115 per parkeerbeurt tussen 08:00 en 16:00 uur. Eet je bij T-Kroken, dan parkeer je tot 2 uur gratis na registratie in het restaurant.',
    paymentTitle: 'Betalen',
    paymentItems: [
      'Betalen doe je via Parkly — in de app, online of bij de betaalautomaat ter plaatse.',
      'Servicekosten en factuurkosten kunnen bijkomen.',
      'Een jaarkaart voor parkeren kost NOK 900 per plaats.',
      'Vragen over parkeren of betalen lopen via de klantenservice van Parkly.',
    ],
    paymentCta: 'Parkeren online betalen',
    machineTitle: 'Betaalautomaat',
    machineDesc:
      'Liever ter plaatse afrekenen voordat je wegrijdt? Er staat een aparte automaat vlak om de hoek bij de skipasautomaat. Op de kaart is hij aangeduid met BA.',
    machineAlt: 'Betaalautomaat voor de parkeerplaats bij Bjorli Skisenter.',
    machineCaption: 'De betaalautomaat bij het skigebied — vlak om de hoek bij de skipasautomaat.',
    supportTitle: 'Klantenservice',
    supportDesc: 'Alles rond parkeren en betalen wordt door Parkly afgehandeld.',
    supportCta: 'Neem contact op met Parkly-klantenservice',
    noteText:
      'De genoemde prijzen zijn de actuele parkeertarieven. De borden ter plaatse gelden altijd — kijk daar nog even naar voordat je je auto verlaat.',
  },
  da: {
    heroTitle: 'Parkering ved Bjorli Skisenter',
    heroSubtitle: 'Sådan fungerer parkering og betaling på P1 og P2.',
    intro1:
      'Parkeringen ved skicentret drives af Parkly med nummerpladegenkendelse, så du skal ikke trække en billet. Følg skiltningen og betalingsanvisningerne, når du kommer.',
    intro2Before: 'Der er to områder at vælge mellem: ',
    intro2P1: 'P1 / Hovedparkering',
    intro2And: ' og ',
    intro2P2: 'P2 / T-Kroken',
    intro2After: '.',
    mapAlt: 'Kort over parkering ved Bjorli Skisenter med P1, P2 og betalingsautomat (BA).',
    mapCaption:
      'Oversigt over parkeringen. P1 er hovedparkeringen, P2 ligger ved T-Kroken, og BA viser betalingsautomaten.',
    p1Name: 'P1 – Hovedparkering',
    p1Desc: '30 minutters gennemkørsel, derefter 95 NOK pr. parkering.',
    p2Name: 'P2 – T-Kroken',
    p2Desc:
      '30 minutters gennemkørsel, derefter 115 NOK pr. ophold mellem kl. 08:00 og 16:00. Spiser du på T-Kroken, parkerer du gratis i op til 2 timer mod registrering i restauranten.',
    paymentTitle: 'Betaling',
    paymentItems: [
      'Du betaler via Parkly — i appen, online eller ved betalingsautomaten på området.',
      'Servicegebyrer og fakturagebyrer kan tilkomme.',
      'Et årskort til parkering koster 900 NOK pr. plads.',
      'Spørgsmål om parkering og betaling går til Parklys kundeservice.',
    ],
    paymentCta: 'Betal parkering online',
    machineTitle: 'Betalingsautomat',
    machineDesc:
      'Vil du hellere betale på stedet, før du kører ud? Der står en automat lige rundt om hjørnet ved skipasautomaten. På kortet er den markeret med BA.',
    machineAlt: 'Betalingsautomat til parkering ved Bjorli Skisenter.',
    machineCaption: 'Betalingsautomaten ved skicentret — lige rundt om hjørnet ved skipasautomaten.',
    supportTitle: 'Kundeservice',
    supportDesc: 'Alt om parkering og betaling håndteres af Parkly.',
    supportCta: 'Kontakt Parklys kundeservice',
    noteText:
      'Priserne ovenfor er de gældende parkeringssatser. Skiltene på stedet går altid forud — tjek dem, før du forlader bilen.',
  },
  sv: {
    heroTitle: 'Parkering vid Bjorli Skisenter',
    heroSubtitle: 'Så fungerar parkering och betalning på P1 och P2.',
    intro1:
      'Parkeringen vid skidanläggningen sköts av Parkly med registreringsskyltigenkänning, så du behöver inte dra någon biljett. Följ skyltarna och betalningsanvisningarna när du kommer fram.',
    intro2Before: 'Det finns två områden att välja mellan: ',
    intro2P1: 'P1 / Huvudparkering',
    intro2And: ' och ',
    intro2P2: 'P2 / T-Kroken',
    intro2After: '.',
    mapAlt: 'Karta över parkeringen vid Bjorli Skisenter med P1, P2 och betalautomaten (BA).',
    mapCaption:
      'Översikt över parkeringen. P1 är huvudparkeringen, P2 ligger vid T-Kroken och BA visar betalautomaten.',
    p1Name: 'P1 – Huvudparkering',
    p1Desc: '30 minuters genomkörning, sedan 95 NOK per parkering.',
    p2Name: 'P2 – T-Kroken',
    p2Desc:
      '30 minuters genomkörning, sedan 115 NOK per parkering mellan kl. 08:00 och 16:00. Äter du på T-Kroken parkerar du gratis i upp till 2 timmar mot registrering i restaurangen.',
    paymentTitle: 'Betalning',
    paymentItems: [
      'Du betalar via Parkly — i appen, på webben eller vid betalautomaten på plats.',
      'Serviceavgifter och fakturaavgifter kan tillkomma.',
      'Ett årskort för parkering kostar 900 NOK per plats.',
      'Frågor om parkering och betalning hanteras av Parklys kundtjänst.',
    ],
    paymentCta: 'Betala parkering online',
    machineTitle: 'Betalautomat',
    machineDesc:
      'Vill du hellre betala på plats innan du kör ut? Det finns en egen automat precis runt hörnet från skipassautomaten. På kartan är den märkt BA.',
    machineAlt: 'Betalautomat för parkering vid Bjorli Skisenter.',
    machineCaption: 'Betalautomaten vid anläggningen — precis runt hörnet från skipassautomaten.',
    supportTitle: 'Kundtjänst',
    supportDesc: 'Allt som rör parkering och betalning sköts av Parkly.',
    supportCta: 'Kontakta Parklys kundtjänst',
    noteText:
      'Priserna ovan är gällande parkeringstaxor. Skyltarna på plats gäller alltid — kontrollera dem innan du lämnar bilen.',
  },
};

const Parkering = () => {
  const t = usePageCopy(COPY);
  const areas = [
    { name: t.p1Name, desc: t.p1Desc },
    { name: t.p2Name, desc: t.p2Desc },
  ];

  return (
    <div>
      <PageHero title={t.heroTitle} subtitle={t.heroSubtitle} image={heroImage} />

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 text-foreground/85 leading-relaxed"
          >
            <p>{t.intro1}</p>
            <p>
              {t.intro2Before}
              <strong>{t.intro2P1}</strong>
              {t.intro2And}
              <strong>{t.intro2P2}</strong>
              {t.intro2After}
            </p>
          </motion.div>

          <figure className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-border shadow-md bg-card">
              <img src={parkeringKart} alt={t.mapAlt} className="w-full h-auto block" loading="lazy" />
            </div>
            <figcaption className="text-sm text-foreground/70 leading-relaxed">{t.mapCaption}</figcaption>
          </figure>

          <div className="grid gap-4 md:grid-cols-2">
            {areas.map((a) => (
              <div key={a.name} className="bg-card rounded-xl p-6 shadow-md border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Car className="h-5 w-5 text-secondary" />
                  <h2 className="font-display text-lg font-semibold">{a.name}</h2>
                </div>
                <p className="text-foreground/85 leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="h-5 w-5 text-secondary" />
              <h2 className="font-display text-lg font-semibold">{t.paymentTitle}</h2>
            </div>
            <ul className="space-y-2 text-foreground/85 leading-relaxed list-disc pl-5">
              {t.paymentItems.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <a
              href="https://pay.parkly.no/"
              target="_blank"
              rel="noopener noreferrer external"
              className="mt-4 inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
              onClick={() =>
                trackExternalPartnerClick({
                  partner_name: 'Parkly',
                  partner_category: 'parking',
                  link_url: 'https://pay.parkly.no/',
                  link_text: t.paymentCta,
                })
              }
            >
              {t.paymentCta} <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border space-y-4">
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-secondary" />
              <h2 className="font-display text-lg font-semibold">{t.machineTitle}</h2>
            </div>
            <p className="text-foreground/85 leading-relaxed">{t.machineDesc}</p>
            <figure className="space-y-2">
              <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
                <img
                  src={betalingsautomatBilde}
                  alt={t.machineAlt}
                  className="w-full h-auto max-h-[420px] object-cover block"
                  loading="lazy"
                />
              </div>
              <figcaption className="text-sm text-foreground/70 leading-relaxed">{t.machineCaption}</figcaption>
            </figure>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border space-y-4">
            <div className="flex items-center gap-3">
              <LifeBuoy className="h-5 w-5 text-secondary" />
              <h2 className="font-display text-lg font-semibold">{t.supportTitle}</h2>
            </div>
            <p className="text-foreground/85 leading-relaxed">{t.supportDesc}</p>
            <a
              href="https://www.parkly.no/kundeservice/"
              target="_blank"
              rel="noopener noreferrer external"
              className="inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
              onClick={() =>
                trackExternalPartnerClick({
                  partner_name: 'Parkly',
                  partner_category: 'parking',
                  link_url: 'https://www.parkly.no/kundeservice/',
                  link_text: t.supportCta,
                })
              }
            >
              {t.supportCta} <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-5 flex gap-3">
            <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80 leading-relaxed">{t.noteText}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Parkering;