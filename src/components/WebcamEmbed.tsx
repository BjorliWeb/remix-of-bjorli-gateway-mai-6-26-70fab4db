import { useState } from 'react';
import { Camera, ExternalLink } from 'lucide-react';

/**
 * Single Bjorli webcam tile.
 *
 * Source: the IPCamLive aliases were lifted directly from the live WordPress
 * page at https://bjorli.no/livecams/ (rendered HTML inspected on 2026-05-02).
 * The original markup wrapped each player in a `<div src="...">` tag, which is
 * invalid HTML. We embed the same player URL inside a real `<iframe>` here —
 * this is the supported integration mode documented by IPCamLive.
 *
 * If a stream becomes unavailable the iframe still renders, but we expose a
 * graceful fallback link via `sourcePageUrl` so users always have a way out.
 *
 * TODO (WordPress integration):
 *   When the CMS connection lands, this component should be fed by an ACF /
 *   custom post type ("Webkamera") with fields: title, embedUrl, lastUpdated.
 *   The four IPCamLive aliases below should then move into the CMS.
 */
export interface WebcamEmbedProps {
  /** Visible heading (e.g. "Baseområde"). */
  title: string;
  /** Full embeddable iframe URL. */
  embedUrl: string;
  /** Optional caption — e.g. "Sist oppdatert: ...". */
  caption?: string;
  /** Where to send users if the iframe fails to load. */
  sourcePageUrl?: string;
  /** Tailwind aspect-ratio class — matches the original 800×350 player. */
  aspect?: string;
}

const WebcamEmbed = ({
  title,
  embedUrl,
  caption,
  sourcePageUrl = 'https://bjorli.no/livecams/',
  aspect = 'aspect-[16/7]',
}: WebcamEmbedProps) => {
  const [errored, setErrored] = useState(false);

  return (
    <article
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-md flex flex-col"
      aria-label={`Webkamera: ${title}`}
    >
      <div className={`relative ${aspect} w-full bg-muted`}>
        {errored ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-muted-foreground"
            role="status"
          >
            <Camera className="h-8 w-8 mb-2 opacity-60" aria-hidden="true" />
            <p className="text-sm mb-3">Webkamera er midlertidig utilgjengelig.</p>
            {sourcePageUrl && (
              <a
                href={sourcePageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary text-sm font-medium hover:underline inline-flex items-center gap-1"
              >
                Åpne kildeside <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={`Live webkamera ${title}`}
            className="absolute inset-0 w-full h-full"
            frameBorder={0}
            allow="autoplay; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setErrored(true)}
          />
        )}
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
          {caption && <p className="text-xs text-muted-foreground mt-0.5">{caption}</p>}
        </div>
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-secondary"
          aria-label="Live"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" aria-hidden="true" />
          LIVE
        </span>
      </div>
    </article>
  );
};

export default WebcamEmbed;