'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  CryptoQuote,
  IndexQuote,
  MacroQuote,
  NewsWireItem,
  RegimeEvent,
  WhalePrint,
} from '@/lib/market/types';
import { useMarketToast } from '@/components/market/MarketToastContext';
import { useMarketUi } from '@/components/market/MarketUiContext';

export type RegimeLabel = 'Expansionary' | 'Restrictive' | 'Neutral' | 'Crisis';

export type EsgRow = {
  ticker: string;
  score: number;
  controversy: 'Low' | 'Med' | 'High';
  carbon: string;
  flow: string;
};

export type MacroCalEvent = {
  id: string;
  time: string;
  name: string;
  country: string;
  forecast: string;
  prior: string;
  surprise?: 'beat' | 'miss' | 'inline';
};

export type PortfolioAsset = { id: string; ticker: string; weight: number; drift: number };

export type BacktestSummary = {
  pnl: string;
  winRate: string;
  maxDd: string;
  sharpe: string;
  trades: number;
};

export type MarketDataSnapshot = {
  indices: IndexQuote[];
  crypto: CryptoQuote[];
  macro: MacroQuote[];
  sentimentScore: number;
  sentimentHistory: number[];
  regimeScore: number;
  regimeLabel: RegimeLabel;
  regimeEvents: RegimeEvent[];
  whales: WhalePrint[];
  news: NewsWireItem[];
  var95: number;
  expectedShortfall: number;
  portfolioBeta: number;
  correlation: number[][];
  factors: { name: string; exposure: number }[];
  portfolio: PortfolioAsset[];
  efficientFrontier: { risk: number; ret: number }[];
  backtest: BacktestSummary;
  equityCurve: number[];
  esg: EsgRow[];
  macroCalendar: MacroCalEvent[];
  fundFlowDirection: 'in' | 'out' | 'flat';
  whaleHeat: { ticker: string; intensity: number }[];
  entityHeat: { name: string; score: number }[];
  tickCount: number;
};

function regimeFromScore(s: number): RegimeLabel {
  if (s <= -0.55) return 'Crisis';
  if (s <= -0.2) return 'Restrictive';
  if (s >= 0.35) return 'Expansionary';
  return 'Neutral';
}

