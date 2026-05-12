import { motion } from 'framer-motion';

interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
}

const PageHero = ({ title, subtitle, image }: PageHeroProps) => {
  return (
    <section className="relative h-[60vh] min-h-[480px] flex items-center justify-center overflow-hidden">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 hero-gradient" />
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-[0.95] tracking-tight"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
};

export default PageHero;
