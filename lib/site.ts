/**
 * Canonical site origin for SEO (pagination rel prev/next, Open Graph, sitemap).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://www.example.com).
 *
 * Press CMS: add `press.bridgeobserver.com` in Vercel → Project → Domains (CNAME to `cname.vercel-dns.com`).
 * `middleware.ts` rewrites that host to the `/press` App Router segment. Local: `http://localhost:3000/press`
 * or add `127.0.0.1 press.localhost` to hosts and open `http://press.localhost:3000`.
 *
 * Market workstation: add `markets.bridgeobserver.com` the same way; middleware rewrites to `/markets`.
 * Local: `http://localhost:3000/markets` or `http://markets.localhost:3000`.
 *
 * Editor Workbench: add `editor.bridgeobserver.com`; middleware rewrites to `/editor`.
 * Local: `http://localhost:3000/editor` or `http://editor.localhost:3000`.
 *
 * Admin Control Center: add `admin.bridgeobserver.com`; middleware rewrites to `/admin`.
 * Local: `http://localhost:3000/admin` or `http://admin.localhost:3000`.
 */
export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
