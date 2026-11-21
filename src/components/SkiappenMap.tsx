import * as React from 'react';
import { Map, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FACTS_COPY, SKIAPPEN_AREA_URL } from '@/lib/resortFacts';
import type { Locale } from '@/i18n/locales/types';

/** Existing weather-page presentation; no polling or timeout hiding. */
export default function SkiappenMap({ locale, onOpen }: { locale: Locale; onOpen?: () => void }) {
  const c = FACTS_COPY[locale];
  return <div data-skiappen-map>
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <iframe src={SKIAPPEN_AREA_URL} title={c.mapTitle} loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin" allow="geolocation 'none'; fullscreen"
        className="block w-full h-[480px] md:h-[600px] border-0" />
    </div>
    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{c.attribution}</p>
    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{c.mapHelp}</p>
    <div className="mt-6 flex justify-center">
      <Button asChild variant="outline" className="h-auto min-h-11 whitespace-normal rounded-lg border-border bg-card px-5 py-3 text-center">
        <a href={SKIAPPEN_AREA_URL} target="_blank" rel="noopener noreferrer" onClick={onOpen}>
          <Map className="text-secondary" aria-hidden="true" />{c.mapCta}
          <span className="sr-only"> ({c.newTab})</span><ExternalLink className="opacity-60" aria-hidden="true" />
        </a>
      </Button>
    </div>
  </div>;
}