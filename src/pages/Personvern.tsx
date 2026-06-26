import { useEffect } from 'react';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';

const PAGE_TITLE = 'Personvern | Bjorli';
const PAGE_DESCRIPTION =
  'Les hvordan Bjorli Skisenter AS behandler personopplysninger, informasjonskapsler og henvendelser via bjorli.no.';

const Personvern = () => {
  // Per-page SEO overrides. SEOHead also runs, but this effect mounts after
  // and ensures the privacy-specific title/description win for this route.
  useEffect(() => {
    document.title = PAGE_TITLE;
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', PAGE_DESCRIPTION);
    setMeta('og:title', PAGE_TITLE, true);
    setMeta('og:description', PAGE_DESCRIPTION, true);
  }, []);

  return (
    <div>
      <PageHero
        title="Personvern"
        subtitle="Slik behandler Bjorli Skisenter AS dine personopplysninger."
        image={heroImage}
      />
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <article className="prose prose-base md:prose-lg max-w-none text-foreground/90 prose-headings:font-display prose-headings:text-foreground prose-h2:mt-12 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-a:text-secondary hover:prose-a:underline">
            <p>
              Ditt personvern er viktig for Bjorli Skisenter AS, og vi tar vårt ansvar for sikkerheten til dine personopplysninger svært alvorlig. Vi påtar oss å beskytte dine personopplysninger og praktisere åpenhet om de opplysningene vi innhenter om deg og hva vi gjør med dem.
            </p>
            <p>
              For å gjenspeile de nyeste endringene i personvernlovgivningen, og vårt engasjement for åpenhet, har vi oppdatert personvernpolicyen vår.
            </p>
            <p>
              Bjorli Skisenter AS («vi») respekterer ditt personvern og behandler personopplysninger som behandlingsansvarlig i samsvar med personopplysningsloven. Disse vilkårene gir deg informasjon om hvordan vi behandler opplysninger om deg.
            </p>

            <h2>Hvilke opplysninger vi behandler og hvordan vi bruker dem</h2>
            <p>
              Vi behandler besøksopplysninger. Dette er opplysninger som serveren genererer automatisk når noen besøker vårt nettsted. Dette omfatter typisk hvilke sider som er lastet ned, tidspunkt, hvilken side du kom fra, IP-adresse, type enhet, for eksempel iPhone, type nettleser og operativsystem.
            </p>
            <p>Besøksopplysninger brukes anonymisert for å drifte og videreutvikle nettsidene.</p>
            <p>
              Dersom du fyller inn informasjon i registreringsskjemaer, vil vi også behandle de opplysningene som du fyller inn i registreringsskjemaene. Disse opplysningene brukes til å administrere tjenestene. Din e-postadresse kan brukes til å sende deg reklame dersom du har samtykket til dette, eller det for øvrig er tillatt etter norsk lov.
            </p>
            <p>
              Vi behandler i tillegg dine henvendelser og tilbakemeldinger dersom du frivillig henvender deg til oss, eller gir tilbakemelding om våre nettsider.
            </p>

            <h2>Utlevering til tredjeparter</h2>
            <p>
              Dersom det ikke er gitt samtykke til annet, utleverer vi ikke dine opplysninger til noen tredjepart.
            </p>

            <h2>Hvordan oppbevarer vi opplysningene?</h2>
            <p>
              Vi har implementert tekniske, fysiske og organisatoriske tiltak for å hindre at personlig data går tapt eller at uvedkommende får tilgang til data. Herunder oppbevarer vi opplysningene kryptert der det er nødvendig.
            </p>
            <p>
              Besøksopplysninger slettes eller anonymiseres løpende. Øvrige opplysninger vi mottar fra deg slettes når vi ikke lenger har behov for å oppbevare dem.
            </p>

            <h2>Lenker</h2>
            <p>
              Bjorli.no inneholder lenker til nettsider som eies og drives av andre. Disse personvernvilkårene gjelder kun bjorli.no, og vi har ikke ansvar for hvordan dine personopplysninger behandles på eksterne sider.
            </p>

            <h2>Endringer</h2>
            <p>
              Vi vil publisere endringer i personvernerklæringen på nettsiden. Din fortsatte bruk av nettsiden betyr at du godtar de endrede personvernvilkårene. Brukere av nettsiden bør sjekke personvernerklæringen regelmessig.
            </p>

            <h2>Brukeranmeldelser fra tredjepart</h2>
            <p>
              Bjorli.no kan, ved avtale med TripAdvisor, Google, Facebook eller lignende, samle og synliggjøre anmeldelser fra brukere som har publisert informasjon på relevante destinasjoner og produkter på TripAdvisor, Google, Facebook eller lignende.
            </p>
            <p>
              Man har frasagt seg alle rettigheter man måtte ha når man skriver disse brukeranmeldelsene. Dine bidrag kan fritt brukes, kopieres, distribueres og publiseres i alle medier og på alle måter uten din tillatelse.
            </p>
            <p>
              Vi redigerer ikke brukeranmeldelser publisert på TripAdvisor, Google, Facebook eller lignende, og kan ikke holdes ansvarlige for disse anmeldelsene eller annen bruk, distribusjon eller republisering av disse.
            </p>
            <p>
              Bjorli.no verken bekrefter eller avkrefter meninger eller holdninger uttrykt i brukeranmeldelser. Alle beslutninger tatt med grunnlag i anmeldelser eller kommentarer på Bjorli.no gjøres for egen regning.
            </p>

            <h2>Cookies</h2>
            <p>
              Vi bruker cookies, også kalt informasjonskapsler. Dette er datapakker som lagres på din enhet. Våre cookies brukes for å tilpasse nettsidene til din bruk og dine innstillinger, samt til å gjennomføre anonymiserte undersøkelser om brukeratferd på nettsidene og registrere antall besøkende.
            </p>
            <p>
              Cookies kan også brukes til brukerrettet markedsføring i samsvar med gjeldende lovgivning.
            </p>
            <p>Vi bruker følgende cookies:</p>

            <h3>Sesjonsavhengige cookies</h3>
            <p>
              Sesjonsavhengige cookies brukes for å registrere at en bruker er inne på sidene våre, og hvilke valg brukeren gjør.
            </p>

            <h3>Faste informasjonskapsler</h3>
            <p>
              Faste informasjonskapsler bruker vi for at du skal slippe å endre noen faste innstillinger hver gang du besøker vårt nettsted, for eksempel språk. De fleste faste informasjonskapsler har en utløpsdato og vil slettes automatisk etter en gitt periode.
            </p>

            <h3>Tredjeparts cookies</h3>
            <p>
              Tredjeparts cookies bruker vi for å innhente generell statistikk om besøk på våre nettsider, for eksempel Google Analytics.
            </p>
            <p>
              Du kan i din nettleser velge å avvise cookies. Gjennom en funksjon i din nettleser velger du også om og når du vil slette cookies.
            </p>

            <h2>Spørsmål eller kommentarer</h2>
            <p>
              Dersom du har spørsmål eller kommentarer til hvordan vi behandler personopplysninger, kan du kontakte oss på{' '}
              <a href="mailto:skisenter@bjorli.no">skisenter@bjorli.no</a>.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Personvern;