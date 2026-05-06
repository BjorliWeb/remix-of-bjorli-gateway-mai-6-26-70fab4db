import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface RelatedLink {
  label: string;
  href: string;
  description?: string;
}

/**
 * Internal-linking block used to strengthen destination structure.
 *
 * Usage examples:
 *   - On Bjorli Skisenter: links to Heiskort, Åpningstider, Livecams, Skiutleie, Skiskole.
 *   - On Sommer: links to Fotturer, Sykling, Familie, Overnatting, Mat og drikke.
 *   - On Reisen hit: links to Overnatting, Vinter, Sommer, Praktisk info.
 *
 * Renders semantic <nav> so crawlers treat it as navigation context.
 */
const RelatedLinksBlock = ({
  title,
  links,
}: {
  title: string;
  links: RelatedLink[];
}) => {
  if (!links?.length) return null;
  return (
    <nav aria-label={title} className="py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 hover:border-secondary transition-colors"
              >
                <div>
                  <div className="font-semibold text-foreground">{l.label}</div>
                  {l.description && (
                    <div className="text-sm text-muted-foreground mt-1">{l.description}</div>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 text-secondary mt-1 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default RelatedLinksBlock;