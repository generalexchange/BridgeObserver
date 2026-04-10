import type { Metadata } from 'next';
import { MarketProviders } from '@/components/market/MarketProviders';
import './market-globals.css';

export const metadata: Metadata = {
  title: 'Bridge Observer Markets',
  description: 'Institutional Market Intelligence System — Bridge Observer Markets workstation.',
  robots: { index: false, follow: false },
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="market-root">
      <MarketProviders>{children}</MarketProviders>
    </div>
  );
}
