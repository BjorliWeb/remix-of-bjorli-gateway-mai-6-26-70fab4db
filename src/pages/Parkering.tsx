import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { Car, CreditCard, Info, ArrowLeft } from 'lucide-react';
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