import { describe, expect, it } from 'vitest';
import { canAccessEditor, isFullAdmin, EDITOR_ROLES, type AppRole } from './roles';

describe('canAccessEditor', () => {
  it('lets admin into the event editor', () => {
    expect(canAccessEditor(['admin'])).toBe(true);
  });
  it('lets moderator into the event editor', () => {
    expect(canAccessEditor(['moderator'])).toBe(true);
  });
  it('keeps plain users out', () => {
    expect(canAccessEditor(['user'])).toBe(false);
  });
  it('keeps accounts with no role out', () => {
    expect(canAccessEditor([])).toBe(false);
    expect(canAccessEditor(null)).toBe(false);
    expect(canAccessEditor(undefined)).toBe(false);
  });
  it('accepts a user holding several roles', () => {
    expect(canAccessEditor(['user', 'moderator'])).toBe(true);
  });
});

describe('isFullAdmin', () => {
  it('is true only for admin', () => {
    expect(isFullAdmin(['admin'])).toBe(true);
  });
  it('is false for moderator — moderator is not a junior admin', () => {
    expect(isFullAdmin(['moderator'])).toBe(false);
  });
  it('is false for user, empty and nullish', () => {
    expect(isFullAdmin(['user'])).toBe(false);
    expect(isFullAdmin([])).toBe(false);
    expect(isFullAdmin(null)).toBe(false);
    expect(isFullAdmin(undefined)).toBe(false);
  });
});

describe('role separation', () => {
  it('editor access and full admin are different capabilities', () => {
    // Guards the core security property of this role model: a moderator may
    // edit events but must never be treated as an administrator (role
    // management, contact_messages, seo_meta, services, alerts,
    // operational_status stay admin-only).
    expect(canAccessEditor(['moderator'])).toBe(true);
    expect(isFullAdmin(['moderator'])).toBe(false);
  });

  it('grants editor access to exactly admin and moderator', () => {
    const allRoles: AppRole[] = ['admin', 'moderator', 'user'];
    expect(allRoles.filter((r) => canAccessEditor([r]))).toEqual(['admin', 'moderator']);
    expect([...EDITOR_ROLES]).toEqual(['admin', 'moderator']);
  });
});
