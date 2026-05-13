/**
 * CMS-agnostic content types.
 *
 * Field names are aligned with conventions used by Sanity, Strapi, DatoCMS
 * and Storyblok so that a future adapter can map 1:1 without touching
 * frontend components.
 *
 * IMPORTANT: Components must consume content through `src/lib/cms/*`,
 * never directly from a CMS SDK or Supabase. This keeps the frontend
 * provider-independent.
 */

export type Language = 'no' | 'en' | 'de' | 'nl' | 'da' | 'sv';
export type Season = 'winter' | 'summer' | 'all';

/** Image reference. `url` is the only required field; the rest mirror DAM fields. */
export interface CmsImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  /** Optional editorial caption rendered under image figures. */
  caption?: string;
  /** Optional photo credit. */
  credit?: string;
  /** WordPress media field key — kept on the entry so a future WP adapter
   *  can hydrate this from a custom ACF/post-meta field without renaming. */
  wpField?: string;
  /** True while the image is a labeled placeholder (not real Bjorli photography). */
  placeholder?: boolean;
}

/** Common SEO block, matching Storyblok/Sanity SEO plugin shapes. */
export interface CmsSeo {
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: CmsImage;
  canonicalUrl?: string;
  /** Twitter / X card metadata. Defaults to OG image + summary_large_image when omitted. */
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: CmsImage;
  twitterSite?: string;
  /** Robots directive, e.g. "index,follow" or "noindex,nofollow". */
  robots?: string;
  /** When true, page is excluded from sitemaps and adds <meta name="robots" content="noindex"/>. */
  noindex?: boolean;
  nofollow?: boolean;
  /** Optional schema.org @type override applied by JsonLd helper. */
  schemaType?:
    | 'WebPage'
    | 'Article'
    | 'NewsArticle'
    | 'Event'
    | 'FAQPage'
    | 'TouristDestination'
    | 'SkiResort'
    | 'LocalBusiness'
    | 'LodgingBusiness'
    | 'Place'
    | 'Organization';
  /** Free-form FAQ items used for FAQPage schema + visible FAQ block. */
  faq?: { q: string; a: string }[];
  /**
   * Locales for which this entry has a real, published translation.
   * Drives hreflang emission — SEOHead must NOT output a `<link rel="alternate">`
   * for a locale that is not in this list.
   *
   * For mock content this defaults to all six locales (pages are visually
   * served in every locale even though body copy is still NO-only).
   * Once WordPress is connected, a real adapter must populate this from the
   * translation group (WPML/Polylang/ACF) so missing translations do not leak.
   */
  availableTranslations?: Language[];
  /**
   * When true, the entry's body has been translated for the requested locale.
   * When false/undefined and the active locale is not 'no', the
   * <TranslationPendingNotice> placeholder will be shown.
   *
   * For mock content this is `true` only for `no` (and currently the same
   * NO body is reused for other locales as a visual placeholder).
   */
  translatedBody?: boolean;
}

/** Reference to another content entry (used in relatedContent fields). */
export interface CmsRef {
  type: 'page' | 'news' | 'event' | 'tip' | 'activity';
  slug: string;
  title: string;
  heroImage?: CmsImage;
}

/** Base fields present on every content entry. */
export interface CmsEntryBase extends CmsSeo {
  id: string;
  slug: string;
  language: Language;
  title: string;
  intro?: string;
  body?: string;
  heroImage?: CmsImage;
  category?: string;
  season?: Season;
  publishedAt?: string; // ISO 8601
  updatedAt?: string;   // ISO 8601
  relatedContent?: CmsRef[];
}

export interface CmsPage extends CmsEntryBase {}

/* ------------------------------------------------------------------ */
/* Page (static / destination pages — Vinter, Sommer, Skisenter, etc) */
/* ------------------------------------------------------------------ */

/**
 * `CmsPage` is used for CMS-managed static pages.
 *
 * WordPress mapping (future):
 *   - Custom Post Type: `bjorli_page`
 *   - REST: `/wp-json/wp/v2/bjorli_page`
 *   - GraphQL: `pages { ... }` (WPGraphQL) with ACF field group `page_fields`
 *   - Polylang / WPML provides `language` and `translations`.
 */
export interface CmsPage extends CmsEntryBase {
  /** Slug of the parent page, when nested. */
  parentSlug?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  contentBlocks?: CmsHomepageSection[];
  ctaLabel?: string;
  ctaHref?: string;
  faq?: { q: string; a: string }[];
  /** When true, the page is excluded from indexing & sitemaps. */
  noindex?: boolean;
}

/* ------------------------------------------------------------------ */
/* News                                                               */
/* ------------------------------------------------------------------ */

/** WordPress mapping (future): CPT `bjorli_news`, ACF group `news_fields`. */
export interface CmsNews extends CmsEntryBase {
  ctaLabel?: string;
  ctaHref?: string;
}

/* ------------------------------------------------------------------ */
/* Event                                                              */
/* ------------------------------------------------------------------ */

