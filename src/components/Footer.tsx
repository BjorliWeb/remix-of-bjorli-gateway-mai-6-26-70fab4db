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
    <footer className="relative text-nav-foreground bg-nav">
      {/* Layered seasonal gradient depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, hsl(var(--nav-bg)) 0%, hsl(var(--nav-bg)) 45%, hsl(var(--season-deep)) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at 85% 0%, hsl(var(--season-accent) / 0.18), transparent 55%)',
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-nav-foreground/15" aria-hidden="true" />

      <div className="relative container mx-auto px-6 pt-12 pb-6 lg:pt-14 lg:pb-7">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-8 lg:gap-x-10">
          {/* Brand block */}
          <div className="md:col-span-12 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={bjorliLogo}
                alt="Bjorli logo"
                className="h-11 w-11 rounded-full ring-1 ring-nav-foreground/20"
              />
              <span className="font-display text-2xl font-bold tracking-tight">
                {d.meta.siteName}
              </span>
            </div>
            <p className="text-nav-foreground/70 text-sm leading-relaxed max-w-sm mb-6">
              {aboutBody}
            </p>
            <div className="flex items-center gap-2">
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-nav-foreground/15 bg-nav-foreground/5 text-nav-foreground/80 hover:text-nav-foreground hover:border-season/60 hover:bg-season/15 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* CMS-driven link columns */}
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-4 lg:col-span-2">
              <h4 className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-nav-foreground/55 mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-sm text-nav-foreground/80">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={lp(link.href)}
                      className="inline-block hover:text-nav-foreground hover:translate-x-0.5 transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div className="md:col-span-12 lg:col-span-2">
            <h4 className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-nav-foreground/55 mb-4">
              {d.footer.contactTitle}
            </h4>
            <ul className="space-y-3 text-sm text-nav-foreground/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-season shrink-0" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-season shrink-0" />
                <a href="tel:+4748152200" className="hover:text-nav-foreground transition-colors">
                  +47 48 15 22 00
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-season shrink-0" />
                <a href="mailto:post@bjorli.no" className="hover:text-nav-foreground transition-colors">
                  post@bjorli.no
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-nav-foreground/10 mt-10 pt-5 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center text-xs text-nav-foreground/55">
          <div className="tracking-wide">
            {d.footer.rights} · {d.footer.company}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
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
    </footer>
  );
};

export default Footer;
