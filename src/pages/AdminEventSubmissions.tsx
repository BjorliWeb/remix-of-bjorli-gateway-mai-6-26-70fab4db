import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, CheckCircle2, XCircle, Sparkles, Mail, Phone, Globe, MapPin,
  Calendar, ImageOff, LogOut, Inbox,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CATEGORY_LABELS, type EventCategoryKey } from '@/lib/eventCategories';

type Status = 'pending' | 'approved' | 'rejected';

interface Submission {
  id: string;
  title: string;
  summary: string | null;
  description: string;
  organizer: string;
  contact_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  start_date: string;
  end_date: string | null;
  time_text: string | null;
  location: string;
  maps_url: string | null;
  category: string;
  image_urls: string[];
  language: string;
  status: Status;
  editor_notes: string | null;
  ai_polished_summary: string | null;
  ai_polished_description: string | null;
  ai_seo_title: string | null;
  ai_seo_meta: string | null;
  created_at: string;
}

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Til vurdering',
  approved: 'Godkjent',
  rejected: 'Avvist',
};

const AdminEventSubmissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>('pending');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [editorNotes, setEditorNotes] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  // Auth + admin gate
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/admin/login', { replace: true });
        return;
      }
      const { data: roleRows } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id);
      const admin = !!roleRows?.some((r) => r.role === 'admin');
      setIsAdmin(admin);
      setAuthChecked(true);
    })();
  }, [navigate]);

  // Load submissions
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      toast({ title: 'Kunne ikke laste inn', description: error.message, variant: 'destructive' });
      return;
    }
    setItems(data as Submission[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const filtered = useMemo(
    () => items.filter((i) => i.status === filter),
    [items, filter],
  );

  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId],
  );

  // Sign URLs for selected
  useEffect(() => {
    if (!selected) {
      setSignedUrls({});
      return;
    }
    setEditorNotes(selected.editor_notes ?? '');
    (async () => {
      const map: Record<string, string> = {};
      for (const path of selected.image_urls) {
        const { data } = await supabase.storage
          .from('event-submissions')
          .createSignedUrl(path, 60 * 60);
        if (data?.signedUrl) map[path] = data.signedUrl;
      }
      setSignedUrls(map);
    })();
  }, [selected]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const saveNotes = async () => {
    if (!selected) return;
    await supabase
      .from('event_submissions')
      .update({ editor_notes: editorNotes })
      .eq('id', selected.id);
    toast({ title: 'Notater lagret' });
    load();
  };

  const setStatus = async (status: Status) => {
    if (!selected) return;
    setActionBusy(true);
    const { error } = await supabase
      .from('event_submissions')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        editor_notes: editorNotes,
      })
      .eq('id', selected.id);
    setActionBusy(false);
    if (error) {
      toast({ title: 'Feil', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: `Status: ${STATUS_LABEL[status]}` });
    setSelectedId(null);
    load();
  };

  const runAi = async (mode: 'cleanup' | 'shorten' | 'seo' | 'quality') => {
    if (!selected) return;
    setAiBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-event-assist', {
        body: {
          mode,
          title: selected.title,
          summary: selected.summary,
          description: selected.description,
          category: selected.category,
          language: selected.language,
        },
      });
      if (error) throw error;
      const update: Record<string, string | null> = {};
      if (data?.summary) update.ai_polished_summary = data.summary;
      if (data?.description) update.ai_polished_description = data.description;
      if (data?.seoTitle) update.ai_seo_title = data.seoTitle;
      if (data?.seoMeta) update.ai_seo_meta = data.seoMeta;
      if (data?.qualityFlag !== undefined) {
        update.editor_notes = `${editorNotes ? editorNotes + '\n\n' : ''}AI-vurdering: ${data.qualityFlag}`;
        setEditorNotes(update.editor_notes as string);
      }
      if (Object.keys(update).length > 0) {
        await supabase.from('event_submissions').update(update).eq('id', selected.id);
        await load();
      }
      toast({ title: 'AI-forslag oppdatert' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ukjent feil';
      toast({ title: 'AI feilet', description: msg, variant: 'destructive' });
    } finally {
      setAiBusy(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="font-display text-2xl mb-2 text-foreground">Ingen tilgang</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Kontoen din har ikke redaktørtilgang. Kontakt en administrator for å få tildelt admin-rolle.
        </p>
        <Button variant="outline" onClick={signOut}>Logg ut</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Innsendte arrangement</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vurder og publiser innsendinger fra partnere og lokale aktører.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Logg ut
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected'] as Status[]).map((s) => {
          const count = items.filter((i) => i.status === s).length;
          return (
            <button
              key={s}
              onClick={() => { setFilter(s); setSelectedId(null); }}
              className={[
                'px-4 py-2 rounded-full text-sm border transition-colors',
                filter === s
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card border-border text-foreground hover:border-foreground/40',
              ].join(' ')}
            >
              {STATUS_LABEL[s]} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {selected ? (
        <DetailView
          item={selected}
          signedUrls={signedUrls}
          editorNotes={editorNotes}
          setEditorNotes={setEditorNotes}
          onBack={() => setSelectedId(null)}
          onSaveNotes={saveNotes}
          onSetStatus={setStatus}
          onAi={runAi}
          aiBusy={aiBusy}
          actionBusy={actionBusy}
        />
      ) : loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <Inbox className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p>Ingen innsendinger her.</p>
        </div>
      ) : (
        <ul className="grid gap-3">
          {filtered.map((i) => (
            <li key={i.id}>
              <button
                onClick={() => setSelectedId(i.id)}
                className="w-full text-left bg-card border border-border rounded-xl p-5 hover:border-foreground/30 transition-colors"
              >
                <div className="flex justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-medium text-foreground truncate">{i.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {i.organizer} · {i.location}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>{new Date(i.created_at).toLocaleDateString('nb-NO')}</div>
                    <div className="mt-1 inline-block px-2 py-0.5 rounded-full bg-muted text-foreground/70">
                      {CATEGORY_LABELS.no[i.category as EventCategoryKey] ?? i.category}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function DetailView({
  item, signedUrls, editorNotes, setEditorNotes, onBack, onSaveNotes, onSetStatus, onAi, aiBusy, actionBusy,
}: {
  item: Submission;
  signedUrls: Record<string, string>;
  editorNotes: string;
  setEditorNotes: (v: string) => void;
  onBack: () => void;
  onSaveNotes: () => void;
  onSetStatus: (s: Status) => void;
  onAi: (m: 'cleanup' | 'shorten' | 'seo' | 'quality') => void;
  aiBusy: boolean;
  actionBusy: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 md:p-8">
      <button onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground mb-6">
        ← Tilbake til listen
      </button>

      <div className="grid md:grid-cols-[1.6fr_1fr] gap-10">
        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-2">{item.title}</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {item.organizer} · {CATEGORY_LABELS.no[item.category as EventCategoryKey] ?? item.category}
          </p>

          {item.summary && <p className="text-foreground leading-relaxed mb-4 italic">{item.summary}</p>}
          <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-8">{item.description}</p>

          {/* Images */}
          {item.image_urls.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {item.image_urls.map((path) => (
                <div key={path} className="aspect-[4/3] rounded-lg overflow-hidden border border-border bg-muted">
                  {signedUrls[path] ? (
                    <img src={signedUrls[path]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <ImageOff className="h-4 w-4" /> Ingen bilder vedlagt
            </div>
          )}

          {/* AI assist */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-season" />
              <h3 className="font-medium text-foreground">AI-assistent</h3>
              <span className="text-xs text-muted-foreground">– aldri auto-publisering</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button size="sm" variant="outline" disabled={aiBusy} onClick={() => onAi('cleanup')}>
                Forbedre ingress
              </Button>
              <Button size="sm" variant="outline" disabled={aiBusy} onClick={() => onAi('shorten')}>
                Kort ned beskrivelse
              </Button>
              <Button size="sm" variant="outline" disabled={aiBusy} onClick={() => onAi('seo')}>
                Foreslå SEO
              </Button>
              <Button size="sm" variant="outline" disabled={aiBusy} onClick={() => onAi('quality')}>
                Vurder kvalitet
              </Button>
              {aiBusy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground self-center" />}
            </div>
            {item.ai_polished_summary && (
              <AiBlock label="Forslag til ingress" text={item.ai_polished_summary} />
            )}
            {item.ai_polished_description && (
              <AiBlock label="Forslag til beskrivelse" text={item.ai_polished_description} />
            )}
            {(item.ai_seo_title || item.ai_seo_meta) && (
              <AiBlock
                label="SEO-forslag"
                text={[item.ai_seo_title && `Tittel: ${item.ai_seo_title}`, item.ai_seo_meta && `Meta: ${item.ai_seo_meta}`].filter(Boolean).join('\n')}
              />
            )}
          </div>
        </div>

        {/* Side panel */}
        <aside className="space-y-6">
          <InfoRow icon={<Calendar />} label="Dato">
            {item.start_date}
            {item.end_date && item.end_date !== item.start_date ? ` – ${item.end_date}` : ''}
            {item.time_text && <span className="block text-muted-foreground text-xs mt-0.5">{item.time_text}</span>}
          </InfoRow>
          <InfoRow icon={<MapPin />} label="Sted">
            {item.location}
            {item.maps_url && (
              <a href={item.maps_url} target="_blank" rel="noreferrer" className="block text-xs underline text-muted-foreground mt-0.5">
                Google Maps
              </a>
            )}
          </InfoRow>
          <InfoRow icon={<Mail />} label="Kontakt">
            {item.contact_name}
            <a href={`mailto:${item.email}`} className="block text-xs text-muted-foreground underline mt-0.5">{item.email}</a>
          </InfoRow>
          {item.phone && (
            <InfoRow icon={<Phone />} label="Telefon"><a href={`tel:${item.phone}`}>{item.phone}</a></InfoRow>
          )}
          {item.website && (
            <InfoRow icon={<Globe />} label="Nettside">
              <a href={item.website} target="_blank" rel="noreferrer" className="underline break-all">{item.website}</a>
            </InfoRow>
          )}

          <div>
            <Label className="mb-1.5 block text-sm">Redaktørnotater</Label>
            <Textarea rows={5} value={editorNotes} onChange={(e) => setEditorNotes(e.target.value)} />
            <Button size="sm" variant="ghost" onClick={onSaveNotes} className="mt-2">
              Lagre notat
            </Button>
          </div>

          <div className="border-t border-border pt-5 space-y-2">
            <Button
              className="w-full"
              disabled={actionBusy}
              onClick={() => onSetStatus('approved')}
            >
              <CheckCircle2 className="h-4 w-4" />
              Godkjenn
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={actionBusy}
              onClick={() => onSetStatus('rejected')}
            >
              <XCircle className="h-4 w-4" />
              Avvis
            </Button>
            {item.status !== 'pending' && (
              <Button
                variant="ghost"
                className="w-full"
                disabled={actionBusy}
                onClick={() => onSetStatus('pending')}
              >
                Sett tilbake til vurdering
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function AiBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="bg-muted/40 border border-border rounded-lg p-4 mb-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="h-9 w-9 shrink-0 rounded-lg bg-muted text-muted-foreground flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
      <div className="text-sm text-foreground">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">{label}</div>
        {children}
      </div>
    </div>
  );
}

export default AdminEventSubmissions;