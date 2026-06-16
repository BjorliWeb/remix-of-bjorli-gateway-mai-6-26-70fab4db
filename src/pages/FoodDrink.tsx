import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { Coffee, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const foodDrinkImg = images.restaurantInterior.src;

const FoodDrink = () => {
  const { t } = useLanguage();
  const s = t.foodDrinkPage;

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={foodDrinkImg} />
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
              {s.intro}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-16 md:mb-20"
          >
            <img
              src={images.tkrokenCollage.src}
              alt={s.imageAlt}
              className="w-full h-auto rounded-2xl shadow-md border border-border"
              loading="lazy"
            />
          </motion.div>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">
            {s.venuesSectionTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">{s.tkroken.name}</h3>
                  <p className="text-secondary font-medium mb-4">{s.tkroken.tag}</p>
                  <p className="text-muted-foreground leading-relaxed">{s.tkroken.desc}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                    <Flame className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">{s.heiskroa.name}</h3>
                  <p className="text-secondary font-medium mb-4">{s.heiskroa.tag}</p>
                  <p className="text-muted-foreground leading-relaxed">{s.heiskroa.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoodDrink;
