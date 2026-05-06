import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';
import CategoryLabel from './CategoryLabel';
import DateBadge from './DateBadge';
import RelatedContentSection from './RelatedContentSection';
import SEOPlaceholderBlock from './SEOPlaceholderBlock';
import TranslationPendingNotice from '@/components/TranslationPendingNotice';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import type { ListingItem } from '@/components/ListingPage';

export type DetailKind = 'news' | 'event' | 'tip' | 'activity';

interface FaqItem { q: string; a: string }

interface Props {
  kind: DetailKind;
  item: ListingItem | null;
  basePath: string;
  listingTitle: string;
  related?: ListingItem[];
  body?: string;
  faq?: FaqItem[];
  ctaLabel?: string;
  ctaHref?: string;
  /** Pre-built JSON-LD payload (Article / NewsArticle / Event). Falls back to a WebPage stub. */
  jsonLd?: Record<string, unknown>;
  /**
   * True when the displayed body is a real translation for the active locale.
   * When false (or undefined) and the active locale is not Norwegian, a small
   * <TranslationPendingNotice> placeholder is rendered above the body.
   * Used by future WordPress integration to signal untranslated CMS entries.
   */
  translatedBody?: boolean;
}

const ContentDetailTemplate = ({
  kind,
  item,
  basePath,
  listingTitle,
  related = [],
  body,
  faq,
  ctaLabel,
  ctaHref,
  jsonLd,
  translatedBody,
}: Props) => {
  const { d, locale } = useLanguage();
  const lp = useLocalizedPath();

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">{d.listing.notFound}</h1>
        <Link to={lp(basePath)} className="text-secondary hover:underline inline-flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" /> {listingTitle}
        </Link>
      </div>
    );
  }

  const showDate = kind === 'news' || kind === 'event';
  const fallbackJsonLd = {
    '@context': 'https://schema.org',
    '@type': kind === 'event' ? 'Event' : kind === 'news' ? 'NewsArticle' : 'Article',
    headline: item.title,
    description: item.intro,
    image: item.image ? [item.image] : undefined,
    inLanguage: locale,
  };
  const ld = jsonLd ?? fallbackJsonLd;

  return (
    <article>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end overflow-hidden">
        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {item.category && <CategoryLabel variant="solid">{item.category}</CategoryLabel>}
              {showDate && item.date && <DateBadge date={item.date} locale={locale} />}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground max-w-4xl leading-tight">
              {item.title}
            </h1>
          </motion.div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: d.listing.breadcrumbHome, to: lp('/') },
          { label: listingTitle, to: lp(basePath) },
          { label: item.title },
        ]}
      />

      {/* Body */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <TranslationPendingNotice translated={translatedBody} />
          {item.intro && <p className="text-xl text-foreground/90 leading-relaxed mb-6 font-medium">{item.intro}</p>}
          {body && <div className="prose prose-neutral max-w-none text-muted-foreground text-lg leading-relaxed whitespace-pre-line">{body}</div>}

          {(ctaLabel && ctaHref) && (
            <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">{ctaLabel}</h2>
                <p className="text-sm text-muted-foreground">{listingTitle}</p>
              </div>
              <Button asChild size="lg" className="rounded-full">
                <Link to={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          )}

          <div className="mt-10">
            <Link to={lp(basePath)} className="inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline">
              <ChevronLeft className="h-4 w-4" /> {listingTitle}
            </Link>
          </div>
        </div>
      </section>

      {faq && faq.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-muted/30 border-t border-border">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">FAQ</h2>
            <dl className="space-y-4">
              {faq.map((f, i) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <dt className="font-semibold text-foreground mb-1">{f.q}</dt>
                  <dd className="text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <RelatedContentSection title={d.listing.relatedTitle} items={related} basePath={basePath} />

      <SEOPlaceholderBlock title={d.listing.seoPlaceholderTitle ?? item.title} body={d.listing.seoPlaceholderBody} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </article>
  );
};

export default ContentDetailTemplate;