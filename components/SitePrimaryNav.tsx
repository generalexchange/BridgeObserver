'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { HeaderSearch } from '@/components/HeaderSearch';

export type PrimaryNavItem = {
  key: string;
  href: string;
  label: string;
  active?: boolean;
  prefetch?: boolean;
};

type Props = {
  searchFormId: string;
  items: PrimaryNavItem[];
  navLabel?: string;
};

export function SitePrimaryNav({ searchFormId, items, navLabel = 'Primary' }: Props) {
  const [open, setOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const prevOpenRef = useRef(false);
  const panelId = useId().replace(/:/g, '');

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 861px)');
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (prevOpenRef.current && !open) {
      menuBtnRef.current?.focus();
    }
    prevOpenRef.current = open;
  }, [open]);

  return (
    <>
      <nav className="news-nav news-nav--with-search news-nav--responsive" aria-label={navLabel}>
        <button
          ref={menuBtnRef}
          type="button"
          className="news-nav__menu-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} strokeWidth={2} aria-hidden /> : <Menu size={22} strokeWidth={2} aria-hidden />}
        </button>
        <Link href="/" className="brand-mark">
          Bridge Observer
        </Link>
        <HeaderSearch formId={searchFormId} />
        <ul className="news-nav__desktop-links">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className={item.active ? 'active' : ''}
                aria-current={item.active ? 'page' : undefined}
                prefetch={item.prefetch === false ? false : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {open ? (
        <div className="news-drawer-root" role="dialog" aria-modal="true" aria-labelledby={`${panelId}-title`} id={panelId}>
          <button type="button" className="news-drawer-backdrop" aria-label="Close menu" onClick={close} />
          <div className="news-drawer-panel">
            <div className="news-drawer-header">
              <span id={`${panelId}-title`} className="news-drawer-title">
                Sections
              </span>
              <button type="button" className="news-drawer-close" aria-label="Close menu" onClick={close}>
                <X size={22} strokeWidth={2} aria-hidden />
              </button>
            </div>
            <ul className="news-drawer-list">
              {items.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={item.active ? 'is-active' : ''}
                    aria-current={item.active ? 'page' : undefined}
                    prefetch={item.prefetch === false ? false : undefined}
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
