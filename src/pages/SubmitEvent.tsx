import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Upload, X, Calendar, MapPin, Tag, ImagePlus, CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  EVENT_CATEGORY_KEYS,
  CATEGORY_LABELS,
  type EventCategoryKey,
} from '@/lib/eventCategories';

type Lang = 'no' | 'en';

const COPY = {
  no: {
    title: 'Meld inn arrangement på Bjorli',
    subtitle:
      'Driver du aktivitet, arrangement eller opplevelser på Bjorli? Send inn informasjon her, så vurderer vi publisering på bjorli.no.',
    intro: [
      'Alle innsendinger blir vurdert av redaksjonen før publisering.',
      'Vi kan kutte eller justere tekst for å passe nettstedets tone.',
      'Det er gratis å sende inn relevant lokalt innhold.',
      'Vanligvis får du svar i løpet av noen dager.',
    ],
    s1: '1 — Grunnleggende informasjon',
    s2: '2 — Dato og sted',
    s3: '3 — Kategori',
    s4: '4 — Bilder',
    s5: '5 — Samtykke',
    f: {
      title: 'Arrangementstittel',
      summary: 'Kort ingress',
      summaryHelp: 'En setning som beskriver hva dette er.',
      description: 'Full beskrivelse',
      organizer: 'Arrangørnavn',
      contactName: 'Kontaktperson',
      email: 'E-post',
      phone: 'Telefon',
      website: 'Nettside / bookinglenke',
      startDate: 'Startdato',
      endDate: 'Sluttdato',
      time: 'Tidspunkt',
      location: 'Sted / møtepunkt',
      maps: 'Google Maps-lenke (valgfritt)',
      category: 'Velg kategori',
      imagesHelp: 'Bruk helst ekte bilder fra arrangementet eller området.',
      imagesDrop: 'Dra og slipp bilder hit, eller trykk for å velge',
      imagesLimit: 'Maks 5 bilder · JPG, PNG eller WebP',
      consentRights: 'Jeg bekrefter at jeg har rettigheter til tekst og bilder.',
      consentEditing: 'Jeg forstår at Bjorli.no kan redigere innhold før publisering.',
      submit: 'Send inn arrangement',
      submitting: 'Sender inn …',
      optional: '(valgfritt)',
    },
    success: {
      title: 'Takk for innsendingen.',
      body: 'Arrangementet blir vurdert før eventuell publisering på bjorli.no. Vi tar kontakt på e-post hvis vi trenger mer informasjon.',
      again: 'Send inn et nytt arrangement',
    },
    errors: {
      generic: 'Noe gikk galt. Prøv igjen om litt.',
      tooManyImages: 'Maks 5 bilder.',
      badImage: 'Kun JPG, PNG eller WebP er tillatt.',
      consent: 'Du må bekrefte begge samtykkene.',
      uploadFailed: 'Kunne ikke laste opp bilde.',
    },
  },
  en: {
    title: 'Submit an event on Bjorli',
    subtitle:
      'Running an activity, event or experience on Bjorli? Send the details here and we will consider it for publication on bjorli.no.',
    intro: [
      'All submissions are reviewed by our editors before publication.',
      'We may shorten or adjust text to match the site’s tone.',
      'There is no cost to submit relevant local content.',
      'You can normally expect a reply within a few days.',
    ],
    s1: '1 — Basic information',
    s2: '2 — Date and location',
    s3: '3 — Category',
    s4: '4 — Images',
    s5: '5 — Consent',
    f: {
      title: 'Event title',
      summary: 'Short intro',
      summaryHelp: 'One sentence that describes what this is.',
      description: 'Full description',
      organizer: 'Organizer name',
      contactName: 'Contact person',
      email: 'Email',
      phone: 'Phone',
      website: 'Website / booking link',
      startDate: 'Start date',
      endDate: 'End date',
      time: 'Time',
      location: 'Location / meeting point',
      maps: 'Google Maps link (optional)',
      category: 'Choose a category',
      imagesHelp: 'Prefer real photos from the event or the area.',
      imagesDrop: 'Drag and drop images here, or tap to select',
      imagesLimit: 'Max 5 images · JPG, PNG or WebP',
      consentRights: 'I confirm that I hold the rights to the text and images.',
      consentEditing: 'I understand that Bjorli.no may edit the content before publication.',
      submit: 'Submit event',
      submitting: 'Submitting …',
      optional: '(optional)',
    },
    success: {
      title: 'Thank you for your submission.',
      body: 'Your event will be reviewed before any publication on bjorli.no. We will reach out by email if we need more information.',
      again: 'Submit another event',
    },
    errors: {
      generic: 'Something went wrong. Please try again shortly.',
      tooManyImages: 'Maximum of 5 images.',
      badImage: 'Only JPG, PNG or WebP files are allowed.',
      consent: 'Please confirm both consents.',
      uploadFailed: 'Could not upload image.',
    },
  },
} as const;