/** WordPress mapping (future): CPT `bjorli_event`, ACF group `event_fields`. */
export interface CmsEvent extends CmsEntryBase {
  startsAt?: string;
  endsAt?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  organizer?: string;
  bookingUrl?: string;
}

/* ------------------------------------------------------------------ */
/* Tip / Inspiration                                                  */
/* ------------------------------------------------------------------ */

/** WordPress mapping (future): CPT `bjorli_tip`, ACF group `tip_fields`. */
export interface CmsTip extends CmsEntryBase {
  /** Estimated reading time in minutes. */
  readingTime?: number;
  ctaLabel?: string;
  ctaHref?: string;
  relatedActivities?: CmsRef[];
  relatedAccommodation?: CmsRef[];
}

/* ------------------------------------------------------------------ */
/* Activity                                                           */
/* ------------------------------------------------------------------ */

export type CmsActivityCategory =
  | 'alpine-skiing'
  | 'cross-country-skiing'
  | 'hiking'
  | 'cycling'
  | 'family'
  | 'food'
  | 'accommodation'
  | 'travel'
  | 'nature';

/** WordPress mapping (future): CPT `bjorli_activity`, ACF group `activity_fields`. */
export interface CmsActivity extends CmsEntryBase {
  activityCategory?: CmsActivityCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  /** Free-form duration label, e.g. "1–3 t". */
  duration?: string;
  familyFriendly?: boolean;
  location?: string;
  mapUrl?: string;
  bookingUrl?: string;
  relatedArticles?: CmsRef[];
  relatedEvents?: CmsRef[];
}

/* ------------------------------------------------------------------ */
/* Accommodation                                                      */
/* ------------------------------------------------------------------ */

export type CmsAccommodationType =
  | 'cabin'
  | 'apartment'
  | 'hotel'
  | 'lodge'
  | 'camping'
  | 'other';

/** WordPress mapping (future): CPT `bjorli_accommodation`. */
export interface CmsAccommodation extends CmsEntryBase {
  accommodationType?: CmsAccommodationType;
  gallery?: CmsImage[];
  description?: string;
  location?: string;
  bookingUrl?: string;
  contactInfo?: string;
  facilities?: string[];
  familyFriendly?: boolean;
}

/* ------------------------------------------------------------------ */
/* Food & Drink                                                       */
/* ------------------------------------------------------------------ */

export type CmsFoodDrinkType =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'kiosk'
  | 'takeaway'
  | 'other';

/** WordPress mapping (future): CPT `bjorli_food_drink`. */
export interface CmsFoodDrink extends CmsEntryBase {
  venueType?: CmsFoodDrinkType;
  gallery?: CmsImage[];
  description?: string;
  location?: string;
  /** Reference to a CmsOpeningHours `area` value. */
  openingHoursArea?: string;
  menuUrl?: string;
  bookingUrl?: string;
  contactInfo?: string;
}

/** Homepage is a composed page with section blocks. */
export interface CmsHomepage extends CmsEntryBase {
  season: Season;
  heroTitle: string;
  heroSubtitle?: string;
  heroIntro?: string;
  /** Composed sections rendered on the homepage. Order is preserved. */
  sections?: CmsHomepageSection[];
}

/* ------------------------------------------------------------------ */
/* Homepage section blocks — provider-agnostic shapes                 */
/* ------------------------------------------------------------------ */

export type CmsHomepageSection =
  | CmsStatusSection
  | CmsAlertSection
  | CmsIntroSection
  | CmsCardGridSection
  | CmsFeatureSection
  | CmsImageCardsSection
  | CmsTipsSection
  | CmsEventsSection
  | CmsBeyondSection
  | CmsGettingHereSection
  | CmsTeaserSection
  | CmsNewsSection
  | CmsFaqSection
  | CmsActivitiesSection;

interface CmsSectionBase {
  /** Stable id used as React key. */
  id: string;
}

export interface CmsStatusSection extends CmsSectionBase {
  type: 'status';
  /** Optional section heading above the live status cards. */
  heading?: string;
  /** Optional caption rendered between the cards and the link row. */
  caption?: string;
  cards: { icon: 'lifts' | 'slopes' | 'snow' | 'temperature'; value: string; label: string }[];
  links: { icon: 'clock' | 'camera'; label: string; href: string }[];
}

