import { useBjorliStatus } from '@/hooks/useBjorliStatus';
import type { BjorliFnuggStatus } from '@/lib/integrations/fnugg';
import { useLanguage } from '@/i18n/LanguageContext';
import { LOCALE_LABELS, type Locale } from '@/i18n/translations';
import type { Dictionary } from '@/i18n/locales/types';
import { fill } from '@/i18n/fill';

/**
 * Compact "live operational status" block sourced from Fnugg (resort 177).
 *
 * This is intentionally distinct from the Opening Hours page content:
 *   - Fnugg = real-time operational status (open right now? lifts open? etc.)
 *   - Opening Hours = general seasonal hours (CMS / WordPress driven)
 *   - Driftsmelding (CmsAlert) = manual operational message for exceptions
 *
 * Used on both the homepage (under the four metric cards) and at the top
 * of the Opening Hours page.
 */

const EM_DASH = '—';

function formatLastUpdated(iso: string | null, locale: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  try {
    return new Intl.DateTimeFormat(LOCALE_LABELS[locale as Locale]?.bcp47 ?? 'nb-NO', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

function todayState(s: BjorliFnuggStatus, live: Dictionary['live']): string {
  if (s.resortOpen === true) return live.open;
  if (s.resortOpen === false) return live.closed;
  return live.unavailable;
}

interface Props {
  /** When `compact`, renders a single line (used under homepage cards). */
  variant?: 'compact' | 'block';
  /** Block title (only used for the `block` variant). */
  title?: string;
  locale?: string;
}

const LiveFnuggStatus = ({ variant = 'compact', title = 'Status akkurat nå', locale = 'no' }: Props) => {
  const { status, hasLiveData } = useBjorliStatus();
  const live = useLanguage().d.live;
  const state = todayState(status, live);
  const todayAria = fill(live.ariaToday, { state: state.toLowerCase() });
  const updated = formatLastUpdated(status.lastUpdated, locale);
  const liftsRatio =
    status.liftsOpen === null && status.liftsTotal === null
      ? `${EM_DASH}/${EM_DASH}`
      : `${status.liftsOpen ?? EM_DASH}/${status.liftsTotal ?? EM_DASH}`;
  const slopesRatio =
    status.slopesOpen === null && status.slopesTotal === null
      ? `${EM_DASH}/${EM_DASH}`
      : `${status.slopesOpen ?? EM_DASH}/${status.slopesTotal ?? EM_DASH}`;

  if (variant === 'compact') {
    return (
      <p
        className="text-center mt-3 text-xs text-muted-foreground"
        aria-label={todayAria}
      >
        <span className="font-medium text-foreground">{live.today}: {state}</span>
        {updated && (
          <>
            <span className="mx-2 opacity-60">·</span>
            <span>{live.lastUpdated}: {updated}</span>
          </>
        )}
        {!hasLiveData && (
          <>
            <span className="mx-2 opacity-60">·</span>
            <span className="italic">{live.liveSource}</span>
          </>
        )}
      </p>
    );
  }

  // Block variant for the Opening Hours page.
  return (
    <section
      aria-label={live.blockAria}
      className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm"
    >
      <header className="flex items-baseline justify-between gap-3 mb-4">
        <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">{title}</h2>
        {updated && (
          <span className="text-xs text-muted-foreground">{live.lastUpdated}: {updated}</span>
        )}
      </header>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div aria-label={todayAria}>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{live.today}</dt>
          <dd className="text-foreground font-medium">{state}</dd>
        </div>
        <div
          aria-label={
            status.liftsOpen !== null && status.liftsTotal !== null
              ? fill(live.ariaLifts, { open: status.liftsOpen, total: status.liftsTotal })
              : live.ariaLiftsNA
          }
        >
          <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {live.liftsOpen}
          </dt>
          <dd className="text-foreground font-medium">{liftsRatio}</dd>
        </div>
        <div
          aria-label={
            status.slopesOpen !== null && status.slopesTotal !== null
              ? fill(live.ariaSlopes, { open: status.slopesOpen, total: status.slopesTotal })
              : live.ariaSlopesNA
          }
        >
          <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {live.slopesOpen}
          </dt>
          <dd className="text-foreground font-medium">{slopesRatio}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-muted-foreground italic">{live.blockNote}</p>
    </section>
  );
};

export default LiveFnuggStatus;