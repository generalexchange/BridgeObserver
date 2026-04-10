import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/cooking', {
  title: 'Cooking | Bridge Observer Daily',
  description: 'Recipes and cooking.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Cooking"
      description="Recipe content and cooking vertical placeholder."
    />
  );
}
