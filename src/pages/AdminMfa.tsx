import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { canAccessEditor } from '@/lib/auth/roles';
import {
  resolveTotpState,
  hasCurrentEditorMfa,
  sendEditorEmailCode,
  verifyEditorEmailCode,
} from '@/lib/auth/mfa';

/**
 * Two-step verification for the editor login.
 *
 * Reached only after a successful password sign-in. Accounts without an editor
 * role never get here — they are signed out, exactly as on the login page.
 *
 * Two factors are offered: an authenticator app (TOTP) and a code by email.
 * Email is the weaker of the two — whoever controls the inbox can also reset
 * the password — so it exists as an alternative for editors without an
 * authenticator, not as the default.
 *
 * Still out of scope: the 30-day "trust this device" option, and the
 * RESTRICTIVE RLS policies that make this enforceable server-side.
 */
type Phase = 'loading' | 'enroll' | 'challenge' | 'unavailable';
type Method = 'totp' | 'email';

const AdminMfa = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>('loading');
  const [method, setMethod] = useState<Method>('totp');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate('/admin/login', { replace: true });
        return;
      }

      // Same hard role gate as the login page: signed in is not enough.
      const { data: roleRows, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', sessionData.session.user.id);
      if (roleError || !canAccessEditor(roleRows?.map((r) => r.role))) {
        await supabase.auth.signOut();
        toast({
          title: 'Ingen tilgang',
          description: 'Kontoen din har ikke redaktørtilgang.',
          variant: 'destructive',
        });
        navigate('/admin/login', { replace: true });
        return;
      }

      // Already verified and still within the server's freshness window.
      if (await hasCurrentEditorMfa()) {
        navigate('/admin/innsendinger', { replace: true });
        return;
      }

      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) {
        setPhase('unavailable');
        return;
      }

      const state = resolveTotpState(factors?.all);
      if (state.mode === 'challenge') {
        setFactorId(state.factorId);
        setPhase('challenge');
        return;
      }

      // Clear out abandoned setup attempts first, otherwise a fresh enrolment
      // can collide with the leftover factor.
      for (const staleId of state.staleFactorIds) {
        await supabase.auth.mfa.unenroll({ factorId: staleId });
      }

      const { data: enrolled, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'bjorli.no',
      });
      if (enrollError || !enrolled) {
        setPhase('unavailable');
        return;
      }
      setFactorId(enrolled.id);
      setQrCode(enrolled.totp?.qr_code ?? null);
      setSecret(enrolled.totp?.secret ?? null);
      setPhase('enroll');
    })();
  }, [navigate, toast]);

  // Resend countdown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const finish = async () => {
    // Verification only counts if the server agrees it is currently valid.
    const verified = await hasCurrentEditorMfa();
    setBusy(false);
    if (!verified) {
      toast({
        title: 'Verifiseringen ble ikke fullført',
        description: 'Prøv igjen.',
        variant: 'destructive',
      });
      setCode('');
      return;
    }
    navigate('/admin/innsendinger', { replace: true });
  };

  const sendCode = async () => {
    setSending(true);
    const result = await sendEditorEmailCode();
    setSending(false);
    if (!result.ok) {
      setCooldown(result.reason === 'cooldown' ? (result.retryAfter ?? 60) : 0);
      toast({
        title:
          result.reason === 'cooldown' || result.reason === 'rate_limited'
            ? 'Vent litt før du prøver igjen'
            : 'Vi fikk ikke sendt koden',
        description:
          result.reason === 'rate_limited'
            ? 'Du har bedt om for mange koder. Prøv igjen om en stund.'
            : result.reason === 'cooldown'
              ? 'Vi har nettopp sendt deg en kode.'
              : 'Prøv autentiseringsapp i stedet, eller forsøk igjen senere.',
        variant: 'destructive',
      });
      return;
    }
    setMaskedEmail(result.maskedEmail ?? '');
    setCooldown(result.cooldownSeconds ?? 60);
    setCode('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    if (method === 'email') {
      const ok = await verifyEditorEmailCode(code);
      if (!ok) {
        setBusy(false);
        setCode('');
        toast({
          title: 'Koden stemmer ikke',
          description: 'Sjekk e-posten og prøv igjen.',
          variant: 'destructive',
        });
        return;
      }
      await finish();
      return;
    }

    if (!factorId) {
      setBusy(false);
      return;
    }
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    if (error) {
      setBusy(false);
      setCode('');
      // One message for every failure mode — a wrong code, an expired code and
      // a stale challenge must not be distinguishable.
      toast({
        title: 'Koden stemmer ikke',
        description: 'Sjekk appen og prøv igjen.',
        variant: 'destructive',
      });
      return;
    }
    await finish();
  };

  const switchMethod = (next: Method) => {
    setMethod(next);
    setCode('');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const showCodeForm = method === 'totp' || maskedEmail !== null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-sm">
        {phase === 'loading' && <p className="text-sm text-muted-foreground">Laster …</p>}

        {phase === 'unavailable' && (
          <>
            <h1 className="font-display text-2xl font-semibold mb-1 text-foreground">
              To-trinns innlogging er ikke tilgjengelig
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Vi fikk ikke satt opp to-trinns innlogging akkurat nå. Prøv igjen senere, eller
              ta kontakt med den som administrerer bjorli.no.
            </p>
            <Button variant="outline" onClick={signOut} className="w-full">
              Logg ut
            </Button>
          </>
        )}

        {phase !== 'loading' && phase !== 'unavailable' && (
          <>
            <h1 className="font-display text-2xl font-semibold mb-1 text-foreground">
              {method === 'email'
                ? 'Få kode på e-post'
                : phase === 'enroll'
                  ? 'Sett opp to-trinns innlogging'
                  : 'Bekreft at det er deg'}
            </h1>

            {method === 'totp' && phase === 'enroll' && (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Skann QR-koden med en autentiseringsapp, for eksempel Google Authenticator
                  eller 1Password. Appen lager en ny sekssifret kode hvert halvminutt.
                </p>
                {qrCode && (
                  <img
                    src={qrCode}
                    alt="QR-kode for autentiseringsapp"
                    className="w-44 h-44 mx-auto mb-4 bg-white rounded-lg p-2"
                  />
                )}
                {secret && (
                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground mb-1">
                      Får du ikke skannet? Skriv inn denne nøkkelen i appen:
                    </p>
                    <code className="block text-xs font-mono break-all bg-muted rounded p-2 text-foreground">
                      {secret}
                    </code>
                  </div>
                )}
              </>
            )}

            {method === 'totp' && phase === 'challenge' && (
              <p className="text-sm text-muted-foreground mb-6">
                Åpne autentiseringsappen din og skriv inn den sekssifrede koden.
              </p>
            )}

            {method === 'email' && (
              <p className="text-sm text-muted-foreground mb-6">
                {maskedEmail
                  ? `Vi har sendt en kode til ${maskedEmail}. Den er gyldig i fem minutter.`
                  : 'Vi sender en sekssifret kode til e-postadressen som er registrert på kontoen din.'}
              </p>
            )}

            {method === 'email' && !maskedEmail && (
              <Button onClick={sendCode} disabled={sending} className="w-full">
                {sending ? 'Sender …' : 'Send kode'}
              </Button>
            )}

            {showCodeForm && (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <Label className="mb-1.5 block text-sm" htmlFor="mfa-code">
                    Sekssifret kode
                  </Label>
                  <Input
                    id="mfa-code"
                    name="code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <Button type="submit" disabled={busy || code.length !== 6} className="w-full">
                  {busy ? 'Sjekker …' : 'Bekreft'}
                </Button>
              </form>
            )}

            {method === 'email' && maskedEmail && (
              <p className="text-xs text-muted-foreground mt-4">
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={sending || cooldown > 0}
                  className="underline underline-offset-2 hover:text-foreground disabled:no-underline disabled:opacity-60"
                >
                  {cooldown > 0 ? `Send ny kode om ${cooldown} s` : 'Send ny kode'}
                </button>
              </p>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              {method === 'totp' ? (
                <button
                  type="button"
                  onClick={() => switchMethod('email')}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Send kode på e-post i stedet
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => switchMethod('totp')}
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Bruk autentiseringsapp i stedet
                </button>
              )}
            </p>

            {method === 'totp' && phase === 'enroll' && (
              <p className="text-xs text-muted-foreground mt-4">
                Mister du appen, må den som administrerer bjorli.no nullstille to-trinns
                innloggingen for deg.
              </p>
            )}

            <p className="text-xs text-muted-foreground mt-6">
              <button
                type="button"
                onClick={signOut}
                className="underline underline-offset-2 hover:text-foreground"
              >
                Logg ut
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

export default AdminMfa;
