'use client';

import { useMemo } from 'react';
import { PressArticleCard } from '@/components/press/PressArticleCard';
import { PressShell } from '@/components/press/PressShell';
import { RequirePressAuth } from '@/components/press/RequirePressAuth';
import { usePressArticles } from '@/components/press/PressArticlesContext';
import { usePressAuth } from '@/components/press/PressAuthContext';

export function PressArticlesListPage() {
  const { articles } = usePressArticles();
  const { session } = usePressAuth();

  const mine = useMemo(
    () => [...articles.filter((a) => a.author === session?.email)].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [articles, session?.email],
  );

  return (
    <RequirePressAuth>
      <PressShell>
        <div className="press-page">
          <header className="press-page__hero">
            <h1 className="press-page__h1">My Articles</h1>
            <p className="press-page__lede">Everything you have filed in the press system.</p>
          </header>
          <div className="press-grid">
            {mine.length === 0 ? <p className="press-empty">Start with New Article to create your first story.</p> : mine.map((a) => <PressArticleCard key={a.id} article={a} />)}
          </div>
        </div>
      </PressShell>
    </RequirePressAuth>
  );
}
