import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { Home, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const accommodationImg = images.accommodation.src;

type Section = { title: string; desc: string };

const Accommodation = () => {
  const { t } = useLanguage();
  const s = t.accommodationPage as typeof t.accommodationPage & {
    sections?: Section[];
    ctaPrimary?: string;
    ctaHref?: string;
    ctaNote?: string;
  };

  const sections: Section[] =
    s.sections ?? s.types.map((type) => ({ title: type, desc: '' }));
  const ctaLabel = s.ctaPrimary ?? s.title;
  const ctaHref = s.ctaHref ?? 'https://bjorli.no/overnatting/';
  const ctaNote = s.ctaNote ?? 'bjorli.no';

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={accommodationImg} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground leading-relaxed mb-12 text-center max-w-3xl mx-auto"
          >
            {s.desc}
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sections.map((sec, i) => (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
              >
                <Home className="h-6 w-6 mb-3 text-secondary" />
                <h2 className="font-display text-xl font-semibold mb-2">{sec.title}</h2>
                {sec.desc && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{sec.desc}</p>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <a href={ctaHref} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="font-medium">
                {ctaLabel}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <p className="text-xs text-muted-foreground mt-3">{ctaNote}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accommodation;
