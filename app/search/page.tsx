import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SiteFooter } from '@/components/SiteFooter';
import { SitePrimaryNav } from '@/components/SitePrimaryNav';
import { absoluteUrl } from '@/lib/seo';
import { searchArticles } from '@/lib/searchArticles';
type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const raw = searchParams.q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? '';
  const canonical = absoluteUrl('/search');

  if (!q) {
    const title = 'Search | Bridge Observer Daily';
    const description = 'Search articles and briefs.';
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        type: 'website',
        url: canonical,
        title,
        description,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    };
  }

  const title = `Search: ${q} | Bridge Observer Daily`;
  const description = `Results for “${q}” on Bridge Observer Daily.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export default function SearchPage({ searchParams }: PageProps) {
  const raw = searchParams.q;
  const q = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? '';
  const results = q ? searchArticles(q) : [];

  return (
    <div className="news-root">
      <a href="#search-main" className="skip-link">
        Skip to results
      </a>
      <header className="news-header" role="banner">
        <div className="news-topbar">
          <p>Bridge Observer Daily</p>
          <p>Search</p>
        </div>
        <SitePrimaryNav
          searchFormId="search-page-q"
          items={[{ key: 'home', href: '/', label: 'Home' }]}
        />
      </header>

      <main id="search-main" className="search-page">
        <h1 className="search-page__title">Search</h1>
        {!q ? (
          <p className="search-page__empty">Enter a search term in the bar above.</p>
        ) : results.length === 0 ? (
          <p className="search-page__empty">
            No results for <strong>{q}</strong>. Try different keywords or browse{' '}
            <Link href="/">the homepage</Link>.
          </p>
        ) : (
          <p className="search-page__count">
            {results.length} result{results.length === 1 ? '' : 's'} for <strong>{q}</strong>
          </p>
        )}
        <ul className="search-page__list">
          {results.map((article) => (
            <li key={article.slug}>
              <article className="search-page__card">
                <Link href={`/article/${article.slug}`} className="search-page__card-link">
                  <div className="search-page__thumb">
                    <Image
                      src={article.imageUrl}
                      alt=""
                      fill
                      className="search-page__thumb-img"
                      sizes="120px"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <span className="search-page__section">{article.section}</span>
                    <h2 className="search-page__headline">{article.title}</h2>
                    <p className="search-page__summary">{article.summary}</p>
                  </div>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
