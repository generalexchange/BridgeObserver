'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useEditorHref } from '@/lib/editor/paths';

const KEY = 'bridge_editor_session';

export function EditorLoginPage() {
  const router = useRouter();
  const dashboardHref = useEditorHref('/dashboard');
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
        email: email.trim() || 'editor@bridgeobserver.com',
        loggedInAt: new Date().toISOString(),
      }),
    );
    router.push(dashboardHref);
  };

  return (
    <div className="editor-login">
      <div className="editor-login__card">
        <p className="editor-login__eyebrow">Bridge Observer</p>
        <h1>Editor Workbench</h1>
        <p>Operational newsroom intelligence console. Mock auth accepts any credentials.</p>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" />
          </label>
          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" />
          </label>
          <button type="submit">Enter Editor Dashboard</button>
        </form>
      </div>
    </div>
  );
}
