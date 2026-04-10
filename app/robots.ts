import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl().replace(/\/$/, '');
  const host = site.replace(/^https?:\/\//, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search?'],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host,
  };
}
