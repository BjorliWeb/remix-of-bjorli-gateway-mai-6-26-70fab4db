import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { authMock, mfaMock, rpcMock, fromMock, toastMock } = vi.hoisted(() => ({
  authMock: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    signOut: vi.fn(),
  },
  mfaMock: {},
  rpcMock: vi.fn(),
  fromMock: vi.fn(),
  toastMock: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { ...authMock, mfa: mfaMock }, from: fromMock, rpc: rpcMock },
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: toastMock }) }));

const AdminLogin = (await import('./AdminLogin')).default;

const renderPage = (entry = '/admin/login') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <AdminLogin />
    </MemoryRouter>,
  );

const GENERIC = 'Hvis e-postadressen finnes, har vi sendt en lenke for å tilbakestille passordet.';

beforeEach(() => {
  vi.clearAllMocks();
  authMock.getSession.mockResolvedValue({ data: { session: null } });
  authMock.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
  rpcMock.mockResolvedValue({ data: false, error: null });
});

describe('login page', () => {
  it('still renders the normal login form', async () => {
    renderPage();
    expect(screen.getByText('Redaktørinnlogging')).toBeInTheDocument();
    expect(screen.getByText('Passord')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logg inn' })).toBeInTheDocument();
  });

  it('shows the "Glemt passord?" action', () => {
    renderPage();
    expect(screen.getByRole('button', { name: 'Glemt passord?' })).toBeInTheDocument();
  });

  it('opens the forgot-password view and can go back to login', () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Glemt passord?' }));
    expect(screen.getByText('Tilbakestill passord')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Skriv inn e-postadressen din, så sender vi deg en lenke for å velge et nytt passord.',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tilbake til innlogging' }));
    expect(screen.getByText('Redaktørinnlogging')).toBeInTheDocument();
  });

  it('opens straight into forgot mode when returned from the reset page', () => {
    renderPage('/admin/login?reset=1');
    expect(screen.getByText('Tilbakestill passord')).toBeInTheDocument();
  });
});

describe('reset request', () => {
  const openForgot = () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Glemt passord?' }));
  };

  it('requires an email address', () => {
    openForgot();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toBeRequired();
    expect(input.type).toBe('email');
  });

  it('submits and shows the generic confirmation', async () => {
    openForgot();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send tilbakestillingslenke' }));

    await waitFor(() => expect(screen.getByText(GENERIC)).toBeInTheDocument());
    expect(authMock.resetPasswordForEmail).toHaveBeenCalledWith('someone@example.com', {
      redirectTo: 'https://bjorli.no/admin/reset-password/',
    });
  });

  it('shows an identical message when the address does not exist (no enumeration)', async () => {
    authMock.resetPasswordForEmail.mockResolvedValue({
      data: null,
      error: { message: 'User not found' },
    });
    openForgot();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'nobody@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send tilbakestillingslenke' }));

    await waitFor(() => expect(screen.getByText(GENERIC)).toBeInTheDocument());
    // The raw auth error must never reach the DOM.
    expect(screen.queryByText(/User not found/i)).toBeNull();
  });

  it('handles an API failure without revealing anything', async () => {
    authMock.resetPasswordForEmail.mockRejectedValue(new Error('network down'));
    openForgot();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send tilbakestillingslenke' }));

    await waitFor(() => expect(screen.getByText(GENERIC)).toBeInTheDocument());
    expect(screen.queryByText(/network down/i)).toBeNull();
  });

  it('never touches user_roles or any table while requesting a link', async () => {
    openForgot();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'someone@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send tilbakestillingslenke' }));

    await waitFor(() => expect(screen.getByText(GENERIC)).toBeInTheDocument());
    expect(fromMock).not.toHaveBeenCalled();
  });
});
