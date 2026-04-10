'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useEditorLoginHref } from '@/lib/editor/paths';

const KEY = 'bridge_editor_session';

export function RequireEditorAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const loginHref = useEditorLoginHref();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setOk(true);
      } else {
        router.replace(loginHref);
      }
    } catch {
      router.replace(loginHref);
    }
  }, [router, loginHref]);

  if (!ok) {
    return <div className="editor-auth-gate">Checking editor session…</div>;
  }
  return <>{children}</>;
}
