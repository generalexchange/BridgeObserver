import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Facebook, Linkedin, MessageCircle, Share2, Twitter } from 'lucide-react';
import { HeaderSearch } from '@/components/HeaderSearch';
import { SiteFooter } from '@/components/SiteFooter';
import { getAllArticles, getArticleBySlug } from '@/lib/catalog';

type PageProps = {
  params: {
    slug: string;
  };
};

export function generateMetadata({ params }: PageProps): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Article not found' };

  return {
    title: `${article.title} | Bridge Observer Daily`,
    description: article.summary,
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
      <header className="news-header" role="banner">
        <div className="news-topbar">
          <p>{article.section}</p>
          <p>{article.publishedAt}</p>
        </div>
        <nav className="news-nav news-nav--with-search" aria-label="Article navigation">
          <Link href="/" className="brand-mark">
            Bridge Observer
          </Link>
          <HeaderSearch formId="article-header-search" />
          <ul className="news-nav__compact">
            <li>
              <Link href="/">Home</Link>
            </li>
          </ul>
        </nav>
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
