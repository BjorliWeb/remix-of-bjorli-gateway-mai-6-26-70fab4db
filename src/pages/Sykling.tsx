import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SubPage from '@/components/SubPage';
import { Card, CardContent } from '@/components/ui/card';
import aktivitetsparkImg from '@/assets/photos/bjorli-aktivitetspark-skilt.jpg';
import { usePageCopy } from '@/i18n/usePageCopy';
import type { Locale } from '@/i18n/locales/types';

const OUTDOORACTIVE_MTB_URL = 'https://out.ac/yGCVZ';

type Copy = {
  imageAlt: string;
  parkTitle: string;
  parkParagraphs: [string, string, string];
  practicalTitle: string;
  practicalItems: [string, string, string];
  ctaFacebook: string;
  ctaMaps: string;
  ctaDistance: string;
  mtbTitle: string;
  mtbIntro: string;
  mtbCta: string;
};

const COPY: Record<Locale, Copy> = {
  no: {
    imageAlt: 'Skilt til Bjorli Aktivitetspark med sykkel, skøyter, gapahuk, lekeapparat og ballaktivitet.',
    parkTitle: 'Bjorli Aktivitetspark',
    parkParagraphs: [
      'Bjorli Aktivitetspark er et lavterskel aktivitetsområde for hele familien, med aktiviteter som passer godt sammen med sykling og aktive dager på Bjorli.',
      'I juni 2026 åpnet parken en ny asfaltert pump track. Den passer for barn, ungdom og voksne som vil øve balanse, flyt og sykkelteknikk på en morsom og trygg måte.',
      'Parken ligger omtrent 850 meter fra E136 og er enkel å finne når du er på Bjorli.',
    ],
    practicalTitle: 'Praktisk',
    practicalItems: [
      'Ny asfaltert pump track åpnet juni 2026',
      'Ca. 850 meter fra E136',
      'Passer for sykkel, lek og aktive familier',
    ],
    ctaFacebook: 'Se Bjorli Aktivitetspark på Facebook',
    ctaMaps: 'Åpne i Google Maps',
    ctaDistance: 'Se avstand fra E136',
    mtbTitle: 'Mountainbike-ruter i Lesja',
    mtbIntro: 'Se turforslag, kart og oppdatert ruteinformasjon for sykling i Lesja hos Outdooractive.',
    mtbCta: 'Åpne sykkelruter hos Outdooractive',
  },
  en: {
    imageAlt: 'Sign for Bjorli Aktivitetspark showing cycling, skating, shelter, playground and ball games.',
    parkTitle: 'Bjorli Aktivitetspark',
    parkParagraphs: [
      'Bjorli Aktivitetspark is a low-key activity area for the whole family — a natural fit alongside cycling and active days in Bjorli.',
      'In June 2026 the park opened a new asphalt pump track. It works well for kids, teens and adults who want to practice balance, flow and bike handling in a fun, safe setting.',
      'The park sits roughly 850 metres from the E136 and is easy to find once you’re in Bjorli.',
    ],
    practicalTitle: 'Good to know',
    practicalItems: [
      'New asphalt pump track, opened June 2026',
      'About 850 metres from the E136',
      'Works for cycling, play and active families',
    ],
    ctaFacebook: 'See Bjorli Aktivitetspark on Facebook',
    ctaMaps: 'Open in Google Maps',
    ctaDistance: 'See distance from the E136',
    mtbTitle: 'Mountain biking trails in Lesja',
    mtbIntro: 'Find route ideas, maps and up-to-date cycling information for Lesja on Outdooractive.',
    mtbCta: 'Open cycling routes on Outdooractive',
  },
  de: {
    imageAlt: 'Schild des Bjorli Aktivitetspark mit Fahrrad, Schlittschuhen, Schutzhütte, Spielgeräten und Ballspielen.',
    parkTitle: 'Bjorli Aktivitetspark',
    parkParagraphs: [
      'Der Bjorli Aktivitetspark ist ein unkomplizierter Aktivitätsbereich für die ganze Familie und passt gut zu Radfahren und aktiven Tagen in Bjorli.',
      'Im Juni 2026 wurde im Park ein neuer asphaltierter Pumptrack eröffnet. Er eignet sich für Kinder, Jugendliche und Erwachsene, die Balance, Flow und Fahrtechnik auf spielerische und sichere Weise üben möchten.',
      'Der Park liegt rund 850 Meter von der E136 entfernt und ist von Bjorli aus leicht zu finden.',
    ],
    practicalTitle: 'Gut zu wissen',
    practicalItems: [
      'Neuer asphaltierter Pumptrack, eröffnet im Juni 2026',
      'Etwa 850 Meter von der E136 entfernt',
      'Passend für Radfahren, Spielen und aktive Familien',
    ],
    ctaFacebook: 'Bjorli Aktivitetspark auf Facebook ansehen',
    ctaMaps: 'In Google Maps öffnen',
    ctaDistance: 'Entfernung zur E136 ansehen',
    mtbTitle: 'Mountainbike-Routen in Lesja',
    mtbIntro: 'Entdecke Routenvorschläge, Karten und aktuelle Informationen zum Radfahren in Lesja bei Outdooractive.',
    mtbCta: 'Radrouten bei Outdooractive öffnen',
  },
  nl: {
    imageAlt: 'Bord van Bjorli Aktivitetspark met fiets, schaatsen, schuilhut, speeltoestellen en balspelen.',
    parkTitle: 'Bjorli Aktivitetspark',
    parkParagraphs: [
      'Bjorli Aktivitetspark is een laagdrempelig activiteitenterrein voor het hele gezin en sluit goed aan op fietsen en actieve dagen in Bjorli.',
      'In juni 2026 opende het park een nieuwe geasfalteerde pumptrack. Geschikt voor kinderen, tieners en volwassenen die balans, flow en stuurtechniek op een leuke en veilige manier willen oefenen.',
      'Het park ligt op zo’n 850 meter van de E136 en is vanuit Bjorli makkelijk te vinden.',
    ],
    practicalTitle: 'Praktisch',
    practicalItems: [
      'Nieuwe geasfalteerde pumptrack, geopend juni 2026',
      'Ongeveer 850 meter van de E136',
      'Geschikt voor fietsen, spelen en actieve gezinnen',
    ],
    ctaFacebook: 'Bekijk Bjorli Aktivitetspark op Facebook',
    ctaMaps: 'Openen in Google Maps',
    ctaDistance: 'Bekijk de afstand tot de E136',
    mtbTitle: 'Mountainbikeroutes in Lesja',
    mtbIntro: 'Bekijk route-ideeën, kaarten en actuele fietsinformatie voor Lesja op Outdooractive.',
    mtbCta: 'Open fietsroutes op Outdooractive',
  },
  da: {
    imageAlt: 'Skilt til Bjorli Aktivitetspark med cykel, skøjter, shelter, legeredskaber og boldaktiviteter.',
    parkTitle: 'Bjorli Aktivitetspark',
    parkParagraphs: [
      'Bjorli Aktivitetspark er et uformelt aktivitetsområde for hele familien — passer godt sammen med cykling og aktive dage på Bjorli.',
      'I juni 2026 åbnede parken en ny asfalteret pumptrack. Den passer til børn, unge og voksne, der vil øve balance, flow og cykelteknik på en sjov og tryg måde.',
      'Parken ligger omkring 850 meter fra E136 og er nem at finde, når du er på Bjorli.',
    ],
    practicalTitle: 'Praktisk',
    practicalItems: [
      'Ny asfalteret pumptrack, åbnet juni 2026',
      'Ca. 850 meter fra E136',
      'Passer til cykling, leg og aktive familier',
    ],
    ctaFacebook: 'Se Bjorli Aktivitetspark på Facebook',
    ctaMaps: 'Åbn i Google Maps',
    ctaDistance: 'Se afstand fra E136',
    mtbTitle: 'Mountainbike-ruter i Lesja',
    mtbIntro: 'Se turforslag, kort og opdateret ruteinformation for cykling i Lesja hos Outdooractive.',
    mtbCta: 'Åbn cykelruter hos Outdooractive',
  },
  sv: {
    imageAlt: 'Skylt till Bjorli Aktivitetspark med cykel, skridskor, vindskydd, lekredskap och bollaktiviteter.',
    parkTitle: 'Bjorli Aktivitetspark',
    parkParagraphs: [
      'Bjorli Aktivitetspark är ett enkelt aktivitetsområde för hela familjen och passar bra ihop med cykling och aktiva dagar på Bjorli.',
      'I juni 2026 öppnade parken en ny asfalterad pumptrack. Den fungerar för barn, ungdomar och vuxna som vill öva balans, flow och cykelteknik på ett roligt och tryggt sätt.',
      'Parken ligger omkring 850 meter från E136 och är lätt att hitta när du är på Bjorli.',
    ],
    practicalTitle: 'Praktiskt',
    practicalItems: [
      'Ny asfalterad pumptrack, öppnad juni 2026',
      'Cirka 850 meter från E136',
      'Passar för cykling, lek och aktiva familjer',
    ],
    ctaFacebook: 'Se Bjorli Aktivitetspark på Facebook',
    ctaMaps: 'Öppna i Google Maps',
    ctaDistance: 'Se avstånd från E136',
    mtbTitle: 'Mountainbikeleder i Lesja',
    mtbIntro: 'Se turförslag, kartor och uppdaterad ruttinformation för cykling i Lesja hos Outdooractive.',
    mtbCta: 'Öppna cykelleder hos Outdooractive',
  },
};

