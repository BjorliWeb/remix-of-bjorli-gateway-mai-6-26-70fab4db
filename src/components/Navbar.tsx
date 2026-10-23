import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { LOCALES, LOCALE_LABELS } from '@/i18n/translations';
import { getNavigation, useCms } from '@/lib/cms';
import { DEFAULT_SEASON } from '@/lib/season';
import BjorliWordmark from '@/components/BjorliWordmark';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { track } from '@/lib/analytics';
import { normalizeInternalPath } from '@/lib/url/normalizeInternalPath';

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
  const normalizedPath = normalizeInternalPath(
    stripped === '/' || stripped === '' ? seasonHomePath : stripped,
  );
  const isActive = (path: string) =>
    normalizeInternalPath(path) === normalizedPath ||
    (path === '/' && (stripped === '/' || stripped === ''));

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
    <nav className="fixed top-0 left-0 right-0 z-50 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:max-w-[1440px] lg:w-[calc(100%-2rem)] bg-nav border-b border-nav-foreground/10 lg:border lg:border-nav-foreground/15 lg:rounded-2xl lg:shadow-[0_18px_50px_-25px_hsl(var(--season-deep)/0.6)]">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link to={lp('/')} className="flex items-center text-nav-foreground" aria-label={d.meta.siteName}>
            {/* Official wordmark. "Snøsikre Bjorli" is reserved for winter
                campaign use only — not for the navbar identity. */}
            <BjorliWordmark title={d.meta.siteName} className="h-8 lg:h-9 w-auto" />
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label={d.nav.language}
                  className="h-11 text-nav-foreground/80 hover:text-nav-foreground px-3 rounded-full border border-nav-foreground/20 hover:border-nav-foreground/40 hover:bg-nav-foreground/[0.06] transition-colors flex items-center gap-1.5"
                >
                  {/* Globe + code reads cleaner than an emoji flag (and a
                      language is not a country). Flags stay in the list. */}
                  <Globe className="h-4 w-4" aria-hidden />
                  <span className="text-xs font-semibold tracking-wide">{current.short}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                {LOCALES.map((loc) => {
                  const label = LOCALE_LABELS[loc];
                  return (
                    <DropdownMenuItem
                      key={loc}
                      onClick={() => {
                        // setLocale fires the canonical `language_change`
                        // GA4 event via trackLanguageChange — do not emit
                        // a second event here.
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
                'hidden md:inline-flex items-center justify-center h-11 px-5 rounded-full text-sm font-semibold bg-cta text-cta-foreground hover:bg-cta-hover ring-1 ring-inset ring-white/15 transition-colors';
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
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="xl:hidden inline-flex items-center gap-2 h-11 px-3 rounded-full border border-nav-foreground/20 text-nav-foreground text-sm font-semibold hover:bg-nav-foreground/[0.06]"
            >
              {isOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
              <span>{isOpen ? d.nav.close : d.nav.menu}</span>
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
            id="mobile-menu"
            className="xl:hidden bg-nav border-t border-nav-foreground/10 overflow-hidden"
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
