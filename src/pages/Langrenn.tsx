import { Lightbulb, Info } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { trackExternalPartnerClick } from '@/lib/analytics';
import fjelloypeAsset from '@/assets/fjelloype-bjorli.jpg.asset.json';
import lysloypeAsset from '@/assets/lysloype-bjorli.jpg.asset.json';
import { usePageCopy } from '@/i18n/usePageCopy';
import { LANGRENN_COPY } from './langrennCopy';
import { useLanguage } from '@/i18n/LanguageContext';
import { FACTS_COPY, SKIAPPEN_AREA_URL } from '@/lib/resortFacts';
import SkiappenMap from '@/components/SkiappenMap';
import { NordicSupport } from '@/components/ResortFactsSections';

const TRAIL_STATUS_URL = SKIAPPEN_AREA_URL;

const trackLoyperClick = (linkText: string) =>
  trackExternalPartnerClick({
    partner_name: 'Skiappen',
    partner_category: 'trail_map',
    link_url: TRAIL_STATUS_URL,
    link_text: linkText,
  });

const Langrenn = () => {
  const t = usePageCopy(LANGRENN_COPY);
  const { locale } = useLanguage();
  const facts = FACTS_COPY[locale];
  return (
    <div>
      <PageHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        image={fjelloypeAsset.url}
      />

      {/* Intro */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg md:text-xl text-foreground/85 leading-relaxed">{t.intro}</p>
          <p className="mt-6 text-foreground leading-relaxed">{facts.nordicBody}</p>
        </div>
      </section>

      {/* Shared trail map, with an always-available external link. */}
      <section className="pb-12 md:pb-16 px-4" aria-labelledby="loypestatus-heading">
        <div className="container mx-auto max-w-3xl">
          <h2 id="loypestatus-heading" className="font-display text-xl md:text-2xl font-semibold mb-3">{t.loypestatusTitle}</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{t.loypestatusBody}</p>
          <SkiappenMap locale={locale} onOpen={() => trackLoyperClick(t.loypestatusCta)} />
        </div>
      </section>

      {/* Lysløype */}
      <section className="py-12 md:py-16 px-4 bg-muted/40" aria-labelledby="lysloype-heading">
        <div className="container mx-auto max-w-6xl grid gap-8 md:gap-12 md:grid-cols-2 items-center">
          <figure className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <img
              src={lysloypeAsset.url}
              alt={t.lysloypeAlt}
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </figure>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              {t.lysloypeBadge}
            </div>
            <h2
              id="lysloype-heading"
              className="font-display text-2xl md:text-3xl font-bold mb-3"
            >
              {t.lysloypeTitle}
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              {t.lysloypeBody1}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.lysloypeBody2}
            </p>
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="praktisk-heading">
        <div className="container mx-auto max-w-5xl">
          <header className="mb-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              {t.praktiskBadge}
            </div>
            <h2
              id="praktisk-heading"
              className="font-display text-2xl md:text-3xl font-bold mb-2"
            >
              {t.praktiskTitle}
            </h2>
          </header>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.cardCheck.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.cardCheck.bodyBefore}
                  <a
                    href={TRAIL_STATUS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackLoyperClick(t.cardCheck.linkText)}
                    className="text-secondary hover:underline"
                  >
                    {t.cardCheck.linkText}
                  </a>
                  {t.cardCheck.bodyAfter}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.cardWeather.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.cardWeather.body}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.cardRespect.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.cardRespect.body}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <NordicSupport locale={locale} />
    </div>
  );
};

export default Langrenn;
