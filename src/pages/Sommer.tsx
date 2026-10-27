import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { images } from '@/lib/images';
import { consumePrerenderedBoot } from '@/lib/prerenderHandoff';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { ArrowRight, MapPin, Car } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCms, getHomepage } from '@/lib/cms';
import HomepageSections from '@/components/HomepageSections';
import ContentPlaceholder from '@/components/ContentPlaceholder';

/**
 * Summer homepage. Editorial content delivered by the CMS layer
 * (`getHomepage` with season=summer). Hero stays page-specific.
 */
interface SommerCopy {
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  finalTitle: string;
  finalPrimaryCta: string;
  finalSecondaryCta: string;
  stayWidgetTitle: string;
  stayWidgetBody: string;
  stayWidgetPrimaryCta: string;
  stayWidgetProof1: string;
  stayWidgetProof2: string;
  stayWidgetProof3: string;
}

const COPY: Record<Locale, SommerCopy> = {
  no: {
    heroTitle: 'Fjell, fjord og friske sommerdager',
    heroSubtitle:
      'Basecamp mellom fjell og fjord: fjellturer, sykkel, Lesjaskogsvatnet, Mardøla, Romsdalen, Dovrefjell og dagsturer vestover.',
    primaryCta: 'Se sommeraktiviteter',
    secondaryCta: 'Planlegg reisen hit',
    finalTitle: 'Planlegg en aktiv sommer på Bjorli',
    finalPrimaryCta: 'Se aktiviteter',
    finalSecondaryCta: 'Se overnatting',
    stayWidgetTitle: 'Planlegg sommeroppholdet på Bjorli',
    stayWidgetBody:
      'Finn hytte, leilighet eller overnatting tett på fjellet, aktivitetene og sommeropplevelsene.',
    stayWidgetPrimaryCta: 'Finn overnatting',
  stayWidgetProof1: 'Kort vei til tur, sykkel og fjell',
    stayWidgetProof2: 'For familier, par og vennegjenger',
    stayWidgetProof3: 'Base mellom Østlandet og Nordvestlandet',
  },
  en: {
    heroTitle: 'Summer in Bjorli',
    heroSubtitle:
      'Your base between the mountains and the fjords: hiking, cycling, Lesjaskogsvatnet, Mardøla, Romsdalen, Dovrefjell and day trips to the west.',
    primaryCta: 'See things to do in summer',
    secondaryCta: 'Plan your journey',
    finalTitle: 'Plan an active summer in Bjorli',
    finalPrimaryCta: 'See things to do',
    finalSecondaryCta: 'See places to stay',
    stayWidgetTitle: 'Plan your summer stay in Bjorli',
    stayWidgetBody:
      'Find a cabin, apartment or other place to stay near the mountains and the things you’d like to do.',
    stayWidgetPrimaryCta: 'Find your accommodation',
    stayWidgetProof1: 'Hiking, cycling and the mountains nearby',
    stayWidgetProof2: 'For families, couples and friends',
    stayWidgetProof3: 'A base between eastern and north-western Norway',
  },
  de: {
    heroTitle: 'Sommer in Bjorli',
    heroSubtitle:
      'Basislager zwischen Bergen und Fjorden: Wandern, Radfahren, Lesjaskogsvatnet, Mardøla, Romsdalen, Dovrefjell und Tagesausflüge westwärts.',
    primaryCta: 'Sommeraktivitäten ansehen',
    secondaryCta: 'Anreise planen',
    finalTitle: 'Planen Sie einen aktiven Sommer in Bjorli',
    finalPrimaryCta: 'Aktivitäten ansehen',
    finalSecondaryCta: 'Unterkünfte ansehen',
    stayWidgetTitle: 'Planen Sie Ihren Sommeraufenthalt in Bjorli',
    stayWidgetBody:
      'Finden Sie eine Hütte, Wohnung oder Unterkunft in der Nähe von Bergen, Aktivitäten und Sommererlebnissen.',
    stayWidgetPrimaryCta: 'Unterkunft finden',
    stayWidgetProof1: 'Kurzer Weg zu Wanderungen, Radfahren und Bergen',
    stayWidgetProof2: 'Für Familien, Paare und Freundesgruppen',
    stayWidgetProof3: 'Basis zwischen Ostlandet und Nordwestlandet',
  },
  nl: {
    heroTitle: 'Zomer in Bjorli',
    heroSubtitle:
      'Basiskamp tussen bergen en fjorden: wandelen, fietsen, Lesjaskogsvatnet, Mardøla, Romsdalen, Dovrefjell en dagtochten westwaarts.',
    primaryCta: 'Bekijk zomeractiviteiten',
    secondaryCta: 'Plan je reis',
    finalTitle: 'Plan een actieve zomer in Bjorli',
    finalPrimaryCta: 'Bekijk activiteiten',
    finalSecondaryCta: 'Bekijk accommodatie',
    stayWidgetTitle: 'Plan uw zomerverblijf in Bjorli',
    stayWidgetBody:
      'Vind een hut, appartement of accommodatie dicht bij de bergen, activiteiten en zomerervaringen.',
    stayWidgetPrimaryCta: 'Accommodatie zoeken',
    stayWidgetProof1: 'Korte afstand tot wandelen, fietsen en bergen',
    stayWidgetProof2: 'Voor gezinnen, stellen en vrienden',
    stayWidgetProof3: 'Basis tussen Østlandet en Nordwestlandet',
  },
  da: {
    heroTitle: 'Sommer i Bjorli',
    heroSubtitle:
      'Basecamp mellem fjeld og fjord: vandring, cykling, Lesjaskogsvatnet, Mardøla, Romsdalen, Dovrefjell og dagsture vestpå.',
    primaryCta: 'Se sommeraktiviteter',
    secondaryCta: 'Planlæg rejsen hertil',
    finalTitle: 'Planlæg en aktiv sommer i Bjorli',
    finalPrimaryCta: 'Se aktiviteter',
    finalSecondaryCta: 'Se overnatning',
    stayWidgetTitle: 'Planlæg dit sommerophold i Bjorli',
    stayWidgetBody:
      'Find en hytte, lejlighed eller overnatning tæt på bjergene, aktiviteterne og sommeroplevelserne.',
    stayWidgetPrimaryCta: 'Find overnatning',
    stayWidgetProof1: 'Kort vej til vandring, cykling og bjerge',
    stayWidgetProof2: 'For familier, par og vennegrupper',
    stayWidgetProof3: 'Base mellem Østlandet og Nordvestlandet',
  },
  sv: {
    heroTitle: 'Sommar i Bjorli',
    heroSubtitle:
      'Basläger mellan fjäll och fjord: vandring, cykling, Lesjaskogsvatnet, Mardøla, Romsdalen, Dovrefjell och dagsturer västerut.',
    primaryCta: 'Se sommaraktiviteter',
    secondaryCta: 'Planera resan hit',
    finalTitle: 'Planera en aktiv sommar i Bjorli',
    finalPrimaryCta: 'Se aktiviteter',
    finalSecondaryCta: 'Se boende',
    stayWidgetTitle: 'Planera din sommarvistelse i Bjorli',
    stayWidgetBody:
      'Hitta en stuga, lägenhet eller boende nära fjällen, aktiviteterna och sommarupplevelserna.',
    stayWidgetPrimaryCta: 'Hitta boende',
    stayWidgetProof1: 'Kort väg till vandring, cykling och fjäll',
    stayWidgetProof2: 'För familjer, par och vänner',
    stayWidgetProof3: 'Bas mellan Østlandet och Nordvestlandet',
  },
};

