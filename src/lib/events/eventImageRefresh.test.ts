import { describe, expect, it } from 'vitest';
import {
  alignSignedUrls,
  isSafeStoragePath,
  MAX_REFRESH_ITEMS,
  parseRefreshRequest,
  PUBLIC_IMAGE_TTL_S,
  resolveRefreshTargets,
  type RefreshRow,
} from '../../../supabase/functions/_shared/eventImageRefresh';

const A = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
const B = 'bbbbbbbb-2222-4222-8222-bbbbbbbbbbbb';
const C = 'cccccccc-3333-4333-8333-cccccccccccc';

const rows: RefreshRow[] = [
  { id: A, status: 'approved', image_urls: ['uploads/t1/a0.jpg', 'uploads/t1/a1.jpg'] },
  { id: B, status: 'pending', image_urls: ['uploads/t2/b0.jpg'] },
  { id: C, status: 'rejected', image_urls: ['uploads/t3/c0.jpg'] },
];

describe('public image lifetime', () => {
  it('is 600 seconds', () => expect(PUBLIC_IMAGE_TTL_S).toBe(600));
});

describe('parseRefreshRequest', () => {
  it('accepts (id, index) pairs and de-duplicates them', () => {
    expect(parseRefreshRequest([{ id: A, index: 0 }, { id: A, index: 0 }, { id: A, index: 1 }]))
      .toEqual([{ id: A, index: 0 }, { id: A, index: 1 }]);
  });

  it.each([
    ['not an array', { id: A, index: 0 }],
    ['empty list', []],
    ['too many items', Array.from({ length: MAX_REFRESH_ITEMS + 1 }, (_, i) => ({ id: A, index: i % 10 }))],
    ['non-uuid id', [{ id: 'abc', index: 0 }]],
    ['uppercase/sql-ish id', [{ id: `${A}' or 1=1`, index: 0 }]],
    ['negative index', [{ id: A, index: -1 }]],
    ['fractional index', [{ id: A, index: 0.5 }]],
    ['huge index', [{ id: A, index: 1e9 }]],
    ['string index', [{ id: A, index: '0' }]],
    ['null item', [null]],
  ])('rejects %s', (_label, raw) => {
    expect(parseRefreshRequest(raw)).toBeNull();
  });

  it('ignores a client-supplied storage path entirely', () => {
    const parsed = parseRefreshRequest([{ id: A, index: 0, path: 'private/other.jpg' }]);
    expect(parsed).toEqual([{ id: A, index: 0 }]);
  });
});

describe('isSafeStoragePath', () => {
  it('accepts normal object keys, including odd old file names', () => {
    expect(isSafeStoragePath('uploads/abc/123.jpg')).toBe(true);
    expect(isSafeStoragePath('editor/abc/x.my photo')).toBe(true);
  });
  it.each(['', '/etc/passwd', '../x.jpg', 'uploads/../../x', 'uploads//x', 'a\\b', 'a/./b', 'a\u0000b', 42, null])(
    'rejects %j', (p) => expect(isSafeStoragePath(p)).toBe(false),
  );
});

describe('resolveRefreshTargets', () => {
  it('signs only images of approved events, using the path from the database', () => {
    expect(resolveRefreshTargets([{ id: A, index: 1 }], rows))
      .toEqual([{ id: A, index: 1, path: 'uploads/t1/a1.jpg' }]);
  });

  it('refuses unpublished (pending) and rejected events', () => {
    expect(resolveRefreshTargets([{ id: B, index: 0 }, { id: C, index: 0 }], rows)).toEqual([]);
  });

  it('refuses unknown events (e.g. deleted, or stale cached ids)', () => {
    expect(resolveRefreshTargets([{ id: 'dddddddd-4444-4444-8444-dddddddddddd', index: 0 }], rows)).toEqual([]);
  });

  it('cannot reach an image of another event via an out-of-range index', () => {
    expect(resolveRefreshTargets([{ id: A, index: 2 }], rows)).toEqual([]);
  });

  it('only uses rows passed in — an approved row from another request is not borrowed', () => {
    // Event A is approved, but asking for B's index 0 must not yield A's image.
    expect(resolveRefreshTargets([{ id: B, index: 0 }], rows).map((t) => t.path))
      .not.toContain('uploads/t1/a0.jpg');
  });

  it('skips unsafe paths stored in the database', () => {
    const bad: RefreshRow[] = [{ id: A, status: 'approved', image_urls: ['../secret.jpg'] }];
    expect(resolveRefreshTargets([{ id: A, index: 0 }], bad)).toEqual([]);
  });

  it('copes with a missing image list', () => {
    const none: RefreshRow[] = [{ id: A, status: 'approved', image_urls: null }];
    expect(resolveRefreshTargets([{ id: A, index: 0 }], none)).toEqual([]);
  });

  it('republication: the same event becomes eligible again once approved', () => {
    const before: RefreshRow[] = [{ id: A, status: 'pending', image_urls: ['uploads/t1/a0.jpg'] }];
    const after: RefreshRow[] = [{ id: A, status: 'approved', image_urls: ['uploads/t1/a0.jpg'] }];
    expect(resolveRefreshTargets([{ id: A, index: 0 }], before)).toEqual([]);
    expect(resolveRefreshTargets([{ id: A, index: 0 }], after)).toHaveLength(1);
  });
});

describe('alignSignedUrls', () => {
  it('keeps the original position of each signed URL when one signing fails', () => {
    expect(alignSignedUrls([{ signedUrl: null }, { signedUrl: 'https://x/1' }, { signedUrl: 'https://x/2' }]))
      .toEqual({ urls: ['https://x/1', 'https://x/2'], indexes: [1, 2] });
  });
  it('handles an empty result', () => {
    expect(alignSignedUrls([])).toEqual({ urls: [], indexes: [] });
  });
});
