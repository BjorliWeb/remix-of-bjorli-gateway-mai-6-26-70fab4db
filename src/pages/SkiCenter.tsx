import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import loypekartImage from '@/assets/bjorli-skisenter-loypekart-vinter.jpg';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { JsonLd } from '@/components/seo';
import { buildSkiResort } from '@/lib/seo/schema';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';
import { trackSkiPassClick } from '@/lib/analytics';
import { SALES_TERMS_COPY, SalesTermsBody } from './salesTermsContent';

/**
 * Page-local copy. The SkiCenter hero, stats and short description still
 * come from the shared `t.skiCenter` dictionary (already localized for all
 * six locales). Everything else on the page — the lift-pass CTA card, the
 * trail-map figure, and the entire Salgsbetingelser (Terms of Sale)
 * accordion — lives here so we can localize without bloating the global
 * dictionary.
 *
 * Legal note: the Norwegian Salgsbetingelser text is the authoritative
 * source. Translations for en/de/nl/da/sv are informational only and
 * carry a discrepancy disclaimer at the top of the accordion body.
 * Company details and section structure are identical across every locale.
 */

type Copy = {
  liftPassHeading: string;
  liftPassSupport: string;
  liftPassCta: string;
  mapAriaOpen: string;
  mapAlt: string;
  mapCaption: string;
  mapNote: string;
};

const COPY: Record<Locale, Copy> = {
  no: {
    liftPassHeading: 'Kjøp heiskort',
    liftPassSupport: 'Kjøp heiskort på nett før du kommer til Bjorli.',
    liftPassCta: 'Kjøp heiskort',
    mapAriaOpen: 'Åpne løypekart i full størrelse',
    mapAlt: 'Løypekart for Bjorli Skisenter med alpinløyper, heiser, langrennsløyper og symbolforklaring.',
    mapCaption: 'Løypekart for Bjorli Skisenter. Kartet viser alpinløyper, heiser, nærområde, symboler og tilknyttede langrennsløyper.',
    mapNote: 'Se alltid skilt, vær- og føreforhold og oppdatert informasjon på bjorli.no for gjeldende drift.',
  },
  en: {
    liftPassHeading: 'Buy lift pass',
    liftPassSupport: 'Buy your lift pass online before you arrive at Bjorli.',
    liftPassCta: 'Buy lift pass',
    mapAriaOpen: 'Open trail map in full size',
    mapAlt: 'Trail map for Bjorli Skisenter showing alpine slopes, lifts, cross-country trails and the symbol legend.',
    mapCaption: 'Trail map for Bjorli Skisenter. The map shows alpine slopes, lifts, the surrounding area, symbols and connected cross-country trails.',
    mapNote: 'Always check on-mountain signage, weather and snow conditions, and current information on bjorli.no for live operations.',
  },
  de: {
    liftPassHeading: 'Skipass kaufen',
    liftPassSupport: 'Kaufen Sie Ihren Skipass online, bevor Sie nach Bjorli kommen.',
    liftPassCta: 'Skipass kaufen',
    mapAriaOpen: 'Loipenkarte in voller Gr\u00f6\u00dfe \u00f6ffnen',
    mapAlt: 'Pisten- und Loipenkarte vom Bjorli Skisenter mit Abfahrten, Liften, Langlaufloipen und Zeichenerkl\u00e4rung.',
    mapCaption: 'Pisten- und Loipenkarte vom Bjorli Skisenter. Die Karte zeigt Abfahrten, Lifte, die Umgebung, Symbole sowie angeschlossene Langlaufloipen.',
    mapNote: 'Beachten Sie immer die Beschilderung am Berg, die Wetter- und Schneebedingungen sowie aktuelle Informationen auf bjorli.no zum laufenden Betrieb.',
  },
  nl: {
    liftPassHeading: 'Skipas kopen',
    liftPassSupport: 'Koop je skipas online voordat je in Bjorli aankomt.',
    liftPassCta: 'Skipas kopen',
    mapAriaOpen: 'Open de loipekaart op volledig formaat',
    mapAlt: 'Pisten- en loipekaart van Bjorli Skisenter met alpine pistes, liften, langlaufloipes en symboollegenda.',
    mapCaption: 'Pisten- en loipekaart van Bjorli Skisenter. De kaart toont alpine pistes, liften, de omgeving, symbolen en aansluitende langlaufloipes.',
    mapNote: 'Volg altijd de bewegwijzering op de berg, het weer en de sneeuwomstandigheden, en bekijk actuele informatie op bjorli.no voor de live situatie.',
  },
  da: {
    liftPassHeading: 'K\u00f8b liftkort',
    liftPassSupport: 'K\u00f8b liftkort online, inden du kommer til Bjorli.',
    liftPassCta: 'K\u00f8b liftkort',
    mapAriaOpen: '\u00c5bn pistekort i fuld st\u00f8rrelse',
    mapAlt: 'Piste- og l\u00f8jpekort for Bjorli Skisenter med alpine pister, lifte, langrendsl\u00f8jper og signaturforklaring.',
    mapCaption: 'Piste- og l\u00f8jpekort for Bjorli Skisenter. Kortet viser alpine pister, lifte, n\u00e6romr\u00e5det, symboler og tilsluttede langrendsl\u00f8jper.',
    mapNote: 'Tjek altid skiltning p\u00e5 bjerget, vejr- og f\u00f8reforhold samt opdateret information p\u00e5 bjorli.no for den aktuelle drift.',
  },
  sv: {
    liftPassHeading: 'K\u00f6p liftkort',
    liftPassSupport: 'K\u00f6p liftkort online innan du kommer till Bjorli.',
    liftPassCta: 'K\u00f6p liftkort',
    mapAriaOpen: '\u00d6ppna pistkarta i full storlek',
    mapAlt: 'Pist- och sp\u00e5rkarta f\u00f6r Bjorli Skisenter med alpina nedfarter, liftar, l\u00e4ngdsp\u00e5r och teckenf\u00f6rklaring.',
    mapCaption: 'Pist- och sp\u00e5rkarta f\u00f6r Bjorli Skisenter. Kartan visar alpina nedfarter, liftar, n\u00e4romr\u00e5det, symboler och anslutna l\u00e4ngdsp\u00e5r.',
    mapNote: 'Kontrollera alltid skyltning p\u00e5 berget, v\u00e4der- och f\u00f6rh\u00e5llanden samt aktuell information p\u00e5 bjorli.no f\u00f6r p\u00e5g\u00e5ende drift.',
  },
};

