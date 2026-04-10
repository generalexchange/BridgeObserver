import type { NewsArticle } from '@/data/newsSiteData';
import { absoluteUrl, publishedStringToIso, SITE_NAME } from '@/lib/seo';

type Props = {
  article: NewsArticle;
};

export function ArticleJsonLd({ article }: Props) {
  const url = absoluteUrl(`/article/${article.slug}`);
  const iso = publishedStringToIso(article.publishedAt);

  const payload = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.imageUrl],
    ...(iso ? { datePublished: iso, dateModified: iso } : {}),
    author: { '@type': 'Person', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: article.section,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }} />;
}
