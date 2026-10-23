import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { PlayCircle, X } from 'lucide-react';
import { Dialog, DialogPortal, DialogOverlay, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { GUIDE_COPY as C, GUIDE_STEPS, SEASON_PASS_URL, isGuideVisible, type GuideStep } from '@/lib/seasonPassGuide';

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
};

function GuideCarousel({ steps }: { steps: GuideStep[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const step = steps[i];

  const stopMedia = () => {
    for (const el of [audioRef.current, videoRef.current]) {
      if (el) { el.pause(); el.currentTime = 0; }
    }
    setPlaying(false);
  };
  // Stop media on step change and on unmount (dialog close).
  useEffect(() => stopMedia, [i]);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else { void a.play(); setPlaying(true); }
  };
  const replay = () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0; void a.play(); setPlaying(true);
  };

  const showStatic = reduced && step.video?.staticImage;

  return (
    <div className="space-y-4">
      {steps.length > 1 && <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">{C.step(i + 1, steps.length)}</p>}
      {steps.length > 1 && <h3 className="font-display text-xl font-bold text-primary">{step.title}</h3>}
      <div className="rounded-lg border border-border bg-muted">
        {step.video && !showStatic ? (
          <video
            ref={videoRef}
            key={step.video.src}
            src={step.video.src}
            poster={step.video.poster}
            controls
            playsInline
            preload="metadata"
            className="w-full h-auto max-h-[55vh] object-contain"
          >
            {step.video.captionsSrc && <track kind="captions" srcLang="no" label="Norsk" src={step.video.captionsSrc} default />}
          </video>
        ) : (
          (() => {
            const img = showStatic ? step.video!.staticImage! : step.image;
            return img ? <img src={img.src} alt={img.alt} className="w-full h-auto max-h-[55vh] object-contain" /> : null;
          })()
        )}
      </div>
      <p className="text-foreground leading-relaxed">{reduced && step.staticText ? step.staticText : step.text}</p>
      {step.audio && (
        <div className="flex flex-wrap gap-2">
          <audio ref={audioRef} key={step.audio.src} src={step.audio.src} preload="none" onEnded={() => setPlaying(false)} />
          <Button type="button" variant="outline" onClick={toggleAudio} aria-pressed={playing}>
            {playing ? C.pause : C.play}
          </Button>
          <Button type="button" variant="ghost" onClick={replay}>{C.replay}</Button>
        </div>
      )}
      {steps.length > 1 && (
      <div className="sticky bottom-0 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 flex items-center justify-between gap-2 border-t border-border bg-background px-4 sm:px-5 py-3">
        <Button type="button" variant="outline" onClick={() => setI(i - 1)} disabled={i === 0}>{C.prev}</Button>
        <Button type="button" variant="outline" onClick={() => setI(i + 1)} disabled={i === steps.length - 1}>{C.next}</Button>
      </div>
      )}
    </div>
  );
}

export function SeasonPassGuideDialog({
  open, onOpenChange, steps = GUIDE_STEPS, trigger,
}: { open: boolean; onOpenChange: (o: boolean) => void; steps?: GuideStep[]; trigger: React.ReactNode }) {
  // Radix leaves #root exposed here, so make the page behind the dialog
  // explicitly inert (no keyboard, pointer or screen reader access).
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root || !open) return;
    root.setAttribute('inert', '');
    root.setAttribute('aria-hidden', 'true');
    return () => { root.removeAttribute('inert'); root.removeAttribute('aria-hidden'); };
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPortal>
        <DialogOverlay className="animate-none data-[state=open]:animate-none data-[state=closed]:animate-none" />
        <DialogPrimitive.Content
          className="fixed z-50 inset-2 max-h-[calc(100dvh-1rem)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[calc(100%-2rem)] sm:max-w-[720px] sm:max-h-[90vh] flex flex-col rounded-xl border border-border bg-background shadow-lg"
        >
          <div className="flex items-start justify-between gap-3 border-b border-border p-4 sm:p-5">
            <div>
              <DialogTitle className="font-display text-2xl font-bold text-primary">{C.title}</DialogTitle>
              <DialogDescription className="mt-1 text-foreground">{C.intro}</DialogDescription>
            </div>
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="outline" className="min-h-11 shrink-0">
                <X className="h-4 w-4" aria-hidden /> {C.close}
              </Button>
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {open && steps.length > 0 && <GuideCarousel steps={steps} />}
          </div>
          <div className="border-t border-border p-4 sm:p-5">
            <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
              <a href={SEASON_PASS_URL} target="_blank" rel="noopener noreferrer">{C.buy}</a>
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

/** Help link + dialog. Renders nothing unless the guide is explicitly activated. */
export default function SeasonPassGuideLink({
  variant, className = '', steps, forceVisible = false,
}: { variant: 'home' | 'skiCenter'; className?: string; steps?: GuideStep[]; forceVisible?: boolean }) {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  if (!forceVisible && !isGuideVisible(locale)) return null;
  return (
    <SeasonPassGuideDialog
      open={open}
      onOpenChange={setOpen}
      steps={steps}
      trigger={<button
        type="button"
        className={`inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      >
        {variant === 'home' && <PlayCircle className="h-4 w-4" aria-hidden />}
        {variant === 'home' ? C.homeLink : C.skiCenterLink}
      </button>}
    />
  );
}
