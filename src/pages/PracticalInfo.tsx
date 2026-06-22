import { useLanguage } from '@/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { Car, HeartPulse, Wifi, Dog, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PracticalInfo = () => {
  const { t } = useLanguage();
  const lp = useLocalizedPath();
  const s = t.practicalInfoPage;

  const items: Array<{
    icon: typeof Car;
    title: string;
    text: string;
    cta?: { label: string; to: string };
  }> = [
    { icon: Car, title: s.parkingTitle, text: s.parkingText, cta: { label: s.parkingCta, to: '/parkering' } },
    { icon: HeartPulse, title: s.safetyTitle, text: s.safetyText },
    { icon: Wifi, title: s.wifiTitle, text: s.wifiText },
    { icon: Dog, title: s.dogsTitle, text: s.dogsText },
  ];

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-md border border-border flex gap-4"
              >
                <item.icon className="h-6 w-6 text-secondary shrink-0 mt-1" />
                <div className="space-y-2">
                  <h2 className="font-display text-lg font-semibold">{item.title}</h2>
                  <p className="text-foreground/85 leading-relaxed">{item.text}</p>
                  {item.cta && (
                    <Link
                      to={lp(item.cta.to)}
                      className="inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
                    >
                      {item.cta.label} <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PracticalInfo;
