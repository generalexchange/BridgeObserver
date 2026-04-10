'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState, type RefObject } from 'react';
import { ChevronDown, Radio, Search } from 'lucide-react';
import { filterSearchIndex, type SearchHit } from '@/lib/market/searchIndex';
import { useMarketData } from '@/components/market/MarketDataContext';
import { useMarketUi } from '@/components/market/MarketUiContext';
import { useMarketAuth } from '@/components/market/MarketAuthContext';

const WORKSPACES = [
  { id: 'default' as const, label: 'Default' },
  { id: 'macro' as const, label: 'Macro' },
  { id: 'risk' as const, label: 'Risk' },
  { id: 'trading' as const, label: 'Trading' },
];

type Props = {
  searchInputRef?: RefObject<HTMLInputElement>;
};

export function MarketTopBar({ searchInputRef }: Props) {
  const { data } = useMarketData();
  const { workspace, setWorkspace, settings } = useMarketUi();
  const { session } = useMarketAuth();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null!);
  const inputRef = searchInputRef ?? internalRef;
  const listId = useId().replace(/:/g, '');
  const hits = useMemo(() => filterSearchIndex(q, 10), [q]);

  const onKeyDoc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    },
    [inputRef],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDoc);
    return () => document.removeEventListener('keydown', onKeyDoc);
  }, [onKeyDoc]);

  const pickHit = (h: SearchHit) => {
    setQ(h.label);
    setOpen(false);
    inputRef.current?.blur();
  };

  return (
    <header className="market-topbar">
      <div className="market-topbar__ticker" aria-label="Live market snapshot">
        <div className="market-topbar__ticker-inner">
          {data.indices.map((x) => (
            <span key={x.id} className="market-tick">
              <span className="market-tick__sym">{x.label}</span>
              <span className="market-tick__val">{x.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className={x.changePct >= 0 ? 'market-tick__chg market-tick__chg--up' : 'market-tick__chg market-tick__chg--dn'}>
                {x.changePct >= 0 ? '+' : ''}
                {x.changePct.toFixed(2)}%
              </span>
            </span>
          ))}
          {data.crypto.map((c) => (
            <span key={c.symbol} className="market-tick">
              <span className="market-tick__sym">{c.symbol}</span>
              <span className="market-tick__val">
                {c.symbol === 'BTC' ? `$${(c.price / 1000).toFixed(1)}k` : `$${c.price.toFixed(0)}`}
              </span>
              <span className={c.chgPct >= 0 ? 'market-tick__chg market-tick__chg--up' : 'market-tick__chg market-tick__chg--dn'}>
                {c.chgPct >= 0 ? '+' : ''}
                {c.chgPct.toFixed(2)}%
              </span>
            </span>
          ))}
          {data.macro.map((m) => (
            <span key={m.label} className="market-tick market-tick--macro">
              <span className="market-tick__sym">{m.label}</span>
              <span className="market-tick__val">{m.value}</span>
              <span
                className={
                  m.flash === 'up'
                    ? 'market-tick__chg market-tick__chg--up'
                    : m.flash === 'down'
                      ? 'market-tick__chg market-tick__chg--dn'
                      : 'market-tick__chg'
                }
              >
                {m.delta}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="market-topbar__row">
        <div className="market-topbar__pulse">
          <Radio className="market-live-dot" size={14} aria-hidden />
          <span>LIVE</span>
          <span className="market-topbar__tick">tick #{data.tickCount}</span>
        </div>

        <div className="market-search-wrap">
          <label className="market-search" htmlFor={`market-global-search-${listId}`}>
            <Search size={16} strokeWidth={2} aria-hidden className="market-search__icon" />
            <input
              ref={inputRef}
              id={`market-global-search-${listId}`}
              type="search"
              autoComplete="off"
              placeholder="Search tickers, sectors, topics… (press /)"
              value={q}
              role="combobox"
              aria-expanded={open}
              aria-controls={open && hits.length > 0 ? listId : undefined}
              aria-autocomplete="list"
              onChange={(e) => {
                setQ(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => window.setTimeout(() => setOpen(false), 180)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && hits[0]) pickHit(hits[0]);
                if (e.key === 'Escape') setOpen(false);
              }}
            />
          </label>
          {open && hits.length > 0 ? (
            <ul id={listId} className="market-search__hits" role="listbox">
              {hits.map((h) => (
                <li key={h.id} role="option" aria-selected={false}>
                  <button type="button" className="market-search__hit" onMouseDown={() => pickHit(h)}>
                    <span className="market-search__hit-label">{h.label}</span>
                    <span className="market-search__hit-meta">
                      {h.kind} {h.meta ? `· ${h.meta}` : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="market-topbar__actions">
          <div className="market-workspace">
            <span className="market-workspace__label">Workspace</span>
            <div className="market-workspace__select">
              <select
                aria-label="Workspace"
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value as (typeof WORKSPACES)[number]['id'])}
              >
                {WORKSPACES.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} aria-hidden className="market-workspace__chev" />
            </div>
          </div>
          <div className="market-avatar" title={session?.email ?? ''}>
            <span>{(session?.email ?? 'BO').slice(0, 2).toUpperCase()}</span>
          </div>
        </div>
      </div>
      {settings.reducedMotion ? null : <div className="market-topbar__scanline" aria-hidden />}
    </header>
  );
}
