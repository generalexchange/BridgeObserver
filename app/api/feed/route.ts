import { NextResponse } from 'next/server';
import { getFeedPage, parsePage, sectionFromSlug } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sectionParam = url.searchParams.get('section') ?? 'news';
  const section = sectionFromSlug(sectionParam);
  if (!section) {
    return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
  }

  const page = parsePage(url.searchParams.get('page') ?? undefined);
  const { items, total, totalPages, page: resolvedPage } = getFeedPage(section, page);
  const hasMore = resolvedPage < totalPages;

  return NextResponse.json({
    articles: items,
    page: resolvedPage,
    total,
    totalPages,
    hasMore,
    section,
  });
}
