/**
 * Shared build-time access to the CMS snapshot written by
 * scripts/export-cms-content.ts. Used by both the sitemap generator and the
 * prerenderer so detail URLs can never drift between the two.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { LOCALES, LOCALE_PREFIX, type Locale } from '../../src/i18n/locales/types';
import { slugForCanonical, type CanonicalRoute } from '../../src/i18n/routes';
import { normalizeInternalPath } from '../../src/lib/url/normalizeInternalPath';

export interface SnapshotEntry {
  id: string;
  slug: string;
  title: string;
  intro?: string;
  body?: string;
  category?: string;
  publishedAt?: string;
  updatedAt?: string;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export type DetailKind = 'news' | 'tips' | 'events' | 'activities';
export type CmsSnapshot = Record<DetailKind, Record<Locale, SnapshotEntry[]>>;

/** Listing hub each detail kind lives under. */
export const KIND_ROUTE: Record<DetailKind, CanonicalRoute> = {
  news: 'nyheter',
  tips: 'tips',
  events: 'arrangementer',
  activities: 'aktiviteter',
};

export const DETAIL_KINDS: DetailKind[] = ['news', 'tips', 'events', 'activities'];

const SNAPSHOT_PATH = resolve(process.cwd(), '.cache/cms-content.json');

export const loadSnapshot = (): CmsSnapshot | null => {
  if (!existsSync(SNAPSHOT_PATH)) return null;
  return JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8')) as CmsSnapshot;
};

/** `/nyheter/<slug>` → localized, trailing-slash internal path. */
export const detailPath = (kind: DetailKind, locale: Locale, slug: string): string =>
  normalizeInternalPath(
    `${LOCALE_PREFIX[locale] || ''}/${slugForCanonical(KIND_ROUTE[kind], locale)}/${slug}`,
  );

/**
 * A translation group: the same editorial entry across locales.
 *
 * Entries are generated per locale from the same source list, so the numeric
 * suffix of the id (`news-no-2` / `news-de-2`) identifies the translation.
 */
export interface TranslationGroup {
  kind: DetailKind;
  key: string;
  /** Locale → entry, only for locales that actually have this entry. */
  byLocale: Partial<Record<Locale, SnapshotEntry>>;
}

const groupKeyOf = (entry: SnapshotEntry): string => {
  const m = /-(\d+)$/.exec(entry.id);
  return m ? m[1] : entry.slug;
};

export const buildTranslationGroups = (
  snapshot: CmsSnapshot,
  kind: DetailKind,
): TranslationGroup[] => {
  const groups = new Map<string, TranslationGroup>();
  for (const locale of LOCALES) {
    for (const entry of snapshot[kind][locale] ?? []) {
      const key = groupKeyOf(entry);
      const existing = groups.get(key) ?? { kind, key, byLocale: {} };
      existing.byLocale[locale] = entry;
      groups.set(key, existing);
    }
  }
  return [...groups.values()];
};

/** ISO-8601 date (or datetime) check — mock content carries display strings. */
export const isIsoDate = (v?: string): boolean =>
  !!v && /^\d{4}-\d{2}-\d{2}(T[\d:.+Z-]+)?$/.test(v);

/**
 * Full safe body text where available, capped at ~600 words so a very long
 * CMS body cannot bloat every prerendered file. Falls back to the intro.
 */
export const bodyText = (entry: SnapshotEntry, maxWords = 600): string => {
  const raw = (entry.body ?? entry.intro ?? '').trim();
  if (!raw) return '';
  const words = raw.split(/\s+/);
  if (words.length <= maxWords) return raw;
  return words.slice(0, maxWords).join(' ') + '…';
};
