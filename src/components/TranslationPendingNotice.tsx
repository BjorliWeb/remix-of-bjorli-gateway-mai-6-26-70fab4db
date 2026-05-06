import { useLanguage } from '@/i18n/LanguageContext';

/**
 * Non-intrusive placeholder shown when a CMS entry is being viewed in a
 * non-Norwegian locale but has not yet been translated.
 *
 * Visibility rules:
 *  - Hidden when the active locale is `no` (Norwegian is the source).
 *  - Hidden when `translated` prop is true (a real translation exists).
 *  - Hidden in production unless `VITE_SHOW_TRANSLATION_PLACEHOLDERS=1` is set.
 *    (Dev / preview always shows it so editors can see the state.)
 *
 * This is a CMS-readiness affordance, not a public production warning. Once
 * WordPress is connected and translations exist, the parent passes
 * `translated={true}` and the notice disappears.
 */
export interface TranslationPendingNoticeProps {
  /** True when the body is a real translation for the active locale. */
  translated?: boolean;
  /** Optional override for the message text (e.g. localized copy from CMS). */
  message?: string;
  className?: string;
}

const DEFAULT_MESSAGES: Record<string, string> = {
  no: 'Oversettelse pågår – innholdet vil bli hentet fra WordPress.',
  en: 'Translation pending — this content will be populated from WordPress.',
  de: 'Übersetzung ausstehend – dieser Inhalt wird aus WordPress geladen.',
  nl: 'Vertaling in behandeling — deze inhoud wordt geladen vanuit WordPress.',
  da: 'Oversættelse afventer – dette indhold hentes fra WordPress.',
  sv: 'Översättning väntar – innehållet kommer att hämtas från WordPress.',
};

const isVisibilityEnabled = (): boolean => {
  // Always visible in dev / preview so content editors can see the state.
  if (import.meta.env.DEV) return true;
  // In production it must be opt-in via env flag.
  return import.meta.env.VITE_SHOW_TRANSLATION_PLACEHOLDERS === '1';
};

const TranslationPendingNotice = ({
  translated,
  message,
  className,
}: TranslationPendingNoticeProps) => {
  const { locale } = useLanguage();
  if (locale === 'no') return null;
  if (translated) return null;
  if (!isVisibilityEnabled()) return null;

  const text = message ?? DEFAULT_MESSAGES[locale] ?? DEFAULT_MESSAGES.en;

  return (
    <aside
      data-translation-pending
      role="note"
      aria-label="Translation status"
      className={
        className ??
        'mx-auto my-4 max-w-3xl rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 px-4 py-2 text-xs text-muted-foreground'
      }
    >
      <span aria-hidden className="mr-2">🌐</span>
      {text}
    </aside>
  );
};

export default TranslationPendingNotice;