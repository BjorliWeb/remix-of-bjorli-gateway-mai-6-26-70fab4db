import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, ExternalLink, Mountain, MapPin, Info, Compass } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { trackExternalPartnerClick } from '@/lib/analytics';
import { images } from '@/lib/images';
import { usePageCopy } from '@/i18n/usePageCopy';
import { TAFJORDFJELLA_COPY } from './tafjordfjellaCopy';
import heroAsset from '@/assets/tafjordfjella-vakkerstoylen.jpg.asset.json';

/**
 * /sommer/tafjordfjella — practical entry-point page for visitors who
 * want to use Bjorli and Brøstdalen as a base for hikes and ski tours
 * into Tafjordfjella. Norwegian-only for now (matches the pattern of
 * /sommer/korte-turer and /sommer/klatring-og-buldring-romsdalen).
 */

const heroImg = heroAsset.url;

interface TourLink {
  href: string;
  partner_name: string;
}

const TOUR_LINKS: TourLink[] = [
  { href: 'https://www.ut.no/hytte/10549/vakkerstylen', partner_name: 'UT.no – Vakkerstøylen' },
  { href: 'https://www.ut.no/turforslag/114669/skitur-til-vakkerstylen-fra-brstet', partner_name: 'UT.no – Skitur Vakkerstøylen' },
  { href: 'https://www.ut.no/hytte/10546/pyttbua', partner_name: 'UT.no – Pyttbua' },
];

const Tafjordfjella = () => {
  const lp = useLocalizedPath();
  const t = usePageCopy(TAFJORDFJELLA_COPY);

  const trackUt = (link: TourLink, title: string) =>
    trackExternalPartnerClick({
      partner_name: link.partner_name,
      partner_category: 'hiking_guide',
      link_url: link.href,
      link_text: title,
    });

  return (
    <div>
      <PageHero
        title={t.heroTitle}
        subtitle={t.heroSubtitle}
        image={heroImg}
        alt={t.heroAlt}
      />

      {/* Photo credit – placed directly below the hero, visible on all viewports. */}
      <div className="container mx-auto px-4 pt-3">
        <p className="text-xs text-muted-foreground italic">{t.photoCredit}</p>
      </div>

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">{t.crumbHome}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp('/sommer')} className="hover:text-secondary">{t.crumbSommer}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">{t.crumbHere}</li>
        </ol>
      </nav>

      {/* Intro */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <p
            className="text-lg md:text-xl text-foreground/85 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.introP1 }}
          />
          <p className="mt-5 text-base md:text-lg text-foreground/75 leading-relaxed">
            {t.introP2}
          </p>
        </div>
      </section>

      {/* Fra Bjorli inn i villere fjell */}
      <section className="py-12 md:py-16 px-4 bg-muted/40" aria-labelledby="kontrast-heading">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            {t.geographyBadge}
          </div>
          <h2 id="kontrast-heading" className="font-display text-2xl md:text-3xl font-bold mb-4">
            {t.geographyTitle}
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">{t.geographyP1}</p>
          <p
            className="text-foreground/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t.geographyP2 }}
          />
        </div>
      </section>

      {/* Turforslag og hytter */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="turforslag-heading">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <Mountain className="h-3.5 w-3.5" aria-hidden="true" />
              {t.toursBadge}
            </div>
            <h2 id="turforslag-heading" className="font-display text-2xl md:text-3xl font-bold mb-2">
              {t.toursTitle}
            </h2>
            <p className="text-muted-foreground">{t.toursIntro}</p>
          </header>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOUR_LINKS.map((link, i) => {
              const tour = t.tours[i];
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackUt(link, tour.title)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group block"
                >
                  <Card className="h-full bg-card/70 backdrop-blur border-border/60 hover:border-secondary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="text-xs font-medium uppercase tracking-wide text-secondary mb-2">
                        {tour.kind}
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                        {tour.title}
                        <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tour.desc}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary">
                        {t.toursSeeOnUt} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* For korte turer og lange turer */}
      <section className="py-12 md:py-16 px-4 bg-muted/40" aria-labelledby="lengder-heading">
        <div className="container mx-auto max-w-5xl">
          <header className="mb-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {t.lengthBadge}
            </div>
            <h2 id="lengder-heading" className="font-display text-2xl md:text-3xl font-bold mb-2">
              {t.lengthTitle}
            </h2>
          </header>
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.dayTrips.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.dayTrips.body}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.skiTours.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.skiTours.body}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.hutToHut.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.hutToHut.body}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Praktisk info */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="praktisk-heading">
        <div className="container mx-auto max-w-5xl">
          <header className="mb-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              {t.praktiskBadge}
            </div>
            <h2 id="praktisk-heading" className="font-display text-2xl md:text-3xl font-bold mb-2">
              {t.praktiskTitle}
            </h2>
          </header>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.cardWeather.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.cardWeather.body}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.cardShift.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.cardShift.body}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.cardPack.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.cardPack.body}</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{t.cardUt.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.cardUt.bodyBefore}
                  <a
                    href="https://www.ut.no/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline"
                  >
                    {t.cardUt.linkText}
                  </a>
                  {t.cardUt.bodyAfter}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={lp('/fotturer')}>
                {t.ctaAllHikes}
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to={lp('/sommer')}>
                {t.ctaBackSummer}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hidden alt-bearing image for crawlers — uses same aerial as the entry card. */}
      <img src={heroImg} alt={t.heroAlt} className="sr-only" loading="lazy" />
    </div>
  );
};

export default Tafjordfjella;
