import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Video | Bridge Observer Daily',
  description: 'Video journalism.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Video"
      description="Video reports, explainers, and live streams will be featured here."
    />
  );
}
