import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Snowflake, Mountain, Users, Train, Compass } from 'lucide-react';
import PageHero from '@/components/PageHero';
import {
  PageMeta,
  JsonLd,
  FaqBlock,
  RelatedLinksBlock,
  buildBreadcrumb,
  buildTouristDestination,
  buildSkiResort,
} from '@/components/seo';
import { images } from '@/lib/images';
import { track, trackPageView } from '@/lib/analytics';

const SITE_ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://www.bjorli.no';
const PAGE_URL = `${SITE_ORIGIN}/en/ski-holiday-norway`;

const FAQ = [
  {
    q: 'Where is Bjorli located in Norway?',
    a: 'Bjorli is a mountain village in Lesja, Innlandet county, between Dombås and Åndalsnes along the E136 highway and the Rauma Line. It sits on a high plateau, which is the main reason it has such a long, snow-secure winter season.',
  },
  {
    q: 'When is the ski season at Bjorli?',
    a: 'Bjorli is one of Norway’s most snow-secure resorts and typically opens earlier and closes later than lower-altitude resorts. For the latest live status, lift count and snow depth, check the live status on the homepage and the opening hours page.',
  },
  {
    q: 'Is Bjorli good for a family ski holiday?',
    a: 'Yes. Bjorli has dedicated beginner areas, a ski school, ski rental on site and a wide range of family-friendly accommodation, from cabins to apartments. The compact ski resort layout makes it easy to keep children close.',
  },
  {
    q: 'How do you get to Bjorli from Oslo?',
    a: 'By car, follow E6 north to Dombås and continue west on E136 — about a 4–5 hour drive. By train, take the Dovre Line to Dombås and change to the Rauma Line to Bjorli station, which is a short walk from the village. Check www.entur.no for train and bus schedules and ticket booking.',
  },
  {
    q: 'What is there to do at Bjorli besides alpine skiing?',
    a: 'Cross-country trails (langrenn), ski touring, snowshoeing, sledding, family activities and great food and drink. In summer, Bjorli is a base for hiking, cycling and trips to Trollstigen, Åndalsnes and the Romsdalsfjord.',
  },
];

