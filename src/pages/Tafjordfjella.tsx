import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, ExternalLink, Mountain, MapPin, Info, Compass } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { trackExternalPartnerClick } from '@/lib/analytics';
import { images } from '@/lib/images';

/**
 * /sommer/tafjordfjella — practical entry-point page for visitors who
 * want to use Bjorli and Brøstdalen as a base for hikes and ski tours
 * into Tafjordfjella. Norwegian-only for now (matches the pattern of
 * /sommer/korte-turer and /sommer/klatring-og-buldring-romsdalen).
 */

const heroImg = images.summerAerialSkiCenterMountain.src;
const heroAlt = 'Sommerutsikt fra Bjorli mot fjellene innover Brøstdalen og Tafjordfjella.';

interface TourCard {
  title: string;
  kind: string;
  desc: string;
  href: string;
  partner_name: string;
}

const TOURS: TourCard[] = [
  {
    title: 'Vakkerstøylen',
    kind: 'Turisthytte',
    desc: 'Liten, enkel selvbetjent hytte midt i hjertet av Tafjordfjella. Fin målhytte for en lang dagstur fra Brøstet, eller første natt på en hyttetur videre innover.',
    href: 'https://www.ut.no/hytte/10549/vakkerstylen',
    partner_name: 'UT.no – Vakkerstøylen',
  },
  {
    title: 'Skitur til Vakkerstøylen fra Brøstet',
    kind: 'Skitur',
    desc: 'Klassisk skitur opp dalen og inn på fjellet. Lang dag, men jevn stigning og storslagent fjellandskap når du kommer opp på vidda.',
    href: 'https://www.ut.no/turforslag/114669/skitur-til-vakkerstylen-fra-brstet',
    partner_name: 'UT.no – Skitur Vakkerstøylen',
  },
  {
    title: 'Pyttbua',
    kind: 'Turisthytte',
    desc: 'Større betjent hytte lenger inn i Tafjordfjella – populært knutepunkt for hytte-til-hytte-turer både sommer og vinter.',
    href: 'https://www.ut.no/hytte/10546/pyttbua',
    partner_name: 'UT.no – Pyttbua',
  },
];

