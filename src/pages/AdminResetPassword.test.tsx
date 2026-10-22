import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ComponentType } from 'react';

const { authMock, fromMock, navigateMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    updateUser: vi.fn(),
    signOut: vi.fn(),
    verifyOtp: vi.fn(),
    mfa: {
      getAuthenticatorAssuranceLevel: vi.fn(),
      listFactors: vi.fn(),
      challengeAndVerify: vi.fn(),
    },
  },
  fromMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: authMock, from: fromMock },
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

const INVALID = 'Denne tilbakestillingslenken er ugyldig eller har utløpt.';
const RECOVERY_HASH = '#access_token=fake-token&refresh_token=fake&expires_in=3600&token_type=bearer&type=recovery';
const session = { user: { id: 'u-1' } };
const withSession = { data: { session } };
const noSession = { data: { session: null } };

/**
 * The component reads the recovery marker at module evaluation, so the URL has
 * to be set before the module is (re-)imported. This is what makes "arrived via
 * a recovery link" distinguishable from "already signed in".
 */
const loadPage = async (hash: string): Promise<ComponentType> => {
  window.location.hash = hash;
  vi.resetModules();
  const mod = await import('./AdminResetPassword');
  return mod.default;
};

const renderPage = (Page: ComponentType) =>
  render(
    <MemoryRouter initialEntries={['/admin/reset-password']}>
      <Page />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  authMock.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });
  authMock.signOut.mockResolvedValue({ error: null });
  // Default: account without MFA.
  authMock.mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({
    data: { currentLevel: 'aal1', nextLevel: 'aal1' },
    error: null,
  });
});

afterEach(() => {
  window.location.hash = '';
});

