import { useEffect, useRef, useState } from 'react';
import { fetchBjorliFnuggPosts, type BjorliFnuggPost } from '@/lib/integrations/fnugg';

export type FnuggPostsState = 'idle' | 'loading' | 'success' | 'error';

export interface UseBjorliFnuggPostsResult {
  posts: BjorliFnuggPost[];
  latest: BjorliFnuggPost | null;
  state: FnuggPostsState;
  error: string | null;
  /** True once at least one successful fetch has resolved this session. */
  hasLoaded: boolean;
}

/**
 * Default refresh: 15 minutes. Fnugg blog posts are daily/operational so a
 * tight refresh is unnecessary. Production should move this behind a
 * server-cached Next.js Route Handler (`revalidate: 600`).
 */
const DEFAULT_REFRESH_MS = 15 * 60 * 1000;

export function useBjorliFnuggPosts(
  size = 3,
  refreshMs: number = DEFAULT_REFRESH_MS,
): UseBjorliFnuggPostsResult {
  const [posts, setPosts] = useState<BjorliFnuggPost[]>([]);
  const [state, setState] = useState<FnuggPostsState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const load = async () => {
      if (!hasLoadedRef.current) setState('loading');
      try {
        const next = await fetchBjorliFnuggPosts(size, controller.signal);
        if (cancelled) return;
        setPosts(next);
        setError(null);
        setState('success');
        hasLoadedRef.current = true;
        setHasLoaded(true);
      } catch (e) {
        if (cancelled || (e instanceof DOMException && e.name === 'AbortError')) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
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
  }, [size, refreshMs]);

  return { posts, latest: posts[0] ?? null, state, error, hasLoaded };
}