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

  it('absoluteUrl — mandated matrix', () => {
    // relative internal path
    expect(absoluteUrl('/overnatting')).toBe('https://bjorli.no/overnatting/');
    // apex absolute URL
    expect(absoluteUrl('https://bjorli.no/vinter')).toBe('https://bjorli.no/vinter/');
    expect(absoluteUrl('https://bjorli.no')).toBe('https://bjorli.no/');
    // www absolute URL -> apex
    expect(absoluteUrl('https://www.bjorli.no/vinter/')).toBe('https://bjorli.no/vinter/');
    expect(absoluteUrl('http://www.bjorli.no/heiskort')).toBe('https://bjorli.no/heiskort/');
    // external absolute URL — untouched
    expect(absoluteUrl('https://bjorli.skiperformance.com/no/shopp#/no/buy')).toBe(
      'https://bjorli.skiperformance.com/no/shopp#/no/buy',
    );
    expect(absoluteUrl('https://notbjorli.no/vinter')).toBe('https://notbjorli.no/vinter');
    // query string
    expect(absoluteUrl('/vaer-og-webkamera?from=livecams')).toBe(
      'https://bjorli.no/vaer-og-webkamera/?from=livecams',
    );
    // fragment
    expect(absoluteUrl('/aktiviteter#kart')).toBe('https://bjorli.no/aktiviteter/#kart');
    // query + fragment together
    expect(absoluteUrl('/tips?tag=ski#topp')).toBe('https://bjorli.no/tips/?tag=ski#topp');
    // excluded: admin / api / assets / files
    expect(absoluteUrl('/admin/login')).toBe('https://bjorli.no/admin/login');
    expect(absoluteUrl('/api/list-approved-events')).toBe('https://bjorli.no/api/list-approved-events');
    expect(absoluteUrl('/assets/index-abc.css')).toBe('https://bjorli.no/assets/index-abc.css');
    expect(absoluteUrl('/sitemap.xml')).toBe('https://bjorli.no/sitemap.xml');
    expect(absoluteUrl('/llms-full.txt')).toBe('https://bjorli.no/llms-full.txt');
    expect(absoluteUrl('https://www.bjorli.no/admin/login')).toBe('https://bjorli.no/admin/login');
    // non-http schemes
    expect(absoluteUrl('mailto:post@bjorli.no')).toBe('mailto:post@bjorli.no');
    expect(absoluteUrl('tel:+4712345678')).toBe('tel:+4712345678');
  });
});
