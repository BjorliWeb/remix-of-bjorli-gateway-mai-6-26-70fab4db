import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mountain,
  Activity,
  CloudSnow,
  Thermometer,
  Clock,
  Camera,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import type { CmsStatusSection } from '@/lib/cms';
import { useBjorliStatus } from '@/hooks/useBjorliStatus';
import type { BjorliFnuggStatus } from '@/lib/integrations/fnugg';
import LiveFnuggStatus from '@/components/LiveFnuggStatus';
import { track, type AnalyticsEventName } from '@/lib/analytics';

/**
 * Live operational status cards. Pulls from `operational_status` table
 * (admin-managed) with realtime subscription. Falls back to the CMS-supplied
 * static values if the database has no rows for the active language.
 *
 * Stays in the components layer; database access is encapsulated here so the
 * rest of the homepage remains CMS-agnostic.
 */

interface StatusRow {
  metric_key: string;
  value: string;
  label: string;
  icon: string;
  sort_order: number;
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lifts: Mountain,
  slopes: Activity,
  snow: CloudSnow,
  temperature: Thermometer,
  mountain: Mountain,
  clock: Clock,
  camera: Camera,
};

const EM_DASH = '—';

/** Map a card icon key to the Fnugg-derived live value + a screen-reader label. */
function liveValueFor(
  icon: string,
  s: BjorliFnuggStatus,
  locale: string,
): { value: string | null; ariaLabel: string | null } {
  const fmtRatio = (open: number | null, total: number | null) =>
    open === null && total === null ? null : `${open ?? EM_DASH}/${total ?? EM_DASH}`;

  switch (icon) {
    case 'lifts': {
      return {
        value: fmtRatio(s.liftsOpen, s.liftsTotal) ?? `${EM_DASH}/${EM_DASH}`,
        ariaLabel:
          s.liftsOpen !== null && s.liftsTotal !== null
            ? `Open lifts: ${s.liftsOpen} of ${s.liftsTotal}`
            : 'Open lifts: not available',
      };
    }
    case 'slopes': {
      return {
        value: fmtRatio(s.slopesOpen, s.slopesTotal) ?? `${EM_DASH}/${EM_DASH}`,
        ariaLabel:
          s.slopesOpen !== null && s.slopesTotal !== null
            ? `Open alpine slopes: ${s.slopesOpen} of ${s.slopesTotal}`
            : 'Open alpine slopes: not available',
      };
    }
    case 'snow': {
      const v = s.snowDepthCm;
      return {
        value: v === null ? `${EM_DASH} cm` : `${Math.round(v)} cm`,
        ariaLabel:
          v === null ? 'Snow depth: not available' : `Snow depth: ${Math.round(v)} centimeters`,
      };
    }
    case 'temperature': {
      const v = s.temperatureC;
      if (v === null) return { value: `${EM_DASH}°C`, ariaLabel: 'Temperature: not available' };
      const rounded = Math.round(v);
      const spoken = rounded < 0 ? `minus ${Math.abs(rounded)}` : `${rounded}`;
      return { value: `${rounded}°C`, ariaLabel: `Temperature: ${spoken} degrees Celsius` };
    }
    default:
      return { value: null, ariaLabel: null };
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const LiveStatusCards = ({ section }: { section: CmsStatusSection }) => {
  const { locale } = useLanguage();
  const language = locale;
  const lp = useLocalizedPath();
  const [rows, setRows] = useState<StatusRow[] | null>(null);
  const { status: fnugg, state: fnuggState, hasLiveData } = useBjorliStatus();

  useEffect(() => {
    let active = true;

    const load = async () => {
      // Try the active language first, fall back to Norwegian.
      let { data } = await supabase
        .from('operational_status')
        .select('metric_key,value,label,icon,sort_order')
        .eq('is_active', true)
        .eq('language', language)
        .order('sort_order', { ascending: true });

      if ((!data || data.length === 0) && language !== 'no') {
        const fallback = await supabase
          .from('operational_status')
          .select('metric_key,value,label,icon,sort_order')
          .eq('is_active', true)
          .eq('language', 'no')
          .order('sort_order', { ascending: true });
        data = fallback.data;
      }
      if (active) setRows(data ?? []);
    };

    load();

    const channel = supabase
      .channel('operational_status_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'operational_status' },
        () => load(),
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [language]);

  // Use live rows when available, otherwise CMS fallback.
  const cards =
    rows && rows.length > 0
      ? rows.map((r) => ({ icon: r.icon, value: r.value, label: r.label }))
      : section.cards;

  // Overlay live Fnugg values on top of CMS/admin cards. Fnugg is the source
  // of truth for the four operational metrics; the CMS only supplies labels
  // and ordering when Fnugg has no value for that icon.

  return (
    <section className="relative -mt-10 md:-mt-16 z-20 px-4">
      <div className="container mx-auto">
        {section.heading && (
          <div className="text-center text-muted-foreground text-[11px] md:text-xs font-medium tracking-[0.24em] uppercase mb-5 max-w-3xl mx-auto">
            {section.heading}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
          {cards.map((card, i) => {
            const Icon = ICONS[card.icon] || Mountain;
            const live = liveValueFor(card.icon, fnugg, locale);
            const displayValue = live.value ?? card.value;
            const isLoadingFirst = fnuggState === 'loading' && !hasLiveData && live.value !== null;
            return (
              <motion.div
                key={card.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass rounded-xl px-3 py-4 md:px-4 md:py-5 text-center border border-white/10"
                role="group"
                aria-label={live.ariaLabel ?? card.label}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5 mx-auto mb-2 text-secondary" />
                <div
                  className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight leading-none"
                  aria-live="polite"
                >
                  {isLoadingFirst ? (
                    <span className="inline-block h-5 w-12 rounded bg-muted/60 animate-pulse align-middle" />
                  ) : (
                    displayValue
                  )}
                </div>
                <div className="text-[10px] md:text-[11px] text-muted-foreground mt-1.5 tracking-[0.08em] uppercase">{card.label}</div>
              </motion.div>
            );
          })}
        </div>
        {/* Compact "today / last updated" line — sourced from Fnugg, NOT
            from the Opening Hours page. The Opening Hours page is the
            source of truth for general seasonal hours. */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <LiveFnuggStatus variant="compact" locale={locale} />
          <div className="flex flex-wrap justify-center gap-2 text-sm">
          {section.links.map((link, i) => {
            const Icon = ICONS[link.icon] || Clock;
            // Rename the "Åpningstider i dag" link — homepage live status now
            // answers "is the resort open today" via Fnugg, so the link should
            // simply lead to the page with general / seasonal hours.
            const label =
              link.icon === 'clock' && /i dag/i.test(link.label)
                ? locale === 'no'
                  ? 'Se åpningstider'
                  : link.label.replace(/\s*i dag\s*/i, ' ').trim()
                : link.label;
            // Map status link icons to a tracking event. Falls back to a
            // generic external/internal click event when no mapping exists.
            const eventByIcon: Record<string, AnalyticsEventName> = {
              clock: 'click_opening_hours',
              camera: 'click_weather_webcams',
            };
            const evt = eventByIcon[link.icon] ?? 'click_external_link';
            const onClick = () =>
              track(evt, {
                page_path: typeof window !== 'undefined' ? window.location.pathname : '',
                language: locale,
                link_url: link.href,
                link_text: label,
                outbound: false,
              });
            return (
              <span key={link.href} className="inline-flex items-center gap-2">
                {i > 0 && <span className="text-muted-foreground/60">·</span>}
                <Link
                  to={lp(link.href)}
                  className="text-secondary hover:underline inline-flex items-center gap-1 text-[13px] font-medium"
                  onClick={onClick}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </Link>
              </span>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStatusCards;