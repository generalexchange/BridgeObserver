'use client';

import { useCallback, useId, useMemo, useState, type ReactNode } from 'react';
import { useMarketData } from '@/components/market/MarketDataContext';
import { useMarketUi } from '@/components/market/MarketUiContext';
import type { AlertRule } from '@/lib/market/types';

function Sparkline({ values, height = 56 }: { values: number[]; height?: number }) {
  const w = 280;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1 || 1)) * (w - pad * 2);
      const y = height - pad - ((v - min) / span) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={w} height={height} className="market-spark" viewBox={`0 0 ${w} ${height}`} aria-hidden>
      <polyline fill="none" stroke="var(--market-accent)" strokeWidth="1.5" points={pts} />
    </svg>
  );
}

function ModuleFrame({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="market-module">
      <header className="market-module__head">
        <h2 className="market-module__title">{title}</h2>
        {actions ? <div className="market-module__actions">{actions}</div> : null}
      </header>
      <div className="market-module__body">{children}</div>
    </section>
  );
}

function DashboardView() {
  const { data } = useMarketData();
  return (
    <div className="market-dash">
      <ModuleFrame title="Cross-asset pulse">
        <div className="market-dash__grid">
          <div className="market-glass market-kpi">
            <span className="market-kpi__label">Aggregate sentiment</span>
            <strong className="market-kpi__val">
              {data.sentimentScore >= 0 ? '+' : ''}
              {data.sentimentScore.toFixed(1)}
            </strong>
            <span className="market-kpi__hint">−100 … +100 · multi-source blend</span>
          </div>
          <div className="market-glass market-kpi">
            <span className="market-kpi__label">Regime</span>
            <strong className="market-kpi__val">{data.regimeLabel}</strong>
            <span className="market-kpi__hint">score {data.regimeScore.toFixed(2)}</span>
          </div>
          <div className="market-glass market-kpi">
            <span className="market-kpi__label">VaR (95%)</span>
            <strong className="market-kpi__val">{data.var95.toFixed(2)}%</strong>
            <span className="market-kpi__hint">ES {data.expectedShortfall.toFixed(2)}%</span>
          </div>
          <div className="market-glass market-kpi">
            <span className="market-kpi__label">Portfolio β</span>
            <strong className="market-kpi__val">{data.portfolioBeta.toFixed(2)}</strong>
            <span className="market-kpi__hint">vs SPX</span>
          </div>
        </div>
      </ModuleFrame>
      <div className="market-dash__split">
        <ModuleFrame title="Sentiment trajectory">
          <Sparkline values={data.sentimentHistory} height={72} />
        </ModuleFrame>
        <ModuleFrame title="Factor exposures">
          <ul className="market-factor-list">
            {data.factors.map((f) => (
              <li key={f.name}>
                <span>{f.name}</span>
                <span className="market-factor-list__bar-wrap">
                  <span className="market-factor-list__bar" style={{ width: `${Math.min(100, Math.abs(f.exposure) * 200)}%` }} />
                </span>
                <span>{f.exposure.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </ModuleFrame>
      </div>
    </div>
  );
}

function SentimentView() {
  const { data } = useMarketData();
  const needlePct = 50 + (data.sentimentScore / 100) * 50;
  return (
    <ModuleFrame title="Sentiment Engine">
      <div className="market-sent">
        <div className="market-glass market-sent__gauge">
          <div className="market-gauge">
            <div className="market-gauge__track" />
            <div className="market-gauge__needle" style={{ left: `${needlePct}%` }} />
          </div>
          <div className="market-sent__scores">
            <p>
              Score <strong>{data.sentimentScore.toFixed(1)}</strong>
            </p>
            <p className="market-muted">News · social · analyst · filings (mock)</p>
          </div>
        </div>
        <div className="market-glass">
          <h3 className="market-subhead">Entity heat</h3>
          <div className="market-heat-grid">
            {data.entityHeat.map((e) => (
              <div key={e.name} className="market-heat-cell">
                <span>{e.name}</span>
                <div className="market-heat-bar">
                  <span style={{ width: `${Math.min(100, Math.abs(e.score))}%`, background: e.score >= 0 ? 'var(--market-up)' : 'var(--market-dn)' }} />
                </div>
                <span>{e.score >= 0 ? '+' : ''}{e.score.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="market-glass">
          <h3 className="market-subhead">Annotated series</h3>
          <Sparkline values={data.sentimentHistory} height={100} />
        </div>
      </div>
    </ModuleFrame>
  );
}

function RegimeView() {
  const { data } = useMarketData();
  return (
    <ModuleFrame title="Regime Monitor">
      <div className="market-regime-banner market-glass">
        <div>
          <p className="market-muted">Regime sentiment score</p>
          <p className="market-regime-label">{data.regimeLabel}</p>
        </div>
        <div className="market-regime-meter">
          <span style={{ left: `${(data.regimeScore + 1) * 50}%` }} />
        </div>
      </div>
      <ol className="market-timeline">
        {data.regimeEvents.map((ev) => (
          <li key={ev.id} className="market-timeline__item">
            <span className="market-timeline__time">{ev.ts}</span>
            <span className="market-timeline__src">{ev.source}</span>
            <blockquote>{ev.quote}</blockquote>
            <span className={`market-tag market-tag--${ev.impact}`}>{ev.impact}</span>
          </li>
        ))}
      </ol>
    </ModuleFrame>
  );
}

function WhaleView() {
  const { data } = useMarketData();
  return (
    <ModuleFrame title="Whale & Institutional Tracker">
      <div className="market-whale-split">
        <div className="market-glass">
          <h3 className="market-subhead">Block flow</h3>
          <table className="market-table market-table--dense">
            <thead>
              <tr>
                <th>Time</th>
                <th>Ticker</th>
                <th>Side</th>
                <th>Notional</th>
                <th>Desk</th>
              </tr>
            </thead>
            <tbody>
              {data.whales.map((w) => (
                <tr key={w.id}>
                  <td>{w.time}</td>
                  <td className="market-mono">{w.ticker}</td>
                  <td className={w.side === 'BUY' ? 'market-up' : 'market-dn'}>{w.side}</td>
                  <td>{w.notional}</td>
                  <td className="market-muted">{w.desk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="market-glass">
          <h3 className="market-subhead">Ticker heat</h3>
          <ul className="market-whale-heat">
            {data.whaleHeat.map((h) => (
              <li key={h.ticker}>
                <span className="market-mono">{h.ticker}</span>
                <div className="market-whale-heat__bar">
                  <span style={{ width: `${h.intensity * 100}%` }} />
                </div>
                <span>{(h.intensity * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ModuleFrame>
  );
}

function RiskView() {
  const { data } = useMarketData();
  const labels = ['MTUM', 'VLUE', 'QUAL', 'USMV', 'SIZE'];
  return (
    <ModuleFrame title="Risk Analytics">
      <div className="market-risk-grid">
        <div className="market-glass market-risk-kpis">
          <div>
            <span className="market-muted">VaR (95%)</span>
            <strong>{data.var95.toFixed(2)}%</strong>
          </div>
          <div>
            <span className="market-muted">Expected shortfall</span>
            <strong>{data.expectedShortfall.toFixed(2)}%</strong>
          </div>
          <div>
            <span className="market-muted">Portfolio β</span>
            <strong>{data.portfolioBeta.toFixed(2)}</strong>
          </div>
        </div>
        <div className="market-glass">
          <h3 className="market-subhead">Correlation (mock factors)</h3>
          <div className="market-corr">
            <div className="market-corr__labels">
              <span />
              {labels.map((l) => (
                <span key={l} className="market-mono">
                  {l}
                </span>
              ))}
            </div>
            {data.correlation.map((row, i) => (
              <div key={labels[i]} className="market-corr__row">
                <span className="market-mono">{labels[i]}</span>
                {row.map((c, j) => (
                  <span
                    key={`${i}-${j}`}
                    className="market-corr__cell"
                    style={{ opacity: 0.35 + c * 0.5, background: c > 0.7 ? 'rgba(106,179,255,0.25)' : 'rgba(255,255,255,0.04)' }}
                    title={`${c.toFixed(2)}`}
                  >
                    {c.toFixed(2)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
}

function PortfolioView() {
  const { data, setPortfolio } = useMarketData();
  const [dragId, setDragId] = useState<string | null>(null);

  const onDragStart = (id: string) => setDragId(id);
  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...data.portfolio];
    const from = list.findIndex((p) => p.id === dragId);
    const to = list.findIndex((p) => p.id === targetId);
    if (from < 0 || to < 0) return;
    const [m] = list.splice(from, 1);
    if (m) list.splice(to, 0, m);
    setPortfolio(list);
    setDragId(null);
  };

  const frontierPts = useMemo(() => {
    const pts = data.efficientFrontier.map((p, i) => {
      const x = 40 + (p.risk / 20) * 220;
      const y = 140 - (p.ret / 25) * 120;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    });
    return pts.join(' ');
  }, [data.efficientFrontier]);

  return (
    <ModuleFrame title="Portfolio Optimizer">
      <div className="market-portfolio">
        <div className="market-glass">
          <h3 className="market-subhead">Allocation (drag to reorder)</h3>
          <ul className="market-alloc">
            {data.portfolio.map((p) => (
              <li
                key={p.id}
                draggable
                onDragStart={() => onDragStart(p.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(p.id)}
                className="market-alloc__row"
              >
                <span className="market-mono">{p.ticker}</span>
                <div className="market-alloc__bar">
                  <span style={{ width: `${p.weight * 100}%` }} />
                </div>
                <span>{(p.weight * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="market-glass">
          <h3 className="market-subhead">Efficient frontier (mock)</h3>
          <svg width="100%" height={160} viewBox="0 0 280 160" className="market-frontier" aria-hidden>
            <defs>
              <linearGradient id="ffill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(106,179,255,0)" />
                <stop offset="100%" stopColor="rgba(106,179,255,0.2)" />
              </linearGradient>
            </defs>
            <path d={`${frontierPts} L 260,140 L 40,140 Z`} fill="url(#ffill)" />
            <path d={frontierPts} fill="none" stroke="var(--market-accent)" strokeWidth="1.5" />
          </svg>
          <p className="market-muted market-note">Optimization uses sentiment, risk, ESG, and regime overlays (simulated).</p>
        </div>
      </div>
    </ModuleFrame>
  );
}

function BacktestView() {
  const { data, runBacktestExport } = useMarketData();
  const path = useMemo(() => {
    const vals = data.equityCurve;
    const w = 320;
    const h = 120;
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const span = max - min || 1;
    return vals
      .map((v, i) => {
        const x = (i / (vals.length - 1)) * w;
        const y = h - ((v - min) / span) * (h - 8) - 4;
        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  }, [data.equityCurve]);

  return (
    <ModuleFrame
      title="Backtesting Lab"
      actions={
        <button type="button" className="market-btn market-btn--ghost" onClick={runBacktestExport}>
          Export CSV
        </button>
      }
    >
      <div className="market-backtest">
        <div className="market-glass market-backtest__kpis">
          <div>
            <span className="market-muted">P&amp;L</span>
            <strong className="market-up">{data.backtest.pnl}</strong>
          </div>
          <div>
            <span className="market-muted">Win rate</span>
            <strong>{data.backtest.winRate}</strong>
          </div>
          <div>
            <span className="market-muted">Max DD</span>
            <strong className="market-dn">{data.backtest.maxDd}</strong>
          </div>
          <div>
            <span className="market-muted">Sharpe</span>
            <strong>{data.backtest.sharpe}</strong>
          </div>
          <div>
            <span className="market-muted">Trades</span>
            <strong>{data.backtest.trades}</strong>
          </div>
        </div>
        <div className="market-glass">
          <h3 className="market-subhead">Strategy: sentiment &gt; 70 + whale inflow (mock)</h3>
          <svg width="100%" height={128} viewBox="0 0 320 120" className="market-equity" aria-hidden>
            <path d={path} fill="none" stroke="var(--market-accent-soft)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </ModuleFrame>
  );
}

function NewsView() {
  const { data } = useMarketData();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ModuleFrame title="News + Signal Feed">
      <div className="market-news">
        {data.news.map((n) => (
          <article key={n.id} className={`market-news__row${n.urgent ? ' market-news__row--urgent' : ''}`}>
            <button type="button" className="market-news__hit" onClick={() => setOpen((x) => (x === n.id ? null : n.id))}>
              <time>{n.time}</time>
              <span className="market-news__sent" data-s={n.sentiment >= 0 ? 'p' : 'n'}>
                {n.sentiment >= 0 ? '+' : ''}
                {n.sentiment}
              </span>
              <span className="market-news__hl">{n.headline}</span>
            </button>
            {open === n.id ? (
              <div className="market-news__detail">
                <p>Entities: {n.entities.join(' · ')}</p>
                <p className="market-muted">Full context and entity graph would load here (demo).</p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </ModuleFrame>
  );
}

function EsgView() {
  const { data } = useMarketData();
  return (
    <ModuleFrame title="ESG & Impact">
      <table className="market-table market-table--dense">
        <thead>
          <tr>
            <th>Ticker</th>
            <th>ESG score</th>
            <th>Controversy</th>
            <th>Carbon</th>
            <th>Sustainable flows</th>
          </tr>
        </thead>
        <tbody>
          {data.esg.map((r) => (
            <tr key={r.ticker}>
              <td className="market-mono">{r.ticker}</td>
              <td>{r.score}</td>
              <td>{r.controversy}</td>
              <td>{r.carbon}</td>
              <td>{r.flow}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModuleFrame>
  );
}

function MacroView() {
  const { data } = useMarketData();
  return (
    <ModuleFrame title="Macro Calendar & Economic Data">
      <div className="market-macro-grid">
        <table className="market-table market-table--dense">
          <thead>
            <tr>
              <th>Time (ET)</th>
              <th>Event</th>
              <th>Region</th>
              <th>Forecast</th>
              <th>Prior</th>
              <th>Surprise</th>
            </tr>
          </thead>
          <tbody>
            {data.macroCalendar.map((e) => (
              <tr key={e.id}>
                <td>{e.time}</td>
                <td>{e.name}</td>
                <td>{e.country}</td>
                <td>{e.forecast}</td>
                <td>{e.prior}</td>
                <td>{e.surprise ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="market-glass market-cbw">
          <h3 className="market-subhead">Central bank watch</h3>
          <p className="market-muted">Implied cut probability (mock): 62% next meeting · tone: data-dependent.</p>
          <div className="market-rate-bar">
            <span style={{ width: '62%' }} />
          </div>
        </div>
      </div>
    </ModuleFrame>
  );
}

function AlertsView() {
  const { alerts, setAlerts } = useMarketUi();
  const id = useId();
  const [label, setLabel] = useState('');
  const [type, setType] = useState<AlertRule['type']>('sentiment');
  const [threshold, setThreshold] = useState('70');

  const add = () => {
    if (!label.trim()) return;
    const rule: AlertRule = {
      id: `a-${Date.now()}`,
      label: label.trim(),
      enabled: true,
      type,
      threshold,
    };
    setAlerts([...alerts, rule]);
    setLabel('');
  };

  return (
    <ModuleFrame title="Alert System">
      <div className="market-alerts">
        <div className="market-glass market-alerts__form">
          <h3 className="market-subhead">New rule</h3>
          <label className="market-field market-field--inline">
            <span>Label</span>
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Risk-on sentiment" />
          </label>
          <label className="market-field market-field--inline">
            <span>Type</span>
            <select value={type} onChange={(e) => setType(e.target.value as AlertRule['type'])}>
              <option value="sentiment">Sentiment (|score| ≥ threshold)</option>
              <option value="regime">Regime (label match)</option>
              <option value="risk">VaR % (≥ threshold)</option>
              <option value="whale">Whale heat % (top ticker)</option>
            </select>
          </label>
          <label className="market-field market-field--inline">
            <span>Threshold</span>
            <input value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="70, Crisis, 1.5, 85…" />
          </label>
          <button type="button" className="market-btn market-btn--primary" onClick={add}>
            Add alert
          </button>
          <p className="market-muted market-note" id={`${id}-hint`}>
            Toasts fire at most once per ~45s per rule. Enable sound in Settings.
          </p>
        </div>
        <ul className="market-alert-list">
          {alerts.map((a) => (
            <li key={a.id} className="market-glass market-alert-list__item">
              <div>
                <strong>{a.label}</strong>
                <span className="market-muted">
                  {' '}
                  · {a.type} · {a.threshold}
                </span>
              </div>
              <label className="market-toggle">
                <input
                  type="checkbox"
                  checked={a.enabled}
                  onChange={(e) =>
                    setAlerts(alerts.map((x) => (x.id === a.id ? { ...x, enabled: e.target.checked } : x)))
                  }
                />
                <span>On</span>
              </label>
              <button
                type="button"
                className="market-btn market-btn--ghost"
                onClick={() => setAlerts(alerts.filter((x) => x.id !== a.id))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ModuleFrame>
  );
}

function CopilotView() {
  const { data } = useMarketData();
  const [q, setQ] = useState('');
  const [out, setOut] = useState('');
  const [busy, setBusy] = useState(false);
  const [deep, setDeep] = useState(false);

  const run = useCallback(() => {
    if (!q.trim()) return;
    setBusy(true);
    setOut('');
    window.setTimeout(() => {
      const lower = q.toLowerCase();
      let text = '';
      if (lower.includes('tech') && lower.includes('bear')) {
        text = `Tech skew is ${data.sentimentScore >= 0 ? 'mixed' : 'negative'} today (aggregate ${data.sentimentScore.toFixed(1)}). Regime reads **${data.regimeLabel}** with rates ${data.macro[0]?.value ?? '—'}. Whale tape shows ${data.whales[0]?.side ?? '—'} bias in ${data.whales[0]?.ticker ?? 'liquidity names'}.`;
      } else if (lower.includes('nvda') || lower.includes('avgo')) {
        text = `NVDA vs AVGO: both screen positive on block flow in semis; top whale heat is ${data.whaleHeat[0]?.ticker} at ${((data.whaleHeat[0]?.intensity ?? 0) * 100).toFixed(0)}%. Regime exposure favors ${data.regimeLabel} positioning — hedge ratio ↑ vs QQQ beta ${data.portfolioBeta.toFixed(2)}.`;
      } else if (lower.includes('tariff') || lower.includes('trump')) {
        text = `Tariff scenario (mock): baseline SPX −1.2% if policy surprise persists; HY OAS +18 bps; USD ${data.macro[1]?.value ?? 'DXY'} path sensitive to risk-off. Current regime label: **${data.regimeLabel}**.`;
      } else {
        text = `Snapshot: sentiment ${data.sentimentScore.toFixed(1)}, regime **${data.regimeLabel}**, VaR ${data.var95.toFixed(2)}%. ${deep ? 'Deep research: cross-checking wire, filings, and desk chatter (simulated).' : 'Use Deep Research for cited synthesis.'}`;
      }
      setOut(text);
      setBusy(false);
    }, deep ? 1400 : 650);
  }, [q, data, deep]);

  return (
    <ModuleFrame
      title="AI Research Co-Pilot"
      actions={
        <label className="market-toggle">
          <input type="checkbox" checked={deep} onChange={(e) => setDeep(e.target.checked)} />
          <span>Deep Research</span>
        </label>
      }
    >
      <div className="market-copilot">
        <label className="market-field">
          <span>Query</span>
          <textarea
            rows={3}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder='e.g. "Why is tech bearish today?" · "Compare NVDA vs AVGO regime exposure"'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                run();
              }
            }}
          />
        </label>
        <button type="button" className="market-btn market-btn--primary" disabled={busy} onClick={run}>
          {busy ? 'Running…' : 'Run analysis'}
        </button>
        {out ? (
          <div className="market-glass market-copilot__out">
            <p className="market-copilot__answer">{out}</p>
            <p className="market-muted market-note">Sources: terminal snapshot + mock RAG (demo only).</p>
          </div>
        ) : null}
      </div>
    </ModuleFrame>
  );
}

function SettingsView() {
  const { settings, updateSettings } = useMarketUi();
  return (
    <ModuleFrame title="Settings">
      <div className="market-glass market-settings">
        <label className="market-toggle market-toggle--block">
          <input
            type="checkbox"
            checked={settings.soundAlerts}
            onChange={(e) => updateSettings({ soundAlerts: e.target.checked })}
          />
          <span>Institutional alert beep (Web Audio)</span>
        </label>
        <label className="market-toggle market-toggle--block">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
          />
          <span>Reduce motion (disables decorative animations)</span>
        </label>
        <p className="market-muted market-note">Layouts persist per browser via react-resizable-panels storage.</p>
      </div>
    </ModuleFrame>
  );
}

export function MarketModuleRouter() {
  const { activeModule } = useMarketUi();
  switch (activeModule) {
    case 'dashboard':
      return <DashboardView />;
    case 'sentiment':
      return <SentimentView />;
    case 'regime':
      return <RegimeView />;
    case 'whale':
      return <WhaleView />;
    case 'risk':
      return <RiskView />;
    case 'portfolio':
      return <PortfolioView />;
    case 'backtest':
      return <BacktestView />;
    case 'news':
      return <NewsView />;
    case 'esg':
      return <EsgView />;
    case 'macro':
      return <MacroView />;
    case 'alerts':
      return <AlertsView />;
    case 'copilot':
      return <CopilotView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <DashboardView />;
  }
}
