'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMarketAuth } from '@/components/market/MarketAuthContext';
import { useMarketHref } from '@/lib/market/paths';

export function MarketLoginPage() {
  const { session, ready, login } = useMarketAuth();
  const router = useRouter();
  const terminal = useMarketHref('/terminal');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!ready) return;
    if (session) router.replace(terminal);
  }, [ready, session, router, terminal]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    router.push(terminal);
  };

  return (
    <div className="market-login">
      <div className="market-login__glow market-login__glow--a" aria-hidden />
      <div className="market-login__glow market-login__glow--b" aria-hidden />
      <div className="market-login__grid" aria-hidden />
      <div className="market-login__card market-login-fade">
        <p className="market-login__eyebrow">Institutional access</p>
        <h1 className="market-login__title">Bridge Observer Market</h1>
        <p className="market-login__lede">Institutional Market Intelligence System. Mock auth accepts any credentials.</p>
        <form className="market-login__form" onSubmit={onSubmit}>
          <label className="market-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@bridgeobserver.com"
            />
          </label>
          <label className="market-field">
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
          <button type="submit" className="market-btn market-btn--primary market-login__submit">
            Enter Terminal
          </button>
        </form>
      </div>
    </div>
  );
}
