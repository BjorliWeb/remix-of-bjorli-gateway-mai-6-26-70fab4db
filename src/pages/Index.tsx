import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, Home as HomeIcon, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { Button } from '@/components/ui/button';
import { useCms, getHomepage } from '@/lib/cms';
import HomepageSections from '@/components/HomepageSections';
import desktopHero from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-toppstasjon-oversikt-mars.jpg';

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
        {/* Mobile hero — clean stolheis image from CMS */}
        {home.heroImage && (
          <img
            src={home.heroImage.url}
            alt={home.heroImage.alt || home.heroTitle}
            className="md:hidden absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Desktop hero — Variant D: wide Bjorli destination view
            with valley, ski area, people, lifts and mountains. Slight
            scale + top-left origin pushes the baked-in Bjorli watermark
            (bottom-right) and heaviest lift-station mass off-frame,
            while object-position keeps the panorama centred under the
            headline. */}
        <img
          src={desktopHero}
          alt={home.heroImage?.alt || 'Vidt vinterpanorama over skiområdet på Bjorli med dal, heiser og fjell.'}
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-[48%_50%] scale-[1.12] origin-top-left"
        />
        <div className="absolute inset-0 hero-gradient" />
        {/* Soft hero-to-content transition: a calm, editorial fade from
            the cinematic image into the light page background. Sits above
            the image but below the content. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-background"
        />
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
            className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-bold text-primary-foreground mb-8 leading-[0.95] tracking-tight"
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
            className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-center flex-wrap items-center w-full max-w-sm sm:max-w-none mx-auto"
          >
            {/* Primary — Kjøp heiskort */}
            <a
              href="https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="font-medium w-full sm:w-auto sm:h-10 sm:px-4 sm:text-sm">
                <Ticket className="mr-2 h-4 w-4" />
                {d.hero.ctaLiftPass}
              </Button>
            </a>
            {/* Secondary — quieter inline link with separator */}
            <Link
              to={lp('/apningstider')}
              className="inline-flex items-center justify-center gap-2 text-primary-foreground/90 hover:text-primary-foreground text-base sm:text-sm font-medium tracking-wide w-full sm:w-auto px-5 py-3 sm:px-4 sm:py-2 rounded-md border border-primary-foreground/20 sm:border-0 transition-colors"
            >
              <Clock className="h-4 w-4" />
              {d.hero.ctaOpening ?? d.status.openToday}
            </Link>
            <span className="hidden sm:inline text-primary-foreground/30">·</span>
            <Link
              to={lp('/overnatting')}
              className="inline-flex items-center justify-center gap-2 text-primary-foreground/90 hover:text-primary-foreground text-base sm:text-sm font-medium tracking-wide w-full sm:w-auto px-5 py-3 sm:px-4 sm:py-2 rounded-md border border-primary-foreground/20 sm:border-0 transition-colors"
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