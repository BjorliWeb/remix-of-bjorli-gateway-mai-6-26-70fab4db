import { cn } from '@/lib/utils';

export type SeasonValue = 'all' | 'winter' | 'summer';

interface SeasonFilterProps {
  label?: string;
  active: SeasonValue;
  onChange: (s: SeasonValue) => void;
  labels: { all: string; winter: string; summer: string };
}

const SeasonFilter = ({ label, active, onChange, labels }: SeasonFilterProps) => {
  const options: { value: SeasonValue; label: string }[] = [
    { value: 'all', label: labels.all },
    { value: 'winter', label: labels.winter },
    { value: 'summer', label: labels.summer },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">{label}</span>}
      <div className="inline-flex rounded-full border border-border p-1 bg-background">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors',
              active === o.value
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeasonFilter;