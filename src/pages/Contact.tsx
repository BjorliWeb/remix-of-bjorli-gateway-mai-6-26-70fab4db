import { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';

const Contact = () => {
  const { t } = useLanguage();
  const s = t.contactPage;
  const contactSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, s.formErrors.required).max(100),
        email: z.string().trim().email(s.formErrors.invalidEmail).max(255),
        phone: z.string().trim().max(30).optional().or(z.literal('')),
        message: z.string().trim().min(1, s.formErrors.required).max(2000),
      }),
    [s.formErrors.required, s.formErrors.invalidEmail],
  );
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // --- Bot / abuse protection ---------------------------------------------
  // Honeypot: real users never fill this hidden field; bots usually do.
  const [hp, setHp] = useState('');
  const mountedAt = useRef<number>(Date.now());
  const DEDUPE_KEY = 'bjorli_contact_last_v1';
  const DEDUPE_WINDOW_MS = 5 * 60 * 1000;
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  // ------------------------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Honeypot tripped → silently succeed (don't tip off bots).
    if (hp.trim() !== '') {
      toast({ title: s.successTitle, description: s.successDesc });
      setForm({ name: '', email: '', phone: '', message: '' });
      return;
    }
    // Minimum render-to-submit time (humans rarely submit < 2s).
    if (Date.now() - mountedAt.current < 2000) {
      toast({ title: s.errorTitle, description: s.errorDesc, variant: 'destructive' });
      return;
    }

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Duplicate submission guard (same content within 5 min).
    try {
      const fingerprint = `${result.data.email}|${result.data.message}`.slice(0, 500);
      const raw = window.localStorage.getItem(DEDUPE_KEY);
      if (raw) {
        const last = JSON.parse(raw) as { fp: string; ts: number };
        if (last.fp === fingerprint && Date.now() - last.ts < DEDUPE_WINDOW_MS) {
          toast({ title: s.successTitle, description: s.successDesc });
          return;
        }
      }
    } catch {
      /* ignore storage errors */
    }

    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      message: result.data.message,
    });
    setLoading(false);

    if (error) {
      toast({ title: s.errorTitle, description: s.errorDesc, variant: 'destructive' });
    } else {
      try {
        window.localStorage.setItem(
          DEDUPE_KEY,
          JSON.stringify({
            fp: `${result.data.email}|${result.data.message}`.slice(0, 500),
            ts: Date.now(),
          }),
        );
      } catch {
        /* ignore */
      }
      toast({ title: s.successTitle, description: s.successDesc });
      setForm({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div>
      <PageHero title={s.title} subtitle={s.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">{s.infoTitle}</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-secondary mt-1 shrink-0" />
                  <span className="text-muted-foreground">{t.footer.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-secondary shrink-0" />
                  <a href="tel:+4748152200" className="text-muted-foreground hover:text-foreground transition-colors">{t.footer.phone}</a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-secondary shrink-0" />
                  <a href="mailto:skisenter@bjorli.no" className="text-muted-foreground hover:text-foreground transition-colors">{t.footer.email}</a>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-md border border-border space-y-5"
            >
              {/* Honeypot — visually hidden, off-screen, not tab-reachable */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '-10000px',
                  top: 'auto',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                }}
              >
                <label htmlFor="company_website">Company website</label>
                <input
                  id="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="name">{s.nameLabel} *</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">{s.emailLabel} *</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">{s.phoneLabel}</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} />
              </div>
              <div>
                <Label htmlFor="message">{s.messageLabel} *</Label>
                <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={2000} />
                {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full font-semibold" size="lg">
                {loading ? '...' : s.submitBtn}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
