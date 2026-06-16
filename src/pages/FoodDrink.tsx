import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { Coffee, Flame, ExternalLink, MapPin, Fuel, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import FaqBlock from '@/components/seo/FaqBlock';

const foodDrinkImg = images.restaurantInterior.src;

const FoodDrink = () => {
  const { t } = useLanguage();
  const s = t.foodDrinkPage;

  const faqItems = [
    {
      q: 'Finnes det servering i skisenteret?',
      a: 'Ja. Bjorli Skisenter har to serveringssteder: Heiskroa og T-Kroken. Sammen dekker de alt fra en rask pause til mat, drikke og afterski.',
    },
    {
      q: 'Hva er forskjellen på Heiskroa og T-Kroken?',
      a: 'T-Kroken er for deg som vil sette deg ned for mat og drikke — her gjelder spiseplikt i serveringsområdet. Heiskroa fungerer også som varmestue og passer for en enklere pause i løpet av skidagen.',
    },
    {
      q: 'Hvor finner jeg varmestue?',
      a: 'Varmestue finner du i Heiskroa, sentralt i skisenteret.',
    },
    {
      q: 'Finnes det afterski på Bjorli?',
      a: 'Ja. T-Kroken tilbyr loungefølelse og afterski tett på bakken etter siste tur.',
    },
    {
      q: 'Finnes det andre spisesteder på Bjorli?',
      a: 'Ja. Utenfor skisenteret finner du blant annet HILLS Bjorli og YX Bjorli. Avdemsbue ligger omtrent 35 km unna, og er et godt alternativ for en matopplevelse i Gudbrandsdalen.',
    },
    {
      q: 'Hvor ligger Avdemsbue?',
      a: 'Avdemsbue ligger omtrent 35 km fra Bjorli, i Gudbrandsdalen.',
    },
  ];

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={foodDrinkImg} />

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
              På Bjorli finner du flere steder for mat, drikke og gode pauser gjennom dagen.
              I skisenteret ligger <strong className="text-foreground font-medium">Heiskroa</strong> og{' '}
              <strong className="text-foreground font-medium">T-Kroken</strong>, med kafé, lounge,
              afterski og servering tett på bakken. I tillegg finnes det flere spisesteder og
              møteplasser i området.
            </p>
          </motion.div>

          {/* Featured: Heiskroa & T-Kroken */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Heiskroa og T-Kroken i skisenteret
            </h2>
            <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>
                I skisenteret finner du både Heiskroa og T-Kroken. Sammen gir de gjestene et godt
                tilbud gjennom skidagen, enten du vil ha en rask pause, varm drikke, lunsj,
                loungefølelse eller afterski etter siste tur.
              </p>
              <p>
                Begge serveringsstedene drives samlet, med vekt på god service, lun stemning og mat
                laget med omtanke. Der det er mulig brukes kortreiste og lokale råvarer.
              </p>
              <p>
                <strong className="text-foreground font-medium">T-Kroken</strong> er stedet for deg
                som vil sette deg ned for mat, drikke og en mer komplett serveringsopplevelse. Her
                gjelder spiseplikt i serveringsområdet.
              </p>
              <p>
                <strong className="text-foreground font-medium">Heiskroa</strong> fungerer også som
                varmestue, og passer godt for gjester som trenger en enkel pause, varme seg, vente
                på andre eller ta en roligere stopp i løpet av skidagen.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-16 md:mb-20"
          >
            <img
              src={images.tkrokenCollage.src}
              alt={s.imageAlt}
              className="w-full h-auto rounded-2xl shadow-md border border-border"
              loading="lazy"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                    <Flame className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">Heiskroa</h3>
                  <p className="text-secondary font-medium mb-4">Varmestue og praktisk møteplass</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Heiskroa er et naturlig møtepunkt i skisenteret, med enkel servering, varme og en
                    praktisk pause gjennom skidagen.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-semibold text-foreground">Passer for: </span><span className="text-muted-foreground">Varm pause, enkel servering, møtepunkt og varmestue.</span></li>
                    <li><span className="font-semibold text-foreground">Praktisk: </span><span className="text-muted-foreground">Varmestue finner du i Heiskroa.</span></li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-5">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">T-Kroken</h3>
                  <p className="text-secondary font-medium mb-4">Kafé, lounge, mat og afterski</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    T-Kroken passer for deg som vil sette seg ned for mat, drikke, loungefølelse og
                    afterski tett på bakken.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li><span className="font-semibold text-foreground">Passer for: </span><span className="text-muted-foreground">Mat, drikke, loungefølelse og afterski.</span></li>
                    <li><span className="font-semibold text-foreground">Praktisk: </span><span className="text-muted-foreground">I serveringsområdet på T-Kroken gjelder spiseplikt.</span></li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other places */}
      <section className="py-16 md:py-24 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Andre spisesteder og møteplasser på Bjorli
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bjorli har også flere spisesteder og møteplasser utenfor selve skisenteret. Utvalg og
              åpningstider kan variere gjennom året, så sjekk alltid stedets egne kanaler før du
              planlegger besøket.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* HILLS Bjorli */}
            <Card className="overflow-hidden flex flex-col bg-card/60 backdrop-blur border-border/60">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={images.hillsBjorli.src}
                  alt={images.hillsBjorli.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="h-5 w-5 text-secondary" />
                  <h3 className="font-display text-xl font-bold">HILLS Bjorli</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  HILLS Bjorli er et serveringssted på Bjorli med mat, drikke og sosial ramme i
                  moderne lokaler.
                </p>
                <a
                  href="https://www.facebook.com/p/HILLS-Bjorli-100071004056072/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                >
                  Se HILLS Bjorli på Facebook <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* YX Bjorli */}
            <Card className="overflow-hidden flex flex-col bg-card/60 backdrop-blur border-border/60">
              <div className="aspect-[4/3] bg-gradient-to-br from-secondary/15 to-muted flex items-center justify-center">
                <Fuel className="h-16 w-16 text-secondary/60" aria-hidden />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="h-5 w-5 text-secondary" />
                  <h3 className="font-display text-xl font-bold">YX Bjorli</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  YX Bjorli er storkiosk, gatekjøkken, bensinstasjon og en sentral møteplass på
                  Bjorli.
                </p>
                <a
                  href="https://www.facebook.com/profile.php?id=100057615902711"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                >
                  Se YX Bjorli på Facebook <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            {/* Avdemsbue */}
            <Card className="overflow-hidden flex flex-col bg-card/60 backdrop-blur border-border/60">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={images.avdemsbue.src}
                  alt={images.avdemsbue.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-secondary" />
                  <h3 className="font-display text-xl font-bold">Avdemsbue</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  Avdemsbue ligger omtrent 35 km fra Bjorli og er et godt alternativ for deg som vil
                  kombinere turen med lokalmat, gårdsmiljø og en matopplevelse i Gudbrandsdalen.
                </p>
                <a
                  href="https://www.avdem.no/avdemsbue/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:underline"
                >
                  Se Avdemsbue <ExternalLink className="h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Praktisk informasjon</h2>
          <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
            <li>Åpningstider kan variere med sesong, vær, helligdager og arrangementer.</li>
            <li>Sjekk alltid stedets egne kanaler for oppdatert informasjon.</li>
            <li>For grupper og større besøk anbefales det å kontakte serveringsstedet direkte.</li>
          </ul>
        </div>
      </section>

      <FaqBlock title="Ofte stilte spørsmål" items={faqItems} />
    </div>
  );
};

export default FoodDrink;