const MAX_IMAGES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB per file (matches intended bucket limit)
const DEDUPE_KEY = 'bjorli_event_last_v1';
const DEDUPE_WINDOW_MS = 10 * 60 * 1000;

const schema = z.object({
  title: z.string().trim().min(3).max(160),
  summary: z.string().trim().max(280).optional().or(z.literal('')),
  description: z.string().trim().min(20).max(4000),
  organizer: z.string().trim().min(2).max(160),
  contactName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  website: z.string().trim().url().max(500).optional().or(z.literal('')),
  startDate: z.string().min(1),
  endDate: z.string().optional().or(z.literal('')),
  time: z.string().trim().max(120).optional().or(z.literal('')),
  location: z.string().trim().min(2).max(240),
  maps: z.string().trim().url().max(500).optional().or(z.literal('')),
  category: z.string().min(1),
});

interface Props {
  lang?: Lang;
}

const SubmitEvent = ({ lang = 'no' }: Props) => {
  const c = COPY[lang];
  const cats = CATEGORY_LABELS[lang];
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    description: '',
    organizer: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    startDate: '',
    endDate: '',
    time: '',
    location: '',
    maps: '',
    category: '' as EventCategoryKey | '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [consentRights, setConsentRights] = useState(false);
  const [consentEditing, setConsentEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  // Bot/abuse protection: honeypot + minimum render-to-submit time.
  const [hp, setHp] = useState('');
  const mountedAt = useRef<number>(Date.now());
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files);
    const valid: File[] = [];
    for (const f of incoming) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        toast({ title: c.errors.badImage, variant: 'destructive' });
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        toast({ title: c.errors.badImage, variant: 'destructive' });
        continue;
      }
      valid.push(f);
    }
    const merged = [...images, ...valid].slice(0, MAX_IMAGES);
    if (images.length + valid.length > MAX_IMAGES) {
      toast({ title: c.errors.tooManyImages });
    }
    setImages(merged);
    setPreviews(merged.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    const next = images.filter((_, idx) => idx !== i);
    setImages(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!consentRights || !consentEditing) {
      toast({ title: c.errors.consent, variant: 'destructive' });
      return;
    }

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        map[i.path[0] as string] = i.message;
      });
      setErrors(map);
      return;
    }

    setLoading(true);
    try {
      // 1. Insert the submission row FIRST so storage uploads can be tied to a fresh row.
      const uploadToken = crypto.randomUUID();
      const plannedPaths = images.map((file) => {
        const ext = file.name.split('.').pop() || 'jpg';
        return `uploads/${uploadToken}/${crypto.randomUUID()}.${ext}`;
      });
      const { error: insertErr } = await supabase.from('event_submissions').insert({
        title: parsed.data.title,
        summary: parsed.data.summary || null,
        description: parsed.data.description,
        organizer: parsed.data.organizer,
        contact_name: parsed.data.contactName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        website: parsed.data.website || null,
        start_date: parsed.data.startDate,
        end_date: parsed.data.endDate || null,
        time_text: parsed.data.time || null,
        location: parsed.data.location,
        maps_url: parsed.data.maps || null,
        category: parsed.data.category,
        image_urls: plannedPaths,
        upload_token: uploadToken,
        language: lang,
        consent_rights: consentRights,
        consent_editing: consentEditing,
        status: 'pending',
      });

      if (insertErr) throw insertErr;

      // 2. Upload images into the token-scoped folder. The storage RLS policy
      // requires a fresh matching event_submissions row to exist.
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const path = plannedPaths[i];
        const { error: upErr } = await supabase.storage
          .from('event-submissions')
          .upload(path, file, { contentType: file.type });
        if (upErr) {
          throw new Error(c.errors.uploadFailed);
        }
      }

      // Fire-and-forget notification — must not block UX
      supabase.functions
        .invoke('notify-event-submission', {
          body: {
            title: parsed.data.title,
            organizer: parsed.data.organizer,
            email: parsed.data.email,
            language: lang,
          },
        })
        .catch(() => {
          /* notification is best-effort */
        });

      setDone(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : c.errors.generic;
      toast({ title: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div>
        <PageHero title={c.title} subtitle={c.subtitle} image={heroImage} />
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <CheckCircle2 className="h-16 w-16 text-season mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {c.success.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{c.success.body}</p>
            <Button
              onClick={() => {
                setDone(false);
                setForm({
                  title: '', summary: '', description: '', organizer: '', contactName: '',
                  email: '', phone: '', website: '', startDate: '', endDate: '', time: '',
                  location: '', maps: '', category: '',
                });
                setImages([]); setPreviews([]); setConsentRights(false); setConsentEditing(false);
              }}
            >
              {c.success.again}
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero title={c.title} subtitle={c.subtitle} image={heroImage} />

      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Intro */}
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-muted-foreground"
          >
            {c.intro.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-season shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </motion.ul>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Section 1 */}
            <SectionHeader title={c.s1} />
            <div className="grid gap-5">
              <Field label={c.f.title} error={errors.title}>
                <Input value={form.title} onChange={(e) => update('title', e.target.value)} required maxLength={160} />
              </Field>
              <Field label={c.f.summary} hint={c.f.summaryHelp} error={errors.summary}>
                <Input value={form.summary} onChange={(e) => update('summary', e.target.value)} maxLength={280} />
              </Field>
              <Field label={c.f.description} error={errors.description}>
                <Textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={6}
                  required
                  maxLength={4000}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label={c.f.organizer} error={errors.organizer}>
                  <Input value={form.organizer} onChange={(e) => update('organizer', e.target.value)} required />
                </Field>
                <Field label={c.f.contactName} error={errors.contactName}>
                  <Input value={form.contactName} onChange={(e) => update('contactName', e.target.value)} required />
                </Field>
                <Field label={c.f.email} error={errors.email}>
                  <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                </Field>
                <Field label={`${c.f.phone} ${c.f.optional}`} error={errors.phone}>
                  <Input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                </Field>
              </div>
              <Field label={`${c.f.website} ${c.f.optional}`} error={errors.website}>
                <Input
                  type="url"
                  placeholder="https://"
                  value={form.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </Field>
            </div>

            {/* Section 2 */}
            <SectionHeader title={c.s2} icon={<Calendar className="h-4 w-4" />} />
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={c.f.startDate} error={errors.startDate}>
                <Input type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} required />
              </Field>
              <Field label={`${c.f.endDate} ${c.f.optional}`} error={errors.endDate}>
                <Input type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} />
              </Field>
              <Field label={`${c.f.time} ${c.f.optional}`} error={errors.time}>
                <Input value={form.time} onChange={(e) => update('time', e.target.value)} placeholder="10:00 – 14:00" />
              </Field>
              <Field label={c.f.location} error={errors.location}>
                <Input value={form.location} onChange={(e) => update('location', e.target.value)} required />
              </Field>
              <div className="sm:col-span-2">
                <Field label={c.f.maps} error={errors.maps}>
                  <Input
                    type="url"
                    placeholder="https://maps.google.com/…"
                    value={form.maps}
                    onChange={(e) => update('maps', e.target.value)}
                  />
                </Field>
              </div>
            </div>

            {/* Section 3 */}
            <SectionHeader title={c.s3} icon={<Tag className="h-4 w-4" />} />
            <div>
              <Label className="mb-3 block text-sm font-medium text-foreground">{c.f.category}</Label>
              <div className="flex flex-wrap gap-2">
                {EVENT_CATEGORY_KEYS.map((k) => {
                  const active = form.category === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => update('category', k)}
                      className={[
                        'px-4 py-2 rounded-full text-sm border transition-colors min-h-[40px]',
                        active
                          ? 'bg-season text-season-foreground border-season'
                          : 'bg-card text-foreground border-border hover:border-season/60',
                      ].join(' ')}
                      aria-pressed={active}
                    >
                      {cats[k]}
                    </button>
                  );
                })}
              </div>
              {errors.category && <p className="mt-2 text-sm text-destructive">{errors.category}</p>}
            </div>

            {/* Section 4 */}
            <SectionHeader title={c.s4} icon={<ImagePlus className="h-4 w-4" />} />
            <div>
              <p className="text-sm text-muted-foreground mb-3">{c.f.imagesHelp}</p>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={[
                  'cursor-pointer border-2 border-dashed rounded-xl px-6 py-10 text-center transition-colors',
                  dragOver ? 'border-season bg-season/5' : 'border-border hover:border-season/60',
                ].join(' ')}
              >
                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-foreground">{c.f.imagesDrop}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.f.imagesLimit}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_TYPES.join(',')}
                  className="hidden"
                  onChange={(e) => e.target.files && addFiles(e.target.files)}
                />
              </div>

              {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {previews.map((src, i) => (
                    <div key={src} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        aria-label="Remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 5 */}
            <SectionHeader title={c.s5} />
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={consentRights}
                  onCheckedChange={(v) => setConsentRights(v === true)}
                  className="mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{c.f.consentRights}</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={consentEditing}
                  onCheckedChange={(v) => setConsentEditing(v === true)}
                  className="mt-0.5"
                />
                <span className="text-sm text-foreground leading-relaxed">{c.f.consentEditing}</span>
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2 sticky bottom-4 z-10">
              <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto min-h-[52px] px-8">
                {loading ? c.f.submitting : c.f.submit}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

function SectionHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-border pb-3">
      {icon && <span className="text-season">{icon}</span>}
      <h2 className="font-display text-lg md:text-xl font-semibold text-foreground tracking-tight">{title}</h2>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-sm font-medium text-foreground">{label}</Label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default SubmitEvent;