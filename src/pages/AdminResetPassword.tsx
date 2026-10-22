import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { clearRecoveryTokenHash, getRecoveryTokenHash } from '@/lib/auth/recoveryLink';
import { resolveTotpState } from '@/lib/auth/mfa';

/**
 * Password recovery landing page for the editor login.
 *
 * This route proves control of the user's mailbox and nothing else. It never
 * reads or writes user_roles, never grants a role, and deliberately exposes no
 * editor content in any state. Authorization still happens on the next normal
 * sign-in through the unchanged gate in AdminLogin.
 */

// 'confirm': arrived with a scanner-safe token_hash link (see recoveryLink.ts);
// the token is only spent when the user presses "Fortsett".
type Status = 'confirm' | 'verifying' | 'checking' | 'valid' | 'invalid' | 'saved';

/**
 * Whether THIS page load was a password-recovery callback.
 *
 * Read synchronously at module evaluation, which is the only reliable moment:
 * auth-js runs `window.location.hash = ''` as soon as it has consumed the
 * callback (GoTrueClient `_getSessionFromURL`), so any later read is empty.
 * Module evaluation happens during bundle load, before that async work can
 * finish, so the marker is still present here.
 *
 * `type` is the exact parameter auth-js turns into `redirectType`, and it reads
 * the hash first with the query string taking precedence (helpers
 * `parseParametersFromURL`) — mirrored here so both agree on the same value.
 *
 * This is a signal about how the page was entered. It is NOT the trust anchor
 * on its own: it only ever acts together with a real session, and the
 * PASSWORD_RECOVERY event below is the primary signal.
 */
const RECOVERY_CALLBACK_IN_URL: boolean = (() => {
  if (typeof window === 'undefined') return false;
  const fromHash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const fromQuery = new URLSearchParams(window.location.search);
  return (fromQuery.get('type') ?? fromHash.get('type')) === 'recovery';
})();

/**
 * Map the auth error to Norwegian without leaking internals. The password
 * policy itself is enforced server-side by Auth — this only phrases the
 * outcome, it does not define or duplicate the rules.
 */
