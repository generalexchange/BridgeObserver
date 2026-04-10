'use client';

import { usePathname } from 'next/navigation';

const SEGMENT = '/admin';

export function useAdminHref(path: string): string {
  const pathname = usePathname() ?? '';
  const inSegment = pathname.startsWith(SEGMENT);
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (inSegment) {
    if (clean === SEGMENT || clean.startsWith(`${SEGMENT}/`)) return clean;
    return `${SEGMENT}${clean}`;
  }
  return clean;
}

export function useAdminLoginHref(): string {
  const pathname = usePathname() ?? '';
  return pathname.startsWith(SEGMENT) ? SEGMENT : '/';
}
