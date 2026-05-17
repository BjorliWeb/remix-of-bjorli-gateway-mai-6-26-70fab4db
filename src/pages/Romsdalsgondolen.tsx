import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Mountain, Info, Utensils, Footprints, Accessibility, Ticket } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import gondolImg from '@/assets/romsdalsgondolen/romsdalsgondolen-gondol.jpeg';
import rampestrekenImg from '@/assets/romsdalsgondolen/romsdalsgondolen-rampestreken.jpeg';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

const EXTERNAL = 'https://www.romsdalsgondolen.no/';

type Copy = {
  metaTitle: string;
  metaDesc: string;
  heroTitle: string;
  heroSubtitle: string;
  intro1: string;
  intro2: string;
  intro3: string;
  cards: { title: string; body: string }[];
  figCaption: string;
  returnTitle: string;
  returnBody: string;
  hoursTitle: string;
  hoursBody1: string;
  hoursBody2: string;
  ctaPrimary: string;
  ctaBack: string;
};

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', Copy> = {
  no: {
    metaTitle: 'Romsdalsgondolen som dagstur fra Bjorli | Utsikt over Romsdalen',
    metaDesc:
      'Romsdalsgondolen tar deg fra Åndalsnes opp til Nesaksla med utsikt over Romsdalen. En naturlig dagstur fra Bjorli. Sjekk åpningstider og billetter hos Romsdalsgondolen.',
    heroTitle: 'Romsdalsgondolen',
    heroSubtitle: 'Dagstur fra Bjorli til Åndalsnes — opp med gondol til vidstrakt utsikt over Romsdalen.',
    intro1:
      'Opplev den ville norske naturen og få et helt unikt utsyn over Åndalsnes, frodige dalsider, den smaragdgrønne Rauma og ikoniske fjell som Romsdalshorn og Vengetindene.',
    intro2:
      'Romsdalsgondolen tar deg fra Åndalsnes sentrum opp til Nesaksla på få minutter — tilgjengelig for alle, og en av de mest spektakulære gondolturene i Norge. Fra Bjorli er det en naturlig dagstur med tog langs Raumabanen eller bil ned gjennom Romsdalen.',
    intro3: 'Romsdalsgondolen er en ekstern opplevelse og driftes ikke av Bjorli.',
    cards: [
      { title: 'Eggen Restaurant på toppen', body: 'På toppen finner du Eggen Restaurant — tradisjonell norsk mat med moderne vri, basert på lokale råvarer, i en avslappet atmosfære med fjellene i Romsdalen som bakteppe.' },
      { title: 'Utforsk toppområdet', body: 'Grusede stier og merka ruter leder ut til utsiktspunkter og rolige pauseplasser i fjellet. Fint for både korte spaserturer og lengre opphold på toppen.' },
      { title: 'Gå ned via Rampestreken', body: 'Vil du ha en annerledes opplevelse, kan du gå ned igjen til Åndalsnes langs en bratt sti med steintrapper, forbi det kjente utsiktspunktet Rampestreken.' },
      { title: 'Tilgjengelig for alle', body: 'Selve gondolturen er tilgjengelig for alle, og passer godt for familier, par og grupper som ønsker en enkel måte å komme høyt opp i Romsdalsfjella på.' },
    ],
    figCaption: 'Utsikt fra toppområdet over Åndalsnes, Rauma og Romsdalsfjella.',
    returnTitle: 'Tur–retur-billett',
    returnBody:
      'Tur–retur-billetten inkluderer både opp- og nedtur med gondolen, og passer for deg som planlegger å ta gondolen begge veier. Når billetten er aktivert, må returen brukes samme dag.',
    hoursTitle: 'Åpningstider og billetter',
    hoursBody1: 'Sesong, åpningstider og priser kan endre seg. Sjekk alltid oppdaterte åpningstider direkte hos Romsdalsgondolen før du planlegger turen:',
    hoursBody2: 'romsdalsgondolen.no',
    ctaPrimary: 'Se åpningstider og billetter hos Romsdalsgondolen',
    ctaBack: 'Tilbake til aktiviteter',
  },
  en: {
    metaTitle: 'Romsdalsgondolen as a day trip from Bjorli | Views over Romsdalen',
    metaDesc:
      'Romsdalsgondolen takes you from Åndalsnes up to Nesaksla, with views over Romsdalen. A natural day trip from Bjorli. Check opening hours and tickets with Romsdalsgondolen.',
    heroTitle: 'Romsdalsgondolen',
    heroSubtitle: 'A day trip from Bjorli to Åndalsnes — up by cable car to wide views over Romsdalen.',
    intro1:
      'Experience the wild Norwegian landscape and a sweeping view over Åndalsnes, the green valley sides, the emerald Rauma river and iconic peaks like Romsdalshorn and Vengetindene.',
    intro2:
      'Romsdalsgondolen takes you from the centre of Åndalsnes up to Nesaksla in just a few minutes — accessible for everyone, and one of the most striking cable-car rides in Norway. From Bjorli it’s a natural day trip by train along Raumabanen or by car down through Romsdalen.',
    intro3: 'Romsdalsgondolen is an external attraction and is not operated by Bjorli.',
    cards: [
      { title: 'Eggen Restaurant at the top', body: 'At the top you’ll find Eggen Restaurant — traditional Norwegian food with a modern touch, built on local produce, in a relaxed setting with the Romsdalen mountains as a backdrop.' },
      { title: 'Explore the summit', body: 'Gravelled paths and marked routes lead out to viewpoints and quiet resting spots in the mountains. Suitable for short walks as well as longer stays at the top.' },
      { title: 'Walk down via Rampestreken', body: 'For a different experience you can walk back down to Åndalsnes along a steep path with stone steps, past the well-known Rampestreken viewpoint.' },
      { title: 'Accessible for everyone', body: 'The cable-car ride itself is accessible for all, and works well for families, couples and groups looking for an easy way up into the Romsdalen mountains.' },
    ],
    figCaption: 'View from the summit area over Åndalsnes, the Rauma river and the Romsdalen mountains.',
    returnTitle: 'Return ticket',
    returnBody:
      'The return ticket includes both the ride up and the ride down, and suits anyone planning to take the cable car both ways. Once activated, the return leg must be used on the same day.',
    hoursTitle: 'Opening hours and tickets',
    hoursBody1: 'Season, opening hours and prices may change. Always check current opening hours directly with Romsdalsgondolen before you plan your trip:',
    hoursBody2: 'romsdalsgondolen.no',
    ctaPrimary: 'See opening hours and tickets at Romsdalsgondolen',
    ctaBack: 'Back to activities',
  },
  de: {
    metaTitle: 'Romsdalsgondolen als Tagesausflug ab Bjorli | Aussicht über Romsdalen',
    metaDesc:
      'Romsdalsgondolen bringt Sie von Åndalsnes hinauf zum Nesaksla mit Blick über Romsdalen. Ein naheliegender Tagesausflug ab Bjorli. Öffnungszeiten und Tickets bei Romsdalsgondolen prüfen.',
    heroTitle: 'Romsdalsgondolen',
    heroSubtitle: 'Tagesausflug von Bjorli nach Åndalsnes — mit der Gondel hinauf zur weiten Aussicht über Romsdalen.',
    intro1:
      'Erleben Sie die wilde norwegische Natur und genießen Sie einen weiten Blick über Åndalsnes, die grünen Talseiten, die smaragdgrüne Rauma und markante Gipfel wie Romsdalshorn und Vengetindene.',
    intro2:
      'Romsdalsgondolen bringt Sie in wenigen Minuten vom Zentrum von Åndalsnes hinauf zum Nesaksla — barrierearm und eine der eindrucksvollsten Gondelfahrten Norwegens. Von Bjorli aus ist es ein passender Tagesausflug mit dem Zug entlang der Raumabahn oder mit dem Auto durch Romsdalen.',
    intro3: 'Romsdalsgondolen ist ein externes Angebot und wird nicht von Bjorli betrieben.',
    cards: [
      { title: 'Eggen Restaurant am Gipfel', body: 'Am Gipfel erwartet Sie das Eggen Restaurant — traditionelle norwegische Küche modern interpretiert, mit lokalen Zutaten, in entspannter Atmosphäre und den Bergen Romsdalens als Kulisse.' },
      { title: 'Das Gipfelplateau erkunden', body: 'Geschotterte Wege und markierte Routen führen zu Aussichtspunkten und ruhigen Rastplätzen in den Bergen. Geeignet für kurze Spaziergänge wie für längere Aufenthalte am Gipfel.' },
      { title: 'Abstieg über Rampestreken', body: 'Für ein anderes Erlebnis können Sie zu Fuß nach Åndalsnes hinabsteigen — über einen steilen Pfad mit Steinstufen, vorbei am bekannten Aussichtspunkt Rampestreken.' },
      { title: 'Für alle zugänglich', body: 'Die Gondelfahrt selbst ist barrierearm und eignet sich gut für Familien, Paare und Gruppen, die unkompliziert hoch in die Berge Romsdalens möchten.' },
    ],
    figCaption: 'Blick vom Gipfelplateau auf Åndalsnes, die Rauma und die Berge Romsdalens.',
    returnTitle: 'Hin- und Rückfahrt',
    returnBody:
      'Die Hin- und Rückfahrkarte umfasst Auf- und Abfahrt mit der Gondel und eignet sich, wenn Sie in beide Richtungen fahren möchten. Nach Aktivierung muss die Rückfahrt am selben Tag genutzt werden.',
    hoursTitle: 'Öffnungszeiten und Tickets',
    hoursBody1: 'Saison, Öffnungszeiten und Preise können sich ändern. Bitte prüfen Sie aktuelle Öffnungszeiten direkt bei Romsdalsgondolen, bevor Sie Ihre Tour planen:',
    hoursBody2: 'romsdalsgondolen.no',
    ctaPrimary: 'Öffnungszeiten und Tickets bei Romsdalsgondolen ansehen',
    ctaBack: 'Zurück zu den Aktivitäten',
  },
  nl: {
    metaTitle: 'Romsdalsgondolen als dagtrip vanuit Bjorli | Uitzicht over Romsdalen',
    metaDesc:
      'Romsdalsgondolen brengt je vanuit Åndalsnes omhoog naar Nesaksla met uitzicht over Romsdalen. Een logische dagtrip vanuit Bjorli. Bekijk openingstijden en tickets bij Romsdalsgondolen.',
    heroTitle: 'Romsdalsgondolen',
    heroSubtitle: 'Dagtrip vanuit Bjorli naar Åndalsnes — met de kabelbaan omhoog naar weids uitzicht over Romsdalen.',
    intro1:
      'Beleef de ruige Noorse natuur en geniet van een weids uitzicht over Åndalsnes, groene dalwanden, de smaragdgroene Rauma en bekende toppen als Romsdalshorn en Vengetindene.',
    intro2:
      'Romsdalsgondolen brengt je in een paar minuten van het centrum van Åndalsnes omhoog naar Nesaksla — toegankelijk voor iedereen en een van de meest indrukwekkende kabelbanen van Noorwegen. Vanuit Bjorli is het een logische dagtrip met de trein langs de Raumabanen of met de auto door Romsdalen.',
    intro3: 'Romsdalsgondolen is een externe attractie en wordt niet beheerd door Bjorli.',
    cards: [
      { title: 'Eggen Restaurant op de top', body: 'Op de top vind je Eggen Restaurant — traditionele Noorse keuken met een moderne twist, op basis van lokale producten, in een ontspannen sfeer met de bergen van Romsdalen als achtergrond.' },
      { title: 'Verken de top', body: 'Verharde paden en gemarkeerde routes leiden naar uitzichtpunten en rustige plekken in de bergen. Geschikt voor korte wandelingen en langere stops op de top.' },
      { title: 'Afdalen via Rampestreken', body: 'Wil je iets anders, dan kun je via een stevig pad met stenen trappen terug naar Åndalsnes lopen, langs het bekende uitzichtpunt Rampestreken.' },
      { title: 'Voor iedereen toegankelijk', body: 'De kabelbaanrit zelf is voor iedereen toegankelijk en is een eenvoudige manier voor families, stellen en groepen om hoog de bergen van Romsdalen in te komen.' },
    ],
    figCaption: 'Uitzicht vanaf de top over Åndalsnes, de Rauma en de bergen van Romsdalen.',
    returnTitle: 'Retourticket',
    returnBody:
      'Het retourticket geldt voor zowel omhoog als omlaag en past bij iedereen die de kabelbaan in beide richtingen wil nemen. Eenmaal geactiveerd moet de retour op dezelfde dag worden gebruikt.',
    hoursTitle: 'Openingstijden en tickets',
    hoursBody1: 'Seizoen, openingstijden en prijzen kunnen veranderen. Controleer actuele openingstijden altijd rechtstreeks bij Romsdalsgondolen voordat je je dag plant:',
    hoursBody2: 'romsdalsgondolen.no',
    ctaPrimary: 'Bekijk openingstijden en tickets bij Romsdalsgondolen',
    ctaBack: 'Terug naar activiteiten',
  },
  da: {
    metaTitle: 'Romsdalsgondolen som dagstur fra Bjorli | Udsigt over Romsdalen',
    metaDesc:
      'Romsdalsgondolen tager dig fra Åndalsnes op til Nesaksla med udsigt over Romsdalen. En naturlig dagstur fra Bjorli. Tjek åbningstider og billetter hos Romsdalsgondolen.',
    heroTitle: 'Romsdalsgondolen',
    heroSubtitle: 'Dagstur fra Bjorli til Åndalsnes — op med gondolen til vid udsigt over Romsdalen.',
    intro1:
      'Oplev den vilde norske natur og få en helt særlig udsigt over Åndalsnes, grønne dalsider, den smaragdgrønne Rauma og ikoniske fjelde som Romsdalshorn og Vengetindene.',
    intro2:
      'Romsdalsgondolen bringer dig fra Åndalsnes centrum op til Nesaksla på få minutter — tilgængelig for alle og en af de mest spektakulære gondolture i Norge. Fra Bjorli er det en naturlig dagstur med tog langs Raumabanen eller bil ned gennem Romsdalen.',
    intro3: 'Romsdalsgondolen er en ekstern oplevelse og drives ikke af Bjorli.',
    cards: [
      { title: 'Eggen Restaurant på toppen', body: 'På toppen finder du Eggen Restaurant — traditionel norsk mad med et moderne twist, baseret på lokale råvarer, i en afslappet stemning med fjeldene i Romsdalen som baggrund.' },
      { title: 'Udforsk toppen', body: 'Grusede stier og afmærkede ruter fører ud til udsigtspunkter og rolige pauseplader i fjeldet. Egner sig både til korte spadsereture og længere ophold på toppen.' },
      { title: 'Gå ned via Rampestreken', body: 'Vil du have en anderledes oplevelse, kan du gå ned til Åndalsnes ad en stejl sti med stentrapper, forbi det kendte udsigtspunkt Rampestreken.' },
      { title: 'Tilgængelig for alle', body: 'Selve gondolturen er tilgængelig for alle og passer godt til familier, par og grupper, der ønsker en enkel måde at komme højt op i Romsdalsfjeldene.' },
    ],
    figCaption: 'Udsigt fra toppen over Åndalsnes, Rauma og Romsdalsfjeldene.',
    returnTitle: 'Tur-retur-billet',
    returnBody:
      'Tur-retur-billetten omfatter både op- og nedtur med gondolen og passer til dig, der planlægger at tage gondolen begge veje. Når billetten er aktiveret, skal returen bruges samme dag.',
    hoursTitle: 'Åbningstider og billetter',
    hoursBody1: 'Sæson, åbningstider og priser kan ændre sig. Tjek altid aktuelle åbningstider direkte hos Romsdalsgondolen, før du planlægger turen:',
    hoursBody2: 'romsdalsgondolen.no',
    ctaPrimary: 'Se åbningstider og billetter hos Romsdalsgondolen',
    ctaBack: 'Tilbage til aktiviteter',
  },
  sv: {
    metaTitle: 'Romsdalsgondolen som dagstur från Bjorli | Utsikt över Romsdalen',
    metaDesc:
      'Romsdalsgondolen tar dig från Åndalsnes upp till Nesaksla med utsikt över Romsdalen. En naturlig dagstur från Bjorli. Kolla öppettider och biljetter hos Romsdalsgondolen.',
    heroTitle: 'Romsdalsgondolen',
    heroSubtitle: 'Dagstur från Bjorli till Åndalsnes — upp med gondolen till vid utsikt över Romsdalen.',
    intro1:
      'Upplev den vilda norska naturen och få en vidsträckt utsikt över Åndalsnes, gröna dalsidor, den smaragdgröna Rauma och ikoniska fjäll som Romsdalshorn och Vengetindene.',
    intro2:
      'Romsdalsgondolen tar dig från Åndalsnes centrum upp till Nesaksla på några minuter — tillgänglig för alla och en av de mest spektakulära gondolturerna i Norge. Från Bjorli är det en naturlig dagstur med tåg längs Raumabanen eller bil ner genom Romsdalen.',
    intro3: 'Romsdalsgondolen är en extern upplevelse och drivs inte av Bjorli.',
    cards: [
      { title: 'Eggen Restaurant på toppen', body: 'På toppen hittar du Eggen Restaurant — traditionell norsk mat med modern touch, baserad på lokala råvaror, i en avslappnad miljö med Romsdalens fjäll som fond.' },
      { title: 'Utforska toppen', body: 'Grusade stigar och markerade leder leder ut till utsiktsplatser och lugna rastplatser i fjället. Passar både för korta promenader och längre stunder på toppen.' },
      { title: 'Gå ner via Rampestreken', body: 'Vill du ha en annorlunda upplevelse kan du gå ner till Åndalsnes längs en brant stig med stentrappor, förbi den kända utsikten Rampestreken.' },
      { title: 'Tillgänglig för alla', body: 'Själva gondolturen är tillgänglig för alla och passar familjer, par och grupper som vill komma högt upp i Romsdalsfjällen på ett enkelt sätt.' },
    ],
    figCaption: 'Utsikt från toppområdet över Åndalsnes, Rauma och Romsdalsfjällen.',
    returnTitle: 'Tur- och returbiljett',
    returnBody:
      'Tur- och returbiljetten inkluderar både upp- och nerfärd med gondolen och passar dig som planerar att åka gondolen i båda riktningarna. När biljetten är aktiverad måste returen användas samma dag.',
    hoursTitle: 'Öppettider och biljetter',
    hoursBody1: 'Säsong, öppettider och priser kan ändras. Kolla alltid aktuella öppettider direkt hos Romsdalsgondolen innan du planerar turen:',
    hoursBody2: 'romsdalsgondolen.no',
    ctaPrimary: 'Se öppettider och biljetter hos Romsdalsgondolen',
    ctaBack: 'Tillbaka till aktiviteter',
  },
};