const norwegianAuthError = (message: string, code?: string): string => {
  // Auth's error code is authoritative; the message matching below is only a
  // fallback. Without this, insufficient_aal ("AAL2 session is required …")
  // matched 'session' and was shown as an expired link.
  if (code === 'insufficient_aal') {
    return 'Skriv inn koden fra autentiseringsappen for å lagre det nye passordet.';
  }
  if (code === 'same_password') return 'Det nye passordet må være forskjellig fra det gamle.';
  if (code === 'weak_password') return 'Passordet er for svakt. Velg et sterkere passord.';
  if (code === 'session_not_found' || code === 'session_expired') {
    return 'Denne tilbakestillingslenken er ugyldig eller har utløpt.';
  }
  const m = message.toLowerCase();
  if (m.includes('at least') || m.includes('too short') || m.includes('minimum')) {
    return 'Passordet er for kort. Velg et lengre passord.';
  }
  if (m.includes('weak') || m.includes('compromised') || m.includes('pwned')) {
    return 'Passordet er for svakt. Velg et sterkere passord.';
  }
  if (m.includes('should be different') || m.includes('different from the old')) {
    return 'Det nye passordet må være forskjellig fra det gamle.';
  }
  if (m.includes('expired') || m.includes('session') || m.includes('invalid')) {
    return 'Denne tilbakestillingslenken er ugyldig eller har utløpt.';
  }
  return 'Kunne ikke oppdatere passordet. Prøv igjen, eller be om en ny lenke.';
};

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>(() =>
    getRecoveryTokenHash() ? 'confirm' : 'checking',
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Set when the account has a verified TOTP factor: Auth refuses a password
  // change from the aal1 recovery session until the session is raised to aal2.
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');

  useEffect(() => {
    let active = true;

    // PRIMARY signal. auth-js emits PASSWORD_RECOVERY only when the callback
    // URL carried type=recovery AND its access_token was validated server-side
    // by _getUser(). An ordinary sign-in emits SIGNED_IN / INITIAL_SESSION,
    // which are deliberately ignored here.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY' && session) setStatus('valid');
    });

    (async () => {
      // token_hash link: nothing to check yet, the confirm step handles it.
      if (getRecoveryTokenHash()) return;
      // A session on its own must NEVER unlock this form: someone already
      // signed in normally who opens this URL directly is not recovering a
      // password, and must not be able to change it without the old one.
      if (!RECOVERY_CALLBACK_IN_URL) {
        if (!active) return;
        setStatus((prev) => (prev === 'valid' || prev === 'saved' ? prev : 'invalid'));
        return;
      }
      // Recovery callback confirmed. getSession() awaits client initialisation
      // internally, so the token in the URL has already been exchanged and
      // validated by the time this resolves. This covers the case where the
      // PASSWORD_RECOVERY event fired before this component could subscribe.
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setStatus((prev) =>
        prev === 'valid' || prev === 'saved' ? prev : data.session ? 'valid' : 'invalid',
      );
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Once the recovery session exists, find out whether the account needs a
  // TOTP code too. Failing here only hides the code field; Auth still enforces
  // aal2 on the password change and the error below says so.
  useEffect(() => {
    if (status !== 'valid') return;
    let active = true;
    (async () => {
      try {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aal?.currentLevel !== 'aal1' || aal?.nextLevel !== 'aal2') return;
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const state = resolveTotpState(factors?.all);
        if (active && state.mode === 'challenge') setMfaFactorId(state.factorId);
      } catch {
        // See comment above.
      }
    })();
    return () => {
      active = false;
    };
  }, [status]);

  // Spends the one-time token. verifyOtp emits PASSWORD_RECOVERY on success,
  // and only a returned session unlocks the form.
  const continueWithToken = async () => {
    const tokenHash = getRecoveryTokenHash();
    if (!tokenHash) {
      setStatus('invalid');
      return;
    }
    setStatus('verifying');
    clearRecoveryTokenHash();
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'recovery',
    });
    setStatus(!verifyError && data.session ? 'valid' : 'invalid');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password || !confirmPassword) {
      setError('Fyll inn begge feltene.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passordene er ikke like.');
      return;
    }
    if (mfaFactorId && !/^\d{6}$/.test(mfaCode)) {
      setError('Skriv inn den sekssifrede koden fra autentiseringsappen.');
      return;
    }
    setSaving(true);
    if (mfaFactorId) {
      const { error: mfaError } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaFactorId,
        code: mfaCode,
      });
      if (mfaError) {
        setSaving(false);
        setMfaCode('');
        setError('Koden fra autentiseringsappen stemmer ikke. Prøv igjen.');
        return;
      }
      // The session is aal2 now; a retry after a password error needs no new code.
      setMfaFactorId(null);
    }
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) {
      setError(norwegianAuthError(updateError.message, updateError.code));
      return;
    }
    // End the recovery session before returning to login. Without this, the
    // recovery session would still be active and AdminLogin would send an
    // account with an editor role straight into the editor — turning a mailbox
    // link into editor entry. Signing out forces a normal sign-in, where the
    // unchanged role gate runs exactly as it does today.
    await supabase.auth.signOut();
    setStatus('saved');
  };

  const card = (children: React.ReactNode) => (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-sm">
        {children}
        <p className="text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground">← Tilbake til bjorli.no</Link>
        </p>
      </div>
    </div>
  );

  if (status === 'confirm' || status === 'verifying') {
    return card(
      <>
        <h1 className="font-display text-2xl font-semibold mb-1 text-foreground">Tilbakestill passord</h1>
        <p className="text-sm text-muted-foreground mt-4 mb-6">
          Du har bedt om å tilbakestille passordet ditt. Trykk Fortsett for å bekrefte lenken og
          velge et nytt passord.
        </p>
        <Button className="w-full" disabled={status === 'verifying'} onClick={continueWithToken}>
          {status === 'verifying' ? 'Kontrollerer lenken …' : 'Fortsett'}
        </Button>
      </>,
    );
  }

  if (status === 'checking') {
    return card(<p className="text-sm text-muted-foreground">Kontrollerer lenken …</p>);
  }

  if (status === 'invalid') {
    return card(
      <>
        <h1 className="font-display text-2xl font-semibold mb-1 text-foreground">Velg nytt passord</h1>
        <p className="text-sm text-muted-foreground mt-4 mb-6">
          Denne tilbakestillingslenken er ugyldig eller har utløpt.
        </p>
        <Button className="w-full" onClick={() => navigate('/admin/login?reset=1')}>
          Be om en ny lenke
        </Button>
      </>,
    );
  }

  if (status === 'saved') {
    return card(
      <>
        <h1 className="font-display text-2xl font-semibold mb-1 text-foreground">Velg nytt passord</h1>
        <p className="text-sm text-muted-foreground mt-4 mb-6">Passordet ditt er oppdatert.</p>
        <Button className="w-full" onClick={() => navigate('/admin/login')}>
          Til innlogging
        </Button>
      </>,
    );
  }

  return card(
    <>
      <h1 className="font-display text-2xl font-semibold mb-1 text-foreground">Velg nytt passord</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Velg et nytt passord for kontoen din på bjorli.no.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label className="mb-1.5 block text-sm">Nytt passord</Label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-sm">Gjenta nytt passord</Label>
          <Input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {mfaFactorId && (
          <div>
            <Label htmlFor="reset-mfa-code" className="mb-1.5 block text-sm">
              Kode fra autentiseringsappen
            </Label>
            <Input
              id="reset-mfa-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              required
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? 'Lagrer …' : 'Lagre nytt passord'}
        </Button>
      </form>
    </>,
  );
};

export default AdminResetPassword;
