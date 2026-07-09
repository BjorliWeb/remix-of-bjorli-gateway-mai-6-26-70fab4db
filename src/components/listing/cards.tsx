import ContentCard from '@/components/ContentCard';
import type { ListingItem } from '@/components/ListingPage';
import type { Season } from '@/lib/cms';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { EventLink, resolveEventTarget } from './eventLink';

/**
 * Type-specific cards. They share the visual ContentCard but exist as
 * named components so a future Next.js + WordPress integration can map
 * each to its own custom-post-type renderer (News, Event, Tip, Activity)
 * without changing every call site.
 *
 * CMS-ready prop contract:
 *   - title, intro, image, alt, category, date, season, url, ctaLabel
 *
 * The wrapper components below accept a `ListingItem` (already mapped from
 * a `CmsEntryBase`) plus an explicit `to` URL. When the WordPress adapter
 * lands, the same contract is satisfied 1:1 — no call-site changes.
 */

interface CardProps {
  item: ListingItem;
  to: string;
  index?: number;
}

/** Discrete prop shape used by future CMS-driven card renderers. */
export interface CmsCardProps {
  title: string;
  intro?: string;
  image: string;
  alt?: string;
  category?: string;
  date?: string;
  season?: Season;
  url: string;
  ctaLabel?: string;
}

export const NewsCard = ({ item, to, index }: CardProps) => (
  <ContentCard to={to} image={item.image} category={item.category} date={item.date} title={item.title} intro={item.intro} index={index} />
);

export const EventCard = ({ item, to, index = 0 }: CardProps) => {
  const target = resolveEventTarget(
    { id: item.id, slug: item.slug, ctaHref: item.ctaHref, bookingUrl: item.bookingUrl },
    to,
  );
  const clickable = target.kind !== 'none';
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className={`group bg-card rounded-2xl overflow-hidden border border-border/70 transition-colors flex flex-col ${
        clickable ? 'hover:border-secondary/40' : ''
      }`}
    >
      <EventLink target={target} className="block h-full flex flex-col">
        <div className="relative aspect-[5/4] overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-[1200ms] ${
              clickable ? 'group-hover:scale-[1.04]' : ''
            }`}
          />
          {(item.category || item.date) && (
            <div className="absolute top-4 left-4 flex gap-2">
              {item.category && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.15em] bg-background/90 text-foreground backdrop-blur">
                  {item.category}
                </span>
              )}
              {item.date && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.15em] bg-secondary/90 text-secondary-foreground">
                  {item.date}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-7 flex flex-col flex-1">
          <h3
            className={`font-display text-xl font-bold text-foreground mb-3 leading-tight transition-colors ${
              clickable ? 'group-hover:text-secondary' : ''
            }`}
          >
            {item.title}
          </h3>
          {item.intro && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{item.intro}</p>
          )}
          {target.kind === 'external' && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary mt-auto">
              <span>Besøk nettsted</span>
              <ExternalLink className="h-4 w-4" />
            </span>
          )}
          {target.kind === 'internal' && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary mt-auto">
              <span>Les mer</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </EventLink>
    </motion.article>
  );
};

export const TipCard = ({ item, to, index }: CardProps) => (
  <ContentCard to={to} image={item.image} category={item.category} title={item.title} intro={item.intro} index={index} />
);

export const ActivityCard = ({ item, to, index }: CardProps) => (
  <ContentCard to={to} image={item.image} category={item.category} title={item.title} intro={item.intro} index={index} />
);

/**
 * Accommodation card — placeholder wrapper around ContentCard so future
 * WordPress `bjorli_accommodation` entries can render through a single
 * named component. Visuals unchanged.
 */
export const AccommodationCard = ({ item, to, index }: CardProps) => (
  <ContentCard to={to} image={item.image} category={item.category} title={item.title} intro={item.intro} index={index} />
);

/**
 * Food & Drink card — placeholder wrapper, same rationale as above for
 * future `bjorli_food_drink` entries.
 */
export const FoodDrinkCard = ({ item, to, index }: CardProps) => (
  <ContentCard to={to} image={item.image} category={item.category} title={item.title} intro={item.intro} index={index} />
);