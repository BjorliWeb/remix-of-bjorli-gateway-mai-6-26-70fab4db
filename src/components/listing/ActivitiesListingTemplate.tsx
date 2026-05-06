import { useMemo, useState } from 'react';
import PageHero from '@/components/PageHero';
import Breadcrumbs from './Breadcrumbs';
import CategoryFilter from './CategoryFilter';
import SeasonFilter, { type SeasonValue } from './SeasonFilter';
import { ActivityCard } from './cards';
import RelatedContentSection from './RelatedContentSection';
import SEOPlaceholderBlock from './SEOPlaceholderBlock';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { filterByCategory, filterBySeason, uniqueCategories } from './listingHelpers';
import type { ListingItem } from '@/components/ListingPage';
import type { CmsActivity } from '@/lib/cms';

export interface ActivitiesListingTemplateProps {
  title: string;
  intro: string;
  heroImage: string;
  basePath: string;
  entries: CmsActivity[];
  items: ListingItem[];
}

const FAMILY_HINT = /famil/i;

const Section = ({ title, items, basePath, lp }: { title: string; items: ListingItem[]; basePath: string; lp: (p: string) => string }) => {
  if (!items.length) return null;
  return (
    <section className="py-10 md:py-14 px-4">
      <div className="container mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <ActivityCard key={item.slug} item={item} to={lp(`${basePath}/${item.slug}`)} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ActivitiesListingTemplate = ({ title, intro, heroImage, basePath, entries, items }: ActivitiesListingTemplateProps) => {
  const { d } = useLanguage();
  const lp = useLocalizedPath();
  const [season, setSeason] = useState<SeasonValue>('all');
  const [category, setCategory] = useState<string | null>(null);

  const filteredEntries = useMemo(() => filterBySeason(entries, season), [entries, season]);
  const allowedSlugs = new Set(filteredEntries.map((e) => e.slug));
  const seasoned = items.filter((i) => allowedSlugs.has(i.slug));
  const categories = useMemo(() => uniqueCategories(seasoned), [seasoned]);
  const filtered = useMemo(() => filterByCategory(seasoned, category), [seasoned, category]);

  // Split for thematic sections — drives by CMS season + a soft "family" hint.
  const winterSlugs = new Set(entries.filter((e) => e.season === 'winter').map((e) => e.slug));
  const summerSlugs = new Set(entries.filter((e) => e.season === 'summer').map((e) => e.slug));
  const winter = filtered.filter((i) => winterSlugs.has(i.slug));
  const summer = filtered.filter((i) => summerSlugs.has(i.slug));
  const family = filtered.filter((i) => FAMILY_HINT.test(i.title) || FAMILY_HINT.test(i.intro ?? ''));

  return (
    <div>
      <PageHero title={title} subtitle={intro} image={heroImage} />
      <Breadcrumbs items={[{ label: d.listing.breadcrumbHome, to: lp('/') }, { label: title }]} />

      <section className="container mx-auto px-4 pt-8">
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl">{intro}</p>
      </section>

      <section className="container mx-auto px-4 pt-8 flex flex-col gap-4">
        <SeasonFilter
          label={d.listing.filterSeason ?? 'Sesong'}
          active={season}
          onChange={setSeason}
          labels={{
            all: d.listing.seasonAllYear ?? 'Hele året',
            winter: d.listing.seasonWinter ?? 'Vinter',
            summer: d.listing.seasonSummer ?? 'Sommer',
          }}
        />
        <CategoryFilter
          label={d.listing.filterCategory}
          categories={categories}
          active={category}
          onChange={setCategory}
          allLabel={d.listing.filterAll ?? 'Alle'}
        />
      </section>

      <Section title={d.listing.sectionWinter ?? 'Vinteraktiviteter'} items={winter} basePath={basePath} lp={lp} />
      <Section title={d.listing.sectionSummer ?? 'Sommeraktiviteter'} items={summer} basePath={basePath} lp={lp} />
      <Section title={d.listing.sectionFamily ?? 'Familieaktiviteter'} items={family} basePath={basePath} lp={lp} />

      <section className="py-10 md:py-14 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <ActivityCard key={item.slug} item={item} to={lp(`${basePath}/${item.slug}`)} index={i} />
            ))}
          </div>
        </div>
      </section>

      <RelatedContentSection title={d.listing.relatedTitle} items={items.slice(0, 3)} basePath={basePath} />

      <SEOPlaceholderBlock title={d.listing.seoPlaceholderTitle ?? title} body={d.listing.seoPlaceholderBody} />
    </div>
  );
};

export default ActivitiesListingTemplate;