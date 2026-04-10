'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Toast = { id: string; message: string; variant?: 'default' | 'alert' };

type Ctx = { show: (message: string, variant?: Toast['variant']) => void };

const MarketToastContext = createContext<Ctx | null>(null);

export function MarketToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, variant: Toast['variant'] = 'default') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((t) => [...t, { id, message, variant }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <MarketToastContext.Provider value={value}>
      {children}
      <div className="market-toast-host" aria-live="assertive">
        {toasts.map((t) => (
          <div key={t.id} className={`market-toast${t.variant === 'alert' ? ' market-toast--alert' : ''}`}>
            {t.message}
          </div>
        ))}
      </div>
    </MarketToastContext.Provider>
  );
}

export function useMarketToast() {
  const ctx = useContext(MarketToastContext);
  if (!ctx) throw new Error('useMarketToast requires provider');
  return ctx;
}
