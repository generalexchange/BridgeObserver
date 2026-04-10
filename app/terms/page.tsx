import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/terms', {
  title: 'Terms of Use | Bridge Observer Daily',
  description: 'Terms of use placeholder for Bridge Observer Daily.',
});

export default function TermsPage() {
  return (
    <div className="news-root">
      <main className="static-page">
        <Link href="/" className="static-page__back">
          ← Home
        </Link>
        <h1>Terms of Use</h1>
        <p>Placeholder terms. Replace with published terms of service and community guidelines.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
