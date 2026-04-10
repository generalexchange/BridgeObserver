import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Careers | Bridge Observer Daily',
  description: 'Work with us.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Careers"
      description="Open roles, culture, and application information for journalists, engineers, and business teams."
    />
  );
}
