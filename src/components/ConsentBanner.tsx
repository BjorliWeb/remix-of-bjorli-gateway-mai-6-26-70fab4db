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
  { title: string; body: string; later: string; privacy: string; accept: string; decline: string }
> = {
  no: {
    title: 'Vi bruker informasjonskapsler',
    body: 'Vi bruker informasjonskapsler for å forbedre nettstedet og forstå hvordan det brukes. Analyseverktøy aktiveres bare dersom du samtykker.',
    later: 'Du kan endre valget når som helst via «Cookies» i bunnmenyen. Les mer i ',
    privacy: 'Personvern',
    accept: 'Godta analyse',
    decline: 'Avslå analyse',
  },
  en: {
    title: 'We use cookies',
    body: 'We use cookies to improve the website and understand how it is used. Analytics tools are only activated if you consent.',
    later: 'You can change your choice at any time via "Cookies" in the footer. Read more in ',
    privacy: 'Privacy',
    accept: 'Accept analytics',
    decline: 'Decline analytics',
  },
  de: {
    title: 'Wir verwenden Cookies',
    body: 'Wir verwenden Cookies, um die Website zu verbessern und zu verstehen, wie sie genutzt wird. Analyse-Tools werden nur mit deiner Zustimmung aktiviert.',
    later: 'Du kannst deine Wahl jederzeit über „Cookies“ in der Fußzeile ändern. Mehr dazu in ',
    privacy: 'Datenschutz',
    accept: 'Analyse akzeptieren',
    decline: 'Analyse ablehnen',
  },
  nl: {
    title: 'We gebruiken cookies',
    body: 'We gebruiken cookies om de website te verbeteren en te begrijpen hoe deze wordt gebruikt. Analysetools worden alleen geactiveerd als je toestemming geeft.',
    later: 'Je kunt je keuze altijd wijzigen via "Cookies" in de footer. Lees meer in ',
    privacy: 'Privacy',
    accept: 'Analyse accepteren',
    decline: 'Analyse weigeren',
  },
  da: {
    title: 'Vi bruger cookies',
    body: 'Vi bruger cookies for at forbedre websitet og forstå, hvordan det bruges. Analyseværktøjer aktiveres kun, hvis du giver samtykke.',
    later: 'Du kan ændre dit valg når som helst via "Cookies" i sidefoden. Læs mere i ',
    privacy: 'Privatliv',
    accept: 'Accepter analyse',
    decline: 'Afvis analyse',
  },
  sv: {
    title: 'Vi använder cookies',
    body: 'Vi använder cookies för att förbättra webbplatsen och förstå hur den används. Analysverktyg aktiveras endast om du samtycker.',
    later: 'Du kan ändra ditt val när som helst via "Cookies" i sidfoten. Läs mer i ',
    privacy: 'Integritet',
    accept: 'Acceptera analys',
    decline: 'Avvisa analys',
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

  useEffect(() => {
    const existing = readChoice();
    if (existing === 'accepted') setAnalyticsConsent(true);
    else if (existing === 'declined') setAnalyticsConsent(false);
    else setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener('bjorli:open-consent', reopen);
    return () => window.removeEventListener('bjorli:open-consent', reopen);
  }, []);

  if (!open) return null;

  const copy = COPY[locale] ?? COPY.en;

  const handle = (choice: Choice) => {
    writeChoice(choice);
    setAnalyticsConsent(choice === 'accepted');
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={copy.title}
      className="fixed bottom-3 left-3 right-3 z-50 rounded-xl border border-border bg-card/95 backdrop-blur p-3 shadow-xl sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-sm sm:p-4"
    >
      <div className="text-xs font-semibold text-foreground mb-1">{copy.title}</div>
      <p className="text-xs text-muted-foreground leading-snug mb-1">{copy.body}</p>
      <p className="text-[11px] text-muted-foreground leading-snug mb-3">
        {copy.later}{' '}
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          {copy.privacy}
        </a>
        .
      </p>
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          onClick={() => handle('declined')}
          className="px-3 py-1.5 rounded-full text-xs border border-border hover:bg-muted transition-colors"
        >
          {copy.decline}
        </button>
        <button
          type="button"
          onClick={() => handle('accepted')}
          className="px-3 py-1.5 rounded-full text-xs bg-season text-season-foreground hover:opacity-90 transition-opacity"
        >
          {copy.accept}
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;