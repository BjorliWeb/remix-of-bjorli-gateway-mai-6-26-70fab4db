import { z } from 'zod';
import { EVENT_CATEGORY_KEYS } from '@/lib/eventCategories';

/** Limits mirror supabase/functions/submit-event so an edit can never store
 *  what the public form would reject. */
export const MAX_IMAGES = 5;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const optionalText = (max: number) =>
  z.string().trim().max(max).transform((v) => (v === '' ? null : v));

export const submissionEditSchema = z
  .object({
    title: z.string().trim().min(3, 'Minst 3 tegn').max(160, 'Maks 160 tegn'),
    summary: optionalText(280),
    description: z.string().trim().min(20, 'Minst 20 tegn').max(4000, 'Maks 4000 tegn'),
    organizer: z.string().trim().min(2, 'Minst 2 tegn').max(160, 'Maks 160 tegn'),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Velg en dato'),
    end_date: z
      .string()
      .refine((v) => v === '' || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Ugyldig dato')
      .transform((v) => (v === '' ? null : v)),
    time_text: optionalText(120),
    location: z.string().trim().min(2, 'Minst 2 tegn').max(240, 'Maks 240 tegn'),
    maps_url: optionalText(500),
    website: optionalText(500),
    category: z.enum(EVENT_CATEGORY_KEYS as [string, ...string[]], {
      errorMap: () => ({ message: 'Velg kategori' }),
    }),
  })
  .refine((v) => !v.end_date || v.end_date >= v.start_date, {
    path: ['end_date'],
    message: 'Sluttdato kan ikke være før startdato',
  });

export type SubmissionEditInput = z.input<typeof submissionEditSchema>;
export type SubmissionEditValues = z.output<typeof submissionEditSchema>;

/** The only columns an ordinary edit may write. Status, review fields,
 *  submitter data and consent are deliberately absent. */
export const EDITABLE_COLUMNS = [
  'title', 'summary', 'description', 'organizer', 'start_date', 'end_date',
  'time_text', 'location', 'maps_url', 'website', 'category', 'image_urls',
] as const;

export function buildEditUpdate(values: SubmissionEditValues, imageUrls: string[]) {
  const update: Record<string, unknown> = { ...values, image_urls: imageUrls };
  for (const key of Object.keys(update)) {
    if (!(EDITABLE_COLUMNS as readonly string[]).includes(key)) delete update[key];
  }
  return update;
}

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return 'Bare JPG, PNG eller WebP';
  }
  if (file.size > MAX_IMAGE_BYTES) return 'Bildet er større enn 8 MB';
  return null;
}

/** Paths removed by this edit that no other submission still references.
 *  Only these may be deleted, and only after the row has been saved. */
export function removablePaths(
  before: string[],
  after: string[],
  referencedElsewhere: Set<string>,
): string[] {
  return before.filter((p) => !after.includes(p) && !referencedElsewhere.has(p));
}

export function editorUploadPath(submissionId: string, fileName: string, rand: string): string {
  const ext = (fileName.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  return `editor/${submissionId}/${rand}.${ext || 'jpg'}`;
}
