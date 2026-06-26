import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { getFooter, useCms } from '@/lib/cms';
import bjorliLogo from '@/assets/bjorli-logo.jpeg';

const Footer = () => {
  const { d, locale } = useLanguage();
  const lp = useLocalizedPath();
  const footer = useCms(() => getFooter({ language: locale }), [locale]);
  const columns = footer?.columns ?? [];
  const aboutBody = footer?.about ?? d.footer.aboutBody;
  const address = footer?.address ?? d.footer.address;

  return (
    <footer className="relative isolate overflow-hidden text-nav-foreground bg-season-deep">
      {/* Subtle top divider (no test border) */}
      <div
        className="absolute inset-x-0 top-0 h-px -z-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, hsl(var(--season-accent) / 0.45) 50%, transparent 100%)',
        }}
      />
      {/* Layered seasonal background — deep gradient + understated radial glow */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--nav-bg)) 0%, hsl(var(--nav-bg)) 30%, hsl(var(--season-deep)) 100%)',
        }}
      />
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[120%] -z-10 pointer-events-none opacity-50 blur-3xl"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, hsl(var(--season-accent) / 0.22), transparent 60%)',
        }}
      />
      <div
        className="absolute -bottom-40 right-0 h-[360px] w-[60%] -z-10 pointer-events-none opacity-40 blur-3xl"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, hsl(var(--season-accent) / 0.18), transparent 65%)',
        }}
      />

      <div className="relative container mx-auto px-6 pt-14 pb-6 lg:pt-16 lg:pb-8">
        {/* Top section — 5 col layout: editorial brand panel + 3 link cols + contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr_1.3fr] gap-y-14 md:gap-x-10 lg:gap-x-16">
          {/* 1 — Brand block (editorial panel, visually distinct) */}
          <div className="md:col-span-2 lg:col-span-1 relative lg:pr-10 lg:border-r lg:border-nav-foreground/10">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={bjorliLogo}
                alt="Bjorli logo"
                className="h-14 w-14 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-display text-[34px] leading-none font-bold tracking-tight">
                  {d.meta.siteName}
                </span>
                <span className="mt-2 h-[3px] w-10 rounded-full bg-season" aria-hidden="true" />
              </div>
            </div>
            <p className="text-nav-foreground/75 text-[15px] leading-[1.7] max-w-[26rem] mb-7">
              {aboutBody}
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/bjorliskisenter', label: 'Facebook' },
                { Icon: Instagram, href: 'https://www.instagram.com/bjorliskisenter/?hl=en', label: 'Instagram' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-nav-foreground/25 bg-nav-foreground/[0.08] text-nav-foreground hover:text-season-foreground hover:border-season hover:bg-season transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* 2–4 — CMS-driven link columns (winter / summer / plan) */}
          {columns.map((col) => (
            <div key={col.title} className="lg:pt-2">
              <h4 className="font-display text-[12px] font-semibold uppercase tracking-[0.28em] text-season mb-6 flex items-center gap-2">
                <span className="inline-block h-px w-5 bg-season/60" aria-hidden="true" />
                {col.title}
              </h4>
              <ul className="space-y-3.5 text-[14px] text-nav-foreground/80">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={lp(link.href)}
                      className="inline-block hover:text-season transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 5 — Contact column (far right) */}
          <div className="md:col-span-2 lg:col-span-1 lg:pt-2">
            <h4 className="font-display text-[12px] font-semibold uppercase tracking-[0.28em] text-season mb-6 flex items-center gap-2">
              <span className="inline-block h-px w-5 bg-season/60" aria-hidden="true" />
              {d.footer.contactTitle}
            </h4>
            <ul className="space-y-4 text-[14px] text-nav-foreground/85">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-season/20 ring-1 ring-season/40 text-season shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="leading-relaxed pt-1.5">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-season/20 ring-1 ring-season/40 text-season shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                <a href="tel:+4748152200" className="hover:text-season transition-colors">
                  +47 48 15 22 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-season/20 ring-1 ring-season/40 text-season shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <a href="mailto:skisenter@bjorli.no" className="hover:text-season transition-colors">
                  skisenter@bjorli.no
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal bar */}
        <div className="relative mt-16">
          <div
            className="absolute inset-x-0 -top-px h-px"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--nav-foreground) / 0.25) 50%, transparent 100%)',
            }}
          />
          <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center text-[12px] text-nav-foreground/60">
            <div className="tracking-wide order-2 sm:order-1">
              {d.footer.rights} · {d.footer.company}
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-2 order-1 sm:order-2 uppercase tracking-[0.18em]">
              <Link
                to={lp('/personvern')}
                className="hover:text-season transition-colors"
              >
                {d.footer.privacy}
              </Link>
              <a
                href="https://bjorli.no/cookies/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Reopen the in-house consent banner instead of leaving
                  // the page. Keeps layout/styling untouched.
                  e.preventDefault();
                  window.dispatchEvent(new CustomEvent('bjorli:open-consent'));
                }}
                className="hover:text-season transition-colors"
              >
                {d.footer.cookies}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
