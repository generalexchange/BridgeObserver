import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/events', {
  title: 'Live Events | Bridge Observer Daily',
  description: 'Live events and talks.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Live Events"
      description="Ticketing and listings for newsroom events, talks, and forums."
    />
  );
}
