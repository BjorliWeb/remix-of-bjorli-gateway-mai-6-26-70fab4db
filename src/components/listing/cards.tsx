import ContentCard from '@/components/ContentCard';
import type { ListingItem } from '@/components/ListingPage';
import type { Season } from '@/lib/cms';

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

export const EventCard = ({ item, to, index }: CardProps) => (
  <ContentCard to={to} image={item.image} category={item.category} date={item.date} title={item.title} intro={item.intro} index={index} />
);

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