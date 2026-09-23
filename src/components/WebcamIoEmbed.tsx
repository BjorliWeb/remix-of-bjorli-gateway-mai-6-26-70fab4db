import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';

const WIDGET_ID = 'JZt3I';
const WEBCAM_ID = 'P4dKmP';
const LOADER_URL = `https://webcam.io/s/widget-v1_03.load.js?i=${WIDGET_ID}`;
const MAIN_SCRIPT_URL = 'https://webcam.io/s/widget-v1_03.js';

interface TimelapseViewWindow extends Window {
  timelapseview_options?: Record<string, Record<string, string>>;
  Elapse?: unknown;
}

interface WebcamIoEmbedProps {
  title: string;
  unavailableLabel: string;
  onInteract?: () => void;
}

const removeWidgetScripts = () => {
  document
    .querySelectorAll<HTMLScriptElement>(
      `script[src^="${LOADER_URL}"], script[src="${MAIN_SCRIPT_URL}"]`,
    )
    .forEach((script) => script.remove());
};

const WebcamIoEmbed = ({ title, unavailableLabel, onInteract }: WebcamIoEmbedProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const interactedRef = useRef(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const widgetWindow = window as TimelapseViewWindow;
    removeWidgetScripts();
    delete widgetWindow.Elapse;

    widgetWindow.timelapseview_options = widgetWindow.timelapseview_options ?? {};
    widgetWindow.timelapseview_options[WIDGET_ID] = {
      e: WEBCAM_ID,
      t: '1',
      x: '680',
      y: '620',
    };

    const loader = document.createElement('script');
    loader.src = LOADER_URL;
    loader.async = true;
    loader.dataset.webcamIoWidget = WIDGET_ID;
    loader.onerror = () => setErrored(true);
    host.appendChild(loader);

    return () => {
      host.replaceChildren();
      removeWidgetScripts();
      delete widgetWindow.Elapse;
      if (widgetWindow.timelapseview_options) {
        delete widgetWindow.timelapseview_options[WIDGET_ID];
      }
    };
  }, []);

  const handleInteract = () => {
    if (interactedRef.current || !onInteract) return;
    interactedRef.current = true;
    onInteract();
  };

  return (
    <article
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-md flex flex-col"
      aria-label={`Webkamera: ${title}`}
    >
      <div
        className="relative aspect-[68/62] w-full max-w-full overflow-hidden bg-muted"
        onPointerDown={onInteract ? handleInteract : undefined}
      >
        {errored ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground" role="status">
            <Camera className="mb-2 h-8 w-8 opacity-60" aria-hidden="true" />
            <p className="text-sm">{unavailableLabel}</p>
          </div>
        ) : (
          <div
            ref={hostRef}
            className="absolute inset-0 max-w-full overflow-hidden [&>div]:h-full [&>div]:w-full [&_iframe]:block [&_iframe]:h-full [&_iframe]:max-w-full [&_iframe]:w-full"
          />
        )}
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
        <span
          className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-secondary"
          aria-label="Live"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" aria-hidden="true" />
          LIVE
        </span>
      </div>
    </article>
  );
};

export default WebcamIoEmbed;