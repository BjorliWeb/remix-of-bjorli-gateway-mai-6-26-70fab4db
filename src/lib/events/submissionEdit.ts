import { z } from 'zod';
import { MAX_EVENT_CATEGORIES, normalizeCategories } from '@/lib/eventCategories';
import { isHttpUrl, MAX_LINK_LENGTH, normalizeHttpUrl } from '@/lib/events/httpUrl';

/** Limits mirror supabase/functions/submit-event so an edit can never store
 *  what the public form would reject. */
export const MAX_IMAGES = 5;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const optionalText = (max: number) =>
  z.string().trim().max(max).transform((v) => (v === '' ? null : v));

/** Optional link: '' → null; otherwise a normalised http(s) URL (www.x.no
 *  becomes https://www.x.no/). javascript:, data: etc. are rejected. */
export const LINK_ERROR = 'Bruk en gyldig lenke som starter med http:// eller https://';
const optionalLink = z
  .string()
  .trim()
  .max(MAX_LINK_LENGTH, `Maks ${MAX_LINK_LENGTH} tegn`)
  .optional()
  .transform((v, ctx) => {
    // A link that is already valid is stored exactly as typed (existing
    // values are never rewritten); bare hosts get https:// added.
    if (v && isHttpUrl(v)) return v;
    const n = normalizeHttpUrl(v ?? '');
    if (n === null) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: LINK_ERROR });
      return z.NEVER;
    }
    return n === '' ? null : n;
  });

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
    maps_url: optionalLink,
    website: optionalLink,
    ticket_url: optionalLink,
    registration_url: optionalLink,
    categories: z
      .array(z.string().trim().min(1).max(80))
      .transform((v) => normalizeCategories(v))
      .refine((v) => v.length >= 1, 'Velg minst én kategori')
      .refine((v) => v.length <= MAX_EVENT_CATEGORIES, `Velg høyst ${MAX_EVENT_CATEGORIES} kategorier`),
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
  'time_text', 'location', 'maps_url', 'website', 'ticket_url', 'registration_url',
  'category', 'categories', 'image_urls',
] as const;

/** Optional action-link columns (migration 0005). */
const ACTION_LINK_COLUMNS = ['ticket_url', 'registration_url'] as const;

export function buildEditUpdate(
  values: SubmissionEditValues,
  imageUrls: string[],
  before?: Partial<Record<(typeof ACTION_LINK_COLUMNS)[number], string | null>>,
) {
  // `category` is the compatibility field and always mirrors the first choice.
  const update: Record<string, unknown> = {
    ...values,
    category: values.categories[0],
    image_urls: imageUrls,
  };
  for (const key of Object.keys(update)) {
    if (!(EDITABLE_COLUMNS as readonly string[]).includes(key)) delete update[key];
  }
  // Action links are written only when they change, so ordinary edits keep
  // working on a database that does not have the columns yet.
  if (before) {
    for (const key of ACTION_LINK_COLUMNS) {
      if ((update[key] ?? null) === (before[key] ?? null)) delete update[key];
    }
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