const Tafjordfjella = () => {
  const lp = useLocalizedPath();

  const trackUt = (t: TourCard) =>
    trackExternalPartnerClick({
      partner_name: t.partner_name,
      partner_category: 'hiking_guide',
      link_url: t.href,
      link_text: t.title,
    });

  return (
    <div>
      <PageHero
        title="Tafjordfjella"
        subtitle="Fra Bjorli og inn i et av Vestlandets villeste fjellandskap – via Brøstdalen."
        image={heroImg}
      />

      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">Hjem</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp('/sommer')} className="hover:text-secondary">Sommer</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">Tafjordfjella</li>
        </ol>
      </nav>

      {/* Intro */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg md:text-xl text-foreground/85 leading-relaxed">
            Med Bjorli som utgangspunkt kjører du kort vei før <strong>Brøstdalen</strong> åpner
            seg og tar deg innover mot Tafjordfjella. Få områder i Norge har samme kontrast på så
            lite plass: dype daler, frodig vestlandsk fjellterreng og snødekte vidder som ligger
            der året rundt.
          </p>
          <p className="mt-5 text-base md:text-lg text-foreground/75 leading-relaxed">
            Området fungerer like godt til en luftig dagstur som til en lengre runde fra hytte til
            hytte. Du velger selv om det skal være rolige timer langs et vann, en hard fjelltur
            opp på første topp – eller flere dager med sekk og kart.
          </p>
        </div>
      </section>

      {/* Fra Bjorli inn i villere fjell */}
      <section className="py-12 md:py-16 px-4 bg-muted/40" aria-labelledby="kontrast-heading">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
            <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            Geografi
          </div>
          <h2 id="kontrast-heading" className="font-display text-2xl md:text-3xl font-bold mb-4">
            Fra Bjorli inn i villere fjell
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            Bjorli ligger lunt mellom Lesja og Romsdalen, med åpne fjell og bred dal rundt seg.
            Kjører du innover Brøstdalen merker du raskt at landskapet skifter karakter –
            sidedalene blir trangere, fossene tydeligere, og terrenget tipper over mot det
            vestlandske.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Innenfor venter selve <strong>Tafjordfjella</strong>: et stort, sammenhengende
            fjellområde med høye topper, vann og lange vidder. Det er her ruter som
            <em> Vakkerstøylen </em> og <em>Pyttbua </em> ligger – samme fjell som du ser
            antydet fra fjellsiden over Bjorli, bare mye lenger inn.
          </p>
        </div>
      </section>

      {/* Turforslag og hytter */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="turforslag-heading">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <Mountain className="h-3.5 w-3.5" aria-hidden="true" />
              Turforslag og hytter
            </div>
            <h2 id="turforslag-heading" className="font-display text-2xl md:text-3xl font-bold mb-2">
              Konkrete turer å starte med
            </h2>
            <p className="text-muted-foreground">
              Tre gode innganger til Tafjordfjella – med fullstendig ruteinfo, kart og hytteinfo
              hos UT.no.
            </p>
          </header>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOURS.map((t, i) => (
              <motion.a
                key={t.href}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackUt(t)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group block"
              >
                <Card className="h-full bg-card/70 backdrop-blur border-border/60 hover:border-secondary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-xs font-medium uppercase tracking-wide text-secondary mb-2">
                      {t.kind}
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
                      {t.title}
                      <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-secondary">
                      Se på UT.no <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* For korte turer og lange turer */}
      <section className="py-12 md:py-16 px-4 bg-muted/40" aria-labelledby="lengder-heading">
        <div className="container mx-auto max-w-5xl">
          <header className="mb-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Korte turer og lange turer
            </div>
            <h2 id="lengder-heading" className="font-display text-2xl md:text-3xl font-bold mb-2">
              Velg lengde etter dagsform og vær
            </h2>
          </header>
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Dagsturer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kjør inn Brøstdalen og finn en startpunkt – mange ruter holder fint som rundtur
                  på en dag når du er tidlig ute.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Skiturer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sen vår og forsommer holder snøen seg lenge høyt oppe. Skitur til Vakkerstøylen
                  fra Brøstet er en klassiker – lang, men gjennomførbar for trente turfolk.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Hytte til hytte</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vakkerstøylen, Pyttbua og nabohyttene henger sammen i et rutenett som lar deg
                  legge opp turer på flere dager. Planlegg etappene etter vær og snøforhold.
                </p>
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
              Praktisk info
            </div>
            <h2 id="praktisk-heading" className="font-display text-2xl md:text-3xl font-bold mb-2">
              Før du legger ut
            </h2>
          </header>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Sjekk vær og forhold</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vind, sikt og snøforhold avgjør hvor langt du kommer. Les meldingen før
                  avreise, og ha en plan B hvis været snur.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Værskifter går fort</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  På fjellet kan en grei dag bli krevende på minutter. Snu i tide hvis sikten
                  forsvinner – fjellet står der i morgen også.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Pakk skikkelig</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vindtett skall, ekstra lag, mat, drikke, kart og kompass – også på korte turer.
                  Lader og pannelampe når du går mot kveld.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Bruk UT.no og merkede ruter</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Detaljerte ruter, høydeprofiler og hytteinfo ligger på{' '}
                  <a
                    href="https://www.ut.no/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline"
                  >
                    ut.no
                  </a>
                  . Hold deg til merkede stier og varder når du er ukjent i området.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to={lp('/fotturer')}>
                Se alle fotturer rundt Bjorli
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to={lp('/sommer')}>
                Tilbake til sommer på Bjorli
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hidden alt-bearing image for crawlers — uses same aerial as the entry card. */}
      <img src={heroImg} alt={heroAlt} className="sr-only" loading="lazy" />
    </div>
  );
};

export default Tafjordfjella;
