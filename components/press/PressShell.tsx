'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, FolderOpen, Inbox, LayoutDashboard, LogOut, Newspaper, PenLine } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePressAuth } from '@/components/press/PressAuthContext';
import { usePressFiles } from '@/components/press/PressFilesContext';
import { useLoginHref, usePressHref } from '@/lib/press/paths';

export function PressShell({ children }: { children: ReactNode }) {
  const { session, logout } = usePressAuth();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const dash = usePressHref('/dashboard');
  const editor = usePressHref('/editor');
  const submissions = usePressHref('/submissions');
  const login = useLoginHref();
  const filesHref = usePressHref('/articles');
  const { notifications, markAllRead, markNotificationRead } = usePressFiles();
  const [now, setNow] = useState(() => new Date());
  const [mailOpen, setMailOpen] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const onLogout = () => {
    logout();
    router.push(login);
  };

  const timeStr = now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return (
    <div className="press-shell">
      <div className="press-shell__mast" aria-hidden="true">
        <span className="press-shell__mast-line" />
        <span className="press-shell__mast-label">Bridge Observer Press Desk</span>
        <span className="press-shell__mast-line" />
      </div>
      <header className="press-shell__header">
        <div className="press-shell__bar">
          <Link href={dash} className="press-shell__logo">
            <Newspaper size={22} strokeWidth={2} aria-hidden className="press-shell__logo-icon" />
            Bridge Observer
          </Link>
          <span className="press-shell__badge">Press</span>
          <span className="press-shell__clock" title="Local desk time">
            <time dateTime={now.toISOString()}>{timeStr}</time>
          </span>
        </div>
        <nav className="press-nav" aria-label="Press CMS">
          <Link href={dash} className={navClass(pathname, 'dashboard')}>
            <LayoutDashboard size={16} strokeWidth={2} aria-hidden className="press-nav__icon" />
            Dashboard
          </Link>
          <Link href={filesHref} className={navClass(pathname, 'articles')}>
            <FolderOpen size={16} strokeWidth={2} aria-hidden className="press-nav__icon" />
            Files
          </Link>
          <Link href={editor} className={navClass(pathname, 'editor')}>
            <PenLine size={16} strokeWidth={2} aria-hidden className="press-nav__icon" />
            New Article
          </Link>
          <Link href={submissions} className={navClass(pathname, 'submissions')}>
            <Inbox size={16} strokeWidth={2} aria-hidden className="press-nav__icon" />
            Submissions
          </Link>
          <div className="press-nav__mail">
            <button
              type="button"
              className={`press-nav__mail-btn${mailOpen ? ' is-open' : ''}`}
              onClick={() => setMailOpen((v) => !v)}
              aria-expanded={mailOpen}
              aria-label="Mailbox notifications"
            >
              <Bell size={16} aria-hidden />
              <span>Mailbox</span>
              {unread > 0 ? <em className="press-nav__mail-badge">{unread}</em> : null}
            </button>
            {mailOpen ? (
              <div className="press-nav__mail-panel" role="dialog" aria-label="Notifications">
                <div className="press-nav__mail-head">
                  <strong>Notifications</strong>
                  <button type="button" onClick={markAllRead}>
                    Mark all read
                  </button>
                </div>
                <ul>
                  {notifications.slice(0, 10).map((n) => (
                    <li key={n.id} className={n.read ? '' : 'is-unread'}>
                      <button
                        type="button"
                        onClick={() => {
                          markNotificationRead(n.id);
                          setMailOpen(false);
                          if (n.fileId) router.push(`${filesHref}?fileId=${encodeURIComponent(n.fileId)}`);
                        }}
                      >
                        <p>{n.message}</p>
                        <time dateTime={n.timestamp}>{new Date(n.timestamp).toLocaleString()}</time>
                      </button>
                    </li>
                  ))}
                  {notifications.length === 0 ? <li className="press-nav__mail-empty">No notifications yet.</li> : null}
                </ul>
              </div>
            ) : null}
          </div>
          <button type="button" className="press-nav__logout" onClick={onLogout}>
            <LogOut size={16} aria-hidden />
            Logout
          </button>
        </nav>
        {session ? <p className="press-shell__user">Signed in as {session.email}</p> : null}
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