describe('recovery-session validity (security boundary)', () => {
  it('1. an ordinary authenticated session opening the URL directly is INVALID', async () => {
    // Signed in normally: real session, but no recovery callback and no
    // PASSWORD_RECOVERY event. Must not unlock the form.
    authMock.getSession.mockResolvedValue(withSession);
    const Page = await loadPage('');
    renderPage(Page);

    await waitFor(() => expect(screen.getByText(INVALID)).toBeInTheDocument());
    expect(screen.queryByText('Nytt passord')).toBeNull();
    expect(screen.getByRole('button', { name: 'Be om en ny lenke' })).toBeInTheDocument();
  });

  it('2. a genuine PASSWORD_RECOVERY event is VALID', async () => {
    authMock.getSession.mockResolvedValue(noSession);
    authMock.onAuthStateChange.mockImplementation((cb: (e: string, s: unknown) => void) => {
      cb('PASSWORD_RECOVERY', session);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    const Page = await loadPage('');
    renderPage(Page);

    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());
    expect(screen.getByText('Gjenta nytt passord')).toBeInTheDocument();
  });

  it('3. no session at all is INVALID', async () => {
    authMock.getSession.mockResolvedValue(noSession);
    const Page = await loadPage(RECOVERY_HASH);
    renderPage(Page);

    await waitFor(() => expect(screen.getByText(INVALID)).toBeInTheDocument());
    expect(screen.queryByText('Nytt passord')).toBeNull();
  });

  it('a recovery callback plus an established session is VALID (event-race fallback)', async () => {
    // Covers the case where PASSWORD_RECOVERY fired during client init, before
    // this component could subscribe. The marker proves how the page was entered.
    authMock.getSession.mockResolvedValue(withSession);
    const Page = await loadPage(RECOVERY_HASH);
    renderPage(Page);

    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());
  });

  it('a SIGNED_IN event does not unlock the form', async () => {
    authMock.getSession.mockResolvedValue(withSession);
    authMock.onAuthStateChange.mockImplementation((cb: (e: string, s: unknown) => void) => {
      cb('SIGNED_IN', session);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    const Page = await loadPage('');
    renderPage(Page);

    await waitFor(() => expect(screen.getByText(INVALID)).toBeInTheDocument());
  });

  it('sends the user back to the forgot-password flow for a new link', async () => {
    authMock.getSession.mockResolvedValue(noSession);
    const Page = await loadPage('');
    renderPage(Page);
    await waitFor(() => expect(screen.getByText(INVALID)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Be om en ny lenke' }));
    expect(navigateMock).toHaveBeenCalledWith('/admin/login?reset=1');
  });

  it('exposes no editor content in any state', async () => {
    authMock.getSession.mockResolvedValue(withSession);
    const Page = await loadPage(RECOVERY_HASH);
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());

    expect(screen.queryByText(/innsending/i)).toBeNull();
    expect(screen.queryByText(/Til vurdering/i)).toBeNull();
  });
});

describe('password validation and update', () => {
  let Page: ComponentType;

  beforeEach(async () => {
    authMock.getSession.mockResolvedValue(withSession);
    Page = await loadPage(RECOVERY_HASH);
  });

  const fillAndSubmit = (pw: string, confirm: string) => {
    const inputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(inputs[0], { target: { value: pw } });
    fireEvent.change(inputs[1], { target: { value: confirm } });
    fireEvent.click(screen.getByRole('button', { name: 'Lagre nytt passord' }));
  };

  it('marks both fields required', async () => {
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());
    const inputs = document.querySelectorAll('input[type="password"]');
    expect(inputs).toHaveLength(2);
    inputs.forEach((i) => expect(i).toBeRequired());
  });

  it('rejects mismatched passwords without calling Auth', async () => {
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());
    fillAndSubmit('correct-horse-battery', 'something-else');

    await waitFor(() => expect(screen.getByText('Passordene er ikke like.')).toBeInTheDocument());
    expect(authMock.updateUser).not.toHaveBeenCalled();
  });

  it('updates the password, ends the recovery session, and returns toward login', async () => {
    authMock.updateUser.mockResolvedValue({ data: { user: {} }, error: null });
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());
    fillAndSubmit('correct-horse-battery', 'correct-horse-battery');

    await waitFor(() =>
      expect(screen.getByText('Passordet ditt er oppdatert.')).toBeInTheDocument(),
    );
    expect(authMock.updateUser).toHaveBeenCalledWith({ password: 'correct-horse-battery' });
    expect(authMock.signOut).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Til innlogging' }));
    expect(navigateMock).toHaveBeenCalledWith('/admin/login');
  });

  it('translates a backend policy error without leaking the raw message', async () => {
    authMock.updateUser.mockResolvedValue({
      data: null,
      error: { message: 'Password should be at least 8 characters' },
    });
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());
    fillAndSubmit('short', 'short');

    await waitFor(() =>
      expect(screen.getByText('Passordet er for kort. Velg et lengre passord.')).toBeInTheDocument(),
    );
    expect(screen.queryByText(/Password should be at least/i)).toBeNull();
    expect(authMock.signOut).not.toHaveBeenCalled();
  });
});

describe('scanner-safe token_hash link', () => {
  // Mirrors main.tsx: capture runs before the page module renders.
  const loadWithTokenLink = async (): Promise<ComponentType> => {
    window.history.replaceState(null, '', '/admin/reset-password/#token_hash=th-123&type=recovery');
    vi.resetModules();
    (await import('@/lib/auth/recoveryLink')).captureRecoveryTokenHash();
    const mod = await import('./AdminResetPassword');
    return mod.default;
  };

  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('opening the link does not spend the token', async () => {
    authMock.getSession.mockResolvedValue(noSession);
    const Page = await loadWithTokenLink();
    renderPage(Page);

    expect(screen.getByRole('button', { name: 'Fortsett' })).toBeInTheDocument();
    expect(authMock.verifyOtp).not.toHaveBeenCalled();
    expect(screen.queryByText('Nytt passord')).toBeNull();
    expect(window.location.href).not.toContain('th-123');
  });

  it('"Fortsett" verifies the token and unlocks the form', async () => {
    authMock.verifyOtp.mockResolvedValue({ data: { session, user: session.user }, error: null });
    const Page = await loadWithTokenLink();
    renderPage(Page);

    fireEvent.click(screen.getByRole('button', { name: 'Fortsett' }));

    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());
    expect(authMock.verifyOtp).toHaveBeenCalledWith({ token_hash: 'th-123', type: 'recovery' });
  });

  it('an expired or used token is INVALID', async () => {
    authMock.verifyOtp.mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Email link is invalid or has expired' },
    });
    const Page = await loadWithTokenLink();
    renderPage(Page);

    fireEvent.click(screen.getByRole('button', { name: 'Fortsett' }));

    await waitFor(() => expect(screen.getByText(INVALID)).toBeInTheDocument());
    expect(screen.queryByText('Nytt passord')).toBeNull();
  });
});

