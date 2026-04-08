import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Facebook, Linkedin, MessageCircle, Share2, Twitter } from 'lucide-react';
import { SEO } from '../components/SEO';
import { articles, getArticleBySlug } from '../data/newsSiteData';

export const ArticlePage: React.FC = () => {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <main className="article-main">
        <section className="article-shell">
          <h1>Article not found</h1>
          <p>The story you are looking for is unavailable.</p>
          <Link to="/">Return to homepage</Link>
        </section>
      </main>
    );
  }

  const related = articles
    .filter((item) => item.section === article.section && item.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="news-root">
      <SEO
        title={article.title}
        description={article.summary}
        keywords={`${article.section.toLowerCase()}, modern newsroom, dark editorial`}
      />

      <header className="news-header" role="banner">
        <div className="news-topbar">
          <p>{article.section}</p>
          <p>{article.publishedAt}</p>
        </div>
        <nav className="news-nav" aria-label="Article navigation">
          <Link to="/" className="brand-mark">
            Bridge Observer
          </Link>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="article-main">
        <article className="article-shell">
          <img src={article.imageUrl} alt={article.title} className="article-hero-image" />
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
                <Link to={`/article/${story.slug}`} className="card-link">
                  <img src={story.imageUrl} alt={story.title} loading="lazy" />
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
    </div>
  );
};
