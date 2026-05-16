import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Train, Info, MapPin, CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { images } from '@/lib/images';

const META_TITLE = 'The Golden Train fra Bjorli | Naturskjønn togtur på Raumabanen';
const META_DESC =
  'The Golden Train er en guidet rundtur på Raumabanen fra Åndalsnes — forbi Trollveggen, Kyllingbrua og Vermafossen, med kort stopp på Bjorli.';

const EXTERNAL = 'https://book.thegoldentrain.com/en/to-do/2822206/the-golden-train-roundtrip/showdetails';

const GoldenTrain = () => {
  useEffect(() => {
    document.title = META_TITLE;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', META_DESC);
  }, []);

  return (
    <div>
      <PageHero
        title="The Golden Train"
        subtitle="Guidet rundtur på Raumabanen fra Åndalsnes — kåret to ganger av Lonely Planet til Europas mest naturskjønne togtur."
        image={images.tipTrain.src}
      />

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Turen starter på <strong>Åndalsnes stasjon</strong>, hvor en togvert tar imot deg om
            bord på The Golden Train. Toget kjører i rolig tempo gjennom dramatiske dalfører,
            langs elver og fossefall, og forbi den loddrette Trollveggen, den elegante Kyllingbrua
            og Vermafossen.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            Underveis får du fortellinger om livet langs Raumabanen og banens rolle under andre
            verdenskrig — blant annet de hemmelige gulltransportene som har gitt toget navnet sitt.
            Toget gjør et kort stopp på <strong>Bjorli stasjon</strong>, hvor du kan strekke på
            beina og puste inn fjelluft før turen går tilbake til Åndalsnes.
          </p>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Avganger og billetter
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Alle avganger starter og slutter på Åndalsnes togstasjon. Sjekk
                  oppdaterte tider og billetter hos The Golden Train før du planlegger
                  turen.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">Inkludert</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" /> Tur-retur-billett Åndalsnes – Bjorli – Åndalsnes</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" /> Engelsktalende guide om bord</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Bjorli som base
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Bor du på Bjorli kan du ta ordinært tog ned til Åndalsnes om morgenen, gå om
                  bord på The Golden Train derfra, og være tilbake samme dag. Sjekk alltid
                  oppdaterte tider, priser og tilgjengelighet direkte hos arrangøren.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={EXTERNAL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                <Train className="mr-2 h-5 w-5" />
                Se tider og billetter hos The Golden Train
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link to="/aktiviteter">
              <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">
                Tilbake til aktiviteter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GoldenTrain;
