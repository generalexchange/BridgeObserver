'use client';

import dynamic from 'next/dynamic';
import { RequireMarketAuth } from '@/components/market/RequireMarketAuth';

const TerminalShell = dynamic(
  () => import('@/components/market/TerminalShell').then((mod) => ({ default: mod.TerminalShell })),
  {
    ssr: false,
    loading: () => (
      <div className="market-term market-term--loading" aria-busy="true">
        <p className="market-term-loading">Loading workstation…</p>
      </div>
    ),
  },
);

export default function MarketTerminalPage() {
  return (
    <RequireMarketAuth>
      <TerminalShell />
    </RequireMarketAuth>
  );
}
