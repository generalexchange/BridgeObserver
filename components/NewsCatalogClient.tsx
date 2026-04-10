'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import type { NewsArticle } from '@/data/newsSiteData';
import type { NewsSection } from '@/data/newsSiteData';
import { slugForSection } from '@/lib/catalog';
import { AdSlot } from '@/components/AdSlot';
import { NewsArticleCard } from '@/components/NewsArticleCard';

type FeedJson = {
  articles: NewsArticle[];
  page: number;
  totalPages: number;
  hasMore: boolean;
};

type Props = {
  section: NewsSection;
  basePath: string;
  initialArticles: NewsArticle[];
  initialPage: number;
  totalPages: number;
};

function scrollDepthKey(path: string) {
  return `analytics:scroll-depth:${path}`;
}

export function NewsCatalogClient({
  section,
  basePath,
  initialArticles,
  initialPage,
  totalPages: initialTotalPages,
}: Props) {
  const liveId = useId();
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [maxLoadedPage, setMaxLoadedPage] = useState(initialPage);
  const loadedPagesRef = useRef<Set<number>>(new Set([initialPage]));
  const [loading, setLoading] = useState(false);
  const [liveMessage, setLiveMessage] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchLockRef = useRef(false);
  const lastFetchAtRef = useRef(0);
  const maxLoadedRef = useRef(initialPage);
  const totalPagesRef = useRef(initialTotalPages);
  const loadingRef = useRef(false);
  const sectionApi = slugForSection(section);

  useEffect(() => {
    maxLoadedRef.current = maxLoadedPage;
  }, [maxLoadedPage]);
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const announce = useCallback((msg: string) => {
    setLiveMessage(msg);
    window.setTimeout(() => setLiveMessage(''), 3500);
  }, []);

  const fetchAndAppendPage = useCallback(
    async (page: number) => {
      if (fetchLockRef.current) return;
      if (loadedPagesRef.current.has(page)) return;
      if (page > totalPagesRef.current) return;

      fetchLockRef.current = true;
      loadingRef.current = true;
      setLoading(true);
      try {
        const res = await fetch(`/api/feed?section=${encodeURIComponent(sectionApi)}&page=${page}`, {
          credentials: 'same-origin',
        });
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
        announce(`Loaded page ${data.page}: ${data.articles.length} stories.`);

        const url = new URL(window.location.href);
        url.pathname = basePath;
        url.searchParams.set('page', String(data.page));
        window.history.pushState({ page: data.page, section }, '', url.toString());
        document.title = `${section} – Page ${data.page} | Bridge Observer Daily`;
      } catch {
        announce('Could not load more stories. Use Load more or try again.');
      } finally {
        fetchLockRef.current = false;
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [announce, basePath, section, sectionApi],
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
    setArticles(initialArticles);
    setTotalPages(initialTotalPages);
    setMaxLoadedPage(initialPage);
    maxLoadedRef.current = initialPage;
    totalPagesRef.current = initialTotalPages;
    loadedPagesRef.current = new Set([initialPage]);
  }, [initialArticles, initialPage, initialTotalPages]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) debouncedTryFetch();
        }
      },
      { root: null, rootMargin: '280px 0px 0px 0px', threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [debouncedTryFetch]);

  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    let maxDepth = 0;
    const depths = [25, 50, 75, 100] as const;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const y = window.scrollY;
        const pct = scrollable <= 0 ? 100 : Math.min(100, Math.round((y / scrollable) * 100));
        for (const d of depths) {
          if (pct >= d && d > maxDepth) {
            maxDepth = d;
            window.dispatchEvent(new CustomEvent('analytics:scroll-depth', { detail: { depth: d, path } }));
            try {
              sessionStorage.setItem(scrollDepthKey(path), String(d));
            } catch {
              /* ignore */
            }
          }
        }
        try {
          sessionStorage.setItem(`scroll-pos:${path}`, String(y));
        } catch {
          /* ignore */
        }
      }, 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    try {
      const saved = sessionStorage.getItem(`scroll-pos:${path}`);
      if (saved != null && 'scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
        const y = parseInt(saved, 10);
        if (!Number.isNaN(y)) {
          requestAnimationFrame(() => window.scrollTo(0, y));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const p = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
      document.title = `${section} – Page ${p} | Bridge Observer Daily`;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [section]);

  const handleLoadMore = () => {
    tryFetchNextPage();
  };

  const scrollToFooter = () => {
    document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const feedBlocks = useMemo(() => {
    const blocks: ReactNode[] = [];
    let adCounter = 0;
    articles.forEach((article, i) => {
      if (i > 0 && i % 4 === 0) {
        adCounter += 1;
        blocks.push(
          <AdSlot key={`ad-${adCounter}`} slotId={`${sectionApi}-inline-${adCounter}`} format="medium-rectangle" />,
        );
      }
      blocks.push(<NewsArticleCard key={article.slug} article={article} listIndex={i} />);
    });
    return blocks;
  }, [articles, sectionApi]);

  const footerBreakEveryPages = 3;
  const clientPageBlocks = Math.max(0, maxLoadedPage - initialPage);
  const showFooterReachStrip =
    clientPageBlocks > 0 && clientPageBlocks % footerBreakEveryPages === 0 && maxLoadedPage < totalPages;

  const nextPageToFetch = maxLoadedPage < totalPages ? maxLoadedPage + 1 : null;

  return (
    <div className="news-catalog">
      <div id={`${liveId}-live`} className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>

      <section className="news-catalog__intro" aria-labelledby={`${liveId}-heading`}>
        <h1 id={`${liveId}-heading`} className="news-catalog__h1">
          {section}
        </h1>
        <p className="news-catalog__lede">
          Paginated, server-rendered listings for SEO. With JavaScript, more pages load as you scroll. Each{' '}
          <code>?page=</code> URL remains a full standalone page for crawlers and users without JavaScript.
        </p>
      </section>

      <AdSlot slotId={`${sectionApi}-top`} format="leaderboard" />

      <section className="news-catalog__feed" aria-label={`${section} stories`}>
        <div className="news-catalog__grid">{feedBlocks}</div>
      </section>

      {showFooterReachStrip && (
        <div className="news-catalog__footer-strip" role="region" aria-label="Reading pause">
          <p>You have loaded several pages. Jump to the site footer for policies and newsletter signup.</p>
          <button type="button" className="news-catalog__btn" onClick={scrollToFooter}>
            Go to footer
          </button>
        </div>
      )}

      <div className="news-catalog__controls">
        <button
          type="button"
          className="news-catalog__btn"
          onClick={handleLoadMore}
          disabled={loading || nextPageToFetch == null}
        >
          {loading ? 'Loading…' : nextPageToFetch == null ? 'No more stories' : `Load page ${nextPageToFetch}`}
        </button>
        <button type="button" className="news-catalog__btn news-catalog__btn--ghost" onClick={scrollToFooter}>
          Site footer
        </button>
      </div>

      <div ref={sentinelRef} className="news-catalog__sentinel" aria-hidden="true" />

      <nav className="news-catalog__pagination" aria-label="Pagination">
        {initialPage > 1 ? (
          <Link
            href={`${basePath}?page=${initialPage - 1}`}
            className="news-catalog__page-link"
            rel="prev"
            prefetch={false}
          >
            Previous page
          </Link>
        ) : (
          <span className="news-catalog__page-link is-disabled">Previous page</span>
        )}
        <span className="news-catalog__page-meta">
          Page {initialPage} of {totalPages}
        </span>
        {initialPage < totalPages ? (
          <Link
            href={`${basePath}?page=${initialPage + 1}`}
            className="news-catalog__page-link"
            rel="next"
            prefetch={false}
          >
            Next page
          </Link>
        ) : (
          <span className="news-catalog__page-link is-disabled">Next page</span>
        )}
      </nav>

      <button type="button" className="news-catalog__sticky-footer-btn" onClick={scrollToFooter}>
        Footer
      </button>
    </div>
  );
}
