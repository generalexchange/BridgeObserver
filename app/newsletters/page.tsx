import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/newsletters', {
  title: 'Newsletters | Bridge Observer Daily',
  description: 'Email newsletters.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Newsletters"
      description="Browse and manage email newsletters and alerts."
    />
  );
}
