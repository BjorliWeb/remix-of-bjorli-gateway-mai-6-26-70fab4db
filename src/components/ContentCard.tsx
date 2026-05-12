import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface ContentCardProps {
  to: string;
  image: string;
  category?: string;
  date?: string;
  title: string;
  intro?: string;
  index?: number;
}

/**
 * Reusable card for listing pages (tips, news, events, activities).
 * Uses the design system tokens — no raw colors.
 */
const ContentCard = ({ to, image, category, date, title, intro, index = 0 }: ContentCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/70 hover:border-secondary/40 transition-colors flex flex-col"
    >
      <Link to={to} className="block">
        <div className="relative aspect-[5/4] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
          />
          {(category || date) && (
            <div className="absolute top-4 left-4 flex gap-2">
              {category && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.15em] bg-background/90 text-foreground backdrop-blur">
                  {category}
                </span>
              )}
              {date && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.15em] bg-secondary/90 text-secondary-foreground">
                  {date}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="p-7 flex flex-col flex-1">
          <h3 className="font-display text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-secondary transition-colors">
            {title}
          </h3>
          {intro && <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{intro}</p>}
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary mt-auto">
            <span>Les mer</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default ContentCard;