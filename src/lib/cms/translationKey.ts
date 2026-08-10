/**
 * Stable translation identity for a CMS entry.
 *
 * Entries for the same editorial item are generated per locale from the same
 * source list, so the id suffix identifies the translation group:
 *
 *   news-no-2      / news-en-2      -> "2"
 *   activity-no-w-0 / activity-en-w-0 -> "w-0"   (winter)
 *   activity-no-s-0 / activity-en-s-0 -> "s-0"   (summer)
 *
 * The season marker MUST be preserved: without it winter item 0 and summer
 * item 0 collapse into one group and one season overwrites the other in
 * translation grouping, prerender and sitemap generation.
 *
 * A future CMS adapter (WordPress/Polylang, Sanity, ...) can supply its own
 * translation-group id instead; this helper is only the fallback used by the
 * current mock adapter's deterministic ids.
 */
export const translationKeyOf = (entry: { id: string; slug: string }): string => {
  const seasoned = /-([ws])-(\d+)$/.exec(entry.id);
  if (seasoned) return `${seasoned[1]}-${seasoned[2]}`;
  const numeric = /-(\d+)$/.exec(entry.id);
  if (numeric) return numeric[1];
  return entry.slug;
};
