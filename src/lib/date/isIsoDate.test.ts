import { describe, expect, it } from 'vitest';
import { isIsoDate } from './isIsoDate';

describe('isIsoDate', () => {
  it('accepts ISO dates and datetimes', () => {
    expect(isIsoDate('2026-07-31')).toBe(true);
    expect(isIsoDate('2026-07-31T10:00:00.000Z')).toBe(true);
  });
  it('rejects display dates and empties', () => {
    expect(isIsoDate('31. juli – 7. august 2026')).toBe(false);
    expect(isIsoDate('')).toBe(false);
    expect(isIsoDate(undefined)).toBe(false);
  });
});
