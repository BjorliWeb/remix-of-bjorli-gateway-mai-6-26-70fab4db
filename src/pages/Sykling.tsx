import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SubPage from '@/components/SubPage';
import { Card, CardContent } from '@/components/ui/card';
import aktivitetsparkImg from '@/assets/photos/bjorli-aktivitetspark-skilt.jpg';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';

const OUTDOORACTIVE_MTB_URL = 'https://out.ac/yGCVZ';

type MtbCopy = { title: string; intro: string; cta: string };

const MTB_COPY: Record<Locale, MtbCopy> = {
  no: {
    title: 'Mountainbike-ruter i Lesja',
    intro: 'Se turforslag, kart og oppdatert ruteinformasjon for sykling i Lesja hos Outdooractive.',
    cta: 'Åpne sykkelruter hos Outdooractive',
  },
  en: {
    title: 'Mountain biking trails in Lesja',
    intro: 'See route suggestions, maps and up-to-date trail information for cycling in Lesja on Outdooractive.',
    cta: 'Open cycling routes on Outdooractive',
  },
  de: {
    title: 'Mountainbike-Routen in Lesja',
    intro: 'Tourenvorschläge, Karten und aktuelle Routeninformationen zum Radfahren in Lesja auf Outdooractive ansehen.',
    cta: 'Radrouten auf Outdooractive öffnen',
  },
  nl: {
    title: 'Mountainbikeroutes in Lesja',
    intro: 'Bekijk routesuggesties, kaarten en actuele route-informatie voor fietsen in Lesja op Outdooractive.',
    cta: 'Fietsroutes openen op Outdooractive',
  },
  da: {
    title: 'Mountainbike-ruter i Lesja',
    intro: 'Se turforslag, kort og opdateret ruteinformation for cykling i Lesja hos Outdooractive.',
    cta: 'Åbn cykelruter hos Outdooractive',
  },
  sv: {
    title: 'Mountainbikeleder i Lesja',
    intro: 'Se turförslag, kartor och aktuell ruttinformation för cykling i Lesja hos Outdooractive.',
    cta: 'Öppna cykelleder hos Outdooractive',
  },
};

const OutdooractiveMtbSection = () => {
  const t = usePageCopy(MTB_COPY);
  return (
    <section className="pb-16 md:pb-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <a
          href={OUTDOORACTIVE_MTB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors p-6 md:p-8"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2 group-hover:text-secondary transition-colors">
            {t.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-5">{t.intro}</p>
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background text-foreground text-sm font-medium">
            {t.cta}
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      </div>
    </section>
  );
};

const Sykling = () => (
  <SubPage
    slug="sykling"
    afterIntro={
      <>
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          >
            {/* Image */}
            <div className="order-2 lg:order-1">
              <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
                <img
                  src={aktivitetsparkImg}
                  alt="Skilt til Bjorli Aktivitetspark med sykkel, skøyter, gapahuk, lekeapparat og ballaktivitet."
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text + card + links */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  Bjorli Aktivitetspark
                </h2>
                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>
                    Bjorli Aktivitetspark er et lavterskel aktivitetsområde for hele familien, med aktiviteter som passer godt sammen med sykling og aktive dager på Bjorli.
                  </p>
                  <p>
                    I juni 2026 åpnet parken en ny asfaltert pump track. Den passer for barn, ungdom og voksne som vil øve balanse, flyt og sykkelteknikk på en morsom og trygg måte.
                  </p>
                  <p className="text-muted-foreground">
                    Parken ligger omtrent 850 meter fra E136 og er enkel å finne når du er på Bjorli.
                  </p>
                </div>
              </div>

              {/* Praktisk card */}
              <Card className="bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-5 md:p-6">
                  <h3 className="font-display text-lg font-semibold mb-3">Praktisk</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                      Ny asfaltert pump track åpnet juni 2026
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                      Ca. 850 meter fra E136
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                      Passer for sykkel, lek og aktive familier
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* External links */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61589826262934"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
                >
                  Se Bjorli Aktivitetspark på Facebook
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://maps.app.goo.gl/2USby3m7hXeXS7Y58"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm font-medium"
                >
                  Åpne i Google Maps
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://maps.app.goo.gl/HZZiAXgnyDxXQz9h7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm font-medium"
                >
                  Se avstand fra E136
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <OutdooractiveMtbSection />
      </>
    }
  />
);

export default Sykling;
