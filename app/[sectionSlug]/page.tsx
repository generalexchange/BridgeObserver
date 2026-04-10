import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NewsCatalogClient } from '@/components/NewsCatalogClient';
import { SectionChrome } from '@/components/SectionChrome';
import { SiteFooter } from '@/components/SiteFooter';
import { getFeedPage, parsePage, sectionFromSlug, slugForSection } from '@/lib/catalog';
import { getSiteUrl } from '@/lib/site';

const VALID_SLUGS = new Set(['news', 'sports', 'business', 'entertainment', 'lifestyle', 'tech', 'opinion']);

type PageProps = {
  params: { sectionSlug: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const slug = params.sectionSlug.toLowerCase();
  if (!VALID_SLUGS.has(slug)) {
    return { title: 'Section not found' };
  }
  const section = sectionFromSlug(slug);
  if (!section) return { title: 'Section not found' };

  const page = parsePage(searchParams.page);
  const { totalPages, page: resolved } = getFeedPage(section, page);
  const site = getSiteUrl();
  const base = `/${slug}`;
  const canonical = `${site}${base}?page=${resolved}`;
  const prev = resolved > 1 ? `${site}${base}?page=${resolved - 1}` : undefined;
  const next = resolved < totalPages ? `${site}${base}?page=${resolved + 1}` : undefined;

  const title = `${section} – Page ${resolved} | Bridge Observer Daily`;
  const description = `Page ${resolved} of ${totalPages}: ${section} coverage, briefs, and wire desk placeholders from Bridge Observer Daily.`;

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
    icons: {
      other: [
        ...(prev ? [{ rel: 'prev' as const, url: prev }] : []),
        ...(next ? [{ rel: 'next' as const, url: next }] : []),
      ],
    },
  };
}

export default function SectionFeedPage({ params, searchParams }: PageProps) {
  const slug = params.sectionSlug.toLowerCase();
  if (!VALID_SLUGS.has(slug)) notFound();

  const section = sectionFromSlug(slug);
  if (!section) notFound();

  const page = parsePage(searchParams.page);
  const { items, totalPages, page: resolvedPage } = getFeedPage(section, page);
  const basePath = `/${slugForSection(section)}`;

  return (
    <div className="news-root">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SectionChrome activeSection={section} />
      <main id="main-content">
        <NewsCatalogClient
          section={section}
          basePath={basePath}
          initialArticles={items}
          initialPage={resolvedPage}
          totalPages={totalPages}
        />
        <noscript>
          <section className="news-catalog__noscript" aria-label="JavaScript disabled">
            <p>Browse additional pages using the pagination links above. Each page URL is fully usable without JavaScript.</p>
            {resolvedPage < totalPages ? (
              <p>
                <Link href={`${basePath}?page=${resolvedPage + 1}`}>Continue to next page</Link>
              </p>
            ) : null}
          </section>
        </noscript>
      </main>
      <SiteFooter />
    </div>
  );
}
