'use client';

import { useEffect } from 'react';

/**
 * Bridges analytics custom events to window.dataLayer (GTM) or console in development.
 */
export function AnalyticsListener() {
  useEffect(() => {
    const pushLayer = (payload: Record<string, unknown>) => {
      const w = window as unknown as { dataLayer?: unknown[] };
      if (Array.isArray(w.dataLayer)) {
        w.dataLayer.push(payload);
      } else if (process.env.NODE_ENV === 'development') {
        console.debug('[analytics]', payload);
      }
    };

    const onImpression = (e: Event) => {
      const detail = (e as CustomEvent).detail as Record<string, unknown>;
      pushLayer({ event: 'article_impression', ...detail });
    };
    const onDepth = (e: Event) => {
      const detail = (e as CustomEvent).detail as Record<string, unknown>;
      pushLayer({ event: 'scroll_depth', ...detail });
    };
    window.addEventListener('analytics:article-impression', onImpression);
    window.addEventListener('analytics:scroll-depth', onDepth);
    return () => {
      window.removeEventListener('analytics:article-impression', onImpression);
      window.removeEventListener('analytics:scroll-depth', onDepth);
    };
  }, []);
  return null;
}
