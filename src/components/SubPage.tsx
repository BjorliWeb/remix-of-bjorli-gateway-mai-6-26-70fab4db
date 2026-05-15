import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, Mountain, Ticket, Snowflake, Map, Users,
  Bike, Compass, Baby, Sun, Sparkles, ExternalLink,
  Camera, Clock, Activity,
} from 'lucide-react';
import PageHero from './PageHero';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { getSubPage, type SubPageSlug, type CmsSubPage, type SubPageIcon } from '@/lib/cms/subpages';

const ICON_MAP: Record<SubPageIcon, React.ComponentType<{ className?: string }>> = {
  mountain: Mountain,
  ticket: Ticket,
  snowflake: Snowflake,
  map: Map,
  users: Users,
  bike: Bike,
  compass: Compass,
  baby: Baby,
  sun: Sun,
  sparkles: Sparkles,
  camera: Camera,
  clock: Clock,
  activity: Activity,
};

interface SubPageProps {
  slug: SubPageSlug;
  /** Optional content rendered between the intro/body and the highlights grid. */
  afterIntro?: React.ReactNode;
}

const SubPage = ({ slug, afterIntro }: SubPageProps) => {
  const { locale, d } = useLanguage();
  const lp = useLocalizedPath();
  const [page, setPage] = useState<CmsSubPage | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSubPage(locale, slug).then((p) => { if (!cancelled) setPage(p); });
    return () => { cancelled = true; };
  }, [locale, slug]);

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <PageHero title={page.title} subtitle={page.intro} image={page.heroImage.url} />

      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">{d.listing.breadcrumbHome}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">{page.title}</li>
        </ol>
      </nav>

      {/* Intro / body */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-foreground/80 leading-relaxed"
          >
            {page.body}
          </motion.p>

          {page.ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {page.ctas.map((cta) =>
                cta.external ? (
                  <a
                    key={cta.label}
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      cta.variant === 'secondary'
                        ? 'inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors'
                        : 'inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm'
                    }
                  >
                    {cta.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    key={cta.label}
                    to={lp(cta.href)}
                    className={
                      cta.variant === 'secondary'
                        ? 'inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors'
                        : 'inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm'
                    }
                  >
                    {cta.label}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {afterIntro}

      {/* Highlights grid */}
      {page.highlights.length > 0 && (
        <section className="pb-16 md:pb-24 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {page.highlights.map((h, i) => {
                const Icon = h.icon ? ICON_MAP[h.icon] : Sparkles;
                return (
                  <motion.div
                    key={h.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Card className="h-full bg-card/60 backdrop-blur border-border/60 hover:border-secondary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-4">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-lg font-semibold mb-1.5">{h.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{h.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {page.faq && page.faq.length > 0 && (
        <section className="pb-20 md:pb-28 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">FAQ</h2>
            <div className="space-y-3">
              {page.faq.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-border bg-card/60 backdrop-blur p-5 open:bg-card transition-colors"
                >
                  <summary className="cursor-pointer font-semibold list-none flex items-center justify-between gap-3">
                    <span>{f.q}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 text-secondary" />
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SubPage;
