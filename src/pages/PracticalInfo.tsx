import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { Info, Car, Lock, Heart, Wifi, Dog } from 'lucide-react';
import { motion } from 'framer-motion';

const PracticalInfo = () => {
  const { t } = useLanguage();
  const s = t.practicalInfoPage;

  const items = [
    { icon: Car, text: s.parking },
    { icon: Lock, text: s.skiStorage },
    { icon: Heart, text: s.firstAid },
    { icon: Wifi, text: s.wifi },
    { icon: Dog, text: s.dogs },
  ];

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-6 shadow-md border border-border flex items-center gap-4">
                <item.icon className="h-6 w-6 text-secondary shrink-0" />
                <span className="text-foreground">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PracticalInfo;
