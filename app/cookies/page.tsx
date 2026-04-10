import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Cookie Policy | Bridge Observer Daily',
  description: 'How we use cookies and similar technologies.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Cookie Policy"
      description="Cookie disclosure, consent tools, and opt-out links. Replace with counsel-approved policy and your CMP integration."
    />
  );
}
