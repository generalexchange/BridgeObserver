import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Podcasts | Bridge Observer Daily',
  description: 'Newsroom podcasts.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Podcasts"
      description="Show pages and RSS feeds for newsroom podcasts."
    />
  );
}
