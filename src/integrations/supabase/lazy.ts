/**
 * Lazy access to the public Supabase client.
 *
 * The Supabase SDK (auth, realtime, storage, postgrest) is ~500 KB of
 * JavaScript. Public pages only need it for background data (status rows,
 * alerts, approved events, SEO overrides, weather), so it loads as its own
 * chunk after first paint instead of blocking the main bundle.
 *
 * Same client instance and same keys as `./client` — this only changes
 * *when* the module is downloaded, not how it behaves. Admin pages keep
 * importing `./client` directly.
 */
import type { supabase as SupabaseClient } from './client';

let clientPromise: Promise<typeof SupabaseClient> | null = null;

export function loadSupabase(): Promise<typeof SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('./client').then((m) => m.supabase);
  }
  return clientPromise;
}
