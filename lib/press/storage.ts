import type { PressArticle, PressSession } from '@/lib/press/types';
import { PRESS_ARTICLES_KEY, PRESS_SESSION_KEY } from '@/lib/press/types';

export function readSession(): PressSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PRESS_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PressSession;
  } catch {
    return null;
  }
}

export function writeSession(session: PressSession | null): void {
  if (typeof window === 'undefined') return;
  if (!session) localStorage.removeItem(PRESS_SESSION_KEY);
  else localStorage.setItem(PRESS_SESSION_KEY, JSON.stringify(session));
}

export function readArticles(): PressArticle[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PRESS_ARTICLES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PressArticle[];
  } catch {
    return [];
  }
}

export function writeArticles(articles: PressArticle[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRESS_ARTICLES_KEY, JSON.stringify(articles));
}
