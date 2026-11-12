import { describe, expect, it } from 'vitest';
import {
  buildAiUpdate, buildEnglishSaveUpdate, initialEnglishFields, needsRegenerateConfirm,
} from './englishText';
import { includeForLanguage, publicEventText } from '../../../supabase/functions/_shared/publicEventText';

const no = {
  language: 'no', title: 'Quiz', summary: 'Ingress', description: 'Beskrivelse',
  english_draft_title: 'Quiz night', english_draft_summary: 'Intro', english_draft_description: 'Manual EN',
};

describe('English text editing', () => {
  it('manual save keeps text and withdraws approval', () => {
    const u = buildEnglishSaveUpdate({ title: ' Quiz night ', summary: '', description: 'Edited' });
    expect(u).toEqual({ english_draft_title: 'Quiz night', english_draft_summary: null,
      english_draft_description: 'Edited', english_approved: false, english_approved_at: null });
  });
  it('AI regeneration replaces only returned fields and withdraws approval', () => {
    const u = buildAiUpdate('shorten_en', { englishDescription: 'Short' });
    expect(u).toEqual({ english_draft_description: 'Short', english_approved: false, english_approved_at: null });
  });
  it('Norwegian AI actions never touch English fields', () => {
    const u = buildAiUpdate('editorial_no', { description: 'NO', englishDescription: 'EN' });
    expect(u).toEqual({ ai_polished_description: 'NO' });
  });
  it('asks before replacing saved or unsaved English', () => {
    expect(needsRegenerateConfirm(no, false)).toBe(true);
    const empty = { ...no, english_draft_title: null, english_draft_summary: null, english_draft_description: null };
    expect(needsRegenerateConfirm(empty, false)).toBe(false);
    expect(needsRegenerateConfirm(empty, true)).toBe(true);
  });
  it('English submissions start from the original text', () => {
    const en = { ...no, language: 'en', english_draft_title: null, english_draft_summary: null, english_draft_description: null };
    expect(initialEnglishFields(en)).toEqual({ title: 'Quiz', summary: 'Ingress', description: 'Beskrivelse' });
  });
});

describe('public English text', () => {
  it('uses saved English only when approved', () => {
    expect(publicEventText({ ...no, english_approved: true }, 'en').description).toBe('Manual EN');
    expect(includeForLanguage({ ...no, english_approved: false }, 'en')).toBe(false);
    expect(includeForLanguage({ ...no, english_approved: true }, 'en')).toBe(true);
  });
  it('other languages keep the original', () => {
    expect(publicEventText({ ...no, english_approved: true }, 'no').title).toBe('Quiz');
    expect(includeForLanguage({ ...no, english_approved: true }, 'de')).toBe(false);
  });
  it('English submission falls back to original per missing field', () => {
    const r = { ...no, language: 'en', english_draft_title: null, english_approved: true };
    expect(publicEventText(r, 'en')).toEqual({ title: 'Quiz', summary: 'Intro', description: 'Manual EN' });
    expect(publicEventText({ ...r, english_approved: false }, 'en').description).toBe('Beskrivelse');
  });
});
