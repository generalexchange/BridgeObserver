import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/accessibility', {
  title: 'Accessibility | Bridge Observer Daily',
  description: 'Accessibility statement and contact.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Accessibility"
      description="We are committed to making our digital products usable for everyone. Contact information for accessibility feedback will appear here."
    />
  );
}
