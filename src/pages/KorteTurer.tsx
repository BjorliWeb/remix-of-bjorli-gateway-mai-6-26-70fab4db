import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChevronRight, MapPin, TrendingUp, Train, Camera,
  Eye, Users, ExternalLink, Download, Mountain, TreePine, Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';

// ── Source assets ─────────────────────────────────────────────────────
// All map cutouts and brochure photos extracted directly from
// "Snarturer i Rauma og Lesja" (nordveggen.no, 2023). Each map cutout
// is the EXACT crop from the brochure for that specific walk — no
// redrawn maps, no AI maps, no decorative substitutes.
import heroImg from '@/assets/photos/snartur/photo-tussheim-hut.jpg';
import mapTussheimbue            from '@/assets/photos/snartur/map-tussheimbue.jpg';
import mapSveavarden             from '@/assets/photos/snartur/map-sveavarden.jpg';
import mapLesjaverk              from '@/assets/photos/snartur/map-lesjaverk.jpg';
import mapKulturminnerLesjaskog  from '@/assets/photos/snartur/map-kulturminner-lesjaskog.jpg';
import mapRanakollen             from '@/assets/photos/snartur/map-ranakollen.jpg';
import mapKyllingbrua            from '@/assets/photos/snartur/map-kyllingbrua.jpg';
import mapEventurskogen          from '@/assets/photos/snartur/map-eventurskogen.jpg';
import mapTrollstigfoten         from '@/assets/photos/snartur/map-trollstigfoten.jpg';
import mapTrollstigenUtkikk      from '@/assets/photos/snartur/map-trollstigen-utkikkspunkt.jpg';
import mapLitlefjellet           from '@/assets/photos/snartur/map-litlefjellet.jpg';
import photoTussheimHut          from '@/assets/photos/snartur/photo-tussheim-hut.jpg';
import photoLesjaskogsvatnet     from '@/assets/photos/snartur/photo-lesjaskogsvatnet.jpg';
import photoKyllingbrua          from '@/assets/photos/snartur/photo-kyllingbrua.jpg';
import photoEventurskogen        from '@/assets/photos/snartur/photo-eventurskogen.jpg';
import photoTrollstigfoten       from '@/assets/photos/snartur/photo-trollstigfoten.jpg';
import photoTrollstigenViewpoint from '@/assets/photos/snartur/photo-trollstigen-viewpoint.jpg';
import photoLitlefjellet         from '@/assets/photos/snartur/photo-litlefjellet.jpg';

interface Walk {
  id: string;
  name: string;
  area: string;
  distance: string;
  elevation?: string;
  teaser: string;
  description: string;
  parking: string;
  tags: string[];
  map: { src: string; alt: string };
  photo?: { src: string; alt: string };
}

