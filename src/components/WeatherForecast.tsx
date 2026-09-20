import { useState } from 'react';
import { motion } from 'framer-motion';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import {
  ArrowUp,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  Moon,
  Sun,
  Thermometer,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useBjorliForecast } from '@/hooks/useBjorliForecast';
import { Button } from '@/components/ui/button';
import {
  currentHour,
  formatFetchedAt,
  formatHour,
  formatPrecipitation,
  formatTemperature,
  formatHourClock,
  formatWeekday,
  formatWind,
  formatWindDirectionLong,
  formatWindWithDirection,
  localizedCondition,
  weatherSymbolKind,
  windTargetDegrees,
  type WeatherDay,
  type WeatherHour,
  type WeatherSymbolKind,
} from '@/lib/integrations/googleWeather';

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
  gust: string;
  windGustNote: string;
  windArrowNote: string;
  precipitation: string;
  forecastAt: string;
  conditionUnavailable: string;
  symbols: Record<WeatherSymbolKind, string>;
}

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', ForecastCopy> = {
  no: {
    title: 'Værvarsel for Bjorli', compactTitle: 'Værvarsel', baseNote: 'Varselet gjelder baseområdet på Bjorli.',
    sourceLabel: 'Kilde: Google Weather API', fetchedLabel: 'Hentet', unavailable: 'Værvarselet er midlertidig utilgjengelig.',
    staleNote: 'Viser sist hentede varsel – kan være utdatert.', loading: 'Henter værvarsel …', hourlyTitle: 'Neste 24 timer',
    dailyTitle: 'Neste 7 dager', temperature: 'Temperatur', wind: 'Vind', gust: 'Vindkast', windGustNote: 'Vind og vindkast i m/s',
    windArrowNote: 'Pilen viser hvor vinden blåser mot. Teksten viser hvor vinden kommer fra.', precipitation: 'Nedbør',
    forecastAt: 'Værvarsel kl.', conditionUnavailable: 'Værtype ikke tilgjengelig',
    symbols: { clear: 'Klart', 'partly-cloudy': 'Delvis skyet', cloudy: 'Skyet', fog: 'Tåke', rain: 'Regn', snow: 'Snø', storm: 'Tordenvær', unknown: 'Værtype ikke tilgjengelig' },
  },
  en: {
    title: 'Weather forecast for Bjorli', compactTitle: 'Weather forecast', baseNote: 'The forecast applies to the base area at Bjorli.',
    sourceLabel: 'Source: Google Weather API', fetchedLabel: 'Retrieved', unavailable: 'The forecast is temporarily unavailable.',
    staleNote: 'Showing the last retrieved forecast – it may be out of date.', loading: 'Loading forecast …', hourlyTitle: 'Next 24 hours',
    dailyTitle: 'Next 7 days', temperature: 'Temperature', wind: 'Wind', gust: 'Gusts', windGustNote: 'Wind and gusts in m/s',
    windArrowNote: 'The arrow shows where the wind is blowing towards. The text shows where it comes from.', precipitation: 'Precipitation',
    forecastAt: 'Forecast at', conditionUnavailable: 'Weather condition unavailable',
    symbols: { clear: 'Clear', 'partly-cloudy': 'Partly cloudy', cloudy: 'Cloudy', fog: 'Fog', rain: 'Rain', snow: 'Snow', storm: 'Thunderstorm', unknown: 'Weather condition unavailable' },
  },
  de: {
    title: 'Wettervorhersage für Bjorli', compactTitle: 'Wettervorhersage', baseNote: 'Die Vorhersage gilt für das Basisgebiet in Bjorli.',
    sourceLabel: 'Quelle: Google Weather API', fetchedLabel: 'Abgerufen', unavailable: 'Die Wettervorhersage ist vorübergehend nicht verfügbar.',
    staleNote: 'Zeigt die zuletzt abgerufene Vorhersage – sie kann veraltet sein.', loading: 'Vorhersage wird geladen …', hourlyTitle: 'Nächste 24 Stunden',
    dailyTitle: 'Nächste 7 Tage', temperature: 'Temperatur', wind: 'Wind', gust: 'Böen', windGustNote: 'Wind und Böen in m/s',
    windArrowNote: 'Der Pfeil zeigt, wohin der Wind weht. Der Text zeigt, woher er kommt.', precipitation: 'Niederschlag',
    forecastAt: 'Wettervorhersage um', conditionUnavailable: 'Wetterlage nicht verfügbar',
    symbols: { clear: 'Klar', 'partly-cloudy': 'Teilweise bewölkt', cloudy: 'Bewölkt', fog: 'Nebel', rain: 'Regen', snow: 'Schnee', storm: 'Gewitter', unknown: 'Wetterlage nicht verfügbar' },
  },
  nl: {
    title: 'Weersverwachting voor Bjorli', compactTitle: 'Weersverwachting', baseNote: 'De verwachting geldt voor het basisgebied in Bjorli.',
    sourceLabel: 'Bron: Google Weather API', fetchedLabel: 'Opgehaald', unavailable: 'De weersverwachting is tijdelijk niet beschikbaar.',
    staleNote: 'Toont de laatst opgehaalde verwachting – deze kan verouderd zijn.', loading: 'Verwachting laden …', hourlyTitle: 'Komende 24 uur',
    dailyTitle: 'Komende 7 dagen', temperature: 'Temperatuur', wind: 'Wind', gust: 'Windstoten', windGustNote: 'Wind en windstoten in m/s',
    windArrowNote: 'De pijl toont waarheen de wind waait. De tekst toont waar hij vandaan komt.', precipitation: 'Neerslag',
    forecastAt: 'Weersverwachting om', conditionUnavailable: 'Weertype niet beschikbaar',
    symbols: { clear: 'Helder', 'partly-cloudy': 'Halfbewolkt', cloudy: 'Bewolkt', fog: 'Mist', rain: 'Regen', snow: 'Sneeuw', storm: 'Onweer', unknown: 'Weertype niet beschikbaar' },
  },
  da: {
    title: 'Vejrudsigt for Bjorli', compactTitle: 'Vejrudsigt', baseNote: 'Udsigten gælder baseområdet på Bjorli.',
    sourceLabel: 'Kilde: Google Weather API', fetchedLabel: 'Hentet', unavailable: 'Vejrudsigten er midlertidigt utilgængelig.',
    staleNote: 'Viser den senest hentede udsigt – den kan være forældet.', loading: 'Henter vejrudsigt …', hourlyTitle: 'De næste 24 timer',
    dailyTitle: 'De næste 7 dage', temperature: 'Temperatur', wind: 'Vind', gust: 'Vindstød', windGustNote: 'Vind og vindstød i m/s',
    windArrowNote: 'Pilen viser, hvor vinden blæser hen. Teksten viser, hvor den kommer fra.', precipitation: 'Nedbør',
    forecastAt: 'Vejrudsigt kl.', conditionUnavailable: 'Vejrtype ikke tilgængelig',
    symbols: { clear: 'Klart', 'partly-cloudy': 'Delvist skyet', cloudy: 'Skyet', fog: 'Tåge', rain: 'Regn', snow: 'Sne', storm: 'Tordenvejr', unknown: 'Vejrtype ikke tilgængelig' },
  },
  sv: {
    title: 'Väderprognos för Bjorli', compactTitle: 'Väderprognos', baseNote: 'Prognosen gäller basområdet i Bjorli.',
    sourceLabel: 'Källa: Google Weather API', fetchedLabel: 'Hämtad', unavailable: 'Väderprognosen är tillfälligt otillgänglig.',
    staleNote: 'Visar den senast hämtade prognosen – den kan vara inaktuell.', loading: 'Hämtar väderprognos …', hourlyTitle: 'Närmaste 24 timmarna',
    dailyTitle: 'Närmaste 7 dagarna', temperature: 'Temperatur', wind: 'Vind', gust: 'Vindbyar', windGustNote: 'Vind och vindbyar i m/s',
    windArrowNote: 'Pilen visar vart vinden blåser. Texten visar varifrån den kommer.', precipitation: 'Nederbörd',
    forecastAt: 'Väderprognos kl.', conditionUnavailable: 'Vädertyp inte tillgänglig',
    symbols: { clear: 'Klart', 'partly-cloudy': 'Delvis molnigt', cloudy: 'Molnigt', fog: 'Dimma', rain: 'Regn', snow: 'Snö', storm: 'Åskväder', unknown: 'Vädertyp inte tillgänglig' },
  },
};

