import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Corrections | Bridge Observer Daily',
  description: 'Report errors and read published corrections.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Corrections"
      description="Submit a correction request and view a log of clarifications and fixes."
    />
  );
}
