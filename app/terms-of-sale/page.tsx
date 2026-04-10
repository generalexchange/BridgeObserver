import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/terms-of-sale', {
  title: 'Terms of Sale | Bridge Observer Daily',
  description: 'Terms governing product and subscription purchases.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Terms of Sale"
      description="Terms governing purchases, renewals, and refunds. Replace with counsel-approved language."
    />
  );
}
