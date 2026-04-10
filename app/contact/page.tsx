import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/contact', {
  title: 'Contact | Bridge Observer Daily',
  description: 'Contact Bridge Observer Daily: tips, corrections, and partnerships (placeholder).',
});

export default function ContactPage() {
  return (
    <div className="news-root">
      <main className="static-page">
        <Link href="/" className="static-page__back">
          ← Home
        </Link>
        <h1>Contact</h1>
        <p>Placeholder contact page. Wire a form handler or mailto links for tips and corrections.</p>
        <p>
          Email: <a href="mailto:newsroom@bridgeobserver.daily">newsroom@bridgeobserver.daily</a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
