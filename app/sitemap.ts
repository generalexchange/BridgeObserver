import type { MetadataRoute } from 'next';
import { navSections } from '@/data/newsSiteData';
import { getAllArticles, getFeedPage, slugForSection } from '@/lib/catalog';
import { getSiteUrl } from '@/lib/site';

const STATIC_PATHS = ['/', '/about', '/contact', '/privacy', '/terms', '/sitemap-page'];

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const last = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_PATHS) {
    entries.push({ url: `${site}${path}`, lastModified: last, changeFrequency: 'daily', priority: path === '/' ? 1 : 0.6 });
  }

  for (const section of navSections) {
    const slug = slugForSection(section);
    const { totalPages } = getFeedPage(section, 1);
    const maxPagesInSitemap = Math.min(totalPages, 30);
    for (let p = 1; p <= maxPagesInSitemap; p += 1) {
      entries.push({
        url: `${site}/${slug}?page=${p}`,
        lastModified: last,
        changeFrequency: 'hourly',
        priority: p === 1 ? 0.9 : 0.5,
      });
    }
  }

  for (const article of getAllArticles()) {
    entries.push({
      url: `${site}/article/${article.slug}`,
      lastModified: last,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return entries;
}
