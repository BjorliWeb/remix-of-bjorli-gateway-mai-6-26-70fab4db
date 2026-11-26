// Runs Edge Function tests in Node with a fake Supabase client. No network.
// Run: npx vitest run --config scripts/security/functions/vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, '../../..'),
  test: {
    environment: 'node',
    include: ['scripts/security/functions/**/*.test.ts'],
  },
  resolve: {
    alias: [
      { find: /^npm:@supabase\/supabase-js@2\/cors$/, replacement: path.resolve(__dirname, 'fakeCors.ts') },
      { find: /^npm:@supabase\/supabase-js@2$/, replacement: path.resolve(__dirname, 'fakeSupabase.ts') },
      { find: /^npm:zod@3$/, replacement: 'zod' },
    ],
  },
});
