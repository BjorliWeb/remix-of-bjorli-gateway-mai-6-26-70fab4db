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
    <div>
      {/* HERO — split layout: text on a solid snow surface, photograph
          beside it on desktop and above it on mobile/tablet. */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-[1280px] lg:grid-cols-[45fr_55fr] lg:items-stretch lg:min-h-[560px]">
          {/* One <picture>: the browser downloads only the matching source. */}
          <div className="relative order-1 lg:order-2 h-[40svh] min-h-[220px] max-h-[380px] md:max-h-[440px] lg:h-auto lg:max-h-none overflow-hidden bg-muted">
            <picture>
              <source media="(min-width: 768px)" srcSet={desktopHero} />
              <img
                src={heroImage.url}
                alt={heroImage.alt || hero.hero.title}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center md:object-[48%_50%]"
              />
            </picture>
          </div>
          <div className="order-2 lg:order-1 flex flex-col justify-center px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14 py-8 md:py-12 lg:py-16">
            <motion.p
              initial={skipIntro ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
              className="eyebrow mb-4"
            >
              {hero.hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={skipIntro ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT_EXPO }}
              className="font-display text-[2.25rem] md:text-5xl lg:text-[3.5rem] font-bold text-primary mb-5 leading-[1.08]"
            >
              {hero.hero.title}
            </motion.h1>
            {hero.hero.subtitle && (
              <motion.p
                initial={skipIntro ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.22, ease: EASE_OUT_EXPO }}
                className="text-foreground text-base md:text-lg mb-7 max-w-xl leading-relaxed"
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
              <Button asChild variant="outline-strong" size="xl" className="w-full sm:w-auto">
                <Link to={lp('/overnatting')}>
                  <HomeIcon className="h-5 w-5" aria-hidden />
                  {hero.hero.ctaStay}
                </Link>
              </Button>
            </motion.div>
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