import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink, MapPin, Phone, Mail, Info, Camera } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { Card, CardContent } from '@/components/ui/card';

import heroImg from '@/assets/farms/gardsbesok-lesja-kulturlandskap.avif';
import brendjordsbyenImg from '@/assets/farms/gardsbesok-brendjordsbyen-tun.avif';
import brendjordsbyenAltImg from '@/assets/farms/gardsbesok-brendjordsbyen-interior.avif';
import bjokneImg from '@/assets/farms/gardsbesok-bjokne-smabruk.avif';
import ljosbakkenImg from '@/assets/farms/gardsbesok-ljosbakken-gard.avif';
import kolstadImg from '@/assets/farms/gardsbesok-kolstad-gard.avif';
import kolstadMiljoImg from '@/assets/farms/gardsbesok-kolstad-gard-miljo.avif';

const META_TITLE = 'Gardsbesøk på Bjorli | Gårder, dyr og lokal kultur i Lesja';
const META_DESC =
  'Opplev gårdsbesøk rundt Bjorli og Lesja. Besøk Brendjordsbyen, Bjøkne/Ljosbakken gard og Kolstad Gård for gårdsliv, overnatting, lokal mat og kulturlandskap.';

type Cta = { label: string; href: string };
type Farm = {
  id: string;
  title: string;
  image: string;
  alt: string;
  text: string;
  address: string;
  phone: string[];
  email?: string;
  website: string;
  ctas: Cta[];
};

