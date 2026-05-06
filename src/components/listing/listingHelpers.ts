import type { ListingItem } from '@/components/ListingPage';
import type { CmsActivity, CmsEntryBase, CmsEvent, Season } from '@/lib/cms';

export const PAGE_SIZE = 6;

export const uniqueCategories = (items: { category?: string }[]): string[] => {
  const set = new Set<string>();
  items.forEach((i) => i.category && set.add(i.category));
  return Array.from(set);
};

export const filterByCategory = <T extends { category?: string }>(items: T[], cat: string | null) =>
  cat ? items.filter((i) => i.category === cat) : items;

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
  date: (entry as CmsEvent).startsAt ?? entry.publishedAt,
  title: entry.title,
  intro: entry.intro,
  image: entry.heroImage?.url ?? fallbackImage,
});

export const isWinter = (a: CmsActivity) => a.season === 'winter';
export const isSummer = (a: CmsActivity) => a.season === 'summer';