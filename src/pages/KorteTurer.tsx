import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, ChevronRight, MapPin, TrendingUp, Train, Camera,
  Eye, Users, ExternalLink, Download, Mountain, TreePine, Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import { usePageCopy } from '@/i18n/usePageCopy';
import { KORTE_TURER_COPY, type WalkId, type TagId } from './korteTurerCopy';

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

// Per-walk map and photo assets, keyed by stable id (locale-independent).
const WALK_ASSETS: Record<WalkId, { map: string; photo?: string }> = {
  'tussheimbue':              { map: mapTussheimbue,           photo: photoTussheimHut },
  'sveavarden':               { map: mapSveavarden },
  'lesjaverk':                { map: mapLesjaverk,             photo: photoLesjaskogsvatnet },
  'kulturminner-lesjaskog':   { map: mapKulturminnerLesjaskog },
  'ranakollen':               { map: mapRanakollen },
  'kyllingbrua':              { map: mapKyllingbrua,           photo: photoKyllingbrua },
  'eventurskogen':            { map: mapEventurskogen,         photo: photoEventurskogen },
  'trollstigfoten':           { map: mapTrollstigfoten,        photo: photoTrollstigfoten },
  'trollstigen-utkikkspunkt': { map: mapTrollstigenUtkikk,     photo: photoTrollstigenViewpoint },
  'litlefjellet':             { map: mapLitlefjellet,          photo: photoLitlefjellet },
};

const TAG_TO_ICON: Record<TagId, React.ComponentType<{ className?: string }>> = {
  view: Eye, dayCabin: Mountain, trainFriendly: Train, train: Train,
  photoSpot: Camera, culture: TreePine, familyFriendly: Users, kids: Users,
  easyWalk: MapPin, shortWalk: MapPin, swimming: MapPin, activity: MapPin,
  steep: TrendingUp, mountainHike: Mountain, loop: MapPin, forest: TreePine,
  river: MapPin, partlyAccessible: Users,
};

const MIX_ICON: Record<'family' | 'view' | 'roadside' | 'train', React.ComponentType<{ className?: string }>> = {
  family: Users, view: Eye, roadside: Car, train: Train,
};

