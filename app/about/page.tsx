import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'About | Bridge Observer Daily',
  description: 'About Bridge Observer Daily: mission, editorial standards, and contact points (placeholder).',
};

export default function AboutPage() {
  return (
    <div className="news-root">
      <main className="static-page">
        <Link href="/" className="static-page__back">
          ← Home
        </Link>
        <h1>About</h1>
        <p>
          This is placeholder copy for an about page. Replace with your newsroom mission, leadership bios, and
          masthead.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
