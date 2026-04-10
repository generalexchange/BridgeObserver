'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type Toast = { id: string; message: string };

type Ctx = {
  show: (message: string) => void;
};

const PressToastContext = createContext<Ctx | null>(null);

export function PressToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <PressToastContext.Provider value={value}>
      {children}
      <div className="press-toast-host" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="press-toast">
            {t.message}
          </div>
        ))}
      </div>
    </PressToastContext.Provider>
  );
}

export function usePressToast() {
  const ctx = useContext(PressToastContext);
  if (!ctx) throw new Error('usePressToast requires PressToastProvider');
  return ctx;
}
