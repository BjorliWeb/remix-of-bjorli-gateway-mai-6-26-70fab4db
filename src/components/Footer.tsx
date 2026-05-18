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
    <footer className="bg-gradient-to-b from-nav to-deep-navy text-nav-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={bjorliLogo} alt="Bjorli logo" className="h-10 w-10 rounded-full" />
              <span className="font-display text-xl font-bold">{d.meta.siteName}</span>
            </div>
            <p className="text-nav-foreground/70 text-sm leading-relaxed mb-4 max-w-sm">
              {aboutBody}
            </p>
            <div className="space-y-2 text-sm text-nav-foreground/70">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary shrink-0" />
                <a href="tel:+4748152200" className="hover:text-nav-foreground transition-colors">+47 48 15 22 00</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary shrink-0" />
                <a href="mailto:post@bjorli.no" className="hover:text-nav-foreground transition-colors">post@bjorli.no</a>
              </div>
            </div>
          </div>

          {/* CMS-driven columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-base font-semibold mb-4">{col.title}</h4>
              <div className="space-y-2 text-sm text-nav-foreground/70">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    to={lp(link.href)}
                    className="block hover:text-nav-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-nav-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm text-nav-foreground/50">
          <div>{d.footer.rights} · {d.footer.company}</div>
          <div className="flex gap-4">
            <a href="https://bjorli.no/personvern/" target="_blank" rel="noopener noreferrer" className="hover:text-nav-foreground transition-colors">{d.footer.privacy}</a>
            <a href="https://bjorli.no/cookies/" target="_blank" rel="noopener noreferrer" className="hover:text-nav-foreground transition-colors">{d.footer.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
