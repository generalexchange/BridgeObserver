export type SearchHit = { id: string; label: string; kind: 'ticker' | 'sector' | 'topic' | 'person'; meta?: string };

export const MARKET_SEARCH_INDEX: SearchHit[] = [
  { id: 'NVDA', label: 'NVDA', kind: 'ticker', meta: 'NVIDIA Corp' },
  { id: 'AAPL', label: 'AAPL', kind: 'ticker', meta: 'Apple Inc' },
  { id: 'MSFT', label: 'MSFT', kind: 'ticker', meta: 'Microsoft' },
  { id: 'AVGO', label: 'AVGO', kind: 'ticker', meta: 'Broadcom' },
  { id: 'META', label: 'META', kind: 'ticker', meta: 'Meta Platforms' },
  { id: 'AMZN', label: 'AMZN', kind: 'ticker', meta: 'Amazon' },
  { id: 'GOOGL', label: 'GOOGL', kind: 'ticker', meta: 'Alphabet' },
  { id: 'JPM', label: 'JPM', kind: 'ticker', meta: 'JPMorgan' },
  { id: 'XLE', label: 'XLE', kind: 'ticker', meta: 'Energy Select' },
  { id: 'XLK', label: 'XLK', kind: 'ticker', meta: 'Technology' },
  { id: 'XLF', label: 'XLF', kind: 'ticker', meta: 'Financials' },
  { id: 'sector-tech', label: 'Technology', kind: 'sector', meta: 'Sector lens' },
  { id: 'sector-fin', label: 'Financials', kind: 'sector', meta: 'Sector lens' },
  { id: 'sector-en', label: 'Energy', kind: 'sector', meta: 'Sector lens' },
  { id: 'topic-fed', label: 'Federal Reserve', kind: 'topic', meta: 'Policy & rates' },
  { id: 'topic-tariffs', label: 'Tariffs', kind: 'topic', meta: 'Trade' },
  { id: 'topic-ai', label: 'Artificial intelligence', kind: 'topic', meta: 'Thematic' },
  { id: 'person-powell', label: 'Jerome Powell', kind: 'person', meta: 'Fed' },
  { id: 'person-trump', label: 'Donald Trump', kind: 'person', meta: 'Administration' },
];

export function filterSearchIndex(q: string, limit = 12): SearchHit[] {
  const s = q.trim().toLowerCase();
  if (!s) return MARKET_SEARCH_INDEX.slice(0, limit);
  return MARKET_SEARCH_INDEX.filter(
    (h) => h.label.toLowerCase().includes(s) || (h.meta && h.meta.toLowerCase().includes(s)),
  ).slice(0, limit);
}
