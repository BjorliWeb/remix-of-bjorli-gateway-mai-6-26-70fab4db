import { Link } from 'react-router-dom';
import { Ticket, Home as HomeIcon, Clock } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { Button } from '@/components/ui/button';
import { useCms, getHomepage } from '@/lib/cms';
import LiveStatusCards from '@/components/LiveStatusCards';
import variantB from '@/assets/photos/bjorli-stolheis-fjellutsikt-vinter.jpg';
import variantC from '@/assets/photos/bjorli-toppen-vinterlandskap.jpg';

/**
 * Internal hero image comparison page. Not linked from navigation,
 * not in sitemap, not in SEO. Renders the winter homepage hero three
 * times with different background images so editors can compare image
 * quality, text readability, and emotional pull side-by-side.
 * Headline, subtitle, CTAs, overlay, fade and live status placement are
 * identical to the live homepage.
 */
const HeroCompare = () => {
  const { locale, d } = useLanguage();
  const lp = useLocalizedPath();
  const home = useCms(() => getHomepage({ language: locale, season: 'winter' }), [locale]);

  if (!home) return null;

  const statusSection = home.sections?.find((s) => s.kind === 'status') as
    | Parameters<typeof LiveStatusCards>[0]['section']
    | undefined;

  const variants: { id: string; label: string; path: string; src: string }[] = [
    {
      id: 'A',
      label: 'Variant A — Current winter hero',
      path: 'src/assets/photos/bjorli-stolheis-fjellutsikt-vinter.jpg (current)',
      src: home.heroImage?.url ?? variantB,
    },
    {
      id: 'B',
      label: 'Variant B — Stolheis fjellutsikt vinter',
      path: 'src/assets/photos/bjorli-stolheis-fjellutsikt-vinter.jpg',
      src: variantB,
    },
    {
      id: 'C',
      label: 'Variant C — Bjorlitoppen vinterlandskap',
      path: 'src/assets/photos/bjorli-toppen-vinterlandskap.jpg',
      src: variantC,
    },
  ];

  return (
    <div>
      <div className="bg-muted/40 border-b border-border px-4 py-3 text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
        Internal review · Hero image comparison · Not public
      </div>

      {variants.map((v) => (
        <div key={v.id}>
          <div className="bg-background px-4 py-4 border-b border-border">
            <div className="max-w-5xl mx-auto flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl font-semibold text-foreground">{v.label}</h2>
              <code className="text-xs text-muted-foreground">{v.path}</code>
            </div>
          </div>

          <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
            <img src={v.src} alt={home.heroTitle} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 hero-gradient" />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-background"
            />
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
              <span className="inline-block text-primary-foreground/75 text-xs md:text-sm font-medium tracking-[0.22em] uppercase mb-8">
                {d.hero.eyebrow ?? home.intro}
              </span>
              <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] font-bold text-primary-foreground mb-8 leading-[0.95] tracking-tight">
                {home.heroTitle}
              </h1>
              {home.heroSubtitle && (
                <p className="text-primary-foreground/80 text-lg md:text-2xl mb-12 font-light max-w-2xl mx-auto leading-relaxed">
                  {home.heroSubtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-2 justify-center flex-wrap items-center">
                <a href="https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862" target="_blank" rel="noopener noreferrer">
                  <Button size="default" className="font-medium w-full sm:w-auto">
                    <Ticket className="mr-2 h-4 w-4" />
                    {d.hero.ctaLiftPass}
                  </Button>
                </a>
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
              </div>
            </div>
          </section>

          {statusSection && <LiveStatusCards section={statusSection} />}
        </div>
      ))}
    </div>
  );
};

export default HeroCompare;