describe('accounts with TOTP (aal2 required to change password)', () => {
  const CODE_LABEL = 'Kode fra autentiseringsappen';
  let Page: ComponentType;

  beforeEach(async () => {
    authMock.getSession.mockResolvedValue(withSession);
    authMock.mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({
      data: { currentLevel: 'aal1', nextLevel: 'aal2' },
      error: null,
    });
    authMock.mfa.listFactors.mockResolvedValue({
      data: { all: [{ id: 'f-1', factor_type: 'totp', status: 'verified' }] },
      error: null,
    });
    Page = await loadPage(RECOVERY_HASH);
  });

  const fill = (pw: string, code: string) => {
    const pws = document.querySelectorAll('input[type="password"]');
    fireEvent.change(pws[0], { target: { value: pw } });
    fireEvent.change(pws[1], { target: { value: pw } });
    fireEvent.change(screen.getByLabelText(CODE_LABEL), { target: { value: code } });
    fireEvent.click(screen.getByRole('button', { name: 'Lagre nytt passord' }));
  };

  it('asks for the authenticator code', async () => {
    renderPage(Page);
    expect(await screen.findByLabelText(CODE_LABEL)).toBeInTheDocument();
  });

  it('verifies the code before changing the password', async () => {
    authMock.mfa.challengeAndVerify.mockResolvedValue({ data: {}, error: null });
    authMock.updateUser.mockResolvedValue({ data: { user: {} }, error: null });
    renderPage(Page);
    await screen.findByLabelText(CODE_LABEL);
    fill('correct-horse-battery', '123456');

    await waitFor(() =>
      expect(screen.getByText('Passordet ditt er oppdatert.')).toBeInTheDocument(),
    );
    expect(authMock.mfa.challengeAndVerify).toHaveBeenCalledWith({ factorId: 'f-1', code: '123456' });
    expect(authMock.mfa.challengeAndVerify.mock.invocationCallOrder[0]).toBeLessThan(
      authMock.updateUser.mock.invocationCallOrder[0],
    );
  });

  it('a wrong code does not change the password', async () => {
    authMock.mfa.challengeAndVerify.mockResolvedValue({
      data: null,
      error: { message: 'Invalid TOTP code entered', code: 'mfa_verification_failed' },
    });
    renderPage(Page);
    await screen.findByLabelText(CODE_LABEL);
    fill('correct-horse-battery', '000000');

    await waitFor(() =>
      expect(
        screen.getByText('Koden fra autentiseringsappen stemmer ikke. Prøv igjen.'),
      ).toBeInTheDocument(),
    );
    expect(authMock.updateUser).not.toHaveBeenCalled();
  });

  it('requires a six-digit code before calling Auth', async () => {
    renderPage(Page);
    await screen.findByLabelText(CODE_LABEL);
    fill('correct-horse-battery', '12');

    await waitFor(() =>
      expect(
        screen.getByText('Skriv inn den sekssifrede koden fra autentiseringsappen.'),
      ).toBeInTheDocument(),
    );
    expect(authMock.mfa.challengeAndVerify).not.toHaveBeenCalled();
    expect(authMock.updateUser).not.toHaveBeenCalled();
  });
});

