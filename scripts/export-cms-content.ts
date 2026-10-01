/**
 * Build-time CMS export.
 *
 * The prerenderer and the sitemap generator are plain Node scripts, but the
 * CMS layer (`src/lib/cms/*`) is application code: it uses the `@/` alias,
 * imports image assets (.jpg/.avif) and the Supabase client. Instead of
 * duplicating content, we load the CMS adapter through Vite's SSR module
 * runner — the exact same resolution pipeline the app uses — and write a
 * Node-safe JSON snapshot.
 *
 * Output: .cache/cms-content.json
 *
 * SEO contract: editorial content AND admin-approved events
 * (`submission-*`, status = approved, read via the public allowlisted
 * `list-approved-events` function) are exported, so the listing, prerendered
 * HTML and sitemap share one publication rule. Unapproved/withdrawn events
 * are absent. Finished events are flagged `archived` (noindex, no sitemap).
 * If the approved feed cannot be read the export FAILS, so Cloudflare keeps
 * the previous deployment instead of publishing a build missing events.
 * Signed image URLs (1 h) and submitter email are never written to HTML.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer } from 'vite';

const LOCALES = ['no', 'en', 'de', 'nl', 'da', 'sv'] as const;
type Loc = (typeof LOCALES)[number];

export interface ExportedEntry {
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
  /** Editorial CTA label for detail pages (e.g. Early Bird purchase). */
  ctaLabel?: string;
  /** Editorial CTA href — may be internal or external. */
  ctaHref?: string;
  /** Finished event: prerendered and linked, but never sitemapped. */
  archived?: boolean;
}

export type ExportedKind = 'news' | 'tips' | 'events' | 'activities';
export type CmsSnapshot = Record<ExportedKind, Record<Loc, ExportedEntry[]>>;

const OUT = resolve(process.cwd(), '.cache/cms-content.json');

const pick = (e: Record<string, unknown>): ExportedEntry => ({
  id: String(e.id ?? ''),
  slug: String(e.slug ?? ''),
  title: String(e.title ?? ''),
  intro: (e.intro as string) || undefined,
  body: (e.body as string) || undefined,
  category: (e.category as string) || undefined,
  publishedAt: (e.publishedAt as string) || undefined,
  updatedAt: (e.updatedAt as string) || undefined,
  startsAt: (e.startsAt as string) || undefined,
  endsAt: (e.endsAt as string) || undefined,
  location: (e.location as string) || undefined,
  image: ((e.heroImage as { url?: string } | undefined)?.url) || undefined,
  seoTitle: (e.seoTitle as string) || undefined,
  seoDescription: (e.seoDescription as string) || undefined,
  ctaLabel: (e.ctaLabel as string) || undefined,
  ctaHref: (e.ctaHref as string) || undefined,
});

/** Any entry with a slug; signed (expiring) submission images are dropped. */
const isEditorial = (e: ExportedEntry): boolean => !!e.slug;
const stripVolatile = (e: ExportedEntry): ExportedEntry =>
  e.id.startsWith('submission-') ? { ...e, image: undefined } : e;

const run = async () => {
  // The Supabase browser client (imported transitively by the CMS adapter)
  // touches `localStorage` at module scope. Provide an inert in-memory shim
  // so the module can be evaluated in Node. No network call is made here:
  // only editorial content is read, and any Supabase fetch failure is
  // caught by the adapter itself.
  if (typeof (globalThis as { localStorage?: unknown }).localStorage === 'undefined') {
    const store = new Map<string, string>();
    (globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
      key: (i: number) => Array.from(store.keys())[i] ?? null,
      get length() {
        return store.size;
      },
    };
  }

  const server = await createServer({
    configFile: resolve(process.cwd(), 'vite.config.ts'),
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    logLevel: 'warn',
  });

  try {
    const mod = (await server.ssrLoadModule('/src/lib/cms/mockAdapter.ts')) as {
      submissionFetchStatus: { errors: number };
      mockAdapter: {
        getNews: (q: { language: string }) => Promise<Record<string, unknown>[]>;
        getTips: (q: { language: string }) => Promise<Record<string, unknown>[]>;
        getEvents: (q: { language: string }) => Promise<Record<string, unknown>[]>;
        getArchivedEvents: (q: { language: string }) => Promise<Record<string, unknown>[]>;
        getActivities: (q: { language: string }) => Promise<Record<string, unknown>[]>;
      };
    };
    const adapter = mod.mockAdapter;

    const empty = () =>
      Object.fromEntries(LOCALES.map((l) => [l, [] as ExportedEntry[]])) as Record<Loc, ExportedEntry[]>;
    const snapshot: CmsSnapshot = {
      news: empty(),
      tips: empty(),
      events: empty(),
      activities: empty(),
    };

    for (const language of LOCALES) {
      const [news, tips, events, archivedEvents, activities] = await Promise.all([
        adapter.getNews({ language }),
        adapter.getTips({ language }),
        adapter.getEvents({ language }),
        adapter.getArchivedEvents({ language }),
        adapter.getActivities({ language }),
      ]);
      snapshot.news[language] = news.map(pick).filter(isEditorial);
      snapshot.tips[language] = tips.map(pick).filter(isEditorial);
      // Archived events keep a prerendered page (old links must work) but are
      // flagged so the sitemap generator can leave them out.
      snapshot.events[language] = [
        ...events.map(pick),
        ...archivedEvents.map((e) => ({ ...pick(e), archived: true })),
      ].filter(isEditorial).map(stripVolatile);
      snapshot.activities[language] = activities.map(pick).filter(isEditorial);
    }

    if (mod.submissionFetchStatus.errors > 0 && process.env.ALLOW_MISSING_EVENTS !== '1') {
      throw new Error(
        `approved events could not be read (${mod.submissionFetchStatus.errors} failed requests); ` +
          'refusing to build without them (set ALLOW_MISSING_EVENTS=1 to override locally)',
      );
    }
    const subs = LOCALES.reduce(
      (n, l) => n + snapshot.events[l].filter((e) => e.id.startsWith('submission-')).length, 0);
    // eslint-disable-next-line no-console
    console.log(`[cms-export] approved admin events included: ${subs}`);

    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify(snapshot, null, 2), 'utf8');

    const counts = (Object.keys(snapshot) as ExportedKind[])
      .map((k) => `${k}=${snapshot[k].no.length}`)
      .join(', ');
    // eslint-disable-next-line no-console
    console.log(`[cms-export] .cache/cms-content.json written (NO counts: ${counts}).`);
  } finally {
    await server.close();
  }
};

run().catch((err) => {
  console.error('[cms-export] failed:', err);
  process.exit(1);
});
