import { SitePrimaryNav } from '@/components/SitePrimaryNav';
import { navSections, type NewsSection } from '@/data/newsSiteData';
import { slugForSection } from '@/lib/catalog';

type Props = {
  activeSection: NewsSection;
};

export function SectionChrome({ activeSection }: Props) {
  const items = [
    { key: 'home', href: '/', label: 'Home' },
    ...navSections.map((section) => {
      const path = `/${slugForSection(section)}`;
      const isActive = section === activeSection;
      return {
        key: section,
        href: `${path}?page=1`,
        label: section,
        active: isActive,
        prefetch: false as boolean,
      };
    }),
  ];

  return (
    <header className="news-header" role="banner">
      <div className="news-topbar">
        <p>Bridge Observer Daily</p>
        <p>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
      <SitePrimaryNav searchFormId="section-header-search" items={items} />
    </header>
  );
}
