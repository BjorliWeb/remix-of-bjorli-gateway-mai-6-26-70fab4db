import { useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { usePageCopy } from '@/i18n/usePageCopy';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Activity, ExternalLink } from 'lucide-react';
import PageHero from '@/components/PageHero';
import LiveFnuggStatus from '@/components/LiveFnuggStatus';
import LiveAlertBanner from '@/components/LiveAlertBanner';
import WebcamEmbed from '@/components/WebcamEmbed';
import heroImage from '@/assets/hero-winter.jpg';
import loypekartImage from '@/assets/bjorli-skisenter-loypekart-vinter.jpg';
import { trackExternalPartnerClick, track } from '@/lib/analytics';

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
 * with the destination team before WordPress migration. Tile titles are
 * resolved per-locale via COPY.webcamTitles below.
 */
interface WebcamDef {
  alias: string;
  /** Key into COPY[locale].webcamTitles */
  titleKey: 'base' | 'cam2' | 'cam3' | 'cam4';
  needsLabelConfirmation?: boolean;
}
const WEBCAMS: WebcamDef[] = [
  { alias: '61b467311f905', titleKey: 'base' },
  { alias: '61c4bf99a3979', titleKey: 'cam2', needsLabelConfirmation: true },
  { alias: '61b717228326c', titleKey: 'cam3', needsLabelConfirmation: true },
  { alias: '61b702b231cf9', titleKey: 'cam4', needsLabelConfirmation: true },
];

/** Build the IPCamLive embed URL with the same player flags as the WP page. */
const buildIpcamUrl = (alias: string) =>
  `https://g0.ipcamlive.com/player/player.php?alias=${alias}` +
  '&autoplay=1&mute=1' +
  '&disabletimelapseplayer=1&disablestorageplayer=1&disabledownloadbutton=1' +
  '&disableplaybackspeedbutton=1&disablenavigation=1&disableuserpause=1&disablezoombutton=1';

interface RelatedLink {
  label: string;
  href: string;
  external: boolean;
}
interface WeatherWebcamsCopy {
  heroTitle: string;
  heroSubtitle: string;
  statusTitle: string;
  statusSourceNote: string;
  alertLabel: string;
  alertFallback: string;
  webcamsTitle: string;
  webcamsIntro: string;
  webcamsFallback: string;
  webcamTitles: { base: string; cam2: string; cam3: string; cam4: string };
  langrennTitle: string;
  langrennBody: string;
  langrennStatusCta: string;
  langrennMapCta: string;
  externalNewTab: string;
  trailMapSrLabel: string;
  trailMapAriaOpen: string;
  trailMapAlt: string;
  trailMapCaption: string;
  trailMapOperationalNote: string;
  relatedTitle: string;
  related: RelatedLink[];
}

