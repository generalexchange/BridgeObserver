import type {
  ApiEndpointHealth,
  AuditLog,
  InfraMetric,
  Kpi,
  NotificationEvent,
  PipelineJob,
  RevenueMetrics,
  UserRecord,
} from '@/lib/admin/types';

const API_BASE = 'https://api.bridgeobserver.com';
const DATA_BASE = 'https://data.bridgeobserver.com';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getGlobalKpis(): Promise<Kpi[] | null> {
  return fetchJson<Kpi[]>(`${API_BASE}/admin/overview`);
}

export async function getRevenueMetrics(): Promise<RevenueMetrics | null> {
  return fetchJson<RevenueMetrics>(`${API_BASE}/admin/revenue`);
}

export async function getUsers(): Promise<UserRecord[] | null> {
  return fetchJson<UserRecord[]>(`${API_BASE}/admin/users`);
}

export async function getPipelineJobs(): Promise<PipelineJob[] | null> {
  return fetchJson<PipelineJob[]>(`${DATA_BASE}/admin/pipeline`);
}

export async function getApiHealth(): Promise<ApiEndpointHealth[] | null> {
  return fetchJson<ApiEndpointHealth[]>(`${API_BASE}/admin/api-health`);
}

export async function getAuditLogs(): Promise<AuditLog[] | null> {
  return fetchJson<AuditLog[]>(`${API_BASE}/admin/audit`);
}

export async function getInfraMetrics(): Promise<InfraMetric[] | null> {
  return fetchJson<InfraMetric[]>(`${API_BASE}/admin/infra`);
}

export function openAdminStream(onEvent: (ev: NotificationEvent) => void): () => void {
  const channels = [`${API_BASE}/stream/admin-events`, `${DATA_BASE}/stream/admin-ingestion`];
  const sources: EventSource[] = [];
  for (const c of channels) {
    try {
      const es = new EventSource(c);
      es.onmessage = (e) => {
        try {
          onEvent(JSON.parse(e.data) as NotificationEvent);
        } catch {
          /* ignore malformed */
        }
      };
      sources.push(es);
    } catch {
      /* noop */
    }
  }
  return () => {
    for (const s of sources) s.close();
  };
}

