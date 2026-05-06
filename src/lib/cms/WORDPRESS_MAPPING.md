# WordPress → Frontend Mapping

This document is the canonical CMS data model for Bjorli. It mirrors the
TypeScript types in `types.ts` and shows how each field is sourced from
WordPress (Custom Post Types + ACF, exposed via REST or WPGraphQL).

**Important**: this is preparation only. No live WordPress calls exist
yet. The mock adapter satisfies the same contract today.

## Conventions

- All CPTs are prefixed `bjorli_` to keep them isolated from WP defaults.
- All custom fields live in ACF field groups suffixed `_fields`.
- Multilingual via **Polylang** or **WPML**:
  - `language` → `lang` query parameter / `LanguageCodeFilterEnum`
  - URL structure stays `/`, `/en/`, `/de/`, `/nl/`, `/da/`, `/sv/`
- Media (hero image, OG image, gallery) → `wp.v2.media`, mapped to
  `CmsImage { url, alt, width, height, caption, credit, wpField }`.
- SEO blocks read from **Yoast SEO** or **RankMath** REST extensions
  (`yoast_head_json` / `rank_math_seo`).

## Content types

### 1. Page (`bjorli_page`)

| Frontend (`CmsPage`) | WordPress source |
| --- | --- |
| `title` | `post.title.rendered` |
| `slug` | `post.slug` |
| `language` | Polylang `lang` |
| `parentSlug` | `post.parent` → resolved slug |
| `heroTitle` | ACF `hero_title` |
| `heroSubtitle` | ACF `hero_subtitle` |
| `heroImage` | ACF `hero_image` (media) |
| `intro` | ACF `intro_text` |
| `body` | `post.content.rendered` |
| `contentBlocks` | ACF flexible content `content_blocks` |
| `ctaLabel` / `ctaHref` | ACF `cta_label` / `cta_url` |
| `relatedContent` | ACF relationship `related_pages` |
| `faq` | ACF repeater `faq_items` `{ question, answer }` |
| `seoTitle` / `seoDescription` | Yoast `_yoast_wpseo_title` / `..._metadesc` |
| `ogImage` | Yoast `_yoast_wpseo_opengraph-image` |
| `noindex` | Yoast `_yoast_wpseo_meta-robots-noindex` |

Pages: Vinter, Sommer, Bjorli Skisenter, Heiskort, Åpningstider,
Livecams, Løypekart, Skiutleie, Skiskole, Overnatting, Mat og drikke,
Praktisk info, Kontakt, Langrenn, Fotturer, Sykling, Reisen hit.

### 2. News article (`bjorli_news`)

| Frontend (`CmsNews`) | WordPress |
| --- | --- |
| `publishedAt` / `updatedAt` | `post.date` / `post.modified` |
| `category` | Custom taxonomy `news_category` |
| `season` | ACF radio `season` (`winter`/`summer`/`all`) |
| `heroImage` | Featured image |
| `intro` / `body` | ACF `intro_text` / `post.content.rendered` |
| `ctaLabel` / `ctaHref` | ACF `cta_label` / `cta_url` |
| `relatedContent` | ACF relationship `related_articles` |

### 3. Event (`bjorli_event`)

| Frontend (`CmsEvent`) | WordPress |
| --- | --- |
| `startsAt` / `endsAt` | ACF date `start_date` / `end_date` |
| `startTime` / `endTime` | ACF time `start_time` / `end_time` |
| `location` | ACF `location` |
| `category` | Taxonomy `event_category` |
| `season` | ACF radio `season` |
| `bookingUrl` | ACF url `booking_url` |
| `organizer` | ACF `organizer` |
| `relatedContent` | ACF relationship `related_activities` |

### 4. Tip / Inspiration (`bjorli_tip`)

| Frontend (`CmsTip`) | WordPress |
| --- | --- |
| `season` | ACF radio `season` |
| `category` | Taxonomy `tip_category` |
| `readingTime` | ACF number `reading_time_minutes` |
| `relatedActivities` | ACF relationship `related_activities` |
| `relatedAccommodation` | ACF relationship `related_accommodation` |
| `ctaLabel` / `ctaHref` | ACF `cta_label` / `cta_url` |

### 5. Activity (`bjorli_activity`)

