import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import loypekartImage from '@/assets/bjorli-skisenter-loypekart-vinter.jpg';
import { Mountain, ArrowUpRight, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';
import { JsonLd } from '@/components/seo';
import { buildSkiResort } from '@/lib/seo/schema';

const SkiCenter = () => {
  const { t } = useLanguage();
  const s = t.skiCenter;

  const stats = [
    { label: s.lifts, value: '6' },
    { label: s.slopes, value: '11' },
    { label: s.altitude, value: '575–1225m' },
    { label: s.season, value: 'Nov–Mai' },
  ];

  // Canonical URL for this page in the current locale (falls back to
  // production origin during SSR). The schema name is intentionally the
  // proper Norwegian brand "Bjorli Skisenter" in every locale.
  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://www.bjorli.no/bjorli-skisenter';

  return (
    <div>
      <JsonLd id="jsonld-skiresort" data={buildSkiResort(pageUrl, s.desc)} />
      <PageHero title={s.title} subtitle={s.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg text-muted-foreground leading-relaxed mb-12 text-center">
            {s.desc}
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-6 text-center shadow-md border border-border">
                <div className="text-3xl font-bold text-secondary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
            <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
              <Snowflake className="h-6 w-6 text-secondary" />
              {s.lifts}
            </h3>
            <ul className="space-y-3">
              {s.liftsList.map((lift) => (
                <li key={lift} className="flex items-center gap-3 text-muted-foreground">
                  <Mountain className="h-4 w-4 text-secondary shrink-0" />
                  {lift}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center mt-10">
            <a href="https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline text-lg">
              {t.nav.buyLiftPass} <ArrowUpRight className="h-5 w-5" />
            </a>
          </div>
          <figure className="mt-16 space-y-3">
            <a
              href={loypekartImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-border shadow-md bg-card"
              aria-label="Åpne løypekart i full størrelse"
            >
              <img
                src={loypekartImage}
                alt="Løypekart for Bjorli Skisenter med alpinløyper, heiser, langrennsløyper og symbolforklaring."
                className="w-full h-auto block"
                loading="lazy"
              />
            </a>
            <figcaption className="text-sm text-foreground/70 leading-relaxed">
              Løypekart for Bjorli Skisenter. Kartet viser alpinløyper, heiser, nærområde, symboler og tilknyttede langrennsløyper.
            </figcaption>
            <p className="text-xs text-muted-foreground">
              Se alltid skilt, vær- og føreforhold og oppdatert informasjon på bjorli.no for gjeldende drift.
            </p>
          </figure>
        </div>
      </section>
    </div>
  );
};

export default SkiCenter;
