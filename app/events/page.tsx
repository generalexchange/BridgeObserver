import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Live Events | Bridge Observer Daily',
  description: 'Live events and talks.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Live Events"
      description="Ticketing and listings for newsroom events, talks, and forums."
    />
  );
}
