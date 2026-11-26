// Stand-in for `npm:@supabase/supabase-js@2` in function tests (see vitest.config.ts here).
export const createClient = (...args: unknown[]) =>
  (globalThis as unknown as { __fakeClient: (...a: unknown[]) => unknown }).__fakeClient(...args);
