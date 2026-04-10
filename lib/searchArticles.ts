import type { NewsArticle } from '@/data/newsSiteData';
import { getAllArticles } from '@/lib/catalog';

export function searchArticles(query: string, limit = 50): NewsArticle[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const pool = getAllArticles();
  const scored = pool
    .map((article) => {
      const hay = `${article.title} ${article.summary} ${article.section} ${article.author} ${article.slug}`.toLowerCase();
      if (!hay.includes(q)) return null;
      let score = 0;
      if (article.title.toLowerCase().includes(q)) score += 3;
      if (article.summary.toLowerCase().includes(q)) score += 2;
      if (article.slug.toLowerCase().includes(q)) score += 2;
      if (article.section.toLowerCase().includes(q)) score += 1;
      return { article, score };
    })
    .filter((x): x is { article: NewsArticle; score: number } => x != null)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.article);
}
