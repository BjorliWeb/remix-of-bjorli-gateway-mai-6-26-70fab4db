import { useMemo, useState } from 'react';
import PageHero from '@/components/PageHero';
import Breadcrumbs from './Breadcrumbs';
import CategoryFilter from './CategoryFilter';
import FeaturedContentCard from './FeaturedContentCard';
import { NewsCard } from './cards';
import LoadMoreButton from './LoadMoreButton';
import RelatedContentSection from './RelatedContentSection';
import SEOPlaceholderBlock from './SEOPlaceholderBlock';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { PAGE_SIZE, filterByCategory, uniqueCategories } from './listingHelpers';
import type { ListingItem } from '@/components/ListingPage';

export interface NewsListingTemplateProps {
  title: string;
  intro: string;
  heroImage: string;
  basePath: string;
  items: ListingItem[];
}

const NewsListingTemplate = ({ title, intro, heroImage, basePath, items }: NewsListingTemplateProps) => {
  const { d } = useLanguage();
  const lp = useLocalizedPath();
  const [category, setCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = useMemo(() => uniqueCategories(items), [items]);
  const filtered = useMemo(() => filterByCategory(items, category), [items, category]);
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

      <section className="container mx-auto px-4 pt-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((item, i) => (
              <NewsCard key={item.slug} item={item} to={lp(`${basePath}/${item.slug}`)} index={i} />
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

export default NewsListingTemplate;