interface Props { variant?: 'full' | 'compact' }
function WeatherIcon({ type, daytime, label, className = 'h-7 w-7' }: { type: string | null; daytime: boolean | null; label: string; className?: string }) {
  const kind = weatherSymbolKind(type);
  let Icon: LucideIcon;
  if (kind === 'clear') Icon = daytime === false ? Moon : Sun;
  else if (kind === 'partly-cloudy') Icon = daytime === false ? CloudMoon : CloudSun;
  else if (kind === 'rain') Icon = daytime === false ? CloudMoonRain : CloudSunRain;
  else if (kind === 'snow') Icon = CloudSnow;
  else if (kind === 'storm') Icon = CloudLightning;
  else if (kind === 'fog') Icon = CloudFog;
  else Icon = Cloud;
  return <span role="img" aria-label={label} title={label}><Icon className={`${className} text-secondary`} aria-hidden={true} /></span>;
}

function hourSummary(h: WeatherHour, copy: ForecastCopy, locale: string) {
  const condition = localizedCondition(
    h.conditionType,
    locale,
    copy.symbols[weatherSymbolKind(h.conditionType)],
  );
  const wind = `${formatWind(h.speedMs, null)} ${windFrom(locale)} ${formatWindDirectionLong(h.windDirectionCardinal, h.windDirectionDegrees, locale)}`;
  const gust = h.gustMs === null ? '—' : `${Math.round(h.gustMs)} m/s`;
  return `${condition}. ${copy.temperature}: ${formatTemperature(h.temperatureC)}. ${copy.precipitation}: ${formatPrecipitation(h.precipitationMm)}. ${copy.wind}: ${wind}. ${copy.gust}: ${gust}.`;
}

