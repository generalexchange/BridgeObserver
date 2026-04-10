import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { staticPageMetadata } from '@/lib/seo';

export const metadata: Metadata = staticPageMetadata('/replica', {
  title: "Today's Paper | Bridge Observer Daily",
  description: "Replica edition of today's print layout.",
});

export default function Page() {
  return (
    <PlaceholderPage
      title="Today's Paper"
      description="Digital replica of the print edition—placeholder for PDF or e-reader style layout."
    />
  );
}
