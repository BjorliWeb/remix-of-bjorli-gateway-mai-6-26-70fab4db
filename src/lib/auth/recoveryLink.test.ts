import { afterEach, describe, expect, it, vi } from 'vitest';

const load = async (url: string) => {
  window.history.replaceState(null, '', url);
  vi.resetModules();
  const mod = await import('./recoveryLink');
  mod.captureRecoveryTokenHash();
  return mod;
};

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('captureRecoveryTokenHash', () => {
  it('captures a recovery token_hash from the fragment and strips it from the URL', async () => {
    const mod = await load('/admin/reset-password/#token_hash=abc&type=recovery');
    expect(mod.getRecoveryTokenHash()).toBe('abc');
    expect(window.location.href).not.toContain('abc');
    expect(window.location.pathname).toBe('/admin/reset-password/');
    expect(window.location.hash).toBe('');
  });

  it('also accepts the query-string form and keeps unrelated params', async () => {
    const mod = await load('/admin/reset-password?token_hash=abc&type=recovery&x=1');
    expect(mod.getRecoveryTokenHash()).toBe('abc');
    expect(window.location.search).toBe('?x=1');
  });

  it('strips but ignores a token_hash of another type', async () => {
    const mod = await load('/admin/reset-password/#token_hash=abc&type=signup');
    expect(mod.getRecoveryTokenHash()).toBeNull();
    expect(window.location.href).not.toContain('abc');
  });

  it('does nothing on other routes', async () => {
    const mod = await load('/vaer#token_hash=abc&type=recovery');
    expect(mod.getRecoveryTokenHash()).toBeNull();
    expect(window.location.hash).toBe('#token_hash=abc&type=recovery');
  });

  it('leaves the legacy #access_token callback alone for auth-js', async () => {
    const mod = await load('/admin/reset-password/#access_token=t&type=recovery');
    expect(mod.getRecoveryTokenHash()).toBeNull();
    expect(window.location.hash).toBe('#access_token=t&type=recovery');
  });

  it('forgets the token once cleared', async () => {
    const mod = await load('/admin/reset-password/#token_hash=abc&type=recovery');
    mod.clearRecoveryTokenHash();
    expect(mod.getRecoveryTokenHash()).toBeNull();
  });
});