function hourHeading(h: WeatherHour, copy: ForecastCopy, locale: string) {
  return `${copy.forecastAt} ${formatHourClock(h.startTime, locale)}`;
}

const HourlyTimeline = ({ hours, copy, locale }: { hours: WeatherHour[]; copy: ForecastCopy; locale: string }) => {
  const [selected, setSelected] = useState(0);
  const active = hours[selected] ?? hours[0];
  const width = Math.max(hours.length * 80, 480);
  const temperatures = hours.map((h) => h.temperatureC).filter((v): v is number => v !== null);
  const minTemp = temperatures.length ? Math.min(...temperatures) : 0;
  const maxTemp = temperatures.length ? Math.max(...temperatures) : 1;
  const tempRange = Math.max(maxTemp - minTemp, 1);
  const maxPrecip = Math.max(...hours.map((h) => h.precipitationMm ?? 0), 1);
  const temperatureData = hours.map((h) => ({ temperature: h.temperatureC }));

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border bg-muted/20 pb-2" tabIndex={0} aria-label={copy.hourlyTitle}>
        <div className="relative min-w-max" style={{ width }}>
          <div className="grid h-20 border-b border-border/60" style={{ gridTemplateColumns: `repeat(${hours.length}, 80px)` }}>
            {hours.map((h, i) => {
              const kind = weatherSymbolKind(h.conditionType);
              return <div key={h.startTime ?? i} className="flex flex-col items-center justify-center gap-1 border-r border-border/40 text-xs text-muted-foreground last:border-r-0">
                <span>{formatHour(h.startTime, locale)}</span>
                <WeatherIcon type={h.conditionType} daytime={h.isDaytime} label={localizedCondition(h.conditionType, locale, copy.symbols[kind])} />
              </div>;
            })}
          </div>

          <div className="relative h-24 border-b border-border/60" aria-label={copy.temperature}>
            <span className="absolute left-2 top-2 z-10 text-[11px] font-medium uppercase text-muted-foreground">{copy.temperature} °C</span>
            <div className="absolute inset-0 text-secondary" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData} margin={{ top: 24, right: 40, bottom: 24, left: 40 }}>
                  <YAxis hide domain={[minTemp, minTemp + tempRange]} />
                  <Line type="linear" dataKey="temperature" stroke="currentColor" strokeWidth={3} dot={{ r: 4, fill: 'currentColor', strokeWidth: 0 }} activeDot={false} connectNulls={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {hours.map((h, i) => h.temperatureC === null ? null : <span key={h.startTime ?? i} className="absolute top-1/2 -translate-x-1/2 text-[11px] font-semibold text-foreground" style={{ left: i * 80 + 40 }}>{formatTemperature(h.temperatureC)}</span>)}
          </div>

          <div className="relative grid h-24 items-end border-b border-border/60 pt-7" style={{ gridTemplateColumns: `repeat(${hours.length}, 80px)` }} aria-label={copy.precipitation}>
            <span className="absolute left-2 top-2 text-[11px] font-medium uppercase text-muted-foreground">{copy.precipitation} mm</span>
            {hours.map((h, i) => <div key={h.startTime ?? i} className="flex h-16 flex-col items-center justify-end border-r border-border/40 last:border-r-0">
              {h.precipitationMm === null ? <span className="mb-4 text-muted-foreground">—</span> : <><span className="text-[10px] text-muted-foreground">{formatPrecipitation(h.precipitationMm)}</span><span className="mt-1 w-5 rounded-t-sm bg-secondary/70" style={{ height: `${Math.max((h.precipitationMm / maxPrecip) * 42, h.precipitationMm > 0 ? 3 : 1)}px` }} /></>}
            </div>)}
          </div>

          <div className="grid min-h-24" style={{ gridTemplateColumns: `repeat(${hours.length}, 80px)` }} aria-label={copy.wind}>
            {hours.map((h, i) => {
              const target = windTargetDegrees(h.windDirectionDegrees);
              return <div key={h.startTime ?? i} className="flex flex-col items-center justify-center gap-1 border-r border-border/40 px-1 text-center text-[10px] last:border-r-0">
                {target === null ? <span className="h-4 text-muted-foreground">—</span> : <ArrowUp className="h-4 w-4 text-secondary" style={{ transform: `rotate(${target}deg)` }} aria-hidden="true" />}
                <span className="font-medium text-foreground">{formatWindWithDirection(h.speedMs, null, h.windDirectionCardinal, h.windDirectionDegrees, locale)}</span>
                <span className="text-muted-foreground">{copy.gust}: {h.gustMs === null ? '—' : `${Math.round(h.gustMs)} m/s`}</span>
              </div>;
            })}
          </div>

          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${hours.length}, 80px)` }}>
            {hours.map((h, i) => <Button key={h.startTime ?? i} type="button" variant="ghost" className="h-full w-full rounded-none border-0 bg-transparent p-0 opacity-0 focus-visible:opacity-100 focus-visible:ring-inset" aria-label={`${hourHeading(h, copy, locale)}. ${hourSummary(h, copy, locale)}`} aria-pressed={selected === i} onFocus={() => setSelected(i)} onMouseEnter={() => setSelected(i)} onClick={() => setSelected(i)}><span className="sr-only">{hourHeading(h, copy, locale)}. {hourSummary(h, copy, locale)}</span></Button>)}
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{copy.windArrowNote}</p>
      {active && <div className="mt-3 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm" aria-live="polite"><span className="font-semibold text-foreground">{hourHeading(active, copy, locale)}</span><span className="mt-1 block text-muted-foreground">{hourSummary(active, copy, locale)}</span></div>}
    </div>
  );
};

const DailyRows = ({ days, copy, locale }: { days: WeatherDay[]; copy: ForecastCopy; locale: string }) => (
  <ul className="divide-y divide-border rounded-lg border border-border bg-muted/20">
    {days.map((d, i) => {
      const kind = weatherSymbolKind(d.conditionType);
      return <li key={d.date ?? i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-[1.2fr_auto_1fr_1fr_1.4fr] sm:items-center">
        <span className="font-semibold text-foreground">{formatWeekday(d.startTime ?? d.date, locale)}</span>
        <WeatherIcon type={d.conditionType} daytime={d.isDaytime} label={localizedCondition(d.conditionType, locale, copy.symbols[kind])} className="h-8 w-8" />
        <span className="text-sm font-medium text-foreground sm:text-center">{formatTemperature(d.minTemperatureC)} / {formatTemperature(d.maxTemperatureC)}</span>
        <span className="text-right text-sm text-muted-foreground sm:text-center">{formatPrecipitation(d.precipitationMm)}</span>
        <span className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground sm:col-span-1 sm:justify-end">
          {windTargetDegrees(d.windDirectionDegrees) === null ? <span aria-hidden="true">—</span> : <ArrowUp className="h-4 w-4 shrink-0 text-secondary" style={{ transform: `rotate(${windTargetDegrees(d.windDirectionDegrees)}deg)` }} aria-hidden="true" />}
          {formatWindWithDirection(d.speedMs, d.gustMs, d.windDirectionCardinal, d.windDirectionDegrees, locale)}
        </span>
      </li>;
    })}
  </ul>
);

const WeatherForecast = ({ variant = 'full' }: Props) => {
  const { locale } = useLanguage();
  const copy = usePageCopy(COPY);
  const { forecast, state, hasData } = useBjorliForecast();
  const fetched = formatFetchedAt(forecast.fetchedAt, locale);
  const meta = <p className="text-xs text-muted-foreground">{copy.baseNote} {copy.sourceLabel}{fetched && <>{' · '}{copy.fetchedLabel}: {fetched}</>}</p>;

  if (state === 'error' && !hasData) return <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground"><span className="font-medium text-foreground">{variant === 'compact' ? copy.compactTitle : copy.title}</span><span className="mx-2 opacity-60">·</span>{copy.unavailable}</div>;
  if (!hasData) return <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground" aria-live="polite">{copy.loading}</div>;

  if (variant === 'compact') {
    const nowHour = currentHour(forecast);
    const days = forecast.days.slice(0, 3);
    return <section aria-label={copy.compactTitle} className="rounded-xl border border-border bg-card p-5 shadow-sm md:p-6">
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-display text-lg font-semibold text-foreground md:text-xl">{copy.compactTitle}</h2>{forecast.stale && <span className="text-xs italic text-muted-foreground">{copy.staleNote}</span>}</header>
      {nowHour && <dl className="mb-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3"><div><dt className="mb-1 inline-flex items-center gap-1 text-xs uppercase text-muted-foreground"><Thermometer className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />{copy.temperature}</dt><dd className="font-medium text-foreground">{formatTemperature(nowHour.temperatureC)}</dd></div><div><dt className="mb-1 inline-flex items-center gap-1 text-xs uppercase text-muted-foreground"><Wind className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />{copy.wind}</dt><dd className="font-medium text-foreground">{formatWindWithDirection(nowHour.speedMs, nowHour.gustMs, nowHour.windDirectionCardinal, nowHour.windDirectionDegrees, locale)}</dd></div><div><dt className="mb-1 inline-flex items-center gap-1 text-xs uppercase text-muted-foreground"><CloudRain className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />{copy.precipitation}</dt><dd className="font-medium text-foreground">{formatPrecipitation(nowHour.precipitationMm)}</dd></div></dl>}
      {days.length > 0 && <ul className="mb-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">{days.map((d, i) => <li key={d.date ?? i} className="rounded-lg bg-muted/40 px-3 py-2"><span className="block text-xs text-muted-foreground">{formatWeekday(d.startTime ?? d.date, locale)}</span><span className="block font-medium text-foreground">{formatTemperature(d.maxTemperatureC)} / {formatTemperature(d.minTemperatureC)}</span></li>)}</ul>}{meta}
    </section>;
  }

  const hours = forecast.hours.slice(0, 24);
  const days = forecast.days.slice(0, 7);
  return <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} aria-labelledby="forecast-heading" className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-6">
    <header className="mb-1 flex flex-wrap items-baseline justify-between gap-2"><h2 id="forecast-heading" className="font-display text-xl font-semibold text-foreground md:text-2xl">{copy.title}</h2>{forecast.stale && <span className="text-xs italic text-muted-foreground">{copy.staleNote}</span>}</header>
    <p className="mb-6 text-xs text-muted-foreground">{copy.windGustNote}</p>
    {hours.length > 0 && <div className="mb-8"><h3 className="mb-3 text-sm font-semibold text-foreground">{copy.hourlyTitle}</h3><HourlyTimeline hours={hours} copy={copy} locale={locale} /></div>}
    {days.length > 0 && <div className="mb-6"><h3 className="mb-3 text-sm font-semibold text-foreground">{copy.dailyTitle}</h3><DailyRows days={days} copy={copy} locale={locale} /></div>}
    {meta}
  </motion.section>;
};

export default WeatherForecast;
