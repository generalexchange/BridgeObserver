import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { AnalyticsListener } from '@/components/AnalyticsListener';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bridge Observer Daily',
  description:
    'A modern dark-themed newsroom featuring breaking coverage, analysis, and structured editorial sections.',
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
