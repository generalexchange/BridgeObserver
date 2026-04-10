import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Reprints | Bridge Observer Daily',
  description: 'Article reprints and permissions.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Reprints"
      description="Permissions and reprints for articles, photography, and graphics."
    />
  );
}
