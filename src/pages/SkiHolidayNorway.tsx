import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
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
import { useLanguage } from '@/i18n/LanguageContext';
import { SKI_HOLIDAY_PAGES, type SkiHolidayLocale } from '@/lib/seo/skiHolidayNorwaySeo';

/** Page chrome per language. The body copy lives in the CMS fixtures. */
const LABELS: Record<SkiHolidayLocale, { home: string; faq: string; related: string }> = {
  en: { home: 'Home', faq: 'Frequently asked questions', related: 'Plan your Bjorli ski holiday' },
  de: { home: 'Startseite', faq: 'Häufige Fragen', related: 'Ihren Skiurlaub in Bjorli planen' },
  sv: { home: 'Startsida', faq: 'Vanliga frågor', related: 'Planera din skidsemester i Bjorli' },
  da: { home: 'Forside', faq: 'Ofte stillede spørgsmål', related: 'Planlæg din skiferie i Bjorli' },
  nl: { home: 'Home', faq: 'Veelgestelde vragen', related: 'Plan je wintersport in Bjorli' },
};

const ctaClasses = (variant?: 'primary' | 'secondary' | 'outline') => {
  if (variant === 'secondary' || variant === 'outline') {
    return 'inline-flex items-center px-5 py-2.5 rounded-full border border-border text-foreground font-medium hover:bg-card';
  }
  return 'inline-flex items-center px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground font-medium hover:opacity-90';
};

const renderSection = (section: SeoLandingBodySection, photoIndex: number) => {
  switch (section.type) {
    case 'rich_text':
      if (section.image) {
        // Text beside a photo on desktop, photo first on mobile. Alternates
        // sides so the page doesn't read as one long column of text.
        return (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-12 px-4"
          >
            <div className="container mx-auto max-w-5xl grid gap-8 md:grid-cols-2 md:items-center">
              <img
                src={section.image.url}
                alt={section.image.alt}
                width={1200}
                height={800}
                loading="lazy"
                decoding="async"
                className={`w-full aspect-[3/2] object-cover rounded-2xl${photoIndex % 2 === 1 ? ' md:order-last' : ''}`}
              />
              <div>
                {section.heading && (
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {section.heading}
                  </h2>
                )}
                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                  {section.body}
                </p>
              </div>
            </div>
          </motion.section>
        );
      }
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
  const { locale: currentLocale } = useLanguage();
  // No version in this language (Norwegian): send the router to the
  // homepage. The language switcher has already put "/" in the address bar,
  // but the router can still hold the previous ski-holiday path.
  const hasVersion = currentLocale in SKI_HOLIDAY_PAGES;
  const locale: SkiHolidayLocale = hasVersion ? (currentLocale as SkiHolidayLocale) : 'en';
  const page = SKI_HOLIDAY_PAGES[locale];
  const labels = LABELS[locale];
  /** Canonical apex origin — never the www/preview/localhost host. */
  const pageUrl = absoluteUrl(page.path);

  useEffect(() => {
    if (!hasVersion) return;
    trackPageView({
      path: page.path,
      language: locale,
      title: page.title,
    });
  }, [hasVersion, page, locale]);

  const entry = useCms(() => getSeoLanding({ locale, slug: page.slug }), [locale, page.slug]);

  if (!hasVersion) return <Navigate to="/" replace />;

  if (!entry) {
    // Mock fallback always returns this entry — null only if WordPress is
    // connected and the CPT is missing. Render an empty shell to avoid layout shift.
    return <PageMeta title={page.title} description={page.description} canonicalPath={page.path} />;
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
        canonicalPath={page.path}
      />
      <JsonLd
        data={buildBreadcrumb([
          { label: labels.home, url: absoluteUrl(`/${locale}`) },
          { label: entry.title, url: pageUrl },
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

      {(() => {
        // Alternate photo sides by photo count, not section position.
        let photoIndex = 0;
        return entry.bodySections?.map((s) =>
          renderSection(s, s.type === 'rich_text' && s.image ? photoIndex++ : 0),
        );
      })()}

      {entry.faq && entry.faq.length > 0 && (
        <FaqBlock title={labels.faq} items={entry.faq} />
      )}

      {entry.relatedLinks && entry.relatedLinks.length > 0 && (
        <RelatedLinksBlock title={labels.related} links={entry.relatedLinks} />
      )}
    </>
  );
};

export default SkiHolidayNorway;