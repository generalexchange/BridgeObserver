import type { NewsSection } from '@/data/newsSiteData';

export type PressArticleStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export type PressArticle = {
  id: string;
  title: string;
  subtitle: string;
  category: NewsSection;
  image: string;
  content: string;
  status: PressArticleStatus;
  author: string;
  createdAt: string;
};

export type PressSession = {
  email: string;
  loggedInAt: string;
};

export const PRESS_SESSION_KEY = 'bridge_press_session';
export const PRESS_ARTICLES_KEY = 'bridge_press_articles';
