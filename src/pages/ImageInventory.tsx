/**
 * Internal image review dashboard — /image-inventory
 *
 * NOT linked from public navigation. For editors only.
 *
 * Features:
 *   - Auto-discovers every asset under src/assets via import.meta.glob
 *   - Classifies into Bjorli image-bank logical categories (01-hero … 13-natur)
 *     plus legacy/inferred categories (poster, screenshot, etc.)
 *   - Per-image editor state persisted in localStorage:
 *       flags, alt text, notes, replacement filename, category override
 *   - Selection + bulk actions
 *   - Filters, sort, exports (JSON + CSV), copy-cleanup-prompt
 *
 * No backend writes. Flags never delete files — only produce review lists.
 */
import { useEffect, useMemo, useState } from 'react';
import { images as registry } from '@/lib/images';

// ---------------------------------------------------------------------------
// Asset discovery
// ---------------------------------------------------------------------------

const assetModules = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const registryByUrl = Object.entries(registry).reduce<Record<string, { keys: string[]; alts: string[] }>>(
  (acc, [key, entry]) => {
    if (!acc[entry.src]) acc[entry.src] = { keys: [], alts: [] };
    acc[entry.src].keys.push(key);
    if (entry.alt) acc[entry.src].alts.push(entry.alt);
    return acc;
  },
  {},
);

// ---------------------------------------------------------------------------
// Bjorli image bank — logical content structure
// ---------------------------------------------------------------------------

type BankSlug =
  | '01-hero' | '02-ski' | '03-family' | '04-servering' | '05-heis'
  | '06-utsikt' | '07-underside' | '08-vinter' | '09-sommer'
  | '10-sykkel' | '11-tur' | '12-fiske' | '13-natur';

interface BankCategoryDef {
  slug: BankSlug;
  label: string;
  pageSuggestions: string[];
}

const BANK_CATEGORIES: BankCategoryDef[] = [
  { slug: '01-hero',      label: 'Hero',                  pageSuggestions: ['Homepage', 'Vinter / Sommer landing', 'Top-level destination', 'Campaign'] },
  { slug: '02-ski',       label: 'Ski / alpint',          pageSuggestions: ['Ski Center', 'Vinter', 'Heiskort', 'Ski School'] },
  { slug: '03-family',    label: 'Familie',               pageSuggestions: ['Familie', 'Ski School', 'Activities'] },
  { slug: '04-servering', label: 'Servering',             pageSuggestions: ['Food & Drink', 'After-ski', 'Practical info'] },
  { slug: '05-heis',      label: 'Heis & infrastruktur',  pageSuggestions: ['Ski Center', 'Heiskort', 'Practical info', 'Loypekart'] },
  { slug: '06-utsikt',    label: 'Utsikt / panorama',     pageSuggestions: ['Vinter', 'Sommer', 'Destination pages'] },
  { slug: '07-underside', label: 'Underside / støtte',    pageSuggestions: ['Subpage cards', 'Article blocks', 'Guides', 'Tips'] },
  { slug: '08-vinter',    label: 'Vinterstemning',        pageSuggestions: ['Vinter', 'News & tips', 'Snow conditions'] },
  { slug: '09-sommer',    label: 'Sommer',                pageSuggestions: ['Sommer', 'Activities', 'Family summer'] },
  { slug: '10-sykkel',    label: 'Sykkel / pumptrack',    pageSuggestions: ['Sykling', 'Sommer', 'Activities'] },
  { slug: '11-tur',       label: 'Turer',                 pageSuggestions: ['Fotturer', 'Sommer', 'Activities'] },
  { slug: '12-fiske',     label: 'Fiske / vann',          pageSuggestions: ['Activities', 'Sommer'] },
  { slug: '13-natur',     label: 'Natur',                 pageSuggestions: ['Editorial backgrounds', 'About / destination intro'] },
];

const BANK_LABEL: Record<BankSlug, string> = BANK_CATEGORIES.reduce(
  (acc, c) => { acc[c.slug] = c.label; return acc; }, {} as Record<BankSlug, string>,
);
const BANK_PAGES: Record<BankSlug, string[]> = BANK_CATEGORIES.reduce(
  (acc, c) => { acc[c.slug] = c.pageSuggestions; return acc; }, {} as Record<BankSlug, string[]>,
);

// ---------------------------------------------------------------------------
// Inferred (legacy) categories for non-bank assets
// ---------------------------------------------------------------------------

type LegacyCategory =
  | 'hero' | 'winter' | 'summer' | 'accommodation' | 'food' | 'practical'
  | 'event' | 'atmosphere' | 'logo' | 'poster' | 'screenshot'
  | 'illustration' | 'map' | 'social' | 'unknown';