export interface CmsAlertSection extends CmsSectionBase {
  type: 'alert';
  label: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface CmsIntroSection extends CmsSectionBase {
  type: 'intro';
  title: string;
  body: string;
  /** Optional uppercase eyebrow label (editorial split layout). */
  eyebrow?: string;
  /** Optional large editorial statement, rendered as headline. */
  statement?: string;
  /** Optional supporting paragraph rendered below the statement. */
  supportingText?: string;
  /** Optional proof-points rendered as a quiet horizontal row. */
  proofPoints?: string[];
}

export interface CmsCardGridSection extends CmsSectionBase {
  type: 'cardGrid';
  /** Optional uppercase eyebrow. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: { title: string; desc: string; icon?: string; href?: string; external?: boolean }[];
}

export interface CmsFeatureSection extends CmsSectionBase {
  type: 'feature';
  eyebrow?: string;
  title: string;
  body: string;
  image: CmsImage;
  /** Visual order: image left or right. */
  imageSide?: 'left' | 'right';
  ctas: { label: string; href: string; variant?: 'primary' | 'secondary' | 'outline'; external?: boolean; icon?: string }[];
  /** Optional small sub-cards rendered below the feature copy. */
  subcards?: { title: string; desc?: string }[];
}

export interface CmsImageCardsSection extends CmsSectionBase {
  type: 'imageCards';
  title?: string;
  eyebrow?: string;
  cards: { title: string; eyebrow?: string; image: CmsImage; href: string }[];
}

export interface CmsTipsSection extends CmsSectionBase {
  type: 'tips';
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  items: CmsTip[];
}

export interface CmsEventsSection extends CmsSectionBase {
  type: 'events';
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  items: (CmsEvent & { date: string })[];
}

export interface CmsBeyondSection extends CmsSectionBase {
  type: 'beyond';
  eyebrow: string;
  title: string;
  body: string;
  images: CmsImage[];
  items: { title: string; desc: string; icon?: string }[];
}

export interface CmsGettingHereSection extends CmsSectionBase {
  type: 'gettingHere';
  eyebrow: string;
  title: string;
  body: string;
  cities: { city: string; km: string }[];
  ctas: { label: string; href: string; icon?: string; external?: boolean }[];
}

export interface CmsTeaserSection extends CmsSectionBase {
  type: 'teaser';
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image: CmsImage;
}

export interface CmsNewsSection extends CmsSectionBase {
  type: 'news';
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  items: (CmsNews & { date: string })[];
}

export interface CmsFaqSection extends CmsSectionBase {
  type: 'faq';
  eyebrow: string;
  title: string;
  items: { q: string; a: string }[];
}

export interface CmsActivitiesSection extends CmsSectionBase {
  type: 'activities';
  title: string;
  subtitle: string;
  items: { title: string; desc: string; icon?: string }[];
  imageCards?: { title: string; desc?: string; image: CmsImage }[];
}

export interface CmsNavItem {
  label: string;
  href: string;
  children?: CmsNavItem[];
}

export interface CmsNavigation {
  language: Language;
  primary: CmsNavItem[];
}

export interface CmsFooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface CmsFooter {
  language: Language;
  about: string;
  address: string;
  columns: CmsFooterColumn[];
}

export interface CmsAlert {
  id: string;
  language: Language;
  level: 'info' | 'warning' | 'critical';
  label?: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  publishedAt?: string;
  startsAt?: string;
  endsAt?: string;
  /** Display globally on every page when true. */
  showGlobally?: boolean;
  /** Surface in the homepage alert section when true. */
  showOnHomepage?: boolean;
  /** Surface on the Bjorli Skisenter page when true. */
  showOnSkiCenter?: boolean;
  /** Surface on the Opening Hours page when true. */
  showOnOpeningHours?: boolean;
}

export interface CmsOpeningHours {
  language: Language;
  /** Free-form label e.g. "Daglig 09–16" used for headline display. */
  todayLabel: string;
  weekly?: { day: string; hours: string }[];
  /** Per-area structured rows (skisenter / ski rental / restaurant / office / other). */
  rows?: CmsOpeningHoursRow[];
}

export type CmsOpeningHoursArea =
  | 'skisenter'
  | 'ski-rental'
  | 'restaurant'
  | 'office'
  | 'other';

export interface CmsOpeningHoursRow {
  area: CmsOpeningHoursArea;
  /** ISO date — start of validity for this row. */
  dateFrom?: string;
  /** ISO date — end of validity. */
  dateTo?: string;
  /** Day of week 0 (Sun) – 6 (Sat); omit for all days in range. */
  dayOfWeek?: number;
  openTime?: string;
  closeTime?: string;
  status?: 'open' | 'closed' | 'limited' | 'weather-dependent';
  comment?: string;
}

/* ------------------------------------------------------------------ */
/* Global SEO settings (single document in WordPress)                 */
/* ------------------------------------------------------------------ */

/** WordPress mapping (future): ACF Options Page `bjorli_seo_settings`. */
export interface CmsSeoSettings {
  language: Language;
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage?: CmsImage;
  canonicalBaseUrl: string;
  robots?: string;
  sitemapUrl?: string;
  /** Free-form blocks rendered into /llms.txt (LLM crawler hints). */
  llmsTxtBlocks?: { heading: string; body: string }[];
}

/** Query options accepted by list endpoints. */
export interface CmsListQuery {
  language: Language;
  season?: Season;
  category?: string;
  limit?: number;
}

export interface CmsItemQuery {
  language: Language;
  slug: string;
}
