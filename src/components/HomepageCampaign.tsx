import { motion, useReducedMotion } from 'framer-motion';
import { Globe, Ticket } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { trackSkiPassClick } from '@/lib/analytics';
import {
  getActiveHomepageCampaign,
  isCampaignCtaActive,
  type Campaign,
} from '@/lib/cms/campaigns';

/**
 * Reusable homepage campaign band.
 *
 * Content and scheduling live in `src/lib/cms/campaigns.ts`. The section
 * renders nothing at all (no wrapper, no spacing) outside the campaign
 * window or when disabled, so the homepage layout is unaffected.
 *
 * The campaign artwork already carries the label and campaign period as
 * baked-in typography, so those details are not repeated in the HTML copy.
 */
const HomepageCampaign = ({ campaign }: { campaign?: Campaign | null }) => {
  const { locale } = useLanguage();
  const reduceMotion = useReducedMotion();

  const active = campaign !== undefined ? campaign : getActiveHomepageCampaign();
  if (!active) return null;

  const copy = active.copy[locale] ?? active.copy.no;
  const alt = active.image.alt[locale] ?? active.image.alt.no;
  const showCta = isCampaignCtaActive(active);

  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.6 },
      };

  return (
    <section
      aria-labelledby={`campaign-${active.id}-heading`}
      className="px-4 sm:px-6 lg:px-8 py-12 md:py-16"
    >
      <motion.div
        {...reveal}
        className="mx-auto max-w-6xl overflow-hidden rounded-[24px] bg-season-surface/40 ring-1 ring-season-deep/10 shadow-[0_24px_60px_-40px_hsl(var(--season-deep)/0.5)]"
      >
        <div className="grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* Complete earlybird2 portrait artwork at every breakpoint. */}
          <div className="flex items-center justify-center bg-season-deep/5">
            <img
              src={active.image.portrait.url}
              width={active.image.portrait.width}
              height={active.image.portrait.height}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="aspect-[1350/1688] h-auto w-full object-contain"
            />
          </div>

          {/* Editorial column */}
          <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 md:p-10">
            <h2
              id={`campaign-${active.id}-heading`}
              className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-foreground"
            >
              {copy.headline}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">{copy.body}</p>
            <p className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-season-deep" aria-hidden />
              <span>{copy.onlineOnly}</span>
            </p>
            <p className="text-base font-medium text-foreground">{copy.supportingLine}</p>

            {showCta ? (
              <div className="pt-2">
                <a
                  href={active.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full sm:w-auto"
                  onClick={() =>
                    trackSkiPassClick({
                      link_url: active.ctaHref,
                      link_text: copy.ctaLabel,
                      cta_location: `campaign_${active.id}`,
                    })
                  }
                >
                  <Button size="lg" className="h-12 w-full px-6 text-base font-medium sm:w-auto">
                    <Ticket className="mr-2 h-5 w-5" />
                    {copy.ctaLabel}
                  </Button>
                </a>
              </div>
            ) : (
              <p className="pt-1 text-sm font-medium text-season-deep">{copy.preCtaNote}</p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomepageCampaign;
