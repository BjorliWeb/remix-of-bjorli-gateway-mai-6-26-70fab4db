import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink, Fish, MapPin, Info } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { images } from '@/lib/images';

const META_TITLE = 'Fiske på Bjorli | Ørret, fjellfiske, fluefiske og laksefiske';
const META_DESC =
  'Opplev fiske på Bjorli og i Lesja med fjellvann, elver, fluefiskesoner, Lesjaskogsvatnet og laksefiske i Rauma. Finn fiskekort, soner og nyttige lenker.';

const INATUR_VANNSKILLET = 'https://www.inatur.no/fiske/50f405d8e4b0e07d03ec36f9';
const INATUR_SONE7 = 'https://www.inatur.no/fiske/5ec50b50dbe4590003613e7e';
const LESJA_FJELLSTYRE = 'https://www.lesja-fjellstyre.no/';
const ELVEGUIDEN_RAUMA = 'https://elveguiden.no/no/elv/rauma?tabType=findselection';

const ZONES = [
  {
    title: 'Lesjaskogsvatnet fiskeforening',
    text:
      'Gjelder Lesjaskogsvatnet, Lågen ned til den gamle sognegrensen, Rauma ned til fylkesgrensen og vann og elver innenfor Lesjaskog Heimrast.',
    cta: 'Fiske på vannskillet',
    href: INATUR_VANNSKILLET,
  },
  {
    title: 'Lesja fjellstyre',
    text:
      'Lordalen statsallmenning og Dalsida statsallmenning har store fjellområder med mange fiskevann, elver og bekker.',
    cta: 'Les mer hos Lesja fjellstyre',
    href: LESJA_FJELLSTYRE,
  },
  {
    title: 'A/L Lågen fiskeelv',
    text:
      'Gjelder Lågen i Lesja kommune, sone 7, til utløp av Skråkka, samt nedre del av Lora elv.',
    cta: 'Se fiskekort sone 7',
    href: INATUR_SONE7,
  },
];

const FAQ = [
  {
    q: 'Hvor kjøper jeg fiskekort på Bjorli?',
    a: 'Fiskekort kan kjøpes lokalt i Lesja og Bjorli på følgende steder: Coop Marked Lesjaverk, Aaheim Camping, Lesjaskogvatnet Camping, Bunnpris Lesjaskog, og Bjorli Bensin/YX. Barn opp til og med fylte 16 år fisker gratis med stang. Samt via iNatur-lenkene på denne siden.',
  },
  {
    q: 'Kan jeg fiske i Lesjaskogsvatnet?',
    a: 'Ja, utenbygdsboende kan fiske med stang på Lesjaskogsvatnet, Fremre Bøvervatn og Bøvertjønnene. Oter krever fiskekort som inkluderer dette.',
  },
  {
    q: 'Finnes det fluefiske på Bjorli?',
    a: 'Ja, i Gudbrandsdalslågen i Lesja finnes to fluefiskesoner med totalt ca. 6 km.',
  },
  {
    q: 'Hvor finner jeg laksefiske nær Bjorli?',
    a: 'Laksefiske finnes i Rauma. Fisket formidles av grunneierne via Elveguiden.',
  },
];

