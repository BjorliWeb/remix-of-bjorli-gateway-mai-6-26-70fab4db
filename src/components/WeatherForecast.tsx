import { motion } from 'framer-motion';
import { CloudRain, Thermometer, Wind } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useBjorliForecast } from '@/hooks/useBjorliForecast';
import {
  currentHour,
  formatFetchedAt,
  formatHour,
  formatPrecipitation,
  formatTemperature,
  formatWeekday,
  formatWindWithDirection,
} from '@/lib/integrations/googleWeather';

/**
 * Weather forecast for the Bjorli BASE point (owner-confirmed coordinates).
 *
 * Deliberately separate from Fnugg: Fnugg reports live operational status and
 * measured conditions, this block is a forecast. No top-station forecast is
 * derived, and precipitation is never converted to snow depth.
 */

interface ForecastCopy {
  title: string;
  compactTitle: string;
  baseNote: string;
  sourceLabel: string;
  fetchedLabel: string;
  unavailable: string;
  staleNote: string;
  loading: string;
  hourlyTitle: string;
  dailyTitle: string;
  temperature: string;
  wind: string;
  windGustNote: string;
  precipitation: string;
  time: string;
  day: string;
}

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', ForecastCopy> = {
  no: {
    title: 'Værvarsel for Bjorli',
    compactTitle: 'Værvarsel',
    baseNote: 'Varselet gjelder baseområdet på Bjorli.',
    sourceLabel: 'Kilde: Google Weather API',
    fetchedLabel: 'Hentet',
    unavailable: 'Værvarselet er midlertidig utilgjengelig.',
    staleNote: 'Viser sist hentede varsel – kan være utdatert.',
    loading: 'Henter værvarsel …',
    hourlyTitle: 'Neste 24 timer',
    dailyTitle: 'Neste 7 dager',
    temperature: 'Temperatur',
    wind: 'Vind',
    windGustNote: 'Vind (vindkast) i m/s',
    precipitation: 'Nedbør',
    time: 'Tid',
    day: 'Dag',
  },
  en: {
    title: 'Weather forecast for Bjorli',
    compactTitle: 'Weather forecast',
    baseNote: 'The forecast applies to the base area at Bjorli.',
    sourceLabel: 'Source: Google Weather API',
    fetchedLabel: 'Retrieved',
    unavailable: 'The forecast is temporarily unavailable.',
    staleNote: 'Showing the last retrieved forecast – it may be out of date.',
    loading: 'Loading forecast …',
    hourlyTitle: 'Next 24 hours',
    dailyTitle: 'Next 7 days',
    temperature: 'Temperature',
    wind: 'Wind',
    windGustNote: 'Wind (gusts) in m/s',
    precipitation: 'Precipitation',
    time: 'Time',
    day: 'Day',
  },
  de: {
    title: 'Wettervorhersage für Bjorli',
    compactTitle: 'Wettervorhersage',
    baseNote: 'Die Vorhersage gilt für das Basisgebiet in Bjorli.',
    sourceLabel: 'Quelle: Google Weather API',
    fetchedLabel: 'Abgerufen',
    unavailable: 'Die Wettervorhersage ist vorübergehend nicht verfügbar.',
    staleNote: 'Zeigt die zuletzt abgerufene Vorhersage – sie kann veraltet sein.',
    loading: 'Vorhersage wird geladen …',
    hourlyTitle: 'Nächste 24 Stunden',
    dailyTitle: 'Nächste 7 Tage',
    temperature: 'Temperatur',
    wind: 'Wind',
    windGustNote: 'Wind (Böen) in m/s',
    precipitation: 'Niederschlag',
    time: 'Zeit',
    day: 'Tag',
  },
  nl: {
    title: 'Weersverwachting voor Bjorli',
    compactTitle: 'Weersverwachting',
    baseNote: 'De verwachting geldt voor het basisgebied in Bjorli.',
    sourceLabel: 'Bron: Google Weather API',
    fetchedLabel: 'Opgehaald',
    unavailable: 'De weersverwachting is tijdelijk niet beschikbaar.',
    staleNote: 'Toont de laatst opgehaalde verwachting – deze kan verouderd zijn.',
    loading: 'Verwachting laden …',
    hourlyTitle: 'Komende 24 uur',
    dailyTitle: 'Komende 7 dagen',
    temperature: 'Temperatuur',
    wind: 'Wind',
    windGustNote: 'Wind (windstoten) in m/s',
    precipitation: 'Neerslag',
    time: 'Tijd',
    day: 'Dag',
  },
  da: {
    title: 'Vejrudsigt for Bjorli',
    compactTitle: 'Vejrudsigt',
    baseNote: 'Udsigten gælder baseområdet på Bjorli.',
    sourceLabel: 'Kilde: Google Weather API',
    fetchedLabel: 'Hentet',
    unavailable: 'Vejrudsigten er midlertidigt utilgængelig.',
    staleNote: 'Viser den senest hentede udsigt – den kan være forældet.',
    loading: 'Henter vejrudsigt …',
    hourlyTitle: 'De næste 24 timer',
    dailyTitle: 'De næste 7 dage',
    temperature: 'Temperatur',
    wind: 'Vind',
    windGustNote: 'Vind (vindstød) i m/s',
    precipitation: 'Nedbør',
    time: 'Tid',
    day: 'Dag',
  },
  sv: {
    title: 'Väderprognos för Bjorli',
    compactTitle: 'Väderprognos',
    baseNote: 'Prognosen gäller basområdet i Bjorli.',
    sourceLabel: 'Källa: Google Weather API',
    fetchedLabel: 'Hämtad',
    unavailable: 'Väderprognosen är tillfälligt otillgänglig.',
    staleNote: 'Visar den senast hämtade prognosen – den kan vara inaktuell.',
    loading: 'Hämtar väderprognos …',
    hourlyTitle: 'Närmaste 24 timmarna',
    dailyTitle: 'Närmaste 7 dagarna',
    temperature: 'Temperatur',
    wind: 'Vind',
    windGustNote: 'Vind (byar) i m/s',
    precipitation: 'Nederbörd',
    time: 'Tid',
    day: 'Dag',
  },
};

