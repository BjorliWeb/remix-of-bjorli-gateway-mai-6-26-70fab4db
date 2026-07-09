import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryLabel from './CategoryLabel';
import DateBadge from './DateBadge';
import type { ListingItem } from '@/components/ListingPage';
import { resolveEventTarget, type EventLinkTarget } from './eventLink';

interface Props {
  item: ListingItem;
  to: string;
  featuredLabel: string;
  ctaLabel: string;
  /** When true, treat the item as an event (submission-aware link resolution). */
  eventMode?: boolean;
}

/**
 * Wide editorial "hero" card surfaced above the grid on listing pages.
 * Image left, copy right on desktop; stacked on mobile.
 */
const FeaturedContentCard = ({ item, to, featuredLabel, ctaLabel, eventMode }: Props) => {
  const target: EventLinkTarget = eventMode
    ? resolveEventTarget({ id: item.id, slug: item.slug, ctaHref: item.ctaHref, bookingUrl: item.bookingUrl }, to)
    : { kind: 'internal', to };
  const clickable = target.kind !== 'none';
  const external = target.kind === 'external';

  const inner = (
    <>
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
            clickable ? 'group-hover:scale-105' : ''
          }`}
        />
        <div className="absolute top-4 left-4">
          <CategoryLabel variant="solid">{featuredLabel}</CategoryLabel>
        </div>
      </div>
      <div className="p-6 md:p-10 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {item.category && <CategoryLabel>{item.category}</CategoryLabel>}
          {item.date && <DateBadge date={item.date} />}
        </div>
        <h2
          className={`font-display text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3 transition-colors ${
            clickable ? 'group-hover:text-secondary' : ''
          }`}
        >
          {item.title}
        </h2>
        {item.intro && <p className="text-muted-foreground leading-relaxed mb-4">{item.intro}</p>}
        {clickable && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary mt-auto">
            {external ? 'Besøk nettsted' : ctaLabel}
            {external ? (
              <ExternalLink className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            )}
          </span>
        )}
      </div>
    </>
  );

  const shell = 'grid grid-cols-1 md:grid-cols-2';
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group bg-card rounded-2xl overflow-hidden border border-border shadow-sm transition-all ${
        clickable ? 'hover:shadow-lg' : ''
      }`}
    >
      {target.kind === 'internal' && (
        <Link to={target.to} className={shell}>{inner}</Link>
      )}
      {target.kind === 'external' && (
        <a href={target.href} target="_blank" rel="noopener noreferrer" className={shell}>{inner}</a>
      )}
      {target.kind === 'none' && (
        <div className={shell} aria-disabled="true">{inner}</div>
      )}
    </motion.article>
  );
};

export default FeaturedContentCard;