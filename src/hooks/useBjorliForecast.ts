import { useEffect, useRef, useState } from 'react';
import {
  fetchBjorliForecast,
  EMPTY_FORECAST,
  type BjorliForecast,
} from '@/lib/integrations/googleWeather';

export type ForecastState = 'idle' | 'loading' | 'success' | 'error';

export interface UseBjorliForecastResult {
  forecast: BjorliForecast;
  state: ForecastState;
  hasData: boolean;
}

/** Google's forecast updates far slower than this; 30 min is plenty. */
const DEFAULT_REFRESH_MS = 30 * 60 * 1000;

/**
 * Loads the Bjorli base-point forecast from the `get-weather` Edge Function.
 * Failures never throw into the tree — the caller renders an "unavailable"
 * state and the rest of the page keeps working.
 */
export function useBjorliForecast(refreshMs: number = DEFAULT_REFRESH_MS): UseBjorliForecastResult {
  const [forecast, setForecast] = useState<BjorliForecast>(EMPTY_FORECAST);
  const [state, setState] = useState<ForecastState>('idle');
  const hasDataRef = useRef(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!hasDataRef.current) setState('loading');
      try {
        const next = await fetchBjorliForecast();
        if (cancelled) return;
        if (next.hours.length === 0 && next.days.length === 0) {
          setState('error');
          return;
        }
        setForecast(next);
        setState('success');
        hasDataRef.current = true;
        setHasData(true);
      } catch {
        if (cancelled) return;
        if (!hasDataRef.current) setForecast(EMPTY_FORECAST);
        setState('error');
      }
    };

    load();
    const id = window.setInterval(load, refreshMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [refreshMs]);

  return { forecast, state, hasData };
}