const POSTER_HINTS = ['apningstider', 'kampanje', 'prisliste', 'nytt2526', 'masterplan', 'tegnebrett', 'earlybirdracer', 'kan-du-sla', 'uke-', 'p1p2', 'bjorlimap', 'overview-mars', 'pa-bjorli-2026'];
const SOCIAL_HINTS = ['122156197', '122163529', '122171', '18142033', '18164164', '18197647', '18061215', '309377', '326968', '242708', '448704', '448732', '473116', '473749', '568376', '588499', '653707', '656130', '656216', '658083'];
const SCREENSHOT_HINTS = ['screenshot', 'skjermbilde', 'view-recent-photos', 'thumbnail-img-', 'latest-hd', 'fullsizerender'];
const LOGO_HINTS = ['cropped-main-logo', 'novasol-logo'];
const MAP_HINTS = ['loypekart', 'bjorlimap', 'masterplan', 'piste'];
const ILLUSTRATION_HINTS = ['illustrasjon', 'illustrated-mou', 'tegnebrett'];
const PLACEHOLDER_HINTS = ['placeholder', 'woocommerce-placeholder'];
const LOW_RES_HINTS = ['-low-', 'medium-', 'thumbnail-'];
const STOCK_HINTS = ['ski-lift-4323750'];

const has = (s: string, arr: string[]) => arr.some((h) => s.includes(h));

