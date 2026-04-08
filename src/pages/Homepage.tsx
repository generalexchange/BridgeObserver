import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
import {
  articles,
  featuredSlides,
  mostReadStories,
  navSections,
  sponsoredStories,
  trendingStories,
} from '../data/newsSiteData';

export const Homepage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'All' | (typeof navSections)[number]>('All');
  const [activeSlide, setActiveSlide] = useState(0);

  const filteredArticles = useMemo(() => {
    if (activeSection === 'All') return articles;
    return articles.filter((article) => article.section === activeSection);
  }, [activeSection]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((previous) => (previous + 1) % featuredSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="news-root">
      <SEO
        title="Bridge Observer Daily | Dark Editorial News"
        description="A modern dark-themed newsroom featuring breaking coverage, deep analysis, and structured sections across news, sports, business, and culture."
        keywords="news homepage, dark mode news site, editorial design, modern newspaper layout, msn style, dallas morning news style"
      />

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="news-header" role="banner">
        <div className="news-topbar">
          <p>Bridge Observer Daily</p>
          <p>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <nav className="news-nav" aria-label="Primary">
          <Link to="/" className="brand-mark">
            Bridge Observer
          </Link>
          <ul>
            <li>
              <button
                type="button"
                className={activeSection === 'All' ? 'active' : ''}
                onClick={() => setActiveSection('All')}
              >
                Top
              </button>
            </li>
            {navSections.map((section) => (
              <li key={section}>
                <button
                  type="button"
                  className={activeSection === section ? 'active' : ''}
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main-content" className="home-main">
        <section className="hero-carousel" aria-label="Top stories">
          {featuredSlides.map((story, index) => (
            <article
              key={story.slug}
              className={`hero-slide ${index === activeSlide ? 'is-visible' : ''}`}
              aria-hidden={index !== activeSlide}
            >
              <img src={story.imageUrl} alt={story.title} loading={index === 0 ? 'eager' : 'lazy'} />
              <div className="hero-overlay">
                <span>{story.section}</span>
                <h1>{story.title}</h1>
                <p>{story.summary}</p>
                <Link to={`/article/${story.slug}`}>Read full story</Link>
              </div>
            </article>
          ))}
          <div className="hero-controls">
            <button
              type="button"
              onClick={() =>
                setActiveSlide((previous) => (previous - 1 + featuredSlides.length) % featuredSlides.length)
              }
              aria-label="Previous headline"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide((previous) => (previous + 1) % featuredSlides.length)}
              aria-label="Next headline"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        <section className="content-layout">
          <section className="article-grid" aria-label="Latest stories">
            <div className="section-header">
              <h2>{activeSection === 'All' ? 'Latest Coverage' : `${activeSection} Coverage`}</h2>
            </div>
            <div className="grid-wrap">
              {filteredArticles.map((story) => (
                <article key={story.slug} className="news-card">
                  <Link to={`/article/${story.slug}`} className="card-link" aria-label={`Read ${story.title}`}>
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

          <aside className="home-sidebar" aria-label="Sidebar highlights">
            <section>
              <h3>Trending Stories</h3>
              <ul>
                {trendingStories.map((story) => (
                  <li key={story.slug}>
                    <Link to={`/article/${story.slug}`}>{story.title}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Most Read</h3>
              <ul>
                {mostReadStories.map((story) => (
                  <li key={story.slug}>
                    <Link to={`/article/${story.slug}`}>{story.title}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Sponsored</h3>
              <ul>
                {sponsoredStories.map((item) => (
                  <li key={item.title}>
                    <a href="#" aria-label={`${item.title} by ${item.sponsor}`}>
                      {item.title}
                    </a>
                    <small>{item.sponsor}</small>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </section>
      </main>

      <footer className="news-footer">
        <section className="newsletter">
          <h2>Daily Briefing Newsletter</h2>
          <form>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input id="newsletter-email" type="email" placeholder="Email address" required />
            <button type="submit">Subscribe</button>
          </form>
        </section>
        <div className="footer-links">
          <div>
            <h4>Follow</h4>
            <a href="#">X</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href="mailto:newsroom@bridgeobserver.daily">newsroom@bridgeobserver.daily</a>
            <p>Dallas, Texas</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

