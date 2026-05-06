import { Calendar } from 'lucide-react';

/**
 * Date chip used on event cards and detail heroes. Accepts an ISO string
 * or already-formatted display date — falls back to the raw string when
 * parsing fails so placeholder copy still renders.
 */
const DateBadge = ({ date, locale = 'no' }: { date?: string; locale?: string }) => {
  if (!date) return null;
  let display = date;
  const parsed = new Date(date);
  if (!isNaN(parsed.getTime())) {
    display = parsed.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return (
    <time
      dateTime={date}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-secondary/90 text-secondary-foreground"
    >
      <Calendar className="h-3 w-3" />
      {display}
    </time>
  );
};

export default DateBadge;