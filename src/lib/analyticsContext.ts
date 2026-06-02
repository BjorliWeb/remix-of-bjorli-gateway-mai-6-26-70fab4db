/**
 * Module-level analytics context.
 *
 * Populated by `Layout.tsx` on every route / locale / season change so
 * `trackPageView` and `track()` can stamp every event with the current
 * `language`, `season` and `page_path` without each call site repeating
 * itself. No React import — kept framework-agnostic so the same module
 * works in the upcoming Next.js production frontend.
 */
export type AnalyticsSeason = 'winter' | 'summer';

export interface AnalyticsContext {
  language?: string;
  season?: AnalyticsSeason;
  page_path?: string;
}

let ctx: AnalyticsContext = {};

export const setAnalyticsContext = (next: Partial<AnalyticsContext>): void => {
  ctx = { ...ctx, ...next };
};

export const getAnalyticsContext = (): AnalyticsContext => ctx;