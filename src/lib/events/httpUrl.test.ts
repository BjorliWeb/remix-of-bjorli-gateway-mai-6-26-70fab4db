import { describe, expect, it } from 'vitest';
import { isHttpUrl, normalizeHttpUrl, safeHttpUrl } from './httpUrl';

describe('isHttpUrl', () => {
  it.each([
    'https://www.example.no/billett?id=1',
    'http://example.no',
    'https://xn--bjrli-mua.no/',
    'https://checkin.no/event/123#tickets',
    'https://example.no:8443/x',
  ])('accepts %s', (u) => expect(isHttpUrl(u)).toBe(true));

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'mailto:a@b.no',
    'ftp://example.no/x',
    '//example.no/x',
    '/arrangementer/x',
    'www.example.no',
    'https://localhost/x',
    'https://example',
    'https://exa mple.no',
    'https://a.no/x\u2003y', // em space (pasted from Word/PDF): the DB constraint rejects it too
    'https://a.no/x\u00a0y', // no-break space
    'https://a.no/x\u3000y',
    'https://a.no/x\u2028y',
    ' https://example.no',
    'https://example.no/\u0000',
    'https://user:pass@example.no',
    'https://bjorli.no@evil.example.com',
    `https://${'a'.repeat(500)}.no`,
    '',
    null,
    42,
  ])('rejects %j', (u) => expect(isHttpUrl(u)).toBe(false));
});

describe('normalizeHttpUrl', () => {
  it('returns empty string for empty input', () => {
    expect(normalizeHttpUrl('')).toBe('');
    expect(normalizeHttpUrl('   ')).toBe('');
    expect(normalizeHttpUrl(null)).toBe('');
  });
  it('adds https:// to bare hosts, like the existing website field', () => {
    expect(normalizeHttpUrl('www.example.no')).toBe('https://www.example.no/');
    expect(normalizeHttpUrl(' billett.example.no/kjop ')).toBe('https://billett.example.no/kjop');
    expect(normalizeHttpUrl('example.no:8080/x')).toBe('https://example.no:8080/x');
  });
  it('keeps explicit http(s)', () => {
    expect(normalizeHttpUrl('http://example.no/a')).toBe('http://example.no/a');
  });
  it.each(['javascript:alert(1)', 'data:text/html,x', 'mailto:a@b.no', 'ftp://x.no', 'tel:12345678', 'nonsense'])(
    'rejects %s (never rewrites another scheme into https)',
    (v) => expect(normalizeHttpUrl(v)).toBeNull(),
  );
});

describe('safeHttpUrl', () => {
  it('passes safe links and drops everything else', () => {
    expect(safeHttpUrl('https://example.no/')).toBe('https://example.no/');
    expect(safeHttpUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeHttpUrl(undefined)).toBeUndefined();
  });
});
