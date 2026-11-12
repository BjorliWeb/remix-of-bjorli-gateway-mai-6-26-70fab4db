/** Editor-side rules for the English version of an event submission. */

export interface EnglishFields { title: string; summary: string; description: string }

export interface EnglishSource {
  language: string;
  title: string; summary: string | null; description: string;
  english_draft_title: string | null;
  english_draft_summary: string | null;
  english_draft_description: string | null;
}

/** AI modes whose result is written into the English fields. */
export const ENGLISH_AI_MODES = ['translate_en', 'shorten_en', 'improve_intro_en', 'editorial_en'] as const;
export const isEnglishAiMode = (m: string) => (ENGLISH_AI_MODES as readonly string[]).includes(m);

/** Values the editor sees: saved English, or the original when submitted in English. */
export function initialEnglishFields(s: EnglishSource): EnglishFields {
  const en = s.language === 'en';
  return {
    title: s.english_draft_title ?? (en ? s.title : ''),
    summary: s.english_draft_summary ?? (en ? s.summary ?? '' : ''),
    description: s.english_draft_description ?? (en ? s.description : ''),
  };
}

const norm = (v: string) => (v.trim() ? v.trim() : null);

/** A manual save keeps the text and always withdraws any earlier approval. */
export function buildEnglishSaveUpdate(f: EnglishFields) {
  return {
    english_draft_title: norm(f.title),
    english_draft_summary: norm(f.summary),
    english_draft_description: norm(f.description),
    english_approved: false,
    english_approved_at: null,
  };
}

/** True when saved English text exists that a regeneration would replace. */
export function hasSavedEnglish(s: EnglishSource): boolean {
  return [s.english_draft_title, s.english_draft_summary, s.english_draft_description]
    .some((v) => typeof v === 'string' && v.trim().length > 0);
}

export const needsRegenerateConfirm = (s: EnglishSource, unsavedChanges: boolean) =>
  unsavedChanges || hasSavedEnglish(s);

/**
 * Update from an AI response. English fields are only touched for English
 * modes, only the fields the AI returned are replaced, and approval resets.
 */
export function buildAiUpdate(mode: string, data: Record<string, unknown> | null | undefined) {
  const out: Record<string, string | boolean | null> = {};
  if (!data) return out;
  const str = (k: string) => (typeof data[k] === 'string' && (data[k] as string).trim() ? (data[k] as string) : null);
  if (str('summary')) out.ai_polished_summary = str('summary');
  if (str('description')) out.ai_polished_description = str('description');
  if (str('seoTitle')) out.ai_seo_title = str('seoTitle');
  if (str('seoMeta')) out.ai_seo_meta = str('seoMeta');
  if (str('qualityFlag')) out.ai_quality_notes = str('qualityFlag');
  if (isEnglishAiMode(mode)) {
    let touched = false;
    if (str('englishTitle')) { out.english_draft_title = str('englishTitle'); touched = true; }
    if (str('englishSummary')) { out.english_draft_summary = str('englishSummary'); touched = true; }
    if (str('englishDescription')) { out.english_draft_description = str('englishDescription'); touched = true; }
    if (touched) { out.english_approved = false; out.english_approved_at = null; }
  }
  return out;
}
