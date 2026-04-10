'use client';

import { useMemo } from 'react';
import { BarChart3, Clock, FileStack, Inbox, PenTool, TrendingUp, Users } from 'lucide-react';
import type { PressArticle } from '@/lib/press/types';
import { navSections, type NewsSection } from '@/data/newsSiteData';

function bucket(a: PressArticle): 'drafts' | 'submitted' | 'published' {
  if (a.status === 'approved') return 'published';
  if (a.status === 'submitted') return 'submitted';
  return 'drafts';
}

function wordCount(htmlOrText: string): number {
  return htmlOrText
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function withinDays(iso: string, days: number): boolean {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return Date.now() - t <= days * 24 * 60 * 60 * 1000;
}

type Props = {
  allArticles: PressArticle[];
  mine: PressArticle[];
};

export function PressDashboardAnalytics({ allArticles, mine }: Props) {
  const deskSubmitted = useMemo(() => allArticles.filter((a) => a.status === 'submitted').length, [allArticles]);
  const deskPublished = useMemo(() => allArticles.filter((a) => a.status === 'approved').length, [allArticles]);
  const uniqueAuthors = useMemo(() => new Set(allArticles.map((a) => a.author)).size, [allArticles]);

  const myDrafts = mine.filter((a) => bucket(a) === 'drafts');
  const mySubmitted = mine.filter((a) => bucket(a) === 'submitted');
  const myPublished = mine.filter((a) => bucket(a) === 'published');

  const myWordsDraft = useMemo(() => myDrafts.reduce((n, a) => n + wordCount(a.content), 0), [myDrafts]);
  const myRecent = useMemo(() => mine.filter((a) => withinDays(a.createdAt, 7)).length, [mine]);
  const myReadMinPublished = useMemo(
    () => Math.round(myPublished.reduce((n, a) => n + wordCount(a.content), 0) / 200),
    [myPublished],
  );

  const categoryRows = useMemo(() => {
    const counts: Partial<Record<NewsSection, number>> = {};
    for (const a of mine) {
      counts[a.category] = (counts[a.category] ?? 0) + 1;
    }
    const max = Math.max(1, ...navSections.map((s) => counts[s] ?? 0));
    return navSections.map((section) => ({
      section,
      count: counts[section] ?? 0,
      pct: ((counts[section] ?? 0) / max) * 100,
    }));
  }, [mine]);

  return (
    <section className="press-analytics" aria-labelledby="press-analytics-heading">
      <div className="press-analytics__head">
        <h2 id="press-analytics-heading" className="press-analytics__title">
          <BarChart3 size={18} strokeWidth={2} aria-hidden className="press-analytics__title-icon" />
          Desk analytics
        </h2>
        <p className="press-analytics__sub">Snapshot from your filings and the shared CMS — all local, updates as you work.</p>
      </div>

      <div className="press-analytics__kpis">
        <article className="press-kpi">
          <PenTool size={18} strokeWidth={2} aria-hidden className="press-kpi__icon" />
          <span className="press-kpi__label">Your drafts</span>
          <strong className="press-kpi__value">{myDrafts.length}</strong>
          <span className="press-kpi__hint">{myWordsDraft.toLocaleString()} words in progress</span>
        </article>
        <article className="press-kpi">
          <Inbox size={18} strokeWidth={2} aria-hidden className="press-kpi__icon" />
          <span className="press-kpi__label">In review</span>
          <strong className="press-kpi__value">{mySubmitted.length}</strong>
          <span className="press-kpi__hint">{deskSubmitted} total on desk</span>
        </article>
        <article className="press-kpi">
          <FileStack size={18} strokeWidth={2} aria-hidden className="press-kpi__icon" />
          <span className="press-kpi__label">Published</span>
          <strong className="press-kpi__value">{myPublished.length}</strong>
          <span className="press-kpi__hint">~{myReadMinPublished} min read est.</span>
        </article>
        <article className="press-kpi">
          <TrendingUp size={18} strokeWidth={2} aria-hidden className="press-kpi__icon" />
          <span className="press-kpi__label">Last 7 days</span>
          <strong className="press-kpi__value">{myRecent}</strong>
          <span className="press-kpi__hint">new filings (by created date)</span>
        </article>
      </div>

      <div className="press-analytics__row">
        <div className="press-analytics__panel press-analytics__panel--chart">
          <h3 className="press-analytics__panel-title">Your beats</h3>
          <p className="press-analytics__panel-lede">Story count by section</p>
          <ul className="press-beat-chart" aria-label="Stories by section">
            {categoryRows.map(({ section, count, pct }) => (
              <li key={section} className="press-beat-chart__row">
                <span className="press-beat-chart__label">{section}</span>
                <div className="press-beat-chart__track" role="presentation">
                  <span className="press-beat-chart__fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="press-beat-chart__count">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="press-analytics__panel press-analytics__panel--desk">
          <h3 className="press-analytics__panel-title">Newsroom desk</h3>
          <p className="press-analytics__panel-lede">Everyone on this browser&apos;s CMS</p>
          <ul className="press-desk-stats">
            <li>
              <Users size={16} aria-hidden />
              <span>Active bylines</span>
              <strong>{uniqueAuthors}</strong>
            </li>
            <li>
              <FileStack size={16} aria-hidden />
              <span>Stories in CMS</span>
              <strong>{allArticles.length}</strong>
            </li>
            <li>
              <Inbox size={16} aria-hidden />
              <span>Awaiting edit</span>
              <strong>{deskSubmitted}</strong>
            </li>
            <li>
              <Clock size={16} aria-hidden />
              <span>Live approved</span>
              <strong>{deskPublished}</strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
