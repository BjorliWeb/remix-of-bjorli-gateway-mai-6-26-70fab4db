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
    barn: 'Kids',
    klatring: 'Climbing',
    fiske: 'Fishing',
    sommer: 'Summer',
    vinter: 'Winter',
    annet: 'Other',
  },
};