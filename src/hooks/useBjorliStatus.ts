import { useEffect, useRef, useState } from 'react';
import {
  fetchBjorliFnuggStatus,
  EMPTY_FNUGG_STATUS,
  type BjorliFnuggStatus,
} from '@/lib/integrations/fnugg';

export type BjorliStatusState = 'idle' | 'loading' | 'success' | 'error';

export interface UseBjorliStatusResult {
  status: BjorliFnuggStatus;
  state: BjorliStatusState;
  error: string | null;
  /** True once we have at least one successful response in this session. */
  hasLiveData: boolean;
}

/** Default refresh: 10 minutes. Fnugg upstream updates roughly every 10–15 min. */
const DEFAULT_REFRESH_MS = 10 * 60 * 1000;

/**
 * Client-side hook that loads + periodically refreshes Bjorli status from Fnugg.
 * In production (Next.js) this should be replaced or layered with a
 * server-cached Route Handler so we don't hammer the upstream API.
 */
export function useBjorliStatus(refreshMs: number = DEFAULT_REFRESH_MS): UseBjorliStatusResult {
  const [status, setStatus] = useState<BjorliFnuggStatus>(EMPTY_FNUGG_STATUS);
  const [state, setState] = useState<BjorliStatusState>('idle');
  const [error, setError] = useState<string | null>(null);
  const hasLiveDataRef = useRef(false);
  const [hasLiveData, setHasLiveData] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      // Only show "loading" the very first time; later refreshes are silent.
      if (!hasLiveDataRef.current) setState('loading');
      try {
        const next = await fetchBjorliFnuggStatus(controller.signal);
        if (cancelled) return;
        setStatus(next);
        setError(null);
        setState('success');
        hasLiveDataRef.current = true;
        setHasLiveData(true);
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === 'AbortError')) return;
        const msg = e instanceof Error ? e.message : 'Unknown error';
        setError(msg);
        // If we already have live data, keep showing it (stale-while-error).
        if (!hasLiveDataRef.current) setStatus(EMPTY_FNUGG_STATUS);
        setState('error');
      }
    };

    load();
    const id = window.setInterval(load, refreshMs);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(id);
    };
  }, [refreshMs]);

  return { status, state, error, hasLiveData };
}