function seed(): MarketDataSnapshot {
  const indices: IndexQuote[] = [
    { id: 'spx', label: 'S&P 500', value: 5124.32, change: 12.4, changePct: 0.24 },
    { id: 'ndx', label: 'Nasdaq 100', value: 18102.11, change: -28.3, changePct: -0.16 },
    { id: 'dji', label: 'Dow', value: 39102.45, change: 44.1, changePct: 0.11 },
    { id: 'vix', label: 'VIX', value: 14.82, change: -0.32, changePct: -2.12 },
    { id: 'rut', label: 'Russell 2000', value: 2044.2, change: 6.8, changePct: 0.33 },
  ];
  const crypto: CryptoQuote[] = [
    { symbol: 'BTC', price: 68420, chgPct: 0.42 },
    { symbol: 'ETH', price: 3420, chgPct: -0.18 },
  ];
  const macro: MacroQuote[] = [
    { label: 'US 10Y', value: '4.28%', delta: '-2 bps', flash: 'down' },
    { label: 'DXY', value: '104.12', delta: '+0.08', flash: 'up' },
    { label: 'WTI', value: '$78.40', delta: '+0.62', flash: 'up' },
    { label: 'Gold', value: '$2,348', delta: '-4.20', flash: 'down' },
  ];
  const regimeEvents: RegimeEvent[] = [
    {
      id: '1',
      ts: '09:42 ET',
      source: 'Fed Gov. Williams',
      quote: 'Policy is appropriately restrictive; data dependence remains paramount.',
      impact: 'neutral',
    },
    {
      id: '2',
      ts: '08:10 ET',
      source: 'Treasury',
      quote: 'Quarterly refunding sizes steady; emphasis on bill issuance.',
      impact: 'risk-on',
    },
    {
      id: '3',
      ts: 'Yesterday',
      source: 'White House',
      quote: 'Trade framework discussions continue with key partners.',
      impact: 'risk-off',
    },
  ];
  const whales: WhalePrint[] = [
    { id: 'w1', ticker: 'NVDA', side: 'BUY', notional: '$240M', desk: 'Systematic', time: '10:01' },
    { id: 'w2', ticker: 'XLF', side: 'SELL', notional: '$180M', desk: 'Macro RV', time: '09:55' },
    { id: 'w3', ticker: 'IWM', side: 'BUY', notional: '$95M', desk: 'L/S Equity', time: '09:48' },
  ];
  const news: NewsWireItem[] = [
    {
      id: 'n1',
      time: '10:14',
      headline: 'Mega-cap tech trims gains as yields stabilize; semis outperform.',
      sentiment: 22,
      entities: ['NVDA', 'AVGO', 'XLK'],
    },
    {
      id: 'n2',
      time: '10:09',
      headline: 'Regional banks tighten spreads after refunding take-up solid.',
      sentiment: 8,
      entities: ['KRE', 'JPM'],
      urgent: true,
    },
    {
      id: 'n3',
      time: '10:02',
      headline: 'Oil complex bid on supply chatter; energy majors lead tape.',
      sentiment: 35,
      entities: ['XLE', 'CVX'],
    },
  ];
  const n = 5;
  const correlation: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0.15 + Math.random() * 0.5)),
  );
  const portfolio: PortfolioAsset[] = [
    { id: 'p1', ticker: 'NVDA', weight: 0.18, drift: 0 },
    { id: 'p2', ticker: 'MSFT', weight: 0.16, drift: 0 },
    { id: 'p3', ticker: 'AAPL', weight: 0.12, drift: 0 },
    { id: 'p4', ticker: 'AVGO', weight: 0.1, drift: 0 },
    { id: 'p5', ticker: 'Cash', weight: 0.44, drift: 0 },
  ];
  const sentimentScore = 18;
  const regimeScore = 0.08;
  return {
    indices,
    crypto,
    macro,
    sentimentScore,
    sentimentHistory: Array.from({ length: 48 }, (_, i) => sentimentScore + Math.sin(i / 4) * 12 + (Math.random() - 0.5) * 6),
    regimeScore,
    regimeLabel: regimeFromScore(regimeScore),
    regimeEvents,
    whales,
    news,
    var95: 1.42,
    expectedShortfall: 2.18,
    portfolioBeta: 0.94,
    correlation,
    factors: [
      { name: 'Momentum', exposure: 0.32 },
      { name: 'Value', exposure: -0.12 },
      { name: 'Quality', exposure: 0.21 },
      { name: 'Low vol', exposure: 0.08 },
    ],
    portfolio,
    efficientFrontier: Array.from({ length: 20 }, (_, i) => ({
      risk: 6 + i * 0.45,
      ret: 4 + Math.sqrt(i) * 1.8 + Math.random() * 0.2,
    })),
    backtest: {
      pnl: '+14.2%',
      winRate: '58%',
      maxDd: '-6.1%',
      sharpe: '1.84',
      trades: 412,
    },
    equityCurve: Array.from({ length: 60 }, (_, i) => 100 + i * 0.35 + Math.sin(i / 3) * 2),
    esg: [
      { ticker: 'NVDA', score: 72, controversy: 'Low', carbon: '12.4 tCO2e/$M', flow: '+$2.1B' },
      { ticker: 'XOM', score: 41, controversy: 'Med', carbon: 'High', flow: '-$0.4B' },
      { ticker: 'MSFT', score: 81, controversy: 'Low', carbon: '4.1 tCO2e/$M', flow: '+$3.8B' },
    ],
    macroCalendar: [
      {
        id: 'm1',
        time: '08:30',
        name: 'CPI YoY',
        country: 'US',
        forecast: '2.9%',
        prior: '3.0%',
        surprise: 'inline',
      },
      {
        id: 'm2',
        time: '10:00',
        name: 'UMich Sentiment',
        country: 'US',
        forecast: '67.2',
        prior: '66.8',
      },
      {
        id: 'm3',
        time: '14:00',
        name: 'Fed Chair remarks',
        country: 'US',
        forecast: '—',
        prior: '—',
      },
    ],
    fundFlowDirection: 'in',
    whaleHeat: [
      { ticker: 'NVDA', intensity: 0.92 },
      { ticker: 'AVGO', intensity: 0.71 },
      { ticker: 'IWM', intensity: 0.55 },
      { ticker: 'XLF', intensity: 0.38 },
    ],
    entityHeat: [
      { name: 'Technology', score: 28 },
      { name: 'Financials', score: -6 },
      { name: 'Energy', score: 41 },
      { name: 'Fed policy', score: -12 },
      { name: 'Tariffs', score: -34 },
    ],
    tickCount: 0,
  };
}

