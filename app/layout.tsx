import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { AnalyticsListener } from '@/components/AnalyticsListener';
import { SITE_NAME } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Bridge Observer Daily',
  description:
    'A modern dark-themed newsroom featuring breaking coverage, analysis, and structured editorial sections.',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f0f10',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <AnalyticsListener />
        <Analytics />
      </body>
    </html>
  );
}
