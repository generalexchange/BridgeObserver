import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Licensing | Bridge Observer Daily',
  description: 'Content licensing.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Licensing"
      description="Syndication and content licensing inquiries."
    />
  );
}