const Romsdalsgondolen = () => {
  const t = usePageCopy(COPY);
  const lp = useLocalizedPath();

  useEffect(() => {
    document.title = t.metaTitle;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', t.metaDesc);
  }, [t.metaTitle, t.metaDesc]);

  const CardIcons = [Utensils, Mountain, Footprints, Accessibility];

  return (
    <div>
      <PageHero title={t.heroTitle} subtitle={t.heroSubtitle} image={gondolImg} />

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">{t.intro1}</p>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">{t.intro2}</p>
          <p className="text-base text-muted-foreground leading-relaxed mb-12">{t.intro3}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {t.cards.map((c, i) => {
              const Icon = CardIcons[i];
              return (
                <div key={c.title} className="rounded-2xl border border-border/70 bg-card p-6">
                  <Icon className="h-5 w-5 text-secondary mb-3" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                </div>
              );
            })}
          </div>

          <figure className="mb-12 rounded-2xl overflow-hidden border border-border/70">
            <img
              src={rampestrekenImg}
              alt={t.figCaption}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
            <figcaption className="px-4 py-3 text-xs text-muted-foreground bg-muted/30">
              {t.figCaption}
            </figcaption>
          </figure>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-6">
            <div className="flex items-start gap-3">
              <Ticket className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">{t.returnTitle}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.returnBody}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">{t.hoursTitle}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t.hoursBody1}{' '}
                  <a
                    href={EXTERNAL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline-offset-2 hover:underline"
                  >
                    {t.hoursBody2}
                  </a>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={EXTERNAL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                <Mountain className="mr-2 h-5 w-5" />
                {t.ctaPrimary}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link to={lp('/aktiviteter')}>
              <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">
                {t.ctaBack}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Romsdalsgondolen;
