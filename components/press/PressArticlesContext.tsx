'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PressArticle, PressArticleStatus } from '@/lib/press/types';
import { readArticles, writeArticles } from '@/lib/press/storage';

type Ctx = {
  articles: PressArticle[];
  ready: boolean;
  upsert: (article: PressArticle) => void;
  remove: (id: string) => void;
  setStatus: (id: string, status: PressArticleStatus) => void;
  getById: (id: string) => PressArticle | undefined;
};

const PressArticlesContext = createContext<Ctx | null>(null);

export function PressArticlesProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setArticles(readArticles());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeArticles(articles);
  }, [articles, ready]);

  const upsert = useCallback((article: PressArticle) => {
    setArticles((prev) => {
      const i = prev.findIndex((a) => a.id === article.id);
      if (i === -1) return [...prev, article];
      const next = [...prev];
      next[i] = article;
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setStatus = useCallback((id: string, status: PressArticleStatus) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const getById = useCallback(
    (id: string) => articles.find((a) => a.id === id),
    [articles],
  );

  const value = useMemo(
    () => ({ articles, ready, upsert, remove, setStatus, getById }),
    [articles, ready, upsert, remove, setStatus, getById],
  );

  return <PressArticlesContext.Provider value={value}>{children}</PressArticlesContext.Provider>;
}

export function usePressArticles() {
  const ctx = useContext(PressArticlesContext);
  if (!ctx) throw new Error('usePressArticles requires PressArticlesProvider');
  return ctx;
}
