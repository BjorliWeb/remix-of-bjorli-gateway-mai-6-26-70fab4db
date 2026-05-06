import { Calendar as CalendarIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'list' | 'calendar';

interface Props {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
  labels: { list: string; calendar: string };
}

const CalendarListToggle = ({ value, onChange, labels }: Props) => (
  <div className="inline-flex rounded-full border border-border p-1 bg-background">
    <button
      type="button"
      onClick={() => onChange('list')}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5',
        value === 'list' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <List className="h-3.5 w-3.5" />
      {labels.list}
    </button>
    <button
      type="button"
      onClick={() => onChange('calendar')}
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5',
        value === 'calendar' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
      )}
    >
      <CalendarIcon className="h-3.5 w-3.5" />
      {labels.calendar}
    </button>
  </div>
);

export default CalendarListToggle;