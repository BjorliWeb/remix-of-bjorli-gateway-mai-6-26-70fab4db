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
        desc: 'Merka stier og åpne vidder for korte og lange turer i Bjorli-fjella.',
        href: '/fotturer',
        image: images.hiking.src,
        alt: images.hiking.alt,
      },
      {
        title: 'Sykling og pumptrack',
        desc: 'Stisykling, grusveier og pumptrack for hele familien.',
        href: '/sykling',
        image: images.biking.src,
        alt: images.biking.alt,
      },
      {
        title: 'Fiske',
        desc: 'Fjellvann, elver, fluefiske og laksefiske i Rauma.',
        href: '/fiske',
        image: images.fishingHero.src,
        alt: images.fishingHero.alt,
      },
      {
        title: 'Familieaktiviteter',
        desc: 'Trygge og varierte opplevelser for barn og voksne sammen.',
        href: '/familie',
        image: images.familySummer.src,
        alt: images.familySummer.alt,
      },
      {
        title: 'Gardsbesøk',
        desc: 'Møt dyra, kulturlandskapet og lokal mat på gårdene rundt Bjorli.',
        href: '/gardsbesok',
        image: farmHeroImg,
        alt: 'Kulturlandskap og gard i Lesja',
      },
    ],
  },
  {
    id: 'dagsturer',
    title: 'Dagsturer fra Bjorli',
    intro: 'Bruk Bjorli som base og opplev kjente reisemål i regionen på dagstur.',
    cards: [
      {
        title: 'The Golden Train',
        desc: 'Den naturskjønne togreisen langs Raumabanen — fra Bjorli ned mot Åndalsnes.',
        href: '/golden-train',
        image: images.tipTrain.src,
        alt: images.tipTrain.alt,
      },
      {
        title: 'Romsdalsgondolen',
        desc: 'Dagstur til Åndalsnes med gondol opp til Nesaksla og Eggen.',
        href: '/romsdalsgondolen',
        image: images.romsdalsgondolen.src,
        alt: images.romsdalsgondolen.alt,
      },
      {
        title: 'Sagelva vasskraftsenter',
        desc: 'Opplev 300 år med vasskraft, lokalhistorie og levende formidling.',
        href: '/sagelva',
        image: images.sagelva.src,
        alt: images.sagelva.alt,
      },
    ],
  },
  {
    id: 'natur-og-ruter',
    title: 'Fjell, natur og ruteopplevelser',
    intro: 'Tematiske turforslag for deg som vil ut i naturen rundt Bjorli.',
    cards: [
      {
        title: 'Korte turer',
        desc: 'Lavterskel turer for en rolig formiddag eller ettermiddag i fjellet.',
        href: '/sommer/korte-turer',
        image: images.summerAerialNature.src,
        alt: images.summerAerialNature.alt,
      },
      {
        title: 'Lengre fotturer',
        desc: 'Toppturer og dagsmarsjer i Bjorli-fjella for vante turgåere.',
        href: '/fotturer',
        image: images.summerValley.src,
        alt: images.summerValley.alt,
      },
      {
        title: 'Tafjordfjella',
        desc: 'Villmark og åpne fjellvidder — turforslag og inngangspunkter fra Bjorli-siden.',
        href: '/fotturer',
        image: images.fishingLake.src,
        alt: 'Stille fjellvann og høyfjell nær Bjorli.',
      },
      {
        title: 'Natur og utsikt',
        desc: 'Utsiktspunkter, kulturlandskap og rolige naturopplevelser i Lesja og Romsdalen.',
        href: '/sommer',
        image: images.flyFishing.src,
        alt: 'Sommerlandskap og elv i fjellet ved Bjorli.',
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
        subtitle="Tur, sykling, fiske, familieliv og dagsturer fra fjellbygda — her finner du oversikten."
        image={images.heroSummer.src}
      />

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
