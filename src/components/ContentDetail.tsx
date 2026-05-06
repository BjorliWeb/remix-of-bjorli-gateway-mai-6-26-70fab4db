import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import ContentCard from './ContentCard';
import type { ListingItem } from './ListingPage';

interface ContentDetailProps {
  item: ListingItem | null;
  basePath: string;
  listingTitle: string;
  related?: ListingItem[];
  body?: string;
}

/**
 * Generic detail page used by tip / event / news / activity routes.
 * Renders a hero image, breadcrumb, title, intro/body, and related cards.
 */
const ContentDetail = ({ item, basePath, listingTitle, related = [], body }: ContentDetailProps) => {
  const { d } = useLanguage();
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

  return (
    <article>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[420px] flex items-end overflow-hidden">
        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {(item.category || item.date) && (
              <div className="flex items-center gap-2 mb-4 text-primary-foreground/85 text-sm">
                {item.category && <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider">{item.category}</span>}
                {item.date && <span className="text-primary-foreground/80">{item.date}</span>}
              </div>
            )}
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground max-w-4xl leading-tight">
              {item.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">{d.listing.breadcrumbHome}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp(basePath)} className="hover:text-secondary">{listingTitle}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium truncate max-w-[12rem]">{item.title}</li>
        </ol>
      </nav>

      {/* Body */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {item.intro && <p className="text-xl text-foreground/90 leading-relaxed mb-6 font-medium">{item.intro}</p>}
          {body && <p className="text-muted-foreground text-lg leading-relaxed">{body}</p>}

          <div className="mt-10">
            <Link
              to={lp(basePath)}
              className="inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
            >
              <ChevronLeft className="h-4 w-4" /> {listingTitle}
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-muted/40">
          <div className="container mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">{d.listing.relatedTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r, i) => (
                <ContentCard
                  key={r.slug}
                  to={lp(`${basePath}/${r.slug}`)}
                  image={r.image}
                  category={r.category}
                  date={r.date}
                  title={r.title}
                  intro={r.intro}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default ContentDetail;