const OutdooractiveMtbSection = ({ t }: { t: Copy }) => {
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
            {t.mtbTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-5">{t.mtbIntro}</p>
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background text-foreground text-sm font-medium">
            {t.mtbCta}
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      </div>
    </section>
  );
};

const Sykling = () => {
  const t = usePageCopy(COPY);
  return (
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
                  alt={t.imageAlt}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Text + card + links */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  {t.parkTitle}
                </h2>
                <div className="space-y-4 text-foreground/80 leading-relaxed">
                  <p>{t.parkParagraphs[0]}</p>
                  <p>{t.parkParagraphs[1]}</p>
                  <p className="text-muted-foreground">{t.parkParagraphs[2]}</p>
                </div>
              </div>

              {/* Praktisk card */}
              <Card className="bg-card/60 backdrop-blur border-border/60">
                <CardContent className="p-5 md:p-6">
                  <h3 className="font-display text-lg font-semibold mb-3">{t.practicalTitle}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {t.practicalItems.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
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
                  {t.ctaFacebook}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://maps.app.goo.gl/2USby3m7hXeXS7Y58"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm font-medium"
                >
                  {t.ctaMaps}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://maps.app.goo.gl/HZZiAXgnyDxXQz9h7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm font-medium"
                >
                  {t.ctaDistance}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
          </section>
          <OutdooractiveMtbSection t={t} />
        </>
      }
    />
  );
};

export default Sykling;
