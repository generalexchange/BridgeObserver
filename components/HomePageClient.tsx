'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { featuredSlides, navSections, type NewsArticle } from '@/data/newsSiteData';
import { PAGE_SIZE, slugForSection } from '@/lib/catalog';
import { HomeFeedHighlightStrip } from '@/components/HomeFeedHighlightStrip';
import { SiteFooter } from '@/components/SiteFooter';
import { AdSlot } from '@/components/AdSlot';
import { HeaderSearch } from '@/components/HeaderSearch';

type FeedJson = {
  articles: NewsArticle[];
  page: number;
  totalPages: number;
  hasMore: boolean;
};

type Props = {
  initialArticles: NewsArticle[];
  initialPage: number;
  totalPages: number;
};

export default function HomePageClient({ initialArticles, initialPage, totalPages: initialTotalPages }: Props) {
  const pathname = usePathname();
  const liveId = useId();
  /** Tracks URL page for “Top” highlight (updates with infinite scroll pushState). */
  const [urlSyncedPage, setUrlSyncedPage] = useState(initialPage);

  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [maxLoadedPage, setMaxLoadedPage] = useState(initialPage);
  const loadedPagesRef = useRef<Set<number>>(new Set([initialPage]));
  const [loading, setLoading] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchLockRef = useRef(false);
  const lastFetchAtRef = useRef(0);
  const maxLoadedRef = useRef(initialPage);
  const totalPagesRef = useRef(initialTotalPages);
  const loadingRef = useRef(false);

  useEffect(() => {
    maxLoadedRef.current = maxLoadedPage;
  }, [maxLoadedPage]);
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((previous) => (previous + 1) % featuredSlides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setArticles(initialArticles);
    setTotalPages(initialTotalPages);
    setMaxLoadedPage(initialPage);
    setUrlSyncedPage(initialPage);
    maxLoadedRef.current = initialPage;
    totalPagesRef.current = initialTotalPages;
    loadedPagesRef.current = new Set([initialPage]);
  }, [initialArticles, initialPage, initialTotalPages]);

  const announce = useCallback((msg: string) => {
    setLiveMessage(msg);
    window.setTimeout(() => setLiveMessage(''), 3500);
  }, []);

  const fetchAndAppendPage = useCallback(
    async (page: number) => {
      if (fetchLockRef.current || loadedPagesRef.current.has(page)) return;
      if (page > totalPagesRef.current) return;

      fetchLockRef.current = true;
      loadingRef.current = true;
      setLoading(true);
      try {
        const res = await fetch(`/api/home-feed?page=${page}`, { credentials: 'same-origin' });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as FeedJson;
        totalPagesRef.current = data.totalPages;
        setTotalPages(data.totalPages);
        loadedPagesRef.current.add(data.page);
        setArticles((prev) => {
          const existing = new Set(prev.map((a) => a.slug));
          const merged = [...prev];
          for (const a of data.articles) {
            if (!existing.has(a.slug)) merged.push(a);
          }
          return merged;
        });
        maxLoadedRef.current = Math.max(maxLoadedRef.current, data.page);
        setMaxLoadedPage(maxLoadedRef.current);
        announce(`Loaded page ${data.page}: ${data.articles.length} more stories.`);

        const url = new URL(window.location.href);
        url.pathname = '/';
        url.searchParams.set('page', String(data.page));
        window.history.pushState({ page: data.page, feed: 'home' }, '', url.toString());
        setUrlSyncedPage(data.page);
        document.title =
          data.page === 1
            ? 'Bridge Observer Daily'
            : `Latest stories – Page ${data.page} | Bridge Observer Daily`;
      } catch {
        announce('Could not load more. Try the Load more button.');
      } finally {
        fetchLockRef.current = false;
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [announce],
  );

  const tryFetchNextPage = useCallback(() => {
    if (loadingRef.current) return;
    const now = Date.now();
    if (now - lastFetchAtRef.current < 450) return;
    lastFetchAtRef.current = now;
    const next = maxLoadedRef.current + 1;
    if (next > totalPagesRef.current) return;
    void fetchAndAppendPage(next);
  }, [fetchAndAppendPage]);

  const debouncedTryFetch = useMemo(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    return () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => tryFetchNextPage(), 400);
    };
  }, [tryFetchNextPage]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) debouncedTryFetch();
        }
      },
      { root: null, rootMargin: '320px 0px 0px 0px', threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [debouncedTryFetch]);

  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const p = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
      setUrlSyncedPage(p);
      document.title =
        p === 1 ? 'Bridge Observer Daily' : `Latest stories – Page ${p} | Bridge Observer Daily`;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const topNavActive = pathname === '/' && urlSyncedPage === 1;

  const scrollToFooter = () => {
    document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const feedBlocks = useMemo(() => {
    const blocks: ReactNode[] = [];
    let adCounter = 0;
    articles.forEach((story, i) => {
      if (i > 0 && i % 4 === 0) {
        adCounter += 1;
        blocks.push(<AdSlot key={`ad-${adCounter}`} slotId={`home-inline-${adCounter}`} format="medium-rectangle" />);
      }
      blocks.push(
        <article key={story.slug} className="news-card">
          <Link href={`/article/${story.slug}`} className="card-link" aria-label={`Read ${story.title}`}>
            <div className="news-card-image-wrap">
              <Image
                src={story.imageUrl}
                alt={story.title}
                fill
                className="news-card-thumb"
                sizes="(max-width: 860px) 100vw, min(800px, 90vw)"
                loading="lazy"
              />
            </div>
            <div className="card-body">
              <span>{story.section}</span>
              <h3>{story.title}</h3>
              <p>{story.summary}</p>
            </div>
          </Link>
        </article>,
      );

      const atPageBoundary = (i + 1) % PAGE_SIZE === 0;
      if (atPageBoundary) {
        const completedChunks = (i + 1) / PAGE_SIZE;
        const feedPageNumber = initialPage + completedChunks - 1;
        blocks.push(
          <HomeFeedHighlightStrip key={`feed-highlights-${i}-${feedPageNumber}`} feedPageNumber={feedPageNumber} />,
        );
      }
    });
    return blocks;
  }, [articles, initialPage]);

  const nextPageToFetch = maxLoadedPage < totalPages ? maxLoadedPage + 1 : null;

  return (
    <div className="news-root">
      <div id={`${liveId}-live`} className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="news-header" role="banner">
        <div className="news-topbar">
          <p>Bridge Observer Daily</p>
          <p>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <nav className="news-nav news-nav--with-search" aria-label="Primary">
          <Link href="/" className="brand-mark">
            Bridge Observer
          </Link>
          <HeaderSearch formId="home-header-search" />
          <ul>
            <li>
              <Link href="/" className={topNavActive ? 'active' : ''} aria-current={topNavActive ? 'page' : undefined}>
                Top
              </Link>
            </li>
            {navSections.map((section) => {
              const href = `/${slugForSection(section)}?page=1`;
              return (
                <li key={section}>
                  <Link href={href} prefetch={false}>
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

        <div className="content-layout content-layout--home-stack">
          <section className="article-grid home-article-stream" aria-label="Latest stories">
            <div className="section-header">
              <h2>Latest coverage</h2>
            </div>

            <AdSlot slotId="home-leaderboard" format="leaderboard" />

            <div className="grid-wrap home-grid-wrap">{feedBlocks}</div>

            <div className="home-stream__controls">
              <button
                type="button"
                className="home-stream__btn"
                onClick={() => {
                  if (nextPageToFetch != null) void fetchAndAppendPage(nextPageToFetch);
                }}
                disabled={loading || nextPageToFetch == null}
              >
                {loading ? 'Loading…' : nextPageToFetch == null ? 'No more stories' : `Load more (page ${nextPageToFetch})`}
              </button>
              <button type="button" className="home-stream__btn home-stream__btn--ghost" onClick={scrollToFooter}>
                Jump to footer
              </button>
            </div>

            <div ref={sentinelRef} className="home-stream__sentinel" aria-hidden="true" />

            <nav className="home-stream__pagination" aria-label="Pagination">
              {initialPage > 1 ? (
                <Link href={`/?page=${initialPage - 1}`} className="home-stream__page-link" rel="prev" prefetch={false}>
                  Previous page
                </Link>
              ) : (
                <span className="home-stream__page-link is-disabled">Previous page</span>
              )}
              <span className="home-stream__page-meta">
                Page {initialPage} of {totalPages}
              </span>
              {initialPage < totalPages ? (
                <Link href={`/?page=${initialPage + 1}`} className="home-stream__page-link" rel="next" prefetch={false}>
                  Next page
                </Link>
              ) : (
                <span className="home-stream__page-link is-disabled">Next page</span>
              )}
            </nav>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
