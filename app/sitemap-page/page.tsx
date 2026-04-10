import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { getAllArticles } from '@/lib/catalog';
import { navSections } from '@/data/newsSiteData';
import { slugForSection } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Sitemap | Bridge Observer Daily',
  description: 'HTML sitemap: sections, articles, and key pages on Bridge Observer Daily.',
};

export default function HtmlSitemapPage() {
  const articles = getAllArticles();
  return (
    <div className="news-root">
      <main className="static-page sitemap-page">
        <Link href="/" className="static-page__back">
          ← Home
        </Link>
        <h1>Sitemap</h1>
        <section aria-labelledby="sitemap-sections">
          <h2 id="sitemap-sections">Sections (paginated)</h2>
          <ul>
            {navSections.map((s) => (
              <li key={s}>
                <Link href={`/${slugForSection(s)}?page=1`}>{s}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="sitemap-articles">
          <h2 id="sitemap-articles">Articles</h2>
          <ul className="sitemap-page__articles">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/article/${a.slug}`}>{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="sitemap-static">
          <h2 id="sitemap-static">Pages</h2>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
