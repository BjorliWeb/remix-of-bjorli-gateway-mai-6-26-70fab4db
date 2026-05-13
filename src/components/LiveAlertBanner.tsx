import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, AlertTriangle, ChevronRight, Info } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { getAlerts, type CmsAlert, type Language } from '@/lib/cms';
import { supabase } from '@/integrations/supabase/client';
import { useBjorliFnuggPosts } from '@/hooks/useBjorliFnuggPosts';
import { truncateExcerpt, type BjorliFnuggPost } from '@/lib/integrations/fnugg';

/**
 * Live operational alert banner (Driftsmelding).
 *
 * Source priority (highest first):
 *   1. Critical CMS alert (`level === 'critical'`) — never overridden.
 *   2. Latest Fnugg blog post for Bjorli (resort 177) — daily operational
 *      update during winter season.
 *   3. Any non-critical CMS alert (info / warning).
 *   4. Safe Norwegian fallback ("Ingen ny driftsmelding tilgjengelig akkurat nå.").
 *
 * The CMS path stays plugged into the existing `getAlerts` abstraction, so a
 * future WordPress alert post type just needs to be wired into the adapter.
 * Fnugg posts are NEVER mixed with general opening hours — those live on the
 * Opening Hours page and come from a different content source entirely.
 */

interface FallbackProps {
  label?: string;
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const LEVEL_STYLES: Record<CmsAlert['level'], { wrap: string; icon: string; Icon: React.ComponentType<{ className?: string }> }> = {
  info: {
    wrap: 'border-secondary/30 bg-secondary/10',
    icon: 'text-secondary',
    Icon: Info,
  },
  warning: {
    wrap: 'border-amber-400/40 bg-amber-50 dark:bg-amber-950/30',
    icon: 'text-amber-600 dark:text-amber-400',
    Icon: AlertCircle,
  },
  critical: {
    wrap: 'border-destructive/40 bg-destructive/10',
    icon: 'text-destructive',
    Icon: AlertTriangle,
  },
};

/** External "see all driftsmeldinger" target until we have an internal page. */
const ALL_ALERTS_URL = 'https://fnugg.no/bjorli/';

function formatNorwegianDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  try {
    return new Intl.DateTimeFormat('nb-NO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(d);
  } catch {
    return null;
  }
}

/**
 * Avoid awkward duplication when the Fnugg post title is essentially
 * the date itself (a common pattern for daily ops updates).
 */
function isTitleEffectivelyDate(title: string | null, dateLabel: string | null): boolean {
  if (!title || !dateLabel) return false;
  const t = title.toLowerCase().replace(/[.,]/g, '').trim();
  const d = dateLabel.toLowerCase().replace(/[.,]/g, '').trim();
  if (t === d) return true;
  // Loose match: title contains both the day-of-month and the month name.
  const monthMatch = d.match(/[a-zæøå]+$/);
  const dayMatch = d.match(/\d{1,2}/);
  return Boolean(monthMatch && dayMatch && t.includes(dayMatch[0]) && t.includes(monthMatch[0]));
}

const LiveAlertBanner = ({ fallback }: { fallback: FallbackProps }) => {
  const { locale } = useLanguage();
  const language = locale as Language;
  const lp = useLocalizedPath();
  const [alert, setAlert] = useState<CmsAlert | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { latest: latestPost, hasLoaded: postsLoaded } = useBjorliFnuggPosts(3);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const items = await getAlerts({ language, limit: 1 });
      if (cancelled) return;
      setAlert(items[0] ?? null);
      setLoaded(true);
    };
    load();

