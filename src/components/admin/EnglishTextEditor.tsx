import { useEffect, useState } from 'react';
import { CheckCircle2, Languages, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { initialEnglishFields, type EnglishFields, type EnglishSource } from '@/lib/events/englishText';

interface Props {
  item: EnglishSource & { id: string; english_approved: boolean };
  busy: boolean;
  aiBusy: boolean;
  onSave: (f: EnglishFields) => Promise<boolean>;
  onSetApproval: (approved: boolean) => void;
  onRegenerate: () => void;
  onDirtyChange: (dirty: boolean) => void;
}

/** Editable English version of a submission. Remount (key) when saved values change. */
export function EnglishTextEditor({ item, busy, aiBusy, onSave, onSetApproval, onRegenerate, onDirtyChange }: Props) {
  const saved = initialEnglishFields(item);
  const [f, setF] = useState<EnglishFields>(saved);
  const dirty = f.title !== saved.title || f.summary !== saved.summary || f.description !== saved.description;
  useEffect(() => { onDirtyChange(dirty); }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  const isEn = item.language === 'en';
  const hasText = !!(saved.title.trim() || saved.description.trim());
  const set = (k: keyof EnglishFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));
  const id = (k: string) => `en-${item.id}-${k}`;

  return (
    <section className="border-t border-border pt-6 mt-6" aria-labelledby={id('heading')}>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <Languages className="h-4 w-4 text-season" aria-hidden />
        <h3 id={id('heading')} className="font-medium text-foreground">Engelsk tekst (English)</h3>
        {item.english_approved && !dirty ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">Godkjent</span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {dirty ? 'Ulagrede endringer' : 'Må godkjennes før offentlig bruk'}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {isEn
          ? 'Dette er den engelske teksten som vises offentlig etter godkjenning. Uten godkjenning vises innsenderens originaltekst.'
          : 'Vises på den engelske siden først når den er godkjent. Den norske originalen endres aldri.'}
        {' '}Lagring trekker tilbake en tidligere godkjenning.
      </p>

      <div className="grid gap-4 mb-4">
        <div className="space-y-1.5">
          <Label htmlFor={id('title')}>English title</Label>
          <Input id={id('title')} value={f.title} onChange={set('title')} disabled={busy} lang="en" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id('summary')}>English intro</Label>
          <Textarea id={id('summary')} rows={2} value={f.summary} onChange={set('summary')} disabled={busy} lang="en" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id('description')}>English description</Label>
          <Textarea id={id('description')} rows={8} value={f.description} onChange={set('description')} disabled={busy} lang="en" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={busy || !dirty} onClick={() => onSave(f)}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Lagre engelsk tekst
        </Button>
        {!item.english_approved && hasText && (
          <Button size="sm" variant="outline" disabled={busy || dirty} onClick={() => onSetApproval(true)}
            title={dirty ? 'Lagre først' : undefined}>
            <CheckCircle2 className="h-4 w-4" />
            Godkjenn engelsk tekst
          </Button>
        )}
        {item.english_approved && (
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => onSetApproval(false)}>
            Trekk tilbake godkjenning
          </Button>
        )}
        {!isEn && (
          <Button size="sm" variant="outline" disabled={aiBusy} onClick={onRegenerate}>
            {hasText || dirty ? 'Generer engelsk tekst med AI på nytt' : 'Lag engelsk tekst med AI'}
          </Button>
        )}
      </div>
      {dirty && <p className="text-xs text-muted-foreground mt-2">Lagre før du godkjenner.</p>}
    </section>
  );
}
