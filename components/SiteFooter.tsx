import Link from 'next/link';

type Col = { heading: string; links: { label: string; href: string }[] };

const columns: Col[] = [
  {
    heading: 'News',
    links: [
      { label: 'U.S.', href: '/news?page=1' },
      { label: 'World', href: '/news?page=1' },
      { label: 'Politics', href: '/news?page=1' },
      { label: 'Education', href: '/news?page=1' },
      { label: 'Health', href: '/news?page=1' },
      { label: 'Science', href: '/tech?page=1' },
      { label: 'Climate', href: '/news?page=1' },
      { label: 'Sports', href: '/sports?page=1' },
      { label: 'Business', href: '/business?page=1' },
      { label: 'Tech', href: '/tech?page=1' },
    ],
  },
  {
    heading: 'Opinion',
    links: [
      { label: 'Opinion', href: '/opinion?page=1' },
      { label: 'Editorials', href: '/opinion?page=1' },
      { label: 'Guest Essays', href: '/opinion?page=1' },
      { label: 'Letters', href: '/opinion?page=1' },
      { label: 'Sunday Opinion', href: '/opinion?page=1' },
    ],
  },
  {
    heading: 'Arts & Entertainment',
    links: [
      { label: 'Arts', href: '/entertainment?page=1' },
      { label: 'Books', href: '/entertainment?page=1' },
      { label: 'Movies', href: '/entertainment?page=1' },
      { label: 'Music', href: '/entertainment?page=1' },
      { label: 'Television', href: '/entertainment?page=1' },
      { label: 'Theater', href: '/entertainment?page=1' },
      { label: 'Pop Culture', href: '/entertainment?page=1' },
    ],
  },
  {
    heading: 'Living',
    links: [
      { label: 'Lifestyle', href: '/lifestyle?page=1' },
      { label: 'Food', href: '/lifestyle?page=1' },
      { label: 'Travel', href: '/lifestyle?page=1' },
      { label: 'Style', href: '/lifestyle?page=1' },
      { label: 'Real Estate', href: '/business?page=1' },
      { label: 'Love', href: '/lifestyle?page=1' },
      { label: 'Well', href: '/lifestyle?page=1' },
    ],
  },
  {
    heading: 'Listings & More',
    links: [
      { label: 'Events', href: '/events' },
      { label: 'Classifieds', href: '/advertising' },
      { label: 'Tools & Services', href: '/help' },
      { label: 'Times Insider', href: '/about' },
      { label: 'Photography', href: '/entertainment?page=1' },
      { label: 'Reader Center', href: '/help' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Subscribe', href: '/subscribe' },
      { label: 'Log In', href: '/login' },
      { label: 'Digital Subscriptions', href: '/subscribe' },
      { label: 'Home Delivery', href: '/subscribe' },
      { label: 'Games', href: '/games' },
      { label: 'Cooking', href: '/cooking' },
      { label: 'Wirecutter', href: '/wirecutter' },
      { label: 'Audio', href: '/audio' },
      { label: "Today's Paper", href: '/replica' },
    ],
  },
];

const corporateLinks = [
  { label: 'About', href: '/about' },
  { label: 'Work With Us', href: '/careers' },
  { label: 'Advertise', href: '/advertising' },
  { label: 'Brand Studio', href: '/brand-studio' },
  { label: 'Live Events', href: '/events' },
  { label: 'Learning Network', href: '/education-network' },
  { label: 'Journalism', href: '/about' },
  { label: 'Public Editor', href: '/corrections' },
  { label: 'Video', href: '/video' },
  { label: 'Podcasts', href: '/podcasts' },
  { label: 'Newsletters', href: '/newsletters' },
  { label: 'Gift Articles', href: '/gift' },
  { label: 'Licensing', href: '/licensing' },
  { label: 'Reprints', href: '/reprints' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Terms of Sale', href: '/terms-of-sale' },
  { label: 'Site Map', href: '/sitemap-page' },
  { label: 'Help', href: '/help' },
  { label: 'Subscriptions', href: '/subscribe' },
  { label: 'Accessibility', href: '/accessibility' },
  { label: 'Interest-Based Ads', href: '/advertising' },
  { label: 'Your Ad Choices', href: '/cookies' },
  { label: 'California Notices', href: '/privacy' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Corrections', href: '/corrections' },
  { label: 'Cookie Policy', href: '/cookies' },
];

export function SiteFooter() {
  return (
    <footer id="site-footer" className="site-footer site-footer--professional" role="contentinfo">
      <div className="site-footer__newsletter-band">
        <div className="site-footer__newsletter-inner">
          <div>
            <h2 className="site-footer__newsletter-title">The Morning Briefing</h2>
            <p className="site-footer__newsletter-copy">
              Essential headlines and analysis, delivered weekdays. Placeholder until your ESP is connected.
            </p>
          </div>
          <form className="site-footer__newsletter-form" action="#" method="post">
            <label htmlFor="footer-email-pro" className="sr-only">
              Email address
            </label>
            <input id="footer-email-pro" name="email" type="email" placeholder="Email address" required />
            <button type="submit">Sign up</button>
          </form>
        </div>
      </div>

      <div className="site-footer__mega">
        {columns.map((col) => (
          <nav key={col.heading} className="site-footer__mega-col" aria-label={col.heading}>
            <h3 className="site-footer__mega-heading">{col.heading}</h3>
            <ul className="site-footer__mega-list">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="site-footer__corporate">
        <nav aria-label="Corporate">
          <ul className="site-footer__corporate-list">
            {corporateLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="site-footer__legal-bar">
        <p className="site-footer__copyright">
          © {new Date().getFullYear()} Bridge Observer Daily Company. All rights reserved.
        </p>
        <nav className="site-footer__legal-nav" aria-label="Legal and policies">
          <ul className="site-footer__legal-links">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
