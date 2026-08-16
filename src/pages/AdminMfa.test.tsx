import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const { authMock, mfaMock, fromMock, rpcMock, invokeMock, toastMock, navigateMock } = vi.hoisted(
  () => ({
    authMock: { getSession: vi.fn(), signOut: vi.fn() },
    mfaMock: {
      listFactors: vi.fn(),
      enroll: vi.fn(),
      unenroll: vi.fn(),
      challengeAndVerify: vi.fn(),
    },
    fromMock: vi.fn(),
    rpcMock: vi.fn(),
    invokeMock: vi.fn(),
    toastMock: vi.fn(),
    navigateMock: vi.fn(),
  }),
);

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { ...authMock, mfa: mfaMock },
    from: fromMock,
    rpc: rpcMock,
    functions: { invoke: invokeMock },
  },
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: toastMock }) }));
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<typeof import('react-router-dom')>('react-router-dom')),
  useNavigate: () => navigateMock,
}));

const AdminMfa = (await import('./AdminMfa')).default;

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/admin/mfa']}>
      <AdminMfa />
    </MemoryRouter>,
  );

/** `from('user_roles').select().eq()` resolving to the given roles. */
const mockRoles = (roles: string[]) =>
  fromMock.mockReturnValue({
    select: () => ({ eq: () => Promise.resolve({ data: roles.map((role) => ({ role })), error: null }) }),
  });

const session = { data: { session: { user: { id: 'u1' } } } };

beforeEach(() => {
  vi.clearAllMocks();
  authMock.getSession.mockResolvedValue(session);
  authMock.signOut.mockResolvedValue({ error: null });
  rpcMock.mockResolvedValue({ data: false, error: null });
  invokeMock.mockResolvedValue({
    data: { masked_email: 'ma***@bjorli.no', cooldown_seconds: 60 },
    error: null,
  });
  mfaMock.listFactors.mockResolvedValue({ data: { all: [] }, error: null });
  mfaMock.unenroll.mockResolvedValue({ data: {}, error: null });
  mfaMock.enroll.mockResolvedValue({
    data: { id: 'new-factor', totp: { qr_code: 'data:image/svg+xml;utf-8,<svg/>', secret: 'ABC123' } },
    error: null,
  });
  mockRoles(['admin']);
});

describe('access control', () => {
  it('sends a signed-out visitor back to login and never enrols', async () => {
    authMock.getSession.mockResolvedValue({ data: { session: null } });
    renderPage();
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/admin/login', { replace: true }));
    expect(mfaMock.enroll).not.toHaveBeenCalled();
  });

  it('signs out a plain user — normal accounts never enter the MFA flow', async () => {
    mockRoles(['user']);
    renderPage();
    await waitFor(() => expect(authMock.signOut).toHaveBeenCalled());
    expect(mfaMock.enroll).not.toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/admin/login', { replace: true });
  });

  it('lets a moderator in — the editor role, not just admin', async () => {
    mockRoles(['moderator']);
    renderPage();
    await waitFor(() => expect(mfaMock.enroll).toHaveBeenCalled());
    expect(authMock.signOut).not.toHaveBeenCalled();
  });

  it('skips straight to the editor when the server says MFA is still valid', async () => {
    rpcMock.mockResolvedValue({ data: true, error: null });
    renderPage();
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/admin/innsendinger', { replace: true }),
    );
    expect(mfaMock.enroll).not.toHaveBeenCalled();
  });
});

