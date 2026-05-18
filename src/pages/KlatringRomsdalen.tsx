import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChevronRight, ExternalLink, Mountain, Users,
  Shield, MapPin, BookOpen, Compass, Train, Bed, Activity, Fish, Bike,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

import heroImg from '@/assets/klatring/klatring-hero-romsdalen-granitt.jpg';
import sportImg from '@/assets/klatring/klatring-sportsklatring-tau-kalk.jpg';
import ferrataImg from '@/assets/klatring/klatring-via-ferrata-aandalsnes.jpg';

const META_TITLE = 'Klatring i Romsdalen | Bjorli som basecamp';
const META_DESC =
  'Sportsklatring, buldring og via ferrata i Romsdalen. Bjorli ligger i sørenden av regionen – en rolig base mellom fjell, elv og dal.';

const LINKS = {
  klatredepot:
    'https://www.klatredepot.no/products/romsdal-sportsklatring-sportsklatreforer-for-romsdalsregionen',
  molde:
    'https://moldeklatresenter.no/blogg/romsdal-sportsklatring-klatref%C3%B8rer-for-romsdal',
  forer: 'https://moldeklatresenter.no/forer',
  tindesenter: 'https://www.tindesenteret.no/',
  viaFerrata: 'https://www.tindesenteret.no/via-ferrata',
  facebook: 'https://share.google/SvfyAuX7K0N02jMxP',
};

const FAQ = [
  {
    q: 'Kan nybegynnere prøve klatring i Romsdalen?',
    a: 'Ja. Start gjerne innendørs eller på via ferrata hos Norsk Tindesenter i Åndalsnes.',
  },
  {
    q: 'Finnes det klatrefører for området?',
    a: 'Ja. Romsdal Sportsklatring beskriver nesten 750 ruter på 36 felt fra Harøya til Eresfjord og Bjorli.',
  },
  {
    q: 'Er Bjorli et godt utgangspunkt for klatring?',
    a: 'Ja. Bjorli ligger i sørenden av regionen og gir en rolig base for deg som vil veksle mellom klatring og andre dager i fjellet.',
  },
  {
    q: 'Viser bjorli.no konkrete ruter og grader?',
    a: 'Nei. Bjorli.no er ikke en klatrefører. Bruk Romsdal Sportsklatring og lokale ressurser for ruter, grader og topodata.',
  },
];

