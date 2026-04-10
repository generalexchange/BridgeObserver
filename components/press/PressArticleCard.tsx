'use client';

import Link from 'next/link';
import type { PressArticle } from '@/lib/press/types';
import { usePressHref } from '@/lib/press/paths';

const statusLabel: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  approved: 'Published',
  rejected: 'Draft',
};

export function PressArticleCard({ article }: { article: PressArticle }) {
  const edit = usePressHref('/editor', `id=${encodeURIComponent(article.id)}`);

  return (
    <article className="press-card">
      <div className="press-card__media">
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image} alt="" className="press-card__img" />
        ) : (
          <div className="press-card__placeholder">No image</div>
        )}
        <span className={`press-card__pill press-card__pill--${article.status}`}>
          {article.status === 'approved' ? 'Published' : statusLabel[article.status] ?? article.status}
        </span>
      </div>
      <div className="press-card__body">
        <p className="press-card__category">{article.category}</p>
        <h3 className="press-card__headline">{article.title || 'Untitled'}</h3>
        {article.subtitle ? <p className="press-card__subtitle">{article.subtitle}</p> : null}
        <p className="press-card__meta">
          {article.author} · {new Date(article.createdAt).toLocaleString()}
        </p>
        <Link href={edit} className="press-card__cta">
          Open in editor
        </Link>
      </div>
    </article>
  );
}
