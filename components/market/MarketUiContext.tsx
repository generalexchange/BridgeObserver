'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AlertRule, MarketModuleId, WorkspaceId } from '@/lib/market/types';
import {
  readAlerts,
  readMarketModule,
  readMarketSettings,
  readWorkspace,
  writeAlerts,
  writeMarketModule,
  writeMarketSettings,
  writeWorkspace,
  type MarketUserSettings,
} from '@/lib/market/storage';
import { useMarketToast } from '@/components/market/MarketToastContext';

type Ctx = {
  activeModule: MarketModuleId;
  setActiveModule: (m: MarketModuleId) => void;
  workspace: WorkspaceId;
  setWorkspace: (w: WorkspaceId) => void;
  settings: MarketUserSettings;
  updateSettings: (p: Partial<MarketUserSettings>) => void;
  alerts: AlertRule[];
  setAlerts: (a: AlertRule[]) => void;
  playBeep: () => void;
};

const MarketUiContext = createContext<Ctx | null>(null);

export function MarketUiProvider({ children }: { children: ReactNode }) {
  const { show } = useMarketToast();
  const [activeModule, setActiveModuleState] = useState<MarketModuleId>('dashboard');
  const [workspace, setWorkspaceState] = useState<WorkspaceId>('default');
  const [settings, setSettings] = useState<MarketUserSettings>({ soundAlerts: false, reducedMotion: false });
  const [alerts, setAlertsState] = useState<AlertRule[]>([]);

  useEffect(() => {
    const MODULE_IDS: MarketModuleId[] = [
      'dashboard',
      'sentiment',
      'regime',
      'whale',
      'risk',
      'portfolio',
      'backtest',
      'news',
      'esg',
      'macro',
      'alerts',
      'copilot',
      'settings',
    ];
    const m = readMarketModule();
    if (m && MODULE_IDS.includes(m)) setActiveModuleState(m);
    setWorkspaceState(readWorkspace());
    setSettings(readMarketSettings());
    setAlertsState(readAlerts());
  }, []);

  const setActiveModule = useCallback((m: MarketModuleId) => {
    setActiveModuleState(m);
    writeMarketModule(m);
  }, []);

  const setWorkspace = useCallback(
    (w: WorkspaceId) => {
      setWorkspaceState(w);
      writeWorkspace(w);
      show(`Workspace: ${w}`, 'default');
    },
    [show],
  );

  const updateSettings = useCallback((p: Partial<MarketUserSettings>) => {
    setSettings((s) => {
      const n = { ...s, ...p };
      writeMarketSettings(n);
      return n;
    });
  }, []);

  const setAlerts = useCallback((a: AlertRule[]) => {
    setAlertsState(a);
    writeAlerts(a);
  }, []);

  const playBeep = useCallback(() => {
    if (!settings.soundAlerts) return;
    try {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.value = 0.04;
      o.start();
      o.stop(ctx.currentTime + 0.08);
    } catch {
      /* ignore */
    }
  }, [settings.soundAlerts]);

  const value = useMemo(
    () => ({
      activeModule,
      setActiveModule,
      workspace,
      setWorkspace,
      settings,
      updateSettings,
      alerts,
      setAlerts,
      playBeep,
    }),
    [activeModule, setActiveModule, workspace, setWorkspace, settings, updateSettings, alerts, setAlerts, playBeep],
  );

  return <MarketUiContext.Provider value={value}>{children}</MarketUiContext.Provider>;
}

export function useMarketUi() {
  const ctx = useContext(MarketUiContext);
  if (!ctx) throw new Error('useMarketUi requires MarketUiProvider');
  return ctx;
}
