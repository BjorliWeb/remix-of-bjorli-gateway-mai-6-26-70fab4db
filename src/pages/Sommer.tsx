import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Car } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
      'Bo på Bjorli og bruk dagene på fjellturer, fiske i Rauma og Lesjaskogsvatnet, fossefall i Mardøla, sykkel, Raumabanen, moskus på Dovrefjell og dagsturer vestover mot fjordlandskapet.',
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
      'Stay in Bjorli and spend your days on mountain hikes, cycling, fishing in Rauma and Lesjaskogsvatnet, the Mardøla waterfall, the Rauma Line, muskox on Dovrefjell and day trips west toward the fjords.',
    primaryCta: 'See summer activities',
    secondaryCta: 'Plan your journey',
    finalTitle: 'Plan an active summer in Bjorli',
    finalPrimaryCta: 'See activities',
    finalSecondaryCta: 'See accommodation',
    stayWidgetTitle: 'Plan your summer stay in Bjorli',
    stayWidgetBody:
      'Find a cabin, apartment or accommodation close to the mountains, activities and summer experiences.',
    stayWidgetPrimaryCta: 'Find accommodation',
    stayWidgetProof1: 'Short distance to hiking, cycling and mountains',
    stayWidgetProof2: 'For families, couples and friends',
    stayWidgetProof3: 'Base between Eastern and Northwestern Norway',
  },
  de: {
    heroTitle: 'Sommer in Bjorli',
    heroSubtitle:
      'Wohnen Sie in Bjorli und verbringen Sie die Tage mit Bergwanderungen, Radfahren, Angeln im Rauma und Lesjaskogsvatnet, dem Mardøla-Wasserfall, der Raumabahn, Moschusochsen auf Dovrefjell und Tagesausflügen westwärts zu den Fjorden.',
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
      'Verblijf in Bjorli en besteed de dagen aan bergwandelingen, fietsen, vissen in de Rauma en Lesjaskogsvatnet, de Mardøla-waterval, de Raumabaan, muskusossen op Dovrefjell en dagtochten westwaarts richting de fjorden.',
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
      'Bo i Bjorli og brug dagene på fjeldture, cykling, fiskeri i Rauma og Lesjaskogsvatnet, Mardøla-vandfaldet, Raumabanen, moskusokser på Dovrefjell og dagsture vestpå mod fjordene.',
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
      'Bo i Bjorli och använd dagarna till fjällvandringar, cykling, fiske i Rauma och Lesjaskogsvatnet, Mardøla-fallet, Raumabanan, myskoxar på Dovrefjell och dagsturer västerut mot fjordarna.',
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

  if (!home) return null;

  const heroEyebrow = d.summer.eyebrow ?? d.summer.badge;

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[640px] h-[88vh] max-h-[920px] flex items-center justify-center overflow-hidden">
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
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-16 md:py-20">
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
            className="font-display font-bold text-primary-foreground mb-6 md:mb-8 tracking-tight drop-shadow-[0_2px_24px_hsl(var(--hero-overlay)/0.4)] mx-auto"
            style={{
              fontSize: 'clamp(2.75rem, 6.4vw, 6.5rem)',
              lineHeight: 0.95,
              maxWidth: '1100px',
            }}
          >
            {t.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-primary-foreground/85 mb-10 md:mb-12 font-light mx-auto leading-relaxed"
            style={{
              fontSize: 'clamp(1.05rem, 1.5vw, 1.5rem)',
              maxWidth: '850px',
            }}
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

      {/* Accommodation CTA widget */}
      <div className="relative z-20 -mt-16 md:-mt-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="rounded-2xl border border-border/60 bg-card/95 backdrop-blur-sm shadow-lg p-6 md:p-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
                {t.stayWidgetTitle}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
                {t.stayWidgetBody}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
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
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={lp('/overnatting')}>
                  <Button size="lg" className="font-semibold w-full sm:w-auto">
                    {t.stayWidgetPrimaryCta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to={lp('/aktiviteter')}>
                  <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">
                    {t.stayWidgetSecondaryCta}
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

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