import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';
import {
  PageMeta,
  JsonLd,
  FaqBlock,
  RelatedLinksBlock,
  PageSummaryBlock,
  buildBreadcrumb,
} from '@/components/seo';
import { images } from '@/lib/images';
import { trackPageView } from '@/lib/analytics';
import { getSeoLanding, useCms } from '@/lib/cms';
import type { SeoLandingBodySection } from '@/lib/cms';
import { absoluteUrl, CANONICAL_ORIGIN } from '@/lib/url/normalizeInternalPath';
import {
  SKI_HOLIDAY_NORWAY_LOCALE,
  SKI_HOLIDAY_NORWAY_PATH,
  SKI_HOLIDAY_NORWAY_SEO,
  SKI_HOLIDAY_NORWAY_SLUG,
} from '@/lib/seo/skiHolidayNorwaySeo';

const LOCALE = SKI_HOLIDAY_NORWAY_LOCALE;
const SLUG = SKI_HOLIDAY_NORWAY_SLUG;
/** Canonical apex origin — never the www/preview/localhost host. */
const PAGE_URL = absoluteUrl(SKI_HOLIDAY_NORWAY_PATH);

const ctaClasses = (variant?: 'primary' | 'secondary' | 'outline') => {
  if (variant === 'secondary' || variant === 'outline') {
    return 'inline-flex items-center px-5 py-2.5 rounded-full border border-border text-foreground font-medium hover:bg-card';
  }
  return 'inline-flex items-center px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground font-medium hover:opacity-90';
};

const renderSection = (section: SeoLandingBodySection) => {
  switch (section.type) {
    case 'rich_text':
      return (
        <motion.section
          key={section.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-12 px-4"
        >
          <div className="container mx-auto max-w-3xl">
            {section.heading && (
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {section.heading}
              </h2>
            )}
            <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
              {section.body}
            </p>
          </div>
        </motion.section>
      );
    case 'cta_block':
      return (
        <section key={section.id} className="px-4 pb-6">
          <div className="container mx-auto max-w-3xl">
            {section.external ? (
              <a
                href={section.href}
                target="_blank"
                rel="noopener noreferrer"
                className={ctaClasses(section.variant)}
              >
                {section.label}
              </a>
            ) : (
              <Link to={section.href} className={ctaClasses(section.variant)}>
                {section.label}
              </Link>
            )}
          </div>
        </section>
      );
    case 'flight_access_block':
      return (
        <section key={section.id} className="py-12 px-4 bg-muted/30 border-y border-border">
          <div className="container mx-auto max-w-3xl">
            {section.heading && (
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                {section.heading}
              </h2>
            )}
            <ul className="space-y-4">
              {section.items.map((it, i) => (
                <li key={i} className="rounded-xl border border-border bg-card p-5">
                  <div className="font-semibold text-foreground">{it.airport}</div>
                  <div className="text-muted-foreground text-sm mt-1">{it.routeText}</div>
                  <div className="text-muted-foreground text-sm">{it.driveTimeText}</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Reviewed {it.lastReviewedAt} —{' '}
                    <a href={it.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      source
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    default:
      return null;
  }
};

const SkiHolidayNorway = () => {
  useEffect(() => {
    trackPageView({
      path: SKI_HOLIDAY_NORWAY_PATH,
      language: LOCALE,
      title: SKI_HOLIDAY_NORWAY_SEO.title,
    });
  }, []);

  const entry = useCms(() => getSeoLanding({ locale: LOCALE, slug: SLUG }), [LOCALE, SLUG]);

  if (!entry) {
    // Mock fallback always returns this entry — null only if WordPress is
    // connected and the CPT is missing. Render an empty shell to avoid layout shift.
    return (
      <PageMeta
        title={SKI_HOLIDAY_NORWAY_SEO.title}
        description={SKI_HOLIDAY_NORWAY_SEO.description}
      />
    );
  }

  const heroImageUrl = entry.heroImage?.url ?? images.heroWinter.src;
  const heroImageAbsolute = heroImageUrl.startsWith('http') ? heroImageUrl : CANONICAL_ORIGIN + heroImageUrl;

  return (
    <>
      <PageMeta
        title={entry.seoTitle ?? entry.title}
        description={entry.seoDescription ?? entry.intro ?? ''}
        ogImage={heroImageAbsolute}
        ogType="website"
      />
      <JsonLd
        data={buildBreadcrumb([
          { label: 'Home', url: absoluteUrl('/en') },
          { label: entry.title, url: PAGE_URL },
        ])}
      />

      <PageHero
        title={entry.title}
        subtitle={entry.intro ?? ''}
        image={heroImageUrl}
      />

      {entry.pageSummary && (
        <PageSummaryBlock summary={entry.pageSummary} facts={entry.pageSummaryFacts} />
      )}

      {entry.bodySections?.map(renderSection)}

      {entry.faq && entry.faq.length > 0 && (
        <FaqBlock title="Frequently asked questions" items={entry.faq} />
      )}

      {entry.relatedLinks && entry.relatedLinks.length > 0 && (
        <RelatedLinksBlock title="Plan your Bjorli ski holiday" links={entry.relatedLinks} />
      )}
    </>
  );
};

export default SkiHolidayNorway;