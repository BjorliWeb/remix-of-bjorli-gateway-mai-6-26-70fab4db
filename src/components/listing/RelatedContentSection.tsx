import ContentCard from '@/components/ContentCard';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import type { ListingItem } from '@/components/ListingPage';

interface Props {
  title: string;
  items: ListingItem[];
  basePath: string;
}

const RelatedContentSection = ({ title, items, basePath }: Props) => {
  const lp = useLocalizedPath();
  if (!items.length) return null;
  return (
    <section className="py-12 md:py-16 px-4 bg-muted/40">
      <div className="container mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((r, i) => (
            <ContentCard
              key={r.slug}
              to={lp(`${basePath}/${r.slug}`)}
              image={r.image}
              category={r.category}
              date={r.date}
              title={r.title}
              intro={r.intro}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedContentSection;