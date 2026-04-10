'use client';

import { useMemo } from 'react';
import { PressArticleCard } from '@/components/press/PressArticleCard';
import { PressDashboardAnalytics } from '@/components/press/PressDashboardAnalytics';
import { PressShell } from '@/components/press/PressShell';
import { RequirePressAuth } from '@/components/press/RequirePressAuth';
import { usePressArticles } from '@/components/press/PressArticlesContext';
import { usePressAuth } from '@/components/press/PressAuthContext';
import type { PressArticle } from '@/lib/press/types';

function bucket(a: PressArticle): 'drafts' | 'submitted' | 'published' {
  if (a.status === 'approved') return 'published';
  if (a.status === 'submitted') return 'submitted';
  return 'drafts';
}

function deskGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function PressDashboardPage() {
  const { articles } = usePressArticles();
  const { session } = usePressAuth();

  const mine = useMemo(
    () => articles.filter((a) => a.author === session?.email),
    [articles, session?.email],
  );

  const drafts = mine.filter((a) => bucket(a) === 'drafts');
  const submitted = mine.filter((a) => bucket(a) === 'submitted');
  const published = mine.filter((a) => bucket(a) === 'published');

  const dateLine = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <RequirePressAuth>
      <PressShell>
        <div className="press-page press-page--dashboard">
          <header className="press-page__hero press-page__hero--dashboard">
            <p className="press-page__eyebrow">{dateLine}</p>
            <h1 className="press-page__h1">
              {deskGreeting()}, {session?.email?.split('@')[0] ?? 'reporter'}
            </h1>
            <p className="press-page__lede">
              Your assignments and filing status at a glance — with desk analytics so you can see your pipeline and the room at once.
            </p>
          </header>

          <PressDashboardAnalytics allArticles={articles} mine={mine} />

          <section className="press-section" aria-labelledby="drafts-heading">
            <h2 id="drafts-heading" className="press-section__title">
              Drafts
            </h2>
            <div className="press-grid">
              {drafts.length === 0 ? <p className="press-empty">No drafts yet.</p> : drafts.map((a) => <PressArticleCard key={a.id} article={a} />)}
            </div>
          </section>

          <section className="press-section" aria-labelledby="submitted-heading">
            <h2 id="submitted-heading" className="press-section__title">
              Submitted
            </h2>
            <div className="press-grid">
              {submitted.length === 0 ? (
                <p className="press-empty">Nothing in review.</p>
              ) : (
                submitted.map((a) => <PressArticleCard key={a.id} article={a} />)
              )}
            </div>
          </section>

          <section className="press-section" aria-labelledby="published-heading">
            <h2 id="published-heading" className="press-section__title">
              Published
            </h2>
            <div className="press-grid">
              {published.length === 0 ? (
                <p className="press-empty">No published pieces yet.</p>
              ) : (
                published.map((a) => <PressArticleCard key={a.id} article={a} />)
              )}
            </div>
          </section>
        </div>
      </PressShell>
    </RequirePressAuth>
  );
}
