import { NextResponse } from 'next/server';
import { getHomeFeedPage, parsePage } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = parsePage(url.searchParams.get('page') ?? undefined);
  const { items, total, totalPages, page: resolvedPage } = getHomeFeedPage(page);
  const hasMore = resolvedPage < totalPages;

  return NextResponse.json({
    articles: items,
    page: resolvedPage,
    total,
    totalPages,
    hasMore,
  });
}