const SkiHolidayNorway = () => {
  useEffect(() => {
    trackPageView({
      path: '/en/ski-holiday-norway',
      language: 'en',
      title: 'Ski Holiday in Norway | Discover Bjorli Skisenter',
    });
  }, []);

  return (
    <>
      <PageMeta
        title="Ski Holiday in Norway | Discover Bjorli Skisenter"
        description="Plan a ski holiday in Norway at Bjorli, a family-friendly mountain destination with alpine skiing, cross-country trails, snow-secure winter conditions, accommodation, webcams and easy access by road and train."
        ogImage={SITE_ORIGIN + images.heroWinter.src}
        ogType="website"
      />
      <JsonLd
        data={buildBreadcrumb([
          { label: 'Home', url: `${SITE_ORIGIN}/en` },
          { label: 'Ski Holiday in Norway', url: PAGE_URL },
        ])}
      />
      <JsonLd
        data={buildTouristDestination(
          PAGE_URL,
          'Bjorli is a snow-secure, family-friendly mountain destination in Romsdalen, Norway, ideal for an alpine and cross-country ski holiday.',
        )}
      />
      <JsonLd
        data={buildSkiResort(
          `${SITE_ORIGIN}/en/bjorli-ski-resort`,
          'Bjorli Skisenter offers alpine skiing on snow-secure slopes in Romsdalen, with lifts, ski school, ski rental and family-friendly terrain.',
        )}
      />

      <PageHero
        title="Ski Holiday in Norway"
        subtitle="Snow-secure slopes, real Norwegian mountains and a family-friendly base in Romsdalen — discover Bjorli."
        image={images.heroWinter.src}
      />

      {/* Why choose Bjorli */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Why choose Bjorli for a ski holiday in Norway
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-3xl">
            Bjorli sits high in the Romsdalen valley and is the gateway between eastern and
            north-western Norway. The altitude and inland climate make it one of Norway’s most
            snow-secure resorts, with a long winter season, real mountain terrain and a relaxed,
            family-friendly atmosphere — a short drive or train ride from Oslo and Trondheim, and
            close to the Rauma River, Trollveggen, Trollstigen, the Geirangerfjord, Ålesund and
            Dovrefjell.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Snowflake, title: 'Snow-secure season', body: 'High altitude and a continental climate keep the slopes in great condition from early winter into spring.' },
              { Icon: Users, title: 'Family-friendly', body: 'Beginner areas, ski school, ski rental and accommodation built around families travelling with children.' },
              { Icon: Train, title: 'Easy to reach', body: 'Direct on the E136 and on the Rauma Line — Bjorli station is a short walk from the village.' },
            ].map(({ Icon, title, body }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <Icon className="h-6 w-6 text-secondary mb-3" aria-hidden="true" />
                <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bjorli Skisenter */}
      <section className="py-16 px-4 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Bjorli Skisenter
            </h2>
            <p className="text-muted-foreground mb-4">
              Bjorli Skisenter is the heart of winter at Bjorli — alpine slopes
              for every level, modern lifts, snow cannons for early-season cover and wide-open views
              over the Romsdalen mountains. Live lift and slope status, snow depth and temperature
              are published from the resort throughout the season.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/en/bjorli-ski-resort"
                className="inline-flex items-center px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground font-medium hover:opacity-90"
              >
                Explore the ski resort
              </Link>
              <Link
                to="/en/ski-passes"
                onClick={() => track('click_buy_ski_pass', { link_text: 'ski_holiday_norway_hero' })}
                className="inline-flex items-center px-5 py-2.5 rounded-full border border-border text-foreground font-medium hover:bg-card"
              >
                Ski passes
              </Link>
            </div>
          </div>
          <img
            src={images.skiCenter.src}
            alt={images.skiCenter.alt}
            className="rounded-2xl w-full h-72 object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Family-friendly skiing */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-10 items-center">
          <img
            src={images.skiSchool.src}
            alt={images.skiSchool.alt}
            className="rounded-2xl w-full h-72 object-cover order-2 md:order-1"
            loading="lazy"
          />
          <div className="order-1 md:order-2">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Family-friendly skiing
            </h2>
            <p className="text-muted-foreground mb-4">
              Bjorli is built around families. The ski resort has gentle beginner slopes close to
              the base area, a ski school for first-timers and improvers, and ski rental on site so
              you can travel light. Most accommodation is within a short drive or shuttle of the
              lifts, making the day easy to manage with children.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/en/ski-school" className="text-secondary font-medium hover:underline">
                Ski school →
              </Link>
              <Link to="/en/ski-rental" className="text-secondary font-medium hover:underline">
                Ski rental →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Travel to Bjorli */}
      <section className="py-16 px-4 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <Train className="h-6 w-6 text-secondary" aria-hidden="true" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Travel to Bjorli
            </h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mb-6">
            By car: take E6 north from Oslo to Dombås, then E136 west to Bjorli — around 4–5 hours.
            By train: the Rauma Line connects Dombås with Bjorli station, just a short walk from the
            village. The nearest airports are Molde, Ålesund and Oslo. For train and bus schedules
            and ticket booking, visit{' '}
            <a
              href="https://www.entur.no"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-secondary"
            >
              www.entur.no
            </a>
            .
          </p>
          <Link
            to="/en/getting-here"
            className="inline-flex items-center px-5 py-2.5 rounded-full border border-border text-foreground font-medium hover:bg-card"
          >
            How to get to Bjorli
          </Link>
        </div>
      </section>

      {/* More than alpine skiing */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-4">
            <Mountain className="h-6 w-6 text-secondary" aria-hidden="true" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              More than alpine skiing
            </h2>
          </div>
          <p className="text-muted-foreground max-w-3xl mb-8">
            Bjorli is also a cross-country destination, with groomed trails (langrennsløyper)
            connecting the village with the surrounding fells. Beyond skiing, you can sled, snowshoe,
            ski tour and enjoy local food and drink — and in summer, the same mountains turn into
            world-class hiking and cycling country.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { to: '/en/cross-country-skiing', label: 'Cross-country skiing', Icon: Snowflake },
              { to: '/en/weather-and-webcams', label: 'Weather & webcams', Icon: Compass },
              { to: '/en/summer', label: 'Summer at Bjorli', Icon: Mountain },
            ].map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-secondary transition-colors"
              >
                <Icon className="h-5 w-5 text-secondary" aria-hidden="true" />
                <span className="font-medium text-foreground">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqBlock title="Frequently asked questions" items={FAQ} />

      <RelatedLinksBlock
        title="Plan your Bjorli ski holiday"
        links={[
          { label: 'Bjorli Skisenter', href: '/en/bjorli-ski-resort', description: 'Lifts, slopes and live status from the resort.' },
          { label: 'Ski passes', href: '/en/ski-passes', description: 'Day passes, season passes and family deals.' },
          { label: 'Opening hours', href: '/en/opening-hours', description: 'Current and seasonal opening times.' },
          { label: 'Accommodation', href: '/en/accommodation', description: 'Cabins, apartments and hotels at Bjorli.' },
          { label: 'Weather & webcams', href: '/en/weather-and-webcams', description: 'Live cameras, weather and snow conditions.' },
          { label: 'Getting here', href: '/en/getting-here', description: 'By car, train and air to Bjorli.' },
        ]}
      />
    </>
  );
};

export default SkiHolidayNorway;