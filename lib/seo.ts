import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

export const SITE_NAME = 'Bridge Observer Daily';

/** Absolute URL for the current deployment (no trailing slash on origin). */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/** Best-effort ISO 8601 from display dates like "Apr 8, 2026". */
export function publishedStringToIso(publishedAt: string): string | undefined {
  const t = Date.parse(publishedAt);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString();
}

/** Canonical, Open Graph, and Twitter defaults for static routes (titles unchanged). */
export function staticPageMetadata(path: string, meta: { title: string; description: string }): Metadata {
  const url = absoluteUrl(path);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}
