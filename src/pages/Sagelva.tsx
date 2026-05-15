import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Clock, Users, Accessibility, Info, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import heroImg from '@/assets/sagelva/sagelva-hero-vasskraftsenter.jpg';
import mekanismeImg from '@/assets/sagelva/sagelva-vannmekanisme.jpg';
import anleggImg from '@/assets/sagelva/sagelva-anlegg-furuskog.jpg';
import guideImg from '@/assets/sagelva/sagelva-guide-formidling.jpg';

const META_TITLE = 'Sagelva vasskraftsenter | Sommeraktivitet nær Bjorli';
const META_DESC =
  'Opplev Sagelva vasskraftsenter i Lesja, med vasskraft, lokalhistorie, guider og familievennlige sommeropplevelser nær Bjorli.';

const SAGELVA_URL = 'https://www.sagelva.net/';

const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const EXPERIENCE_CARDS = [
  {
    title: 'Levende vasskraft',
    desc: 'Et fullskala anlegg drevet av vatn — oppgangssag, sirkelsag, kvern og vadmelstampe står og virker når vatnet kjem.',
    image: mekanismeImg,
    alt: 'Vassdrevet mekanisme på Sagelva vasskraftsenter',
  },
  {
    title: 'Lokal historie',
    desc: '300 år med vasskraft på Stueflotten øverst i Romsdalen — bygd opp av lokale ildsjeler og tildelt Olavsrosa fra Norsk kulturarv i 2020.',
    image: anleggImg,
    alt: 'Anlegget på Sagelva i furuskogen i Lesja',
  },
  {
    title: 'For familier og nysgjerrige',
    desc: 'Lokale, engasjerte guider gir et levende innblikk i bygningar, mekanismar, historie og kultur — fint for både små og store.',
    image: guideImg,
    alt: 'Guide formidler historien om Sagelva vasskraftsenter',
  },
];

const Sagelva = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = META_TITLE;
    setMeta('description', META_DESC);
    setMeta('og:title', META_TITLE, 'property');
    setMeta('og:description', META_DESC, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', '/sagelva', 'property');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      name: 'Sagelva vasskraftsenter',
      description: META_DESC,
      url: SAGELVA_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Bjorli',
        addressRegion: 'Lesja',
        addressCountry: 'NO',
      },
    });
    document.head.appendChild(ld);
    return () => {
      document.title = prev;
      ld.remove();
    };
  }, []);

  return (
    <div>
      <PageHero
        title="Sagelva vasskraftsenter"
        subtitle="Vasskraft, lokalhistorie og levende formidling i Lesja"
        image={heroImg}
      />

      {/* Hero CTAs */}
      <section className="px-4 -mt-8 relative z-10">
        <div className="container mx-auto max-w-3xl flex flex-wrap gap-3 justify-center">
          <Button asChild size="lg">
            <a href={SAGELVA_URL} target="_blank" rel="noopener noreferrer">
              Besøk Sagelva <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/sommer">Se flere sommeraktiviteter</Link>
          </Button>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-5 text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Vasskraft som har drevet bygda i 300 år
            </h2>
            <p>
              Sagelva vasskraftsenter ligger på Stueflotten øverst i Romsdalen, like ved Bjorli i
              Lesja kommune. Her kan du oppleve hvordan vatnet frå Asbjørnsåa har gitt kraft til
              sag, kvern og vadmelstampe i tre hundre år — og hvordan det fortsatt gjør det i dag.
            </p>
            <p>
              Anlegget er bygd opp av lokale ildsjeler og viser fram et fullskala vasskraftanlegg
              med oppgangssag, sirkelsag, kvern og vadmelstampe. I 2020 mottok Sagelva Olavsrosa
              frå Norsk kulturarv som ein anerkjenning av det levande kulturminnearbeidet.
            </p>
            <p>
              For deg som besøker Bjorli er Sagelva en rolig og innholdsrik halvdagstur — en fin
              kontrast til <Link to="/fotturer" className="text-secondary underline-offset-2 hover:underline">fotturer</Link>,
              {' '}<Link to="/gardsbesok" className="text-secondary underline-offset-2 hover:underline">gardsbesøk</Link>
              {' '}og andre <Link to="/aktiviteter" className="text-secondary underline-offset-2 hover:underline">aktiviteter</Link> i området.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience cards */}
      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPERIENCE_CARDS.map((c, i) => (
              <motion.article
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-card rounded-2xl overflow-hidden border border-border/70 flex flex-col"
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img src={c.image} alt={c.alt} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 leading-tight">
                    {c.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">
            Praktisk informasjon
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex gap-4">
                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Beliggenhet</div>
                  <div className="text-sm text-muted-foreground">Brøste, Bjorli — Stueflotten i Lesja kommune.</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex gap-4">
                <Clock className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Tidsbruk</div>
                  <div className="text-sm text-muted-foreground">Beregn omtrent 1 time. Er du særlig interessert, går tida fort.</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex gap-4">
                <Users className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Passer for</div>
                  <div className="text-sm text-muted-foreground">Familier, kulturinteresserte, rolige sommerdager og grupper.</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex gap-4">
                <Accessibility className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">Tilgjengelighet</div>
                  <div className="text-sm text-muted-foreground">Godt gruset sti på anlegget. Deler kan oppleves med rullestol og barnevogn.</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            I kafeen Bedehuset har vertskapet servert vafler, kake, kaffe og saft i sommarsesongen.
            Tilbod og opningstider kan variere frå år til år.
          </p>

          <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-5 flex gap-3 items-start">
            <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/90 leading-relaxed">
              Sjekk alltid <a href={SAGELVA_URL} target="_blank" rel="noopener noreferrer" className="text-secondary underline-offset-2 hover:underline">Sagelva vasskraftsenter</a> for oppdaterte åpningstider, arrangementer og praktisk informasjon før du drar.
            </p>
          </div>

          <div className="mt-8">
            <Button asChild size="lg">
              <a href={SAGELVA_URL} target="_blank" rel="noopener noreferrer">
                Gå til sagelva.net <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 bg-muted/40">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Kombiner Sagelva med en sommerdag på Bjorli
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            Sagelva passer godt som en rolig halvdagstur for familier, par og grupper som vil oppleve mer av Bjorli.
          </p>
          <Button asChild size="lg">
            <Link to="/aktiviteter">
              Se alle aktiviteter <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Sagelva;