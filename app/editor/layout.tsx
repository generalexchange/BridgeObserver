import type { Metadata } from 'next';
import './editor-globals.css';

export const metadata: Metadata = {
  title: 'Bridge Observer Editor Workbench',
  description: 'Real-time editorial intelligence command center.',
  robots: { index: false, follow: false },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <div className="editor-app">{children}</div>;
}
