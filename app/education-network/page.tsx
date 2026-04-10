import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/education-network', {
  title: 'Learning Network | Bridge Observer Daily',
  description: 'Resources for teaching and learning.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Learning Network"
      description="Educator resources, lesson plans, and student programs placeholder."
    />
  );
}