const FARMS: Farm[] = [
  {
    id: 'brendjordsbyen',
    title: 'Brendjordsbyen',
    image: brendjordsbyenImg,
    alt: 'Brendjordsbyen i Lesja med restaurerte tømmerhus',
    text:
      'I århundrer har Brendjordsbyen bydd fastbuande og langvegsfarande frå alle himmelretningar mat og kvile i hjarta av fjellbygda Lesja. I dag er du velkomen til å vakne opp i unikt restaurerte og verneverdige tømmerhus i hjarta av levande kulturlandskap, fjellheim og gardsdrift – og fersk bakst frå vedfyrt steinomn i fjøset.',
    address: 'Brendjordsvegen 57, 2666 Lora',
    phone: ['+47 917 08 319', '+47 982 07 238'],
    email: 'post@brendjordsbyen.no',
    website: 'https://brendjordsbyen.no/',
    ctas: [{ label: 'Besøk Brendjordsbyen', href: 'https://brendjordsbyen.no/' }],
  },
  {
    id: 'bjokne',
    title: 'Bjøkne / Ljosbakken gard',
    image: bjokneImg,
    alt: 'Småbruket på Bjøkne ved Ljosbakken gard',
    text:
      'Utforsk drømmen om småbrukslivet på ekte, og gi hele familien en opplevelsesrik ferie der dere bor og driver et småbruk. Småbruket på Bjøkne ligger i Lesja i Nord-Gudbrandsdalen, og Ljosbakken heter gården småbruket er en del av. SmåbruksOpplevelsen på Bjøkne er et pakke-konsept som gir gjestene et lite småbruk til disposisjon, jord på hendene i kjøkkenhagen, kontakt med dyr, enkle gårdsoppgaver etter ønske og smakfulle måltider av råvarer fra Nord-Gudbrandsdalen. Det tilbys også ordinær gårdsovernatting i et koselig gårdshus — fint for par, barnefamilier og friluftsinteresserte.',
    address: 'Bjøknegeilen 24, 2666 Lora',
    phone: ['+47 476 06 056'],
    email: 'hei@smabruketbjokne.no',
    website: 'https://www.smabruketbjokne.no/',
    ctas: [
      { label: 'Se Småbruket Bjøkne', href: 'https://www.smabruketbjokne.no/' },
      { label: 'Se Ljosbakken gard', href: 'https://www.ljosbakken.no/' },
    ],
  },
  {
    id: 'kolstad',
    title: 'Kolstad Gård',
    image: kolstadImg,
    alt: 'Kolstad Gård i Lesja',
    text:
      'På tur fra øst til vest, sør til nord? Øverst i Gudbrandsdalen, mellom Romsdalen og Trøndelag, ligger Lesja og Kolstad gard. Du finner gården i Lesja sentrum, like ved Lesja kyrkje, Lesja Bygdemuseum og Tunstugu.',
    address: 'Kyrkjevegen 71, 2665 Lesja',
    phone: ['+47 97 64 93 72'],
    website: 'https://www.kolstadgard.no/',
    ctas: [{ label: 'Besøk Kolstad Gård', href: 'https://www.kolstadgard.no/' }],
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

const Gardsbesok = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = META_TITLE;
    setMeta('description', META_DESC);
    setMeta('og:title', META_TITLE, 'property');
    setMeta('og:description', META_DESC, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', '/gardsbesok', 'property');

    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Bjorli', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Aktiviteter', item: '/aktiviteter' },
          { '@type': 'ListItem', position: 3, name: 'Gardsbesøk', item: '/gardsbesok' },
        ],
      },
      ...FARMS.map((f) => ({
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: f.title,
        description: f.text,
        url: f.website,
        telephone: f.phone[0],
        address: { '@type': 'PostalAddress', streetAddress: f.address },
        areaServed: { '@type': 'Place', name: 'Lesja, Bjorli' },
      })),
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
        title="Gardsbesøk på Bjorli"
        subtitle="Rundt Bjorli er det mange flotte gårder som har åpent for besøk, servering og overnatting."
        image={heroImg}
      />

      <nav className="container mx-auto px-4 pt-6 text-sm text-muted-foreground" aria-label="Brødsmuler">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link to="/" className="hover:text-secondary">Bjorli</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to="/sommer" className="hover:text-secondary">Sommer</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li><Link to="/aktiviteter" className="hover:text-secondary">Aktiviteter</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">Gardsbesøk</li>
        </ol>
      </nav>

      {/* Intro */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Gårdsopplevelser nær Bjorli</h2>
          <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
            <p>
              Opplev sjarmen og naturskjønnheten ved gårdsbesøk. Her kan du komme tett på
              gårdsliv, dyr, lokal matkultur og levende kulturlandskap. Gårdsbesøk passer
              både for familier, par og gjester som ønsker en roligere opplevelse tett på
              naturen.
            </p>
            <p>
              Kombiner gjerne et opphold på Bjorli med lokal mat, overnatting,
              kulturlandskap, fjellturer og rolige aktiviteter på en av gårdene i Lesja.
            </p>
            <p className="text-base text-muted-foreground">
              Tilbud, åpningstider og booking kan variere. Sjekk alltid gårdens egen
              nettside før besøk.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#gardene"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Se gårdene
            </a>
            <Link
              to="/sommer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              Sommer på Bjorli
            </Link>
          </div>
        </div>
      </section>

      {/* Farm cards */}
      <section id="gardene" className="pb-16 md:pb-24 px-4 scroll-mt-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FARMS.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full overflow-hidden bg-card/60 backdrop-blur border-border/60 hover:border-secondary/50 transition-colors">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={f.image}
                      alt={f.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col">
                    <h3 className="font-display text-xl font-semibold mb-3">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{f.text}</p>

                    <ul className="space-y-2 text-sm text-foreground/80 mb-5">
                      <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-secondary shrink-0" /><span>{f.address}</span></li>
                      {f.phone.map((p) => (
                        <li key={p} className="flex gap-2">
                          <Phone className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                          <a href={`tel:${p.replace(/\s+/g, '')}`} className="hover:text-secondary">{p}</a>
                        </li>
                      ))}
                      {f.email && (
                        <li className="flex gap-2">
                          <Mail className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
                          <a href={`mailto:${f.email}`} className="hover:text-secondary break-all">{f.email}</a>
                        </li>
                      )}
                    </ul>

                    <div className="mt-auto flex flex-col gap-2">
                      {f.ctas.map((c, idx) => (
                        <a
                          key={c.href}
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${c.label} (åpnes i ny fane)`}
                          className={
                            idx === 0
                              ? 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm'
                              : 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm'
                          }
                        >
                          {c.label}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image strip — secondary photos from the source pages */}
      <section className="pb-16 md:pb-24 px-4">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { src: brendjordsbyenAltImg, alt: 'Brendjordsbyen med historisk gårdsmiljø' },
            { src: ljosbakkenImg, alt: 'Ljosbakken gard og småbruksopplevelse i Lesja' },
            { src: kolstadMiljoImg, alt: 'Gårdsmiljø ved Kolstad Gård i Lesja' },
          ].map((img) => (
            <div key={img.src} className="rounded-2xl overflow-hidden shadow-sm aspect-[4/3]">
              <img src={img.src} alt={img.alt} loading="lazy" className="w-full h-full object-cover" />
            </div>
          ))}
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
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">
            Gårdsbesøk, servering og overnatting kan være sesongbasert og må ofte avtales på
            forhånd. Sjekk gårdens egen nettside for oppdatert informasjon om booking,
            åpningstider og tilgjengelige aktiviteter.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/overnatting" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm">Overnatting på Bjorli</Link>
            <Link to="/aktiviteter" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm">Flere aktiviteter</Link>
            <Link to="/reisen-hit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors text-sm">Slik kommer du hit</Link>
          </div>
        </div>
      </section>

      {/* Image credit */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <Camera className="h-4 w-4 mt-0.5 text-secondary shrink-0" />
            <p>
              <span className="font-semibold text-foreground">Bildekreditering:</span>{' '}
              Alle bilder er hentet fra hjemmesidene til gårdene som er oppført på denne siden.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gardsbesok;
