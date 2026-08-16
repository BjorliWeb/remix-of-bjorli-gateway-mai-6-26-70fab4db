import { describe, expect, it, vi, beforeEach } from 'vitest';

const { rpcMock, invokeMock } = vi.hoisted(() => ({ rpcMock: vi.fn(), invokeMock: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { rpc: rpcMock, functions: { invoke: invokeMock } },
}));

const { resolveTotpState, hasCurrentEditorMfa, sendEditorEmailCode, verifyEditorEmailCode } =
  await import('./mfa');

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

describe('sendEditorEmailCode', () => {
  it('returns the masked address and cooldown on success', async () => {
    invokeMock.mockResolvedValue({
      data: { masked_email: 'ma***@bjorli.no', cooldown_seconds: 60 },
      error: null,
    });
    await expect(sendEditorEmailCode()).resolves.toEqual({
      ok: true,
      maskedEmail: 'ma***@bjorli.no',
      cooldownSeconds: 60,
    });
  });

  it('never exposes the code itself', async () => {
    // The function returns only what the UI may show. If a code ever appears
    // in this payload the email factor has stopped proving inbox control.
    invokeMock.mockResolvedValue({
      data: { masked_email: 'ma***@bjorli.no', cooldown_seconds: 60 },
      error: null,
    });
    const result = await sendEditorEmailCode();
    expect(JSON.stringify(result)).not.toMatch(/\d{6}/);
  });

  it('surfaces a cooldown with its retry window', async () => {
    invokeMock.mockResolvedValue({
      data: null,
      error: { context: { json: async () => ({ error: 'cooldown', retry_after: 42 }) } },
    });
    await expect(sendEditorEmailCode()).resolves.toEqual({
      ok: false,
      reason: 'cooldown',
      retryAfter: 42,
    });
  });

  it('surfaces the hourly cap', async () => {
    invokeMock.mockResolvedValue({
      data: null,
      error: { context: { json: async () => ({ error: 'rate_limited' }) } },
    });
    await expect(sendEditorEmailCode()).resolves.toMatchObject({ ok: false, reason: 'rate_limited' });
  });

  it('falls back to a generic failure when the body cannot be read', async () => {
    invokeMock.mockResolvedValue({
      data: null,
      error: { context: { json: async () => { throw new Error('not json'); } } },
    });
    await expect(sendEditorEmailCode()).resolves.toMatchObject({ ok: false, reason: 'unavailable' });
  });

  it('falls back to a generic failure when there is no response context', async () => {
    invokeMock.mockResolvedValue({ data: null, error: { message: 'network' } });
    await expect(sendEditorEmailCode()).resolves.toMatchObject({ ok: false, reason: 'unavailable' });
  });
});

describe('verifyEditorEmailCode', () => {
  it('passes the code to the database function', async () => {
    rpcMock.mockResolvedValue({ data: true, error: null });
    await expect(verifyEditorEmailCode('123456')).resolves.toBe(true);
    expect(rpcMock).toHaveBeenCalledWith('verify_editor_email_code', { _code: '123456' });
  });

  it('is false for a wrong, expired or replayed code', async () => {
    rpcMock.mockResolvedValue({ data: false, error: null });
    await expect(verifyEditorEmailCode('000000')).resolves.toBe(false);
  });

  it('fails closed on error and on anything that is not exactly true', async () => {
    rpcMock.mockResolvedValue({ data: null, error: { message: 'boom' } });
    await expect(verifyEditorEmailCode('123456')).resolves.toBe(false);
    rpcMock.mockResolvedValue({ data: 'true', error: null });
    await expect(verifyEditorEmailCode('123456')).resolves.toBe(false);
  });
});
