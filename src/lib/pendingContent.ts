import { createContext } from 'react';

/**
 * "Page content is still loading" signal, provided by Layout.
 *
 * While a route chunk or the homepage CMS data loads, the page shows a
 * 100svh placeholder. The real page is 5–15× taller, so a visible footer
 * right under the placeholder gets pushed thousands of pixels down when the
 * content arrives — the main CLS source measured in production (Oct 2026).
 * Layout hides the footer while any placeholder is mounted.
 *
 * The value registers one pending placeholder and returns its release.
 */
export const PendingContentContext = createContext<(() => () => void) | null>(null);
