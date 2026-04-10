import type { Metadata } from 'next';
import { PlaceholderPage } from '@/components/PlaceholderPage';

export const metadata: Metadata = {
  title: 'Games | Bridge Observer Daily',
  description: 'Puzzles and games.',
};

export default function Page() {
  return (
    <PlaceholderPage
      title="Games"
      description="Crossword, Spelling Bee, and other games can be embedded or linked from this section."
    />
  );
}
