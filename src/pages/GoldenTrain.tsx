import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Train, Info } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { images } from '@/lib/images';

const META_TITLE = 'The Golden Train fra Bjorli | Naturskjønn togtur på Raumabanen';
const META_DESC =
  'The Golden Train er en naturskjønn togopplevelse på Raumabanen. Bruk Bjorli som base og opplev togturen ned mot Åndalsnes. Sjekk tider og billetter hos The Golden Train.';

const EXTERNAL = 'https://www.thegoldentrain.com/';

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
        subtitle="En naturskjønn togopplevelse på Raumabanen — perfekt som dagstur fra Bjorli."
        image={images.tipTrain.src}
      />

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            The Golden Train er en kuratert reise på Raumabanen — en av Europas mest kjente
            naturskjønne togstrekninger. Den passerer gjennom dramatiske dalfører, forbi
            Trollveggen og ned mot Romsdalen.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            Bjorli ligger på selve Raumabanen og er en naturlig basecamp for opplevelsen.
            Bo på fjellet, ta toget ned dalen og kom tilbake samme dag.
          </p>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Tider, billetter og avganger
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Golden Train opererer egne avganger og billettyper. Oppdaterte tider,
                  priser og tilgjengelighet må sjekkes direkte hos arrangøren.
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
