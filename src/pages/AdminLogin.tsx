import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Hard admin-role gate: signed in is NOT enough — must have admin role.
  const ensureAdminOrSignOut = async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .limit(1);
    if (error || !data || data.length === 0) {
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

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const ok = await ensureAdminOrSignOut(data.session.user.id);
      if (ok) navigate('/admin/innsendinger', { replace: true });
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
    const ok = await ensureAdminOrSignOut(data.user.id);
    if (!ok) return;
    navigate('/admin/innsendinger', { replace: true });
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-sm">
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
        <p className="text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground">← Tilbake til bjorli.no</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;