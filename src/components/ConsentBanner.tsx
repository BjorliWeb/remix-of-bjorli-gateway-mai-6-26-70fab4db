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
 * - No third-party CMP. Norwegian / English copy only in this pass;
 *   other locales fall back to English.
 */
const STORAGE_KEY = 'bjorli_consent_v1';

type Choice = 'accepted' | 'declined';

const COPY: Record<string, { title: string; body: string; accept: string; decline: string }> = {
  no: {
    title: 'Vi bruker informasjonskapsler',
    body: 'Vi bruker nødvendige informasjonskapsler for at nettsiden skal fungere. Analysecookies brukes bare hvis du godtar det.',
    accept: 'Godta analyse',
    decline: 'Avslå analyse',
  },
  en: {
    title: 'We use cookies',
    body: 'We use necessary cookies to make the website work. Analytics cookies are used only if you accept them.',
    accept: 'Accept analytics',
    decline: 'Decline analytics',
  },
};

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
      <p className="text-xs text-muted-foreground leading-snug mb-3">{copy.body}</p>
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