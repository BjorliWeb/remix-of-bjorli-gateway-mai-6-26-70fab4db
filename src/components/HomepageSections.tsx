import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Mountain,
  Thermometer,
  CloudSnow,
  Ticket,
  Clock,
  Camera,
  Map as MapIcon,
  Home as HomeIcon,
  GraduationCap,
  Coffee,
  Activity,
  AlertCircle,
  ChevronRight,
  Train,
  Car,
  Bike,
  Users,
  TreePine,
  Snowflake,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useLocalizedPath } from '@/i18n/useLocalizedPath';
import type { CmsHomepageSection } from '@/lib/cms';
import LiveAlertBanner from '@/components/LiveAlertBanner';
import LiveStatusCards from '@/components/LiveStatusCards';
import { track, type AnalyticsEventName } from '@/lib/analytics';

/**
 * Renders the composed homepage sections delivered by the CMS adapter.
 * The component is purely presentational — all editorial content comes
 * from `getHomepage()`. UI chrome (icons, motion, layout) lives here.
 */

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  lifts: Mountain,
  slopes: Activity,
  snow: CloudSnow,
  temperature: Thermometer,
  clock: Clock,
  camera: Camera,
  mountain: Mountain,
  ticket: Ticket,
  map: MapIcon,
  home: HomeIcon,
  activity: Activity,
  coffee: Coffee,
  graduationCap: GraduationCap,
  car: Car,
  train: Train,
  bike: Bike,
  users: Users,
  treePine: TreePine,
  snowflake: Snowflake,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const ButtonLink = ({
  href,
  external,
  variant = 'primary',
  icon,
  children,
  size = 'lg',
  lp,
}: {
  href: string;
  external?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string;
  children: React.ReactNode;
  size?: 'lg' | 'default';
  lp: (p: string) => string;
}) => {
  const Icon = icon ? ICONS[icon] : undefined;
  const btnVariant = variant === 'primary' ? 'default' : variant;
  // Map common destinations to GA4 events. Inert when analytics not configured.
  const lower = href.toLowerCase();
  let evt: AnalyticsEventName = 'click_external_link';
  if (lower.includes('skiperformance') || lower.includes('skugroup')) evt = 'click_buy_ski_pass';
  else if (lower.includes('/overnatting')) evt = 'click_accommodation';
  else if (lower.includes('/skisenter') || lower.includes('bjorli-skisenter')) evt = 'click_bjorli_skisenter';
  else if (lower.includes('/transport') || lower.includes('maps')) evt = 'click_directions';
  else if (lower.includes('entur')) evt = 'click_train_info';
  else if (!external) evt = 'click_external_link';
  const onClick = () =>
    track(evt, {
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      link_url: href,
      link_text: typeof children === 'string' ? children : undefined,
      outbound: Boolean(external),
    });
  const inner = (
    <Button variant={btnVariant as any} size={size} className="font-semibold">
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
      {variant === 'primary' && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {inner}
      </a>
    );
  }
  return <Link to={lp(href)} onClick={onClick}>{inner}</Link>;
};

