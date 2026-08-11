import { describe, expect, it } from 'vitest';
import { isInternalNoindexPath } from './internalRoutes';

describe('isInternalNoindexPath', () => {
  it('matches internal/admin routes with or without trailing slash', () => {
    for (const p of [
      '/admin',
      '/admin/login',
      '/admin/login/',
      '/admin/innsendinger',
      '/admin/innsendinger/',
      '/hero-compare',
      '/hero-compare/',
      '/image-inventory',
      '/image-inventory/',
    ]) {
      expect(isInternalNoindexPath(p), p).toBe(true);
    }
  });

  it('does not match public routes', () => {
    for (const p of [
      '/',
      '/vinter/',
      '/en/winter/',
      '/sv/liftkort/',
      '/de/skischule/',
      '/administrasjon/',
      '/nyheter/hero-compare-noe/',
    ]) {
      expect(isInternalNoindexPath(p), p).toBe(false);
    }
  });
});
