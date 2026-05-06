import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateFilterProps {
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  placeholder?: string;
}

const DateFilter = ({ label, value, onChange, placeholder = 'Velg dato' }: DateFilterProps) => (
  <div className="flex items-center gap-2">
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('rounded-full text-xs font-semibold uppercase tracking-wider', !value && 'text-muted-foreground')}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          {value ? format(value, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className={cn('p-3 pointer-events-auto')}
        />
      </PopoverContent>
    </Popover>
    {value && (
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Reset date"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);

export default DateFilter;