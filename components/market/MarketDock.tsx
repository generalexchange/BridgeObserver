'use client';

import { useMarketData } from '@/components/market/MarketDataContext';

export function MarketDock() {
  const { data } = useMarketData();
  return (
    <div className="market-dock">
      <div className="market-dock__head">
        <span className="market-dock__title">Wire</span>
        <span className="market-dock__meta">
          Sentiment {data.sentimentScore >= 0 ? '+' : ''}
          {data.sentimentScore.toFixed(0)} · Regime {data.regimeLabel} · Flow{' '}
          {data.fundFlowDirection === 'in' ? '▲ in' : data.fundFlowDirection === 'out' ? '▼ out' : '— flat'}
        </span>
      </div>
      <div className="market-dock__scroll" role="feed" aria-label="Live headlines">
        {data.news.slice(0, 12).map((n) => (
          <article key={n.id} className={`market-dock__line${n.urgent ? ' market-dock__line--urgent' : ''}`}>
            <time dateTime={n.time}>{n.time}</time>
            <span className="market-dock__sent" data-sign={n.sentiment >= 0 ? 'pos' : 'neg'}>
              {n.sentiment >= 0 ? '+' : ''}
              {n.sentiment}
            </span>
            <p>{n.headline}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
