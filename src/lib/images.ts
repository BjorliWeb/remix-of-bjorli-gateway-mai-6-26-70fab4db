/**
 * Bjorli image registry.
 *
 * All entries point to real, curated Bjorli destination photos sourced
 * from the official Bjorli image packs (folders 01–06 under
 * `src/assets/photos/`). No AI, no stock, no klatrepark.
 *
 * Folder convention:
 *   01_winter_ski_resort   – winter / ski / slopes / lifts / mountain
 *   02_summer_destination  – hiking, fishing, biking, summer landscape
 *   03_accommodation       – cabins / lodging
 *   04_food_restaurant     – restaurant interior & food
 *   05_practical_facilities– signs / maps / facilities
 *   06_events_atmosphere   – guests / atmosphere / events
 *   00_donotuse_klatrepark – NEVER reference from here
 */

export interface BjorliImage {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  /** WordPress ACF / media field key this image maps to in the CMS. */
  wpField: string;
  /** True only if this is a temporary placeholder (no curated photo yet). */
  placeholder: boolean;
}

// Hero — explicitly preserved per brief.
import heroWinter from '@/assets/photos/bjorli-stolheis-fjellutsikt-vinter.jpg';

// 01 — Winter / Ski resort
import w_skiArea from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-036.jpg';
import w_resortEntrance from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-049.jpg';
import w_slopeView from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-055.jpg';
import w_powder from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-084.jpg';
// NOTE: previous `bjorli-vinter-skisenter-232.jpg` was a campaign poster
// ("SESONGKORT TIL NEDSNØDDE PRISER" with Bjorli.no logo) — removed.
// `crossCountry` and `gettingHere` now point to a real sunny snow
// panorama from the same pack (slope view 055).
import w_bjorliski from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-bjorliski2.jpg';
import w_powderLift from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-budderstolheis.jpg';
import w_fjellheis from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-fjellheis.jpg';
// w_kidsSchool removed — sourced poster graphics. The `skiSchool`
// registry entry now points to a real chairlift-with-children photo
// from the events/atmosphere pack.
import w_skiPass from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-skipass-7759d89a01-1.jpg';
import w_snowCannon from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-snokanon-scaled.jpg';
import w_snowboard from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-snowboard.jpg';
import w_chair3 from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-stolheis3.jpg';
import w_chair2 from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-stolheisen2.jpg';
import w_topStation from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-toppstasjon.jpg';
import w_groomed from '@/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-web-ljosbakken-50-6df1981c1c.jpg';

// 02 — Summer
import s_homeSummer from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-home-summer-a32c838736.jpg';
import s_flyFishing from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-fluefiske-aebb0e82ea.jpg';
import s_fishingLake from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-fiskeilesja-d91ae3c817.jpg';
import s_fishingRiver from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-fiskelv-9210bd8a45.jpg';
import s_biking from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-large-sykkelilesja-e6a70b0e8d.jpg';

// 03 — Accommodation
import a_vetlegrenda from '@/assets/photos/03_accommodation/bjorli-overnatting-hytte-vetlegrenda-fra-vg-10-og-mot-skisen.jpg';
// Real Bjorli lodging shots live in 06_events_atmosphere (mis-bucketed in upstream pack).
import a_mountainLodge from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-bjorlimountainlodge-8cafc89cba-4.jpg';
import a_brendjordsbyen from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-brendjordsbyen-d9042f2428.jpg';

// 04 — Food & restaurant
import f_dish from '@/assets/photos/04_food_restaurant/bjorli-restaurant-mat-mattisolavbjokne-2-20410b6b4a.jpg';
// NOTE: previous `bjorli-restaurant-mat-your-apent-hver-dag-frem-19-april-stol.jpg`
// was an opening-hours poster graphic ("Velkommen til Slush Sesong på Bjorli!"
// with weekday hours baked in) — removed. The food/restaurant section now
// reuses real warm cabin/lodge interior photography from pack 06 until
// dedicated restaurant interiors are sourced.

// 05 — Practical facilities
import p_sign from '@/assets/photos/05_practical_facilities/bjorli-praktisk-info-bjorliskilt.jpg';
import p_signAlt from '@/assets/photos/05_practical_facilities/bjorli-praktisk-info-bjorliskiltet.jpg';
import p_pisteMap from '@/assets/photos/05_practical_facilities/bjorli-praktisk-info-loypekart-40895db20c-1.jpg';

