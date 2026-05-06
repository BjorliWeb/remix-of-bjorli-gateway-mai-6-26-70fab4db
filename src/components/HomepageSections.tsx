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
              <section key={section.id} className="py-20 md:py-28 px-4">
                <div className="container mx-auto max-w-3xl text-center">
                  {section.title && (
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">{section.title}</h2>
                  )}
                  <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">{section.body}</p>
                </div>
              </section>
            );

          case 'cardGrid':
            return (
              <section key={section.id} className="py-16 px-4 bg-muted/40">
                <div className="container mx-auto">
                  <div className="text-center mb-12 max-w-2xl mx-auto">
                    {section.eyebrow && (
                      <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-3">{section.eyebrow}</div>
                    )}
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">{section.title}</h2>
                    {section.subtitle && <p className="text-muted-foreground text-lg">{section.subtitle}</p>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                    {section.items.map((item, i) => {
                      const Icon = (item.icon && ICONS[item.icon]) || Mountain;
                      return (
                        <motion.div
                          key={item.title}
                          custom={i}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={fadeUp}
                          className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md hover:border-secondary/40 transition-all"
                        >
                          <Icon className="h-6 w-6 text-secondary mb-3" />
                          <div className="font-display font-semibold text-foreground mb-1">{item.title}</div>
                          <div className="text-sm text-muted-foreground leading-snug">{item.desc}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          case 'feature': {
            const imageLeft = section.imageSide !== 'right';
            const bg = !imageLeft ? 'bg-muted/40' : '';
            return (
              <section key={section.id} className={`py-20 md:py-24 px-4 ${bg}`}>
                <div className="container mx-auto max-w-6xl">
                  <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div className={`relative rounded-2xl overflow-hidden h-80 lg:h-[480px] ${imageLeft ? '' : 'order-1 lg:order-2'}`}>
                      <img src={section.image.url} alt={section.image.alt || section.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className={imageLeft ? '' : 'order-2 lg:order-1'}>
                      {section.eyebrow && (
                        <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-3">{section.eyebrow}</div>
                      )}
                      <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-5">{section.title}</h2>
                      <p className="text-muted-foreground text-lg leading-relaxed mb-8">{section.body}</p>
                      {section.subcards && section.subcards.length > 0 && (
                        <div className="grid sm:grid-cols-2 gap-3 mb-8">
                          {section.subcards.map((c) => (
                            <div key={c.title} className="rounded-xl border border-border bg-card/60 p-4">
                              <div className="font-display font-semibold text-foreground mb-1">{c.title}</div>
                              {c.desc && <div className="text-sm text-muted-foreground leading-snug">{c.desc}</div>}
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
            return (
              <section key={section.id} className="py-20 px-4">
                <div className="container mx-auto">
                  <div className="text-center mb-12">
                    {section.eyebrow && (
                      <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-3">{section.eyebrow}</div>
                    )}
                    {section.title && (
                      <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{section.title}</h2>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
                    {section.cards.map((card, i) => (
                      <Link key={card.title} to={lp(card.href)}>
                        <motion.div custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group relative rounded-2xl overflow-hidden shadow-lg h-80 cursor-pointer">
                          <img src={card.image.url} alt={card.image.alt || card.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/95 via-deep-navy/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            {card.eyebrow && <div className="text-secondary text-xs font-semibold uppercase tracking-wider mb-1">{card.eyebrow}</div>}
                            <h3 className="font-display text-xl font-bold text-primary-foreground">{card.title}</h3>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'tips':
            return (
              <section key={section.id} className="py-20 px-4 bg-muted/40">
                <div className="container mx-auto">
                  <div className="flex flex-wrap gap-4 items-end justify-between mb-10">
                    <div>
                      <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">{section.eyebrow}</div>
                      <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">{section.title}</h2>
                      <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                    </div>
                    <Link to={lp(section.ctaHref)}>
                      <Button variant="outline">
                        {section.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {section.items.map((tip, i) => (
                      <Link key={tip.id} to={lp(`/tips/${tip.slug}`)}>
                        <motion.article custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow h-full">
                          {tip.heroImage && (
                            <div className="aspect-[4/3] overflow-hidden">
                              <img src={tip.heroImage.url} alt={tip.heroImage.alt || tip.title} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          )}
                          <div className="p-5">
                            {tip.category && <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">{tip.category}</div>}
                            <h3 className="font-display font-bold text-foreground mb-2 leading-tight">{tip.title}</h3>
                            <p className="text-sm text-muted-foreground leading-snug">{tip.intro}</p>
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
              <section key={section.id} className="py-20 px-4">
                <div className="container mx-auto">
                  <div className="flex flex-wrap gap-4 items-end justify-between mb-10">
                    <div>
                      <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">{section.eyebrow}</div>
                      <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">{section.title}</h2>
                      <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                    </div>
                    <Link to={lp(section.ctaHref)}>
                      <Button variant="outline">
                        {section.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {section.items.map((ev, i) => (
                      <Link key={ev.id} to={lp(`/arrangementer/${ev.slug}`)}>
                        <motion.article custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="group relative rounded-2xl overflow-hidden shadow-sm h-72">
                          {ev.heroImage && (
                            <img src={ev.heroImage.url} alt={ev.heroImage.alt || ev.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/95 via-deep-navy/30 to-transparent" />
                          {ev.date && (
                            <div className="absolute top-4 left-4 bg-secondary text-secondary-foreground rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
                              {ev.date}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            {ev.category && <div className="text-primary-foreground/70 text-xs font-semibold uppercase tracking-wider mb-1">{ev.category}</div>}
                            <h3 className="font-display font-bold text-primary-foreground text-lg leading-tight mb-1">{ev.title}</h3>
                            <p className="text-primary-foreground/80 text-sm">{ev.intro}</p>
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
              <section key={section.id} className="py-20 px-4 bg-deep-navy text-primary-foreground">
                <div className="container mx-auto max-w-6xl">
                  <div className="grid lg:grid-cols-2 gap-10 items-center mb-12">
                    <div>
                      <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-3">{section.eyebrow}</div>
                      <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">{section.title}</h2>
                      <p className="text-primary-foreground/80 text-lg leading-relaxed">{section.body}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {section.images.map((img, i) => (
                        <img key={i} src={img.url} alt={img.alt || ''} className={`rounded-xl aspect-square object-cover ${i % 2 ? 'mt-8' : ''}`} loading="lazy" />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {section.items.map((item, i) => {
                      const Icon = (item.icon && ICONS[item.icon]) || Mountain;
                      return (
                        <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-xl p-5 bg-primary-foreground/5 border border-primary-foreground/10">
                          <Icon className="h-6 w-6 text-secondary mb-3" />
                          <div className="font-display font-semibold mb-1">{item.title}</div>
                          <div className="text-sm text-primary-foreground/70">{item.desc}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );

          case 'gettingHere':
            return (
              <section key={section.id} className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                  <div className="text-center mb-12 max-w-2xl mx-auto">
                    <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">{section.eyebrow}</div>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">{section.title}</h2>
                    <p className="text-muted-foreground text-lg">{section.body}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
                    {section.cities.map((c, i) => (
                      <motion.div key={c.city} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-card rounded-xl p-4 text-center shadow-sm border border-border">
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
              <section key={section.id} className="relative py-24 px-4 overflow-hidden">
                <img src={section.image.url} alt={section.image.alt || section.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-deep-navy/85 via-deep-navy/60 to-deep-navy/30" />
                <div className="relative z-10 container mx-auto max-w-3xl">
                  {section.eyebrow && <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-3">{section.eyebrow}</div>}
                  <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-5">{section.title}</h2>
                  <p className="text-primary-foreground/85 text-lg leading-relaxed mb-8 max-w-2xl">{section.body}</p>
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
              <section key={section.id} className="py-20 px-4 bg-muted/40">
                <div className="container mx-auto">
                  <div className="flex flex-wrap gap-4 items-end justify-between mb-10">
                    <div>
                      <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">{section.eyebrow}</div>
                      <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-2">{section.title}</h2>
                      <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                    </div>
                    <Link to={lp(section.ctaHref)}>
                      <Button variant="outline">
                        {section.ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {section.items.map((n, i) => (
                      <Link key={n.id} to={lp(`/nyheter/${n.slug}`)}>
                        <motion.article custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-shadow h-full">
                          {n.heroImage && (
                            <div className="aspect-[4/3] overflow-hidden">
                              <img src={n.heroImage.url} alt={n.heroImage.alt || n.title} className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          )}
                          <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                              {n.category && <span className="text-xs font-semibold text-secondary uppercase tracking-wider">{n.category}</span>}
                              {n.date && <span className="text-xs text-muted-foreground">·</span>}
                              {n.date && <span className="text-xs text-muted-foreground">{n.date}</span>}
                            </div>
                            <h3 className="font-display font-bold text-foreground mb-2 leading-tight">{n.title}</h3>
                            <p className="text-sm text-muted-foreground leading-snug">{n.intro}</p>
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
              <section key={section.id} className="py-20 px-4">
                <div className="container mx-auto max-w-3xl">
                  <div className="text-center mb-10">
                    <div className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">{section.eyebrow}</div>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">{section.title}</h2>
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
                <section className="py-16 px-4 bg-muted/40">
                  <div className="container mx-auto">
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                      <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">{section.title}</h2>
                      <p className="text-muted-foreground text-lg">{section.subtitle}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
                      {section.items.map((a, i) => {
                        const Icon = (a.icon && ICONS[a.icon]) || Mountain;
                        return (
                          <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl p-5 shadow-sm border border-border hover:shadow-md hover:border-secondary/40 transition-all">
                            <Icon className="h-6 w-6 text-secondary mb-3" />
                            <div className="font-display font-semibold text-foreground mb-1">{a.title}</div>
                            <div className="text-sm text-muted-foreground leading-snug">{a.desc}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </section>
                {section.imageCards && section.imageCards.length > 0 && (
                  <section className="py-20 px-4">
                    <div className="container mx-auto grid md:grid-cols-2 gap-6 max-w-6xl">
                      {section.imageCards.map((c, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative rounded-2xl overflow-hidden h-80">
                          <img src={c.image.url} alt={c.image.alt || c.title} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/95 via-deep-navy/30 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <h3 className="font-display text-2xl font-bold text-primary-foreground">{c.title}</h3>
                            {c.desc && <p className="text-primary-foreground/85 text-sm mt-1">{c.desc}</p>}
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