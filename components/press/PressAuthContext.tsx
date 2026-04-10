'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { PressSession } from '@/lib/press/types';
import { readSession, writeSession } from '@/lib/press/storage';

type Ctx = {
  session: PressSession | null;
  ready: boolean;
  login: (email: string, _password: string) => void;
  logout: () => void;
};

const PressAuthContext = createContext<Ctx | null>(null);

export function PressAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PressSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setReady(true);
  }, []);

  const login = useCallback((email: string, _password: string) => {
    const s: PressSession = {
      email: email.trim() || 'writer@press.local',
      loggedInAt: new Date().toISOString(),
    };
    writeSession(s);
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    writeSession(null);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, ready, login, logout }), [session, ready, login, logout]);

  return <PressAuthContext.Provider value={value}>{children}</PressAuthContext.Provider>;
}

export function usePressAuth() {
  const ctx = useContext(PressAuthContext);
  if (!ctx) throw new Error('usePressAuth requires PressAuthProvider');
  return ctx;
}
