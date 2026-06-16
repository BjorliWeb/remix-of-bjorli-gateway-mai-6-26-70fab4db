import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShoppingBag, ShoppingCart, Store, MapPin, Zap, ExternalLink, Utensils, ArrowRight } from 'lucide-react';
import FaqBlock from '@/components/seo/FaqBlock';
import { Link } from 'react-router-dom';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

const heroImg = images.resortEntrance.src;

const Handel = () => {
  const lp = useLocalizedPath();
  const faqItems = [
    {
      q: 'Hvor kan jeg kjøpe sportsutstyr på Bjorli?',
      a: 'Intersport Bjorli ligger inne i velkomstsenteret ved skisenteret og driftes av Intersport Ålesund. Her finner du sportsutstyr og kjente merkevarer tett på bakken.',
    },
    {
      q: 'Hvor kan jeg leie ski?',
      a: 'Skiutleie driftes fra Intersport Bjorli i velkomstsenteret, like ved bakken.',
    },
    {
      q: 'Finnes det dagligvarebutikk på Bjorli?',
      a: 'Ja. Bunnpris Bjorli ligger omtrent 400 meter fra skisenteret og har dagligvarer og Post i Butikk.',
    },
    {
      q: 'Er det søndagsåpent på Bjorli?',
      a: 'Bunnpris Bjorli er åpen 7 dager i uka, med eget søndagsåpent tilbud. Sjekk butikkens egne kanaler for oppdaterte åpningstider.',
    },
    {
      q: 'Finnes det elbillading på Bjorli?',
      a: 'Ja. Ved Bunnpris finner du hurtiglading, og det finnes også Tesla Superchargers i området.',
    },
    {
      q: 'Finnes det lokale butikker på Bjorli?',
      a: 'Ja. På Bjorli finner du lokale butikker med blant annet klær, interiør og gaver. Lunt Bjorli er ett av tilbudene. Utvalg og åpningstider kan variere gjennom året, så sjekk butikkens egne kanaler før du besøker.',
    },
  ];

  return (
    <div>
      <PageHero
        title="Handel på Bjorli"
        subtitle="Sportsutstyr, skiutleie, dagligvarer, lokale butikker og lading — alt det viktigste på ett sted."
        image={heroImg}
      />

      {/* Intro */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              På Bjorli finner du det viktigste du trenger gjennom oppholdet, enten du skal i
              bakken, på hytta, handle mat eller gjøre praktiske ærend. Her får du oversikt over
              sportsbutikk, dagligvarer, lokale butikker, lading og større handel i nærheten.
            </p>
          </motion.div>

          {/* Intersport */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Sportsutstyr, skiutleie og skiskole
            </h2>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Intersport Bjorli</h3>
                <p className="text-secondary font-medium mb-4">Sportsbutikk i velkomstsenteret</p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Sportsbutikken inne i velkomstsenteret driftes av Intersport Ålesund. Her finner
                  du sportsutstyr, kjente merkevarer og service tett på bakken. Herfra driftes også
                  skiutleie og skiskole.
                </p>
                <a
                  href="https://intersportbjorli.no/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                >
                  Se Intersport Bjorli <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bunnpris */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Dagligvarer og praktiske ærend
            </h2>
            <Card className="overflow-hidden bg-card/60 backdrop-blur border-border/60">
              <div className="bg-muted">
                <img
                  src={images.bunnprisBjorli.src}
                  alt={images.bunnprisBjorli.alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Bunnpris Bjorli</h3>
                <p className="text-secondary font-medium mb-4">Dagligvarer, Post i Butikk og søndagsåpent</p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bunnpris på Bjorli er åpen 7 dager i uka og ligger omtrent 400 meter fra
                  skisenteret. Her finner du dagligvarer, søndagsåpent tilbud og Post i Butikk.
                </p>
                <div className="rounded-xl border border-border bg-muted/40 p-4 mb-6 flex items-start gap-3">
                  <Zap className="h-5 w-5 text-secondary mt-0.5 shrink-0" aria-hidden />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ved Bunnpris finner du også hurtiglading for elbil, med Eviny hurtigladere. Det
                    finnes også Tesla Superchargers ved Bjorli.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <a
                    href="https://www.bunnpris.no/butikker/bunnpris-bjorli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  >
                    Se Bunnpris Bjorli <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="https://share.google/UgR9PsUAMp5H1aIQO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  >
                    Se Eviny hurtigladere <ExternalLink className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.tesla.com/findus/location/supercharger/407723"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                  >
                    Se Tesla Supercharger Bjorli <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lunt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Lokale butikker</h2>
            <Card className="overflow-hidden bg-card/60 backdrop-blur border-border/60">
              <div className="bg-[#2b2b2b] flex items-center justify-center p-6 md:p-10">
                <img
                  src={images.luntBjorli.src}
                  alt={images.luntBjorli.alt}
                  className="w-full h-auto max-w-md"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                  <Store className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Lunt Bjorli</h3>
                <p className="text-secondary font-medium mb-4">Interiør og gaver</p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  På Bjorli finner du også lokale butikker med blant annet klær, interiør og gaver.
                  Lunt er en av butikkene som bidrar til et hyggeligere handelstilbud på Bjorli.
                </p>
                <a
                  href="https://www.facebook.com/p/Lunt-Bjorli-100057398750786/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                >
                  Se Lunt Bjorli på Facebook <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </motion.div>

          {/* Større innkjøp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Større innkjøp</h2>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-8 flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Hvis du trenger et større utvalg butikker, ligger både Dombås og Åndalsnes
                  omtrent 50 km fra Bjorli med bil. Der finner du flere butikker og tjenester for
                  større innkjøp gjennom oppholdet.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-12 md:py-16 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Praktisk informasjon</h2>
          <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
            <li>Åpningstider og tilbud kan variere gjennom året, med sesong, helligdager og lokal drift.</li>
            <li>Sjekk alltid butikkens egne kanaler for oppdatert informasjon før du planlegger besøket.</li>
            <li>Enkelte tjenester kan følge skisesongen eller lokal etterspørsel.</li>
          </ul>
        </div>
      </section>

      <FaqBlock title="Ofte stilte spørsmål" items={faqItems} />
    </div>
  );
};

export default Handel;