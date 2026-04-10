'use client';

import type { RefObject } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PanelImperativeHandle } from 'react-resizable-panels';
import {
  Activity,
  AlertTriangle,
  Bot,
  Calendar,
  ChevronLeft,
  LayoutDashboard,
  Leaf,
  LineChart,
  LogOut,
  Newspaper,
  PieChart,
  Scale,
  Settings,
  ShipWheel,
  Waves,
} from 'lucide-react';
import type { MarketModuleId } from '@/lib/market/types';
import { useMarketAuth } from '@/components/market/MarketAuthContext';
import { useMarketUi } from '@/components/market/MarketUiContext';
import { useMarketHref, useMarketLoginHref } from '@/lib/market/paths';

const NAV: { id: MarketModuleId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sentiment', label: 'Sentiment Engine', icon: Activity },
  { id: 'regime', label: 'Regime Monitor', icon: ShipWheel },
  { id: 'whale', label: 'Whale & Institutional', icon: Waves },
  { id: 'risk', label: 'Risk Analytics', icon: Scale },
  { id: 'portfolio', label: 'Portfolio Optimizer', icon: PieChart },
  { id: 'backtest', label: 'Backtesting Lab', icon: LineChart },
  { id: 'news', label: 'News + Signals', icon: Newspaper },
  { id: 'esg', label: 'ESG & Impact', icon: Leaf },
  { id: 'macro', label: 'Macro Calendar', icon: Calendar },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'copilot', label: 'AI Research Co-Pilot', icon: Bot },
  { id: 'settings', label: 'Settings', icon: Settings },
];

type Props = {
  sidebarPanelRef: RefObject<PanelImperativeHandle | null>;
};

export function MarketSidebar({ sidebarPanelRef }: Props) {
  const { activeModule, setActiveModule } = useMarketUi();
  const { logout } = useMarketAuth();
  const router = useRouter();
  const homeHref = useMarketHref('/');
  const loginHref = useMarketLoginHref();

  const toggleCollapse = () => {
    const p = sidebarPanelRef.current;
    if (!p) return;
    if (p.isCollapsed()) p.expand();
    else p.collapse();
  };

  return (
    <aside className="market-sidebar">
      <div className="market-sidebar__brand">
        <Link href={homeHref} className="market-sidebar__logo">
          Bridge Observer
        </Link>
        <span className="market-sidebar__badge">Markets</span>
        <button type="button" className="market-sidebar__collapse" aria-label="Toggle navigation width" onClick={toggleCollapse}>
          <ChevronLeft size={16} aria-hidden />
        </button>
      </div>
      <nav className="market-sidebar__nav" aria-label="Terminal modules">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = activeModule === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`market-nav-item${active ? ' market-nav-item--active' : ''}`}
              onClick={() => setActiveModule(item.id)}
            >
              <Icon size={17} strokeWidth={2} aria-hidden className="market-nav-item__icon" />
              <span className="market-nav-item__label">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="market-sidebar__foot">
        <button
          type="button"
          className="market-nav-item market-nav-item--logout"
          onClick={() => {
            logout();
            router.replace(loginHref);
          }}
        >
          <LogOut size={17} strokeWidth={2} aria-hidden className="market-nav-item__icon" />
          <span className="market-nav-item__label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
