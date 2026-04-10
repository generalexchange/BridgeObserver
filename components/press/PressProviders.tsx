'use client';

import type { ReactNode } from 'react';
import { PressArticlesProvider } from '@/components/press/PressArticlesContext';
import { PressAuthProvider } from '@/components/press/PressAuthContext';
import { PressToastProvider } from '@/components/press/PressToastContext';

export function PressProviders({ children }: { children: ReactNode }) {
  return (
    <PressToastProvider>
      <PressAuthProvider>
        <PressArticlesProvider>{children}</PressArticlesProvider>
      </PressAuthProvider>
    </PressToastProvider>
  );
}
