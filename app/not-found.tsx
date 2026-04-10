import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="news-root" style={{ paddingTop: '2rem' }}>
      <section className="article-shell">
        <h1>Article not found</h1>
        <p>The page you requested is unavailable.</p>
        <Link href="/">Return to homepage</Link>
      </section>
    </main>
  );
}
