/**
 * Public CMS API.
 *
 * Components import from `@/lib/cms` only. Swapping providers later means
 * changing `activeAdapter` below — nothing else.
 *
 * To add a real provider:
 *   1. Implement `CmsAdapter` in e.g. `sanityAdapter.ts`.
 *   2. Set `activeAdapter = sanityAdapter`.
 *   3. Map the CMS schema to the field names defined in `./types`.
 */
import type { CmsAdapter } from './adapter';
import { mockAdapter } from './mockAdapter';

export * from './types';
export type { CmsAdapter } from './adapter';
export { useCms } from './useCms';
export { resolveSeoForRoute, type ResolvedSeo } from './seo';

const activeAdapter: CmsAdapter = mockAdapter;

export const cms = activeAdapter;

/* Typed convenience wrappers — keep generics so callers infer return types. */
export const getPage:         CmsAdapter['getPage']         = (q) => activeAdapter.getPage(q);
export const getHomepage:     CmsAdapter['getHomepage']     = (q) => activeAdapter.getHomepage(q);
export const getNews:         CmsAdapter['getNews']         = (q) => activeAdapter.getNews(q);
export const getEvents:       CmsAdapter['getEvents']       = (q) => activeAdapter.getEvents(q);
export const getTips:         CmsAdapter['getTips']         = (q) => activeAdapter.getTips(q);
export const getActivities:   CmsAdapter['getActivities']   = (q) => activeAdapter.getActivities(q);
export const getAccommodations: CmsAdapter['getAccommodations'] = (q) => activeAdapter.getAccommodations(q);
export const getFoodDrink:     CmsAdapter['getFoodDrink']    = (q) => activeAdapter.getFoodDrink(q);
export const getNewsItem:     CmsAdapter['getNewsItem']     = (q) => activeAdapter.getNewsItem(q);
export const getEventItem:    CmsAdapter['getEventItem']    = (q) => activeAdapter.getEventItem(q);
export const getTipItem:      CmsAdapter['getTipItem']      = (q) => activeAdapter.getTipItem(q);
export const getActivityItem: CmsAdapter['getActivityItem'] = (q) => activeAdapter.getActivityItem(q);
export const getAccommodationItem: CmsAdapter['getAccommodationItem'] = (q) => activeAdapter.getAccommodationItem(q);
export const getFoodDrinkItem: CmsAdapter['getFoodDrinkItem'] = (q) => activeAdapter.getFoodDrinkItem(q);
export const getNavigation:   CmsAdapter['getNavigation']   = (q) => activeAdapter.getNavigation(q);
export const getFooter:       CmsAdapter['getFooter']       = (q) => activeAdapter.getFooter(q);
export const getAlerts:       CmsAdapter['getAlerts']       = (q) => activeAdapter.getAlerts(q);
export const getOpeningHours: CmsAdapter['getOpeningHours'] = (q) => activeAdapter.getOpeningHours(q);
export const getSeoSettings:  CmsAdapter['getSeoSettings']  = (q) => activeAdapter.getSeoSettings(q);
