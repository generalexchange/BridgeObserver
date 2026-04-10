'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { PressShell } from '@/components/press/PressShell';
import { RequirePressAuth } from '@/components/press/RequirePressAuth';
import { usePressArticles } from '@/components/press/PressArticlesContext';
import { usePressToast } from '@/components/press/PressToastContext';
import { usePressHref } from '@/lib/press/paths';

export function PressSubmissionsPage() {
  const { articles, setStatus } = usePressArticles();
  const { show } = usePressToast();

  const queue = useMemo(() => articles.filter((a) => a.status === 'submitted'), [articles]);

  const approve = (id: string) => {
    setStatus(id, 'approved');
    show('Approved — article moved to Published.');
  };

  const reject = (id: string) => {
    setStatus(id, 'draft');
    show('Rejected — article returned to Drafts.');
  };

  return (
    <RequirePressAuth>
      <PressShell>
        <div className="press-page">
          <header className="press-page__hero">
            <h1 className="press-page__h1">Submissions</h1>
            <p className="press-page__lede">Editor queue (simulated). Approve to publish or reject to send back to drafts.</p>
          </header>

          <ul className="press-queue">
            {queue.length === 0 ? (
              <li className="press-empty">No stories awaiting review.</li>
            ) : (
              queue.map((a) => (
                <li key={a.id} className="press-queue__row">
                  <div>
                    <p className="press-queue__category">{a.category}</p>
                    <h2 className="press-queue__title">{a.title || 'Untitled'}</h2>
                    <p className="press-queue__meta">
                      {a.author} · {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="press-queue__actions">
                    <EditorLink id={a.id} />
                    <button type="button" className="press-btn press-btn--success" onClick={() => approve(a.id)}>
                      <Check size={18} aria-hidden /> Approve
                    </button>
                    <button type="button" className="press-btn press-btn--danger" onClick={() => reject(a.id)}>
                      <X size={18} aria-hidden /> Reject
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </PressShell>
    </RequirePressAuth>
  );
}

function EditorLink({ id }: { id: string }) {
  const href = usePressHref('/editor', `id=${encodeURIComponent(id)}`);
  return (
    <Link href={href} className="press-btn press-btn--ghost">
      Open
    </Link>
  );
}
