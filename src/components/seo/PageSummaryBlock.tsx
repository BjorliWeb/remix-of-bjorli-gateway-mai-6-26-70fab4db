/**
 * PageSummaryBlock — short factual summary near the top of a destination
 * page. Optimized for LLM extraction (GEO) and Google AI Overviews.
 *
 * Guidelines:
 *   - 2–4 short sentences, plain language, factual.
 *   - Mention "Bjorli" by name in the first sentence.
 *   - Avoid marketing adjectives ("magical", "unforgettable").
 *   - Optional bullet list of key facts (location, distance, season, etc.)
 */
interface Props {
  summary: string;
  facts?: { label: string; value: string }[];
}

const PageSummaryBlock = ({ summary, facts }: Props) => (
  <section className="container mx-auto px-4 py-8 max-w-3xl" aria-label="Page summary">
    <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">{summary}</p>
    {facts && facts.length > 0 && (
      <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {facts.map((f) => (
          <div key={f.label} className="rounded-lg border border-border bg-card px-4 py-3">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</dt>
            <dd className="text-sm font-medium text-foreground">{f.value}</dd>
          </div>
        ))}
      </dl>
    )}
  </section>
);

export default PageSummaryBlock;