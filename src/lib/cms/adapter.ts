import type {
  CmsAlert,
  CmsAccommodation,
  CmsActivity,
  CmsEvent,
  CmsFoodDrink,
  CmsFooter,
  CmsHomepage,
  CmsItemQuery,
  CmsListQuery,
  CmsNavigation,
  CmsNews,
  CmsOpeningHours,
  CmsPage,
  CmsSeoSettings,
  CmsTip,
} from './types';

/**
 * Adapter contract. A future Sanity / Strapi / DatoCMS / Storyblok adapter
 * must implement these methods. Components never call adapters directly —
 * they use the helpers exported from `src/lib/cms/index.ts`.
 */
export interface CmsAdapter {
  name: string;

  getPage(query: CmsItemQuery): Promise<CmsPage | null>;
  getHomepage(query: { language: CmsListQuery['language']; season?: CmsListQuery['season'] }): Promise<CmsHomepage | null>;

  getNews(query: CmsListQuery): Promise<CmsNews[]>;
  getEvents(query: CmsListQuery): Promise<CmsEvent[]>;
  getTips(query: CmsListQuery): Promise<CmsTip[]>;
  getActivities(query: CmsListQuery): Promise<CmsActivity[]>;
  getAccommodations(query: CmsListQuery): Promise<CmsAccommodation[]>;
  getFoodDrink(query: CmsListQuery): Promise<CmsFoodDrink[]>;

  getNewsItem(query: CmsItemQuery): Promise<CmsNews | null>;
  getEventItem(query: CmsItemQuery): Promise<CmsEvent | null>;
  getTipItem(query: CmsItemQuery): Promise<CmsTip | null>;
  getActivityItem(query: CmsItemQuery): Promise<CmsActivity | null>;
  getAccommodationItem(query: CmsItemQuery): Promise<CmsAccommodation | null>;
  getFoodDrinkItem(query: CmsItemQuery): Promise<CmsFoodDrink | null>;

  getNavigation(query: { language: CmsListQuery['language'] }): Promise<CmsNavigation>;
  getFooter(query: { language: CmsListQuery['language'] }): Promise<CmsFooter>;
  getAlerts(query: CmsListQuery): Promise<CmsAlert[]>;
  getOpeningHours(query: { language: CmsListQuery['language'] }): Promise<CmsOpeningHours>;
  getSeoSettings(query: { language: CmsListQuery['language'] }): Promise<CmsSeoSettings>;
}
