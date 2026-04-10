import type { AiActionResult, AnalyticsSnapshot, FeedItem } from '@/lib/editor/types';

const API_BASE = 'https://api.bridgeobserver.com';
const DATA_BASE = 'https://data.bridgeobserver.com';
const MARKETS_BASE = 'https://markets.bridgeobserver.com';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchFeedBootstrap(): Promise<FeedItem[] | null> {
  return fetchJson<FeedItem[]>(`${API_BASE}/editor/feed`);
}

export async function fetchAnalyticsSnapshot(): Promise<AnalyticsSnapshot | null> {
  return fetchJson<AnalyticsSnapshot>(`${API_BASE}/editor/analytics`);
}

export async function fetchRelatedStories(entity: string): Promise<string[] | null> {
  return fetchJson<string[]>(`${API_BASE}/editor/related?entity=${encodeURIComponent(entity)}`);
}

export async function aiGenerateDraft(input: { title: string; context: string }): Promise<AiActionResult | null> {
  return fetchJson<AiActionResult>(`${API_BASE}/editor/ai/generate-draft`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function aiSuggestAngle(input: { title: string; context: string }): Promise<AiActionResult | null> {
  return fetchJson<AiActionResult>(`${API_BASE}/editor/ai/suggest-angle`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function aiFactCheckSignals(input: { body: string }): Promise<string[] | null> {
  return fetchJson<string[]>(`${API_BASE}/editor/ai/fact-check-signals`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function openEditorStream(
  onMessage: (item: FeedItem) => void,
  onError?: (label: string, error: Event) => void,
): () => void {
  const endpoints = [
    `${DATA_BASE}/stream/editor`,
    `${API_BASE}/stream/editor-events`,
    `${MARKETS_BASE}/stream/editor-signals`,
  ];
  const sources: EventSource[] = [];
  for (const endpoint of endpoints) {
    try {
      const es = new EventSource(endpoint);
      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as FeedItem;
          onMessage(parsed);
        } catch {
          /* ignore malformed event */
        }
      };
      es.onerror = (event) => {
        if (onError) onError(endpoint, event);
      };
      sources.push(es);
    } catch {
      /* ignore */
    }
  }
  return () => {
    for (const es of sources) es.close();
  };
}