describe('enrolment', () => {
  it('shows the QR code and the manual secret', async () => {
    renderPage();
    expect(await screen.findByText('Sett opp to-trinns innlogging')).toBeInTheDocument();
    expect(screen.getByAltText('QR-kode for autentiseringsapp')).toHaveAttribute(
      'src',
      'data:image/svg+xml;utf-8,<svg/>',
    );
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  it('removes an abandoned unverified factor before enrolling again', async () => {
    mfaMock.listFactors.mockResolvedValue({
      data: { all: [{ id: 'stale', factor_type: 'totp', status: 'unverified' }] },
      error: null,
    });
    renderPage();
    await waitFor(() => expect(mfaMock.unenroll).toHaveBeenCalledWith({ factorId: 'stale' }));
    expect(mfaMock.enroll).toHaveBeenCalled();
  });

  it('reports unavailability instead of a broken form when enrolment fails', async () => {
    mfaMock.enroll.mockResolvedValue({ data: null, error: { message: 'nope' } });
    renderPage();
    expect(await screen.findByText('To-trinns innlogging er ikke tilgjengelig')).toBeInTheDocument();
  });
});

describe('challenge', () => {
  beforeEach(() => {
    mfaMock.listFactors.mockResolvedValue({
      data: { all: [{ id: 'f1', factor_type: 'totp', status: 'verified' }] },
      error: null,
    });
  });

  it('asks for a code instead of enrolling when a factor already exists', async () => {
    renderPage();
    expect(await screen.findByText('Bekreft at det er deg')).toBeInTheDocument();
    expect(mfaMock.enroll).not.toHaveBeenCalled();
  });

  it('verifies and continues to the editor once the server confirms it', async () => {
    mfaMock.challengeAndVerify.mockResolvedValue({ data: {}, error: null });
    rpcMock
      .mockResolvedValueOnce({ data: false, error: null }) // initial gate
      .mockResolvedValueOnce({ data: true, error: null }); // after verify

    renderPage();
    await screen.findByText('Bekreft at det er deg');
    fireEvent.change(screen.getByLabelText('Sekssifret kode'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() =>
      expect(mfaMock.challengeAndVerify).toHaveBeenCalledWith({ factorId: 'f1', code: '123456' }),
    );
    await waitFor(() =>
      expect(navigateMock).toHaveBeenCalledWith('/admin/innsendinger', { replace: true }),
    );
  });

  it('does NOT continue when verify succeeds but the server still says no', async () => {
    // The RPC — not aal2 — is the gate, so a session the server rejects must
    // never reach the editor even though challengeAndVerify returned no error.
    mfaMock.challengeAndVerify.mockResolvedValue({ data: {}, error: null });
    rpcMock.mockResolvedValue({ data: false, error: null });

    renderPage();
    await screen.findByText('Bekreft at det er deg');
    fireEvent.change(screen.getByLabelText('Sekssifret kode'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() => expect(mfaMock.challengeAndVerify).toHaveBeenCalled());
    expect(navigateMock).not.toHaveBeenCalledWith('/admin/innsendinger', { replace: true });
  });

  it('shows one generic message on a wrong code and clears the field', async () => {
    mfaMock.challengeAndVerify.mockResolvedValue({ data: null, error: { message: 'invalid totp' } });

    renderPage();
    await screen.findByText('Bekreft at det er deg');
    const input = screen.getByLabelText('Sekssifret kode');
    fireEvent.change(input, { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Koden stemmer ikke' }),
      ),
    );
    // The raw Auth error must not reach the user.
    expect(screen.queryByText(/invalid totp/i)).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('only accepts six digits', async () => {
    renderPage();
    await screen.findByText('Bekreft at det er deg');
    const input = screen.getByLabelText('Sekssifret kode');
    fireEvent.change(input, { target: { value: '12a3' } });
    expect(input).toHaveValue('123');
    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeDisabled();
  });
});

describe('email code as an alternative factor', () => {
  beforeEach(() => {
    mfaMock.listFactors.mockResolvedValue({
      data: { all: [{ id: 'f1', factor_type: 'totp', status: 'verified' }] },
      error: null,
    });
  });

  const switchToEmail = async () => {
    renderPage();
    await screen.findByText('Bekreft at det er deg');
    fireEvent.click(screen.getByRole('button', { name: 'Send kode på e-post i stedet' }));
  };

  it('does not send anything until the editor asks for it', async () => {
    await switchToEmail();
    expect(invokeMock).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Send kode' })).toBeInTheDocument();
  });

  it('sends the code and shows only a masked address', async () => {
    await switchToEmail();
    fireEvent.click(screen.getByRole('button', { name: 'Send kode' }));
    await waitFor(() => expect(invokeMock).toHaveBeenCalledWith('mfa-email-send', { body: {} }));
    expect(await screen.findByText(/ma\*\*\*@bjorli\.no/)).toBeInTheDocument();
  });

  it('verifies through the database function, not the TOTP path', async () => {
    rpcMock.mockImplementation((fn: string) =>
      Promise.resolve({ data: fn === 'verify_editor_email_code', error: null }),
    );
    await switchToEmail();
    fireEvent.click(screen.getByRole('button', { name: 'Send kode' }));
    await screen.findByText(/ma\*\*\*@bjorli\.no/);

    fireEvent.change(screen.getByLabelText('Sekssifret kode'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() =>
      expect(rpcMock).toHaveBeenCalledWith('verify_editor_email_code', { _code: '123456' }),
    );
    expect(mfaMock.challengeAndVerify).not.toHaveBeenCalled();
  });

  it('shows one generic message for a bad email code', async () => {
    rpcMock.mockResolvedValue({ data: false, error: null });
    await switchToEmail();
    fireEvent.click(screen.getByRole('button', { name: 'Send kode' }));
    await screen.findByText(/ma\*\*\*@bjorli\.no/);

    fireEvent.change(screen.getByLabelText('Sekssifret kode'), { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: 'Bekreft' }));

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Koden stemmer ikke' }),
      ),
    );
    expect(navigateMock).not.toHaveBeenCalledWith('/admin/innsendinger', { replace: true });
  });

  it('reports a rate limit without pretending the code was sent', async () => {
    invokeMock.mockResolvedValue({
      data: null,
      error: { context: { json: async () => ({ error: 'rate_limited' }) } },
    });
    await switchToEmail();
    fireEvent.click(screen.getByRole('button', { name: 'Send kode' }));

    await waitFor(() =>
      expect(toastMock).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Vent litt før du prøver igjen' }),
      ),
    );
    expect(screen.queryByText(/ma\*\*\*@bjorli\.no/)).not.toBeInTheDocument();
  });

  it('can switch back to the authenticator app', async () => {
    await switchToEmail();
    fireEvent.click(screen.getByRole('button', { name: 'Bruk autentiseringsapp i stedet' }));
    expect(await screen.findByText('Bekreft at det er deg')).toBeInTheDocument();
  });
});
