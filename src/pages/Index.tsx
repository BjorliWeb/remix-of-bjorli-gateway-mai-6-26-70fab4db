import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Home as HomeIcon, Clock } from 'lucide-react';
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
            className="inline-block text-primary-foreground/75 text-xs md:text-sm font-medium tracking-[0.22em] uppercase mb-8"
          >
            {d.hero.eyebrow ?? home.intro}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-6xl md:text-8xl lg:text-[9rem] font-bold text-primary-foreground mb-8 leading-[0.95] tracking-tight"
          >
            {home.heroTitle}
          </motion.h1>
          {home.heroSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-primary-foreground/80 text-lg md:text-2xl mb-12 font-light max-w-2xl mx-auto leading-relaxed"
            >
              {home.heroSubtitle}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-2 justify-center flex-wrap items-center"
          >
            {/* Primary — Kjøp heiskort */}
            <a href="https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862" target="_blank" rel="noopener noreferrer">
              <Button size="default" className="font-medium w-full sm:w-auto">
                <Ticket className="mr-2 h-4 w-4" />
                {d.hero.ctaLiftPass}
              </Button>
            </a>
            {/* Secondary — quieter inline link with separator */}
            <Link
              to={lp('/apningstider')}
              className="inline-flex items-center gap-2 text-primary-foreground/85 hover:text-primary-foreground text-sm font-medium tracking-wide px-4 py-2 transition-colors"
            >
              <Clock className="h-4 w-4" />
              {d.hero.ctaOpening ?? d.status.openToday}
            </Link>
            <span className="hidden sm:inline text-primary-foreground/30">·</span>
            <Link
              to={lp('/overnatting')}
              className="inline-flex items-center gap-2 text-primary-foreground/85 hover:text-primary-foreground text-sm font-medium tracking-wide px-4 py-2 transition-colors"
            >
              <HomeIcon className="h-4 w-4" />
              {d.hero.ctaStay}
            </Link>
          </motion.div>
        </div>

      </section>

      {home.sections && <HomepageSections sections={home.sections} />}
    </div>
  );
};

export default Index;