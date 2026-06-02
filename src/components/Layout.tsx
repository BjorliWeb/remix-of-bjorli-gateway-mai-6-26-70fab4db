import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ConsentBanner from './ConsentBanner';
import { isSummerRoute } from '@/lib/season';
import { useLanguage } from '@/i18n/LanguageContext';
import { setAnalyticsContext } from '@/lib/analyticsContext';

/**
 * App layout. Sets `data-season` on the <html> element so the seasonal
 * design tokens (defined in src/index.css) cascade everywhere — winter
 * is the default, summer activates on summer routes.
 */
const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { locale } = useLanguage();
  const season = isSummerRoute(pathname) ? 'summer' : 'winter';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.season = season;
  }, [season]);

  // Keep ambient analytics context fresh so trackPageView / track() can
  // stamp every event with language + season + page_path automatically.
  useEffect(() => {
    setAnalyticsContext({ language: locale, season, page_path: pathname });
  }, [locale, season, pathname]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--season-surface) / 0.55), transparent 65%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--season-surface) / 0.35) 100%)',
      }}
    >
      <Navbar season={season} />
      <div className="flex-1 flex flex-col lg:max-w-[1440px] lg:w-[calc(100%-2rem)] lg:mx-auto lg:my-4 lg:rounded-[28px] lg:overflow-hidden lg:shadow-[0_30px_80px_-40px_hsl(var(--season-deep)/0.45)] lg:ring-1 lg:ring-nav-foreground/10 bg-background">
        <main className="flex-1 pt-16 lg:pt-24">{children}</main>
        <Footer />
      </div>
      <ConsentBanner />
    </div>
  );
};

export default Layout;