const RELATED_HREFS = {
  openingHours: '/apningstider',
  liftPass:
    'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862',
  skisenter: '/bjorli-skisenter',
  fnugg: 'https://fnugg.no/bjorli/',
  trailMap: '/loypekart',
} as const;

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', WeatherWebcamsCopy> = {
  no: {
    heroTitle: 'Vær og webkamera',
    heroSubtitle: 'Se dagens forhold, live status og webkamera fra Bjorli.',
    statusTitle: 'Status akkurat nå',
    statusSourceNote: 'Data hentet fra Fnugg',
    alertLabel: 'Driftsmelding',
    alertFallback: 'Ingen ny driftsmelding tilgjengelig akkurat nå.',
    webcamsTitle: 'Webkamera',
    webcamsIntro: 'Live bilder fra Bjorli Skisenter. Bildene oppdateres automatisk.',
    webcamsFallback: 'Webkamera er midlertidig utilgjengelig.',
    webcamTitles: { base: 'Baseområde', cam2: 'Webkamera 2', cam3: 'Webkamera 3', cam4: 'Webkamera 4' },
    langrennTitle: 'Langrenn og løypekart',
    langrennBody:
      'Bjorli har langrennsløyper i variert høyfjells- og skogsterreng. Se live løypestatus og interaktivt løypekart for oppdatert informasjon.',
    langrennStatusCta: 'Se løypestatus',
    langrennMapCta: 'Se løypekart',
    externalNewTab: 'loyper.net, åpnes i ny fane',
    trailMapSrLabel: 'Løypekart',
    trailMapAriaOpen: 'Åpne løypekart i full størrelse',
    trailMapAlt: 'Løypekart for Bjorli Skisenter med alpinløyper, heiser, langrennsløyper og symbolforklaring.',
    trailMapCaption: 'Løypekart for Bjorli Skisenter. Kartet viser alpinløyper, heiser, nærområde, symboler og tilknyttede langrennsløyper.',
    trailMapOperationalNote: 'Se alltid skilt, vær- og føreforhold og oppdatert informasjon på bjorli.no for gjeldende drift.',
    relatedTitle: 'Relaterte sider',
    related: [
      { label: 'Se åpningstider', href: RELATED_HREFS.openingHours, external: false },
      { label: 'Kjøp heiskort', href: RELATED_HREFS.liftPass, external: true },
      { label: 'Bjorli Skisenter', href: RELATED_HREFS.skisenter, external: false },
      { label: 'Live status på Fnugg', href: RELATED_HREFS.fnugg, external: true },
      { label: 'Løypekart', href: RELATED_HREFS.trailMap, external: false },
    ],
  },
  en: {
    heroTitle: 'Weather and webcams',
    heroSubtitle: 'See current conditions, live status and webcams from Bjorli.',
    statusTitle: 'Current status',
    statusSourceNote: 'Data from Fnugg',
    alertLabel: 'Operational update',
    alertFallback: 'No operational update available right now.',
    webcamsTitle: 'Webcams',
    webcamsIntro: 'Live views from Bjorli Skisenter. Streams refresh automatically.',
    webcamsFallback: 'Webcam is temporarily unavailable.',
    webcamTitles: { base: 'Base area', cam2: 'Webcam 2', cam3: 'Webcam 3', cam4: 'Webcam 4' },
    langrennTitle: 'Cross-country and trail map',
    langrennBody:
      'Bjorli has cross-country trails through varied mountain and forest terrain. See live trail status and the interactive trail map for the latest information.',
    langrennStatusCta: 'See trail status',
    langrennMapCta: 'See trail map',
    externalNewTab: 'loyper.net, opens in a new tab',
    trailMapSrLabel: 'Trail map',
    trailMapAriaOpen: 'Open trail map at full size',
    trailMapAlt: 'Trail map for Bjorli Skisenter showing alpine runs, lifts, cross-country trails and a symbol key.',
    trailMapCaption: 'Trail map for Bjorli Skisenter. The map shows alpine runs, lifts, the base area, symbols and connected cross-country trails.',
    trailMapOperationalNote: 'Always check on-site signs, current weather and snow conditions, and the latest updates on bjorli.no for live operations.',
    relatedTitle: 'Related pages',
    related: [
      { label: 'Opening hours', href: RELATED_HREFS.openingHours, external: false },
      { label: 'Buy lift pass', href: RELATED_HREFS.liftPass, external: true },
      { label: 'Bjorli Skisenter', href: RELATED_HREFS.skisenter, external: false },
      { label: 'Live status on Fnugg', href: RELATED_HREFS.fnugg, external: true },
      { label: 'Trail map', href: RELATED_HREFS.trailMap, external: false },
    ],
  },
  de: {
    heroTitle: 'Wetter und Webcams',
    heroSubtitle: 'Sehen Sie die aktuellen Bedingungen, den Live-Status und die Webcams aus Bjorli.',
    statusTitle: 'Aktueller Status',
    statusSourceNote: 'Daten von Fnugg',
    alertLabel: 'Betriebsmeldung',
    alertFallback: 'Derzeit liegt keine neue Betriebsmeldung vor.',
    webcamsTitle: 'Webcams',
    webcamsIntro: 'Live-Bilder vom Bjorli Skisenter. Die Bilder werden automatisch aktualisiert.',
    webcamsFallback: 'Die Webcam ist vorübergehend nicht verfügbar.',
    webcamTitles: { base: 'Talstation', cam2: 'Webcam 2', cam3: 'Webcam 3', cam4: 'Webcam 4' },
    langrennTitle: 'Langlauf und Loipenkarte',
    langrennBody:
      'Bjorli bietet Langlaufloipen durch abwechslungsreiches Hochgebirgs- und Waldgelände. Sehen Sie den Live-Loipenstatus und die interaktive Loipenkarte für aktuelle Informationen.',
    langrennStatusCta: 'Loipenstatus ansehen',
    langrennMapCta: 'Loipenkarte ansehen',
    externalNewTab: 'loyper.net, wird in einem neuen Tab geöffnet',
    trailMapSrLabel: 'Loipenkarte',
    trailMapAriaOpen: 'Loipenkarte in voller Größe öffnen',
    trailMapAlt: 'Loipenkarte des Bjorli Skisenter mit Alpinabfahrten, Liften, Loipen und Zeichenerklärung.',
    trailMapCaption: 'Loipenkarte des Bjorli Skisenter. Sie zeigt Abfahrten, Lifte, das Basisgebiet, Symbole und angeschlossene Langlaufloipen.',
    trailMapOperationalNote: 'Beachten Sie immer Beschilderung vor Ort, Wetter- und Schneeverhältnisse sowie die aktuellen Hinweise auf bjorli.no.',
    relatedTitle: 'Verwandte Seiten',
    related: [
      { label: 'Öffnungszeiten', href: RELATED_HREFS.openingHours, external: false },
      { label: 'Skipass kaufen', href: RELATED_HREFS.liftPass, external: true },
      { label: 'Bjorli Skisenter', href: RELATED_HREFS.skisenter, external: false },
      { label: 'Live-Status auf Fnugg', href: RELATED_HREFS.fnugg, external: true },
      { label: 'Loipenkarte', href: RELATED_HREFS.trailMap, external: false },
    ],
  },
  nl: {
    heroTitle: 'Weer en webcams',
    heroSubtitle: 'Bekijk de actuele omstandigheden, livestatus en webcams van Bjorli.',
    statusTitle: 'Actuele status',
    statusSourceNote: 'Gegevens van Fnugg',
    alertLabel: 'Operationele update',
    alertFallback: 'Er is op dit moment geen nieuwe operationele update.',
    webcamsTitle: 'Webcams',
    webcamsIntro: 'Livebeelden van Bjorli Skisenter. De beelden worden automatisch ververst.',
    webcamsFallback: 'De webcam is tijdelijk niet beschikbaar.',
    webcamTitles: { base: 'Dalstation', cam2: 'Webcam 2', cam3: 'Webcam 3', cam4: 'Webcam 4' },
    langrennTitle: 'Langlaufen en loipekaart',
    langrennBody:
      'Bjorli heeft langlaufloipes door afwisselend hooggebergte- en bosterrein. Bekijk de live loipestatus en de interactieve loipekaart voor actuele informatie.',
    langrennStatusCta: 'Bekijk loipestatus',
    langrennMapCta: 'Bekijk loipekaart',
    externalNewTab: 'loyper.net, opent in een nieuw tabblad',
    trailMapSrLabel: 'Loipekaart',
    trailMapAriaOpen: 'Loipekaart op volledig formaat openen',
    trailMapAlt: 'Loipekaart van Bjorli Skisenter met afdalingen, liften, langlaufloipes en legenda.',
    trailMapCaption: 'Loipekaart van Bjorli Skisenter. De kaart toont afdalingen, liften, het basisgebied, symbolen en aansluitende langlaufloipes.',
    trailMapOperationalNote: 'Volg altijd de bewegwijzering ter plaatse, de actuele weers- en sneeuwomstandigheden en de updates op bjorli.no.',
    relatedTitle: 'Gerelateerde pagina’s',
    related: [
      { label: 'Openingstijden', href: RELATED_HREFS.openingHours, external: false },
      { label: 'Skipas kopen', href: RELATED_HREFS.liftPass, external: true },
      { label: 'Bjorli Skisenter', href: RELATED_HREFS.skisenter, external: false },
      { label: 'Livestatus op Fnugg', href: RELATED_HREFS.fnugg, external: true },
      { label: 'Loipekaart', href: RELATED_HREFS.trailMap, external: false },
    ],
  },
  da: {
    heroTitle: 'Vejr og webkameraer',
    heroSubtitle: 'Se aktuelle forhold, livestatus og webkameraer fra Bjorli.',
    statusTitle: 'Aktuel status',
    statusSourceNote: 'Data fra Fnugg',
    alertLabel: 'Driftsmeddelelse',
    alertFallback: 'Der er ingen ny driftsmeddelelse lige nu.',
    webcamsTitle: 'Webkameraer',
    webcamsIntro: 'Livebilleder fra Bjorli Skisenter. Billederne opdateres automatisk.',
    webcamsFallback: 'Webkameraet er midlertidigt utilgængeligt.',
    webcamTitles: { base: 'Bundstation', cam2: 'Webkamera 2', cam3: 'Webkamera 3', cam4: 'Webkamera 4' },
    langrennTitle: 'Langrend og løjpekort',
    langrennBody:
      'Bjorli har langrendsspor gennem varieret højfjelds- og skovterræn. Se live løjpestatus og det interaktive løjpekort for opdateret information.',
    langrennStatusCta: 'Se løjpestatus',
    langrennMapCta: 'Se løjpekort',
    externalNewTab: 'loyper.net, åbnes i en ny fane',
    trailMapSrLabel: 'Løjpekort',
    trailMapAriaOpen: 'Åbn løjpekort i fuld størrelse',
    trailMapAlt: 'Løjpekort for Bjorli Skisenter med alpinløjper, lifter, langrendsspor og symbolforklaring.',
    trailMapCaption: 'Løjpekort for Bjorli Skisenter. Kortet viser alpinløjper, lifter, nærområdet, symboler og tilknyttede langrendsspor.',
    trailMapOperationalNote: 'Følg altid skiltning, vejr- og føreforhold samt opdateret information på bjorli.no for aktuel drift.',
    relatedTitle: 'Relaterede sider',
    related: [
      { label: 'Åbningstider', href: RELATED_HREFS.openingHours, external: false },
      { label: 'Køb liftkort', href: RELATED_HREFS.liftPass, external: true },
      { label: 'Bjorli Skisenter', href: RELATED_HREFS.skisenter, external: false },
      { label: 'Livestatus på Fnugg', href: RELATED_HREFS.fnugg, external: true },
      { label: 'Løjpekort', href: RELATED_HREFS.trailMap, external: false },
    ],
  },
  sv: {
    heroTitle: 'Väder och webbkameror',
    heroSubtitle: 'Se aktuella förhållanden, livestatus och webbkameror från Bjorli.',
    statusTitle: 'Aktuell status',
    statusSourceNote: 'Data från Fnugg',
    alertLabel: 'Driftmeddelande',
    alertFallback: 'Det finns inget nytt driftmeddelande just nu.',
    webcamsTitle: 'Webbkameror',
    webcamsIntro: 'Livebilder från Bjorli Skisenter. Bilderna uppdateras automatiskt.',
    webcamsFallback: 'Webbkameran är tillfälligt otillgänglig.',
    webcamTitles: { base: 'Nedre station', cam2: 'Webbkamera 2', cam3: 'Webbkamera 3', cam4: 'Webbkamera 4' },
    langrennTitle: 'Längdskidor och spårkarta',
    langrennBody:
      'Bjorli har längdspår genom varierande högfjälls- och skogsterräng. Se live spårstatus och den interaktiva spårkartan för aktuell information.',
    langrennStatusCta: 'Se spårstatus',
    langrennMapCta: 'Se spårkarta',
    externalNewTab: 'loyper.net, öppnas i en ny flik',
    trailMapSrLabel: 'Spårkarta',
    trailMapAriaOpen: 'Öppna spårkartan i full storlek',
    trailMapAlt: 'Spårkarta för Bjorli Skisenter med alpinbackar, liftar, längdspår och teckenförklaring.',
    trailMapCaption: 'Spårkarta för Bjorli Skisenter. Kartan visar alpinbackar, liftar, basområdet, symboler och anslutande längdspår.',
    trailMapOperationalNote: 'Följ alltid skyltning på plats, väder- och föreförhållanden samt aktuell information på bjorli.no.',
    relatedTitle: 'Relaterade sidor',
    related: [
      { label: 'Öppettider', href: RELATED_HREFS.openingHours, external: false },
      { label: 'Köp liftkort', href: RELATED_HREFS.liftPass, external: true },
      { label: 'Bjorli Skisenter', href: RELATED_HREFS.skisenter, external: false },
      { label: 'Livestatus på Fnugg', href: RELATED_HREFS.fnugg, external: true },
      { label: 'Spårkarta', href: RELATED_HREFS.trailMap, external: false },
    ],
  },
};