const Tag = ({ id, label }: { id: TagId; label: string }) => {
  const Icon = TAG_TO_ICON[id] ?? MapPin;
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

const KorteTurer = () => {
  const lp = useLocalizedPath();
  const c = usePageCopy(KORTE_TURER_COPY);
  const WALKS = c.walks;

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.faq.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: c.crumbSommer,  item: '/sommer' },
      { '@type': 'ListItem', position: 3, name: c.crumbHere, item: '/sommer/korte-turer' },
    ],
  };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = c.seoTitle;
    const setMeta = (sel: string, attr: string, key: string, val: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute('content', val);
      return el;
    };
    const m1 = setMeta('meta[name="description"]', 'name', 'description', c.seoDescription);
    const m2 = setMeta('meta[property="og:title"]', 'property', 'og:title', c.ogTitle);
    const s1 = document.createElement('script'); s1.type = 'application/ld+json'; s1.text = JSON.stringify(faqJsonLd); document.head.appendChild(s1);
    const s2 = document.createElement('script'); s2.type = 'application/ld+json'; s2.text = JSON.stringify(breadcrumbJsonLd); document.head.appendChild(s2);
    return () => { document.title = prevTitle; s1.remove(); s2.remove(); void m1; void m2; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.seoTitle, c.seoDescription, c.ogTitle]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt={c.heroAlt}
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
            {c.heroEyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-8 leading-[0.95] tracking-tight"
          >
            {c.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-primary-foreground/85 text-lg md:text-2xl mb-12 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {c.heroSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap"
          >
            <a href="#turene">
              <Button size="lg" className="font-semibold w-full sm:w-auto">
                {c.ctaSeeWalks} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link to={lp('/reisen-hit')}>
              <Button variant="outline" size="lg" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground font-semibold w-full sm:w-auto">
                <Car className="mr-2 h-5 w-5" /> {c.ctaPlanTrip}
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
          <li><Link to={lp('/sommer')} className="hover:text-secondary">{c.crumbSommer}</Link></li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium">{c.crumbHere}</li>
        </ol>
      </nav>

      {/* Intro */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl space-y-6 text-lg md:text-xl text-foreground/85 leading-relaxed">
          <p>{c.introP1}</p>
          <p>{c.introP2}</p>
          <div className="flex flex-wrap gap-3 not-prose text-base">
            <a
              href="https://designmanual.norgesnasjonalparker.no/uploads/documents/Snartur_2023_web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-secondary hover:underline"
            >
              {c.brochureOriginal} <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="/Snartur_2023_web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" /> {c.brochureDownload}
            </a>
          </div>
          <p>{c.introP3}</p>
        </div>
      </section>

      {/* Overview cards */}
      <section id="turene" className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <div className="text-secondary text-xs font-medium tracking-[0.22em] uppercase mb-4">{c.overviewEyebrow}</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              {c.overviewTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WALKS.map((w) => {
              const a = WALK_ASSETS[w.id];
              return (
              <a key={w.id} href={`#${w.id}`} className="group block">
                <article className="h-full flex flex-col rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-secondary/50 transition-colors">
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={a.photo ?? a.map}
                      alt={w.photoAlt ?? w.mapAlt}
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
                      {w.tags.map((t) => <Tag key={t} id={t} label={c.tagLabels[t]} />)}
                    </div>
                    <span className="inline-flex items-center gap-2 text-secondary text-xs font-medium tracking-[0.18em] uppercase mt-auto">
                      {c.readMore} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detail sections — one per walk */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl space-y-20 md:space-y-28">
          {WALKS.map((w, i) => {
            const a = WALK_ASSETS[w.id];
            return (
            <article key={w.id} id={w.id} className="scroll-mt-24">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="text-secondary text-[11px] font-medium tracking-[0.22em] uppercase mb-3">{w.area}</div>
                  <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-5 leading-[1.05] tracking-tight">{w.name}</h2>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6">
                    <Stat icon={MapPin} label={`${c.roundTripPrefix} ${w.distance}`} />
                    {w.elevation && <Stat icon={TrendingUp} label={`${c.elevationPrefix} ${w.elevation}`} />}
                  </div>
                  <p className="text-foreground/85 text-base md:text-lg leading-relaxed mb-5">{w.description}</p>
                  <div className="rounded-xl border border-border/60 bg-card/60 p-4 mb-6">
                    <div className="text-xs font-medium uppercase tracking-[0.18em] text-secondary mb-1.5">{c.startParking}</div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{w.parking}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {w.tags.map((t) => <Tag key={t} id={t} label={c.tagLabels[t]} />)}
                  </div>
                </div>
                <div className={`space-y-4 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  {/* Brochure photo first when available */}
                  {a.photo && (
                    <figure className="rounded-2xl overflow-hidden bg-muted">
                      <img src={a.photo} alt={w.photoAlt ?? w.name} className="w-full h-auto object-cover" loading="lazy" />
                    </figure>
                  )}
                  {/* Map cutout — exact crop from the brochure */}
                  <figure className="rounded-2xl overflow-hidden bg-card border border-border/60 p-2">
                    <img src={a.map} alt={w.mapAlt} className="w-full h-auto object-contain bg-white" loading="lazy" />
                    <figcaption className="text-[11px] text-muted-foreground px-2 py-2">
                      {c.mapCaption}
                    </figcaption>
                  </figure>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      {/* Velg tur etter dagsform */}
      <section className="py-20 md:py-28 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="text-secondary text-xs font-medium tracking-[0.22em] uppercase mb-4">{c.mixEyebrow}</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-[1.05] tracking-tight">
              {c.mixTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {c.mixCards.map(({ title, iconKey, walks }) => {
              const Icon = MIX_ICON[iconKey];
              return (
              <div key={iconKey} className="rounded-2xl border border-border/60 bg-card p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                </div>
                <ul className="space-y-2">
                  {walks.map((id) => {
                    const w = WALKS.find((x) => x.id === id);
                    return (
                      <li key={id}>
                        <a href={w ? `#${w.id}` : '#turene'} className="text-foreground/85 hover:text-secondary transition-colors inline-flex items-center gap-2">
                          <ArrowRight className="h-3.5 w-3.5" /> {w?.name ?? id}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bjorli som base */}
      <section className="py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-secondary text-xs font-medium tracking-[0.22em] uppercase mb-4">{c.baseEyebrow}</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
            {c.baseTitle}
          </h2>
          <p className="text-lg text-foreground/85 leading-relaxed mb-5">{c.baseP1}</p>
          <p className="text-lg text-foreground/85 leading-relaxed mb-8">{c.baseP2}</p>
          <div className="flex flex-wrap gap-3">
            <Link to={lp('/overnatting')}>
              <Button variant="outline" size="lg">{c.baseLinkAccommodation}</Button>
            </Link>
            <Link to={lp('/mat-og-drikke')}>
              <Button variant="outline" size="lg">{c.baseLinkFood}</Button>
            </Link>
            <Link to={lp('/sommer')}>
              <Button variant="outline" size="lg">{c.baseLinkSummer}</Button>
            </Link>
            <Link to={lp('/reisen-hit')}>
              <Button variant="outline" size="lg">{c.baseLinkTravel}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Husk på tur */}
      <section className="py-16 md:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">{c.tipsTitle}</h2>
          <ul className="space-y-3 text-foreground/85">
            {c.tips.map((tip) => (
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
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8 leading-tight">{c.faqTitle}</h2>
          <div className="space-y-3">
            {c.faq.map((f) => (
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
            {c.finalTitle}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
            {c.finalBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link to={lp('/overnatting')}>
              <Button size="lg" className="font-semibold w-full sm:w-auto">{c.finalAccommodation}</Button>
            </Link>
            <Link to={lp('/sommer')}>
              <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">{c.finalSummer}</Button>
            </Link>
            <Link to={lp('/reisen-hit')}>
              <Button variant="outline" size="lg" className="font-semibold w-full sm:w-auto">{c.finalTravel}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Credit */}
      <section className="py-12 px-4 border-t border-border/60">
        <div className="container mx-auto max-w-3xl">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-secondary mb-3">{c.creditEyebrow}</div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{c.creditP1}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {c.creditPublisher}:{' '}
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
              {c.brochureOriginal} <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="/Snartur_2023_web.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Download className="h-4 w-4" /> {c.brochureDownload}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KorteTurer;