import { useEffect, useState } from 'react';

/**
 * Tiny hook for consuming the async CMS adapter from React components
 * without pulling in react-query. Re-runs when any dep changes.
 *
 * Example:
 *   const tips = useCms(() => getTips({ language }), [language]);
 */
export function useCms<T>(loader: () => Promise<T>, deps: unknown[] = []): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  useEffect(() => {
    let cancelled = false;
    Promise.resolve(loader()).then((res) => {
      if (!cancelled) setData(res as T);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return data;
}
