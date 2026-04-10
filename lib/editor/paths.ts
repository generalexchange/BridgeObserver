'use client';

import { usePathname } from 'next/navigation';

const SEGMENT = '/editor';

export function useEditorHref(path: string): string {
  const pathname = usePathname() ?? '';
  const inSegment = pathname.startsWith(SEGMENT);
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (inSegment) {
    if (clean === SEGMENT || clean.startsWith(`${SEGMENT}/`)) return clean;
    return `${SEGMENT}${clean}`;
  }
  return clean;
}

export function useEditorLoginHref(): string {
  const pathname = usePathname() ?? '';
  return pathname.startsWith(SEGMENT) ? SEGMENT : '/';
}
