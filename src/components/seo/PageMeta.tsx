import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { LOCALE_PREFIX } from '@/i18n/translations';
import { stripLocalePrefix } from '@/i18n/useLocalizedPath';

/**
 * PageMeta — per-page metadata override placeholder.
 *
 * `SEOHead` (mounted in Layout) handles defaults + CMS resolution.
 * `PageMeta` is for pages that need to override OG / Twitter / robots
 * before WordPress data is wired in. It writes to <head> imperatively
 * (mirroring SEOHead) and cleans up on unmount.
 *
 * In Next.js this is replaced by `export const metadata` / `generateMetadata`.
 */
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  robots?: string;
  /** When true, force noindex,follow regardless of `robots`. */
  noindex?: boolean;
}

const SITE_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

const upsertMeta = (key: string, content: string, isProperty = false) => {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const PageMeta = ({ title, description, ogImage, ogType, twitterCard, robots, noindex }: Props) => {
  const location = useLocation();
  const { locale } = useLanguage();
  const { path: canonicalPath } = stripLocalePrefix(location.pathname);

  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      upsertMeta('description', description);
      upsertMeta('og:description', description, true);
      upsertMeta('twitter:description', description);
    }
    if (title) {
      upsertMeta('og:title', title, true);
      upsertMeta('twitter:title', title);
    }
    if (ogImage) {
      upsertMeta('og:image', ogImage, true);
      upsertMeta('twitter:image', ogImage);
    }
    if (ogType) upsertMeta('og:type', ogType, true);
    upsertMeta('twitter:card', twitterCard ?? 'summary_large_image');
    const robotsValue = noindex ? 'noindex,follow' : robots;
    if (robotsValue) upsertMeta('robots', robotsValue);

    const canonicalHref =
      SITE_ORIGIN + (LOCALE_PREFIX[locale] || '') + (canonicalPath === '/' ? '/' : canonicalPath);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalHref);
  }, [title, description, ogImage, ogType, twitterCard, robots, noindex, canonicalPath, locale]);

  return null;
};

export default PageMeta;