import type { Metadata } from 'next';
import './admin-globals.css';

export const metadata: Metadata = {
  title: 'Bridge Observer Admin Control Center',
  description: 'Mission-critical command center for platform operations, revenue, users, editorial, data, and security.',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-app">{children}</div>;
}
