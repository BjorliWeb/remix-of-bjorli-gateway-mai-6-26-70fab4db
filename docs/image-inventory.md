# Bjorli image inventory

Audit of every image asset shipped in this repo, plus where it is referenced in code.
No files were moved, deleted, or replaced — this is a documentation-only audit.

## Summary

- Total image files under `src/assets/`: **231**
  - `src/assets/hero-winter.jpg` (1)
  - `src/assets/bjorli-logo.jpeg` (1)
  - `photos/01_winter_ski_resort/` (16)
  - `photos/02_summer_destination/` (6)
  - `photos/03_accommodation/` (3)
  - `photos/04_food_restaurant/` (1)
  - `photos/05_practical_facilities/` (3)
  - `photos/06_events_atmosphere/` (172)
- `/public/`: only `favicon.ico` and `placeholder.svg` (no photo assets).
- `/public/images/`: does not exist.
- Locale files (`src/i18n/locales/*.ts`): no hardcoded image URLs — all imagery flows through `src/lib/images.ts` and `src/lib/cms/mockAdapter.ts`.
- Central registry: `src/lib/images.ts` exposes ~30 named slots; only those entries are actually rendered today. The remaining ~200 files in `photos/06_events_atmosphere/` are an **un-curated image bank** — not currently referenced.

### Reference map (where the registry slots are consumed)

| Registry key (`images.*`) | Consumed by |
|---|---|
| `heroWinter` | `src/lib/cms/subpages.ts`, `src/lib/cms/mockAdapter.ts`, `src/pages/SkiHolidayNorway.tsx` (also `hero-winter.jpg` directly imported by `Activities`, `Contact`, `ContentDetailPage`, `Events`, `GettingHere`, `Livecams`, `News`, `OpeningHours`, `PracticalInfo`, `SkiCenter`, `SkiRental`, `Tips`, `WeatherWebcams`) |
| `heroSummer` | `mockAdapter.ts` (summer hero) |
| `skiCenter` | `SkiHolidayNorway.tsx` |
| `skiSchool` | `SkiSchool.tsx`, `mockAdapter.ts`, `SkiHolidayNorway.tsx` |
| `crossCountry` | `mockAdapter.ts`, `subpages.ts` |
| `accommodation` | `Accommodation.tsx`, `mockAdapter.ts` |
| `cabinEvening` | `mockAdapter.ts` |
| `foodDrink` | `FoodDrink.tsx`, `mockAdapter.ts` |
| `event` | `mockAdapter.ts` (concert/event card) |
| `tipPlanning`, `tipTrain`, `tipFamily` | `mockAdapter.ts`, `subpages.ts` |
| `summer`, `hiking`, `biking`, `familySummer` | `mockAdapter.ts`, `subpages.ts` |
| All remaining keys (`skiSlopes`, `liftArea`, `snowConditions`, `skiRental`, `topStation`, `mountainTop`, `powder`, `snowboard`, `eveningLift`, `resortEntrance`, `parking`, `dish`, `restaurantEvening`, `news`, `gettingHere`, `bjorliSign`, `pisteMap`, `flyFishing`, `riverFishing`, `eventFlying`, `eventEaster`, `moodScenic`) | Defined in `src/lib/images.ts` but **not currently rendered** — available for future sections |

---

## Inventory table

Legend
- **Editorial-grade?** Y = suitable for premium editorial / hero / large card use. N = not suitable (poster, screenshot, low-res, low-light, weak composition). M = mid — usable as supporting/secondary imagery only.
- **Text in image?** Y = baked-in typography, prices, dates, logos, opening-hours posters, etc. N = clean photography.
- **Avoid on homepage?** Y if it is a poster/social graphic, screenshot, illustration, logo, map, or otherwise off-brand for the cinematic top of bjorli.no.

### Brand & system

| Path | Filename | Used in | Section / component | Category | Editorial-grade? | Text in image? | Avoid on homepage? | Suggested best-use location |
|---|---|---|---|---|---|---|---|---|
| `src/assets/bjorli-logo.jpeg` | bjorli-logo.jpeg | `src/components/Navbar.tsx`, `src/components/Footer.tsx` | Top navbar + footer brand mark | logo | N (system asset) | Y (wordmark) | Y | Keep as navbar/footer logo only. Do not use as a content image. |
| `public/favicon.ico` | favicon.ico | `index.html` | Browser tab icon | icon | N | N | Y | Tab/PWA icon only. |
| `public/placeholder.svg` | placeholder.svg | shadcn fallback | placeholder | placeholder | N | N | Y | Dev-only placeholder. Should never reach production cards. |

