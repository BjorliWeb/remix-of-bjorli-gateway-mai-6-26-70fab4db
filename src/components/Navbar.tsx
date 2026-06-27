import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { LOCALES, LOCALE_LABELS } from '@/i18n/translations';
import { getNavigation, useCms } from '@/lib/cms';
import { DEFAULT_SEASON } from '@/lib/season';
import bjorliLogo from '@/assets/bjorli-logo.jpeg';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { track } from '@/lib/analytics';

interface NavbarProps {
  /** Current season — drives which header CTA is shown. */
  season?: 'winter' | 'summer';
}

const Navbar = ({ season = 'winter' }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale, d } = useLanguage();
  const location = useLocation();
  const lp = useLocalizedPath();

  // Navigation is sourced from the CMS adapter so it can later be CMS-managed.
  const navigation = useCms(() => getNavigation({ language: locale }), [locale]);
  const navLinks = (navigation?.primary ?? []).map((l) => ({ to: l.href, label: l.label }));

  const current = LOCALE_LABELS[locale];

  // Strip locale prefix from current pathname for active matching.
  const stripped = (() => {
    const segs = location.pathname.split('/').filter(Boolean);
    if (segs[0] && (LOCALES as string[]).includes(segs[0]) && segs[0] !== 'no') {
      return '/' + segs.slice(1).join('/');
    }
    return location.pathname;
  })();
  // Root ("/") renders the current default-season homepage, so treat "/" as
  // an alias for "/sommer" or "/vinter" when matching active nav links.
  const seasonHomePath = DEFAULT_SEASON === 'summer' ? '/sommer' : '/vinter';
  const normalizedPath = stripped === '/' || stripped === '' ? seasonHomePath : stripped;
  const isActive = (path: string) =>
    path === normalizedPath || (path === '/' && (stripped === '/' || stripped === ''));

  // Header CTA flips with the season:
  //   Winter → Kjøp heiskort (commercial driver for Bjorli Skisenter)
  //   Summer → Finn overnatting (destination driver)
  const isSummer = season === 'summer';
  const ctaLabel = isSummer ? d.nav.findStay : d.nav.buyLiftPass;
  const ctaHref = isSummer
    ? lp('/overnatting')
    : 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862';
  const ctaExternal = !isSummer;

  const trackCta = () => {
    track(isSummer ? 'click_accommodation' : 'click_buy_ski_pass', {
      page_path: location.pathname,
      language: locale,
      season,
      link_url: ctaHref,
      link_text: ctaLabel,
      destination_type: isSummer ? 'accommodation' : 'ski_pass',
      outbound: ctaExternal,
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-[1440px] lg:w-[calc(100%-2rem)] bg-nav/85 backdrop-blur-xl border-b border-nav-foreground/10 lg:border lg:border-nav-foreground/15 lg:rounded-2xl lg:shadow-[0_18px_50px_-25px_hsl(var(--season-deep)/0.6)]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link to={lp('/')} className="flex items-center gap-2">
            <img src={bjorliLogo} alt="Bjorli logo" className="h-10 w-10 rounded-full" />
            {/* Permanent destination brand. "Snøsikre Bjorli" is reserved
                for winter campaign use only — not for the navbar identity. */}
            <span className="text-nav-foreground font-display text-xl font-bold tracking-tight">
              {d.meta.siteName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={lp(link.to)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-season after:transition-transform after:origin-left ${
                  isActive(link.to)
                    ? 'text-nav-foreground after:scale-x-100'
                    : 'text-nav-foreground/75 hover:text-nav-foreground after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={d.nav.language}
                  className="text-nav-foreground/80 hover:text-nav-foreground text-lg px-2 py-1 rounded border border-nav-foreground/20 hover:border-nav-foreground/40 transition-colors flex items-center gap-1.5"
                >
                  <span>{current.flag}</span>
                  <span className="text-xs font-semibold">{current.short}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                {LOCALES.map((loc) => {
                  const label = LOCALE_LABELS[loc];
                  return (
                    <DropdownMenuItem
                      key={loc}
                      onClick={() => {
                        track('change_language', {
                          page_path: location.pathname,
                          language: loc,
                          from: locale,
                          to: loc,
                        });
                        setLocale(loc);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>{label.flag}</span>
                      <span className="text-sm font-medium">{label.name}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Seasonal CTA — winter: Kjøp heiskort · summer: Finn overnatting. */}
            {(() => {
              const ctaClass =
                'hidden md:inline-flex items-center justify-center h-9 px-4 rounded-full text-sm font-semibold bg-season text-season-foreground shadow-[0_8px_22px_-8px_hsl(var(--season-accent)/0.7)] ring-1 ring-season/40 hover:brightness-110 transition';
              return ctaExternal ? (
                <a href={ctaHref} target="_blank" rel="noopener noreferrer" className={ctaClass} onClick={trackCta}>
                  {ctaLabel}
                </a>
              ) : (
                <Link to={ctaHref} className={ctaClass} onClick={trackCta}>
                  {ctaLabel}
                </Link>
              );
            })()}

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? d.nav.close : d.nav.menu}
              className="xl:hidden text-nav-foreground p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-nav/95 backdrop-blur-xl border-t border-nav-foreground/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={lp(link.to)}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'text-secondary bg-nav-foreground/5'
                      : 'text-nav-foreground/80 hover:text-nav-foreground hover:bg-nav-foreground/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={ctaExternal ? ctaHref : undefined}
                target={ctaExternal ? '_blank' : undefined}
                rel={ctaExternal ? 'noopener noreferrer' : undefined}
                className="block mt-4"
                onClick={(e) => {
                  trackCta();
                  if (!ctaExternal) {
                    e.preventDefault();
                    setIsOpen(false);
                    window.history.pushState({}, '', ctaHref);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }
                }}
              >
                <Button variant="secondary" className="w-full font-semibold">
                  {ctaLabel}
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
