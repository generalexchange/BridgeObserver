import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Help | Bridge Observer Daily',
  description: 'Help center and FAQ.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Help"
      description="FAQ, account help, and delivery support will be published here."
    />
  );
}
