import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Home as HomeIcon } from 'lucide-react';
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

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {home.heroImage && (
          <img src={home.heroImage.url} alt={home.heroImage.alt || home.heroTitle} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-secondary text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-6"
          >
            {d.summer.badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-5 leading-tight"
          >
            {home.heroTitle}
          </motion.h1>
          {home.heroSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-primary-foreground/85 text-xl mb-10 font-light"
            >
              {home.heroSubtitle}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            {/* Primary CTA — anchors to the in-page summer content for now;
                will become a dedicated /sommer landing module post WP wiring. */}
            <a href="#opplev-sommer">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                {d.summer.ctaExplore}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link to={lp('/overnatting')}>
              <Button variant="secondary" size="lg" className="font-semibold w-full sm:w-auto">
                <HomeIcon className="mr-2 h-5 w-5" />
                {d.summer.ctaStay}
              </Button>
            </Link>
            <Link to={lp('/aktiviteter')}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground font-semibold w-full sm:w-auto"
              >
                <MapPin className="mr-2 h-5 w-5" />
                {d.summer.ctaActivities}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div id="opplev-sommer">
        {home.sections && <HomepageSections sections={home.sections} />}
      </div>
    </div>
  );
};

export default Sommer;