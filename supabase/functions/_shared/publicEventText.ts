// Pure, runtime-agnostic rules for which text an event shows publicly.
// Shared by the list-approved-events function and its tests.

export interface EventTextRow {
  language: string;
  title: string;
  summary: string | null;
  description: string | null;
  english_draft_title?: string | null;
  english_draft_summary?: string | null;
  english_draft_description?: string | null;
  english_approved?: boolean | null;
}

const filled = (v: string | null | undefined): v is string =>
  typeof v === 'string' && v.trim().length > 0;

/** True when an editor has approved a usable English version. */
export function hasApprovedEnglish(r: EventTextRow): boolean {
  return r.english_approved === true &&
    (filled(r.english_draft_title) || r.language === 'en') &&
    (filled(r.english_draft_description) || r.language === 'en');
}

/**
 * Text for a requested public language. Only an approved English version is
 * ever used; every missing field falls back to the original. Non-English
 * requests always get the original text unchanged.
 */
export function publicEventText(r: EventTextRow, lang: string) {
  const original = { title: r.title, summary: r.summary ?? null, description: r.description ?? null };
  if (lang !== 'en' || !hasApprovedEnglish(r)) return original;
  return {
    title: filled(r.english_draft_title) ? r.english_draft_title : original.title,
    summary: filled(r.english_draft_summary) ? r.english_draft_summary : original.summary,
    description: filled(r.english_draft_description) ? r.english_draft_description : original.description,
  };
}

/** Whether a row belongs in the public listing for `lang`. */
export function includeForLanguage(r: EventTextRow, lang: string): boolean {
  if (r.language === lang) return true;
  return lang === 'en' && r.language === 'no' && hasApprovedEnglish(r);
}
