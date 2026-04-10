import type { Metadata } from 'next';
import { PressProviders } from '@/components/press/PressProviders';
import './press-globals.css';

export const metadata: Metadata = {
  title: 'Press CMS | Bridge Observer',
  description: 'Internal press desk: writer dashboard and submissions.',
  robots: { index: false, follow: false },
};

export default function PressLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="press-cms-root">
      <PressProviders>{children}</PressProviders>
    </div>
  );
}
