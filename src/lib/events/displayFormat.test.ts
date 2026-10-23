import { describe, expect, it } from 'vitest';
import { formatEventCategory, formatEventDate } from './displayFormat';

describe('formatEventDate', () => {
  it('writes ISO dates as natural Norwegian text', () => {
    expect(formatEventDate('2026-11-14', 'no')).toBe('14. november 2026');
  });
  it('keeps editorial display dates unchanged', () => {
    expect(formatEventDate('5.–6. september 2026', 'no')).toBe('5.–6. september 2026');
  });
});

describe('formatEventCategory', () => {
  it('shows a readable name instead of the internal key', () => {
    expect(formatEventCategory('mat-drikke', 'no')).toBe('Mat & drikke');
    expect(formatEventCategory('mat-drikke', 'de')).toBe('Food & drink');
  });
});
