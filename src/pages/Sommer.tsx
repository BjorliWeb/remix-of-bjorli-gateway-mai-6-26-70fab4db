import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Car } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';
import { Button } from '@/components/ui/button';
import { useCms, getHomepage } from '@/lib/cms';
import HomepageSections from '@/components/HomepageSections';

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
}

const COPY: Record<Locale, SommerCopy> = {
  no: {
    heroTitle: 'Basecamp for fjell, fjord og ville naturopplevelser',
    heroSubtitle:
      'Bo på Bjorli og bruk dagene på fjellturer, fiske i Rauma og Lesjaskogsvatnet, fossefall i Mardøla, sykkel, Raumabanen, moskus på Dovrefjell og dagsturer vestover mot fjordlandskapet.',
    primaryCta: 'Se sommeraktiviteter',
    secondaryCta: 'Planlegg reisen hit',
    finalTitle: 'Planlegg en aktiv sommer på Bjorli',
    finalPrimaryCta: 'Se aktiviteter',
    finalSecondaryCta: 'Se overnatting',
  },
  en: {
    heroTitle: 'Summer in Bjorli',
    heroSubtitle:
      'A calm mountain basecamp between the fjords, the national parks and some of Norway’s best-known landscapes — with hiking, cycling and fishing right outside the door.',
    primaryCta: 'See summer activities',
    secondaryCta: 'Plan your journey',
    finalTitle: 'Plan a calm summer in Bjorli',
    finalPrimaryCta: 'See activities',
    finalSecondaryCta: 'See accommodation',
  },
  de: {
    heroTitle: 'Sommer in Bjorli',
    heroSubtitle:
      'Ein ruhiges Bergbasislager zwischen den Fjorden, den Nationalparks und einigen der bekanntesten Landschaften Norwegens — mit Wandern, Radfahren und Angeln direkt vor der Tür.',
    primaryCta: 'Sommeraktivitäten ansehen',
    secondaryCta: 'Anreise planen',
    finalTitle: 'Planen Sie einen ruhigen Sommer in Bjorli',
    finalPrimaryCta: 'Aktivitäten ansehen',
    finalSecondaryCta: 'Unterkünfte ansehen',
  },
  nl: {
    heroTitle: 'Zomer in Bjorli',
    heroSubtitle:
      'Een rustig basiskamp in de bergen tussen de fjorden, de nationale parken en enkele van Noorwegens bekendste landschappen — met wandelen, fietsen en vissen direct voor de deur.',
    primaryCta: 'Bekijk zomeractiviteiten',
    secondaryCta: 'Plan je reis',
    finalTitle: 'Plan een rustige zomer in Bjorli',
    finalPrimaryCta: 'Bekijk activiteiten',
    finalSecondaryCta: 'Bekijk accommodatie',
  },
  da: {
    heroTitle: 'Sommer i Bjorli',
    heroSubtitle:
      'En rolig basislejr i fjeldet mellem fjordene, nationalparkerne og nogle af Norges mest kendte landskaber — med vandring, cykling og fiskeri lige uden for døren.',
    primaryCta: 'Se sommeraktiviteter',
    secondaryCta: 'Planlæg rejsen hertil',
    finalTitle: 'Planlæg en rolig sommer i Bjorli',
    finalPrimaryCta: 'Se aktiviteter',
    finalSecondaryCta: 'Se overnatning',
  },
  sv: {
    heroTitle: 'Sommar i Bjorli',
    heroSubtitle:
      'Ett lugnt basläger i fjället mellan fjordarna, nationalparkerna och några av Norges mest kända landskap — med vandring, cykling och fiske precis utanför dörren.',
    primaryCta: 'Se sommaraktiviteter',
    secondaryCta: 'Planera resan hit',
    finalTitle: 'Planera en lugn sommar i Bjorli',
    finalPrimaryCta: 'Se aktiviteter',
    finalSecondaryCta: 'Se boende',
  },
};

const Sommer = () => {
  const { locale, d } = useLanguage();
  const lp = useLocalizedPath();
  const t = usePageCopy(COPY);
  const home = useCms(() => getHomepage({ language: locale, season: 'summer' }), [locale]);

  if (!home) return null;

  const heroEyebrow = d.summer.eyebrow ?? d.summer.badge;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {home.heroImage && (
          <img
            src={home.heroImage.url}
            alt={home.heroImage.alt || t.heroTitle}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-primary-foreground/80 text-xs md:text-sm font-medium tracking-[0.28em] uppercase mb-6 md:mb-8 px-4 py-1.5 border border-primary-foreground/25 rounded-full backdrop-blur-sm"
          >
            {heroEyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-6xl md:text-8xl lg:text-[9rem] font-bold text-primary-foreground mb-6 md:mb-8 leading-[0.92] tracking-tight drop-shadow-[0_2px_24px_hsl(var(--hero-overlay)/0.4)]"
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-primary-foreground/85 text-lg md:text-2xl mb-10 md:mb-14 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {t.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap"
          >
            {/* Primary — summer activities */}
            <Link to={lp('/aktiviteter')}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                <MapPin className="mr-2 h-5 w-5" />
                {t.primaryCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* Secondary — getting here */}
            <Link to={lp('/reisen-hit')}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground font-semibold w-full sm:w-auto"
              >
                <Car className="mr-2 h-5 w-5" />
                {t.secondaryCta}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <div id="opplev-sommer">
        {home.sections && <HomepageSections sections={home.sections} />}
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