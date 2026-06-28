import { useEffect, useState } from 'react';
import { setAnalyticsConsent } from '@/lib/analytics';
import { useLanguage } from '@/i18n/LanguageContext';

/**
 * Minimal in-house cookie consent banner.
 *
 * - Shows only when no choice is stored under `bjorli_consent_v1`.
 * - Default state is "denied" — analytics never fires until Accept.
 * - Reopens when any element dispatches `bjorli:open-consent` on `window`
 *   (wired to the existing footer "Cookies" link without changing its
 *   layout).
 * - No third-party CMP. Copy is provided for all supported locales
 *   (no, en, de, nl, da, sv); unknown locales fall back to English.
 */
const STORAGE_KEY = 'bjorli_consent_v1';

type Choice = 'accepted' | 'declined';

const COPY: Record<
  string,
  {
    title: string;
    body: string;
    readMorePrefix: string;
    privacy: string;
    accept: string;
    decline: string;
    customize: string;
    customizeTitle: string;
    necessary: string;
    necessaryDesc: string;
    analytics: string;
    analyticsDesc: string;
    back: string;
    save: string;
  }
> = {
  no: {
    title: 'Vi bruker informasjonskapsler',
    body: 'Vi bruker nødvendige cookies for at nettsiden skal fungere. Med ditt samtykke bruker vi også cookies til statistikk og forbedring av bjorli.no. Du kan godta alle, avvise alle eller tilpasse valgene dine.',
    readMorePrefix: 'Les mer i ',
    privacy: 'Personvern',
    accept: 'Godta alle',
    decline: 'Avvis alle',
    customize: 'Tilpass',
    customizeTitle: 'Tilpass cookies',
    necessary: 'Nødvendige',
    necessaryDesc: 'Trengs for at nettsiden skal fungere. Kan ikke slås av.',
    analytics: 'Statistikk',
    analyticsDesc: 'Hjelper oss å forstå hvordan bjorli.no brukes så vi kan gjøre den bedre.',
    back: 'Tilbake',
    save: 'Lagre valg',
  },
  en: {
    title: 'We use cookies',
    body: 'We use essential cookies so the site works. With your consent we also use cookies for analytics and to keep improving bjorli.no. Accept all, reject all, or tailor your choices.',
    readMorePrefix: 'Read more in our ',
    privacy: 'Privacy',
    accept: 'Accept all',
    decline: 'Reject all',
    customize: 'Customize',
    customizeTitle: 'Customize cookies',
    necessary: 'Essential',
    necessaryDesc: 'Needed for the site to work. Always on.',
    analytics: 'Analytics',
    analyticsDesc: 'Helps us see how bjorli.no is used so we can keep improving it.',
    back: 'Back',
    save: 'Save choices',
  },
  de: {
    title: 'Wir verwenden Cookies',
    body: 'Wir nutzen notwendige Cookies, damit die Seite funktioniert. Mit deiner Zustimmung verwenden wir Cookies auch für Statistiken und um bjorli.no zu verbessern. Alles akzeptieren, ablehnen oder selbst anpassen.',
    readMorePrefix: 'Mehr dazu im ',
    privacy: 'Datenschutz',
    accept: 'Alle akzeptieren',
    decline: 'Alle ablehnen',
    customize: 'Anpassen',
    customizeTitle: 'Cookies anpassen',
    necessary: 'Notwendig',
    necessaryDesc: 'Damit die Seite läuft. Lässt sich nicht abschalten.',
    analytics: 'Statistik',
    analyticsDesc: 'Zeigt uns, wie bjorli.no genutzt wird, damit wir sie verbessern können.',
    back: 'Zurück',
    save: 'Auswahl speichern',
  },
  nl: {
    title: 'We gebruiken cookies',
    body: 'We gebruiken noodzakelijke cookies zodat de site werkt. Met jouw toestemming gebruiken we ook cookies voor statistieken en om bjorli.no te verbeteren. Alles accepteren, weigeren of zelf instellen.',
    readMorePrefix: 'Lees meer in ons ',
    privacy: 'Privacy',
    accept: 'Alles accepteren',
    decline: 'Alles weigeren',
    customize: 'Aanpassen',
    customizeTitle: 'Cookies aanpassen',
    necessary: 'Noodzakelijk',
    necessaryDesc: 'Nodig om de site te laten werken. Kan niet uit.',
    analytics: 'Statistieken',
    analyticsDesc: 'Laat ons zien hoe bjorli.no gebruikt wordt, zodat we het beter kunnen maken.',
    back: 'Terug',
    save: 'Keuze opslaan',
  },
  da: {
    title: 'Vi bruger cookies',
    body: 'Vi bruger nødvendige cookies, så siden virker. Med dit samtykke bruger vi også cookies til statistik og til at forbedre bjorli.no. Accepter alle, afvis alle eller tilpas selv.',
    readMorePrefix: 'Læs mere i vores ',
    privacy: 'Privatliv',
    accept: 'Accepter alle',
    decline: 'Afvis alle',
    customize: 'Tilpas',
    customizeTitle: 'Tilpas cookies',
    necessary: 'Nødvendige',
    necessaryDesc: 'Skal til, for at siden virker. Kan ikke slås fra.',
    analytics: 'Statistik',
    analyticsDesc: 'Hjælper os med at se, hvordan bjorli.no bruges, så vi kan gøre den bedre.',
    back: 'Tilbage',
    save: 'Gem valg',
  },
  sv: {
    title: 'Vi använder cookies',
    body: 'Vi använder nödvändiga cookies för att sidan ska fungera. Med ditt samtycke använder vi också cookies för statistik och för att göra bjorli.no bättre. Acceptera alla, avvisa alla eller anpassa själv.',
    readMorePrefix: 'Läs mer i vår ',
    privacy: 'Integritet',
    accept: 'Acceptera alla',
    decline: 'Avvisa alla',
    customize: 'Anpassa',
    customizeTitle: 'Anpassa cookies',
    necessary: 'Nödvändiga',
    necessaryDesc: 'Krävs för att sidan ska fungera. Går inte att stänga av.',
    analytics: 'Statistik',
    analyticsDesc: 'Visar oss hur bjorli.no används så att vi kan göra den bättre.',
    back: 'Tillbaka',
    save: 'Spara val',
  },
};

