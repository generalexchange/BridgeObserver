import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer id="site-footer" className="site-footer" role="contentinfo">
      <div className="site-footer__grid">
        <section className="site-footer__col" aria-labelledby="footer-nav-heading">
          <h2 id="footer-nav-heading" className="site-footer__heading">
            Navigation
          </h2>
          <nav aria-label="Footer">
            <ul className="site-footer__links">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
              <li>
                <Link href="/sitemap-page">Sitemap</Link>
              </li>
            </ul>
          </nav>
        </section>

        <section className="site-footer__col" aria-labelledby="footer-sections-heading">
          <h2 id="footer-sections-heading" className="site-footer__heading">
            Sections
          </h2>
          <ul className="site-footer__links">
            <li>
              <Link href="/news">News</Link>
            </li>
            <li>
              <Link href="/sports">Sports</Link>
            </li>
            <li>
              <Link href="/business">Business</Link>
            </li>
            <li>
              <Link href="/entertainment">Entertainment</Link>
            </li>
            <li>
              <Link href="/lifestyle">Lifestyle</Link>
            </li>
            <li>
              <Link href="/tech">Tech</Link>
            </li>
            <li>
              <Link href="/opinion">Opinion</Link>
            </li>
          </ul>
        </section>

        <section className="site-footer__col site-footer__newsletter" aria-labelledby="footer-newsletter-heading">
          <h2 id="footer-newsletter-heading" className="site-footer__heading">
            Newsletter
          </h2>
          <p className="site-footer__muted">Get headlines delivered. Placeholder form until ESP is wired.</p>
          <form className="site-footer__form" action="#" method="post">
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email for newsletter
            </label>
            <input
              id="footer-newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              required
            />
            <button type="submit">Sign up</button>
          </form>
        </section>
      </div>
      <p className="site-footer__legal">
        © {new Date().getFullYear()} Bridge Observer Daily. Placeholder footer for production deployment.
      </p>
    </footer>
  );
}