const WeatherWebcams = () => {
  const { locale } = useLanguage();
  const lp = useLocalizedPath();
  const copy = usePageCopy(COPY);

  // Legacy /livecams/ tracking exists because this old URL has search and
  // bookmark traffic. Total redirect volume should also be monitored in
  // Cloudflare/Search Console because GA4 only tracks consented analytics
  // traffic.
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get('legacy') !== 'livecams') return;
    // track() is consent-gated — no-op when analytics consent is denied.
    track('legacy_livecams_redirect', {
      legacy_path: '/livecams/',
      redirect_target: '/vaer-og-webkamera',
      legacy_source: 'livecams',
      page_type: 'weather_webcam',
      redirect_type: 301,
    });
    // Clean the visible URL so ?legacy=livecams never gets indexed or
    // bookmarked. Replace (not push) so Back still goes to the referrer.
    params.delete('legacy');
    const qs = params.toString();
    navigate(pathname + (qs ? `?${qs}` : ''), { replace: true });
  }, [search, pathname, navigate]);

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
              onClick={() =>
                trackExternalPartnerClick({
                  partner_name: 'Fnugg',
                  partner_category: 'weather',
                  link_url: 'https://fnugg.no/bjorli/',
                  link_text: 'fnugg.no/bjorli',
                })
              }
            >
              fnugg.no/bjorli <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>

      {/* 2. Dagens driftsmelding — same banner used on the homepage. */}
      <LiveAlertBanner
        fallback={{
          label: copy.alertLabel,
          message: copy.alertFallback,
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
                <WebcamEmbed
                  title={copy.webcamTitles[cam.titleKey]}
                  embedUrl={buildIpcamUrl(cam.alias)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Langrenn og løypekart */}
      <section className="py-12 px-4" aria-labelledby="loypekart-image-heading">
        <div className="container mx-auto max-w-5xl">
          <h2 id="loypekart-image-heading" className="sr-only">{copy.trailMapSrLabel}</h2>
          <figure className="space-y-3">
            <a
              href={loypekartImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-border shadow-md bg-card"
              aria-label={copy.trailMapAriaOpen}
            >
              <img
                src={loypekartImage}
                alt={copy.trailMapAlt}
                className="w-full h-auto block"
                loading="lazy"
              />
            </a>
            <figcaption className="text-sm text-foreground/70 leading-relaxed">
              {copy.trailMapCaption}
            </figcaption>
            <p className="text-xs text-muted-foreground">
              {copy.trailMapOperationalNote}
            </p>
          </figure>
        </div>
      </section>

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
              aria-label={`${copy.langrennStatusCta} (${copy.externalNewTab})`}
              onClick={() =>
                trackExternalPartnerClick({
                  partner_name: 'Loyper.net',
                  partner_category: 'trail_map',
                  link_url: 'https://www.loyper.net/no/sted/bjorli',
                  link_text: copy.langrennStatusCta,
                })
              }
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
              aria-label={`${copy.langrennMapCta} (${copy.externalNewTab})`}
              onClick={() =>
                trackExternalPartnerClick({
                  partner_name: 'Loyper.net',
                  partner_category: 'trail_map',
                  link_url: 'https://www.loyper.net/no/sted/bjorli/kart',
                  link_text: copy.langrennMapCta,
                })
              }
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