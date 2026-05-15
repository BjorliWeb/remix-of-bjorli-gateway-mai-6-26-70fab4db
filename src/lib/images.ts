/**
 * Bjorli image registry.
 *
 * Curated real Bjorli destination photos sourced from the renamed,
 * SEO-friendly image bank under `src/assets/photos/bank/` (categories
 * 01-hero through 13-natur). No AI, no stock, no klatrepark.
 *
 * Bank folders:
 *   01-hero        – wide premium hero candidates
 *   02-ski         – ski action / slopes / piste
 *   03-family      – families, kids, ski school
 *   04-servering   – restaurant, terrace, after-ski
 *   05-heis        – chairlifts, base/top stations
 *   06-utsikt      – panoramas, mountain views
 *   07-underside   – supporting subpage imagery
 *   08-vinter      – general winter atmosphere
 *   09-sommer      – summer destination
 *   10-sykkel      – biking
 *   11-tur         – hiking / mountain trips
 *   12-fiske       – fishing / water
 *   13-natur       – nature / landscape
 *
 * Files marked LOGO contain a baked-in Bjorli wordmark and must be
 * cropped at the layout level (object-position) before publishing —
 * they are intentionally NOT referenced from this registry.
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

// Mobile hero (preserved). Desktop hero is set inline on the homepage.
import heroWinter from '@/assets/photos/bjorli-stolheis-fjellutsikt-vinter.jpg';

// 01 – Hero candidates
import h_panoramaWide from '@/assets/photos/bank/01-hero/bjorli-vinterpanorama-skiomrade-hero-wide.jpg';
import h_groupWide    from '@/assets/photos/bank/01-hero/bjorli-gruppe-skiere-fjellpanorama-hero-wide.jpg';
import h_liftHero     from '@/assets/photos/bank/01-hero/bjorli-skiheis-hoyfjell-vinter-hero.jpg';
import h_carvingHero  from '@/assets/photos/bank/01-hero/bjorli-carving-oransje-skikjorer-action-hero.jpg';

// 02 – Ski / action / slopes
import s_slopeView      from '@/assets/photos/bank/02-ski/bjorli-vinter-skiloyper-fjellandskap-underside.jpg';
import s_slopePanorama  from '@/assets/photos/bank/02-ski/bjorli-skiloyper-fjellpanorama-underside.jpg';
import s_skiDescent     from '@/assets/photos/bank/02-ski/bjorli-vinter-ski-nedfart-fjellutsikt-underside.jpg';
import s_carvingRed     from '@/assets/photos/bank/02-ski/bjorli-carving-rod-skikjorer-action-forside.jpg';
import s_carvingClose   from '@/assets/photos/bank/02-ski/bjorli-carving-oransje-skikjorer-naer-action-forside.jpg';
import s_carvingClose2  from '@/assets/photos/bank/02-ski/bjorli-winter-ski-action-orange-closeup-hero-candidate.jpg';
import s_snowpark       from '@/assets/photos/bank/02-ski/bjorli-winter-snowpark-rail-and-jump-area.jpg';

// 03 – Family / kids / ski school
import f_kidView      from '@/assets/photos/bank/03-family/bjorli-barn-ski-fjellutsikt-forside.jpg';
import f_kidGoggles   from '@/assets/photos/bank/03-family/bjorli-barn-skibriller-naerbilde-forside.jpg';
import f_skiSchool    from '@/assets/photos/bank/03-family/bjorli-skiskole-barn-alpinbakke-underside.jpg';
import f_familyNord   from '@/assets/photos/bank/03-family/bjorli-nordloypa-familie-hoyfjell-underside.jpg';
import f_pauseSun     from '@/assets/photos/bank/03-family/bjorli-pause-i-sola-hoyfjell-underside.jpg';

// 04 – Servering / food / after-ski
import r_heiskroa     from '@/assets/photos/bank/04-servering/bjorli-winter-heiskroa-afterski-base-area.jpg';

// 05 – Heis / chairlifts / stations
import l_liftGuests   from '@/assets/photos/bank/05-heis/bjorli-stolheis-fjellutsikt-gjester-underside.jpg';
import l_topStation   from '@/assets/photos/bank/05-heis/bjorli-toppstasjon-skiheis-vinter-underside.jpg';
import l_liftValley   from '@/assets/photos/bank/05-heis/bjorli-stolheis-dalutsikt-vinter-underside.jpg';
import l_chairView    from '@/assets/photos/bank/05-heis/bjorli-winter-chairlift-view-snowy-mountains.jpg';
import l_liftAreaFam  from '@/assets/photos/bank/05-heis/bjorli-winter-lift-area-overview-family-slopes.jpg';
import l_fjellheis    from '@/assets/photos/bank/05-heis/bjorli-winter-fjellheis-mountain-lift-open-landscape.jpg';
import l_chairOverview from '@/assets/photos/bank/05-heis/bjorli-winter-chairlift-slope-overview.jpg';

// 06 – Utsikt / panoramas
import u_topSign      from '@/assets/photos/bank/06-utsikt/bjorli-vinter-toppskilt-fjellutsikt-underside.jpg';
import u_panorama     from '@/assets/photos/bank/06-utsikt/bjorli-hoyfjell-skiere-panorama-underside.jpg';
import u_nordloypa    from '@/assets/photos/bank/06-utsikt/bjorli-nordloypa-trekk-hoyfjell-underside.jpg';
import u_signMountain from '@/assets/photos/bank/06-utsikt/bjorli-winter-mountain-view-skiers-and-nordloypa-sign.jpg';

// 07 – Underside / supporting
import x_friendsView  from '@/assets/photos/bank/07-underside/bjorli-vennegjeng-ski-fjellutsikt-forside.jpg';
import x_skiersValley from '@/assets/photos/bank/07-underside/bjorli-skiere-dalutsikt-portrett-underside.jpg';
import x_destSign     from '@/assets/photos/bank/07-underside/bjorli-winter-destination-sign-mountain-view.jpg';

// 08 – Vinter atmosphere
import w_corduroy     from '@/assets/photos/bank/08-vinter/bjorli-winter-groomed-corduroy-snow-detail.jpg';

// 09 – Sommer
import sm_water       from '@/assets/photos/bank/09-sommer/bjorli-summer-bassen-water-activity-area.jpg';

// Existing summer/accommodation/practical assets we still rely on.
import s_homeSummer   from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-home-summer-a32c838736.jpg';
import s_flyFishing   from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-fluefiske-aebb0e82ea.jpg';
import s_fishingLake  from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-fiskeilesja-d91ae3c817.jpg';
import s_fishingRiver from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-fiskelv-9210bd8a45.jpg';
import s_biking       from '@/assets/photos/02_summer_destination/bjorli-sommer-destinasjon-large-sykkelilesja-e6a70b0e8d.jpg';
import a_vetlegrenda  from '@/assets/photos/03_accommodation/bjorli-overnatting-hytte-vetlegrenda-fra-vg-10-og-mot-skisen.jpg';
import a_mountainLodge from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-bjorlimountainlodge-8cafc89cba-4.jpg';
import f_dish         from '@/assets/photos/04_food_restaurant/bjorli-restaurant-mat-mattisolavbjokne-2-20410b6b4a.jpg';
import p_sign         from '@/assets/photos/05_practical_facilities/bjorli-praktisk-info-bjorliskilt.jpg';
import p_signAlt      from '@/assets/photos/05_practical_facilities/bjorli-praktisk-info-bjorliskiltet.jpg';
import p_pisteMap     from '@/assets/photos/05_practical_facilities/bjorli-praktisk-info-loypekart-40895db20c-1.jpg';
import e_goldenTrain  from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-large-goldentrain3-6dd14cfc26.jpg';
import e_summerTrail  from '@/assets/photos/06_events_atmosphere/bjorli-destinasjon-stemning-dsc-8636-2-min-7debf59814-scaled.jpg';

export const images = {
  // ── HERO ──────────────────────────────────────────────────────────────
  heroWinter: {
    src: heroWinter,
    alt: 'Snødekt fjellandskap fra stolheisen på Bjorli.',
    wpField: 'hero_winter_image',
    placeholder: false,
  },
  heroSummer: {
    src: s_homeSummer,
    alt: 'Sommerlandskap på Bjorli med grønne fjell og åpen himmel.',
    wpField: 'hero_summer_image',
    placeholder: false,
  },

  // ── SKI CENTER & SLOPES ───────────────────────────────────────────────
  skiCenter:      { src: s_slopeView,     alt: 'Preparerte skiløyper og fjellandskap på Bjorli Skisenter.', wpField: 'ski_center_image',     placeholder: false },
  skiSlopes:      { src: s_slopePanorama, alt: 'Vidt fjellpanorama med skiløyper på Bjorli.',              wpField: 'ski_slopes_image',     placeholder: false },
  liftArea:       { src: l_liftGuests,    alt: 'Gjester i stolheisen med fjellutsikt på Bjorli.',          wpField: 'lift_area_image',      placeholder: false },
  snowConditions: { src: w_corduroy,      alt: 'Nypreparert snø med tydelige spor – føreforhold på Bjorli.', wpField: 'snow_conditions_image', placeholder: false },
  skiSchool:      { src: f_skiSchool,     alt: 'Barn på skiskole i alpinbakken på Bjorli.',                wpField: 'ski_school_image',     placeholder: false },
  skiRental:      { src: l_liftAreaFam,   alt: 'Heisområde og familievennlige bakker på Bjorli.',          wpField: 'ski_rental_image',     placeholder: false },
  crossCountry:   { src: u_nordloypa,     alt: 'Trekk i Nordløypa – langrenn i høyfjellet ved Bjorli.',    wpField: 'cross_country_image',  placeholder: false },

  // ── ACCOMMODATION ─────────────────────────────────────────────────────
  cabinEvening:   { src: a_mountainLodge, alt: 'Bjorli Mountain Lodge i vinterkveld.',                     wpField: 'cabin_image',          placeholder: false },
  accommodation:  { src: a_vetlegrenda,   alt: 'Vetlegrenda hytter på Bjorli med utsikt mot skisenteret.', wpField: 'accommodation_image',  placeholder: false },

  // ── FOOD & DRINK ──────────────────────────────────────────────────────
  foodDrink:      { src: r_heiskroa,      alt: 'Heiskroa ved bunnstasjonen på Bjorli – mat og afterski.',  wpField: 'food_drink_image',     placeholder: false },

  // ── EDITORIAL / NEWS / EVENTS / TIPS ──────────────────────────────────
  event:          { src: u_topSign,       alt: 'Toppskilt med vidstrakt fjellutsikt på Bjorli.',           wpField: 'event_image',          placeholder: false },
  news:           { src: f_pauseSun,      alt: 'Skipause i sola i høyfjellet på Bjorli.',                  wpField: 'news_image',           placeholder: false },
  tipPlanning:    { src: x_friendsView,   alt: 'Vennegjeng på ski med fjellutsikt – planlegg turen til Bjorli.', wpField: 'tip_planning_image', placeholder: false },
  tipTrain:       { src: e_goldenTrain,   alt: 'Golden Train langs elvedalen ved Bjorli på Raumabanen.',   wpField: 'tip_train_image',      placeholder: false },
  tipFamily:      { src: f_kidGoggles,    alt: 'Barn med skibriller – familie på ski på Bjorli.',          wpField: 'tip_family_image',     placeholder: false },

  // ── SUMMER TEASER & SUMMER PAGES ──────────────────────────────────────
  summer:         { src: s_homeSummer,    alt: 'Sommerlandskap på Bjorli med grønne fjell.',                wpField: 'summer_image',         placeholder: false },
  hiking:         { src: s_homeSummer,    alt: 'Åpent sommerlandskap ved Bjorli — fottur i grønne fjell.',  wpField: 'hiking_image',         placeholder: false },
  biking:         { src: s_biking,        alt: 'Sykling i fjellet ved Bjorli en sommerdag.',                wpField: 'biking_image',         placeholder: false },
  // Family / low-threshold summer. Repointed from fishing-lake → bassen
  // (kids water-activity area) so the variable matches its editorial use
  // on summer family cards. Tag: FAMILY / SUMMER. TEMPORARY FALLBACK
  // until a true "family on a short trail / pumptrack" photo exists.
  familySummer:   { src: sm_water,         alt: 'Vannaktivitet i basseng på Bjorli — familievennlig sommerstopp.', wpField: 'family_summer_image',  placeholder: false },

  // ── GETTING HERE / PRACTICAL ──────────────────────────────────────────
  gettingHere:    { src: x_destSign,      alt: 'Velkomstskilt og fjellutsikt – ankomst til Bjorli.',        wpField: 'getting_here_image',   placeholder: false },

  // ── EXTRAS ────────────────────────────────────────────────────────────
  topStation:     { src: l_topStation,    alt: 'Toppstasjonen for stolheisen på Bjorli i vinterlys.',       wpField: 'top_station_image',    placeholder: false },
  mountainTop:    { src: u_panorama,      alt: 'Skiere i høyfjellspanorama på Bjorli.',                     wpField: 'mountain_top_image',   placeholder: false },
  powder:         { src: s_carvingRed,    alt: 'Skikjører i fart nedover bakken på Bjorli.',                wpField: 'powder_image',         placeholder: false },
  snowboard:      { src: s_snowpark,      alt: 'Snowpark med rail og hopp på Bjorli.',                      wpField: 'snowboard_image',      placeholder: false },
  eveningLift:    { src: l_liftValley,    alt: 'Stolheisen med dalutsikt på Bjorli i vinterlys.',           wpField: 'evening_lift_image',   placeholder: false },
  resortEntrance: { src: l_fjellheis,     alt: 'Fjellheisen og åpent vinterlandskap ved Bjorli.',           wpField: 'resort_entrance_image', placeholder: false },
  parking:        { src: p_sign,          alt: 'Velkomstskilt på Bjorli – praktisk informasjon.',           wpField: 'parking_image',        placeholder: false },
  dish:           { src: f_dish,          alt: 'Servering fra restaurant på Bjorli.',                       wpField: 'dish_image',           placeholder: false },
  restaurantEvening: { src: r_heiskroa,   alt: 'Afterski-stemning ved bunnstasjonen på Bjorli.',            wpField: 'restaurant_evening_image', placeholder: false },

  // ── ADDITIONAL REAL PHOTOS available for future sections ──────────────
  bjorliSign:    { src: p_signAlt,        alt: 'Bjorli destinasjonsskilt.',                                  wpField: 'bjorli_sign_image',    placeholder: false },
  pisteMap:      { src: p_pisteMap,       alt: 'Løypekart for Bjorli Skisenter.',                            wpField: 'piste_map_image',      placeholder: false },
  flyFishing:    { src: s_flyFishing,     alt: 'Fluefiske i en fjellelv nær Bjorli.',                        wpField: 'fly_fishing_image',    placeholder: false },
  riverFishing:  { src: s_fishingRiver,   alt: 'Fiske i en fjellelv nær Bjorli.',                            wpField: 'river_fishing_image',  placeholder: false },
  eventFlying:   { src: e_summerTrail,    alt: 'Stisykling i fjellandskap ved Bjorli sensommer.',            wpField: 'event_flying_image',   placeholder: false },
  eventEaster:   { src: f_familyNord,     alt: 'Familie i Nordløypa på Bjorli – påskestemning.',             wpField: 'event_easter_image',   placeholder: false },
  moodScenic:    { src: x_skiersValley,   alt: 'Skiere i portrett med dalutsikt på Bjorli.',                 wpField: 'mood_scenic_image',    placeholder: false },

  // ── HERO BANK (available, not on live homepage by default) ────────────
  heroPanoramaWide: { src: h_panoramaWide, alt: 'Vidt vinterpanorama over skiområdet på Bjorli.',           wpField: 'hero_panorama_wide_image', placeholder: false },
  heroGroupWide:    { src: h_groupWide,    alt: 'Gruppe skiere i fjellpanorama på Bjorli.',                 wpField: 'hero_group_wide_image',    placeholder: false },
  heroLift:         { src: h_liftHero,     alt: 'Skiheis i høyfjellet på Bjorli.',                          wpField: 'hero_lift_image',          placeholder: false },
  heroCarving:      { src: h_carvingHero,  alt: 'Carving skikjører i action på Bjorli.',                    wpField: 'hero_carving_image',       placeholder: false },

  // Additional bank photos for use on subpages.
  liftChairView:    { src: l_chairView,    alt: 'Utsikt fra stolheisen mot snødekte fjell på Bjorli.',      wpField: 'lift_chair_view_image',    placeholder: false },
  liftChairOverview:{ src: l_chairOverview,alt: 'Stolheis og bakkeoversikt på Bjorli.',                     wpField: 'lift_chair_overview_image', placeholder: false },
  signMountain:     { src: u_signMountain, alt: 'Fjellutsikt med skiere og Nordløypa-skilt på Bjorli.',     wpField: 'sign_mountain_image',      placeholder: false },
  carvingClose:     { src: s_carvingClose, alt: 'Nærbilde av carving-skikjører i oransje på Bjorli.',       wpField: 'carving_close_image',      placeholder: false },
  carvingCloseAlt:  { src: s_carvingClose2,alt: 'Skiaction i oransje på Bjorli.',                           wpField: 'carving_close_alt_image',  placeholder: false },
  skiDescent:       { src: s_skiDescent,   alt: 'Ski-nedfart med fjellutsikt på Bjorli.',                   wpField: 'ski_descent_image',        placeholder: false },
  kidsView:         { src: f_kidView,      alt: 'Barn på ski med fjellutsikt på Bjorli.',                   wpField: 'kids_view_image',          placeholder: false },
  summerWater:      { src: sm_water,       alt: 'Vannaktivitet i basseng på Bjorli om sommeren.',           wpField: 'summer_water_image',       placeholder: false },
  // SUMMER-SAFE / NATURE — calm fishing-lake landscape. Used on summer
  // pages as a nature/landscape stand-in when no dedicated hiking or
  // wide-landscape photo is available. Not a hero candidate.
  fishingLake:      { src: s_fishingLake,  alt: 'Stille fjellvann nær Bjorli — sommerlandskap.',            wpField: 'fishing_lake_image',       placeholder: false },
} satisfies Record<string, BjorliImage>;

/*
 * Image QA notes (summer experience)
 * ──────────────────────────────────────────────────────────────────────
 *  SUMMER-SAFE  : heroSummer, summer, hiking (→ s_homeSummer landscape),
 *                 biking, familySummer (bassen), summerWater, fishingLake,
 *                 flyFishing, riverFishing, eventFlying (sensommer trail),
 *                 tipTrain (Raumabanen river valley), dish.
 *  WINTER-ONLY  : heroWinter, skiCenter, skiSlopes, liftArea, snowConditions,
 *                 skiSchool, skiRental, crossCountry, cabinEvening,
 *                 accommodation (snowy Vetlegrenda), foodDrink (Heiskroa
 *                 winter), event/news/tipPlanning/tipFamily, mountainTop,
 *                 powder, snowboard, eveningLift, resortEntrance, parking,
 *                 restaurantEvening, bjorliSign, pisteMap, eventEaster,
 *                 moodScenic, signMountain, all hero* / liftChair* / kidsView /
 *                 carving* / skiDescent. Never use on summer pages.
 *  HERO-ONLY    : heroSummer is the canonical /sommer hero. Do NOT reuse
 *                 in cards or content sections on the same page.
 *  LOGO / CROP  : (none currently in this registry — LOGO bank files are
 *                 intentionally not imported. If added, document crop here.)
 */

