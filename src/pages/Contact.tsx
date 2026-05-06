import { useState } from 'react';
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

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  message: z.string().trim().min(1, 'Required').max(2000),
});

const Contact = () => {
  const { t } = useLanguage();
  const s = t.contactPage;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
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
                  <a href="mailto:post@bjorliskisenter.no" className="text-muted-foreground hover:text-foreground transition-colors">{t.footer.email}</a>
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
