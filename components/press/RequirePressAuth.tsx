'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { usePressAuth } from '@/components/press/PressAuthContext';
import { useLoginHref } from '@/lib/press/paths';

export function RequirePressAuth({ children }: { children: ReactNode }) {
  const { session, ready } = usePressAuth();
  const router = useRouter();
  const login = useLoginHref();

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace(login);
  }, [ready, session, router, login]);

  if (!ready || !session) {
    return (
      <div className="press-auth-gate" aria-busy="true">
        <p className="press-auth-gate__text">Checking session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
