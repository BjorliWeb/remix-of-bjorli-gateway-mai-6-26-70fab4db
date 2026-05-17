import { useState } from 'react';
import { Link } from 'react-router-dom';
import SubPage from '@/components/SubPage';
import { usePageCopy } from '@/i18n/usePageCopy';
import { useLanguage } from '@/i18n/LanguageContext';

const OUTDOORACTIVE_URL = 'https://no.outdooractive.com/oar-lesja-kommune/';

type Copy = {
  snarturEyebrow: string;
  snarturTitle: string;
  snarturDesc: string;
  mapTitle: string;
  mapIntro: string;
  mapError: string;
  openInNewWindow: string;
};

const COPY: Record<'no' | 'en' | 'de' | 'nl' | 'da' | 'sv', Copy> = {
  no: {
    snarturEyebrow: 'Snarturer i Rauma og Lesja',
    snarturTitle: '10 korte fotturer rundt Bjorli',
    snarturDesc:
      'Lette turer med kart, parkering og høydeprofil — utviklet av Nordveggen, presentert for Bjorli.',
    mapTitle: 'Turkart for Bjorli og Lesja',
    mapIntro:
      'Utforsk turforslag, ruter og nærområder rundt Bjorli, Lesja og fjellområdene rundt.',
    mapError: 'Kartet kunne ikke lastes inn her.',
    openInNewWindow: 'Åpne turkart i nytt vindu',
  },
  en: {
    snarturEyebrow: 'Short walks in Rauma and Lesja',
    snarturTitle: '10 short walks around Bjorli',
    snarturDesc:
      'Easy walks with maps, parking and elevation profiles — produced by Nordveggen, presented for Bjorli.',
    mapTitle: 'Trail map for Bjorli and Lesja',
    mapIntro:
      'Explore walk suggestions, routes and the area around Bjorli, Lesja and the surrounding mountains.',
    mapError: 'The map could not be loaded here.',
    openInNewWindow: 'Open trail map in a new window',
  },
  de: {
    snarturEyebrow: 'Kurzwanderungen in Rauma und Lesja',
    snarturTitle: '10 kurze Wanderungen rund um Bjorli',
    snarturDesc:
      'Leichte Touren mit Karte, Parkplatz und Höhenprofil — erstellt von Nordveggen, präsentiert für Bjorli.',
    mapTitle: 'Wanderkarte für Bjorli und Lesja',
    mapIntro:
      'Entdecken Sie Tourenvorschläge, Routen und die Umgebung von Bjorli, Lesja und den umliegenden Bergen.',
    mapError: 'Die Karte konnte hier nicht geladen werden.',
    openInNewWindow: 'Wanderkarte in neuem Fenster öffnen',
  },
  nl: {
    snarturEyebrow: 'Korte wandelingen in Rauma en Lesja',
    snarturTitle: '10 korte wandelingen rond Bjorli',
    snarturDesc:
      'Eenvoudige wandelingen met kaart, parkeerinfo en hoogteprofiel — samengesteld door Nordveggen, gepresenteerd voor Bjorli.',
    mapTitle: 'Wandelkaart voor Bjorli en Lesja',
    mapIntro:
      'Bekijk wandelsuggesties, routes en de omgeving van Bjorli, Lesja en de bergen daaromheen.',
    mapError: 'De kaart kon hier niet worden geladen.',
    openInNewWindow: 'Wandelkaart in nieuw venster openen',
  },
  da: {
    snarturEyebrow: 'Korte ture i Rauma og Lesja',
    snarturTitle: '10 korte vandreture omkring Bjorli',
    snarturDesc:
      'Lette ture med kort, parkering og højdeprofil — udviklet af Nordveggen, præsenteret for Bjorli.',
    mapTitle: 'Vandrekort for Bjorli og Lesja',
    mapIntro:
      'Udforsk turforslag, ruter og områderne omkring Bjorli, Lesja og de omkringliggende fjelde.',
    mapError: 'Kortet kunne ikke indlæses her.',
    openInNewWindow: 'Åbn vandrekort i nyt vindue',
  },
  sv: {
    snarturEyebrow: 'Korta turer i Rauma och Lesja',
    snarturTitle: '10 korta vandringar runt Bjorli',
    snarturDesc:
      'Lätta turer med karta, parkering och höjdprofil — framtagna av Nordveggen, presenterade för Bjorli.',
    mapTitle: 'Vandringskarta för Bjorli och Lesja',
    mapIntro:
      'Utforska turförslag, leder och områdena runt Bjorli, Lesja och fjällen omkring.',
    mapError: 'Kartan kunde inte laddas här.',
    openInNewWindow: 'Öppna vandringskartan i nytt fönster',
  },
};

const OutdooractiveMapSection = ({ t }: { t: Copy }) => {
  const [failed, setFailed] = useState(false);

  return (
    <section className="pb-16 md:pb-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 md:mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">{t.mapTitle}</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">{t.mapIntro}</p>
        </div>

        {!failed ? (
          <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
            <iframe
              src={`${OUTDOORACTIVE_URL}?embed=1`}
              title={t.mapTitle}
              loading="lazy"
              allowFullScreen
              onError={() => setFailed(true)}
              className="w-full block border-0 h-[600px] md:h-[800px]"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            {t.mapError}
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <a
            href={OUTDOORACTIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm font-medium"
          >
            {t.openInNewWindow}
          </a>
        </div>
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
