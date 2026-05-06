import { useMemo, useState } from 'react';
import PageHero from '@/components/PageHero';
import Breadcrumbs from './Breadcrumbs';
import CategoryFilter from './CategoryFilter';
import SeasonFilter, { type SeasonValue } from './SeasonFilter';
import FeaturedContentCard from './FeaturedContentCard';
import { TipCard } from './cards';
import LoadMoreButton from './LoadMoreButton';
import RelatedContentSection from './RelatedContentSection';
import SEOPlaceholderBlock from './SEOPlaceholderBlock';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { PAGE_SIZE, filterByCategory, filterBySeason, uniqueCategories } from './listingHelpers';
import type { ListingItem } from '@/components/ListingPage';
import type { CmsTip } from '@/lib/cms';

export interface TipsListingTemplateProps {
  title: string;
  intro: string;
  heroImage: string;
  basePath: string;
  /** Pass full CMS entries so season filtering can run server-shape. */
  entries: CmsTip[];
  items: ListingItem[];
}

const TipsListingTemplate = ({ title, intro, heroImage, basePath, entries, items }: TipsListingTemplateProps) => {
  const { d } = useLanguage();
  const lp = useLocalizedPath();
  const [category, setCategory] = useState<string | null>(null);
  const [season, setSeason] = useState<SeasonValue>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filteredEntries = useMemo(() => filterBySeason(entries, season), [entries, season]);
  const allowedSlugs = new Set(filteredEntries.map((e) => e.slug));
  const seasoned = items.filter((i) => allowedSlugs.has(i.slug));
  const categories = useMemo(() => uniqueCategories(seasoned), [seasoned]);
  const filtered = useMemo(() => filterByCategory(seasoned, category), [seasoned, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const shown = rest.slice(0, visible);
  const remaining = rest.length - shown.length;

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
          onChange={(s) => { setSeason(s); setVisible(PAGE_SIZE); }}
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
          onChange={(c) => { setCategory(c); setVisible(PAGE_SIZE); }}
          allLabel={d.listing.filterAll ?? 'Alle'}
        />
      </section>

      {featured && (
        <section className="container mx-auto px-4 pt-10">
          <FeaturedContentCard
            item={featured}
            to={lp(`${basePath}/${featured.slug}`)}
            featuredLabel={d.listing.featured ?? 'Utvalgt'}
            ctaLabel={d.common.readMore}
          />
        </section>
      )}

      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {shown.map((item, i) => (
              <TipCard key={item.slug} item={item} to={lp(`${basePath}/${item.slug}`)} index={i} />
            ))}
          </div>
          <LoadMoreButton onClick={() => setVisible((v) => v + PAGE_SIZE)} remaining={remaining} label={d.listing.loadMore ?? 'Vis flere'} />
        </div>
      </section>

      <RelatedContentSection title={d.listing.relatedTitle} items={items.slice(0, 3)} basePath={basePath} />

      <SEOPlaceholderBlock title={d.listing.seoPlaceholderTitle ?? title} body={d.listing.seoPlaceholderBody} />
    </div>
  );
};

export default TipsListingTemplate;