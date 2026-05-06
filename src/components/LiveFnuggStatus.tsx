import { useBjorliStatus } from '@/hooks/useBjorliStatus';
import type { BjorliFnuggStatus } from '@/lib/integrations/fnugg';

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
    return new Intl.DateTimeFormat(locale === 'no' ? 'nb-NO' : locale, {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

function todayLabel(s: BjorliFnuggStatus, locale: string): { text: string; aria: string } {
  // Localized strings — kept minimal here (Norwegian as canonical, English as
  // safe fallback). Full locale coverage will arrive with WordPress strings.
  const isNo = locale === 'no';
  if (s.resortOpen === true) {
    return {
      text: isNo ? 'I dag: Åpent' : 'Today: Open',
      aria: "Today's status: open",
    };
  }
  if (s.resortOpen === false) {
    return {
      text: isNo ? 'I dag: Stengt' : 'Today: Closed',
      aria: "Today's status: closed",
    };
  }
  return {
    text: isNo ? 'I dag: Status ikke tilgjengelig' : 'Today: Status unavailable',
    aria: "Today's status: unavailable",
  };
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
  const today = todayLabel(status, locale);
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
        aria-label={today.aria}
      >
        <span className="font-medium text-foreground">{today.text}</span>
        {updated && (
          <>
            <span className="mx-2 opacity-60">·</span>
            <span>Sist oppdatert: {updated}</span>
          </>
        )}
        {!hasLiveData && (
          <>
            <span className="mx-2 opacity-60">·</span>
            <span className="italic">Live data fra Fnugg</span>
          </>
        )}
      </p>
    );
  }

  // Block variant for the Opening Hours page.
  return (
    <section
      aria-label="Live operational status from Fnugg"
      className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm"
    >
      <header className="flex items-baseline justify-between gap-3 mb-4">
        <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">{title}</h2>
        {updated && (
          <span className="text-xs text-muted-foreground">Sist oppdatert: {updated}</span>
        )}
      </header>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div aria-label={today.aria}>
          <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">I dag</dt>
          <dd className="text-foreground font-medium">{today.text.replace(/^I dag:\s*/, '').replace(/^Today:\s*/, '')}</dd>
        </div>
        <div
          aria-label={
            status.liftsOpen !== null && status.liftsTotal !== null
              ? `Open lifts: ${status.liftsOpen} of ${status.liftsTotal}`
              : 'Open lifts: not available'
          }
        >
          <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Heiser åpne
          </dt>
          <dd className="text-foreground font-medium">{liftsRatio}</dd>
        </div>
        <div
          aria-label={
            status.slopesOpen !== null && status.slopesTotal !== null
              ? `Open alpine slopes: ${status.slopesOpen} of ${status.slopesTotal}`
              : 'Open alpine slopes: not available'
          }
        >
          <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            Nedfarter åpne
          </dt>
          <dd className="text-foreground font-medium">{slopesRatio}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-muted-foreground italic">
        Live driftsstatus hentes fra Fnugg. Generelle åpningstider under er sesongbaserte og
        oppdateres redaksjonelt.
      </p>
    </section>
  );
};

export default LiveFnuggStatus;