export type MarketModuleId =
  | 'dashboard'
  | 'sentiment'
  | 'regime'
  | 'whale'
  | 'risk'
  | 'portfolio'
  | 'backtest'
  | 'news'
  | 'esg'
  | 'macro'
  | 'alerts'
  | 'copilot'
  | 'settings';

export type MarketSession = {
  email: string;
  loggedInAt: string;
};

export type WorkspaceId = 'default' | 'macro' | 'risk' | 'trading';

export type IndexQuote = {
  id: string;
  label: string;
  value: number;
  change: number;
  changePct: number;
};

export type CryptoQuote = { symbol: string; price: number; chgPct: number };

export type MacroQuote = { label: string; value: string; delta: string; flash?: 'up' | 'down' | 'neutral' };

export type NewsWireItem = {
  id: string;
  time: string;
  headline: string;
  sentiment: number;
  entities: string[];
  urgent?: boolean;
};

export type WhalePrint = {
  id: string;
  ticker: string;
  side: 'BUY' | 'SELL';
  notional: string;
  desk: string;
  time: string;
};

export type RegimeEvent = {
  id: string;
  ts: string;
  source: string;
  quote: string;
  impact: 'hawkish' | 'dovish' | 'risk-on' | 'risk-off' | 'neutral';
};

export type AlertRule = {
  id: string;
  label: string;
  enabled: boolean;
  type: 'sentiment' | 'whale' | 'regime' | 'risk';
  threshold: string;
};

export const MARKET_SESSION_KEY = 'bridge_market_session';
export const MARKET_MODULE_KEY = 'bridge_market_module';
export const MARKET_WORKSPACE_KEY = 'bridge_market_workspace';
export const MARKET_ALERTS_KEY = 'bridge_market_alerts';
export const MARKET_SETTINGS_KEY = 'bridge_market_settings';
