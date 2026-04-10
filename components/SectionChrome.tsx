import Link from 'next/link';
import { navSections, type NewsSection } from '@/data/newsSiteData';
import { slugForSection } from '@/lib/catalog';

type Props = {
  activeSection: NewsSection;
};

export function SectionChrome({ activeSection }: Props) {
  return (
    <header className="news-header" role="banner">
      <div className="news-topbar">
        <p>Bridge Observer Daily</p>
        <p>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
      <nav className="news-nav" aria-label="Primary">
        <Link href="/" className="brand-mark">
          Bridge Observer
        </Link>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          {navSections.map((section) => {
            const path = `/${slugForSection(section)}`;
            const isActive = section === activeSection;
            return (
              <li key={section}>
                <Link href={`${path}?page=1`} className={isActive ? 'active' : ''} aria-current={isActive ? 'page' : undefined}>
                  {section}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
