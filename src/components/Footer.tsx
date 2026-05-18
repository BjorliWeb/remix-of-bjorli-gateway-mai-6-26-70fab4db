import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
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
    <footer className="relative bg-gradient-to-b from-nav via-nav to-season-deep text-nav-foreground">
      <div className="absolute inset-x-0 top-0 h-px bg-nav-foreground/10" aria-hidden="true" />
      <div className="container mx-auto px-6 py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Brand block */}
          <div className="lg:col-span-4 md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src={bjorliLogo} alt="Bjorli logo" className="h-11 w-11 rounded-full ring-1 ring-nav-foreground/20" />
              <span className="font-display text-2xl font-bold tracking-tight">{d.meta.siteName}</span>
            </div>
            <p className="text-nav-foreground/70 text-sm leading-relaxed max-w-sm">
              {aboutBody}
            </p>
          </div>

          {/* CMS-driven link columns */}
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <h4 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-nav-foreground/55 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm text-nav-foreground/80">
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

          {/* Contact column */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-nav-foreground/55 mb-5">
              {d.footer.contactTitle}
            </h4>
            <ul className="space-y-3 text-sm text-nav-foreground/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-season shrink-0" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-season shrink-0" />
                <a href="tel:+4748152200" className="hover:text-nav-foreground transition-colors">+47 48 15 22 00</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-season shrink-0" />
                <a href="mailto:post@bjorli.no" className="hover:text-nav-foreground transition-colors">post@bjorli.no</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-nav-foreground/10 mt-16 pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-nav-foreground/55">
          <div className="tracking-wide">{d.footer.rights} · {d.footer.company}</div>
          <div className="flex gap-6">
            <a href="https://bjorli.no/personvern/" target="_blank" rel="noopener noreferrer" className="hover:text-nav-foreground transition-colors">{d.footer.privacy}</a>
            <a href="https://bjorli.no/cookies/" target="_blank" rel="noopener noreferrer" className="hover:text-nav-foreground transition-colors">{d.footer.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
