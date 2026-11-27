import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ContentDetailPage from './ContentDetailPage';

const loaders = vi.hoisted(() => ({ events: vi.fn(), archived: vi.fn() }));
vi.mock('@/lib/cms', async () => ({
  useCms: (await import('@/lib/cms/useCms')).useCms,
  getEvents: loaders.events,
  getArchivedEvents: loaders.archived,
  getTips: vi.fn(), getNews: vi.fn(), getActivities: vi.fn(),
}));
vi.mock('@/i18n/LanguageContext', () => ({
  useLanguage: () => ({ locale: 'no', d: { listing: { pageEventsTitle: 'Arrangementer' } } }),
}));
vi.mock('@/components/listing/ContentDetailTemplate', () => ({
  default: ({ item }: { item: { title: string } | null }) => <h1>{item?.title ?? 'Ikke funnet'}</h1>,
}));

afterEach(cleanup);

function openEvent() {
  return render(<MemoryRouter initialEntries={['/arrangementer/test/']}>
    <Routes><Route path="/arrangementer/:slug/" element={<ContentDetailPage kind="events" />} /></Routes>
  </MemoryRouter>);
}

describe('ContentDetailPage async CMS state', () => {
  it('does not claim that a published event is missing while its request is pending', async () => {
    let finish!: (items: unknown[]) => void;
    loaders.events.mockReturnValue(new Promise(resolve => { finish = resolve; }));
    loaders.archived.mockResolvedValue([]);
    const { container } = openEvent();
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(screen.queryByText('Ikke funnet')).not.toBeInTheDocument();
    await act(async () => finish([{ id: 'test', slug: 'test', title: 'Pray for Snow', startsAt: '2026-11-28' }]));
    expect(screen.getByRole('heading', { name: 'Pray for Snow' })).toBeInTheDocument();
    expect(container.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it('still renders the missing-page state after both event streams resolve empty', async () => {
    loaders.events.mockResolvedValue([]);
    loaders.archived.mockResolvedValue([]);
    openEvent();
    expect(await screen.findByRole('heading', { name: 'Ikke funnet' })).toBeInTheDocument();
  });
});
