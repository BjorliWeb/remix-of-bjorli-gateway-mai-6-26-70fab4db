import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mountain, Info, Utensils, Footprints, Accessibility, Ticket } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import gondolImg from '@/assets/romsdalsgondolen/romsdalsgondolen-gondol.jpeg';
import rampestrekenImg from '@/assets/romsdalsgondolen/romsdalsgondolen-rampestreken.jpeg';

const META_TITLE = 'Romsdalsgondolen som dagstur fra Bjorli | Utsikt over Romsdalen';
const META_DESC =
  'Romsdalsgondolen tar deg fra Åndalsnes opp til Nesaksla med utsikt over Romsdalen. En naturlig dagstur fra Bjorli. Sjekk åpningstider og billetter hos Romsdalsgondolen.';

const EXTERNAL = 'https://www.romsdalsgondolen.no/';

const Romsdalsgondolen = () => {
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
        title="Romsdalsgondolen"
        subtitle="Dagstur fra Bjorli til Åndalsnes — opp med gondol til vidstrakt utsikt over Romsdalen."
        image={gondolImg}
      />

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Opplev den ville norske naturen og få et helt unikt utsyn over Åndalsnes,
            frodige dalsider, den smaragdgrønne Rauma og ikoniske fjell som Romsdalshorn
            og Vengetindene.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            Romsdalsgondolen tar deg fra Åndalsnes sentrum opp til Nesaksla på få minutter
            — tilgjengelig for alle, og en av de mest spektakulære gondolturene i Norge.
            Fra Bjorli er det en naturlig dagstur med tog langs Raumabanen eller bil ned
            gjennom Romsdalen.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-12">
            Romsdalsgondolen er en ekstern opplevelse og driftes ikke av Bjorli.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <Utensils className="h-5 w-5 text-secondary mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Eggen Restaurant på toppen
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                På toppen finner du Eggen Restaurant — tradisjonell norsk mat med moderne
                vri, basert på lokale råvarer, i en avslappet atmosfære med fjellene i
                Romsdalen som bakteppe.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <Mountain className="h-5 w-5 text-secondary mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Utforsk toppområdet
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grusede stier og merka ruter leder ut til utsiktspunkter og rolige
                pauseplasser i fjellet. Fint for både korte spaserturer og lengre
                opphold på toppen.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <Footprints className="h-5 w-5 text-secondary mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Gå ned via Rampestreken
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vil du ha en annerledes opplevelse, kan du gå ned igjen til Åndalsnes
                langs en bratt sti med steintrapper, forbi det kjente utsiktspunktet
                Rampestreken.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <Accessibility className="h-5 w-5 text-secondary mb-3" />
              <h3 className="font-display text-lg font-bold text-foreground mb-2">
                Tilgjengelig for alle
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Selve gondolturen er tilgjengelig for alle, og passer godt for familier,
                par og grupper som ønsker en enkel måte å komme høyt opp i Romsdalsfjella på.
              </p>
            </div>
          </div>

          <figure className="mb-12 rounded-2xl overflow-hidden border border-border/70">
            <img
              src={rampestrekenImg}
              alt="Utsikt fra Rampestreken og Nesaksla over Åndalsnes, Rauma og Romsdalen"
              loading="lazy"
              className="w-full h-auto object-cover"
            />
            <figcaption className="px-4 py-3 text-xs text-muted-foreground bg-muted/30">
              Utsikt fra toppområdet over Åndalsnes, Rauma og Romsdalsfjella.
            </figcaption>
          </figure>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-6">
            <div className="flex items-start gap-3">
              <Ticket className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Tur–retur-billett
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tur–retur-billetten inkluderer både opp- og nedtur med gondolen, og
                  passer for deg som planlegger å ta gondolen begge veier. Når billetten
                  er aktivert, må returen brukes samme dag.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Åpningstider og billetter
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sesong, åpningstider og priser kan endre seg. Sjekk alltid oppdaterte
                  åpningstider direkte hos Romsdalsgondolen før du planlegger turen:
                  {' '}
                  <a
                    href={EXTERNAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline-offset-2 hover:underline"
                  >
                    romsdalsgondolen.no
                  </a>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={EXTERNAL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                <Mountain className="mr-2 h-5 w-5" />
                Se åpningstider og billetter hos Romsdalsgondolen
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

export default Romsdalsgondolen;
