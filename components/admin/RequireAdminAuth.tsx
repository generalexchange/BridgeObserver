'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useAdminLoginHref } from '@/lib/admin/paths';

const KEY = 'bridge_admin_session';

export function RequireAdminAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const loginHref = useAdminLoginHref();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setOk(true);
      else router.replace(loginHref);
    } catch {
      router.replace(loginHref);
    }
  }, [router, loginHref]);

  if (!ok) return <div className="admin-auth-gate">Checking admin session…</div>;
  return <>{children}</>;
}