// 06 — Events / atmosphere (selected highlights)
// NOTE: previous `bjorli-arrangement-atmosfaere-*` files were poster
// graphics (Påska 2025, Påske 2026, Christmas opening hours) and have
// been removed. Replaced with real destination photography below.
import e_event1 from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-img-9860-scaled.jpg';
import e_event2 from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-2022-1020-bjorli-5-hdr-1-scaled.jpg';
import e_liftChair from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-lift-chair-look-ahead-scaled.jpg';
import e_summerTrail from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-dsc-8636-2-min-7debf59814-scaled.jpg';
import e_goldenTrainWide from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-large-goldentrain3-6dd14cfc26.jpg';
import e_gladEmma from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-glad-emma-img-4203-scaled.jpg';
import e_mood1 from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-031.jpg';
import e_mood2 from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-080.jpg';
import e_mood3 from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-112.jpg';

export const images = {
  // ── HERO ──────────────────────────────────────────────────────────────
  heroWinter: {
    src: heroWinter,
    alt: 'Bjorli Ski Resort with snow-covered mountains in winter.',
    wpField: 'hero_winter_image',
    placeholder: false,
  },
  heroSummer: {
    src: s_homeSummer,
    alt: 'Summer landscape at Bjorli with green mountains and open sky.',
    wpField: 'hero_summer_image',
    placeholder: false,
  },

  // ── SKI CENTER & SLOPES ───────────────────────────────────────────────
  skiCenter: {
    src: w_skiArea,
    alt: 'Bjorli Ski Resort with skiers and snow-covered slopes in winter.',
    wpField: 'ski_center_image',
    placeholder: false,
  },
  skiSlopes: {
    src: w_groomed,
    alt: 'Freshly groomed slope at Bjorli Ski Resort.',
    wpField: 'ski_slopes_image',
    placeholder: false,
  },
  liftArea: {
    src: w_chair3,
    alt: 'Chairlift at Bjorli Ski Resort with wide snowy mountain views.',
    wpField: 'lift_area_image',
    placeholder: false,
  },
  snowConditions: {
    src: w_snowCannon,
    alt: 'Snow cannon producing snow on the slopes at Bjorli Ski Resort.',
    wpField: 'snow_conditions_image',
    placeholder: false,
  },
  skiSchool: {
    src: e_liftChair,
    alt: 'Children on a chairlift at Bjorli — quiet ski day with mountains behind.',
    wpField: 'ski_school_image',
    placeholder: false,
  },
  skiRental: {
    src: w_skiPass,
    alt: 'Ski pass and rental area at Bjorli Ski Resort.',
    wpField: 'ski_rental_image',
    placeholder: false,
  },
  crossCountry: {
    src: w_slopeView,
    alt: 'Snowy mountain landscape around Bjorli — ideal for cross-country skiing.',
    wpField: 'cross_country_image',
    placeholder: false,
  },

  // ── ACCOMMODATION ─────────────────────────────────────────────────────
  cabinEvening: {
    src: a_mountainLodge,
    alt: 'Bjorli Mountain Lodge illuminated on a starry winter night.',
    wpField: 'cabin_image',
    placeholder: false,
  },
  accommodation: {
    src: a_vetlegrenda,
    alt: 'Vetlegrenda cabins at Bjorli with view towards the ski resort.',
    wpField: 'accommodation_image',
    placeholder: false,
  },

  // ── FOOD & DRINK ──────────────────────────────────────────────────────
  foodDrink: {
    src: e_event2,
    alt: 'Warm wood-panelled cabin interior at Bjorli — soft daylight and Nordic textiles.',
    wpField: 'food_drink_image',
    placeholder: false,
  },

  // ── EDITORIAL / NEWS / EVENTS / TIPS ──────────────────────────────────
  event: {
    src: e_event1,
    alt: 'Calm winter morning at Bjorli — snow groomer, igloo and golden light over the village.',
    wpField: 'event_image',
    placeholder: false,
  },
  news: {
    src: e_mood1,
    alt: 'Bjorli destination atmosphere — mountains, snow and people.',
    wpField: 'news_image',
    placeholder: false,
  },
  tipPlanning: {
    src: e_mood2,
    alt: 'Bjorli mountain destination — planning your trip.',
    wpField: 'tip_planning_image',
    placeholder: false,
  },
  tipTrain: {
    src: e_goldenTrainWide,
    alt: 'Golden Train crossing the river valley near Bjorli on the Rauma Line.',
    wpField: 'tip_train_image',
    placeholder: false,
  },
  tipFamily: {
    src: e_gladEmma,
    alt: 'Child enjoying a snowy ski day at Bjorli.',
    wpField: 'tip_family_image',
    placeholder: false,
  },

  // ── SUMMER TEASER & SUMMER PAGES ──────────────────────────────────────
  summer: {
    src: s_homeSummer,
    alt: 'Summer view at Bjorli with green mountain landscape.',
    wpField: 'summer_image',
    placeholder: false,
  },
  hiking: {
    src: s_flyFishing,
    alt: 'Fly fishing in a mountain river near Bjorli during summer.',
    wpField: 'hiking_image',
    placeholder: false,
  },
  biking: {
    src: s_biking,
    alt: 'Cycling in the mountains near Bjorli on a summer day.',
    wpField: 'biking_image',
    placeholder: false,
  },
  familySummer: {
    src: s_fishingLake,
    alt: 'Family fishing experience by a lake near Bjorli in summer.',
    wpField: 'family_summer_image',
    placeholder: false,
  },

  // ── GETTING HERE / PRACTICAL ──────────────────────────────────────────
  gettingHere: {
    src: w_slopeView,
    alt: 'Bjorli valley and surrounding mountains — the destination experience.',
    wpField: 'getting_here_image',
    placeholder: false,
  },

  // ── EXTRAS ────────────────────────────────────────────────────────────
  topStation: {
    src: w_topStation,
    alt: 'Top station at Bjorli Ski Resort with mountain panorama.',
    wpField: 'top_station_image',
    placeholder: false,
  },
  mountainTop: {
    src: w_topStation,
    alt: 'View from the top of Bjorli Ski Resort across the winter landscape.',
    wpField: 'mountain_top_image',
    placeholder: false,
  },
  powder: {
    src: w_powder,
    alt: 'Skier riding deep powder snow at Bjorli.',
    wpField: 'powder_image',
    placeholder: false,
  },
  snowboard: {
    src: w_snowboard,
    alt: 'Snowboarder riding fresh snow at Bjorli.',
    wpField: 'snowboard_image',
    placeholder: false,
  },
  eveningLift: {
    src: w_chair2,
    alt: 'Chairlift at Bjorli in winter light.',
    wpField: 'evening_lift_image',
    placeholder: false,
  },
  resortEntrance: {
    src: w_resortEntrance,
    alt: 'Entrance area at Bjorli Ski Resort in winter.',
    wpField: 'resort_entrance_image',
    placeholder: false,
  },
  parking: {
    src: p_sign,
    alt: 'Welcome sign at Bjorli — practical information for visitors.',
    wpField: 'parking_image',
    placeholder: false,
  },
  dish: {
    src: f_dish,
    alt: 'Restaurant dish served at Bjorli.',
    wpField: 'dish_image',
    placeholder: false,
  },
  restaurantEvening: {
    src: e_event2,
    alt: 'Cosy lodge interior at Bjorli with warm wood, calm light and Nordic textiles.',
    wpField: 'restaurant_evening_image',
    placeholder: false,
  },

  // ── ADDITIONAL REAL PHOTOS available for future sections ──────────────
  bjorliSign: { src: p_signAlt, alt: 'Bjorli destination welcome sign.', wpField: 'bjorli_sign_image', placeholder: false },
  pisteMap: { src: p_pisteMap, alt: 'Bjorli Ski Resort piste map.', wpField: 'piste_map_image', placeholder: false },
  flyFishing: { src: s_flyFishing, alt: 'Fly fishing in a river near Bjorli.', wpField: 'fly_fishing_image', placeholder: false },
  riverFishing: { src: s_fishingRiver, alt: 'Fishing in a mountain river near Bjorli.', wpField: 'river_fishing_image', placeholder: false },
  eventFlying: { src: e_summerTrail, alt: 'Mountain biking on a singletrack near Bjorli in late summer.', wpField: 'event_flying_image', placeholder: false },
  eventEaster: { src: e_event2, alt: 'Cosy cabin interior at Bjorli with warm wood and soft daylight.', wpField: 'event_easter_image', placeholder: false },
  moodScenic: { src: e_mood3, alt: 'Scenic Bjorli destination atmosphere.', wpField: 'mood_scenic_image', placeholder: false },
} satisfies Record<string, BjorliImage>;

export type ImageKey = keyof typeof images;