const WALKS: Walk[] = [
  {
    id: 'tussheimbue',
    name: 'Tussheimbue',
    area: 'Lesja',
    distance: '6,6 km',
    elevation: '450 hm',
    teaser: 'Dagsturhytte med vidstrakt utsikt over kulturlandskapet i Lesja og Reinheimen nasjonalpark.',
    description: 'En stilfull dagsturhytte venter på toppen, med utsyn over dalen og fjellene i Reinheimen. Stien er godt tilrettelagt og merket hele veien opp. Underveis finner du infotavler om landskap og kulturhistorie, og ved hytta står benker og kikkert klare for en lang pause.',
    parking: 'Start i Lesja sentrum. Følg tilrettelagt sti gjennom jernbaneundergangen.',
    tags: ['utsikt', 'dagsturhytte', 'togvennlig'],
    map:   { src: mapTussheimbue,   alt: 'Brosjyrekart for Tussheimbue: rute fra Lesja sentrum opp til dagsturhytta, med parkering og merket sti markert.' },
    photo: { src: photoTussheimHut, alt: 'Dagsturhytta på Tussheim med utsikt over kulturlandskapet i Lesja og fjellene i Reinheimen nasjonalpark.' },
  },
  {
    id: 'sveavarden',
    name: 'Sveavarden',
    area: 'Lora',
    distance: '7,5 km',
    elevation: '455 hm',
    teaser: 'Tur gjennom furuskog til en varde over skoggrensen, med utsikt mot Lora og Lesjaskogsvatnet.',
    description: 'Stien tar deg jevnt oppover i fin furuskog før den åpner seg over skoggrensa. Varden står på en åpen rygg med vidt utsyn vestover mot Lesjaskogsvatnet. Godt merket hele veien.',
    parking: 'Parker på Lora stasjon. Følg merket sti gjennom jernbaneundergangen.',
    tags: ['utsikt', 'skogstur', 'togvennlig'],
    map: { src: mapSveavarden, alt: 'Brosjyrekart for Sveavarden: rute fra Lora stasjon opp gjennom furuskogen til varden, med parkering og merket sti.' },
  },
  {
    id: 'lesjaverk',
    name: 'Lesjaverk',
    area: 'Lesjaverk',
    distance: '1,5 km',
    teaser: 'Lett tur fra Lesjaverk stasjon mot Lesjaskogsvatnet og kulturstien ved det gamle jernverket.',
    description: 'En enkel tur som passer for alle. Veien tar deg over jernbanen og ned mot Lesjaskogsvatnet, der det er tilrettelagt badeplass. Rundt vannet ligger kulturminner etter det gamle jernverket på Lesjaverk, med mulighet for rundtur på merket sti.',
    parking: 'Start ved Lesjaverk stasjon. Parkering på stasjonen.',
    tags: ['lett tur', 'kultur', 'badeplass', 'togvennlig'],
    map:   { src: mapLesjaverk,          alt: 'Brosjyrekart for Lesjaverk: rute fra Lesjaverk stasjon ned til Lesjaskogsvatnet, med parkering og merket sti markert.' },
    photo: { src: photoLesjaskogsvatnet, alt: 'Lesjaskogsvatnet en sommerdag — rolig fjellvann ved det gamle jernverket på Lesjaverk.' },
  },
  {
    id: 'kulturminner-lesjaskog',
    name: 'Kulturminner ved Lesjaskog',
    area: 'Lesjaskog',
    distance: '1 km',
    teaser: 'Kort kulturvandring ved Lesjaskog kyrkje, med historiske bygg, krigsminner og spor etter tidligere jernverk.',
    description: 'En liten rundtur i bygda, der QR-koder underveis lar deg lese mer om hver post. Et fint stopp for familier som vil ha en kort, rolig pause med litt historie.',
    parking: 'Parker ved Bunnpris Lesjaskog og følg veien bort til kulturminneområdet.',
    tags: ['kultur', 'familievennlig', 'kort tur'],
    map: { src: mapKulturminnerLesjaskog, alt: 'Brosjyrekart for kulturminner ved Lesjaskog: rute rundt Lesjaskog kyrkje, med parkering og informasjonspunkter.' },
  },
  {
    id: 'ranakollen',
    name: 'Rånåkollen',
    area: 'Rånå',
    distance: '4,5 km',
    elevation: '450 hm',
    teaser: 'Kort, men bratt tur til dagsturhytta på Rånåkollen, med utsyn over dalen og inn i høyfjellet.',
    description: 'En rask tur opp som gir mye igjen for innsatsen. Stien er godt merket og fører til en åpen dagsturhytte på toppen, med fritt utsyn over dalen og videre inn mot fjellene. Stien går tett ved gårder — vis hensyn til folk og dyr.',
    parking: 'Merket parkering ved Rånåvegen.',
    tags: ['utsikt', 'dagsturhytte', 'bratt'],
    map: { src: mapRanakollen, alt: 'Brosjyrekart for Rånåkollen: rute fra parkering ved Rånåvegen opp til dagsturhytta, med merket sti og utkikkspunkt.' },
  },
  {
    id: 'kyllingbrua',
    name: 'Kyllingbrua',
    area: 'Verma',
    distance: '0,6 km',
    teaser: 'Kort tur til fotopunkt under Kyllingbrua, et av de mest kjente landemerkene langs Raumabanen.',
    description: 'En av de korteste turene i heftet, men også en av de mest fotograferte. Stien tar deg ned til Rauma elv, med to flotte fotopunkt og informasjonstavler om brua og Raumabanen.',
    parking: 'Parker ved nærbutikken på Verma. Kryss bilveien og følg grussti ned mot elva.',
    tags: ['kort tur', 'fotopunkt', 'tog', 'kultur'],
    map:   { src: mapKyllingbrua,   alt: 'Brosjyrekart for Kyllingbrua: rute fra Verma ned til fotopunkt under brua, med parkering og merket sti.' },
    photo: { src: photoKyllingbrua, alt: 'Tog krysser Kyllingbrua — den kjente steinbuen langs Raumabanen, sett fra fotopunktet under brua.' },
  },
  {
    id: 'eventurskogen',
    name: 'EvenTURskogen',
    area: 'Åndalsnes',
    distance: '3,6 km',
    elevation: '450 hm',
    teaser: 'Familievennlig skattejakt fra Norsk Tindesenter, med kart, nøkkel og oppgaver for barna.',
    description: 'En tur lagd for de yngste. Du starter med billett og film på Norsk Tindesenter og får kart og nøkkel til å låse opp kister i skogen. Alle som løser oppgavene får medalje på slutten.',
    parking: 'Start ved Norsk Tindesenter i Åndalsnes. Billett må løses ved start.',
    tags: ['familievennlig', 'barn', 'aktivitet'],
    map:   { src: mapEventurskogen,   alt: 'Brosjyrekart for EvenTURskogen: rute fra Åndalsnes mot Isfjorden, med parkering, fotopunkt og merket sti.' },
    photo: { src: photoEventurskogen, alt: 'Barn studerer en infotavle i EvenTURskogen — skattejakt for familier ved Norsk Tindesenter i Åndalsnes.' },
  },
  {
    id: 'trollstigfoten',
    name: 'Trollstigfoten',
    area: 'Trollstigen',
    distance: '2,1 km',
    teaser: 'Rundtur langs elva Istra gjennom frodig landskap under de mektige fjellene ved foten av Trollstigen.',
    description: 'En behagelig rundtur som følger Istra på begge sider. Stien krysser elva på bru ved bunnen av Trollstigveien og tar deg tilbake langs den historiske Kløvstien. Frodig vegetasjon, brusende elv og fjellene som reiser seg på alle kanter.',
    parking: 'Start på parkeringen ved Trollstigfoten. Følg skilt ned mot elva Istra.',
    tags: ['elv', 'fotopunkt', 'rundtur'],
    map:   { src: mapTrollstigfoten,   alt: 'Brosjyrekart for Trollstigfoten: rundtur langs elva Istra under Trollstigen, med parkering og merket sti.' },
    photo: { src: photoTrollstigfoten, alt: 'Foss som faller ned fjellsiden ved Trollstigfoten — frodig sommernatur ved foten av Trollstigen.' },
  },
  {
    id: 'trollstigen-utkikkspunkt',
    name: 'Trollstigen utkikkspunkt',
    area: 'Trollstigen',
    distance: '1,2 km',
    teaser: 'Enkel tur fra Trollstigen kafé til arkitektoniske utsiktspunkt over den berømte Trollstigen-veien.',
    description: 'En kort gangvei som tar deg ut til flere arkitektoniske utsiktspunkt. Den største plattformen stikker ut over fjellkanten og svever over svingene i Trollstigen. Delvis tilrettelagt for rullestol.',
    parking: 'Start ved Trollstigen kafé på toppen av Trollstigen.',
    tags: ['utsikt', 'kort tur', 'delvis tilrettelagt'],
    map:   { src: mapTrollstigenUtkikk,      alt: 'Brosjyrekart for Trollstigen utkikkspunkt: gangvei fra Trollstigen kafé ut til utsiktsplattformene, med parkering og utkikkspunkt.' },
    photo: { src: photoTrollstigenViewpoint, alt: 'Person fotograferer fra Trollstigen utkikkspunkt — utsyn ned over svingene i Trollstigveien.' },
  },
  {
    id: 'litlefjellet',
    name: 'Litlefjellet',
    area: 'Venjesdalen',
    distance: '1,6 km',
    elevation: '145 hm',
    teaser: 'Kort fjelltur med utsikt mot Trollveggen, Vengetindene, Romsdalshorn og Romsdalen.',
    description: 'En liten favoritt for både små og store. Stien er lett å følge oppover fjellsiden, og på toppen åpner landskapet seg mot Trollveggen, Vengetindene og Romsdalshornet. Litt kupert terreng, men kort.',
    parking: 'Parker ved foten av Litlefjellet i Venjesdalen.',
    tags: ['utsikt', 'familievennlig', 'fjelltur'],
    map:   { src: mapLitlefjellet,   alt: 'Brosjyrekart for Litlefjellet: rute fra parkering i Venjesdalen opp til utkikkspunktet, med merket sti.' },
    photo: { src: photoLitlefjellet, alt: 'Familie på topptur på Litlefjellet med Romsdalshorn og Vengetindene i bakgrunnen.' },
  },
];

