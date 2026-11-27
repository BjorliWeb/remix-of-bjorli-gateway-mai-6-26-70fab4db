import { Link } from 'react-router-dom';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import LiveFnuggStatus from '@/components/LiveFnuggStatus';
import { getOpeningHoursData } from '@/lib/cms/openingHoursData';
import { openingHoursCopy, type Section } from '@/lib/openingHours/seasonView';

const SectionLinks = ({ section }: { section: Section }) => {
  const lp = useLocalizedPath();
  if (!section.links?.length) return null;
  return (
    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {section.links.map((l) =>
        l.href.startsWith('/') ? (
          <Link key={l.href} to={lp(l.href)} className="font-medium text-secondary underline underline-offset-2 hover:no-underline">
            {l.label}
          </Link>
        ) : (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="font-medium text-secondary underline underline-offset-2 hover:no-underline">
            {l.label}
          </a>
        ),
      )}
    </p>
  );
};

const SeasonSection = ({ s, i, pastLabel }: { s: Section; i: number; pastLabel: string }) => (
  <motion.section
    id={`apningstider-${s.id}`}
    aria-labelledby={`oh-${s.id}`}
    data-opening-section={s.id}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: Math.min(i, 4) * 0.05 }}
    className={`bg-card rounded-xl p-6 shadow-md border border-border ${s.past ? 'opacity-70' : ''}`}
  >
    <div className="flex items-start gap-3 mb-3">
      <Clock className="h-6 w-6 text-secondary shrink-0 mt-0.5" aria-hidden />
      <h2 id={`oh-${s.id}`} className="font-display text-xl font-bold text-foreground leading-tight">
        {s.title}
        {s.past && (
          <span className="ml-2 align-middle inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {pastLabel}
          </span>
        )}
      </h2>
    </div>
    <ul className="space-y-2">
      {s.rows.map((r, j) => (
        <li key={j} className={`text-foreground leading-relaxed ${r.highlight ? 'rounded-lg bg-secondary/10 px-3 py-2' : ''}`}>
          {r.label && <span className="font-semibold">{r.label}: </span>}
          {r.text}
        </li>
      ))}
    </ul>
    {s.notes.map((n, j) => (
      <p key={j} className="mt-3 text-sm text-muted-foreground leading-relaxed">{n}</p>
    ))}
    <SectionLinks section={s} />
  </motion.section>
);

const OpeningHours = () => {
  const { locale } = useLanguage();
  const data = getOpeningHoursData(locale);
  const copy = openingHoursCopy(locale);

  return (
    <div>
      <PageHero title={data.title} subtitle={data.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Live operational status from Fnugg — distinct from the
              planned seasonal hours below (src/lib/openingHours). */}
          <div className="mb-10">
            <LiveFnuggStatus variant="block" locale={locale} title={data.statusNow} />
          </div>

          <div className="space-y-4">
            {data.sections.filter((s) => s.id !== 'disclaimer').map((s, i) => (
              <SeasonSection key={s.id} s={s} i={i} pastLabel={copy.past} />
            ))}

            {/* Bjorli Fjellkafe (replaces the former Heiskroa line). */}
            <section data-fjellkafe-opening className="bg-card rounded-xl p-6 shadow-md border border-border" aria-labelledby="oh-fjellkafe">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="h-6 w-6 text-secondary shrink-0 mt-0.5" aria-hidden />
                <h2 id="oh-fjellkafe" className="font-display text-xl font-bold text-foreground leading-tight">
                  {data.fjellkafe.title}
                  {data.fjellkafe.subtitle && (
                    <span className="block text-base font-semibold text-muted-foreground mt-1">{data.fjellkafe.subtitle}</span>
                  )}
                </h2>
              </div>
              {data.fjellkafe.rows.length > 0 && (
                <ul className="space-y-2">
                  {data.fjellkafe.rows.map((r) => (
                    <li key={r.label} className="text-foreground leading-relaxed">
                      <span className="font-semibold">{r.label}:</span> {r.text}
                    </li>
                  ))}
                </ul>
              )}
              {data.fjellkafe.text && <p className="text-foreground leading-relaxed">{data.fjellkafe.text}</p>}
            </section>

            {/* Other existing opening hours (shop) — unchanged. */}
            {data.hours.map((h, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-md border border-border flex items-center gap-4">
                <Clock className="h-6 w-6 text-secondary shrink-0" aria-hidden />
                <span className="text-foreground">{h}</span>
              </div>
            ))}

            {data.sections.filter((s) => s.id === 'disclaimer').map((s) => (
              <SeasonSection key={s.id} s={s} i={0} pastLabel={copy.past} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OpeningHours;