const SkiCenter = () => {
  const { t } = useLanguage();
  const s = t.skiCenter;
  const c = usePageCopy(COPY);
  const tr = usePageCopy(SALES_TERMS_COPY);

  const stats = [
    { label: s.lifts, value: '6' },
    { label: s.slopes, value: '11' },
    { label: s.altitude, value: '575–1225m' },
    { label: s.season, value: 'Nov–Mai' },
  ];

  // Canonical URL for this page in the current locale (falls back to
  // production origin during SSR). The schema name is intentionally the
  // proper Norwegian brand "Bjorli Skisenter" in every locale.
  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://www.bjorli.no/bjorli-skisenter';

  return (
    <div>
      <JsonLd id="jsonld-skiresort" data={buildSkiResort(pageUrl, s.desc)} />
      <PageHero title={s.title} subtitle={s.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg text-muted-foreground leading-relaxed mb-12 text-center">
            {s.desc}
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-6 text-center shadow-md border border-border">
                <div className="text-3xl font-bold text-secondary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-2xl p-8 md:p-10 shadow-lg border border-border text-center">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
              {c.liftPassHeading}
            </h3>
            <p className="text-base md:text-lg opacity-90 mb-6 max-w-xl mx-auto">
              {c.liftPassSupport}
            </p>
            <Button
              asChild
              size="lg"
              variant="default"
              className="text-base md:text-lg px-8 py-6 h-auto w-full sm:w-auto"
            >
              <a
                href="https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackSkiPassClick({
                    link_url:
                      'https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862',
                    link_text: c.liftPassCta,
                    cta_location: 'ski_center_page',
                  })
                }
              >
                {c.liftPassCta} <ArrowUpRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <figure className="mt-16 space-y-3">
            <a
              href={loypekartImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-border shadow-md bg-card"
              aria-label={c.mapAriaOpen}
            >
              <img
                src={loypekartImage}
                alt={c.mapAlt}
                className="w-full h-auto block"
                loading="lazy"
              />
            </a>
            <figcaption className="text-sm text-foreground/70 leading-relaxed">
              {c.mapCaption}
            </figcaption>
            <p className="text-xs text-muted-foreground">
              {c.mapNote}
            </p>
          </figure>
          <section className="mt-20" aria-labelledby="salgsbetingelser-heading">
            <h2 id="salgsbetingelser-heading" className="font-display text-2xl md:text-3xl font-bold mb-3">
              {tr.heading}
            </h2>
            <p className="text-muted-foreground mb-6">
              {tr.lead}
            </p>
            <Accordion type="single" collapsible className="bg-card rounded-xl border border-border px-4 md:px-6">
              <AccordionItem value="salgsbetingelser" className="border-b-0">
                <AccordionTrigger className="text-base md:text-lg font-semibold">
                  {tr.trigger}
                </AccordionTrigger>
                <AccordionContent>
                  <SalesTermsBody tr={tr} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </section>
    </div>
  );
};

export default SkiCenter;