const KlatringRomsdalen = () => {
  const lp = useLocalizedPath();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = META_TITLE;
    const setMeta = (attr: 'name' | 'property', key: string, val: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
      return el;
    };
    const m1 = setMeta('name', 'description', META_DESC);
    const m2 = setMeta('property', 'og:title', META_TITLE);
    const m3 = setMeta('property', 'og:description', META_DESC);

    const faqLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    };
    const attractionLd = {
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: 'Klatring og buldring i Romsdalen',
      description: META_DESC,
      touristType: ['Climbers', 'Outdoor enthusiasts', 'Families'],
      isAccessibleForFree: true,
      areaServed: {
        '@type': 'Place',
        name: 'Romsdalen, Norway',
      },
    };
    const sportLd = {
      '@context': 'https://schema.org',
      '@type': 'SportsActivityLocation',
      name: 'Romsdalen climbing region',
      sport: ['Sport climbing', 'Bouldering', 'Via ferrata'],
      description:
        'Romsdal Sportsklatring dekker området fra Harøya til Eresfjord og Bjorli, med nesten 750 ruter på 36 felt.',
    };
    const s1 = document.createElement('script');
    s1.type = 'application/ld+json';
    s1.text = JSON.stringify(faqLd);
    document.head.appendChild(s1);
    const s2 = document.createElement('script');
    s2.type = 'application/ld+json';
    s2.text = JSON.stringify(attractionLd);
    document.head.appendChild(s2);
    const s3 = document.createElement('script');
    s3.type = 'application/ld+json';
    s3.text = JSON.stringify(sportLd);
    document.head.appendChild(s3);

    return () => {
      document.title = prevTitle;
      s1.remove();
      s2.remove();
      s3.remove();
      void m1;
      void m2;
      void m3;
    };
  }, []);

  const ext = { target: '_blank', rel: 'noopener noreferrer' as const };

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[600px] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Dramatiske granittvegger i Romsdalen i kveldslys med tåke mellom toppene"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-24 max-w-5xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-white/75 text-xs md:text-sm font-medium tracking-[0.24em] uppercase mb-6"
          >
            Sommer i Romsdalen
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-4xl md:text-7xl font-bold text-white mb-6 leading-[0.95] tracking-tight max-w-3xl"
          >
            Klatring og buldring i Romsdalen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/85 text-lg md:text-2xl mb-10 font-light max-w-2xl leading-relaxed"
          >
            Tusen meter granitt reiser seg fra dalen, og Romsdalen samler sportsklatring, buldring og via ferrata på et lite område. Bjorli ligger en togtur sør for veggene.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 flex-wrap"
          >
            <a href={LINKS.klatredepot} {...ext}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                Se klatrefører <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href={LINKS.tindesenter} {...ext}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto"
              >
                Norsk Tindesenter <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link to={lp('/sommer')}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto"
              >
                Se sommeraktiviteter <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">Bjorli</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp('/sommer')} className="hover:text-secondary">Sommer</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">Klatring og buldring i Romsdalen</li>
        </ol>
      </nav>

      {/* Intro */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
            Romsdalen
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-8 leading-[1.05] tracking-tight">
            Et klatredistrikt fra fjord til fjell
          </h2>
          <p className="text-lg md:text-xl text-foreground/85 leading-relaxed">
            Veggene står tett her – granitt og gneis fra dalbunnen og oppover. Klatremiljøet er etablert og spenner fra innendørs vegg til alpine ruter i Romsdalshorn og Trolltindene. Bjorli ligger i sørenden av regionen og gir en roligere base for deg som vil veksle mellom klatring og{' '}
            <Link to={lp('/fotturer')} className="text-secondary underline-offset-4 hover:underline">fjellturer</Link>,{' '}
            <Link to={lp('/fiske')} className="text-secondary underline-offset-4 hover:underline">fiske i Raumaelva</Link> eller{' '}
            <Link to={lp('/sykling')} className="text-secondary underline-offset-4 hover:underline">sykling</Link>.
          </p>
        </div>
      </section>

      {/* Beginner / Tindesenter */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              For nybegynnere og familier
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              For deg som vil prøve klatring
            </h2>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-8">
              Norsk Tindesenter i Åndalsnes er et godt sted å begynne. Innendørs vegg, buldring og barnevennlige tilbud gir trygghet før du går ut i fjellet. Her finner du led, topptau og autobelay.
            </p>
            <a href={LINKS.tindesenter} {...ext}>
              <Button size="lg" className="font-semibold">
                Les mer hos Norsk Tindesenter <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <figure className="rounded-2xl overflow-hidden bg-muted aspect-[4/3]">
            <img
              src={sportImg}
              alt="Klatreutstyr — tau, kalkpose og karabiner på granitt"
              loading="lazy"
              className="w-full h-full object-cover"
              width={1600}
              height={1100}
            />
          </figure>
        </div>
      </section>

      {/* Via ferrata */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <figure className="rounded-2xl overflow-hidden bg-muted aspect-[4/3] order-2 lg:order-1">
            <img
              src={ferrataImg}
              alt="Via ferrata-kabel boltet i bratt fjellvegg over Romsdalen"
              loading="lazy"
              className="w-full h-full object-cover"
              width={1600}
              height={1100}
            />
          </figure>
          <div className="order-1 lg:order-2">
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              Via ferrata
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              Bratt fjell, gjort tilgjengelig
            </h2>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-8">
              Via ferrata gir deg luften under føttene uten at du må kunne klatre. Norsk Tindesenter beskriver Introveggen, Randersveggen og Vestveggen med ulik vanskelighetsgrad og utsikt mot Romsdalsfjella.
            </p>
            <a href={LINKS.viaFerrata} {...ext}>
              <Button size="lg" className="font-semibold">
                Se Via Ferrata Åndalsnes <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Sport climbing / bouldering — dark cinematic band */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <img
          src={heroImg}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
        <div className="relative z-10 container mx-auto max-w-3xl text-center">
          <div className="text-white/70 text-xs font-medium tracking-[0.24em] uppercase mb-5">
            Sportsklatring og buldring
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-8 leading-[1.05] tracking-tight">
            Granitt, kalk på fingrene og 750 ruter
          </h2>
          <p className="text-white/85 text-base md:text-lg leading-relaxed mb-10">
            Romsdal Sportsklatring samler nesten 750 ruter på 36 felt fra Harøya i vest til Eresfjord i øst og Bjorli i sør. Bruk føreren og det lokale klatremiljøet for presis informasjon om felt, adgang og sikkerhet.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <a href={LINKS.klatredepot} {...ext}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                Kjøp / se Romsdal Sportsklatring <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href={LINKS.forer} {...ext}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-white border-white/40 hover:bg-white/10 hover:text-white font-semibold w-full sm:w-auto"
              >
                Se oppdateringer og rettelser <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          <p className="mt-8 text-white/55 text-xs leading-relaxed max-w-xl mx-auto">
            Felt i regionen inkluderer Mjelvahammaren, Norafjell og Hornaksla. Sjekk klatreføreren for grader og oppdaterte beskrivelser.
          </p>
        </div>
      </section>

      {/* Basecamp */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              Basen din
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
              Bjorli som basecamp
            </h2>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed">
              Bo roligere. Reis lettere. Utforsk mer. Fra Bjorli rekker du veggene i Romsdalen på en kort kjøretur, og Raumabanen knytter dalen sammen uten bil. Når klatredagen er ferdig venter{' '}
              <Link to={lp('/fotturer')} className="text-secondary underline-offset-4 hover:underline">fjellturer</Link>,{' '}
              <Link to={lp('/fiske')} className="text-secondary underline-offset-4 hover:underline">fiske i Raumaelva</Link> eller{' '}
              <Link to={lp('/sommer/korte-turer')} className="text-secondary underline-offset-4 hover:underline">korte turer rundt Bjorli</Link>.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: Train, title: 'Raumabanen', desc: 'Toget kjører gjennom dalen og stopper nær flere klatrefelt.' },
              { icon: Bed, title: 'Overnatting på Bjorli', desc: 'Hytter og leiligheter med kjøkken og plass til utstyr.' },
              { icon: Fish, title: 'Raumaelva og fjellene', desc: 'Laksefiske i Raumaelva og fjellturer i Reinheimen.' },
              { icon: Mountain, title: 'Fjord og fossefall', desc: 'Dagsturer vestover til Mardalsfossen og Romsdalsfjorden.' },
              { icon: Bike, title: 'Hviledager mellom øktene', desc: 'Sykling, fiske eller en stille kveld ved hytta.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="bg-card/60 backdrop-blur border-border/60 h-full">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold mb-1.5 leading-tight">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Local resources */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              Lokale ressurser
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              Lokale ressurser
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BookOpen, title: 'Romsdal Sportsklatring', desc: 'Klatreføreren for hele regionen.', href: LINKS.klatredepot },
              { icon: Users, title: 'Romsdal Tindegruppe / Molde Klatresenter', desc: 'Bakgrunn om føreren og lokalmiljøet.', href: LINKS.molde },
              { icon: Compass, title: 'Ruteoppdateringer og rettelser', desc: 'Sjekk siste oppdateringer før du drar.', href: LINKS.forer },
              { icon: Mountain, title: 'Norsk Tindesenter', desc: 'Innendørs klatring og tindesenter i Åndalsnes.', href: LINKS.tindesenter },
              { icon: Activity, title: 'Via Ferrata Åndalsnes', desc: 'Introveggen, Randersveggen og Vestveggen.', href: LINKS.viaFerrata },
              { icon: Users, title: 'Facebook: Klatring i Romsdalen', desc: 'Lokal gruppe for oppdateringer og prat.', href: LINKS.facebook },
            ].map(({ icon: Icon, title, desc, href }) => (
              <a
                key={title}
                href={href}
                {...ext}
                className="group block rounded-2xl border border-border/60 bg-card p-6 hover:border-secondary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold mb-1.5 leading-tight flex items-center gap-2">
                      {title}
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-secondary transition-colors" />
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                Sikkerhet først
              </h2>
            </div>
            <p className="text-foreground/85 text-base md:text-lg leading-relaxed">
              Denne siden er ikke en klatrefører. Bruk oppdatert fører, sjekk lokale forhold og respekter adgang og naturhensyn. Klatre med riktig kompetanse og utstyr, og vær oppmerksom på vær, vannføring og løse steiner.
            </p>
          </div>
        </div>
      </section>

      {/* Related activities */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-10">
            <div className="text-secondary text-xs font-medium tracking-[0.24em] uppercase mb-5">
              Sommer på Bjorli
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              Kombiner klatring med resten av sommeren
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Fotturer', to: '/fotturer' },
              { label: 'Korte turer rundt Bjorli', to: '/sommer/korte-turer' },
              { label: 'Sykling', to: '/sykling' },
              { label: 'Fiske', to: '/fiske' },
              { label: 'Raumaelva', to: '/fiske' },
              { label: 'Mardalsfossen', to: '/sommer' },
              { label: 'Moskus på Dovrefjell', to: '/sommer' },
              { label: 'Overnatting', to: '/overnatting' },
              { label: 'Reisen hit', to: '/reisen-hit' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={lp(to)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:border-secondary hover:text-secondary transition-colors"
              >
                <MapPin className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
            Vanlige spørsmål
          </h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border bg-card p-5 open:bg-card transition-colors"
              >
                <summary className="cursor-pointer font-semibold list-none flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 text-secondary" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KlatringRomsdalen;