function inferLegacyCategory(path: string): LegacyCategory {
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

function inferAutoWarnings(path: string, category: LegacyCategory | 'bank'): string[] {
  const f = path.toLowerCase();
  const w: string[] = [];
  if (category === 'poster') w.push('poster');
  if (category === 'social') w.push('social graphic');
  if (category === 'screenshot') w.push('screenshot');
  if (category === 'illustration') w.push('illustration');
  if (category === 'map') w.push('map graphic');
  if (has(f, PLACEHOLDER_HINTS)) w.push('placeholder');
  if (has(f, LOW_RES_HINTS)) w.push('low-res variant');
  if (has(f, STOCK_HINTS)) w.push('possible stock');
  if (/\b20\d{2}\b/.test(f) && (category === 'poster' || category === 'social' || category === 'event')) {
    w.push('likely baked-in text');
  }
  if (category === 'poster' || category === 'social' || category === 'screenshot' || category === 'illustration' || category === 'map') {
    w.push('avoid on homepage');
  }
  return w;
}

// Detect images that contain a baked-in Bjorli logo. Bank assets follow the
// "LOGO" / "logo-before-use" / "crop-logo" naming convention; legacy assets
// don't, so we don't auto-flag every "logo" filename here.
function detectLogoPresent(filename: string): boolean {
  const lower = filename.toLowerCase();
  return filename.includes('LOGO') || lower.includes('logo-before-use') || lower.includes('crop-logo');
}

function inferHeroSuitability(path: string, bankSlug: BankSlug | null, hasLogo: boolean): 'Strong' | 'Candidate' | 'Possible' | 'No' {
  const lower = path.toLowerCase();
  let h: 'Strong' | 'Candidate' | 'Possible' | 'No' = 'No';
  if (bankSlug === '01-hero') h = lower.includes('candidate') ? 'Candidate' : 'Strong';
  else if (lower.includes('hero-wide') || lower.includes('panorama') || lower.includes('hero')) h = lower.includes('candidate') ? 'Candidate' : 'Possible';
  else if (lower.includes('wide') || lower.includes('overview') || lower.includes('open-landscape')) h = 'Possible';
  if (hasLogo && h !== 'No') h = 'Candidate';
  return h;
}

// ---------------------------------------------------------------------------
// Asset row (immutable, derived from filesystem)
// ---------------------------------------------------------------------------

interface AssetRow {
  path: string;
  url: string;
  filename: string;
  folder: string;
  bankSlug: BankSlug | null;
  legacyCategory: LegacyCategory;
  inferredAlt: string;          // alt text from registry, if known
  registryKeys: string[];       // keys in src/lib/images.ts pointing here
  hasLogo: boolean;
  heroSuitability: 'Strong' | 'Candidate' | 'Possible' | 'No';
  recommendedUse: string;
  pageSuggestions: string[];
  autoWarnings: string[];
}

function recommendedUseFor(bankSlug: BankSlug | null, legacy: LegacyCategory, hasLogo: boolean): string {
  if (bankSlug === '01-hero') return hasLogo
    ? 'Hero candidate — must be cropped to remove logo first.'
    : 'Hero — homepage, season landing, or major destination page.';
  if (bankSlug === '07-underside') return 'Subpage support image — cards, content blocks, guides.';
  if (bankSlug) return `${BANK_LABEL[bankSlug]} — use on related subpages and cards.`;
  switch (legacy) {
    case 'hero':         return 'Homepage hero / large editorial covers.';
    case 'winter':       return 'Ski-center, lifts, snow-condition cards.';
    case 'summer':       return 'Sommer page, hiking/biking/fishing cards.';
    case 'accommodation':return 'Accommodation page, lodging cards.';
    case 'food':         return 'Food & Drink page.';
    case 'practical':    return 'Practical info / arrival page.';
    case 'event':        return 'Events listing, event detail hero.';
    case 'atmosphere':   return 'Editorial mood card, news/tips thumbnails.';
    case 'logo':         return 'Brand mark / partner logo strip.';
    case 'poster':       return 'Promo / campaign banner only (time-limited).';
    case 'social':       return 'Social grid, after manual review.';
    case 'screenshot':   return 'Internal reference only — do not publish.';
    case 'illustration': return 'Project / development pages.';
    case 'map':          return 'Piste-map / planning page only.';
    default:             return 'Review before assigning.';
  }
}

function pageSuggestionsFor(bankSlug: BankSlug | null, legacy: LegacyCategory): string[] {
  if (bankSlug) return BANK_PAGES[bankSlug];
  const m: Partial<Record<LegacyCategory, string[]>> = {
    hero: ['Homepage', 'Season landing'],
    winter: ['Vinter', 'Ski Center'],
    summer: ['Sommer', 'Activities'],
    accommodation: ['Accommodation'],
    food: ['Food & Drink'],
    practical: ['Practical info', 'Getting here'],
    event: ['Events'],
    atmosphere: ['News', 'Tips'],
    logo: ['Navbar', 'Footer'],
    poster: ['Campaign banner'],
    social: ['Social channels'],
    screenshot: ['(internal only)'],
    illustration: ['Project pages'],
    map: ['Piste map'],
  };
  return m[legacy] ?? [];
}

const allRows: AssetRow[] = Object.entries(assetModules)
  .map(([rawPath, url]): AssetRow => {
    const path = rawPath.replace(/^\//, '');
    const filename = path.split('/').pop() ?? path;
    const folder = path.replace('src/assets/', '').split('/').slice(0, -1).join('/') || '(root)';
    const bankMatch = path.match(/\/bank\/([0-9]{2}-[a-z]+)\//);
    const bankSlug = (bankMatch ? bankMatch[1] : null) as BankSlug | null;
    const legacy = inferLegacyCategory(rawPath);
    const hasLogo = detectLogoPresent(filename);
    const reg = registryByUrl[url];
    return {
      path,
      url,
      filename,
      folder,
      bankSlug,
      legacyCategory: legacy,
      inferredAlt: reg?.alts?.[0] ?? '',
      registryKeys: reg?.keys ?? [],
      hasLogo,
      heroSuitability: inferHeroSuitability(path, bankSlug, hasLogo),
      recommendedUse: recommendedUseFor(bankSlug, legacy, hasLogo),
      pageSuggestions: pageSuggestionsFor(bankSlug, legacy),
      autoWarnings: inferAutoWarnings(path, bankSlug ? 'bank' : legacy),
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

// ---------------------------------------------------------------------------
// Editor review state — persisted in localStorage
// ---------------------------------------------------------------------------

interface ReviewFlags {
  delete: boolean;
  duplicate: boolean;
  doNotUse: boolean;
  subpageOnly: boolean;
  heroCandidate: boolean;
  logoCrop: boolean;
}

interface ReviewState {
  flags: ReviewFlags;
  altText: string;
  notes: string;
  replacement: string;
  categoryOverride: BankSlug | '';
  recommendedOverride: string;
}

type ReviewMap = Record<string, ReviewState>;

const STORAGE_KEY = 'bjorli:image-inventory:v1';
const EMPTY_FLAGS: ReviewFlags = { delete: false, duplicate: false, doNotUse: false, subpageOnly: false, heroCandidate: false, logoCrop: false };
const EMPTY_REVIEW: ReviewState = { flags: { ...EMPTY_FLAGS }, altText: '', notes: '', replacement: '', categoryOverride: '', recommendedOverride: '' };

function loadReviews(): ReviewMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReviewMap) : {};
  } catch { return {}; }
}

// ---------------------------------------------------------------------------
// Filter / sort options
// ---------------------------------------------------------------------------

type FlagFilter = 'all' | 'selected' | 'delete' | 'duplicate' | 'doNotUse' | 'heroCandidate' | 'subpageOnly' | 'logoCrop' | 'missingAlt' | 'unused' | 'used' | 'warnings';
type SortKey = 'filename' | 'category' | 'usedFirst' | 'unusedFirst' | 'flaggedFirst' | 'heroFirst';
type CategoryFilter = 'all' | BankSlug | LegacyCategory;

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All categories' },
  ...BANK_CATEGORIES.map((c) => ({ value: c.slug as CategoryFilter, label: `/${c.slug} — ${c.label}` })),
  { value: 'hero',          label: 'legacy: hero' },
  { value: 'winter',        label: 'legacy: winter' },
  { value: 'summer',        label: 'legacy: summer' },
  { value: 'accommodation', label: 'legacy: accommodation' },
  { value: 'food',          label: 'legacy: food' },
  { value: 'practical',     label: 'legacy: practical' },
  { value: 'event',         label: 'legacy: event' },
  { value: 'atmosphere',    label: 'legacy: atmosphere' },
  { value: 'logo',          label: 'legacy: logo' },
  { value: 'poster',        label: 'legacy: poster' },
  { value: 'social',        label: 'legacy: social' },
  { value: 'screenshot',    label: 'legacy: screenshot' },
  { value: 'illustration',  label: 'legacy: illustration' },
  { value: 'map',           label: 'legacy: map' },
  { value: 'unknown',       label: 'legacy: unknown' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function effectiveCategory(row: AssetRow, review: ReviewState): string {
  if (review.categoryOverride) return `/${review.categoryOverride} — ${BANK_LABEL[review.categoryOverride]} (override)`;
  if (row.bankSlug) return `/${row.bankSlug} — ${BANK_LABEL[row.bankSlug]}`;
  return `legacy: ${row.legacyCategory}`;
}

function effectiveAlt(row: AssetRow, review: ReviewState): string {
  return review.altText.trim() || row.inferredAlt;
}

function effectiveRecommended(row: AssetRow, review: ReviewState): string {
  return review.recommendedOverride.trim() || row.recommendedUse;
}

function rowMatchesFlag(row: AssetRow, review: ReviewState, selected: boolean, filter: FlagFilter): boolean {
  switch (filter) {
    case 'all':           return true;
    case 'selected':      return selected;
    case 'delete':        return review.flags.delete;
    case 'duplicate':     return review.flags.duplicate;
    case 'doNotUse':      return review.flags.doNotUse;
    case 'heroCandidate': return review.flags.heroCandidate || row.heroSuitability === 'Strong' || row.heroSuitability === 'Candidate';
    case 'subpageOnly':   return review.flags.subpageOnly;
    case 'logoCrop':      return review.flags.logoCrop || row.hasLogo;
    case 'missingAlt':    return effectiveAlt(row, review).trim().length === 0;
    case 'unused':        return row.registryKeys.length === 0;
    case 'used':          return row.registryKeys.length > 0;
    case 'warnings':      return row.autoWarnings.length > 0;
  }
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function csvEscape(v: string | number | boolean): string {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(headers: string[], rows: (string | number | boolean)[][]): string {
  return [headers.map(csvEscape).join(','), ...rows.map((r) => r.map(csvEscape).join(','))].join('\n');
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ImageInventory = () => {
  const [reviews, setReviews] = useState<ReviewMap>(() => loadReviews());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [flagFilter, setFlagFilter] = useState<FlagFilter>('all');
  const [sort, setSort] = useState<SortKey>('filename');
  const [groupByCategory, setGroupByCategory] = useState(true);

  // Persist reviews
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)); } catch { /* quota / SSR */ }
  }, [reviews]);

  const getReview = (path: string): ReviewState => reviews[path] ?? EMPTY_REVIEW;

  const updateReview = (path: string, patch: Partial<ReviewState>) => {
    setReviews((prev) => {
      const cur = prev[path] ?? EMPTY_REVIEW;
      const next: ReviewState = {
        ...cur,
        ...patch,
        flags: { ...cur.flags, ...(patch.flags ?? {}) },
      };
      return { ...prev, [path]: next };
    });
  };

  const setFlag = (path: string, key: keyof ReviewFlags, value: boolean) => {
    updateReview(path, { flags: { ...getReview(path).flags, [key]: value } });
  };

  // Safety: warn before flagging delete on a used image without replacement
  const safeToggleDelete = (row: AssetRow) => {
    const r = getReview(row.path);
    const next = !r.flags.delete;
    if (next && row.registryKeys.length > 0 && !r.replacement.trim()) {
      const ok = window.confirm(
        `"${row.filename}" is referenced by ${row.registryKeys.length} registry key(s) and has no replacement set.\n\n` +
        `Flag for deletion anyway?`,
      );
      if (!ok) return;
    }
    setFlag(row.path, 'delete', next);
  };

  // Filtered + sorted list
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const list = allRows.filter((row) => {
      const review = reviews[row.path] ?? EMPTY_REVIEW;
      if (q && !row.path.toLowerCase().includes(q) && !effectiveAlt(row, review).toLowerCase().includes(q)) return false;
      if (categoryFilter !== 'all') {
        const isBank = BANK_CATEGORIES.some((c) => c.slug === categoryFilter);
        if (isBank) {
          const eff = review.categoryOverride || row.bankSlug;
          if (eff !== categoryFilter) return false;
        } else if (row.bankSlug || row.legacyCategory !== categoryFilter) return false;
      }
      if (!rowMatchesFlag(row, review, selected.has(row.path), flagFilter)) return false;
      return true;
    });

    const sortFn: Record<SortKey, (a: AssetRow, b: AssetRow) => number> = {
      filename:    (a, b) => a.filename.localeCompare(b.filename),
      category:    (a, b) => (a.bankSlug ?? `z-${a.legacyCategory}`).localeCompare(b.bankSlug ?? `z-${b.legacyCategory}`) || a.filename.localeCompare(b.filename),
      usedFirst:   (a, b) => (b.registryKeys.length > 0 ? 1 : 0) - (a.registryKeys.length > 0 ? 1 : 0) || a.filename.localeCompare(b.filename),
      unusedFirst: (a, b) => (a.registryKeys.length > 0 ? 1 : 0) - (b.registryKeys.length > 0 ? 1 : 0) || a.filename.localeCompare(b.filename),
      flaggedFirst:(a, b) => {
        const af = Object.values((reviews[a.path] ?? EMPTY_REVIEW).flags).some(Boolean) ? 1 : 0;
        const bf = Object.values((reviews[b.path] ?? EMPTY_REVIEW).flags).some(Boolean) ? 1 : 0;
        return bf - af || a.filename.localeCompare(b.filename);
      },
      heroFirst:   (a, b) => {
        const order = { Strong: 0, Candidate: 1, Possible: 2, No: 3 } as const;
        return order[a.heroSuitability] - order[b.heroSuitability] || a.filename.localeCompare(b.filename);
      },
    };
    return [...list].sort(sortFn[sort]);
  }, [reviews, selected, query, categoryFilter, flagFilter, sort]);

  // Grouping for display
  const groups = useMemo(() => {
    if (!groupByCategory) return [{ key: 'All matches', rows: filtered }];
    const map = new Map<string, AssetRow[]>();
    for (const row of filtered) {
      const key = row.bankSlug
        ? `/${row.bankSlug} — ${BANK_LABEL[row.bankSlug]}`
        : `legacy: ${row.legacyCategory}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(row);
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, rows]) => ({ key, rows }));
  }, [filtered, groupByCategory]);

  // Stats
  const stats = useMemo(() => {
    const total = allRows.length;
    const used = allRows.filter((r) => r.registryKeys.length > 0).length;
    let flagged = 0, deletes = 0, dupes = 0, doNot = 0, missingAlt = 0;
    for (const row of allRows) {
      const r = reviews[row.path] ?? EMPTY_REVIEW;
      const anyFlag = Object.values(r.flags).some(Boolean);
      if (anyFlag) flagged++;
      if (r.flags.delete) deletes++;
      if (r.flags.duplicate) dupes++;
      if (r.flags.doNotUse) doNot++;
      if (!effectiveAlt(row, r).trim()) missingAlt++;
    }
    return { total, used, flagged, deletes, dupes, doNot, missingAlt, selected: selected.size };
  }, [reviews, selected]);

  // Selection
  const toggleSelect = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  };
  const selectAllVisible = () => setSelected(new Set(filtered.map((r) => r.path)));
  const clearSelection = () => setSelected(new Set());

  // Bulk actions
  const bulkSetFlag = (key: keyof ReviewFlags, value: boolean) => {
    setReviews((prev) => {
      const next = { ...prev };
      for (const path of selected) {
        const cur = next[path] ?? EMPTY_REVIEW;
        next[path] = { ...cur, flags: { ...cur.flags, [key]: value } };
      }
      return next;
    });
  };
  const bulkClearFlags = () => {
    setReviews((prev) => {
      const next = { ...prev };
      for (const path of selected) {
        const cur = next[path] ?? EMPTY_REVIEW;
        next[path] = { ...cur, flags: { ...EMPTY_FLAGS } };
      }
      return next;
    });
  };

  // ---- Exports ---------------------------------------------------------

  const buildFlaggedExport = () => allRows
    .map((row) => ({ row, review: reviews[row.path] ?? EMPTY_REVIEW }))
    .filter(({ review }) => Object.values(review.flags).some(Boolean));

  const exportDeletionJson = () => {
    const rows = buildFlaggedExport().map(({ row, review }) => ({
      filename: row.filename,
      path: row.path,
      category: review.categoryOverride || row.bankSlug || row.legacyCategory,
      used: row.registryKeys.length > 0,
      registryKeys: row.registryKeys,
      pageSuggestions: row.pageSuggestions,
      hasLogoBakedIn: row.hasLogo,
      heroSuitability: row.heroSuitability,
      altText: effectiveAlt(row, review),
      notes: review.notes,
      replacement: review.replacement,
      flags: review.flags,
      autoWarnings: row.autoWarnings,
    }));
    downloadBlob('bjorli-image-deletion-list.json', JSON.stringify(rows, null, 2), 'application/json');
  };

  const exportDeletionCsv = () => {
    const headers = ['filename','path','category','used','registry_keys','page_suggestions','replacement','flags','reason_notes'];
    const data = buildFlaggedExport().map(({ row, review }) => {
      const flagList = (Object.entries(review.flags) as [keyof ReviewFlags, boolean][])
        .filter(([, v]) => v).map(([k]) => k).join('|');
      return [
        row.filename,
        row.path,
        review.categoryOverride || row.bankSlug || row.legacyCategory,
        row.registryKeys.length > 0,
        row.registryKeys.join('|'),
        row.pageSuggestions.join('|'),
        review.replacement,
        flagList,
        review.notes,
      ];
    });
    downloadBlob('bjorli-image-deletion-list.csv', toCsv(headers, data), 'text/csv');
  };

  const exportFullCsv = () => {
    const headers = ['filename','path','folder','bank_category','legacy_category','used','registry_keys','page_suggestions','hero_suitability','has_logo','recommended_use','alt_text','notes','replacement','flags','auto_warnings'];
    const data = allRows.map((row) => {
      const review = reviews[row.path] ?? EMPTY_REVIEW;
      const flagList = (Object.entries(review.flags) as [keyof ReviewFlags, boolean][])
        .filter(([, v]) => v).map(([k]) => k).join('|');
      return [
        row.filename,
        row.path,
        row.folder,
        review.categoryOverride || row.bankSlug || '',
        row.legacyCategory,
        row.registryKeys.length > 0,
        row.registryKeys.join('|'),
        row.pageSuggestions.join('|'),
        row.heroSuitability,
        row.hasLogo,
        effectiveRecommended(row, review),
        effectiveAlt(row, review),
        review.notes,
        review.replacement,
        flagList,
        row.autoWarnings.join('|'),
      ];
    });
    downloadBlob('bjorli-image-inventory.csv', toCsv(headers, data), 'text/csv');
  };

  const exportUsageCsv = () => {
    const headers = ['filename','path','registry_keys','used_count','suggested_pages'];
    const data = allRows.map((row) => [
      row.filename, row.path, row.registryKeys.join('|'), row.registryKeys.length, row.pageSuggestions.join('|'),
    ]);
    downloadBlob('bjorli-image-usage.csv', toCsv(headers, data), 'text/csv');
  };

  const copyCleanupPrompt = async () => {
    const flagged = buildFlaggedExport();
    const groupsOut: Record<string, string[]> = {
      'Flagged for deletion': [],
      'Duplicate': [],
      'Do not use': [],
      'Needs replacement': [],
      'Logo crop required': [],
    };
    for (const { row, review } of flagged) {
      const line = `- ${row.path}` +
        (review.replacement ? `  (replace with: ${review.replacement})` : '') +
        (row.registryKeys.length > 0 ? `  [used by: ${row.registryKeys.join(', ')}]` : '') +
        (review.notes ? `  — ${review.notes}` : '');
      if (review.flags.delete) groupsOut['Flagged for deletion'].push(line);
      if (review.flags.duplicate) groupsOut['Duplicate'].push(line);
      if (review.flags.doNotUse) groupsOut['Do not use'].push(line);
      if (review.flags.delete && row.registryKeys.length > 0 && !review.replacement) groupsOut['Needs replacement'].push(line);
      if (review.flags.logoCrop || row.hasLogo) groupsOut['Logo crop required'].push(line);
    }
    const sections = Object.entries(groupsOut)
      .filter(([, lines]) => lines.length > 0)
      .map(([title, lines]) => `## ${title}\n${lines.join('\n')}`)
      .join('\n\n');
    const prompt =
      `Remove or replace the following image assets only after confirming they are not used on live pages. ` +
      `Do not remove images that are used as hero images, page cards, SEO images, Open Graph images, or content images unless a replacement is specified.\n\n` +
      (sections || '(No images flagged.)');
    try {
      await navigator.clipboard.writeText(prompt);
      window.alert('Cleanup prompt copied to clipboard.');
    } catch {
      // Fallback: download as .txt
      downloadBlob('bjorli-cleanup-prompt.txt', prompt, 'text/plain');
    }
  };

  // ---- Render ----------------------------------------------------------

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <div className="container mx-auto max-w-[1600px] px-4 py-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            Internal · review only · not linked from navigation
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2">
            Image inventory & review
          </h1>
          <p className="text-muted-foreground text-sm">
            {stats.total} assets · {stats.used} used · {stats.flagged} flagged · {stats.deletes} delete · {stats.dupes} duplicate · {stats.missingAlt} missing alt · {stats.selected} selected
          </p>
        </header>

        {/* Safety warning */}
        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
          <strong className="text-destructive">Safety:</strong>{' '}
          This page is for internal image review. Flagging an image does not delete it.
          Always export and review the deletion list before removing files from the project.
        </div>

        {/* Export bar */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button onClick={exportDeletionJson} className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm">
            Export deletion list (JSON)
          </button>
          <button onClick={exportDeletionCsv} className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm">
            Export deletion list (CSV)
          </button>
          <button onClick={exportFullCsv} className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm">
            Export full inventory (CSV)
          </button>
          <button onClick={exportUsageCsv} className="px-3 py-2 rounded-md border border-border bg-card hover:bg-muted text-sm">
            Export usage report (CSV)
          </button>
          <button onClick={copyCleanupPrompt} className="px-3 py-2 rounded-md border border-primary bg-primary text-primary-foreground hover:opacity-90 text-sm">
            Copy cleanup prompt
          </button>
        </div>

        {/* Filter / sort bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3 sticky top-2 z-10 bg-background/95 backdrop-blur p-3 rounded-lg border border-border">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search filename, path, alt…"
            className="px-3 py-2 rounded-md border border-border bg-card text-sm w-64"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
          >
            {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value as FlagFilter)}
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
          >
            <option value="all">All flags</option>
            <option value="selected">Only selected</option>
            <option value="delete">Flagged for deletion</option>
            <option value="duplicate">Duplicates</option>
            <option value="doNotUse">Do not use</option>
            <option value="heroCandidate">Hero candidates</option>
            <option value="subpageOnly">Subpage only</option>
            <option value="logoCrop">Logo crop required</option>
            <option value="missingAlt">Missing alt text</option>
            <option value="unused">Unused images</option>
            <option value="used">Used images</option>
            <option value="warnings">Auto-warnings</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 rounded-md border border-border bg-card text-sm"
          >
            <option value="filename">Sort: Filename A-Z</option>
            <option value="category">Sort: Category</option>
            <option value="usedFirst">Sort: Used first</option>
            <option value="unusedFirst">Sort: Unused first</option>
            <option value="flaggedFirst">Sort: Flagged first</option>
            <option value="heroFirst">Sort: Hero candidates first</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={groupByCategory} onChange={(e) => setGroupByCategory(e.target.checked)} />
            Group by category
          </label>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <button onClick={selectAllVisible} className="px-2 py-1 rounded border border-border hover:bg-muted">
              Select visible ({filtered.length})
            </button>
            <button onClick={clearSelection} className="px-2 py-1 rounded border border-border hover:bg-muted" disabled={selected.size === 0}>
              Clear selection
            </button>
          </div>
        </div>

        {/* Grouped grids */}
        {groups.map((group) => (
          <div key={group.key} className="mb-10">
            {groupByCategory && (
              <div className="flex items-baseline justify-between mb-3 pb-2 border-b border-border">
                <h2 className="text-lg font-semibold">{group.key}</h2>
                <span className="text-xs text-muted-foreground">{group.rows.length} images</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {group.rows.map((row) => (
                <ImageCard
                  key={row.path}
                  row={row}
                  review={getReview(row.path)}
                  selected={selected.has(row.path)}
                  onToggleSelect={() => toggleSelect(row.path)}
                  onUpdate={(patch) => updateReview(row.path, patch)}
                  onToggleFlag={(k) => {
                    if (k === 'delete') safeToggleDelete(row);
                    else setFlag(row.path, k, !getReview(row.path).flags[k]);
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No assets match these filters.</p>
        )}
      </div>

      {/* Sticky bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur shadow-lg">
          <div className="container mx-auto max-w-[1600px] px-4 py-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium mr-2">{selected.size} selected</span>
            <BulkBtn onClick={() => bulkSetFlag('delete', true)} variant="destructive">Flag for deletion</BulkBtn>
            <BulkBtn onClick={() => bulkSetFlag('duplicate', true)}>Mark duplicate</BulkBtn>
            <BulkBtn onClick={() => bulkSetFlag('doNotUse', true)}>Do not use</BulkBtn>
            <BulkBtn onClick={() => bulkSetFlag('subpageOnly', true)}>Subpage only</BulkBtn>
            <BulkBtn onClick={() => bulkSetFlag('heroCandidate', true)}>Hero candidate</BulkBtn>
            <BulkBtn onClick={() => bulkSetFlag('logoCrop', true)}>Logo crop required</BulkBtn>
            <BulkBtn onClick={bulkClearFlags}>Clear flags</BulkBtn>
            <button onClick={clearSelection} className="ml-auto text-sm text-muted-foreground hover:text-foreground">
              Clear selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

const BulkBtn = ({ onClick, children, variant }: { onClick: () => void; children: React.ReactNode; variant?: 'destructive' }) => (
  <button
    onClick={onClick}
    className={
      'px-3 py-1.5 rounded-md text-sm border ' +
      (variant === 'destructive'
        ? 'border-destructive bg-destructive text-destructive-foreground hover:opacity-90'
        : 'border-border bg-card hover:bg-muted')
    }
  >
    {children}
  </button>
);

const Badge = ({ tone, children }: { tone: 'neutral' | 'primary' | 'warn' | 'danger' | 'muted'; children: React.ReactNode }) => {
  const cls = {
    neutral: 'bg-background/90 text-foreground border border-border',
    primary: 'bg-primary text-primary-foreground',
    warn:    'bg-secondary text-secondary-foreground',
    danger:  'bg-destructive text-destructive-foreground',
    muted:   'bg-muted text-foreground',
  }[tone];
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${cls}`}>{children}</span>;
};

interface ImageCardProps {
  row: AssetRow;
  review: ReviewState;
  selected: boolean;
  onToggleSelect: () => void;
  onUpdate: (patch: Partial<ReviewState>) => void;
  onToggleFlag: (key: keyof ReviewFlags) => void;
}

const ImageCard = ({ row, review, selected, onToggleSelect, onUpdate, onToggleFlag }: ImageCardProps) => {
  const [open, setOpen] = useState(false);
  const isUsed = row.registryKeys.length > 0;
  const altMissing = !effectiveAlt(row, review).trim();
  const showLogoCrop = review.flags.logoCrop || row.hasLogo;
  const isHero = review.flags.heroCandidate || row.heroSuitability === 'Strong' || row.heroSuitability === 'Candidate';

  return (
    <article
      className={
        'rounded-xl border bg-card overflow-hidden flex flex-col transition ' +
        (selected ? 'border-primary ring-2 ring-primary/40' : 'border-border')
      }
    >
      <div className="relative aspect-[4/3] bg-muted">
        <img src={row.url} alt={row.filename} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <label className="absolute top-2 left-2 inline-flex items-center justify-center bg-background/90 rounded p-1 cursor-pointer">
          <input type="checkbox" checked={selected} onChange={onToggleSelect} aria-label="Select image" />
        </label>
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 max-w-[70%]">
          {isHero && <Badge tone="primary">HERO</Badge>}
          {isUsed ? <Badge tone="primary">USED</Badge> : <Badge tone="muted">UNUSED</Badge>}
          {review.flags.delete && <Badge tone="danger">DELETE?</Badge>}
          {review.flags.duplicate && <Badge tone="warn">DUPLICATE</Badge>}
          {review.flags.doNotUse && <Badge tone="danger">DO NOT USE</Badge>}
          {review.flags.subpageOnly && <Badge tone="warn">SUBPAGE ONLY</Badge>}
          {showLogoCrop && <Badge tone="warn">LOGO CROP</Badge>}
          {altMissing && <Badge tone="warn">NEEDS ALT TEXT</Badge>}
          {!row.bankSlug && !review.categoryOverride && <Badge tone="neutral">NEEDS CATEGORY</Badge>}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 text-sm">
        <div className="font-mono text-xs break-all">{row.filename}</div>
        <div className="font-mono text-[11px] break-all text-muted-foreground">{row.path}</div>

        <div className="text-xs">
          <span className="text-muted-foreground">Category: </span>
          <span>{effectiveCategory(row, review)}</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Recommended: </span>
          <span>{effectiveRecommended(row, review)}</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground">Used as: </span>
          {isUsed
            ? <span>{row.registryKeys.join(', ')}</span>
            : <span className="italic text-muted-foreground">unused</span>}
        </div>
        {row.pageSuggestions.length > 0 && (
          <div className="text-xs">
            <span className="text-muted-foreground">Suggested pages: </span>
            <span>{row.pageSuggestions.join(', ')}</span>
          </div>
        )}
        <div className="text-xs">
          <span className="text-muted-foreground">Alt: </span>
          {effectiveAlt(row, review)
            ? <span>{effectiveAlt(row, review)}</span>
            : <span className="italic text-destructive">missing</span>}
        </div>
        {row.autoWarnings.length > 0 && (
          <div className="text-[11px] text-muted-foreground">⚠ {row.autoWarnings.join(' · ')}</div>
        )}

        {/* Flag toggles */}
        <div className="flex flex-wrap gap-1 pt-1">
          <FlagBtn active={review.flags.heroCandidate} onClick={() => onToggleFlag('heroCandidate')}>hero</FlagBtn>
          <FlagBtn active={review.flags.subpageOnly}   onClick={() => onToggleFlag('subpageOnly')}>subpage</FlagBtn>
          <FlagBtn active={review.flags.logoCrop}      onClick={() => onToggleFlag('logoCrop')}>logo-crop</FlagBtn>
          <FlagBtn active={review.flags.duplicate}     onClick={() => onToggleFlag('duplicate')}>duplicate</FlagBtn>
          <FlagBtn active={review.flags.doNotUse}      onClick={() => onToggleFlag('doNotUse')}>do-not-use</FlagBtn>
          <FlagBtn active={review.flags.delete} danger onClick={() => onToggleFlag('delete')}>delete</FlagBtn>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-xs text-muted-foreground hover:text-foreground underline self-start mt-1"
        >
          {open ? 'Hide editor' : 'Edit details'}
        </button>

        {open && (
          <div className="flex flex-col gap-2 pt-1 border-t border-border mt-1">
            <label className="text-[11px] text-muted-foreground">
              Category override
              <select
                value={review.categoryOverride}
                onChange={(e) => onUpdate({ categoryOverride: e.target.value as BankSlug | '' })}
                className="mt-0.5 w-full px-2 py-1 rounded border border-border bg-background text-xs"
              >
                <option value="">(no override)</option>
                {BANK_CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>/{c.slug} — {c.label}</option>
                ))}
              </select>
            </label>
            <label className="text-[11px] text-muted-foreground">
              Recommended use (override)
              <input
                type="text"
                value={review.recommendedOverride}
                onChange={(e) => onUpdate({ recommendedOverride: e.target.value })}
                placeholder={row.recommendedUse}
                className="mt-0.5 w-full px-2 py-1 rounded border border-border bg-background text-xs"
              />
            </label>
            <label className="text-[11px] text-muted-foreground">
              Alt text
              <input
                type="text"
                value={review.altText}
                onChange={(e) => onUpdate({ altText: e.target.value })}
                placeholder={row.inferredAlt || 'Describe the image…'}
                className="mt-0.5 w-full px-2 py-1 rounded border border-border bg-background text-xs"
              />
            </label>
            <label className="text-[11px] text-muted-foreground">
              Replacement image (filename or path)
              <input
                type="text"
                value={review.replacement}
                onChange={(e) => onUpdate({ replacement: e.target.value })}
                placeholder="e.g. bank/01-hero/bjorli-…"
                className="mt-0.5 w-full px-2 py-1 rounded border border-border bg-background text-xs"
              />
            </label>
            <label className="text-[11px] text-muted-foreground">
              Internal note
              <textarea
                value={review.notes}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                rows={2}
                className="mt-0.5 w-full px-2 py-1 rounded border border-border bg-background text-xs resize-y"
              />
            </label>
          </div>
        )}
      </div>
    </article>
  );
};

const FlagBtn = ({ active, danger, onClick, children }: { active: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={
      'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ' +
      (active
        ? danger
          ? 'bg-destructive text-destructive-foreground border-destructive'
          : 'bg-primary text-primary-foreground border-primary'
        : 'bg-card text-muted-foreground border-border hover:bg-muted')
    }
  >
    {children}
  </button>
);

export default ImageInventory;