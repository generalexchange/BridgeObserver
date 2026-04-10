'use client';

import { usePathname } from 'next/navigation';

/**
 * Path prefix for links: `/press/...` on the main host, root-relative on press.* subdomain
 * (middleware rewrites press host paths to /press/* internally).
 */
export function usePressPathPrefix(): '' | '/press' {
  const pathname = usePathname();
  if (!pathname) return '/press';
  return pathname.startsWith('/press') ? '/press' : '';
}

export function usePressHref(path: string, search?: string): string {
  const prefix = usePressPathPrefix();
  const clean = path.startsWith('/') ? path : `/${path}`;
  const q = search ? (search.startsWith('?') ? search : `?${search}`) : '';
  if (clean === '/press' || clean === '/press/') return (prefix || '/') + q;
  let href: string;
  if (prefix === '/press') {
    href = clean.startsWith('/press') ? clean : `/press${clean}`;
  } else {
    href = clean;
  }
  return href + q;
}

/** Login route as seen in the browser. */
export function useLoginHref(): string {
  const prefix = usePressPathPrefix();
  return prefix === '/press' ? '/press' : '/';
}