const TAG_TO_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'utsikt': Eye,
  'dagsturhytte': Mountain,
  'togvennlig': Train,
  'tog': Train,
  'fotopunkt': Camera,
  'kultur': TreePine,
  'familievennlig': Users,
  'barn': Users,
  'lett tur': MapPin,
  'kort tur': MapPin,
  'badeplass': MapPin,
  'aktivitet': MapPin,
  'bratt': TrendingUp,
  'fjelltur': Mountain,
  'rundtur': MapPin,
  'skogstur': TreePine,
  'elv': MapPin,
  'delvis tilrettelagt': Users,
};

const Tag = ({ label }: { label: string }) => {
  const Icon = TAG_TO_ICON[label] ?? MapPin;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground">
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

const Stat = ({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) => (
  <span className="inline-flex items-center gap-1.5 text-sm text-foreground/80">
    <Icon className="h-4 w-4 text-secondary" />
    {label}
  </span>
);

const FAQ_ITEMS = [
  {
    q: 'Hvilke korte turer rundt Bjorli passer for barn?',
    a: 'Lesjaverk er en lett tur ned til Lesjaskogsvatnet med badeplass. Kulturminner ved Lesjaskog er en kort kulturvandring som passer hele familien. EvenTURskogen i Åndalsnes er bygget rundt en skattejakt for barn, med kart, nøkkel og oppgaver underveis.',
  },
  {
    q: 'Hvilke turer har best utsikt?',
    a: 'Tussheimbue gir vidt utsyn over kulturlandskapet i Lesja og Reinheimen. Sveavarden ligger like over skoggrensa med utsikt vestover mot Lesjaskogsvatnet. Rånåkollen er kort og bratt, men gir godt utsyn over dalen. Litlefjellet i Venjesdalen åpner seg mot Trollveggen, Vengetindene og Romsdalshornet.',
  },
  {
    q: 'Kan noen av turene kombineres med Raumabanen?',
    a: 'Ja. Tussheimbue, Sveavarden og Lesjaverk starter i nærheten av togstopp i Lesja, og Kyllingbrua tar deg ned til et fotopunkt under selve jernbanebrua på Verma — et av de mest kjente landemerkene langs Raumabanen.',
  },
  {
    q: 'Hvilke turer passer som korte stopp langs E136?',
    a: 'Kyllingbrua (0,6 km) og Trollstigen utkikkspunkt (1,2 km) er de korteste og enkleste å stoppe ved. Kulturminner ved Lesjaskog (1 km) og Lesjaverk (1,5 km) ligger også rett ved hovedveien og passer godt som en pause underveis.',
  },
];

const KorteTurer = () => {
  const lp = useLocalizedPath();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Bjorli',  item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Sommer',  item: '/sommer' },
      { '@type': 'ListItem', position: 3, name: 'Korte turer rundt Bjorli', item: '/sommer/korte-turer' },
    ],
  };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Korte turer rundt Bjorli | Enkle fotturer i Lesja og Rauma';
    const setMeta = (sel: string, attr: string, key: string, val: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute('content', val);
      return el;
    };
    const m1 = setMeta('meta[name="description"]', 'name', 'description',
      'Finn korte turer rundt Bjorli, Lesja og Romsdalen. Utsiktspunkt, kulturminner, familievennlige turer og kart for enkle naturopplevelser nær E136 og Raumabanen.');
    const m2 = setMeta('meta[property="og:title"]', 'property', 'og:title', 'Korte turer rundt Bjorli');
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.text = JSON.stringify(faqJsonLd); document.head.appendChild(s1);
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.text = JSON.stringify(breadcrumbJsonLd); document.head.appendChild(s2);
    return () => { document.title = prevTitle; s1.remove(); s2.remove(); void m1; void m2; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Dagsturhytta på Tussheim med utsikt over Lesja en sommerdag — typisk snartur i fjellbygdene rundt Bjorli."
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-block text-primary-foreground/75 text-xs md:text-sm font-medium tracking-[0.22em] uppercase mb-8"
          >
            Sommer på Bjorli · Snartur
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-8 leading-[0.95] tracking-tight"
          >
            Korte turer rundt Bjorli
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-primary-foreground/85 text-lg md:text-2xl mb-12 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Fra Bjorli har du kort vei til utsiktspunkt, kulturminner, skogsstier, elver og små fjellturer i Lesja og Rauma.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap"
          >
            <a href="#turene">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                Se turene <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link to={lp('/reisen-hit')}>
              <Button variant="outline" size="lg" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground font-semibold w-full sm:w-auto">
                <Car className="mr-2 h-5 w-5" /> Planlegg reisen hit
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to={lp('/')} className="hover:text-secondary">Bjorli</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to={lp('/sommer')} className="hover:text-secondary">Sommer</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">Korte turer rundt Bjorli</li>
        </ol>
      </nav>

      {/* Intro */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl space-y-6 text-lg md:text-xl text-foreground/85 leading-relaxed">
          <p>
            Bjorli ligger midt mellom Lesja, Romsdalen og fjellområdene i Reinheimen. Herfra kan du velge korte turer med stor variasjon — utsiktspunkt, kulturminner, dagsturhytter, elver, skog og familievennlige stopp langs veien.
          </p>
          <p>
            Turene under er hentet fra brosjyren <em>«Snarturer i Rauma og Lesja»</em>, og er alle lett tilgjengelige fra E136. Flere kan kombineres med en togreise på Raumabanen, og noen ligger så nær veien at de fungerer som en kort pause på vei mot fjorden.
          </p>
          <p>
            Lengden er oppgitt tur-retur. Noen turer er svært enkle og passer for hele familien. Andre er korte, men bratte, og krever litt mer av beina. Sjekk gjerne vær og lokale anbefalinger før du går.
          </p>
        </div>
      </section>

      {/* Overview cards */}
      <section id="turene" className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <div className="text-secondary text-xs font-medium tracking-[0.22em] uppercase mb-4">10 snartur</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              Velg en tur
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WALKS.map((w) => (
              <a key={w.id} href={`#${w.id}`} className="group block">
                <article className="h-full flex flex-col rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-secondary/50 transition-colors">
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={w.photo?.src ?? w.map.src}
                      alt={w.photo?.alt ?? w.map.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="text-secondary text-[11px] font-medium tracking-[0.18em] uppercase mb-2">{w.area}</div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-3 leading-tight">{w.name}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                      <Stat icon={MapPin} label={w.distance} />
                      {w.elevation && <Stat icon={TrendingUp} label={w.elevation} />}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{w.teaser}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {w.tags.map((t) => <Tag key={t} label={t} />)}
                    </div>
                    <span className="inline-flex items-center gap-2 text-secondary text-xs font-medium tracking-[0.18em] uppercase mt-auto">
                      Les mer <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Detail sections — one per walk */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl space-y-20 md:space-y-28">
          {WALKS.map((w, i) => (
            <article key={w.id} id={w.id} className="scroll-mt-24">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="text-secondary text-[11px] font-medium tracking-[0.22em] uppercase mb-3">{w.area}</div>
                  <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-5 leading-[1.05] tracking-tight">{w.name}</h2>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                    <Stat icon={MapPin} label={`Tur-retur ${w.distance}`} />
                    {w.elevation && <Stat icon={TrendingUp} label={`Stigning ${w.elevation}`} />}
                  </div>
                  <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-5">{w.description}</p>
                  <div className="rounded-xl border border-border/60 bg-card/60 p-4 mb-6">
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-secondary mb-1.5">Start og parkering</div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{w.parking}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {w.tags.map((t) => <Tag key={t} label={t} />)}
                  </div>
                </div>
                <div className={`space-y-4 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {/* Brochure photo first when available */}
                  {w.photo && (
                    <figure className="rounded-2xl overflow-hidden bg-muted">
                      <img src={w.photo.src} alt={w.photo.alt} className="w-full h-auto object-cover" loading="lazy" />
                    </figure>
                  )}
                  {/* Map cutout — exact crop from the brochure */}
                  <figure className="rounded-2xl overflow-hidden bg-card border border-border/60 p-2">
                    <img src={w.map.src} alt={w.map.alt} className="w-full h-auto object-contain bg-white" loading="lazy" />
                    <figcaption className="text-[11px] text-muted-foreground px-2 py-2">
                      Kartutsnitt fra brosjyren «Snarturer i Rauma og Lesja» (Nordveggen)
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Velg tur etter dagsform */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="text-secondary text-xs font-medium tracking-[0.22em] uppercase mb-4">Plukk og miks</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              Velg tur etter dagsform
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { title: 'For familier',                   icon: Users,    walks: ['Lesjaverk', 'Kulturminner ved Lesjaskog', 'EvenTURskogen'] },
              { title: 'For utsikt',                     icon: Eye,      walks: ['Tussheimbue', 'Sveavarden', 'Rånåkollen', 'Litlefjellet'] },
              { title: 'For korte stopp langs veien',    icon: Car,      walks: ['Kyllingbrua', 'Trollstigen utkikkspunkt'] },
              { title: 'For tog og kultur',              icon: Train,    walks: ['Lesjaverk', 'Kyllingbrua', 'Tussheimbue', 'Sveavarden'] },
            ].map(({ title, icon: Icon, walks }) => (
              <div key={title} className="rounded-2xl border border-border/60 bg-card p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                </div>
                <ul className="space-y-2">
                  {walks.map((name) => {
                    const w = WALKS.find((x) => x.name === name);
                    return (
                      <li key={name}>
                        <a href={w ? `#${w.id}` : '#turene'} className="text-foreground/85 hover:text-secondary transition-colors inline-flex items-center gap-2">
                          <ArrowRight className="h-3.5 w-3.5" /> {name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bjorli som base */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-secondary text-xs font-medium tracking-[0.22em] uppercase mb-4">Basecamp</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
            Bjorli som base
          </h2>
          <p className="text-lg text-foreground/85 leading-relaxed mb-5">
            Bo på Bjorli og bruk dagene på små turer i nærområdet. Du kan ta en enkel kveldstur, stoppe ved et fotopunkt langs E136, kombinere turen med Raumabanen, eller bruke Bjorli som rolig base mellom fjell, dal og fjord.
          </p>
          <p className="text-lg text-foreground/85 leading-relaxed mb-8">
            I nærområdet har du Lesjaskogsvatnet, Reinheimen og Dovrefjell-Sunndalsfjella nasjonalparker, og turer ned mot Romsdalen og Trollstigen. Et naturlig utgangspunkt for korte snartur og lengre dagsturer.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={lp('/overnatting')}>
              <Button variant="outline" size="lg">Overnatting på Bjorli</Button>
            </Link>
            <Link to={lp('/mat-og-drikke')}>
              <Button variant="outline" size="lg">Mat og drikke</Button>
            </Link>
            <Link to={lp('/sommer')}>
              <Button variant="outline" size="lg">Sommeraktiviteter</Button>
            </Link>
            <Link to={lp('/reisen-hit')}>
              <Button variant="outline" size="lg">Reisen hit</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Husk på tur */}
      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">Husk på tur</h2>
          <ul className="space-y-3 text-foreground/85">
            {[
              'Ta med søppel hjem — også dopapir og våtservietter.',
              'Vis hensyn til ville dyr og beitedyr.',
              'Hold hunden i bånd der det er båndtvang.',
              'Bruk toalett der det finnes. Ellers: grav et hull på ca. 15 cm og dekk til etterpå.',
              'Sjekk vær, føre og lokale anbefalinger før turen.',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">Spørsmål og svar</h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((f) => (
              <details key={f.q} className="group rounded-xl border border-border bg-card/60 p-5 open:bg-card transition-colors">
                <summary className="cursor-pointer font-semibold list-none flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90 text-secondary" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
            Bo på Bjorli og oppdag korte turer i fjellbygdene rundt
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            Velg Bjorli som base, og fyll dagene med enkle turer, utsiktspunkt, kulturminner og små eventyr mellom fjell og fjord.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link to={lp('/overnatting')}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">Se overnatting</Button>
            </Link>
            <Link to={lp('/sommer')}>
              <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">Se sommeraktiviteter</Button>
            </Link>
            <Link to={lp('/reisen-hit')}>
              <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">Reisen hit</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Credit */}
      <section className="py-12 px-4 border-t border-border/60">
        <div className="container mx-auto max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-secondary mb-3">Kilde og kreditering</div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Turinspirasjon, kartutsnitt og bildemateriale er hentet fra brosjyren <em>«Snarturer i Rauma og Lesja»</em>.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Utgiver:{' '}
            <a href="https://nordveggen.no" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">nordveggen.no</a>
            {' · '}
            <a href="mailto:post@nordveggen.no" className="text-secondary hover:underline">post@nordveggen.no</a>
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://designmanual.norgesnasjonalparker.no/uploads/documents/Snartur_2023_web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-secondary hover:underline"
            >
              Original brosjyre <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="/Snartur_2023_web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" /> Last ned originalbrosjyren
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KorteTurer;