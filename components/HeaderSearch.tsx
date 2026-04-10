'use client';

import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { Search } from 'lucide-react';

type Props = {
  /** Unique id for label association when multiple instances exist */
  formId?: string;
};

export function HeaderSearch({ formId }: Props) {
  const reactId = useId();
  const inputId = formId ?? `header-search-${reactId}`;
  const [q, setQ] = useState('');
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (!t) return;
    router.push(`/search?q=${encodeURIComponent(t)}`);
  }

  return (
    <form className="header-search" onSubmit={onSubmit} role="search">
      <label htmlFor={inputId} className="sr-only">
        Search articles
      </label>
      <div className="header-search__wrap">
        <Search className="header-search__icon" size={18} aria-hidden />
        <input
          id={inputId}
          name="q"
          type="search"
          enterKeyHint="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          autoComplete="off"
          className="header-search__input"
        />
        <button type="submit" className="header-search__submit">
          Search
        </button>
      </div>
    </form>
  );
}