| Frontend (`CmsActivity`) | WordPress |
| --- | --- |
| `season` | ACF radio `season` |
| `activityCategory` | ACF select `activity_category` (alpine-skiing, cross-country-skiing, hiking, cycling, family, food, accommodation, travel, nature) |
| `difficulty` | ACF select `difficulty` (easy/medium/hard) |
| `duration` | ACF text `duration_label` |
| `familyFriendly` | ACF true/false `family_friendly` |
| `location` | ACF `location` |
| `mapUrl` | ACF url `map_url` |
| `bookingUrl` | ACF url `booking_url` |
| `relatedArticles` | ACF relationship `related_articles` |
| `relatedEvents` | ACF relationship `related_events` |

### 6. Alert / Driftsmelding (`bjorli_alert`)

| Frontend (`CmsAlert`) | WordPress / Cloud |
| --- | --- |
| `level` | ACF select `severity` (info/warning/critical) |
| `startsAt` / `endsAt` | ACF date/time |
| `showGlobally` | ACF true/false `show_globally` |
| `showOnHomepage` | ACF true/false `show_on_homepage` |
| `showOnSkiCenter` | ACF true/false `show_on_ski_center` |
| `ctaLabel` / `ctaHref` | ACF |

Time-sensitive alerts may also stream from Lovable Cloud (`alerts` table)
for sub-minute freshness; the adapter merges both sources.

### 7. Opening hours (`bjorli_opening_hours`)

`CmsOpeningHours.rows[]` with `area`, `dateFrom`, `dateTo`, `dayOfWeek`,
`openTime`, `closeTime`, `status`, `comment`. Modeled as a repeater so
editors can express seasonal + per-area schedules without code.

### 8. Accommodation (`bjorli_accommodation`)

| Frontend (`CmsAccommodation`) | WordPress |
| --- | --- |
| `accommodationType` | ACF select (cabin/apartment/hotel/lodge/camping/other) |
| `gallery` | ACF gallery `gallery` |
| `description` | `post.content.rendered` |
| `location` | ACF `location` |
| `bookingUrl` / `contactInfo` | ACF |
| `facilities` | ACF repeater `facilities` |
| `familyFriendly` | ACF true/false |

### 9. Food & Drink (`bjorli_food_drink`)

| Frontend (`CmsFoodDrink`) | WordPress |
| --- | --- |
| `venueType` | ACF select (restaurant/cafe/bar/kiosk/takeaway/other) |
| `gallery` | ACF gallery |
| `openingHoursArea` | ACF select referencing an `area` value |
| `menuUrl` / `bookingUrl` | ACF url |

### 10. Navigation (ACF Options Page `bjorli_navigation`)

Fields: `main_menu_items` (repeater), `footer_menu_items` (repeater),
`winter_cta_label` / `winter_cta_url`, `summer_cta_label` /
`summer_cta_url`. One options group per language.

### 11. SEO Settings (ACF Options Page `bjorli_seo_settings`)

Fields: `site_name`, `default_title`, `default_description`,
`default_og_image`, `canonical_base_url`, `robots`, `sitemap_url`,
`llms_txt_blocks` (repeater `{ heading, body }`).

## Multilingual + URL routing

| Language | Code | URL prefix |
| --- | --- | --- |
| Norwegian | `no` | `/` |
| English | `en` | `/en/` |
| German | `de` | `/de/` |
| Dutch | `nl` | `/nl/` |
| Danish | `da` | `/da/` |
| Swedish | `sv` | `/sv/` |

The Next.js adapter calls WordPress with `?lang=<code>` and emits
`<link rel="alternate" hreflang>` for every translation returned.

## SEO / LLM readiness checklist

Every CMS-driven page template supports:

- single H1 from `title` / `heroTitle`
- `<title>` from `seoTitle` (fallback `title`)
- meta description from `seoDescription` (fallback `intro`)
- canonical URL from `canonicalUrl` (fallback site canonical + path)
- hreflang from translation set
- OG image from `ogImage` → `heroImage`
- breadcrumbs from `parentSlug` chain
- FAQ schema from `faq[]`
- structured data placeholders (Article / NewsArticle / Event / WebPage)
- alt text on every image (`CmsImage.alt`)
- related internal links via `relatedContent`
- crawlable rendered HTML (no client-only content)
- `noindex` toggle respected