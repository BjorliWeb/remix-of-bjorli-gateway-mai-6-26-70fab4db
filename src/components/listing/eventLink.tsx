import { Link } from 'react-router-dom';
import type { ReactNode, MouseEvent } from 'react';
import type { CmsEvent } from '@/lib/cms';

/**
 * Resolve the correct link target for an event card.
 *
 * User-submitted events (id prefix `submission-`) do not have internal
 * detail pages — they either link out to the organiser's website
 * (`ctaHref` / `bookingUrl`, opened in a new tab) or render as a
 * non-clickable card when no external URL is available. Editorial mock
 * events keep their internal `/arrangementer/<slug>` route so existing
 * detail pages still work.
 */
export type EventLinkTarget =
  | { kind: 'internal'; to: string }
  | { kind: 'external'; href: string }
  | { kind: 'none' };

export const resolveEventTarget = (
  ev: Pick<CmsEvent, 'id' | 'slug' | 'ctaHref' | 'bookingUrl'>,
  internalTo: string,
): EventLinkTarget => {
  // All approved events — editorial or submissions — now route to an
  // internal detail page on bjorli.no. The external organiser website
  // (submissions) is shown on that detail page.
  return { kind: 'internal', to: internalTo };
};

interface EventLinkProps {
  target: EventLinkTarget;
  className?: string;
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
}

/**
 * Renders either an internal Link, an external anchor (new tab), or a
 * non-interactive div, depending on the resolved target. Keeps
 * `className` and children identical across cases so surrounding
 * layout/hover styles remain intact.
 */
export const EventLink = ({ target, className, children, onClick }: EventLinkProps) => {
  if (target.kind === 'internal') {
    return (
      <Link to={target.to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (target.kind === 'external') {
    return (
      <a
        href={target.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  return (
    <div className={className} aria-disabled="true">
      {children}
    </div>
  );
};