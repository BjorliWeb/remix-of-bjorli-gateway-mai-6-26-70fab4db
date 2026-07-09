import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PageHero from './PageHero';
import ContentCard from './ContentCard';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

export interface ListingItem {
  slug: string;
  category?: string;
  date?: string;
  title: string;
  intro?: string;
  image: string;
  /** Original entry id — used to detect user-submitted events. */
  id?: string;
  /** External CTA URL (organiser website) for events. */
  ctaHref?: string;
  /** External booking/website URL for events. */
  bookingUrl?: string;
}

interface ListingPageProps {
  title: string;
  intro: string;
  heroImage: string;
  basePath: string; // e.g. '/tips' (without locale prefix)
  items: ListingItem[];
}

const ListingPage = ({ title, intro, heroImage, basePath, items }: ListingPageProps) => {
  const { d } = useLanguage();
  const lp = useLocalizedPath();

  return (
    <div>
      <PageHero title={title} subtitle={intro} image={heroImage} />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link to={lp('/')} className="hover:text-secondary">{d.listing.breadcrumbHome}</Link>
          </li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">{title}</li>
        </ol>
      </nav>

      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <ContentCard
                key={item.slug}
                to={lp(`${basePath}/${item.slug}`)}
                image={item.image}
                category={item.category}
                date={item.date}
                title={item.title}
                intro={item.intro}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListingPage;