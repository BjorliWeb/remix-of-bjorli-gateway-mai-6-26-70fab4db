import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import LiveFnuggStatus from '@/components/LiveFnuggStatus';
import { getOpeningHoursData } from '@/lib/cms/openingHoursData';

const OpeningHours = () => {
  const { locale } = useLanguage();
  const data = getOpeningHoursData(locale);

  return (
    <div>
      <PageHero title={data.title} subtitle={data.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Live operational status from Fnugg — distinct from the
              general / seasonal hours below, which are CMS-driven. */}
          <div className="mb-10">
            <LiveFnuggStatus variant="block" locale={locale} title={data.statusNow} />
          </div>

          <div className="space-y-4">
            {data.hours.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-md border border-border flex items-center gap-4"
              >
                <Clock className="h-6 w-6 text-secondary shrink-0" />
                <span className="text-foreground">{h}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm mt-8 text-center italic">{data.note}</p>
        </div>
      </section>
    </div>
  );
};

export default OpeningHours;
