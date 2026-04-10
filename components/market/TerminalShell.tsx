'use client';

import { useEffect, useRef } from 'react';
import { Group, Panel, Separator, useDefaultLayout, usePanelRef } from 'react-resizable-panels';
import { MarketDock } from '@/components/market/MarketDock';
import { MarketModuleRouter } from '@/components/market/MarketModules';
import { MarketSidebar } from '@/components/market/MarketSidebar';
import { MarketTopBar } from '@/components/market/MarketTopBar';
import { useMarketUi } from '@/components/market/MarketUiContext';

export function TerminalShell() {
  const { settings } = useMarketUi();
  const searchRef = useRef<HTMLInputElement>(null!);
  const sidebarRef = usePanelRef();

  const hPersist = useDefaultLayout({
    id: 'bridge-market-h',
    panelIds: ['sidebar', 'main'],
    storage: localStorage,
  });

  const vPersist = useDefaultLayout({
    id: 'bridge-market-v',
    panelIds: ['primary', 'dock'],
    storage: localStorage,
  });

  useEffect(() => {
    document.documentElement.classList.toggle('market-reduced-motion', settings.reducedMotion);
    return () => document.documentElement.classList.remove('market-reduced-motion');
  }, [settings.reducedMotion]);

  return (
    <div className="market-term">
      <MarketTopBar searchInputRef={searchRef} />
      <Group
        className="market-term__grid-h"
        orientation="horizontal"
        defaultLayout={hPersist.defaultLayout}
        onLayoutChanged={hPersist.onLayoutChanged}
      >
        <Panel
          className="market-term__sidebar-panel"
          id="sidebar"
          panelRef={sidebarRef}
          collapsible
          minSize={12}
          collapsedSize={4}
          defaultSize={20}
        >
          <MarketSidebar sidebarPanelRef={sidebarRef} />
        </Panel>
        <Separator className="market-resize-handle market-resize-handle--h" />
        <Panel className="market-term__main-panel" id="main" minSize={45}>
          <Group
            className="market-term__grid-v"
            orientation="vertical"
            defaultLayout={vPersist.defaultLayout}
            onLayoutChanged={vPersist.onLayoutChanged}
          >
            <Panel className="market-term__primary" id="primary" minSize={38} defaultSize={68}>
              <div className="market-term__scroll">
                <MarketModuleRouter />
              </div>
            </Panel>
            <Separator className="market-resize-handle market-resize-handle--v" />
            <Panel className="market-term__dock-panel" id="dock" minSize={18} defaultSize={32}>
              <MarketDock />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </div>
  );
}
