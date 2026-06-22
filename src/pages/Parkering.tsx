import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import parkeringKart from '@/assets/parkering-kart-bjorli.png';
import betalingsautomatBilde from '@/assets/parkering-betalingsautomat.jpeg';
import { Car, CreditCard, Info, ArrowLeft, Banknote, ExternalLink, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Dedicated parking page for Bjorli Skisenter.
 * Norwegian-first practical info — content is factual and avoids inventing
 * discounts, opening hours or terms. Prices are taken from the published
 * practical parking rates and labelled as such.
 */
const Parkering = () => {
  const { t } = useLanguage();
  const lp = useLocalizedPath();

  const areas = [
    {
      name: 'P1 – Hovedparkering',
      desc: '30 minutters gjennomkjøring, deretter kr 95 per parkering.',
    },
    {
      name: 'P2 – T-Kroken',
      desc: '30 minutters gjennomkjøring, deretter kr 115 per parkeringsopphold mellom kl. 08:00–16:00. Spisende gjester ved T-Kroken parkerer gratis inntil 2 timer mot registrering i restauranten.',
    },
  ];

  return (
    <div>
      <PageHero
        title="Parkering ved Bjorli Skisenter"
        subtitle="Slik fungerer parkering og betaling på P1 og P2."
        image={heroImage}
      />

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 text-foreground/85 leading-relaxed"
          >
            <p>
              Parkering ved Bjorli Skisenter håndteres med elektronisk
              parkering og skiltgjenkjenning. Det er ikke gratis å parkere,
              og gjester må forholde seg til skilt og betalingsinstruksjoner
              på stedet.
            </p>
            <p>
              Det finnes to parkeringsområder: <strong>P1 / Hovedparkering</strong>{' '}
              og <strong>P2 / T-Kroken</strong>.
            </p>
          </motion.div>

          <figure className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-border shadow-md bg-card">
              <img
                src={parkeringKart}
                alt="Kart over parkering ved Bjorli Skisenter med P1, P2 og betalingsautomat merket BA."
                className="w-full h-auto block"
                loading="lazy"
              />
            </div>
            <figcaption className="text-sm text-foreground/70 leading-relaxed">
              Oversikt over parkering ved Bjorli Skisenter. P1 er
              hovedparkering, P2 ligger ved T-Kroken, og BA viser
              betalingsautomaten.
            </figcaption>
          </figure>

          <div className="grid gap-4 md:grid-cols-2">
            {areas.map((a) => (
              <div
                key={a.name}
                className="bg-card rounded-xl p-6 shadow-md border border-border"
              >
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
              <h2 className="font-display text-lg font-semibold">Betaling</h2>
            </div>
            <ul className="space-y-2 text-foreground/85 leading-relaxed list-disc pl-5">
              <li>Parkering betales gjennom Parkly – via app, på nett eller på betalingsautomat der dette er tilgjengelig.</li>
              <li>Servicetillegg og fakturagebyr kan tilkomme.</li>
              <li>Årskort parkering: kr 900 per plass.</li>
              <li>
                Alle spørsmål om parkering og betaling rettes til Parkly
                kundeservice.
              </li>
            </ul>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border space-y-4">
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 text-secondary" />
              <h2 className="font-display text-lg font-semibold">Betalingsautomat</h2>
            </div>
            <p className="text-foreground/85 leading-relaxed">
              Det finnes en egen betalingsautomat hvor du kan betale for
              parkering før du forlater skianlegget. Automaten er plassert
              rett rundt hjørnet for skikortautomaten og er merket BA på
              kartet.
            </p>
            <figure className="space-y-2">
              <div className="rounded-lg overflow-hidden border border-border bg-muted/30">
                <img
                  src={betalingsautomatBilde}
                  alt="Betalingsautomat for parkering ved Bjorli Skisenter."
                  className="w-full h-auto max-h-[420px] object-cover block"
                  loading="lazy"
                />
              </div>
              <figcaption className="text-sm text-foreground/70 leading-relaxed">
                Betalingsautomaten står ved skisenteret, rett rundt hjørnet
                for skikortautomaten.
              </figcaption>
            </figure>
          </div>

          <div className="bg-card rounded-xl p-6 shadow-md border border-border space-y-4">
            <div className="flex items-center gap-3">
              <LifeBuoy className="h-5 w-5 text-secondary" />
              <h2 className="font-display text-lg font-semibold">Kundeservice</h2>
            </div>
            <p className="text-foreground/85 leading-relaxed">
              Alle henvendelser vedrørende parkering, inkludert betaling,
              rettes til Parkly.
            </p>
            <a
              href="https://www.parkly.no/kundeservice/"
              target="_blank"
              rel="noopener noreferrer external"
              className="inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
            >
              Kontakt Parkly kundeservice <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-5 flex gap-3">
            <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/80 leading-relaxed">
              Prisene over er praktiske parkeringssatser. Sjekk alltid skilt
              og oppdaterte instruksjoner på parkeringsområdet før du forlater
              bilen.
            </p>
          </div>

          <div>
            <Link
              to={lp('/praktisk-info')}
              className="inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Tilbake til praktisk info
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Parkering;