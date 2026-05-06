import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
const foodDrinkImg = images.foodDrink.src;
import { UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

const FoodDrink = () => {
  const { t } = useLanguage();
  const s = t.foodDrinkPage;

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={foodDrinkImg} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg text-muted-foreground leading-relaxed mb-12">
            {s.desc}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-12 shadow-md border border-border">
            <UtensilsCrossed className="h-16 w-16 mx-auto mb-4 text-secondary" />
            <h3 className="font-display text-2xl font-bold mb-2">Heiskroa</h3>
            <p className="text-muted-foreground">10:00 – 16:00</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FoodDrink;
