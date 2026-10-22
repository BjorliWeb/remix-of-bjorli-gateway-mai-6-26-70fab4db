import { describe, it, expect } from 'vitest';
import {
  buildEditUpdate, editorUploadPath, removablePaths, submissionEditSchema, validateImageFile,
} from './submissionEdit';

const base = {
  title: 'Pumptrack-dag', summary: '', description: 'En lang nok beskrivelse her.',
  organizer: 'Bjorli', start_date: '2026-11-01', end_date: '', time_text: '',
  location: 'Bjorli', maps_url: '', website: '', category: 'sykkel',
};

describe('submission edit', () => {
  it('never writes status, review or submitter fields', () => {
    const values = submissionEditSchema.parse({ ...base, status: 'approved', reviewed_by: 'x', email: 'a@b.no' } as never);
    const update = buildEditUpdate(values, ['uploads/t/a.jpg']);
    expect(update).not.toHaveProperty('status');
    expect(update).not.toHaveProperty('reviewed_by');
    expect(update).not.toHaveProperty('email');
    expect(update.image_urls).toEqual(['uploads/t/a.jpg']);
  });

  it('rejects an end date before the start date', () => {
    expect(submissionEditSchema.safeParse({ ...base, end_date: '2026-10-31' }).success).toBe(false);
  });

  it('rejects a description under 20 characters', () => {
    expect(submissionEditSchema.safeParse({ ...base, description: 'kort' }).success).toBe(false);
  });

  it('rejects images over 8 MB and non-image types', () => {
    expect(validateImageFile({ type: 'image/jpeg', size: 8 * 1024 * 1024 + 1 })).not.toBeNull();
    expect(validateImageFile({ type: 'application/pdf', size: 10 })).not.toBeNull();
    expect(validateImageFile({ type: 'image/webp', size: 10 })).toBeNull();
  });

  it('only deletes removed files that no other submission uses', () => {
    expect(removablePaths(['a', 'b', 'c'], ['a'], new Set(['c']))).toEqual(['b']);
  });

  it('puts editor uploads in the submission folder', () => {
    expect(editorUploadPath('abc', 'Foto.JPG', 'r1')).toBe('editor/abc/r1.jpg');
  });
});
