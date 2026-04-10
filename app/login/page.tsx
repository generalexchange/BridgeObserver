import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/login', {
  title: 'Log In | Bridge Observer Daily',
  description: 'Subscriber account login.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Log In"
      description="Authentication for subscribers will be configured here."
    />
  );
}
