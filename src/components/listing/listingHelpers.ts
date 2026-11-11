import type { ListingItem } from '@/components/ListingPage';
import type { CmsActivity, CmsEntryBase, CmsEvent, Season } from '@/lib/cms';
import { normalizeCategories } from '@/lib/eventCategories';

export const PAGE_SIZE = 6;

type Categorised = { category?: string; categories?: string[] };

/** All categories of an item: the list when present, else the single field. */
export const itemCategories = (i: Categorised): string[] =>
  normalizeCategories(i.categories, i.category);

export const uniqueCategories = (items: Categorised[]): string[] => {
  const set = new Set<string>();
  items.forEach((i) => itemCategories(i).forEach((c) => set.add(c)));
  return Array.from(set);
};

/** An item matches when ANY of its categories matches; each item appears once. */
export const filterByCategory = <T extends Categorised>(items: T[], cat: string | null) =>
  cat ? items.filter((i) => itemCategories(i).includes(cat)) : items;

export const filterBySeason = <T extends { season?: Season }>(items: T[], season: 'all' | 'winter' | 'summer') =>
  season === 'all' ? items : items.filter((i) => !i.season || i.season === season || i.season === 'all');

export const filterByDate = (items: ListingItem[], date: Date | undefined) => {
  if (!date) return items;
  const target = date.toISOString().slice(0, 10);
  return items.filter((i) => (i.date ?? '').slice(0, 10) === target);
};

export const toListingItem = (entry: CmsEntryBase, fallbackImage: string): ListingItem => ({
  slug: entry.slug,
  category: entry.category,
  categories: normalizeCategories(entry.categories, entry.category),
  imageFit: entry.heroImage?.fit,
  date: (entry as CmsEvent).startsAt ?? entry.publishedAt,
  title: entry.title,
  intro: entry.intro,
  image: entry.heroImage?.url ?? fallbackImage,
  id: entry.id,
  ctaHref: (entry as CmsEvent).ctaHref,
  bookingUrl: (entry as CmsEvent).bookingUrl,
});

export const isWinter = (a: CmsActivity) => a.season === 'winter';
export const isSummer = (a: CmsActivity) => a.season === 'summer';