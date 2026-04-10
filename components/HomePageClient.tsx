'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  articles,
  featuredSlides,
  mostReadStories,
  navSections,
  trendingStories,
  sponsoredStories,
  type NewsSection,
} from '@/data/newsSiteData';
import { slugForSection } from '@/lib/catalog';
import { SiteFooter } from '@/components/SiteFooter';

export default function HomePageClient() {
  const [activeSection, setActiveSection] = useState<'All' | NewsSection>('All');
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
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="news-header" role="banner">
        <div className="news-topbar">
          <p>Bridge Observer Daily</p>
          <p>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <nav className="news-nav" aria-label="Primary">
          <Link href="/" className="brand-mark">
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
            {navSections.map((section) => {
              const href = `/${slugForSection(section)}?page=1`;
              const isActive = activeSection === section;
              return (
                <li key={section}>
                  <Link
                    href={href}
                    className={isActive ? 'active' : ''}
                    aria-current={isActive ? 'page' : undefined}
                    prefetch={false}
                  >
                    {section}
                  </Link>
                </li>
              );
            })}
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
              <div className="hero-slide-media">
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  fill
                  className="hero-slide-image"
                  sizes="(max-width: 768px) 100vw, min(1232px, 100vw)"
                  priority={index === 0}
                />
              </div>
              <div className="hero-overlay">
                <span>{story.section}</span>
                <h1>{story.title}</h1>
                <p>{story.summary}</p>
                <Link href={`/article/${story.slug}`}>Read full story</Link>
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
                  <Link href={`/article/${story.slug}`} className="card-link" aria-label={`Read ${story.title}`}>
                    <div className="news-card-image-wrap">
                      <Image
                        src={story.imageUrl}
                        alt={story.title}
                        fill
                        className="news-card-thumb"
                        sizes="(max-width: 860px) 100vw, (max-width: 1050px) 50vw, 40vw"
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

          <aside className="home-sidebar" aria-label="Sidebar highlights">
            <section>
              <h3>Trending Stories</h3>
              <ul>
                {trendingStories.map((story) => (
                  <li key={story.slug}>
                    <Link href={`/article/${story.slug}`}>{story.title}</Link>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Most Read</h3>
              <ul>
                {mostReadStories.map((story) => (
                  <li key={story.slug}>
                    <Link href={`/article/${story.slug}`}>{story.title}</Link>
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

      <SiteFooter />
    </div>
  );
}