export const HomepageSections = ({ sections }: { sections: CmsHomepageSection[] }) => {
  const lp = useLocalizedPath();

  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case 'status':
            return <LiveStatusCards key={section.id} section={section} />;

          case 'alert':
            return (
              <LiveAlertBanner
                key={section.id}
                fallback={{
                  label: section.label,
                  message: section.message,
                  ctaLabel: section.ctaLabel,
                  ctaHref: section.ctaHref,
                }}
              />
            );

          case 'intro':
            return (
              <section key={section.id} className="py-28 md:py-40 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                  {section.title && (
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-8 leading-[1.05] tracking-tight">{section.title}</h2>
                  )}
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">{section.body}</p>
                </div>
              </section>
            );

          case 'cardGrid':
            // Editorial trust block: headline left, items as a quiet typographic
            // list on the right. No boxes, no equal-weight grid.
            return (
              <section key={section.id} className="py-28 md:py-40 px-4">
                <div className="container mx-auto max-w-6xl">
                  <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                    <div className="lg:col-span-5">
                      {section.eyebrow && (
                        <div className="text-secondary text-xs font-medium tracking-[0.22em] uppercase mb-5">{section.eyebrow}</div>
                      )}
                      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.02] tracking-tight">{section.title}</h2>
                      {section.subtitle && (
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-md">{section.subtitle}</p>
                      )}
                    </div>
                    <div className="lg:col-span-7">
                      <ul className="divide-y divide-border/60">
                        {section.items.map((item, i) => {
                          const Icon = (item.icon && ICONS[item.icon]) || Mountain;
                          return (
                            <motion.li
                              key={item.title}
                              custom={i}
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              variants={fadeUp}
                              className="py-7 first:pt-0 flex gap-6 items-start"
                            >
                              <Icon className="h-5 w-5 text-secondary mt-1.5 shrink-0" />
                              <div className="flex-1">
                                <div className="font-display text-xl font-semibold text-foreground mb-1.5 tracking-tight">{item.title}</div>
                                <div className="text-base text-muted-foreground leading-relaxed">{item.desc}</div>
                              </div>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'feature': {
            const imageLeft = section.imageSide !== 'right';
            const bg = !imageLeft ? 'bg-muted/30' : '';
            return (
              <section key={section.id} className={`py-24 md:py-36 px-4 ${bg}`}>
                <div className="container mx-auto max-w-6xl">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className={`relative rounded-2xl overflow-hidden h-96 lg:h-[560px] ${imageLeft ? '' : 'order-1 lg:order-2'}`}>
                      <img src={section.image.url} alt={section.image.alt || section.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className={imageLeft ? '' : 'order-2 lg:order-1'}>
                      {section.eyebrow && (
                        <div className="text-secondary text-xs font-medium tracking-[0.18em] uppercase mb-4">{section.eyebrow}</div>
                      )}
                      <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">{section.title}</h2>
                      <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10 max-w-xl">{section.body}</p>
                      {section.subcards && section.subcards.length > 0 && (
                        <div className="grid sm:grid-cols-2 gap-4 mb-10">
                          {section.subcards.map((c) => (
                            <div key={c.title} className="rounded-xl border border-border/70 bg-card/50 p-5">
                              <div className="font-display font-semibold text-foreground mb-1.5">{c.title}</div>
                              {c.desc && <div className="text-sm text-muted-foreground leading-relaxed">{c.desc}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3">
                        {section.ctas.map((cta) => (
                          <ButtonLink key={cta.label} {...cta} lp={lp}>
                            {cta.label}
                          </ButtonLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          case 'imageCards':
            // Editorial split: headline aligned left, staggered card heights to
            // break the equal-grid feeling.
            return (
              <section key={section.id} className="py-28 md:py-36 px-4">
                <div className="container mx-auto max-w-7xl">
                  <div className="max-w-2xl mb-16">
                    {section.eyebrow && (
                      <div className="text-secondary text-xs font-medium tracking-[0.22em] uppercase mb-5">{section.eyebrow}</div>
                    )}
                    {section.title && (
                      <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[1.02] tracking-tight">{section.title}</h2>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {section.cards.map((card, i) => {
                      // Stagger heights and vertical offset to reduce grid feel.
                      const heights = ['h-[480px]', 'h-[400px]', 'h-[520px]'];
                      const offsets = ['', 'lg:mt-16', 'lg:-mt-4'];
                      return (
                        <Link key={card.title} to={lp(card.href)} className={offsets[i % 3]}>
                          <motion.div custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className={`group relative overflow-hidden cursor-pointer ${heights[i % 3]}`}>
                            <img src={card.image.url} alt={card.image.alt || card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.04]" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/85 via-deep-navy/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                              {card.eyebrow && <div className="text-primary-foreground/75 text-[11px] font-medium tracking-[0.22em] uppercase mb-3">{card.eyebrow}</div>}
                              <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground leading-[1.05] tracking-tight">{card.title}</h3>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          case 'tips':
            return (
              <section key={section.id} className="py-24 md:py-32 px-4 bg-muted/30">
                <div className="container mx-auto">
                  <div className="flex flex-wrap gap-6 items-end justify-between mb-14">
                    <div className="max-w-xl">
                      <div className="text-secondary text-xs font-medium tracking-[0.18em] uppercase mb-3">{section.eyebrow}</div>
                      <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-[1.05] tracking-tight">{section.title}</h2>
                      <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                    </div>
                    <Link to={lp(section.ctaHref)}>
                      <Button variant="outline">
                        {section.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {section.items.slice(0, 3).map((tip, i) => (
                      <Link key={tip.id} to={lp(`/tips/${tip.slug}`)}>
                        <motion.article custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-card rounded-2xl overflow-hidden border border-border/70 hover:border-secondary/40 transition-colors h-full">
                          {tip.heroImage && (
                            <div className="aspect-[5/4] overflow-hidden">
                              <img src={tip.heroImage.url} alt={tip.heroImage.alt || tip.title} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          )}
                          <div className="p-7">
                            {tip.category && <div className="text-[11px] font-medium text-secondary uppercase tracking-[0.18em] mb-3">{tip.category}</div>}
                            <h3 className="font-display text-xl font-bold text-foreground mb-3 leading-tight">{tip.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{tip.intro}</p>
                          </div>
                        </motion.article>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'events':
            return (
              <section key={section.id} className="py-24 md:py-32 px-4">
                <div className="container mx-auto">
                  <div className="flex flex-wrap gap-6 items-end justify-between mb-14">
                    <div className="max-w-xl">
                      <div className="text-secondary text-xs font-medium tracking-[0.18em] uppercase mb-3">{section.eyebrow}</div>
                      <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-[1.05] tracking-tight">{section.title}</h2>
                      <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                    </div>
                    <Link to={lp(section.ctaHref)}>
                      <Button variant="outline">
                        {section.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {section.items.slice(0, 3).map((ev, i) => (
                      <Link key={ev.id} to={lp(`/arrangementer/${ev.slug}`)}>
                        <motion.article custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group relative rounded-2xl overflow-hidden h-96">
                          {ev.heroImage && (
                            <img src={ev.heroImage.url} alt={ev.heroImage.alt || ev.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" loading="lazy" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/85 via-deep-navy/15 to-transparent" />
                          {ev.date && (
                            <div className="absolute top-5 left-5 bg-background/90 backdrop-blur text-foreground rounded-md px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase">
                              {ev.date}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-7">
                            {ev.category && <div className="text-primary-foreground/75 text-[11px] font-medium tracking-[0.18em] uppercase mb-2">{ev.category}</div>}
                            <h3 className="font-display font-bold text-primary-foreground text-2xl leading-tight mb-2">{ev.title}</h3>
                            <p className="text-primary-foreground/85 text-sm leading-relaxed line-clamp-2">{ev.intro}</p>
                          </div>
                        </motion.article>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'beyond':
            return (
              <section key={section.id} className="py-24 md:py-36 px-4 bg-deep-navy text-primary-foreground">
                <div className="container mx-auto max-w-6xl">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
                    <div>
                      <div className="text-secondary text-xs font-medium tracking-[0.18em] uppercase mb-4">{section.eyebrow}</div>
                      <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-[1.05] tracking-tight">{section.title}</h2>
                      <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed">{section.body}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {section.images.map((img, i) => (
                        <img key={i} src={img.url} alt={img.alt || ''} className={`rounded-2xl aspect-square object-cover ${i % 2 ? 'mt-10' : ''}`} loading="lazy" />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {section.items.map((item, i) => {
                      const Icon = (item.icon && ICONS[item.icon]) || Mountain;
                      return (
                        <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl p-6 bg-primary-foreground/[0.04] border border-primary-foreground/10">
                          <Icon className="h-6 w-6 text-secondary mb-4" />
                          <div className="font-display font-semibold mb-1.5">{item.title}</div>
                          <div className="text-sm text-primary-foreground/70 leading-relaxed">{item.desc}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          case 'gettingHere':
            return (
              <section key={section.id} className="py-24 md:py-32 px-4">
                <div className="container mx-auto max-w-5xl">
                  <div className="text-center mb-14 max-w-2xl mx-auto">
                    <div className="text-secondary text-xs font-medium tracking-[0.18em] uppercase mb-3">{section.eyebrow}</div>
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-5 leading-[1.05] tracking-tight">{section.title}</h2>
                    <p className="text-muted-foreground text-lg">{section.body}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
                    {section.cities.map((c, i) => (
                      <motion.div key={c.city} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-card rounded-xl p-4 text-center border border-border/70">
                        <div className="text-lg font-bold text-secondary">{c.km}</div>
                        <div className="text-xs text-muted-foreground mt-1">{c.city}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {section.ctas.map((cta) => (
                      <ButtonLink key={cta.label} {...cta} variant="outline" lp={lp}>
                        {cta.label}
                      </ButtonLink>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'teaser':
            return (
              <section key={section.id} className="relative py-32 md:py-40 px-4 overflow-hidden">
                <img src={section.image.url} alt={section.image.alt || section.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/80 via-deep-navy/55 to-deep-navy/20" />
                <div className="relative z-10 container mx-auto max-w-3xl">
                  {section.eyebrow && <div className="text-secondary text-xs font-medium tracking-[0.18em] uppercase mb-4">{section.eyebrow}</div>}
                  <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-[1.05] tracking-tight">{section.title}</h2>
                  <p className="text-primary-foreground/85 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">{section.body}</p>
                  <Link to={lp(section.ctaHref)}>
                    <Button size="lg" variant="secondary" className="font-semibold">
                      {section.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </section>
            );

          case 'news':
            return (
              <section key={section.id} className="py-24 md:py-32 px-4 bg-muted/30">
                <div className="container mx-auto">
                  <div className="flex flex-wrap gap-6 items-end justify-between mb-14">
                    <div className="max-w-xl">
                      <div className="text-secondary text-xs font-medium tracking-[0.18em] uppercase mb-3">{section.eyebrow}</div>
                      <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3 leading-[1.05] tracking-tight">{section.title}</h2>
                      <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                    </div>
                    <Link to={lp(section.ctaHref)}>
                      <Button variant="outline">
                        {section.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {section.items.slice(0, 3).map((n, i) => (
                      <Link key={n.id} to={lp(`/nyheter/${n.slug}`)}>
                        <motion.article custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-card rounded-2xl overflow-hidden border border-border/70 hover:border-secondary/40 transition-colors h-full">
                          {n.heroImage && (
                            <div className="aspect-[5/4] overflow-hidden">
                              <img src={n.heroImage.url} alt={n.heroImage.alt || n.title} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          )}
                          <div className="p-7">
                            <div className="flex items-center gap-2 mb-3">
                              {n.category && <span className="text-[11px] font-medium text-secondary uppercase tracking-[0.18em]">{n.category}</span>}
                              {n.date && <span className="text-xs text-muted-foreground">·</span>}
                              {n.date && <span className="text-xs text-muted-foreground">{n.date}</span>}
                            </div>
                            <h3 className="font-display text-xl font-bold text-foreground mb-3 leading-tight">{n.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{n.intro}</p>
                          </div>
                        </motion.article>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'faq':
            return (
              <section key={section.id} className="py-24 md:py-32 px-4">
                <div className="container mx-auto max-w-3xl">
                  <div className="text-center mb-14">
                    <div className="text-secondary text-xs font-medium tracking-[0.18em] uppercase mb-3">{section.eyebrow}</div>
                    <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-[1.05] tracking-tight">{section.title}</h2>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-border">
                        <AccordionTrigger className="text-left font-display font-semibold text-base md:text-lg hover:no-underline">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base leading-relaxed">{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>
            );

          case 'activities':
            return (
              <div key={section.id}>
                <section className="py-24 md:py-32 px-4 bg-muted/30">
                  <div className="container mx-auto">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                      <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 leading-[1.05] tracking-tight">{section.title}</h2>
                      <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
                      {section.items.map((a, i) => {
                        const Icon = (a.icon && ICONS[a.icon]) || Mountain;
                        return (
                          <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-2xl p-6 md:p-7 border border-border/70 hover:border-secondary/40 transition-colors">
                            <Icon className="h-6 w-6 text-secondary mb-4" />
                            <div className="font-display font-semibold text-foreground mb-1.5">{a.title}</div>
                            <div className="text-sm text-muted-foreground leading-relaxed">{a.desc}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </section>
                {section.imageCards && section.imageCards.length > 0 && (
                  <section className="py-24 md:py-32 px-4">
                    <div className="container mx-auto grid md:grid-cols-2 gap-8 max-w-6xl">
                      {section.imageCards.map((c, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative rounded-2xl overflow-hidden h-[460px]">
                          <img src={c.image.url} alt={c.image.alt || c.title} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/85 via-deep-navy/15 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <h3 className="font-display text-3xl font-bold text-primary-foreground leading-tight">{c.title}</h3>
                            {c.desc && <p className="text-primary-foreground/85 text-base mt-2 leading-relaxed">{c.desc}</p>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default HomepageSections;