describe('error mapping', () => {
  it('insufficient_aal is not shown as an expired link', async () => {
    authMock.getSession.mockResolvedValue(withSession);
    authMock.updateUser.mockResolvedValue({
      data: null,
      error: {
        message: 'AAL2 session is required to update email or password when MFA is enabled.',
        code: 'insufficient_aal',
      },
    });
    const Page = await loadPage(RECOVERY_HASH);
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());
    const pws = document.querySelectorAll('input[type="password"]');
    fireEvent.change(pws[0], { target: { value: 'correct-horse-battery' } });
    fireEvent.change(pws[1], { target: { value: 'correct-horse-battery' } });
    fireEvent.click(screen.getByRole('button', { name: 'Lagre nytt passord' }));

    await waitFor(() =>
      expect(
        screen.getByText('Skriv inn koden fra autentiseringsappen for å lagre det nye passordet.'),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText(INVALID)).toBeNull();
  });
});

describe('recovery + MFA end to end', () => {
  const CODE_LABEL = 'Kode fra autentiseringsappen';
  const NEEDS_MFA = { data: { currentLevel: 'aal1', nextLevel: 'aal2' }, error: null };
  const TOTP = {
    data: { all: [{ id: 'f-1', factor_type: 'totp', status: 'verified' }] },
    error: null,
  };

  const loadWithTokenLink = async (): Promise<ComponentType> => {
    window.history.replaceState(null, '', '/admin/reset-password/#token_hash=th-9&type=recovery');
    vi.resetModules();
    (await import('@/lib/auth/recoveryLink')).captureRecoveryTokenHash();
    return (await import('./AdminResetPassword')).default;
  };

  const fillPasswords = (pw: string) => {
    const pws = document.querySelectorAll('input[type="password"]');
    fireEvent.change(pws[0], { target: { value: pw } });
    fireEvent.change(pws[1], { target: { value: pw } });
  };
  const save = () => fireEvent.click(screen.getByRole('button', { name: 'Lagre nytt passord' }));

  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('Fortsett → code → password: recovery is verified once and never re-run', async () => {
    authMock.verifyOtp.mockResolvedValue({ data: { session, user: session.user }, error: null });
    authMock.mfa.getAuthenticatorAssuranceLevel.mockResolvedValue(NEEDS_MFA);
    authMock.mfa.listFactors.mockResolvedValue(TOTP);
    authMock.mfa.challengeAndVerify.mockResolvedValue({ data: {}, error: null });
    authMock.updateUser.mockResolvedValue({ data: { user: {} }, error: null });
    const Page = await loadWithTokenLink();
    renderPage(Page);

    fireEvent.click(screen.getByRole('button', { name: 'Fortsett' }));
    fireEvent.change(await screen.findByLabelText(CODE_LABEL), { target: { value: '654321' } });
    fillPasswords('correct-horse-battery');
    save();

    await waitFor(() =>
      expect(screen.getByText('Passordet ditt er oppdatert.')).toBeInTheDocument(),
    );
    expect(authMock.verifyOtp).toHaveBeenCalledTimes(1);
    expect(authMock.mfa.challengeAndVerify).toHaveBeenCalledWith({ factorId: 'f-1', code: '654321' });
    expect(authMock.updateUser).toHaveBeenCalledWith({ password: 'correct-horse-battery' });
    expect(authMock.signOut).toHaveBeenCalled();
    // Stays in the recovery flow: no jump into the editor or the MFA page.
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('a retry after a password error reuses the aal2 session (no second code)', async () => {
    authMock.getSession.mockResolvedValue(withSession);
    authMock.mfa.getAuthenticatorAssuranceLevel.mockResolvedValue(NEEDS_MFA);
    authMock.mfa.listFactors.mockResolvedValue(TOTP);
    authMock.mfa.challengeAndVerify.mockResolvedValue({ data: {}, error: null });
    authMock.updateUser
      .mockResolvedValueOnce({ data: null, error: { message: 'weak', code: 'weak_password' } })
      .mockResolvedValueOnce({ data: { user: {} }, error: null });
    const Page = await loadPage(RECOVERY_HASH);
    renderPage(Page);

    fireEvent.change(await screen.findByLabelText(CODE_LABEL), { target: { value: '111111' } });
    fillPasswords('weakweak');
    save();
    await waitFor(() =>
      expect(screen.getByText('Passordet er for svakt. Velg et sterkere passord.')).toBeInTheDocument(),
    );
    expect(screen.queryByLabelText(CODE_LABEL)).toBeNull();

    fillPasswords('correct-horse-battery');
    save();
    await waitFor(() =>
      expect(screen.getByText('Passordet ditt er oppdatert.')).toBeInTheDocument(),
    );
    expect(authMock.mfa.challengeAndVerify).toHaveBeenCalledTimes(1);
    expect(authMock.updateUser).toHaveBeenCalledTimes(2);
  });

  it('insufficient_aal without a code field reveals the field (fallback)', async () => {
    authMock.getSession.mockResolvedValue(withSession);
    // First lookup misses (e.g. raced); after Auth's refusal the lookup succeeds.
    authMock.mfa.getAuthenticatorAssuranceLevel
      .mockResolvedValueOnce({ data: { currentLevel: 'aal1', nextLevel: 'aal1' }, error: null })
      .mockResolvedValue(NEEDS_MFA);
    authMock.mfa.listFactors.mockResolvedValue(TOTP);
    authMock.updateUser.mockResolvedValue({
      data: null,
      error: {
        message: 'AAL2 session is required to update email or password when MFA is enabled.',
        code: 'insufficient_aal',
      },
    });
    const Page = await loadPage(RECOVERY_HASH);
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());

    fillPasswords('correct-horse-battery');
    save();

    expect(await screen.findByLabelText(CODE_LABEL)).toBeInTheDocument();
    expect(
      screen.getByText('Skriv inn koden fra autentiseringsappen for å lagre det nye passordet.'),
    ).toBeInTheDocument();
    expect(screen.queryByText(INVALID)).toBeNull();
  });

  it('an account without MFA saves without asking for a code', async () => {
    authMock.getSession.mockResolvedValue(withSession);
    authMock.updateUser.mockResolvedValue({ data: { user: {} }, error: null });
    const Page = await loadPage(RECOVERY_HASH);
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());

    fillPasswords('correct-horse-battery');
    save();

    await waitFor(() =>
      expect(screen.getByText('Passordet ditt er oppdatert.')).toBeInTheDocument(),
    );
    expect(screen.queryByLabelText(CODE_LABEL)).toBeNull();
    expect(authMock.mfa.challengeAndVerify).not.toHaveBeenCalled();
  });
});

describe('authorization isolation', () => {
  it('never reads or writes user_roles during recovery', async () => {
    authMock.getSession.mockResolvedValue(withSession);
    authMock.updateUser.mockResolvedValue({ data: { user: {} }, error: null });
    const Page = await loadPage(RECOVERY_HASH);
    renderPage(Page);
    await waitFor(() => expect(screen.getByText('Nytt passord')).toBeInTheDocument());

    const inputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(inputs[0], { target: { value: 'correct-horse-battery' } });
    fireEvent.change(inputs[1], { target: { value: 'correct-horse-battery' } });
    fireEvent.click(screen.getByRole('button', { name: 'Lagre nytt passord' }));

    await waitFor(() =>
      expect(screen.getByText('Passordet ditt er oppdatert.')).toBeInTheDocument(),
    );
    // No table access at all — so no role can be read, added or changed here.
    expect(fromMock).not.toHaveBeenCalled();
  });
});
