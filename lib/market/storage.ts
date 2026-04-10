import type { AlertRule, MarketModuleId, MarketSession, WorkspaceId } from '@/lib/market/types';
import {
  MARKET_ALERTS_KEY,
  MARKET_MODULE_KEY,
  MARKET_SESSION_KEY,
  MARKET_SETTINGS_KEY,
  MARKET_WORKSPACE_KEY,
} from '@/lib/market/types';

export function readMarketSession(): MarketSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MARKET_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MarketSession;
  } catch {
    return null;
  }
}

export function writeMarketSession(s: MarketSession | null): void {
  if (typeof window === 'undefined') return;
  if (!s) localStorage.removeItem(MARKET_SESSION_KEY);
  else localStorage.setItem(MARKET_SESSION_KEY, JSON.stringify(s));
}

export function readMarketModule(): MarketModuleId | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(MARKET_MODULE_KEY);
    return v as MarketModuleId | null;
  } catch {
    return null;
  }
}

export function writeMarketModule(m: MarketModuleId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MARKET_MODULE_KEY, m);
}

export function readWorkspace(): WorkspaceId {
  if (typeof window === 'undefined') return 'default';
  try {
    const v = localStorage.getItem(MARKET_WORKSPACE_KEY) as WorkspaceId | null;
    if (v === 'macro' || v === 'risk' || v === 'trading' || v === 'default') return v;
    return 'default';
  } catch {
    return 'default';
  }
}

export function writeWorkspace(w: WorkspaceId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MARKET_WORKSPACE_KEY, w);
}

export function readAlerts(): AlertRule[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MARKET_ALERTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AlertRule[];
  } catch {
    return [];
  }
}

export function writeAlerts(a: AlertRule[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MARKET_ALERTS_KEY, JSON.stringify(a));
}

export type MarketUserSettings = { soundAlerts: boolean; reducedMotion: boolean };

export function readMarketSettings(): MarketUserSettings {
  if (typeof window === 'undefined') return { soundAlerts: false, reducedMotion: false };
  try {
    const raw = localStorage.getItem(MARKET_SETTINGS_KEY);
    if (!raw) return { soundAlerts: false, reducedMotion: false };
    return { ...{ soundAlerts: false, reducedMotion: false }, ...JSON.parse(raw) };
  } catch {
    return { soundAlerts: false, reducedMotion: false };
  }
}

export function writeMarketSettings(s: MarketUserSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MARKET_SETTINGS_KEY, JSON.stringify(s));
}
