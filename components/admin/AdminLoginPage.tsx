'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAdminHref } from '@/lib/admin/paths';

const KEY = 'bridge_admin_session';

export function AdminLoginPage() {
  const router = useRouter();
  const dashboardHref = useAdminHref('/dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) router.replace(dashboardHref);
    } catch {
      /* ignore */
    }
  }, [router, dashboardHref]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      KEY,
      JSON.stringify({
        email: email.trim() || 'admin@bridgeobserver.com',
        loggedInAt: new Date().toISOString(),
      }),
    );
    router.push(dashboardHref);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">Bridge Observer</p>
        <h1>Administrative Control Center</h1>
        <p>Mission-control operations dashboard. Mock auth accepts any credentials.</p>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" />
          </label>
          <button type="submit">Enter Admin Dashboard</button>
        </form>
      </div>
    </div>
  );
}
