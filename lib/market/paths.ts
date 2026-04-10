'use client';

import { usePathname } from 'next/navigation';

export function useMarketPathPrefix(): '' | '/market' {
  const pathname = usePathname();
  if (!pathname) return '/market';
  return pathname.startsWith('/market') ? '/market' : '';
}

export function useMarketHref(path: string, search?: string): string {
  const prefix = useMarketPathPrefix();
  const clean = path.startsWith('/') ? path : `/${path}`;
  const q = search ? (search.startsWith('?') ? search : `?${search}`) : '';
  if (clean === '/market' || clean === '/market/') return (prefix || '/') + q;
  let href: string;
  if (prefix === '/market') {
    href = clean.startsWith('/market') ? clean : `/market${clean}`;
  } else {
    href = clean;
  }
  return href + q;
}

export function useMarketLoginHref(): string {
  const prefix = useMarketPathPrefix();
  return prefix === '/market' ? '/market' : '/';
}
