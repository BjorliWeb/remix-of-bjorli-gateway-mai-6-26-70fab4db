import { describe, expect, it } from 'vitest';
import {
  RECOVERY_MAX_AGE_SECONDS,
  isFreshRecoverySession,
} from '../../../supabase/functions/reset-password/recoverySession';

// Tests for the reset-password edge function's session gate. Lives under src/
// because vitest only collects tests there.
const NOW = 1_800_000_000;

describe('isFreshRecoverySession', () => {
  it('accepts a fresh session from a reset link (verifyOtp issues amr "otp")', () => {
    expect(isFreshRecoverySession([{ method: 'otp', timestamp: NOW - 60 }], NOW)).toBe(true);
  });

  it('accepts the PKCE "recovery" and "magiclink" methods', () => {
    expect(isFreshRecoverySession([{ method: 'recovery', timestamp: NOW }], NOW)).toBe(true);
    expect(isFreshRecoverySession([{ method: 'magiclink', timestamp: NOW }], NOW)).toBe(true);
  });

  it('refuses a password sign-in (knowing the password is not enough)', () => {
    expect(isFreshRecoverySession([{ method: 'password', timestamp: NOW }], NOW)).toBe(false);
  });

  it('refuses a password + TOTP session without a mailbox proof', () => {
    expect(
      isFreshRecoverySession(
        [
          { method: 'totp', timestamp: NOW },
          { method: 'password', timestamp: NOW },
        ],
        NOW,
      ),
    ).toBe(false);
  });

  it('accepts a reset session that also completed MFA', () => {
    expect(
      isFreshRecoverySession(
        [
          { method: 'totp', timestamp: NOW },
          { method: 'otp', timestamp: NOW - 120 },
        ],
        NOW,
      ),
    ).toBe(true);
  });

  it('refuses a reset session older than the limit', () => {
    const old = NOW - RECOVERY_MAX_AGE_SECONDS - 1;
    expect(isFreshRecoverySession([{ method: 'otp', timestamp: old }], NOW)).toBe(false);
  });

  it('refuses malformed amr', () => {
    expect(isFreshRecoverySession(undefined, NOW)).toBe(false);
    expect(isFreshRecoverySession(['otp'], NOW)).toBe(false);
    expect(isFreshRecoverySession([{ method: 'otp' }], NOW)).toBe(false);
    expect(isFreshRecoverySession([{ method: 'otp', timestamp: NOW + 3600 }], NOW)).toBe(false);
  });
});