### Hero

| Path | Filename | Used in | Section / component | Category | Editorial-grade? | Text in image? | Avoid on homepage? | Suggested best-use location |
|---|---|---|---|---|---|---|---|---|
| `src/assets/hero-winter.jpg` | hero-winter.jpg | `src/lib/images.ts` (`heroWinter`), 13 page files (Activities, Contact, ContentDetailPage, Events, GettingHere, Livecams, News, OpeningHours, PracticalInfo, SkiCenter, SkiRental, Tips, WeatherWebcams) | Homepage cinematic hero + every secondary page hero | hero / winter | Y | N | N (this IS the homepage hero) | Keep as primary winter hero across the site. |

### `photos/01_winter_ski_resort/` — 16 files

| Path | Filename | Used in | Section / component | Category | Editorial-grade? | Text in image? | Avoid on homepage? | Suggested best-use location |
|---|---|---|---|---|---|---|---|---|
| `src/assets/photos/01_winter_ski_resort/bjorli-vinter-skisenter-036.jpg` | …-036.jpg | `images.skiCenter` | Ski center cards (`SkiHolidayNorway`) | ski / winter | Y | N | N | Keep as ski-center thumbnail/card. |
| `…/bjorli-vinter-skisenter-049.jpg` | …-049.jpg | `images.resortEntrance` (defined, unused) | — | ski / winter | M | N | N | Practical info / "Getting to the resort" supporting image. |
| `…/bjorli-vinter-skisenter-055.jpg` | …-055.jpg | `images.crossCountry`, `images.gettingHere` | Cross-country teasers, getting-here page | winter | Y | N | N | Cross-country and travel sections. |
| `…/bjorli-vinter-skisenter-084.jpg` | …-084.jpg | `images.powder` (defined, unused) | — | ski / winter | Y | N | N | "Powder days" / snow-report editorial card. |
| `…/bjorli-vinter-skisenter-bjorliski2.jpg` | bjorliski2.jpg | imported but not exposed via `images` | — | ski / winter | M | N | N | Ski center secondary gallery. |
| `…/bjorli-vinter-skisenter-budderstolheis.jpg` | budderstolheis.jpg | imported, not exposed | — | ski / winter | M | N | N | Lift detail in ski-center page. |
| `…/bjorli-vinter-skisenter-fjellheis.jpg` | fjellheis.jpg | imported, not exposed | — | ski / winter | M | N | N | Lift gallery on ski-center page. |
| `…/bjorli-vinter-skisenter-skipass-7759d89a01-1.jpg` | skipass-7759d89a01-1.jpg | `images.skiRental` (defined, unused) | — | ski | M | N | N | Ski-rental / lift-pass page. |
| `…/bjorli-vinter-skisenter-snokanon-scaled.jpg` | snokanon-scaled.jpg | `images.snowConditions` (defined, unused) | — | winter / snow | Y | N | N | "Snow safety / snowmaking" editorial. |
| `…/bjorli-vinter-skisenter-snowboard.jpg` | snowboard.jpg | `images.snowboard` (defined, unused) | — | ski | Y | N | N | Snowboard section / freestyle card. |
| `…/bjorli-vinter-skisenter-stolheis3.jpg` | stolheis3.jpg | `images.liftArea` (defined, unused) | — | ski / winter | Y | N | N | Lifts overview card. |
| `…/bjorli-vinter-skisenter-stolheisen2.jpg` | stolheisen2.jpg | `images.eveningLift` (defined, unused) | — | ski / winter | M | N | N | Secondary lift imagery. |
| `…/bjorli-vinter-skisenter-toppstasjon.jpg` | toppstasjon.jpg | `images.topStation` (defined, unused) | — | winter / panorama | Y | N | N | Top-station / summit card. |
| `…/bjorli-vinter-skisenter-web-ljosbakken-50-6df1981c1c.jpg` | web-ljosbakken-50-…jpg | `images.skiSlopes` (defined, unused) | — | ski / winter | Y | N | N | Groomed-slope hero card. |

### `photos/02_summer_destination/` — 6 files

