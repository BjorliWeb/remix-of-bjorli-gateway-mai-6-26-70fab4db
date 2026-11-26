import { ClipboardList, Globe, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { EventAction } from '@/lib/events/eventActions';

const ICONS = { ticket: Ticket, registration: ClipboardList, website: Globe } as const;

/**
 * Renders the action buttons with the site's existing Button styles.
 * External links open in a new tab with noopener/noreferrer (and nofollow,
 * like the existing organiser website link: these are user-submitted URLs).
 */
const EventActionButtons = ({ actions, className }: { actions: EventAction[]; className?: string }) => {
  if (actions.length === 0) return null;
  return (
    <div className={className ?? 'flex flex-wrap gap-3'}>
      {actions.map((a) => {
        const Icon = ICONS[a.kind];
        return (
          <Button
            key={a.kind}
            asChild
            variant={a.primary ? 'default' : 'outline'}
            className="rounded-full"
          >
            <a href={a.href} target="_blank" rel="noopener noreferrer nofollow" data-event-action={a.kind}>
              <Icon aria-hidden />
              {a.label}
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default EventActionButtons;