interface Props {
  variant?: 'full' | 'compact';
}

const WeatherForecast = ({ variant = 'full' }: Props) => {
  const { locale } = useLanguage();
  const copy = usePageCopy(COPY);
  const { forecast, state, hasData } = useBjorliForecast();
  const fetched = formatFetchedAt(forecast.fetchedAt, locale);

  const meta = (
    <p className="text-xs text-muted-foreground">
      {copy.baseNote} {copy.sourceLabel}
      {fetched && (
        <>
          {' · '}
          {copy.fetchedLabel}: {fetched}
        </>
      )}
    </p>
  );

  if (state === 'error' && !hasData) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {variant === 'compact' ? copy.compactTitle : copy.title}
        </span>
        <span className="mx-2 opacity-60">·</span>
        {copy.unavailable}
      </div>
    );
  }

  if (!hasData) {
    return (
      <div
        className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground"
        aria-live="polite"
      >
        {copy.loading}
      </div>
    );
  }

  // -------------------------------------------------------------- compact
  if (variant === 'compact') {
    const nowHour = currentHour(forecast);
    const days = forecast.days.slice(0, 3);
    return (
      <section
        aria-label={copy.compactTitle}
        className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm"
      >
        <header className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
          <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">
            {copy.compactTitle}
          </h2>
          {forecast.stale && (
            <span className="text-xs text-muted-foreground italic">{copy.staleNote}</span>
          )}
        </header>
        {nowHour && (
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1 inline-flex items-center gap-1">
                <Thermometer className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                {copy.temperature}
              </dt>
              <dd className="text-foreground font-medium">
                {formatTemperature(nowHour.temperatureC)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1 inline-flex items-center gap-1">
                <Wind className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                {copy.wind}
              </dt>
              <dd className="text-foreground font-medium">
                {formatWindWithDirection(
                  nowHour.speedMs,
                  nowHour.gustMs,
                  nowHour.windDirectionCardinal,
                  nowHour.windDirectionDegrees,
                  locale,
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground mb-1 inline-flex items-center gap-1">
                <CloudRain className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                {copy.precipitation}
              </dt>
              <dd className="text-foreground font-medium">
                {formatPrecipitation(nowHour.precipitationMm)}
              </dd>
            </div>
          </dl>
        )}
        {days.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
            {days.map((d, i) => (
              <li key={d.date ?? i} className="rounded-lg bg-muted/40 px-3 py-2">
                <span className="block text-xs text-muted-foreground">
                  {formatWeekday(d.startTime ?? d.date, locale)}
                </span>
                <span className="block text-foreground font-medium">
                  {formatTemperature(d.maxTemperatureC)} / {formatTemperature(d.minTemperatureC)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {meta}
      </section>
    );
  }

  // ----------------------------------------------------------------- full
  const hours = forecast.hours.slice(0, 24);
  const days = forecast.days.slice(0, 7);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      aria-labelledby="forecast-heading"
      className="rounded-xl border border-border bg-card p-5 md:p-6 shadow-sm"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h2
          id="forecast-heading"
          className="font-display text-xl md:text-2xl font-semibold text-foreground"
        >
          {copy.title}
        </h2>
        {forecast.stale && (
          <span className="text-xs text-muted-foreground italic">{copy.staleNote}</span>
        )}
      </header>
      <p className="text-xs text-muted-foreground mb-6">{copy.windGustNote}</p>

      {hours.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-foreground mb-3">{copy.hourlyTitle}</h3>
          <div className="-mx-1 overflow-x-auto pb-2 mb-6">
            <ul className="flex gap-2 px-1 min-w-max">
              {hours.map((h, i) => (
                <li
                  key={h.startTime ?? i}
                  className="w-[104px] shrink-0 rounded-lg border border-border/60 bg-muted/30 px-2 py-3 text-center"
                >
                  <span className="block text-xs text-muted-foreground mb-1">
                    {formatHour(h.startTime, locale)}
                  </span>
                  <span className="block text-foreground font-semibold text-sm">
                    {formatTemperature(h.temperatureC)}
                  </span>
                  <span className="block text-[11px] text-muted-foreground mt-1">
                    {formatWindWithDirection(
                      h.speedMs,
                      h.gustMs,
                      h.windDirectionCardinal,
                      h.windDirectionDegrees,
                      locale,
                    )}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {formatPrecipitation(h.precipitationMm)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {days.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-foreground mb-3">{copy.dailyTitle}</h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="text-left font-medium py-2">{copy.day}</th>
                  <th scope="col" className="text-right font-medium py-2">{copy.temperature}</th>
                  <th scope="col" className="text-right font-medium py-2">{copy.wind}</th>
                  <th scope="col" className="text-right font-medium py-2">{copy.precipitation}</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d, i) => (
                  <tr key={d.date ?? i} className="border-t border-border/60">
                    <th scope="row" className="text-left font-medium text-foreground py-2.5">
                      {formatWeekday(d.startTime ?? d.date, locale)}
                    </th>
                    <td className="text-right text-foreground py-2.5">
                      {formatTemperature(d.maxTemperatureC)} / {formatTemperature(d.minTemperatureC)}
                    </td>
                    <td className="text-right text-muted-foreground py-2.5">
                      {formatWindWithDirection(
                        d.speedMs,
                        d.gustMs,
                        d.windDirectionCardinal,
                        d.windDirectionDegrees,
                        locale,
                      )}
                    </td>
                    <td className="text-right text-muted-foreground py-2.5">
                      {formatPrecipitation(d.precipitationMm)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {meta}
    </motion.section>
  );
};

export default WeatherForecast;
