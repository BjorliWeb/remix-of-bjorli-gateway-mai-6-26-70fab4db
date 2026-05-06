import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Activity, ExternalLink } from 'lucide-react';
import PageHero from '@/components/PageHero';
import LiveFnuggStatus from '@/components/LiveFnuggStatus';
import LiveAlertBanner from '@/components/LiveAlertBanner';
import WebcamEmbed from '@/components/WebcamEmbed';
import heroImage from '@/assets/hero-winter.jpg';

/**
 * "Vær og webkamera" — combined live status, daily operational update,
 * webcams and trail/cross-country shortcuts. Replaces the old standalone
 * Livecams page (legacy /livecams route still resolves to the same
 * component as an alias).
 *
 * Sources:
 *   - Status akkurat nå       → Fnugg resort 177 (via LiveFnuggStatus block)
 *   - Dagens driftsmelding    → latest Bjorli Fnugg post (via LiveAlertBanner)
 *   - Webkamera               → IPCamLive aliases preserved from bjorli.no/livecams
 *   - Langrenn / løypekart    → external loyper.net (same as legacy page)
 */

/**
 * Webcam aliases preserved from the existing WordPress page.
 * Source HTML: https://bjorli.no/livecams/ (inspected 2026-05-02).
 * Only the first camera was labelled in the WP markup ("BASEOMRÅDE").
 * Labels for the remaining three are placeholders — confirm exact names
 * with the destination team before WordPress migration.
 */
interface WebcamDef {
  alias: string;
  title: string;
  needsLabelConfirmation?: boolean;
}
const WEBCAMS: WebcamDef[] = [
  { alias: '61b467311f905', title: 'Baseområde' },
  // TODO confirm with destination — labels not present in current WP markup.
  { alias: '61c4bf99a3979', title: 'Webkamera 2', needsLabelConfirmation: true },
  { alias: '61b717228326c', title: 'Webkamera 3', needsLabelConfirmation: true },
  { alias: '61b702b231cf9', title: 'Webkamera 4', needsLabelConfirmation: true },
];

/** Build the IPCamLive embed URL with the same player flags as the WP page. */
const buildIpcamUrl = (alias: string) =>
  `https://g0.ipcamlive.com/player/player.php?alias=${alias}` +
  '&autoplay=1&mute=1' +
  '&disabletimelapseplayer=1&disablestorageplayer=1&disabledownloadbutton=1' +
  '&disableplaybackspeedbutton=1&disablenavigation=1&disableuserpause=1&disablezoombutton=1';

