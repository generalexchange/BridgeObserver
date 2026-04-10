import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}
