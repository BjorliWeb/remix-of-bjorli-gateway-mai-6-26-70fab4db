import { cn } from '@/lib/utils';

export interface CategoryFilterProps {
  label?: string;
  categories: string[];
  active: string | null;
  onChange: (cat: string | null) => void;
  allLabel: string;
}

const CategoryFilter = ({ label, categories, active, onChange, allLabel }: CategoryFilterProps) => {
  if (!categories.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">{label}</span>}
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors',
          active === null
            ? 'bg-foreground text-background border-foreground'
            : 'bg-background text-foreground border-border hover:border-secondary hover:text-secondary',
        )}
      >
        {allLabel}
      </button>
      {categories.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors',
            active === c
              ? 'bg-foreground text-background border-foreground'
              : 'bg-background text-foreground border-border hover:border-secondary hover:text-secondary',
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;