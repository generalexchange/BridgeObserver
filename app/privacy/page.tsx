import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/privacy', {
  title: 'Privacy Policy | Bridge Observer Daily',
  description: 'Privacy policy placeholder for Bridge Observer Daily.',
});

export default function PrivacyPage() {
  return (
    <div className="news-root">
      <main className="static-page">
        <Link href="/" className="static-page__back">
          ← Home
        </Link>
        <h1>Privacy Policy</h1>
        <p>Placeholder privacy policy. Replace with counsel-approved language before launch.</p>
      </main>
      <SiteFooter />
    </div>
  );
}
