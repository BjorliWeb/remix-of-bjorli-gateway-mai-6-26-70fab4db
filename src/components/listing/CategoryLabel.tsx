import { cn } from '@/lib/utils';

/**
 * Compact uppercase category chip — used on cards, hero, and detail headers.
 * Variant `solid` is used over imagery, `soft` over light backgrounds.
 */
const CategoryLabel = ({
  children,
  variant = 'soft',
  className,
}: {
  children: React.ReactNode;
  variant?: 'solid' | 'soft';
  className?: string;
}) => (
  <span
    className={cn(
      'inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider',
      variant === 'solid'
        ? 'bg-secondary text-secondary-foreground'
        : 'bg-background/90 text-foreground backdrop-blur',
      className,
    )}
  >
    {children}
  </span>
);

export default CategoryLabel;