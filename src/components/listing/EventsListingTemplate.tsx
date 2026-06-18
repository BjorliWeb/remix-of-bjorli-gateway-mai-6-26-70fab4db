import { useMemo, useState } from 'react';
import PageHero from '@/components/PageHero';
import Breadcrumbs from './Breadcrumbs';
import CategoryFilter from './CategoryFilter';
import DateFilter from './DateFilter';
import CalendarListToggle, { type ViewMode } from './CalendarListToggle';
import FeaturedContentCard from './FeaturedContentCard';
import { EventCard } from './cards';
import LoadMoreButton from './LoadMoreButton';
import RelatedContentSection from './RelatedContentSection';
import SEOPlaceholderBlock from './SEOPlaceholderBlock';
import DateBadge from './DateBadge';
import CategoryLabel from './CategoryLabel';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { Link } from 'react-router-dom';
import { PAGE_SIZE, filterByCategory, filterByDate, uniqueCategories } from './listingHelpers';
import type { ListingItem } from '@/components/ListingPage';

export interface EventsListingTemplateProps {
  title: string;
  intro: string;
  heroImage: string;
  basePath: string;
  items: ListingItem[];
}

const EventsListingTemplate = ({ title, intro, heroImage, basePath, items }: EventsListingTemplateProps) => {
  const { d, locale } = useLanguage();
  const lp = useLocalizedPath();
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [view, setView] = useState<ViewMode>('list');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const categories = useMemo(() => uniqueCategories(items), [items]);
  const filtered = useMemo(() => filterByDate(filterByCategory(items, category), date), [items, category, date]);
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

      <section className="container mx-auto px-4 pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <DateFilter label={d.listing.filterDate ?? 'Dato'} value={date} onChange={(d) => { setDate(d); setVisible(PAGE_SIZE); }} />
          <CategoryFilter
            label={d.listing.filterCategory}
            categories={categories}
            active={category}
            onChange={(c) => { setCategory(c); setVisible(PAGE_SIZE); }}
            allLabel={d.listing.filterAll ?? 'Alle'}
          />
        </div>
        <CalendarListToggle
          value={view}
          onChange={setView}
          labels={{ list: d.listing.viewList ?? 'Liste', calendar: d.listing.viewCalendar ?? 'Kalender' }}
        />
      </section>

      {featured && view === 'list' && (
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
          {view === 'list' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shown.map((item, i) => (
                  <EventCard key={item.slug} item={item} to={lp(`${basePath}/${item.slug}`)} index={i} />
                ))}
              </div>
              <LoadMoreButton onClick={() => setVisible((v) => v + PAGE_SIZE)} remaining={remaining} label={d.listing.loadMore ?? 'Vis flere'} />
            </>
          ) : (
            <ul className="divide-y divide-border border border-border rounded-2xl bg-card overflow-hidden">
              {filtered.map((item) => (
                <li key={item.slug}>
                  <Link to={lp(`${basePath}/${item.slug}`)} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 md:p-5 hover:bg-muted/50 transition-colors">
                    <div className="md:w-44 shrink-0">
                      <DateBadge date={item.date} locale={locale} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.category && <CategoryLabel>{item.category}</CategoryLabel>}
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                      {item.intro && <p className="text-sm text-muted-foreground line-clamp-2">{item.intro}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <SEOPlaceholderBlock title={d.listing.seoPlaceholderTitle ?? title} body={d.listing.seoPlaceholderBody} />
    </div>
  );
};

export default EventsListingTemplate;