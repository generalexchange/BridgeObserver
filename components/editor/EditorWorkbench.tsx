'use client';

import { useEffect, useMemo, useState } from 'react';
import { Group, Panel, Separator } from 'react-resizable-panels';
import {
  Activity,
  Bot,
  CheckCircle2,
  Command,
  FilePlus2,
  Filter,
  GitBranch,
  Globe,
  Link2,
  Loader2,
  Radar,
  RefreshCw,
  Send,
  Sparkles,
  Timer,
} from 'lucide-react';
import {
  aiFactCheckSignals,
  aiGenerateDraft,
  aiSuggestAngle,
  fetchAnalyticsSnapshot,
  fetchFeedBootstrap,
  fetchRelatedStories,
  openEditorStream,
} from '@/lib/editor/api';
import type { AiActionResult, AnalyticsSnapshot, ArticleDraft, FeedItem, WorkflowState } from '@/lib/editor/types';

const FALLBACK_FEED: FeedItem[] = [
  {
    id: 'f1',
    source: 'data',
    title: 'SEC 8-K: semiconductor supplier guidance revision',
    summary: 'Material event filing flagged in ingestion queue with supplier dependency references.',
    timestamp: new Date().toISOString(),
    entities: ['NVDA', 'Supply Chain', 'SEC'],
    severity: 'high',
    context: 'Ingestion parser confidence 0.93. Mentions revised FY guidance and concentration risk.',
  },
  {
    id: 'f2',
    source: 'markets',
    title: 'Abnormal options volume versus legal headline cluster',
    summary: 'Options skew shifted after legal-case briefing leak tied to mega-cap providers.',
    timestamp: new Date(Date.now() - 20 * 60_000).toISOString(),
    entities: ['Options', 'Legal Case', 'MegaCap'],
    severity: 'medium',
    context: 'Markets correlation node reports +0.61 overlap with litigation storyline cluster.',
  },
];

const FALLBACK_ANALYTICS: AnalyticsSnapshot = {
  articleViews: 128420,
  engagementMinutes: 43210,
  ctr: 6.8,
  trending: [
    { title: 'Tariff negotiation leak timeline', views: 14320, trend: 'up' },
    { title: 'Fed governor signal map', views: 11680, trend: 'up' },
    { title: 'Semiconductor litigation watch', views: 9820, trend: 'down' },
  ],
  activeTopics: [
    { topic: 'Tariffs', score: 91 },
    { topic: 'Fed', score: 84 },
    { topic: 'Semiconductors', score: 78 },
    { topic: 'Antitrust', score: 65 },
  ],
  clusters: [
    { cluster: 'Trade + FX + Election', velocity: 88, category: 'macro' },
    { cluster: 'AI chips + Export controls', velocity: 74, category: 'markets' },
    { cluster: 'Court docket + Tech policy', velocity: 66, category: 'legal' },
  ],
  marketCorrelation: [
    { entity: 'Tariff Policy', correlation: 0.72 },
    { entity: 'Rate Cut Signals', correlation: 0.61 },
    { entity: 'Antitrust Briefings', correlation: 0.49 },
  ],
};

function makeDraft(owner: string): ArticleDraft {
  const now = new Date().toISOString();
  return {
    id: 'draft-1',
    title: 'Untitled intelligence brief',
    body: '## Lead\n\nStart with verified facts from ingestion and API feeds.\n\n',
    markdown: '## Lead\n\nStart with verified facts from ingestion and API feeds.\n\n',
    status: 'draft',
    owner,
    entities: ['Federal Reserve', 'SEC', 'NVIDIA'],
    citations: [{ id: 'c1', label: 'SEC Filing Ref', url: 'https://api.bridgeobserver.com/docs/filings/8k-123' }],
    updatedAt: now,
    versions: [{ id: 'v1', timestamp: now, author: owner, note: 'Initial draft' }],
    blockComments: [],
  };
}

