'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useMarketAuth } from '@/components/market/MarketAuthContext';
import { useMarketLoginHref } from '@/lib/market/paths';

export function RequireMarketAuth({ children }: { children: ReactNode }) {
  const { session, ready } = useMarketAuth();
  const router = useRouter();
  const login = useMarketLoginHref();

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace(login);
  }, [ready, session, router, login]);

  if (!ready || !session) {
    return (
      <div className="market-auth-gate" aria-busy="true">
        <p className="market-auth-gate__text">Authenticating session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
