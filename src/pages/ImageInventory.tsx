/**
 * Internal image library — /image-inventory
 *
 * Temporary page for editorial review. NOT linked from public navigation.
 * Lists every image asset in src/assets via import.meta.glob, infers
 * category, surfaces current usage from src/lib/images.ts, and flags
 * posters / social graphics / screenshots / low-quality assets.
 *
 * Safe to delete later — no other file imports from here.
 */
import { useMemo, useState } from 'react';
import { images as registry } from '@/lib/images';

// Eagerly import every image under src/assets so Vite bundles them and we
// can render real thumbnails without manual imports.
const assetModules = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

// Reverse-index the registry so we can show "used as: heroWinter, news, …"
// for any given source URL.
const registryByUrl = Object.entries(registry).reduce<Record<string, string[]>>(
  (acc, [key, entry]) => {
    const url = entry.src;
    if (!acc[url]) acc[url] = [];
    acc[url].push(key);
    return acc;
  },
  {},
);

// ---------------------------------------------------------------------------
// Bjorli image bank — logical content structure (NOT a public route).
// Folders live under src/assets/photos/bank/<NN-name>/. Empty categories are
// shown so editors can see where new uploads should land.
// ---------------------------------------------------------------------------

type BankSlug =
  | '01-hero' | '02-ski' | '03-family' | '04-servering' | '05-heis'
  | '06-utsikt' | '07-underside' | '08-vinter' | '09-sommer'
  | '10-sykkel' | '11-tur' | '12-fiske' | '13-natur';

interface BankCategoryDef {
  slug: BankSlug;
  label: string;
  description: string;
  pageSuggestions: string[];
}

const BANK_CATEGORIES: BankCategoryDef[] = [
  { slug: '01-hero', label: 'Hero', description: 'Strong, wide, calm — for hero use.',
    pageSuggestions: ['Homepage', 'Vinter / Sommer landing', 'Top-level destination pages', 'Campaign banners'] },
  { slug: '02-ski', label: 'Ski / alpint', description: 'Alpine skiing, slopes, ski action.',
    pageSuggestions: ['Ski Center', 'Vinter', 'Heiskort', 'Ski School'] },
  { slug: '03-family', label: 'Familie', description: 'Children, families, groups, ski school.',
    pageSuggestions: ['Familie', 'Ski School', 'Activities'] },
  { slug: '04-servering', label: 'Servering', description: 'Restaurant, terrace, food, drinks, après-ski.',
    pageSuggestions: ['Food & Drink', 'After-ski sections', 'Practical info'] },
  { slug: '05-heis', label: 'Heis & infrastruktur', description: 'Lifts, base station, lift area, infrastructure.',
    pageSuggestions: ['Ski Center', 'Heiskort', 'Practical info', 'Loypekart'] },
  { slug: '06-utsikt', label: 'Utsikt / panorama', description: 'Mountain views and panoramas.',
    pageSuggestions: ['Vinter', 'Sommer', 'Destination pages', 'Editorial cards'] },
  { slug: '07-underside', label: 'Underside / støttebilder', description: 'Useful supporting images for subpages.',
    pageSuggestions: ['Subpage cards', 'Article blocks', 'Guides', 'Tips'] },
  { slug: '08-vinter', label: 'Vinterstemning', description: 'General winter atmosphere.',
    pageSuggestions: ['Vinter', 'News & tips', 'Snow conditions'] },
  { slug: '09-sommer', label: 'Sommer', description: 'Summer content.',
    pageSuggestions: ['Sommer', 'Activities', 'Family summer'] },
  { slug: '10-sykkel', label: 'Sykkel / pumptrack', description: 'Biking and pumptrack content.',
    pageSuggestions: ['Sykling', 'Sommer', 'Activities'] },
  { slug: '11-tur', label: 'Turer', description: 'Hiking and walking.',
    pageSuggestions: ['Fotturer', 'Sommer', 'Activities'] },
  { slug: '12-fiske', label: 'Fiske / vann', description: 'Fishing and water activities.',
    pageSuggestions: ['Activities', 'Sommer'] },
  { slug: '13-natur', label: 'Natur', description: 'Landscape, forest, river, nature.',
    pageSuggestions: ['Editorial backgrounds', 'About / destination intro', 'Atmosphere cards'] },
];