export function EditorWorkbench() {
  const [feed, setFeed] = useState<FeedItem[]>(FALLBACK_FEED);
  const [selectedFeedId, setSelectedFeedId] = useState<string>(FALLBACK_FEED[0]?.id ?? '');
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot>(FALLBACK_ANALYTICS);
  const [draft, setDraft] = useState<ArticleDraft>(() => makeDraft('editor@bridgeobserver.com'));
  const [assignee, setAssignee] = useState('editor@bridgeobserver.com');
  const [workflow, setWorkflow] = useState<WorkflowState>('draft');
  const [aiOutput, setAiOutput] = useState<AiActionResult | null>(null);
  const [factSignals, setFactSignals] = useState<string[]>([]);
  const [relatedStories, setRelatedStories] = useState<string[]>([]);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const selectedFeed = useMemo(() => feed.find((f) => f.id === selectedFeedId) ?? feed[0], [feed, selectedFeedId]);
  const unreadSignals = useMemo(() => feed.filter((f) => f.severity === 'high').length, [feed]);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      const [bootstrap, snapshot] = await Promise.all([fetchFeedBootstrap(), fetchAnalyticsSnapshot()]);
      if (!mounted) return;
      if (bootstrap && bootstrap.length) {
        setFeed(bootstrap);
        setSelectedFeedId(bootstrap[0]?.id ?? '');
      }
      if (snapshot) setAnalytics(snapshot);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const stop = openEditorStream(
      (item) => {
        setFeed((prev) => [item, ...prev].slice(0, 100));
      },
      () => {
        /* stream fallback is handled by mock ticker below */
      },
    );

    const timer = window.setInterval(() => {
      setFeed((prev) => [
        {
          id: `mock-${Date.now()}`,
          source: (['api', 'data', 'markets', 'ai'] as const)[Math.floor(Math.random() * 4)] ?? 'api',
          title: 'Mock newsroom signal update',
          summary: 'Fallback stream item generated locally while waiting for live bridge channels.',
          timestamp: new Date().toISOString(),
          entities: ['Policy', 'Market', 'Legal'].slice(0, 2 + Math.floor(Math.random() * 2)),
          severity: (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)] ?? 'medium',
          context: 'Synthetic realtime event for workstation continuity.',
        },
        ...prev,
      ].slice(0, 100));
      setAnalytics((a) => ({
        ...a,
        articleViews: a.articleViews + 5 + Math.floor(Math.random() * 12),
        engagementMinutes: a.engagementMinutes + 2 + Math.floor(Math.random() * 6),
        ctr: Math.max(1, +(a.ctr + (Math.random() - 0.5) * 0.2).toFixed(2)),
      }));
    }, 6500);

    return () => {
      stop();
      window.clearInterval(timer);
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

  useEffect(() => {
    if (!selectedFeed?.entities?.[0]) return;
    void (async () => {
      const related = await fetchRelatedStories(selectedFeed.entities[0]);
      if (related?.length) setRelatedStories(related);
      else
        setRelatedStories([
          'Cross-border supply shock timeline',
          'Legal memo leak and market volatility',
          'Entity ownership map updated this hour',
        ]);
    })();
  }, [selectedFeed?.id, selectedFeed?.entities]);

  const runAi = async (action: 'generate' | 'angle' | 'fact') => {
    if (!selectedFeed) return;
    setLoadingAi(true);
    try {
      if (action === 'generate') {
        const out =
          (await aiGenerateDraft({ title: selectedFeed.title, context: selectedFeed.context })) ?? {
            title: `Draft: ${selectedFeed.title}`,
            content: `${selectedFeed.summary}\n\n${selectedFeed.context}`,
            bullets: ['Entity map attached', 'Requires legal pass', 'Cross-check with filings'],
          };
        setAiOutput(out);
        setDraft((d) => ({ ...d, title: out.title, body: out.content, markdown: out.content, updatedAt: new Date().toISOString() }));
      } else if (action === 'angle') {
        const out =
          (await aiSuggestAngle({ title: selectedFeed.title, context: selectedFeed.context })) ?? {
            title: 'Suggested angles',
            content: '1) Regulatory implications\n2) Market reaction timing\n3) Cross-entity exposure',
            bullets: ['Lead with impact', 'Use timeline framing', 'Tie back to entities'],
          };
        setAiOutput(out);
      } else {
        const signals = (await aiFactCheckSignals({ body: draft.body })) ?? [
          'Citation #2 missing source provenance',
          'Entity alias mismatch on paragraph 3',
          'Market-impact claim needs timestamp anchor',
        ];
        setFactSignals(signals);
      }
    } finally {
      setLoadingAi(false);
    }
  };

  const commands = [
    { id: 'new', label: 'New draft', run: () => setDraft(makeDraft(assignee)) },
    { id: 'review', label: 'Set workflow: Editor Review', run: () => setWorkflow('review') },
    { id: 'legal', label: 'Set workflow: Legal / Fact Check', run: () => setWorkflow('legal') },
    { id: 'approve', label: 'Set workflow: Approved', run: () => setWorkflow('approved') },
    { id: 'publish', label: 'Set workflow: Published', run: () => setWorkflow('published') },
    { id: 'draftFromFeed', label: 'Generate Draft from selected feed item', run: () => void runAi('generate') },
  ];
  const filteredCommands = commands.filter((c) => c.label.toLowerCase().includes(cmdQuery.trim().toLowerCase()));

  return (
    <div className="editor-root">
      <header className="editor-head">
        <div>
          <p className="editor-head__eyebrow">Bridge Observer Intelligence</p>
          <h1>Editor Workbench</h1>
        </div>
        <div className="editor-head__actions">
          <span className="editor-pill">
            <Activity size={14} /> {unreadSignals} high-priority signals
          </span>
          <button type="button" className="editor-btn" onClick={() => setCmdOpen(true)}>
            <Command size={14} /> Command palette
          </button>
          <button type="button" className="editor-btn" onClick={() => void runAi('generate')}>
            <Sparkles size={14} /> Generate Draft
          </button>
        </div>
      </header>

      <Group className="editor-grid" orientation="horizontal">
        <Panel defaultSize={20} minSize={14}>
          <section className="editor-panel">
            <div className="editor-panel__head">
              <h2>
                <Radar size={14} /> Live Feed
              </h2>
              <button type="button" className="editor-link">
                <Filter size={13} /> Filter
              </button>
            </div>
            <div className="editor-feed">
              {feed.map((item) => (
                <button
                  key={item.id}
                  className={`editor-feed__item${selectedFeedId === item.id ? ' is-active' : ''}`}
                  type="button"
                  onClick={() => setSelectedFeedId(item.id)}
                >
                  <p className="editor-feed__meta">
                    <span>{item.source.toUpperCase()}</span>
                    <time dateTime={item.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</time>
                  </p>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                  <div className="editor-feed__tags">
                    {item.entities.map((e) => (
                      <span key={`${item.id}-${e}`}>{e}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </Panel>

        <Separator className="editor-sep" />

        <Panel defaultSize={40} minSize={26}>
          <section className="editor-panel editor-panel--canvas">
            <div className="editor-panel__head">
              <h2>
                <FilePlus2 size={14} /> Article Workspace
              </h2>
              <div className="editor-workflow">
                {(['draft', 'review', 'legal', 'approved', 'published'] as const).map((state) => (
                  <button
                    key={state}
                    type="button"
                    className={`editor-workflow__chip${workflow === state ? ' is-active' : ''}`}
                    onClick={() => setWorkflow(state)}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
            <input
              className="editor-title"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value, updatedAt: new Date().toISOString() }))}
              placeholder="Headline"
            />
            <textarea
              className="editor-body"
              value={draft.body}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value, markdown: e.target.value, updatedAt: new Date().toISOString() }))}
            />
            <div className="editor-canvas-meta">
              <label>
                Assignment
                <input value={assignee} onChange={(e) => setAssignee(e.target.value)} />
              </label>
              <label>
                Entities
                <input
                  value={draft.entities.join(', ')}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, entities: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) }))
                  }
                />
              </label>
              <label>
                Citation URL
                <input
                  value={draft.citations[0]?.url ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      citations: [{ id: 'c1', label: 'Source', url: e.target.value }],
                    }))
                  }
                />
              </label>
            </div>
            <div className="editor-canvas-foot">
              <span>
                <Link2 size={13} /> {draft.citations.length} citations
              </span>
              <span>
                <GitBranch size={13} /> {draft.versions.length} versions
              </span>
              <span>
                <Timer size={13} /> updated {new Date(draft.updatedAt).toLocaleTimeString()}
              </span>
            </div>
          </section>
        </Panel>

        <Separator className="editor-sep" />

        <Panel defaultSize={20} minSize={14}>
          <section className="editor-panel">
            <div className="editor-panel__head">
              <h2>
                <Bot size={14} /> AI Assistant
              </h2>
            </div>
            <div className="editor-ai-actions">
              <button type="button" className="editor-btn editor-btn--full" onClick={() => void runAi('generate')}>
                Generate Draft
              </button>
              <button type="button" className="editor-btn editor-btn--full" onClick={() => void runAi('angle')}>
                Suggest Angle
              </button>
              <button type="button" className="editor-btn editor-btn--full" onClick={() => void runAi('fact')}>
                Fact Check Signals
              </button>
            </div>
            {loadingAi ? (
              <p className="editor-loading">
                <Loader2 size={14} className="spin" /> Running model...
              </p>
            ) : null}
            {aiOutput ? (
              <article className="editor-ai-result">
                <h3>{aiOutput.title}</h3>
                <p>{aiOutput.content}</p>
                <ul>
                  {aiOutput.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            {factSignals.length ? (
              <article className="editor-ai-result">
                <h3>Fact Check Signals</h3>
                <ul>
                  {factSignals.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            <article className="editor-ai-result">
              <h3>Related Stories</h3>
              <ul>
                {relatedStories.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </article>
          </section>
        </Panel>

        <Separator className="editor-sep" />

        <Panel defaultSize={20} minSize={14}>
          <section className="editor-panel">
            <div className="editor-panel__head">
              <h2>
                <Globe size={14} /> Analytics + Graph
              </h2>
              <button type="button" className="editor-link" onClick={() => setAnalytics({ ...analytics })}>
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
            <div className="editor-metrics">
              <div>
                <span>Views</span>
                <strong>{analytics.articleViews.toLocaleString()}</strong>
              </div>
              <div>
                <span>Engagement</span>
                <strong>{analytics.engagementMinutes.toLocaleString()}m</strong>
              </div>
              <div>
                <span>CTR</span>
                <strong>{analytics.ctr.toFixed(2)}%</strong>
              </div>
            </div>
            <h3 className="editor-subhead">Trending Articles</h3>
            <ul className="editor-mini-list">
              {analytics.trending.map((t) => (
                <li key={t.title}>
                  <p>{t.title}</p>
                  <span className={t.trend === 'up' ? 'up' : 'down'}>
                    {t.views.toLocaleString()} · {t.trend}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="editor-subhead">Entity Knowledge Graph</h3>
            <div className="editor-graph">
              {draft.entities.map((e, i) => (
                <button key={e} type="button" style={{ left: `${10 + (i % 2) * 45}%`, top: `${12 + i * 18}%` }}>
                  {e}
                </button>
              ))}
              <span className="edge edge-a" />
              <span className="edge edge-b" />
              <span className="edge edge-c" />
            </div>
            <h3 className="editor-subhead">Workflow Engine</h3>
            <p className="editor-workflow-note">
              Owner: {assignee} · Stage: {workflow} · Last transition via command palette or chip.
            </p>
            <button type="button" className="editor-btn editor-btn--full">
              <CheckCircle2 size={14} /> Publish to press.bridgeobserver.com
            </button>
          </section>
        </Panel>
      </Group>

      {selectedFeed ? (
        <footer className="editor-context">
          <p>
            <strong>{selectedFeed.title}</strong> — {selectedFeed.context}
          </p>
          <button type="button" className="editor-btn" onClick={() => void runAi('generate')}>
            <Send size={14} /> Convert to article
          </button>
        </footer>
      ) : null}

      {cmdOpen ? (
        <div className="editor-cmd" role="dialog" aria-label="Command palette">
          <div className="editor-cmd__panel">
            <input
              autoFocus
              placeholder="Type a command..."
              value={cmdQuery}
              onChange={(e) => setCmdQuery(e.target.value)}
            />
            <ul>
              {filteredCommands.map((c) => (
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
            <button type="button" className="editor-cmd__close" onClick={() => setCmdOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
