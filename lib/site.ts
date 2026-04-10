/**
 * Canonical site origin for SEO (pagination rel prev/next, Open Graph, sitemap).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://www.example.com).
 *
 * Press CMS: add `press.bridgeobserver.com` in Vercel → Project → Domains (CNAME to `cname.vercel-dns.com`).
 * `middleware.ts` rewrites that host to the `/press` App Router segment. Local: `http://localhost:3000/press`
 * or add `127.0.0.1 press.localhost` to hosts and open `http://press.localhost:3000`.
 */
export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
