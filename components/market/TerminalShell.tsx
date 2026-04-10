'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { Layout } from 'react-resizable-panels';
import { Group, Panel, Separator, useDefaultLayout, usePanelRef } from 'react-resizable-panels';
import { MarketDock } from '@/components/market/MarketDock';
import { MarketModuleRouter } from '@/components/market/MarketModules';
import { MarketSidebar } from '@/components/market/MarketSidebar';
import { MarketTopBar } from '@/components/market/MarketTopBar';
import { useMarketUi } from '@/components/market/MarketUiContext';

const H_FALLBACK: Layout = { sidebar: 22, main: 78 };
const V_FALLBACK: Layout = { primary: 68, dock: 32 };

function sanitizeHorizontalLayout(layout: Layout | undefined): Layout {
  const minSidebar = 14;
  if (!layout) return H_FALLBACK;
  const s = layout.sidebar;
  const m = layout.main;
  if (typeof s !== 'number' || typeof m !== 'number' || s < minSidebar) {
    return H_FALLBACK;
  }
  if (Math.abs(s + m - 100) > 2.5) {
    return H_FALLBACK;
  }
  return layout;
}

function sanitizeVerticalLayout(layout: Layout | undefined): Layout {
  const minPrimary = 35;
  if (!layout) return V_FALLBACK;
  const p = layout.primary;
  const d = layout.dock;
  if (typeof p !== 'number' || typeof d !== 'number' || p < minPrimary) {
    return V_FALLBACK;
  }
  if (Math.abs(p + d - 100) > 2.5) {
    return V_FALLBACK;
  }
  return layout;
}

export function TerminalShell() {
  const { settings } = useMarketUi();
  const searchRef = useRef<HTMLInputElement>(null!);
  const sidebarRef = usePanelRef();

  const hPersist = useDefaultLayout({
    id: 'bridge-markets-h',
    panelIds: ['sidebar', 'main'],
    storage: localStorage,
  });

  const vPersist = useDefaultLayout({
    id: 'bridge-markets-v',
    panelIds: ['primary', 'dock'],
    storage: localStorage,
  });

  const horizontalLayout = useMemo(
    () => sanitizeHorizontalLayout(hPersist.defaultLayout),
    [hPersist.defaultLayout],
  );

  const verticalLayout = useMemo(() => sanitizeVerticalLayout(vPersist.defaultLayout), [vPersist.defaultLayout]);

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
        defaultLayout={horizontalLayout}
        onLayoutChanged={hPersist.onLayoutChanged}
      >
        <Panel
          className="market-term__sidebar-panel"
          id="sidebar"
          panelRef={sidebarRef}
          collapsible
          minSize={14}
          collapsedSize="56px"
          defaultSize={22}
        >
          <MarketSidebar sidebarPanelRef={sidebarRef} />
        </Panel>
        <Separator
          className="market-resize-handle market-resize-handle--h"
          aria-label="Resize sidebar. Double-click to reset panel size."
        />
        <Panel className="market-term__main-panel" id="main" minSize={45}>
          <Group
            className="market-term__grid-v"
            orientation="vertical"
            defaultLayout={verticalLayout}
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