| Path | Filename | Used in | Section / component | Category | Editorial-grade? | Text in image? | Avoid on homepage? | Suggested best-use location |
|---|---|---|---|---|---|---|---|---|
| `…/bjorli-sommer-destinasjon-fiskeilesja-d91ae3c817.jpg` | fiskeilesja-…jpg | `images.familySummer` | Summer activities | summer / family | Y | N | N (winter homepage); use on summer homepage | Family-summer card, Sommer page. |
| `…/bjorli-sommer-destinasjon-fiskelv-9210bd8a45.jpg` | fiskelv-…jpg | `images.riverFishing` (defined, unused) | — | summer | Y | N | N | Fishing subpage. |
| `…/bjorli-sommer-destinasjon-fluefiske-aebb0e82ea.jpg` | fluefiske-…jpg | `images.hiking`, `images.flyFishing` | Summer activities | summer | Y | N | N | Fly-fishing / summer activities. |
| `…/bjorli-sommer-destinasjon-home-summer-a32c838736.jpg` | home-summer-…jpg | `images.heroSummer`, `images.summer` | Summer hero & teaser | hero / summer | Y | N | OK only as **summer** homepage hero | Summer homepage hero, summer teaser card on winter homepage. |
| `…/bjorli-sommer-destinasjon-large-sykkelilesja-e6a70b0e8d.jpg` | large-sykkelilesja-…jpg | `images.biking` | Summer activities | summer | Y | N | N | Biking / Sykling subpage. |

### `photos/03_accommodation/` — 3 files

| Path | Filename | Used in | Section / component | Category | Editorial-grade? | Text in image? | Avoid on homepage? | Suggested best-use location |
|---|---|---|---|---|---|---|---|---|
| `…/bjorli-overnatting-hytte-vetlegrenda-fra-vg-10-og-mot-skisen.jpg` | vetlegrenda-…jpg | `images.accommodation` | Accommodation page hero card | accommodation | Y | N | N | Keep as accommodation hero. |

### `photos/04_food_restaurant/` — 1 file

| Path | Filename | Used in | Section / component | Category | Editorial-grade? | Text in image? | Avoid on homepage? | Suggested best-use location |
|---|---|---|---|---|---|---|---|---|
| `…/bjorli-restaurant-mat-mattisolavbjokne-2-20410b6b4a.jpg` | mattisolavbjokne-2-…jpg | `images.dish` (defined, unused) | — | food | Y | N | N | Food/Drink page. **Note**: `images.foodDrink` currently substitutes `e_event2` (a cabin interior) because no other restaurant interiors exist in the bank. |

### `photos/05_practical_facilities/` — 3 files

| Path | Filename | Used in | Section / component | Category | Editorial-grade? | Text in image? | Avoid on homepage? | Suggested best-use location |
|---|---|---|---|---|---|---|---|---|
| `…/bjorli-praktisk-info-bjorliskilt.jpg` | bjorliskilt.jpg | `images.parking` (defined, unused) | — | practical | M | Y (sign reads "Bjorli") | Y | Practical-info / parking page. |
| `…/bjorli-praktisk-info-bjorliskiltet.jpg` | bjorliskiltet.jpg | `images.bjorliSign` (defined, unused) | — | practical | M | Y (welcome sign) | Y | Welcome / arrival section. |
| `…/bjorli-praktisk-info-loypekart-40895db20c-1.jpg` | loypekart-…jpg | `images.pisteMap` (defined, unused) | — | map / poster | N (it is a map graphic) | Y | Y | Piste-map page only. |

### `photos/06_events_atmosphere/` — 172 files

Currently exposed via `src/lib/images.ts` (10 of 172):

