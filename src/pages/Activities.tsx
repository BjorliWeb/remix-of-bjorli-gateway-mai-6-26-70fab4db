import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { images } from '@/lib/images';
import farmHeroImg from '@/assets/farms/gardsbesok-lesja-kulturlandskap.avif';

const META_TITLE = 'Aktiviteter på Bjorli | Tur, sykling, fiske, gardsbesøk og dagsturer';
const META_DESC =
  'Oversikt over aktiviteter i og rundt Bjorli — fotturer, sykling, fiske, familieaktiviteter, gardsbesøk, dagsturer som Golden Train og Romsdalsgondolen, samt natur og utsikt.';

type Card = {
  title: string;
  desc: string;
  href: string;
  image: string;
  alt: string;
  external?: boolean;
};

type Section = { id: string; title: string; intro?: string; cards: Card[] };

const SECTIONS: Section[] = [
  {
    id: 'rundt-bjorli',
    title: 'Aktiviteter i og rundt Bjorli',
    intro:
      'Opplevelser du kan starte rett fra døra — i fjellet, langs elva og på gårdene i Lesja.',
    cards: [
      {
        title: 'Fotturer',
        desc: 'Korte turer, fjellstier og lengre ruter i Bjorli-fjella.',
        href: '/fotturer',
        image: images.hiking.src,
        alt: images.hiking.alt,
      },
      {
        title: 'Sykling og pumptrack',
        desc: 'Pumptrack, grusveier og stisykling for aktive sommerdager.',
        href: '/sykling',
        image: images.biking.src,
        alt: images.biking.alt,
      },
      {
        title: 'Fiske',
        desc: 'Fjellvann, elver og rolige fiskeplasser rundt Bjorli.',
        href: '/fiske',
        image: images.fishingHero.src,
        alt: images.fishingHero.alt,
      },
      {
        title: 'Familieaktiviteter',
        desc: 'Lavterskel opplevelser for barn og voksne gjennom sommeren.',
        href: '/familie',
        image: images.familySummer.src,
        alt: images.familySummer.alt,
      },
      {
        title: 'Gardsbesøk',
        desc: 'Møt dyr, gårdsliv og kulturlandskap i nærområdet rundt Bjorli.',
        href: '/gardsbesok',
        image: farmHeroImg,
        alt: 'Kulturlandskap og gard i Lesja',
      },
    ],
  },
  {
    id: 'dagsturer',
    title: 'Dagsturer og lokale opplevelser',
    intro: 'Bruk Bjorli som base og kombiner togtur, gondol og lokal kulturhistorie.',
    cards: [
      {
        title: 'The Golden Train',
        desc: 'En scenisk togreise på Raumabanen, med Bjorli som naturlig utgangspunkt.',
        href: '/golden-train',
        image: images.tipTrain.src,
        alt: images.tipTrain.alt,
      },
      {
        title: 'Romsdalsgondolen',
        desc: 'Fjord- og fjellutsikt i Åndalsnes, innen rekkevidde fra Bjorli.',
        href: '/romsdalsgondolen',
        image: images.romsdalsgondolen.src,
        alt: images.romsdalsgondolen.alt,
      },
      {
        title: 'Sagelva vasskraftsenter',
        desc: 'Vasskraft, lokalhistorie og levende formidling i Lesja.',
        href: '/sagelva',
        image: images.sagelva.src,
        alt: images.sagelva.alt,
      },
    ],
  },
  {
    id: 'natur-og-ruter',
    title: 'Fjell, natur og ruter',
    intro: 'Tematiske turforslag for deg som vil ut i naturen rundt Bjorli.',
    cards: [
      {
        title: 'Korte turer',
        desc: 'Enkle turer for en rolig formiddag eller ettermiddag i fjellet.',
        href: '/sommer/korte-turer',
        image: images.summerValley.src,
        alt: images.summerValley.alt,
      },
      {
        title: 'Lengre fotturer',
        desc: 'Toppturer, dagsmarsjer og fjellruter for vante turgåere.',
        href: '/fotturer',
        image: images.summerAerialValleyRiver.src,
        alt: images.summerAerialValleyRiver.alt,
      },
      {
        title: 'Tafjordfjella',
        desc: 'Store fjellområder, åpne vidder og turmuligheter fra Bjorli-siden.',
        href: '/fotturer',
        image: images.summerAerialSkiCenterMountain.src,
        alt: images.summerAerialSkiCenterMountain.alt,
      },
      {
        title: 'Natur og utsikt',
        desc: 'Utsiktspunkt, elvelandskap og stille natur i Lesja og Romsdalen.',
        href: '/sommer',
        image: images.summerAerialNature.src,
        alt: images.summerAerialNature.alt,
      },
    ],
  },
];

const ActivityCard = ({ card, index }: { card: Card; index: number }) => {
  const inner = (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group h-full bg-card rounded-2xl overflow-hidden border border-border/70 hover:border-secondary/40 transition-colors flex flex-col"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <img
          src={card.image}
          alt={card.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-foreground mb-2 leading-tight group-hover:text-secondary transition-colors">
          {card.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{card.desc}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary mt-auto">
          <span>Les mer</span>
          {card.external ? (
            <ExternalLink className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
      </div>
    </motion.article>
  );

  if (card.external) {
    return (
      <a href={card.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return (
    <Link to={card.href} className="block h-full">
      {inner}
    </Link>
  );
};

const Activities = () => {
  useEffect(() => {
    document.title = META_TITLE;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', META_DESC);
  }, []);

  return (
    <div>
      <PageHero
        title="Aktiviteter på Bjorli"
        subtitle="Finn fotturer, sykling, fiske, familieopplevelser og dagsturer med Bjorli som base."
        image={images.heroSummer.src}
      />

      <section className="pt-16 md:pt-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Bjorli er et helårs reisemål med korte aktiviteter rett utenfor døra
            og store opplevelser innen kort kjøreavstand- eller togreise. Her
            finner du fotturer, sykling, fiske, familieopplevelser, lokal kultur
            og dagsturer mot Romsdalen, fjellet og fjorden.
          </p>
        </div>
      </section>

      {SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className="py-16 md:py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-2xl mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
                {section.title}
              </h2>
              {section.intro && (
                <p className="text-base text-muted-foreground leading-relaxed">{section.intro}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {section.cards.map((card, i) => (
                <ActivityCard key={card.title} card={card} index={i} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Activities;
