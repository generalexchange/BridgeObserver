'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import { usePressAuth } from '@/components/press/PressAuthContext';
import { useLoginHref, usePressHref } from '@/lib/press/paths';

export function PressShell({ children }: { children: ReactNode }) {
  const { session, logout } = usePressAuth();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const dash = usePressHref('/dashboard');
  const articles = usePressHref('/articles');
  const editor = usePressHref('/editor');
  const submissions = usePressHref('/submissions');
  const login = useLoginHref();

  const onLogout = () => {
    logout();
    router.push(login);
  };

  return (
    <div className="press-shell">
      <header className="press-shell__header">
        <div className="press-shell__bar">
          <Link href={dash} className="press-shell__logo">
            Bridge Observer
          </Link>
          <span className="press-shell__badge">Press</span>
        </div>
        <nav className="press-nav" aria-label="Press CMS">
          <Link href={dash} className={navClass(pathname, 'dashboard')}>
            Dashboard
          </Link>
          <Link href={articles} className={navClass(pathname, 'articles')}>
            My Articles
          </Link>
          <Link href={editor} className={navClass(pathname, 'editor')}>
            New Article
          </Link>
          <Link href={submissions} className={navClass(pathname, 'submissions')}>
            Submissions
          </Link>
          <button type="button" className="press-nav__logout" onClick={onLogout}>
            <LogOut size={16} aria-hidden />
            Logout
          </button>
        </nav>
        {session ? <p className="press-shell__user">{session.email}</p> : null}
      </header>
      <main className="press-shell__main">{children}</main>
    </div>
  );
}

function navClass(pathname: string, segment: string) {
  const parts = pathname.split('/').filter(Boolean);
  const last = parts[parts.length - 1] ?? '';
  return `press-nav__link${last === segment ? ' is-active' : ''}`;
}
