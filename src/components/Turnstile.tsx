import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
    __turnstileLoaderPromise?: Promise<void>;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (window.__turnstileLoaderPromise) return window.__turnstileLoaderPromise;
  window.__turnstileLoaderPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Turnstile script failed to load'));
    document.head.appendChild(s);
  });
  return window.__turnstileLoaderPromise;
}

export interface TurnstileHandle {
  reset: () => void;
}

interface Props {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  language?: string;
  className?: string;
}

const Turnstile = forwardRef<TurnstileHandle, Props>(function Turnstile(
  { siteKey, onVerify, onExpire, onError, language, className },
  ref,
) {
  const elRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !elRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(elRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerify(token),
          'expired-callback': () => onExpire?.(),
          'error-callback': () => onError?.(),
          theme: 'auto',
          language: language ?? 'auto',
        });
      })
      .catch(() => onError?.());
    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  return <div ref={elRef} className={className} />;
});

export default Turnstile;