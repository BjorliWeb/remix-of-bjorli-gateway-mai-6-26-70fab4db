
import { Link } from 'react-router-dom';
import SubPage from '@/components/SubPage';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLanguage } from '@/i18n/LanguageContext';

const OUTDOORACTIVE_URL = 'https://out.ac/snagt';

type Copy = {
  snarturEyebrow: string;
  snarturTitle: string;
  snarturDesc: string;
  mapTitle: string;
  mapIntro: string;
  ctaLabel: string;
};

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', Copy> = {
  no: {
    snarturEyebrow: 'Snarturer i Rauma og Lesja',
    snarturTitle: '10 korte fotturer rundt Bjorli',
    snarturDesc:
      'Lette turer med kart, parkering og høydeprofil — utviklet av Nordveggen, presentert for Bjorli.',
    mapTitle: 'Turkart for Bjorli og Lesja',
    mapIntro:
      'Se turforslag, kart og oppdatert turinformasjon hos Outdooractive.',
    ctaLabel: 'Åpne turkart hos Outdooractive',
  },
  en: {
    snarturEyebrow: 'Short walks in Rauma and Lesja',
    snarturTitle: '10 short walks around Bjorli',
    snarturDesc:
      'Easy walks with maps, parking and elevation profiles — produced by Nordveggen, presented for Bjorli.',
    mapTitle: 'Trail map for Bjorli and Lesja',
    mapIntro:
      'See route suggestions, maps and up-to-date trail information on Outdooractive.',
    ctaLabel: 'Open trail map on Outdooractive',
  },
  de: {
    snarturEyebrow: 'Kurzwanderungen in Rauma und Lesja',
    snarturTitle: '10 kurze Wanderungen rund um Bjorli',
    snarturDesc:
      'Leichte Touren mit Karte, Parkplatz und Höhenprofil — erstellt von Nordveggen, präsentiert für Bjorli.',
    mapTitle: 'Wanderkarte für Bjorli und Lesja',
    mapIntro:
      'Tourenvorschläge, Karten und aktuelle Wanderinformationen auf Outdooractive ansehen.',
    ctaLabel: 'Wanderkarte auf Outdooractive öffnen',
  },
  nl: {
    snarturEyebrow: 'Korte wandelingen in Rauma en Lesja',
    snarturTitle: '10 korte wandelingen rond Bjorli',
    snarturDesc:
      'Eenvoudige wandelingen met kaart, parkeerinfo en hoogteprofiel — samengesteld door Nordveggen, gepresenteerd voor Bjorli.',
    mapTitle: 'Wandelkaart voor Bjorli en Lesja',
    mapIntro:
      'Bekijk wandelsuggesties, kaarten en actuele route-informatie op Outdooractive.',
    ctaLabel: 'Wandelkaart openen op Outdooractive',
  },
  da: {
    snarturEyebrow: 'Korte ture i Rauma og Lesja',
    snarturTitle: '10 korte vandreture omkring Bjorli',
    snarturDesc:
      'Lette ture med kort, parkering og højdeprofil — udviklet af Nordveggen, præsenteret for Bjorli.',
    mapTitle: 'Vandrekort for Bjorli og Lesja',
    mapIntro:
      'Se turforslag, kort og opdateret turinformation hos Outdooractive.',
    ctaLabel: 'Åbn vandrekort hos Outdooractive',
  },
  sv: {
    snarturEyebrow: 'Korta turer i Rauma och Lesja',
    snarturTitle: '10 korta vandringar runt Bjorli',
    snarturDesc:
      'Lätta turer med karta, parkering och höjdprofil — framtagna av Nordveggen, presenterade för Bjorli.',
    mapTitle: 'Vandringskarta för Bjorli och Lesja',
    mapIntro:
      'Se turförslag, kartor och aktuell turinformation hos Outdooractive.',
    ctaLabel: 'Öppna vandringskartan hos Outdooractive',
  },
};

const OutdooractiveMapSection = ({ t }: { t: Copy }) => {
  return (
    <section className="pb-16 md:pb-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <a
          href={OUTDOORACTIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors p-6 md:p-8"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2 group-hover:text-secondary transition-colors">
            {t.mapTitle}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mb-5">{t.mapIntro}</p>
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-background text-foreground text-sm font-medium">
            {t.ctaLabel}
          </span>
        </a>
      </div>
    </section>
  );
};

const Fotturer = () => {
  const t = usePageCopy(COPY);
  const { locale } = useLanguage();

  return (
    <SubPage
      slug="fotturer"
      afterIntro={
        <>
          {/* Snartur teaser links to a Norwegian-only page; only show on the NO source. */}
          {locale === 'no' && (
            <section className="pt-12 md:pt-16 pb-4 px-4">
              <div className="container mx-auto max-w-5xl">
                <Link
                  to="/sommer/korte-turer"
                  className="group block rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors p-6 md:p-8"
                >
                  <div className="text-secondary text-[11px] font-medium tracking-[0.22em] uppercase mb-3">
                    {t.snarturEyebrow}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-2 group-hover:text-secondary transition-colors">
                    {t.snarturTitle}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-2xl">{t.snarturDesc}</p>
                </Link>
              </div>
            </section>
          )}
          <OutdooractiveMapSection t={t} />
        </>
      }
    />
  );
};

export default Fotturer;