| Path | Filename | Used in | Section / component | Category | Editorial-grade? | Text in image? | Avoid on homepage? | Suggested best-use location |
|---|---|---|---|---|---|---|---|---|
| `…/bjorli-destinasjon-stemning-031.jpg` | …-031.jpg | `images.news` | News card | event / atmosphere | Y | N | N | News listing card. |
| `…/bjorli-destinasjon-stemning-080.jpg` | …-080.jpg | `images.tipPlanning` | Tips card | event / atmosphere | Y | N | N | Tips / planning card. |
| `…/bjorli-destinasjon-stemning-112.jpg` | …-112.jpg | `images.moodScenic` (defined, unused) | — | atmosphere | Y | N | N | Editorial mood card. |
| `…/bjorli-destinasjon-stemning-2022-1020-bjorli-5-hdr-1-scaled.jpg` | 2022-1020-bjorli-5-hdr-1-scaled.jpg | `images.foodDrink`, `images.restaurantEvening`, `images.eventEaster` | Food/Drink, restaurant evening, Easter event | atmosphere / interior | Y | N | N | Cosy interior — Food & Drink, accommodation hero. |
| `…/bjorli-destinasjon-stemning-bjorlimountainlodge-8cafc89cba-4.jpg` | bjorlimountainlodge-…jpg | `images.cabinEvening` | Accommodation evening | accommodation | Y | N | N | Mountain Lodge night card. |
| `…/bjorli-destinasjon-stemning-brendjordsbyen-d9042f2428.jpg` | brendjordsbyen-…jpg | imported (`a_brendjordsbyen`) but not exposed | — | accommodation | Y | N | N | Cabin village card on accommodation page. |
| `…/bjorli-destinasjon-stemning-dsc-8636-2-min-7debf59814-scaled.jpg` | dsc-8636-2-min-…jpg | `images.eventFlying` (defined, unused) | — | summer / event | Y | N | N | Mountain biking / late-summer card. |
| `…/bjorli-destinasjon-stemning-glad-emma-img-4203-scaled.jpg` | glad-emma-img-4203-scaled.jpg | `images.tipFamily` | Tips card | family / winter | Y | N | N | Family tips card. |
| `…/bjorli-destinasjon-stemning-img-9860-scaled.jpg` | img-9860-scaled.jpg | `images.event` | Event card on homepage | event / winter | Y | N | N | Events listing hero / homepage events strip. |
| `…/bjorli-destinasjon-stemning-large-goldentrain3-6dd14cfc26.jpg` | large-goldentrain3-…jpg | `images.tipTrain` | Tips card | tips / travel | Y | N | N | "Take the train" tip card, GettingHere page. |
| `…/bjorli-destinasjon-stemning-lift-chair-look-ahead-scaled.jpg` | lift-chair-look-ahead-scaled.jpg | `images.skiSchool` | Ski school card | ski / family | Y | N | N | Ski school card. |

The remaining **161 files** in `photos/06_events_atmosphere/` are an **un-curated bank** — none are referenced anywhere in code today. Below they are grouped by the category inferred from filename + file pattern. Spot-check before promoting any to a homepage slot.

#### Likely poster / social-graphic / screenshot — **avoid on homepage**

These have filenames or patterns that strongly suggest baked-in text (campaigns, opening hours, price lists, weekly programs, Instagram exports, screenshots, illustrations, logos):

| Filename | Why flagged | Text in image? | Avoid on homepage? | Best use |
|---|---|---|---|---|
| `bjorli-destinasjon-stemning-bjorlikampamje251.jpg` | "kampanje" = campaign poster | Y | Y | Promo banner only |
| `bjorli-destinasjon-stemning-bjorlimap.jpg`, `…-bjorlimap2.jpg`, `…-bjorlip1p2.jpg`, `…-bjorli-masterplan-…jpg` | Map / masterplan graphics | Y | Y | Map / planning page |
| `bjorli-destinasjon-stemning-bjorli-overview-mars7-scaled.jpg` | Overview map/poster | Y | Y | Map page |
| `bjorli-destinasjon-stemning-illustrasjon-b-jorlihaugen-…jpg`, `…-illustrasjon-f-jellandsbyen-…jpg` | Architectural illustrations | Y (labels) | Y | Project / development pages |
| `bjorli-destinasjon-stemning-cropped-main-logo-…jpg`, `…-main-logo-1-…jpg`, `…-novasol-logo-primary-scaled.jpg`, `…-novasol-n31358-bjorli.jpg` | Logos / partner logos | Y | Y | Partner logo strip only |
| `bjorli-destinasjon-stemning-earlybirdracer.jpg` | Race / event poster | Y | Y | Event page only |
| `bjorli-destinasjon-stemning-6-februar-e1772556153886.jpg` | Date-stamped poster | Y | Y | Event page only |
| `bjorli-destinasjon-stemning-skjermbilde-2022-05-09-…jpg` and 7 other `skjermbilde-*` | "Skjermbilde" = screenshot | likely Y | Y | Internal reference only |
| `bjorli-destinasjon-stemning-242708811-…jpg`, `…-309377084-…jpg`, `…-326968486-…jpg`, `…-448704798-…jpg`, `…-448732803-…jpg`, `…-473116316-…jpg`, `…-473749706-…jpg`, `…-568376878-…jpg`, `…-588499493-…jpg`, `…-653707979-…jpg`, `…-656130621-…jpg`, `…-656216415-…jpg`, `…-658083403-…jpg` | Instagram numeric IDs — likely social posts (often with overlay text) | likely Y | Y | Social grid only after manual review |
| `bjorli-destinasjon-stemning-att-9inoxekvnsa9kjc3mt5vlgkambxk.jpg`, `…-att-kejk9drtww0bje5z5uwwqcezltr1.jpg`, `…-att-vknn0r9giatew5jnjrv86nalyxru.jpg` | Email-attachment exports | unknown | Y until reviewed | Manual review required |
| `bjorli-destinasjon-stemning-woocommerce-placeholder0.jpg` | E-commerce placeholder | N (but blank) | Y | Never use |
| `bjorli-destinasjon-stemning-latest-hd.jpg`, `…-thumbnail-img-6839.jpg`, `…-view-recent-photos-2.jpg`, `…-view-recent-photos-scaled-e17697.jpg` | Generic thumbnail / "recent photos" exports | unknown | Y until reviewed | Manual review required |
| `bjorli-destinasjon-stemning-04ca68f3-…jpg`, `…-611cc836-…jpg`, `…-9b42d5d0-…jpg`, `…-aebdd8ad-…jpg` | UUID filenames — unknown provenance | unknown | Y until reviewed | Manual review required |

