'use client';

import { useEffect, useMemo, useState } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  Blocks,
  Brain,
  Command,
  Cpu,
  Database,
  KeyRound,
  LineChart,
  RefreshCw,
  Server,
  Shield,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  getApiHealth,
  getAuditLogs,
  getGlobalKpis,
  getInfraMetrics,
  getPipelineJobs,
  getRevenueMetrics,
  getUsers,
  openAdminStream,
} from '@/lib/admin/api';
import type {
  AdminModuleId,
  ApiEndpointHealth,
  AuditLog,
  InfraMetric,
  Kpi,
  NotificationEvent,
  PipelineJob,
  RevenueMetrics,
  UserRecord,
} from '@/lib/admin/types';

const KPI_FALLBACK: Kpi[] = [
  { id: 'users', label: 'Total Users', value: '84,210', delta: '+2.8%', trend: 'up' },
  { id: 'sessions', label: 'Active Sessions', value: '1,842', delta: '+4.1%', trend: 'up' },
  { id: 'articles', label: 'Articles Today', value: '128', delta: '+11', trend: 'up' },
  { id: 'throughput', label: 'Ingestion / min', value: '2,418', delta: '-2.1%', trend: 'down' },
  { id: 'latency', label: 'API P95', value: '286ms', delta: '+18ms', trend: 'down' },
  { id: 'errors', label: 'Error Rate', value: '0.42%', delta: '-0.08%', trend: 'up' },
  { id: 'revenue', label: 'Revenue Today', value: '$41,280', delta: '+6.3%', trend: 'up' },
  { id: 'arr', label: 'ARR', value: '$4.82M', delta: '+2.2%', trend: 'up' },
];

const REV_FALLBACK: RevenueMetrics = {
  mrr: 401200,
  arr: 4_820_000,
  churn: 2.4,
  ltv: 18400,
  arpu: 92,
  conversions: 4.8,
};

const USERS_FALLBACK: UserRecord[] = [
  { id: 'u1', email: 'chief@bridgeobserver.com', role: 'Editor-in-Chief', lastSeen: new Date().toISOString(), active: true },
  { id: 'u2', email: 'ops@bridgeobserver.com', role: 'Admin', lastSeen: new Date().toISOString(), active: true },
  { id: 'u3', email: 'legal@bridgeobserver.com', role: 'Analyst', lastSeen: new Date(Date.now() - 35 * 60_000).toISOString(), active: false },
  { id: 'u4', email: 'api-client@fund.io', role: 'API Consumer', lastSeen: new Date(Date.now() - 10 * 60_000).toISOString(), active: true },
];

const PIPE_FALLBACK: PipelineJob[] = [
  { id: 'j1', source: 'Filings', status: 'running', latencyMs: 412, queued: 21, timestamp: new Date().toISOString() },
  { id: 'j2', source: 'Scraper', status: 'ok', latencyMs: 232, queued: 8, timestamp: new Date().toISOString() },
  { id: 'j3', source: 'RSS', status: 'failed', latencyMs: 1210, queued: 57, timestamp: new Date().toISOString() },
];

const API_FALLBACK: ApiEndpointHealth[] = [
  { endpoint: '/content/publish', requestsPerMin: 248, latencyP95: 332, errorRate: 0.7, healthy: true },
  { endpoint: '/analytics/stream', requestsPerMin: 412, latencyP95: 288, errorRate: 0.4, healthy: true },
  { endpoint: '/billing/usage', requestsPerMin: 96, latencyP95: 401, errorRate: 1.2, healthy: false },
];

const AUDIT_FALLBACK: AuditLog[] = [
  { id: 'a1', actor: 'ops@bridgeobserver.com', action: 'role_override', target: 'u4', timestamp: new Date().toISOString(), severity: 'warn' },
  { id: 'a2', actor: 'chief@bridgeobserver.com', action: 'publish_override', target: 'story-1229', timestamp: new Date().toISOString(), severity: 'info' },
  { id: 'a3', actor: 'api-gateway', action: 'rate_limit_trigger', target: 'key_9f2e', timestamp: new Date().toISOString(), severity: 'critical' },
];

const INFRA_FALLBACK: InfraMetric[] = [
  { service: 'api pods', cpu: 62, memory: 71, status: 'healthy' },
  { service: 'postgres', cpu: 74, memory: 82, status: 'degraded' },
  { service: 'redis queues', cpu: 39, memory: 57, status: 'healthy' },
  { service: 'workers', cpu: 88, memory: 91, status: 'degraded' },
];

const MODULES: { id: AdminModuleId; label: string; icon: LucideIcon }[] = [
  { id: 'overview', label: 'System', icon: Activity },
  { id: 'revenue', label: 'Revenue', icon: BadgeDollarSign },
  { id: 'editorial', label: 'Editorial', icon: LineChart },
  { id: 'pipeline', label: 'Data', icon: Database },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API', icon: Server },
  { id: 'health', label: 'Health', icon: Cpu },
  { id: 'intelligence', label: 'Intelligence', icon: Brain },
];

type PaletteCommand = { id: string; label: string; run: () => void };

