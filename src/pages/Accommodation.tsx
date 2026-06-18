import { Link } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import { Home, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

/**
 * /overnatting — Norwegian destination page (NO only in this step).
 * Content sourced from the old bjorli.no/overnatting/ page and the
 * provider list supplied by the editor. No prices, ratings or live
 * availability — only curated provider links.
 */

const heroImg = images.summerValley.src;
const editorialImg = images.accommodation.src;

interface Provider {
  name: string;
  category: string;
  desc: string;
  ctaLabel: string;
  href: string;
  todo?: boolean;
}

const providers: Provider[] = [
  {
    name: 'Novasol',
    category: 'Private utleieenheter',
    desc: 'Utleie av private enheter gjennom Novasol på Bjorli og i Lesja.',
    ctaLabel: 'Søk hos Novasol',
    href: 'https://www.novasol.com/search?adult=2&child=0&pets=0&range=3&nights=3&accommodationType=novasol_cottages&regionName=Bjorli&placesId=62001&destinationCategory=578%7Coppland%7Clesja%7Cbjorli&page=1&sort=recommended&salesMarket=999&displayMode=LIST',
  },
  {
    name: 'Bjorliheimen Fjellhotel',
    category: 'Hotell og hytter',
    desc: 'Hotell- og hytteovernatting på Bjorli.',
    ctaLabel: 'Søk hos Bjorliheimen',
    href: 'https://www.bjorliheimen.no',
  },
  {
    name: 'Bjorli Mountain Lodge',
    category: 'Leiligheter',
    desc: 'Leilighetsovernatting på Bjorli.',
    ctaLabel: 'Søk hos Bjorli Mountain Lodge',
    href: 'https://bjorlimountainlodge.no',
  },
  {
    name: 'Bjorli Vintercamping',
    category: 'Hytter, camping, telt og bobil',
    desc: 'Overnatting for hytter, camping, telt og bobil.',
    ctaLabel: 'Søk hos Bjorli Vintercamping',
    href: 'https://www.bjorli-vintercamping.no',
  },
  {
    name: 'Airbnb',
    category: 'Leiligheter og hytter',
    desc: 'Private leiligheter og hytter lagt ut på Airbnb.',
    ctaLabel: 'Søk på Airbnb',
    // TODO: replace with the Airbnb-søk-lenke som lå på den gamle /overnatting-siden.
    href: '#',
    todo: true,
  },
  {
    name: 'Finn.no',
    category: 'Leiligheter og hytter',
    desc: 'Private leiligheter og hytter lagt ut på Finn.no.',
    ctaLabel: 'Søk på Finn.no',
    // TODO: replace with the Finn.no-søk-lenke som lå på den gamle /overnatting-siden.
    href: '#',
    todo: true,
  },
  {
    name: 'Booking.com',
    category: 'Leiligheter og hytter',
    desc: 'Overnattingsmuligheter lagt ut på Booking.com.',
    ctaLabel: 'Søk på Booking.com',
    // TODO: replace with the Booking.com-lenke som lå på den gamle /overnatting-siden.
    href: '#',
    todo: true,
  },
  {
    name: 'Bjorli Fjellstuer',
    category: 'Leiligheter med hotellkomfort',
    desc: 'Leilighetsovernatting med hotellkomfort.',
    ctaLabel: 'Søk hos Bjorli Fjellstuer',
    href: 'https://bjorlibooking.no',
  },
];

const bookingTips = [
  'Sjekk alltid pris, vilkår og tilgjengelighet hos den enkelte aktør.',
  'Noen tilbud er sesongbaserte.',
  'For skihelger og ferier kan det lønne seg å bestille tidlig.',
  'Skal du reise uten bil, sjekk transport og avstand til aktivitetene du planlegger.',
];

const relatedLinks: { label: string; to: string }[] = [
  { label: 'Reisen hit', to: '/reisen-hit' },
  { label: 'Aktiviteter', to: '/aktiviteter' },
  { label: 'Sommer på Bjorli', to: '/sommer' },
  { label: 'Vinter på Bjorli', to: '/vinter' },
  { label: 'Vær og webkamera', to: '/vaer-og-webkamera' },
];

const Accommodation = () => {
  return (
    <div>
      <PageHero
        title="Overnatting på Bjorli"
        subtitle="Finn hotell, hytter, leiligheter, camping og private utleieenheter på Bjorli og i nærområdet. Her samler vi aktører og bookinglenker som gjør det enklere å planlegge oppholdet."
        image={heroImg}
      />

      {/* Hero CTAs */}
      <section className="py-10 px-4 border-b border-border/60">
        <div className="container mx-auto max-w-5xl flex flex-wrap gap-3 justify-center">
          <a href="#overnattingsmuligheter">
            <Button size="lg" className="font-medium">
              Se overnattingsmuligheter
            </Button>
          </a>
          <Link to="/reisen-hit">
            <Button size="lg" variant="outline" className="font-medium">
              Planlegg reisen hit
            </Button>
          </Link>
        </div>
      </section>

      {/* Editorial */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Bo tett på fjellet</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bjorli er et praktisk utgangspunkt for både sommerdager i fjellet og vintersesong i
              skisenteret. Velg mellom hotell, leiligheter, hytter, camping og private
              utleieenheter.
            </p>
          </motion.div>
          <motion.img
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            src={editorialImg}
            alt="Hytter på Bjorli med utsikt mot fjellet."
            loading="lazy"
            className="rounded-2xl w-full aspect-[5/4] object-cover"
          />
        </div>
      </section>

      {/* Provider grid */}
      <section id="overnattingsmuligheter" className="py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 text-center">
            Overnattingsmuligheter
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((p, i) => (
              <motion.article
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-secondary/40 hover:shadow-lg transition-all flex flex-col"
              >
                <Home className="h-5 w-5 mb-3 text-secondary" />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  {p.category}
                </span>
                <h3 className="font-display text-xl font-semibold mb-2">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                  {p.desc}
                </p>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-auto"
                >
                  <Button variant="outline" className="w-full font-medium">
                    {p.ctaLabel}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Practical info */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Før du bestiller</h2>
          <ul className="space-y-3">
            {bookingTips.map((tip) => (
              <li
                key={tip}
                className="flex gap-3 text-muted-foreground leading-relaxed"
              >
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related links */}
      <section className="py-12 md:py-16 px-4 bg-muted/40">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">Utforsk videre</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="group flex items-center justify-between gap-3 bg-card rounded-xl border border-border px-5 py-4 hover:border-secondary/40 transition-colors"
              >
                <span className="font-medium">{l.label}</span>
                <ArrowRight className="h-4 w-4 text-secondary transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accommodation;