const PRIVACY_URL = 'https://bjorli.no/personvern/';

const readChoice = (): Choice | null => {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch {
    return null;
  }
};

const writeChoice = (c: Choice): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, c);
  } catch {
    /* private mode — ignore */
  }
};

const ConsentBanner = () => {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'main' | 'customize'>('main');
  const [analyticsOn, setAnalyticsOn] = useState(false);

  useEffect(() => {
    const existing = readChoice();
    if (existing === 'accepted') setAnalyticsConsent(true);
    else if (existing === 'declined') setAnalyticsConsent(false);
    else setOpen(true);

    const reopen = () => {
      setView('main');
      setAnalyticsOn(readChoice() === 'accepted');
      setOpen(true);
    };
    window.addEventListener('bjorli:open-consent', reopen);
    return () => window.removeEventListener('bjorli:open-consent', reopen);
  }, []);

  // Lock body scroll + ESC handler while panel is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && view === 'customize') setView('main');
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, view]);

  if (!open) return null;

  const copy = COPY[locale] ?? COPY.en;

  const handle = (choice: Choice) => {
    writeChoice(choice);
    setAnalyticsConsent(choice === 'accepted');
    setOpen(false);
    setView('main');
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        className="w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-5 sm:p-6 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
      >
        {view === 'main' ? (
          <>
            <h2 id="consent-title" className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              {copy.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{copy.body}</p>
            <p className="text-xs text-muted-foreground leading-snug mb-5">
              {copy.readMorePrefix}
              <a
                href={PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium text-foreground hover:text-season"
              >
                {copy.privacy}
              </a>
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => handle('declined')}
                className="px-4 py-2.5 rounded-full text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
              >
                {copy.decline}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnalyticsOn(readChoice() === 'accepted');
                  setView('customize');
                }}
                className="px-4 py-2.5 rounded-full text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
              >
                {copy.customize}
              </button>
              <button
                type="button"
                onClick={() => handle('accepted')}
                className="px-4 py-2.5 rounded-full text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
              >
                {copy.accept}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 id="consent-title" className="text-lg sm:text-xl font-semibold text-foreground mb-4">
              {copy.customizeTitle}
            </h2>
            <div className="space-y-3 mb-5">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{copy.necessary}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{copy.necessaryDesc}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 mt-0.5">✓</span>
              </div>
              <label className="flex items-start justify-between gap-4 rounded-lg border border-border p-3 cursor-pointer">
                <div>
                  <div className="text-sm font-medium text-foreground">{copy.analytics}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{copy.analyticsDesc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={analyticsOn}
                  onChange={(e) => setAnalyticsOn(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-season shrink-0"
                />
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setView('main')}
                className="px-4 py-2.5 rounded-full text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
              >
                {copy.back}
              </button>
              <button
                type="button"
                onClick={() => handle(analyticsOn ? 'accepted' : 'declined')}
                className="px-4 py-2.5 rounded-full text-sm font-medium border border-border bg-background hover:bg-muted transition-colors"
              >
                {copy.save}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConsentBanner;