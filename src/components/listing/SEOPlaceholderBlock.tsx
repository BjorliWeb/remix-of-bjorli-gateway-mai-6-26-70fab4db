/**
 * Crawlable intro / SEO copy block for listing and detail pages.
 * Renders a real <section> with semantic markup so search engines and
 * LLM crawlers receive the context even before the WordPress CMS is
 * wired up. Replace `body` with a CMS-managed long-form intro later.
 */
const SEOPlaceholderBlock = ({
  title,
  body,
  children,
}: {
  title: string;
  body?: string;
  children?: React.ReactNode;
}) => (
  <section className="py-12 md:py-16 px-4 bg-muted/40 border-t border-border">
    <div className="container mx-auto max-w-3xl">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">{title}</h2>
      {body && <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{body}</p>}
      {children}
    </div>
  </section>
);

export default SEOPlaceholderBlock;