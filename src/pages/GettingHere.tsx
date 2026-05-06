import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImg from '@/assets/hero-winter.jpg';
import { Train, Car, MapPin } from 'lucide-react';
import { Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import { track } from '@/lib/analytics';

const GettingHere = () => {
  const { d, locale } = useLanguage();
  const flight = d.gettingHere.flightAccess;
  return (
    <div>
      <PageHero title={d.listing.pageGettingHereTitle} subtitle={d.listing.pageGettingHereIntro} image={heroImg} />
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <Car className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">E136</h3>
              <p className="text-muted-foreground">{d.gettingHere.body}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <Train className="h-8 w-8 text-secondary mb-3" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Raumabanen</h3>
              <p className="text-muted-foreground">
                {d.gettingHere.body}{' '}
                <a
                  href="https://www.entur.no"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-secondary"
                  onClick={() =>
                    track('click_train_info', {
                      page_path: '/transport',
                      language: locale,
                      link_url: 'https://www.entur.no',
                      link_text: 'www.entur.no',
                      outbound: true,
                    })
                  }
                >
                  www.entur.no
                </a>
                {' '}— {d.gettingHere.enturNote}
              </p>
            </motion.div>
          </div>

          {flight && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm mb-12"
            >
              <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">
                {flight.eyebrow}
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3 flex items-start gap-2">
                <Plane className="h-6 w-6 text-secondary shrink-0 mt-1" /> {flight.title}
              </h3>
              <p className="text-muted-foreground mb-3">{flight.body}</p>
              <p className="text-sm text-muted-foreground italic">{flight.note}</p>
            </motion.div>
          )}

          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-secondary" /> {d.gettingHere.title}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {d.gettingHere.cities.map((c, i) => (
              <motion.div
                key={c.city}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-muted/40 border border-border rounded-xl p-4 text-center"
              >
                <div className="text-foreground font-semibold">{c.city}</div>
                <div className="text-sm text-muted-foreground">{c.km}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-secondary" /> Bjorli på kartet
            </h2>
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm aspect-[16/9] bg-muted">
              <iframe
                title="Kart over Bjorli"
                src="https://www.google.com/maps?q=Bjorli,Norway&z=8&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <a
                href="https://www.google.com/maps/place/Bjorli,+Norway"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-secondary"
                onClick={() =>
                  track('click_directions', {
                    page_path: '/transport',
                    language: locale,
                    link_url: 'https://www.google.com/maps/place/Bjorli,+Norway',
                    link_text: 'Google Maps',
                    outbound: true,
                  })
                }
              >
                Åpne i Google Maps →
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GettingHere;