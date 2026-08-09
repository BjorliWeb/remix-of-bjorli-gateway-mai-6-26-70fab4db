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
 * IMPORTANT (SEO contract): only editorial CMS content is exported. Approved
 * user submissions coming from Supabase at runtime (`submission-*` ids) are
 * deliberately excluded — they must never get a prerendered, sitemap-listed
 * detail URL. Their detail pages are marked noindex at runtime instead
 * (see src/lib/cms/seo.ts).
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
});

/** Editorial entries only — runtime Supabase submissions are excluded. */
const isEditorial = (e: ExportedEntry): boolean =>
  !!e.slug && !e.id.startsWith('submission-');

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
      mockAdapter: {
        getNews: (q: { language: string }) => Promise<Record<string, unknown>[]>;
        getTips: (q: { language: string }) => Promise<Record<string, unknown>[]>;
        getEvents: (q: { language: string }) => Promise<Record<string, unknown>[]>;
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
      const [news, tips, events, activities] = await Promise.all([
        adapter.getNews({ language }),
        adapter.getTips({ language }),
        adapter.getEvents({ language }),
        adapter.getActivities({ language }),
      ]);
      snapshot.news[language] = news.map(pick).filter(isEditorial);
      snapshot.tips[language] = tips.map(pick).filter(isEditorial);
      snapshot.events[language] = events.map(pick).filter(isEditorial);
      snapshot.activities[language] = activities.map(pick).filter(isEditorial);
    }

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
