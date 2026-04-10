'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { MarketSession } from '@/lib/market/types';
import { readMarketSession, writeMarketSession } from '@/lib/market/storage';

type Ctx = {
  session: MarketSession | null;
  ready: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const MarketAuthContext = createContext<Ctx | null>(null);

export function MarketAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MarketSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readMarketSession());
    setReady(true);
  }, []);

  const login = useCallback((email: string, _password: string) => {
    const s: MarketSession = {
      email: email.trim() || 'analyst@bridgeobserver.com',
      loggedInAt: new Date().toISOString(),
    };
    writeMarketSession(s);
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    writeMarketSession(null);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, ready, login, logout }), [session, ready, login, logout]);

  return <MarketAuthContext.Provider value={value}>{children}</MarketAuthContext.Provider>;
}

export function useMarketAuth() {
  const ctx = useContext(MarketAuthContext);
  if (!ctx) throw new Error('useMarketAuth requires provider');
  return ctx;
}