export function AdminControlCenter() {
  const [activeModule, setActiveModule] = useState<AdminModuleId>('overview');
  const [kpis, setKpis] = useState<Kpi[]>(KPI_FALLBACK);
  const [revenue, setRevenue] = useState<RevenueMetrics>(REV_FALLBACK);
  const [users, setUsers] = useState<UserRecord[]>(USERS_FALLBACK);
  const [pipelineJobs, setPipelineJobs] = useState<PipelineJob[]>(PIPE_FALLBACK);
  const [apiHealth, setApiHealth] = useState<ApiEndpointHealth[]>(API_FALLBACK);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(AUDIT_FALLBACK);
  const [infra, setInfra] = useState<InfraMetric[]>(INFRA_FALLBACK);
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');

  useEffect(() => {
    void (async () => {
      const [k, r, u, p, a, logs, i] = await Promise.all([
        getGlobalKpis(),
        getRevenueMetrics(),
        getUsers(),
        getPipelineJobs(),
        getApiHealth(),
        getAuditLogs(),
        getInfraMetrics(),
      ]);
      if (k?.length) setKpis(k);
      if (r) setRevenue(r);
      if (u?.length) setUsers(u);
      if (p?.length) setPipelineJobs(p);
      if (a?.length) setApiHealth(a);
      if (logs?.length) setAuditLogs(logs);
      if (i?.length) setInfra(i);
    })();
  }, []);

  useEffect(() => {
    const close = openAdminStream((ev) => setEvents((prev) => [ev, ...prev].slice(0, 100)));
    const tick = window.setInterval(() => {
      setKpis((prev) =>
        prev.map((k) =>
          k.id === 'sessions'
            ? { ...k, value: `${Math.max(500, Number(k.value.replace(/[^0-9]/g, '')) + Math.floor(Math.random() * 20 - 10)).toLocaleString()}` }
            : k,
        ),
      );
      setPipelineJobs((prev) =>
        prev.map((j) => ({
          ...j,
          latencyMs: Math.max(120, j.latencyMs + Math.floor(Math.random() * 80 - 40)),
          queued: Math.max(0, j.queued + Math.floor(Math.random() * 10 - 4)),
          timestamp: new Date().toISOString(),
        })),
      );
    }, 5000);
    return () => {
      close();
      window.clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const commands: PaletteCommand[] = [
    ...MODULES.map((m) => ({
      id: m.id,
      label: `Go to ${m.label}`,
      run: () => setActiveModule(m.id),
    })),
    {
      id: 'retry-pipeline',
      label: 'Retry failed ingestion jobs',
      run: () =>
        setPipelineJobs((p) =>
          p.map((j) => (j.status === 'failed' ? { ...j, status: 'running', latencyMs: 440, queued: Math.max(0, j.queued - 10) } : j)),
        ),
    },
    {
      id: 'mark-critical',
      label: 'Escalate latest critical audit event',
      run: () =>
        setEvents((e) => [
          {
            id: `ev-${Date.now()}`,
            message: 'Critical security escalation created by admin command',
            source: 'security',
            severity: 'critical',
            timestamp: new Date().toISOString(),
          },
          ...e,
        ]),
    },
  ];
  const visibleCommands = commands.filter((c) => c.label.toLowerCase().includes(cmdQuery.toLowerCase()));

  const activeUsers = useMemo(() => users.filter((u) => u.active).length, [users]);
  const criticalAudits = useMemo(() => auditLogs.filter((a) => a.severity === 'critical').length, [auditLogs]);

  return (
    <div className="admin-root">
      <header className="admin-head">
        <div>
          <p className="admin-eyebrow">Bridge Observer Operational Intelligence</p>
          <h1>Administrative Control Center</h1>
        </div>
        <div className="admin-head__actions">
          <button type="button" className="admin-btn" onClick={() => setCmdOpen(true)}>
            <Command size={14} /> Cmd+K
          </button>
          <button type="button" className="admin-btn">
            <RefreshCw size={14} /> Sync
          </button>
          <span className="admin-pill">
            <AlertTriangle size={14} /> {criticalAudits} critical alerts
          </span>
        </div>
      </header>

      <nav className="admin-tabs">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <button key={m.id} type="button" className={activeModule === m.id ? 'is-active' : ''} onClick={() => setActiveModule(m.id)}>
              <Icon size={14} /> {m.label}
            </button>
          );
        })}
      </nav>

      <section className="admin-kpis">
        {kpis.map((k) => (
          <article key={k.id} className="admin-kpi">
            <span>{k.label}</span>
            <strong>{k.value}</strong>
            <em className={k.trend === 'up' ? 'up' : k.trend === 'down' ? 'down' : ''}>{k.delta}</em>
          </article>
        ))}
      </section>

      <Group className="admin-grid" orientation="horizontal">
        <Panel defaultSize={30} minSize={22}>
          <section className="admin-panel">
            <div className="admin-panel__head">
              <h2>
                <Blocks size={14} /> Pipeline + Infra
              </h2>
            </div>
            <h3>Data Pipeline Monitor</h3>
            <ul className="admin-list">
              {pipelineJobs.map((j) => (
                <li key={j.id}>
                  <p>
                    {j.source} · {j.status}
                  </p>
                  <span>{j.latencyMs}ms · q:{j.queued}</span>
                </li>
              ))}
            </ul>
            <div className="admin-actions">
              <button
                type="button"
                className="admin-btn admin-btn--full"
                onClick={() =>
                  setPipelineJobs((p) => p.map((j) => (j.status === 'failed' ? { ...j, status: 'running' } : j)))
                }
              >
                Retry failed jobs
              </button>
              <button type="button" className="admin-btn admin-btn--full">
                Replay pipeline window
              </button>
            </div>

            <h3>System Health</h3>
            <ul className="admin-list">
              {infra.map((m) => (
                <li key={m.service}>
                  <p>{m.service}</p>
                  <span>
                    CPU {m.cpu}% · MEM {m.memory}% · {m.status}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Panel>

        <Separator className="admin-sep" />

        <Panel defaultSize={40} minSize={30}>
          <section className="admin-panel">
            <div className="admin-panel__head">
              <h2>
                <LineChart size={14} /> Revenue + Editorial Intelligence
              </h2>
            </div>
            <div className="admin-metrics-grid">
              <article>
                <span>MRR</span>
                <strong>${revenue.mrr.toLocaleString()}</strong>
              </article>
              <article>
                <span>ARR</span>
                <strong>${revenue.arr.toLocaleString()}</strong>
              </article>
              <article>
                <span>Churn</span>
                <strong>{revenue.churn}%</strong>
              </article>
              <article>
                <span>LTV</span>
                <strong>${revenue.ltv.toLocaleString()}</strong>
              </article>
              <article>
                <span>ARPU</span>
                <strong>${revenue.arpu}</strong>
              </article>
              <article>
                <span>Conversion</span>
                <strong>{revenue.conversions}%</strong>
              </article>
            </div>
            <h3>Editorial + Intelligence Signals</h3>
            <ul className="admin-list">
              <li>
                <p>Top story velocity</p>
                <span>Tariff clusters + markets correlation rising</span>
              </li>
              <li>
                <p>Writer performance</p>
                <span>Median draft→publish: 84 min (improved 9%)</span>
              </li>
              <li>
                <p>Entity frequency</p>
                <span>Fed, SEC, antitrust, semiconductor supply chain</span>
              </li>
            </ul>
            <div className="admin-actions">
              <button type="button" className="admin-btn admin-btn--full">
                Manage pricing plans
              </button>
              <button type="button" className="admin-btn admin-btn--full">
                Generate invoices
              </button>
            </div>
          </section>
        </Panel>

        <Separator className="admin-sep" />

        <Panel defaultSize={30} minSize={22}>
          <section className="admin-panel">
            <div className="admin-panel__head">
              <h2>
                <Shield size={14} /> Users + Security + API
              </h2>
            </div>
            <h3>
              Users & RBAC <em>{activeUsers} active</em>
            </h3>
            <ul className="admin-list">
              {users.slice(0, 6).map((u) => (
                <li key={u.id}>
                  <p>{u.email}</p>
                  <span>
                    {u.role} · {u.active ? 'active' : 'idle'}
                  </span>
                </li>
              ))}
            </ul>
            <div className="admin-actions">
              <button type="button" className="admin-btn admin-btn--full">
                <Users size={14} /> Manage users
              </button>
              <button type="button" className="admin-btn admin-btn--full">
                <KeyRound size={14} /> API key policies
              </button>
            </div>

            <h3>API Observability</h3>
            <ul className="admin-list">
              {apiHealth.map((a) => (
                <li key={a.endpoint}>
                  <p>{a.endpoint}</p>
                  <span>
                    {a.requestsPerMin}/m · p95 {a.latencyP95}ms · {a.errorRate}% errors
                  </span>
                </li>
              ))}
            </ul>

            <h3>Security + Audit</h3>
            <ul className="admin-list">
              {auditLogs.map((a) => (
                <li key={a.id}>
                  <p>{a.action}</p>
                  <span>
                    {a.actor} → {a.target}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Panel>
      </Group>

      <footer className="admin-events">
        <h2>Live Alerts / Events</h2>
        <ul>
          {events.slice(0, 10).map((e) => (
            <li key={e.id} className={`sev-${e.severity}`}>
              <span>{e.source}</span>
              <p>{e.message}</p>
              <time dateTime={e.timestamp}>{new Date(e.timestamp).toLocaleTimeString()}</time>
            </li>
          ))}
          {events.length === 0 ? <li className="sev-info">No live events yet.</li> : null}
        </ul>
      </footer>

      {cmdOpen ? (
        <div className="admin-cmd" role="dialog" aria-label="Command palette">
          <div className="admin-cmd__panel">
            <input value={cmdQuery} onChange={(e) => setCmdQuery(e.target.value)} placeholder="Type command..." autoFocus />
            <ul>
              {visibleCommands.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      c.run();
                      setCmdOpen(false);
                      setCmdQuery('');
                    }}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="admin-btn" onClick={() => setCmdOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

