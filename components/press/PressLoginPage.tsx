'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePressAuth } from '@/components/press/PressAuthContext';
import { usePressHref } from '@/lib/press/paths';

export function PressLoginPage() {
  const { session, ready, login } = usePressAuth();
  const router = useRouter();
  const dashboard = usePressHref('/dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!ready) return;
    if (session) router.replace(dashboard);
  }, [ready, session, router, dashboard]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push(dashboard);
  };

  return (
    <div className="press-login">
      <div className="press-login__glow" aria-hidden />
      <div className="press-login__card press-login-fade">
        <p className="press-login__eyebrow">Internal tools</p>
        <h1 className="press-login__title">Bridge Observer Press</h1>
        <p className="press-login__lede">Sign in to the writer dashboard. Mock auth accepts any credentials.</p>
        <form className="press-login__form" onSubmit={onSubmit}>
          <label className="press-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@newsroom.com"
            />
          </label>
          <label className="press-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="press-btn press-btn--primary press-login__submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
