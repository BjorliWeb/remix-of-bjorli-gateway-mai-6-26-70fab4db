import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Car } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { Button } from '@/components/ui/button';
import { useCms, getHomepage } from '@/lib/cms';
import HomepageSections from '@/components/HomepageSections';

/**
 * Summer homepage. Editorial content delivered by the CMS layer
 * (`getHomepage` with season=summer). Hero stays page-specific.
 */
const Sommer = () => {
  const { locale, d } = useLanguage();
  const lp = useLocalizedPath();
  const home = useCms(() => getHomepage({ language: locale, season: 'summer' }), [locale]);

  if (!home) return null;

  // Hero copy is fixed for the summer page (placeholder until WordPress).
  const heroTitle    = 'Sommer på Bjorli';
  const heroSubtitle = 'Basecamp mellom fjell og fjord – med turer, sykling, fiske og ekte fjellro rett utenfor døra.';
  const heroEyebrow  = d.summer.eyebrow ?? d.summer.badge;
  // Final CTA copy
  const finalTitle = 'Planlegg sommerdagene på Bjorli';

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {home.heroImage && (
          <img src={home.heroImage.url} alt={home.heroImage.alt || heroTitle} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary-foreground/75 text-xs md:text-sm font-medium tracking-[0.22em] uppercase mb-8"
          >
            {heroEyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-6xl md:text-8xl font-bold text-primary-foreground mb-8 leading-[0.95] tracking-tight"
          >
            {heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-primary-foreground/80 text-lg md:text-2xl mb-12 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap"
          >
            {/* Primary — Se sommeraktiviteter */}
            <Link to={lp('/aktiviteter')}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                <MapPin className="mr-2 h-5 w-5" />
                Se sommeraktiviteter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* Secondary — Planlegg reisen hit */}
            <Link to={lp('/reisen-hit')}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground font-semibold w-full sm:w-auto"
              >
                <Car className="mr-2 h-5 w-5" />
                Planlegg reisen hit
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div id="opplev-sommer">
        {home.sections && <HomepageSections sections={home.sections} />}
      </div>

      {/* 12 — Final CTA */}
      <section className="py-24 md:py-32 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-8 leading-[1.05] tracking-tight">
            {finalTitle}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link to={lp('/aktiviteter')}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                Se aktiviteter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={lp('/overnatting')}>
              <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">
                Se overnatting
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sommer;