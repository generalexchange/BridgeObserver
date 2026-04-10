'use client';

import Image from 'next/image';
import Link from 'next/link';
import { mostReadStories, sponsoredStories, trendingStories } from '@/data/newsSiteData';

type Props = {
  /** The feed page the user has just finished scrolling through (1-based). */
  feedPageNumber: number;
};

export function HomeFeedHighlightStrip({ feedPageNumber }: Props) {
  return (
    <div
      className="home-highlight-strip"
      role="region"
      aria-label={`Trending, most read, and sponsored picks after page ${feedPageNumber}`}
    >
      <div className="home-highlight-strip__bar">
        <span className="home-highlight-strip__badge">Editors&apos; picks</span>
        <span className="home-highlight-strip__meta">After feed page {feedPageNumber}</span>
      </div>

      <div className="home-highlight-strip__grid">
        <section className="home-highlight-panel" aria-labelledby={`trending-${feedPageNumber}`}>
          <h3 id={`trending-${feedPageNumber}`} className="home-highlight-panel__title">
            Trending Stories
          </h3>
          <ul className="home-highlight-panel__list">
            {trendingStories.map((story) => (
              <li key={story.slug}>
                <Link href={`/article/${story.slug}`} className="home-highlight-story-card">
                  <div className="home-highlight-story-card__media">
                    <Image
                      src={story.imageUrl}
                      alt=""
                      fill
                      className="home-highlight-story-card__img"
                      sizes="88px"
                    />
                  </div>
                  <div className="home-highlight-story-card__body">
                    <span className="home-highlight-story-card__section">{story.section}</span>
                    <span className="home-highlight-story-card__headline">{story.title}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-highlight-panel" aria-labelledby={`mostread-${feedPageNumber}`}>
          <h3 id={`mostread-${feedPageNumber}`} className="home-highlight-panel__title">
            Most Read
          </h3>
          <ul className="home-highlight-panel__list">
            {mostReadStories.map((story) => (
              <li key={story.slug}>
                <Link href={`/article/${story.slug}`} className="home-highlight-story-card">
                  <div className="home-highlight-story-card__media">
                    <Image
                      src={story.imageUrl}
                      alt=""
                      fill
                      className="home-highlight-story-card__img"
                      sizes="88px"
                    />
                  </div>
                  <div className="home-highlight-story-card__body">
                    <span className="home-highlight-story-card__section">{story.section}</span>
                    <span className="home-highlight-story-card__headline">{story.title}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-highlight-panel" aria-labelledby={`sponsored-${feedPageNumber}`}>
          <h3 id={`sponsored-${feedPageNumber}`} className="home-highlight-panel__title">
            Sponsored
          </h3>
          <ul className="home-highlight-panel__list">
            {sponsoredStories.map((item) => (
              <li key={item.title}>
                <a href="#" className="home-highlight-sponsored-card" aria-label={`${item.title} by ${item.sponsor}`}>
                  <span className="home-highlight-sponsored-card__eyebrow">Partner content</span>
                  <span className="home-highlight-sponsored-card__title">{item.title}</span>
                  <span className="home-highlight-sponsored-card__sponsor">{item.sponsor}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
