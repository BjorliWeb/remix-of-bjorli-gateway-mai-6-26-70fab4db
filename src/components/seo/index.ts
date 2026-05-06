/**
 * SEO / GEO / AEO building blocks.
 *
 * Compose these inside any page. They are intentionally small and
 * provider-agnostic so the upcoming Next.js migration can reuse the
 * same shapes via `generateMetadata` and server components.
 */
export { default as JsonLd } from './JsonLd';
export { default as PageMeta } from './PageMeta';
export { default as FaqBlock } from './FaqBlock';
export { default as RelatedLinksBlock } from './RelatedLinksBlock';
export type { RelatedLink } from './RelatedLinksBlock';
export { default as PageSummaryBlock } from './PageSummaryBlock';

export * from '@/lib/seo/schema';