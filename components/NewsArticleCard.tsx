'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { NewsArticle } from '@/data/newsSiteData';

type Props = {
  article: NewsArticle;
  /** Global index in feed for analytics */
  listIndex: number;
};

export function NewsArticleCard({ article, listIndex }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.25) {
            window.dispatchEvent(
              new CustomEvent('analytics:article-impression', {
                detail: { slug: article.slug, section: article.section, listIndex },
              }),
            );
            obs.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: [0, 0.25, 0.5] },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [article.slug, article.section, listIndex]);

  return (
    <article ref={ref} className="news-feed-card" data-article-slug={article.slug} data-list-index={listIndex}>
      <Link href={`/article/${article.slug}`} className="news-feed-card__link">
        <div className="news-feed-card__media">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="news-feed-card__img"
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="lazy"
          />
        </div>
        <div className="news-feed-card__body">
          <span className="news-feed-card__section">{article.section}</span>
          <h2 className="news-feed-card__title">{article.title}</h2>
          <p className="news-feed-card__summary">{article.summary}</p>
          <span className="news-feed-card__meta">
            {article.author} · {article.publishedAt}
          </span>
        </div>
      </Link>
    </article>
  );
}
