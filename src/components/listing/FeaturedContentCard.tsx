import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import CategoryLabel from './CategoryLabel';
import DateBadge from './DateBadge';
import type { ListingItem } from '@/components/ListingPage';

interface Props {
  item: ListingItem;
  to: string;
  featuredLabel: string;
  ctaLabel: string;
}

/**
 * Wide editorial "hero" card surfaced above the grid on listing pages.
 * Image left, copy right on desktop; stacked on mobile.
 */
const FeaturedContentCard = ({ item, to, featuredLabel, ctaLabel }: Props) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all"
  >
    <Link to={to} className="grid grid-cols-1 md:grid-cols-2">
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden">
        <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute top-4 left-4">
          <CategoryLabel variant="solid">{featuredLabel}</CategoryLabel>
        </div>
      </div>
      <div className="p-6 md:p-10 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {item.category && <CategoryLabel>{item.category}</CategoryLabel>}
          {item.date && <DateBadge date={item.date} />}
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3 group-hover:text-secondary transition-colors">
          {item.title}
        </h2>
        {item.intro && <p className="text-muted-foreground leading-relaxed mb-4">{item.intro}</p>}
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary mt-auto">
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  </motion.article>
);

export default FeaturedContentCard;