const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const Fiske = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = META_TITLE;
    setMeta('description', META_DESC);
    setMeta('og:title', META_TITLE, 'property');
    setMeta('og:description', META_DESC, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', '/fiske', 'property');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: 'Fiske på Bjorli',
        description: META_DESC,
        url: '/fiske',
        touristType: ['Fishing', 'Fly fishing', 'Salmon fishing'],
        areaServed: { '@type': 'Place', name: 'Bjorli, Lesja, Rauma' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Bjorli', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Sommer', item: '/sommer' },
          { '@type': 'ListItem', position: 3, name: 'Fiske', item: '/fiske' },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ]);
    document.head.appendChild(ld);
    return () => {
      document.title = prevTitle;
      document.head.removeChild(ld);
    };
  }, []);

  return (
    <div>
      <PageHero
        title="Fiske på Bjorli"
        subtitle="Med fjellvann, klare elver og korte avstander til både ørretfiske, fluefiske og laksefiske er Bjorli et godt utgangspunkt for fiskedager i Lesja og Rauma."
        image={images.fishingHero.src}
      />

      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Brødsmuler">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to="/" className="hover:text-secondary">Bjorli</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to="/sommer" className="hover:text-secondary">Sommer</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">Fiske</li>
        </ol>
      </nav>

      {/* Intro + primary CTAs */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Fiske på Bjorli og i Lesja</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
            <p>
              Lesja er delt opp i tre fiskesoner. Fiskerettene forvaltes av Lesjaskogsvatnet
              fiskeforening, Lesja fjellstyre og A/L Lågen fiskeelv.
            </p>
            <p>
              Fiskekort kan kjøpes i dagligvareforretningene i Lesja, Hydro Texaco Bjorli,
              Sjong Seter på Dalsida eller på iNatur.no.
            </p>
            <p>
              Fiske i Rauma elv nedenfor fylkesgrensen mellom Innlandet og Møre og Romsdal
              forvaltes av Rauma Elveeierlag SA.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={INATUR_VANNSKILLET}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Kjøp fiskekort på iNatur
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={ELVEGUIDEN_RAUMA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              Se laksefiske i Rauma
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Zone cards */}
      <section className="pb-16 md:pb-24 px-4">
        <div className="container mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">Fiskesoner i Lesja</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ZONES.map((z, i) => (
              <motion.div
                key={z.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full bg-card/60 backdrop-blur border-border/60 hover:border-secondary/50 transition-colors">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-4">
                      <Fish className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{z.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-grow">{z.text}</p>
                    <a
                      href={z.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:underline"
                    >
                      {z.cta}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lesjaskogsvatnet section */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center max-w-6xl">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Fiske på Lesjaskogsvatnet og Bjorli
            </h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-4">
              På Lesjaskogsvatnet, Fremre Bøvervatn og Bøvertjønnene kan utenbygdsboende fiske
              med stang. Oterfiske er mulig med fiskekort som inkluderer dette. I resten av
              området er det stangfiske som gjelder.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Fisket administreres av Lesjaskogsvatnet Fiskeforening.
            </p>
            <a
              href={INATUR_VANNSKILLET}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Fiske på vannskillet
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
            <img
              src={images.fishingLake.src}
              alt="Lesjaskogsvatnet ved Bjorli"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Fluefiske */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center max-w-6xl">
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] order-2 md:order-1">
            <img
              src={images.flyFishing.src}
              alt="Fluefiske i klar elv i Lesja"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Fluefiskesonene i Lesja
            </h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-6">
              Gudbrandsdalslågen i Lesja byr på spennende fiske. Fluefiskesonen åpnet i 2020.
              Det er enkel adkomst til elva. Det er etablert to fluesoner på totalt ca. 6 km,
              og elva er lett tilgjengelig med bil og har krystallklart vann.
            </p>
            <a
              href={INATUR_SONE7}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Fiskekort sone 7
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Lesjafjella */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center max-w-6xl">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Fiske i Lesjafjella</h2>
            <ul className="space-y-3 text-foreground/80 leading-relaxed mb-6">
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>Dalsida statsallmenning og Lordalen statsallmenning har ca. 230 fiskevann og rundt 180 km elver og bekker med fisk.</span></li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>Det finnes ørret i alle vann, elver og bekker med fisk.</span></li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>Det finnes røye på vann nede i dalen på Dalsida.</span></li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>Det finnes harr i Aursjøbassenget, Vangsvatnet og Vangstjønn.</span></li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>Jora er en spesielt god fiskeelv med årlige fangster av ørret over kiloen.</span></li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>Flere av fjellstyrets utleiehytter og buer ligger nær gode fiskemuligheter.</span></li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>Det er ikke tillatt å ha med eller bruke levende fisk som agn.</span></li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 mt-1 text-secondary shrink-0" /><span>Det finnes både elvestrekninger for fluefiske, høyfjellsfiske og fiskevann nær vei for barnefamilier.</span></li>
            </ul>
            <a
              href={LESJA_FJELLSTYRE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Les mer hos Lesja fjellstyre
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
            <img
              src={images.fishingMountain.src}
              alt="Fjellfiske i Lesjafjella"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Laksefiske i Rauma */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center max-w-6xl">
          <figure className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] order-2 md:order-1 relative">
            <img
              src={images.salmonRauma.src}
              alt="Laksefiske i Rauma elv"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <figcaption className="absolute bottom-2 right-3 text-[11px] text-white/90 bg-black/40 px-2 py-0.5 rounded">
              Bilde © lakseelver.no
            </figcaption>
          </figure>
          <div className="order-1 md:order-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Laksefiske i Rauma</h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-4">
              Raumalaksen er tilbake i elva. Rauma elv har en total lengde på 65 km og starter
              fra Lesjaskogsvatnet før den går ned gjennom Romsdalen. Topografien gjør elva
              spesiell, med bratte fjell og krystallklart vann. Den lakseførende delen av elva
              er 42 km.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Fisket i Rauma formidles av grunneierne. Rauma Elveeierlag SA er forvaltningslaget.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Ved spørsmål knyttet til forvaltning: Vidar Skiri, tlf. <a href="tel:+4791740533" className="underline hover:text-secondary">917 40 533</a>.
              Ved spørsmål knyttet til fisket: kontakt den enkelte grunneier via Elveguiden.
            </p>
            <a
              href={ELVEGUIDEN_RAUMA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Laksefiske i hele Rauma
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
              <Info className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Praktisk informasjon</h2>
          </div>
          <ul className="space-y-3 text-foreground/80 leading-relaxed">
            <li>• Sjekk alltid gjeldende regler før du fisker.</li>
            <li>• Kjøp riktig fiskekort for området du skal fiske i.</li>
            <li>• Noen områder har egne regler for redskap, stangfiske og oter.</li>
            <li>• Levende fisk som agn er ikke tillatt i områdene beskrevet av Lesja fjellstyre.</li>
            <li>• Bruk lenkene på siden for oppdatert informasjon fra forvalterne.</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Ofte stilte spørsmål</h2>
          <div className="space-y-3">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border bg-card/60 backdrop-blur p-5 open:bg-card transition-colors"
              >
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

      {/* Internal links */}
      <section className="pb-20 md:pb-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-xl font-semibold mb-4">Utforsk mer på Bjorli</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { to: '/sommer', label: 'Sommer på Bjorli' },
              { to: '/aktiviteter', label: 'Aktiviteter' },
              { to: '/overnatting', label: 'Overnatting' },
              { to: '/reisen-hit', label: 'Reisen hit' },
              { to: '/mat-og-drikke', label: 'Mat og drikke' },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors"
              >
                {l.label}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fiske;