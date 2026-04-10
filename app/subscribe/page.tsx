import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/subscribe', {
  title: 'Subscribe | Bridge Observer Daily',
  description: 'Digital and home delivery subscriptions.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Subscribe"
      description="Subscription, billing, and account management will be integrated here. This page reserves the URL structure used by major national newspapers."
    />
  );
}
