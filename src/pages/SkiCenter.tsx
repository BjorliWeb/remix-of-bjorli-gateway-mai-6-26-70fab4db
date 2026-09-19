import { useLanguage } from '@/i18n/LanguageContext';
import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import loypekartImage from '@/assets/bjorli-skisenter-loypekart-vinter.jpg';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { JsonLd } from '@/components/seo';
import { buildSkiResort } from '@/lib/seo/schema';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { trackSkiPassClick } from '@/lib/analytics';
import { getSkiCenterData } from '@/lib/cms/skiCenterData';
import { SalesTermsBody } from './salesTermsContent';

const SkiCenter = () => {
  const { locale } = useLanguage();
  const data = getSkiCenterData(locale);

  const pageUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : 'https://bjorli.no/bjorli-skisenter';

  return (
    <div>
      <JsonLd id="jsonld-skiresort" data={buildSkiResort(pageUrl, data.description)} />
      <PageHero title={data.title} subtitle={data.subtitle} image={heroImage} />
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground leading-relaxed mb-12 text-center"
          >
            {data.description}
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {data.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 text-center shadow-md border border-border"
              >
                <div className="text-3xl font-bold text-secondary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-2xl p-8 md:p-10 shadow-lg border border-border text-center">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
              {data.liftPass.heading}
            </h3>
            <p className="text-base md:text-lg opacity-90 mb-6 max-w-xl mx-auto">
              {data.liftPass.support}
            </p>
            <Button
              asChild
              size="lg"
              variant="default"
              className="text-base md:text-lg px-8 py-6 h-auto w-full sm:w-auto"
            >
              <a
                href={data.liftPass.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackSkiPassClick({
                    link_url: data.liftPass.url,
                    link_text: data.liftPass.cta,
                    cta_location: 'ski_center_page',
                  })
                }
              >
                {data.liftPass.cta} <ArrowUpRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <figure className="mt-16 space-y-3">
            <a
              href={loypekartImage}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-border shadow-md bg-card"
              aria-label={data.trailMap.ariaOpen}
            >
              <img
                src={loypekartImage}
                alt={data.trailMap.alt}
                className="w-full h-auto block"
                loading="lazy"
              />
            </a>
            <figcaption className="text-sm text-foreground/70 leading-relaxed">
              {data.trailMap.caption}
            </figcaption>
            <p className="text-xs text-muted-foreground">{data.trailMap.note}</p>
          </figure>
          <section className="mt-20" aria-labelledby="salgsbetingelser-heading">
            <h2
              id="salgsbetingelser-heading"
              className="font-display text-2xl md:text-3xl font-bold mb-3"
            >
              {data.salesTerms.heading}
            </h2>
            <p className="text-muted-foreground mb-6">{data.salesTerms.lead}</p>
            <Accordion
              type="single"
              collapsible
              className="bg-card rounded-xl border border-border px-4 md:px-6"
            >
              <AccordionItem value="salgsbetingelser" className="border-b-0">
                <AccordionTrigger className="text-base md:text-lg font-semibold">
                  {data.salesTerms.copy.trigger}
                </AccordionTrigger>
                <AccordionContent>
                  <SalesTermsBody tr={data.salesTerms.copy} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </section>
    </div>
  );
};

export default SkiCenter;
