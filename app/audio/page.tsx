import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Audio | Bridge Observer Daily',
  description: 'Podcasts and audio features.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Audio"
      description="Podcasts, narrated articles, and audio programming will live here."
    />
  );
}