export type ImageKey = keyof typeof images;

/**
 * Strict summer image groups.
 * ──────────────────────────────────────────────────────────────────────
 * Hard rule: nothing in these arrays may contain visible snow, ski
 * slopes, lifts, alpine skiers, winter terraces or snow-covered cabins.
 * Use these arrays — not the flat `images` map — when picking imagery
 * for any summer page, summer card, summer teaser or related-content
 * section. If you need a summer image and none of these arrays applies,
 * leave the image slot empty (text-only card) rather than reaching for
 * a winter photo.
 *
 * Hero photo (`heroSummer`) is intentionally excluded from the card
 * groups so it cannot be repeated on the same page as the page hero.
 */
export const summerHeroImages       = [images.heroSummer] as const;
export const summerHikingImages     = [images.hiking, images.fishingLake] as const; // TODO: upload true hiker/trail photo
export const summerCyclingImages    = [images.biking] as const;
export const summerFishingImages    = [images.flyFishing, images.riverFishing] as const;
export const summerFamilyImages     = [images.familySummer, images.summerWater] as const; // bassen / kids water area
// NOTE: `eventFlying` (alt: "Stisykling i fjellandskap") is a CYCLING
// photo and must NOT be used for Nature/Utsikt sections per editorial
// rule (no cycling image for nature). `fishingLake` is a calm lake
// landscape — acceptable as a quiet nature stand-in but never as a
// hiking image. TODO: upload a true green panorama/landscape photo.
export const summerNatureImages     = [images.fishingLake] as const;
export const summerDaytripImages    = [images.tipTrain] as const; // Raumabanen river valley
export const summerAccommodationImages: readonly BjorliImage[] = []; // TODO: upload green-season cabin/exterior photo
export const summerFoodDrinkImages  = [images.dish] as const; // TEMPORARY FALLBACK — TODO: outdoor terrace/café photo

/** All summer-safe images, deduped — for QA and audit purposes. */
export const summerImagePool: readonly BjorliImage[] = [
  ...summerHeroImages,
  ...summerHikingImages,
  ...summerCyclingImages,
  ...summerFishingImages,
  ...summerFamilyImages,
  ...summerNatureImages,
  ...summerDaytripImages,
  ...summerAccommodationImages,
  ...summerFoodDrinkImages,
];
