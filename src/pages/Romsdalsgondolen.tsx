import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mountain, Info } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { images } from '@/lib/images';

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
        image={images.summerValley.src}
      />

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Romsdalsgondolen går fra Åndalsnes sentrum opp til Nesaksla. På toppen finner
            du blant annet Eggen Restaurant og utsiktsplattformen Rampestreken med utsyn
            over Romsdalen, Trollveggen og Romsdalsfjella.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">
            Fra Bjorli tar du toget eller bilen ned dalen til Åndalsnes — en naturlig
            dagstur for besøkende som bruker Bjorli som base. Romsdalsgondolen er en
            ekstern opplevelse og driftes ikke av Bjorli.
          </p>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">
                  Åpningstider og billetter
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Sesong, åpningstider og priser kan endre seg. Sjekk alltid oppdatert
                  informasjon direkte hos Romsdalsgondolen før du planlegger turen.
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
