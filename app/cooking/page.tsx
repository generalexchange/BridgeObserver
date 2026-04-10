import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Cooking | Bridge Observer Daily',
  description: 'Recipes and cooking.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Cooking"
      description="Recipe content and cooking vertical placeholder."
    />
  );
}