interface BankAsset {
  path: string;
  url: string;
  filename: string;
  slug: BankSlug;
  hasLogo: boolean;
  heroSuitability: 'Strong' | 'Candidate' | 'Possible' | 'No';
  recommendedUse: string;
  pageSuggestions: string[];
  notes: string[];
  inUseAs: string[];
}

function classifyBankAsset(path: string, url: string): BankAsset | null {
  const m = path.match(/\/bank\/([0-9]{2}-[a-z]+)\//);
  if (!m) return null;
  const slug = m[1] as BankSlug;
  const def = BANK_CATEGORIES.find((c) => c.slug === slug);
  if (!def) return null;
  const filename = path.split('/').pop() ?? path;
  const lower = filename.toLowerCase();
  const hasLogo = /logo/i.test(filename) && (filename.includes('LOGO') || lower.includes('logo-before-use') || lower.includes('crop-logo'));

  // Hero suitability heuristic from filename + folder
  let heroSuitability: BankAsset['heroSuitability'] = 'No';
  if (slug === '01-hero') {
    heroSuitability = lower.includes('candidate') ? 'Candidate' : 'Strong';
  } else if (lower.includes('hero-wide') || lower.includes('panorama') || lower.includes('hero')) {
    heroSuitability = lower.includes('candidate') ? 'Candidate' : 'Possible';
  } else if (lower.includes('wide') || lower.includes('overview') || lower.includes('open-landscape')) {
    heroSuitability = 'Possible';
  }
  // Logo'd images can never be heroes uncropped
  if (hasLogo && heroSuitability !== 'No') heroSuitability = 'Candidate';

  const notes: string[] = [];
  if (hasLogo) notes.push('LOGO — crop required before public use');
  if (lower.includes('candidate')) notes.push('Candidate — review against current hero');
  if (lower.includes('screenshot') || lower.includes('reference')) notes.push('Reference / screenshot — internal only');
  if (lower.includes('naerbilde') || lower.includes('closeup') || lower.includes('detail')) notes.push('Tight crop — weak as hero');
  if (lower.includes('portrait') || /-portrett/.test(lower)) notes.push('Portrait orientation');
  if (lower.includes('missing')) notes.push('Missing — download failed');

  // Recommended use sentence
  let recommendedUse = def.description;
  if (slug === '01-hero') recommendedUse = hasLogo
    ? 'Hero candidate — must be cropped to remove logo first.'
    : 'Hero — homepage, season landing, or major destination page.';
  else if (slug === '07-underside') recommendedUse = 'Subpage support image — cards, content blocks, guides.';

  return {
    path: path.replace(/^\//, ''),
    url,
    filename,
    slug,
    hasLogo,
    heroSuitability,
    recommendedUse,
    pageSuggestions: def.pageSuggestions,
    notes,
    inUseAs: registryByUrl[url] ?? [],
  };
}

const bankAssets: BankAsset[] = Object.entries(assetModules)
  .map(([path, url]) => classifyBankAsset(path, url))
  .filter((x): x is BankAsset => x !== null)
  .sort((a, b) => a.slug.localeCompare(b.slug) || a.filename.localeCompare(b.filename));

const bankBySlug: Record<BankSlug, BankAsset[]> = BANK_CATEGORIES.reduce(
  (acc, c) => { acc[c.slug] = []; return acc; },
  {} as Record<BankSlug, BankAsset[]>,
);
bankAssets.forEach((a) => bankBySlug[a.slug].push(a));

type Category =
  | 'hero'
  | 'winter'
  | 'summer'
  | 'accommodation'
  | 'food'
  | 'practical'
  | 'event'
  | 'atmosphere'
  | 'logo'
  | 'poster'
  | 'screenshot'
  | 'illustration'
  | 'map'
  | 'social'
  | 'unknown';

interface AssetRow {
  path: string;          // /src/assets/...
  url: string;           // bundled URL
  filename: string;
  folder: string;
  category: Category;
  usage: string[];       // registry keys
  recommended: string;
  warnings: string[];    // warning badges
}

const POSTER_HINTS = [
  'apningstider', 'kampanje', 'prisliste', 'nytt2526', 'masterplan',
  'tegnebrett', 'earlybirdracer', 'kan-du-sla', 'uke-', 'p1p2',
  'bjorlimap', 'overview-mars', 'pa-bjorli-2026',
];
const SOCIAL_HINTS = ['122156197', '122163529', '122171', '18142033', '18164164', '18197647', '18061215', '309377', '326968', '242708', '448704', '448732', '473116', '473749', '568376', '588499', '653707', '656130', '656216', '658083'];
const SCREENSHOT_HINTS = ['screenshot', 'skjermbilde', 'view-recent-photos', 'thumbnail-img-', 'latest-hd', 'fullsizerender'];
const LOGO_HINTS = ['logo', 'cropped-main-logo', 'novasol-logo'];
const MAP_HINTS = ['loypekart', 'bjorlimap', 'masterplan', 'piste'];
const ILLUSTRATION_HINTS = ['illustrasjon', 'illustrated-mou', 'tegnebrett'];
const PLACEHOLDER_HINTS = ['placeholder', 'woocommerce-placeholder'];
const LOW_RES_HINTS = ['-low-', 'medium-', 'thumbnail-'];
const STOCK_HINTS = ['ski-lift-4323750']; // pixabay-style numeric IDs

const has = (s: string, arr: string[]) => arr.some((h) => s.includes(h));

function inferCategory(path: string): Category {
  const f = path.toLowerCase();
  if (f.endsWith('hero-winter.jpg')) return 'hero';
  if (f.includes('bjorli-logo')) return 'logo';
  if (has(f, LOGO_HINTS)) return 'logo';
  if (has(f, SCREENSHOT_HINTS)) return 'screenshot';
  if (has(f, ILLUSTRATION_HINTS)) return 'illustration';
  if (has(f, MAP_HINTS)) return 'map';
  if (has(f, POSTER_HINTS)) return 'poster';
  if (has(f, SOCIAL_HINTS)) return 'social';
  if (f.includes('/01_winter_ski_resort/')) return 'winter';
  if (f.includes('/02_summer_destination/')) return 'summer';
  if (f.includes('/03_accommodation/')) return 'accommodation';
  if (f.includes('/04_food_restaurant/')) return 'food';
  if (f.includes('/05_practical_facilities/')) return 'practical';
  if (f.includes('/06_events_atmosphere/')) {
    if (f.includes('mountainlodge') || f.includes('brendjordsbyen') || f.includes('countryside-lodge') || f.includes('mountain-chalet') || f.includes('hlbjorli')) return 'accommodation';
    if (f.includes('event') || f.includes('paske') || f.includes('jul') || f.includes('konsert')) return 'event';
    return 'atmosphere';
  }
  return 'unknown';
}

function inferWarnings(path: string, category: Category): string[] {
  const f = path.toLowerCase();
  const w: string[] = [];
  if (category === 'poster') w.push('poster');
  if (category === 'social') w.push('social graphic');
  if (category === 'screenshot') w.push('screenshot');
  if (category === 'illustration') w.push('illustration');
  if (category === 'map') w.push('map graphic');
  if (category === 'logo' && !f.endsWith('bjorli-logo.jpeg')) w.push('logo asset');
  if (has(f, PLACEHOLDER_HINTS)) w.push('placeholder');
  if (has(f, LOW_RES_HINTS)) w.push('low-res variant');
  if (has(f, STOCK_HINTS)) w.push('possible stock');
  // Heuristic: filenames with embedded dates / years often baked-in text
  if (/\b20\d{2}\b/.test(f) && (category === 'poster' || category === 'social' || category === 'event')) {
    if (!w.includes('likely baked-in text')) w.push('likely baked-in text');
  }
  if (category === 'poster' || category === 'social' || category === 'screenshot' || category === 'illustration' || category === 'map') {
    if (!w.includes('avoid on homepage')) w.push('avoid on homepage');
  }
  return w;
}

function recommendUse(category: Category, warnings: string[]): string {
  if (warnings.includes('avoid on homepage')) {
    switch (category) {
      case 'poster': return 'Promo / campaign banner only (time-limited).';
      case 'social': return 'Social grid, after manual review.';
      case 'screenshot': return 'Internal reference only — do not publish.';
      case 'illustration': return 'Project / development pages.';
      case 'map': return 'Piste-map / planning page only.';
      case 'logo': return 'Partner logo strip.';
      default: return 'Manual review required.';
    }
  }
  switch (category) {
    case 'hero': return 'Homepage hero / large editorial covers.';
    case 'winter': return 'Ski-center, lifts, snow-condition cards.';
    case 'summer': return 'Sommer page, hiking/biking/fishing cards.';
    case 'accommodation': return 'Accommodation page, lodging cards.';
    case 'food': return 'Food & Drink page.';
    case 'practical': return 'Practical info / arrival page.';
    case 'event': return 'Events listing, event detail hero.';
    case 'atmosphere': return 'Editorial mood card, news/tips thumbnails.';
    case 'logo': return 'Navbar / footer brand mark.';
    default: return 'Review before assigning.';
  }
}

const allRows: AssetRow[] = Object.entries(assetModules)
  .map(([path, url]) => {
    const filename = path.split('/').pop() ?? path;
    const folder = path.replace('/src/assets/', '').split('/').slice(0, -1).join('/') || '(root)';
    const category = inferCategory(path);
    const warnings = inferWarnings(path, category);
    return {
      path: path.replace(/^\//, ''),
      url,
      filename,
      folder,
      category,
      usage: registryByUrl[url] ?? [],
      recommended: recommendUse(category, warnings),
      warnings,
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const CATEGORIES: ('all' | Category)[] = [
  'all', 'hero', 'winter', 'summer', 'accommodation', 'food', 'practical',
  'event', 'atmosphere', 'logo', 'poster', 'social', 'screenshot',
  'illustration', 'map', 'unknown',
];

const ImageInventory = () => {
  const [filter, setFilter] = useState<'all' | Category>('all');
  const [onlyWarnings, setOnlyWarnings] = useState(false);
  const [onlyUsed, setOnlyUsed] = useState(false);
  const [query, setQuery] = useState('');

  const rows = useMemo(() => {
    return allRows.filter((r) => {
      if (filter !== 'all' && r.category !== filter) return false;
      if (onlyWarnings && r.warnings.length === 0) return false;
      if (onlyUsed && r.usage.length === 0) return false;
      if (query && !r.path.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [filter, onlyWarnings, onlyUsed, query]);

  const counts = useMemo(() => {
    const total = allRows.length;
    const used = allRows.filter((r) => r.usage.length).length;
    const warned = allRows.filter((r) => r.warnings.length).length;
    return { total, used, warned };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-[1600px] px-4 py-10">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Internal · review only · not linked from navigation
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">
            Image inventory
          </h1>
          <p className="text-muted-foreground">
            {counts.total} assets · {counts.used} currently used · {counts.warned} flagged
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-3 mb-6 sticky top-2 z-10 bg-background/90 backdrop-blur p-3 rounded-lg border border-border">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search filename or path…"
            className="px-3 py-2 rounded-md border border-border bg-card text-sm w-64"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Category | 'all')}
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyWarnings} onChange={(e) => setOnlyWarnings(e.target.checked)} />
            Only flagged
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyUsed} onChange={(e) => setOnlyUsed(e.target.checked)} />
            Only currently used
          </label>
          <span className="text-sm text-muted-foreground ml-auto">
            Showing {rows.length} of {counts.total}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {rows.map((r) => (
            <article
              key={r.path}
              className="rounded-xl border border-border bg-card overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-muted">
                <img
                  src={r.url}
                  alt={r.filename}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  <span className="text-[10px] uppercase tracking-wider bg-background/90 text-foreground px-2 py-0.5 rounded">
                    {r.category}
                  </span>
                  {r.usage.length > 0 && (
                    <span className="text-[10px] uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      in use
                    </span>
                  )}
                </div>
                {r.warnings.length > 0 && (
                  <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    {r.warnings.map((w) => (
                      <span
                        key={w}
                        className="text-[10px] uppercase tracking-wider bg-destructive text-destructive-foreground px-2 py-0.5 rounded"
                      >
                        ⚠ {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2 text-sm">
                <div className="font-mono text-xs break-all text-foreground">{r.filename}</div>
                <div className="font-mono text-[11px] break-all text-muted-foreground">{r.path}</div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Used as: </span>
                  {r.usage.length > 0
                    ? <span className="text-foreground">{r.usage.join(', ')}</span>
                    : <span className="text-muted-foreground italic">unused</span>}
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Recommended: </span>
                  <span>{r.recommended}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {rows.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No assets match these filters.</p>
        )}
      </div>
    </div>
  );
};

export default ImageInventory;