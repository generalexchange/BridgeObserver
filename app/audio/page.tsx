import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/audio', {
  title: 'Audio | Bridge Observer Daily',
  description: 'Podcasts and audio features.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Audio"
      description="Podcasts, narrated articles, and audio programming will live here."
    />
  );
}
