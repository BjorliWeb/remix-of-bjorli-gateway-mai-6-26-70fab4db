import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Ticket, Home as HomeIcon } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { Button } from '@/components/ui/button';
import { useCms, getHomepage } from '@/lib/cms';
import HomepageSections from '@/components/HomepageSections';

/**
 * Winter homepage. All editorial content is sourced from the CMS layer
 * (`getHomepage`) — no direct dictionary reads for content. The hero
 * stays inline because its CTA layout is page-specific.
 */
const Index = () => {
  const { locale, d } = useLanguage();
  const lp = useLocalizedPath();
  const home = useCms(() => getHomepage({ language: locale, season: 'winter' }), [locale]);

  if (!home) return null;

  return (
    <div>
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        {home.heroImage && (
          <img src={home.heroImage.url} alt={home.heroImage.alt || home.heroTitle} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-secondary text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-6"
          >
            {home.intro}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight"
          >
            {home.heroTitle}
          </motion.h1>
          {home.heroSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-primary-foreground/85 text-xl md:text-2xl mb-10 font-light max-w-3xl mx-auto"
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
            <Link to={lp('/bjorli-skisenter')}>
              <Button size="lg" className="text-base px-7 py-6 font-semibold w-full sm:w-auto">
                {d.hero.ctaSkiCenter}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="text-base px-7 py-6 font-semibold w-full sm:w-auto">
                <Ticket className="mr-2 h-5 w-5" />
                {d.hero.ctaLiftPass}
              </Button>
            </a>
            <Link to={lp('/overnatting')}>
              <Button variant="outline" size="lg" className="text-base px-7 py-6 font-semibold w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <HomeIcon className="mr-2 h-5 w-5" />
                {d.hero.ctaStay}
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-primary-foreground/60" />
          </div>
        </motion.div>
      </section>

      {home.sections && <HomepageSections sections={home.sections} />}
    </div>
  );
};

export default Index;