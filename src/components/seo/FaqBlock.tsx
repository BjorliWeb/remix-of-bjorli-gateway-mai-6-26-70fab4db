import JsonLd from './JsonLd';
import { buildFaqPage } from '@/lib/seo/schema';

interface FaqItem { q: string; a: string }

/**
 * Crawlable FAQ block — renders visible Q&A pairs AND the matching
 * FAQPage JSON-LD. Use on Bjorli Skisenter, Heiskort, Åpningstider,
 * Skiutleie, Skiskole, Overnatting, Reisen hit, Vinter, Sommer.
 *
 * Designed for AEO (Answer Engine Optimization): plain language Q+A so
 * Google AI Overviews, Perplexity and ChatGPT Search can quote directly.
 */
const FaqBlock = ({ title = 'FAQ', items }: { title?: string; items: FaqItem[] }) => {
  if (!items?.length) return null;
  return (
    <section className="py-12 md:py-16 px-4 bg-muted/30 border-t border-border">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">{title}</h2>
        <dl className="space-y-4">
          {items.map((f, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <dt className="font-semibold text-foreground mb-1">{f.q}</dt>
              <dd className="text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
      <JsonLd data={buildFaqPage(items)} />
    </section>
  );
};

export default FaqBlock;