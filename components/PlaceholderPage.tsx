import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

type Props = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="news-root">
      <main className="static-page placeholder-page">
        <Link href="/" className="static-page__back">
          ← Home
        </Link>
        <h1>{title}</h1>
        <p>{description}</p>
      </main>
      <SiteFooter />
    </div>
  );
}
