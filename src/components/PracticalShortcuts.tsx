import { Link } from 'react-router-dom';
import { Clock, Mountain, Camera, Map } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

type Key = 'hours' | 'conditions' | 'weather' | 'map';

/** Labels per language. Shared with the prerender skeleton. */
export const PRACTICAL_SHORTCUTS: { key: Key; href: string; labels: Record<string, string> }[] = [
  { key: 'hours', href: '/apningstider', labels: { no: 'Åpningstider', en: 'Opening hours', de: 'Öffnungszeiten', nl: 'Openingstijden', da: 'Åbningstider', sv: 'Öppettider' } },
  { key: 'conditions', href: '/live', labels: { no: 'Føre og heiser', en: 'Snow and lifts', de: 'Schnee und Lifte', nl: 'Sneeuw en liften', da: 'Føre og lifte', sv: 'Före och liftar' } },
  { key: 'weather', href: '/vaer-og-webkamera', labels: { no: 'Vær og webkamera', en: 'Weather and webcams', de: 'Wetter und Webcams', nl: 'Weer en webcams', da: 'Vejr og webkamera', sv: 'Väder och webbkamera' } },
  { key: 'map', href: '/loypekart', labels: { no: 'Løypekart', en: 'Trail map', de: 'Pistenplan', nl: 'Pistekaart', da: 'Løypekort', sv: 'Pistkarta' } },
];

export const PRACTICAL_SHORTCUTS_LABEL: Record<string, string> = {
  no: 'Praktisk informasjon', en: 'Practical information', de: 'Praktische Informationen',
  nl: 'Praktische informatie', da: 'Praktisk information', sv: 'Praktisk information',
};

const ICONS = { hours: Clock, conditions: Mountain, weather: Camera, map: Map } as const;

const PracticalShortcuts = () => {
  const { locale } = useLanguage();
  const lp = useLocalizedPath();
  return (
    <nav aria-label={PRACTICAL_SHORTCUTS_LABEL[locale] ?? PRACTICAL_SHORTCUTS_LABEL.no} className="bg-muted">
      <ul className="mx-auto grid max-w-[1280px] grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 px-5 sm:px-6 md:px-10 py-4 md:py-5">
        {PRACTICAL_SHORTCUTS.map(({ key, href, labels }) => {
          const Icon = ICONS[key];
          return (
            <li key={key}>
              <Link
                to={lp(href)}
                className="flex min-h-[56px] items-center gap-3 rounded-xl bg-card px-4 py-3 text-sm md:text-base font-semibold text-primary ring-1 ring-border hover:ring-primary/40 transition-shadow"
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span>{labels[locale] ?? labels.no}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default PracticalShortcuts;
