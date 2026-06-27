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
            className="inline-block text-primary-foreground/80 text-xs md:text-sm font-medium tracking-[0.28em] uppercase mb-6 md:mb-8 px-4 py-1.5 border border-primary-foreground/25 rounded-full backdrop-blur-sm"
          >
            {d.hero.eyebrow ?? home.intro}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-[2.5rem] xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[8.5rem] font-bold text-primary-foreground mb-5 md:mb-8 leading-[0.95] tracking-tight drop-shadow-[0_2px_24px_hsl(var(--hero-overlay)/0.4)]"
          >
            {home.heroTitle}
          </motion.h1>
          {home.heroSubtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-primary-foreground/85 text-base sm:text-lg md:text-2xl mb-8 md:mb-12 font-light max-w-2xl mx-auto leading-relaxed"
            >
              {home.heroSubtitle}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto"
          >
            {/* Primary — Kjøp heiskort */}
            <a
              href="https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
              onClick={() =>
                trackSkiPassClick({
                  link_url:
                    'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862',
                  link_text: d.hero.ctaLiftPass,
                  cta_location: 'hero',
                })
              }
            >
              <Button size="lg" className="font-medium w-full sm:w-auto h-12 px-6 text-base">
                <Ticket className="mr-2 h-5 w-5" />
                {d.hero.ctaLiftPass}
              </Button>
            </a>
            {/* Secondary — Finn overnatting */}
            <Link to={lp('/overnatting')} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="font-medium w-full sm:w-auto h-12 px-6 text-base bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <HomeIcon className="mr-2 h-5 w-5" />
                {d.hero.ctaStay}
              </Button>
            </Link>
          </motion.div>
          {/* Tertiary — small inline link to opening hours */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6"
          >
            <Link
              to={lp('/apningstider')}
              className="inline-flex items-center gap-1.5 text-primary-foreground/75 hover:text-primary-foreground text-sm font-medium tracking-wide transition-colors"
            >
              <Clock className="h-3.5 w-3.5" />
              {d.hero.ctaOpening ?? d.status.openToday}
            </Link>
          </motion.div>
        </div>

      </section>

      {home.sections && <HomepageSections sections={home.sections} />}
    </div>
  );
};

export default Index;