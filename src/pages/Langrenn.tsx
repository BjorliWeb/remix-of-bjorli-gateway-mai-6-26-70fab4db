import { Activity, ExternalLink, Lightbulb, Mountain, Info } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { trackExternalPartnerClick } from '@/lib/analytics';
import fjelloypeAsset from '@/assets/fjelloype-bjorli.jpg.asset.json';
import lysloypeAsset from '@/assets/lysloype-bjorli.jpg.asset.json';

const TRAIL_STATUS_URL = 'https://www.loyper.net/location/bjorli';

const trackLoyperClick = (linkText: string) =>
  trackExternalPartnerClick({
    partner_name: 'Loyper.net',
    partner_category: 'trail_map',
    link_url: TRAIL_STATUS_URL,
    link_text: linkText,
  });

const Langrenn = () => {
  return (
    <div>
      <PageHero
        title="Langrenn på Bjorli"
        subtitle="Drøyt 80 km preparerte langrennsløyper – fra lysløype i bygda til åpne fjelløyper."
        image={fjelloypeAsset.url}
      />

      {/* Intro */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg md:text-xl text-foreground/85 leading-relaxed">
            Bjorli har litt over <strong>80 km med oppkjørte langrennsløyper</strong>. Nettet
            strekker seg fra skogsterreng nede i bygda og opp på snaufjellet, og inkluderer en
            opplyst <strong>lysløype</strong> for kveldsøkter. Forholdene er stabile gjennom hele
            sesongen, og du kan velge alt fra korte runder til lange dagsturer på fjellet.
          </p>
        </div>
      </section>

      {/* Trail status card */}
      <section className="pb-12 md:pb-16 px-4" aria-labelledby="loypestatus-heading">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-card/70 backdrop-blur border-border/60">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
              <div className="h-12 w-12 shrink-0 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                <Activity className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2
                  id="loypestatus-heading"
                  className="font-display text-xl md:text-2xl font-semibold mb-1"
                >
                  Løypestatus akkurat nå
                </h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Se hvilke løyper som er nylig preparert og hvilke som ikke er kjørt opp ennå.
                  Oppdateres av løypelaget på Bjorli.
                </p>
              </div>
              <a
                href={TRAIL_STATUS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackLoyperClick('Se løypestatus på løyper.net')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap"
              >
                Se løypestatus på løyper.net
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lysløype */}
      <section className="py-12 md:py-16 px-4 bg-muted/40" aria-labelledby="lysloype-heading">
        <div className="container mx-auto max-w-6xl grid gap-8 md:gap-12 md:grid-cols-2 items-center">
          <figure className="rounded-2xl overflow-hidden border border-border shadow-sm">
            <img
              src={lysloypeAsset.url}
              alt="Langrennsløper i Bjorli lysløype en mørk vinterkveld, med lyktestolper langs den preparerte løypa."
              className="w-full h-full object-cover aspect-[4/3]"
              loading="lazy"
            />
          </figure>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              Lysløype
            </div>
            <h2
              id="lysloype-heading"
              className="font-display text-2xl md:text-3xl font-bold mb-3"
            >
              Gå på ski etter mørkets frembrudd
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Lysløypa på Bjorli gjør det mulig å trene og kose seg på ski lenge etter at sola
              har gått ned. En fin rundløype som passer like godt til en rolig kveldstur som til
              intervaller, og som ofte er det første som blir preparert tidlig i sesongen.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sjekk gjeldende åpningstider og status før du drar – lyset styres lokalt og kan
              variere gjennom sesongen.
            </p>
          </div>
        </div>
      </section>

      {/* Fjelløyper */}
      <section className="py-12 md:py-16 px-4" aria-labelledby="fjelloyper-heading">
        <div className="container mx-auto max-w-6xl grid gap-8 md:gap-12 md:grid-cols-2 items-center">
          <div className="md:order-2">
            <figure className="rounded-2xl overflow-hidden border border-border shadow-sm">
              <img
                src={fjelloypeAsset.url}
                alt="Preparert langrennsløype på snaufjellet over Bjorli med skilt mot Fjelløypa, 13 km."
                className="w-full h-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </figure>
          </div>
          <div className="md:order-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <Mountain className="h-3.5 w-3.5" aria-hidden="true" />
              Fjelløyper
            </div>
            <h2
              id="fjelloyper-heading"
              className="font-display text-2xl md:text-3xl font-bold mb-3"
            >
              Lange turer på snaufjellet
            </h2>
            <p className="text-foreground/80 leading-relaxed mb-4">
              Fra Bjorlitoppen og innover åpner fjelløypene seg i et stort, åpent fjellandskap.
              Her finner du strekk som <em>Fjelløypa</em> og forbindelser videre mot
              Konglebrgrenda og nabofjellene – lange, sammenhengende turer for de som vil ha
              ordentlig avstand under skiene.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              På fjellet er vær og sikt det avgjørende. Planlegg etter forholdene, og snu i tide
              hvis været slår om.
            </p>
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-12 md:py-16 px-4 bg-muted/40" aria-labelledby="praktisk-heading">
        <div className="container mx-auto max-w-5xl">
          <header className="mb-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary px-3 py-1 text-xs font-medium mb-3">
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              Praktisk info
            </div>
            <h2
              id="praktisk-heading"
              className="font-display text-2xl md:text-3xl font-bold mb-2"
            >
              Før du går ut i løypa
            </h2>
          </header>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Sjekk forholdene</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Se{' '}
                  <a
                    href={TRAIL_STATUS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackLoyperClick('løyper.net (praktisk info)')}
                    className="text-secondary hover:underline"
                  >
                    løyper.net
                  </a>{' '}
                  for hva som er nylig preparert, og sjekk værmelding før du legger ut.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Vær kan snu raskt</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  På fjellet kan vinden friske til og sikten bli dårlig på kort tid. Ha med ekstra
                  klær, mat og drikke – også på korte turer.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur border-border/60">
              <CardContent className="p-6">
                <h3 className="font-display text-lg font-semibold mb-2">Vis hensyn</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Følg skilting og merking, ikke ødelegg sporene, og respekter private områder og
                  hytter langs løypa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Langrenn;
