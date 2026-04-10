import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Newsletters | Bridge Observer Daily',
  description: 'Email newsletters.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Newsletters"
      description="Browse and manage email newsletters and alerts."
    />
  );
}
