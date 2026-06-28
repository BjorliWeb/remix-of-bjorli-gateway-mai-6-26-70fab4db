import { motion } from 'framer-motion';

interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
  alt?: string;
}

const PageHero = ({ title, subtitle, image, alt }: PageHeroProps) => {
  return (
    <section className="relative h-[68vh] min-h-[520px] flex items-end justify-center overflow-hidden">
      <img
        src={image}
        alt={alt ?? title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 hero-gradient" />
      <div aria-hidden className="absolute inset-0 hero-vignette" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-48 bg-gradient-to-b from-transparent to-background"
      />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pb-20 md:pb-28">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-[0.95] tracking-tight"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-primary-foreground/85 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
};

export default PageHero;
