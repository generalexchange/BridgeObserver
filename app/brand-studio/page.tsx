import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/brand-studio', {
  title: 'Brand Studio | Bridge Observer Daily',
  description: 'Branded content partnerships.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Brand Studio"
      description="Native advertising and brand storytelling partnerships—sales and creative contact via Advertising."
    />
  );
}
