import { useContext, useLayoutEffect } from 'react';
import { PendingContentContext } from '@/lib/pendingContent';

/**
 * Holds the viewport while page content loads, and keeps the footer hidden
 * until it is gone (see src/lib/pendingContent.ts). Registers in a layout
 * effect so the footer is already hidden on the first paint.
 */
const ContentPlaceholder = () => {
  const register = useContext(PendingContentContext);
  useLayoutEffect(() => register?.(), [register]);
  return <div aria-hidden className="min-h-[100svh]" />;
};

export default ContentPlaceholder;
