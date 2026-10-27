import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { images } from '@/lib/images';
import { consumePrerenderedBoot } from '@/lib/prerenderHandoff';
import { Ticket, Home as HomeIcon } from 'lucide-react';
import PracticalShortcuts from '@/components/PracticalShortcuts';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { Button } from '@/components/ui/button';
import { useCms, getHomepage } from '@/lib/cms';
import { getHomepageData } from '@/lib/cms/homepageData';
import HomepageSections from '@/components/HomepageSections';
import HomepageCampaign from '@/components/HomepageCampaign';
import { trackSkiPassClick } from '@/lib/analytics';
import { EASE_OUT_EXPO } from '@/lib/motion';
import ContentPlaceholder from '@/components/ContentPlaceholder';
import SeasonPassGuideLink from '@/components/SeasonPassGuide';
import desktopHero from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-toppstasjon-oversikt-mars.jpg';

/**
 * Winter homepage. Editorial content is sourced from the CMS layer
 * (`getHomepage`) and the shared Node-safe `homepageData` module so the
 * static prerender and the hydrated page use the same hero copy and CTAs.
 */
const Index = ({ page = 'home' }: { page?: 'home' | 'winter' }) => {
  const { locale, d } = useLanguage();
  const lp = useLocalizedPath();
  const home = useCms(() => getHomepage({ language: locale, season: 'winter' }), [locale]);
  const data = getHomepageData(locale);
  // /vinter reuses this page; give it its own hero text where one exists.
  const hero =
    page === 'winter' && data.winterPageHero
      ? { ...data, hero: { ...data.hero, ...data.winterPageHero } }
      : data;

  // Skip the hero entrance animation when React takes over from the
  // prerendered skeleton, so the headline doesn't vanish and fade back in.
  const [skipIntro] = useState(consumePrerenderedBoot);

  // The hero renders immediately from static data. Only the sections
  // below wait for the CMS (which includes a network call for events), so
  // the footer never flashes at the top while the page is loading.
  const heroImage = home?.heroImage ?? { url: images.heroWinter.src, alt: '' };

  return (
    <div className="home-alpine">
      {/* HERO — full-bleed photograph with text on a scrim (bottom on
          mobile, left column on desktop). Markup mirrored in prerender. */}
      <section className="hero-bleed relative overflow-hidden bg-deep-navy min-h-[620px] h-[88svh] max-h-[820px] lg:min-h-[640px] lg:h-[80svh]">
        <picture>
          <img
            src={desktopHero}
            alt={heroImage.alt || hero.hero.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover object-[44%_50%] md:object-[60%_45%]"
          />
        </picture>
        <div aria-hidden className="absolute inset-0 home-hero-scrim" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1280px] flex-col justify-end lg:justify-center px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14 pt-24 pb-8 md:pb-12 lg:pt-32 lg:pb-16">
          <div className="max-w-xl lg:max-w-[560px]">
            <motion.p
              initial={skipIntro ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
              className="eyebrow eyebrow-on-image mb-4"
            >
              {hero.hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={skipIntro ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="font-display text-[clamp(2.375rem,9vw,2.875rem)] md:text-[3.25rem] lg:text-[clamp(3.5rem,4.6vw,4.5rem)] font-bold text-snow mb-4 md:mb-5 leading-[1.04] text-on-image"
            >
              {hero.hero.title}
            </motion.h1>
            {hero.hero.subtitle && (
              <motion.p
                initial={skipIntro ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.22, ease: EASE_OUT_EXPO }}
                className="text-snow text-base md:text-lg mb-6 md:mb-7 leading-relaxed text-on-image"
              >
                {hero.hero.subtitle}
              </motion.p>
            )}
            <motion.div
              initial={skipIntro ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.34, ease: EASE_OUT_EXPO }}
              className="flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <Button asChild variant="cta" size="xl" className="w-full sm:w-auto">
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
                  <Ticket className="h-5 w-5" aria-hidden />
                  {hero.hero.ctaLiftPass}
                </a>
              </Button>
              <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
                <Link to={lp('/overnatting')}>
                  <HomeIcon className="h-5 w-5" aria-hidden />
                  {hero.hero.ctaStay}
                </Link>
              </Button>
            </motion.div>
            <SeasonPassGuideLink variant="home" className="mt-3 self-start text-snow" />
          </div>
        </div>
      </section>

      <PracticalShortcuts />

      <HomepageCampaign />

      {home ? (
        home.sections && (
          <div className={page === 'home' ? 'homepage-spacing' : undefined}>
            <HomepageSections sections={home.sections} />
          </div>
        )
      ) : (
        // Holds the space and hides the footer while the CMS loads.
        <ContentPlaceholder />
      )}
    </div>
  );
};

export default Index;