#### Likely real photography — candidates for editorial promotion

These look like genuine destination photography (lodges, mood, snow, summer, portraits). They are **not currently used**; review and curate before exposing through `images.ts`.

| Filename group | Inferred content | Suggested best-use |
|---|---|---|
| `bjorli-destinasjon-stemning-031` … `-264.jpg` (numeric, ~140 files; 031, 080, 112 already in registry) | Mixed atmosphere / mood / portraits / winter / summer | News, tips, mood strips, listing thumbnails |
| `…-bjokne-6bac543b15.jpg`, `…-bjorli-0806-132-korr-3000-cf8a55.jpg`, `…-bjorli-486c1f5673.jpg`, `…-bjorli-ce4a3b58cb-1.jpg` | Branded/destination edits | Editorial cards |
| `…-bjorlimountainlodge-…jpg`, `…-brendjordsbyen-…jpg`, `…-brendjordsbyen2-…jpg`, `…-countryside-lodge-home-1.jpg`, `…-mountain-chalet-home-1.jpg`, `…-hlbjorli-dfdacd1254.jpg`, `…-medium-hlbjorli1-…jpg` | Lodging exteriors / interiors | Accommodation page |
| `…-bunnstasjon.jpg` | Lift base station | Ski-center page |
| `…-dsc-8636-…`, `…-dsc-8758-…`, `…-dsc08114-…`, `…-dsc08159-…`, `…-fullsizerender-…`, `…-image-scaled.jpg`, `…-image0-scaled.jpg`, `…-img-1270-…` … `…-img-9860-…` | Camera-original photography | Candidate for editorial cards after review |
| `…-golden-train-ed3733b89f.jpg`, `…-large-goldentrain3-…jpg` | Rauma Line train | "Take the train" tip |
| `…-glad-emma-img-4203-scaled.jpg`, `…-kolstad-8b28fa7c28.jpg`, `…-tussheim-9f060cf45a.jpg` | Portraits / people | Family / community stories |
| `…-laksirauma-c65e952d1a.jpg`, `…-stvmlaks-d0fc29952d.jpg`, `…-large-viggaranabue1-…jpg`, `…-raanaabue3-…jpg`, `…-viggaranabue2-…jpg`, `…-lesja1-d1edb0e0b5.jpg`, `…-large-lesjamuseum-…jpg` | Surroundings (Rauma, Lesja, river) | Region / "Around Bjorli" pages |
| `…-bjorli-vcamping-61-…jpg` | Camping | Summer / accommodation |
| `…-medium-26338ed0ba…jpg`, `…-medium-d02eeda377…jpg` | Mid-res atmosphere | Listing thumbnails |

---

## Recommendations (no changes performed)

1. **Homepage safety list**: only use entries currently mapped in `src/lib/images.ts` whose row above is marked **Editorial-grade Y / Text N / Avoid N**.
2. **Quarantine candidates**: every file under "Likely poster / social-graphic / screenshot" should be moved out of the editorial bank (e.g. into `photos/_posters/`) so it cannot be picked accidentally.
3. **Folder hygiene**: `photos/06_events_atmosphere/` is mis-named — it actually contains lodging, portraits, maps, posters, and atmosphere mixed together. A future cleanup should split this into `accommodation/`, `people/`, `posters/`, `social/`, `mood/`.
4. **Near-duplicates**: the two `orionsbelte3-low-*.jpg` files appear to be near-duplicates; pick one.
