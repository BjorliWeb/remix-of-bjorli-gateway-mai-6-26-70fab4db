import * as React from 'react';
import { Button } from '@/components/ui/button';
import SkiappenMap from '@/components/SkiappenMap';
import { alpineStats, alpineMapStats, difficultyDistribution, FACTS_COPY, RESORT_FACTS } from '@/lib/resortFacts';
import { localizeHref } from '@/i18n/localizeHref';
import type { Locale } from '@/i18n/locales/types';

export function AlpineFacts({ locale }: { locale: Locale }) {
  const c = FACTS_COPY[locale];
  return <section data-alpine-facts aria-labelledby="alpine-facts-heading" className="mb-16 min-w-0 break-words text-foreground">
    <h2 id="alpine-facts-heading" className="font-display text-2xl md:text-3xl font-bold mb-6">{c.heading}</h2>
    <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,8.5rem),1fr))] md:grid-cols-4 gap-4 mb-8">
      {alpineStats(locale).map(s => <div key={s.label} className="min-w-0 bg-card rounded-lg p-4 md:p-6 text-center border border-border break-words">
        <dt className="text-sm text-muted-foreground mb-2">{s.label}</dt>
        <dd className="font-body text-xl md:text-2xl font-bold text-secondary break-words">{s.value}</dd>
      </div>)}
    </dl>
    <ul className="list-disc pl-5 space-y-3 leading-relaxed">{c.facilities.map(text => <li key={text}>{text}</li>)}</ul>
    <div className="mt-8">
      <h3 className="font-body text-lg font-semibold mb-2">{c.difficultyHeading}</h3>
      <p className="text-sm text-muted-foreground mb-4">{c.difficultyNote}</p>
      <div aria-hidden="true" className="alpine-difficulty-bar flex h-5 overflow-hidden rounded border border-border">
        {difficultyDistribution(locale).map(d => <span key={d.key} className={`alpine-difficulty-${d.key}`} style={{ flex: d.percent }} />)}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,7rem),1fr))] gap-3 mt-3 text-sm">
        {difficultyDistribution(locale).map(d => <li key={d.key} className="flex items-center gap-2">
          <span aria-hidden="true" className={`alpine-difficulty-marker alpine-difficulty-${d.key}`} />
          <span>{d.label}: <strong>{d.percent} %</strong></span>
        </li>)}
      </ul>
    </div>
  </section>;
}

export function NordicSupport({ locale }: { locale: Locale }) {
  const c = FACTS_COPY[locale];
  return <section data-nordic-support aria-labelledby="nordic-support-heading" className="py-12 md:py-16 px-4">
    <div className="container mx-auto max-w-3xl">
      <h2 id="nordic-support-heading" className="font-display text-2xl md:text-3xl font-bold mb-4">{c.supportTitle}</h2>
      <p className="leading-relaxed mb-6">{c.supportBody}</p>
      <dl className="space-y-3 font-body">
        <div className="flex flex-wrap gap-x-3 gap-y-1"><dt className="font-semibold">Vipps:</dt><dd>{RESORT_FACTS.vipps}</dd></div>
        <div className="flex flex-wrap gap-x-3 gap-y-1"><dt className="font-semibold">{c.bankLabel}:</dt><dd>{RESORT_FACTS.bankAccount}</dd></div>
      </dl>
    </div>
  </section>;
}

export function TrailMapSections({ locale, alpineImage, alpineAlt, openLabel, operationalNote }: {
  locale: Locale; alpineImage: string; alpineAlt: string; openLabel: string; operationalNote: string;
}) {
  const c = FACTS_COPY[locale];
  return <div className="px-4 pb-16 md:pb-24">
    <div className="container mx-auto max-w-5xl">
      <section aria-labelledby="alpine-map-heading">
        <h2 id="alpine-map-heading" className="font-display text-2xl md:text-3xl font-bold mb-6">{c.alpineTitle}</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {alpineMapStats(locale).map(s => <div key={s.label}><dt className="text-sm text-muted-foreground">{s.label}</dt><dd className="font-body text-lg font-semibold">{s.value}</dd></div>)}
        </dl>
        <figure>
          <a href={alpineImage} target="_blank" rel="noopener noreferrer" aria-label={openLabel}
            className="block overflow-hidden rounded-xl border border-border bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
            <img src={alpineImage} alt={alpineAlt} width={1024} height={761} loading="lazy" className="block w-full h-auto" />
          </a>
          <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed">{operationalNote}</figcaption>
        </figure>
        <p className="mt-4"><a href={localizeHref('/bjorli-skisenter', locale)} className="text-primary underline underline-offset-4">{c.fullFacts}</a></p>
      </section>
      <section aria-labelledby="nordic-map-heading" className="mt-12 md:mt-16">
        <h2 id="nordic-map-heading" className="font-display text-2xl md:text-3xl font-bold mb-4">{c.nordicTitle}</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">{c.nordicShort}</p>
        <p className="mb-6"><Button asChild variant="link" className="h-auto p-0 whitespace-normal text-left underline">
          <a href={localizeHref('/langrenn', locale)}>{c.nordicMore}</a>
        </Button></p>
        <SkiappenMap locale={locale} />
      </section>
    </div>
  </div>;
}