const WeatherWebcams = () => {
  const { locale } = useLanguage();
  const lp = useLocalizedPath();

  // Locale-aware copy. Norwegian is canonical; other locales fall back to EN.
  const isNo = locale === 'no';
  const copy = isNo
    ? {
        heroTitle: 'Vær og webkamera',
        heroSubtitle: 'Se dagens forhold, live status og webkamera fra Bjorli.',
        statusTitle: 'Status akkurat nå',
        statusSourceNote: 'Data hentet fra Fnugg',
        webcamsTitle: 'Webkamera',
        webcamsIntro: 'Live bilder fra Bjorli Skisenter. Bildene oppdateres automatisk.',
        webcamsFallback: 'Webkamera er midlertidig utilgjengelig.',
        langrennTitle: 'Langrenn og løypekart',
        langrennBody:
          'Bjorli har langrennsløyper i variert høyfjells- og skogsterreng. Se live løypestatus og interaktivt løypekart for oppdatert informasjon.',
        langrennStatusCta: 'Se løypestatus',
        langrennMapCta: 'Se løypekart',
        relatedTitle: 'Relaterte sider',
        related: [
          { label: 'Se åpningstider', href: '/apningstider', external: false },
          {
            label: 'Kjøp heiskort',
            href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862',
            external: true,
          },
          { label: 'Bjorli Skisenter', href: '/bjorli-skisenter', external: false },
          { label: 'Live status på Fnugg', href: 'https://fnugg.no/bjorli/', external: true },
          { label: 'Løypekart', href: '/loypekart', external: false },
        ],
      }
    : {
        heroTitle: 'Weather and webcams',
        heroSubtitle: 'See current conditions, live status and webcams from Bjorli.',
        statusTitle: 'Status right now',
        statusSourceNote: 'Data from Fnugg',
        webcamsTitle: 'Webcams',
        webcamsIntro: 'Live views from Bjorli Ski Resort. Streams refresh automatically.',
        webcamsFallback: 'Webcam is temporarily unavailable.',
        langrennTitle: 'Cross-country and trail map',
        langrennBody:
          'Bjorli has cross-country trails through varied mountain and forest terrain. See live trail status and the interactive trail map for the latest info.',
        langrennStatusCta: 'See trail status',
        langrennMapCta: 'See trail map',
        relatedTitle: 'Related pages',
        related: [
          { label: 'Opening hours', href: '/apningstider', external: false },
          {
            label: 'Buy lift pass',
            href: 'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862',
            external: true,
          },
          { label: 'Bjorli Ski Resort', href: '/bjorli-skisenter', external: false },
          { label: 'Live status on Fnugg', href: 'https://fnugg.no/bjorli/', external: true },
          { label: 'Trail map', href: '/loypekart', external: false },
        ],
      };

  return (
    <div>
      {/* Single H1 lives in PageHero. */}
      <PageHero title={copy.heroTitle} subtitle={copy.heroSubtitle} image={heroImage} />

      {/* 1. Live status (Fnugg) — block variant. */}
      <section className="py-12 px-4" aria-labelledby="status-heading">
        <div className="container mx-auto max-w-5xl">
          <LiveFnuggStatus variant="block" title={copy.statusTitle} locale={locale} />
          <p className="mt-2 text-xs text-muted-foreground text-right">
            {copy.statusSourceNote}
            {' · '}
            <a
              href="https://fnugg.no/bjorli/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              fnugg.no/bjorli <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>

      {/* 2. Dagens driftsmelding — same banner used on the homepage. */}
      <LiveAlertBanner
        fallback={{
          label: isNo ? 'Driftsmelding' : 'Operational update',
          message: isNo
            ? 'Ingen ny driftsmelding tilgjengelig akkurat nå.'
            : 'No operational update available right now.',
        }}
      />

      {/* 3. Webkamera grid */}
      <section className="py-16 px-4" aria-labelledby="webcams-heading">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-8 text-center">
            <h2
              id="webcams-heading"
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3"
            >
              {copy.webcamsTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{copy.webcamsIntro}</p>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WEBCAMS.map((cam, i) => (
              <motion.div
                key={cam.alias}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <WebcamEmbed title={cam.title} embedUrl={buildIpcamUrl(cam.alias)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Langrenn og løypekart */}
      <section className="py-16 px-4 bg-muted/30" aria-labelledby="langrenn-heading">
        <div className="container mx-auto max-w-4xl text-center">
          <h2
            id="langrenn-heading"
            className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4"
          >
            {copy.langrennTitle}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {copy.langrennBody}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://www.loyper.net/no/sted/bjorli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:border-secondary/40 transition-colors"
              aria-label={`${copy.langrennStatusCta} (loyper.net, åpnes i ny fane)`}
            >
              <Activity className="h-4 w-4 text-secondary" aria-hidden="true" />
              {copy.langrennStatusCta}
              <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="https://www.loyper.net/no/sted/bjorli/kart"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground hover:border-secondary/40 transition-colors"
              aria-label={`${copy.langrennMapCta} (loyper.net, åpnes i ny fane)`}
            >
              <Map className="h-4 w-4 text-secondary" aria-hidden="true" />
              {copy.langrennMapCta}
              <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. Related links */}
      <section className="py-12 px-4" aria-labelledby="related-heading">
        <div className="container mx-auto max-w-4xl">
          <h2 id="related-heading" className="sr-only">
            {copy.relatedTitle}
          </h2>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            {copy.related.map((r) => (
              <li key={r.href}>
                {r.external ? (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline inline-flex items-center gap-1"
                  >
                    {r.label}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ) : (
                  <Link to={lp(r.href)} className="text-secondary hover:underline">
                    {r.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default WeatherWebcams;