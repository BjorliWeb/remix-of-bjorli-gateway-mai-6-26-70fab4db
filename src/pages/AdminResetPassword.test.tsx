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
