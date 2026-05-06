import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  to?: string;
}

/**
 * Semantic breadcrumb trail used by listing + detail templates.
 * Renders schema.org BreadcrumbList JSON-LD as well, so future Next.js
 * App Router metadata can lift this directly into the head.
 */
const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: c.to,
    })),
  };
  return (
    <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {c.to && !last ? (
                <Link to={c.to} className="hover:text-secondary">{c.label}</Link>
              ) : (
                <span className={last ? 'text-foreground font-medium' : ''}>{c.label}</span>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
};

export default Breadcrumbs;