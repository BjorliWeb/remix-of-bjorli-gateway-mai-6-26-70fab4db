import { describe, it, expect } from 'vitest';
import { normalizeInternalPath, absoluteUrl } from '@/lib/url/normalizeInternalPath';
describe('normalizeInternalPath', () => {
  it('cases', () => {
    expect(normalizeInternalPath('/')).toBe('/');
    expect(normalizeInternalPath('/sommer')).toBe('/sommer/');
    expect(normalizeInternalPath('/sommer/')).toBe('/sommer/');
    expect(normalizeInternalPath('/en/summer?a=1#x')).toBe('/en/summer/?a=1#x');
    expect(normalizeInternalPath('/sitemap.xml')).toBe('/sitemap.xml');
    expect(normalizeInternalPath('/manifest.webmanifest')).toBe('/manifest.webmanifest');
    expect(normalizeInternalPath('/admin/login')).toBe('/admin/login');
    expect(normalizeInternalPath('/api/x')).toBe('/api/x');
    expect(normalizeInternalPath('https://x.com/a')).toBe('https://x.com/a');
    expect(normalizeInternalPath('mailto:a@b.no')).toBe('mailto:a@b.no');
    expect(normalizeInternalPath('#top')).toBe('#top');
  });
  it('absoluteUrl', () => {
    expect(absoluteUrl('/sommer')).toBe('https://bjorli.no/sommer/');
    expect(absoluteUrl('https://bjorli.no/sommer')).toBe('https://bjorli.no/sommer/');
    expect(absoluteUrl('https://www.bjorli.no/en/summer?a=1')).toBe('https://bjorli.no/en/summer/?a=1');
    expect(absoluteUrl('https://example.com/page')).toBe('https://example.com/page');
    expect(absoluteUrl('/en', 'https://preview.pages.dev')).toBe('https://preview.pages.dev/en/');
    expect(absoluteUrl('/')).toBe('https://bjorli.no/');
  });
});
