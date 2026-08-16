import { describe, expect, it, vi, beforeEach } from 'vitest';

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { rpc: rpcMock } }));

const { resolveTotpState, hasCurrentEditorMfa } = await import('./mfa');

beforeEach(() => vi.clearAllMocks());

describe('resolveTotpState', () => {
  it('challenges when a verified TOTP factor exists', () => {
    expect(
      resolveTotpState([{ id: 'f1', factor_type: 'totp', status: 'verified' }]),
    ).toEqual({ mode: 'challenge', factorId: 'f1' });
  });

  it('enrols when the account has no factors at all', () => {
    expect(resolveTotpState([])).toEqual({ mode: 'enroll', staleFactorIds: [] });
    expect(resolveTotpState(null)).toEqual({ mode: 'enroll', staleFactorIds: [] });
    expect(resolveTotpState(undefined)).toEqual({ mode: 'enroll', staleFactorIds: [] });
  });

  it('does NOT treat an unverified factor as a second factor', () => {
    // An abandoned setup attempt proves nothing — enrol again, and report the
    // leftover so it can be removed before a fresh enrolment.
    expect(
      resolveTotpState([{ id: 'f1', factor_type: 'totp', status: 'unverified' }]),
    ).toEqual({ mode: 'enroll', staleFactorIds: ['f1'] });
  });

  it('prefers the verified factor and leaves unverified leftovers alone', () => {
    expect(
      resolveTotpState([
        { id: 'stale', factor_type: 'totp', status: 'unverified' },
        { id: 'good', factor_type: 'totp', status: 'verified' },
      ]),
    ).toEqual({ mode: 'challenge', factorId: 'good' });
  });

  it('ignores non-TOTP factors', () => {
    // Phone/WebAuthn are not part of this phase; a phone factor must not be
    // mistaken for a usable TOTP factor.
    expect(
      resolveTotpState([{ id: 'p1', factor_type: 'phone', status: 'verified' }]),
    ).toEqual({ mode: 'enroll', staleFactorIds: [] });
  });
});

describe('hasCurrentEditorMfa', () => {
  it('asks the database function, not the client-side AAL', async () => {
    rpcMock.mockResolvedValue({ data: true, error: null });
    await expect(hasCurrentEditorMfa()).resolves.toBe(true);
    expect(rpcMock).toHaveBeenCalledWith('has_current_editor_mfa');
  });

  it('is false when the server says the verification is no longer valid', async () => {
    // e.g. past the 30-day window, or roles changed after the TOTP check.
    rpcMock.mockResolvedValue({ data: false, error: null });
    await expect(hasCurrentEditorMfa()).resolves.toBe(false);
  });

  it('fails closed when the call errors', async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: 'boom' } });
    await expect(hasCurrentEditorMfa()).resolves.toBe(false);
  });

  it('fails closed on anything that is not exactly true', async () => {
    for (const data of [null, undefined, 0, '', 'true']) {
      rpcMock.mockResolvedValue({ data, error: null });
      await expect(hasCurrentEditorMfa()).resolves.toBe(false);
    }
  });
});