function tickSnapshot(prev: MarketDataSnapshot): MarketDataSnapshot {
  const jitter = (x: number, a: number) => x + (Math.random() - 0.5) * a;
  const indices = prev.indices.map((q) => ({
    ...q,
    value: Math.max(0, jitter(q.value, q.id === 'vix' ? 0.25 : q.value * 0.0008)),
    change: jitter(q.change, 0.4),
    changePct: jitter(q.changePct, 0.04),
  }));
  const crypto = prev.crypto.map((c) => ({
    ...c,
    price: Math.max(1, jitter(c.price, c.symbol === 'BTC' ? 120 : 8)),
    chgPct: jitter(c.chgPct, 0.06),
  }));
  const macro = prev.macro.map((m) => ({
    ...m,
    flash: (['up', 'down', 'neutral'] as const)[Math.floor(Math.random() * 3)],
  }));
  const sentimentScore = Math.max(-100, Math.min(100, jitter(prev.sentimentScore, 2.2)));
  const regimeScore = Math.max(-1, Math.min(1, jitter(prev.regimeScore, 0.04)));
  const sentimentHistory = [...prev.sentimentHistory.slice(1), sentimentScore];
  const newWhale: WhalePrint = {
    id: `w-${Date.now()}`,
    ticker: (['NVDA', 'META', 'AMZN', 'GOOGL'] as const)[Math.floor(Math.random() * 4)] ?? 'NVDA',
    side: Math.random() > 0.45 ? 'BUY' : 'SELL',
    notional: `$${(80 + Math.random() * 200).toFixed(0)}M`,
    desk: (['Systematic', 'Macro RV', 'L/S Equity'] as const)[Math.floor(Math.random() * 3)] ?? 'Systematic',
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
  };
  const whales = [newWhale, ...prev.whales.slice(0, 2)];
  const headlinePool = [
    'Cross-asset vol compresses as macro prints align with consensus.',
    'Real rates edge lower; growth equities catch incremental bids.',
    'Credit spreads stable; HY issuance meets strong institutional demand.',
    'Dollar index drifts; EM FX pockets of strength in LATAM.',
  ];
  const news =
    Math.random() > 0.65
      ? [
          {
            id: `n-${Date.now()}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            headline: headlinePool[Math.floor(Math.random() * headlinePool.length)] ?? headlinePool[0],
            sentiment: Math.round(jitter(sentimentScore, 15)),
            entities: ['SPX', 'DXY', 'GLD'].slice(0, 2 + Math.floor(Math.random() * 2)),
          },
          ...prev.news.slice(0, 24),
        ]
      : prev.news.map((n) => ({ ...n, sentiment: Math.round(jitter(n.sentiment, 1.5)) }));

  return {
    ...prev,
    indices,
    crypto,
    macro,
    sentimentScore,
    sentimentHistory,
    regimeScore,
    regimeLabel: regimeFromScore(regimeScore),
    whales,
    news,
    var95: Math.max(0.2, jitter(prev.var95, 0.06)),
    expectedShortfall: Math.max(0.3, jitter(prev.expectedShortfall, 0.08)),
    portfolioBeta: Math.max(0.5, Math.min(1.4, jitter(prev.portfolioBeta, 0.02))),
    fundFlowDirection: (['in', 'out', 'flat'] as const)[Math.floor(Math.random() * 3)] ?? 'flat',
    whaleHeat: prev.whaleHeat.map((h) => ({ ...h, intensity: Math.max(0.1, Math.min(1, jitter(h.intensity, 0.06))) })),
    entityHeat: prev.entityHeat.map((e) => ({
      ...e,
      score: Math.max(-100, Math.min(100, jitter(e.score, 3))),
    })),
    equityCurve: [...prev.equityCurve.slice(1), jitter(prev.equityCurve[prev.equityCurve.length - 1] ?? 100, 0.4)],
    tickCount: prev.tickCount + 1,
  };
}

type Ctx = {
  data: MarketDataSnapshot;
  setPortfolio: (p: PortfolioAsset[]) => void;
  runBacktestExport: () => void;
};

const MarketDataContext = createContext<Ctx | null>(null);

const PORTFOLIO_STORAGE_KEY = 'bridge_market_portfolio';

export function MarketDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<MarketDataSnapshot>(() => seed());
  const [portfolioHydrated, setPortfolioHydrated] = useState(false);
  const { show } = useMarketToast();
  const { alerts, playBeep } = useMarketUi();
  const lastFireRef = useRef<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PortfolioAsset[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setData((d) => ({ ...d, portfolio: parsed }));
        }
      }
    } catch {
      /* ignore */
    }
    setPortfolioHydrated(true);
  }, []);

  useEffect(() => {
    if (!portfolioHydrated) return;
    try {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data.portfolio));
    } catch {
      /* ignore */
    }
  }, [data.portfolio, portfolioHydrated]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setData((d) => tickSnapshot(d));
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const now = Date.now();
    for (const a of alerts) {
      if (!a.enabled) continue;
      const th = parseFloat(a.threshold);
      const threshold = Number.isFinite(th) ? th : 70;
      const last = lastFireRef.current[a.id] ?? 0;
      if (now - last < 45000) continue;

      let hit = false;
      let msg = '';
      if (a.type === 'sentiment' && Math.abs(data.sentimentScore) >= threshold) {
        hit = true;
        msg = `${a.label}: |sentiment| ≥ ${threshold}`;
      }
      if (a.type === 'regime' && data.regimeLabel.toLowerCase() === a.threshold.toLowerCase()) {
        hit = true;
        msg = `${a.label}: regime → ${data.regimeLabel}`;
      }
      if (a.type === 'risk' && data.var95 >= threshold / 100) {
        hit = true;
        msg = `${a.label}: VaR(95) ≥ ${(threshold / 100).toFixed(2)}%`;
      }
      if (a.type === 'whale' && (data.whaleHeat[0]?.intensity ?? 0) * 100 >= threshold) {
        hit = true;
        msg = `${a.label}: top whale heat ≥ ${threshold}%`;
      }
      if (hit) {
        lastFireRef.current[a.id] = now;
        show(msg, 'alert');
        playBeep();
      }
    }
  }, [alerts, data.sentimentScore, data.regimeLabel, data.var95, data.whales.length, data.whaleHeat, show, playBeep]);

  const setPortfolio = useCallback((p: PortfolioAsset[]) => {
    setData((d) => ({ ...d, portfolio: p }));
  }, []);

  const runBacktestExport = useCallback(() => {
    const rows = data.equityCurve.map((v, i) => `${i},${v.toFixed(4)}`);
    const blob = new Blob([['idx,equity', ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bridge_observer_backtest_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    show('Exported equity curve CSV', 'default');
  }, [data.equityCurve, show]);

  const value = useMemo(() => ({ data, setPortfolio, runBacktestExport }), [data, setPortfolio, runBacktestExport]);

  return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>;
}

export function useMarketData() {
  const ctx = useContext(MarketDataContext);
  if (!ctx) throw new Error('useMarketData requires MarketDataProvider');
  return ctx;
}
