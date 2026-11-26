import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LanguageContext } from '@/i18n/languageContextCore';
import { dictionaries, translations } from '@/i18n/translations';

const { update, invoke } = vi.hoisted(() => ({ update: vi.fn(), invoke: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: () => ({
      update: (patch: Record<string, unknown>) => {
        update(patch);
        return { eq: () => ({ select: async () => ({ data: [{ id: 'x' }], error: null }) }) };
      },
    }),
    storage: { from: () => ({ upload: vi.fn(), remove: vi.fn() }) },
    functions: { invoke },
    rpc: vi.fn(async () => ({ data: true, error: null })),
  },
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

const { EventSubmissionEditForm } = await import('./EventSubmissionEditForm');

const item = {
  id: '00000000-0000-4000-8000-000000000001',
  status: 'pending' as const,
  title: 'Konsert på Bjorli', summary: null, description: 'En lang nok beskrivelse av arrangementet.',
  organizer: 'Bjorli IL', start_date: '2099-02-01', end_date: null, time_text: null, location: 'Bjorli',
  maps_url: null, website: 'https://arrangor.example.no', ticket_url: null, registration_url: 'https://meld.example.no/',
  category: 'konsert', categories: ['konsert'], image_urls: [], english_approved: false,
};

const renderForm = (overrides = {}) =>
  render(
    <LanguageContext.Provider value={{ locale: 'no', setLocale: () => {}, d: dictionaries.no, t: translations.no as never }}>
      <EventSubmissionEditForm item={{ ...item, ...overrides }} signedUrls={{}} onCancel={() => {}} onSaved={() => {}} onDirtyChange={() => {}} />
    </LanguageContext.Provider>,
  );

beforeEach(() => { update.mockReset(); invoke.mockReset(); invoke.mockResolvedValue({ error: null }); });

describe('editor: action links in /admin/innsendinger', () => {
  it('shows the submitted links, marked optional, with help texts', () => {
    renderForm();
    expect(screen.getByLabelText('Nettside (valgfritt)')).toHaveValue('https://arrangor.example.no');
    expect(screen.getByLabelText('Kjøp billett (valgfritt)')).toHaveValue('');
    expect(screen.getByLabelText('Påmelding (valgfritt)')).toHaveValue('https://meld.example.no/');
    expect(screen.getByText('Lenke direkte til billettkjøp.')).toBeInTheDocument();
    expect(screen.getByText('Lenke direkte til påmeldingsskjema eller registrering.')).toBeInTheDocument();
  });

  it('live preview follows the typed links (order, primary style, new tab)', () => {
    const { container } = renderForm();
    const preview = () => [...container.querySelectorAll('[data-event-action]')];
    expect(preview().map((a) => a.getAttribute('data-event-action'))).toEqual(['registration', 'website']);
    fireEvent.change(screen.getByLabelText('Kjøp billett (valgfritt)'), { target: { value: 'billett.example.no/kjop' } });
    expect(preview().map((a) => a.getAttribute('data-event-action'))).toEqual(['ticket', 'registration', 'website']);
    expect(preview()[0]).toHaveAttribute('href', 'https://billett.example.no/kjop');
    expect(preview()[0]).toHaveAttribute('target', '_blank');
    expect(preview()[0].className).toContain('bg-primary');
    // An unsafe link never shows up in the preview.
    fireEvent.change(screen.getByLabelText('Kjøp billett (valgfritt)'), { target: { value: 'javascript:alert(1)' } });
    expect(preview().map((a) => a.getAttribute('data-event-action'))).toEqual(['registration', 'website']);
  });

  it('add, change and remove are saved; status is never written', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Kjøp billett (valgfritt)'), { target: { value: 'https://billett.example.no/' } });
    fireEvent.change(screen.getByLabelText('Påmelding (valgfritt)'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /lagre/i }));
    await waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    const patch = update.mock.calls[0][0];
    expect(patch.ticket_url).toBe('https://billett.example.no/');
    expect(patch.registration_url).toBeNull();
    expect(patch.website).toBe('https://arrangor.example.no'); // unchanged value kept as stored
    expect(patch).not.toHaveProperty('status');
  });

  it('rejects an unsafe link with a visible error and saves nothing', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Påmelding (valgfritt)'), { target: { value: 'data:text/html,x' } });
    fireEvent.click(screen.getByRole('button', { name: /lagre/i }));
    expect(await screen.findByText('Bruk en gyldig lenke som starter med http:// eller https://')).toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
  });
});
