import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
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
    // TEMP_VISUAL_TEST_FOOTER_BORDER
    <footer className="relative isolate overflow-hidden border-t-[6px] border-season text-nav-foreground bg-season-deep">
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
      <div className="absolute inset-x-0 top-0 h-px bg-nav-foreground/15" aria-hidden="true" />

      <div className="relative container mx-auto px-6 pt-14 pb-5 lg:pt-16 lg:pb-6">
        {/* Top section — 5 col layout: brand (wider) + 3 link cols + contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr] gap-y-12 md:gap-x-10 lg:gap-x-14">
          {/* 1 — Brand block */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img
                src={bjorliLogo}
                alt="Bjorli logo"
                className="h-12 w-12 rounded-full ring-1 ring-nav-foreground/25 shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
              />
              <span className="font-display text-[26px] leading-none font-bold tracking-tight">
                {d.meta.siteName}
              </span>
            </div>
            <p className="text-nav-foreground/70 text-[13.5px] leading-relaxed max-w-[22rem] mb-6">
              {aboutBody}
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { Icon: Facebook, href: 'https://www.facebook.com/bjorli', label: 'Facebook' },
                { Icon: Instagram, href: 'https://www.instagram.com/bjorli', label: 'Instagram' },
                { Icon: Youtube, href: 'https://www.youtube.com/@bjorli', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-nav-foreground/20 bg-nav-foreground/[0.06] text-nav-foreground/85 hover:text-nav-foreground hover:border-season/70 hover:bg-season/15 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 2–4 — CMS-driven link columns (winter / summer / plan) */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-nav-foreground/55 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3 text-[13.5px] text-nav-foreground/80">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={lp(link.href)}
                      className="inline-block hover:text-nav-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 5 — Contact column (far right) */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-nav-foreground/55 mb-5">
              {d.footer.contactTitle}
            </h4>
            <ul className="space-y-3.5 text-[13.5px] text-nav-foreground/80">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-season/15 text-season shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed pt-0.5">{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-season/15 text-season shrink-0">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <a href="tel:+4748152200" className="hover:text-nav-foreground transition-colors">
                  +47 48 15 22 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-season/15 text-season shrink-0">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <a href="mailto:post@bjorli.no" className="hover:text-nav-foreground transition-colors">
                  post@bjorli.no
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Thin legal bar */}
        <div className="relative mt-12">
          <div
            className="absolute inset-x-0 -top-px h-px"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, hsl(var(--nav-foreground) / 0.18) 50%, transparent 100%)',
            }}
          />
          <div className="pt-5 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center text-[11.5px] text-nav-foreground/55">
            <div className="tracking-wide order-2 sm:order-1">
              {d.footer.rights} · {d.footer.company}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 order-1 sm:order-2">
              <a
                href="https://bjorli.no/personvern/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-nav-foreground transition-colors"
              >
                {d.footer.privacy}
              </a>
              <a
                href="https://bjorli.no/cookies/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-nav-foreground transition-colors"
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
