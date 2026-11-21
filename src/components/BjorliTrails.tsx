import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, ArrowRightLeft, Download } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n/locales/types';
import { TRAILS, TRAIL_COPY, trailId, trailSummary, profileFor, segmentsFor, gpxFor, gpxFilename, number, distance, type Trail } from '@/lib/trails/trails';

function Profile({ trail, reversed, locale }: { trail: Trail; reversed: boolean; locale: Locale }) {
  const c = TRAIL_COPY[locale];
  const points = profileFor(trail, reversed);
  const [selected, setSelected] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(720);
  const [labelSize, setLabelSize] = useState(14);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const observer = new ResizeObserver(() => {
      setWidth(Math.max(180, svg.clientWidth));
      setLabelSize(parseFloat(getComputedStyle(svg).fontSize) * 0.875);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);
  const point = points[Math.min(selected, points.length - 1)];
  const total = points[points.length - 1][3];
  const bottom = trail.minEle - 10, top = trail.maxEle + 10;
  const left = labelSize * 4.5;
  const x = (m: number) => left + m / total * (width - left - 16);
  const y = (e: number) => 145 - (e - bottom) / (top - bottom) * 120;
  const readout = `${distance(point[3], locale)} · ${number(point[2], locale)} ${c.elevation}`;
  const labelId = `${trailId(trail.name)}-read`;
  return <div className="mt-5">
    <p className="text-sm text-muted-foreground break-words">
      {c.start}: {number(points[0][2], locale)} {c.elevation} · {c.end}: {number(points[points.length - 1][2], locale)} {c.elevation}<br />
      {c.lowest}: {number(trail.minEle, locale)} {c.elevation} · {c.highest}: {number(trail.maxEle, locale)} {c.elevation}
    </p>
    <svg ref={svgRef} className="mt-3 block w-full h-[220px] text-primary" viewBox={`0 0 ${width} 220`} role="img" aria-label={`${c.profile}: ${trail.name}`} onPointerMove={e => {
      const rect = e.currentTarget.getBoundingClientRect();
      const m = Math.max(0, Math.min(total, (e.clientX - rect.left - left) / (width - left - 16) * total));
      let closest = 0;
      for (let i = 1; i < points.length; i++) if (Math.abs(points[i][3] - m) < Math.abs(points[closest][3] - m)) closest = i;
      setSelected(closest);
    }}>
      <title>{c.profile}: {trail.name}</title>
      {[trail.minEle, Math.round((trail.minEle + trail.maxEle) / 2), trail.maxEle].map(e => <g key={e}>
        <line x1={left} x2={width - 16} y1={y(e)} y2={y(e)} stroke="currentColor" opacity="0.2" strokeDasharray="3 3" />
        <text x={left - 8} y={y(e) + 4} textAnchor="end" className="fill-current" fontSize={labelSize}>{number(e, locale)} m</text>
      </g>)}
      {(width < 480 ? [0, total] : [0, total / 2, total]).map((m, i, ticks) => <text key={i} x={x(m)} y={width < 480 && labelSize > 20 && i > 0 ? 208 : 174} textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'} className="fill-current" fontSize={labelSize}>{distance(m, locale)}</text>)}
      {segmentsFor(points).map((segment, i) => <path key={i} d={segment.map((p, j) => `${j ? 'L' : 'M'}${x(p[3]).toFixed(2)},${y(p[2]).toFixed(2)}`).join(' ')} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />)}
      <circle cx={x(point[3])} cy={y(point[2])} r="5" fill="currentColor" />
    </svg>
    <label id={labelId} htmlFor={`${labelId}-slider`} className="block text-sm font-semibold mt-2">{c.read}</label>
    <input id={`${labelId}-slider`} type="range" min="0" max={points.length - 1} step="1" value={selected} onChange={e => setSelected(Number(e.target.value))} aria-valuetext={readout} className="trail-range w-full min-h-11 cursor-pointer" />
    <p className="text-sm tabular-nums" aria-live="polite" aria-atomic="true">{readout}</p>
    {segmentsFor(points).length > 1 && <p className="mt-3 text-sm text-muted-foreground">{c.gap}</p>}
  </div>;
}

export default function BjorliTrails({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState('');
  const [directions, setDirections] = useState<Record<string, boolean>>({});
  const c = TRAIL_COPY[locale];
  useEffect(() => {
    const openHash = () => {
      let hash: string;
      try { hash = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      if (!TRAILS.some(t => trailId(t.name) === hash)) return;
      setOpen(hash);
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: 'start', behavior: 'auto' }));
    };
    openHash();
    window.addEventListener('hashchange', openHash);
    return () => window.removeEventListener('hashchange', openHash);
  }, [locale]);
  const download = (trail: Trail, reversed: boolean) => {
    const url = URL.createObjectURL(new Blob([gpxFor(trail, reversed)], { type: 'application/gpx+xml' }));
    const a = document.createElement('a');
    a.href = url; a.download = gpxFilename(trail, reversed);
    document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="bjorli-trails mt-10 text-left text-foreground" data-trail-list>
    <h3 className="font-display text-2xl font-bold mb-4">{c.title}</h3>
    <Accordion type="single" collapsible value={open} onValueChange={setOpen} className="space-y-3">
      {TRAILS.map((trail, i) => {
        const id = trailId(trail.name), reversed = Boolean(directions[id]);
        return <AccordionItem key={id} value={id} id={id} className="rounded-lg border border-border bg-card px-4 md:px-5 scroll-mt-32">
          <AccordionTrigger className="text-left gap-3 font-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4">
            <span className="flex min-w-0 items-center gap-3">
              <span className={`trail-dot trail-dot-${i}`} aria-hidden="true" />
              <span className="min-w-0"><span className="block text-lg font-semibold">{trail.name}</span><span className="block text-sm font-normal text-muted-foreground mt-1">{trailSummary(trail, locale)}</span></span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-base">
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,6rem),1fr))] gap-3 border-t border-border pt-4">
              {[[c.length,distance(trail.lengthKm * 1000,locale)], [c.ascent,`${number(reversed ? trail.ascentReverse : trail.ascent,locale)} m`], [c.descent,`${number(reversed ? trail.descentReverse : trail.descent,locale)} m`]].map(([label,value],j) => <div key={label} className="min-w-0"><dt className="text-sm text-muted-foreground break-words">{label}</dt><dd className="flex flex-wrap items-center gap-1 font-semibold tabular-nums">{j === 1 ? <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> : j === 2 ? <ArrowDownRight className="h-4 w-4" aria-hidden="true" /> : null}{value}</dd></div>)}
            </dl>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="outline" size="lg" className="h-auto min-h-11 whitespace-normal rounded-lg" onClick={() => download(trail,reversed)}><Download aria-hidden="true" />{c.download}</Button>
              <Button variant="outline" size="lg" className="h-auto min-h-11 whitespace-normal rounded-lg" aria-pressed={reversed} onClick={() => setDirections(prev => ({ ...prev, [id]: !prev[id] }))}><ArrowRightLeft aria-hidden="true" />{c.reverse}</Button>
            </div>
            <p className="mt-3 text-sm font-semibold" aria-live="polite">{reversed ? c.reversed : c.normal}</p>
            <Profile trail={trail} reversed={reversed} locale={locale} />
          </AccordionContent>
        </AccordionItem>;
      })}
    </Accordion>
    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{c.source}</p>
  </div>;
}
