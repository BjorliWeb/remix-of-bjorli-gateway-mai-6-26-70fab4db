import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CATEGORY_LABELS, EVENT_CATEGORY_KEYS } from '@/lib/eventCategories';
import {
  MAX_IMAGES, buildEditUpdate, editorUploadPath, removablePaths, submissionEditSchema,
  validateImageFile, type SubmissionEditInput,
} from '@/lib/events/submissionEdit';

export interface EditableSubmission {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  title: string; summary: string | null; description: string; organizer: string;
  start_date: string; end_date: string | null; time_text: string | null;
  location: string; maps_url: string | null; website: string | null;
  category: string; image_urls: string[]; english_approved: boolean;
}

type FieldKey = keyof SubmissionEditInput;

const toInput = (s: EditableSubmission): SubmissionEditInput => ({
  title: s.title, summary: s.summary ?? '', description: s.description, organizer: s.organizer,
  start_date: s.start_date, end_date: s.end_date ?? '', time_text: s.time_text ?? '',
  location: s.location, maps_url: s.maps_url ?? '', website: s.website ?? '', category: s.category,
});

export function EventSubmissionEditForm({
  item, signedUrls, onCancel, onSaved, onDirtyChange,
}: {
  item: EditableSubmission;
  signedUrls: Record<string, string>;
  onCancel: () => void;
  onSaved: () => void;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const { toast } = useToast();
  const initial = useMemo(() => toInput(item), [item]);
  const [values, setValues] = useState<SubmissionEditInput>(initial);
  const [keptImages, setKeptImages] = useState<string[]>(item.image_urls);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);
  const [errors, setErrors] = useState<Partial<Record<FieldKey | 'images', string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const dirty =
    JSON.stringify(values) !== JSON.stringify(initial) ||
    keptImages.length !== item.image_urls.length ||
    newFiles.length > 0;

  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  useEffect(() => () => newFiles.forEach((f) => URL.revokeObjectURL(f.preview)), [newFiles]);

  const set = (k: FieldKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const cancel = () => {
    if (dirty && !window.confirm('Du har ulagrede endringer. Vil du forkaste dem?')) return;
    onCancel();
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...newFiles];
    for (const file of Array.from(list)) {
      const err = validateImageFile(file);
      if (err) { setErrors((x) => ({ ...x, images: `${file.name}: ${err}` })); continue; }
      if (keptImages.length + next.length >= MAX_IMAGES) {
        setErrors((x) => ({ ...x, images: `Maks ${MAX_IMAGES} bilder` })); break;
      }
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    setNewFiles(next);
  };

  const save = async () => {
    setFormError(null);
    const parsed = submissionEditSchema.safeParse(values);
    if (!parsed.success) {
      const fe: typeof errors = {};
      for (const issue of parsed.error.issues) fe[issue.path[0] as FieldKey] ??= issue.message;
      setErrors(fe);
      setFormError('Rett feltene som er markert.');
      return;
    }
    setErrors({});
    setSaving(true);
    const uploaded: string[] = [];
    try {
      for (const { file } of newFiles) {
        const path = editorUploadPath(item.id, file.name, crypto.randomUUID());
        const { error } = await supabase.storage.from('event-submissions')
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw new Error(`Bildet «${file.name}» kunne ikke lastes opp.`);
        uploaded.push(path);
      }
      const imageUrls = [...keptImages, ...uploaded];
      const { data, error } = await supabase.from('event_submissions')
        .update(buildEditUpdate(parsed.data, imageUrls) as never)
        .eq('id', item.id)
        .select('id');
      if (error || !data || data.length !== 1) {
        throw new Error(error?.message === 'protected_field' || !data?.length
          ? 'Du har ikke tilgang til å lagre denne innsendingen.'
          : 'Endringene kunne ikke lagres. Prøv igjen.');
      }

      // Remove dropped files only now that the row no longer references them,
      // and only when no other submission still uses them.
      const removed = item.image_urls.filter((p) => !imageUrls.includes(p));
      if (removed.length) {
        const elsewhere = new Set<string>();
        for (const p of removed) {
          const { data: refs } = await supabase.from('event_submissions')
            .select('id').contains('image_urls', [p]).neq('id', item.id).limit(1);
          if (refs?.length) elsewhere.add(p);
        }
        const del = removablePaths(item.image_urls, imageUrls, elsewhere);
        if (del.length) await supabase.storage.from('event-submissions').remove(del);
      }

      const englishNote = item.english_approved &&
        (parsed.data.title !== item.title || parsed.data.summary !== item.summary ||
         parsed.data.description !== item.description)
        ? ' Den engelske godkjenningen er trukket tilbake fordi norsk tekst er endret.'
        : '';

      if (item.status === 'approved') {
        const { error: rbErr } = await supabase.functions.invoke('trigger-site-rebuild', { body: { reason: 'update' } });
        if (rbErr) {
          toast({
            title: 'Endringer lagret – publisering feilet',
            description: 'Den offentlige siden er ikke oppdatert ennå. Bygget prøves på nytt ved neste endring.' + englishNote,
            variant: 'destructive',
          });
        } else {
          toast({ title: 'Endringer lagret', description: 'Den offentlige siden oppdateres etter neste vellykkede bygg.' + englishNote });
        }
      } else {
        toast({ title: 'Endringer lagret', description: ('Status er uendret.' + englishNote).trim() });
      }
      onDirtyChange(false);
      onSaved();
    } catch (e) {
      if (uploaded.length) await supabase.storage.from('event-submissions').remove(uploaded);
      setFormError(e instanceof Error ? e.message : 'Endringene kunne ikke lagres.');
    } finally {
      setSaving(false);
    }
  };

  const field = (k: FieldKey, label: string, opts: { required?: boolean; type?: string; textarea?: number } = {}) => {
    const id = `edit-${k}`;
    const err = errors[k];
    const common = {
      id, value: values[k] as string, onChange: set(k), disabled: saving,
      'aria-invalid': !!err, 'aria-describedby': err ? `${id}-err` : undefined, required: opts.required,
    };
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id}>{label}{opts.required && ' *'}</Label>
        {opts.textarea ? <Textarea rows={opts.textarea} {...common} /> : <Input type={opts.type ?? 'text'} {...common} />}
        {err && <p id={`${id}-err`} className="text-sm text-destructive">{err}</p>}
      </div>
    );
  };

  return (
    <form
      className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6"
      onSubmit={(e) => { e.preventDefault(); save(); }}
      aria-labelledby="edit-heading"
      noValidate
    >
      <h2 id="edit-heading" className="font-display text-2xl font-semibold text-foreground">Rediger innsending</h2>

      {item.status === 'approved' && (
        <div role="note" className="flex gap-3 rounded-lg border border-border bg-muted p-4 text-sm text-foreground">
          <AlertTriangle className="h-5 w-5 shrink-0 text-season" aria-hidden />
          <p>Dette arrangementet er publisert. Når du lagrer, oppdateres den offentlige siden etter neste vellykkede bygg. Status endres ikke.</p>
        </div>
      )}
      {item.english_approved && (
        <p className="text-sm text-muted-foreground">
          Engelsk utkast er godkjent. Endrer du tittel, ingress eller beskrivelse, trekkes godkjenningen tilbake og må gjøres på nytt.
        </p>
      )}

      <div className="grid gap-5">
        {field('title', 'Tittel', { required: true })}
        {field('summary', 'Ingress', { textarea: 2 })}
        {field('description', 'Beskrivelse', { required: true, textarea: 8 })}
        <div className="grid sm:grid-cols-2 gap-5">
          {field('organizer', 'Arrangør', { required: true })}
          <div className="space-y-1.5">
            <Label htmlFor="edit-category">Kategori *</Label>
            <select
              id="edit-category" value={values.category} onChange={set('category')} disabled={saving}
              aria-invalid={!!errors.category}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {!EVENT_CATEGORY_KEYS.includes(values.category as never) && <option value="">Velg kategori</option>}
              {EVENT_CATEGORY_KEYS.map((k) => <option key={k} value={k}>{CATEGORY_LABELS.no[k]}</option>)}
            </select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>
          {field('start_date', 'Startdato', { required: true, type: 'date' })}
          {field('end_date', 'Sluttdato', { type: 'date' })}
          {field('time_text', 'Tidspunkt')}
          {field('location', 'Sted', { required: true })}
          {field('maps_url', 'Kartlenke', { type: 'url' })}
          {field('website', 'Nettside', { type: 'url' })}
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="font-medium text-foreground">Bilder ({keptImages.length + newFiles.length}/{MAX_IMAGES})</legend>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {keptImages.map((p, i) => (
            <li key={p} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted">
              {signedUrls[p] && <img src={signedUrls[p]} alt={`Bilde ${i + 1}`} className="w-full h-full object-cover" />}
              <Button type="button" size="sm" variant="destructive" className="absolute top-2 right-2"
                disabled={saving} onClick={() => setKeptImages((k) => k.filter((x) => x !== p))}
                aria-label={`Fjern bilde ${i + 1}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
          {newFiles.map((f, i) => (
            <li key={f.preview} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted">
              <img src={f.preview} alt={`Nytt bilde: ${f.file.name}`} className="w-full h-full object-cover" />
              <Button type="button" size="sm" variant="destructive" className="absolute top-2 right-2"
                disabled={saving} onClick={() => setNewFiles((n) => n.filter((_, j) => j !== i))}
                aria-label={`Fjern nytt bilde ${f.file.name}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        {keptImages.length + newFiles.length < MAX_IMAGES && (
          <div>
            <Label htmlFor="edit-images" className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring">
              <Upload className="h-4 w-4" aria-hidden /> Legg til bilder
              <input id="edit-images" type="file" accept="image/jpeg,image/png,image/webp" multiple
                className="sr-only" disabled={saving}
                onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
            </Label>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG eller WebP, maks 8 MB per bilde.</p>
          </div>
        )}
        {errors.images && <p className="text-sm text-destructive" role="alert">{errors.images}</p>}
      </fieldset>

      {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving || !dirty}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Lagre endringer
        </Button>
        <Button type="button" variant="outline" onClick={cancel} disabled={saving}>Avbryt</Button>
      </div>
    </form>
  );
}
