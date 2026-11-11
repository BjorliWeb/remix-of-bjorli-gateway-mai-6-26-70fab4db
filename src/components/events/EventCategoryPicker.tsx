import { X } from 'lucide-react';
import { CATEGORY_LABELS, EVENT_CATEGORY_KEYS, MAX_EVENT_CATEGORIES, type EventCategoryKey } from '@/lib/eventCategories';

/**
 * Multi-select for event categories, shared by the public submission form
 * and the editor. Native checkboxes inside a fieldset: every option has a
 * visible label, Tab/Space work as usual and screen readers announce the
 * checked state. Selected categories are repeated as removable chips.
 */
export function EventCategoryPicker({
  id,
  legend,
  value,
  onChange,
  lang = 'no',
  error,
  disabled,
  required,
}: {
  id: string;
  legend: string;
  value: string[];
  onChange: (next: string[]) => void;
  lang?: 'no' | 'en';
  error?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const labels = CATEGORY_LABELS[lang];
  const labelOf = (k: string) => labels[k as EventCategoryKey] ?? k;
  // Legacy values that are no longer offered stay visible and removable.
  const legacy = value.filter((v) => !(EVENT_CATEGORY_KEYS as string[]).includes(v));
  const options = [...EVENT_CATEGORY_KEYS, ...legacy];
  const full = value.length >= MAX_EVENT_CATEGORIES;
  const toggle = (k: string, on: boolean) =>
    onChange(on ? (value.includes(k) ? value : [...value, k]) : value.filter((v) => v !== k));
  const errId = `${id}-error`;
  const hintId = `${id}-hint`;
  const t = lang === 'en'
    ? { hint: `Choose one or more (max ${MAX_EVENT_CATEGORIES}).`, chosen: 'Selected', remove: 'Remove', none: 'None selected' }
    : { hint: `Velg én eller flere (maks ${MAX_EVENT_CATEGORIES}).`, chosen: 'Valgt', remove: 'Fjern', none: 'Ingen valgt' };

  return (
    <fieldset
      aria-describedby={[hintId, error ? errId : ''].filter(Boolean).join(' ')}
      aria-invalid={!!error || undefined}
      disabled={disabled}
    >
      <legend className="mb-1 block text-sm font-medium text-foreground">
        {legend}{required ? ' *' : ''}
      </legend>
      <p id={hintId} className="mb-3 text-sm text-muted-foreground">{t.hint}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((k) => {
          const checked = value.includes(k);
          const inputId = `${id}-${k}`;
          return (
            <div key={k}>
              <input
                id={inputId}
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                disabled={disabled || (!checked && full)}
                onChange={(e) => toggle(k, e.target.checked)}
              />
              <label
                htmlFor={inputId}
                className={[
                  'inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2',
                  'peer-disabled:cursor-not-allowed peer-disabled:opacity-60',
                  checked
                    ? 'border-season bg-season text-season-foreground'
                    : 'border-border bg-card text-foreground hover:border-season/60',
                ].join(' ')}
              >
                <span aria-hidden className={['inline-block h-4 w-4 rounded-sm border text-center text-[11px] leading-[14px]', checked ? 'border-current' : 'border-muted-foreground'].join(' ')}>
                  {checked ? '✓' : ''}
                </span>
                {labelOf(k)}
              </label>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
        <span className="font-medium text-foreground">{t.chosen}:</span>
        {value.length === 0 && <span className="text-muted-foreground">{t.none}</span>}
        {value.map((k) => (
          <span key={k} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
            {labelOf(k)}
            <button
              type="button"
              onClick={() => toggle(k, false)}
              disabled={disabled}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-background/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${t.remove} ${labelOf(k)}`}
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </span>
        ))}
      </div>
      {error && <p id={errId} className="mt-2 text-sm text-destructive">{error}</p>}
    </fieldset>
  );
}
