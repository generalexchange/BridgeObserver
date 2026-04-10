import type { Metadata } from 'next';
import HomePageClient from '@/components/HomePageClient';
import { getHomeFeedPage, parsePage } from '@/lib/catalog';
import { getSiteUrl } from '@/lib/site';

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = parsePage(searchParams.page);
  const { totalPages, page: resolved } = getHomeFeedPage(page);
  const site = getSiteUrl();
  const canonical = `${site}/?page=${resolved}`;
  const prev = resolved > 1 ? `${site}/?page=${resolved - 1}` : undefined;
  const next = resolved < totalPages ? `${site}/?page=${resolved + 1}` : undefined;

  const titleBase = 'Bridge Observer Daily';
  const title =
    resolved === 1 ? titleBase : `Latest stories – Page ${resolved} | ${titleBase}`;

  return {
    title,
    description: `Page ${resolved} of ${totalPages}: breaking coverage and briefs from ${titleBase}.`,
    alternates: { canonical },
    icons: {
      other: [
        ...(prev ? [{ rel: 'prev' as const, url: prev }] : []),
        ...(next ? [{ rel: 'next' as const, url: next }] : []),
      ],
    },
  };
}

export default function Page({ searchParams }: PageProps) {
  const page = parsePage(searchParams.page);
  const { items, totalPages, page: resolvedPage } = getHomeFeedPage(page);

  return (
    <HomePageClient
      initialArticles={items}
      initialPage={resolvedPage}
      totalPages={totalPages}
    />
  );
}
