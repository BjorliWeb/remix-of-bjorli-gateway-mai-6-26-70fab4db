import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { isSummerRoute } from '@/lib/season';

/**
 * App layout. Sets `data-season` on the <html> element so the seasonal
 * design tokens (defined in src/index.css) cascade everywhere — winter
 * is the default, summer activates on summer routes.
 */
const Layout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const season = isSummerRoute(pathname) ? 'summer' : 'winter';

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.season = season;
  }, [season]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar season={season} />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
