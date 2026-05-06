import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { track } from '@/lib/analytics';

const Livecams = () => {
  const { t, locale } = useLanguage();
  const s = t.livecamsPage;

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg text-muted-foreground leading-relaxed mb-12">
            {s.desc}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-12 shadow-md border border-border">
            <Camera className="h-16 w-16 mx-auto mb-4 text-secondary" />
            <p className="text-muted-foreground">
              <a
                href="https://bjorli.no/livecams/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary font-semibold hover:underline text-lg"
                onClick={() =>
                  track('click_livecams', {
                    page_path: '/live',
                    language: locale,
                    link_url: 'https://bjorli.no/livecams/',
                    link_text: s.title,
                    outbound: true,
                  })
                }
              >
                {s.title} →
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Livecams;
