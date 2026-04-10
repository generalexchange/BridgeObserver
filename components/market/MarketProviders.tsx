'use client';

import type { ReactNode } from 'react';
import { MarketAuthProvider } from '@/components/market/MarketAuthContext';
import { MarketDataProvider } from '@/components/market/MarketDataContext';
import { MarketToastProvider } from '@/components/market/MarketToastContext';
import { MarketUiProvider } from '@/components/market/MarketUiContext';

export function MarketProviders({ children }: { children: ReactNode }) {
  return (
    <MarketToastProvider>
      <MarketAuthProvider>
        <MarketUiProvider>
          <MarketDataProvider>{children}</MarketDataProvider>
        </MarketUiProvider>
      </MarketAuthProvider>
    </MarketToastProvider>
  );
}
