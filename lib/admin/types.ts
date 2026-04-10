export type AdminModuleId =
  | 'overview'
  | 'revenue'
  | 'users'
  | 'editorial'
  | 'pipeline'
  | 'intelligence'
  | 'api'
  | 'security'
  | 'health';

export type Severity = 'info' | 'warn' | 'critical';

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
};

export type RevenueMetrics = {
  mrr: number;
  arr: number;
  churn: number;
  ltv: number;
  arpu: number;
  conversions: number;
};

export type UserRecord = {
  id: string;
  email: string;
  role: 'Admin' | 'Editor-in-Chief' | 'Journalist' | 'Analyst' | 'Partner Client' | 'API Consumer';
  lastSeen: string;
  active: boolean;
};

export type PipelineJob = {
  id: string;
  source: 'RSS' | 'Scraper' | 'API' | 'Filings';
  status: 'ok' | 'failed' | 'running';
  latencyMs: number;
  queued: number;
  timestamp: string;
};

export type ApiEndpointHealth = {
  endpoint: string;
  requestsPerMin: number;
  latencyP95: number;
  errorRate: number;
  healthy: boolean;
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  severity: Severity;
};

export type InfraMetric = {
  service: string;
  cpu: number;
  memory: number;
  status: 'healthy' | 'degraded' | 'down';
};

export type NotificationEvent = {
  id: string;
  message: string;
  source: 'system' | 'security' | 'pipeline' | 'revenue';
  severity: Severity;
  timestamp: string;
};

