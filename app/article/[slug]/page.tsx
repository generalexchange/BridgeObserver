import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Facebook, Linkedin, MessageCircle, Share2, Twitter } from 'lucide-react';
import { ArticleJsonLd } from '@/components/ArticleJsonLd';
import { SiteFooter } from '@/components/SiteFooter';
import { SitePrimaryNav } from '@/components/SitePrimaryNav';
import { getAllArticles, getArticleBySlug } from '@/lib/catalog';
import { absoluteUrl, publishedStringToIso } from '@/lib/seo';

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Article not found' };

  const title = `${article.title} | Bridge Observer Daily`;
  const url = absoluteUrl(`/article/${article.slug}`);
  const iso = publishedStringToIso(article.publishedAt);

  return {
    title,
    description: article.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description: article.summary,
      ...(iso ? { publishedTime: iso, modifiedTime: iso } : {}),
      authors: [article.author],
      section: article.section,
      images: [{ url: article.imageUrl, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: article.summary,
      images: [article.imageUrl],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = getAllArticles()
    .filter((item) => item.section === article.section && item.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="news-root">
      <ArticleJsonLd article={article} />
      <header className="news-header" role="banner">
        <div className="news-topbar">
          <p>{article.section}</p>
          <p>{article.publishedAt}</p>
        </div>
        <SitePrimaryNav
          searchFormId="article-header-search"
          navLabel="Article navigation"
          items={[{ key: 'home', href: '/', label: 'Home' }]}
        />
      </header>

      <main className="article-main">
        <article className="article-shell">
          <div className="article-hero-image-wrap">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="article-hero-image"
              sizes="(max-width: 768px) 100vw, min(1232px, 100vw)"
              priority
            />
          </div>
          <header className="article-header">
            <span>{article.section}</span>
            <h1>{article.title}</h1>
            <div className="article-meta">
              <p>By {article.author}</p>
              <p>{article.publishedAt}</p>
              <p>{article.readTime}</p>
            </div>
          </header>

          <section className="social-share" aria-label="Share article">
            <p>
              <Share2 size={16} /> Share
            </p>
            <button type="button" aria-label="Share to X">
              <Twitter size={16} />
            </button>
            <button type="button" aria-label="Share to Facebook">
              <Facebook size={16} />
            </button>
            <button type="button" aria-label="Share to LinkedIn">
              <Linkedin size={16} />
            </button>
          </section>

          <section className="article-body">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        </article>

        <section className="related-section" aria-label="Related coverage">
          <h2>Related in {article.section}</h2>
          <div className="related-grid">
            {related.map((story) => (
              <article key={story.slug} className="news-card">
                <Link href={`/article/${story.slug}`} className="card-link">
                  <div className="news-card-image-wrap">
                    <Image
                      src={story.imageUrl}
                      alt={story.title}
                      fill
                      className="news-card-thumb"
                      sizes="(max-width: 860px) 100vw, (max-width: 1050px) 50vw, 33vw"
                    />
                  </div>
                  <div className="card-body">
                    <span>{story.section}</span>
                    <h3>{story.title}</h3>
                    <p>{story.summary}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="comments-section" aria-label="Comments">
          <h2>
            <MessageCircle size={18} /> Comments
          </h2>
          <p>Community conversation is enabled for subscribers. Sign in to share your perspective.</p>
          <form>
            <label htmlFor="comment-input" className="sr-only">
              Add a comment
            </label>
            <textarea id="comment-input" placeholder="Write a thoughtful comment..." />
            <button type="submit">Post Comment</button>
          </form>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
