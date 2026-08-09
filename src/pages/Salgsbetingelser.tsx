import PageHero from '@/components/PageHero';
import heroImage from '@/assets/hero-winter.jpg';
import { usePageCopy } from '@/i18n/usePageCopy';
import { SALES_TERMS_COPY, SalesTermsBody } from './salesTermsContent';

/**
 * Standalone Salgsbetingelser (Terms of Sale) page at /salgsbetingelser.
 * Legal page in its own right — separate from /personvern. The text is the
 * exact same copy already used in the Bjorli Skisenter accordion.
 */
const Salgsbetingelser = () => {
  const tr = usePageCopy(SALES_TERMS_COPY);

  return (
    <div>
      <PageHero title={tr.heading} subtitle={tr.lead} image={heroImage} />
      <section className="py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <article>
            <h2 className="sr-only">{tr.introHeading}</h2>
            <SalesTermsBody tr={tr} />
          </article>
        </div>
      </section>
    </div>
  );
};

export default Salgsbetingelser;
