import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';

/**
 * Webcam 6 (chair-lift top station). Shows only the backend-approved left-lens
 * frame published by the webcam6-refresh job. No analysis happens here.
 */
const META_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/webcam6-image`;
const POLL_MS = 5 * 60_000;

interface Meta {
  imageUrl: string | null;
  capturedAt?: string | null;
  timeSource?: 'captured' | 'fetched';
}

interface Webcam6ImageProps {
  title: string;
  unavailableLabel: string;
  onInteract?: () => void;
}

const Webcam6Image = ({ title, unavailableLabel, onInteract }: Webcam6ImageProps) => {
  const [meta, setMeta] = useState<Meta | null>(null);
  const [failed, setFailed] = useState(false);
  const interactedRef = useRef(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(META_URL);
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as Meta;
        if (!active) return;
        // Only swap when the published version changes; time follows the image.
        setMeta((prev) => (prev?.imageUrl === next.imageUrl ? prev : next));
        setFailed(false);
      } catch {
        // Keep whatever image is already shown.
        if (active) setMeta((prev) => prev ?? { imageUrl: null });
      }
    };
    load();
    const id = window.setInterval(load, POLL_MS);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, []);

  const handleInteract = () => {
    if (interactedRef.current || !onInteract) return;
    interactedRef.current = true;
    onInteract();
  };

  const showImage = !!meta?.imageUrl && !failed;

  return (
    <article
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-md flex flex-col"
      aria-label={`Webkamera: ${title}`}
    >
      <div
        className="relative aspect-[16/7] w-full max-w-full overflow-hidden bg-muted"
        onPointerDown={onInteract ? handleInteract : undefined}
      >
        {showImage ? (
          <a
            href={meta!.imageUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 block"
            aria-label={`Vis stor versjon: ${title}`}
          >
            <img
              src={meta!.imageUrl!}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
            />
          </a>
        ) : null}
        {!showImage && meta ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground" role="status">
            <Camera className="mb-2 h-8 w-8 opacity-60" aria-hidden="true" />
            <p className="text-sm">{unavailableLabel}</p>
          </div>
        ) : null}
      </div>
      <div className="min-h-14 px-4 py-2 flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold leading-5 text-foreground">{title}</h3>
      </div>
    </article>
  );
};

export default Webcam6Image;
