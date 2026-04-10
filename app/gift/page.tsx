import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Gift Articles | Bridge Observer Daily',
  description: 'Share subscriber articles with non-subscribers.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Gift Articles"
      description="Gift links and sharing tools for subscribers—placeholder for paywall integration."
    />
  );
}
