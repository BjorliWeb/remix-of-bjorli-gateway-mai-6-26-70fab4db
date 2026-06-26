import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import loypekartImage from '@/assets/bjorli-skisenter-loypekart-vinter.jpg';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { JsonLd } from '@/components/seo';
import { buildSkiResort } from '@/lib/seo/schema';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const SkiCenter = () => {
  const { t } = useLanguage();
  const s = t.skiCenter;

  const stats = [
    { label: s.lifts, value: '6' },
    { label: s.slopes, value: '11' },
    { label: s.altitude, value: '575–1225m' },
    { label: s.season, value: 'Nov–Mai' },
  ];

  // Canonical URL for this page in the current locale (falls back to
  // production origin during SSR). The schema name is intentionally the
  // proper Norwegian brand "Bjorli Skisenter" in every locale.
  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://www.bjorli.no/bjorli-skisenter';

  return (
    <div>
      <JsonLd id="jsonld-skiresort" data={buildSkiResort(pageUrl, s.desc)} />
      <PageHero title={s.title} subtitle={s.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg text-muted-foreground leading-relaxed mb-12 text-center">
            {s.desc}
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl p-6 text-center shadow-md border border-border">
                <div className="text-3xl font-bold text-secondary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-2xl p-8 md:p-10 shadow-lg border border-border text-center">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
              Kjøp heiskort
            </h3>
            <p className="text-base md:text-lg opacity-90 mb-6 max-w-xl mx-auto">
              Kjøp heiskort på nett før du kommer til Bjorli.
            </p>
            <Button
              asChild
              size="lg"
              variant="default"
              className="text-base md:text-lg px-8 py-6 h-auto w-full sm:w-auto"
            >
              <a
                href="https://bjorli.skiperformance.com/no/shopp#/no/buy?skugroup_id=4862"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kjøp heiskort <ArrowUpRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <figure className="mt-16 space-y-3">
            <a
              href={loypekartImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-border shadow-md bg-card"
              aria-label="Åpne løypekart i full størrelse"
            >
              <img
                src={loypekartImage}
                alt="Løypekart for Bjorli Skisenter med alpinløyper, heiser, langrennsløyper og symbolforklaring."
                className="w-full h-auto block"
                loading="lazy"
              />
            </a>
            <figcaption className="text-sm text-foreground/70 leading-relaxed">
              Løypekart for Bjorli Skisenter. Kartet viser alpinløyper, heiser, nærområde, symboler og tilknyttede langrennsløyper.
            </figcaption>
            <p className="text-xs text-muted-foreground">
              Se alltid skilt, vær- og føreforhold og oppdatert informasjon på bjorli.no for gjeldende drift.
            </p>
          </figure>
          <section className="mt-20" aria-labelledby="salgsbetingelser-heading">
            <h2 id="salgsbetingelser-heading" className="font-display text-2xl md:text-3xl font-bold mb-3">
              Salgsbetingelser
            </h2>
            <p className="text-muted-foreground mb-6">
              Her finner du generelle salgsbetingelser ved kjøp av heiskort og andre produkter på nett.
            </p>
            <Accordion type="single" collapsible className="bg-card rounded-xl border border-border px-4 md:px-6">
              <AccordionItem value="salgsbetingelser" className="border-b-0">
                <AccordionTrigger className="text-base md:text-lg font-semibold">
                  Les salgsbetingelser
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 space-y-4 leading-relaxed">
                    <p className="font-semibold">
                      Generelle salgsbetingelser ved bestilling av heiskort og annet på internett
                    </p>
                    <p>
                      Disse generelle vilkårene gjelder mellom tilbyder og den person som selv, eller gjennom andre, foretar en bestilling på tilbyders webside eller hos tilbyders tilknyttede online partnere.
                    </p>
                    <p>
                      Bestillingen kan gjelde heiskort, aktiviteter og kjøp av andre produkter og tjenester, eller en kombinasjon av disse.
                    </p>
                    <div>
                      <p className="font-semibold mb-1">Ansvarlig formidler:</p>
                      <p className="mb-0">Bjorli Skisenter AS</p>
                      <p className="mb-0">Adresse: Bjorliveien 84, 2669 Bjorli</p>
                      <p className="mb-0">Mva nummer: 831 920 432</p>
                      <p className="mb-0">
                        E-postadresse:{' '}
                        <a href="mailto:skisenter@bjorli.no" className="text-secondary hover:underline">
                          skisenter@bjorli.no
                        </a>
                      </p>
                      <p className="mb-0">Telefon: +47 48 15 22 00</p>
                    </div>

                    <h3 className="font-semibold mt-4">1. Bestillers ansvar</h3>
                    <p>
                      Før man foretar en endelig bestilling, skal man lese og gjøre seg kjent med viktig informasjon om det aktuelle produktet. Bestiller er ansvarlig for at kjøpet er i henhold til egne ønsker. Bestiller er ansvarlig for å forsikre seg om at opplysningene i bekreftelsen, som kun sendes på e-post, er i samsvar med bestillingen.
                    </p>
                    <p>
                      Du kan også registrere deg og logge inn som bruker via sosial innlogging, for eksempel Facebook og Google. Når du registrerer deg ved hjelp av Facebook eller Google, vil du kunne logge inn på din konto med e-posten du er registrert med på disse tjenestene. Du kan når som helst endre dine personopplysninger ved å logge deg inn på «Min side».
                    </p>

                    <h3 className="font-semibold mt-4">2. Heiskort</h3>
                    <p>
                      Når du kjøper heiskort online, kan du kjøpe dette med eller uten datamedium, for eksempel Keycard. Hvis du kjøper et heiskort med et eksisterende Keycard, aktiveres billetten ved første passering i vendekorset/heisen. Hvis du har kjøpt et nytt Keycard på nettet, kan dette hentes på destinasjonen.
                    </p>
                    <p>
                      Hvis skistedet har QR- eller strekkodelesere i vendekorset/heisen, kan billetten lastes ned til smarttelefonen din for offline bruk og brukes for direkte adgang.
                    </p>
                    <p>
                      Hvis skistedet har automat eller henteboks, kan QR-/strekkoden brukes til å hente billettene dine. Hvis skistedet ikke har dette, kan du gå til billettluken.
                    </p>

                    <h3 className="font-semibold mt-4">3. Gjennomføring av bestilling</h3>
                    <p>
                      Etter korrekt gjennomført online betaling skal du få en kvittering på e-post. Kvitteringen vil inneholde alle detaljer ved kjøpet og kan medbringes til skianlegget.
                    </p>
                    <p>Bestillingen er ikke gjennomført og ikke gyldig i følgende tilfeller:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Bestiller har ikke mottatt e-post med kvittering, bekreftelse eller referansenummer.</li>
                      <li>Kortbetaling avbrytes av ulike årsaker og innbetalingen mislykkes.</li>
                      <li>Betalingen gjennomføres ikke fullstendig eller korrekt, slik at beløpet ikke blir trukket fra konto.</li>
                    </ul>
                    <p>Er du i tvil om bestillingen er korrekt gjennomført, ta gjerne kontakt med oss.</p>

                    <h3 className="font-semibold mt-4">4. Betaling</h3>
                    <p>
                      Vi benytter en betalingsløsning fra Nets AS / Netaxept. Tredjepart vil ikke få tilgang til dine personopplysninger. Netaxept benytter Secure Socket Layer (SSL) ved overføring av personlig informasjon. SSL lager en sikker, kryptert forbindelse mellom din maskin og Netaxept. På denne måten kan informasjonen overføres trygt uten at uvedkommende kan lese den underveis.
                    </p>

                    <h3 className="font-semibold mt-4">5. Angrerett</h3>
                    <p>
                      Ved kjøp av heiskort på internett er det ingen rett til avbestilling eller refusjon, jf. angrerettloven § 22 bokstav m. Dette gjelder også for pakker og kampanjer som inneholder datofestede heiskort eller datofestede arrangement. Ta gjerne kontakt med oss.
                    </p>

                    <h3 className="font-semibold mt-4">6. Endring i skatter og avgifter</h3>
                    <p>
                      Dersom skatter og/eller avgifter endres, og dermed fører til en kostnadsøkning for tilbyder etter at bestillingen er gjennomført og betalt, kan prisen økes tilsvarende for bestiller. Prisendringen skal umiddelbart meddeles bestiller.
                    </p>

                    <h3 className="font-semibold mt-4">7. Forbehold</h3>
                    <p>
                      Det tas forbehold om eventuelle publiserings- eller korrekturfeil på nettsider og på annen trykt informasjon om tilbudene som tilbyder formidler.
                    </p>

                    <h3 className="font-semibold mt-4">8. Tvisteløsning</h3>
                    <p>
                      Gjesten bes henvende seg til tilbyder dersom denne har noe å utsette på bestilt arrangement. Dersom gjesten og tilbyder ikke klarer å forhandle seg til enighet, skal eventuell tvist vedrørende tidligere inngått avtale løses i lokal rettsinstans.
                    </p>

                    <h3 className="font-semibold mt-4">9. Force majeure</h3>
                    <p>
                      Begge parter har rett til å gå bort fra avtalen dersom arrangementet ikke kan gjennomføres som følge av krigshandlinger, naturkatastrofer eller arbeidsmarkedskonflikter. Lengre avbrudd i vann- eller energitilførsel, brann eller andre tilsvarende større hendelser som ingen av partene har kunnet forutse eller påvirke, omfattes også.
                    </p>

                    <p className="font-semibold mt-2">Driftsavbrudd som ligger utenfor driftsledelsens kontroll</p>
                    <p>
                      Ved driftsavbrudd som ligger utenfor skianleggets kontroll skal refusjonen tilsvare 50 % av den forholdsmessige refusjonen som kortinnehaver har krav på etter det foregående punkt.
                    </p>
                    <p>
                      Dette gjelder ved driftsavbrudd som følge av eksempelvis vær- og vindforhold, snømangel, skred, lynnedslag, oversvømmelse, brann, strømstans, streik, offentligrettslige forbud eller påbud, pandemier m.v., og som utgjør forhold som anlegget ikke med rimelighet kunne forvente å ta i betraktning på kjøpstidspunktet. Det er opp til anlegget å dokumentere at driftsavbruddet skyldes slike forhold, og at anlegget ikke har hatt mulighet til å unngå eller overvinne følgene av disse.
                    </p>
                    <p>Ovennevnte bestemmelse gjelder ikke hvis anlegget holder åpent mer enn 1/3 av sesongen.</p>
                    <p>
                      Hvis anlegget er stengt, eksempelvis på grunn av snømangel, utover 1/3 av sesongens totale antall skidager, kan kortholder kreve en forholdsmessig refusjon for den tid sesongkortet ikke kan benyttes. Kortholder har ikke krav på hele kjøpesummen. Et eventuelt refusjonskrav er oppad begrenset til 50 % av heiskortets kjøpesum, uavhengig av kjøpstidspunkt.
                    </p>
                    <p>
                      Refusjonen skal tilsvare 50 % av den forholdsmessige andel av den tid heiskortet ikke kan benyttes, det vil si heiskortets verdi delt på antall dager i sesongen. Denne «dagraten» er avgjørende for refusjonskravets størrelse.
                    </p>
                    <p>
                      Eventuelle refusjonskrav kan ikke avregnes før etter at sesongen er avsluttet. Inntil sesongavslutning kan anleggseier følgelig avvise eventuelle refusjonskrav.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </section>
    </div>
  );
};

export default SkiCenter;
