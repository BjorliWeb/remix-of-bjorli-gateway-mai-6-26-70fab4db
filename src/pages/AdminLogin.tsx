import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { canAccessEditor } from '@/lib/auth/roles';
import { hasCurrentEditorMfa } from '@/lib/auth/mfa';

/**
 * Where the recovery email sends the user back to. Must be allow-listed as a
 * redirect URL in the Lovable Cloud / Supabase Auth settings, otherwise Auth
 * falls back to the project's Site URL and the link lands on the wrong page.
 */
const RESET_REDIRECT_URL = 'https://bjorli.no/admin/reset-password/';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  // ?reset=1 is how the reset page sends a user back here to ask for a new link.
  const [mode, setMode] = useState<'login' | 'forgot'>(
    searchParams.get('reset') === '1' ? 'forgot' : 'login',
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Hard editor-role gate: signed in is NOT enough — must have an editor role
  // (admin or moderator). See src/lib/auth/roles.ts.
  const ensureEditorOrSignOut = async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    if (error || !canAccessEditor(data?.map((r) => r.role))) {
      await supabase.auth.signOut();
      toast({
        title: 'Ingen tilgang',
        description: 'Kontoen din har ikke redaktørtilgang.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  // Editors must clear a second factor before the editor opens. The server
  // decides whether that is still valid — see hasCurrentEditorMfa(), which
  // also enforces the 30-day and role-change floors that aal2 alone misses.
  const continueAfterPassword = async () => {
    const verified = await hasCurrentEditorMfa();
    navigate(verified ? '/admin/innsendinger' : '/admin/mfa', { replace: true });
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const ok = await ensureEditorOrSignOut(data.session.user.id);
      if (ok) await continueAfterPassword();
    })();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Innlogging feilet', description: error.message, variant: 'destructive' });
      return;
    }
    if (!data.user) {
      toast({ title: 'Innlogging feilet', variant: 'destructive' });
      return;
    }
    const ok = await ensureEditorOrSignOut(data.user.id);
    if (!ok) return;
    await continueAfterPassword();
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    // The outcome is deliberately discarded. The confirmation below must be
    // identical whether or not the address has an account, so nothing from the
    // response is branched on, rendered or logged — that would turn this form
    // into an account-existence oracle.
    try {
      await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: RESET_REDIRECT_URL,
      });
    } catch {
      // Swallowed for the same reason.
    }
    setResetLoading(false);
    setResetSent(true);
  };

  const backToLogin = () => {
    setMode('login');
    setResetSent(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-sm">
        {mode === 'login' ? (
          <>
            <h1 className="font-display text-2xl font-semibold mb-1 text-foreground">Redaktørinnlogging</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Tilgang for redaksjonen på bjorli.no.
            </p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label className="mb-1.5 block text-sm">E-post</Label>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Passord</Label>
                <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Logger inn …' : 'Logg inn'}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="underline underline-offset-2 hover:text-foreground"
              >
                Glemt passord?
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold mb-1 text-foreground">Tilbakestill passord</h1>
            {resetSent ? (
              <p className="text-sm text-muted-foreground mt-4 mb-6">
                Hvis e-postadressen finnes, har vi sendt en lenke for å tilbakestille passordet.
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Skriv inn e-postadressen din, så sender vi deg en lenke for å velge et nytt passord.
                </p>
                <form onSubmit={submitReset} className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block text-sm">E-post</Label>
                    <Input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={resetLoading} className="w-full">
                    {resetLoading ? 'Sender …' : 'Send tilbakestillingslenke'}
                  </Button>
                </form>
              </>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              <button
                type="button"
                onClick={backToLogin}
                className="underline underline-offset-2 hover:text-foreground"
              >
                Tilbake til innlogging
              </button>
            </p>
          </>
        )}
        <p className="text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground">← Tilbake til bjorli.no</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
