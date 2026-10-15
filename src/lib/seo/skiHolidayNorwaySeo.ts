/**
 * Single source of truth for the "Ski Holiday in Norway" landing, which
 * ships in EN, DE, SV, DA and NL (no Norwegian version — it is aimed at
 * visitors from abroad).
 *
 * The slugs, titles and descriptions live here so the React page, the CMS
 * fixtures, `routeSeo.ts` / `cms/seo.ts` (and therefore SEOHead / PageMeta),
 * the language switcher, the sitemap and the build-time prerender all read
 * exactly the same values.
 *
 * Dependency-free on purpose: `scripts/prerender.ts` imports this at build
 * time under Node, so it must not pull in React, images or CMS code.
 */

export type SkiHolidayLocale = 'en' | 'de' | 'sv' | 'da' | 'nl';

export interface SkiHolidayPage {
  /** Bare slug, no locale prefix. */
  slug: string;
  /** Full path with locale prefix, no trailing slash. */
  path: string;
  title: string;
  description: string;
}

export const SKI_HOLIDAY_PAGES: Record<SkiHolidayLocale, SkiHolidayPage> = {
  en: {
    slug: 'ski-holiday-norway',
    path: '/en/ski-holiday-norway',
    title: 'Ski Holiday in Norway at Bjorli | Family Skiing & Cabins',
    description:
      'Plan a family ski holiday in Norway at Bjorli: alpine and cross-country skiing, ski school, ski hire and cabins. Ålesund Airport is around 2½ hours away by car.',
  },
  de: {
    slug: 'skiurlaub-norwegen',
    path: '/de/skiurlaub-norwegen',
    title: 'Skiurlaub in Norwegen in Bjorli | Familien-Skiurlaub & Hütten',
    description:
      'Planen Sie einen Familien-Skiurlaub in Norwegen in Bjorli: Alpinski und Langlauf, Skischule, Skiverleih und Hütten. Vom Flughafen Ålesund sind es rund 2½ Stunden mit dem Auto.',
  },
  sv: {
    slug: 'skidsemester-norge',
    path: '/sv/skidsemester-norge',
    title: 'Skidsemester i Norge i Bjorli | Familjeskidåkning & stugor',
    description:
      'Planera en skidsemester i Norge med familjen i Bjorli: utförs- och längdåkning, skidskola, skiduthyrning och stugor. Från Ålesunds flygplats tar det cirka 2,5 timmar med bil.',
  },
  da: {
    slug: 'skiferie-norge',
    path: '/da/skiferie-norge',
    title: 'Skiferie i Norge i Bjorli | Familieskiferie & hytter',
    description:
      'Planlæg en skiferie i Norge med familien i Bjorli: alpint og langrend, skiskole, skiudlejning og hytter. Fra Ålesund Lufthavn tager det omkring 2½ time i bil.',
  },
  nl: {
    slug: 'wintersport-noorwegen',
    path: '/nl/wintersport-noorwegen',
    title: 'Wintersport in Noorwegen in Bjorli | Skiën met het gezin',
    description:
      'Plan je wintersport in Noorwegen met het gezin in Bjorli: alpineskiën en langlaufen, skischool, skiverhuur en vakantiehuizen. Vanaf de luchthaven van Ålesund is het zo’n 2,5 uur rijden.',
  },
};

export const SKI_HOLIDAY_LOCALES = Object.keys(SKI_HOLIDAY_PAGES) as SkiHolidayLocale[];

/** Locale whose bare slug matches `slug` (e.g. 'skiurlaub-norwegen' → 'de'). */
export const skiHolidayLocaleForSlug = (slug: string): SkiHolidayLocale | null =>
  SKI_HOLIDAY_LOCALES.find((l) => SKI_HOLIDAY_PAGES[l].slug === slug) ?? null;

/** Path of the landing in `locale`, or null when there is no version. */
export const skiHolidayPathFor = (locale: string): string | null =>
  (SKI_HOLIDAY_PAGES as Record<string, SkiHolidayPage>)[locale]?.path ?? null;

// ── EN aliases kept for existing imports ─────────────────────────────
export const SKI_HOLIDAY_NORWAY_SLUG = SKI_HOLIDAY_PAGES.en.slug;
export const SKI_HOLIDAY_NORWAY_PATH = SKI_HOLIDAY_PAGES.en.path;
export const SKI_HOLIDAY_NORWAY_LOCALE = 'en' as const;
export const SKI_HOLIDAY_NORWAY_SEO = {
  title: SKI_HOLIDAY_PAGES.en.title,
  description: SKI_HOLIDAY_PAGES.en.description,
} as const;
