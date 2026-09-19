import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSkiSchoolData } from '@/lib/cms/skiSchoolData';

const skiSchoolImg = images.skiSchool.src;

const SkiSchool = () => {
  const { locale } = useLanguage();
  const data = getSkiSchoolData(locale);

  return (
    <div>
      <PageHero title={data.title} subtitle={data.subtitle} image={skiSchoolImg} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground leading-relaxed mb-12 text-center"
          >
            {data.description}
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.offerings.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 text-center shadow-md border border-border"
              >
                <GraduationCap className="h-8 w-8 mx-auto mb-3 text-secondary" />
                <h3 className="font-display text-lg font-semibold">{item}</h3>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href={data.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary font-semibold hover:underline text-lg"
            >
              {data.title} →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkiSchool;
