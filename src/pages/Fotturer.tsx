import { useState } from 'react';
import SubPage from '@/components/SubPage';

const OUTDOORACTIVE_URL = 'https://no.outdooractive.com/oar-lesja-kommune/';

const OutdooractiveMapSection = () => {
  const [failed, setFailed] = useState(false);

  return (
    <section className="pb-16 md:pb-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 md:mb-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            Turkart for Bjorli og Lesja
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Utforsk turforslag, ruter og nærområder rundt Bjorli, Lesja og fjellområdene rundt.
          </p>
        </div>

        {!failed ? (
          <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
            <iframe
              src={`${OUTDOORACTIVE_URL}?embed=1`}
              title="Outdooractive turkart – Lesja kommune"
              loading="lazy"
              allowFullScreen
              onError={() => setFailed(true)}
              className="w-full block border-0 h-[600px] md:h-[800px]"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            Kartet kunne ikke lastes inn her.
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <a
            href={OUTDOORACTIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground hover:bg-muted transition-colors text-sm font-medium"
          >
            Åpne turkart i nytt vindu
          </a>
        </div>
      </div>
    </section>
  );
};

const Fotturer = () => (
  <SubPage slug="fotturer" afterIntro={<OutdooractiveMapSection />} />
);

export default Fotturer;
