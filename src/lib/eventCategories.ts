/**
 * Categories used by the public "Meld inn arrangement" / "Submit event" form
 * and the admin review queue. Kept locale-aware via i18n keys but the stored
 * value is the stable English-ish key (e.g. "ski", "family").
 */
export type EventCategoryKey =
  | 'familie'
  | 'ski'
  | 'sykkel'
  | 'fottur'
  | 'mat-drikke'
  | 'kurs'
  | 'arrangement'
  | 'quiz'
  | 'konsert'
  | 'after-ski'
  | 'barn'
  | 'klatring'
  | 'fiske'
  | 'sommer'
  | 'vinter'
  | 'annet';

export const EVENT_CATEGORY_KEYS: EventCategoryKey[] = [
  'familie',
  'ski',
  'sykkel',
  'fottur',
  'mat-drikke',
  'kurs',
  'arrangement',
  'quiz',
  'konsert',
  'after-ski',
  'barn',
  'klatring',
  'fiske',
  'sommer',
  'vinter',
  'annet',
];

export const CATEGORY_LABELS: Record<'no' | 'en', Record<EventCategoryKey, string>> = {
  no: {
    familie: 'Familie',
    ski: 'Ski',
    sykkel: 'Sykkel',
    fottur: 'Fottur',
    'mat-drikke': 'Mat & drikke',
    kurs: 'Kurs',
    arrangement: 'Arrangement',
    quiz: 'Quiz',
    konsert: 'Konsert',
    'after-ski': 'After-ski',
    barn: 'Barn',
    klatring: 'Klatring',
    fiske: 'Fiske',
    sommer: 'Sommer',
    vinter: 'Vinter',
    annet: 'Annet',
  },
  en: {
    familie: 'Family',
    ski: 'Skiing',
    sykkel: 'Cycling',
    fottur: 'Hiking',
    'mat-drikke': 'Food & drink',
    kurs: 'Courses',
    arrangement: 'Event',
    quiz: 'Quiz',
    konsert: 'Concert',
    'after-ski': 'After-ski',
    barn: 'Children',
    klatring: 'Climbing',
    fiske: 'Fishing',
    sommer: 'Summer',
    vinter: 'Winter',
    annet: 'Other',
  },
};
/** Most categories one event may carry (mirrored by the database trigger). */
export const MAX_EVENT_CATEGORIES = 6;

/**
 * Normalises any stored category shape into an ordered, de-duplicated list.
 * Reads the new `categories` list first and falls back to the single legacy
 * `category` field, so old rows show up as one selected category.
 */
export function normalizeCategories(
  categories: readonly (string | null | undefined)[] | null | undefined,
  legacy?: string | null,
): string[] {
  const src = categories && categories.length ? categories : [legacy];
  const out: string[] = [];
  for (const c of src) {
    const v = (c ?? '').trim();
    if (v && !out.includes(v)) out.push(v);
  }
  return out;
}
