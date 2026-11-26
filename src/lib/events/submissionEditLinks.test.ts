import { describe, expect, it } from 'vitest';
import { buildEditUpdate, EDITABLE_COLUMNS, LINK_ERROR, submissionEditSchema } from './submissionEdit';

const base = {
  title: 'Konsert på Bjorli',
  summary: '',
  description: 'En lang nok beskrivelse av arrangementet.',
  organizer: 'Bjorli IL',
  start_date: '2099-02-01',
  end_date: '',
  time_text: '',
  location: 'Bjorli',
  maps_url: '',
  website: '',
  ticket_url: '',
  registration_url: '',
  categories: ['konsert'],
};

describe('editor link fields', () => {
  it('no links at all is valid and stores null', () => {
    const r = submissionEditSchema.parse(base);
    expect([r.website, r.ticket_url, r.registration_url]).toEqual([null, null, null]);
  });

  it('editor can add both new links; bare hosts are normalised to https', () => {
    const r = submissionEditSchema.parse({ ...base, ticket_url: 'billett.example.no/kjop', registration_url: 'https://meld.example.no' });
    expect(r.ticket_url).toBe('https://billett.example.no/kjop');
    expect(r.registration_url).toBe('https://meld.example.no');
  });

  it('existing valid links are kept exactly as stored (no rewriting on save)', () => {
    const r = submissionEditSchema.parse({ ...base, website: 'https://arrangor.example.no', maps_url: 'https://maps.app.goo.gl/AbC' });
    expect(r.website).toBe('https://arrangor.example.no');
    expect(r.maps_url).toBe('https://maps.app.goo.gl/AbC');
  });

  it.each(['javascript:alert(1)', 'data:text/html,x', 'mailto:a@b.no', 'not a url', 'https://localhost'])(
    'rejects %s with a clear message', (bad) => {
      const r = submissionEditSchema.safeParse({ ...base, ticket_url: bad });
      expect(r.success).toBe(false);
      if (!r.success) expect(r.error.issues[0]).toMatchObject({ path: ['ticket_url'], message: LINK_ERROR });
    },
  );

  it('the new columns are editable; status and submitter data are not', () => {
    expect(EDITABLE_COLUMNS).toContain('ticket_url');
    expect(EDITABLE_COLUMNS).toContain('registration_url');
    expect(EDITABLE_COLUMNS).not.toContain('status');
    expect(EDITABLE_COLUMNS).not.toContain('email');
  });

  it('add, change and remove are all written', () => {
    const add = buildEditUpdate(submissionEditSchema.parse({ ...base, ticket_url: 'https://a.example.no/' }), [],
      { ticket_url: null, registration_url: null });
    expect(add).toMatchObject({ ticket_url: 'https://a.example.no/' });
    expect('registration_url' in add).toBe(false); // unchanged → not sent

    const change = buildEditUpdate(submissionEditSchema.parse({ ...base, ticket_url: 'https://b.example.no/' }), [],
      { ticket_url: 'https://a.example.no/' });
    expect(change.ticket_url).toBe('https://b.example.no/');

    const remove = buildEditUpdate(submissionEditSchema.parse(base), [], { ticket_url: 'https://a.example.no/' });
    expect(remove).toHaveProperty('ticket_url', null);
  });

  it('ordinary edits on a database without the new columns do not send them', () => {
    // Item loaded before migration 0005: the fields are simply absent.
    const u = buildEditUpdate(submissionEditSchema.parse(base), [], {});
    expect('ticket_url' in u || 'registration_url' in u).toBe(false);
    expect(u).toHaveProperty('title', 'Konsert på Bjorli');
  });
});
