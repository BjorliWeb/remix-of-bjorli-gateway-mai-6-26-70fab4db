import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';

interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
  alt?: string;
}

/**
 * Sub-page hero. Sits flush under the fixed navigation (hero-bleed) and
 * ends on a crisp edge instead of fading into the page background. The
 * image is the page's LCP element, so it loads eagerly at high priority
 * (it was `loading="lazy"`, which delayed it behind the JS bundle).
 */
const PageHero = ({ title, subtitle, image, alt }: PageHeroProps) => {
  return (
    <section className="hero-bleed relative h-[72svh] min-h-[520px] max-h-[860px] flex items-end justify-center overflow-hidden bg-deep-navy">
      <img
        src={image}
        alt={alt ?? title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
      <div aria-hidden className="absolute inset-0 hero-gradient" />
      <div aria-hidden className="absolute inset-0 hero-vignette" />
      <div className="relative z-10 text-center px-5 max-w-4xl mx-auto pb-16 md:pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          className="font-display text-[clamp(2.75rem,6vw,5.75rem)] font-bold text-white mb-5 leading-[0.95] tracking-[-0.02em] text-on-image"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: EASE_OUT_EXPO }}
          className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-on-image"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
};

export default PageHero;
