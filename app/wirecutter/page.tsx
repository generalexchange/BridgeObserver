import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/wirecutter', {
  title: 'Wirecutter | Bridge Observer Daily',
  description: 'Product reviews and recommendations.',
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Wirecutter"
      description="Product reviews and buying guides placeholder—name and branding are for structural parity with major publishers."
    />
  );
}
