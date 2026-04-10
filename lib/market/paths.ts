'use client';

import { usePathname } from 'next/navigation';

export const MARKETS_SEGMENT = '/markets';

export function useMarketPathPrefix(): '' | typeof MARKETS_SEGMENT {
  const pathname = usePathname();
  if (!pathname) return MARKETS_SEGMENT;
  return pathname.startsWith(MARKETS_SEGMENT) ? MARKETS_SEGMENT : '';
}

/** Href under the `/markets` App Router segment (works from main site or from `/markets/*` pages). */
export function useMarketHref(path: string, search?: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const q = search ? (search.startsWith('?') ? search : `?${search}`) : '';
  if (clean === '/' || clean === '') {
    return `${MARKETS_SEGMENT}${q}`;
  }
  if (clean === MARKETS_SEGMENT || clean === `${MARKETS_SEGMENT}/`) {
    return `${MARKETS_SEGMENT}${q}`;
  }
  if (clean.startsWith(`${MARKETS_SEGMENT}/`)) {
    return `${clean}${q}`;
  }
  return `${MARKETS_SEGMENT}${clean}${q}`;
}

export function useMarketLoginHref(): string {
  return MARKETS_SEGMENT;
}
