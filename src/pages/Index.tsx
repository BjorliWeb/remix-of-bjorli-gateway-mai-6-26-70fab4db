import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { images } from '@/lib/images';
import { consumePrerenderedBoot } from '@/lib/prerenderHandoff';
import { Ticket, Home as HomeIcon, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { Button } from '@/components/ui/button';
import { useCms, getHomepage } from '@/lib/cms';
import { getHomepageData } from '@/lib/cms/homepageData';
import HomepageSections from '@/components/HomepageSections';
import HomepageCampaign from '@/components/HomepageCampaign';
import { trackSkiPassClick } from '@/lib/analytics';
import { EASE_OUT_EXPO } from '@/lib/motion';
import desktopHero from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-toppstasjon-oversikt-mars.jpg';

/**
 * Winter homepage. Editorial content is sourced from the CMS layer
 * (`getHomepage`) and the shared Node-safe `homepageData` module so the
 * static prerender and the hydrated page use the same hero copy and CTAs.
 */
const Index = () => {
  const { locale, d } = useLanguage();
  const lp = useLocalizedPath();
  const home = useCms(() => getHomepage({ language: locale, season: 'winter' }), [locale]);
  const hero = getHomepageData(locale);

  // Skip the hero entrance animation when React takes over from the
  // prerendered skeleton, so the headline doesn't vanish and fade back in.
  const [skipIntro] = useState(consumePrerenderedBoot);

  // The hero renders immediately from static data. Only the sections
  // below wait for the CMS (which includes a network call for events), so
  // the footer never flashes at the top while the page is loading.
  const heroImage = home?.heroImage ?? { url: images.heroWinter.src, alt: '' };

  return (
    <div>
      {/* HERO — sits flush under the fixed navigation (hero-bleed). */}
      <section className="hero-bleed relative h-[100svh] min-h-[640px] max-h-[1080px] flex items-center justify-center overflow-hidden bg-deep-navy">
        {/* One <picture>: the browser downloads only the source that
            matches the viewport. The previous two <img> tags (one hidden
            with CSS per breakpoint) made phones download the 3 MB desktop
            panorama as well. Mobile keeps the clean stolheis image from the
            CMS; desktop keeps Variant D — the wide destination view, with a
            slight scale from the top-left so the baked-in watermark
            (bottom-right) stays off-frame. */}
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopHero} />
          <img
            src={heroImage.url}
            alt={heroImage.alt || hero.hero.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover md:object-[48%_50%] md:scale-[1.12] md:origin-top-left"
          />
        </picture>
        <div aria-hidden className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-5 max-w-6xl mx-auto pt-16 lg:pt-24">
          <motion.span
            initial={skipIntro ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-3 text-white/90 text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-6 md:mb-8 text-on-image"
          >
            <span aria-hidden className="h-px w-8 bg-white/60" />
            {hero.hero.eyebrow}
            <span aria-hidden className="h-px w-8 bg-white/60" />
          </motion.span>
          <motion.h1
            initial={skipIntro ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="font-display text-[clamp(2.6rem,7.4vw,7.25rem)] font-bold text-white mb-6 md:mb-8 leading-[0.95] tracking-[-0.02em] text-on-image"
          >
            {hero.hero.title}
          </motion.h1>
          {hero.hero.subtitle && (
            <motion.p
              initial={skipIntro ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.22, ease: EASE_OUT_EXPO }}
              className="text-white/90 text-base sm:text-lg md:text-xl mb-9 md:mb-11 max-w-2xl mx-auto leading-relaxed text-on-image"
            >
              {hero.hero.subtitle}
            </motion.p>
          )}
          <motion.div
            initial={skipIntro ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.34, ease: EASE_OUT_EXPO }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm sm:max-w-none mx-auto"
          >
            {/* Primary — Kjøp heiskort. Same seasonal pill as the header CTA. */}
            <Button asChild variant="season" size="xl" className="w-full sm:w-auto">
              <a
                href={hero.hero.liftPassUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackSkiPassClick({
                    link_url: hero.hero.liftPassUrl,
                    link_text: hero.hero.ctaLiftPass,
                    cta_location: 'hero',
                  })
                }
              >
                <Ticket className="h-5 w-5" />
                {hero.hero.ctaLiftPass}
              </a>
            </Button>
            {/* Secondary — Finn overnatting */}
            <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
              <Link to={lp('/overnatting')}>
                <HomeIcon className="h-5 w-5" />
                {hero.hero.ctaStay}
              </Link>
            </Button>
          </motion.div>
          {/* Tertiary — small inline link to opening hours */}
          <motion.div
            initial={skipIntro ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE_OUT_EXPO }}
            className="mt-6"
          >
            <Link
              to={lp('/apningstider')}
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-medium tracking-wide transition-colors text-on-image underline-offset-4 hover:underline"
            >
              <Clock className="h-3.5 w-3.5" />
              {hero.hero.ctaOpening}
            </Link>
          </motion.div>
        </div>
      </section>

      <HomepageCampaign />

      {home ? (
        home.sections && <HomepageSections sections={home.sections} />
      ) : (
        // Holds the space while the CMS loads so the footer stays below the fold.
        <div aria-hidden className="min-h-[100svh]" />
      )}
    </div>
  );
};

export default Index;