    // Realtime: refresh when admins change alerts.
    const channel = supabase
      .channel('alerts-public')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => load())
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [language]);

  // ----- Priority chain -----
  //   1. Critical CMS alert
  //   2. Latest Fnugg post
  //   3. Non-critical CMS alert
  //   4. Safe fallback
  //
  // NOTE: Seasonal handling — daily Fnugg posts are mainly relevant in winter.
  // The frontend currently surfaces them year-round; a future enhancement is
  // to gate this on `useSeason()` so the homepage prioritises the CMS alert
  // path during summer.
  const criticalAlert = alert?.level === 'critical' ? alert : null;
  const nonCriticalAlert = alert && alert.level !== 'critical' ? alert : null;
  const fnuggPost: BjorliFnuggPost | null = !criticalAlert && latestPost ? latestPost : null;

  // Resolve display content based on priority.
  let level: CmsAlert['level'] = 'info';
  let label: string | undefined = fallback.label ?? 'Driftsmelding';
  let dateLine: string | null = null;
  let title: string | null = null;
  let message: string = '';
  let ctaLabel: string | undefined;
  let ctaHref: string | undefined;
  let ctaExternal = false;

  if (criticalAlert) {
    level = 'critical';
    label = criticalAlert.label ?? label;
    message = criticalAlert.message;
    ctaLabel = criticalAlert.ctaLabel;
    ctaHref = criticalAlert.ctaHref;
  } else if (fnuggPost) {
    level = 'info';
    dateLine = formatNorwegianDate(fnuggPost.date);
    title = isTitleEffectivelyDate(fnuggPost.title, dateLine) ? null : fnuggPost.title;
    message = truncateExcerpt(fnuggPost.descriptionText ?? '', 420);
    ctaLabel = locale === 'no' ? 'Se alle driftsmeldinger' : 'See all updates';
    ctaHref = ALL_ALERTS_URL;
    ctaExternal = true;
  } else if (nonCriticalAlert) {
    level = nonCriticalAlert.level;
    label = nonCriticalAlert.label ?? label;
    message = nonCriticalAlert.message;
    ctaLabel = nonCriticalAlert.ctaLabel;
    ctaHref = nonCriticalAlert.ctaHref;
  } else if (loaded && postsLoaded) {
    // Safe fallback — do NOT echo old hardcoded seasonal text.
    message =
      locale === 'no'
        ? 'Ingen ny driftsmelding tilgjengelig akkurat nå.'
        : 'No operational update available right now.';
    ctaLabel = locale === 'no' ? 'Se åpningstider' : 'See opening hours';
    ctaHref = '/apningstider';
  } else {
    // Still loading — render nothing to avoid a flash of fallback text.
    return null;
  }

  if (!message) return null;

  const styles = LEVEL_STYLES[level];
  const Icon = styles.Icon;

  // Compact mode: collapse normal info-level updates (Fnugg daily posts,
  // safe fallback, non-critical CMS info) into a single calm line so the
  // hero → status → guest message → intro flow stays continuous. Warnings
  // and critical alerts keep the full expanded card.
  const compact = level === 'info';

  const ctaContent = ctaLabel && ctaHref && (
    ctaExternal ? (
      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-sm font-medium hover:underline shrink-0 inline-flex items-center gap-1 ${styles.icon}`}
      >
        {ctaLabel} <ChevronRight className="h-4 w-4" />
      </a>
    ) : (
      <Link
        to={lp(ctaHref)}
        className={`text-sm font-medium hover:underline shrink-0 inline-flex items-center gap-1 ${styles.icon}`}
      >
        {ctaLabel} <ChevronRight className="h-4 w-4" />
      </Link>
    )
  );

  if (compact) {
    // Build a tight, single-line guest message. Prefer date as the primary
    // anchor (matches Fnugg ops cadence), then a short snippet of the body.
    const oneLiner = (() => {
      const parts: string[] = [];
      if (dateLine) parts.push(dateLine);
      if (title) parts.push(title);
      const body = message.replace(/\s+/g, ' ').trim();
      if (body) parts.push(body.length > 140 ? `${body.slice(0, 140).trimEnd()}…` : body);
      return parts.join(' · ');
    })();
    return (
      <section className="px-4 mt-6" aria-label="Latest operational update">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 text-sm text-foreground/80 border-y border-border/60 py-3">
            <Icon className={`h-4 w-4 shrink-0 ${styles.icon}`} />
            {label && (
              <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] shrink-0 ${styles.icon}`}>
                {label}
              </span>
            )}
            <span className="flex-1 truncate">{oneLiner}</span>
            {ctaContent}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 mt-8" aria-label="Latest operational update">
      <div className="container mx-auto max-w-5xl">
        <div className={`rounded-xl border p-4 md:p-5 flex items-start gap-3 ${styles.wrap}`}>
          <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${styles.icon}`} />
          <div className="flex-1">
            {label && (
              <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${styles.icon}`}>{label}</div>
            )}
            {dateLine && (
              // Bold date as text (not just visual) — readable to screen readers.
              <p className="text-sm text-foreground mb-1">
                <strong className="font-semibold">{dateLine}</strong>
              </p>
            )}
            {title && (
              <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
            )}
            <p className="text-sm text-foreground whitespace-pre-line">{message}</p>
          </div>
          {ctaContent}
        </div>
      </div>
    </section>
  );
};

export default LiveAlertBanner;