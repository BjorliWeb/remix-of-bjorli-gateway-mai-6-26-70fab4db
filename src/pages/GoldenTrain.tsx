import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Train, Info, MapPin, CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { images } from '@/lib/images';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

const EXTERNAL = 'https://book.thegoldentrain.com/en/to-do/2822206/the-golden-train-roundtrip/showdetails';

type Copy = {
  metaTitle: string;
  metaDesc: string;
  heroTitle: string;
  heroSubtitle: string;
  intro1: React.ReactNode;
  intro2: React.ReactNode;
  departuresTitle: string;
  departuresBody: string;
  includedTitle: string;
  includedItems: string[];
  baseTitle: string;
  baseBody: string;
  ctaPrimary: string;
  ctaBack: string;
};

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', Copy> = {
  no: {
    metaTitle: 'The Golden Train fra Bjorli | Naturskjønn togtur på Raumabanen',
    metaDesc:
      'The Golden Train er en guidet rundtur på Raumabanen fra Åndalsnes — forbi Trollveggen, Kyllingbrua og Vermafossen, med kort stopp på Bjorli.',
    heroTitle: 'The Golden Train',
    heroSubtitle:
      'Guidet rundtur på Raumabanen fra Åndalsnes — kåret to ganger av Lonely Planet til Europas mest naturskjønne togtur.',
    intro1: (
      <>
        Turen starter på <strong>Åndalsnes stasjon</strong>, hvor en togvert tar imot deg om bord på The Golden Train. Toget kjører i rolig tempo gjennom dramatiske dalfører, langs elver og fossefall, og forbi den loddrette Trollveggen, den elegante Kyllingbrua og Vermafossen.
      </>
    ),
    intro2: (
      <>
        Underveis får du fortellinger om livet langs Raumabanen og banens rolle under andre verdenskrig — blant annet de hemmelige gulltransportene som har gitt toget navnet sitt. Toget gjør et kort stopp på <strong>Bjorli stasjon</strong>, hvor du kan strekke på beina og puste inn fjelluft før turen går tilbake til Åndalsnes.
      </>
    ),
    departuresTitle: 'Avganger og billetter',
    departuresBody:
      'Alle avganger starter og slutter på Åndalsnes togstasjon. Sjekk oppdaterte tider og billetter hos The Golden Train før du planlegger turen.',
    includedTitle: 'Inkludert',
    includedItems: [
      'Tur-retur-billett Åndalsnes – Bjorli – Åndalsnes',
      'Engelsktalende guide om bord',
    ],
    baseTitle: 'Bjorli som base',
    baseBody:
      'Bor du på Bjorli kan du ta ordinært tog ned til Åndalsnes om morgenen, gå om bord på The Golden Train derfra, og være tilbake samme dag. Sjekk alltid oppdaterte tider, priser og tilgjengelighet direkte hos arrangøren.',
    ctaPrimary: 'Se tider og billetter hos The Golden Train',
    ctaBack: 'Tilbake til aktiviteter',
  },
  en: {
    metaTitle: 'The Golden Train from Bjorli | Scenic railway on the Rauma Line',
    metaDesc:
      'The Golden Train is a guided round trip on the Rauma Line from Åndalsnes — past Trollveggen, Kyllingbrua and Vermafossen, with a short stop at Bjorli.',
    heroTitle: 'The Golden Train',
    heroSubtitle:
      'A guided round trip on the Rauma Line from Åndalsnes — twice named by Lonely Planet as one of Europe’s most scenic train journeys.',
    intro1: (
      <>
        The trip starts at <strong>Åndalsnes station</strong>, where an on-board host welcomes you to The Golden Train. The train moves at an unhurried pace through deep valleys, alongside rivers and waterfalls, past the sheer face of Trollveggen, the elegant Kyllingbrua bridge and Vermafossen.
      </>
    ),
    intro2: (
      <>
        Along the way you’ll hear stories from life along Raumabanen and the line’s role during the Second World War — including the secret gold transports that gave the train its name. The train makes a short stop at <strong>Bjorli station</strong>, where you can stretch your legs and breathe in mountain air before heading back to Åndalsnes.
      </>
    ),
    departuresTitle: 'Departures and tickets',
    departuresBody:
      'All departures start and end at Åndalsnes train station. Check current times and tickets with The Golden Train before you plan your trip.',
    includedTitle: 'Included',
    includedItems: [
      'Return ticket Åndalsnes – Bjorli – Åndalsnes',
      'English-speaking guide on board',
    ],
    baseTitle: 'Bjorli as your base',
    baseBody:
      'If you’re staying at Bjorli, take a regular train down to Åndalsnes in the morning, board The Golden Train there and return the same day. Always check current times, prices and availability directly with the operator.',
    ctaPrimary: 'See times and tickets at The Golden Train',
    ctaBack: 'Back to activities',
  },
  de: {
    metaTitle: 'The Golden Train ab Bjorli | Landschaftliche Bahnfahrt auf der Raumabahn',
    metaDesc:
      'The Golden Train ist eine geführte Rundfahrt auf der Raumabahn ab Åndalsnes — vorbei an Trollveggen, Kyllingbrua und Vermafossen, mit kurzem Halt in Bjorli.',
    heroTitle: 'The Golden Train',
    heroSubtitle:
      'Geführte Rundfahrt auf der Raumabahn ab Åndalsnes — von Lonely Planet zweimal zu einer der landschaftlich schönsten Zugfahrten Europas gewählt.',
    intro1: (
      <>
        Die Fahrt beginnt am <strong>Bahnhof Åndalsnes</strong>, wo Sie ein Zugbegleiter an Bord von The Golden Train empfängt. Der Zug rollt gemächlich durch tiefe Täler, an Flüssen und Wasserfällen vorbei, an der senkrechten Trollveggen, der eleganten Kyllingbrua und am Vermafossen.
      </>
    ),
    intro2: (
      <>
        Unterwegs hören Sie Geschichten aus dem Leben entlang der Raumabahn und über ihre Rolle im Zweiten Weltkrieg — darunter die geheimen Goldtransporte, die dem Zug seinen Namen gegeben haben. Am <strong>Bahnhof Bjorli</strong> legt der Zug einen kurzen Halt ein, sodass Sie die Beine vertreten und die Bergluft genießen können, bevor es zurück nach Åndalsnes geht.
      </>
    ),
    departuresTitle: 'Abfahrten und Tickets',
    departuresBody:
      'Alle Fahrten beginnen und enden am Bahnhof Åndalsnes. Aktuelle Zeiten und Tickets finden Sie direkt bei The Golden Train.',
    includedTitle: 'Inklusive',
    includedItems: [
      'Hin- und Rückfahrkarte Åndalsnes – Bjorli – Åndalsnes',
      'Englischsprachiger Guide an Bord',
    ],
    baseTitle: 'Bjorli als Ausgangspunkt',
    baseBody:
      'Wer in Bjorli übernachtet, fährt am Morgen mit einem regulären Zug nach Åndalsnes hinunter, steigt dort in The Golden Train um und ist am selben Tag wieder zurück. Bitte prüfen Sie Zeiten, Preise und Verfügbarkeit immer direkt beim Anbieter.',
    ctaPrimary: 'Zeiten und Tickets bei The Golden Train ansehen',
    ctaBack: 'Zurück zu den Aktivitäten',
  },
  nl: {
    metaTitle: 'The Golden Train vanuit Bjorli | Schilderachtige treinreis op de Raumabanen',
    metaDesc:
      'The Golden Train is een begeleide rondreis op de Raumabanen vanaf Åndalsnes — langs Trollveggen, Kyllingbrua en Vermafossen, met een korte stop in Bjorli.',
    heroTitle: 'The Golden Train',
    heroSubtitle:
      'Begeleide rondreis op de Raumabanen vanaf Åndalsnes — twee keer door Lonely Planet uitgeroepen tot een van de mooiste treinreizen van Europa.',
    intro1: (
      <>
        De reis begint op <strong>station Åndalsnes</strong>, waar een treinhost je welkom heet aan boord van The Golden Train. De trein rijdt in een rustig tempo door diepe dalen, langs rivieren en watervallen, voorbij de loodrechte Trollveggen, de sierlijke Kyllingbrua en Vermafossen.
      </>
    ),
    intro2: (
      <>
        Onderweg hoor je verhalen over het leven langs Raumabanen en de rol van de spoorlijn in de Tweede Wereldoorlog — waaronder de geheime goudtransporten waar de trein zijn naam aan dankt. De trein stopt kort op <strong>station Bjorli</strong>, waar je de benen kunt strekken en de berglucht kunt opsnuiven voordat het terug gaat naar Åndalsnes.
      </>
    ),
    departuresTitle: 'Vertrektijden en tickets',
    departuresBody:
      'Alle ritten beginnen en eindigen op station Åndalsnes. Bekijk actuele tijden en tickets bij The Golden Train voordat je je dag plant.',
    includedTitle: 'Inbegrepen',
    includedItems: [
      'Retourticket Åndalsnes – Bjorli – Åndalsnes',
      'Engelstalige gids aan boord',
    ],
    baseTitle: 'Bjorli als uitvalsbasis',
    baseBody:
      'Verblijf je in Bjorli, dan kun je ’s ochtends met een reguliere trein naar Åndalsnes, daar instappen op The Golden Train en dezelfde dag terug zijn. Controleer tijden, prijzen en beschikbaarheid altijd rechtstreeks bij de organisator.',
    ctaPrimary: 'Bekijk tijden en tickets bij The Golden Train',
    ctaBack: 'Terug naar activiteiten',
  },
  da: {
    metaTitle: 'The Golden Train fra Bjorli | Naturskøn togtur på Raumabanen',
    metaDesc:
      'The Golden Train er en guidet rundtur på Raumabanen fra Åndalsnes — forbi Trollveggen, Kyllingbrua og Vermafossen, med et kort stop på Bjorli.',
    heroTitle: 'The Golden Train',
    heroSubtitle:
      'Guidet rundtur på Raumabanen fra Åndalsnes — to gange kåret af Lonely Planet som en af Europas smukkeste togture.',
    intro1: (
      <>
        Turen starter på <strong>Åndalsnes station</strong>, hvor en togvært tager imod dig om bord på The Golden Train. Toget kører i roligt tempo gennem dramatiske dalstrøg, langs elve og vandfald, og forbi den lodrette Trollveggen, den elegante Kyllingbrua og Vermafossen.
      </>
    ),
    intro2: (
      <>
        Undervejs hører du fortællinger om livet langs Raumabanen og banens rolle under Anden Verdenskrig — blandt andet de hemmelige guldtransporter, som har givet toget sit navn. Toget holder kort på <strong>Bjorli station</strong>, hvor du kan strække benene og trække bjergluften, før turen går tilbage til Åndalsnes.
      </>
    ),
    departuresTitle: 'Afgange og billetter',
    departuresBody:
      'Alle afgange starter og slutter på Åndalsnes station. Tjek aktuelle tider og billetter hos The Golden Train, før du planlægger turen.',
    includedTitle: 'Inkluderet',
    includedItems: [
      'Returbillet Åndalsnes – Bjorli – Åndalsnes',
      'Engelsktalende guide om bord',
    ],
    baseTitle: 'Bjorli som base',
    baseBody:
      'Bor du på Bjorli, kan du tage et almindeligt tog ned til Åndalsnes om morgenen, stige om bord på The Golden Train derfra og være tilbage samme dag. Tjek altid aktuelle tider, priser og tilgængelighed direkte hos arrangøren.',
    ctaPrimary: 'Se tider og billetter hos The Golden Train',
    ctaBack: 'Tilbage til aktiviteter',
  },
  sv: {
    metaTitle: 'The Golden Train från Bjorli | Naturskön tågtur på Raumabanen',
    metaDesc:
      'The Golden Train är en guidad rundtur på Raumabanen från Åndalsnes — förbi Trollveggen, Kyllingbrua och Vermafossen, med ett kort stopp i Bjorli.',
    heroTitle: 'The Golden Train',
    heroSubtitle:
      'Guidad rundtur på Raumabanen från Åndalsnes — två gånger utsedd av Lonely Planet till en av Europas vackraste tågresor.',
    intro1: (
      <>
        Resan börjar på <strong>Åndalsnes station</strong>, där en tågvärd tar emot dig ombord på The Golden Train. Tåget rullar i lugnt tempo genom dramatiska dalgångar, längs älvar och vattenfall, och förbi den lodräta Trollveggen, den eleganta Kyllingbrua och Vermafossen.
      </>
    ),
    intro2: (
      <>
        Längs vägen får du höra berättelser om livet längs Raumabanen och banans roll under andra världskriget — bland annat de hemliga guldtransporter som gett tåget sitt namn. Tåget gör ett kort stopp vid <strong>Bjorli station</strong>, där du kan sträcka på benen och andas in fjälluften innan turen går tillbaka till Åndalsnes.
      </>
    ),
    departuresTitle: 'Avgångar och biljetter',
    departuresBody:
      'Alla avgångar börjar och slutar vid Åndalsnes station. Kolla aktuella tider och biljetter hos The Golden Train innan du planerar resan.',
    includedTitle: 'Ingår',
    includedItems: [
      'Tur- och returbiljett Åndalsnes – Bjorli – Åndalsnes',
      'Engelsktalande guide ombord',
    ],
    baseTitle: 'Bjorli som bas',
    baseBody:
      'Bor du på Bjorli kan du ta ett vanligt tåg ner till Åndalsnes på morgonen, stiga ombord på The Golden Train där och vara tillbaka samma dag. Kolla alltid aktuella tider, priser och tillgänglighet direkt hos arrangören.',
    ctaPrimary: 'Se tider och biljetter hos The Golden Train',
    ctaBack: 'Tillbaka till aktiviteter',
  },
};

const GoldenTrain = () => {
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

  return (
    <div>
      <PageHero title={t.heroTitle} subtitle={t.heroSubtitle} image={images.tipTrain.src} />

      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">{t.intro1}</p>
          <p className="text-base text-muted-foreground leading-relaxed mb-10">{t.intro2}</p>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">{t.departuresTitle}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.departuresBody}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <h2 className="font-display text-xl font-bold text-foreground mb-4">{t.includedTitle}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {t.includedItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/30 p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">{t.baseTitle}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.baseBody}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={EXTERNAL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                <Train className="mr-2 h-5 w-5" />
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

export default GoldenTrain;