const Sommer = () => {
  const { locale, d } = useLanguage();
  const lp = useLocalizedPath();
  const t = usePageCopy(COPY);
  const home = useCms(() => getHomepage({ language: locale, season: 'summer' }), [locale]);

  // Skip the hero entrance animation when React takes over from the
  // prerendered skeleton, so the headline doesn't vanish and fade back in.
  const [skipIntro] = useState(consumePrerenderedBoot);

  // The hero renders immediately from static data. Only the sections
  // below wait for the CMS (which includes a network call for events), so
  // the footer never flashes at the top while the page is loading.
  const heroImage = home?.heroImage ?? { url: images.heroSummer.src, alt: '' };

  const heroEyebrow = d.summer.eyebrow ?? d.summer.badge;

  return (
    <div className="home-alpine">
      {/* Hero */}
      <section className="hero-bleed relative min-h-[max(640px,min(92svh,980px))] flex items-center justify-center overflow-hidden bg-deep-navy">
        {heroImage && (
          <img
            src={heroImage.url}
            alt={heroImage.alt || t.heroTitle}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        )}
        <div aria-hidden className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-5 max-w-5xl mx-auto pt-24 pb-16 md:pt-32 md:pb-20">
          <motion.span
            initial={skipIntro ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            className="inline-flex items-center gap-3 text-white/90 text-[11px] md:text-xs font-semibold tracking-[0.3em] uppercase mb-6 md:mb-8 text-on-image"
          >
            <span aria-hidden className="h-px w-8 bg-white/60" />
            {heroEyebrow}
            <span aria-hidden className="h-px w-8 bg-white/60" />
          </motion.span>
          <motion.h1
            initial={skipIntro ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="font-display font-bold text-white mb-6 md:mb-8 tracking-[-0.02em] text-on-image mx-auto"
            style={{
              fontSize: 'clamp(2.75rem, 6.4vw, 6.5rem)',
              lineHeight: 0.95,
              maxWidth: '1100px',
            }}
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p
            initial={skipIntro ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.22, ease: EASE_OUT_EXPO }}
            className="text-white/90 mb-10 md:mb-12 mx-auto leading-relaxed text-on-image"
            style={{
              fontSize: 'clamp(1.05rem, 1.5vw, 1.5rem)',
              maxWidth: '850px',
            }}
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div
            initial={skipIntro ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.34, ease: EASE_OUT_EXPO }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap w-full max-w-sm sm:max-w-none mx-auto"
          >
            {/* Primary — summer activities. Same seasonal pill as the header CTA. */}
            <Button asChild variant="season" size="xl" className="w-full sm:w-auto">
              <Link to={lp('/aktiviteter')}>
                <MapPin className="h-5 w-5" />
                {t.primaryCta}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            {/* Secondary — getting here */}
            <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
              <Link to={lp('/reisen-hit')}>
                <Car className="h-5 w-5" />
                {t.secondaryCta}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Accommodation CTA widget */}
      <div className="relative z-20 -mt-16 md:-mt-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={skipIntro ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="rounded-3xl border border-border/40 bg-background/90 backdrop-blur-md shadow-md p-6 md:p-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t.stayWidgetTitle}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
                {t.stayWidgetBody}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  <span>{t.stayWidgetProof1}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  <span>{t.stayWidgetProof2}</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  <span>{t.stayWidgetProof3}</span>
                </li>
              </ul>
              <div className="flex justify-center">
                <Link to={lp('/overnatting')}>
                  <Button size="lg" className="font-semibold w-full sm:w-auto text-base md:text-lg h-14 md:h-16 px-8 md:px-10">
                    {t.stayWidgetPrimaryCta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <div id="opplev-sommer">
        {home ? (
        home.sections && <HomepageSections sections={home.sections} />
      ) : (
        // Holds the space and hides the footer while the CMS loads.
        <ContentPlaceholder />
      )}
      </div>

      {/* 12 — Final CTA */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-8 leading-[1.05] tracking-tight">
            {t.finalTitle}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link to={lp('/aktiviteter')}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                {t.finalPrimaryCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={lp('/overnatting')}>
              <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">
                {t.finalSecondaryCta}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sommer;